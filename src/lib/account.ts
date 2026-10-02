import { site } from "./site";

/** A same-site path to continue to after signing in; anything else falls back to the profile. */
export function safeNext(value: unknown, fallback = "/profil") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : fallback;
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
