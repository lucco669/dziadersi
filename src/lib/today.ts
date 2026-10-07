import { cacheLife } from "next/cache";
import { warsawDate, warsawTime } from "./calendar";

/**
 * Today's date in Warsaw for pages that change at midnight. Cached for minutes, so the
 * page flips to the next day within a few minutes of midnight and stays prerendered otherwise.
 * The date only: the hour or minute would make every regeneration a new page to store.
 */
export async function getToday() {
  "use cache";
  cacheLife("minutes");
  const now = new Date();
  const { year, month, day } = warsawTime(now);
  return { year, month, day, date: warsawDate(now) };
}
