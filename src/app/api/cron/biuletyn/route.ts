import type { NextRequest } from "next/server";
import { bulletinLetter, type Recipient } from "@/emails/bulletin";
import { renderHtml } from "@/emails/layout";
import { canSendEmail, sendLetter } from "@/emails/send";
import { DEFAULT_LOCALE, hasLocale, LOCALES, type Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { accountEdition } from "@/lib/account";
import { getBulletin } from "@/lib/bulletin";
import { warsawTime } from "@/lib/calendar";
import { getWeekly } from "@/lib/community";
import { canMail, issueKey, unsubscribeLinks } from "@/lib/newsletter";
import { site } from "@/lib/site";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { composeIssue, type Issue } from "@/lib/weekly";

/** How many letters go out at once. */
const BATCH = 5;

const SAMPLE: Recipient = { nickname: "Zenek", results: 3, sightings_week: 4, verdicts: 12, pages_week: 5 };

type Admin = ReturnType<typeof createAdminClient>;

/**
 * The edition a subscriber reads the letter in: the one the account remembers from signing in
 * (user metadata, src/lib/account.ts), so a reader of the Slovenian edition gets the Slovenian letter.
 * newsletter_recipients() doesn't return it, so it comes from the Auth admin API. Polish when the
 * account remembers none (older accounts, Polish readers) or the lookup fails: the letter still goes out.
 */
async function editionOf(admin: Admin, id: string): Promise<Locale> {
  const { data, error } = await admin.auth.admin.getUserById(id);
  if (error) {
    console.error("Biuletyn, wydanie:", error.message);
    return DEFAULT_LOCALE;
  }
  return accountEdition(data.user) ?? DEFAULT_LOCALE;
}

/**
 * The weekly bulletin, sent by Vercel Cron (vercel.json) on Monday morning.
 * Authorised with CRON_SECRET; one issue per week (bulletin_issues), so a retry never sends twice.
 * Each subscriber gets the issue of their edition, with links into it.
 * In development, ?podglad shows the letter in the browser; &jezyk=sl in Slovenian.
 */
export async function GET(request: NextRequest) {
  const now = warsawTime(new Date());
  const [weekly, bulletins] = await Promise.all([getWeekly(), Promise.all(LOCALES.map((locale) => getBulletin(locale)))]);
  const issues = Object.fromEntries(LOCALES.map((locale, i) => [locale, composeIssue(weekly, bulletins[i], now, locale)])) as Record<Locale, Issue>;

  if (process.env.NODE_ENV === "development" && request.nextUrl.searchParams.has("podglad")) {
    const origin = request.nextUrl.origin;
    const lang = request.nextUrl.searchParams.get("jezyk");
    const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
    const sample = locale === "sl" ? { ...SAMPLE, nickname: "Jože" } : SAMPLE;
    const letter = bulletinLetter(issues[locale], sample, origin, `${origin}${localizePath("/biuletyn/wypisz", locale)}?u=podglad&t=podglad`, locale);
    return new Response(renderHtml(letter, locale, origin), { headers: { "content-type": "text/html; charset=utf-8" } });
  }

  if (!canMail || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response(null, { status: 401 });
  }
  if (!hasAdmin || !canSendEmail) return Response.json({ sent: 0, reason: "Brak konfiguracji Supabase albo Brevo." });

  const admin = createAdminClient();
  const week = issueKey(now.year, now.month, now.day);
  const { error: taken } = await admin.from("bulletin_issues").insert({ week });
  if (taken) return Response.json({ sent: 0, reason: `Numer z tygodnia ${week} już wysłano albo wysyłka trwa.` });

  const { data, error } = await admin.rpc("newsletter_recipients");
  if (error) {
    console.error("Biuletyn:", error.message);
    return new Response(null, { status: 500 });
  }
  const recipients = ((data ?? []) as (Recipient & { id: string; email: string })[]).map((row) => ({
    ...row,
    results: Number(row.results),
    sightings_week: Number(row.sightings_week),
    verdicts: Number(row.verdicts),
    pages_week: Number(row.pages_week),
  }));

  let sent = 0;
  const editions = Object.fromEntries(LOCALES.map((locale) => [locale, 0])) as Record<Locale, number>;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const results = await Promise.allSettled(
      recipients.slice(i, i + BATCH).map(async (recipient) => {
        const locale = await editionOf(admin, recipient.id);
        const links = unsubscribeLinks(recipient.id, locale);
        await sendLetter(recipient.email, bulletinLetter(issues[locale], recipient, site.url, links.page, locale), locale, site.url, {
          tags: ["biuletyn"],
          headers: { "List-Unsubscribe": `<${links.oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        });
        return locale;
      }),
    );
    for (const result of results) {
      if (result.status === "fulfilled") {
        sent++;
        editions[result.value]++;
      } else console.error("Biuletyn:", String(result.reason).slice(0, 200));
    }
  }

  await admin.from("bulletin_issues").update({ recipients: recipients.length, sent }).eq("week", week);
  return Response.json({ week, recipients: recipients.length, sent, editions });
}
