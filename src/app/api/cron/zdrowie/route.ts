import { isCron } from "@/lib/cron";
import { checkWrites } from "@/lib/health";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";

/**
 * Is the census still filling up? Attempts against stored rows over the last 24 hours
 * (src/lib/health.ts). 200 for "ok" and "quiet" (nobody tried), 503 for "broken", so an uptime
 * monitor or `curl --fail` can watch it. Behind CRON_SECRET: the counts are nobody else's business.
 */
export async function GET(request: Request) {
  if (!isCron(request)) return new Response(null, { status: 401 });
  if (!hasAdmin) return Response.json({ status: "broken", problems: ["SUPABASE_SECRET_KEY or NEXT_PUBLIC_SUPABASE_URL missing"] }, { status: 503 });
  const health = await checkWrites(createAdminClient());
  return Response.json(health, { status: health.status === "broken" ? 503 : 200, headers: { "Cache-Control": "no-store" } });
}
