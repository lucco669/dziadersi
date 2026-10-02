import { OCCASIONS, type Occasion } from "@/content/bingo";
import { shuffled } from "./random";

/*
 * A card code is the occasion slug and a five-character base36 seed: "wesele-3k9fz".
 * The seed picks 24 squares from the pool; the centre is free.
 */

export const CARD_SIZE = 25;
export const CENTRE = 12;
const SEED_LENGTH = 5;
const SEEDS = 36 ** SEED_LENGTH;
const CODE = /^([a-z-]+)-([0-9a-z]{5})$/;

export type Card = {
  code: string;
  occasion: Occasion;
  seed: number;
  /** "3K9FZ": printed on the card. */
  number: string;
  /** 25 squares, row by row; the centre is empty and stands for the free square. */
  squares: string[];
};

/** Rows, columns and both diagonals, as square indices. */
export const LINES: number[][] = [
  ...[0, 1, 2, 3, 4].map((row) => [0, 1, 2, 3, 4].map((col) => row * 5 + col)),
  ...[0, 1, 2, 3, 4].map((col) => [0, 1, 2, 3, 4].map((row) => row * 5 + col)),
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const seedCode = (seed: number) => (((seed % SEEDS) + SEEDS) % SEEDS).toString(36).padStart(SEED_LENGTH, "0");

export function card(occasion: Occasion, seed: number): Card {
  const code = seedCode(seed);
  const picked = shuffled(occasion.squares.length, seed).slice(0, CARD_SIZE - 1);
  const squares = picked.map((index) => occasion.squares[index]);
  squares.splice(CENTRE, 0, "");
  return { code: `${occasion.slug}-${code}`, occasion, seed: parseInt(code, 36), number: code.toUpperCase(), squares };
}

export function decodeCard(code: string): Card | null {
  const match = CODE.exec(code);
  if (!match) return null;
  const occasion = OCCASIONS.find((item) => item.slug === match[1]);
  return occasion ? card(occasion, parseInt(match[2], 36)) : null;
}

export const randomSeed = () => Math.floor(Math.random() * SEEDS);

/** The next cards in the same series, for printing a set for one table. */
export const series = (first: Card, count: number) =>
  Array.from({ length: count }, (_, i) => card(first.occasion, (first.seed + i * 7_919) % SEEDS));

/** The sample card of each occasion: prerendered, shown on the index page. */
export const sampleCard = (occasion: Occasion) => card(occasion, 1_000_003 + OCCASIONS.indexOf(occasion) * 104_729);
