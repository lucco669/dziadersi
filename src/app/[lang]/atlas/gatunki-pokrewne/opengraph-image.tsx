import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fieldworkCard } from "@/lib/fieldwork-cards";
import { OgPlate } from "@/lib/og-cards";

export const alt = "DZIADER.SI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { title: "Janusz, szwagier czy dziaders?", subtitle: "Gatunki pokrewne: wujek dobra rada, majster, pan Areczek, sąsiad.", section: "Atlas Dziadersów · aneks" },
  sl: { title: "Janusz, svak ali dziaders?", subtitle: "Sorodne vrste: stric dober nasvet, mojster, gospod Areček, sosed.", section: "Atlas dziadersov · dodatek" },
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = COPY[locale];
  return fieldworkCard(locale, {
    title: t.title,
    subtitle: t.subtitle,
    section: t.section,
    path: "/atlas/gatunki-pokrewne",
    art: <OgPlate species="oszczednosciowy" width={380} />,
  });
}
