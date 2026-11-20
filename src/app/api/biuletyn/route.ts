import { confirmLetter } from "@/emails/bulletin";
import { canSendEmail, sendLetter } from "@/emails/send";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { canMail, confirmLink, normalizeEmail } from "@/lib/newsletter";
import { site } from "@/lib/site";
import { createAdminClient, hasAdmin } from "@/lib/supabase/admin";
import { limitShared, limitWrite } from "@/lib/write-limit";
import { readWriteBody } from "@/lib/write-policy";

/**
 * The bulletin without an account: an address asks, a letter with a signed confirm link answers
 * (newsletter_guests, double opt-in). 202 whether or not a letter went out, so the form never
 * reveals which addresses are subscribed; one letter an hour per address (in SQL), five requests
 * per network address and sixty letters for everyone per ten minutes (write budgets).
 */
export async function POST(request: Request) {
  const rejected = await limitWrite(request, "newsletter");
  if (rejected) return rejected;
  const body = await readWriteBody(request);
  const email = normalizeEmail(body?.email);
  if (!email) return new Response(null, { status: 400 });
  const lang = typeof body?.jezyk === "string" ? body.jezyk : null;
  const edition = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  if (!hasAdmin || !canMail || !canSendEmail) return new Response(null, { status: 503 });

  const db = createAdminClient();
  const { data: id, error } = await db.rpc("request_newsletter_guest", { p_email: email, p_edition: edition });
  if (error) {
    console.error("Biuletyn, zapis:", error.message);
    return new Response(null, { status: 503 });
  }
  if (typeof id === "string") {
    // Taken back when the letter doesn't go out, so the next try within the hour still sends one.
    const release = () => db.from("newsletter_guests").update({ letter_at: null }).eq("id", id);
    if (!(await limitShared("newsletter-all"))) {
      await release();
      return new Response(null, { status: 429, headers: { "Retry-After": "600" } });
    }
    try {
      await sendLetter(email, confirmLetter(confirmLink(id, edition), edition), edition, site.url, { tags: ["biuletyn-potwierdzenie"] });
    } catch (failure) {
      console.error("Biuletyn, potwierdzenie:", String(failure).slice(0, 200));
      await release();
      return new Response(null, { status: 503 });
    }
  }
  return new Response(null, { status: 202 });
}
