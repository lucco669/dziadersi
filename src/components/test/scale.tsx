"use client";

import { useId, useState } from "react";
import type { ScaleTask } from "@/content/test";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { INK, PAPER, RED } from "../pictograms";
import { AnswerRow, keyIndex, useKeys, type TaskProps } from "./shared";

const COPY = defineCopy({
  pl: { picture: "Termometr i noga w sandale", confirm: "Zatwierdzam" },
  sl: { picture: "Termometer in noga v sandalu", confirm: "Potrjujem" },
});

/** Mercury and sock heights for each step, from "never" to "always". */
const MERCURY = [188, 150, 112, 74, 36];
const SOCK = [999, 194, 174, 142, 60];

const LEG = "M144 20H164Q169 70 166 130L164 204H198Q212 204 212 220V230H140L142 130Q139 70 144 20Z";
/** The sock: the leg's outline from `top` down, the foot included; a knee sock follows the calf. */
const sock = (top: number) =>
  top >= 130
    ? `M142 ${top}H165.6L164 204H198Q212 204 212 220V230H140Z`
    : `M143.2 ${top}H165Q168.6 95 166 130L164 204H198Q212 204 212 220V230H140L142 130Q139.4 95 143.2 ${top}Z`;

function Thermometer({ step, ticks, label }: { step: number | null; ticks: string[]; label: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const level = step ?? -1;
  return (
    <svg viewBox="0 0 230 250" className="block w-full" role="img" aria-label={label}>
      <defs>
        <clipPath id={`${id}-tube`}>
          <rect x={31} y={14} width={14} height={204} rx={7} />
        </clipPath>
      </defs>

      <rect x={31} y={14} width={14} height={204} rx={7} fill={PAPER} stroke={INK} strokeWidth={1.6} />
      <g clipPath={`url(#${id}-tube)`}>
        <rect
          x={31}
          y={0}
          width={14}
          height={240}
          fill={RED}
          style={{ transform: `translateY(${level >= 0 ? MERCURY[level] : 206}px)`, transition: "transform 420ms cubic-bezier(0.2,0.8,0.2,1)" }}
        />
      </g>
      <circle cx={38} cy={222} r={15} fill={RED} stroke={INK} strokeWidth={1.6} />
      {ticks.map((tick, i) => (
        <g key={tick}>
          <line x1={45} y1={MERCURY[i]} x2={54} y2={MERCURY[i]} stroke={INK} strokeWidth={1.4} />
          <text
            x={58}
            y={MERCURY[i] + 4}
            fontSize={11}
            fontWeight={level === i ? 700 : 500}
            fill={level === i ? RED : INK}
            style={{ fontFamily: "var(--font-schibsted)" }}
          >
            {tick}
          </text>
        </g>
      ))}

      <path d={LEG} fill={INK} />
      <rect x={132} y={0} width={42} height={24} fill={INK} />
      {level > 0 && (
        <g key={level} className="animate-question-in">
          <path d={sock(SOCK[level])} fill="#ffffff" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
          {level >= 3 && (
            <g stroke={INK} strokeWidth={0.8} opacity={0.4}>
              {Array.from({ length: 5 }, (_, i) => (
                <line key={i} x1={146 + i * 4} y1={SOCK[level] + 6} x2={146 + i * 4} y2={200} />
              ))}
            </g>
          )}
          {level === 4 && (
            <g fill={RED}>
              <rect x={143} y={SOCK[4] + 8} width={22} height={4} />
              <rect x={143} y={SOCK[4] + 16} width={22} height={4} />
            </g>
          )}
        </g>
      )}
      <rect x={136} y={230} width={82} height={7} rx={2} fill={INK} />
      <rect x={140} y={210} width={30} height={5} fill={INK} />
      <rect x={180} y={214} width={22} height={5} fill={INK} />
      <line x1={136} y1={244} x2={226} y2={244} stroke={INK} strokeWidth={1} opacity={0.3} />
    </svg>
  );
}

/** A thermometer with a sock: pick a step, see the sock grow, then confirm. */
export function ScaleView({ task, proxy, value, onAnswer }: TaskProps<ScaleTask>) {
  const t = COPY[useLocale()];
  const [step, setStep] = useState<number | null>(value ?? null);

  useKeys((key, event) => {
    const index = keyIndex(key);
    if (index >= 0 && index < task.steps.length) {
      event.preventDefault();
      setStep(index);
    } else if (key === "arrowup" || key === "arrowdown") {
      event.preventDefault();
      setStep((current) => Math.min(task.steps.length - 1, Math.max(0, (current ?? -1) + (key === "arrowup" ? 1 : -1))));
    } else if (key === "enter" && step !== null && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
      onAnswer(step);
    }
  });

  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12">
      <figure className="mx-auto w-full max-w-xs">
        <Thermometer step={step} ticks={task.ticks} label={t.picture} />
      </figure>
      <div>
        <div role="radiogroup" aria-labelledby="zadanie" className="border-t border-ink">
          {task.steps.map((option, i) => (
            <AnswerRow key={option.text} letter={String(i + 1)} checked={step === i} onClick={() => setStep(i)}>
              {(proxy && option.proxy) || option.text}
            </AnswerRow>
          ))}
        </div>
        <button
          type="button"
          disabled={step === null}
          onClick={() => step !== null && onAnswer(step)}
          className="btn mt-8 bg-ink text-paper hover:bg-red disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-ink"
        >
          {t.confirm} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
