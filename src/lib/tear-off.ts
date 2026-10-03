import type { Page } from "@/components/tear-off";
import { getCalendar } from "@/content/calendar";
import { getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
import { getSpecies } from "@/content/species";
import type { Locale } from "@/i18n/config";
import type { Sheet } from "./almanac";
import { shuffled } from "./random";

/*
 * What the calendar prints for a day, picked by the date so every visitor sees the same page.
 * The editions' lists keep the Polish order and length, so both print the same page in their language.
 */

const pad = (value: number) => String(value).padStart(2, "0");

/** The page for a day: its front, with the proverb and the Institute's observance. */
export function pageFor(sheet: Sheet, locale: Locale): Page {
  const { PROVERBS, OBSERVANCES } = getCalendar(locale);
  const proverbs = PROVERBS[sheet.month - 1];
  const observance = OBSERVANCES.find((item) => item.date === `${pad(sheet.month)}-${pad(sheet.day)}`);
  return { ...sheet, proverb: proverbs[(sheet.day - 1) % proverbs.length], observance };
}

/** What is on the back of today's page. */
export function backOf(sheet: Sheet, locale: Locale) {
  const { TIPS, ORDERS } = getCalendar(locale);
  const species = getSpecies(locale);
  const dictionary = getDictionary(locale);
  const cases = getCases(locale);
  const day = sheet.dayOfYear - 1;
  return {
    tip: TIPS[(day * 7) % TIPS.length],
    order: ORDERS[(day * 11) % ORDERS.length],
    patron: species[shuffled(species.length, sheet.year)[day % species.length]],
    entry: dictionary[day % dictionary.length],
    case: cases[day % cases.length],
  };
}
