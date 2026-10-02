import type { ReactNode } from "react";
import { BLUE, Figure, INK, Jacket, Note, OCHRE, PAPER, Pine, plateDrawing, RED, Sweater } from "./pictograms";

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
};

export function SituationIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
      {SITUATION_ICONS[slug]}
    </svg>
  );
}

const at = (x: number, children: ReactNode) => <g transform={`translate(${x} 0)`}>{children}</g>;

/** A tie worn on the forehead, as at every wedding after midnight. */
function HeadTie() {
  return (
    <g>
      <rect x={12} y={2} width={16.4} height={2.6} fill={RED} transform="rotate(-10 20 3.4)" />
      <path d="M26.6 1.6L29.4 1.2L36 13.4L33.2 15.4Z" fill={RED} />
      <path d="M33.2 15.4L36 13.4L36.6 16.6Z" fill={RED} />
    </g>
  );
}

const DRAWINGS: Record<string, () => ReactNode> = {
  wesele: () => (
    <>
      <g className="pg-notes">
        <Note x={54} y={16} />
        <Note x={62} y={6} size={0.8} />
      </g>
      <path d="M68 64H116L118 94H66Z" fill={PAPER} stroke={INK} strokeWidth={1} />
      <line x1={64} y1={64} x2={120} y2={64} stroke={INK} strokeWidth={1.6} />
      <rect x={81} y={47} width={22} height={17} fill={PAPER} stroke={INK} strokeWidth={1} />
      <rect x={85} y={36} width={14} height={11} fill={PAPER} stroke={INK} strokeWidth={1} />
      <line x1={81} y1={55} x2={103} y2={55} stroke={RED} strokeWidth={1.4} />
      <circle cx={92} cy={33.6} r={2.6} fill={RED} />
      {at(
        8,
        <>
          <Figure left="up" right="up" legs="trousers" torso={<Jacket />} />
          <HeadTie />
        </>,
      )}
    </>
  ),
  wigilia: () => (
    <>
      <Pine x={92} scale={1.2} />
      <path d="M92 36.6L93.6 40.4H97.6L94.4 42.8L95.6 46.6L92 44.2L88.4 46.6L89.6 42.8L86.4 40.4H90.4Z" fill={OCHRE} />
      {[
        [86, 58, RED],
        [99, 62, OCHRE],
        [90, 72, BLUE],
        [80, 80, OCHRE],
        [104, 80, RED],
      ].map(([x, y, fill]) => (
        <circle key={`${x}-${y}`} cx={x as number} cy={y as number} r={2.4} fill={fill as string} />
      ))}
      <rect x={64} y={82} width={14} height={12} fill={RED} />
      <rect x={70} y={82} width={2.4} height={12} fill={PAPER} />
      <rect x={104} y={84} width={14} height={10} fill={BLUE} />
      <rect x={110} y={84} width={2.4} height={10} fill={PAPER} />
      {at(6, <Figure left="hip" legs="trousers" torso={<Sweater />} />)}
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
