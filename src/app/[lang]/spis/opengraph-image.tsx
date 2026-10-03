import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, OgCrowd, sectionCard } from "@/lib/og-cards";

export const alt = "Narodowy Spis Dziadersów: wyniki wszystkich badań Instytutu · Nacionalni popis dziadersov: rezultati vseh pregledov Inštituta";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Wyniki wszystkich badań, na żywo",
    title: "Narodowy Spis Dziadersów",
    subtitle: "Gatunki, krzyżówki, najczęstsze odpowiedzi i najbardziej dziaderska godzina.",
  },
  sl: {
    section: "Rezultati vseh pregledov, v živo",
    title: "Nacionalni popis dziadersov",
    subtitle: "Vrste, križanci, najpogostejši odgovori in najbolj dziaderska ura.",
  },
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  return sectionCard({ ...COPY[locale], path: "/spis", art: <OgCrowd count={31} width={330} /> }, locale);
}
