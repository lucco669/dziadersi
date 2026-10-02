import type { ReactNode } from "react";
import { cx } from "@/lib/typo";
import { BLUE, GREY, INK, MUSTACHE_PATH, OCHRE, PAPER, RED } from "./pictograms";

/*
 * Pictograms for the departments in the menu, 48 × 40, in the same flat language as the plates.
 * Each has one small motion on hover (class names in globals.css), none for reduced motion.
 */

/** A tiny standing dziaders, 14 units tall, feet on y. */
function Tiny({ x, y, color = INK }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={-11.6} r={2.6} fill={color} />
      <path d="M-2.8 -8.6H2.8L3.2 -2.6H1.2L1 1.4H-1L-1.2 -2.6H-3.2Z" fill={color} />
      <g transform="translate(-1.5 -11.5) scale(0.03)">
        <path d={MUSTACHE_PATH} fill={PAPER} />
      </g>
    </g>
  );
}

export const MENU_ICONS: Record<string, ReactNode> = {
  "/test": (
    <g>
      <rect x={9} y={3} width={26} height={34} fill={PAPER} stroke={INK} strokeWidth={2} />
      <path d="M9 13L19 3H25L9 19Z" fill={RED} />
      {[17, 22, 27].map((y) => (
        <line key={y} x1={14} y1={y} x2={30} y2={y} stroke={INK} strokeWidth={1.4} />
      ))}
      <g className="mi-stamp">
        <circle cx={34} cy={30} r={7} fill={PAPER} stroke={RED} strokeWidth={2} />
        <circle cx={34} cy={30} r={3.2} fill={RED} />
      </g>
    </g>
  ),
  "/egzamin": (
    <g className="mi-look">
      <rect x={18} y={11} width={12} height={6} fill={INK} />
      <circle cx={13} cy={23} r={9} fill={INK} />
      <circle cx={35} cy={23} r={9} fill={INK} />
      <circle cx={13} cy={23} r={5} fill={BLUE} />
      <circle cx={35} cy={23} r={5} fill={BLUE} />
      <path d="M10.6 20.4A3.4 3.4 0 0 1 14 19M32.6 20.4A3.4 3.4 0 0 1 36 19" stroke={PAPER} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
  ),
  "/czy-to-juz-dziaderstwo": (
    <g>
      <rect x={6} y={31} width={22} height={6} fill={INK} />
      <g className="mi-gavel">
        <line x1={24} y1={18} x2={42} y2={6} stroke={OCHRE} strokeWidth={3} strokeLinecap="round" />
        <rect x={10} y={12} width={18} height={9} rx={1.4} fill={INK} transform="rotate(-34 19 16.5)" />
        <rect x={12.6} y={13.6} width={2.4} height={5.8} fill={RED} transform="rotate(-34 19 16.5)" />
      </g>
    </g>
  ),
  "/atlas": (
    <g>
      <g className="mi-bob">
        <Tiny x={17} y={34} />
      </g>
      <line x1={21} y1={22} x2={30} y2={17} stroke={INK} strokeWidth={0.9} />
      <path d="M29 12H44V22H29L26 17Z" fill={PAPER} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <circle cx={28.8} cy={17} r={1} fill={INK} />
      <line x1={32} y1={15.4} x2={41} y2={15.4} stroke={RED} strokeWidth={1.4} />
      <line x1={32} y1={18.8} x2={39} y2={18.8} stroke={INK} strokeWidth={1} />
      <line x1={6} y1={36} x2={42} y2={36} stroke={INK} strokeWidth={1.4} />
    </g>
  ),
  "/slownik": (
    <g>
      <path d="M24 9C18 5 10 5 4 7V34C10 32 18 32 24 36Z" fill={PAPER} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d="M24 9C30 5 38 5 44 7V34C38 32 30 32 24 36Z" fill={PAPER} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {[13, 18, 23].map((y) => (
        <g key={y} stroke={INK} strokeWidth={1.2}>
          <line x1={8} y1={y} x2={20} y2={y + 1} />
          <line x1={28} y1={y + 1} x2={40} y2={y} />
        </g>
      ))}
      <path className="mi-ribbon" d="M33 6V22L35.5 19.6L38 22V5.6" fill={RED} />
    </g>
  ),
  "/raporty": (
    <g>
      <rect x={8} y={3} width={30} height={34} fill={PAPER} stroke={INK} strokeWidth={2} />
      <line x1={13} y1={9} x2={28} y2={9} stroke={INK} strokeWidth={1.4} />
      <g className="mi-bars">
        <rect x={13} y={22} width={5} height={10} fill={INK} />
        <rect x={20.5} y={15} width={5} height={17} fill={RED} />
        <rect x={28} y={25} width={5} height={7} fill={GREY} />
      </g>
      <line x1={12} y1={32.5} x2={34} y2={32.5} stroke={INK} strokeWidth={1.2} />
    </g>
  ),
  "/indeks": (
    <g>
      {[0, 1, 2, 3, 4].map((i) => (
        <Tiny key={i} x={6 + i * 9} y={34} color={i < 3 ? INK : GREY} />
      ))}
      <line x1={2} y1={37} x2={46} y2={37} stroke={INK} strokeWidth={1.4} />
      <path className="mi-arrow" pathLength={1} d="M8 9L20 6L28 10L40 3" fill="none" stroke={RED} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  ),
  "/spis": (
    <g>
      <rect x={8} y={5} width={30} height={33} rx={1.4} fill={PAPER} stroke={INK} strokeWidth={2} />
      <rect x={17} y={2} width={12} height={6} rx={1.4} fill={INK} />
      <g stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        {[13, 16.5, 20, 23.5].map((x) => (
          <line key={x} x1={x} y1={14} x2={x} y2={26} />
        ))}
      </g>
      <line className="mi-strike" pathLength={1} x1={11} y1={24} x2={26} y2={15} stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <g stroke={INK} strokeWidth={1.8} strokeLinecap="round">
        <line x1={30} y1={14} x2={30} y2={26} />
        <line x1={33.5} y1={14} x2={33.5} y2={26} />
      </g>
      <line x1={13} y1={32} x2={33} y2={32} stroke={INK} strokeWidth={1.2} />
    </g>
  ),
  "/statystyki": (
    <g>
      <g className="mi-tilt">
        <path d="M12 6H36V36H12Z" fill={RED} />
        <rect x={12} y={6} width={4} height={30} fill={INK} />
        <rect x={20} y={12} width={12} height={8} fill={PAPER} />
        <line x1={22} y1={15} x2={30} y2={15} stroke={INK} strokeWidth={1} />
        <line x1={22} y1={17.6} x2={28} y2={17.6} stroke={INK} strokeWidth={1} />
        <line x1={20} y1={30} x2={32} y2={30} stroke={PAPER} strokeWidth={1.2} />
      </g>
      <line x1={4} y1={37} x2={44} y2={37} stroke={INK} strokeWidth={1.4} />
    </g>
  ),
  "/generator": (
    <g>
      <path d="M5 6H43V27H21L12 35V27H5Z" fill={PAPER} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <g className="mi-talk" fill="none" strokeWidth={1.4} stroke={INK}>
        <line x1={10} y1={12.5} x2={30} y2={12.5} strokeDasharray="2.6 2" />
        <g>
          <line x1={10} y1={17} x2={38} y2={17} />
          <line x1={10} y1={19} x2={38} y2={19} />
        </g>
        <path d="M10 23.4q2 -2 4 0t4 0t4 0t4 0" stroke={RED} />
      </g>
    </g>
  ),
  "/bingo": (
    <g>
      <rect x={9} y={3} width={30} height={34} fill={PAPER} stroke={INK} strokeWidth={2} />
      {[19, 29].map((x) => (
        <line key={x} x1={x} y1={3} x2={x} y2={37} stroke={INK} strokeWidth={1} />
      ))}
      {[14.3, 25.6].map((y) => (
        <line key={y} x1={9} y1={y} x2={39} y2={y} stroke={INK} strokeWidth={1} />
      ))}
      <path className="mi-cross" d="M11 5L37 35M37 5L11 35" stroke={RED} strokeWidth={2.4} strokeLinecap="round" pathLength={1} />
    </g>
  ),
  "/profil": (
    <g>
      <path d="M5 9H17L20 5H32V9H43V36H5Z" fill={PAPER} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <circle cx={15} cy={20} r={5} fill={INK} />
      <g transform="translate(12.1 19.6) scale(0.058)">
        <path d={MUSTACHE_PATH} fill={PAPER} />
      </g>
      <path d="M8.6 32C9 27.6 11.4 26 15 26S21 27.6 21.4 32Z" fill={INK} />
      <line x1={25} y1={18} x2={38} y2={18} stroke={INK} strokeWidth={1.4} />
      <line x1={25} y1={23} x2={35} y2={23} stroke={INK} strokeWidth={1.4} />
      <line x1={25} y1={28} x2={38} y2={28} stroke={RED} strokeWidth={1.4} />
    </g>
  ),
};

export function MenuIcon({ href, className }: { href: string; className?: string }) {
  const icon = MENU_ICONS[href];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 48 40" className={cx("shrink-0 overflow-visible", className)} aria-hidden="true">
      {icon}
    </svg>
  );
}
