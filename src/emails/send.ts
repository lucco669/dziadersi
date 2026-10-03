import type { Locale } from "@/i18n/config";
import { siteCopy } from "@/lib/site";
import { renderHtml, renderText, type Letter } from "./layout";

/*
 * Sending through Brevo's transactional API (no SDK needed). The sender address must be
 * a verified sender in Brevo, ideally on the authenticated domain dziader.si (SPF and DKIM).
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Instytut Badań nad Dziaderstwem <instytut@dziader.si>";
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO;

export const canSendEmail = Boolean(BREVO_API_KEY);

/** "Name <address>" or a bare address, as Brevo wants it. */
function contact(value: string) {
  const match = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(value);
  return match ? { name: match[1].replace(/^"|"$/g, ""), email: match[2] } : { email: value.trim() };
}

/** The sender; when it signs with the Institute's Polish name, letters of other editions carry their own. */
function sender(locale: Locale) {
  const from = contact(EMAIL_FROM);
  return "name" in from && from.name === siteCopy("pl").institute ? { ...from, name: siteCopy(locale).institute } : from;
}

/** Sends a letter written in the edition `locale`, on that edition's letterhead. */
export async function sendLetter(
  to: string,
  letter: Letter,
  locale: Locale,
  origin?: string,
  options: { tags?: string[]; headers?: Record<string, string> } = {},
) {
  if (!canSendEmail) throw new Error("Brak BREVO_API_KEY.");
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: sender(locale),
      to: [{ email: to }],
      subject: letter.subject,
      htmlContent: renderHtml(letter, locale, origin),
      textContent: renderText(letter, locale),
      tags: options.tags ?? ["auth"],
      ...(options.headers ? { headers: options.headers } : {}),
      ...(EMAIL_REPLY_TO ? { replyTo: contact(EMAIL_REPLY_TO) } : {}),
    }),
  });
  if (!response.ok) {
    throw new Error(`Brevo ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
}
