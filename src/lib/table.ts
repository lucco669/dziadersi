import { getShortTasks } from "@/content/test";
import { cleanName, decodeGroup, encodeResult, GROUP_LIMIT, groupPath, radix } from "./test";
import { isAttemptId } from "./write-policy";

/*
 * Badanie przy stole: one phone, 2–8 people, each answers Formularz IBD-T2S (code version 3).
 * Names stay on the device (sessionStorage while the table is examined) and in the ranking URL,
 * as with the name part of any result code. Nothing here is sent anywhere else.
 */

export const TABLE_MIN = 2;
export const TABLE_MAX = 8;
export const SHORT_LENGTH = getShortTasks("pl").length;

export type TableState = {
  names: string[];
  /** Answers per person, in Formularz IBD-T2S order; a person's list grows as they answer (and keeps answers they went back over). */
  answers: number[][];
  /** The person holding the phone. */
  person: number;
  /** Their task, 0–5. */
  task: number;
  /** Before each person: the handover screen that hides the previous answers. */
  handover: boolean;
  seed: number;
  /** A census key per person, so a reload never counts anyone twice. */
  attempts: string[];
  untimed: boolean;
  /** An existing ranking the table joins ("?grupa="), or "". */
  group: string;
};

/** How many people the table may seat when it joins a ranking that already has members. */
export const tableCapacity = (group: string) => {
  const existing = group ? (decodeGroup(group)?.length ?? GROUP_LIMIT) : 0;
  return Math.max(0, Math.min(TABLE_MAX, GROUP_LIMIT - existing));
};

/** A new table needs two people; a table joining a ranking may add a single latecomer. */
export const tableMinimum = (group: string) => (group ? 1 : TABLE_MIN);

export type NameProblem = "invalid" | "duplicate" | null;

/**
 * The attendance list as it will be printed: each name cleaned like a certificate signature, blank
 * lines left out. Names must survive cleaning and differ: a name is how the ranking tells two people apart.
 */
export function checkNames(raw: string[], minimum = TABLE_MIN) {
  const cleaned = raw.map((value) => (value.trim() ? cleanName(value) : null));
  const folded = cleaned.map((name) => name?.toLocaleLowerCase("pl") ?? null);
  const problems: NameProblem[] = cleaned.map((name, i) =>
    name === null ? null : !name ? "invalid" : folded.indexOf(folded[i]) !== i ? "duplicate" : null,
  );
  const names = cleaned.filter((name): name is string => !!name);
  const few = names.length < minimum;
  return { names, problems, few, ok: !few && problems.every((problem) => problem === null) };
}

/** Result codes of everyone examined, in seating order. */
export const tableCodes = (state: Pick<TableState, "names" | "answers">, day: number) =>
  state.names.map((name, i) => encodeResult({ version: 3, answers: state.answers[i], day, name }));

/** The ranking everyone sees at the end: the joined ranking first, then the table. */
export const tablePath = (codes: string[], group: string) => groupPath([...(group ? group.split(".") : []), ...codes]);

const SHORT = getShortTasks("pl");

/** Progress from sessionStorage, or null when anything about it is off. */
export function readTable(raw: string | null): TableState | null {
  try {
    if (!raw) return null;
    const s = JSON.parse(raw) as TableState;
    if (!s || !Array.isArray(s.names) || !Array.isArray(s.answers) || !Array.isArray(s.attempts)) return null;
    const people = s.names.length;
    if (typeof s.group !== "string" || people > TABLE_MAX || s.answers.length !== people || s.attempts.length !== people) return null;
    if (!checkNames(s.names, tableMinimum(s.group)).ok || s.names.some((name) => cleanName(name) !== name)) return null;
    if (!s.attempts.every(isAttemptId) || !Number.isInteger(s.seed) || typeof s.untimed !== "boolean" || typeof s.handover !== "boolean") return null;
    if ((s.group && !decodeGroup(s.group)) || people > tableCapacity(s.group)) return null;
    if (!Number.isInteger(s.person) || s.person < 0 || s.person >= people) return null;
    if (!Number.isInteger(s.task) || s.task < 0 || s.task >= SHORT_LENGTH) return null;
    const valid = (answers: unknown, min: number, max: number) =>
      Array.isArray(answers) &&
      answers.length >= min &&
      answers.length <= max &&
      answers.every((value, i) => Number.isInteger(value) && value >= 0 && value < radix(SHORT[i]));
    // Everyone before the current person is finished, the current one has reached `task`, nobody after has started.
    const consistent = s.answers.every((answers, i) =>
      i < s.person ? valid(answers, SHORT_LENGTH, SHORT_LENGTH) : i === s.person ? valid(answers, s.task, SHORT_LENGTH - 1) : valid(answers, 0, 0),
    );
    if (!consistent || (s.handover && s.task !== 0)) return null;
    return s;
  } catch {
    return null;
  }
}
