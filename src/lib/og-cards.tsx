import { ImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";
import { ISO, type IsoKind } from "@/components/isotype";
import { Binoculars, Figure, GREY, INK, plateDrawing } from "@/components/pictograms";
import type { Entry } from "@/content/dictionary";
import { formatReportDate, type Report } from "@/content/reports";
import { statusLabel, type Species, type SpeciesKey } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import type { ExamResult } from "./exam";
import { C, OG_FONTS, OgFrame, OgStamp, bold, italic, sans, serif } from "./og";
import { svgDataUri } from "./svg-string";
import { quote } from "./typo";

export const OG_SIZE = { width: 1200, height: 630 };

const COPY = defineCopy({
  pl: {
    atlas: "Atlas Dziadersów",
    dictionary: "Słownik Dziaderski",
    original: "",
    report: (number: string, date: string) => `Raport ${number} · ${date}`,
    exam: (date: string) => `Egzamin terenowy · ${date}`,
    points: (points: number) => `${points} z 12 oznaczeń poprawnych`,
  },
  sl: {
    atlas: "Atlas dziadersov",
    dictionary: "Dziaderski slovar",
    original: "polj.",
    report: (number: string, date: string) => `Poročilo ${number} · ${date}`,
    exam: (date: string) => `Terenski izpit · ${date}`,
    points: (points: number) => `${points} od 12 pravilnih določitev`,
  },
});

const fit = (text: string, sizes: [number, number][], fallback: number) =>
  sizes.find(([max]) => text.length <= max)?.[1] ?? fallback;

export const render = (node: ReactElement, headers?: Record<string, string>) =>
  new ImageResponse(node, { ...OG_SIZE, fonts: OG_FONTS, headers });

/** A species plate as an image, `width` wide. */
export function OgPlate({ species, width }: { species: SpeciesKey; width: number }) {
  return <img src={svgDataUri("0 0 120 100", plateDrawing(species))} width={width} height={(width * 100) / 120} alt="" />;
}

/** Ten figures, `count` of them dziaders: picture statistics for a percentage. */
export function OgTally({ count, width }: { count: number; width: number }) {
  const drawing = Array.from({ length: 10 }, (_, i) => (
    <g key={i} transform={`translate(${i * 44 + 2} 2)`}>
      {i < count ? <Figure /> : <Figure color={GREY} mustache={false} legs="trousers" />}
    </g>
  ));
  return <img src={svgDataUri("0 0 440 100", drawing)} width={width} height={(width * 100) / 440} alt="" />;
}

export function OgFigure({ height }: { height: number }) {
  return <img src={svgDataUri("-8 0 56 96", <Figure right="point" color={INK} />)} width={(height * 56) / 96} height={height} alt="" />;
}

export function speciesCard(species: Species, locale: Locale) {
  return render(
    <OgFrame locale={locale} section={COPY[locale].atlas} path={`/atlas/${species.slug}`}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 24 }}>
        <div style={{ ...sans, display: "flex", fontSize: 22, color: C.soft }}>
          {species.code} · {statusLabel(species.status, locale)}
        </div>
        <div
          style={{
            ...bold,
            display: "flex",
            marginTop: 14,
            fontSize: fit(species.name, [[18, 96], [22, 86]], 76),
            lineHeight: 0.95,
            letterSpacing: -1.5,
          }}
        >
          {species.name}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 14, fontSize: 32, color: C.soft }}>{species.latin}</div>
        <div style={{ ...italic, display: "flex", marginTop: 26, maxWidth: 560, fontSize: 34, lineHeight: 1.2 }}>
          {quote(species.calls[0], locale)}
        </div>
      </div>
      <OgPlate species={species.key} width={470} />
    </OgFrame>,
  );
}

/** A dictionary entry: the edition's headword; the Slovenian card also names the Polish original. */
export function entryCard(entry: Entry, locale: Locale) {
  const t = COPY[locale];
  const sense = entry.senses[0].text;
  return render(
    <OgFrame locale={locale} section={t.dictionary} path={`/slownik/${entry.slug}`}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 30 }}>
        <div
          style={{
            ...bold,
            display: "flex",
            fontSize: fit(entry.headword, [[16, 104], [26, 86]], 70),
            lineHeight: 0.95,
            letterSpacing: -1.5,
          }}
        >
          {entry.headword}
        </div>
        <div style={{ ...italic, display: "flex", alignItems: "baseline", marginTop: 16, fontSize: 30, color: C.soft }}>
          {entry.grammar}
          {t.original && entry.original ? (
            <span style={{ ...sans, fontStyle: "normal", marginLeft: 22, fontSize: 22 }}>{`${t.original} ${entry.original}`}</span>
          ) : null}
        </div>
        <div style={{ ...serif, display: "flex", marginTop: 24, maxWidth: 680, fontSize: 31, lineHeight: 1.3 }}>
          {sense.length > 140 ? `${sense.slice(0, 137)}…` : sense}
        </div>
      </div>
      {entry.species ? <OgPlate species={entry.species} width={380} /> : <OgFigure height={330} />}
    </OgFrame>,
  );
}

export function reportCard(report: Report, locale: Locale) {
  const finding = report.findings[0];
  // "61%" in Polish, "61 %" in Slovenian.
  const percent = /^(\d+)\s?%$/.exec(finding.value);
  const section = COPY[locale].report(report.number, formatReportDate(report.date, locale));
  return render(
    <OgFrame locale={locale} section={section} path={`/raporty/${report.slug}`}>
      <div style={{ display: "flex", flexDirection: "column", width: 470, marginRight: 50 }}>
        <div style={{ ...bold, display: "flex", fontSize: finding.value.length > 5 ? 118 : 172, lineHeight: 0.9, letterSpacing: -4, color: C.red }}>
          {finding.value}
        </div>
        <div style={{ ...sans, display: "flex", marginTop: 14, fontSize: 24, lineHeight: 1.25, color: C.soft }}>{finding.label}</div>
        {percent && (
          <div style={{ display: "flex", marginTop: 26 }}>
            <OgTally count={Math.round(Number(percent[1]) / 10)} width={420} />
          </div>
        )}
      </div>
      <div
        style={{
          ...bold,
          display: "flex",
          flex: 1,
          paddingLeft: 48,
          borderLeft: `2px solid ${C.ink}`,
          fontSize: report.title.length > 70 ? 48 : 56,
          lineHeight: 1.05,
          letterSpacing: -0.8,
        }}
      >
        {report.title}
      </div>
    </OgFrame>,
  );
}

/** A department's card. `path` is the internal path of the page it shares. */
export function sectionCard(
  { section, title, subtitle, path, art }: { section: string; title: string; subtitle: string; path: string; art: ReactNode },
  locale: Locale,
) {
  return render(
    <OgFrame locale={locale} section={section} path={path}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 30 }}>
        <div style={{ ...bold, display: "flex", fontSize: title.length > 20 ? 88 : 112, lineHeight: 0.92, letterSpacing: -2.5 }}>
          {title}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 24, maxWidth: 620, fontSize: 36, lineHeight: 1.2, color: C.soft }}>
          {subtitle}
        </div>
      </div>
      {art}
    </OgFrame>,
  );
}

/** Fifty figures in five rows, `count` of them dziaders, in a fixed scattered order. */
export function OgCrowd({ count, width }: { count: number; width: number }) {
  const order = Array.from({ length: 50 }, (_, i) => (i * 37) % 50);
  const on = new Set(order.slice(0, count));
  const drawing = Array.from({ length: 50 }, (_, i) => (
    <g key={i} transform={`translate(${(i % 10) * 44 + 2} ${Math.floor(i / 10) * 104 + 2})`}>
      {on.has(i) ? <Figure /> : <Figure color={GREY} mustache={false} legs="trousers" />}
    </g>
  ));
  return <img src={svgDataUri("0 0 440 520", drawing)} width={width} height={(width * 520) / 440} alt="" />;
}

/** The field observer: bucket hat, glasses, binoculars. */
export function OgBinoculars({ height }: { height: number }) {
  return (
    <img
      src={svgDataUri("-4 -1 48 97", <Figure left="hip" glasses="eyes" hat="bucket" torso={<Binoculars />} />)}
      width={(height * 48) / 97}
      height={height}
      alt=""
    />
  );
}

/** An exam result: the grade, its name and title, twelve squares for the answers. */
export function examCard(result: ExamResult, locale: Locale, headers?: Record<string, string>) {
  const t = COPY[locale];
  const squares = result.questions.map((question, i) => (
    <rect key={i} x={i * 36} y={0} width={32} height={32} fill={result.answers[i] === question.correct ? C.ink : C.red} />
  ));
  return render(
    <OgFrame locale={locale} section={t.exam(result.date)} path="/egzamin">
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ ...bold, display: "flex", fontSize: 230, lineHeight: 0.8, letterSpacing: -6 }}>{result.grade.value}</div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 34, paddingBottom: 8 }}>
            <div style={{ ...bold, display: "flex", fontSize: 64, lineHeight: 1 }}>{result.grade.name}</div>
            <div style={{ ...sans, display: "flex", marginTop: 12, fontSize: 26, color: C.soft }}>{t.points(result.points)}</div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 34 }}>
          <OgStamp label={result.grade.title} fontSize={24} />
        </div>
        <div style={{ display: "flex", marginTop: 34 }}>
          <img src={svgDataUri("0 0 428 32", squares)} width={642} height={48} alt="" />
        </div>
      </div>
      <OgBinoculars height={400} />
    </OgFrame>,
    headers,
  );
}

/** A block of Isotype symbols from the Rocznik, `count` of them, the last one cut to `part`. */
export function OgIsotype({ kind, count, part = 1, columns, width }: { kind: IsoKind; count: number; part?: number; columns: number; width: number }) {
  const rows = Math.ceil(count / columns);
  const drawing = Array.from({ length: count }, (_, i) => {
    const fraction = i === count - 1 ? part : 1;
    return (
      <svg key={i} x={(i % columns) * 28} y={Math.floor(i / columns) * 30} width={24 * fraction} height={24} viewBox={`0 0 ${24 * fraction} 24`}>
        {ISO[kind]}
      </svg>
    );
  });
  const viewWidth = columns * 28 - 4;
  const viewHeight = rows * 30 - 6;
  return <img src={svgDataUri(`0 0 ${viewWidth} ${viewHeight}`, drawing)} width={width} height={(width * viewHeight) / viewWidth} alt="" />;
}

/** The tile map of voivodeships, shaded in a fixed pattern: art for the observation map. */
export function OgTileMap({ width }: { width: number }) {
  const shades = [C.ink, "#5d574e", "#a69d8c", "#d3cbbb", C.red];
  const tiles = Array.from({ length: 16 }, (_, i) => (
    <rect key={i} x={(i % 4) * 26} y={Math.floor(i / 4) * 26} width={24} height={24} fill={i === 6 ? shades[4] : shades[(i * 7 + 3) % 4]} />
  ));
  return <img src={svgDataUri("0 0 102 102", tiles)} width={width} height={width} alt="" />;
}

/** Three medals on ribbons, second, first and third: art for the Tablica Honorowa. */
export function OgMedals({ width }: { width: number }) {
  const medal = (x: number, y: number, scale: number, fill: string) => (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M11 0H19L23 18H15Z" fill={C.red} />
      <path d="M29 0H21L17 18H25Z" fill="#3d6696" />
      <circle cx={20} cy={30} r={14} fill={fill} />
      <circle cx={20} cy={30} r={10.4} fill="none" stroke={C.paper} strokeWidth={1.2} />
    </g>
  );
  return (
    <img
      src={svgDataUri("0 0 130 80", <>{[medal(0, 14, 1, "#cec6b6"), medal(42, 0, 1.25, "#d49a2a"), medal(92, 22, 0.95, C.red)]}</>)}
      width={width}
      height={(width * 80) / 130}
      alt=""
    />
  );
}
