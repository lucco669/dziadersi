"use client";

import { useState } from "react";
import { cx, typo } from "@/lib/typo";
import { Stamp } from "./brand";

const ANSWERS = [
  {
    label: "Nie",
    verdict: "Wynik wątpliwy",
    note: "Odnotowano. Instytut przypomina, że zaprzeczenie jest pierwszym objawem.",
  },
  {
    label: "Tak",
    verdict: "W normie",
    note: "Odnotowano. Wynik typowy dla populacji powyżej 35. roku życia. Prosimy nie otwierać szuflady w obecności rodziny.",
  },
  {
    label: "To się jeszcze przyda",
    verdict: "Dziaderstwo kliniczne",
    note: "Rozpoznanie wstępne potwierdzone. Prosimy nie opuszczać poczekalni.",
  },
];

export function SampleQuestion() {
  const [picked, setPicked] = useState<number | null>(null);
  const answer = picked === null ? null : ANSWERS[picked];

  return (
    <div className="mt-20 border-t-2 border-paper pt-4 md:mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="kicker">Pytanie próbne 07/24</p>
        <p className="kicker text-paper/55">Odpowiedź nie jest nigdzie zapisywana</p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div role="group" aria-labelledby="sample-question" className="lg:col-span-7">
          <h3
            id="sample-question"
            className="max-w-2xl font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.015em]"
          >
            {typo("Czy masz w domu szufladę z kablami, których przeznaczenia nie znasz?")}
          </h3>
          <div className="mt-8 flex flex-wrap gap-3">
            {ANSWERS.map((item, i) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={picked === i}
                onClick={() => setPicked(i)}
                className={cx(
                  "btn border border-paper/70",
                  picked === i ? "bg-paper text-green" : "text-paper hover:bg-paper/10",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="lg:col-span-5 lg:pt-2">
          {answer ? (
            <div key={picked}>
              <Stamp tone="paper" className="animate-stamp text-sm [--stamp-rotate:-4deg]">
                {answer.verdict}
              </Stamp>
              <p className="mt-6 text-lg leading-relaxed text-paper/90">{typo(answer.note)}</p>
              <p className="kicker mt-5 text-paper/55">Pełne badanie: 24 pytania. Otwarcie laboratorium wkrótce.</p>
            </div>
          ) : (
            <p className="max-w-sm border-l border-paper/30 pl-5 text-lg leading-relaxed text-paper/60">
              {typo("Wybierz odpowiedź. Instytut odnotuje ją z należytą powagą.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
