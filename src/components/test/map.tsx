"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import type { MapTask } from "@/content/test";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { cx, typo } from "@/lib/typo";
import { BLUE, GREY, INK, OCHRE, PAPER, RED } from "../pictograms";
import { keyIndex, NextButton, useKeys, type TaskProps } from "./shared";

const ASPHALT = GREY;
const LINE = PAPER;
const SAND = "#ead7ad";
const WET = "#dcc188";

const COPY = defineCopy({
  pl: {
    scenes: {
      parking: "Parking pod marketem widziany z góry",
      beach: "Plaża o świcie widziana z góry: morze, piasek, wydmy i zejście z budką z goframi",
    },
    market: "MARKET",
    hours: "czynne 6–22",
    waffles: "GOFRY",
    taken: "Miejsce zajęte.",
    pointer: (place: string) => `Miejsce: ${place}`,
    tap: "Stuknij miejsce na obrazku.",
    keys: (count: number) => `Klawisze 1–${count}`,
    noted: "Instytut odnotowuje",
  },
  sl: {
    scenes: {
      parking: "Parkirišče pred marketom, pogled od zgoraj",
      beach: "Plaža ob zori, pogled od zgoraj: morje, pesek, sipine in dostop s stojnico z vaflji",
    },
    market: "MARKET",
    hours: "odprto 6–22",
    waffles: "VAFLJI",
    taken: "Mesto zasedeno.",
    pointer: (place: string) => `Mesto: ${place}`,
    tap: "Tapni mesto na sliki.",
    keys: (count: number) => `Tipke 1–${count}`,
    noted: "Inštitut beleži",
  },
});

type Copy = (typeof COPY)["pl"];

type Hit = { x: number; y: number; w: number; h: number };
/** A scene from above; the signs on it are in the edition's words. */
type Scene = { background: (t: Copy) => ReactNode; hits: Record<string, Hit>; placed: Record<string, ReactNode> };

/* Cars from above, 22 × 40, nose up. */

function Car({ x, y, color = INK, rotate = 0, className }: { x: number; y: number; color?: string; rotate?: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className={className}>
        <rect x={-11} y={-20} width={22} height={40} rx={5} fill={color} />
        <path d="M-8.4 -9.6Q0 -13 8.4 -9.6L7.4 -4H-7.4Z" fill={PAPER} opacity={0.75} />
        <path d="M-7.4 9.4H7.4L8 13.6Q0 15.6 -8 13.6Z" fill={PAPER} opacity={0.5} />
      </g>
    </g>
  );
}

/** Row of parking bays opening downwards (`down`) or upwards. */
function Bays({ y, from, to, depth = 54, open }: { y: number; from: number; to: number; depth?: number; open: "up" | "down" }) {
  const lines = [];
  for (let i = from; i <= to; i++) {
    const x = 12 + i * 36;
    lines.push(<line key={i} x1={x} y1={y} x2={x} y2={y + depth} stroke={LINE} strokeWidth={1.6} />);
  }
  const back = open === "down" ? y : y + depth;
  return (
    <g>
      {lines}
      <line x1={12 + from * 36} y1={back} x2={12 + to * 36} y2={back} stroke={LINE} strokeWidth={1.6} />
    </g>
  );
}

const bay = (i: number) => 12 + i * 36 + 18;

const ROW_A = 96;
const ROW_B = 190;
const ROW_C = 256;
// Bays left free on purpose; every other bay in rows A and B is taken.
const CARS_A = [0, 1, 2, 3, 4, 6, 7, 8, 10];
const CARS_B = [0, 1, 4, 5, 6, 7, 8, 9, 10];
const COLORS = [INK, BLUE, INK, OCHRE, INK, INK, BLUE, INK, INK, OCHRE, INK];

function Parawan({ points, ours }: { points: string; ours?: boolean }) {
  return (
    <g fill="none" strokeLinejoin="round">
      <polyline points={points} stroke={ours ? BLUE : GREY} strokeWidth={ours ? 6 : 5} />
      <polyline points={points} stroke={ours ? RED : INK} strokeWidth={ours ? 6 : 5} strokeDasharray="7 7" opacity={ours ? 1 : 0.55} />
    </g>
  );
}

function Towel({ x, y, color, rotate = 0 }: { x: number; y: number; color: string; rotate?: number }) {
  return <rect x={x} y={y} width={16} height={30} fill={color} transform={`rotate(${rotate} ${x + 8} ${y + 15})`} />;
}

const SCENES: Record<MapTask["scene"], Scene> = {
  parking: {
    background: (t) => (
      <>
        <rect x={0} y={0} width={420} height={46} fill={INK} />
        <text x={84} y={30} textAnchor="middle" fontSize={17} fontWeight={700} letterSpacing={3} fill={PAPER} style={{ fontFamily: "var(--font-schibsted)" }}>
          {t.market}
        </text>
        <text x={336} y={29} textAnchor="middle" fontSize={9.5} fill={PAPER} opacity={0.7} style={{ fontFamily: "var(--font-schibsted)" }}>
          {t.hours}
        </text>
        <rect x={188} y={26} width={44} height={20} fill={PAPER} />
        <line x1={210} y1={26} x2={210} y2={46} stroke={INK} strokeWidth={1.2} />
        <rect x={0} y={46} width={420} height={10} fill="#ebe5d7" />
        <rect x={0} y={56} width={420} height={254} fill={ASPHALT} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={186 + i * 10} y={58} width={6} height={32} fill={LINE} />
        ))}
        <Bays y={ROW_A} from={0} to={11} open="down" />
        <rect x={12 + 5 * 36 + 3} y={ROW_A + 3} width={30} height={48} fill="none" stroke={BLUE} strokeWidth={2} />
        <g transform={`translate(${bay(5)} ${ROW_A + 27})`} fill={BLUE}>
          <circle cx={-5} cy={-9} r={3.2} />
          <rect x={-8} y={-5} width={6} height={12} rx={2} />
          <circle cx={5} cy={-4} r={2.4} />
          <rect x={2.6} y={-1} width={4.8} height={8} rx={1.6} />
        </g>
        {CARS_A.map((i) => (
          <Car key={i} x={bay(i)} y={ROW_A + 27} color={COLORS[i]} />
        ))}
        <Bays y={ROW_B} from={0} to={11} open="up" />
        {CARS_B.map((i) => (
          <Car key={i} x={bay(i)} y={ROW_B + 27} color={COLORS[(i + 4) % COLORS.length]} rotate={180} />
        ))}
        <Bays y={ROW_C} from={8} to={11} depth={50} open="up" />
        <g transform="translate(46 282)" stroke={INK} strokeWidth={1.4} fill="none">
          <path d="M-9 -7H8L6 4H-7Z" />
          <line x1={-9} y1={-7} x2={-13} y2={-11} />
          <circle cx={-5} cy={7.6} r={1.6} fill={INK} />
          <circle cx={4} cy={7.6} r={1.6} fill={INK} />
        </g>
      </>
    ),
    hits: {
      first: { x: 12 + 9 * 36, y: ROW_A, w: 36, h: 54 },
      family: { x: 12 + 5 * 36, y: ROW_A, w: 36, h: 54 },
      far: { x: 12 + 8 * 36, y: ROW_C, w: 108, h: 50 },
      double: { x: 12 + 2 * 36, y: ROW_B, w: 72, h: 54 },
      lane: { x: 176, y: 56, w: 68, h: 36 },
    },
    placed: {
      first: <Car x={bay(9)} y={ROW_A + 27} color={RED} className="animate-park" />,
      family: <Car x={bay(5)} y={ROW_A + 27} color={RED} className="animate-park" />,
      far: <Car x={bay(10)} y={ROW_C + 25} color={RED} rotate={180} className="animate-park" />,
      double: <Car x={12 + 3 * 36} y={ROW_B + 27} color={RED} rotate={208} className="animate-park" />,
      lane: (
        <g>
          <Car x={210} y={74} color={RED} rotate={90} className="animate-park" />
          <g className="animate-blink" fill={OCHRE}>
            <circle cx={189} cy={66} r={2.4} />
            <circle cx={189} cy={82} r={2.4} />
            <circle cx={231} cy={66} r={2.4} />
            <circle cx={231} cy={82} r={2.4} />
          </g>
        </g>
      ),
    },
  },

  beach: {
    background: (t) => (
      <>
        <rect x={0} y={0} width={420} height={74} fill={BLUE} />
        <g fill="none" stroke={PAPER} strokeWidth={1.4} opacity={0.5}>
          <path d="M0 22q10-6 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" />
          <path d="M-10 48q10-6 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" />
        </g>
        <circle cx={378} cy={30} r={12} fill={OCHRE} />
        <rect x={0} y={74} width={420} height={18} fill={WET} />
        <rect x={0} y={92} width={420} height={150} fill={SAND} />
        <path d="M0 242Q40 230 80 240T160 238T240 242T320 236T420 240V310H0Z" fill={GREY} />
        <g stroke={INK} strokeWidth={1} strokeLinecap="round" opacity={0.55}>
          {[24, 58, 96, 132, 170, 214, 252].map((x, i) => (
            <path key={x} d={`M${x} ${262 + (i % 3) * 14}l-3 -8M${x + 4} ${262 + (i % 3) * 14}l1 -9M${x + 8} ${262 + (i % 3) * 14}l4 -7`} />
          ))}
        </g>
        <g>
          <rect x={136} y={258} width={2.4} height={24} fill={INK} />
          <rect x={122} y={246} width={31} height={16} fill={PAPER} stroke={RED} strokeWidth={2} />
          <line x1={127} y1={251} x2={148} y2={251} stroke={INK} strokeWidth={1.4} />
          <line x1={127} y1={256} x2={143} y2={256} stroke={INK} strokeWidth={1.4} />
        </g>
        <rect x={300} y={204} width={36} height={106} fill={PAPER} />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={300} y1={210 + i * 8} x2={336} y2={210 + i * 8} stroke={INK} strokeWidth={0.7} opacity={0.6} />
        ))}
        <rect x={348} y={208} width={58} height={34} fill={PAPER} stroke={INK} strokeWidth={1.2} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={346 + i * 12.4} y={200} width={6.2} height={9} fill={RED} />
        ))}
        <rect x={346} y={200} width={62} height={9} fill="none" stroke={INK} strokeWidth={1.2} />
        <text x={377} y={230} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK} style={{ fontFamily: "var(--font-schibsted)" }}>
          {t.waffles}
        </text>
        <Parawan points="30,98 30,124 108,124 108,98" />
        <Parawan points="124,98 124,120 186,120 186,98" />
        <circle cx={70} cy={110} r={3} fill={INK} />
        <circle cx={154} cy={108} r={3} fill={INK} />
      </>
    ),
    hits: {
      front: { x: 202, y: 92, w: 96, h: 40 },
      middle: { x: 80, y: 142, w: 160, h: 72 },
      path: { x: 270, y: 150, w: 146, h: 48 },
      dune: { x: 14, y: 246, w: 260, h: 60 },
    },
    placed: {
      front: (
        <g className="animate-park">
          <Parawan ours points="210,96 210,128 292,128 292,96" />
        </g>
      ),
      middle: (
        <g className="animate-park">
          <Towel x={118} y={160} color={RED} rotate={-8} />
          <Towel x={146} y={162} color={BLUE} />
          <Towel x={174} y={160} color={OCHRE} rotate={6} />
          <Parawan ours points="96,150 96,208 226,208 226,150" />
        </g>
      ),
      path: (
        <g className="animate-park">
          <Parawan ours points="286,158 286,192 344,192 344,158" />
        </g>
      ),
      dune: (
        <g className="animate-park">
          <Parawan ours points="176,252 176,292 248,292 248,252" />
        </g>
      ),
    },
  },
};

/** Tap a spot on the picture. What the spot means is revealed only after the choice. */
export function MapView({ task, proxy, value, onAnswer }: TaskProps<MapTask>) {
  const t = COPY[useLocale()];
  const scene = SCENES[task.scene];
  const [picked, setPicked] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const skipIndex = task.skip ? task.zones.length : -1;
  const shown = picked ?? value ?? null;
  const done = picked !== null;

  function choose(index: number) {
    if (!done) setPicked(index);
  }

  useKeys((key, event) => {
    if (done) return;
    const index = keyIndex(key);
    if (index >= 0 && index < task.zones.length + (task.skip ? 1 : 0)) {
      event.preventDefault();
      choose(index);
    }
  });

  const zone = shown !== null && shown !== skipIndex ? task.zones[shown] : null;
  const verdict = picked === null ? null : picked === skipIndex && task.skip ? task.skip : task.zones[picked];
  const pointer = hover !== null ? task.zones[hover]?.place : null;

  const onZoneKey = (event: KeyboardEvent, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(index);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
      <figure className="border border-ink">
        <svg viewBox="0 0 420 310" className="block w-full touch-manipulation select-none" role="group" aria-label={t.scenes[task.scene]}>
          {scene.background(t)}
          {task.zones.map((item, index) => {
            const hit = scene.hits[item.zone];
            const active = !done && (hover === index);
            return (
              <rect
                key={item.zone}
                x={hit.x + 2}
                y={hit.y + 2}
                width={hit.w - 4}
                height={hit.h - 4}
                role="button"
                tabIndex={done ? -1 : 0}
                aria-label={`${index + 1}. ${item.place}`}
                aria-pressed={shown === index}
                onClick={() => choose(index)}
                onKeyDown={(event) => onZoneKey(event, index)}
                onPointerEnter={() => setHover(index)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(index)}
                onBlur={() => setHover(null)}
                className={cx("outline-none transition-[fill,stroke] duration-150", done ? "cursor-default" : "cursor-pointer")}
                fill={active ? "rgba(196,54,44,0.16)" : "transparent"}
                stroke={active ? RED : "transparent"}
                strokeWidth={2}
                strokeDasharray="5 4"
              >
                <title>{item.place}</title>
              </rect>
            );
          })}
          {zone && <g pointerEvents="none">{scene.placed[zone.zone]}</g>}
        </svg>
        <figcaption className="label flex min-h-11 items-center justify-between gap-4 border-t border-ink bg-card px-4 py-2.5 text-ink-soft">
          <span>{done ? t.taken : pointer ? t.pointer(pointer) : t.tap}</span>
          <span className="hidden text-ink-faint sm:inline">{t.keys(task.zones.length)}</span>
        </figcaption>
      </figure>

      <div>
        {verdict ? (
          <div className="animate-question-in">
            <p className="label text-ink-soft">{t.noted}</p>
            <p className="mt-3 text-[clamp(1.6rem,3.2vw,2.3rem)] font-bold leading-tight">
              {typo((proxy && verdict.proxy) || verdict.text)}
            </p>
            <div className="mt-8">
              <NextButton onClick={() => picked !== null && onAnswer(picked)} />
            </div>
          </div>
        ) : (
          <>
            <ol className="border-t border-ink">
              {task.zones.map((item, index) => (
                <li key={item.zone}>
                  <button
                    type="button"
                    onClick={() => choose(index)}
                    onPointerEnter={() => setHover(index)}
                    onPointerLeave={() => setHover(null)}
                    className={cx(
                      "grid w-full grid-cols-[2rem_1fr] items-baseline gap-3 border-b border-rule py-3 text-left font-sans text-[0.98rem] transition-colors",
                      hover === index ? "bg-paper-deep" : "hover:bg-paper-deep",
                    )}
                  >
                    <span className="pl-1 text-[0.85rem] font-semibold text-ink-soft">{index + 1}</span>
                    {item.place}
                  </button>
                </li>
              ))}
            </ol>
            {task.skip && (
              <button type="button" onClick={() => choose(skipIndex)} className="link mt-6 font-sans text-[0.98rem]">
                {(proxy && task.skip.proxy) || task.skip.text}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
