import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TASKS } from "@/content/test";
import { C, OgFrame, bold, italic, sans, serif } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";

export const alt = "Test Dziadersa: badanie okresowe w pięciu gabinetach Instytutu Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

// Plansza IV never appears in the test itself: it is kept for the share card.
const plate = `data:image/png;base64,${(await readFile(join(process.cwd(), "assets/plansze/plansza-4.png"))).toString("base64")}`;
const ANSWERS = ["Nietoperza.", "Plamę oleju pod Passatem.", "Wąsy w przekroju.", "Plan działki z miedzą."];
const CHOSEN = 1;

export default function TestImage() {
  return render(
    <OgFrame section={`${TASKS.length} zadań · 5 gabinetów · certyfikat`} url="dziader.si/test">
      <div style={{ display: "flex", flexDirection: "column", width: 450 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 98, lineHeight: 0.9, letterSpacing: -2.5 }}>
          <span>Test</span>
          <span>Dziadersa</span>
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 34, color: C.soft }}>Zbadaj się, zanim będzie za późno.</div>
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
          <span>Plansza IV · Co widzisz?</span>
          <span>IBD-R · seria 2026</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <img src={plate} width={420} height={199} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 8, borderTop: `2px solid ${C.ink}` }}>
          {ANSWERS.map((answer, i) => (
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
