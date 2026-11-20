import { getCalendar, type Observance } from "@/content/calendar";
import type { Locale } from "@/i18n/config";
import { sheetFor, type Sheet } from "./almanac";

/*
 * The Institute's observances as dates: when each one falls next, what falls today, and the
 * year laid out by month. Dates come from the caller (getToday), so pages decide how fresh they are.
 */

export type Day = { year: number; month: number; day: number };

const parts = (item: Observance) => item.date.split("-").map(Number) as [number, number];

/** "20 maja", "20. maj": the day without a year, in the edition's language. */
export function dayLabel(item: Observance, locale: Locale) {
  const [month, day] = parts(item);
  return sheetFor(2001, month, day, locale).date.replace(/ \d{4}$/, "");
}

/** The sheet of the next time the observance falls, today included. */
export function nextSheet(item: Observance, today: Day, locale: Locale): Sheet {
  const [month, day] = parts(item);
  const year = month * 100 + day >= today.month * 100 + today.day ? today.year : today.year + 1;
  return sheetFor(year, month, day, locale);
}

/** Whole days from today to a sheet. */
export const daysUntil = (sheet: Sheet, today: Day) =>
  Math.round((Date.UTC(sheet.year, sheet.month - 1, sheet.day) - Date.UTC(today.year, today.month - 1, today.day)) / 86_400_000);

/** Today's observance, if there is one, and the next ones after it. */
export function observancesFrom(today: Day, locale: Locale, count: number) {
  const all = getCalendar(locale)
    .OBSERVANCES.map((item) => ({ item, sheet: nextSheet(item, today, locale) }))
    .sort((a, b) => a.sheet.key.localeCompare(b.sheet.key));
  const first = all[0];
  const isToday = first !== undefined && daysUntil(first.sheet, today) === 0;
  return { today: isToday ? first : undefined, upcoming: all.slice(isToday ? 1 : 0, (isToday ? 1 : 0) + count) };
}

/** The twelve months, each with its observances in date order. */
export function observancesByMonth(locale: Locale) {
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, name: sheetFor(2001, i + 1, 1, locale).monthName, items: [] as Observance[] }));
  for (const item of getCalendar(locale).OBSERVANCES) months[parts(item)[0] - 1].items.push(item);
  return months;
}

/** The observances before and after one in the calendar year, wrapping round at New Year. */
export function neighbours(item: Observance, locale: Locale) {
  const list = getCalendar(locale).OBSERVANCES;
  const i = list.findIndex((other) => other.date === item.date);
  return { previous: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
}
