import { SPECIES, type Species, type SpeciesKey } from "@/content/species";
import {
  TASKS,
  UNSPECIFIED,
  VERDICTS,
  type Option,
  type ReflexOutcome,
  type Task,
  type Verdict,
  type Weights,
} from "@/content/test";
import { QUESTIONS_V1 } from "@/content/test-v1";

/*
 * Result codes are stateless. Same code, same result, always.
 *
 * Version 2 (Formularz IBD-T2): "2" + every answer packed as one mixed-radix number in base36
 * (the first digit says whether it was a family interview) + the test date (3 base36 chars,
 * days since 1 January 2026), optionally followed by "~" and the name as base64url.
 *
 * Version 1 (Formularz IBD-T1, retired): "1" + 24 base-4 answers in 10 base36 chars + the date.
 * Still decoded and scored exactly as before, so old links keep their results.
 */

const EPOCH = Date.UTC(2026, 0, 1);
const DAY_MS = 86_400_000;
const NAME = "(?:~([A-Za-z0-9_-]{2,100}))?";

export type Draft = {
  version: 1 | 2;
  /** One value per task, in the task's own radix. */
  answers: number[];
  day: number;
  name?: string;
  /** Family interview: the answers describe someone else. */
  proxy?: boolean;
};

// Kept off certificates served from our domain.
const BLOCKED =
  /kurw|chuj|huj|pierd|jeb|pizd|cipa|cipe|cipk|kutas|dziwk|szmat|pedal|cwel|fiut|zjeb|hitler|nazi|fuck|shit|cunt|nigg|fagg/;

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/gi, "l")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

/** Letters, spaces and a little punctuation, at most 24 characters, nothing vulgar. */
export function cleanName(raw: string) {
  const name = raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M} .'’-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24)
    .trim();
  return name && !BLOCKED.test(fold(name)) ? name : "";
}

function toBase64Url(text: string) {
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string) {
  try {
    const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
  } catch {
    return "";
  }
}

/* Reflex values: 0 = honked on red, 1 = on red and amber, 2 + ms/10 = reaction time, NO_HONK = never. */

const REFLEX_STEPS = 500;
const NO_HONK = REFLEX_STEPS + 2;

export function reflexValue(event: "red" | "amber" | "none" | number) {
  if (event === "red") return 0;
  if (event === "amber") return 1;
  if (event === "none") return NO_HONK;
  return 2 + Math.min(REFLEX_STEPS - 1, Math.max(0, Math.round(event / 10)));
}

export function reflexOutcome(value: number): { outcome: ReflexOutcome; seconds?: number } {
  if (value === 0) return { outcome: "red" };
  if (value === 1) return { outcome: "amber" };
  if (value >= NO_HONK) return { outcome: "none" };
  const seconds = ((value - 2) * 10) / 1000;
  return { outcome: seconds < 0.35 ? "fast" : seconds < 0.9 ? "normal" : seconds < 2.5 ? "slow" : "none", seconds };
}

const secondsFormat = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatSeconds = (seconds: number) => `${secondsFormat.format(seconds)} s`;

/* What each task can take and what an answer means. */

const pow2 = (count: number) => 2 ** count;
const bit = (value: number, i: number) => Math.floor(value / pow2(i)) % 2 === 1;

/** Ticked things: one point for every two, at most three. */
const inventoryPoints = (count: number) => Math.min(3, Math.ceil(count / 2));
/** Yes answers in the rapid series: 2–3 give a point, 4–6 two, 7 or more three. */
const rapidPoints = (yes: number) => (yes >= 7 ? 3 : yes >= 4 ? 2 : yes >= 2 ? 1 : 0);

export function choices(task: Task): Option[] {
  switch (task.kind) {
    case "choice":
    case "sms":
    case "blot":
      return task.options;
    case "map":
      return task.skip ? [...task.zones, task.skip] : task.zones;
    case "scale":
      return task.steps;
    default:
      return [];
  }
}

export function radix(task: Task): number {
  switch (task.kind) {
    case "words":
      return task.words.reduce((product, word) => product * word.options.length, 1);
    case "inventory":
      return pow2(task.things.length);
    case "rapid":
      return pow2(task.statements.length);
    case "reflex":
      return NO_HONK + 1;
    default:
      return choices(task).length;
  }
}

/** The answer to each word of an association task, first word first. */
export function wordAnswers(task: Extract<Task, { kind: "words" }>, value: number) {
  const picked: number[] = [];
  let rest = value;
  for (let i = task.words.length - 1; i >= 0; i--) {
    const size = task.words[i].options.length;
    picked[i] = rest % size;
    rest = Math.floor(rest / size);
  }
  return picked;
}

export function packWords(task: Extract<Task, { kind: "words" }>, picked: number[]) {
  return task.words.reduce((total, word, i) => total * word.options.length + (picked[i] ?? 0), 0);
}

export const packBits = (bits: boolean[]) => bits.reduce((total, on, i) => total + (on ? pow2(i) : 0), 0);
export const unpackBits = (value: number, count: number) => Array.from({ length: count }, (_, i) => bit(value, i));

type Reading = { points: number; species: Weights; answer: string };

const addWeights = (target: Weights, source: Weights = {}) => {
  for (const [key, weight] of Object.entries(source)) {
    target[key as SpeciesKey] = (target[key as SpeciesKey] ?? 0) + weight;
  }
  return target;
};

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

const said = (option: Option, proxy: boolean) => (proxy && option.proxy) || option.text;

export function read(task: Task, value: number, proxy = false): Reading {
  switch (task.kind) {
    case "words": {
      const picked = wordAnswers(task, value).map((index, i) => task.words[i].options[index]);
      return {
        points: picked.reduce((sum, option) => sum + option.points, 0),
        species: picked.reduce((weights, option) => addWeights(weights, option.species), {} as Weights),
        answer: picked.map((option, i) => `${task.words[i].word}: ${option.text}`).join(" · "),
      };
    }
    case "inventory": {
      const ticked = task.things.filter((_, i) => bit(value, i));
      return {
        points: inventoryPoints(ticked.length),
        species: ticked.reduce((weights, thing) => addWeights(weights, thing.species), {} as Weights),
        answer: ticked.length ? ticked.map((thing) => thing.text).join(" · ") : "Nic. Instytut odnotowuje to z niedowierzaniem.",
      };
    }
    case "rapid": {
      const yes = task.statements.filter((_, i) => bit(value, i));
      return {
        points: rapidPoints(yes.length),
        species: yes.reduce((weights, statement) => addWeights(weights, statement.species), {} as Weights),
        answer: `${yes.length} × TAK na ${task.statements.length}${yes.length ? `: ${yes.map((statement) => lowerFirst(statement.text.replace(/\.$/, ""))).join(", ")}.` : "."}`,
      };
    }
    case "reflex": {
      const { outcome, seconds } = reflexOutcome(value);
      const option = task.outcomes[outcome];
      return {
        points: option.points,
        species: { ...option.species },
        answer: seconds !== undefined && outcome !== "none" ? `${formatSeconds(seconds)}. ${option.text}` : option.text,
      };
    }
    default: {
      const option = choices(task)[value];
      return { points: option.points, species: { ...option.species }, answer: said(option, proxy) };
    }
  }
}

/** The most a task can give, and its weights at best and on random answers. */
function profile(task: Task) {
  const single = (options: Option[]) => ({
    max: Math.max(...options.map((option) => option.points)),
    weights: options.map((option) => option.species ?? {}),
  });

  const best: Weights = {};
  const chance: Weights = {};
  const collect = (rows: Weights[], combine: "max" | "sum") => {
    const keys = new Set(rows.flatMap((row) => Object.keys(row))) as Set<SpeciesKey>;
    for (const key of keys) {
      const values = rows.map((row) => row[key] ?? 0);
      const total = values.reduce((a, b) => a + b, 0);
      best[key] = (best[key] ?? 0) + (combine === "max" ? Math.max(...values) : total);
      chance[key] = (chance[key] ?? 0) + (combine === "max" ? total / values.length : total / 2);
    }
  };

  switch (task.kind) {
    case "words":
      for (const word of task.words) collect(single(word.options).weights, "max");
      return { max: task.words.reduce((sum, word) => sum + single(word.options).max, 0), best, chance };
    case "inventory":
      collect(task.things.map((thing) => thing.species ?? {}), "sum");
      return { max: inventoryPoints(task.things.length), best, chance };
    case "rapid":
      collect(task.statements.map((statement) => statement.species ?? {}), "sum");
      return { max: rapidPoints(task.statements.length), best, chance };
    case "reflex": {
      const outcomes = Object.values(task.outcomes);
      collect(single(outcomes).weights, "max");
      return { max: single(outcomes).max, best, chance };
    }
    default: {
      const options = choices(task);
      collect(single(options).weights, "max");
      return { max: single(options).max, best, chance };
    }
  }
}

/** The first edition, as tasks: 24 four-way choices. */
const TASKS_V1: Task[] = QUESTIONS_V1.map((question) => ({
  kind: "choice",
  station: 0,
  section: question.section,
  prompt: question.text,
  proxyPrompt: question.text,
  options: question.answers,
}));

const FORMS = { 1: TASKS_V1, 2: TASKS } as const;

/* Scoring per form: maximum points and, per species, the best and the chance score. */

const PROFILES = { 1: TASKS_V1.map(profile), 2: TASKS.map(profile) };

const total = (version: 1 | 2) => PROFILES[version].reduce((sum, item) => sum + item.max, 0);
export const MAX_POINTS = { 1: total(1), 2: total(2) } as const;

function ranges(version: 1 | 2) {
  return Object.fromEntries(
    SPECIES.map((species) => [
      species.key,
      {
        max: PROFILES[version].reduce((sum, item) => sum + (item.best[species.key] ?? 0), 0),
        chance: PROFILES[version].reduce((sum, item) => sum + (item.chance[species.key] ?? 0), 0),
      },
    ]),
  ) as Record<SpeciesKey, { max: number; chance: number }>;
}

const RANGE = { 1: ranges(1), 2: ranges(2) };

type Diagnosable = Species & { prefix: string; suffix: string };

/** Regional Atlas species have no test questions; only these ten can be diagnosed. */
export const DIAGNOSABLE = SPECIES.filter(
  (species): species is Diagnosable => RANGE[2][species.key].max > 0 && !!species.prefix && !!species.suffix,
);

/* Codes. */

const V2_RADICES = [2, ...TASKS.map(radix)];
const V2_SPACE = V2_RADICES.reduce((product, size) => product * BigInt(size), BigInt(1));
const V2_LENGTH = (V2_SPACE - BigInt(1)).toString(36).length;
const CODE_V1 = new RegExp(`^1([0-9a-z]{10})([0-9a-z]{3})${NAME}$`);
const CODE_V2 = new RegExp(`^2([0-9a-z]{${V2_LENGTH}})([0-9a-z]{3})${NAME}$`);

const dayCode = (day: number) => Math.min(Math.max(day, 0), 36 ** 3 - 1).toString(36).padStart(3, "0");

function parse36(text: string) {
  let value = BigInt(0);
  for (const char of text) value = value * BigInt(36) + BigInt(parseInt(char, 36));
  return value;
}

export function encodeResult({ version, answers, day, name = "", proxy }: Draft) {
  const cleaned = cleanName(name);
  const suffix = dayCode(day) + (cleaned ? `~${toBase64Url(cleaned)}` : "");
  if (version === 1) {
    const packed = answers.reduce((sum, answer) => sum * 4 + answer, 0);
    return `1${packed.toString(36).padStart(10, "0")}${suffix}`;
  }
  const digits = [proxy ? 1 : 0, ...answers];
  const packed = digits.reduce((sum, digit, i) => sum * BigInt(V2_RADICES[i]) + BigInt(digit), BigInt(0));
  return `2${packed.toString(36).padStart(V2_LENGTH, "0")}${suffix}`;
}

export function decodeResult(code: string): Draft | null {
  const v2 = CODE_V2.exec(code);
  if (v2) {
    let packed = parse36(v2[1]);
    if (packed >= V2_SPACE) return null;
    const digits: number[] = [];
    for (let i = V2_RADICES.length - 1; i >= 0; i--) {
      const size = BigInt(V2_RADICES[i]);
      digits[i] = Number(packed % size);
      packed /= size;
    }
    return {
      version: 2,
      proxy: digits[0] === 1,
      answers: digits.slice(1),
      day: parseInt(v2[2], 36),
      name: v2[3] ? cleanName(fromBase64Url(v2[3])) : "",
    };
  }

  const v1 = CODE_V1.exec(code);
  if (!v1) return null;
  let packed = parseInt(v1[1], 36);
  if (packed >= 4 ** QUESTIONS_V1.length) return null;
  const answers: number[] = [];
  for (let i = QUESTIONS_V1.length - 1; i >= 0; i--) {
    answers[i] = packed % 4;
    packed = Math.floor(packed / 4);
  }
  if (answers.some((answer, i) => answer >= QUESTIONS_V1[i].answers.length)) return null;
  return { version: 1, answers, day: parseInt(v1[2], 36), name: v1[3] ? cleanName(fromBase64Url(v1[3])) : "" };
}

/** Calendar day in the visitor's own time zone, counted from 1 January 2026. */
export function dayNumber(date: Date) {
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.max(0, Math.round((day - EPOCH) / DAY_MS));
}

const dateFormat = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export type Diagnosis = {
  name: string;
  latin: string;
  /** Empty when the answers point to no particular Atlas species. */
  species: Species[];
  authority?: string;
  description?: string;
};

export type Symptom = {
  number: number;
  section: string;
  question: string;
  answer: string;
  points: number;
};

export type Result = {
  code: string;
  version: 1 | 2;
  answers: number[];
  name: string;
  proxy: boolean;
  date: string;
  points: number;
  max: number;
  score: number;
  verdict: Verdict;
  diagnosis: Diagnosis;
  /** Every answer worth two points or more, in task order. */
  findings: Symptom[];
  /** The five strongest findings. */
  symptoms: Symptom[];
  /** 0–1 per diagnosable species: where the answers fall between chance and the most dziaderski. */
  affinity: Record<SpeciesKey, number>;
  /** 0–1 per diagnosable species: the share of the species' points the answers earned. */
  share: Record<SpeciesKey, number>;
  reflex?: { outcome: ReflexOutcome; seconds?: number };
  percentile: number;
  certificate: string;
};

const epithet = (species: Species) => species.latin.split(" ")[1];

function affinities(version: 1 | 2, earned: Weights) {
  return DIAGNOSABLE.map((species) => {
    const { max, chance } = RANGE[version][species.key];
    const value = earned[species.key] ?? 0;
    // Damped for species that rest on only a few answers.
    const affinity = max > chance ? ((value - chance) / (max - chance)) * (max / (max + 3)) : 0;
    return { species, affinity, earned: value };
  }).sort((a, b) => b.affinity - a.affinity || b.earned - a.earned);
}

function diagnose(ranked: ReturnType<typeof affinities>, score: number): Diagnosis {
  const [first, second] = ranked;
  if (first.affinity < 0.2) {
    const unspecified = score < 25 ? UNSPECIFIED.latent : UNSPECIFIED.common;
    return { ...unspecified, species: [] };
  }
  if (second.affinity >= 0.3 && second.affinity >= first.affinity * 0.85) {
    return {
      name: `Dziaders ${first.species.prefix}-${second.species.suffix}`,
      latin: `Dziadersus ${epithet(first.species)} × ${epithet(second.species)}`,
      species: [first.species, second.species],
    };
  }
  return { name: first.species.name, latin: first.species.latin, species: [first.species] };
}

/** Standard normal CDF (Abramowitz & Stegun 7.1.26). */
function normalCdf(z: number) {
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  const erf = 1 - poly * Math.exp(-x * x);
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}

/** A stable number from text: the certificate number and the lab results' scatter. */
export function hash(text: string) {
  let value = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}

export function evaluate(draft: Draft): Result {
  const tasks = FORMS[draft.version];
  const proxy = draft.version === 2 && !!draft.proxy;
  const readings = draft.answers.map((value, i) => read(tasks[i], value, proxy));
  const points = readings.reduce((sum, reading) => sum + reading.points, 0);
  const max = MAX_POINTS[draft.version];
  const score = Math.round((points / max) * 100);
  const code = encodeResult(draft);
  const earned = readings.reduce((weights, reading) => addWeights(weights, reading.species), {} as Weights);
  const ranked = affinities(draft.version, earned);
  const reflexIndex = tasks.findIndex((task) => task.kind === "reflex");

  const findings = readings
    .map((reading, i) => ({
      number: i + 1,
      section: tasks[i].section,
      question: proxy ? tasks[i].proxyPrompt : tasks[i].prompt,
      answer: reading.answer,
      points: reading.points,
    }))
    .filter((symptom) => symptom.points >= 2);

  return {
    code,
    version: draft.version,
    answers: draft.answers,
    name: cleanName(draft.name ?? ""),
    proxy,
    date: dateFormat.format(new Date(EPOCH + draft.day * DAY_MS)),
    points,
    max,
    score,
    verdict: VERDICTS.findLast((verdict) => score >= verdict.from) ?? VERDICTS[0],
    diagnosis: diagnose(ranked, score),
    findings,
    symptoms: [...findings].sort((a, b) => b.points - a.points || a.number - b.number).slice(0, 5),
    affinity: Object.fromEntries(ranked.map((item) => [item.species.key, Math.min(1, Math.max(0, item.affinity / 0.8))])) as Record<
      SpeciesKey,
      number
    >,
    share: Object.fromEntries(
      DIAGNOSABLE.map((species) => [species.key, (earned[species.key] ?? 0) / RANGE[draft.version][species.key].max]),
    ) as Record<SpeciesKey, number>,
    reflex: reflexIndex >= 0 ? reflexOutcome(draft.answers[reflexIndex]) : undefined,
    percentile: Math.min(99, Math.max(1, Math.round(normalCdf((score - 46) / 19) * 100))),
    certificate: String(hash(code.split("~")[0]) % 1_000_000).padStart(6, "0"),
  };
}

/** The species the answers so far point to, for the notes between rooms; null while nothing stands out. */
export function suspect(answers: (number | undefined)[]): Species | null {
  const earned: Weights = {};
  const best: Weights = {};
  answers.forEach((value, i) => {
    if (value === undefined) return;
    addWeights(earned, read(TASKS[i], value).species);
    addWeights(best, PROFILES[2][i].best);
  });
  const ranked = DIAGNOSABLE.map((species) => ({
    species,
    earned: earned[species.key] ?? 0,
    share: (earned[species.key] ?? 0) / Math.max(1, best[species.key] ?? 0),
  }))
    .filter((item) => item.earned >= 2 && item.share >= 0.5)
    .sort((a, b) => b.share - a.share || b.earned - a.earned);
  return ranked[0]?.species ?? null;
}

/** How alike two respondents are, 0–100: half the score gap, half the species profile. */
export function compatibility(a: Result, b: Result) {
  const keys = DIAGNOSABLE.map((species) => species.key);
  const dot = keys.reduce((sum, key) => sum + a.affinity[key] * b.affinity[key], 0);
  const norm = (result: Result) => Math.sqrt(keys.reduce((sum, key) => sum + result.affinity[key] ** 2, 0));
  const [na, nb] = [norm(a), norm(b)];
  const profile = na === 0 && nb === 0 ? 1 : na === 0 || nb === 0 ? 0.3 : dot / (na * nb);
  return Math.round(100 * (0.5 * (1 - Math.abs(a.score - b.score) / 100) + 0.5 * profile));
}

/* Rankings: result codes joined with dots, in the order people joined. */

export const GROUP_LIMIT = 12;

export function decodeGroup(list: string): Draft[] | null {
  const codes = [...new Set(list.split("."))];
  if (codes.length === 0 || codes.length > GROUP_LIMIT) return null;
  const drafts = codes.map(decodeResult);
  return drafts.every((draft): draft is Draft => draft !== null) ? drafts : null;
}

export const groupPath = (codes: string[]) => `/grupa/${[...new Set(codes)].join(".")}`;

/** The front page preview and the prerendered sample: 83%, Dziaders Grillowo-Motoryzacyjny. */
export const SAMPLE_DRAFT: Draft = {
  version: 2,
  answers: [3, 2, 2, 2, 40, 2, 27, 2, 1, 41, 39, 3, 3, 2, 1, 201],
  day: 273,
};
