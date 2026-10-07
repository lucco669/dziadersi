import { cacheLife } from "next/cache";
import { warsawDate } from "./calendar";
import type { Freshness } from "./community";
import { createAdminClient, hasAdmin } from "./supabase/admin";

/*
 * Narodowy Spis Dziadersów: aggregates over the anonymous results, read with the secret key
 * and cached for a few minutes, so a busy evening costs the database a handful of queries.
 * Every reader returns null when Supabase is not configured or the tables are not there yet.
 */

export type Census = {
  total: number;
  today: number;
  average: number;
  proxy: number;
  unspecified: number;
  hybrid: number;
  retakes: number;
  retakeChange: number | null;
  /** Results per score zone, "0"–"3". */
  zones: Record<string, number>;
  /** Diagnoses per species key, hybrids counted for both parents. */
  species: Record<string, number>;
  hybrids: { pair: string; n: number }[];
  /** isodow 1–7 (Monday first) × hour 0–23, Warsaw time. */
  hours: { dow: number; hour: number; n: number; average: number }[];
  regions: Record<string, { n: number; average: number }>;
  /** The day the figures were read, Warsaw, YYYY-MM-DD. */
  updated: string;
};

/** task → answer value → how many gave it. */
export type AnswerCounts = Record<string, Record<string, number>>;

export async function getCensus(): Promise<Census | null> {
  "use cache";
  cacheLife("minutes");
  if (!hasAdmin) return null;
  const { data, error } = await createAdminClient().rpc("census_summary");
  if (error) {
    console.error("Spis:", error.message);
    return null;
  }
  return { ...(data as Omit<Census, "updated">), updated: warsawDate(new Date()) };
}

export async function getAnswerCounts(freshness: Freshness = "live"): Promise<AnswerCounts | null> {
  "use cache";
  if (freshness === "live") cacheLife("minutes");
  else cacheLife("counts");
  if (!hasAdmin) return null;
  const { data, error } = await createAdminClient().rpc("answer_counts");
  if (error) {
    console.error("Spis:", error.message);
    return null;
  }
  const counts: AnswerCounts = {};
  for (const row of data as { task: number; value: number; n: number }[]) {
    (counts[row.task] ??= {})[row.value] = Number(row.n);
  }
  return counts;
}

/** How many results have each score, 0–100. Only the result pages read it, for a percentile. */
export async function getScoreHistogram(): Promise<number[] | null> {
  "use cache";
  cacheLife("counts");
  if (!hasAdmin) return null;
  const { data, error } = await createAdminClient().rpc("score_histogram");
  if (error) {
    console.error("Spis:", error.message);
    return null;
  }
  const histogram = Array.from({ length: 101 }, () => 0);
  for (const row of data as { score: number; n: number }[]) histogram[row.score] = Number(row.n);
  return histogram;
}

/** Below this many results the Institute keeps the numbers to itself: they would only mislead. */
export const MIN_RESULTS = 30;

/** The share of results below a score, once there are enough of them. */
export function realPercentile(histogram: number[] | null, score: number) {
  if (!histogram) return null;
  const total = histogram.reduce((sum, n) => sum + n, 0);
  if (total < MIN_RESULTS) return null;
  const below = histogram.slice(0, score).reduce((sum, n) => sum + n, 0);
  return { percentile: Math.min(99, Math.max(1, Math.round((below / total) * 100))), total };
}
