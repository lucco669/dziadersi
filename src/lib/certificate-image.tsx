import { ImageResponse } from "next/og";
import { Figure } from "@/components/pictograms";
import { C, OG_FONTS, OgFrame, OgLogo, OgSeal, OgStamp, bold, italic, sans, serif } from "./og";
import { OgPlate } from "./og-cards";
import { svgDataUri } from "./svg-string";
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

/** The diagnosed species; a hybrid shows both parents, smaller. */
function Drawing({ result, width }: { result: Result; width: number }) {
  const { species } = result.diagnosis;
  if (species.length === 0) {
    return <img src={svgDataUri("-40 0 120 100", <Figure />)} width={width} height={(width * 100) / 120} alt="" />;
  }
  return (
    <div style={{ display: "flex" }}>
      {species.map((item) => (
        <OgPlate key={item.key} species={item.key} width={species.length > 1 ? width * 0.7 : width} />
      ))}
    </div>
  );
}

/** Link preview: the score, the verdict stamp and the diagnosed species. */
function Landscape({ result }: { result: Result }) {
  const long = result.diagnosis.name.length > 26;
  return (
    <OgFrame section={`Certyfikat nr ${result.certificate}`} url="Zbadaj się na dziader.si">
      <div style={{ display: "flex", flexDirection: "column", width: 420 }}>
        <div style={{ ...sans, display: "flex", fontSize: 22, color: C.soft }}>
          {result.name ? `Osoba badana: ${result.name}` : "Wynik Testu Dziadersa"}
        </div>
        <div style={{ ...bold, display: "flex", marginTop: 4, fontSize: 216, lineHeight: 0.9, letterSpacing: -8 }}>
          {result.score}
          <span style={{ fontSize: 100, marginTop: 16, letterSpacing: 0 }}>%</span>
        </div>
        <div style={{ display: "flex", marginTop: 22 }}>
          <OgStamp label={result.verdict.title} fontSize={19} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingLeft: 40, borderLeft: `2px solid ${C.ink}` }}>
        <div style={{ ...sans, display: "flex", fontSize: 22, color: C.soft }}>Rozpoznanie</div>
        <div style={{ ...bold, display: "flex", marginTop: 8, fontSize: long ? 50 : 60, lineHeight: 1.02, letterSpacing: -1 }}>
          {result.diagnosis.name}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 8, fontSize: 28, color: C.soft }}>{result.diagnosis.latin}</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 }}>
          <Drawing result={result} width={300} />
          <OgSeal size={150} />
        </div>
      </div>
    </OgFrame>
  );
}

/** Instagram post (4:5) and story (9:16): the paper certificate, with its red stripe, on ink. */
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
        padding: story ? "150px 60px 120px" : "50px 60px",
        background: C.ink,
      }}
    >
      {story && (
        <div style={{ display: "flex", marginBottom: 56 }}>
          <OgLogo size={46} color={C.paper} cutout={C.ink} />
        </div>
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          ...(story ? {} : { flex: 1 }),
          padding: 12,
          background: C.card,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -120,
            top: 40,
            width: 420,
            height: 46,
            background: C.red,
            transform: "rotate(-45deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            padding: "34px 54px 36px",
            border: `2px solid ${C.ink}`,
            textAlign: "center",
          }}
        >
          <div style={{ ...sans, display: "flex", width: "100%", justifyContent: "space-between", fontSize: 21, color: C.soft }}>
            <span style={{ marginLeft: 70 }}>Instytut Badań nad Dziaderstwem</span>
            <span>Nr {result.certificate}</span>
          </div>

          <div style={{ ...bold, display: "flex", marginTop: story ? 50 : 34, fontSize: 70, lineHeight: 1, letterSpacing: -1 }}>
            Certyfikat Dziaderstwa
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 20, fontSize: 31, color: C.soft }}>
            Niniejszym zaświadcza się, że osoba badana
          </div>
          {result.name && (
            <div style={{ ...bold, display: "flex", marginTop: 6, fontSize: 56, lineHeight: 1.1 }}>{result.name}</div>
          )}
          <div style={{ ...italic, display: "flex", marginTop: 6, fontSize: 31, color: C.soft }}>
            uzyskała w Teście Dziadersa wynik
          </div>

          <div style={{ ...bold, display: "flex", marginTop: 4, fontSize: story ? 260 : 220, lineHeight: 1, letterSpacing: -9 }}>
            {result.score}
            <span style={{ fontSize: story ? 112 : 96, marginTop: story ? 24 : 20, letterSpacing: 0 }}>%</span>
          </div>
          <div style={{ display: "flex", marginTop: 4 }}>
            <OgStamp label={result.verdict.title} fontSize={22} />
          </div>

          <div style={{ display: "flex", marginTop: story ? 40 : 24 }}>
            <Drawing result={result} width={story ? 330 : 270} />
          </div>
          <div style={{ ...sans, display: "flex", marginTop: 10, fontSize: 22, color: C.soft }}>Rozpoznanie</div>
          <div style={{ ...bold, display: "flex", marginTop: 6, fontSize: long ? 50 : 58, lineHeight: 1.05, letterSpacing: -1 }}>
            {result.diagnosis.name}
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 8, fontSize: 30, color: C.soft }}>{result.diagnosis.latin}</div>

          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginTop: story ? 56 : "auto",
            }}
          >
            <OgSeal size={story ? 180 : 160} />
            <div style={{ display: "flex", flexDirection: "column", width: 380, textAlign: "left" }}>
              <div style={{ ...italic, display: "flex", fontSize: 44 }}>Z. Wąsik</div>
              <div
                style={{
                  ...serif,
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 8,
                  paddingTop: 10,
                  borderTop: `2px solid ${C.ink}`,
                  fontSize: 22,
                  lineHeight: 1.35,
                  color: C.soft,
                }}
              >
                <span>dr hab. Zenon Wąsik</span>
                <span>Kierownik Pracowni Diagnostycznej</span>
              </div>
            </div>
          </div>

          <div
            style={{
              ...sans,
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginTop: 26,
              paddingTop: 14,
              borderTop: `1px solid ${C.rule}`,
              fontSize: 20,
              color: C.soft,
            }}
          >
            <span>Data badania: {result.date}</span>
            <span>dziader.si</span>
          </div>
        </div>
      </div>

      {story && (
        <div style={{ ...italic, display: "flex", marginTop: 52, fontSize: 46, color: C.paper }}>A ty? Zbadaj się na dziader.si</div>
      )}
    </div>
  );
}
