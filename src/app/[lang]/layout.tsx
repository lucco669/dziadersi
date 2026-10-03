import type { Metadata, Viewport } from "next";
import { Poltawski_Nowy, Schibsted_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/analytics";
import { LanguageSuggestion } from "@/components/language";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocaleProvider } from "@/i18n/client";
import { hasLocale, LOCALE_INFO, LOCALES } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import { site, siteCopy } from "@/lib/site";
import "../globals.css";

// Antykwa Półtawskiego, the typeface of Polish schoolbooks, in its 2020 revival.
// Both fonts fall back to the metric-matched faces in globals.css, which carry font-display too.
const poltawski = Poltawski_Nowy({
  variable: "--font-poltawski",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  adjustFontFallback: false,
  fallback: ["Poltawski Fallback"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin", "latin-ext"],
  adjustFontFallback: false,
  fallback: ["Schibsted Fallback"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = siteCopy(locale);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} · ${copy.institute}`,
      template: `%s · ${site.name}`,
    },
    description: copy.description,
    applicationName: site.name,
    authors: [{ name: copy.institute, url: site.url }],
    creator: copy.institute,
    publisher: copy.institute,
    category: "humor",
    openGraph: { type: "website", locale: LOCALE_INFO[locale].og, siteName: site.name },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false, address: false, email: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={LOCALE_INFO[lang].tag} data-scroll-behavior="smooth" className={`${poltawski.variable} ${schibsted.variable}`}>
      <body>
        <LocaleProvider locale={lang}>
          <SiteHeader locale={lang} />
          {children}
          <SiteFooter locale={lang} />
          <LanguageSuggestion />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
