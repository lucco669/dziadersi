"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { speciesByKey } from "@/content/species";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { clueLabel, encodeExam, EXAM_LENGTH, questions, randomExamSeed, type Question } from "@/lib/exam";
import { tally } from "@/lib/tally";
import { dayNumber } from "@/lib/test";
import { cx, quote, typo } from "@/lib/typo";
import { useAccount } from "./account";
import { Stamp } from "./brand";
import { useKeys } from "./hooks";
import { Binoculars, Figure, SpeciesPlate } from "./pictograms";

const COPY = defineCopy({
  pl: {
    note: "Notatka terenowa",
    lead: "Dwanaście pytań. Cztery odpowiedzi. Bez klucza do oznaczania.",
    points: [
      "Wokalizacje, ryciny, siedliska, objawy, naturalni wrogowie i łacina.",
      "Pytania z całego Atlasu: gatunki ogólnopolskie, regionalne i okazjonalne.",
      "Ocena w skali szkolnej, od niedostatecznej do celującej. Poprawka bez ograniczeń.",
    ],
    start: "Rozpocznij egzamin",
    keys: "Klawisze 1–4 odpowiadają, Enter przechodzi dalej.",
    question: "Pytanie",
    of: "z",
    score: "Punkty",
    right: "poprawna odpowiedź",
    passed: "Zaliczone",
    wrong: "Błąd w oznaczeniu",
    next: "Dalej",
    counting: "Komisja liczy…",
    results: "Wyniki egzaminu",
  },
  sl: {
    note: "Terenski zapisek",
    lead: "Dvanajst vprašanj. Štirje odgovori. Brez določevalnega ključa.",
    points: [
      "Oglašanje, risbe, habitati, simptomi, naravni sovražniki in latinščina.",
      "Vprašanja iz vsega Atlasa: vsepoljske, regionalne in priložnostne vrste.",
      "Ocena po poljski šolski lestvici, od nezadostne do odlične. Popravni izpit brez omejitev.",
    ],
    start: "Začni izpit",
    keys: "Tipke 1–4 za odgovor, Enter za naprej.",
    question: "Vprašanje",
    of: "od",
    score: "Točke",
    right: "pravilen odgovor",
    passed: "Opravljeno",
    wrong: "Napaka pri določanju",
    next: "Naprej",
    counting: "Komisija šteje …",
    results: "Rezultati izpita",
  },
});

const pad = (value: number) => String(value).padStart(2, "0");

/** The clue, drawn the way a field observer would see it. */
export function Clue({ question }: { question: Question }) {
  const locale = useLocale();
  switch (question.kind) {
    case "plate":
      return <SpeciesPlate species={question.answer} animated className="w-full max-w-sm" />;
    case "call":
      return <p className="border-l-2 border-red pl-5 text-[clamp(1.8rem,3.6vw,2.6rem)] italic leading-snug">{quote(typo(question.clue), locale)}</p>;
    case "latin":
      return <p className="text-[clamp(2.2rem,4.6vw,3.4rem)] italic leading-tight">{question.clue}</p>;
    default:
      return (
        <div className="max-w-xl border border-ink bg-card px-6 py-5">
          <p className="label text-ink-soft">
            {COPY[locale].note} · {clueLabel(question.kind, locale)}
          </p>
          <p className="mt-2 text-[1.35rem] leading-snug">{typo(question.clue)}</p>
        </div>
      );
  }
}

/** Egzamin terenowy: twelve questions, one per screen, with the answer shown straight away. */
export function ExamRunner() {
  const router = useRouter();
  const account = useAccount();
  const locale = useLocale();
  const t = COPY[locale];
  const [seed, setSeed] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const list = seed === null ? [] : questions(seed, locale);
  const current = answers.length - (revealed ? 1 : 0);
  const question = list[current];
  const chosen = revealed ? answers[current] : null;
  const points = answers.filter((answer, i) => list[i] && answer === list[i].correct).length;

  function start() {
    setSeed(randomExamSeed());
    setAnswers([]);
    setRevealed(false);
    track("Egzamin rozpoczęty");
    window.requestAnimationFrame(() => document.getElementById("egzamin")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function answer(option: number) {
    if (!question || revealed) return;
    setAnswers([...answers, option]);
    setRevealed(true);
  }

  async function next() {
    if (!revealed || seed === null) return;
    if (answers.length < EXAM_LENGTH) {
      setRevealed(false);
      return;
    }
    setFinishing(true);
    const code = encodeExam({ seed, answers, day: dayNumber(new Date()) });
    tally("egzamin");
    track("Egzamin ukończony", { punkty: points });
    if (account.status === "member") {
      await fetch("/api/zakladki", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "egzamin", code }),
      }).catch(() => {});
    }
    router.push(localizePath(`/egzamin/${code}`, locale));
  }

  useKeys(
    (key) => {
      if (!question) return;
      if (!revealed && ["1", "2", "3", "4"].includes(key)) answer(Number(key) - 1);
      if (revealed && key === "enter") void next();
    },
    seed !== null,
  );

  if (seed === null || !question) {
    return (
      <div className="grid items-center gap-12 border-t border-ink pt-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-tight">{typo(t.lead)}</p>
          <ul className="mt-6 space-y-2 text-lg leading-snug text-ink-soft">
            {t.points.map((point) => (
              <li key={point}>{typo(point)}</li>
            ))}
          </ul>
          <button type="button" onClick={start} className="btn mt-9 bg-ink text-paper hover:bg-red">
            {t.start} <span aria-hidden="true">→</span>
          </button>
          <p className="label mt-4 text-ink-soft">{t.keys}</p>
        </div>
        <div className="hidden justify-end lg:col-span-5 lg:flex">
          <svg viewBox="-4 -1 48 97" className="h-64" aria-hidden="true">
            <Figure left="hip" glasses="eyes" hat="bucket" torso={<Binoculars />} />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-ink pt-6">
      <div className="label flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
        <span>
          {t.question} {pad(current + 1)} {t.of} {EXAM_LENGTH} · {clueLabel(question.kind, locale)}
        </span>
        <span>
          {t.score}: {points} {t.of} {answers.length}
        </span>
      </div>
      <div className="mt-3 grid h-1.5 grid-cols-12 gap-1" aria-hidden="true">
        {list.map((item, i) => (
          <span
            key={i}
            className={cx(
              i < answers.length ? (answers[i] === item.correct ? "bg-ink" : "bg-red") : i === current ? "bg-ink/40" : "bg-ink/10",
            )}
          />
        ))}
      </div>

      <div key={current} className="mt-10 grid animate-question-in gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-tight">{question.prompt}</h2>
          <div className="mt-8">
            <Clue question={question} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <ol className="grid gap-3">
            {question.options.map((key, i) => {
              const species = speciesByKey(key, locale);
              const right = revealed && i === question.correct;
              const wrong = revealed && i === chosen && i !== question.correct;
              return (
                <li key={key}>
                  <button
                    type="button"
                    disabled={revealed}
                    onClick={() => answer(i)}
                    className={cx(
                      "grid w-full grid-cols-[2rem_1fr_auto] items-center gap-3 border px-4 py-3.5 text-left transition-colors",
                      !revealed && "border-ink hover:bg-ink hover:text-paper",
                      right && "border-ink bg-ink text-paper",
                      wrong && "border-red text-red line-through decoration-2",
                      revealed && !right && !wrong && "border-rule text-ink-faint",
                    )}
                  >
                    <span className="font-sans text-[0.85rem] font-semibold opacity-70">{i + 1}</span>
                    <span className="text-[1.2rem] font-bold leading-tight">{species.name}</span>
                    {right && <span aria-label={t.right}>✓</span>}
                  </button>
                </li>
              );
            })}
          </ol>

          {revealed && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4" role="status">
              <Stamp tone={chosen === question.correct ? "ink" : "red"} className="animate-stamp [--stamp-rotate:-4deg]">
                {chosen === question.correct ? t.passed : t.wrong}
              </Stamp>
              <button type="button" onClick={() => void next()} disabled={finishing} className="btn bg-ink text-paper hover:bg-red disabled:opacity-60">
                {answers.length < EXAM_LENGTH ? t.next : finishing ? t.counting : t.results} <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
