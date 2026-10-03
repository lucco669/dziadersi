"use client";

import { useEffect, useRef, useState } from "react";
import type { ReflexTask } from "@/content/test";
import { formatSeconds, read, reflexOutcome, reflexValue } from "@/lib/test";
import { cx, typo } from "@/lib/typo";
import { Stamp } from "../brand";
import { BLUE, GREY, INK, OCHRE, PAPER, RED } from "../pictograms";
import { NextButton, useKeys, type TaskProps } from "./shared";
import { tally } from "@/lib/tally";

type Phase = "ready" | "red" | "amber" | "green" | "done";

// The one green in the Institute's palette: a traffic light needs it.
const GREEN = "#4e8b5f";
const UNLIT = "#3a3733";
const PATIENCE_MS = 5000;

const STATUS: Record<Phase, string> = {
  ready: "Światła wyłączone. Próba zaczyna się po naciśnięciu przycisku.",
  red: "Czerwone. Czekaj na zielone.",
  amber: "Czerwone i żółte.",
  green: "Zielone. Samochód przed tobą stoi.",
  done: "",
};

/** A short two-tone car horn, only ever played in response to a press. */
function honk() {
  tally("klakson");
  try {
    const context = new AudioContext();
    const now = context.currentTime;
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    gain.gain.setValueAtTime(0.07, now + 0.32);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    filter.connect(gain).connect(context.destination);
    for (const frequency of [392, 494]) {
      const oscillator = context.createOscillator();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      oscillator.connect(filter);
      oscillator.start(now);
      oscillator.stop(now + 0.45);
    }
    window.setTimeout(() => context.close(), 700);
  } catch {
    // No audio: the test works in silence.
  }
}

/** The horn test: wait for green, then honk at the car that doesn't move. */
export function ReflexView({ task, onAnswer, untimed }: TaskProps<ReflexTask>) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [value, setValue] = useState<number | null>(null);
  const [honked, setHonked] = useState(false);
  const green = useRef(0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clear, []);

  function start() {
    setPhase("red");
    const red = 1600 + Math.random() * 1800;
    timers.current.push(
      window.setTimeout(() => setPhase("amber"), red),
      window.setTimeout(() => {
        green.current = performance.now();
        setPhase("green");
      }, red + 1000),
      ...(!untimed ? [window.setTimeout(() => finish(reflexValue("none"), false), red + 1000 + PATIENCE_MS)] : []),
    );
  }

  function finish(result: number, horn: boolean) {
    clear();
    setValue(result);
    setHonked(horn);
    setPhase("done");
  }

  function press() {
    if (phase === "red" || phase === "amber" || phase === "green") {
      honk();
      finish(
        phase === "green" ? reflexValue(performance.now() - green.current) : reflexValue(phase === "red" ? "red" : "amber"),
        true,
      );
    }
  }

  useKeys((key, event) => {
    if (key !== " " && key !== "enter") return;
    if (event.target instanceof HTMLButtonElement && (phase === "ready" || phase === "done")) return;
    event.preventDefault();
    if (phase === "ready") start();
    else if (phase === "done") next();
    else press();
  });

  const outcome = value === null ? null : reflexOutcome(value);
  const verdict = value === null ? null : read(task, value);
  const falstart = outcome?.outcome === "red" || outcome?.outcome === "amber";

  function next() {
    if (value !== null) onAnswer(value);
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <figure className="relative border border-ink bg-card">
        <svg viewBox="0 0 400 240" className="block w-full" role="img" aria-label="Skrzyżowanie: samochód przed tobą i sygnalizator">
          <rect x={0} y={168} width={400} height={72} fill={GREY} />
          <g stroke={PAPER} strokeWidth={4} strokeDasharray="18 16">
            <line x1={60} y1={232} x2={84} y2={176} />
            <line x1={340} y1={232} x2={316} y2={176} />
          </g>
          <line x1={0} y1={168} x2={400} y2={168} stroke={INK} strokeWidth={1.4} />

          <g className={cx(outcome?.outcome === "none" && "animate-drive-away")}>
            <path d="M148 104L163 62H237L252 104Z" fill={BLUE} />
            <path d="M157 100L168 68H232L243 100Z" fill={PAPER} opacity={0.88} />
            <circle cx={200} cy={88} r={10} fill={INK} />
            <path d="M189.4 82.6A10.6 10.6 0 0 1 210.6 82.6Z" fill={RED} />
            <path d="M189 82H214C214 84 213 85 211 85H189Z" fill={RED} />
            <rect x={122} y={100} width={156} height={56} rx={7} fill={BLUE} />
            <rect x={128} y={110} width={24} height={13} rx={2} fill={RED} />
            <rect x={248} y={110} width={24} height={13} rx={2} fill={RED} />
            <rect x={176} y={128} width={48} height={14} fill={PAPER} stroke={INK} strokeWidth={1} />
            <text x={200} y={138.6} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={INK} style={{ fontFamily: "var(--font-schibsted)" }}>
              WZ 1974
            </text>
            <rect x={116} y={152} width={168} height={9} rx={2} fill={INK} />
            <rect x={132} y={160} width={24} height={16} rx={2} fill={INK} />
            <rect x={244} y={160} width={24} height={16} rx={2} fill={INK} />
          </g>

          <rect x={346} y={60} width={6} height={180} fill={INK} />
          <rect x={328} y={10} width={42} height={112} rx={5} fill={INK} />
          <circle cx={349} cy={30} r={12} fill={phase === "red" || phase === "amber" ? RED : UNLIT} />
          <circle cx={349} cy={64} r={12} fill={phase === "amber" ? OCHRE : UNLIT} />
          <circle cx={349} cy={98} r={12} fill={phase === "green" || (phase === "done" && !falstart) ? GREEN : UNLIT} />

          {honked && (
            <g className="animate-honk" fill="none" stroke={RED} strokeWidth={3} strokeLinecap="round">
              <path d="M172 214Q200 198 228 214" />
              <path d="M156 226Q200 190 244 226" opacity={0.7} />
              <path d="M140 238Q200 182 260 238" opacity={0.4} />
            </g>
          )}
        </svg>
        {falstart && (
          <Stamp className="absolute left-4 top-4 animate-stamp bg-card/80 text-[0.95rem] [--stamp-rotate:-8deg]">Falstart</Stamp>
        )}
      </figure>

      <div>
        <p className="label text-ink-soft" aria-live="polite">
          {phase === "done" && outcome ? (outcome.seconds !== undefined && !falstart && outcome.outcome !== "none" ? `Czas reakcji: ${formatSeconds(outcome.seconds)}` : "Próba zakończona") : STATUS[phase]}
        </p>

        {phase === "ready" && (
          <>
            <p className="mt-4 max-w-md text-lg leading-snug">
              {typo("Trąbić klawiszem spacji albo przyciskiem. Instytut nie przewiduje drugiej próby.")}
            </p>
            <button type="button" onClick={start} autoFocus className="btn mt-8 bg-ink text-paper hover:bg-red">
              Rozpocznij próbę <span aria-hidden="true">→</span>
            </button>
          </>
        )}

        {(phase === "red" || phase === "amber" || phase === "green") && (
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              press();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") event.preventDefault();
            }}
            className="mt-6 flex w-full max-w-sm select-none items-center justify-center gap-4 bg-red px-6 py-8 font-sans text-3xl font-bold uppercase tracking-[0.12em] text-paper transition-transform active:scale-[0.98]"
          >
            <HornIcon />
            Trąb
          </button>
        )}

        {phase === "done" && verdict && (
          <div className="animate-question-in">
            <p className="mt-4 text-[clamp(1.6rem,3.2vw,2.2rem)] font-bold leading-tight">{typo(verdict.answer.replace(/^[\d,]+ s\. /, ""))}</p>
            <div className="mt-8">
              <NextButton onClick={next} />
            </div>
          </div>
        )}
        {untimed && phase === "green" && (
          <button type="button" onClick={() => finish(reflexValue("none"), false)} className="btn mt-4 border border-ink">
            Czekam spokojnie, nie trąbię
          </button>
        )}
      </div>
    </div>
  );
}

function HornIcon() {
  return (
    <svg viewBox="0 0 32 24" className="h-7 w-9" aria-hidden="true" fill="currentColor">
      <path d="M2 9H8L18 2V22L8 15H2Z" />
      <path d="M22 7Q26 12 22 17M26 4Q32 12 26 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
