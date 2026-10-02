import type { ReactNode } from "react";
import { cx } from "@/lib/typo";
import { BLUE, GREY, INK, MUSTACHE_PATH, OCHRE, PAPER, RED } from "./pictograms";

/*
 * Picture statistics for the Mały Rocznik Statystyczny: one symbol stands for a round number
 * of things, and the last symbol is cut to the remainder, as in the Isotype charts of the 1930s.
 * Symbols are drawn on a 24 × 24 grid.
 */

export const ISO: Record<string, ReactNode> = {
  /** Rosół: the Sunday unit of time, three hours on a low flame. */
  pot: (
    <g>
      <path d="M9 3.6q-1.4 1.6 0 3.2t0 3.2M12 2.6q-1.4 1.6 0 3.2t0 3.2M15 3.6q-1.4 1.6 0 3.2t0 3.2" fill="none" stroke={GREY} strokeWidth={1.1} strokeLinecap="round" />
      <rect x={3.4} y={11.4} width={17.2} height={1.8} rx={0.9} fill={INK} />
      <path d="M4.4 13.6H19.6V19Q19.6 22 16.6 22H7.4Q4.4 22 4.4 19Z" fill={INK} />
      <path d="M1.6 15.4H4.4M19.6 15.4H22.4" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      <rect x={4.4} y={16} width={15.2} height={1.4} fill={OCHRE} />
    </g>
  ),
  /** The horn from the horn test: a car horn and three lines of sound. */
  horn: (
    <g>
      <path d="M3 9.6H8L15 4.6V19.4L8 14.4H3Z" fill={INK} />
      <g stroke={RED} strokeWidth={1.6} strokeLinecap="round" fill="none">
        <path d="M18 8.6q1.8 3.4 0 6.8" />
        <path d="M20.8 6.4q3 5.6 0 11.2" />
      </g>
    </g>
  ),
  bubble: (
    <g>
      <path d="M2.6 3.4H21.4V16.2H10.6L5.6 20.8V16.2H2.6Z" fill={INK} />
      <g stroke={PAPER} strokeWidth={1.2}>
        <line x1={5.6} y1={7.4} x2={18.4} y2={7.4} strokeDasharray="2 1.4" />
        <line x1={5.6} y1={10.2} x2={18.4} y2={10.2} />
        <path d="M5.6 13q1.2-1.2 2.4 0t2.4 0t2.4 0" stroke={RED} fill="none" />
      </g>
    </g>
  ),
  cross: (
    <g>
      <rect x={3} y={3} width={18} height={18} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      <path d="M6 6L18 18M18 6L6 18" stroke={RED} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  ),
  card: (
    <g>
      <rect x={4} y={2} width={16} height={20} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      {[9.4, 14.6].map((x) => (
        <line key={x} x1={x} y1={2} x2={x} y2={22} stroke={INK} strokeWidth={0.8} />
      ))}
      {[8.6, 15.2].map((y) => (
        <line key={y} x1={4} y1={y} x2={20} y2={y} stroke={INK} strokeWidth={0.8} />
      ))}
      <path d="M10.4 9.8L13.6 14M13.6 9.8L10.4 14" stroke={RED} strokeWidth={1.4} strokeLinecap="round" />
    </g>
  ),
  binoculars: (
    <g>
      <rect x={9.4} y={6} width={5.2} height={4} fill={INK} />
      <circle cx={6.8} cy={13.6} r={5.4} fill={INK} />
      <circle cx={17.2} cy={13.6} r={5.4} fill={INK} />
      <circle cx={6.8} cy={13.6} r={2.6} fill={BLUE} />
      <circle cx={17.2} cy={13.6} r={2.6} fill={BLUE} />
    </g>
  ),
  gavel: (
    <g>
      <rect x={3} y={18.6} width={12} height={3.4} fill={INK} />
      <line x1={11} y1={11} x2={21} y2={4} stroke={OCHRE} strokeWidth={2} strokeLinecap="round" />
      <rect x={3.6} y={6.6} width={10} height={5.6} rx={0.8} fill={INK} transform="rotate(-35 8.6 9.4)" />
    </g>
  ),
  person: (
    <g>
      <circle cx={12} cy={5.4} r={3.6} fill={INK} />
      <g transform="translate(9.4 5.2) scale(0.052)">
        <path d={MUSTACHE_PATH} fill={PAPER} />
      </g>
      <path d="M7.4 10H16.6L17.4 17.4H14.4L14 22.4H10L9.6 17.4H6.6Z" fill={INK} />
    </g>
  ),
  certificate: (
    <g>
      <rect x={3} y={3} width={18} height={18} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      <path d="M3 9L9 3H12.4L3 12.4Z" fill={RED} />
      <line x1={9} y1={12} x2={17} y2={12} stroke={INK} strokeWidth={1} />
      <line x1={9} y1={15} x2={15} y2={15} stroke={INK} strokeWidth={1} />
      <circle cx={16.4} cy={18} r={2} fill={RED} />
    </g>
  ),
  fridge: (
    <g>
      <rect x={5} y={1.6} width={14} height={21} rx={1.4} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      <line x1={5} y1={9} x2={19} y2={9} stroke={INK} strokeWidth={1.2} />
      <line x1={7.4} y1={4.4} x2={7.4} y2={7} stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      <line x1={7.4} y1={11.4} x2={7.4} y2={15} stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      <rect x={10.4} y={11.6} width={6} height={4.6} fill={RED} transform="rotate(-6 13.4 13.9)" />
    </g>
  ),
  exam: (
    <g>
      <rect x={4} y={2.4} width={16} height={19.6} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      <path d="M8.4 9.4H15.4M8.4 12.6H13" stroke={INK} strokeWidth={1} />
      <path d="M11.6 15.4L13 17.6L16.8 13.4" fill="none" stroke={RED} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
};

export type IsoKind = keyof typeof ISO;

const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10_000, 20_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];

/** The smallest round unit that keeps the row within `max` symbols. */
export function isoUnit(value: number, max: number) {
  return STEPS.find((step) => value / step <= max) ?? STEPS[STEPS.length - 1];
}

/** A row of symbols for `value`, each worth `unit`; the last one is cut to the remainder. */
export function IsoRow({
  kind,
  value,
  unit,
  className,
  label,
}: {
  kind: IsoKind;
  value: number;
  unit: number;
  className?: string;
  label: string;
}) {
  const symbols = value / unit;
  const whole = Math.floor(symbols);
  const part = symbols - whole;
  const items = Array.from({ length: whole + (part >= 0.08 ? 1 : 0) }, (_, i) => (i < whole ? 1 : part));
  return (
    <div role="img" aria-label={label} className={cx("flex flex-wrap gap-x-1 gap-y-1.5", className)}>
      {items.length === 0 ? (
        <span className="label text-ink-faint">–</span>
      ) : (
        items.map((fraction, i) => (
          <svg key={i} viewBox={`0 0 ${24 * fraction} 24`} className="h-7 shrink-0" style={{ width: `${1.75 * fraction}rem` }} aria-hidden="true">
            {ISO[kind]}
          </svg>
        ))
      )}
    </div>
  );
}

export function IsoKey({ kind, children }: { kind: IsoKind; children: ReactNode }) {
  return (
    <p className="label mt-2 flex items-center gap-2 text-ink-soft">
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
        {ISO[kind]}
      </svg>
      {children}
    </p>
  );
}
