"use client";

import type { ReactNode } from "react";
import type { Task } from "@/content/test";
import { cx, typo } from "@/lib/typo";

export type TaskProps<T extends Task> = {
  task: T;
  proxy: boolean;
  /** The saved answer, when coming back to a task. */
  value: number | undefined;
  /** Per-respondent seed for the order of options. */
  seed: number;
  /** Remove answer deadlines without changing the frozen scoring format. */
  untimed?: boolean;
  onAnswer: (value: number) => void;
};

export const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export { shuffled } from "@/lib/random";
export { useKeys, useLater, useReducedMotion } from "../hooks";

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
