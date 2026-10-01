"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { QUESTIONS } from "@/content/test";
import { SPECIES } from "@/content/species";
import { dayNumber, encodeResult, evaluate } from "@/lib/test";
import { cx, typo } from "@/lib/typo";
import { Seal } from "./brand";

const TOTAL = QUESTIONS.length;
const LETTERS = ["A", "B", "C", "D"];
const SECTIONS = [...new Set(QUESTIONS.map((question) => question.section))];
const PROGRESS_KEY = "ibd-t1";
const ADVANCE_MS = 420;

const STEPS = [
  { label: "Zliczanie odpowiedzi", detail: `${TOTAL} z ${TOTAL}` },
  { label: "Porównanie z Atlasem Dziadersów", detail: `${SPECIES.filter((species) => species.prefix).length} gatunków` },
  { label: "Konsultacja z Radą Naukową", detail: "bez zastrzeżeń" },
  { label: "Przybijanie pieczątki", detail: "gotowe" },
];

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
      <section className="wrap py-12 md:py-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="kicker flex flex-wrap justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
              <span>
                § 01 <span className="mx-1.5 opacity-50">/</span> Laboratorium
              </span>
              <span className="text-ink-faint">Formularz IBD-T1</span>
            </p>
            <h1 className="mt-10 font-display text-[clamp(3.5rem,10vw,7.5rem)] font-black leading-[0.86] tracking-[-0.04em]">
              Test Dziadersa
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              {typo(
                "Badanie przesiewowe w dwudziestu czterech pytaniach z życia codziennego. Na końcu wynik od 0 do 100%, rozpoznanie gatunku według Atlasu i certyfikat do pokazania rodzinie.",
              )}
            </p>

            <dl className="mt-10 grid max-w-xl grid-cols-3 border-y border-ink">
              {[
                ["Pytania", String(TOTAL)],
                ["Czas", "ok. 3 min"],
                ["Wynik", "0–100%"],
              ].map(([label, value], i) => (
                <div key={label} className={cx("py-4", i > 0 && "border-l border-rule pl-4 md:pl-6")}>
                  <dt className="kicker text-ink-faint">{label}</dt>
                  <dd className="mt-1 whitespace-nowrap font-display text-[1.3rem] font-bold sm:text-2xl md:text-[1.75rem]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 max-w-xl">
              <p className="kicker text-ink-faint">Pouczenie</p>
              <ol className="mt-3">
                {[
                  "Odpowiadaj szczerze. Instytut i tak się zorientuje.",
                  "Nie konsultuj odpowiedzi z rodziną. Rodzina jest stroną w sprawie.",
                  "Pierwsza myśl jest zwykle najbardziej dziaderska. Zaufaj jej.",
                ].map((rule, i) => (
                  <li key={rule} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-3 text-lg leading-snug">
                    <span className="kicker pt-1.5 text-ink-faint">{pad(i + 1)}</span>
                    {typo(rule)}
                  </li>
                ))}
              </ol>
            </div>

            <form onSubmit={start} className="mt-12">
              <label htmlFor="podpis" className="kicker text-ink-faint">
                Podpis osoby badanej · opcjonalnie
              </label>
              <input
                id="podpis"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={24}
                autoComplete="given-name"
                placeholder="Imię na certyfikat"
                className="mt-2 block w-full max-w-md border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-display text-3xl italic text-green placeholder:text-ink/25 focus:border-green focus-visible:outline-none"
              />
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn bg-green text-paper hover:bg-ink">
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
              <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-faint">
                {typo("Odpowiedzi nie są nigdzie zapisywane. Wynik trafia tylko do linku, którym zdecydujesz się podzielić.")}
              </p>
            </form>
          </div>

          <aside className="self-start border border-ink bg-paper-light lg:col-span-5 lg:mt-14">
            <div className="kicker flex justify-between border-b border-ink px-5 py-3 md:px-7">
              <span>Zakres badania</span>
              <span className="text-ink-faint">{SECTIONS.length} działów</span>
            </div>
            <ol className="columns-2 gap-6 px-5 py-4 md:px-7">
              {SECTIONS.map((section, i) => (
                <li key={section} className="kicker break-inside-avoid py-1.5 text-[0.66rem] text-ink-soft">
                  <span className="mr-2 text-ink-faint">{pad(i + 1)}</span>
                  {section}
                </li>
              ))}
            </ol>
            <div className="flex items-center gap-5 border-t border-rule px-5 py-5 md:px-7">
              <Seal className="size-20 shrink-0 rotate-[-12deg] text-bordo" />
              <p className="text-[0.95rem] leading-snug text-ink-soft">
                {typo("Badanie zatwierdzone przez Radę Naukową Instytutu. Rada jest w trakcie powoływania.")}
              </p>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  if (phase === "processing") {
    return (
      <section className="wrap py-14 md:py-24">
        <div className="mx-auto max-w-2xl" role="status" aria-live="polite">
          <p className="kicker border-t-2 border-ink pt-4">Formularz IBD-T1 · Opracowanie wyników</p>
          <h1 className="mt-10 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.03em]">
            Instytut analizuje wyniki.
          </h1>
          <p className="mt-4 font-display text-2xl italic text-green">Proszę nie zamykać okna i nie wzywać rodziny.</p>
          <ol className="mt-12 border-t border-ink">
            {STEPS.map((item, i) => (
              <li
                key={item.label}
                className={cx(
                  "grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b border-rule py-4 transition-opacity duration-300",
                  i < step ? "opacity-100" : i === step ? "opacity-60" : "opacity-25",
                )}
              >
                <span className="text-green">{i < step ? <Check /> : i === step ? "…" : ""}</span>
                <span className="text-lg">{item.label}</span>
                <span className="kicker text-ink-faint">{i < step ? item.detail : ""}</span>
              </li>
            ))}
          </ol>
          {step >= STEPS.length && (
            <Seal className="mx-auto mt-12 block size-36 animate-stamp text-bordo [--stamp-rotate:-12deg]" />
          )}
        </div>
      </section>
    );
  }

  const question = QUESTIONS[current];
  const shortcut = question.answers.length;

  return (
    <section ref={top} className="wrap scroll-mt-24 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="kicker flex items-baseline justify-between gap-6 border-t-2 border-ink pt-4">
          <span>Formularz IBD-T1</span>
          <span>
            Pytanie {pad(current + 1)} <span className="text-ink-faint">/ {TOTAL}</span>
          </span>
        </p>
        <div
          role="progressbar"
          aria-label="Postęp badania"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={current}
          className="mt-4 grid grid-cols-24 gap-[3px]"
        >
          {QUESTIONS.map((item, i) => (
            <span
              key={item.text}
              className={cx(
                "h-1.5 transition-colors duration-300",
                i === current ? "bg-bordo" : answers[i] !== undefined ? "bg-ink" : "bg-ink/15",
              )}
            />
          ))}
        </div>

        <div key={current} className="animate-question-in">
          <p className="kicker mt-12 text-green md:mt-16">Dział: {question.section}</p>
          <h1
            ref={heading}
            tabIndex={-1}
            id="pytanie"
            className="mt-4 font-display text-[clamp(1.9rem,4.6vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.015em] focus:outline-none"
          >
            {typo(question.text)}
          </h1>

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
                    selected ? "bg-bordo/[0.05]" : "hover:bg-paper-light",
                  )}
                >
                  <span className="pl-1 font-mono text-sm text-ink-faint">{LETTERS[i]}</span>
                  <span className="text-lg leading-snug md:text-xl">{typo(answer.text)}</span>
                  <Box checked={selected} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button type="button" onClick={back} className="kicker py-2 text-ink-soft transition-colors hover:text-ink">
            ← {current === 0 ? "Pouczenie" : "Poprzednie pytanie"}
          </button>
          <span className="kicker hidden text-ink-faint md:inline">
            Klawisze 1–{shortcut} wybierają odpowiedź
          </span>
        </div>
      </div>
    </section>
  );
}

/** Form checkbox; a chosen answer gets crossed out in ink. */
function Box({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden="true" className="relative size-6 justify-self-end border-[1.5px] border-ink bg-paper-light md:size-7">
      {checked && (
        <svg viewBox="0 0 24 24" className="absolute -inset-1.5 overflow-visible text-bordo" fill="none" stroke="currentColor">
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
