import { cacheLife } from "next/cache";
import type { Verdict } from "@/content/cases";
import { createAdminClient, hasAdmin } from "./supabase/admin";

/*
 * Everything visitors do together: field observations, verdicts of the Komisja Orzekająca,
 * bookmarks and the anonymous tallies of the Mały Rocznik Statystyczny. Read with the secret key
 * in one call and cached for a few minutes, like the census. Null until Supabase and the
 * community migration are in place.
 */

export type VerdictCounts = Partial<Record<Verdict, number>>;

export type Community = {
  accounts: number;
  sightings: {
    total: number;
    observers: number;
    today: number;
    /** Sightings per species key. */
    species: Record<string, number>;
    /** Sightings per voivodeship code. */
    regions: Record<string, number>;
    /** Sightings per species in the last seven days. */
    week: Record<string, number>;
    /** Sightings per hour of the day, Warsaw time. */
    hours: Record<string, number>;
    latest: { species: string; region: string | null; at: string }[];
  };
  verdicts: { total: number; jurors: number; cases: Record<string, VerdictCounts> };
  /** Bookmarks per kind: rozmowki, bingo, egzamin. */
  saved: Record<string, number>;
  submissions: number;
  /** All-time totals per tally kind. */
  tallies: Record<string, number>;
  talliesToday: Record<string, number>;
  updated: string;
};

export async function getCommunity(): Promise<Community | null> {
  "use cache";
  cacheLife("minutes");
  if (!hasAdmin) return null;
  const { data, error } = await createAdminClient().rpc("community_summary");
  if (error) {
    console.error("Społeczność:", error.message);
    return null;
  }
  return { ...(data as Omit<Community, "updated">), updated: new Date().toISOString() };
}

/** Fresh counts for one case, straight after a vote. */
export async function caseTally(slug: string): Promise<VerdictCounts | null> {
  if (!hasAdmin) return null;
  const { data, error } = await createAdminClient().rpc("case_tally", { slug });
  if (error) {
    console.error("Komisja:", error.message);
    return null;
  }
  return Object.fromEntries((data as { verdict: Verdict; n: number }[]).map((row) => [row.verdict, Number(row.n)]));
}

/*
 * Tallies: what the yearbook counts. Kinds outside this list are refused by the API,
 * so a curious visitor can't invent new rows.
 */
export const TALLY_KINDS = [
  "rozmowki",
  "rozmowki-glos",
  "bingo-karta",
  "bingo-pole",
  "bingo",
  "egzamin",
  "klakson",
  "certyfikat",
  "udostepnienie",
] as const;

export type TallyKind = (typeof TALLY_KINDS)[number];

export const isTallyKind = (value: unknown): value is TallyKind =>
  typeof value === "string" && (TALLY_KINDS as readonly string[]).includes(value);

export async function addTally(kind: TallyKind, amount = 1) {
  if (!hasAdmin) return;
  const { error } = await createAdminClient().rpc("tally", { what: kind, amount });
  if (error) console.error("Rocznik:", error.message);
}
