import type { Task } from "@/content/test";
import type { AnswerCounts } from "./census";
import { reflexOutcome } from "./test";

/** Below this many answers to a task, no share is shown. */
const MIN_ANSWERS = 30;

const ones = (value: number) => {
  let count = 0;
  for (let rest = value; rest > 0; rest = Math.floor(rest / 2)) count += rest % 2;
  return count;
};

/**
 * How many respondents answered a task the way this one did, as a sentence. Ticked things and
 * yes answers compare by count (nobody has the same drawer twice), the horn by its outcome.
 */
export function sameAnswer(task: Task, index: number, value: number, counts: AnswerCounts | null) {
  const row = counts?.[index];
  if (!row) return null;
  const entries = Object.entries(row).map(([key, n]) => [Number(key), n] as const);
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  if (total < MIN_ANSWERS) return null;
  const share = (match: (other: number) => boolean) =>
    Math.round((entries.filter(([other]) => match(other)).reduce((sum, [, n]) => sum + n, 0) / total) * 100);

  switch (task.kind) {
    case "inventory": {
      const count = ones(value);
      const percent = share((other) => ones(other) === count);
      return { percent, text: `Tyle samo rzeczy (${count}) zaznaczyło ${percent}% badanych.` };
    }
    case "rapid": {
      const count = ones(value);
      const percent = share((other) => ones(other) === count);
      return { percent, text: `Tyle samo razy TAK (${count}) odpowiedziało ${percent}% badanych.` };
    }
    case "reflex": {
      const outcome = reflexOutcome(value).outcome;
      const percent = share((other) => reflexOutcome(other).outcome === outcome);
      return { percent, text: `Ten sam wynik próby miało ${percent}% badanych.` };
    }
    case "words": {
      const percent = share((other) => other === value);
      return { percent, text: `Identyczne skojarzenia miało ${percent}% badanych.` };
    }
    default: {
      const percent = share((other) => other === value);
      return { percent, text: `Tak samo odpowiedziało ${percent}% badanych.` };
    }
  }
}
