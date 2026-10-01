"use client";

import { useEffect, useEffectEvent, useState } from "react";
import type { RapidTask } from "@/content/test";
import { packBits } from "@/lib/test";
import { cx, typo } from "@/lib/typo";
import { Countdown, useKeys, useLater, useReducedMotion, type TaskProps } from "./shared";

/** Ten statements against the clock. Silence counts as consent. */
export function RapidView({ task, onAnswer }: TaskProps<RapidTask>) {
  const [phase, setPhase] = useState<"ready" | "running" | "done">("ready");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [flash, setFlash] = useState<"tak" | "nie" | "cisza" | null>(null);
  const reduced = useReducedMotion();
  const later = useLater();
  const total = task.statements.length;

  function answer(yes: boolean, silent = false) {
    if (phase !== "running" || flash) return;
    const next = [...answers, yes];
    setAnswers(next);
    setFlash(silent ? "cisza" : yes ? "tak" : "nie");
    later(silent ? 900 : 260, () => {
      setFlash(null);
      if (next.length >= total) {
        setPhase("done");
        later(1300, () => onAnswer(packBits(next)));
      } else {
        setIndex(next.length);
      }
    });
  }

  // The clock: no answer in time is a yes.
  const silence = useEffectEvent(() => answer(true, true));
  useEffect(() => {
    if (phase !== "running" || reduced || flash) return;
    const id = window.setTimeout(silence, task.seconds * 1000);
    return () => window.clearTimeout(id);
  }, [phase, index, reduced, flash, task.seconds]);

  useKeys((key, event) => {
    if (phase === "ready" && key === "enter" && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
      setPhase("running");
    }
    if (phase !== "running") return;
    if (key === "t" || key === "1" || key === "arrowleft") {
      event.preventDefault();
      answer(true);
    } else if (key === "n" || key === "2" || key === "arrowright") {
      event.preventDefault();
      answer(false);
    }
  });

  if (phase === "ready") {
    return (
      <div className="max-w-2xl">
        <p className="text-[clamp(1.3rem,2.2vw,1.6rem)] leading-snug">
          {typo(
            reduced
              ? `${total} stwierdzeń. Odpowiadaj TAK albo NIE, bez zastanowienia.`
              : `${total} stwierdzeń, ${task.seconds} sekund na każde. Odpowiadaj TAK albo NIE, bez zastanowienia. Milczenie oznacza zgodę.`,
          )}
        </p>
        <button type="button" onClick={() => setPhase("running")} autoFocus className="btn mt-8 bg-ink text-paper hover:bg-red">
          Start serii <span aria-hidden="true">→</span>
        </button>
        <p className="label mt-4 text-ink-faint">Klawisze: T albo ← to TAK, N albo → to NIE.</p>
      </div>
    );
  }

  if (phase === "done") {
    const yes = answers.filter(Boolean).length;
    return (
      <div className="max-w-2xl animate-question-in" role="status">
        <p className="label text-ink-soft">Seria zakończona</p>
        <p className="mt-3 text-[clamp(2.4rem,6vw,4rem)] font-bold leading-none tabular-nums">
          {yes} × TAK <span className="text-ink-faint">na {total}</span>
        </p>
      </div>
    );
  }

  const statement = task.statements[index];
  return (
    <div className="mx-auto max-w-3xl">
      <p className="label flex justify-between text-ink-soft">
        <span>
          {index + 1} / {total}
        </span>
        <span className={cx("text-red transition-opacity", flash === "cisza" ? "opacity-100" : "opacity-0")} aria-live="polite">
          {flash === "cisza" ? "Milczenie oznacza zgodę." : ""}
        </span>
      </p>
      <div key={index} className="animate-question-in">
        <p className="mt-6 min-h-[2.3em] text-[clamp(1.9rem,4.4vw,3rem)] font-bold leading-[1.1] tracking-[-0.01em]" aria-live="polite">
          {typo(statement.text)}
        </p>
        <div className="mt-8">{!reduced && <Countdown key={index} seconds={task.seconds} late={false} />}</div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => answer(true)}
          className={cx(
            "py-6 font-sans text-2xl font-bold tracking-[0.12em] transition-colors",
            flash === "tak" || flash === "cisza" ? "bg-red text-paper" : "bg-ink text-paper hover:bg-red",
          )}
        >
          TAK
        </button>
        <button
          type="button"
          onClick={() => answer(false)}
          className={cx(
            "border-[1.5px] border-ink py-6 font-sans text-2xl font-bold tracking-[0.12em] transition-colors",
            flash === "nie" ? "bg-ink text-paper" : "hover:bg-paper-deep",
          )}
        >
          NIE
        </button>
      </div>
      <ol className="mt-6 flex gap-1.5" aria-hidden="true">
        {task.statements.map((item, i) => (
          <li
            key={item.text}
            className={cx("h-1.5 flex-1", i < answers.length ? (answers[i] ? "bg-red" : "bg-ink") : i === index ? "bg-ink/40" : "bg-ink/10")}
          />
        ))}
      </ol>
    </div>
  );
}
