import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, OgCrowd, sectionCard } from "@/lib/og-cards";

export const alt = "Narodowy Indeks Dziaderstwa · Nacionalni indeks dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Aktualizacja co godzinę",
    title: "Narodowy Indeks Dziaderstwa",
    subtitle: "Natężenie dziaderstwa w Polsce. Prognoza na Wigilię: kliniczne.",
  },
  sl: {
    section: "Posodobitev vsako uro",
    title: "Nacionalni indeks dziaderstva",
    subtitle: "Jakost dziaderstva na Poljskem. Napoved za sveti večer: klinična.",
  },
});

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const t = COPY[lang];
  return sectionCard({ ...t, path: "/indeks", art: <OgCrowd count={33} width={330} /> }, lang);
}
