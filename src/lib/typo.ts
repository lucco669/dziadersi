const ORPHAN = /(^|[\s(„])([aiouwzAIOUWZ]|\d+) /g;

// Polish typesetting: one-letter words and bare numbers never end a line.
// Two passes catch runs like "i w domu" (no lookbehind, for older Safari).
export function typo(text: string) {
  return text.replace(ORPHAN, "$1$2\u00a0").replace(ORPHAN, "$1$2\u00a0");
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const oneDecimal = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const pct = (value: number) => oneDecimal.format(value);

const pluralRules = new Intl.PluralRules("pl-PL");

/** Polish plural forms: plural(22, "gatunek", "gatunki", "gatunków") → "gatunki". */
export function plural(count: number, one: string, few: string, many: string) {
  const form = pluralRules.select(count);
  return form === "one" ? one : form === "few" ? few : many;
}

export const roman = (value: number) => ["0", "I", "II", "III", "IV", "V"][value] ?? String(value);
