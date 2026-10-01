"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { SPECIES, type SpeciesKey } from "@/content/species";
import { QUESTIONS } from "@/content/test";
import { dayNumber, encodeResult, evaluate } from "@/lib/test";
import { cx, typo } from "@/lib/typo";
import { Seal } from "./brand";
import { Figure, SpeciesPlate } from "./pictograms";

const TOTAL = QUESTIONS.length;
const LETTERS = ["A", "B", "C", "D"];
const PROGRESS_KEY = "ibd-t1";
const ADVANCE_MS = 420;
const DIAGNOSABLE = SPECIES.filter((species) => species.prefix);

const STEPS = [
  { label: "Zliczanie odpowiedzi", detail: `${TOTAL} z ${TOTAL}` },
  { label: "Porównanie z Atlasem Dziadersów", detail: `${DIAGNOSABLE.length} gatunków` },
  { label: "Konsultacja z Radą Naukową", detail: "bez zastrzeżeń" },
  { label: "Przybijanie pieczątki", detail: "gotowe" },
];

/** The species each question probes most, for its illustration. */
const ILLUSTRATION: (SpeciesKey | null)[] = QUESTIONS.map((question) => {
  const weights = new Map<SpeciesKey, number>();
  for (const answer of question.answers) {
    for (const [key, weight] of Object.entries(answer.species ?? {})) {
      weights.set(key as SpeciesKey, (weights.get(key as SpeciesKey) ?? 0) + weight);
    }
  }
  return [...weights].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
});

const pad = (value: number) => String(value).padStart(2, "0");

type Progress = { answers: number[]; current: number; name: string };

const noSubscription = () => () => {};

function readProgress(raw: string | null): Progress | null {
  try {
    const progress = raw ? (JSON.parse(raw) as Progress) : null;
    return progress && Array.isArray(progress.answers) && progress.current > 0 && progress.current < TOTAL
      ? progress
      : null;
  } catch {
    return null;
  }
}

function writeProgress(progress: Progress | null) {
  try {
    if (progress) sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    else sessionStorage.removeItem(PROGRESS_KEY);
  } catch {
    // Private mode or blocked storage: the test still works, it just can't resume.
  }
}

export function TestRunner() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "questions" | "processing">("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const savedRaw = useSyncExternalStore(
    noSubscription,
    () => {
      try {
        return sessionStorage.getItem(PROGRESS_KEY);
      } catch {
        return null;
      }
    },
    () => null,
  );
  const saved = useMemo(() => readProgress(savedRaw), [savedRaw]);

  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  // Each new question: move focus to it for screen readers, and bring it into view on small screens.
  useEffect(() => {
    if (phase !== "questions") return;
    heading.current?.focus({ preventScroll: true });
    const rect = top.current?.getBoundingClientRect();
    if (rect && rect.top < 0) top.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [phase, current]);

  function start(event?: FormEvent) {
    event?.preventDefault();
    setAnswers([]);
    setCurrent(0);
    setPhase("questions");
    writeProgress(null);
    track("Test rozpoczęty");
  }

  function resume(progress: Progress) {
    setAnswers(progress.answers);
    setCurrent(progress.current);
    setName(progress.name);
    setPhase("questions");
  }

  function finish(final: number[]) {
    const draft = { answers: final, day: dayNumber(new Date()), name };
    const href = `/wynik/${encodeResult(draft)}`;
    const result = evaluate(draft);
    track("Test ukończony", { strefa: result.verdict.label, gatunek: result.diagnosis.name });
    writeProgress(null);
    setPhase("processing");
    window.scrollTo({ top: 0 });
    router.prefetch(href);
    STEPS.forEach((_, i) => later(450 + i * 550, () => setStep(i + 1)));
    later(450 + STEPS.length * 550 + 650, () => router.push(href));
  }

  function choose(index: number) {
    if (picked !== null) return;
    setPicked(index);
    const next = answers.slice();
    next[current] = index;
    later(ADVANCE_MS, () => {
      setAnswers(next);
      setPicked(null);
      if (current + 1 >= TOTAL) {
        finish(next);
      } else {
        setCurrent(current + 1);
        writeProgress({ answers: next, current: current + 1, name });
      }
    });
  }

  function back() {
    if (picked !== null) return;
    if (current === 0) setPhase("intro");
    else setCurrent(current - 1);
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.target instanceof HTMLInputElement) return;
    const key = event.key.toLowerCase();
    const index = "1234".includes(key) ? Number(key) - 1 : "abcd".indexOf(key);
    if (index >= 0 && index < QUESTIONS[current].answers.length) {
      event.preventDefault();
      choose(index);
    } else if (key === "backspace" || key === "arrowleft") {
      event.preventDefault();
      back();
    }
  });

  useEffect(() => {
    if (phase !== "questions") return;
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [phase]);

  if (phase === "intro") {
    return (
      <section className="wrap pb-20 pt-8 md:pb-28 md:pt-12">
        <nav aria-label="Ścieżka" className="label text-ink-soft">
          <Link href="/" className="transition-colors hover:text-red">
            Instytut
          </Link>
          <span className="mx-2 text-ink-faint">/</span>
          <span className="text-ink">Test Dziadersa</span>
        </nav>

        <div className="mt-8 grid gap-16 md:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="text-[clamp(2.75rem,7.4vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em]">Test Dziadersa</h1>
            <p className="mt-6 max-w-2xl text-[clamp(1.2rem,2vw,1.45rem)] leading-snug text-ink-soft">
              {typo(
                "Badanie przesiewowe w dwudziestu czterech pytaniach z życia codziennego. Na końcu wynik od 0 do 100%, rozpoznanie gatunku według Atlasu i certyfikat do pokazania rodzinie.",
              )}
            </p>

            <ol className="mt-10 max-w-xl border-t border-ink">
              {[
                "Odpowiadaj szczerze. Instytut i tak się zorientuje.",
                "Nie konsultuj odpowiedzi z rodziną. Rodzina jest stroną w sprawie.",
                "Pierwsza myśl jest zwykle najbardziej dziaderska. Zaufaj jej.",
              ].map((rule, i) => (
                <li key={rule} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-3.5 leading-snug">
                  <span className="font-sans text-[0.9rem] font-semibold text-red">{pad(i + 1)}</span>
                  {typo(rule)}
                </li>
              ))}
            </ol>

            <form onSubmit={start} className="mt-12">
              <label htmlFor="podpis" className="label text-ink-soft">
                Imię na certyfikat (nieobowiązkowe)
              </label>
              <input
                id="podpis"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={24}
                autoComplete="given-name"
                placeholder="np. Zenek"
                className="mt-2 block w-full max-w-md border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-serif text-3xl font-bold placeholder:font-normal placeholder:text-ink/25 focus:border-red focus-visible:outline-none"
              />
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn bg-ink text-paper hover:bg-red">
                  Rozpocznij badanie <span aria-hidden="true">→</span>
                </button>
                {saved && (
                  <button
                    type="button"
                    onClick={() => resume(saved)}
                    className="btn border border-ink text-ink hover:bg-ink hover:text-paper"
                  >
                    Wznów od pytania {saved.current + 1}
                  </button>
                )}
              </div>
              <p className="label mt-6 max-w-md text-ink-soft">
                {typo("24 pytania, około trzech minut. Odpowiedzi nie są nigdzie zapisywane: wynik trafia tylko do linku, którym zdecydujesz się podzielić.")}
              </p>
            </form>
          </div>

          <aside className="lg:col-span-5" aria-label="Gatunki rozpoznawane przez test">
            <ol className="grid grid-cols-2 gap-x-5 gap-y-6 border-t border-ink pt-6 sm:grid-cols-3">
              {DIAGNOSABLE.map((species) => (
                <li key={species.key}>
                  <SpeciesPlate species={species.key} className="w-full" />
                  <span className="label mt-1 block text-ink-soft">{species.name}</span>
                </li>
              ))}
            </ol>
            <p className="label mt-6 text-ink-soft">
              {typo("Test rozpoznaje dziesięć gatunków ogólnopolskich i ich krzyżówki, np. Dziadersa Grillowo-Motoryzacyjnego.")}
            </p>
          </aside>
        </div>
      </section>
    );
  }

  if (phase === "processing") {
    return (
      <section className="wrap py-14 md:py-24">
        <div className="mx-auto max-w-2xl" role="status" aria-live="polite">
          <p className="label text-ink-soft">Formularz IBD-T1 · Opracowanie wyników</p>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            Instytut analizuje wyniki.
          </h1>
          <p className="mt-4 text-2xl italic text-ink-soft">Proszę nie zamykać okna i nie wzywać rodziny.</p>
          <ol className="mt-12 border-t border-ink">
            {STEPS.map((item, i) => (
              <li
                key={item.label}
                className={cx(
                  "grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b border-rule py-4 transition-opacity duration-300",
                  i < step ? "opacity-100" : i === step ? "opacity-60" : "opacity-25",
                )}
              >
                <span className="text-red">{i < step ? <Check /> : i === step ? "…" : ""}</span>
                <span className="text-lg">{item.label}</span>
                <span className="label text-ink-soft">{i < step ? item.detail : ""}</span>
              </li>
            ))}
          </ol>
          {step >= STEPS.length && (
            <Seal className="mx-auto mt-12 block size-36 animate-stamp text-red [--stamp-rotate:-12deg]" />
          )}
        </div>
      </section>
    );
  }

  const question = QUESTIONS[current];
  const shortcut = question.answers.length;
  const illustration = ILLUSTRATION[current];

  return (
    <section ref={top} className="wrap scroll-mt-6 pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <p className="label flex items-baseline justify-between gap-6 text-ink-soft">
          <span>Formularz IBD-T1 · {question.section}</span>
          <span>
            Pytanie <span className="text-ink">{pad(current + 1)}</span> / {TOTAL}
          </span>
        </p>
        <div
          role="progressbar"
          aria-label="Postęp badania"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={current}
          className="mt-3 grid grid-cols-24 gap-[3px]"
        >
          {QUESTIONS.map((item, i) => (
            <span
              key={item.text}
              className={cx(
                "h-1.5 transition-colors duration-300",
                i === current ? "bg-red" : answers[i] !== undefined ? "bg-ink" : "bg-ink/15",
              )}
            />
          ))}
        </div>

        <div key={current} className="animate-question-in">
          <div className="mt-10 flex items-end justify-between gap-6 md:mt-14">
            <h1
              ref={heading}
              tabIndex={-1}
              id="pytanie"
              className="text-[clamp(1.9rem,4.6vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.01em] focus:outline-none"
            >
              {typo(question.text)}
            </h1>
            {illustration ? (
              <SpeciesPlate species={illustration} animated className="hidden w-40 shrink-0 sm:block md:w-48" />
            ) : (
              <svg viewBox="-4 0 48 96" className="hidden h-28 shrink-0 sm:block" aria-hidden="true">
                <Figure />
              </svg>
            )}
          </div>

          <div role="group" aria-labelledby="pytanie" className="mt-10 border-t border-ink">
            {question.answers.map((answer, i) => {
              const selected = picked === i || (picked === null && answers[current] === i);
              return (
                <button
                  key={answer.text}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(i)}
                  className={cx(
                    "grid w-full grid-cols-[2rem_1fr_1.75rem] items-center gap-4 border-b border-rule py-4 pr-1 text-left transition-colors md:grid-cols-[3rem_1fr_2rem] md:py-5",
                    selected ? "bg-red/[0.06]" : "hover:bg-paper-deep",
                  )}
                >
                  <span className="pl-1 font-sans text-[0.9rem] font-semibold text-ink-soft">{LETTERS[i]}</span>
                  <span className="text-lg leading-snug md:text-xl">{typo(answer.text)}</span>
                  <Box checked={selected} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button type="button" onClick={back} className="label py-2 text-ink-soft transition-colors hover:text-ink">
            ← {current === 0 ? "Pouczenie" : "Poprzednie pytanie"}
          </button>
          <span className="label hidden text-ink-faint md:inline">Klawisze 1–{shortcut} wybierają odpowiedź</span>
        </div>
      </div>
    </section>
  );
}

/** Form checkbox; a chosen answer gets crossed out in ink. */
function Box({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden="true" className="relative size-6 justify-self-end border-[1.5px] border-ink bg-[#fbf8f1] md:size-7">
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

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="inline size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2.5 8.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
