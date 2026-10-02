import { speciesByKey, type Species, type SpeciesKey } from "@/content/species";
import { random, shuffled } from "./random";

/*
 * Egzamin terenowy: twelve identification questions drawn from the Atlas by a seed.
 * A code is the edition, the seed, the answers and the day: "1" + 4 + 5 + 3 base36 characters.
 * The pool of edition 1 is frozen below, so old codes keep their questions when the Atlas grows;
 * a new pool means a new edition digit.
 */

const POOL_V1: SpeciesKey[] = [
  "grill",
  "parking",
  "budowa",
  "moto",
  "wakacje",
  "facebook",
  "smart",
  "dzialka",
  "wedka",
  "korpo",
  "zeglarz",
  "grzybiarz",
  "przygraniczny",
  "oszczednosciowy",
  "uzdrowiskowy",
  "gorski",
  "festiwalowy",
  "golebiarz",
  "jurajski",
  "meteorologiczny",
  "krupowkowy",
  "bieszczadzki",
  "weselny",
  "wigilijny",
  "parapetowy",
  "kolejkowy",
  "kibicowski",
  "kempingowy",
];

export const EXAM_LENGTH = 12;
const OPTIONS = 4;
const SEEDS = 36 ** 4;
const CODE = /^1([0-9a-z]{4})([0-9a-z]{5})([0-9a-z]{3})$/;

export type ClueKind = "call" | "symptom" | "habitat" | "enemies" | "marks" | "plate" | "latin";

const PROMPTS: Record<ClueKind, string> = {
  call: "Kto wydaje ten odgłos?",
  symptom: "Którego gatunku to objaw?",
  habitat: "Czyje to siedlisko?",
  enemies: "Czyi to naturalni wrogowie?",
  marks: "Kogo opisuje notatka terenowa?",
  plate: "Oznacz gatunek z ryciny.",
  latin: "Do kogo należy ta nazwa łacińska?",
};

export const CLUE_LABELS: Record<ClueKind, string> = {
  call: "Wokalizacja",
  symptom: "Objaw",
  habitat: "Siedlisko",
  enemies: "Naturalni wrogowie",
  marks: "Rozpoznanie w terenie",
  plate: "Rycina",
  latin: "Nazwa łacińska",
};

export type Question = {
  kind: ClueKind;
  prompt: string;
  /** The clue as shown; empty for a plate, which is drawn. */
  clue: string;
  answer: SpeciesKey;
  options: SpeciesKey[];
  /** Index of the answer among the options. */
  correct: number;
};

const KINDS = Object.keys(PROMPTS) as ClueKind[];

function clueFor(kind: ClueKind, species: Species, pick: number) {
  switch (kind) {
    case "call":
      return species.calls[pick % species.calls.length];
    case "symptom":
      return species.symptoms[pick % species.symptoms.length];
    case "habitat":
      return species.habitat;
    case "enemies":
      return species.enemies;
    case "marks":
      return species.fieldMarks;
    case "plate":
      return "";
    case "latin":
      return species.latin;
  }
}

/** The twelve questions of an exam, the same on the server and in the browser. */
export function questions(seed: number): Question[] {
  const next = random(seed * 2_654_435 + 97);
  const order = shuffled(POOL_V1.length, seed).map((i) => POOL_V1[i]);
  // Every kind at least once, none more than twice, in a seeded order.
  const kinds = shuffled(KINDS.length * 2, seed + 1)
    .map((i) => KINDS[i % KINDS.length])
    .slice(0, EXAM_LENGTH);

  return order.slice(0, EXAM_LENGTH).map((answer, i) => {
    const kind = kinds[i];
    const others = shuffled(POOL_V1.length, seed + 101 * (i + 1))
      .map((j) => POOL_V1[j])
      .filter((key) => key !== answer)
      .slice(0, OPTIONS - 1);
    const correct = Math.floor(next() * OPTIONS);
    const options = [...others];
    options.splice(correct, 0, answer);
    return {
      kind,
      prompt: PROMPTS[kind],
      clue: clueFor(kind, speciesByKey(answer), Math.floor(next() * 7)),
      answer,
      options,
      correct,
    };
  });
}

export const randomExamSeed = () => Math.floor(Math.random() * SEEDS);

export type ExamDraft = { seed: number; answers: number[]; day: number };

export function encodeExam({ seed, answers, day }: ExamDraft) {
  const packed = answers.reduce((sum, answer) => sum * OPTIONS + answer, 0);
  return `1${(seed % SEEDS).toString(36).padStart(4, "0")}${packed.toString(36).padStart(5, "0")}${Math.min(Math.max(day, 0), 36 ** 3 - 1)
    .toString(36)
    .padStart(3, "0")}`;
}

export function decodeExam(code: string): ExamDraft | null {
  const match = CODE.exec(code);
  if (!match) return null;
  let packed = parseInt(match[2], 36);
  if (packed >= OPTIONS ** EXAM_LENGTH) return null;
  const answers: number[] = [];
  for (let i = EXAM_LENGTH - 1; i >= 0; i--) {
    answers[i] = packed % OPTIONS;
    packed = Math.floor(packed / OPTIONS);
  }
  return { seed: parseInt(match[1], 36), answers, day: parseInt(match[3], 36) };
}

/* Grades: the Polish school scale, from niedostateczny to celujący. */

export type Grade = { value: number; name: string; title: string; text: string; range: string };

export const GRADES: Grade[] = [
  {
    value: 1,
    range: "0–3",
    name: "niedostateczny",
    title: "Spacerowicz",
    text: "Kandydat myli Grillowego z Działkowym, a Parkingowego z kimś, kto po prostu źle zaparkował. Instytut zaleca lekturę Atlasu i obserwacje przy rodzinnym stole.",
  },
  {
    value: 2,
    range: "4–5",
    name: "dopuszczający",
    title: "Turysta",
    text: "Kandydat rozpoznaje dziadersa, gdy ten trzyma szczypce. Bez szczypiec gubi trop. Egzamin zaliczony warunkowo, z obowiązkiem obserwacji w sezonie grillowym.",
  },
  {
    value: 3,
    range: "6–7",
    name: "dostateczny",
    title: "Praktykant terenowy",
    text: "Kandydat zna gatunki pospolite i radzi sobie z wokalizacjami. Gatunki regionalne i okazjonalne wymagają jeszcze pracy w terenie, najlepiej na weselu.",
  },
  {
    value: 4,
    range: "8–9",
    name: "dobry",
    title: "Obserwator terenowy III klasy",
    text: "Kandydat oznacza gatunki pewnie i bez pomocy klucza. Zdarza mu się pomylić krzyżówki, co zdarza się również Instytutowi.",
  },
  {
    value: 5,
    range: "10–11",
    name: "bardzo dobry",
    title: "Obserwator terenowy II klasy",
    text: "Kandydat rozpoznaje dziadersa po pierwszym „panie…”, zanim padnie reszta zdania. Komisja egzaminacyjna podejrzewa wieloletnią praktykę rodzinną.",
  },
  {
    value: 6,
    range: "12",
    name: "celujący",
    title: "Obserwator terenowy I klasy",
    text: "Bezbłędnie. Kandydat zna łacinę, siedliska i naturalnych wrogów wszystkich gatunków. Komisja pyta, skąd. Kandydat odpowiada, że ma rodzinę.",
  },
];

export function gradeFor(points: number): Grade {
  const value = points >= 12 ? 6 : points >= 10 ? 5 : points >= 8 ? 4 : points >= 6 ? 3 : points >= 4 ? 2 : 1;
  return GRADES[value - 1];
}

export type ExamResult = ExamDraft & {
  code: string;
  questions: Question[];
  points: number;
  grade: Grade;
  date: string;
  /** Protocol number, printed on the certificate. */
  number: string;
};

const EPOCH = Date.UTC(2026, 0, 1);
const dateFormat = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function evaluateExam(draft: ExamDraft): ExamResult {
  const list = questions(draft.seed);
  const points = list.filter((question, i) => draft.answers[i] === question.correct).length;
  return {
    ...draft,
    code: encodeExam(draft),
    questions: list,
    points,
    grade: gradeFor(points),
    date: dateFormat.format(new Date(EPOCH + draft.day * 86_400_000)),
    number: `ET/${String(draft.seed % 100_000).padStart(5, "0")}/26`,
  };
}

/** The sample exam on the index page: everything right but two. */
export const SAMPLE_EXAM: ExamDraft = (() => {
  const seed = 424_242;
  const answers = questions(seed).map((question, i) => (i === 3 || i === 8 ? (question.correct + 1) % OPTIONS : question.correct));
  return { seed, answers, day: (Date.UTC(2026, 9, 2) - EPOCH) / 86_400_000 };
})();
