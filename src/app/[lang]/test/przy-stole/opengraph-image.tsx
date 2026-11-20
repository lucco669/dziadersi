import { notFound } from "next/navigation";
import { Figure, INK } from "@/components/pictograms";
import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";
import { svgDataUri } from "@/lib/svg-string";

export const alt =
  "Badanie przy stole: Test Dziadersa dla całej rodziny na jednym telefonie · Pregled za mizo: test dziadersa za vso družino na enem telefonu";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "2–8 osób · 6 zadań · wspólny ranking",
    title: ["Badanie", "przy stole"],
    lead: "Jeden telefon, cały stół.",
    caption: "Telefon idzie z rąk do rąk. Wyniki ogłaszane wszystkim naraz.",
  },
  sl: {
    section: "2–8 oseb · 6 nalog · skupna lestvica",
    title: ["Pregled", "za mizo"],
    lead: "En telefon, vsa miza.",
    caption: "Telefon gre iz rok v roke. Izvidi so razglašeni vsem hkrati.",
  },
});

/** Five at the table, the second holding the phone; the table edge drawn as the ink rule. */
const table = svgDataUri(
  "0 0 236 112",
  <g>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(${i * 46 + 4} 0)`} opacity={i > 1 ? 0.35 : 1}>
        <Figure color={INK} right={i === 1 ? "phone" : "down"} />
      </g>
    ))}
    <rect x={0} y={74} width={236} height={5} fill={INK} />
  </g>,
);

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function TableImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = COPY[lang];
  return render(
    <OgFrame locale={lang} section={t.section} path="/test/przy-stole">
      <div style={{ display: "flex", flexDirection: "column", width: 470 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 96, lineHeight: 0.9, letterSpacing: -2.5 }}>
          {t.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 36, color: C.soft }}>{t.lead}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 30, alignItems: "center" }}>
        <img src={table} width={560} height={266} alt="" />
        <div style={{ ...sans, display: "flex", marginTop: 18, fontSize: 22, color: C.soft }}>{t.caption}</div>
      </div>
    </OgFrame>,
  );
}
