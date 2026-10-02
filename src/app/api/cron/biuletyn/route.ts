import type { NextRequest } from "next/server";
import { bulletinLetter, type Recipient } from "@/emails/bulletin";
import { renderHtml } from "@/emails/layout";
import { canSendEmail, sendLetter } from "@/emails/send";
import { getBulletin } from "@/lib/bulletin";
import { warsawTime } from "@/lib/calendar";
import { getWeekly } from "@/lib/community";
import { canMail, issueKey, unsubscribeLinks } from "@/lib/newsletter";
import { site } from "@/lib/site";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { composeIssue } from "@/lib/weekly";

/** How many letters go out at once. */
const BATCH = 5;

const SAMPLE: Recipient = { nickname: "Zenek", results: 3, sightings_week: 4, verdicts: 12, pages_week: 5 };

/**
 * The weekly bulletin, sent by Vercel Cron (vercel.json) on Monday morning.
 * Authorised with CRON_SECRET; one issue per week (bulletin_issues), so a retry never sends twice.
 * In development, ?podglad shows the letter in the browser.
 */
export async function GET(request: NextRequest) {
  const now = warsawTime(new Date());
  const [weekly, bulletin] = await Promise.all([getWeekly(), getBulletin()]);
  const issue = composeIssue(weekly, bulletin, now);

  if (process.env.NODE_ENV === "development" && request.nextUrl.searchParams.has("podglad")) {
    const origin = request.nextUrl.origin;
    const letter = bulletinLetter(issue, SAMPLE, origin, `${origin}/biuletyn/wypisz?u=podglad&t=podglad`);
    return new Response(renderHtml(letter, origin), { headers: { "content-type": "text/html; charset=utf-8" } });
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
  for (let i = 0; i < recipients.length; i += BATCH) {
    const results = await Promise.allSettled(
      recipients.slice(i, i + BATCH).map((recipient) => {
        const links = unsubscribeLinks(recipient.id, site.url);
        return sendLetter(recipient.email, bulletinLetter(issue, recipient, site.url, links.page), site.url, {
          tags: ["biuletyn"],
          headers: { "List-Unsubscribe": `<${links.oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        });
      }),
    );
    for (const result of results) {
      if (result.status === "fulfilled") sent++;
      else console.error("Biuletyn:", String(result.reason).slice(0, 200));
    }
  }

  await admin.from("bulletin_issues").update({ recipients: recipients.length, sent }).eq("week", week);
  return Response.json({ week, recipients: recipients.length, sent });
}
