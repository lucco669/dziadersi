import { getSituations, SITUATIONS, type Situation } from "@/content/phrasebook";
import type { Locale } from "@/i18n/config";
import { random } from "./random";

/*
 * A line code is the situation slug and three base36 digits, one per part:
 * "samochod-3b7" is opener 3, claim 11 and closer 7 of "W samochodzie".
 * Codes are the same in both editions: the Slovenian lists keep the Polish order.
 */

export type Picks = [opener: number, claim: number, closer: number];

export type Line = {
  code: string;
  situation: Situation;
  picks: Picks;
  parts: [opener: string, claim: string, closer: string];
  text: string;
  /** 1-based position among every line of the situation. */
  number: number;
  total: number;
};

const CODE = /^([a-z-]+)-([0-9a-z])([0-9a-z])([0-9a-z])$/;

export const listsOf = (situation: Situation) => [situation.openers, situation.claims, situation.closers] as const;

export const combinations = (situation: Situation) =>
  situation.openers.length * situation.claims.length * situation.closers.length;

export const TOTAL_LINES = SITUATIONS.reduce((sum, situation) => sum + combinations(situation), 0);

export const encodeLine = (situation: Situation, picks: Picks) => `${situation.slug}-${picks.map((pick) => pick.toString(36)).join("")}`;

export function line(situation: Situation, picks: Picks): Line {
  const lists = listsOf(situation);
  const parts = picks.map((pick, i) => lists[i][pick]) as Line["parts"];
  const [o, c, z] = picks;
  return {
    code: encodeLine(situation, picks),
    situation,
    picks,
    parts,
    text: parts.join(" "),
    number: (o * situation.claims.length + c) * situation.closers.length + z + 1,
    total: combinations(situation),
  };
}

export function decodeLine(code: string, locale: Locale): Line | null {
  const match = CODE.exec(code);
  if (!match) return null;
  const situation = getSituations(locale).find((item) => item.slug === match[1]);
  if (!situation) return null;
  const picks = [match[2], match[3], match[4]].map((digit) => parseInt(digit, 36)) as Picks;
  const lists = listsOf(situation);
  return picks.every((pick, i) => pick < lists[i].length) ? line(situation, picks) : null;
}

/** A seeded line: the line of the day, and one sample per situation. The same picks in both editions. */
export function seededLine(seed: number, locale: Locale, situation = getSituations(locale)[seed % SITUATIONS.length]): Line {
  const next = random(seed * 7919 + 17);
  const picks = listsOf(situation).map((list) => Math.floor(next() * list.length)) as Picks;
  return line(situation, picks);
}
