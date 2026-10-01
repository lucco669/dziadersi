import type { Metadata } from "next";
import { site } from "./site";

type PageMeta = {
  /** Browser title; the layout appends " · DZIADER.SI". */
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
  return {
    title,
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
  name: site.institute,
  url: site.url,
  logo: `${site.url}/icon-512.png`,
} as const;
