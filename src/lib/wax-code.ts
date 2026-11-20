/*
 * Reading codes of the Lanie wosku, without the content: the browser pours with a small table
 * the server passes it (`WaxTable`), so it never loads the species or the dictionary.
 *
 * A code is the cast slug, then five base36 digits and the year: "sandal-10k1a7" is cast "sandal",
 * species 1 of the cast (Kempingowy), prophecy "0k" (20), dictionary entry "1a" (46) and the year
 * 2020 + 7. Codes are the same in both editions: the Slovenian lists keep the Polish order. The lists
 * are append-only, so a code always says the same.
 */

export type Picks = { cast: number; species: number; prophecy: number; entry: number; year: number };

/** What pouring needs: cast slugs, the dictionary entries each cast's species may say first, the number of prophecies. */
export type WaxTable = { slugs: string[]; phrases: number[][][]; prophecies: number };

export const CODE = /^([a-z]+)-([0-9a-z])([0-9a-z]{2})([0-9a-z]{2})([0-9a-z])$/;
export const YEAR_BASE = 2020;

const digits = (value: number, length: number) => value.toString(36).padStart(length, "0");

export const encodeReading = (slugs: readonly string[], { cast, species, prophecy, entry, year }: Picks) =>
  `${slugs[cast]}-${digits(species, 1)}${digits(prophecy, 2)}${digits(entry, 2)}${digits(year - YEAR_BASE, 1)}`;

/** The year a cast poured on this day foretells: from July the next year, before that this one. */
export const yearFor = (year: number, month: number) => (month >= 7 ? year + 1 : year);

/** A new reading. `next` is Math.random for a real pour, or a seeded generator for samples. */
export function pour(table: WaxTable, next: () => number, year: number): Picks {
  const pick = (count: number) => Math.min(count - 1, Math.floor(next() * count));
  const cast = pick(table.slugs.length);
  const species = pick(table.phrases[cast].length);
  const phrases = table.phrases[cast][species];
  return { cast, species, prophecy: pick(table.prophecies), entry: phrases[pick(phrases.length)], year };
}

export type WaxSeason = "andrzejki" | "sylwester";

/**
 * When the calendar points to the Pracownia: the week before Andrzejki (29 November) and the days
 * before New Year's Eve. The Slovenian edition knows the custom from New Year's Eve only.
 */
export function waxSeason(month: number, day: number, locale: "pl" | "sl"): WaxSeason | null {
  if (locale === "pl" && month === 11 && day >= 22 && day <= 30) return "andrzejki";
  if (month === 12 && day >= 27) return "sylwester";
  return null;
}
