"use client";

import { useEffect, useRef, useState } from "react";
import { useLater, useReducedMotion } from "./hooks";

const REEL_MS = [420, 700, 980];
const TICK_MS = 70;

type Picks = [number, number, number];

/**
 * Three reels of whole sentences, as in the Rozmówki and the Życzenia: `picks` is the result,
 * `shown` what the reels display while they spin. Reels stop left to right; a held reel doesn't spin.
 * Readers who asked for less motion get the result at once.
 */
export function useReels<P extends Picks>(initial: P) {
  const [picks, setPicks] = useState<P>(initial);
  const [shown, setShown] = useState<P>(initial);
  const [rolling, setRolling] = useState([false, false, false]);
  const [held, setHeld] = useState([false, false, false]);
  const timers = useRef<number[]>([]);
  const later = useLater();
  const reduced = useReducedMotion();
  const busy = rolling.some(Boolean);

  useEffect(() => () => timers.current.forEach((id) => window.clearInterval(id)), []);

  /** Spins to `target`; `lengths` are the lists' sizes, `keep` the reels that stay put. */
  function spin(target: P, lengths: readonly number[], keep: readonly boolean[] = [false, false, false]) {
    timers.current.forEach((id) => window.clearInterval(id));
    timers.current = [];
    setPicks(target);
    if (reduced) {
      setShown(target);
      setRolling([false, false, false]);
      return;
    }
    const spinning = target.map((_, i) => !keep[i]);
    setRolling(spinning);
    spinning.forEach((spinsNow, i) => {
      if (!spinsNow) return;
      const id = window.setInterval(() => {
        setShown((now) => {
          const copy = [...now] as P;
          copy[i] = Math.floor(Math.random() * lengths[i]);
          return copy;
        });
      }, TICK_MS);
      timers.current.push(id);
      later(REEL_MS[i], () => {
        window.clearInterval(id);
        setShown((now) => {
          const copy = [...now] as P;
          copy[i] = target[i];
          return copy;
        });
        setRolling((now) => now.map((value, j) => (j === i ? false : value)));
      });
    });
  }

  /** New random picks for every reel that isn't held. */
  function roll(lengths: readonly number[], keep: readonly boolean[] = held) {
    if (busy) return null;
    const target = lengths.map((length, i) => (keep[i] ? picks[i] : Math.floor(Math.random() * length))) as P;
    spin(target, lengths, keep);
    return target;
  }

  const toggleHold = (i: number) => setHeld((now) => now.map((value, j) => (j === i ? !value : value)));
  const release = () => setHeld([false, false, false]);

  return { picks, shown, rolling, busy, held, spin, roll, toggleHold, release };
}
