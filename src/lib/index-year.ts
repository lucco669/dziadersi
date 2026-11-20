import { dayOfYear, daysInYear } from "./calendar";
import { measured, ZONES } from "./indeks";

/*
 * A whole year of the Narodowy Indeks Dziaderstwa, for the year-end report. The index is a model,
 * so a year is known in advance: days still to come are the forecast.
 */

const round1 = (value: number) => Math.round(value * 10) / 10;
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

/** Month (1–12) and day of a day of the year, counted from 0. */
const dateOf = (year: number, day: number) => {
  const date = new Date(Date.UTC(year, 0, 1 + day));
  return { month: date.getUTCMonth() + 1, day: date.getUTCDate() };
};

export function indexYear(year: number) {
  const total = daysInYear(year);
  const values = Array.from({ length: total }, (_, day) => measured(year, day));
  const peak = Math.max(...values);
  const low = Math.min(...values);
  return {
    mean: round1(mean(values)),
    peak: { value: peak, ...dateOf(year, values.indexOf(peak)) },
    low: { value: low, ...dateOf(year, values.indexOf(low)) },
    /** Days in each warning zone, in the order of ZONES. */
    zones: ZONES.map((zone, i) => values.filter((value) => value >= zone.from && (value < zone.to || i === ZONES.length - 1)).length),
    /** Days in the clinical zone, as dates. */
    clinical: values.flatMap((value, day) => (value >= ZONES[3].from ? [dateOf(year, day)] : [])),
    months: Array.from({ length: 12 }, (_, i) => {
      const from = dayOfYear(year, i + 1, 1);
      const to = i < 11 ? dayOfYear(year, i + 2, 1) : total;
      return round1(mean(values.slice(from, to)));
    }),
  };
}
