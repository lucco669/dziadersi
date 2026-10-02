import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Verdict } from "@/content/cases";
import { SPECIES, type SpeciesKey } from "@/content/species";
import { decodeExam, evaluateExam, type ExamResult } from "./exam";
import { decodeResult, DIAGNOSABLE, evaluate, type Result } from "./test";

/*
 * The Profil Dziaderski is computed from what the account saved: results, observations,
 * bookmarks and verdicts. Badges and the species collection are never stored, so they can't
 * drift from the records themselves.
 */

export type BookmarkKind = "rozmowki" | "bingo" | "egzamin";
export const BOOKMARK_KINDS: BookmarkKind[] = ["rozmowki", "bingo", "egzamin"];

export type Badge = { key: string; name: string; hint: string; earned: boolean };

export type Sighting = { species: SpeciesKey; region: string | null; observedOn: string };

export type Records = {
  nickname: string;
  results: { code: string; saved_at: string }[];
  sightings: { species: string; region: string | null; observed_on: string }[];
  items: { kind: string; code: string; saved_at: string }[];
  verdicts: { case_slug: string; verdict: string }[];
  submissions: { body: string; status: string; created_at: string }[];
};

/** Everything the account owns, read as the visitor (row-level security applies). Missing tables read as empty. */
export async function loadRecords(supabase: SupabaseClient, user: User): Promise<Records> {
  const [profile, results, sightings, items, verdicts, submissions] = await Promise.all([
    supabase.from("profiles").select("nickname").eq("id", user.id).maybeSingle(),
    supabase.from("saved_results").select("code, saved_at").order("saved_at", { ascending: false }),
    supabase.from("sightings").select("species, region, observed_on").order("created_at", { ascending: false }),
    supabase.from("saved_items").select("kind, code, saved_at").order("saved_at", { ascending: false }),
    supabase.from("verdicts").select("case_slug, verdict").eq("user_id", user.id),
    supabase.from("case_submissions").select("body, status, created_at").order("created_at", { ascending: false }),
  ]);
  return {
    nickname: profile.data?.nickname ?? "",
    results: results.data ?? [],
    sightings: sightings.data ?? [],
    items: items.data ?? [],
    verdicts: verdicts.data ?? [],
    submissions: submissions.data ?? [],
  };
}

const SPECIES_KEYS = new Set<string>(SPECIES.map((species) => species.key));

export type Profile = {
  nickname: string;
  results: (Result & { savedAt: string })[];
  collected: Set<SpeciesKey>;
  average: number | null;
  sightings: Sighting[];
  /** Species observed at least once, with the count and the first date. */
  observed: Map<SpeciesKey, { count: number; first: string }>;
  bookmarks: Record<BookmarkKind, { code: string; savedAt: string }[]>;
  exams: (ExamResult & { savedAt: string })[];
  verdicts: Record<string, Verdict>;
  submissions: Records["submissions"];
  badges: Badge[];
};

export function buildProfile(records: Records): Profile {
  const results = records.results.flatMap((row) => {
    const draft = decodeResult(row.code);
    return draft ? [{ ...evaluate(draft), savedAt: row.saved_at }] : [];
  });
  const collected = new Set(results.flatMap((result) => result.diagnosis.species.map((species) => species.key)));
  const average = results.length ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : null;
  const own = results.filter((result) => !result.proxy);

  const sightings: Sighting[] = records.sightings
    .filter((row) => SPECIES_KEYS.has(row.species))
    .map((row) => ({ species: row.species as SpeciesKey, region: row.region, observedOn: row.observed_on }));
  const observed = new Map<SpeciesKey, { count: number; first: string }>();
  for (const sighting of sightings) {
    const entry = observed.get(sighting.species);
    observed.set(sighting.species, {
      count: (entry?.count ?? 0) + 1,
      first: entry && entry.first < sighting.observedOn ? entry.first : sighting.observedOn,
    });
  }
  const observedRegional = SPECIES.filter((species) => species.region && observed.has(species.key)).length;

  const bookmarks = Object.fromEntries(BOOKMARK_KINDS.map((kind) => [kind, [] as { code: string; savedAt: string }[]])) as Profile["bookmarks"];
  for (const item of records.items) {
    if (item.kind in bookmarks) bookmarks[item.kind as BookmarkKind].push({ code: item.code, savedAt: item.saved_at });
  }
  const exams = bookmarks.egzamin.flatMap((item) => {
    const draft = decodeExam(item.code);
    return draft ? [{ ...evaluateExam(draft), savedAt: item.savedAt }] : [];
  });
  const verdicts = Object.fromEntries(records.verdicts.map((row) => [row.case_slug, row.verdict as Verdict]));
  const verdictCount = records.verdicts.length;

  const rules: (Omit<Badge, "earned"> & { test: boolean })[] = [
    { key: "pierwsze", name: "Pierwsze badanie", hint: "Zapisz pierwszy wynik.", test: results.length >= 1 },
    { key: "staly", name: "Stały pacjent", hint: "Trzy zapisane badania.", test: results.length >= 3 },
    { key: "kliniczny", name: "Przypadek kliniczny", hint: "Wynik 75% albo więcej.", test: own.some((result) => result.score >= 75) },
    { key: "sladowy", name: "Ślad dziaderstwa", hint: "Wynik poniżej 25%.", test: own.some((result) => result.score < 25) },
    {
      key: "krzyzowka",
      name: "Krzyżówka",
      hint: "Rozpoznanie dwóch gatunków naraz.",
      test: results.some((result) => result.diagnosis.species.length === 2),
    },
    { key: "wywiad", name: "Wywiad rodzinny", hint: "Zbadaj kogoś bliskiego.", test: results.some((result) => result.proxy) },
    {
      key: "falstart",
      name: "Falstart",
      hint: "Zatrąb przed zielonym.",
      test: results.some((result) => result.reflex?.outcome === "red" || result.reflex?.outcome === "amber"),
    },
    { key: "kolekcjoner", name: "Kolekcjoner", hint: "Pięć gatunków w kolekcji.", test: collected.size >= 5 },
    { key: "komplet", name: "Komplet", hint: `Wszystkie ${DIAGNOSABLE.length} gatunków.`, test: collected.size >= DIAGNOSABLE.length },
    { key: "obserwator", name: "Obserwator", hint: "Zgłoś pierwszą obserwację w Atlasie.", test: sightings.length >= 1 },
    { key: "terenowy", name: "Sieć terenowa", hint: "Dziesięć gatunków w dzienniku obserwacji.", test: observed.size >= 10 },
    { key: "regionalista", name: "Regionalista", hint: "Trzy gatunki regionalne w dzienniku.", test: observedRegional >= 3 },
    {
      key: "egzamin",
      name: "Egzamin zdany",
      hint: "Egzamin terenowy na ocenę dobrą lub wyższą.",
      test: exams.some((exam) => exam.grade.value >= 4),
    },
    { key: "lawnik", name: "Ławnik", hint: "Dziesięć orzeczeń w Komisji.", test: verdictCount >= 10 },
    { key: "sygnalista", name: "Sygnalista", hint: "Zgłoś sprawę do Komisji.", test: records.submissions.length >= 1 },
    { key: "bingo", name: "Bingo", hint: "Wygrana karta bingo w Profilu.", test: bookmarks.bingo.length >= 1 },
  ];

  return {
    nickname: records.nickname,
    results,
    collected,
    average,
    sightings,
    observed,
    bookmarks,
    exams,
    verdicts,
    submissions: records.submissions,
    badges: rules.map(({ test, ...badge }) => ({ ...badge, earned: test })),
  };
}

/** The compact account state the browser uses to personalise static pages. */
export type AccountState = {
  nickname: string;
  email: string;
  results: number;
  collected: SpeciesKey[];
  observed: SpeciesKey[];
  /** Today's sightings, so the Atlas can say "zgłoszono dziś". */
  observedToday: SpeciesKey[];
  saved: Record<BookmarkKind, string[]>;
  verdicts: Record<string, Verdict>;
  badges: { earned: number; total: number };
};

export function accountState(profile: Profile, email: string, today: string): AccountState {
  return {
    nickname: profile.nickname,
    email,
    results: profile.results.length,
    collected: [...profile.collected],
    observed: [...profile.observed.keys()],
    observedToday: [...new Set(profile.sightings.filter((sighting) => sighting.observedOn === today).map((sighting) => sighting.species))],
    saved: Object.fromEntries(BOOKMARK_KINDS.map((kind) => [kind, profile.bookmarks[kind].map((item) => item.code)])) as AccountState["saved"],
    verdicts: profile.verdicts,
    badges: { earned: profile.badges.filter((badge) => badge.earned).length, total: profile.badges.length },
  };
}

/** Today's date in Warsaw, as Postgres writes it: "2026-10-02". */
export const warsawToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
