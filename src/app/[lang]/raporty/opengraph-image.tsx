import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, bold, sans } from "@/lib/og";
import { OG_SIZE, OgTally, sectionCard } from "@/lib/og-cards";

export const alt = "Raporty Instytutu Badań nad Dziaderstwem · Poročila Inštituta za raziskave dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Badania terenowe · przeglądy · eksperymenty",
    title: "Raporty Instytutu",
    subtitle: "Wszystkie dane są zmyślone. A mimo to się zgadzają.",
    value: "73%",
    label: "ojców posiada kabel, którego przeznaczenia nie zna",
  },
  sl: {
    section: "Terenske raziskave · pregledi · poskusi",
    title: "Poročila Inštituta",
    subtitle: "Vsi podatki so izmišljeni. Pa vendar držijo.",
    value: "73 %",
    label: "očetov ima kabel, za katerega ne ve, čemu služi",
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
      section: t.section,
      title: t.title,
      subtitle: t.subtitle,
      path: "/raporty",
      art: (
        <div style={{ display: "flex", flexDirection: "column", width: 420 }}>
          <div style={{ ...bold, display: "flex", fontSize: 150, lineHeight: 0.9, letterSpacing: -4, color: C.red }}>{t.value}</div>
          <div style={{ ...sans, display: "flex", marginTop: 12, fontSize: 22, lineHeight: 1.25, color: C.soft }}>{t.label}</div>
          <div style={{ display: "flex", marginTop: 22 }}>
            <OgTally count={7} width={420} />
          </div>
        </div>
      ),
    },
    lang,
  );
}
