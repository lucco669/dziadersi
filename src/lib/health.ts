import type { createAdminClient } from "./supabase/admin";

/*
 * Is the write loop alive? Every write that passes the origin check takes a write budget
 * (write_budgets, one row per network hash and ten minutes), so the budgets count the attempts
 * that reached the server and the tables count what landed. Attempts without rows mean the
 * path between the API and the database is broken; no attempts at all mean nobody tried, or the
 * browser never got as far as the API. The daily cleanup logs this, and /api/cron/zdrowie
 * answers 503 when it is broken, so a monitor or the timer's journal notices.
 */

type Admin = ReturnType<typeof createAdminClient>;

export type WriteCounts = {
  /** Budget hits per scope in the last 24 hours: requests that reached the API and passed the origin check. */
  attempts: Record<string, number>;
  /** Census rows in the last 24 hours. */
  results: number;
  /** Tallies counted today and yesterday (Warsaw days). */
  tallies: number;
};

export type WriteHealth = WriteCounts & {
  status: "ok" | "quiet" | "broken";
  problems: string[];
  lastResult: string | null;
  checkedAt: string;
};

/** Enough attempts that a few junk requests (which also take a budget) never raise the alarm. */
const MIN_RESULTS = 5;
const MIN_TALLIES = 10;

/** Pure, for tests: what the counts say. */
export function judgeWrites({ attempts, results, tallies }: WriteCounts): Pick<WriteHealth, "status" | "problems"> {
  const problems: string[] = [];
  if ((attempts.results ?? 0) >= MIN_RESULTS && results === 0) {
    problems.push(`results: ${attempts.results} attempts reached /api/wyniki in 24 h, 0 rows in public.results`);
  }
  if ((attempts.tallies ?? 0) >= MIN_TALLIES && tallies === 0) {
    problems.push(`tallies: ${attempts.tallies} attempts reached /api/licznik in 24 h, 0 counted`);
  }
  const total = Object.values(attempts).reduce((sum, n) => sum + n, 0);
  return { status: problems.length ? "broken" : total === 0 && results === 0 ? "quiet" : "ok", problems };
}

const warsawDay = (date: Date) => date.toLocaleDateString("en-CA", { timeZone: "Europe/Warsaw" });

export async function checkWrites(admin: Admin, now = new Date()): Promise<WriteHealth> {
  const since = new Date(now.getTime() - 86_400_000).toISOString();
  const [budgets, results, last, tallies] = await Promise.all([
    admin.from("write_budgets").select("scope, hits").gte("window_start", since),
    admin.from("results").select("id", { count: "exact", head: true }).gte("created_at", since),
    admin.from("results").select("created_at").order("created_at", { ascending: false }).limit(1),
    admin.from("tallies").select("n").gte("day", warsawDay(new Date(now.getTime() - 86_400_000))),
  ]);
  const failed = [budgets, results, last, tallies].find(({ error }) => error)?.error;
  if (failed) {
    return { attempts: {}, results: 0, tallies: 0, status: "broken", problems: [`database: ${failed.message}`], lastResult: null, checkedAt: now.toISOString() };
  }
  const attempts: Record<string, number> = {};
  for (const row of (budgets.data ?? []) as { scope: string; hits: number }[]) attempts[row.scope] = (attempts[row.scope] ?? 0) + row.hits;
  const counts: WriteCounts = {
    attempts,
    results: results.count ?? 0,
    tallies: ((tallies.data ?? []) as { n: number | string }[]).reduce((sum, row) => sum + Number(row.n), 0),
  };
  return {
    ...counts,
    ...judgeWrites(counts),
    lastResult: (last.data?.[0] as { created_at: string } | undefined)?.created_at ?? null,
    checkedAt: now.toISOString(),
  };
}
