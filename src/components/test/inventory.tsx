"use client";

import { useState, type ReactNode } from "react";
import type { InventoryTask } from "@/content/test";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { packBits, unpackBits } from "@/lib/test";
import { cx } from "@/lib/typo";
import { BLUE, GREY, INK, OCHRE, PAPER, RED } from "../pictograms";
import { AnswerRow, keyIndex, useKeys, type TaskProps } from "./shared";

const COPY = defineCopy({
  pl: {
    drawer: "Otwarta szuflada",
    boot: "Otwarty bagażnik z góry",
    emptyDrawer: "Szuflada pusta. Na razie.",
    emptyBoot: "Bagażnik pusty. Na razie.",
    count: (count: number, total: number) => `Zaznaczono: ${count} z ${total}.`,
    closeEmpty: "Można zamknąć pustą. Instytut to odnotuje.",
  },
  sl: {
    drawer: "Odprt predal",
    boot: "Odprt prtljažnik od zgoraj",
    emptyDrawer: "Predal je prazen. Zaenkrat.",
    emptyBoot: "Prtljažnik je prazen. Zaenkrat.",
    count: (count: number, total: number) => `Označeno: ${count} od ${total}.`,
    closeEmpty: "Zapreš ga lahko praznega. Inštitut bo to zabeležil.",
  },
});

/* Things, drawn about 52 × 36 around their centre. */

const THINGS: Record<string, ReactNode> = {
  cables: (
    <g fill="none" strokeLinecap="round">
      <path d="M-24 8C-14 -10 -4 18 6 0S20 -6 24 -12" stroke={INK} strokeWidth={2.2} />
      <path d="M-22 14C-8 4 0 20 12 10S22 12 26 4" stroke={GREY} strokeWidth={2.2} />
      <rect x={20} y={-17} width={8} height={7} fill={INK} stroke="none" />
      <rect x={-28} y={4} width={7} height={8} fill={INK} stroke="none" />
    </g>
  ),
  manual: (
    <g>
      <rect x={-16} y={-18} width={32} height={36} fill={PAPER} stroke={INK} strokeWidth={1.4} />
      <rect x={-16} y={-18} width={32} height={9} fill={INK} />
      <g stroke={INK} strokeWidth={1}>
        <line x1={-11} y1={-2} x2={11} y2={-2} />
        <line x1={-11} y1={4} x2={11} y2={4} />
        <line x1={-11} y1={10} x2={4} y2={10} />
      </g>
      <rect x={-8} y={-15.5} width={16} height={4} fill={OCHRE} />
    </g>
  ),
  bags: (
    <g>
      <path d="M-18 -6H18L15 18H-15Z" fill={PAPER} stroke={INK} strokeWidth={1.4} />
      <path d="M-10 -6Q-10 -18 -3 -18M10 -6Q10 -18 3 -18" fill="none" stroke={INK} strokeWidth={1.4} />
      <path d="M-12 -8Q-6 -16 0 -9Q6 -17 13 -8" fill={BLUE} />
      <path d="M-6 -9Q0 -20 7 -9" fill={RED} />
    </g>
  ),
  keys: (
    <g fill="none" stroke={INK} strokeWidth={2}>
      <circle cx={-12} cy={-6} r={8} />
      <g fill={OCHRE} stroke="none">
        <circle cx={-2} cy={-2} r={5} />
        <rect x={2} y={-4} width={22} height={4} />
        <rect x={16} y={0} width={3} height={5} />
        <rect x={21} y={0} width={3} height={4} />
      </g>
      <g fill={GREY} stroke="none" transform="rotate(30 -8 4)">
        <circle cx={-8} cy={6} r={4.6} />
        <rect x={-4} y={4.4} width={20} height={3.6} />
        <rect x={10} y={8} width={3} height={4} />
      </g>
    </g>
  ),
  screws: (
    <g>
      {[
        [-14, 2, -20],
        [0, -4, 10],
        [14, 4, -4],
      ].map(([x, y, r]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
          <rect x={-1.6} y={-2} width={3.2} height={16} fill={GREY} />
          <g stroke={INK} strokeWidth={0.8}>
            <line x1={-2} y1={2} x2={2} y2={4} />
            <line x1={-2} y1={6} x2={2} y2={8} />
            <line x1={-2} y1={10} x2={2} y2={12} />
          </g>
          <rect x={-5} y={-5} width={10} height={4} rx={1.6} fill={INK} />
        </g>
      ))}
    </g>
  ),
  batteries: (
    <g>
      {[-9, 9].map((x, i) => (
        <g key={x} transform={`translate(${x} 0) rotate(${i ? 12 : -6})`}>
          <rect x={-6} y={-16} width={12} height={32} rx={2} fill={i ? INK : OCHRE} />
          <rect x={-6} y={-16} width={12} height={10} rx={2} fill={i ? OCHRE : INK} />
          <rect x={-2.4} y={-19} width={4.8} height={3} fill={GREY} />
        </g>
      ))}
    </g>
  ),
  float: (
    <g>
      <line x1={-2} y1={-20} x2={-2} y2={-12} stroke={INK} strokeWidth={1.4} />
      <path d="M-2 -12L5 0L-2 14L-9 0Z" fill={RED} />
      <path d="M-9 0H5L-2 14Z" fill={PAPER} stroke={INK} strokeWidth={0.8} />
      <g fill="none" stroke={INK} strokeWidth={1.3}>
        <path d="M14 -10V6A4 4 0 0 1 6 6" />
        <path d="M22 -4V10A4 4 0 0 1 14 10" />
      </g>
    </g>
  ),
  pen: (
    <g transform="rotate(-24)">
      <rect x={-24} y={-3.4} width={40} height={6.8} rx={2} fill={BLUE} />
      <path d="M16 -3.4L24 0L16 3.4Z" fill={INK} />
      <rect x={-12} y={-3.4} width={10} height={6.8} fill={PAPER} />
      <rect x={-22} y={-6} width={12} height={2.6} fill={INK} />
    </g>
  ),
  charger: (
    <g>
      <rect x={-22} y={-12} width={16} height={20} rx={2} fill={INK} />
      <rect x={-18} y={-17} width={2.4} height={6} fill={GREY} />
      <rect x={-12} y={-17} width={2.4} height={6} fill={GREY} />
      <path d="M-6 2C6 2 2 14 14 12S22 0 24 -4" fill="none" stroke={INK} strokeWidth={1.6} />
      <rect x={21} y={-9} width={3} height={7} fill={GREY} transform="rotate(25 22 -6)" />
    </g>
  ),
  triangle: (
    <g>
      <path d="M-24 14L-8 -16L8 14Z" fill="none" stroke={RED} strokeWidth={4} strokeLinejoin="round" />
      <rect x={12} y={-12} width={10} height={26} rx={3} fill={RED} />
      <rect x={14} y={-17} width={6} height={5} fill={INK} />
      <rect x={10} y={-2} width={14} height={8} fill={PAPER} />
    </g>
  ),
  jumper: (
    <g>
      <path d="M-20 -8C-6 14 6 -14 20 8" fill="none" stroke={RED} strokeWidth={2.4} />
      <path d="M-20 4C-6 22 8 -4 20 16" fill="none" stroke={INK} strokeWidth={2.4} />
      <path d="M-28 -14L-18 -10L-22 -4L-30 -6Z" fill={RED} />
      <path d="M-28 -2L-18 2L-22 8L-30 6Z" fill={INK} />
    </g>
  ),
  oil: (
    <g>
      <path d="M-14 -10H10L14 -4V18H-14Z" fill={OCHRE} />
      <path d="M2 -10V-16H10V-10" fill={INK} />
      <path d="M-14 -4H-20V8H-14" fill="none" stroke={OCHRE} strokeWidth={3} />
      <rect x={-10} y={2} width={20} height={10} fill={PAPER} />
      <line x1={-7} y1={7} x2={7} y2={7} stroke={INK} strokeWidth={1.2} />
    </g>
  ),
  windbreak: (
    <g transform="rotate(-10)">
      {[RED, PAPER, BLUE, PAPER, RED].map((fill, i) => (
        <rect key={i} x={-25 + i * 10} y={-8} width={10} height={16} fill={fill} />
      ))}
      <rect x={-25} y={-8} width={50} height={16} fill="none" stroke={INK} strokeWidth={1.2} />
      <line x1={-29} y1={-4} x2={29} y2={-4} stroke={INK} strokeWidth={1.6} />
      <line x1={-29} y1={4} x2={29} y2={4} stroke={INK} strokeWidth={1.6} />
    </g>
  ),
  stool: (
    <g>
      <g stroke={INK} strokeWidth={2.2} strokeLinecap="round">
        <line x1={-22} y1={16} x2={-4} y2={-8} />
        <line x1={-4} y1={16} x2={-22} y2={-8} />
      </g>
      <rect x={-26} y={-11} width={26} height={5} fill={OCHRE} />
      <rect x={8} y={-14} width={12} height={30} rx={3} fill={BLUE} />
      <rect x={7} y={-18} width={14} height={6} rx={1.6} fill={INK} />
    </g>
  ),
  charcoal: (
    <g>
      <path d="M-18 -14H18L20 18H-20Z" fill={PAPER} stroke={INK} strokeWidth={1.4} />
      <path d="M-18 -14L-14 -20H14L18 -14" fill="none" stroke={INK} strokeWidth={1.4} />
      <rect x={-12} y={-6} width={24} height={9} fill={INK} />
      <path d="M-8 -2.4Q-4 -5 0 -2.4T8 -2.4" fill="none" stroke={RED} strokeWidth={1.4} />
      <g fill={INK}>
        <path d="M-22 18L-17 12L-12 17Z" />
        <path d="M14 20L19 13L24 19Z" />
      </g>
    </g>
  ),
  level: (
    <g transform="rotate(-6)">
      <rect x={-27} y={-6} width={54} height={12} fill={OCHRE} />
      <rect x={-7} y={-3.4} width={14} height={6.8} rx={3.4} fill={PAPER} stroke={INK} strokeWidth={0.9} />
      <circle cx={1.4} cy={0} r={2} fill={BLUE} />
      <rect x={-27} y={-6} width={5} height={12} fill={INK} />
      <rect x={22} y={-6} width={5} height={12} fill={INK} />
    </g>
  ),
  bucket: (
    <g>
      <path d="M-16 -10H16L12 18H-12Z" fill={BLUE} />
      <path d="M-16 -10Q0 -32 16 -10" fill="none" stroke={INK} strokeWidth={1.6} />
      <rect x={-17} y={-12} width={34} height={4} rx={1} fill={INK} />
      <line x1={-12} y1={4} x2={12} y2={4} stroke={PAPER} strokeWidth={1} opacity={0.6} />
    </g>
  ),
  binder: (
    <g transform="rotate(-8)">
      <rect x={-14} y={-20} width={28} height={40} fill={RED} />
      <rect x={-14} y={-20} width={7} height={40} fill={INK} />
      <rect x={-3} y={-12} width={14} height={10} fill={PAPER} />
      <line x1={0} y1={-7} x2={8} y2={-7} stroke={INK} strokeWidth={1} />
      <circle cx={-10.5} cy={10} r={2.6} fill={PAPER} />
    </g>
  ),
};

/** Where each ticked thing lands: a loose 3 × 3 grid, a little crooked, as in any drawer. */
const SLOTS: [number, number, number][] = [
  [62, 62, -8],
  [150, 58, 6],
  [238, 64, -4],
  [66, 116, 5],
  [152, 118, -10],
  [236, 112, 8],
  [70, 168, -3],
  [150, 170, 9],
  [232, 166, -7],
];

function Drawer({ ticked, things, label }: { ticked: boolean[]; things: string[]; label: string }) {
  return (
    <svg viewBox="0 0 300 240" className="block w-full" role="img" aria-label={label}>
      <path d="M22 26H278L292 204H8Z" fill="#ebe5d7" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M22 26L8 204M278 26L292 204" stroke={INK} strokeWidth={1} opacity={0.3} />
      {things.map((icon, i) =>
        ticked[i] ? (
          <g key={icon} transform={`translate(${SLOTS[i][0]} ${SLOTS[i][1] + 8}) rotate(${SLOTS[i][2]}) scale(1.35)`}>
            <g className="animate-drop">{THINGS[icon]}</g>
          </g>
        ) : null,
      )}
      <rect x={0} y={200} width={300} height={40} fill={INK} />
      <rect x={118} y={214} width={64} height={10} rx={5} fill={PAPER} />
    </svg>
  );
}

function Boot({ ticked, things, label }: { ticked: boolean[]; things: string[]; label: string }) {
  return (
    <svg viewBox="0 0 300 240" className="block w-full" role="img" aria-label={label}>
      <path d="M6 0H294V196Q294 214 276 214H24Q6 214 6 196Z" fill={BLUE} />
      <rect x={22} y={10} width={256} height={184} rx={6} fill={GREY} />
      <g stroke={INK} strokeWidth={0.6} opacity={0.18}>
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={22} y1={14 + i * 8.4} x2={278} y2={14 + i * 8.4} />
        ))}
      </g>
      {things.map((icon, i) =>
        ticked[i] ? (
          <g key={icon} transform={`translate(${SLOTS[i][0]} ${SLOTS[i][1] - 4}) rotate(${SLOTS[i][2]}) scale(1.3)`}>
            <g className="animate-drop">{THINGS[icon]}</g>
          </g>
        ) : null,
      )}
      <rect x={0} y={206} width={300} height={34} rx={6} fill={INK} />
      <rect x={108} y={213} width={84} height={20} fill={PAPER} stroke={INK} />
      <rect x={108} y={213} width={9} height={20} fill={BLUE} />
      <text x={154} y={227.4} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK} style={{ fontFamily: "var(--font-schibsted)" }}>
        WZ 1974
      </text>
    </svg>
  );
}

/** Tick what's inside; the drawing fills up as you go. */
export function InventoryView({ task, proxy, value, onAnswer }: TaskProps<InventoryTask>) {
  const t = COPY[useLocale()];
  const [ticked, setTicked] = useState<boolean[]>(() =>
    value === undefined ? task.things.map(() => false) : unpackBits(value, task.things.length),
  );
  const count = ticked.filter(Boolean).length;
  const icons = task.things.map((thing) => thing.icon);

  const toggle = (index: number) => setTicked((current) => current.map((on, i) => (i === index ? !on : on)));
  const done = () => onAnswer(packBits(ticked));

  useKeys((key, event) => {
    const index = keyIndex(key);
    if (index >= 0 && index < task.things.length) {
      event.preventDefault();
      toggle(index);
    } else if (key === "enter" && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
      done();
    }
  });

  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-12">
      <figure className="md:sticky md:top-6">
        {task.container === "drawer" ? <Drawer ticked={ticked} things={icons} label={t.drawer} /> : <Boot ticked={ticked} things={icons} label={t.boot} />}
        <figcaption className="label mt-3 text-ink-soft" aria-live="polite">
          {count === 0
            ? task.container === "drawer"
              ? t.emptyDrawer
              : t.emptyBoot
            : t.count(count, task.things.length)}
        </figcaption>
      </figure>

      <div>
        <div role="group" aria-labelledby="zadanie" className="border-t border-ink">
          {task.things.map((thing, i) => (
            <AnswerRow key={thing.icon} letter={String(i + 1)} checked={ticked[i]} onClick={() => toggle(i)}>
              {(proxy && thing.proxy) || thing.text}
            </AnswerRow>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="button" onClick={done} className="btn bg-ink text-paper hover:bg-red">
            {task.done} <span aria-hidden="true">→</span>
          </button>
          <span className={cx("label text-ink-faint", count > 0 && "hidden")}>
            {count === 0 ? t.closeEmpty : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
