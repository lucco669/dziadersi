import { getDictionary } from "@/content/dictionary";
import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, bold } from "@/lib/og";
import { OG_SIZE, OgFigure, sectionCard } from "@/lib/og-cards";
import { plural, pluralSl } from "@/lib/typo";

export const alt = "Słownik Dziaderski · Dziaderski slovar";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: (count: number) => `${count} ${plural(count, "hasło", "hasła", "haseł")} · wydanie pierwsze`,
    title: "Słownik Dziaderski",
    subtitle: "Od „za moich czasów” po „diesel to jest diesel”. Z wymową i przykładami.",
    saying: "„Panie…”",
  },
  sl: {
    section: (count: number) => `${count} ${pluralSl(count, "geslo", "gesli", "gesla", "gesel")} · slovenska izdaja`,
    title: "Dziaderski slovar",
    subtitle: "Od »v mojih časih« do »dizel je dizel«. Z izgovorjavo in primeri.",
    saying: "»Ja, veš …«",
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
  return sectionCard(
    {
      section: t.section(getDictionary(lang).length),
      title: t.title,
      subtitle: t.subtitle,
      path: "/slownik",
      art: (
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <OgFigure height={330} />
          <div style={{ ...bold, display: "flex", marginBottom: 190, marginLeft: 6, padding: "18px 24px", background: C.red, color: C.paper, fontSize: 34, lineHeight: 1.1 }}>
            {t.saying}
          </div>
        </div>
      ),
    },
    lang,
  );
}
