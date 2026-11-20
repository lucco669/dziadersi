import { createHmac, timingSafeEqual } from "node:crypto";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { site } from "./site";

/*
 * Signed links for the weekly bulletin: an id (an account's, or a guest subscription's from
 * newsletter_guests) and an HMAC of it, so a link works without signing in but cannot be forged
 * for someone else. Unsubscribe and confirm links sign different purposes, so one can't stand in
 * for the other. Signed with CRON_SECRET, which the Monday cron job needs anyway; rotating it
 * invalidates old links, nothing worse.
 */

const SECRET = process.env.CRON_SECRET ?? "";

export const canMail = Boolean(SECRET);

type Purpose = "biuletyn" | "potwierdz";

const sign = (id: string, purpose: Purpose = "biuletyn") =>
  createHmac("sha256", SECRET).update(`${purpose}:${id}`).digest("base64url").slice(0, 32);

function verify(purpose: Purpose, id: unknown, token: unknown): id is string {
  if (!SECRET || typeof id !== "string" || typeof token !== "string" || !/^[0-9a-f-]{36}$/.test(id)) return false;
  const expected = Buffer.from(sign(id, purpose));
  const given = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** An unsubscribe link: for an account (profiles.newsletter) or a guest (newsletter_guests). */
export const verifyUnsubscribe = (id: unknown, token: unknown): id is string => verify("biuletyn", id, token);

/** A guest's confirm link from the double opt-in letter. */
export const verifyConfirm = (id: unknown, token: unknown): id is string => verify("potwierdz", id, token);

/** Unconfirmed guest addresses are deleted after this many days (daily cleanup, privacy policy). */
export const GUEST_PENDING_DAYS = 7;

/** A plausible address, trimmed and lower-cased, or null. The real check is the confirm letter. */
export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length >= 6 && email.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : null;
}

/**
 * The page with the confirm button, and the one-click endpoint for List-Unsubscribe, in the reader's
 * edition: the page at its public path ("/sl/bilten/odjava"), the endpoint with the edition for mail
 * clients that open it instead of posting to it. Polish links carry no edition.
 */
export function unsubscribeLinks(id: string, locale: Locale, origin = site.url) {
  const query = `u=${id}&t=${sign(id)}`;
  const edition = locale === DEFAULT_LOCALE ? "" : `&jezyk=${locale}`;
  return {
    page: `${origin}${localizePath("/biuletyn/wypisz", locale)}?${query}`,
    oneClick: `${origin}/api/biuletyn/wypisz?${query}${edition}`,
  };
}

/** A guest's confirm page ("/sl/bilten/potrditev"): a button, so link scanners can't subscribe anyone. */
export function confirmLink(id: string, locale: Locale, origin = site.url) {
  return `${origin}${localizePath("/biuletyn/potwierdz", locale)}?u=${id}&t=${sign(id, "potwierdz")}`;
}

/** The Monday of the week a date falls in, as Postgres writes dates: the issue's key. */
export function issueKey(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}
