import { ImageResponse } from "next/og";
import type { ReactElement, ReactNode } from "react";
import { ISO, type IsoKind } from "@/components/isotype";
import { Binoculars, Figure, GREY, INK, plateDrawing } from "@/components/pictograms";
import type { Entry } from "@/content/dictionary";
import { formatReportDate, type Report } from "@/content/reports";
import { statusLabel, type Species, type SpeciesKey } from "@/content/species";
import type { ExamResult } from "./exam";
import { C, OG_FONTS, OgFrame, OgStamp, bold, italic, sans, serif } from "./og";
import { svgDataUri } from "./svg-string";

export const OG_SIZE = { width: 1200, height: 630 };

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

export function speciesCard(species: Species) {
  return render(
    <OgFrame section="Atlas Dziadersów" url={`dziader.si/atlas/${species.slug}`}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 24 }}>
        <div style={{ ...sans, display: "flex", fontSize: 22, color: C.soft }}>
          {species.code} · {statusLabel(species.status)}
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
          „{species.calls[0]}”
        </div>
      </div>
      <OgPlate species={species.key} width={470} />
    </OgFrame>,
  );
}

export function entryCard(entry: Entry) {
  const sense = entry.senses[0].text;
  return render(
    <OgFrame section="Słownik Dziaderski" url={`dziader.si/slownik/${entry.slug}`}>
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
        <div style={{ ...italic, display: "flex", marginTop: 16, fontSize: 30, color: C.soft }}>{entry.grammar}</div>
        <div style={{ ...serif, display: "flex", marginTop: 24, maxWidth: 680, fontSize: 31, lineHeight: 1.3 }}>
          {sense.length > 140 ? `${sense.slice(0, 137)}…` : sense}
        </div>
      </div>
      {entry.species ? <OgPlate species={entry.species} width={380} /> : <OgFigure height={330} />}
    </OgFrame>,
  );
}

export function reportCard(report: Report) {
  const finding = report.findings[0];
  const percent = /^(\d+)%$/.exec(finding.value);
  return render(
    <OgFrame section={`Raport ${report.number} · ${formatReportDate(report.date)}`} url={`dziader.si/raporty/${report.slug}`}>
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

export function sectionCard({ section, title, subtitle, url, art }: {
  section: string;
  title: string;
  subtitle: string;
  url: string;
  art: ReactNode;
}) {
  return render(
    <OgFrame section={section} url={url}>
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
export function examCard(result: ExamResult, headers?: Record<string, string>) {
  const squares = result.questions.map((question, i) => (
    <rect key={i} x={i * 36} y={0} width={32} height={32} fill={result.answers[i] === question.correct ? C.ink : C.red} />
  ));
  return render(
    <OgFrame section={`Egzamin terenowy · ${result.date}`} url="dziader.si/egzamin">
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ ...bold, display: "flex", fontSize: 230, lineHeight: 0.8, letterSpacing: -6 }}>{result.grade.value}</div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 34, paddingBottom: 8 }}>
            <div style={{ ...bold, display: "flex", fontSize: 64, lineHeight: 1 }}>{result.grade.name}</div>
            <div style={{ ...sans, display: "flex", marginTop: 12, fontSize: 26, color: C.soft }}>{`${result.points} z 12 oznaczeń poprawnych`}</div>
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
