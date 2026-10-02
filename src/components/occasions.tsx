import type { ReactNode } from "react";
import { BLUE, Figure, GREY, INK, Note, OCHRE, PAPER, plateDrawing, RED, Sweater } from "./pictograms";

/*
 * Drawings for the Rozmówki chapters (48 × 40 icons) and the bingo occasions (120 × 100 plates,
 * like the species plates). Plain SVG, so generated images can embed them too.
 */

export const SITUATION_ICONS: Record<string, ReactNode> = {
  samochod: (
    <g>
      <path d="M3 29V23Q3 19.6 7 19L14.6 17.8L20.6 10.8Q22 9.2 24.6 9.2H33.6Q36.6 9.2 38.6 11.4L43.6 17.8Q46 18.6 46 21.4V29Z" fill={INK} />
      <path d="M22.6 12.2L18 17.6H28.4V12.2ZM31 12.2V17.6H40.4L36.4 12.2Z" fill={PAPER} />
      <circle cx={13} cy={30} r={5.4} fill={INK} stroke={PAPER} strokeWidth={1.6} />
      <circle cx={36} cy={30} r={5.4} fill={INK} stroke={PAPER} strokeWidth={1.6} />
    </g>
  ),
  remont: (
    <g>
      <rect x={6} y={5} width={28} height={11} rx={3} fill={RED} />
      <path d="M34 10.5H40V21H24V26" fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
      <rect x={21} y={26} width={6} height={12} rx={1.4} fill={INK} />
      <path d="M12 16V20.4A1.8 1.8 0 0 0 15.6 20.4V16" fill={RED} />
    </g>
  ),
  urlop: (
    <g>
      <circle cx={40} cy={8} r={4.6} fill={OCHRE} />
      {[RED, PAPER, BLUE, PAPER].map((fill, i) => (
        <rect key={i} x={4 + i * 9} y={14} width={9} height={20} fill={fill} />
      ))}
      <rect x={4} y={14} width={36} height={20} fill="none" stroke={INK} strokeWidth={1} />
      {[4, 13, 22, 31, 40].map((x) => (
        <line key={x} x1={x} y1={11} x2={x} y2={38} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      ))}
    </g>
  ),
  restauracja: (
    <g>
      <circle cx={24} cy={20} r={13} fill={PAPER} stroke={INK} strokeWidth={2} />
      <circle cx={24} cy={20} r={8} fill="none" stroke={INK} strokeWidth={1} />
      <g stroke={INK} strokeWidth={1.6} strokeLinecap="round">
        <line x1={5} y1={6} x2={5} y2={34} />
        <line x1={2.4} y1={6} x2={2.4} y2={13} />
        <line x1={7.6} y1={6} x2={7.6} y2={13} />
      </g>
      <path d="M43 6C46.4 9 46.4 16 43.6 19V34" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
    </g>
  ),
  komputer: (
    <g>
      <rect x={6} y={3} width={36} height={25} rx={1.6} fill={INK} />
      <rect x={9} y={6} width={30} height={19} fill={BLUE} />
      <path d="M13 21L20 14L25 18L30 12L35 16" fill="none" stroke={PAPER} strokeWidth={1.2} />
      <rect x={21} y={28} width={6} height={6} fill={INK} />
      <rect x={14} y={34} width={20} height={3} rx={1} fill={INK} />
    </g>
  ),
  "dzieci-sasiadow": (
    <g>
      <circle cx={24} cy={21} r={16} fill={PAPER} stroke={INK} strokeWidth={2} />
      <path d="M24 14.6L30 19L27.8 26H20.2L18 19Z" fill={INK} />
      <g stroke={INK} strokeWidth={1.4}>
        <line x1={24} y1={14.6} x2={24} y2={5.4} />
        <line x1={30} y1={19} x2={38.8} y2={16} />
        <line x1={27.8} y1={26} x2={33} y2={33.6} />
        <line x1={20.2} y1={26} x2={15} y2={33.6} />
        <line x1={18} y1={19} x2={9.2} y2={16} />
      </g>
    </g>
  ),

  pogoda: (
    <g>
      <path d="M8 22A6 6 0 0 1 9.6 10.4A8.6 8.6 0 0 1 26 8.6A6.4 6.4 0 0 1 30 21.4Z" fill={INK} />
      <g fill={BLUE}>
        <ellipse cx={12} cy={28} rx={1.1} ry={2} />
        <ellipse cx={18.6} cy={32} rx={1.1} ry={2} />
        <ellipse cx={25} cy={28.4} rx={1.1} ry={2} />
      </g>
      <rect x={36.6} y={4} width={5.2} height={24} rx={2.6} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      <rect x={38.4} y={14} width={1.6} height={14} fill={RED} />
      <circle cx={39.2} cy={31.6} r={4.4} fill={RED} />
      {[9, 13, 17, 21].map((y) => (
        <line key={y} x1={41.8} y1={y} x2={44} y2={y} stroke={INK} strokeWidth={1} />
      ))}
    </g>
  ),
  zakupy: (
    <g>
      <path d="M14 13Q14 4 20 4T26 13" fill="none" stroke={INK} strokeWidth={2} />
      <path d="M7 12H33L35 37H5Z" fill={PAPER} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <rect x={6.4} y={20} width={27.6} height={4.4} fill={RED} />
      <path d="M33 26H44V35Q41 37 38.6 35T33.6 35Z" fill={PAPER} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      {[29, 31.6].map((y) => (
        <line key={y} x1={35.6} y1={y} x2={42} y2={y} stroke={INK} strokeWidth={0.8} />
      ))}
    </g>
  ),
};

export function SituationIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
      {SITUATION_ICONS[slug]}
    </svg>
  );
}

const at = (x: number, children: ReactNode) => <g transform={`translate(${x} 0)`}>{children}</g>;

const DRAWINGS: Record<string, () => ReactNode> = {
  wesele: () => plateDrawing("weselny"),
  wigilia: () => plateDrawing("wigilijny"),
  imieniny: () => (
    <>
      <rect x={60} y={22} width={58} height={72} fill={GREY} />
      {[0, 1, 2].map((col) => (
        <g key={col}>
          <rect x={63 + col * 18.4} y={26} width={15} height={30} fill={col === 1 ? BLUE : PAPER} stroke={INK} strokeWidth={0.8} />
          <rect x={63 + col * 18.4} y={60} width={15} height={30} fill={PAPER} stroke={INK} strokeWidth={0.8} />
          <circle cx={col === 1 ? 70.5 + col * 18.4 : 75 + col * 18.4} cy={75} r={0.9} fill={INK} />
        </g>
      ))}
      <g stroke={PAPER} strokeWidth={0.7}>
        <line x1={84} y1={30} x2={92} y2={40} />
        <line x1={84} y1={36} x2={90} y2={44} />
      </g>
      <path d="M68 26V20Q68 16 71 16T74 20V26Z" fill={BLUE} opacity={0.75} />
      <path d="M100 26L102 16H108L110 26Z" fill={OCHRE} />
      <path d="M50 70H86L82 76H54Z" fill={INK} />
      <path d="M58 70Q58 61 68 61T78 70Z" fill={PAPER} stroke={INK} strokeWidth={0.9} />
      {[
        [63, 65, RED],
        [68, 63.6, OCHRE],
        [73, 65.4, RED],
        [66, 67.4, BLUE],
        [71, 67.6, OCHRE],
      ].map(([x, y, fill]) => (
        <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r={1.3} fill={fill as string} />
      ))}
      {at(
        6,
        <>
          <Figure left="hip" right="up" legs="trousers" torso={<Sweater />} />
          <path d="M35.6 -6H41.6L39.8 -0.6H37.4Z" fill={RED} />
          <line x1={38.6} y1={-0.6} x2={38.6} y2={3} stroke={INK} strokeWidth={0.8} />
        </>,
      )}
      <g className="pg-notes">
        <Note x={58} y={10} size={0.8} />
      </g>
    </>
  ),
  podroz: () => (
    <>
      <path d="M52 86V74Q52 70.6 56 70L66 68.6L74 59Q75.6 57 78.6 57H104Q107 57 108.6 59.6L114 68.6Q118 69.6 118 73V86Z" fill={BLUE} />
      <path d="M77 60.6L70.6 68.2H89V60.6ZM92 60.6V68.2H110L105.6 60.6Z" fill={PAPER} />
      <rect x={76} y={50} width={30} height={6} rx={2} fill={INK} />
      <rect x={79} y={44} width={11} height={6} fill={OCHRE} />
      <rect x={91} y={45.6} width={12} height={4.4} fill={RED} />
      <line x1={81} y1={56} x2={81} y2={58.6} stroke={INK} strokeWidth={1.2} />
      <line x1={101} y1={56} x2={101} y2={58.6} stroke={INK} strokeWidth={1.2} />
      <g className="pg-tyre">
        <circle cx={66} cy={86} r={8} fill={INK} />
        <circle cx={66} cy={86} r={3.4} fill={GREY} />
      </g>
      <circle cx={104} cy={86} r={8} fill={INK} />
      <circle cx={104} cy={86} r={3.4} fill={GREY} />
      {at(
        4,
        <>
          <Figure left="cross" right="cross" glasses="eyes" hat="cap" />
          <path d="M-4 27L6 29L16 27L26 29L36 27L46 29V45L36 43L26 45L16 43L6 45L-4 43Z" fill={PAPER} stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
          {[6, 16, 26, 36].map((x) => (
            <line key={x} x1={x} y1={x % 20 === 6 ? 29 : 27} x2={x} y2={x % 20 === 6 ? 45 : 43} stroke={INK} strokeWidth={0.4} />
          ))}
          <path d="M0 40Q8 34 14 37T26 33T40 36" fill="none" stroke={RED} strokeWidth={1.2} strokeDasharray="2 1.4" />
          <circle cx={40} cy={36} r={1.6} fill={RED} />
        </>,
      )}
    </>
  ),
  majowka: () => plateDrawing("grill"),
  morze: () => plateDrawing("wakacje"),
};

/** The occasion's drawing on the 120 × 100 plate grid. */
export const occasionDrawing = (slug: string) => DRAWINGS[slug]?.() ?? null;

export function OccasionPlate({ slug, className, animated }: { slug: string; className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 120 100" className={[animated ? "pg-animated" : "", className].filter(Boolean).join(" ")} aria-hidden="true">
      {occasionDrawing(slug)}
    </svg>
  );
}
