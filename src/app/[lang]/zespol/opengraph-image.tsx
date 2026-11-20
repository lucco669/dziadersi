import { notFound } from "next/navigation";
import { MeetingTableDrawing } from "@/components/team-art";
import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";
import { svgDataUri } from "@/lib/svg-string";

export const alt =
  "Badanie okresowe zespołu: Test Dziadersa dla całego biura · Obdobni pregled kolektiva: test dziadersa za vso pisarno";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "do 50 osób · działy · raport dla kadr",
    title: ["Badanie", "okresowe", "zespołu"],
    lead: "Zróbmy calla. Ale najpierw test.",
    caption: "Orzeczenie Komisji dla całego biura.",
  },
  sl: {
    section: "do 50 oseb · oddelki · poročilo za kadrovsko",
    title: ["Obdobni", "pregled", "kolektiva"],
    lead: "Dajmo en call. Ampak najprej test.",
    caption: "Odločba Komisije za vso pisarno.",
  },
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function TeamOrderImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = COPY[lang];
  const drawing = svgDataUri("0 0 250 118", <MeetingTableDrawing />);
  return render(
    <OgFrame locale={lang} section={t.section} path="/zespol">
      <div style={{ display: "flex", flexDirection: "column", width: 470 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 0.92, letterSpacing: -2.5 }}>
          {t.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 24, fontSize: 32, color: C.soft }}>{t.lead}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 30, alignItems: "center" }}>
        <img src={drawing} width={560} height={264} alt="" />
        <div style={{ ...sans, display: "flex", marginTop: 18, fontSize: 22, color: C.red }}>{t.caption}</div>
      </div>
    </OgFrame>,
  );
}
