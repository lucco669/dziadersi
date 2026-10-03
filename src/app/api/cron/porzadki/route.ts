import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return new Response(null, { status: 401 });
  if (!hasAdmin) return new Response(null, { status: 503 });
  const db = createAdminClient();
  const results = await Promise.all([
    db.from("family_groups").delete().lte("expires_at", new Date().toISOString()),
    db.from("write_budgets").delete().lt("window_start", new Date(Date.now() - 86400000).toISOString()),
  ]);
  return new Response(null, { status: results.some(({ error }) => error) ? 503 : 204 });
}
