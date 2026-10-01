import { SPECIES, type Species, type SpeciesKey } from "@/content/species";
import { QUESTIONS, UNSPECIFIED, VERDICTS, type Verdict } from "@/content/test";

/*
 * Result codes are stateless: "1" + 24 base-4 answers (10 base36 chars)
 * + test date (3 base36 chars, days since 1 January 2026), optionally
 * followed by "~" and the name as base64url. Same code, same result, always.
 */

const VERSION = "1";
const EPOCH = Date.UTC(2026, 0, 1);
const DAY_MS = 86_400_000;
const CODE = /^1([0-9a-z]{10})([0-9a-z]{3})(?:~([A-Za-z0-9_-]{2,100}))?$/;

export const MAX_POINTS = QUESTIONS.reduce(
  (sum, question) => sum + Math.max(...question.answers.map((answer) => answer.points)),
  0,
);

export type Draft = {
  answers: number[];
  day: number;
  name?: string;
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

export function encodeResult({ answers, day, name = "" }: Draft) {
  const packed = answers.reduce((total, answer) => total * 4 + answer, 0);
  const cleaned = cleanName(name);
  return (
    VERSION +
    packed.toString(36).padStart(10, "0") +
    Math.min(Math.max(day, 0), 36 ** 3 - 1).toString(36).padStart(3, "0") +
    (cleaned ? `~${toBase64Url(cleaned)}` : "")
  );
}

export function decodeResult(code: string): Draft | null {
  const match = CODE.exec(code);
  if (!match) return null;

  let packed = parseInt(match[1], 36);
  if (packed >= 4 ** QUESTIONS.length) return null;

  const answers: number[] = [];
  for (let i = QUESTIONS.length - 1; i >= 0; i--) {
    answers[i] = packed % 4;
    packed = Math.floor(packed / 4);
  }
  if (answers.some((answer, i) => answer >= QUESTIONS[i].answers.length)) return null;

  return {
    answers,
    day: parseInt(match[2], 36),
    name: match[3] ? cleanName(fromBase64Url(match[3])) : "",
  };
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
  answers: number[];
  name: string;
  date: string;
  points: number;
  score: number;
  verdict: Verdict;
  diagnosis: Diagnosis;
  symptoms: Symptom[];
  percentile: number;
  certificate: string;
};

/*
 * Per species: the most a respondent can earn, and what random answering
 * earns on average. Affinity is measured between the two, so species that
 * appear in more questions (or in mild answers) don't win by default, and
 * it is damped for species that rest on only a few answers.
 */
const RANGE = Object.fromEntries(
  SPECIES.map((species) => {
    const weights = QUESTIONS.map((question) => question.answers.map((answer) => answer.species?.[species.key] ?? 0));
    const max = weights.reduce((sum, row) => sum + Math.max(...row), 0);
    const chance = weights.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0) / row.length, 0);
    return [species.key, { max, chance }];
  }),
) as Record<SpeciesKey, { max: number; chance: number }>;

type Diagnosable = Species & { prefix: string; suffix: string };

/** Regional Atlas species have no test questions; only these ten can be diagnosed. */
const DIAGNOSABLE = SPECIES.filter(
  (species): species is Diagnosable => RANGE[species.key].max > 0 && !!species.prefix && !!species.suffix,
);

const epithet = (species: Species) => species.latin.split(" ")[1];

function diagnose(answers: number[], score: number): Diagnosis {
  const earned = Object.fromEntries(DIAGNOSABLE.map((species) => [species.key, 0])) as Record<SpeciesKey, number>;
  answers.forEach((answer, i) => {
    for (const [key, weight] of Object.entries(QUESTIONS[i].answers[answer].species ?? {})) {
      earned[key as SpeciesKey] += weight;
    }
  });

  const [first, second] = DIAGNOSABLE.map((species) => {
    const { max, chance } = RANGE[species.key];
    const affinity = ((earned[species.key] - chance) / (max - chance)) * (max / (max + 3));
    return { species, affinity, earned: earned[species.key] };
  }).sort((a, b) => b.affinity - a.affinity || b.earned - a.earned);

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

function certificateNumber(text: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return String((hash >>> 0) % 1_000_000).padStart(6, "0");
}

export function evaluate(draft: Draft): Result {
  const chosen = draft.answers.map((answer, i) => QUESTIONS[i].answers[answer]);
  const points = chosen.reduce((sum, answer) => sum + answer.points, 0);
  const score = Math.round((points / MAX_POINTS) * 100);
  const code = encodeResult(draft);

  return {
    code,
    answers: draft.answers,
    name: cleanName(draft.name ?? ""),
    date: dateFormat.format(new Date(EPOCH + draft.day * DAY_MS)),
    points,
    score,
    verdict: VERDICTS.findLast((verdict) => score >= verdict.from) ?? VERDICTS[0],
    diagnosis: diagnose(draft.answers, score),
    symptoms: chosen
      .map((answer, i) => ({
        number: i + 1,
        section: QUESTIONS[i].section,
        question: QUESTIONS[i].text,
        answer: answer.text,
        points: answer.points,
      }))
      .filter((symptom) => symptom.points >= 2)
      .sort((a, b) => b.points - a.points || a.number - b.number)
      .slice(0, 5),
    percentile: Math.min(99, Math.max(1, Math.round(normalCdf((score - 46) / 19) * 100))),
    certificate: certificateNumber(code.split("~")[0]),
  };
}

/** The homepage preview and the prerendered sample: 82%, Dziaders Grillowo-Motoryzacyjny. */
export const SAMPLE_DRAFT: Draft = {
  answers: [3, 3, 3, 3, 3, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2, 1, 2, 1, 1, 2, 2, 2, 1, 2],
  day: 273,
};
