import { cacheLife } from "next/cache";
import type { Locale } from "@/i18n/config";
import { dayOfYear, daysInYear, isoWeek, warsawTime } from "./calendar";
import { measured, milestones, seasonFor, trend, zoneFor } from "./indeks";
import { formatDate } from "./typo";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Everything on the site that depends on today's date, computed once per edition
 * and shared by every visitor. Regenerated in the background every hour.
 * The locale is an argument so that each edition has its own cache entry.
 */
export async function getBulletin(locale: Locale) {
  "use cache";
  cacheLife("hours");

  const now = new Date();
  const local = warsawTime(now);
  const { year } = local;
  const today = dayOfYear(year, local.month, local.day);
  const total = daysInYear(year);

  const season = seasonFor(local.month, local.day, locale);
  const seasonStart = dayOfYear(year, season.from[0], season.from[1]);
  const value = measured(year, today, local.hour);
  const delta = Math.round((value - measured(year, seasonStart)) * 10) / 10;

  return {
    year,
    today,
    total,
    week: isoWeek(year, local.month, local.day),
    date: formatDate(locale, now),
    // Slovenian writes the time with a dot: 14.05.
    time: `${pad(local.hour)}${locale === "sl" ? "." : ":"}${pad(local.minute)}`,
    /** The same moment for machines: `<time>` and schema.org dateModified. */
    updated: now.toISOString(),
    index: {
      value,
      delta,
      season,
      zone: zoneFor(value, locale),
    },
    chart: {
      measured: Array.from({ length: today + 1 }, (_, day) =>
        day === today ? value : measured(year, day),
      ),
      forecast: Array.from({ length: total - today }, (_, i) =>
        i === 0 ? value : trend(year, today + i),
      ),
      milestones: milestones(year, locale).map((milestone) => ({
        ...milestone,
        value: trend(year, milestone.at),
      })),
    },
  };
}

export type Bulletin = Awaited<ReturnType<typeof getBulletin>>;
