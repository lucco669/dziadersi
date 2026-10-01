import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MUSTACHE_PATH } from "@/components/brand";
import { site } from "@/lib/site";

export const alt = `${site.name}, ${site.institute}. ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "assets/fonts");
const [frauncesBlack, frauncesItalic, plexMono] = await Promise.all([
  readFile(join(fontDir, "Fraunces-144pt-Black.ttf")),
  readFile(join(fontDir, "Fraunces-72pt-MediumItalic.ttf")),
  readFile(join(fontDir, "IBMPlexMono-Medium.ttf")),
]);

const PAPER = "#f1ebdd";
const INK = "#1b1a17";
const SOFT = "#4b463d";
const GREEN = "#1f3b30";
const BORDO = "#8c1f2e";

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
          background: PAPER,
          color: INK,
          fontFamily: "Plex Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 20,
            borderBottom: `2px solid ${INK}`,
            fontSize: 21,
            letterSpacing: 3,
            color: SOFT,
          }}
        >
          <span>INSTYTUT BADAŃ NAD DZIADERSTWEM</span>
          <span>IBD · EST. 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 900, fontSize: 178, lineHeight: 1, letterSpacing: -7 }}>
            DZIADER<span style={{ color: BORDO }}>.</span>SI
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 720,
              marginTop: 22,
              fontFamily: "Fraunces",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: 52,
              lineHeight: 1.08,
              color: GREEN,
            }}
          >
            Dokumentujemy zjawisko, zanim będzie za późno.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            paddingTop: 20,
            borderTop: `2px solid ${INK}`,
            fontSize: 19,
            letterSpacing: 3,
          }}
        >
          TEST DZIADERSA · ATLAS · INDEKS · SŁOWNIK
        </div>

        <div
          style={{
            position: "absolute",
            right: 92,
            bottom: 50,
            width: 230,
            height: 230,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `7px solid ${BORDO}`,
            borderRadius: 999,
            transform: "rotate(-12deg)",
            opacity: 0.92,
          }}
        >
          <div
            style={{
              width: 196,
              height: 196,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${BORDO}`,
              borderRadius: 999,
            }}
          >
            <svg width="132" height="48" viewBox="0 0 100 36">
              <path d={MUSTACHE_PATH} fill={BORDO} />
            </svg>
            <div style={{ display: "flex", marginTop: 6, fontFamily: "Fraunces", fontWeight: 900, fontSize: 40, letterSpacing: 4, color: BORDO }}>
              IBD
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: frauncesBlack, weight: 900, style: "normal" },
        { name: "Fraunces", data: frauncesItalic, weight: 500, style: "italic" },
        { name: "Plex Mono", data: plexMono, weight: 500, style: "normal" },
      ],
    },
  );
}
