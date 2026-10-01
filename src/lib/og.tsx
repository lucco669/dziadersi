import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";
import { MUSTACHE_PATH } from "@/components/pictograms";

/* Shared by every generated image: static TTFs (Satori reads neither woff2 nor variable fonts). */

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

const [serifBold, serifRegular, serifItalic, sansSemiBold] = await Promise.all([
  font("PoltawskiNowy-Bold.ttf"),
  font("PoltawskiNowy-Regular.ttf"),
  font("PoltawskiNowy-Italic.ttf"),
  font("SchibstedGrotesk-SemiBold.ttf"),
]);

export const OG_FONTS = [
  { name: "Poltawski", data: serifBold, weight: 700 as const, style: "normal" as const },
  { name: "Poltawski", data: serifRegular, weight: 400 as const, style: "normal" as const },
  { name: "Poltawski", data: serifItalic, weight: 400 as const, style: "italic" as const },
  { name: "Schibsted", data: sansSemiBold, weight: 600 as const, style: "normal" as const },
];

export const C = {
  paper: "#f4f0e7",
  card: "#fbf8f1",
  ink: "#161513",
  soft: "#57524a",
  faint: "#8a8376",
  rule: "#d8d0c0",
  red: "#c4362c",
};

export const bold = { fontFamily: "Poltawski", fontWeight: 700 } as const;
export const serif = { fontFamily: "Poltawski", fontWeight: 400 } as const;
export const italic = { fontFamily: "Poltawski", fontWeight: 400, fontStyle: "italic" } as const;
export const sans = { fontFamily: "Schibsted", fontWeight: 600 } as const;

/** The pictogram head. */
export function OgMark({ size, color = C.ink, cutout = C.paper }: { size: number; color?: string; cutout?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="24" fill={color} />
      <path d={MUSTACHE_PATH} fill={cutout} transform="translate(6.2 21.6) scale(0.356)" />
    </svg>
  );
}

export function OgLogo({ size = 44, color = C.ink, cutout = C.paper }: { size?: number; color?: string; cutout?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <OgMark size={size * 1.25} color={color} cutout={cutout} />
      <div style={{ ...bold, display: "flex", marginLeft: size * 0.36, fontSize: size, letterSpacing: -0.4, color }}>
        DZIADER<span style={{ color: C.red }}>.</span>SI
      </div>
    </div>
  );
}

/** The Institute's seal, drawn with boxes (Satori can't set text on a path). */
export function OgSeal({ size, color = C.red, rotate = -10 }: { size: number; color?: string; rotate?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `${Math.round(size * 0.034)}px solid ${color}`,
        borderRadius: 9999,
        transform: `rotate(${rotate}deg)`,
        opacity: 0.92,
      }}
    >
      <div
        style={{
          width: size * 0.84,
          height: size * 0.84,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `${Math.max(2, Math.round(size * 0.01))}px solid ${color}`,
          borderRadius: 9999,
        }}
      >
        <div style={{ ...sans, display: "flex", fontSize: size * 0.068, letterSpacing: size * 0.006, color }}>DZIADER.SI</div>
        <div style={{ display: "flex", marginTop: size * 0.03 }}>
          <OgMark size={size * 0.32} color={color} />
        </div>
        <div style={{ ...bold, display: "flex", marginTop: size * 0.02, fontSize: size * 0.13, letterSpacing: size * 0.012, color }}>
          IBD
        </div>
      </div>
    </div>
  );
}

/** Double-ruled rubber stamp with a label. */
export function OgStamp({ label, fontSize, rotate = -3 }: { label: string; fontSize: number; rotate?: number }) {
  return (
    <div style={{ display: "flex", padding: 4, border: `3px solid ${C.red}`, transform: `rotate(${rotate}deg)` }}>
      <div
        style={{
          ...sans,
          display: "flex",
          padding: `${Math.round(fontSize * 0.42)}px ${Math.round(fontSize * 0.8)}px`,
          border: `1.5px solid ${C.red}`,
          fontSize,
          letterSpacing: fontSize * 0.12,
          color: C.red,
        }}
      >
        {label.toUpperCase()}
      </div>
    </div>
  );
}

/** 1200 × 630 share card: logo and section on top, content, a rule and the address at the bottom. */
export function OgFrame({ section, url, children }: { section: string; url: string; children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "44px 60px 38px",
        background: C.paper,
        color: C.ink,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <OgLogo size={40} />
        <div style={{ ...sans, display: "flex", fontSize: 22, color: C.soft }}>{section}</div>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>{children}</div>
      <div
        style={{
          ...sans,
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 16,
          borderTop: `2px solid ${C.ink}`,
          fontSize: 21,
        }}
      >
        <span style={{ color: C.soft }}>Instytut Badań nad Dziaderstwem</span>
        <span style={{ color: C.red }}>{url}</span>
      </div>
    </div>
  );
}
