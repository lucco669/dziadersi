import { getRivalries, RIVALRIES, rivalryKey } from "@/content/seating";
import { getSpecies, SPECIES, type Species, type SpeciesKey } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fromBase64Url, toBase64Url } from "./base64url";
import { cleanName } from "./names";
import { random } from "./random";

/*
 * Plan stołu: the Institute's seating protocol for Wigilia and weddings.
 *
 * A plan is a list of places around a table drawn from above. Wigilia has one long table and, as
 * tradition has it, one empty place for the wanderer; a wedding has round tables. Every pair of
 * neighbours (and, at a lower weight, every pair facing each other) is scored from the Atlas: the
 * natural enmities in src/content/seating.ts, two of the same species competing for one niche,
 * related species sharing a topic, the species' strongest trait and its activity in the season.
 *
 * Plans live in the URL: "wigilia-0b3_5k7a" + "~" + the labels as base64url. Labels are personal
 * names: they never go to analytics or the census, and pages with a code are noindex.
 */

export type TableMode = "wigilia" | "wesele";
export const MODES: TableMode[] = ["wigilia", "wesele"];
export const MIN_GUESTS = 6;
export const MAX_GUESTS = 14;
/** Wedding guests share one round table up to this many, then two. */
export const ONE_ROUND_TABLE = 10;

/** One place at the table: a species with an optional label, or (species null) the wanderer's empty place. */
export type Seat = { species: SpeciesKey | null; label: string };
export type Plan = { mode: TableMode; seats: Seat[] };

export const guestCount = (plan: Plan) => plan.seats.filter((seat) => seat.species).length;
export const placeCount = (mode: TableMode, guests: number) => (mode === "wigilia" ? guests + 1 : guests);

/* ------------------------------------------------------------------ layout */

export type Place = { x: number; y: number; table: number };
export type Edge = { a: number; b: number; kind: "beside" | "facing"; weight: number };
export type TableShape =
  | { shape: "rect"; x: number; y: number; width: number; height: number }
  | { shape: "round"; cx: number; cy: number; r: number };
export type Layout = { width: number; height: number; places: Place[]; edges: Edge[]; tables: TableShape[] };

/** Facing pairs talk across the barszcz less than neighbours do. */
export const FACING_WEIGHT = { rect: 0.7, round: 0.4 };

const ROW = 96;

/**
 * The tables from above in a 360-wide coordinate space. Wigilia: one long table standing upright,
 * a place at the head when the count is odd, then down the right side and up the left, so places
 * follow each other clockwise. Weddings: one round table, or two for more than ten guests.
 */
export function seatingLayout(mode: TableMode, places: number): Layout {
  if (mode === "wigilia") {
    const head = places % 2;
    const rows = (places - head) / 2;
    const top = 104;
    const list: Place[] = [];
    const edges: Edge[] = [];
    if (head) list.push({ x: 180, y: 50, table: 0 });
    for (let r = 0; r < rows; r++) list.push({ x: 300, y: top + 48 + r * ROW, table: 0 });
    for (let r = rows - 1; r >= 0; r--) list.push({ x: 60, y: top + 48 + r * ROW, table: 0 });
    const right = (r: number) => head + r;
    const left = (r: number) => head + 2 * rows - 1 - r;
    for (let r = 0; r < rows; r++) {
      if (r + 1 < rows) {
        edges.push({ a: right(r), b: right(r + 1), kind: "beside", weight: 1 });
        edges.push({ a: left(r + 1), b: left(r), kind: "beside", weight: 1 });
      }
      edges.push({ a: right(r), b: left(r), kind: "facing", weight: FACING_WEIGHT.rect });
    }
    if (head) {
      edges.push({ a: 0, b: right(0), kind: "beside", weight: 1 });
      edges.push({ a: left(0), b: 0, kind: "beside", weight: 1 });
    }
    return {
      width: 360,
      height: top + rows * ROW + 20,
      places: list,
      edges,
      tables: [{ shape: "rect", x: 112, y: top, width: 136, height: rows * ROW }],
    };
  }

  const sizes = places <= ONE_ROUND_TABLE ? [places] : [Math.ceil(places / 2), Math.floor(places / 2)];
  const radii = sizes.map((count) => Math.max(112, count * 15));
  const width = Math.max(360, 2 * (Math.max(...radii) + 52));
  const cx = width / 2;
  const list: Place[] = [];
  const edges: Edge[] = [];
  const tables: TableShape[] = [];
  let y = 0;
  sizes.forEach((count, table) => {
    const radius = radii[table];
    const cy = y + radius + 50;
    const first = list.length;
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
      list.push({ x: round1(cx + radius * Math.cos(angle)), y: round1(cy + radius * Math.sin(angle)), table });
      edges.push({ a: first + i, b: first + ((i + 1) % count), kind: "beside", weight: 1 });
      if (count % 2 === 0 && i < count / 2) edges.push({ a: first + i, b: first + i + count / 2, kind: "facing", weight: FACING_WEIGHT.round });
    }
    tables.push({ shape: "round", cx, cy, r: radius - 56 });
    y = cy + radius + 60;
  });
  return { width, height: y, places: list, edges, tables };
}

const round1 = (value: number) => Math.round(value * 10) / 10;

/* ------------------------------------------------------------------ scoring */

const BY_KEY = new Map(SPECIES.map((species) => [species.key, species]));
const RIVALRY_BY_KEY = new Map(RIVALRIES.map((rivalry, i) => [rivalryKey(rivalry), i]));

/** The strongest trait, 0–100: how loudly the species holds its views. */
const intensity = (species: Species) => Math.max(...species.traits.map((trait) => trait.value));

/** Activity in the season of the occasion, 0–3: December for Wigilia, June to September for weddings. */
export function seasonActivity(species: Species, mode: TableMode) {
  if (mode === "wigilia") return species.calendar[11];
  const summer = species.calendar.slice(5, 9);
  return Math.round(summer.reduce((sum, value) => sum + value, 0) / summer.length);
}

export type PairReason = "rivalry" | "same" | "related" | "plain" | "empty";

const clamp = (value: number) => Math.min(97, Math.max(2, Math.round(value)));

/**
 * The chance, in percent, that two direct neighbours start a dispute before midnight. Symmetric.
 * The Institute never rules anything out (2–97); the wanderer's empty place never argues (0).
 */
export function pairRisk(a: SpeciesKey | null, b: SpeciesKey | null, mode: TableMode): { risk: number; reason: PairReason } {
  if (!a || !b) return { risk: 0, reason: "empty" };
  const first = BY_KEY.get(a)!;
  const second = BY_KEY.get(b)!;
  const season = seasonActivity(first, mode) + seasonActivity(second, mode);
  const rivalry = RIVALRY_BY_KEY.get([a, b].sort().join("+"));
  if (rivalry !== undefined) return { risk: clamp(RIVALRIES[rivalry].risk + season - 3), reason: "rivalry" };
  if (a === b) return { risk: clamp(58 + intensity(first) / 4 + season - 3), reason: "same" };
  if (first.related.includes(b) || second.related.includes(a)) return { risk: clamp(6 + season), reason: "related" };
  return { risk: clamp(12 + (intensity(first) + intensity(second) - 100) / 8 + season * 2), reason: "plain" };
}

/** What the dispute will be about, in the edition's words: the rivalry, or the shared trait of one species. */
export function pairSubject(a: SpeciesKey | null, b: SpeciesKey | null, locale: Locale): string | null {
  if (!a || !b) return null;
  const rivalry = RIVALRY_BY_KEY.get([a, b].sort().join("+"));
  if (rivalry !== undefined) return getRivalries(locale)[rivalry].subject;
  if (a === b) {
    const species = getSpecies(locale).find((item) => item.key === a)!;
    const top = species.traits.reduce((best, trait) => (trait.value > best.value ? trait : best));
    return top.label.charAt(0).toLowerCase() + top.label.slice(1);
  }
  return null;
}

export type Pair = Edge & { risk: number; base: number; reason: PairReason };

export type Verdict = "calm" | "tense" | "volatile" | "emergency";

export type Assessment = {
  pairs: Pair[];
  /** The table's flammability, 0–100: the weighted mean risk of all pairs. */
  index: number;
  /** Disputes expected before midnight. */
  disputes: number;
  verdict: Verdict;
  /** Pairs at 50% or more, the worst first. */
  flashpoints: Pair[];
  /** The calmest pair of two guests, if any. */
  calmest: Pair | null;
};

/** Sum of weighted risks: what the Institute's own arrangement minimises. */
export function planCost(seats: (SpeciesKey | null)[], layout: Layout, mode: TableMode) {
  let cost = 0;
  for (const edge of layout.edges) cost += edge.weight * pairRisk(seats[edge.a], seats[edge.b], mode).risk;
  return cost;
}

export function assess(plan: Plan): Assessment {
  const layout = seatingLayout(plan.mode, plan.seats.length);
  const pairs = layout.edges.map((edge) => {
    const { risk, reason } = pairRisk(plan.seats[edge.a].species, plan.seats[edge.b].species, plan.mode);
    return { ...edge, base: risk, risk: Math.round(risk * edge.weight), reason };
  });
  const total = pairs.reduce((sum, pair) => sum + pair.risk, 0);
  const weights = pairs.reduce((sum, pair) => sum + pair.weight, 0);
  const index = Math.round(total / weights);
  const worst = Math.max(0, ...pairs.map((pair) => pair.risk));
  const verdict: Verdict =
    index < 20 && worst < 60 ? "calm" : index < 30 && worst < 80 ? "tense" : index < 42 ? "volatile" : "emergency";
  const flashpoints = pairs.filter((pair) => pair.risk >= 50).sort((x, y) => y.risk - x.risk || x.a - y.a);
  const guests = pairs.filter((pair) => pair.reason !== "empty" && pair.kind === "beside");
  const calmest = guests.length ? guests.reduce((best, pair) => (pair.risk < best.risk ? pair : best)) : null;
  return { pairs, index, disputes: Math.round(total) / 100, verdict, flashpoints, calmest };
}

/**
 * The Institute's own arrangement: for each place, the index of the current place whose occupant
 * should sit there. Pairwise swaps until nothing improves, from the current plan and from a dozen
 * seeded shuffles; only a strictly better plan replaces the current one, so a good plan stays put.
 */
export function optimalOrder(plan: Plan, restarts = 24): number[] {
  const layout = seatingLayout(plan.mode, plan.seats.length);
  const species = plan.seats.map((seat) => seat.species);
  const cost = (order: number[]) => planCost(order.map((i) => species[i]), layout, plan.mode);
  const n = species.length;

  const descend = (start: number[]) => {
    const order = [...start];
    let current = cost(order);
    for (let improved = true; improved; ) {
      improved = false;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (species[order[i]] === species[order[j]]) continue;
          [order[i], order[j]] = [order[j], order[i]];
          const next = cost(order);
          if (next < current - 1e-9) {
            current = next;
            improved = true;
          } else {
            [order[i], order[j]] = [order[j], order[i]];
          }
        }
      }
    }
    return { order, cost: current };
  };

  let best = descend(Array.from({ length: n }, (_, i) => i));
  for (let r = 0; r < restarts; r++) {
    const next = random(7919 * (r + 1) + n);
    const start = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [start[i], start[j]] = [start[j], start[i]];
    }
    const found = descend(start);
    if (found.cost < best.cost - 1e-9) best = found;
  }
  return best.order;
}

export const reorder = (plan: Plan, order: number[]): Plan => ({ ...plan, seats: order.map((i) => plan.seats[i]) });

/* ------------------------------------------------------------------ codes */

const EMPTY = "_";
const SPECIES_INDEX = new Map(SPECIES.map((species, i) => [species.key, i]));

/** "wigilia-0b3_5k7a~…": the mode, one base36 character per place (species in Atlas order, "_" the empty place), then the labels. */
export function encodePlan(plan: Plan): string {
  const places = plan.seats.map((seat) => (seat.species ? SPECIES_INDEX.get(seat.species)!.toString(36) : EMPTY)).join("");
  const labels = plan.seats.map((seat) => (seat.species ? cleanName(seat.label) : ""));
  return `${plan.mode}-${places}${labels.some(Boolean) ? `~${toBase64Url(labels.join("|"))}` : ""}`;
}

/** The plan back from a code, or null when the code is not a valid plan. Labels that don't fit are dropped. */
export function decodePlan(raw: string): Plan | null {
  const code = safeDecode(raw);
  const match = /^(wigilia|wesele)-([0-9a-z_]+)(?:~([A-Za-z0-9_-]*))?$/.exec(code);
  if (!match) return null;
  const mode = match[1] as TableMode;
  const species = [...match[2]].map((char) => (char === EMPTY ? null : SPECIES[parseInt(char, 36)]?.key));
  if (species.some((key) => key === undefined)) return null;
  const empty = species.filter((key) => key === null).length;
  if (empty !== (mode === "wigilia" ? 1 : 0)) return null;
  const guests = species.length - empty;
  if (guests < MIN_GUESTS || guests > MAX_GUESTS) return null;
  const labels = match[3] ? fromBase64Url(match[3]).split("|") : [];
  const fit = labels.length === species.length;
  return {
    mode,
    seats: species.map((key, i) => ({ species: key as SpeciesKey | null, label: key && fit ? cleanName(labels[i]) : "" })),
  };
}

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

/** The protocol's number, the same for the same plan: "4127". */
export function protocolNumber(plan: Plan) {
  let hash = 2166136261;
  for (const char of encodePlan(plan)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return String(1000 + ((hash >>> 0) % 9000));
}

/* ------------------------------------------------------------------ names and samples */

/** "Motoryzacyjny", "Smart-Home", "Žarni": the species name without the word dziaders. */
export function shortName(key: SpeciesKey, locale: Locale) {
  const species = getSpecies(locale).find((item) => item.key === key)!;
  return species.name.replace(/\s*dziaders\s*/i, " ").trim();
}

const SAMPLE_COPY = defineCopy({
  pl: {
    wigilia: ["dziadek", "wujek Rysiek", "szwagier", "ciocia Grażyna", "teść", "tata", "babcia", "kuzyn z Warszawy"],
    wesele: ["wujek Zbyszek", "ciocia Halina", "świadek", "dziadek", "szwagier", "teść", "kuzynka", "sąsiad"],
  },
  sl: {
    wigilia: ["dedek", "stric Franci", "svak", "teta Majda", "tast", "oče", "babica", "bratranec iz Ljubljane"],
    wesele: ["stric Jože", "teta Marta", "priča", "dedek", "svak", "tast", "sestrična", "sosed"],
  },
});

const SAMPLE_SPECIES: Record<TableMode, SpeciesKey[]> = {
  // Two rivalries side by side and one across the table, so the first protocol has work to do.
  wigilia: ["wigilijny", "moto", "smart", "festiwalowy", "facebook", "kibicowski", "oszczednosciowy", "korpo"],
  wesele: ["weselny", "oszczednosciowy", "kibicowski", "uzdrowiskowy", "moto", "smart", "festiwalowy", "kolejkowy"],
};

/** The plan a visitor starts from: eight relatives with the usual labels, and the empty place at Wigilia. */
export function samplePlan(mode: TableMode, locale: Locale): Plan {
  const labels = SAMPLE_COPY[locale][mode];
  const seats: Seat[] = SAMPLE_SPECIES[mode].map((species, i) => ({ species, label: labels[i] }));
  if (mode === "wigilia") seats.splice(4, 0, { species: null, label: "" });
  return { mode, seats };
}

/** Species offered to a new guest, in turn. */
export const NEW_GUEST_SPECIES: SpeciesKey[] = ["grill", "dzialka", "meteorologiczny", "wedka", "budowa", "parapetowy", "jurajski", "kolejkowy"];

/** Switches the occasion: Wigilia gets the empty place (in the middle of the right side), a wedding loses it. */
export function switchMode(plan: Plan, mode: TableMode): Plan {
  if (plan.mode === mode) return plan;
  const guests = plan.seats.filter((seat) => seat.species);
  if (mode === "wesele") return { mode, seats: guests };
  const seats = [...guests];
  seats.splice(Math.ceil(seats.length / 2), 0, { species: null, label: "" });
  return { mode, seats };
}
