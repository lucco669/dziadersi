import { cacheLife } from "next/cache";
import { warsawTime } from "./calendar";

/**
 * Today's date in Warsaw for pages that change at midnight. Cached for minutes, so the
 * page flips to the next day within a few minutes of midnight and stays prerendered otherwise.
 */
export async function getToday() {
  "use cache";
  cacheLife("minutes");
  const now = new Date();
  return { ...warsawTime(now), at: now.toISOString() };
}
