import type { Task } from "@/content/test";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import type { AnswerCounts } from "./census";
import { reflexOutcome } from "./test";

/** Below this many answers to a task, no share is shown. */
const MIN_ANSWERS = 30;

const COPY = defineCopy({
  pl: {
    inventory: (count: number, percent: number) => `Tyle samo rzeczy (${count}) zaznaczyło ${percent}% badanych.`,
    rapid: (count: number, percent: number) => `Tyle samo razy TAK (${count}) odpowiedziało ${percent}% badanych.`,
    reflex: (percent: number) => `Ten sam wynik próby miało ${percent}% badanych.`,
    words: (percent: number) => `Identyczne skojarzenia miało ${percent}% badanych.`,
    same: (percent: number) => `Tak samo odpowiedziało ${percent}% badanych.`,
  },
  sl: {
    inventory: (count: number, percent: number) => `Enako število stvari (${count}) je označilo ${percent}% preiskovanih.`,
    rapid: (count: number, percent: number) => `Enakokrat DA (${count}) je odgovorilo ${percent}% preiskovanih.`,
    reflex: (percent: number) => `Enak rezultat preizkusa je imelo ${percent}% preiskovanih.`,
    words: (percent: number) => `Enake asociacije je imelo ${percent}% preiskovanih.`,
    same: (percent: number) => `Enako je odgovorilo ${percent}% preiskovanih.`,
  },
});

const ones = (value: number) => {
  let count = 0;
  for (let rest = value; rest > 0; rest = Math.floor(rest / 2)) count += rest % 2;
  return count;
};

/**
 * How many respondents answered a task the way this one did, as a sentence. Ticked things and
 * yes answers compare by count (nobody has the same drawer twice), the horn by its outcome.
 */
export function sameAnswer(task: Task, index: number, value: number, counts: AnswerCounts | null, locale: Locale) {
  const row = counts?.[index];
  if (!row) return null;
  const entries = Object.entries(row).map(([key, n]) => [Number(key), n] as const);
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  if (total < MIN_ANSWERS) return null;
  const share = (match: (other: number) => boolean) =>
    Math.round((entries.filter(([other]) => match(other)).reduce((sum, [, n]) => sum + n, 0) / total) * 100);
  const t = COPY[locale];

  switch (task.kind) {
    case "inventory": {
      const count = ones(value);
      const percent = share((other) => ones(other) === count);
      return { percent, text: t.inventory(count, percent) };
    }
    case "rapid": {
      const count = ones(value);
      const percent = share((other) => ones(other) === count);
      return { percent, text: t.rapid(count, percent) };
    }
    case "reflex": {
      const outcome = reflexOutcome(value).outcome;
      const percent = share((other) => reflexOutcome(other).outcome === outcome);
      return { percent, text: t.reflex(percent) };
    }
    case "words": {
      const percent = share((other) => other === value);
      return { percent, text: t.words(percent) };
    }
    default: {
      const percent = share((other) => other === value);
      return { percent, text: t.same(percent) };
    }
  }
}
