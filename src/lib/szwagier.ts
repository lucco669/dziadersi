import { getReading, getSzwagier, SZWAGIER, type KindKey, type Reading, type Topic } from "@/content/szwagier";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fromBase64Url, toBase64Url } from "./base64url";
import { random, shuffled } from "./random";

/*
 * SZWAGIER 1.9 TDI: reads a question, picks the parts of the answer and writes them down as a code.
 *
 * An answer code is the topic slug, "-", the mode (0 standard, 1 thinking) and one base36 digit per
 * part: kind, opener, core, closer, anecdote, the second anecdote (thinking mode only), then the
 * reasoning steps (three, or six when thinking). "samochod-0021c3a59" is a standard answer about cars.
 * The question may follow after "~" as base64url. Same code, same answer: temperature 0.
 * Codes are shared by both editions; the parts are read in the edition's language.
 */

export type Mode = 0 | 1;

/** Longer questions are cut: the input stops there. */
export const QUESTION_LIMIT = 140;
/** Questions longer than this are interrupted: the answer starts before the question ends. */
const LONG_QUESTION = 110;
const STEP_COUNT: Record<Mode, number> = { 0: 3, 1: 6 };

const COPY = defineCopy({
  pl: {
    done: "Gotowe. Wiedziałem od początku.",
    seconds: (seconds: number) => `Przemyślane w ${seconds} s`,
    garage: (hours: number, minutes: number) => `Przemyślane w garażu: ${hours ? `${hours} godz. ` : ""}${minutes} min`,
  },
  sl: {
    done: "Končano. Vedel sem od začetka.",
    seconds: (seconds: number) => `Premišljeno v ${seconds} s`,
    garage: (hours: number, minutes: number) => `Premišljeno v garaži: ${hours ? `${hours} h ` : ""}${minutes} min`,
  },
});

/** A question asked in each edition, for share cards and samples. */
export const SAMPLE_QUESTION: Record<Locale, string> = {
  pl: "Czy warto kupić elektryka?",
  sl: "Ali se splača kupiti električni avto?",
};

export type Picks = {
  mode: Mode;
  kind: number;
  opener: number;
  core: number;
  closer: number;
  anecdote: number;
  /** The second anecdote, thinking mode only; 0 otherwise. */
  extra: number;
  steps: number[];
};

/** One sentence of an answer; `cite` is the footnote number of an anecdote. */
export type Sentence = { text: string; cite?: number };

export type Answer = {
  /** The code without the question. */
  code: string;
  topic: Topic;
  kind: KindKey;
  picks: Picks;
  /** The question as shown; empty when it was withheld or never given. */
  question: string;
  /** The question had words the Institute does not print. */
  withheld: boolean;
  sentences: Sentence[];
  /** The answer as plain text, footnotes as [1], for copying and reading aloud. */
  text: string;
  sources: string[];
  /** The reasoning trace, the topic's own step and the closing line included. */
  steps: string[];
  /** "Przemyślane w 6 s". */
  thought: string;
};

/** The questions that stop the act: the console shows helpline numbers instead of an answer. */
export type Crisis = { crisis: true };

const KIND_KEYS = SZWAGIER.kinds.map((kind) => kind.key);
const TABOO = ["tabu", "zdrowie"];

/** Lower case, no diacritics, ł → l, anything but letters and digits as single spaces. */
export const foldQuestion = (text: string) =>
  text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** What can be shown and shared of a question: one line, no links, no emoji, at most QUESTION_LIMIT characters. */
export function cleanQuestion(raw: string) {
  return raw
    .normalize("NFC")
    .replace(/[\p{Cc}\p{Cf}\p{Co}\p{Cs}]/gu, " ")
    .replace(/[\p{Extended_Pictographic}\u{FE0F}]/gu, "")
    .replace(/(?:https?:\/\/|www\.)\S+/giu, "(link)")
    .replace(/[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.(?:com|net|org|pl|si|eu|io|info|biz|ru|xyz|app|dev|me|co)\b\S*/giu, "(link)")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, QUESTION_LIMIT)
    .trim();
}

function hits(keyword: string, words: string[], spaced: string) {
  if (keyword.includes(" ")) return spaced.includes(` ${keyword}`);
  if (keyword.endsWith("$")) return words.includes(keyword.slice(0, -1));
  return words.some((word) => word.startsWith(keyword));
}

function readKind(words: string[], asked: boolean, reading: Reading): KindKey {
  let start = 0;
  while (start < Math.min(words.length, 4) && reading.fillers.includes(words[start])) start++;
  const lead = words.slice(start);
  if (lead.length === 0) return asked ? "taknie" : "uwaga";
  if (reading.requests.includes(lead[0])) return "polecenie";
  const at = (i: number, word: string) => lead.slice(i, i + word.split(" ").length).join(" ") === word;
  const marked = (Object.entries(reading.kinds) as [KindKey, string[]][]).filter(([kind]) => kind !== "taknie");
  // A question word at the start says it all; "czy" or "ali" only when no other question word follows.
  for (const [kind, list] of marked) if (list.some((word) => at(0, word) || at(1, word))) return kind;
  if (reading.kinds.taknie?.some((word) => at(0, word))) return "taknie";
  // "A ty wiesz, jak to zrobić?": a question word further in.
  const range = asked ? lead.length : Math.min(lead.length, 4);
  for (const [kind, list] of marked) for (let i = 2; i < range; i++) if (list.some((word) => at(i, word))) return kind;
  return asked ? "taknie" : "uwaga";
}

export type Understanding = {
  crisis: false;
  topic: Topic;
  kind: KindKey;
  withheld: boolean;
  /** The claims of the topic the question calls for by name; empty when any will do. */
  fitting: number[];
};

/** What the question is about and what kind of question it is, or a crisis. */
export function readQuestion(question: string, locale: Locale): Crisis | Understanding {
  const reading = getReading(locale);
  const { topics } = getSzwagier(locale);
  const folded = foldQuestion(question);
  const words = folded.split(" ").filter(Boolean);
  const spaced = ` ${folded} `;
  const bySlug = (slug: string) => topics.find((topic) => topic.slug === slug)!;

  if (reading.crisis.some((keyword) => hits(keyword, words, spaced))) return { crisis: true };
  if (reading.vulgar.some((keyword) => hits(keyword, words, spaced))) {
    return { crisis: false, topic: topics.find((topic) => topic.special === "vulgar")!, kind: "uwaga", withheld: true, fitting: [] };
  }

  const score = (topic: Topic) => (reading.keywords[topic.slug] ?? []).filter((keyword) => hits(keyword, words, spaced)).length;
  let best: Topic | null = null;
  let bestScore = 0;
  for (const topic of topics) {
    if (topic.special) continue;
    const value = score(topic);
    if (value > bestScore) [best, bestScore] = [topic, value];
  }
  // Politics, religion and health win ties: at the table they end the conversation.
  const taboo = TABOO.map(bySlug).filter((topic) => score(topic) > 0 && score(topic) >= bestScore);
  let topic = taboo.sort((a, b) => score(b) - score(a))[0] ?? best;
  if (!topic) topic = score(bySlug("dzieki")) > 0 ? bySlug("dzieki") : score(bySlug("powitanie")) > 0 ? bySlug("powitanie") : bySlug("ogolne");

  const asked = question.trim().endsWith("?");
  const kind = question.trim().length > LONG_QUESTION ? "przerwanie" : readKind(words, asked, reading);

  // The claims named most often in the question.
  const named = Object.entries(reading.about[topic.slug] ?? {})
    .map(([core, keywords]) => ({ core: Number(core), count: keywords.filter((keyword) => hits(keyword, words, spaced)).length }))
    .filter(({ core, count }) => count > 0 && core < topic.cores.length);
  const most = Math.max(0, ...named.map(({ count }) => count));
  const fitting = named.filter(({ count }) => count === most).map(({ core }) => core);
  return { crisis: false, topic, kind, withheld: false, fitting };
}

/** FNV-1a: the same question always gets the same seed. */
function hash(text: string) {
  let value = 0x811c9dc5;
  for (const char of text) {
    value ^= char.codePointAt(0)!;
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}

const digit = (value: number) => value.toString(36);

export const encodeAnswer = (slug: string, picks: Picks) =>
  `${slug}-${picks.mode}${[picks.kind, picks.opener, picks.core, picks.closer, picks.anecdote, ...(picks.mode ? [picks.extra] : []), ...picks.steps].map(digit).join("")}`;

/** The path of an answer's own page (internal form), with the question when it may be shown. */
export const answerPath = (answer: Pick<Answer, "code" | "question">) =>
  `/superinteligencja/${answer.code}${answer.question ? `~${toBase64Url(answer.question)}` : ""}`;

function compose(topic: Topic, picks: Picks, locale: Locale, question: string, withheld: boolean): Answer {
  const brain = getSzwagier(locale);
  const t = COPY[locale];
  const local = brain.topics.find((item) => item.slug === topic.slug)!;
  const anecdotes = picks.mode ? [brain.anecdotes[picks.anecdote], brain.anecdotes[picks.extra]] : [brain.anecdotes[picks.anecdote]];
  const sentences: Sentence[] = local.special
    ? [{ text: local.cores[picks.core] }]
    : [
        { text: brain.kinds[picks.kind].openers[picks.opener] },
        { text: local.cores[picks.core] },
        ...anecdotes.map((anecdote, i) => ({ text: anecdote.text, cite: i + 1 })),
        { text: brain.closers[picks.closer] },
      ];
  const drawn = picks.steps.map((step) => brain.steps[step]);
  const sum = picks.steps.reduce((total, step) => total + step, 0);
  const minutes = 47 + ((sum * 7) % 120);
  return {
    code: encodeAnswer(topic.slug, picks),
    topic: local,
    kind: KIND_KEYS[picks.kind],
    picks,
    question: withheld ? "" : question,
    withheld,
    sentences,
    text: sentences.map((sentence) => (sentence.cite ? `${sentence.text} [${sentence.cite}]` : sentence.text)).join(" "),
    sources: local.special ? [] : anecdotes.map((anecdote) => anecdote.source),
    steps: [...drawn.slice(0, 2), local.step, ...drawn.slice(2), t.done],
    thought: picks.mode ? t.garage(Math.floor(minutes / 60), minutes % 60) : t.seconds(3 + (sum % 9)),
  };
}

/** Asks SZWAGIER. The same question in the same mode always gets the same answer. */
export function ask(question: string, mode: Mode, locale: Locale): Answer | Crisis | null {
  const shown = cleanQuestion(question);
  if (!foldQuestion(shown)) return null;
  const read = readQuestion(question, locale);
  if (read.crisis) return read;
  const { topic, kind, withheld, fitting } = read;
  const seed = hash(`${mode}:${foldQuestion(question)}`);
  const next = random(seed);
  const pick = (length: number) => Math.floor(next() * length);
  const kindIndex = KIND_KEYS.indexOf(kind);
  const special = Boolean(topic.special);
  const anecdote = special ? 0 : pick(SZWAGIER.anecdotes.length);
  let extra = 0;
  if (mode === 1 && !special) {
    extra = pick(SZWAGIER.anecdotes.length - 1);
    if (extra >= anecdote) extra++;
  }
  const picks: Picks = {
    mode,
    kind: special ? 0 : kindIndex,
    opener: special ? 0 : pick(SZWAGIER.kinds[kindIndex].openers.length),
    core: fitting.length ? fitting[pick(fitting.length)] : pick(topic.cores.length),
    closer: special ? 0 : pick(SZWAGIER.closers.length),
    anecdote,
    extra,
    steps: shuffled(SZWAGIER.steps.length, seed ^ 0x2545f491).slice(0, STEP_COUNT[mode]),
  };
  return compose(topic, picks, locale, shown, withheld);
}

/** The sample question's answer in the edition: share cards and the prerendered answer page. */
export function sampleAnswer(locale: Locale): Answer {
  const answer = ask(SAMPLE_QUESTION[locale], 0, locale);
  if (!answer || "crisis" in answer) throw new Error("The sample question must get an answer.");
  return answer;
}

const CODE = /^([a-z]+)-([01])([0-9a-z]+)(?:~([A-Za-z0-9_-]{2,400}))?$/;

/** An answer from its code (and question), or null when the code is not one SZWAGIER could have given. */
export function decodeAnswer(input: string, locale: Locale): Answer | null {
  const match = CODE.exec(input);
  if (!match) return null;
  const topic = SZWAGIER.topics.find((item) => item.slug === match[1]);
  if (!topic) return null;
  const mode = Number(match[2]) as Mode;
  const digits = [...match[3]].map((char) => parseInt(char, 36));
  if (digits.length !== 5 + mode + STEP_COUNT[mode]) return null;
  const [kind, opener, core, closer, anecdote] = digits;
  const picks: Picks = { mode, kind, opener, core, closer, anecdote, extra: mode ? digits[5] : 0, steps: digits.slice(5 + mode) };

  const { kinds, anecdotes, closers, steps } = SZWAGIER;
  const valid = topic.special
    ? kind === 0 && opener === 0 && closer === 0 && anecdote === 0 && picks.extra === 0
    : kind < kinds.length &&
      opener < kinds[kind].openers.length &&
      closer < closers.length &&
      anecdote < anecdotes.length &&
      (mode === 0 || (picks.extra < anecdotes.length && picks.extra !== anecdote));
  if (!valid || core >= topic.cores.length) return null;
  if (picks.steps.some((step, i) => step >= steps.length || picks.steps.indexOf(step) !== i)) return null;

  const withheld = topic.special === "vulgar";
  let question = match[4] && !withheld ? cleanQuestion(fromBase64Url(match[4])) : "";
  // A question typed into a link by hand passes the same checks as one typed into the console.
  if (question) {
    const read = readQuestion(question, locale);
    if (read.crisis || read.withheld) question = "";
  }
  return compose(topic, picks, locale, question, withheld);
}
