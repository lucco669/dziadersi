"use client";

import { useEffect, useEffectEvent, useRef, useSyncExternalStore } from "react";

/** Timeouts that are cleared when the component unmounts. */
export function useLater() {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  return (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
}

/** Keyboard shortcuts while the component is on screen; typing in a field is left alone. */
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

/** Readers who asked for less motion get no countdowns and no spinning reels. */
export function useReducedMotion() {
  return useSyncExternalStore(
    noSubscription,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
