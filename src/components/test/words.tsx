"use client";

import { useEffect, useMemo, useState } from "react";
import type { WordsTask } from "@/content/test";
import { packWords } from "@/lib/test";
import { cx } from "@/lib/typo";
import { Countdown, keyIndex, LETTERS, shuffled, useKeys, useLater, useReducedMotion, type TaskProps } from "./shared";

const SECONDS = 5;

/** Word association: one word at a time, a few seconds each. Hesitation is noted, not punished. */
export function WordsView({ task, seed, onAnswer, untimed }: TaskProps<WordsTask>) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [late, setLate] = useState(false);
  const reducedMotion = useReducedMotion();
  const reduced = reducedMotion || untimed;
  const later = useLater();
  const word = task.words[index];
  const order = useMemo(() => shuffled(word.options.length, seed + index * 31), [word.options.length, seed, index]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setLate(true), SECONDS * 1000);
    return () => window.clearTimeout(id);
  }, [index, reduced]);

  function choose(option: number) {
    if (chosen !== null) return;
    setChosen(option);
    const next = [...picked];
    next[index] = option;
    later(380, () => {
      if (index + 1 < task.words.length) {
        setPicked(next);
        setIndex(index + 1);
        setChosen(null);
        setLate(false);
      } else {
        onAnswer(packWords(task, next));
      }
    });
  }

  useKeys((key, event) => {
    const position = keyIndex(key);
    if (position >= 0 && position < order.length) {
      event.preventDefault();
      choose(order[position]);
    }
  });

  return (
    <div className="mx-auto max-w-2xl">
      <p className="label flex justify-between text-ink-soft" aria-live="polite">
        <span>
          Słowo {index + 1} z {task.words.length}
        </span>
        <span className={cx("transition-opacity", late ? "text-red opacity-100" : "opacity-0")}>{late ? "Instytut odnotował wahanie." : ""}</span>
      </p>
      <div key={index} className="animate-question-in">
        <p className="mt-6 text-center text-[clamp(3.5rem,13vw,7.5rem)] font-bold uppercase leading-none tracking-[0.04em]">
          {word.word}
        </p>
        <div className="mt-8">{!reduced && <Countdown key={index} seconds={SECONDS} late={late} />}</div>
        <div role="group" aria-label={`Skojarzenie ze słowem ${word.word}`} className="mt-8 grid gap-3 sm:grid-cols-2">
          {order.map((option, position) => (
            <button
              key={option}
              type="button"
              aria-pressed={chosen === option}
              onClick={() => choose(option)}
              className={cx(
                "flex items-center gap-4 border-[1.5px] border-ink px-4 py-4 text-left text-lg leading-snug transition-colors md:text-xl",
                chosen === option ? "bg-ink text-paper" : "hover:bg-paper-deep",
                chosen !== null && chosen !== option && "opacity-30",
              )}
            >
              <span className={cx("font-sans text-[0.9rem] font-semibold", chosen === option ? "text-paper/60" : "text-ink-soft")}>
                {LETTERS[position]}
              </span>
              {word.options[option].text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
