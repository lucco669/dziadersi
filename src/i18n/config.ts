/**
 * The Institute publishes two editions: the Polish original at the root of the domain and the
 * Slovenian translation under /sl. Routes live under app/[lang]; Polish URLs carry no prefix
 * (next.config.ts rewrites them to /pl internally).
 */
export const LOCALES = ["pl", "sl"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pl";

export const hasLocale = (value: string | undefined | null): value is Locale => LOCALES.includes(value as Locale);

/** The cookie that remembers a reader's chosen edition. Read by the redirects in next.config.ts. */
export const LOCALE_COOKIE = "jezyk";

export const LOCALE_INFO: Record<
  Locale,
  {
    /** The language in its own name, for the switcher. */
    name: string;
    /** BCP 47 tag for <html lang>, hreflang and Intl. */
    tag: string;
    intl: string;
    /** Open Graph locale. */
    og: string;
    /** How the edition calls itself, like the title page of a book. */
    edition: string;
    /** The short code shown in the header switcher. */
    short: string;
  }
> = {
  pl: { name: "Polski", tag: "pl", intl: "pl-PL", og: "pl_PL", edition: "Wydanie polskie", short: "PL" },
  sl: { name: "Slovenščina", tag: "sl", intl: "sl-SI", og: "sl_SI", edition: "Slovenska izdaja", short: "SL" },
};

export const otherLocale = (locale: Locale): Locale => (locale === "pl" ? "sl" : "pl");
