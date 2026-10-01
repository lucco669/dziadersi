// Polish typesetting: one-letter words and bare numbers never end a line.
export function typo(text: string) {
  return text.replace(/(?<=^|[\s(„])([aiouwzAIOUWZ]|\d+) /g, "$1 ");
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const oneDecimal = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const pct = (value: number) => oneDecimal.format(value);

export const roman = (value: number) => ["0", "I", "II", "III", "IV", "V"][value] ?? String(value);
