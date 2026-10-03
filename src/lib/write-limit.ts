import "server-only";
import { createHmac } from "node:crypto";
import { createAdminClient, hasAdmin } from "./supabase/admin";
import { checkWriteRequest } from "./write-policy";

type Scope = "results" | "verdicts" | "tallies" | "family-create" | "family-join";
const LIMITS: Record<Scope, number> = { results: 30, verdicts: 60, tallies: 240, "family-create": 10, "family-join": 30 };

/** Vercel overwrites this header. Never trust a caller-provided forwarding header elsewhere. */
export function networkKey(request: Request, scope: Scope) {
  const address = process.env.VERCEL === "1"
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    : "local";
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", process.env.SUPABASE_SECRET_KEY || "local-development")
    .update(`${scope}:${day}:${address}`).digest("hex");
}

/** Atomic, shared between instances; fail closed when the required migration is missing. */
export async function limitWrite(request: Request, scope: Scope): Promise<Response | null> {
  const rejected = checkWriteRequest(request);
  if (rejected) return rejected;
  if (!hasAdmin) return new Response(null, { status: 503 });
  try {
    const { data, error } = await createAdminClient().rpc("take_write_budget", {
      p_scope: scope, p_key: networkKey(request, scope), p_limit: LIMITS[scope],
    });
    if (error) return new Response(null, { status: 503, headers: { "Retry-After": "60" } });
    return data === true ? null : new Response(null, { status: 429, headers: { "Retry-After": "600" } });
  } catch {
    return new Response(null, { status: 503, headers: { "Retry-After": "60" } });
  }
}
