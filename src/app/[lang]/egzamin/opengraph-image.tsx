import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, sectionCard, OgBinoculars } from "@/lib/og-cards";

export const alt = "Egzamin terenowy z oznaczania dziadersów · Terenski izpit iz določanja dziadersov";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { title: "Egzamin terenowy", subtitle: "Dwanaście pytań z Atlasu. Rozpoznasz Parkingowego po wokalizacji?" },
  sl: { title: "Terenski izpit", subtitle: "Dvanajst vprašanj iz Atlasa. Prepoznaš Parkirnega po oglašanju?" },
});

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const t = COPY[lang];
  return sectionCard(
    {
      section: t.title,
      title: t.title,
      subtitle: t.subtitle,
      path: "/egzamin",
      art: <OgBinoculars height={380} />,
    },
    lang,
  );
}
