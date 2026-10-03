"use client";

import { useMemo, useState } from "react";
import type { BlotTask, ChoiceTask, Option, SmsTask } from "@/content/test";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { cx, typo } from "@/lib/typo";
import { Mark } from "../brand";
import { AnswerRow, keyIndex, LETTERS, shuffled, useKeys, useLater, type TaskProps } from "./shared";

const ADVANCE_MS = 420;

const COPY = defineCopy({
  pl: {
    plate: "Plansza",
    series: "IBD-R · seria 2026",
    blot: "Symetryczna plama atramentu",
    active: "aktywność: teraz",
    today: "Dziś 21:47",
    seen: "Wyświetlono 21:47",
    replies: "Podpowiedzi odpowiedzi",
  },
  sl: {
    plate: "Tabla",
    series: "IBD-R · serija 2026",
    blot: "Simetričen madež črnila",
    active: "aktiven zdaj",
    today: "Danes 21:47",
    seen: "Videno 21:47",
    replies: "Predlagani odgovori",
  },
});

/** Pick one: answers in the respondent's own order, crossed out in ink, then the next task. */
function useChoice(options: Option[], seed: number, onAnswer: (value: number) => void, delay = ADVANCE_MS) {
  const order = useMemo(() => shuffled(options.length, seed), [options.length, seed]);
  const [picked, setPicked] = useState<number | null>(null);
  const later = useLater();

  function choose(index: number) {
    if (picked !== null) return;
    setPicked(index);
    later(delay, () => onAnswer(index));
  }

  useKeys((key, event) => {
    const position = keyIndex(key);
    if (position >= 0 && position < order.length) {
      event.preventDefault();
      choose(order[position]);
    }
  });

  return { order, picked, choose };
}

function OptionList({
  options,
  order,
  picked,
  value,
  proxy,
  onChoose,
}: {
  options: Option[];
  order: number[];
  picked: number | null;
  value: number | undefined;
  proxy: boolean;
  onChoose: (index: number) => void;
}) {
  return (
    <div role="group" aria-labelledby="zadanie" className="border-t border-ink">
      {order.map((index, position) => (
        <AnswerRow
          key={index}
          letter={LETTERS[position]}
          checked={picked === index || (picked === null && value === index)}
          onClick={() => onChoose(index)}
        >
          {(proxy && options[index].proxy) || options[index].text}
        </AnswerRow>
      ))}
    </div>
  );
}

export function ChoiceView({ task, proxy, value, seed, onAnswer }: TaskProps<ChoiceTask>) {
  const { order, picked, choose } = useChoice(task.options, seed, onAnswer);
  return <OptionList options={task.options} order={order} picked={picked} value={value} proxy={proxy} onChoose={choose} />;
}

/** A Rorschach plate: the blot unfolds from its crease, as when the sheet is opened. */
export function BlotView({ task, proxy, value, seed, onAnswer }: TaskProps<BlotTask>) {
  const { order, picked, choose } = useChoice(task.options, seed, onAnswer);
  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <Plate task={task} />
      <OptionList options={task.options} order={order} picked={picked} value={value} proxy={proxy} onChoose={choose} />
    </div>
  );
}

export function Plate({ task, className }: { task: Pick<BlotTask, "plate" | "image" | "width" | "height">; className?: string }) {
  const t = COPY[useLocale()];
  return (
    <figure className={cx("border border-ink bg-card px-5 pb-6 pt-4", className)}>
      <figcaption className="label flex justify-between text-ink-soft">
        <span>{t.plate} {task.plate}</span>
        <span>{t.series}</span>
      </figcaption>
      {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed; no need for the optimiser */}
      <img
        src={task.image}
        width={task.width}
        height={task.height}
        alt={t.blot}
        decoding="async"
        className="mx-auto mt-5 h-auto max-h-[44vh] w-auto max-w-full animate-unfold"
      />
    </figure>
  );
}

/** A text message: the answers are suggested replies, and the chosen one is sent. */
export function SmsView({ task, value, seed, onAnswer }: TaskProps<SmsTask>) {
  const t = COPY[useLocale()];
  const { order, picked, choose } = useChoice(task.options, seed, onAnswer, 1500);
  const sent = picked ?? null;

  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-14">
      <div className="mx-auto w-full max-w-[22rem] rounded-[2.2rem] border-2 border-ink bg-ink p-2.5">
        <div className="flex min-h-[13rem] flex-col overflow-hidden rounded-[1.7rem] bg-card md:min-h-[25rem]">
          <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
            <span aria-hidden="true" className="text-xl text-ink-soft">
              ‹
            </span>
            <Mark className="size-8 text-ink" />
            <div className="leading-tight">
              <p className="font-sans text-[0.95rem] font-semibold">{task.contact}</p>
              <p className="label text-[0.75rem] text-ink-faint">{t.active}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-2 px-4 py-5 font-sans text-[0.98rem]">
            <p className="label self-center text-[0.72rem] text-ink-faint">{t.today}</p>
            <p className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-paper-deep px-3.5 py-2">{task.message}</p>
            {sent !== null && (
              <>
                <p className="max-w-[85%] animate-send self-end break-words rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-paper">
                  {task.options[sent].text}
                </p>
                <p className="label animate-question-in self-end text-[0.72rem] text-ink-faint [animation-delay:700ms]">
                  {t.seen}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="label border-b border-ink pb-3 text-ink-soft">{t.replies}</p>
        <div role="group" aria-labelledby="zadanie" className="mt-4 flex flex-col items-end gap-3">
          {order.map((index, position) => {
            const checked = picked === index || (picked === null && value === index);
            return (
              <button
                key={index}
                type="button"
                aria-pressed={checked}
                disabled={picked !== null}
                onClick={() => choose(index)}
                className={cx(
                  "group flex max-w-full items-center gap-3 rounded-2xl rounded-br-sm border-[1.5px] px-4 py-3 text-left font-sans text-[1.02rem] transition-colors",
                  checked ? "border-ink bg-ink text-paper" : "border-ink hover:bg-paper-deep",
                  picked !== null && !checked && "opacity-30",
                )}
              >
                <span className={cx("text-[0.8rem] font-semibold", checked ? "text-paper/60" : "text-ink-faint")}>
                  {LETTERS[position]}
                </span>
                <span className="break-words">{typo(task.options[index].text)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
