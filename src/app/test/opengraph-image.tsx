import { ImageResponse } from "next/og";
import { QUESTIONS } from "@/content/test";
import { C, OG_FONTS, display, italic, mono } from "@/lib/og";

export const alt = "Test Dziadersa: badanie przesiewowe IBD-T1 w Instytucie Badań nad Dziaderstwem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SAMPLE = QUESTIONS[6];

export default function TestImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "48px 64px 44px",
          background: C.paper,
          color: C.ink,
        }}
      >
        <div
          style={{
            ...mono,
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 18,
            borderBottom: `2px solid ${C.ink}`,
            fontSize: 19,
            letterSpacing: 3,
            color: C.soft,
          }}
        >
          <span>INSTYTUT BADAŃ NAD DZIADERSTWEM</span>
          <span>FORMULARZ IBD-T1</span>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 560 }}>
            <div style={{ ...display, display: "flex", flexDirection: "column", fontSize: 116, lineHeight: 0.88, letterSpacing: -4.5 }}>
              <span>Test</span>
              <span>Dziadersa</span>
            </div>
            <div style={{ ...italic, display: "flex", marginTop: 24, fontSize: 34, color: C.green }}>
              Zbadaj się, zanim będzie za późno.
            </div>
            <div style={{ ...mono, display: "flex", marginTop: 22, fontSize: 17, letterSpacing: 2.5, color: C.faint }}>
              24 PYTANIA · OK. 3 MINUTY · WYNIK 0–100%
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              marginLeft: 40,
              padding: "26px 30px 18px",
              background: C.paperLight,
              border: `2px solid ${C.ink}`,
              transform: "rotate(1.2deg)",
            }}
          >
            <div style={{ ...mono, display: "flex", fontSize: 16, letterSpacing: 3, color: C.faint }}>PYTANIE 07 / 24</div>
            <div style={{ ...display, display: "flex", marginTop: 10, fontSize: 31, lineHeight: 1.1, letterSpacing: -0.5 }}>
              {SAMPLE.text}
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 16, borderTop: `2px solid ${C.ink}` }}>
              {SAMPLE.answers.map((answer, i) => (
                <div
                  key={answer.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 0",
                    borderBottom: `1px solid #cdc2aa`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ ...mono, width: 34, fontSize: 18, color: C.faint }}>{"ABCD"[i]}</span>
                    <span style={{ ...italic, fontSize: 27 }}>{answer.text}</span>
                  </div>
                  <div style={{ position: "relative", display: "flex", width: 26, height: 26, border: `2px solid ${C.ink}` }}>
                    {i === SAMPLE.answers.length - 1 && (
                      <svg width="38" height="38" viewBox="0 0 24 24" style={{ position: "absolute", left: -8, top: -8 }}>
                        <path d="M4.5 5.2C9.2 9.8 13.8 14.6 19.6 19.4" stroke={C.bordo} strokeWidth="2.6" strokeLinecap="round" fill="none" />
                        <path d="M19.2 4.6C14.6 9.6 9.8 14.4 4.8 19.6" stroke={C.bordo} strokeWidth="2.6" strokeLinecap="round" fill="none" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            ...mono,
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 18,
            borderTop: `2px solid ${C.ink}`,
            fontSize: 19,
            letterSpacing: 3,
          }}
        >
          <span>WYNIK · ROZPOZNANIE GATUNKU · CERTYFIKAT</span>
          <span style={{ color: C.bordo }}>DZIADER.SI/TEST</span>
        </div>

      </div>
    ),
    { ...size, fonts: OG_FONTS },
  );
}
