import { SPECIES } from "@/content/species";
import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, OgPlate, sectionCard } from "@/lib/og-cards";
import { plural, pluralSl } from "@/lib/typo";

export const alt = "Atlas Dziadersów: katalog gatunków · Atlas dziadersov: katalog vrst";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: (count: number) => `${count} ${plural(count, "gatunek", "gatunki", "gatunków")} · klucz do oznaczania`,
    title: "Atlas Dziadersów",
    subtitle: "Od Grillowego po Bieszczadzkiego. Objawy, siedliska, naturalni wrogowie.",
  },
  sl: {
    section: (count: number) => `${count} ${pluralSl(count, "vrsta", "vrsti", "vrste", "vrst")} · določevalni ključ`,
    title: "Atlas dziadersov",
    subtitle: "Od Žarnega do Bieszczadskega. Simptomi, habitati, naravni sovražniki.",
  },
});

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = COPY[locale];
  return sectionCard(
    {
      section: t.section(SPECIES.length),
      title: t.title,
      subtitle: t.subtitle,
      path: "/atlas",
      art: (
        <div style={{ display: "flex", flexWrap: "wrap", width: 470 }}>
          {(["grill", "wakacje", "wedka", "moto"] as const).map((key) => (
            <OgPlate key={key} species={key} width={235} />
          ))}
        </div>
      ),
    },
    locale,
  );
}
