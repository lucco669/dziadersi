import { ImageResponse } from "next/og";
import { cacheLife } from "next/cache";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getBulletin, type Bulletin } from "./bulletin";
import { C, OG_FONTS, OgMark, bold, printedUrl, sans } from "./og";
import { pct, roman } from "./typo";

/*
 * The Narodowy Indeks as a badge for other sites: today's value, its zone, the warning level and
 * the last thirty days. Shown at 400 × 150 and drawn at three times that, so it stays sharp.
 */

export const BADGE_SIZE = { width: 1200, height: 450 } as const;
/** The size other sites show the badge at. */
export const BADGE_DISPLAY = { width: 400, height: 150 } as const;

const COPY = defineCopy({
  pl: {
    title: "Narodowy Indeks Dziaderstwa",
    state: "Stan dziaderstwa dziś",
    percent: (value: string) => `${value}%`,
    warning: (level: string) => `Ostrzeżenie ${level} stopnia`,
    days: "30 dni",
    updated: (time: string) => `godz. ${time}`,
    alt: (value: string, zone: string, level: string, date: string, time: string) =>
      `Stan dziaderstwa dziś: ${value}% · ${zone}. Ostrzeżenie ${level} stopnia. Narodowy Indeks Dziaderstwa, ${date}, godz. ${time}. Źródło: DZIADER.SI`,
  },
  sl: {
    title: "Nacionalni indeks dziaderstva",
    state: "Jakost dziaderstva danes",
    percent: (value: string) => `${value} %`,
    warning: (level: string) => `Opozorilo ${level}. stopnje`,
    days: "30 dni",
    updated: (time: string) => `ob ${time}`,
    alt: (value: string, zone: string, level: string, date: string, time: string) =>
      `Jakost dziaderstva danes: ${value} % · ${zone}. Opozorilo ${level}. stopnje. Nacionalni indeks dziaderstva, ${date} ob ${time}. Vir: DZIADER.SI`,
  },
});

/** The one line a reader of another site gets: alt text, the widget's text, the snippet. */
export function badgeText(bulletin: Bulletin, locale: Locale) {
  const { value, zone, season } = bulletin.index;
  return COPY[locale].alt(pct(value), zone.label, roman(season.level), bulletin.date, bulletin.time);
}

/** The last thirty days as a line: ink, today a red dot. */
function Sparkline({ values, width, height }: { values: number[]; width: number; height: number }) {
  const low = Math.floor(Math.min(...values) - 1);
  const high = Math.ceil(Math.max(...values) + 1);
  const x = (i: number) => (i / (values.length - 1)) * (width - 16) + 8;
  const y = (value: number) => height - 8 - ((value - low) / (high - low)) * (height - 16);
  const points = values.map((value, i) => `${x(i).toFixed(1)},${y(value).toFixed(1)}`).join(" ");
  const last = values.length - 1;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <line x1={0} x2={width} y1={height - 1} y2={height - 1} stroke={C.rule} strokeWidth={2} />
      <polyline points={points} fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last)} cy={y(values[last])} r={12} fill={C.red} />
    </svg>
  );
}

function Badge({ bulletin, locale }: { bulletin: Bulletin; locale: Locale }) {
  const t = COPY[locale];
  const { value, zone, season } = bulletin.index;
  const month = bulletin.chart.measured.slice(-30);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: C.paper,
        color: C.ink,
        border: `6px solid ${C.ink}`,
      }}
    >
      <div style={{ display: "flex", height: 18, background: C.red }} />
      <div style={{ display: "flex", flex: 1, padding: "30px 48px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
          <div style={{ ...sans, display: "flex", alignItems: "center", fontSize: 34, color: C.soft }}>
            <OgMark size={44} />
            <span style={{ marginLeft: 16 }}>{t.state}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 6 }}>
            <span style={{ ...bold, fontSize: 168, lineHeight: 1, letterSpacing: -6 }}>{t.percent(pct(value))}</span>
          </div>
          <div style={{ ...bold, display: "flex", marginTop: -6, fontSize: 52, lineHeight: 1 }}>{zone.label}</div>
        </div>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "flex-end" }}>
          <div
            style={{
              ...sans,
              display: "flex",
              padding: "8px 18px",
              border: `4px solid ${C.red}`,
              fontSize: 30,
              letterSpacing: 2,
              color: season.level === 3 ? C.paper : C.red,
              background: season.level === 3 ? C.red : "transparent",
            }}
          >
            {t.warning(roman(season.level)).toUpperCase()}
          </div>
          <div style={{ display: "flex", marginTop: 36 }}>
            <Sparkline values={month} width={470} height={150} />
          </div>
          <div style={{ ...sans, display: "flex", marginTop: 8, fontSize: 26, color: C.soft }}>{`${t.days} · ${t.updated(bulletin.time)}`}</div>
        </div>
      </div>
      <div
        style={{
          ...sans,
          display: "flex",
          justifyContent: "space-between",
          margin: "0 48px",
          padding: "14px 0 22px",
          borderTop: `3px solid ${C.ink}`,
          fontSize: 30,
        }}
      >
        <span>{t.title}</span>
        <span style={{ color: C.red }}>{printedUrl("/indeks", locale)}</span>
      </div>
    </div>
  );
}

/** The PNG of the edition, drawn once an hour and shared by every request in between. */
export async function badgePng(locale: Locale): Promise<Uint8Array> {
  "use cache";
  cacheLife("hours");
  const bulletin = await getBulletin(locale);
  const image = new ImageResponse(<Badge bulletin={bulletin} locale={locale} />, { ...BADGE_SIZE, fonts: OG_FONTS });
  return new Uint8Array(await image.arrayBuffer());
}
