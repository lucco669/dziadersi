import type { ReactNode } from "react";
import type { SpeciesKey } from "@/content/species";

/*
 * The Institute's picture statistics: flat pictograms in the Isotype manner.
 * Pure SVG with explicit colours, so the same drawings render on the site and in generated images.
 * A figure is drawn on a 40 × 100 grid with its feet on y = 94; a species plate is 120 × 100.
 */

export const INK = "#161513";
export const PAPER = "#F4F0E7";
export const RED = "#C4362C";
export const BLUE = "#3D6696";
export const OCHRE = "#D49A2A";
export const GREY = "#CEC6B6";

export const MUSTACHE_PATH =
  "M50 11C56 4 69 1.5 80 6C89 10 94.5 19 97 31C92.5 29.5 86 26.5 78 25C68 23 58 23.5 50 18C42 23.5 32 23 22 25C14 26.5 7.5 29.5 3 31C5.5 19 11 10 20 6C31 1.5 44 4 50 11Z";

type Point = [number, number];
export type Pose = "down" | "hip" | "point" | "up" | "phone" | "cross" | "knee";
export type Legs = "shorts" | "trousers" | "boots" | "kick";
export type Hat = "cap" | "bucket" | "straw" | "captain" | "highlander";

/** Right arm polylines; the left arm is the mirror image. The last point is the hand. */
const ARM: Record<Pose, Point[]> = {
  down: [
    [32.6, 23.6],
    [38.6, 48.4],
  ],
  hip: [
    [32.6, 23.6],
    [39.8, 35.5],
    [32.2, 46.5],
  ],
  point: [
    [32.6, 23.8],
    [41.8, 30.4],
    [51, 31.2],
  ],
  up: [
    [32.6, 23.4],
    [39.4, 12.6],
    [38.6, 2.6],
  ],
  phone: [
    [32.6, 23.6],
    [37.2, 37.2],
    [27.8, 27.8],
  ],
  cross: [
    [32.6, 23.6],
    [34.4, 34.8],
    [10.2, 36.6],
  ],
  knee: [
    [32.6, 23.6],
    [37.2, 45],
    [28.8, 64.5],
  ],
};

const mirror = (points: Point[]): Point[] => points.map(([x, y]) => [40 - x, y]);
const polyline = (points: Point[]) => points.map(([x, y]) => `${x},${y}`).join(" ");

/** Arms that cross the body get a paper halo, the Isotype way of drawing an overlap. */
const CROSSES: Pose[] = ["phone", "cross", "knee"];

function Arm({ pose, side, color }: { pose: Pose; side: "l" | "r"; color: string }) {
  const points = polyline(side === "r" ? ARM[pose] : mirror(ARM[pose]));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {CROSSES.includes(pose) && <polyline points={points} stroke={PAPER} strokeWidth={7} />}
      <polyline points={points} stroke={color} strokeWidth={4.4} />
    </g>
  );
}

const TORSO =
  "M10.4 18.6H29.6Q32.6 18.6 33 22.4C33.8 29 34 35.5 33.6 41.5C33.2 47.5 32 52.6 31 57H9C8 52.6 6.8 47.5 6.4 41.5C6 35.5 6.2 29 7 22.4Q7.4 18.6 10.4 18.6Z";

function Leg({ x, legs, color, cutout }: { x: number; legs: Legs; color: string; cutout: string }) {
  if (legs === "shorts" || legs === "kick") {
    // Bare legs, white socks, sandals.
    return (
      <g>
        <line x1={x} y1={58} x2={x} y2={82.6} stroke={color} strokeWidth={7.4} />
        <line x1={x} y1={82.2} x2={x} y2={90.4} stroke={cutout} strokeWidth={7.4} />
        <line x1={x - 3.7} y1={86.4} x2={x + 3.7} y2={86.4} stroke={color} strokeWidth={1.1} />
        <rect x={x - 4.6} y={90.3} width={9.2} height={3.7} rx={1.4} fill={color} />
      </g>
    );
  }
  if (legs === "boots") {
    return (
      <g>
        <line x1={x} y1={58} x2={x} y2={80} stroke={color} strokeWidth={7.4} />
        <rect x={x - 4.4} y={75.6} width={8.8} height={18.4} rx={1.2} fill={color} />
        <line x1={x - 4.4} y1={77.4} x2={x + 4.4} y2={77.4} stroke={cutout} strokeWidth={0.8} />
      </g>
    );
  }
  return (
    <g>
      <line x1={x} y1={58} x2={x} y2={90.5} stroke={color} strokeWidth={7.4} />
      <path d={`M${x - 3.7} 90H${x + 3.3}C${x + 5.6} 90 ${x + 6.4} 91.8 ${x + 6.4} 94H${x - 4.3}C${x - 4.3} 92 ${x - 4.3} 90 ${x - 3.7} 90Z`} fill={color} />
    </g>
  );
}

function HatShape({ hat }: { hat: Hat }) {
  switch (hat) {
    case "cap":
      return (
        <g>
          <path d="M11.9 9.2A8.1 8.1 0 0 1 28.1 9.2Z" fill={RED} />
          <path d="M11.4 8.6H33.6C33.6 10.2 32.4 10.7 30.6 10.7H11.4Z" fill={RED} />
          <line x1={12} y1={11.3} x2={28} y2={11.3} stroke={PAPER} strokeWidth={0.9} />
        </g>
      );
    case "bucket":
      return (
        <g>
          <path d="M13.2 7.6C13.4 2.4 16.2 0.8 20 0.8S26.6 2.4 26.8 7.6Z" fill={OCHRE} />
          <path d="M12.6 7.3H27.4L31.2 11.4H8.8Z" fill={OCHRE} />
          <line x1={12.4} y1={7.6} x2={27.6} y2={7.6} stroke={INK} strokeWidth={0.6} />
        </g>
      );
    case "straw":
      return (
        <g>
          <path d="M13.6 7.6C13.8 2.6 16.4 0.8 20 0.8S26.2 2.6 26.4 7.6Z" fill={OCHRE} />
          <ellipse cx={20} cy={8.2} rx={14.6} ry={2.4} fill={OCHRE} />
          <line x1={13.8} y1={6.4} x2={26.2} y2={6.4} stroke={RED} strokeWidth={1.2} />
        </g>
      );
    case "captain":
      return (
        <g>
          <path d="M11 4.6C11 2.4 15 1 20 1S29 2.4 29 4.6L27.6 7.8H12.4Z" fill={PAPER} stroke={INK} strokeWidth={0.9} />
          <rect x={12.2} y={7.4} width={15.6} height={2.4} fill={INK} />
          <path d="M12.6 9.6H27.4C27 11.6 24.4 12 20 12S13 11.6 12.6 9.6Z" fill={INK} />
          <circle cx={20} cy={5} r={1.3} fill={OCHRE} />
        </g>
      );
    case "highlander":
      return (
        <g>
          <path d="M13.4 7.8C13.6 3 16.2 1.2 20 1.2S26.4 3 26.6 7.8Z" fill={INK} />
          <ellipse cx={20} cy={8.2} rx={12.4} ry={2.1} fill={INK} />
          {[15, 17.5, 20, 22.5, 25].map((x) => (
            <circle key={x} cx={x} cy={6.6} r={0.75} fill={PAPER} />
          ))}
        </g>
      );
  }
}

export type FigureProps = {
  left?: Pose;
  right?: Pose;
  legs?: Legs;
  hat?: Hat;
  color?: string;
  /** Colour of the mustache, socks and other cut-outs: the background the figure stands on. */
  cutout?: string;
  mustache?: boolean;
  glasses?: "eyes" | "forehead";
  beard?: boolean;
  /** Drawn behind the figure: a backpack. */
  behind?: ReactNode;
  /** Drawn over the torso: apron, tie, vest, sweater. */
  torso?: ReactNode;
  mustacheClassName?: string;
};

export const MUSTACHE_ON_HEAD = "translate(13.6 10.3) scale(0.128)";

/** One standing figure on the 40 × 100 grid. */
export function Figure({
  left = "down",
  right = "down",
  legs = "shorts",
  hat,
  color = INK,
  cutout = PAPER,
  mustache = true,
  glasses,
  beard,
  behind,
  torso,
  mustacheClassName,
}: FigureProps) {
  const glassesY = glasses === "forehead" ? 3.6 : 7.2;
  return (
    <g>
      {behind}
      <Leg x={15} legs={legs} color={color} cutout={cutout} />
      {legs === "kick" ? (
        <g transform="rotate(-26 25 60)">
          <g className="pg-kick">
            <Leg x={25} legs={legs} color={color} cutout={cutout} />
          </g>
        </g>
      ) : (
        <Leg x={25} legs={legs} color={color} cutout={cutout} />
      )}
      <path
        d={legs === "trousers" || legs === "boots" ? "M9.4 55H30.6L29.9 70H21.2L20 61L18.8 70H10.1Z" : "M9.4 55H30.6L31.4 69H21.1L20 62.6L18.9 69H8.6Z"}
        fill={color}
      />
      <path d={TORSO} fill={color} />
      {torso}
      <Arm pose={left} side="l" color={color} />
      <Arm pose={right} side="r" color={color} />
      {beard && <path d="M12.6 11.4C12.6 18.8 15.8 23 20 23S27.4 18.8 27.4 11.4Z" fill={color} />}
      <circle cx={20} cy={9.6} r={7.6} fill={color} />
      {glasses && (
        <g fill="none" stroke={cutout} strokeWidth={0.8}>
          <circle cx={16.9} cy={glassesY} r={2} />
          <circle cx={23.1} cy={glassesY} r={2} />
          <line x1={18.9} y1={glassesY} x2={21.1} y2={glassesY} />
        </g>
      )}
      {mustache && (
        <g transform={MUSTACHE_ON_HEAD}>
          <path d={MUSTACHE_PATH} fill={cutout} className={mustacheClassName} />
        </g>
      )}
      {hat && <HatShape hat={hat} />}
    </g>
  );
}

/* Torso details, drawn in paper over the ink silhouette. */

function Apron() {
  return (
    <g>
      <path d="M13.6 25.4H26.4V29.2C29.6 30.4 30.6 33 30.6 36.6L29.6 56.4H10.4L9.4 36.6C9.4 33 10.4 30.4 13.6 29.2Z" fill={PAPER} />
      <path d="M13.8 25.6L16.4 19M26.2 25.6L23.6 19" stroke={PAPER} strokeWidth={0.9} />
      <rect x={15.4} y={33.4} width={9.2} height={1.7} fill={RED} />
      <rect x={16.6} y={36.6} width={6.8} height={1.7} fill={RED} />
    </g>
  );
}

/** Waist pouch on a belt. */
export function Pouch() {
  return (
    <g>
      <line x1={9.4} y1={55.6} x2={30.6} y2={55.6} stroke={PAPER} strokeWidth={0.8} />
      <rect x={11.2} y={52.6} width={9.4} height={6.4} rx={1.6} fill={INK} stroke={PAPER} strokeWidth={0.8} />
      <line x1={12.6} y1={54.8} x2={19.2} y2={54.8} stroke={PAPER} strokeWidth={0.6} />
    </g>
  );
}

export function Tie() {
  return (
    <g>
      <path d="M14.4 18.6H19.2L17.6 23.4ZM25.6 18.6H20.8L22.4 23.4Z" fill={PAPER} />
      <path d="M18.8 19.2H21.2L21.8 22L20.9 23.2L22.2 38.4L20 41L17.8 38.4L19.1 23.2L18.2 22Z" fill={RED} />
    </g>
  );
}

function Vest() {
  return (
    <g fill="none" stroke={PAPER} strokeWidth={0.8}>
      <line x1={20} y1={19.2} x2={20} y2={56} />
      <rect x={10.6} y={27} width={6.4} height={5.2} />
      <rect x={23} y={27} width={6.4} height={5.2} />
      <rect x={10.2} y={37.6} width={7} height={6.4} />
      <rect x={22.8} y={37.6} width={7} height={6.4} />
      <rect x={11.2} y={47} width={5.6} height={4.6} />
      <rect x={23.2} y={47} width={5.6} height={4.6} />
    </g>
  );
}

export function Sweater() {
  return (
    <g fill="none" stroke={PAPER} strokeWidth={1.1} strokeLinejoin="round">
      <polyline points="7.6,30 10.6,27 13.6,30 16.6,27 19.6,30 22.6,27 25.6,30 28.6,27 31.6,30" />
      <polyline points="7.4,35.4 10.4,32.4 13.4,35.4 16.4,32.4 19.4,35.4 22.4,32.4 25.4,35.4 28.4,32.4 31.4,35.4 32.6,34.2" />
    </g>
  );
}

export function Jacket() {
  return (
    <g>
      <polyline points="13.2,19 20,35.4 26.8,19" fill="none" stroke={PAPER} strokeWidth={1.2} />
      <path d="M17.2 19.4L20 21L22.8 19.4V22.8L20 21.2L17.2 22.8Z" fill={RED} />
      <path d="M24.6 27H29.4L27 30.2Z" fill={RED} />
    </g>
  );
}

function Straps() {
  return <path d="M12.4 19.2L11.2 45M27.6 19.2L28.8 45" stroke={PAPER} strokeWidth={1.2} />;
}

/** The dziaders in summer plumage: the generic specimen. */
export function SummerTorso() {
  return (
    <g>
      <path d="M15.2 18.6H19.4L17.4 22.6ZM24.8 18.6H20.6L22.6 22.6Z" fill={PAPER} />
      <rect x={22.6} y={26.2} width={5.8} height={5.2} fill="none" stroke={PAPER} strokeWidth={0.8} />
      <line x1={24.6} y1={23.6} x2={24.6} y2={28.4} stroke={RED} strokeWidth={1.1} strokeLinecap="round" />
      <Pouch />
      <rect x={27.6} y={53.8} width={4.4} height={7.4} rx={0.9} fill={INK} stroke={PAPER} strokeWidth={0.8} />
    </g>
  );
}

/* Small objects. */

export function Note({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <ellipse cx={0} cy={6} rx={2.4} ry={1.8} transform="rotate(-20 0 6)" fill={INK} />
      <path d="M2.2 5.4V-4.2L6.6 -2.4" fill="none" stroke={INK} strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Z({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <polyline
      points={`${x},${y} ${x + size},${y} ${x},${y + size} ${x + size},${y + size}`}
      fill="none"
      stroke={INK}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  );
}

export function Pine({ x, scale = 1, color = INK }: { x: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x} 94) scale(${scale})`} fill={color}>
      <rect x={-1.4} y={-8} width={2.8} height={8} />
      <path d="M0 -44L9 -28H5L12 -16H7L15 -6H-15L-7 -16H-12L-5 -28H-9Z" />
    </g>
  );
}

function Pigeon({ x, y, flip, color = BLUE }: { x: number; y: number; flip?: boolean; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-6.8 0.6C-6.8 -3.6 -2.6 -5.6 1.4 -4.6L7.6 -6.4L5.6 -2.6C6.6 0.4 4.6 3.4 0 3.6C-4 3.8 -6.8 2.8 -6.8 0.6Z" fill={color} />
      <circle cx={-5.6} cy={-5} r={2.4} fill={color} />
      <path d="M-7.8 -5L-9.8 -4.2L-7.8 -3.6Z" fill={INK} />
      <path d="M-2.4 -2.2C0 -0.6 2.6 -0.8 4.4 -2.8" fill="none" stroke={PAPER} strokeWidth={0.6} />
      <circle cx={-6.1} cy={-5.5} r={0.5} fill={PAPER} />
    </g>
  );
}

/** Field binoculars on a strap, over the belly: the field observer's kit. */
export function Binoculars() {
  return (
    <g>
      <path d="M14.6 18.8L16.4 28M25.4 18.8L23.6 28" stroke={PAPER} strokeWidth={0.8} fill="none" />
      <rect x={18.4} y={29.6} width={3.2} height={2.4} fill={PAPER} />
      <circle cx={15.6} cy={32.4} r={3.6} fill={INK} stroke={PAPER} strokeWidth={0.9} />
      <circle cx={24.4} cy={32.4} r={3.6} fill={INK} stroke={PAPER} strokeWidth={0.9} />
      <circle cx={15.6} cy={32.4} r={1.4} fill={BLUE} />
      <circle cx={24.4} cy={32.4} r={1.4} fill={BLUE} />
    </g>
  );
}

/** A tie worn on the forehead, as at every wedding after midnight. */
export function HeadTie() {
  return (
    <g>
      <rect x={12} y={2} width={16.4} height={2.6} fill={RED} transform="rotate(-10 20 3.4)" />
      <path d="M26.6 1.6L29.4 1.2L36 13.4L33.2 15.4Z" fill={RED} />
      <path d="M33.2 15.4L36 13.4L36.6 16.6Z" fill={RED} />
    </g>
  );
}

/** A club scarf, knotted once and hanging over the belly. */
function Scarf() {
  return (
    <g>
      <path d="M11.6 18.4H28.4L27.4 22.4H12.6Z" fill={RED} />
      <rect x={21.4} y={20} width={5} height={22} fill={RED} transform="rotate(-6 24 31)" />
      {[25, 30, 35, 40].map((y) => (
        <line key={y} x1={21.6} y1={y + 0.6} x2={26.6} y2={y} stroke={PAPER} strokeWidth={1.4} />
      ))}
    </g>
  );
}

/* Species plates, 120 × 100. */

type Plate = { figure: ReactNode; scene?: ReactNode; front?: ReactNode };

const at = (x: number, children: ReactNode) => <g transform={`translate(${x} 0)`}>{children}</g>;

const PLATES: Record<SpeciesKey, () => Plate> = {
  grill: () => ({
    figure: at(
      12,
      <>
        <Figure torso={<Apron />} />
        <g stroke={INK} strokeWidth={1.3} strokeLinecap="round">
          <line x1={38.2} y1={47} x2={47.6} y2={61.4} />
          <line x1={39.6} y1={46.4} x2={49.6} y2={60} />
        </g>
        <rect x={45.4} y={60.2} width={6.8} height={2.8} rx={1.4} fill={RED} transform="rotate(-30 48.8 61.6)" />
      </>,
    ),
    scene: (
      <>
        <g className="pg-smoke" fill="none" stroke={GREY} strokeWidth={1.6} strokeLinecap="round">
          <path d="M80 55c-3-4 3-6 0-10s3-6 0-10" />
          <path d="M87 53c-3-4 3-6 0-10s3-6 0-10s3-6 0-9" />
          <path d="M94 55c-3-4 3-6 0-10s3-6 0-10" />
        </g>
        <path d="M72 63H102A15 11 0 0 1 72 63Z" fill={INK} />
        {[76.6, 84, 91.4].map((x) => (
          <rect key={x} x={x} y={59.6} width={6.2} height={2.8} rx={1.4} fill={RED} />
        ))}
        <line x1={70.6} y1={63} x2={103.4} y2={63} stroke={INK} strokeWidth={1.3} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={1.6} strokeLinecap="round">
          <line x1={78} y1={70} x2={74.4} y2={94} />
          <line x1={87} y1={73} x2={87} y2={94} />
          <line x1={96} y1={70} x2={99.6} y2={94} />
        </g>
      </>
    ),
  }),

  parking: () => ({
    figure: at(10, <Figure left="cross" right="cross" glasses="eyes" />),
    scene: (
      <>
        <line x1={104} y1={36} x2={104} y2={94} stroke={INK} strokeWidth={1.8} />
        <rect x={95} y={18} width={18} height={18} rx={1.6} fill={BLUE} />
        <path d="M100.8 32.4V22H105.4C108 22 109.2 23.5 109.2 25.5S108 29 105.4 29H100.8" fill="none" stroke={PAPER} strokeWidth={2.2} />
        <path d="M67 78H85L83 94H69Z" fill={RED} />
        <path d="M67.8 78Q76 67 84.2 78" fill="none" stroke={INK} strokeWidth={1.2} />
        <line x1={66.4} y1={78} x2={85.6} y2={78} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      </>
    ),
  }),

  budowa: () => ({
    figure: at(
      6,
      <>
        <Figure left="hip" right="point" legs="trousers" />
        <line x1={28.4} y1={2.6} x2={31.4} y2={11.4} stroke={OCHRE} strokeWidth={1.6} strokeLinecap="round" />
      </>,
    ),
    scene: (
      <g>
        {[0, 1, 2].flatMap((col) =>
          [0, 1, 2, 3].map((row) => {
            const crooked = col === 1 && row === 1;
            const x = 66 + col * 14;
            const y = 24 + row * 14;
            return (
              <rect
                key={`${col}-${row}`}
                x={x}
                y={y}
                width={12}
                height={12}
                fill={crooked ? RED : PAPER}
                stroke={INK}
                strokeWidth={1}
                transform={crooked ? `rotate(16 ${x + 6} ${y + 6})` : undefined}
              />
            );
          }),
        )}
      </g>
    ),
  }),

  moto: () => ({
    figure: at(4, <Figure legs="kick" hat="cap" />),
    scene: (
      <>
        <g transform="translate(-2.5 0)">
          <path
            d="M46 86V77Q46 72.4 51.4 71.4L66 69L74.6 58.6Q76.6 56.4 80.4 56.4H98.6Q102.4 56.4 104.8 59L112.6 69L116.4 70Q120 71 120 75.4V86Z"
            fill={GREY}
          />
          <path d="M77.4 60.4L71.6 68H88V60.4ZM91 60.4V68H108.4L102.6 60.4Z" fill={PAPER} />
          <circle cx={104} cy={85} r={9.4} fill={INK} />
          <circle cx={104} cy={85} r={4.2} fill={GREY} />
        </g>
        <g className="pg-tyre">
          <circle cx={55.5} cy={85} r={9.4} fill={INK} />
          <circle cx={55.5} cy={85} r={4.2} fill={PAPER} />
          <circle cx={55.5} cy={85} r={1.8} fill={INK} />
        </g>
        <g stroke={INK} strokeWidth={1.1} strokeLinecap="round">
          <line x1={41} y1={76.4} x2={42.6} y2={72.2} />
          <line x1={45.4} y1={77.6} x2={48.4} y2={74.2} />
        </g>
      </>
    ),
  }),

  wakacje: () => ({
    figure: at(4, <Figure hat="bucket" torso={<Pouch />} />),
    scene: (
      <>
        <circle className="pg-sun" cx={102} cy={18} r={7} fill={OCHRE} />
        {[RED, PAPER, BLUE, PAPER].map((fill, i) => (
          <rect key={i} x={52 + i * 16} y={50} width={16} height={40} fill={fill} />
        ))}
        <rect x={52} y={50} width={64} height={40} fill="none" stroke={INK} strokeWidth={0.8} />
        {[52, 68, 84, 100, 116].map((x) => (
          <line key={x} x1={x} y1={46} x2={x} y2={94} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        ))}
      </>
    ),
  }),

  facebook: () => ({
    figure: at(
      12,
      <>
        <Figure right="phone" glasses="eyes" />
        <rect x={25.6} y={23.4} width={4.8} height={8.4} rx={0.9} fill={BLUE} transform="rotate(-14 28 27.6)" />
      </>,
    ),
    scene: (
      <g className="pg-bubble">
        <rect x={60} y={10} width={44} height={26} rx={3} fill={RED} />
        <path d="M67 35L61 45L77 35Z" fill={RED} />
        {[72, 82, 92].map((x) => (
          <g key={x} fill={PAPER}>
            <rect x={x - 1.6} y={14.6} width={3.2} height={11} rx={0.8} />
            <circle cx={x} cy={30.4} r={1.9} />
          </g>
        ))}
      </g>
    ),
  }),

  smart: () => ({
    figure: at(
      8,
      <>
        <Figure glasses="forehead" />
        <rect x={36.8} y={48.2} width={4} height={5.6} rx={0.6} fill={INK} stroke={PAPER} strokeWidth={0.5} />
        <line x1={37.8} y1={48.2} x2={37.8} y2={45.2} stroke={INK} strokeWidth={0.8} />
        <line x1={39.8} y1={48.2} x2={39.8} y2={45.2} stroke={INK} strokeWidth={0.8} />
      </>,
    ),
    scene: (
      <>
        <path d="M46.8 61.8C49 76 54 92 64 92C72 92 76 84 79 72" fill="none" stroke={INK} strokeWidth={0.9} />
        <rect x={74} y={76} width={32} height={18} fill={INK} />
        <line x1={74.6} y1={84.6} x2={105.4} y2={84.6} stroke={PAPER} strokeWidth={0.8} />
        <rect x={77} y={66} width={26} height={10} rx={1.6} fill={BLUE} />
        {[81, 85, 89].map((x) => (
          <circle key={x} cx={x} cy={71} r={1} fill={PAPER} />
        ))}
        <g stroke={INK} strokeWidth={1.4} strokeLinecap="round">
          <line x1={80} y1={66} x2={77} y2={52} />
          <line x1={90} y1={66} x2={90} y2={50} />
          <line x1={100} y1={66} x2={103} y2={52} />
        </g>
        <rect x={93} y={76.6} width={8} height={8} fill={OCHRE} transform="rotate(8 97 80.6)" />
        <g className="pg-zzz">
          <Z x={106} y={42} size={3.4} />
          <Z x={110} y={34} size={4.4} />
          <Z x={115} y={24} size={5.4} />
        </g>
      </>
    ),
  }),

  dzialka: () => ({
    figure: at(
      8,
      <>
        <Figure hat="straw" />
        <path d="M37.6 49.6Q42 42 46.4 49.6" fill="none" stroke={INK} strokeWidth={1.4} />
        <rect x={36} y={49.6} width={12} height={10} rx={1.2} fill={BLUE} />
        <line x1={47.6} y1={57} x2={56.4} y2={48.6} stroke={BLUE} strokeWidth={2} strokeLinecap="round" />
        <circle cx={57.2} cy={47.8} r={1.8} fill={BLUE} />
      </>,
    ),
    scene: (
      <>
        <g className="pg-drops" fill={BLUE}>
          <ellipse cx={68} cy={52} rx={0.9} ry={1.6} />
          <ellipse cx={71} cy={57} rx={0.9} ry={1.6} />
          <ellipse cx={68.6} cy={61.6} rx={0.9} ry={1.6} />
        </g>
        <line x1={86} y1={32} x2={86} y2={94} stroke={OCHRE} strokeWidth={1.8} />
        <path d="M86 92C80 84 92 78 86 70C80 62 92 56 86 48C82 42 88 38 86 34" fill="none" stroke={INK} strokeWidth={1.2} />
        {[
          [80, 44, -35],
          [92, 52, 35],
          [79.6, 62, -35],
          [92.4, 70, 35],
          [80, 80, -35],
        ].map(([x, y, r]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={4.6} ry={2.2} transform={`rotate(${r} ${x} ${y})`} fill={INK} />
        ))}
        {[
          [80.6, 51.4],
          [91, 61],
          [80.4, 70.6],
          [91.4, 79.8],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={3.3} fill={RED} />
        ))}
      </>
    ),
  }),

  wedka: () => ({
    figure: at(
      6,
      <>
        <Figure hat="bucket" torso={<Vest />} />
        <line x1={40.4} y1={52} x2={104} y2={4} stroke={INK} strokeWidth={1.2} strokeLinecap="round" />
      </>,
    ),
    scene: (
      <>
        <line x1={110} y1={4} x2={110} y2={74.8} stroke={INK} strokeWidth={0.5} />
        <line x1={104} y1={4} x2={110} y2={4} stroke={INK} strokeWidth={0.5} />
        <g className="pg-float">
          <path d="M107.6 77A2.4 2.4 0 0 1 112.4 77Z" fill={RED} />
          <path d="M107.6 77A2.4 2.4 0 0 0 112.4 77Z" fill={PAPER} stroke={INK} strokeWidth={0.5} />
        </g>
        <path d="M60 79.4q3-2 6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0" fill="none" stroke={BLUE} strokeWidth={1.4} />
        <path d="M66 85.4q3-2 6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0t6 0" fill="none" stroke={BLUE} strokeWidth={1.4} opacity={0.5} />
        <rect x={50} y={82} width={6.4} height={12} rx={1} fill={RED} />
        <rect x={50} y={79.4} width={6.4} height={3} rx={0.6} fill={INK} />
      </>
    ),
  }),

  korpo: () => ({
    figure: at(
      8,
      <>
        <Figure legs="trousers" torso={<Tie />} />
        <g transform="rotate(10 42 56)">
          <rect x={38.6} y={47} width={11} height={14} fill={PAPER} stroke={INK} strokeWidth={0.7} />
          <g stroke={INK} strokeWidth={0.6}>
            <line x1={40.6} y1={50.4} x2={47.6} y2={50.4} />
            <line x1={40.6} y1={53} x2={47.6} y2={53} />
            <line x1={40.6} y1={55.6} x2={45.6} y2={55.6} />
          </g>
        </g>
      </>,
    ),
    scene: (
      <>
        <rect x={74} y={62} width={26} height={8} fill={PAPER} stroke={INK} strokeWidth={0.7} />
        <g stroke={INK} strokeWidth={0.6}>
          <line x1={77} y1={64.6} x2={96} y2={64.6} />
          <line x1={77} y1={67.2} x2={90} y2={67.2} />
        </g>
        <rect x={68} y={70} width={38} height={14} rx={1.4} fill={INK} />
        <circle cx={100} cy={77} r={1.2} fill={OCHRE} />
        <line x1={63} y1={84.6} x2={111} y2={84.6} stroke={INK} strokeWidth={1.4} />
        <line x1={66} y1={84.6} x2={66} y2={94} stroke={INK} strokeWidth={1.4} />
        <line x1={108} y1={84.6} x2={108} y2={94} stroke={INK} strokeWidth={1.4} />
      </>
    ),
  }),

  zeglarz: () => ({
    figure: at(10, <Figure hat="captain" legs="trousers" left="hip" />),
    scene: (
      <g className="pg-wheel">
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI) / 4;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return (
            <g key={i}>
              <line x1={86 + cos * 3} y1={54 + sin * 3} x2={86 + cos * 19.6} y2={54 + sin * 19.6} stroke={INK} strokeWidth={2} />
              <circle cx={86 + cos * 20.4} cy={54 + sin * 20.4} r={1.9} fill={INK} />
            </g>
          );
        })}
        <circle cx={86} cy={54} r={14.6} fill="none" stroke={INK} strokeWidth={2.8} />
        <circle cx={86} cy={54} r={3.6} fill={OCHRE} />
      </g>
    ),
  }),

  grzybiarz: () => ({
    figure: at(
      8,
      <>
        <Figure legs="boots" glasses="eyes" />
        <path d="M37.4 58Q46 43 54.6 58" fill="none" stroke={OCHRE} strokeWidth={1.6} />
        <path d="M43 56.6C43 52.8 46 51.2 48.4 51.2S53.8 52.8 53.8 56.6Z" fill={OCHRE} />
        <path d="M37 56.4C37 51.6 40.4 49.8 43.2 49.8S49.4 51.6 49.4 56.4Z" fill={RED} />
        {[
          [40, 53.4],
          [43.6, 51.8],
          [46.6, 54],
        ].map(([x, y]) => (
          <circle key={`${x}`} cx={x} cy={y} r={0.8} fill={PAPER} />
        ))}
        <path d="M35.8 57H55.8L53.2 71H38.4Z" fill={OCHRE} />
        <g stroke={INK} strokeWidth={0.5}>
          <line x1={36.6} y1={61} x2={55} y2={61} />
          <line x1={37.4} y1={65} x2={54.2} y2={65} />
        </g>
      </>,
    ),
    scene: (
      <>
        <Pine x={84} scale={1.1} />
        <Pine x={106} scale={0.8} color={GREY} />
      </>
    ),
  }),

  przygraniczny: () => ({
    figure: at(
      8,
      <>
        <Figure hat="cap" />
        <rect x={34.6} y={47.2} width={8} height={2.4} rx={0.8} fill={INK} />
        <rect x={32.6} y={49} width={13} height={16} rx={1.2} fill={RED} />
        <path d="M34.6 51L43.6 63M43.6 51L34.6 63" stroke={PAPER} strokeWidth={0.8} />
        <rect x={42.6} y={46.6} width={2.4} height={3.4} fill={INK} />
      </>,
    ),
    scene: (
      <>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={92} y={30 + i * 8} width={8} height={8} fill={i % 2 ? RED : PAPER} />
        ))}
        <rect x={92} y={30} width={8} height={64} fill="none" stroke={INK} strokeWidth={0.9} />
        <rect x={90.6} y={25} width={10.8} height={5} fill={INK} />
        <rect x={62} y={62} width={15} height={32} rx={1.6} fill={GREY} />
        <rect x={64.6} y={65.6} width={9.8} height={6.4} fill={PAPER} />
        <path d="M77 70C83.6 70 84 82 79.6 86" fill="none" stroke={INK} strokeWidth={1.2} />
        <path d="M78.4 84.6L81.6 85.4L80.6 89.6L77.6 88.6Z" fill={INK} />
      </>
    ),
  }),

  oszczednosciowy: () => ({
    figure: at(
      8,
      <>
        <Figure glasses="eyes" legs="trousers" />
        <path d="M34.6 50.6H48.6L50 68.4Q41.6 70.4 33.2 68.4Z" fill={PAPER} stroke={INK} strokeWidth={0.9} />
        <path d="M36.6 50.6Q38.6 44.6 40.6 50.6M42.6 50.6Q44.6 44.6 46.6 50.6" fill="none" stroke={INK} strokeWidth={0.9} />
        <path d="M38.4 51L40.8 46.2L44.4 50.2Z" fill={RED} />
        <path d="M43 50.8L46.4 47.4L47.6 51Z" fill={BLUE} />
      </>,
    ),
    scene: (
      <>
        <line x1={64} y1={62} x2={116} y2={62} stroke={INK} strokeWidth={1.6} />
        <path d="M68 62V68M112 62V68" stroke={INK} strokeWidth={1.4} />
        {[
          [66, 7, 9],
          [76, 9, 12],
          [88.6, 11, 15],
          [103, 12, 19],
        ].map(([x, w, h]) => (
          <g key={x}>
            <rect x={x} y={62 - h} width={w} height={h} rx={1.2} fill={PAPER} stroke={INK} strokeWidth={0.9} />
            <rect x={x - 0.4} y={62 - h - 2.4} width={w + 0.8} height={2.6} rx={0.6} fill={OCHRE} />
          </g>
        ))}
      </>
    ),
  }),

  uzdrowiskowy: () => ({
    figure: at(8, <Figure left="up" right="up" legs="trousers" torso={<Jacket />} />),
    scene: (
      <>
        <g className="pg-notes">
          <Note x={53} y={14} />
          <Note x={60} y={4} size={0.8} />
        </g>
        <rect x={66} y={48} width={50} height={36} fill={OCHRE} />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={70 + i * 4.2} y1={48} x2={70 + i * 4.2} y2={84} stroke={INK} strokeWidth={0.5} />
        ))}
        <rect x={64} y={44.6} width={54} height={3.6} fill={INK} />
        {[68, 80, 92, 104, 114].map((x) => (
          <line key={x} x1={x} y1={84} x2={x} y2={94} stroke={INK} strokeWidth={1.4} />
        ))}
      </>
    ),
  }),

  gorski: () => ({
    figure: at(
      8,
      <>
        <Figure />
        <line x1={39.6} y1={34} x2={44} y2={94} stroke={OCHRE} strokeWidth={1.6} strokeLinecap="round" />
        <rect x={-1.6} y={48} width={6} height={12} rx={1} fill={RED} />
        <rect x={-1.6} y={46.2} width={6} height={2.4} rx={0.5} fill={INK} />
      </>,
    ),
    scene: (
      <>
        <path d="M56 94L84 28L96 50L104 40L122 94Z" fill={GREY} />
        <path d="M84 28L79.4 38.8L83 37.4L85.6 40.4L88.4 37.4Z" fill={PAPER} />
        <path d="M104 40L101.4 46.2L103.6 45.6L105.4 47.4L106.8 44.8Z" fill={PAPER} />
      </>
    ),
  }),

  festiwalowy: () => ({
    figure: at(
      8,
      <>
        <Figure legs="trousers" />
        <rect x={36.6} y={46} width={4.2} height={9.4} rx={0.8} fill={INK} stroke={PAPER} strokeWidth={0.6} />
        <circle cx={38.7} cy={48.4} r={0.7} fill={RED} />
      </>,
    ),
    scene: (
      <>
        <g className="pg-notes">
          <Note x={50} y={14} />
          <Note x={57} y={4} size={0.8} />
        </g>
        <line x1={88} y1={44} x2={80} y2={32} stroke={INK} strokeWidth={1.1} />
        <line x1={88} y1={44} x2={96} y2={32} stroke={INK} strokeWidth={1.1} />
        <rect x={66} y={44} width={42} height={32} rx={3} fill={INK} />
        <rect x={70} y={48} width={28} height={24} rx={2} fill={BLUE} />
        <path d="M84 52L85.6 56.4H90.2L86.4 59.2L87.8 63.6L84 60.8L80.2 63.6L81.6 59.2L77.8 56.4H82.4Z" fill={OCHRE} />
        <circle cx={102.6} cy={53} r={1.6} fill={PAPER} />
        <circle cx={102.6} cy={59} r={1.6} fill={PAPER} />
        <line x1={72} y1={76} x2={69} y2={88} stroke={INK} strokeWidth={1.4} />
        <line x1={102} y1={76} x2={105} y2={88} stroke={INK} strokeWidth={1.4} />
      </>
    ),
  }),

  golebiarz: () => ({
    figure: at(
      6,
      <>
        <Figure right="point" hat="cap" />
        <Pigeon x={55.6} y={26.6} />
      </>,
    ),
    scene: (
      <>
        <line x1={98} y1={48} x2={98} y2={94} stroke={INK} strokeWidth={2} />
        <rect x={86} y={34} width={24} height={15} fill={INK} />
        <path d="M83 35L98 22L113 35Z" fill={RED} />
        <rect x={90} y={40} width={4.4} height={4.4} fill={PAPER} />
        <rect x={101.6} y={40} width={4.4} height={4.4} fill={PAPER} />
        <g className="pg-fly">
          <path d="M72 18L76 14.6L78.6 17.4L81.4 14.6L85 18L78.6 19.6Z" fill={BLUE} />
        </g>
      </>
    ),
  }),

  jurajski: () => ({
    figure: at(4, <Figure right="point" glasses="eyes" legs="trousers" />),
    scene: (
      <g fill={GREY}>
        <ellipse cx={92} cy={66} rx={17} ry={11} />
        <path d="M78 63C68 66 62 74 56 82C64 77 72 74 80 71Z" />
        <path d="M99 60C104 48 104 32 103 18H109C111 33 110 50 106 64Z" />
        <ellipse cx={108.6} cy={16.6} rx={6.2} ry={3.6} />
        <rect x={79} y={70} width={5.4} height={24} rx={1.4} />
        <rect x={87} y={73} width={5.4} height={21} rx={1.4} />
        <rect x={96} y={73} width={5.4} height={21} rx={1.4} />
        <rect x={103} y={70} width={5.4} height={24} rx={1.4} />
        <circle cx={110.6} cy={15.6} r={0.8} fill={INK} />
      </g>
    ),
  }),

  meteorologiczny: () => ({
    figure: at(
      8,
      <>
        <Figure right="knee" legs="trousers" />
        <g stroke={RED} strokeWidth={1.1} strokeLinecap="round">
          <line x1={34.4} y1={63.6} x2={38} y2={61.6} />
          <line x1={34.8} y1={67} x2={38.6} y2={67.4} />
          <line x1={33.8} y1={70.4} x2={36.8} y2={72.6} />
        </g>
      </>,
    ),
    scene: (
      <>
        <g fill={GREY}>
          <circle cx={78} cy={28} r={8} />
          <circle cx={89} cy={22} r={10.4} />
          <circle cx={100.4} cy={28} r={8} />
          <rect x={78} y={28} width={22.4} height={8} />
        </g>
        <g className="pg-rain" stroke={BLUE} strokeWidth={1.3} strokeLinecap="round">
          <line x1={80} y1={40} x2={78} y2={46} />
          <line x1={88} y1={40} x2={86} y2={46} />
          <line x1={96} y1={40} x2={94} y2={46} />
          <line x1={84} y1={50} x2={82} y2={56} />
          <line x1={92} y1={50} x2={90} y2={56} />
        </g>
        <circle cx={104} cy={74} r={8} fill={PAPER} stroke={INK} strokeWidth={1.2} />
        <line x1={104} y1={74} x2={99.6} y2={69.6} stroke={RED} strokeWidth={1.2} strokeLinecap="round" />
        <circle cx={104} cy={74} r={1.2} fill={INK} />
      </>
    ),
  }),

  krupowkowy: () => ({
    figure: at(
      10,
      <>
        <Figure hat="highlander" legs="trousers" torso={<Sweater />} />
        <line x1={39.4} y1={26} x2={41.4} y2={94} stroke={OCHRE} strokeWidth={1.6} strokeLinecap="round" />
        <path d="M38.4 24.4L45.6 22.4L46.4 27.6L39.6 28.4Z" fill={INK} />
        <path d="M-1.2 51Q1.4 46.4 4 51V60Q1.4 64.6 -1.2 60Z" fill={OCHRE} />
        <g stroke={INK} strokeWidth={0.4}>
          <line x1={-1} y1={53.6} x2={3.8} y2={53.6} />
          <line x1={-1} y1={56.6} x2={3.8} y2={56.6} />
        </g>
      </>,
    ),
    scene: <path d="M62 94L72 62L80 68L92 42L100 54L108 48L122 94Z" fill={GREY} />,
  }),

  bieszczadzki: () => ({
    figure: at(6, <Figure beard legs="boots" torso={<Straps />} />),
    scene: (
      <>
        <path d="M60 94Q72 70 86 80Q98 62 122 76V94Z" fill={GREY} />
        <line x1={106} y1={30} x2={106} y2={94} stroke={INK} strokeWidth={2} />
        <path d="M88 32H114V42H88L82 37Z" fill={RED} />
        <rect x={50.6} y={60.6} width={17} height={5.4} rx={2.7} fill={RED} />
        <rect x={51.6} y={65.4} width={15} height={28.6} rx={3} fill={OCHRE} />
        <path d="M51.6 72H66.6" stroke={INK} strokeWidth={0.7} />
        <rect x={55} y={78} width={8.2} height={7} rx={1} fill="none" stroke={INK} strokeWidth={0.7} />
      </>
    ),
  }),

  weselny: () => ({
    scene: (
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
      </>
    ),
    figure: at(
      8,
      <>
        <Figure left="up" right="up" legs="trousers" torso={<Jacket />} />
        <HeadTie />
      </>,
    ),
  }),

  wigilijny: () => ({
    scene: (
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
      </>
    ),
    figure: at(6, <Figure left="hip" legs="trousers" torso={<Sweater />} />),
  }),

  parapetowy: () => ({
    scene: (
      <>
        <rect x={10} y={2} width={100} height={98} fill={GREY} />
        <rect x={24} y={8} width={72} height={55} fill={PAPER} />
        <g className="pg-float" fill="none" stroke={INK} strokeWidth={0.6}>
          {[27, 30, 33, 87, 90, 93].map((x) => (
            <path key={x} d={`M${x} 8q1.2 4 0 8t0 8t0 8t0 8t0 8`} />
          ))}
          <path d="M25 48q2 2 4 0t4 0t4 0M83 48q2 2 4 0t4 0t4 0" />
        </g>
        <rect x={24} y={8} width={72} height={55} fill="none" stroke={INK} strokeWidth={1.6} />
        <rect x={39} y={50.6} width={42} height={12} rx={3.4} fill={RED} />
        <path d="M42 53.4H78" stroke={PAPER} strokeWidth={0.8} strokeDasharray="2 1.6" />
      </>
    ),
    figure: (
      <g transform="translate(40 18)">
        <Figure left="cross" right="cross" glasses="eyes" />
      </g>
    ),
    front: (
      <>
        <rect x={10} y={63} width={100} height={37} fill={GREY} />
        <rect x={20} y={62} width={80} height={3.6} fill={INK} />
        <path d="M85.4 52H95.6L94.4 62H86.6Z" fill={OCHRE} />
        <g fill={INK}>
          <ellipse cx={87.4} cy={50} rx={3} ry={1.6} transform="rotate(-20 87.4 50)" />
          <ellipse cx={93.6} cy={50} rx={3} ry={1.6} transform="rotate(20 93.6 50)" />
        </g>
        {[
          [88.6, 45.6],
          [92.4, 44.4],
          [90.4, 41.6],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.1} fill={RED} />
        ))}
        <g stroke={PAPER} strokeWidth={0.6} opacity={0.7}>
          {[72, 80, 88, 96].map((y, i) => (
            <line key={y} x1={10} y1={y} x2={110} y2={y} strokeDasharray={i % 2 ? "6 2" : "3 2 6 2"} />
          ))}
        </g>
      </>
    ),
  }),

  kolejkowy: () => ({
    scene: (
      <>
        <g transform="translate(-8 4) scale(0.92)">
          <Figure color={GREY} cutout={PAPER} />
        </g>
        <g transform="translate(17 4) scale(0.92)">
          <Figure color={GREY} cutout={PAPER} left="cross" right="cross" />
        </g>
        <rect x={100} y={26} width={20} height={68} fill={INK} />
        <rect x={103} y={40} width={17} height={18} fill={PAPER} />
        <line x1={103} y1={49} x2={120} y2={49} stroke={INK} strokeWidth={0.6} />
        <rect x={98} y={58} width={22} height={3} fill={INK} />
        <rect x={102} y={30} width={16} height={6} fill={RED} />
        <line x1={105} y1={33} x2={115} y2={33} stroke={PAPER} strokeWidth={1} />
        <g className="pg-bubble">
          <path d="M70 4H94Q96 4 96 6V18Q96 20 94 20H80L74 26V20H70Q68 20 68 18V6Q68 4 70 4Z" fill={RED} />
          <path d="M79.4 9.4Q79.4 6.6 82 6.6T84.6 9.2Q84.6 11 82 12V14" fill="none" stroke={PAPER} strokeWidth={1.6} strokeLinecap="round" />
          <circle cx={82} cy={16.8} r={1} fill={PAPER} />
        </g>
      </>
    ),
    figure: at(50, <Figure right="point" glasses="eyes" torso={<Pouch />} />),
  }),

  kibicowski: () => ({
    scene: (
      <>
        <rect x={66} y={74} width={46} height={4} fill={INK} />
        <line x1={70} y1={78} x2={70} y2={94} stroke={INK} strokeWidth={1.8} />
        <line x1={108} y1={78} x2={108} y2={94} stroke={INK} strokeWidth={1.8} />
        <rect x={68} y={36} width={42} height={36} rx={3} fill={INK} />
        <rect x={72} y={40} width={30} height={28} rx={4} fill={BLUE} />
        <g stroke={PAPER} strokeWidth={0.7} fill="none" opacity={0.8}>
          <line x1={87} y1={40} x2={87} y2={68} />
          <circle cx={87} cy={54} r={5} />
        </g>
        <g className="pg-float">
          <circle cx={95} cy={60} r={2.6} fill={PAPER} />
        </g>
        <circle cx={106} cy={46} r={1.4} fill={OCHRE} />
        <circle cx={106} cy={51} r={1.4} fill={RED} />
        <path d="M80 36L72 22M98 36L106 22" stroke={INK} strokeWidth={1.2} strokeLinecap="round" />
      </>
    ),
    figure: at(12, <Figure left="up" right="point" torso={<Scarf />} />),
  }),

  kempingowy: () => ({
    scene: (
      <>
        <path d="M60 85V62Q60 46 78 46H104Q118 46 118 60V85Z" fill={PAPER} stroke={INK} strokeWidth={1.4} />
        <rect x={60.7} y={66} width={56.6} height={4} fill={RED} />
        <rect x={66} y={52} width={16} height={10} rx={1.4} fill={BLUE} />
        <rect x={98} y={53} width={11} height={30} fill="none" stroke={INK} strokeWidth={1.2} />
        <circle cx={100.6} cy={69} r={0.9} fill={INK} />
        <line x1={60} y1={81} x2={50} y2={88} stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        <line x1={52} y1={86.6} x2={52} y2={94} stroke={INK} strokeWidth={1.2} />
        <circle cx={84} cy={87} r={7} fill={INK} />
        <circle cx={84} cy={87} r={2.8} fill={GREY} />
      </>
    ),
    figure: at(
      8,
      <>
        <Figure left="cross" right="cross" hat="straw" />
        <rect x={1} y={33.6} width={38} height={5} rx={0.8} fill={OCHRE} />
        <rect x={16} y={34.4} width={8} height={3.4} rx={1.6} fill={PAPER} />
        <g className="pg-level">
          <circle cx={20} cy={36.1} r={1.1} fill={BLUE} />
        </g>
      </>,
    ),
  }),
};

/** A species with its attributes, as on the plates of the Atlas. */
export function SpeciesPlate({
  species,
  className,
  title,
  animated,
}: {
  species: SpeciesKey;
  className?: string;
  title?: string;
  animated?: boolean;
}) {
  const plate = PLATES[species]();
  return (
    <svg
      viewBox="0 0 120 100"
      className={[animated ? "pg-animated" : "", className].filter(Boolean).join(" ")}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {plate.scene}
      {plate.figure}
      {plate.front}
    </svg>
  );
}

/** The plate's drawing, for generated images that compose their own <svg>. */
export function plateDrawing(species: SpeciesKey) {
  const plate = PLATES[species]();
  return (
    <>
      {plate.scene}
      {plate.figure}
      {plate.front}
    </>
  );
}
