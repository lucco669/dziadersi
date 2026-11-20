import { getSlang } from "@/content/slang";
import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { fieldworkCard } from "@/lib/fieldwork-cards";
import { OgPlate } from "@/lib/og-cards";

export const alt = "DZIADER.SI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { section: "Słownik młodzieżowy", title: "Słownik młodzieżowy dla dziadersów" },
  sl: { section: "Mladinski slovar", title: "Mladinski slovar za dziaderse" },
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
    subtitle: getSlang(locale)
      .slice(0, 8)
      .map((entry) => entry.word)
      .join(" · "),
    section: t.section,
    path: "/slownik-mlodziezowy",
    art: <OgPlate species="facebook" specimen={1} width={360} />,
  });
}
