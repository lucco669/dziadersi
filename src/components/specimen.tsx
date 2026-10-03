import type { CSSProperties } from "react";
import Image from "next/image";
import { cx } from "@/lib/typo";
import { INK } from "./pictograms";

type Part = { name: string; note: string; side: "l" | "r"; at: [number, number]; y: number };

/** Field marks of the common dziaders, as labelled on Rys. 1. Anchors are in figure units. */
const PARTS: Part[] = [
  { name: "Okulary", note: "na czole, szukane po całym domu", side: "l", at: [60, 4], y: 8 },
  { name: "Wąs", note: "noszony bez przerwy od 1987 r.", side: "r", at: [62, 14], y: 12 },
  { name: "Długopis", note: "w kieszonce koszuli, nie pisze", side: "r", at: [67, 28], y: 31 },
  { name: "Saszetka", note: "dokumenty, klucze, paragony z 2014 r.", side: "l", at: [49, 48], y: 54 },
  { name: "Telefon", note: "w kaburze przy pasku", side: "r", at: [72, 47], y: 56 },
  { name: "Skarpety", note: "białe, frotte, do połowy łydki", side: "l", at: [54, 84], y: 84 },
  { name: "Sandały", note: "skórzane, na rzepy", side: "r", at: [73, 97], y: 94 },
];

// The drawing is 120 × 104; the figure stands at (40, 4), labels end at x = 32 and start at x = 88.
const W = 120;
const H = 104;
const LEFT = 32;
const RIGHT = 88;

const vars = (i: number) => ({ "--i": i }) as CSSProperties;

/** Rys. 1: the dziaders in summer plumage, with its field marks labelled like a schoolbook diagram. */
export function Specimen({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
        <Image src="/illustrations/specimen.webp" alt="Dziaders pospolity: okulary na czole, wąs, długopis, saszetka, telefon przy pasku, skarpety i sandały." width={960} height={1440} preload sizes="(max-width: 1023px) 60vw, 380px" className="absolute left-[20%] top-0 h-full w-[60%] object-contain" />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          {PARTS.map((part, i) => {
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

        {PARTS.map((part, i) => (
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
        {PARTS.map((part, i) => (
          <li key={part.name} className="flex gap-2">
            <span className="font-semibold">{i + 1}.</span>
            <span>
              <span className="font-semibold">{part.name}</span> <span className="text-ink-soft">{part.note}</span>
            </span>
          </li>
        ))}
      </ol>

      <figcaption className="label mt-5 text-ink-soft">
        Rys. 1. Dziaders pospolity (<i className="font-serif text-[1.05em]">Dziadersus vulgaris</i>), osobnik dorosły w szacie letniej.
      </figcaption>
    </figure>
  );
}
