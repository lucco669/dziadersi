import type { SupabaseClient, User } from "@supabase/supabase-js";
import { DEFAULT_LOCALE, hasLocale, type Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { site } from "./site";

/** A same-site path to continue to after signing in; anything else falls back to the profile. */
export function safeNext(value: unknown, fallback = "/profil") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") && !/[\u0000-\u0020\u007f]/.test(value)
    ? value
    : fallback;
}

/** The password form, after Supabase has verified the recovery link. */
export const passwordResetPath = (next: string, locale: Locale) =>
  localizePath(`/konto?tryb=haslo&dalej=${encodeURIComponent(safeNext(next, localizePath("/profil", locale)))}`, locale);

/** Both the built-in Supabase mailer (PKCE) and our email hook can consume this redirect. */
export function emailRedirectUrl(origin: string, next: string, locale: Locale) {
  return `${origin}/auth/callback?${new URLSearchParams({ flow: "email", jezyk: locale, dalej: safeNext(next, localizePath("/profil", locale)) })}`;
}

/** The hook bypasses the PKCE callback: its token hash can be verified on another device, too. */
export function emailRedirectTarget(requested: { origin: string; next: string }) {
  const url = new URL(requested.next, requested.origin);
  if (url.pathname !== "/auth/callback" || url.searchParams.get("flow") !== "email") return requested;
  const lang = url.searchParams.get("jezyk");
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  return { origin: requested.origin, next: safeNext(url.searchParams.get("dalej"), localizePath("/profil", locale)) };
}

/** The account page of an edition, for redirects: `next` is an internal path, passed on as the edition's public one. */
export const signInPath = (next: string, locale: Locale) =>
  localizePath(`/konto?dalej=${encodeURIComponent(localizePath(next, locale))}`, locale);

/** The edition a Server Action was called from: forms carry it in a hidden "jezyk" field. */
export function formEdition(formData: FormData): Locale {
  const value = String(formData.get("jezyk") ?? "");
  return hasLocale(value) ? value : DEFAULT_LOCALE;
}

/** Origins that confirmation links may point to: production, Vercel previews, local development. */
export function trustedOrigin(url: string) {
  try {
    const parsed = new URL(url);
    const production = new URL(site.url);
    const trusted =
      parsed.origin === production.origin ||
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      (parsed.protocol === "https:" && parsed.hostname.endsWith(".vercel.app"));
    return trusted ? { origin: parsed.origin, next: safeNext(parsed.pathname + parsed.search) } : null;
  } catch {
    return null;
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (value: string) => value.length <= 254 && EMAIL.test(value);

/**
 * The edition a reader last signed in from, kept in the account's user metadata (auth.users.raw_user_meta_data).
 * Letters that have no page to go by, such as security notices, are written in it.
 */
export const EDITION_KEY = "jezyk";

export function accountEdition(user: { user_metadata?: Record<string, unknown> } | null | undefined): Locale | null {
  const value = user?.user_metadata?.[EDITION_KEY];
  return typeof value === "string" && hasLocale(value) ? value : null;
}

/** Remembers the edition on the account after signing in, when it changed (nothing stored means Polish). A failure only costs the memory. */
export async function rememberEdition(supabase: Pick<SupabaseClient, "auth">, user: User | null | undefined, locale: Locale) {
  if (!user || (accountEdition(user) ?? DEFAULT_LOCALE) === locale) return;
  const { error } = await supabase.auth.updateUser({ data: { [EDITION_KEY]: locale } });
  if (error) console.error("Wydanie konta:", error.message);
}
