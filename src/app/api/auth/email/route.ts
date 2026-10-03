import type { NextRequest } from "next/server";
import { authLetter } from "@/emails/auth";
import { renderHtml } from "@/emails/layout";
import { canSendEmail, sendLetter } from "@/emails/send";
import { DEFAULT_LOCALE, hasLocale, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath, parsePath } from "@/i18n/routes";
import { accountEdition, trustedOrigin } from "@/lib/account";
import { site } from "@/lib/site";
import { verifyWebhook } from "@/lib/webhook";

/*
 * Supabase Auth's Send Email Hook: Supabase decides that an email is due and calls this
 * endpoint instead of its own mailer; the Institute writes and sends the letter.
 * Dashboard: Authentication → Hooks → Send Email → HTTPS → https://dziader.si/api/auth/email
 */

type HookPayload = {
  user: { email: string; new_email?: string; user_metadata?: Record<string, unknown> };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new: string;
    token_hash_new: string;
  };
};

const SECRET = process.env.SEND_EMAIL_HOOK_SECRET ?? "";

const COPY = defineCopy({
  pl: {
    closed: "Poczta Instytutu jest chwilowo nieczynna.",
    failed: "Nie udało się wysłać wiadomości. Spróbuj za chwilę.",
  },
  sl: {
    closed: "Pošta Inštituta je začasno zaprta.",
    failed: "Sporočila ni bilo mogoče poslati. Poskusi znova čez trenutek.",
  },
});

/** Supabase shows the hook's error message to the person who asked for the email. */
const failure = (status: number, message: string) => Response.json({ error: { http_code: status, message } }, { status });

/**
 * The edition a letter is written in. The page the reader asked from says it best: the sign-in form
 * sends a public path as the redirect, "/sl/…" from the Slovenian edition. Without one (notices carry
 * none, and Supabase falls back to the bare Site URL when a redirect is not allowed), the edition
 * remembered on the account; Polish when neither knows.
 */
function editionOf(user: HookPayload["user"], requested: { next: string } | null): Locale {
  if (requested && requested.next !== "/") return parsePath(requested.next).locale;
  return accountEdition(user) ?? DEFAULT_LOCALE;
}

export async function POST(request: Request) {
  const body = await request.text();
  if (!verifyWebhook(body, request.headers, SECRET)) return failure(401, "Nieprawidłowy podpis zapytania.");

  let payload: HookPayload;
  try {
    payload = JSON.parse(body) as HookPayload;
  } catch {
    return failure(400, "Nieczytelne zapytanie.");
  }

  const { user, email_data: data } = payload;
  const type = data.email_action_type;
  const requested = trustedOrigin(data.redirect_to);
  const locale = editionOf(user, requested);
  const t = COPY[locale];
  if (!canSendEmail) return failure(500, t.closed);

  const target = requested ?? trustedOrigin(data.site_url) ?? { origin: site.url, next: "/profil" };
  // A public path already; only a bare Site URL becomes the edition's front page.
  const next = localizePath(target.next, locale);
  const link = (hash: string) => `${target.origin}/auth/potwierdz?${new URLSearchParams({ token_hash: hash, type, dalej: next })}`;

  // Secure email change sends two letters, and Supabase swaps the field suffixes:
  // the current address gets token + token_hash_new, the new address token_new + token_hash.
  const letters: { to: string; token?: string; hash?: string }[] =
    type === "email_change" && user.new_email && data.token_hash_new && data.token_hash
      ? [
          { to: user.email, token: data.token, hash: data.token_hash_new },
          { to: user.new_email, token: data.token_new, hash: data.token_hash },
        ]
      : type === "email_change"
        ? [{ to: user.new_email || user.email, token: data.token || data.token_new, hash: data.token_hash || data.token_hash_new }]
        : [{ to: user.email, token: data.token, hash: data.token_hash }];

  try {
    for (const item of letters) {
      const letter = authLetter({ type, link: item.hash ? link(item.hash) : undefined, token: item.token || undefined }, locale);
      if (letter && item.to) await sendLetter(item.to, letter, locale);
    }
  } catch (error) {
    console.error("Send Email Hook:", error);
    return failure(500, t.failed);
  }

  return Response.json({});
}

/** Development only: /api/auth/email?podglad=magiclink shows a letter in the browser; &jezyk=sl in Slovenian. */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  const params = request.nextUrl.searchParams;
  const type = params.get("podglad") ?? "magiclink";
  const lang = params.get("jezyk");
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const origin = request.nextUrl.origin;
  const letter = authLetter({ type, link: `${origin}/auth/potwierdz?token_hash=podglad&type=${type}`, token: "482915" }, locale);
  if (!letter) return new Response(`Brak szablonu dla „${type}”.`, { status: 404 });
  return new Response(renderHtml(letter, locale, origin), { headers: { "content-type": "text/html; charset=utf-8" } });
}
