import { QUEUE_EVENTS, type QueueEffect } from "@/content/queue";

export const QUEUE_VERSION = 1;
export const OFFICE_MINUTES = 40;
export const INITIAL_AHEAD = 9;
export type QueueAction = 0 | 1 | 2 | "manager";
export type QueueStatus = "playing" | "served" | "closed" | "walked";
export type QueueState = {
  seed: number;
  actions: QueueAction[];
  ahead: number;
  minutes: number;
  irritation: number;
  authority: number;
  managerUsed: boolean;
  status: QueueStatus;
};
export const MANAGER_EFFECTS: readonly QueueEffect[] = [
  { minutes: 4, advance: 3, irritation: -10, authority: 5 },
  { minutes: 6, advance: 1, irritation: 10, authority: -5 },
  { minutes: 8, advance: 0, irritation: 15, authority: 10 },
];

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n));
export const validSeed = (seed: unknown): seed is number => typeof seed === "number" && Number.isInteger(seed) && seed > 0 && seed <= 0xffffffff;

export function newQueue(seed: number): QueueState {
  if (!validSeed(seed)) throw new Error("Invalid queue seed");
  return { seed, actions: [], ahead: INITIAL_AHEAD, minutes: OFFICE_MINUTES, irritation: 20, authority: 35, managerUsed: false, status: "playing" };
}

/** Local PRNG: identical encounters in both editions and when replaying a challenge. */
export function queueDeck(seed: number): number[] {
  let value = seed >>> 0;
  const deck = QUEUE_EVENTS.map((_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    const j = value % (i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export const queueEventIndex = (state: QueueState) => queueDeck(state.seed)[state.actions.length % QUEUE_EVENTS.length];
export const managerOutcome = (state: QueueState) => ((state.seed % 3) + (state.actions.length % 3)) % 3;
export function actionEffect(state: QueueState, action: QueueAction): QueueEffect {
  return action === "manager" ? MANAGER_EFFECTS[managerOutcome(state)] : QUEUE_EVENTS[queueEventIndex(state)].choices[action].effect;
}

export function canChoose(state: QueueState, action: QueueAction): boolean {
  if (state.status !== "playing" || (action !== "manager" && action !== 0 && action !== 1 && action !== 2)) return false;
  if (action === "manager") return !state.managerUsed;
  return state.authority + actionEffect(state, action).authority >= 0;
}

export function chooseQueue(state: QueueState, action: QueueAction): QueueState {
  if (!canChoose(state, action)) return state;
  const effect = actionEffect(state, action);
  const minutes = clamp(state.minutes - effect.minutes, OFFICE_MINUTES);
  const irritation = clamp(state.irritation + effect.irritation, 100);
  const ahead = clamp(state.ahead - effect.advance, 20);
  // Closing and losing composure take precedence, even on the last step to the counter.
  const status: QueueStatus = irritation === 100 ? "walked" : minutes === 0 ? "closed" : ahead === 0 ? "served" : "playing";
  return { ...state, minutes, irritation, ahead, authority: clamp(state.authority + effect.authority, 100), actions: [...state.actions, action], managerUsed: state.managerUsed || action === "manager", status };
}

export const queueScore = (state: QueueState) => Math.max(0, (state.status === "served" ? 500 : 0) + (INITIAL_AHEAD - state.ahead) * 25 + state.minutes * 5 + (100 - state.irritation) * 2 + state.authority);
export const queueCode = (seed: number) => `1.${seed.toString(36)}`;
export function parseQueueCode(code: string | null): number | null {
  if (!code || !/^1\.[0-9a-z]{1,7}$/.test(code)) return null;
  const seed = parseInt(code.slice(2), 36);
  return validSeed(seed) && queueCode(seed) === code ? seed : null;
}

/** Warsaw's date, independently of the device's timezone. No dates or identity are stored. */
export function dailyQueueSeed(date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return Number(`${part("year")}${part("month")}${part("day")}`);
}

/** Persist only the seed and decisions; all statistics are reconstructed and validated. */
export const saveQueue = (state: QueueState) => JSON.stringify({ version: QUEUE_VERSION, seed: state.seed, actions: state.actions });
export function restoreQueue(raw: string | null): QueueState | null {
  if (!raw || raw.length > 2000) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== QUEUE_VERSION || !validSeed(data.seed) || !Array.isArray(data.actions) || data.actions.length > 24) return null;
    let state = newQueue(data.seed);
    for (const action of data.actions) {
      if (!canChoose(state, action)) return null;
      state = chooseQueue(state, action);
    }
    return state;
  } catch { return null; }
}

export function previousQueue(state: QueueState): QueueState | null {
  if (!state.actions.length) return null;
  return restoreQueue(JSON.stringify({ version: QUEUE_VERSION, seed: state.seed, actions: state.actions.slice(0, -1) }));
}
