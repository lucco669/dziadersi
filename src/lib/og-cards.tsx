import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import type { Entry } from "@/content/dictionary";
import { formatReportDate, type Report } from "@/content/reports";
import { statusLabel, type Species } from "@/content/species";
import { C, OG_FONTS, OgSeal, display, italic, mono } from "./og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared frame: mono masthead row, content, mono footer row, seal on the bottom rule. */
function Frame({ top, side, footer, link, seal = true, children }: {
  top: string;
  side: string;
  footer: string;
  link: string;
  seal?: boolean;
  children: ReactNode;
}) {
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
        <span>{top}</span>
        <span>{side}</span>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center" }}>{children}</div>
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
        <span>{footer}</span>
        <span style={{ color: C.bordo, marginRight: seal ? 220 : 0 }}>{link}</span>
      </div>
      {seal && (
        <div style={{ position: "absolute", right: 60, bottom: 14, display: "flex" }}>
          <OgSeal size={170} />
        </div>
      )}
    </div>
  );
}

const fit = (text: string, sizes: [number, number][], fallback: number) =>
  sizes.find(([max]) => text.length <= max)?.[1] ?? fallback;

export function speciesCard(species: Species) {
  return new ImageResponse(
    (
      <Frame
        top="ATLAS DZIADERSÓW · INSTYTUT BADAŃ NAD DZIADERSTWEM"
        side={species.code}
        footer="7 OBJAWÓW · SIEDLISKO · WROGOWIE"
        link="DZIADER.SI/ATLAS"
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
          <div
            style={{
              ...display,
              display: "flex",
              fontSize: fit(species.name, [[18, 104], [22, 92]], 82),
              lineHeight: 0.95,
              letterSpacing: -3,
            }}
          >
            {species.name}
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 16, fontSize: 32, color: C.soft }}>
            {species.latin} ({species.authority})
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 28, fontSize: 36, lineHeight: 1.15, color: C.green }}>
            „{species.calls[0]}”
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 230,
            marginBottom: 120,
            padding: "18px 14px",
            border: `2px solid ${C.ink}`,
            background: C.paperLight,
          }}
        >
          <div style={{ ...mono, display: "flex", fontSize: 16, letterSpacing: 3, color: C.faint }}>STATUS</div>
          <div style={{ ...mono, display: "flex", marginTop: 4, fontSize: 64, letterSpacing: 2 }}>{species.status}</div>
          <div style={{ ...mono, display: "flex", fontSize: 14, letterSpacing: 2, color: C.soft, textAlign: "center" }}>
            {statusLabel(species.status).toUpperCase()}
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}

export function entryCard(entry: Entry) {
  const sense = entry.senses[0].text;
  return new ImageResponse(
    (
      <Frame
        top="SŁOWNIK DZIADERSKI · INSTYTUT BADAŃ NAD DZIADERSTWEM"
        side="HASŁO"
        footer="ZNACZENIE · WYMOWA · PRZYKŁADY UŻYCIA"
        link="DZIADER.SI/SLOWNIK"
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div
            style={{
              ...display,
              display: "flex",
              fontSize: fit(entry.headword, [[16, 118], [26, 96]], 78),
              lineHeight: 0.95,
              letterSpacing: -3,
            }}
          >
            {entry.headword}
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 20, fontSize: 32, color: C.soft }}>{entry.grammar}</div>
          <div style={{ ...italic, display: "flex", marginTop: 22, maxWidth: 840, fontSize: 31, lineHeight: 1.25, color: C.green }}>
            {sense.length > 130 ? `${sense.slice(0, 127)}…` : sense}
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}

export function reportCard(report: Report) {
  const finding = report.findings[0];
  return new ImageResponse(
    (
      <Frame
        top={`RAPORTY INSTYTUTU · ${report.category.toUpperCase()}`}
        side={report.number}
        footer={formatReportDate(report.date).toUpperCase()}
        link="DZIADER.SI/RAPORTY"
      >
        <div style={{ display: "flex", flexDirection: "column", width: 400, marginRight: 44 }}>
          <div style={{ ...display, display: "flex", fontSize: finding.value.length > 5 ? 112 : 168, lineHeight: 1, letterSpacing: -6, color: C.bordo }}>
            {finding.value}
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 10, fontSize: 28, lineHeight: 1.2, color: C.soft }}>{finding.label}</div>
        </div>
        <div
          style={{
            ...display,
            display: "flex",
            flex: 1,
            paddingLeft: 44,
            borderLeft: `2px solid ${C.ink}`,
            fontSize: report.title.length > 70 ? 46 : 54,
            lineHeight: 1.05,
            letterSpacing: -1.5,
          }}
        >
          {report.title}
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}

export function sectionCard({ kicker, title, subtitle, footer, link }: {
  kicker: string;
  title: string;
  subtitle: string;
  footer: string;
  link: string;
}) {
  return new ImageResponse(
    (
      <Frame top="INSTYTUT BADAŃ NAD DZIADERSTWEM" side={kicker} footer={footer} link={link}>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div style={{ ...display, display: "flex", fontSize: title.length > 18 ? 104 : 136, lineHeight: 0.92, letterSpacing: -5 }}>
            {title}
          </div>
          <div style={{ ...italic, display: "flex", marginTop: 26, maxWidth: 800, fontSize: 40, lineHeight: 1.12, color: C.green }}>
            {subtitle}
          </div>
        </div>
      </Frame>
    ),
    { ...OG_SIZE, fonts: OG_FONTS },
  );
}
