import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient, hasAdmin } from "./supabase/admin";
import { checkWriteRequest } from "./write-policy";

type Scope = "results" | "verdicts" | "tallies" | "family-create" | "family-join" | "sign-in" | "auth-mail";
/** Per network address and ten-minute window. */
const LIMITS: Record<Scope, number> = {
  results: 30,
  verdicts: 60,
  tallies: 240,
  "family-create": 10,
  "family-join": 30,
  // Supabase sees our servers, not the reader, so its own per-address limits can't tell callers apart.
  "sign-in": 30,
  "auth-mail": 10,
};

/** Vercel overwrites this header. Never trust a caller-provided forwarding header elsewhere. */
export function networkKey(requestHeaders: Pick<Headers, "get">, scope: Scope) {
  const address = process.env.VERCEL === "1"
    ? requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "local";
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", process.env.SUPABASE_SECRET_KEY || "local-development")
    .update(`${scope}:${day}:${address}`).digest("hex");
}

type Budget = "ok" | "spent" | "unavailable";

/** Atomic, shared between instances. */
async function takeBudget(requestHeaders: Pick<Headers, "get">, scope: Scope): Promise<Budget> {
  if (!hasAdmin) return "unavailable";
  try {
    const { data, error } = await createAdminClient().rpc("take_write_budget", {
      p_scope: scope, p_key: networkKey(requestHeaders, scope), p_limit: LIMITS[scope],
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
