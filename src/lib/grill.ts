import { random } from "./random";

export const GRILL_SECONDS = 90;
export const GRILL_SLOTS = 6;
export const PERFECT_WINDOW = 1.25;

export type Sausage = { id: number; sides: [number, number]; side: 0 | 1; target: number; burnAt: number };
export type GrillHazard = { kind: "wasp" | "tongs"; left: number; x: number; y: number };
export type GrillNotice = "loaded" | "flip" | "perfectFlip" | "served" | "perfect" | "raw" | "burnt" | "wasp" | "defended" | "stung" | "stolen";
export type GrillState = {
  seed: number; elapsed: number; status: "playing" | "finished";
  slots: (Sausage | null)[]; batch: number; score: number; served: number; perfect: number;
  burnt: number; raw: number; combo: number; bestCombo: number; smoke: number;
  swatted: number; defended: number; hazard: GrillHazard | null; event: number; nextEvent: number;
  locked: number; notice: { kind: GrillNotice; points: number; serial: number } | null;
};

const clamp = (n: number, low = 0, high = 100) => Math.min(high, Math.max(low, n));
const round = (n: number) => Math.round(n * 10000) / 10000;
export const grillPhase = (state: GrillState) => Math.min(2, Math.floor(state.elapsed / 30));
export const grillHeat = (state: GrillState) => [1, 1.18, 1.38][grillPhase(state)];
export const sausageBurnt = (sausage: Sausage) => Math.max(...sausage.sides) >= sausage.burnAt;
export const sideReady = (sausage: Sausage) => sausage.sides[sausage.side] >= sausage.target;
export const sidePerfect = (sausage: Sausage, side: 0 | 1) => sausage.sides[side] >= sausage.target && sausage.sides[side] <= sausage.target + PERFECT_WINDOW;

function makeSausage(seed: number, id: number): Sausage {
  const next = random((seed + Math.imul(id + 1, 2654435761)) >>> 0);
  const target = round(4.8 + next() * 1.5);
  return { id, sides: [0, 0], side: 0, target, burnAt: target + 3.2 };
}

export function newGrill(seed: number): GrillState {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error("Invalid grill seed");
  return {
    seed, elapsed: 0, status: "playing", slots: Array.from({ length: GRILL_SLOTS }, (_, i) => i < 3 ? makeSausage(seed, i) : null),
    batch: 3, score: 0, served: 0, perfect: 0, burnt: 0, raw: 0, combo: 0, bestCombo: 0, smoke: 0,
    swatted: 0, defended: 0, hazard: null, event: 0, nextEvent: 16, locked: 0, notice: null,
  };
}

function notify(state: GrillState, kind: GrillNotice, points = 0): GrillState {
  return { ...state, notice: { kind, points, serial: (state.notice?.serial ?? 0) + 1 } };
}

/** One tap loads, flips, serves or clears a sausage. Each side really cooks independently. */
export function tapGrill(state: GrillState, slot: number): GrillState {
  if (state.status !== "playing" || state.locked > 0 || !Number.isInteger(slot) || slot < 0 || slot >= GRILL_SLOTS) return state;
  const sausage = state.slots[slot];
  const slots = [...state.slots];
  if (!sausage) {
    slots[slot] = makeSausage(state.seed, state.batch);
    return notify({ ...state, slots, batch: state.batch + 1 }, "loaded");
  }
  if (sausageBurnt(sausage)) {
    slots[slot] = null;
    return notify({ ...state, slots, burnt: state.burnt + 1, combo: 0, score: Math.max(0, state.score - 30), smoke: clamp(state.smoke + 9) }, "burnt", -30);
  }
  if (sausage.side === 0) {
    slots[slot] = { ...sausage, sides: [...sausage.sides], side: 1 };
    return notify({ ...state, slots }, sidePerfect(sausage, 0) ? "perfectFlip" : "flip");
  }
  slots[slot] = null;
  if (Math.min(...sausage.sides) < sausage.target) {
    return notify({ ...state, slots, raw: state.raw + 1, combo: 0, score: Math.max(0, state.score - 25), smoke: clamp(state.smoke + 3) }, "raw", -25);
  }
  const perfect = sidePerfect(sausage, 0) && sidePerfect(sausage, 1);
  const combo = perfect ? state.combo + 1 : 0;
  const points = perfect ? 100 + Math.min(combo - 1, 4) * 25 : 65;
  return notify({ ...state, slots, served: state.served + 1, perfect: state.perfect + Number(perfect), combo, bestCombo: Math.max(state.bestCombo, combo), score: state.score + points, smoke: clamp(state.smoke - 4) }, perfect ? "perfect" : "served", points);
}

export function dismissGrillHazard(state: GrillState): GrillState {
  if (state.status !== "playing" || !state.hazard) return state;
  const wasp = state.hazard.kind === "wasp";
  return notify({ ...state, hazard: null, score: state.score + 25, swatted: state.swatted + Number(wasp), defended: state.defended + Number(!wasp) }, wasp ? "wasp" : "defended", 25);
}

function step(state: GrillState, seconds: number): GrillState {
  const elapsed = round(Math.min(GRILL_SECONDS, state.elapsed + seconds));
  const heat = grillHeat(state);
  const slots = state.slots.map((sausage) => {
    if (!sausage) return null;
    const sides: [number, number] = [...sausage.sides];
    sides[sausage.side] = round(sides[sausage.side] + seconds * heat);
    return { ...sausage, sides };
  });
  const burned = slots.filter((sausage) => sausage && sausageBurnt(sausage)).length;
  let next: GrillState = { ...state, elapsed, slots, locked: round(Math.max(0, state.locked - seconds)), smoke: clamp(state.smoke + seconds * (burned ? burned * 1.6 : -0.5)) };
  if (state.hazard) {
    const left = round(state.hazard.left - seconds);
    if (left > 0) next.hazard = { ...state.hazard, left };
    else {
      const wasp = state.hazard.kind === "wasp";
      next = notify({ ...next, hazard: null, combo: 0, smoke: clamp(next.smoke + (wasp ? 7 : 4)), locked: wasp ? next.locked : 2.5, score: Math.max(0, next.score - 20) }, wasp ? "stung" : "stolen", -20);
    }
  }
  if (!next.hazard && elapsed >= next.nextEvent && elapsed < GRILL_SECONDS - 6) {
    const nextRandom = random((state.seed + Math.imul(next.event + 1, 2246822519)) >>> 0);
    next.hazard = { kind: next.event % 2 ? "tongs" : "wasp", left: 5, x: 15 + nextRandom() * 70, y: 20 + nextRandom() * 55 };
    next.event += 1;
    next.nextEvent = elapsed + 11 + nextRandom() * 5;
  }
  if (elapsed >= GRILL_SECONDS || next.smoke >= 100) next = { ...next, status: "finished", hazard: null, locked: 0, burnt: next.burnt + burned };
  return next;
}

/** Bounded integration keeps long frames from skipping cooking and hazard deadlines. */
export function advanceGrill(state: GrillState, seconds: number): GrillState {
  if (state.status !== "playing" || !Number.isFinite(seconds) || seconds <= 0) return state;
  let next = state;
  let remaining = Math.min(seconds, GRILL_SECONDS);
  while (remaining > 0.00001 && next.status === "playing") {
    const delta = Math.min(0.1, remaining, GRILL_SECONDS - next.elapsed);
    next = step(next, delta);
    remaining = round(remaining - delta);
  }
  return next;
}

export type GrillRank = "king" | "master" | "apprentice" | "smoke";
export const grillRank = (state: GrillState): GrillRank => state.smoke >= 100 ? "smoke" : state.served >= 24 && state.perfect >= 12 ? "king" : state.served >= 12 ? "master" : "apprentice";

export function dailyGrillSeed(date = new Date()): number {
  const key = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  return [...key].reduce((seed, char) => Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261);
}

export function readGrillBest(value: string | null): number {
  if (!value || !/^\d{1,7}$/.test(value)) return 0;
  const score = Number(value);
  return score <= 1000000 ? score : 0;
}
