import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MUSTACHE_PATH } from "@/components/brand";

/* Shared by every generated image: static TTFs (Satori reads neither woff2 nor variable fonts). */

const [frauncesBlack, frauncesItalic, plexMono] = await Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Fraunces-144pt-Black.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Fraunces-72pt-MediumItalic.ttf")),
  readFile(join(process.cwd(), "assets/fonts/IBMPlexMono-Medium.ttf")),
]);

export const OG_FONTS = [
  { name: "Fraunces", data: frauncesBlack, weight: 900 as const, style: "normal" as const },
  { name: "Fraunces", data: frauncesItalic, weight: 500 as const, style: "italic" as const },
  { name: "Plex Mono", data: plexMono, weight: 500 as const, style: "normal" as const },
];

export const C = {
  paper: "#f1ebdd",
  paperLight: "#f8f4ea",
  ink: "#1b1a17",
  soft: "#4b463d",
  faint: "#756e60",
  green: "#1f3b30",
  bordo: "#8c1f2e",
};

export const display = { fontFamily: "Fraunces", fontWeight: 900 } as const;
export const italic = { fontFamily: "Fraunces", fontWeight: 500, fontStyle: "italic" } as const;
export const mono = { fontFamily: "Plex Mono", fontWeight: 500 } as const;

/** The Institute seal, drawn with boxes (Satori can't set text on a path). */
export function OgSeal({ size, color = C.bordo, rotate = -12 }: { size: number; color?: string; rotate?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `${Math.round(size * 0.032)}px solid ${color}`,
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
          border: `${Math.max(2, Math.round(size * 0.009))}px solid ${color}`,
          borderRadius: 9999,
        }}
      >
        <div style={{ ...mono, display: "flex", fontSize: size * 0.07, letterSpacing: size * 0.012, color }}>EST. 2026</div>
        <svg width={size * 0.56} height={size * 0.2} viewBox="0 0 100 36" style={{ marginTop: size * 0.03 }}>
          <path d={MUSTACHE_PATH} fill={color} />
        </svg>
        <div style={{ ...display, display: "flex", marginTop: size * 0.01, fontSize: size * 0.17, letterSpacing: size * 0.015, color }}>
          IBD
        </div>
      </div>
    </div>
  );
}

/** Double-ruled rubber stamp with a label. */
export function OgStamp({ label, fontSize, rotate = -3 }: { label: string; fontSize: number; rotate?: number }) {
  return (
    <div style={{ display: "flex", padding: 4, border: `3px solid ${C.bordo}`, transform: `rotate(${rotate}deg)` }}>
      <div
        style={{
          ...mono,
          display: "flex",
          padding: `${Math.round(fontSize * 0.45)}px ${Math.round(fontSize * 0.85)}px`,
          border: `1.5px solid ${C.bordo}`,
          fontSize,
          letterSpacing: fontSize * 0.18,
          color: C.bordo,
        }}
      >
        {label.toUpperCase()}
      </div>
    </div>
  );
}
