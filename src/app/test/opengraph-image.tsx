import { QUESTIONS } from "@/content/test";
import { C, OgFrame, bold, italic, sans, serif } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";

export const alt = "Test Dziadersa: badanie przesiewowe w Instytucie Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

const SAMPLE = QUESTIONS[6];

export default function TestImage() {
  return render(
    <OgFrame section="24 pytania · ok. 3 minuty · certyfikat" url="dziader.si/test">
      <div style={{ display: "flex", flexDirection: "column", width: 520 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 120, lineHeight: 0.88, letterSpacing: -3 }}>
          <span>Test</span>
          <span>Dziadersa</span>
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 36, color: C.soft }}>Zbadaj się, zanim będzie za późno.</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: 40,
          padding: "24px 28px 14px",
          background: C.card,
          border: `2px solid ${C.ink}`,
        }}
      >
        <div style={{ ...sans, display: "flex", fontSize: 18, color: C.soft }}>Pytanie 07 / 24 · {SAMPLE.section}</div>
        <div style={{ ...bold, display: "flex", marginTop: 8, fontSize: 30, lineHeight: 1.12 }}>{SAMPLE.text}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 14, borderTop: `2px solid ${C.ink}` }}>
          {SAMPLE.answers.map((answer, i) => (
            <div
              key={answer.text}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: `1px solid ${C.rule}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ ...sans, width: 30, fontSize: 18, color: C.soft }}>{"ABCD"[i]}</span>
                <span style={{ ...serif, fontSize: 25 }}>{answer.text}</span>
              </div>
              <div style={{ position: "relative", display: "flex", width: 24, height: 24, border: `2px solid ${C.ink}` }}>
                {i === SAMPLE.answers.length - 1 && (
                  <svg width="36" height="36" viewBox="0 0 24 24" style={{ position: "absolute", left: -8, top: -8 }}>
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
