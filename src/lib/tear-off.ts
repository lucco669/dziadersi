import type { Page } from "@/components/tear-off";
import { OBSERVANCES, ORDERS, PROVERBS, TIPS } from "@/content/calendar";
import { CASES } from "@/content/cases";
import { DICTIONARY } from "@/content/dictionary";
import { SPECIES } from "@/content/species";
import type { Sheet } from "./almanac";
import { shuffled } from "./random";

/* What the calendar prints for a day, picked by the date so every visitor sees the same page. */

const pad = (value: number) => String(value).padStart(2, "0");
const observanceOn = (sheet: Sheet) => OBSERVANCES.find((item) => item.date === `${pad(sheet.month)}-${pad(sheet.day)}`);

/** The page for a day: its front, with the proverb and the Institute's observance. */
export function pageFor(sheet: Sheet): Page {
  const proverbs = PROVERBS[sheet.month - 1];
  return { ...sheet, proverb: proverbs[(sheet.day - 1) % proverbs.length], observance: observanceOn(sheet) };
}

/** What is on the back of today's page. */
export function backOf(sheet: Sheet) {
  const day = sheet.dayOfYear - 1;
  return {
    tip: TIPS[(day * 7) % TIPS.length],
    order: ORDERS[(day * 11) % ORDERS.length],
    patron: SPECIES[shuffled(SPECIES.length, sheet.year)[day % SPECIES.length]],
    entry: DICTIONARY[day % DICTIONARY.length],
    case: CASES[day % CASES.length],
  };
}
