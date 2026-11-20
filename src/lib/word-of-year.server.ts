import "server-only";
import { cacheLife } from "next/cache";
import { WORD_OF_YEAR } from "@/content/word-of-year";
import { createAdminClient, hasAdmin } from "./supabase/admin";
import { decide, phaseAt, totalOf, wordClock, type WordPhase, type WordResult, type WordTally } from "./word-of-year";

/**
 * Votes per phrase, straight from the database. Null without Supabase or before the migration.
 * IBD_SIMULATED_WORD_TALLY (JSON, slug → votes) stands in for the ballot box in local checks.
 */
export async function readWordTally(): Promise<WordTally | null> {
  const simulated = process.env.IBD_SIMULATED_WORD_TALLY;
  if (simulated) {
    try {
      return JSON.parse(simulated) as WordTally;
    } catch {
      return null;
    }
  }
  if (!hasAdmin) return null;
  const { data, error } = await createAdminClient().rpc("word_tally", { p_year: WORD_OF_YEAR.year });
  if (error) {
    console.error("Słowo Roku:", error.message);
    return null;
  }
  return Object.fromEntries((data as { phrase: string; n: number }[]).map((row) => [row.phrase, Number(row.n)]));
}

export type WordState = {
  phase: WordPhase;
  /** Votes so far; null when the ballot box could not be read. */
  total: number | null;
  /**
   * Votes per phrase, only when they may be published: from the threshold while voting, never while
   * the Komisja counts, and after the announcement only when the votes decided.
   */
  tally: WordTally | null;
  /** From the announcement on. */
  result: WordResult | null;
  /** True in December, Warsaw time: the home page carries the vote. */
  season: boolean;
};

/**
 * The state of the vote for pages. Cached like the counts elsewhere (a quarter of an hour), so a
 * phase can change up to that much later on the pages; the API checks the clock itself.
 */
export async function getWordState(): Promise<WordState> {
  "use cache";
  cacheLife("counts");
  const now = wordClock();
  const phase = phaseAt(now);
  const season = new Intl.DateTimeFormat("en", { timeZone: "Europe/Warsaw", month: "numeric", year: "numeric" }).format(now) === `12/${WORD_OF_YEAR.year}`;
  if (phase === "upcoming") return { phase, total: null, tally: null, result: null, season };
  const tally = await readWordTally();
  const total = tally ? totalOf(tally) : null;
  if (phase === "announced") {
    // The split is published when the votes decided; below the quorum only the total is.
    const result = decide(tally);
    const decisive = result.decision === "votes" || result.decision === "tie";
    return { phase, total, tally: decisive ? tally : null, result, season };
  }
  const published = phase === "voting" && total !== null && total >= WORD_OF_YEAR.standingsFrom;
  return { phase, total, tally: published ? tally : null, result: null, season };
}
