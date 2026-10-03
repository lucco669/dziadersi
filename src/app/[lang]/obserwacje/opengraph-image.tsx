import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, OgTileMap, sectionCard } from "@/lib/og-cards";

export const alt = "Mapa obserwacji dziadersów według województw · Zemljevid opazovanj dziadersov po vojvodstvih";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Sieć Obserwatorów Terenowych",
    title: "Mapa obserwacji",
    subtitle: "Gdzie widziano dziadersa. Zgłoszenia według województw i gatunków.",
  },
  sl: {
    section: "Mreža terenskih opazovalcev",
    title: "Zemljevid opazovanj",
    subtitle: "Kje so videli dziadersa. Prijave po vojvodstvih in vrstah.",
  },
});

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  return sectionCard({ ...COPY[locale], path: "/obserwacje", art: <OgTileMap width={360} /> }, locale);
}
