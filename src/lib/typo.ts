import { LOCALE_INFO, type Locale } from "@/i18n/config";

// One-letter words of both editions: Polish a, i, o, u, w, z and Slovenian v, s, k, h.
const ORPHAN = /(^|[\s(„»])([aiouwzskvhAIOUWZSKVH]|\d+) /g;

// Typesetting: one-letter words and bare numbers never end a line.
// Two passes catch runs like "i w domu" (no lookbehind, for older Safari).
export function typo(text: string) {
  return text.replace(ORPHAN, "$1$2 ").replace(ORPHAN, "$1$2 ");
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const oneDecimal = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** One decimal with a comma: the same in both editions. */
export const pct = (value: number) => oneDecimal.format(value);

const integers: Record<Locale, Intl.NumberFormat> = {
  pl: new Intl.NumberFormat("pl-PL"),
  sl: new Intl.NumberFormat("sl-SI"),
};

/** A whole number in the edition's style: "12 345" in Polish, "12.345" in Slovenian. */
export const formatNumber = (locale: Locale, value: number) => integers[locale].format(value);

/** A date in the edition's style, "3 października 2026" or "3. oktober 2026" by default. */
export function formatDate(locale: Locale, date: Date | string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  const value = typeof date === "string" ? new Date(date.length === 10 ? `${date}T12:00:00Z` : date) : date;
  return new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { timeZone: "Europe/Warsaw", ...options }).format(value);
}

/** Quoted speech: „…” in Polish, »…« in Slovenian. */
export const quote = (text: string, locale: Locale) => (locale === "sl" ? `»${text}«` : `„${text}”`);

const pluralRules = new Intl.PluralRules("pl-PL");

/** Polish plural forms: plural(22, "gatunek", "gatunki", "gatunków") → "gatunki". */
export function plural(count: number, one: string, few: string, many: string) {
  const form = pluralRules.select(count);
  return form === "one" ? one : form === "few" ? few : many;
}

const slovenianRules = new Intl.PluralRules("sl-SI");

/** Slovenian plural forms, dual included: pluralSl(2, "vrsta", "vrsti", "vrste", "vrst") → "vrsti". */
export function pluralSl(count: number, one: string, two: string, few: string, other: string) {
  const form = slovenianRules.select(count);
  return form === "one" ? one : form === "two" ? two : form === "few" ? few : other;
}

export const roman = (value: number) => ["0", "I", "II", "III", "IV", "V"][value] ?? String(value);
