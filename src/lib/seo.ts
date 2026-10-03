import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALE_INFO, LOCALES, type Locale } from "@/i18n/config";
import { alternatePath, localizePath } from "@/i18n/routes";
import { site, siteCopy } from "./site";

/** Search results cut titles and descriptions longer than these. */
const MAX_TITLE = 70;
const MAX_DESCRIPTION = 160;

/** A meta description: the text with the first of `endings` that still fits in 160 characters. */
export function describe(text: string, ...endings: string[]) {
  for (const ending of [...endings, ""]) {
    if (text.length + ending.length <= MAX_DESCRIPTION) return text + ending;
  }
  return `${text.slice(0, text.lastIndexOf(" ", MAX_DESCRIPTION - 1))}…`;
}

/** The absolute public URL of an internal path in an edition. */
export const absoluteUrl = (path: string, locale: Locale) => {
  const localized = localizePath(path, locale);
  return `${site.url}${localized === "/" ? "" : localized}`;
};

/**
 * hreflang alternates for an internal path: both editions and x-default (the Polish original).
 * `path` is the internal path in `locale`; content slugs are swapped for the twin page.
 */
export function languageAlternates(path: string, locale: Locale) {
  const languages = Object.fromEntries(
    LOCALES.map((target) => [LOCALE_INFO[target].tag, localizePath(alternatePath(path, locale, target), target)]),
  );
  return { ...languages, "x-default": languages[LOCALE_INFO[DEFAULT_LOCALE].tag] };
}

type PageMeta = {
  /** Browser title; the layout appends " · DZIADER.SI" when the whole stays within 70 characters. */
  title: string;
  description: string;
  /** Internal path in the page's edition ("/slownik/x"); localised for canonical and hreflang. */
  path: string;
  /** Title for link previews, when it should differ from the browser title. */
  shareTitle?: string;
  shareDescription?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

/**
 * The same canonical, hreflang, Open Graph and Twitter fields for every page.
 * Share images come from opengraph-image files.
 */
export function pageMetadata(
  locale: Locale,
  { title, description, path, shareTitle, shareDescription, type = "website", publishedTime, noindex }: PageMeta,
): Metadata {
  const ogTitle = shareTitle ?? `${title} · ${site.name}`;
  const ogDescription = shareDescription ?? description;
  const branded = `${title} · ${site.name}`;
  const url = localizePath(path, locale);
  return {
    title: branded.length <= MAX_TITLE ? title : { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(path, locale) },
    openGraph: {
      type,
      locale: LOCALE_INFO[locale].og,
      alternateLocale: LOCALES.filter((other) => other !== locale).map((other) => LOCALE_INFO[other].og),
      siteName: site.name,
      url,
      title: ogTitle,
      description: ogDescription,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** schema.org reference to the Institute, for author, publisher and creator fields. */
export const institute = (locale: Locale) =>
  ({
    "@type": "Organization",
    "@id": `${site.url}/#instytut`,
    name: siteCopy(locale).institute,
    alternateName: locale === "pl" ? undefined : siteCopy("pl").institute,
    url: site.url,
    logo: `${site.url}/icon-512.png`,
  }) as const;

/**
 * schema.org Dataset for one of the Institute's statistics pages, with the fields they all share:
 * the Institute as creator and publisher, free access and the data license.
 */
export const dataset = (locale: Locale, path: string, fields: { name: string; description: string; [field: string]: unknown }) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  ...fields,
  url: absoluteUrl(path, locale),
  inLanguage: LOCALE_INFO[locale].tag,
  creator: institute(locale),
  publisher: institute(locale),
  isAccessibleForFree: true,
  license: site.dataLicense,
});
