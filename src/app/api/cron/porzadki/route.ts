import { isCron } from "@/lib/cron";
import { checkWrites } from "@/lib/health";
import { GUEST_PENDING_DAYS } from "@/lib/newsletter";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";

/**
 * Daily cleanup (deploy/: 03:00 Europe/Warsaw): expired family rankings and office teams (one table)
 * with their members, write
 * budgets older than a day, and bulletin addresses nobody confirmed within GUEST_PENDING_DAYS.
 * It also logs whether the write loop is alive (src/lib/health.ts), so the timer's journal shows
 * a broken census the next morning. 503 only when the cleanup itself failed.
 */
export async function GET(request: Request) {
  if (!isCron(request)) return new Response(null, { status: 401 });
  if (!hasAdmin) return new Response(null, { status: 503 });
  const db = createAdminClient();
  // Before the budgets are pruned: they are the attempts of the last 24 hours.
  const health = await checkWrites(db);
  const now = Date.now();
  const [groups, budgets, guests] = await Promise.all([
    db.from("family_groups").delete().lte("expires_at", new Date(now).toISOString()),
    db.from("write_budgets").delete().lt("window_start", new Date(now - 86_400_000).toISOString()),
    db.from("newsletter_guests").delete({ count: "exact" }).is("confirmed_at", null).lt("created_at", new Date(now - GUEST_PENDING_DAYS * 86_400_000).toISOString()),
  ]);
  const failed = [groups, budgets].some(({ error }) => error);
  const report = {
    cleaned: !failed,
    // Missing until the guest-bulletin migration runs; the rest of the cleanup doesn't depend on it.
    unconfirmedGuests: guests.error ? `skipped: ${guests.error.message}` : guests.count ?? 0,
    health,
  };
  (health.status === "broken" ? console.error : console.log)("Porządki:", JSON.stringify(report));
  return Response.json(report, { status: failed ? 503 : 200 });
}
