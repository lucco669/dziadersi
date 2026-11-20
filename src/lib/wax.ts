import { DICTIONARY, getDictionary, type Entry } from "@/content/dictionary";
import { speciesByKey, type Species, type SpeciesKey } from "@/content/species";
import { CASTS, getWax, PROPHECIES, type Cast } from "@/content/wax";
import type { Locale } from "@/i18n/config";
import { random } from "./random";
import { CODE, encodeReading, pour, YEAR_BASE, type Picks, type WaxTable } from "./wax-code";

/* Readings of the Lanie wosku with their content. Codes and pouring: ./wax-code.ts. */

export type Reading = {
  code: string;
  picks: Picks;
  cast: Cast;
  species: Species;
  prophecy: string;
  entry: Entry;
  /** The year the cast foretells. */
  year: number;
  /** 1-based number of the cast in the catalogue. */
  number: number;
};

const SLUGS = CASTS.map((cast) => cast.slug);

/** Dictionary entries a species says first: its own phrases, or the general ones when it has none. */
export function phrasesOf(species: SpeciesKey) {
  const own = DICTIONARY.flatMap((entry, i) => (entry.species === species ? [i] : []));
  return own.length ? own : DICTIONARY.flatMap((entry, i) => (entry.species ? [] : [i]));
}

/** The table the browser pours with. */
export const waxTable = (): WaxTable => ({
  slugs: SLUGS,
  phrases: CASTS.map((cast) => cast.species.map(phrasesOf)),
  prophecies: PROPHECIES.length,
});

export function reading(picks: Picks, locale: Locale): Reading {
  const wax = getWax(locale);
  const cast = wax.CASTS[picks.cast];
  return {
    code: encodeReading(SLUGS, picks),
    picks,
    cast,
    species: speciesByKey(cast.species[picks.species], locale),
    prophecy: wax.PROPHECIES[picks.prophecy],
    entry: getDictionary(locale)[picks.entry],
    year: picks.year,
    number: picks.cast + 1,
  };
}

export function decodeReading(code: string, locale: Locale): Reading | null {
  const match = CODE.exec(code);
  if (!match) return null;
  const cast = SLUGS.indexOf(match[1]);
  if (cast < 0) return null;
  const [species, prophecy, entry, year] = [match[2], match[3], match[4], match[5]].map((value) => parseInt(value, 36));
  if (species >= CASTS[cast].species.length || prophecy >= PROPHECIES.length || entry >= DICTIONARY.length) return null;
  const picks = { cast, species, prophecy, entry, year: YEAR_BASE + year };
  // Only the canonical spelling decodes, so one reading has one address.
  return encodeReading(SLUGS, picks) === code ? reading(picks, locale) : null;
}

/** One fixed reading per cast, for the catalogue and the prerendered pages. The same in both editions. */
export function sampleReading(cast: number, locale: Locale, year = 2027) {
  const picks = pour(waxTable(), random(907 + cast * 31), year);
  return reading({ ...picks, cast, species: 0, entry: phrasesOf(CASTS[cast].species[0])[0] }, locale);
}
