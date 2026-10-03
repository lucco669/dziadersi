import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { TASKS } from "@/content/test";
import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, bold, italic, sans, serif } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";
import { siteCopy } from "@/lib/site";

export const alt =
  "Test Dziadersa: badanie okresowe w pięciu gabinetach Instytutu Badań nad Dziaderstwem · Test dziadersa: obdobni pregled v petih ordinacijah Inštituta za raziskave dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

// Plansza IV never appears in the test itself: it is kept for the share card.
const plate = `data:image/png;base64,${(await readFile(join(process.cwd(), "assets/plansze/plansza-4.png"))).toString("base64")}`;
const CHOSEN = 1;

const COPY = defineCopy({
  pl: {
    section: (tasks: number) => `${tasks} zadań · 5 gabinetów · certyfikat`,
    title: ["Test", "Dziadersa"],
    plate: "Plansza IV · Co widzisz?",
    series: "IBD-R · seria 2026",
    answers: ["Nietoperza.", "Plamę oleju pod Passatem.", "Wąsy w przekroju.", "Plan działki z miedzą."],
  },
  sl: {
    section: (tasks: number) => `${tasks} nalog · 5 ordinacij · certifikat`,
    title: ["Test", "dziadersa"],
    plate: "Tabla IV · Kaj vidiš?",
    series: "IBD-R · serija 2026",
    answers: ["Netopirja.", "Madež olja pod passatom.", "Brke v prerezu.", "Načrt vrtička z mejo."],
  },
});

/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function TestImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = COPY[lang];
  return render(
    <OgFrame locale={lang} section={t.section(TASKS.length)} path="/test">
      <div style={{ display: "flex", flexDirection: "column", width: 450 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 98, lineHeight: 0.9, letterSpacing: -2.5 }}>
          {t.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 34, color: C.soft }}>{siteCopy(lang).tagline}</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: 36,
          padding: "18px 26px 12px",
          background: C.card,
          border: `2px solid ${C.ink}`,
        }}
      >
        <div style={{ ...sans, display: "flex", justifyContent: "space-between", fontSize: 17, color: C.soft }}>
          <span>{t.plate}</span>
          <span>{t.series}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <img src={plate} width={420} height={199} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 8, borderTop: `2px solid ${C.ink}` }}>
          {t.answers.map((answer, i) => (
            <div
              key={answer}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: `1px solid ${C.rule}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ ...sans, width: 28, fontSize: 16, color: C.soft }}>{"ABCD"[i]}</span>
                <span style={{ ...serif, fontSize: 22 }}>{answer}</span>
              </div>
              <div style={{ position: "relative", display: "flex", width: 20, height: 20, border: `2px solid ${C.ink}` }}>
                {i === CHOSEN && (
                  <svg width="32" height="32" viewBox="0 0 24 24" style={{ position: "absolute", left: -8, top: -8 }}>
                    <path d="M4.5 5.2C9.2 9.8 13.8 14.6 19.6 19.4" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" fill="none" />
                    <path d="M19.2 4.6C14.6 9.6 9.8 14.4 4.8 19.6" stroke={C.red} strokeWidth="2.6" strokeLinecap="round" fill="none" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OgFrame>,
  );
}
