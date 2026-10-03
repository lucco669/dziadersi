import { speciesByKey, type Species, type SpeciesKey } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { random, shuffled } from "./random";
import { formatDate } from "./typo";

/*
 * Egzamin terenowy: twelve identification questions drawn from the Atlas by a seed.
 * A code is the edition, the seed, the answers and the day: "1" + 4 + 5 + 3 base36 characters.
 * The pool of edition 1 is frozen below, so old codes keep their questions when the Atlas grows;
 * a new pool means a new edition digit. Codes are the same in both editions of the site: the
 * questions, options and answers depend on the seed only, the language on the locale.
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

/** Frozen order: the seed picks kinds by their index here. */
const KINDS: ClueKind[] = ["call", "symptom", "habitat", "enemies", "marks", "plate", "latin"];

/* Grades: the Polish school scale, from niedostateczny to celujący. */

export type Grade = { value: number; name: string; title: string; text: string; range: string };

const COPY = defineCopy<{ prompts: Record<ClueKind, string>; labels: Record<ClueKind, string>; grades: Grade[] }>({
  pl: {
    prompts: {
      call: "Kto wydaje ten odgłos?",
      symptom: "Którego gatunku to objaw?",
      habitat: "Czyje to siedlisko?",
      enemies: "Czyi to naturalni wrogowie?",
      marks: "Kogo opisuje notatka terenowa?",
      plate: "Oznacz gatunek z ryciny.",
      latin: "Do kogo należy ta nazwa łacińska?",
    },
    labels: {
      call: "Wokalizacja",
      symptom: "Objaw",
      habitat: "Siedlisko",
      enemies: "Naturalni wrogowie",
      marks: "Rozpoznanie w terenie",
      plate: "Rycina",
      latin: "Nazwa łacińska",
    },
    grades: [
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
    ],
  },
  sl: {
    prompts: {
      call: "Kdo se tako oglaša?",
      symptom: "Katere vrste je to simptom?",
      habitat: "Čigav je ta habitat?",
      enemies: "Čigavi so ti naravni sovražniki?",
      marks: "Koga opisuje terenski zapisek?",
      plate: "Določi vrsto po risbi.",
      latin: "Čigavo je to latinsko ime?",
    },
    labels: {
      call: "Oglašanje",
      symptom: "Simptom",
      habitat: "Habitat",
      enemies: "Naravni sovražniki",
      marks: "Prepoznavanje na terenu",
      plate: "Risba",
      latin: "Latinsko ime",
    },
    // The Polish grade names, translated: nezadostno (1) to odlično (6), as on a Polish report card.
    grades: [
      {
        value: 1,
        range: "0–3",
        name: "nezadostno",
        title: "Sprehajalec",
        text: "Kandidat zamenjuje Žarnega z Vrtičkarskim, Parkirnega pa s kom, ki je pač slabo parkiral. Inštitut priporoča branje Atlasa in opazovanje za družinsko mizo.",
      },
      {
        value: 2,
        range: "4–5",
        name: "zadostno",
        title: "Turist",
        text: "Kandidat prepozna dziadersa, ko ima ta v roki klešče za žar. Brez klešč izgubi sled. Izpit opravljen pogojno, z obveznim opazovanjem v sezoni peke na žaru.",
      },
      {
        value: 3,
        range: "6–7",
        name: "zadovoljivo",
        title: "Terenski praktikant",
        text: "Kandidat pozna navadne vrste in se znajde pri oglašanju. Regionalne in priložnostne vrste zahtevajo še nekaj dela na terenu, najbolje na svatbi.",
      },
      {
        value: 4,
        range: "8–9",
        name: "dobro",
        title: "Terenski opazovalec III. razreda",
        text: "Kandidat določa vrste zanesljivo in brez določevalnega ključa. Občasno zamenja križance, kar se dogaja tudi Inštitutu.",
      },
      {
        value: 5,
        range: "10–11",
        name: "prav dobro",
        title: "Terenski opazovalec II. razreda",
        text: "Kandidat prepozna dziadersa že po prvem »Veš kaj …«, preden pade preostanek stavka. Izpitna komisija sumi na dolgoletno družinsko prakso.",
      },
      {
        value: 6,
        range: "12",
        name: "odlično",
        title: "Terenski opazovalec I. razreda",
        text: "Brez napake. Kandidat obvlada latinščino, habitate in naravne sovražnike vseh vrst. Komisija vpraša, od kod. Kandidat odgovori, da ima družino.",
      },
    ],
  },
});

/** What kind of clue a question gives, in the edition's language: "Wokalizacja", "Oglašanje". */
export const clueLabel = (kind: ClueKind, locale: Locale) => COPY[locale].labels[kind];

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

/**
 * The twelve questions of an exam, the same on the server and in the browser, and the same in both
 * editions: only the prompts and clues are in the edition's language.
 */
export function questions(seed: number, locale: Locale): Question[] {
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
      prompt: COPY[locale].prompts[kind],
      clue: clueFor(kind, speciesByKey(answer, locale), Math.floor(next() * 7)),
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

/** The six grades in the edition's language, from 1 to 6. */
export const grades = (locale: Locale) => COPY[locale].grades;

export function gradeFor(points: number, locale: Locale): Grade {
  const value = points >= 12 ? 6 : points >= 10 ? 5 : points >= 8 ? 4 : points >= 6 ? 3 : points >= 4 ? 2 : 1;
  return grades(locale)[value - 1];
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

export function evaluateExam(draft: ExamDraft, locale: Locale): ExamResult {
  const list = questions(draft.seed, locale);
  const points = list.filter((question, i) => draft.answers[i] === question.correct).length;
  return {
    ...draft,
    code: encodeExam(draft),
    questions: list,
    points,
    grade: gradeFor(points, locale),
    date: formatDate(locale, new Date(EPOCH + draft.day * 86_400_000), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
    number: `ET/${String(draft.seed % 100_000).padStart(5, "0")}/26`,
  };
}

/** The sample exam on the index page: everything right but two. */
export const SAMPLE_EXAM: ExamDraft = (() => {
  const seed = 424_242;
  const answers = questions(seed, "pl").map((question, i) => (i === 3 || i === 8 ? (question.correct + 1) % OPTIONS : question.correct));
  return { seed, answers, day: (Date.UTC(2026, 9, 2) - EPOCH) / 86_400_000 };
})();
