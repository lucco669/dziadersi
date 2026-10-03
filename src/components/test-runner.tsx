"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { SpeciesKey } from "@/content/species";
import { STATIONS, TASKS, type Task } from "@/content/test";
import { sameAnswer } from "@/lib/answer-stats";
import type { AnswerCounts } from "@/lib/census";
import { DIAGNOSABLE, dayNumber, decodeGroup, encodeResult, evaluate, GROUP_LIMIT, groupPath, suspect } from "@/lib/test";
import { cx, typo } from "@/lib/typo";
import { readProgress, type Progress } from "@/lib/test-progress";
import { isFamilyId } from "@/lib/write-policy";
import { refreshAccount } from "./account";
import { Seal } from "./brand";
import { SpeciesPlate } from "./pictograms";
import { BlotView, ChoiceView, SmsView } from "./test/choice";
import { InventoryView } from "./test/inventory";
import { MapView } from "./test/map";
import { RapidView } from "./test/rapid";
import { ReflexView } from "./test/reflex";
import { ScaleView } from "./test/scale";
import { Check, useKeys } from "./test/shared";
import { RoutingSlip } from "./test/slip";
import { TestIntro as Intro } from "./test/intro";
import { useReducedMotion } from "./hooks";
import { WordsView } from "./test/words";

const TOTAL = TASKS.length;
const PROGRESS_KEY = "ibd-t2";
/** The last own score in this browser, so the census can count retakes without any identifier. */
const LAST_SCORE_KEY = "ibd-ostatni-wynik";

const pad = (value: number) => String(value).padStart(2, "0");

/** The species a choice task probes most, drawn next to it. */
function illustration(task: Task): SpeciesKey | null {
  if (task.kind !== "choice") return null;
  const weights = new Map<SpeciesKey, number>();
  for (const option of task.options) {
    for (const [key, weight] of Object.entries(option.species ?? {})) {
      weights.set(key as SpeciesKey, (weights.get(key as SpeciesKey) ?? 0) + weight);
    }
  }
  return [...weights].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

const noSubscription = () => () => {};

function writeProgress(progress: Progress | null) {
  try {
    if (progress) sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    else sessionStorage.removeItem(PROGRESS_KEY);
  } catch {
    // Private mode or blocked storage: the test still works, it just can't resume.
  }
}

function TaskBody({
  task,
  proxy,
  value,
  seed,
  untimed,
  onAnswer,
}: {
  task: Task;
  proxy: boolean;
  value: number | undefined;
  seed: number;
  untimed: boolean;
  onAnswer: (value: number) => void;
}) {
  const props = { proxy, value, seed, onAnswer, untimed };
  switch (task.kind) {
    case "choice":
      return <ChoiceView task={task} {...props} />;
    case "sms":
      return <SmsView task={task} {...props} />;
    case "blot":
      return <BlotView task={task} {...props} />;
    case "words":
      return <WordsView task={task} {...props} />;
    case "reflex":
      return <ReflexView task={task} {...props} />;
    case "map":
      return <MapView task={task} {...props} />;
    case "inventory":
      return <InventoryView task={task} {...props} />;
    case "scale":
      return <ScaleView task={task} {...props} />;
    case "rapid":
      return <RapidView task={task} {...props} />;
  }
}

export function TestRunner() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "task" | "break" | "details" | "processing">("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(() => TASKS.map(() => null));
  const [current, setCurrent] = useState(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"self" | "proxy" | null>(null);
  const [seed, setSeed] = useState(1);
  const [group, setGroup] = useState("");
  const [region, setRegion] = useState("");
  const [untimed, setUntimed] = useState(false);
  const reducedMotion = useReducedMotion();
  const [attempt, setAttempt] = useState("");
  const [family, setFamily] = useState("");
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState("");
  const completedRooms = useRef<number[]>([]);
  const [counts, setCounts] = useState<AnswerCounts | null>(null);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const search = useSyncExternalStore(noSubscription, () => window.location.search, () => "");
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const groupParam = params.get("grupa") ?? "";
  const familyParam = params.get("rodzina") ?? "";
  const invite = useMemo(() => decodeGroup(groupParam)?.map(evaluate) ?? null, [groupParam]);
  const proxy = (mode ?? (params.get("tryb") === "wywiad" ? "proxy" : "self")) === "proxy";

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
  useEffect(() => {
    document.body.classList.toggle("test-active", phase !== "intro");
    return () => document.body.classList.remove("test-active");
  }, [phase]);

  // Each new task or room: move focus to it for screen readers, and bring it into view on small screens.
  useEffect(() => {
    if (phase !== "task" && phase !== "break" && phase !== "details") return;
    heading.current?.focus({ preventScroll: true });
    const rect = top.current?.getBoundingClientRect();
    if (rect && rect.top < 0) top.current?.scrollIntoView({ block: "start", behavior: reducedMotion ? "instant" : "smooth" });
  }, [phase, current, reducedMotion]);

  const steps = [
    { label: "Zliczanie odpowiedzi", detail: `${TOTAL} z ${TOTAL}` },
    { label: "Interpretacja plansz Rorschacha", detail: "3 plansze" },
    { label: "Porównanie z Atlasem Dziadersów", detail: `${DIAGNOSABLE.length} gatunków` },
    { label: "Wyniki laboratoryjne", detail: "13 parametrów" },
    ...(group ? [{ label: "Dopisywanie do rankingu", detail: "gotowe" }] : []),
    { label: "Przybijanie pieczątki", detail: "gotowe" },
  ];

  /** How others answered, for the notes between rooms. Optional: without it the notes stay quiet. */
  function loadCounts() {
    fetch("/api/spis/odpowiedzi")
      .then((response) => (response.ok ? (response.json() as Promise<AnswerCounts>) : null))
      .then((data) => setCounts(data && Object.keys(data).length ? data : null))
      .catch(() => {});
  }

  function start(event?: FormEvent) {
    event?.preventDefault();
    const fresh = TASKS.map(() => null);
    const nextSeed = crypto.getRandomValues(new Uint32Array(1))[0] >>> 1;
    const joined = invite && invite.length < GROUP_LIMIT ? groupParam : "";
    setAnswers(fresh);
    setCurrent(0);
    setSeed(nextSeed);
    setGroup(joined);
    setFamily(isFamilyId(familyParam) ? familyParam : "");
    setAttempt(crypto.randomUUID());
    completedRooms.current = [];
    setMode(proxy ? "proxy" : "self");
    setPhase("task");
    writeProgress(null);
    loadCounts();
    track("Test rozpoczęty", { tryb: proxy ? "wywiad" : "osobiście", ranking: joined || isFamilyId(familyParam) ? "tak" : "nie", tempo: untimed || reducedMotion ? "spokojne" : "standardowe" });
  }

  function resume(progress: Progress) {
    setAnswers(progress.answers);
    setCurrent(progress.current);
    setName(progress.name);
    setMode(progress.proxy ? "proxy" : "self");
    setSeed(progress.seed);
    setGroup(progress.group);
    setRegion(progress.region ?? "");
    setUntimed(progress.untimed ?? false);
    setAttempt(progress.attempt || crypto.randomUUID());
    setFamily(progress.family ?? "");
    completedRooms.current = progress.rooms ?? [];
    setPhase(progress.current === TOTAL ? "details" : "task");
    loadCounts();
  }

  async function finish(final: number[], skipFamily = false) {
    if (finishing) return;
    setFinishing(true);
    setFinishError("");
    const draft = { version: 2 as const, answers: final, day: dayNumber(new Date()), name, proxy };
    const code = encodeResult(draft);
    let href = group ? groupPath([...group.split("."), code]) : `/wynik/${code}`;
    if (family && !skipFamily) {
      try {
        const response = await fetch(`/api/grupy/${family}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, attempt }) });
        if (!response.ok) {
          setFinishError(response.status === 409 ? "Ranking ma już komplet 12 osób. Twój wynik jest gotowy." : response.status === 404 ? "Zaproszenie wygasło. Twój wynik jest gotowy." : "Nie udało się dopisać do rankingu. Spróbuj ponownie lub odbierz wynik bez dołączania.");
          setFinishing(false);
          return;
        }
        href = `/grupy/${family}`;
      } catch {
        setFinishError("Brak połączenia z rankingiem. Spróbuj ponownie lub odbierz wynik bez dołączania.");
        setFinishing(false);
        return;
      }
    }
    const result = evaluate(draft);
    track("Test ukończony", { strefa: result.verdict.label, gatunek: result.diagnosis.name, tryb: proxy ? "wywiad" : "osobiście" });
    record(code, result.score);
    writeProgress(null);
    setPhase("processing");
    window.scrollTo({ top: 0 });
    router.prefetch(href);
    steps.forEach((_, i) => later(400 + i * 480, () => setStep(i + 1)));
    later(reducedMotion ? 0 : 400 + steps.length * 480 + 650, () => router.push(href));
  }

  /** Into the anonymous census (and the profile, when signed in). Fire and forget: the result page doesn't wait. */
  function record(code: string, score: number) {
    let previous: number | undefined;
    if (!proxy) {
      try {
        const last = localStorage.getItem(LAST_SCORE_KEY);
        previous = last === null ? undefined : Number(last);
        localStorage.setItem(LAST_SCORE_KEY, String(score));
      } catch {
        // Storage blocked: the result still goes in, just not as a retake.
      }
    }
    fetch("/api/wyniki", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, attempt, region: region || undefined, previous }),
    })
      .then(() => refreshAccount())
      .catch(() => {});
  }

  function answer(value: number) {
    const next = answers.slice();
    next[current] = value;
    setAnswers(next);
    const station = TASKS[current].station;
    if ((current + 1 === TOTAL || TASKS[current + 1].station !== station) && !completedRooms.current.includes(station)) {
      completedRooms.current.push(station);
      track("Gabinet ukończony", { gabinet: station + 1, tryb: proxy ? "wywiad" : "osobiście", tempo: untimed || reducedMotion ? "spokojne" : "standardowe" });
    }
    writeProgress({ answers: next, current: current + 1, name, proxy, seed, group, region, untimed, attempt, family, rooms: completedRooms.current });
    if (current + 1 >= TOTAL) {
      setCurrent(TOTAL);
      setPhase("details");
      return;
    }
    setCurrent(current + 1);
    setPhase(TASKS[current + 1].station !== TASKS[current].station ? "break" : "task");
  }

  function back() {
    if (phase === "break") {
      setCurrent(current - 1);
      setPhase("task");
    } else if (current === 0) setPhase("intro");
    else setCurrent(current - 1);
  }

  useKeys(
    (key, event) => {
      if (key === "backspace") {
        event.preventDefault();
        back();
      } else if (phase === "break" && key === "enter" && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        setPhase("task");
      }
    },
    phase === "task" || phase === "break",
  );

  if (phase === "intro") {
    return (
      <Intro
        region={region}
        setRegion={setRegion}
        proxy={proxy}
        setProxy={(value) => setMode(value ? "proxy" : "self")}
        invite={invite}
        saved={saved}
        onStart={start}
        onResume={resume}
        untimed={untimed}
        setUntimed={setUntimed}
        family={isFamilyId(familyParam)}
      />
    );
  }

  if (phase === "details") {
    return (
      <section ref={top} className="wrap py-10 md:py-16">
        <form className="mx-auto max-w-xl" onSubmit={(event) => { event.preventDefault(); void finish(answers as number[]); }}>
          <p className="label text-red">Wszystkie gabinety zaliczone</p>
          <h1 ref={heading} tabIndex={-1} className="mt-4 text-4xl font-bold leading-tight focus:outline-none">Na kogo wystawić certyfikat?</h1>
          <label htmlFor="podpis" className="label mt-7 block">Imię lub pseudonim (nieobowiązkowe)</label>
          <input id="podpis" value={name} onChange={(event) => setName(event.target.value)} maxLength={24} autoComplete="off" placeholder={proxy ? "np. Tata" : "np. Zenek"} className="mt-2 w-full border-b-2 border-ink bg-transparent py-3 text-3xl focus:border-red focus-visible:outline-none" />
          <p className="label mt-4 text-ink-soft">{family || group ? "Wynik i podpis będą widoczne dla każdego, kto ma link do rankingu. Możesz pozostawić podpis pusty." : "Podpis trafi do linku i na certyfikat. Możesz pozostawić to pole puste."}</p>
          {finishError && <p role="alert" className="mt-5 border-l-2 border-red pl-4">{finishError}</p>}
          <button disabled={finishing} className="btn mt-7 bg-ink text-paper hover:bg-red disabled:opacity-50">{finishing ? "Chwileczkę…" : family ? "Odbierz wynik i dołącz do rankingu" : "Odbierz wynik"}</button>
          {finishError && <button type="button" disabled={finishing} onClick={() => void finish(answers as number[], true)} className="link mt-5 block font-sans">Pokaż wynik bez dołączania</button>}
        </form>
      </section>
    );
  }

  if (phase === "processing") {
    return (
      <section className="wrap py-14 md:py-24">
        <div className="mx-auto max-w-2xl" role="status" aria-live="polite">
          <p className="label text-ink-soft">Formularz IBD-T2 · Opracowanie wyników</p>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            Instytut analizuje wyniki.
          </h1>
          <p className="mt-4 text-2xl italic text-ink-soft">
            {proxy ? "Proszę nie mówić nic osobie badanej." : "Proszę nie zamykać okna i nie wzywać rodziny."}
          </p>
          <ol className="mt-12 border-t border-ink">
            {steps.map((item, i) => (
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
          {step >= steps.length && (
            <Seal className="mx-auto mt-12 block size-36 animate-stamp text-red [--stamp-rotate:-12deg]" />
          )}
        </div>
      </section>
    );
  }

  if (phase === "break") {
    const finished = TASKS[current - 1].station;
    const station = STATIONS[TASKS[current].station];
    const suspected = suspect(answers.map((value) => value ?? undefined));
    const comparisons = TASKS.flatMap((task, index) => {
      const value = answers[index];
      if (task.station !== finished || value === null) return [];
      const same = sameAnswer(task, index, value, counts);
      return same ? [{ section: task.section, text: same.text }] : [];
    });
    return (
      <section ref={top} className="wrap scroll-mt-6 pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="mx-auto max-w-4xl">
          <RoutingSlip current={-1} done={finished + 1} fresh={finished} />
          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-14">
            <div>
              <h1
                ref={heading}
                tabIndex={-1}
                className="text-[clamp(2.4rem,5.4vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] focus:outline-none"
              >
                Gabinet {STATIONS[finished].numeral} zaliczony.
              </h1>
              <p className="mt-4 text-xl italic text-ink-soft">{typo(STATIONS[finished].next)}</p>

              <div className="mt-10 border-t border-ink pt-5">
                <p className="label text-ink-soft">
                  Następny: pok. {station.room} · Gabinet {station.numeral}
                </p>
                <p className="mt-1 text-2xl font-bold">{station.name}</p>
                <p className="mt-2 max-w-md text-ink-soft">{typo(station.note)}</p>
                <button
                  type="button"
                  onClick={() => setPhase("task")}
                  autoFocus
                  className="btn mt-7 bg-ink text-paper hover:bg-red"
                >
                  Wchodzę <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <aside className="border-t border-ink pt-5" aria-label="Wstępne podejrzenie">
              <p className="label text-ink-soft">Wstępne podejrzenie lekarza</p>
              {suspected ? (
                <>
                  <SpeciesPlate species={suspected.key} animated className="mt-4 w-full max-w-64" />
                  <p className="mt-3 text-2xl font-bold leading-tight">{suspected.name}</p>
                  <p className="mt-1 font-sans text-[0.9rem] text-ink-soft">{typo("Do potwierdzenia w kolejnych gabinetach.")}</p>
                </>
              ) : (
                <p className="mt-4 text-xl leading-snug">{typo("Na razie bez podejrzeń. Instytut zachowuje czujność.")}</p>
              )}
              {comparisons.length > 0 && (
                <div className="mt-10 border-t border-ink pt-5">
                  <p className="label text-ink-soft">Na tle Narodowego Spisu</p>
                  <ul className="mt-2">
                    {comparisons.map((item) => (
                      <li key={item.section} className="border-b border-rule py-2.5 leading-snug">
                        <span className="label block text-ink-faint">{item.section}</span>
                        {typo(item.text)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
          <button type="button" onClick={back} className="label mt-12 py-2 text-ink-soft transition-colors hover:text-ink">
            ← Poprzednie zadanie
          </button>
        </div>
      </section>
    );
  }

  const task = TASKS[current];
  const station = STATIONS[task.station];
  const plate = illustration(task);
  const stationTasks = TASKS.filter((item) => item.station === task.station);

  return (
    <section ref={top} className="wrap scroll-mt-6 pb-16 pt-8 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-5xl">
        <RoutingSlip current={task.station} done={task.station} step={stationTasks.indexOf(task)} />
        <p className="label mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-ink-soft">
          <span>
            pok. {station.room} · {station.name} · {task.section}
          </span>
          <span>
            Zadanie <span className="text-ink">{pad(current + 1)}</span> / {TOTAL}
            {proxy && <span className="text-red"> · wywiad rodzinny</span>}
          </span>
        </p>

        <div key={current} className="animate-question-in">
          <div className="mt-6 flex items-end justify-between gap-6 md:mt-8">
            <h1
              ref={heading}
              tabIndex={-1}
              id="zadanie"
              className="max-w-3xl text-[clamp(1.8rem,4.2vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.01em] focus:outline-none"
            >
              {typo(proxy ? task.proxyPrompt : task.prompt)}
            </h1>
            {plate && <SpeciesPlate species={plate} animated className="hidden w-40 shrink-0 sm:block md:w-48" />}
          </div>
          <div className="mt-8 md:mt-10">
            <TaskBody task={task} proxy={proxy} value={answers[current] ?? undefined} seed={seed + current * 7919} onAnswer={answer} untimed={untimed || reducedMotion} />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button type="button" onClick={back} className="label py-2 text-ink-soft transition-colors hover:text-ink">
            ← {current === 0 ? "Pouczenie" : "Poprzednie zadanie"}
          </button>
          <span className="label hidden text-ink-faint md:inline">Klawisze cyfr wybierają odpowiedź</span>
        </div>
      </div>
    </section>
  );
}
