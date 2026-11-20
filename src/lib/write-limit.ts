import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient, hasAdmin } from "./supabase/admin";
import { checkWriteRequest } from "./write-policy";

type Scope = "results" | "verdicts" | "words" | "tallies" | "family-create" | "family-join" | "team-create" | "team-join" | "sign-in" | "auth-mail" | "newsletter" | "newsletter-all";
/** Per network address and ten-minute window. */
const LIMITS: Record<Scope, number> = {
  results: 30,
  verdicts: 60,
  // Słowo Roku: one vote per browser, so a household behind one address needs a few, not dozens.
  words: 20,
  tallies: 240,
  "family-create": 10,
  "family-join": 30,
  "team-create": 10,
  // A whole office may sit behind one address: fifty people joining one team, twice over.
  "team-join": 100,
  // Supabase sees our servers, not the reader, so its own per-address limits can't tell callers apart.
  "sign-in": 30,
  "auth-mail": 10,
  // Bulletin sign-ups without an account: each may send a confirm letter, so few per address,
  // and a cap for everyone together (limitShared) so a botnet can't run up the Brevo bill.
  newsletter: 5,
  "newsletter-all": 60,
};

/**
 * The caller's address. In production the site is reachable only through Cloudflare (a tunnel
 * to the home server, no open port), and Cloudflare overwrites cf-connecting-ip on every
 * request, so it can't be forged. On Vercel the same holds for x-vercel-forwarded-for. Never
 * trust a caller-provided forwarding header elsewhere.
 */
export function networkKey(requestHeaders: Pick<Headers, "get">, scope: Scope) {
  const cloudflare = requestHeaders.get("cf-connecting-ip")?.trim();
  const address = cloudflare
    || (process.env.VERCEL === "1"
      ? requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
      : "local");
  return budgetKey(scope, address);
}

function budgetKey(scope: Scope, address: string) {
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", process.env.SUPABASE_SECRET_KEY || "local-development")
    .update(`${scope}:${day}:${address}`).digest("hex");
}

type Budget = "ok" | "spent" | "unavailable";

/** Atomic, shared between instances. */
async function takeBudget(requestHeaders: Pick<Headers, "get">, scope: Scope): Promise<Budget> {
  return take(scope, networkKey(requestHeaders, scope));
}

async function take(scope: Scope, key: string): Promise<Budget> {
  if (!hasAdmin) return "unavailable";
  try {
    const { data, error } = await createAdminClient().rpc("take_write_budget", {
      p_scope: scope, p_key: key, p_limit: LIMITS[scope],
    });
    if (error) return "unavailable";
    return data === true ? "ok" : "spent";
  } catch {
    return "unavailable";
  }
}

/** Route handlers: fail closed when the required migration is missing. */
export async function limitWrite(request: Request, scope: Scope): Promise<Response | null> {
  const rejected = checkWriteRequest(request);
  if (rejected) return rejected;
  const budget = await takeBudget(request.headers, scope);
  if (budget === "ok") return null;
  return budget === "spent"
    ? new Response(null, { status: 429, headers: { "Retry-After": "600" } })
    : new Response(null, { status: 503, headers: { "Retry-After": "60" } });
}

/** Server Actions (Next checks their origin itself): true when the caller may go on. Fails closed, like limitWrite. */
export async function limitAction(scope: Scope): Promise<boolean> {
  return (await takeBudget(await headers(), scope)) === "ok";
}

/** One budget shared by every caller: true when the scope may go on. Fails closed. */
export async function limitShared(scope: Scope): Promise<boolean> {
  return (await take(scope, budgetKey(scope, "everyone"))) === "ok";
}
