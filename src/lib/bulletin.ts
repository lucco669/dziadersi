import { cacheLife } from "next/cache";
import { dayOfYear, daysInYear, formatDate, isoWeek, warsawTime } from "./calendar";
import { measured, milestones, seasonFor, trend, zoneFor } from "./indeks";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Everything on the site that depends on today's date, computed once
 * and shared by every visitor. Regenerated in the background every hour.
 */
export async function getBulletin() {
  "use cache";
  cacheLife("hours");

  const now = new Date();
  const local = warsawTime(now);
  const { year } = local;
  const today = dayOfYear(year, local.month, local.day);
  const total = daysInYear(year);

  const season = seasonFor(local.month, local.day);
  const seasonStart = dayOfYear(year, season.from[0], season.from[1]);
  const value = measured(year, today, local.hour);
  const delta = Math.round((value - measured(year, seasonStart)) * 10) / 10;

  return {
    year,
    today,
    total,
    week: isoWeek(year, local.month, local.day),
    date: formatDate(now),
    time: `${pad(local.hour)}:${pad(local.minute)}`,
    /** The same moment for machines: `<time>` and schema.org dateModified. */
    updated: now.toISOString(),
    index: {
      value,
      delta,
      season,
      zone: zoneFor(value),
    },
    chart: {
      measured: Array.from({ length: today + 1 }, (_, day) =>
        day === today ? value : measured(year, day),
      ),
      forecast: Array.from({ length: total - today }, (_, i) =>
        i === 0 ? value : trend(year, today + i),
      ),
      milestones: milestones(year).map((milestone) => ({
        ...milestone,
        value: trend(year, milestone.at),
      })),
    },
  };
}

export type Bulletin = Awaited<ReturnType<typeof getBulletin>>;
