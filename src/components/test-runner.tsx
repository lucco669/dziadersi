"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { SpeciesKey } from "@/content/species";
import { REGIONS } from "@/content/regions";
import { STATIONS, TASKS, type Task } from "@/content/test";
import { sameAnswer } from "@/lib/answer-stats";
import type { AnswerCounts } from "@/lib/census";
import { DIAGNOSABLE, dayNumber, decodeGroup, encodeResult, evaluate, GROUP_LIMIT, groupPath, suspect } from "@/lib/test";
import { cx, plural, typo } from "@/lib/typo";
import { Seal } from "./brand";
import { SpeciesPlate } from "./pictograms";
import { BlotView, ChoiceView, SmsView } from "./test/choice";
import { InventoryView } from "./test/inventory";
import { MapView } from "./test/map";
import { RapidView } from "./test/rapid";
import { ReflexView } from "./test/reflex";
import { ScaleView } from "./test/scale";
import { Box, Check, useKeys } from "./test/shared";
import { RoutingSlip, RoutingSlipDocument } from "./test/slip";
import { WordsView } from "./test/words";

const TOTAL = TASKS.length;
const PROGRESS_KEY = "ibd-t2";
/** The last own score in this browser, so the census can count retakes without any identifier. */
const LAST_SCORE_KEY = "ibd-ostatni-wynik";
const REGION_OPTIONS = Object.values(REGIONS).sort((a, b) => a.name.localeCompare(b.name, "pl"));

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

type Progress = {
  answers: (number | null)[];
  current: number;
  name: string;
  proxy: boolean;
  seed: number;
  group: string;
  region: string;
};

const noSubscription = () => () => {};

function readProgress(raw: string | null): Progress | null {
  try {
    const progress = raw ? (JSON.parse(raw) as Progress) : null;
    return progress &&
      Array.isArray(progress.answers) &&
      progress.answers.length === TOTAL &&
      progress.current > 0 &&
      progress.current < TOTAL
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

function TaskBody({
  task,
  proxy,
  value,
  seed,
  onAnswer,
}: {
  task: Task;
  proxy: boolean;
  value: number | undefined;
  seed: number;
  onAnswer: (value: number) => void;
}) {
  const props = { proxy, value, seed, onAnswer };
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
  const [phase, setPhase] = useState<"intro" | "task" | "break" | "processing">("intro");
  const [answers, setAnswers] = useState<(number | null)[]>(() => TASKS.map(() => null));
  const [current, setCurrent] = useState(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"self" | "proxy" | null>(null);
  const [seed, setSeed] = useState(1);
  const [group, setGroup] = useState("");
  const [region, setRegion] = useState("");
  const [counts, setCounts] = useState<AnswerCounts | null>(null);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const search = useSyncExternalStore(noSubscription, () => window.location.search, () => "");
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const groupParam = params.get("grupa") ?? "";
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

  // Each new task or room: move focus to it for screen readers, and bring it into view on small screens.
  useEffect(() => {
    if (phase !== "task" && phase !== "break") return;
    heading.current?.focus({ preventScroll: true });
    const rect = top.current?.getBoundingClientRect();
    if (rect && rect.top < 0) top.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [phase, current]);

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
    const nextSeed = Math.floor(Math.random() * 2 ** 31);
    const joined = invite && invite.length < GROUP_LIMIT ? groupParam : "";
    setAnswers(fresh);
    setCurrent(0);
    setSeed(nextSeed);
    setGroup(joined);
    setMode(proxy ? "proxy" : "self");
    setPhase("task");
    writeProgress(null);
    loadCounts();
    track("Test rozpoczęty", { tryb: proxy ? "wywiad" : "osobiście", ranking: joined ? "tak" : "nie" });
  }

  function resume(progress: Progress) {
    setAnswers(progress.answers);
    setCurrent(progress.current);
    setName(progress.name);
    setMode(progress.proxy ? "proxy" : "self");
    setSeed(progress.seed);
    setGroup(progress.group);
    setRegion(progress.region ?? "");
    setPhase("task");
    loadCounts();
  }

  function finish(final: number[]) {
    const draft = { version: 2 as const, answers: final, day: dayNumber(new Date()), name, proxy };
    const code = encodeResult(draft);
    const href = group ? groupPath([...group.split("."), code]) : `/wynik/${code}`;
    const result = evaluate(draft);
    track("Test ukończony", { strefa: result.verdict.label, gatunek: result.diagnosis.name, tryb: proxy ? "wywiad" : "osobiście" });
    record(code, result.score);
    writeProgress(null);
    setPhase("processing");
    window.scrollTo({ top: 0 });
    router.prefetch(href);
    steps.forEach((_, i) => later(400 + i * 480, () => setStep(i + 1)));
    later(400 + steps.length * 480 + 650, () => router.push(href));
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
      body: JSON.stringify({ code, region: region || undefined, previous }),
    }).catch(() => {});
  }

  function answer(value: number) {
    const next = answers.slice();
    next[current] = value;
    setAnswers(next);
    if (current + 1 >= TOTAL) {
      finish(next as number[]);
      return;
    }
    setCurrent(current + 1);
    setPhase(TASKS[current + 1].station !== TASKS[current].station ? "break" : "task");
    writeProgress({ answers: next, current: current + 1, name, proxy, seed, group, region });
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
        name={name}
        setName={setName}
        region={region}
        setRegion={setRegion}
        proxy={proxy}
        setProxy={(value) => setMode(value ? "proxy" : "self")}
        invite={invite}
        saved={saved}
        onStart={start}
        onResume={resume}
      />
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
            <TaskBody task={task} proxy={proxy} value={answers[current] ?? undefined} seed={seed + current * 7919} onAnswer={answer} />
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

function Intro({
  name,
  setName,
  region,
  setRegion,
  proxy,
  setProxy,
  invite,
  saved,
  onStart,
  onResume,
}: {
  name: string;
  setName: (name: string) => void;
  region: string;
  setRegion: (region: string) => void;
  proxy: boolean;
  setProxy: (proxy: boolean) => void;
  invite: ReturnType<typeof evaluate>[] | null;
  saved: Progress | null;
  onStart: (event?: FormEvent) => void;
  onResume: (progress: Progress) => void;
}) {
  const full = invite !== null && invite.length >= GROUP_LIMIT;
  const rules = proxy
    ? [
        "Odpowiadaj tak, jak zachowałaby się osoba badana. Nie tak, jak by chciała.",
        "Osoba badana nie musi o niczym wiedzieć. Na razie.",
        "Wynik jest opinią Instytutu, nie twoją. Tak to przedstaw przy stole.",
      ]
    : [
        "Odpowiadaj szczerze. Instytut i tak się zorientuje.",
        "Nie konsultuj odpowiedzi z rodziną. Rodzina jest stroną w sprawie.",
        "Pierwsza myśl jest zwykle najbardziej dziaderska. Zaufaj jej.",
      ];

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
              "Badanie okresowe w pięciu gabinetach: wywiad, plansze Rorschacha, próba klaksonowa, inwentaryzacja szuflady i seria szybka. Na końcu wynik, rozpoznanie gatunku, wyniki laboratoryjne i certyfikat.",
            )}
          </p>

          {invite && (
            <div className="mt-10 max-w-xl border-t-2 border-red pt-4">
              <p className="label text-red">{full ? "Ranking jest pełny" : "Zaproszenie do rankingu"}</p>
              <ol className="mt-3">
                {invite.slice(0, 5).map((result, i) => (
                  <li key={result.code} className="flex items-baseline justify-between gap-4 border-b border-rule py-2">
                    <span className="font-bold">{result.name || `Osoba badana nr ${i + 1}`}</span>
                    <span className="label text-ink-soft">
                      {result.score}% · {result.diagnosis.name}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="label mt-3 text-ink-soft">
                {full
                  ? typo(`W rankingu jest już ${GROUP_LIMIT} osób. Twój wynik nie zostanie dopisany, ale możesz założyć własny ranking.`)
                  : invite.length > 5
                    ? `I ${invite.length - 5} ${plural(invite.length - 5, "osoba", "osoby", "osób")} więcej. Twój wynik zostanie dopisany na końcu.`
                    : "Twój wynik zostanie dopisany do rankingu."}
              </p>
            </div>
          )}

          <form onSubmit={onStart} className="mt-10">
            <fieldset>
              <legend className="label text-ink-soft">Kogo badamy?</legend>
              <div className="mt-2 max-w-xl border-t border-ink">
                {[
                  { value: false, label: "Siebie", note: "Klasyczne badanie przesiewowe." },
                  { value: true, label: "Kogoś bliskiego", note: "Wywiad rodzinny: odpowiadasz za tatę, wujka albo szefa." },
                ].map((option) => (
                  <label
                    key={option.label}
                    className={cx(
                      "grid cursor-pointer grid-cols-[1fr_1.75rem] items-center gap-4 border-b border-rule py-3.5 pr-1 transition-colors md:grid-cols-[1fr_2rem]",
                      proxy === option.value ? "bg-red/[0.06]" : "hover:bg-paper-deep",
                    )}
                  >
                    <input
                      type="radio"
                      name="tryb"
                      checked={proxy === option.value}
                      onChange={() => setProxy(option.value)}
                      className="sr-only"
                    />
                    <span className="pl-1">
                      <span className="block text-xl font-bold leading-tight">{option.label}</span>
                      <span className="block font-sans text-[0.9rem] text-ink-soft">{option.note}</span>
                    </span>
                    <Box checked={proxy === option.value} className="justify-self-end" />
                  </label>
                ))}
              </div>
            </fieldset>

            <label htmlFor="podpis" className="label mt-10 block text-ink-soft">
              {proxy
                ? "Kogo badasz? (np. Tata, Wujek Zbyszek)"
                : invite && !full
                  ? "Imię do rankingu"
                  : "Imię na certyfikat (nieobowiązkowe)"}
            </label>
            <input
              id="podpis"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={24}
              autoComplete={proxy ? "off" : "given-name"}
              placeholder={proxy ? "np. Tata" : "np. Zenek"}
              className="mt-2 block w-full max-w-md border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-serif text-3xl font-bold placeholder:font-normal placeholder:text-ink/25 focus:border-red focus-visible:outline-none"
            />

            <label htmlFor="wojewodztwo" className="label mt-8 block text-ink-soft">
              {proxy ? "Województwo osoby badanej (nieobowiązkowe)" : "Województwo (nieobowiązkowe)"}
            </label>
            <select
              id="wojewodztwo"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="mt-2 block w-full max-w-md cursor-pointer border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-serif text-xl focus:border-red focus-visible:outline-none"
            >
              <option value="">Nie podaję</option>
              {REGION_OPTIONS.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>

            <ol className="mt-10 max-w-xl border-t border-ink">
              {rules.map((rule, i) => (
                <li key={rule} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-3.5 leading-snug">
                  <span className="font-sans text-[0.9rem] font-semibold text-red">{pad(i + 1)}</span>
                  {typo(rule)}
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="submit" className="btn bg-ink text-paper hover:bg-red">
                {proxy ? "Rozpocznij wywiad" : "Rozpocznij badanie"} <span aria-hidden="true">→</span>
              </button>
              {saved && (
                <button
                  type="button"
                  onClick={() => onResume(saved)}
                  className="btn border border-ink text-ink hover:bg-ink hover:text-paper"
                >
                  Wznów od zadania {saved.current + 1}
                </button>
              )}
            </div>
            <p className="label mt-6 max-w-md text-ink-soft">
              {typo(
                `${TOTAL} zadań, około czterech minut. W gabinecie III jest próba klaksonowa, z dźwiękiem. Odpowiedzi trafiają anonimowo do Narodowego Spisu Dziadersów, bez imienia. Wynik z imieniem jest tylko w linku, którym zdecydujesz się podzielić.`,
              )}
            </p>
          </form>
        </div>

        <aside className="lg:col-span-5" aria-label="Karta obiegowa">
          <RoutingSlipDocument />
        </aside>
      </div>
    </section>
  );
}
