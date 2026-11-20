import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fieldworkCard } from "@/lib/fieldwork-cards";
import { OgPlate } from "@/lib/og-cards";

export const alt = "DZIADER.SI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { title: "Boomer czy dziaders?", subtitle: "Boomerem jest się z metryki, dziadersem z nawyków.", section: "Wprowadzenie do Instytutu" },
  sl: { title: "Boomer ali dziaders?", subtitle: "Boomer si po rojstnem listu, dziaders po navadah.", section: "Uvod v Inštitut" },
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
    path: "/dziaders/boomer",
    art: <OgPlate species="facebook" specimen={0} width={380} />,
  });
}
