import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, OgIsotype, sectionCard } from "@/lib/og-cards";

export const alt = "Mały Rocznik Statystyczny Dziaderstwa · Mali statistični letopis dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Rocznik 2026 · dane na żywo",
    title: "Mały Rocznik Statystyczny",
    subtitle: "Badania, obserwacje i trąbienia klaksonem. Z przeliczeniem na rosoły.",
  },
  sl: {
    section: "Letopis 2026 · podatki v živo",
    title: "Mali statistični letopis",
    subtitle: "Pregledi, opazovanja in pritiski na hupo. S preračunom v nedeljske juhe.",
  },
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  return sectionCard(
    { ...COPY[locale], path: "/statystyki", art: <OgIsotype kind="pot" count={23} part={0.5} columns={5} width={380} /> },
    locale,
  );
}
