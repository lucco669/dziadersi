import type { SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { EDITION_KEY, emailRedirectUrl, formEdition, isEmail, passwordResetPath, rememberEdition, safeNext } from "./account";

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export type PasswordMode = "login" | "register" | "recovery" | "password";
export type PasswordState = { email?: string; error?: string; message?: string; confirm?: boolean };
type AuthResult = PasswordState & { destination?: string };
type AuthClient = Pick<SupabaseClient, "auth">;

const COPY = defineCopy({
  pl: {
    email: "Podaj poprawny adres e-mail.",
    password: "Hasło musi mieć od 8 do 128 znaków.",
    required: "Podaj hasło.",
    mismatch: "Hasła nie są takie same.",
    credentials: "Nieprawidłowy adres e-mail lub hasło.",
    unconfirmed: "Najpierw potwierdź adres e-mail przyciskiem w liście. Możesz wysłać potwierdzenie ponownie.",
    weak: "Wybierz silniejsze hasło. Unikaj popularnych i ujawnionych haseł.",
    same: "Nowe hasło musi być inne od poprzedniego.",
    wait: "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.",
    down: "Logowanie jest chwilowo niedostępne. Spróbuj ponownie za chwilę.",
    expired: "Sesja wygasła. Zamów nowy link do zmiany hasła.",
    signup: "Sprawdź pocztę i potwierdź adres przyciskiem w liście. Jeśli masz już konto, zaloguj się lub odzyskaj hasło.",
    recovery: "Jeśli konto z tym adresem istnieje, wyślemy link do ustawienia nowego hasła. Sprawdź też folder spam.",
  },
  sl: {
    email: "Vnesi veljaven e-naslov.",
    password: "Geslo mora imeti od 8 do 128 znakov.",
    required: "Vnesi geslo.",
    mismatch: "Gesli se ne ujemata.",
    credentials: "Napačen e-naslov ali geslo.",
    unconfirmed: "Najprej potrdi e-naslov z gumbom v pismu. Potrditev lahko pošlješ znova.",
    weak: "Izberi močnejše geslo. Izogibaj se pogostim in razkritim geslom.",
    same: "Novo geslo se mora razlikovati od prejšnjega.",
    wait: "Preveč poskusov. Malo počakaj in poskusi znova.",
    down: "Prijava trenutno ni na voljo. Poskusi znova čez trenutek.",
    expired: "Seja je potekla. Naroči novo povezavo za spremembo gesla.",
    signup: "Preveri pošto in potrdi naslov z gumbom v pismu. Če račun že imaš, se prijavi ali ponastavi geslo.",
    recovery: "Če račun s tem naslovom obstaja, ti bomo poslali povezavo za nastavitev novega gesla. Preveri tudi neželeno pošto.",
  },
});

function authError(error: { code?: string; status?: number }, locale: Locale): PasswordState {
  const t = COPY[locale];
  if (error.status === 429 || error.code?.startsWith("over_")) return { error: t.wait };
  switch (error.code) {
    case "invalid_credentials": return { error: t.credentials };
    case "email_not_confirmed": return { error: t.unconfirmed, confirm: true };
    case "weak_password": return { error: t.weak };
    case "same_password": return { error: t.same };
    case "session_not_found":
    case "refresh_token_not_found":
    case "reauthentication_needed": return { error: t.expired };
    default: return { error: t.down };
  }
}

/**
 * Shared server-side flow. Never return credentials, tokens, or raw provider errors to the form.
 * `allow` spends the caller's budget for a sign-in attempt or a letter, once the form is valid.
 */
export async function passwordAuth(
  supabase: AuthClient,
  mode: PasswordMode | "resend",
  form: FormData,
  origin: string,
  allow?: (scope: "sign-in" | "auth-mail") => Promise<boolean>,
): Promise<AuthResult> {
  const locale = formEdition(form);
  const t = COPY[locale];
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("dalej"), localizePath("/profil", locale));
  if (mode !== "password" && !isEmail(email)) return { email, error: t.email };
  if (mode === "register" || mode === "password") {
    if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) return { email, error: t.password };
    if (password !== form.get("passwordConfirm")) return { email, error: t.mismatch };
  }
  if (mode === "login" && (!password || password.length > PASSWORD_MAX)) return { email, error: t.required };
  if (mode !== "password" && allow && !(await allow(mode === "login" ? "sign-in" : "auth-mail"))) {
    return { email, error: t.wait, ...(mode === "resend" ? { confirm: true } : {}) };
  }

  try {
    if (mode === "recovery") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: emailRedirectUrl(origin, passwordResetPath(next, locale), locale) });
      if (error) return { email, ...authError(error, locale) };
      return { email, message: t.recovery };
    }
    if (mode === "resend") {
      const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: emailRedirectUrl(origin, next, locale) } });
      if (error) return { email, confirm: true, ...authError(error, locale) };
      return { email, message: t.signup, confirm: true };
    }
    if (mode === "password") {
      // Authorize the mutation independently of the page and of all hidden form fields.
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return { error: t.expired };
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) return authError(updateError, locale);
      return { destination: next };
    }
    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: emailRedirectUrl(origin, next, locale), data: { [EDITION_KEY]: locale } } });
      // Keep the response neutral for existing accounts, including configurations that return an error.
      if (error && error.code !== "user_already_exists" && error.code !== "email_exists") return { email, ...authError(error, locale) };
      if (data.session && !error) return { destination: next };
      return { email, message: t.signup, confirm: true };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { email, ...authError(error, locale) };
    await rememberEdition(supabase, data.user, locale);
    return { destination: next };
  } catch {
    return { email, error: t.down };
  }
}
