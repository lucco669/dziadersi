import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "./site";

/*
 * Unsubscribe links for the weekly bulletin: the account id and an HMAC of it, so a link works
 * without signing in but cannot be forged for someone else. Signed with CRON_SECRET, which the
 * Monday cron job needs anyway; rotating it invalidates old links, nothing worse.
 */

const SECRET = process.env.CRON_SECRET ?? "";

export const canMail = Boolean(SECRET);

const sign = (id: string) => createHmac("sha256", SECRET).update(`biuletyn:${id}`).digest("base64url").slice(0, 32);

export function verifyUnsubscribe(id: unknown, token: unknown): id is string {
  if (!SECRET || typeof id !== "string" || typeof token !== "string" || !/^[0-9a-f-]{36}$/.test(id)) return false;
  const expected = Buffer.from(sign(id));
  const given = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** The page with the confirm button, and the one-click endpoint for List-Unsubscribe. */
export function unsubscribeLinks(id: string, origin = site.url) {
  const query = `u=${id}&t=${sign(id)}`;
  return { page: `${origin}/biuletyn/wypisz?${query}`, oneClick: `${origin}/api/biuletyn/wypisz?${query}` };
}

/** The Monday of the week a date falls in, as Postgres writes dates: the issue's key. */
export function issueKey(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}
