import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, OgMedals, sectionCard } from "@/lib/og-cards";

export const alt = "Tablica Honorowa Instytutu Badań nad Dziaderstwem · Častna tabla Inštituta za raziskave dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Przodownicy i wyróżnieni",
    title: "Tablica Honorowa",
    subtitle: "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza. Sprawy, które podzieliły naród.",
  },
  sl: {
    section: "Udarniki in odlikovanci",
    title: "Častna tabla",
    subtitle: "Udarniki opazovanja, porotniki in trgalci koledarja. Primeri, ki so razdelili narod.",
  },
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  return sectionCard({ ...COPY[locale], path: "/tablica-honorowa", art: <OgMedals width={420} /> }, locale);
}
