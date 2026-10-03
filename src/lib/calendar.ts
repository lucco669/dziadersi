import { LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";

export const TIME_ZONE = "Europe/Warsaw";

const DAY_MS = 86_400_000;

const partsFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

const dayMonthFormats = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, { timeZone: "UTC", day: "numeric", month: "long" }),
  ]),
) as Record<Locale, Intl.DateTimeFormat>;

export type LocalTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

/** Wall-clock time in Poland, regardless of the server's time zone. */
export function warsawTime(date: Date): LocalTime {
  const parts = Object.fromEntries(
    partsFormat.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

export const daysInYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

/** Zero-based: 1 January is day 0. */
export const dayOfYear = (year: number, month: number, day: number) =>
  Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / DAY_MS);

export function isoWeek(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - yearStart) / DAY_MS + 1) / 7);
}

/** Easter Sunday (anonymous Gregorian algorithm), as a day of the year. */
export function easterDay(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return dayOfYear(year, month, day);
}

/** A day of any year: "20 marca" in Polish, "20. marec" in Slovenian. */
export const formatDayMonth = (month: number, day: number, locale: Locale) =>
  dayMonthFormats[locale].format(new Date(Date.UTC(2000, month - 1, day, 12)));

const MONTHS = defineCopy({
  pl: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"],
  sl: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"],
});

/** Short month names for chart axes and calendars, January first. */
export const monthsShort = (locale: Locale) => MONTHS[locale];
