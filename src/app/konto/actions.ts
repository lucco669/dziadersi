"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isEmail, safeNext } from "@/lib/account";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  step: "email" | "code";
  email?: string;
  next: string;
  error?: string;
};

function explain(message: string) {
  if (/security purposes|rate limit|after \d+ seconds/i.test(message)) {
    return "Spokojnie. Kolejne skierowanie można zamówić za minutę.";
  }
  if (/expired|invalid/i.test(message)) return "Kod nie pasuje albo wygasł. Zamów nowe skierowanie.";
  return "Rejestracja ma przerwę techniczną. Spróbuj za chwilę.";
}

/** Step one: Supabase sends the email through our hook, with a link and a six-digit code. */
export async function requestLink(_: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(formData.get("dalej"));
  if (!isEmail(email)) return { step: "email", next, email, error: "To nie wygląda na adres e-mail." };

  const origin = (await headers()).get("origin") ?? site.url;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}${next}`, shouldCreateUser: true },
  });
  if (error) return { step: "email", next, email, error: explain(error.message) };
  return { step: "code", next, email };
}

/** Step two, for people who read email on another device: the code instead of the link. */
export async function verifyCode(_: SignInState, formData: FormData): Promise<SignInState> {
  const token = String(formData.get("kod") ?? "").replace(/\D/g, "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(formData.get("dalej"));
  if (token.length < 6 || token.length > 10) return { step: "code", email, next, error: "Kod z listu ma co najmniej sześć cyfr." };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { step: "code", email, next, error: explain(error.message) };
  redirect(next);
}
