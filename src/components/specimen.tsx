import type { CSSProperties } from "react";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { cx } from "@/lib/typo";
import { INK } from "./pictograms";

type Part = { side: "l" | "r"; at: [number, number]; y: number };

/** Field marks of the common dziaders, as labelled on Rys. 1. Anchors are in figure units. */
const PARTS: Part[] = [
  { side: "l", at: [60, 4], y: 8 },
  { side: "r", at: [62, 14], y: 12 },
  { side: "r", at: [67, 28], y: 31 },
  { side: "l", at: [49, 48], y: 54 },
  { side: "r", at: [72, 47], y: 56 },
  { side: "l", at: [54, 84], y: 84 },
  { side: "r", at: [73, 97], y: 94 },
];

/** The labels of PARTS, in the same order. */
const COPY = defineCopy({
  pl: {
    parts: [
      { name: "Okulary", note: "na czole, szukane po całym domu" },
      { name: "Wąs", note: "noszony bez przerwy od 1987 r." },
      { name: "Długopis", note: "w kieszonce koszuli, nie pisze" },
      { name: "Saszetka", note: "dokumenty, klucze, paragony z 2014 r." },
      { name: "Telefon", note: "w kaburze przy pasku" },
      { name: "Skarpety", note: "białe, frotte, do połowy łydki" },
      { name: "Sandały", note: "skórzane, na rzepy" },
    ],
    alt: "Dziaders pospolity: okulary na czole, wąs, długopis, saszetka, telefon przy pasku, skarpety i sandały.",
    figure: "Rys. 1. Dziaders pospolity",
    caption: "osobnik dorosły w szacie letniej.",
  },
  sl: {
    parts: [
      { name: "Očala", note: "na čelu, iskana po vsej hiši" },
      { name: "Brki", note: "nošeni brez prekinitve od leta 1987" },
      { name: "Kemični svinčnik", note: "v žepku srajce, ne piše" },
      { name: "Torbica", note: "dokumenti, ključi, računi iz leta 2014" },
      { name: "Telefon", note: "v etuiju na pasu" },
      { name: "Nogavice", note: "bele, frotirne, do pol meč" },
      { name: "Sandali", note: "usnjeni, na ježka" },
    ],
    alt: "Navadni dziaders: očala na čelu, brki, kemični svinčnik, torbica, telefon na pasu, nogavice in sandali.",
    figure: "Sl. 1. Navadni dziaders",
    caption: "odrasel osebek v poletnem perju.",
  },
});

// The drawing is 120 × 104; the figure stands at (40, 4), labels end at x = 32 and start at x = 88.
const W = 120;
const H = 104;
const LEFT = 32;
const RIGHT = 88;

const vars = (i: number) => ({ "--i": i }) as CSSProperties;

/** Rys. 1: the dziaders in summer plumage, with its field marks labelled like a schoolbook diagram. */
export function Specimen({ locale, className }: { locale: Locale; className?: string }) {
  const t = COPY[locale];
  const parts = PARTS.map((part, i) => ({ ...part, ...t.parts[i] }));
  return (
    <figure className={className}>
      <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
        <Image src="/illustrations/specimen.webp" alt={t.alt} width={960} height={1440} preload sizes="(max-width: 1023px) 60vw, 380px" className="absolute left-[20%] top-0 h-full w-[60%] object-contain" />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          {parts.map((part, i) => {
            const [x, y] = part.at;
            const end = part.side === "l" ? LEFT : RIGHT;
            return (
              <g key={part.name}>
                <line
                  x1={x}
                  y1={y}
                  x2={end}
                  y2={part.y}
                  pathLength={1}
                  stroke={INK}
                  strokeWidth={0.35}
                  className="specimen-line"
                  style={vars(i)}
                />
                <circle cx={x} cy={y} r={0.9} fill={INK} stroke="#f4f0e7" strokeWidth={0.4} />
                <g className="sm:hidden">
                  <circle cx={end} cy={part.y} r={3.4} fill={INK} />
                  <text
                    x={end}
                    y={part.y + 1.45}
                    textAnchor="middle"
                    fontSize={4.2}
                    fontWeight={600}
                    fill="#f4f0e7"
                    style={{ fontFamily: "var(--font-schibsted)" }}
                  >
                    {i + 1}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {parts.map((part, i) => (
          <p
            key={part.name}
            className={cx(
              "specimen-label absolute hidden -translate-y-1/2 leading-tight sm:block",
              part.side === "l" ? "pr-3 text-right" : "pl-3",
            )}
            style={{
              ...vars(i),
              top: `${(part.y / H) * 100}%`,
              ...(part.side === "l" ? { left: 0, width: `${(LEFT / W) * 100}%` } : { left: `${(RIGHT / W) * 100}%`, right: 0 }),
            }}
          >
            <span className="block font-serif text-[1.05rem] font-bold">{part.name}</span>
            <span className="mt-0.5 block font-sans text-[0.8rem] leading-snug text-ink-soft">{part.note}</span>
          </p>
        ))}
      </div>

      <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 font-sans text-[0.875rem] leading-snug sm:hidden">
        {parts.map((part, i) => (
          <li key={part.name} className="flex gap-2">
            <span className="font-semibold">{i + 1}.</span>
            <span>
              <span className="font-semibold">{part.name}</span> <span className="text-ink-soft">{part.note}</span>
            </span>
          </li>
        ))}
      </ol>

      <figcaption className="label mt-5 text-ink-soft">
        {t.figure} (<i className="font-serif text-[1.05em]">Dziadersus vulgaris</i>), {t.caption}
      </figcaption>
    </figure>
  );
}
