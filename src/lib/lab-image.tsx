import { ImageResponse } from "next/og";
import { labComment, labResults } from "./lab";
import { C, OG_FONTS, OgLogo, OgSeal, bold, italic, sans, serif } from "./og";
import type { Result } from "./test";

export const LAB_IMAGE = { width: 1080, height: 1350 } as const;

/** The lab printout as an Instagram post (4:5): paper on ink, like the certificate. */
export function labImage(result: Result, headers?: Record<string, string>) {
  const rows = labResults(result);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "46px 56px 40px",
        background: C.ink,
      }}
    >
      <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: 12, background: C.card }}>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "28px 40px 26px", border: `2px solid ${C.ink}` }}>
          <div style={{ ...sans, display: "flex", justifyContent: "space-between", fontSize: 20, color: C.soft }}>
            <span>Zakład Diagnostyki Dziaderstwa IBD</span>
            <span>Nr próbki {result.certificate}</span>
          </div>
          <div style={{ ...bold, display: "flex", marginTop: 18, fontSize: 58, lineHeight: 1, letterSpacing: -1 }}>
            Wyniki badań laboratoryjnych
          </div>
          <div
            style={{
              ...sans,
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
              padding: "12px 0",
              borderTop: `2px solid ${C.ink}`,
              borderBottom: `2px solid ${C.ink}`,
              fontSize: 20,
            }}
          >
            <span>Pacjent: {result.name || "osoba badana"}</span>
            <span style={{ color: C.soft }}>{result.proxy ? "Wywiad rodzinny" : `Pobrano ${result.date}`}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
            {rows.map((row) => (
              <div
                key={row.code}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: `1px solid ${C.rule}`,
                  fontSize: 21,
                }}
              >
                <span style={{ ...sans, width: 72 }}>{row.code}</span>
                <span style={{ ...serif, flex: 1, fontSize: 22, color: C.ink }}>{row.name}</span>
                <span
                  style={{
                    ...sans,
                    width: 190,
                    display: "flex",
                    justifyContent: "flex-end",
                    color: row.flag ? C.red : C.ink,
                  }}
                >
                  {row.value} {row.unit.length <= 6 ? row.unit : ""} {row.flag === "H" ? "↑" : row.flag === "L" ? "↓" : ""}
                </span>
                <span style={{ ...sans, width: 120, display: "flex", justifyContent: "flex-end", fontSize: 17, color: C.faint }}>
                  {row.range}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "auto", paddingTop: 20 }}>
            <div style={{ ...italic, display: "flex", width: 560, fontSize: 25, lineHeight: 1.3 }}>{labComment(rows)}</div>
            <OgSeal size={140} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 30 }}>
        <OgLogo size={34} color={C.paper} cutout={C.ink} />
        <div style={{ ...italic, display: "flex", fontSize: 32, color: C.paper }}>A twoje wyniki? dziader.si</div>
      </div>
    </div>,
    { ...LAB_IMAGE, fonts: OG_FONTS, headers },
  );
}
