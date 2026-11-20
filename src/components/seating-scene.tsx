import type { SpeciesKey } from "@/content/species";
import type { Layout, Place, TableShape } from "@/lib/seating";
import { BLUE, GREY, INK, OCHRE, PAPER, plateDrawing, RED } from "./pictograms";

/*
 * Plan stołu from above, in the language of the test's car park and beach: flat colours, ink
 * contours, no text, so the same drawing serves the page and the generated images.
 * Coordinates are the layout's (src/lib/seating.ts); a seat's plate is 84 × 70 around its place.
 */

const CLOTH = "#fbf8f1";
const BEET = "#8e2a24";
export const SEAT_WIDTH = 84;
export const SEAT_HEIGHT = 70;

type Point = { x: number; y: number };

/** Where a place's setting lies on the table: the plate, and the way the guest faces (unit vector, table to guest). */
export function setting(layout: Layout, index: number): Point & { nx: number; ny: number } {
  const place = layout.places[index];
  const table = layout.tables[place.table];
  if (table.shape === "round") {
    const dx = place.x - table.cx;
    const dy = place.y - table.cy;
    const length = Math.hypot(dx, dy) || 1;
    return { x: table.cx + (dx / length) * (table.r - 18), y: table.cy + (dy / length) * (table.r - 18), nx: dx / length, ny: dy / length };
  }
  if (place.x > table.x + table.width) return { x: table.x + table.width - 22, y: place.y, nx: 1, ny: 0 };
  if (place.x < table.x) return { x: table.x + 22, y: place.y, nx: -1, ny: 0 };
  return { x: place.x, y: table.y + 22, nx: 0, ny: -1 };
}

/** A place setting: plate, fork on the left, knife on the right, as the guest sees it. */
function PlaceSetting({ x, y, nx, ny }: Point & { nx: number; ny: number }) {
  // The guest's left, seen from above, is the normal turned clockwise.
  const lx = -ny;
  const ly = nx;
  const piece = (side: number, length: number) => {
    const cx = x + lx * side * 19;
    const cy = y + ly * side * 19;
    return { x1: cx - nx * length, y1: cy - ny * length, x2: cx + nx * length, y2: cy + ny * length };
  };
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill={PAPER} stroke={INK} strokeWidth={1.2} />
      <circle cx={x} cy={y} r={8.2} fill="none" stroke={GREY} strokeWidth={1} />
      <line {...piece(1, 8)} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <line {...piece(-1, 8.5)} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

/* The twelve dishes, as tradition counts them. */
const DISHES = [BEET, PAPER, GREY, OCHRE, BEET, PAPER, INK, GREY, OCHRE, PAPER, BLUE, OCHRE];

function Dish({ x, y, color, i }: Point & { color: string; i: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={PAPER} stroke={INK} strokeWidth={1.1} />
      {i % 3 === 2 ? (
        <ellipse cx={x} cy={y} rx={7} ry={3.6} fill={color} transform={`rotate(${i * 37} ${x} ${y})`} />
      ) : (
        <circle cx={x} cy={y} r={6.4} fill={color} stroke={color === PAPER ? GREY : "none"} strokeWidth={0.8} />
      )}
    </g>
  );
}

function LongTable({ table }: { table: Extract<TableShape, { shape: "rect" }> }) {
  const { x, y, width, height } = table;
  // Hay under the cloth: a few straws that will not stay hidden.
  const straws = [];
  for (let at = y + 30; at < y + height - 10; at += 61) {
    straws.push(<path key={`l${at}`} d={`M${x - 7} ${at}L${x + 9} ${at + 6}M${x - 5} ${at + 9}L${x + 6} ${at + 7}`} />);
    straws.push(<path key={`r${at}`} d={`M${x + width + 7} ${at + 24}L${x + width - 9} ${at + 18}M${x + width + 6} ${at + 31}L${x + width - 6} ${at + 28}`} />);
  }
  const middle = x + width / 2;
  const top = y + 52;
  const step = (height - 108) / 5;
  return (
    <g>
      <g stroke={OCHRE} strokeWidth={1.6} strokeLinecap="round" fill="none">
        {straws}
      </g>
      <rect x={x} y={y} width={width} height={height} fill={CLOTH} stroke={INK} strokeWidth={1.5} />
      <rect x={x + 5} y={y + 5} width={width - 10} height={height - 10} fill="none" stroke={GREY} strokeWidth={0.8} strokeDasharray="2 3" />
      {/* Opłatek on its plate and the candle, at the foot of the table: the head may have a guest. */}
      <rect x={middle - 18} y={y + height - 36} width={22} height={15} fill={PAPER} stroke={INK} strokeWidth={1} />
      <path d={`M${middle - 15} ${y + height - 32}H${middle + 1}M${middle - 15} ${y + height - 28}H${middle + 1}M${middle - 15} ${y + height - 24}H${middle - 4}`} stroke={GREY} strokeWidth={0.8} />
      <circle cx={middle + 14} cy={y + height - 28} r={6} fill={RED} stroke={INK} strokeWidth={1} />
      <circle cx={middle + 14} cy={y + height - 28} r={2} fill={OCHRE} />
      {DISHES.map((color, i) => (
        <Dish key={i} i={i} color={color} x={middle + (i % 2 ? 15 : -15)} y={top + Math.floor(i / 2) * step} />
      ))}
    </g>
  );
}

function RoundTable({ table }: { table: Extract<TableShape, { shape: "round" }> }) {
  const { cx, cy, r } = table;
  const petals = [BLUE, OCHRE, RED, PAPER, BLUE, OCHRE];
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke={GREY} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r} fill={CLOTH} stroke={INK} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 6} fill="none" stroke={GREY} strokeWidth={0.8} strokeDasharray="2 3" />
      {/* The centrepiece: a low bouquet, and the bottle that is not to be opened before the toast. */}
      <circle cx={cx} cy={cy} r={15} fill="#4e8b5f" opacity={0.85} />
      {petals.map((color, i) => {
        const angle = (i * Math.PI * 2) / petals.length;
        return <circle key={i} cx={cx + Math.cos(angle) * 9} cy={cy + Math.sin(angle) * 9} r={4.4} fill={color} stroke={INK} strokeWidth={0.6} />;
      })}
      <circle cx={cx} cy={cy} r={3.4} fill={OCHRE} />
      <circle cx={cx + 26} cy={cy - 16} r={5.5} fill={PAPER} stroke={INK} strokeWidth={1} />
      <circle cx={cx + 26} cy={cy - 16} r={2.2} fill={INK} />
    </g>
  );
}

/** The wanderer's chair, from above: pulled out a little, nobody on it. */
export function EmptyChair({ x, y }: Point) {
  return (
    <g>
      <rect x={x - 19} y={y - 17} width={38} height={34} rx={5} fill={PAPER} stroke={INK} strokeWidth={1.3} strokeDasharray="4 3" />
      <rect x={x - 19} y={y + 11} width={38} height={6} rx={2} fill={GREY} />
    </g>
  );
}

/**
 * The tables, the settings and the red pencil between flashpoints. `marked` pairs are place indices.
 * The guests are drawn separately: as buttons on the page, as plates in images (`seats`).
 */
export function TableScene({
  layout,
  marked = [],
  seats,
}: {
  layout: Layout;
  marked?: [number, number][];
  /** For images: the species at each place, drawn as plates; null is the empty place. */
  seats?: (SpeciesKey | null)[];
}) {
  return (
    <g>
      {layout.tables.map((table, i) =>
        table.shape === "rect" ? <LongTable key={i} table={table} /> : <RoundTable key={i} table={table} />,
      )}
      {layout.places.map((_, i) => (
        <PlaceSetting key={i} {...setting(layout, i)} />
      ))}
      {marked.map(([a, b]) => {
        const from = setting(layout, a);
        const to = setting(layout, b);
        return (
          <g key={`${a}-${b}`}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={RED} strokeWidth={2.6} strokeDasharray="7 5" strokeLinecap="round" />
            <circle cx={from.x} cy={from.y} r={4} fill={RED} />
            <circle cx={to.x} cy={to.y} r={4} fill={RED} />
          </g>
        );
      })}
      {seats?.map((species, i) => <Guest key={i} place={layout.places[i]} species={species} />)}
    </g>
  );
}

/** A guest for generated images: the species plate centred on the place, or the empty chair. */
function Guest({ place, species }: { place: Place; species: SpeciesKey | null }) {
  if (!species) return <EmptyChair x={place.x} y={place.y} />;
  return (
    <svg x={place.x - SEAT_WIDTH / 2} y={place.y - SEAT_HEIGHT / 2} width={SEAT_WIDTH} height={SEAT_HEIGHT} viewBox="0 0 120 100">
      {plateDrawing(species)}
    </svg>
  );
}
