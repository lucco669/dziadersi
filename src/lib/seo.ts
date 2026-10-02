import type { Metadata } from "next";
import { site } from "./site";

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

type PageMeta = {
  /** Browser title; the layout appends " · DZIADER.SI" when the whole stays within 70 characters. */
  title: string;
  description: string;
  path: string;
  /** Title for link previews, when it should differ from the browser title. */
  shareTitle?: string;
  shareDescription?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

/** The same canonical, Open Graph and Twitter fields for every page. Share images come from opengraph-image files. */
export function pageMetadata({
  title,
  description,
  path,
  shareTitle,
  shareDescription,
  type = "website",
  publishedTime,
  noindex,
}: PageMeta): Metadata {
  const ogTitle = shareTitle ?? `${title} · ${site.name}`;
  const ogDescription = shareDescription ?? description;
  const branded = `${title} · ${site.name}`;
  return {
    title: branded.length <= MAX_TITLE ? title : { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "pl_PL",
      siteName: site.name,
      url: path,
      title: ogTitle,
      description: ogDescription,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** schema.org reference to the Institute, for author, publisher and creator fields. */
export const institute = {
  "@type": "Organization",
  "@id": `${site.url}/#instytut`,
  name: site.institute,
  url: site.url,
  logo: `${site.url}/icon-512.png`,
} as const;
