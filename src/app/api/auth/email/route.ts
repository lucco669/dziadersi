import type { NextRequest } from "next/server";
import { authLetter } from "@/emails/auth";
import { renderHtml } from "@/emails/layout";
import { canSendEmail, sendLetter } from "@/emails/send";
import { trustedOrigin } from "@/lib/account";
import { site } from "@/lib/site";
import { verifyWebhook } from "@/lib/webhook";

/*
 * Supabase Auth's Send Email Hook: Supabase decides that an email is due and calls this
 * endpoint instead of its own mailer; the Institute writes and sends the letter.
 * Dashboard: Authentication → Hooks → Send Email → HTTPS → https://dziader.si/api/auth/email
 */

type HookPayload = {
  user: { email: string; new_email?: string };
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

/** Supabase shows the hook's error message to the person who asked for the email. */
const failure = (status: number, message: string) => Response.json({ error: { http_code: status, message } }, { status });

export async function POST(request: Request) {
  const body = await request.text();
  if (!verifyWebhook(body, request.headers, SECRET)) return failure(401, "Nieprawidłowy podpis zapytania.");
  if (!canSendEmail) return failure(500, "Poczta Instytutu jest chwilowo nieczynna.");

  let payload: HookPayload;
  try {
    payload = JSON.parse(body) as HookPayload;
  } catch {
    return failure(400, "Nieczytelne zapytanie.");
  }

  const { user, email_data: data } = payload;
  const type = data.email_action_type;
  const target = trustedOrigin(data.redirect_to) ?? trustedOrigin(data.site_url) ?? { origin: site.url, next: "/profil" };
  const link = (hash: string) =>
    `${target.origin}/auth/potwierdz?${new URLSearchParams({ token_hash: hash, type, dalej: target.next })}`;

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
      const letter = authLetter({ type, link: item.hash ? link(item.hash) : undefined, token: item.token || undefined });
      if (letter && item.to) await sendLetter(item.to, letter);
    }
  } catch (error) {
    console.error("Send Email Hook:", error);
    return failure(500, "Nie udało się wysłać wiadomości. Spróbuj za chwilę.");
  }

  return Response.json({});
}

/** Development only: /api/auth/email?podglad=magiclink shows a letter in the browser. */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  const type = request.nextUrl.searchParams.get("podglad") ?? "magiclink";
  const origin = request.nextUrl.origin;
  const letter = authLetter({ type, link: `${origin}/auth/potwierdz?token_hash=podglad&type=${type}`, token: "482915" });
  if (!letter) return new Response(`Brak szablonu dla „${type}”.`, { status: 404 });
  return new Response(renderHtml(letter, origin), { headers: { "content-type": "text/html; charset=utf-8" } });
}
