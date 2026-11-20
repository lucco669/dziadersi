import { CHAPTERS, getWishChapters, getWishOccasions, OCCASIONS, type WishChapter, type WishOccasion } from "@/content/wishes";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { formatNumber } from "./typo";
import { random } from "./random";

/*
 * A card code is the chapter slug and three base36 digits, one per sentence: "swieta-wujek-3b7" is
 * opener 3, wish 11 and closing line 7 of "Dla wujka". Codes are the same in both editions: the
 * Slovenian lists keep the Polish order. The machine is the Rozmówki's (src/lib/phrasebook.ts).
 */

export type WishPicks = [opener: number, wish: number, closer: number];

export type Wish = {
  code: string;
  chapter: WishChapter;
  occasion: WishOccasion;
  picks: WishPicks;
  parts: [opener: string, wish: string, closer: string];
  text: string;
  /** 1-based position among every card of the chapter. */
  number: number;
  total: number;
};

/** The letter's fixed words, the same on the page and in every image. */
export const LETTER = defineCopy({
  pl: {
    institute: "Instytut Badań nad Dziaderstwem",
    department: "Dział Korespondencji Okolicznościowej",
    reference: (chapter: number, number: number) => `Nasz znak: IBD-Ż/${chapter}/${number}`,
    regards: "Z wyrazami szacunku",
    signature: "IBD",
  },
  sl: {
    institute: "Inštitut za raziskave dziaderstva",
    department: "Oddelek za priložnostno korespondenco",
    reference: (chapter: number, number: number) => `Naša oznaka: IBD-V/${chapter}/${formatNumber("sl", number)}`,
    regards: "S spoštovanjem",
    signature: "IBD",
  },
});

const CODE = /^([a-z-]+)-([0-9a-z])([0-9a-z])([0-9a-z])$/;

export const wishLists = (chapter: WishChapter) => [chapter.openers, chapter.wishes, chapter.closers] as const;

export const wishCombinations = (chapter: WishChapter) => chapter.openers.length * chapter.wishes.length * chapter.closers.length;

export const TOTAL_WISHES = CHAPTERS.reduce((sum, chapter) => sum + wishCombinations(chapter), 0);

export const encodeWish = (chapter: WishChapter, picks: WishPicks) => `${chapter.slug}-${picks.map((pick) => pick.toString(36)).join("")}`;

export function wish(chapter: WishChapter, picks: WishPicks, locale: Locale): Wish {
  const lists = wishLists(chapter);
  const parts = picks.map((pick, i) => lists[i][pick]) as Wish["parts"];
  const [o, w, z] = picks;
  return {
    code: encodeWish(chapter, picks),
    chapter,
    occasion: getWishOccasions(locale).find((item) => item.slug === chapter.occasion)!,
    picks,
    parts,
    text: parts.join(" "),
    number: (o * chapter.wishes.length + w) * chapter.closers.length + z + 1,
    total: wishCombinations(chapter),
  };
}

export function decodeWish(code: string, locale: Locale): Wish | null {
  const match = CODE.exec(code);
  if (!match) return null;
  const chapter = getWishChapters(locale).find((item) => item.slug === match[1]);
  if (!chapter) return null;
  const picks = [match[2], match[3], match[4]].map((digit) => parseInt(digit, 36)) as WishPicks;
  const lists = wishLists(chapter);
  return picks.every((pick, i) => pick < lists[i].length) ? wish(chapter, picks, locale) : null;
}

/** A seeded card of a chapter: the card of the day, and the samples. The same picks in both editions. */
export function seededWish(seed: number, chapter: WishChapter, locale: Locale): Wish {
  const next = random(seed * 7919 + 29);
  const picks = wishLists(chapter).map((list) => Math.floor(next() * list.length)) as WishPicks;
  return wish(chapter, picks, locale);
}

/** The chapter's 1-based place, for the reference number on the letter. */
export const chapterNumber = (chapter: WishChapter) => CHAPTERS.findIndex((item) => item.slug === chapter.slug) + 1;

const monthDay = (month: number, day: number) => month * 100 + day;
const parse = (value: string) => {
  const [month, day] = value.split("-").map(Number);
  return monthDay(month, day);
};

/** Whether a date falls in the occasion's season; a season may wrap the new year. */
export function inSeason(occasion: WishOccasion, month: number, day: number) {
  const today = monthDay(month, day);
  const from = parse(occasion.season.from);
  const to = parse(occasion.season.to);
  return from <= to ? today >= from && today <= to : today >= from || today <= to;
}

/** The occasion in season on a date, if any. */
export const occasionInSeason = (month: number, day: number) => OCCASIONS.find((occasion) => inSeason(occasion, month, day));

/** The chapter offered first on a date: the first of the occasion in season, else the first chapter. */
export function chapterFor(month: number, day: number, locale: Locale): WishChapter {
  const occasion = occasionInSeason(month, day);
  const chapters = getWishChapters(locale);
  return chapters.find((chapter) => chapter.occasion === occasion?.slug) ?? chapters[0];
}

/** The card as plain text, for messages: salutation, the three sentences and the sign-off. */
export function wishMessage(card: Wish, locale: Locale) {
  const t = LETTER[locale];
  const signature = card.chapter.cosigner ? `${t.signature}, ${card.chapter.cosigner}` : t.signature;
  return `${card.chapter.salutation}\n${card.text}\n${t.regards},\n${signature}`;
}

/** The greetings occasion linked from a field guide or a bingo occasion ("wigilia"), if any. */
export const occasionForDossier = (bingo: string) => OCCASIONS.find((occasion) => occasion.dossier === bingo);
