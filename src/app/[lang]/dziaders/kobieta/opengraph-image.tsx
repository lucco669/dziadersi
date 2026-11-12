import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fieldworkCard } from "@/lib/fieldwork-cards";
import { OgPlate } from "@/lib/og-cards";

export const alt = "DZIADER.SI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { title: "Dziaders — kobieta też?", subtitle: "Dziaderstwo to postawa, nie płeć.", section: "Wprowadzenie do Instytutu" },
  sl: { title: "Dziaders — tudi ženska?", subtitle: "Dziaderstvo je drža, ne spol.", section: "Uvod v Inštitut" },
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
    path: "/dziaders/kobieta",
    art: <OgPlate species="weselny" specimen={2} width={380} />,
  });
}
