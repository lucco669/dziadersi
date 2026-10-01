"use client";

import { useEffect, useEffectEvent, useRef, useSyncExternalStore, type ReactNode } from "react";
import type { Task } from "@/content/test";
import { cx, typo } from "@/lib/typo";

export type TaskProps<T extends Task> = {
  task: T;
  proxy: boolean;
  /** The saved answer, when coming back to a task. */
  value: number | undefined;
  /** Per-respondent seed for the order of options. */
  seed: number;
  onAnswer: (value: number) => void;
};

export const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

/** Small seeded generator (mulberry32), so a reload shows the same order. */
export function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let r = Math.imul(state ^ (state >>> 15), 1 | state);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Options in a per-respondent order: the dziaderski answer is never always the last one. */
export function shuffled(count: number, seed: number) {
  const next = random(seed);
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Timeouts that are cleared when the task unmounts. */
export function useLater() {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  return (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
}

/** Keyboard shortcuts while a task is on screen; typing in a field is left alone. */
export function useKeys(handler: (key: string, event: KeyboardEvent) => void, active = true) {
  const onKey = useEffectEvent((event: KeyboardEvent) => handler(event.key.toLowerCase(), event));
  useEffect(() => {
    if (!active) return;
    const listener = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.target instanceof HTMLInputElement) return;
      onKey(event);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [active]);
}

const noSubscription = () => () => {};

/** Readers who asked for less motion get no countdowns. */
export function useReducedMotion() {
  return useSyncExternalStore(
    noSubscription,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** The index of a pressed key among 1–9 or a–i, or -1. */
export function keyIndex(key: string) {
  if (/^[1-9]$/.test(key)) return Number(key) - 1;
  const letter = "abcdefghi".indexOf(key);
  return key.length === 1 ? letter : -1;
}

/** Form checkbox; a chosen answer gets crossed out in ink. */
export function Box({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={cx("relative size-6 shrink-0 border-[1.5px] border-ink bg-card md:size-7", className)}>
      {checked && (
        <svg viewBox="0 0 24 24" className="absolute -inset-1.5 overflow-visible text-red" fill="none" stroke="currentColor">
          <path
            d="M4.5 5.2C9.2 9.8 13.8 14.6 19.6 19.4"
            pathLength={1}
            strokeWidth="2.6"
            strokeLinecap="round"
            className="animate-draw [stroke-dasharray:1]"
          />
          <path
            d="M19.2 4.6C14.6 9.6 9.8 14.4 4.8 19.6"
            pathLength={1}
            strokeWidth="2.6"
            strokeLinecap="round"
            className="animate-draw [stroke-dasharray:1] [animation-delay:120ms]"
          />
        </svg>
      )}
    </span>
  );
}

export function Check({ className = "inline size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2.5 8.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A row on a hairline: letter, text and the checkbox. Used by every list of answers. */
export function AnswerRow({
  letter,
  checked,
  onClick,
  children,
}: {
  letter: string;
  checked: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onClick}
      className={cx(
        "grid w-full grid-cols-[2rem_1fr_1.75rem] items-center gap-4 border-b border-rule py-4 pr-1 text-left transition-colors md:grid-cols-[3rem_1fr_2rem] md:py-5",
        checked ? "bg-red/[0.06]" : "hover:bg-paper-deep",
      )}
    >
      <span className="pl-1 font-sans text-[0.9rem] font-semibold text-ink-soft">{letter}</span>
      <span className="text-lg leading-snug md:text-xl">{typeof children === "string" ? typo(children) : children}</span>
      <Box checked={checked} className="justify-self-end" />
    </button>
  );
}

/** A countdown drawn as a draining hairline. Restart it with a new `key`. */
export function Countdown({ seconds, late }: { seconds: number; late: boolean }) {
  return (
    <div className="h-1 w-full bg-ink/10" aria-hidden="true">
      <div
        className={cx("h-full origin-left animate-drain", late ? "bg-red" : "bg-ink")}
        style={{ animationDuration: `${seconds}s` }}
      />
    </div>
  );
}

/** "Dalej" after a task that shows its outcome first. */
export function NextButton({ onClick, label = "Dalej" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} autoFocus className="btn bg-ink text-paper hover:bg-red">
      {label} <span aria-hidden="true">→</span>
    </button>
  );
}
