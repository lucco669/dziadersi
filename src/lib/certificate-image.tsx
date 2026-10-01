import { ImageResponse } from "next/og";
import { C, OG_FONTS, OgSeal, OgStamp, display, italic, mono } from "./og";
import type { Result } from "./test";

export const CERTIFICATE_FORMATS = {
  og: { width: 1200, height: 630 },
  post: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;

export type CertificateFormat = keyof typeof CERTIFICATE_FORMATS;

export function certificateImage(result: Result, format: CertificateFormat, headers?: Record<string, string>) {
  return new ImageResponse(
    format === "og" ? <Landscape result={result} /> : <Portrait result={result} story={format === "story"} />,
    { ...CERTIFICATE_FORMATS[format], fonts: OG_FONTS, headers },
  );
}

/** Link preview: score left, diagnosis right, like the front page of a report. */
function Landscape({ result }: { result: Result }) {
  const long = result.diagnosis.name.length > 26;
  return (
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
        <span>INSTYTUT BADAŃ NAD DZIADERSTWEM · TEST DZIADERSA</span>
        <span>CERTYFIKAT NR {result.certificate}</span>
      </div>

      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 470 }}>
          <div style={{ ...mono, display: "flex", fontSize: 20, letterSpacing: 3, color: C.faint }}>
            {result.name ? `OSOBA BADANA: ${result.name.toUpperCase()}` : "WYNIK BADANIA"}
          </div>
          <div style={{ ...display, display: "flex", marginTop: 6, fontSize: 228, lineHeight: 0.9, letterSpacing: -10 }}>
            {result.score}
            <span style={{ fontSize: 96, marginTop: 18, letterSpacing: 0 }}>%</span>
          </div>
          <div style={{ display: "flex", marginTop: 26 }}>
            <OgStamp label={result.verdict.title} fontSize={19} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingLeft: 48,
            marginLeft: 8,
            borderLeft: `2px solid ${C.ink}`,
          }}
        >
          <div style={{ ...mono, display: "flex", fontSize: 20, letterSpacing: 3, color: C.faint }}>ROZPOZNANIE</div>
          <div style={{ ...display, display: "flex", marginTop: 12, fontSize: long ? 56 : 66, lineHeight: 1.02, letterSpacing: -1.5 }}>
            {result.diagnosis.name}
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 14, fontSize: 30, color: C.soft }}>{result.diagnosis.latin}</div>
          <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 28, color: C.green }}>
            Wynik wyższy niż u {result.percentile}% badanych.
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
        <span>ZBADAJ SIĘ NA DZIADER.SI</span>
        <span style={{ color: C.faint, marginRight: 230 }}>{result.date.toUpperCase()}</span>
      </div>

      <div style={{ position: "absolute", right: 58, bottom: 8, display: "flex" }}>
        <OgSeal size={178} />
      </div>
    </div>
  );
}

/** Instagram post (4:5) and story (9:16): the paper certificate on the Institute's green. */
function Portrait({ result, story }: { result: Result; story: boolean }) {
  const long = result.diagnosis.name.length > 26;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: story ? "170px 64px 230px" : "56px 64px",
        background: C.green,
        color: C.ink,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          // Satori chokes on undefined style values, so only set flex when needed.
          ...(story ? {} : { flex: 1 }),
          padding: 12,
          background: C.paperLight,
          transform: story ? "rotate(-1deg)" : "rotate(-0.6deg)",
        }}
      >
        <div style={{ display: "flex", flex: 1, padding: 6, border: `2px solid ${C.ink}` }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              padding: story ? "40px 56px 48px" : "34px 52px 40px",
              border: `4px solid ${C.ink}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                ...mono,
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                fontSize: 20,
                letterSpacing: 3,
                color: C.faint,
              }}
            >
              <span>IBD · PRACOWNIA DIAGNOSTYCZNA</span>
              <span>NR {result.certificate}</span>
            </div>

            <div style={{ ...display, display: "flex", marginTop: story ? 56 : 40, fontSize: 74, lineHeight: 1, letterSpacing: -2 }}>
              Certyfikat Dziaderstwa
            </div>
            <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 32, color: C.soft }}>
              Niniejszym zaświadcza się, że osoba badana
            </div>
            {result.name && (
              <div style={{ ...italic, display: "flex", marginTop: 6, fontSize: 64, lineHeight: 1.1, color: C.green }}>
                {result.name}
              </div>
            )}
            <div style={{ ...italic, display: "flex", marginTop: 6, fontSize: 32, color: C.soft }}>
              uzyskała w Teście Dziadersa IBD-T1 wynik
            </div>

            <div style={{ ...display, display: "flex", marginTop: 8, fontSize: story ? 300 : 250, lineHeight: 1, letterSpacing: -12 }}>
              {result.score}
              <span style={{ fontSize: story ? 120 : 100, marginTop: story ? 28 : 22, letterSpacing: 0 }}>%</span>
            </div>
            <div style={{ display: "flex", marginTop: 6 }}>
              <OgStamp label={result.verdict.title} fontSize={22} />
            </div>

            <div style={{ ...mono, display: "flex", marginTop: story ? 56 : 40, fontSize: 21, letterSpacing: 4, color: C.faint }}>
              ROZPOZNANIE
            </div>
            <div style={{ ...display, display: "flex", marginTop: 10, fontSize: long ? 52 : 60, lineHeight: 1.05, letterSpacing: -1.5 }}>
              {result.diagnosis.name}
            </div>
            <div style={{ ...italic, display: "flex", marginTop: 10, fontSize: 30, color: C.soft }}>{result.diagnosis.latin}</div>

            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginTop: story ? 72 : "auto",
              }}
            >
              <OgSeal size={story ? 190 : 170} rotate={-10} />
              <div style={{ display: "flex", flexDirection: "column", width: 400, textAlign: "left" }}>
                <div style={{ ...italic, display: "flex", fontSize: 46, color: C.green }}>Z. Wąsik</div>
                <div
                  style={{
                    ...mono,
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 8,
                    paddingTop: 10,
                    borderTop: `2px solid ${C.ink}`,
                    fontSize: 17,
                    letterSpacing: 2,
                    lineHeight: 1.5,
                    color: C.soft,
                  }}
                >
                  <span>DR HAB. ZENON WĄSIK</span>
                  <span>KIEROWNIK PRACOWNI DIAGNOSTYCZNEJ</span>
                </div>
              </div>
            </div>

            <div
              style={{
                ...mono,
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                marginTop: 30,
                paddingTop: 16,
                borderTop: `1px solid ${C.faint}`,
                fontSize: 19,
                letterSpacing: 3,
                color: C.faint,
              }}
            >
              <span>DATA BADANIA: {result.date.toUpperCase()}</span>
              <span>DZIADER.SI</span>
            </div>
          </div>
        </div>
      </div>

      {story && (
        <div style={{ ...italic, display: "flex", marginTop: 52, fontSize: 46, color: C.paper }}>
          A ty? Zbadaj się na dziader.si
        </div>
      )}
    </div>
  );
}
