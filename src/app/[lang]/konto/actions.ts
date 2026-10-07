"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { EDITION_KEY, emailRedirectUrl, formEdition, isEmail, rememberEdition, safeNext, trustedOrigin } from "@/lib/account";
import { passwordAuth, type PasswordMode, type PasswordState } from "@/lib/password-auth";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  step: "email" | "code";
  email?: string;
  /** Public path to continue to, in the reader's edition ("/profil", "/sl/profil"). */
  next: string;
  error?: string;
};

const COPY = defineCopy({
  pl: {
    wait: "Spokojnie. Kolejne skierowanie można zamówić za minutę.",
    expired: "Kod nie pasuje albo wygasł. Zamów nowe skierowanie.",
    down: "Rejestracja ma przerwę techniczną. Spróbuj za chwilę.",
    notEmail: "To nie wygląda na adres e-mail.",
    short: "Kod z listu ma co najmniej sześć cyfr.",
  },
  sl: {
    wait: "Le počasi. Naslednjo napotnico lahko naročiš čez minuto.",
    expired: "Koda se ne ujema ali pa je potekla. Naroči novo napotnico.",
    down: "Prijavna služba ima tehnični odmor. Poskusi znova čez trenutek.",
    notEmail: "To ni videti kot e-naslov.",
    short: "Koda iz pisma ima najmanj šest števk.",
  },
});

function explain(message: string, locale: Locale) {
  const t = COPY[locale];
  if (/security purposes|rate limit|after \d+ seconds/i.test(message)) return t.wait;
  if (/expired|invalid/i.test(message)) return t.expired;
  return t.down;
}

async function authOrigin() {
  return trustedOrigin((await headers()).get("origin") ?? "")?.origin ?? site.url;
}

async function submitPassword(mode: PasswordMode | "resend", form: FormData): Promise<PasswordState> {
  const result = await passwordAuth(await createClient(), mode, form, await authOrigin());
  if (result.destination) redirect(result.destination);
  return result;
}

export async function signInPassword(_: PasswordState, form: FormData) { return submitPassword("login", form); }
export async function registerPassword(_: PasswordState, form: FormData) { return submitPassword("register", form); }
export async function requestPasswordReset(_: PasswordState, form: FormData) { return submitPassword("recovery", form); }
export async function updatePassword(_: PasswordState, form: FormData) { return submitPassword("password", form); }
export async function resendConfirmation(_: PasswordState, form: FormData) { return submitPassword("resend", form); }

/**
 * Step one: Supabase sends the email through our hook, with a link and a six-digit code.
 * The redirect is the public path of the reader's edition, so the hook writes the letter in it;
 * a new account also remembers the edition.
 */
export async function requestLink(_: SignInState, formData: FormData): Promise<SignInState> {
  const locale = formEdition(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(formData.get("dalej"), localizePath("/profil", locale));
  if (!isEmail(email)) return { step: "email", next, email, error: COPY[locale].notEmail };

  const origin = await authOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: emailRedirectUrl(origin, next, locale), shouldCreateUser: true, data: { [EDITION_KEY]: locale } },
  });
  if (error) return { step: "email", next, email, error: explain(error.message, locale) };
  return { step: "code", next, email };
}

/** Step two, for people who read email on another device: the code instead of the link. */
export async function verifyCode(_: SignInState, formData: FormData): Promise<SignInState> {
  const locale = formEdition(formData);
  const token = String(formData.get("kod") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(formData.get("dalej"), localizePath("/profil", locale));
  if (token.length < 6 || token.length > 10) return { step: "code", email, next, error: COPY[locale].short };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { step: "code", email, next, error: explain(error.message, locale) };
  await rememberEdition(supabase, data.user, locale);
  redirect(next);
}
