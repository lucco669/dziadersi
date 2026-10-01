import { ImageResponse } from "next/og";
import { C, OG_FONTS, OgSeal, display, italic, mono } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}, ${site.institute}. ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "52px 72px",
          background: C.paper,
          color: C.ink,
        }}
      >
        <div
          style={{
            ...mono,
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 20,
            borderBottom: `2px solid ${C.ink}`,
            fontSize: 21,
            letterSpacing: 3,
            color: C.soft,
          }}
        >
          <span>INSTYTUT BADAŃ NAD DZIADERSTWEM</span>
          <span>IBD · EST. 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ ...display, display: "flex", fontSize: 178, lineHeight: 1, letterSpacing: -7 }}>
            DZIADER<span style={{ color: C.bordo }}>.</span>SI
          </div>
          <div style={{ ...italic, display: "flex", maxWidth: 720, marginTop: 22, fontSize: 52, lineHeight: 1.08, color: C.green }}>
            Dokumentujemy zjawisko, zanim będzie za późno.
          </div>
        </div>

        <div
          style={{
            ...mono,
            display: "flex",
            paddingTop: 20,
            borderTop: `2px solid ${C.ink}`,
            fontSize: 19,
            letterSpacing: 3,
          }}
        >
          TEST DZIADERSA · ATLAS · INDEKS · SŁOWNIK
        </div>

        <div style={{ position: "absolute", right: 92, bottom: 50, display: "flex" }}>
          <OgSeal size={230} />
        </div>
      </div>
    ),
    { ...size, fonts: OG_FONTS },
  );
}
