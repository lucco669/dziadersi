"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { getShortTasks, getStations } from "@/content/test";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { track } from "@/lib/analytics";
import { checkNames, readTable, SHORT_LENGTH, tableCapacity, tableCodes, tableMinimum, tablePath, type NameProblem, type TableState } from "@/lib/table";
import { dayNumber, decodeGroup, DIAGNOSABLE, evaluate } from "@/lib/test";
import { cx, plural, pluralSl, typo } from "@/lib/typo";
import { refreshAccount } from "./account";
import { Seal, Stamp } from "./brand";
import { useReducedMotion } from "./hooks";
import { Figure, INK, PAPER } from "./pictograms";
import { Check, useKeys } from "./test/shared";
import { TaskBody } from "./test/task-body";

const STORAGE_KEY = "ibd-stol";

const pad = (value: number) => String(value).padStart(2, "0");

const COPY = defineCopy({
  pl: {
    intro: {
      trail: "Ścieżka",
      home: "Instytut",
      test: "Test Dziadersa",
      title: "Badanie przy stole",
      lead: "Jeden telefon, od dwóch do ośmiu osób. Każdy odpowiada na sześć zadań i podaje telefon dalej. Wyniki Instytut ogłasza wszystkim naraz, w jednym rankingu.",
      list: "Lista obecności",
      person: (number: number) => `Osoba nr ${number}`,
      placeholders: ["np. Wujek Zenek", "np. Ciocia Grażyna", "np. Babcia", "np. Szwagier", "np. Młody", "np. Teść", "np. Kuzynka Ola", "np. Sąsiad"],
      add: "Dopisz osobę",
      remove: (label: string) => `Skreśl: ${label}`,
      problems: {
        invalid: "Imię lub pseudonim, samymi literami. Tego Instytut nie przyjmie na certyfikat.",
        duplicate: "To imię już jest na liście. Dopisz coś, na przykład „Zenek starszy”.",
      } satisfies Record<Exclude<NameProblem, null>, string>,
      few: (minimum: number): string => (minimum > 1 ? "Wpisz co najmniej dwie osoby. Jedna osoba przy stole to zwykły Test Dziadersa." : "Wpisz co najmniej jedną osobę."),
      full: (max: number) => `Przy stole mieści się ${max} ${plural(max, "osoba", "osoby", "osób")}.`,
      joined: (count: number) => `Dosiadacie się do rankingu, w którym ${plural(count, "jest już jedna osoba", `są już ${count} osoby`, `jest już ${count} osób`)}.`,
      closed: "Ten ranking jest pełny. Badanie przy stole założy nowy.",
      untimed: "Bez pośpiechu — bez limitu na odpowiedź",
      start: "Rozpocznij badanie stołu",
      resume: (name: string, task: number) => `Wznów: ${name}, zadanie ${task}`,
      facts: "6 zadań na osobę · około minuty na osobę · imiona zostają w telefonie i w linku do rankingu",
      notice:
        "Odpowiedzi trafiają anonimowo do Narodowego Spisu Dziadersów, bez imion. W zadaniu z klaksonem jest dźwięk. Pełne badanie, szesnaście zadań w pięciu gabinetach, czeka w Teście Dziadersa.",
      full16: "Pełny Test Dziadersa",
      form: "Formularz IBD-T2S",
      card: "Karta badania skróconego",
      instruction: "Sześć zadań z pięciu gabinetów. Bada się jedna osoba naraz, reszta stołu nie podpowiada.",
      room: "Gab.",
      slipFacts: "Wersja skrócona · wynik w procentach · rozpoznanie gatunku",
    },
    handover: {
      first: "Pierwsza osoba badana",
      next: "Następna osoba badana",
      of: (number: number, total: number) => `Osoba ${number} z ${total}`,
      firstNote: "Podaj telefon tej osobie. Reszta stołu nie zagląda przez ramię.",
      nextNote: "Przekaż telefon dalej. Odpowiedzi poprzedniej osoby są zakryte, a jej wynik czeka w zaklejonej kopercie do końca badania.",
      start: "Zaczynam",
      table: "Przy stole",
      examined: "zbadano",
      now: "teraz",
      waiting: "czeka",
      stamp: (name: string) => `${name}: zbadano`,
      back: "Zmień listę obecności",
    },
    task: {
      number: "Zadanie",
      previous: "Poprzednie zadanie",
      handover: "Przekazanie telefonu",
      keys: "Klawisze cyfr wybierają odpowiedź",
    },
    processing: {
      label: "Formularz IBD-T2S · Opracowanie wyników stołu",
      title: "Instytut analizuje wyniki całego stołu.",
      note: "Proszę nie wstawać od stołu.",
      count: "Zliczanie odpowiedzi",
      countDetail: (people: number) => `${people} × ${SHORT_LENGTH}`,
      atlas: "Porównanie z Atlasem Dziadersów",
      atlasDetail: (species: number) => `${species} gatunków`,
      pairs: "Wyliczanie zgodności dziaderskiej",
      pairsDetail: (pairs: number) => `${pairs} ${plural(pairs, "para", "pary", "par")}`,
      ranking: "Układanie rankingu",
      stamp: "Przybijanie pieczątek",
      ready: "gotowe",
    },
  },
  sl: {
    intro: {
      trail: "Pot do strani",
      home: "Inštitut",
      test: "Test dziadersa",
      title: "Pregled za mizo",
      lead: "En telefon, od dveh do osmih oseb. Vsak odgovori na šest nalog in poda telefon naprej. Izvide Inštitut razglasi vsem hkrati, na eni lestvici.",
      list: "Seznam prisotnih",
      person: (number: number) => `Oseba št. ${number}`,
      placeholders: ["npr. Stric Tone", "npr. Teta Marija", "npr. Babica", "npr. Svak", "npr. Mali", "npr. Tast", "npr. Sestrična Maja", "npr. Sosed"],
      add: "Dopiši osebo",
      remove: (label: string) => `Prečrtaj: ${label}`,
      problems: {
        invalid: "Ime ali vzdevek, samo s črkami. Tega Inštitut ne sprejme na certifikat.",
        duplicate: "To ime je že na seznamu. Dopiši kaj, na primer »Tone starejši«.",
      } satisfies Record<Exclude<NameProblem, null>, string>,
      few: (minimum: number): string => (minimum > 1 ? "Vpiši vsaj dve osebi. Ena oseba za mizo je navaden test dziadersa." : "Vpiši vsaj eno osebo."),
      full: (max: number) => `Za mizo je prostora za ${max} ${pluralSl(max, "osebo", "osebi", "osebe", "oseb")}.`,
      joined: (count: number) => `Prisedate k lestvici, na kateri ${pluralSl(count, "je že ena oseba", `sta že ${count} osebi`, `so že ${count} osebe`, `je že ${count} oseb`)}.`,
      closed: "Ta lestvica je polna. Pregled za mizo bo odprl novo.",
      untimed: "Brez naglice – brez časovne omejitve za odgovor",
      start: "Začni pregled mize",
      resume: (name: string, task: number) => `Nadaljuj: ${name}, naloga ${task}`,
      facts: "6 nalog na osebo · približno minuta na osebo · imena ostanejo v telefonu in v povezavi do lestvice",
      notice:
        "Odgovori gredo anonimno v Nacionalni popis dziadersov, brez imen. Naloga s hupo ima zvok. Celoten pregled, šestnajst nalog v petih ordinacijah, čaka v testu dziadersa.",
      full16: "Celoten test dziadersa",
      form: "Obrazec IBD-T2S",
      card: "List skrajšanega pregleda",
      instruction: "Šest nalog iz petih ordinacij. Pregleduje se ena oseba naenkrat, ostali za mizo ne prišepetavajo.",
      room: "Ord.",
      slipFacts: "Skrajšana različica · rezultat v odstotkih · diagnoza vrste",
    },
    handover: {
      first: "Prva preiskovana oseba",
      next: "Naslednja preiskovana oseba",
      of: (number: number, total: number) => `Oseba ${number} od ${total}`,
      firstNote: "Podaj telefon tej osebi. Ostali za mizo ne kukajo čez ramo.",
      nextNote: "Podaj telefon naprej. Odgovori prejšnje osebe so skriti, njen izvid pa do konca pregleda čaka v zapečateni kuverti.",
      start: "Začenjam",
      table: "Za mizo",
      examined: "pregledano",
      now: "zdaj",
      waiting: "čaka",
      stamp: (name: string) => `${name}: pregledano`,
      back: "Spremeni seznam prisotnih",
    },
    task: {
      number: "Naloga",
      previous: "Prejšnja naloga",
      handover: "Predaja telefona",
      keys: "Odgovor izbereš s številskimi tipkami",
    },
    processing: {
      label: "Obrazec IBD-T2S · Obdelava izvidov mize",
      title: "Inštitut analizira izvide vse mize.",
      note: "Prosimo, ne vstajajte od mize.",
      count: "Štetje odgovorov",
      countDetail: (people: number) => `${people} × ${SHORT_LENGTH}`,
      atlas: "Primerjava z Atlasom dziadersov",
      atlasDetail: (species: number) => `${species} ${pluralSl(species, "vrsta", "vrsti", "vrste", "vrst")}`,
      pairs: "Izračun dziaderske združljivosti",
      pairsDetail: (pairs: number) => `${pairs} ${pluralSl(pairs, "par", "para", "pari", "parov")}`,
      ranking: "Urejanje lestvice",
      stamp: "Žigosanje",
      ready: "opravljeno",
    },
  },
});

const noSubscription = () => () => {};

function save(state: TableState | null) {
  try {
    if (state) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage: the table is still examined, it just can't resume after a reload.
  }
}

/** The people at the table as figures: examined, holding the phone, waiting. */
function TableRow({ names, person, label }: { names: string[]; person: number; label: string }) {
  return (
    <svg viewBox={`0 0 ${names.length * 44} 108`} className="h-20 max-w-full md:h-24" role="img" aria-label={label}>
      {names.map((name, i) => (
        <g key={name} transform={`translate(${i * 44 + 2} 2)`} opacity={i > person ? 0.3 : 1}>
          <Figure color={PAPER} cutout={INK} right={i === person ? "phone" : "down"} />
          {i === person && <rect x={4} y={102} width={32} height={4} className="fill-red" />}
        </g>
      ))}
    </svg>
  );
}

export function TableRunner() {
  const router = useRouter();
  const locale = useLocale();
  const t = COPY[locale];
  const tasks = getShortTasks(locale);
  const stations = getStations(locale);
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<TableState | null>(null);
  const [draftNames, setDraftNames] = useState<string[]>(["", "", ""]);
  const [checked, setChecked] = useState(false);
  const [untimed, setUntimed] = useState(false);
  const [processing, setProcessing] = useState<{ people: number; step: number } | null>(null);
  const timers = useRef<number[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const top = useRef<HTMLElement>(null);

  const search = useSyncExternalStore(noSubscription, () => window.location.search, () => "");
  const groupParam = useMemo(() => new URLSearchParams(search).get("grupa") ?? "", [search]);
  const invite = useMemo(() => decodeGroup(groupParam), [groupParam]);
  const joining = invite !== null && tableCapacity(groupParam) >= 1;
  const capacity = tableCapacity(joining ? groupParam : "");
  const minimum = tableMinimum(joining ? groupParam : "");

  const savedRaw = useSyncExternalStore(
    noSubscription,
    () => {
      try {
        return sessionStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    },
    () => null,
  );
  // Once this page has started or dropped a table, what storage held when it loaded is no longer resumable.
  const [touched, setTouched] = useState(false);
  const saved = useMemo(() => (touched ? null : readTable(savedRaw)), [savedRaw, touched]);

  const phase = processing ? "processing" : !state ? "intro" : state.handover ? "handover" : "task";

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  useEffect(() => {
    document.body.classList.toggle("test-active", phase !== "intro");
    return () => document.body.classList.remove("test-active");
  }, [phase]);

  // Each new screen: focus its heading for screen readers and bring it into view on small screens.
  useEffect(() => {
    if (phase === "intro") return;
    heading.current?.focus({ preventScroll: true });
    const rect = top.current?.getBoundingClientRect();
    if (rect && rect.top < 0) top.current?.scrollIntoView({ block: "start", behavior: reducedMotion ? "instant" : "smooth" });
  }, [phase, state?.person, state?.task, reducedMotion]);

  function update(next: TableState) {
    setTouched(true);
    setState(next);
    save(next);
  }

  const names = checkNames(draftNames.slice(0, capacity), minimum);

  function start(event: FormEvent) {
    event.preventDefault();
    setChecked(true);
    if (!names.ok) return;
    const group = joining ? groupParam : "";
    update({
      names: names.names,
      answers: names.names.map(() => []),
      person: 0,
      task: 0,
      handover: true,
      seed: crypto.getRandomValues(new Uint32Array(1))[0] >>> 1,
      attempts: names.names.map(() => crypto.randomUUID()),
      untimed,
      group,
    });
    track("Badanie przy stole rozpoczęte", { osoby: names.names.length, ranking: group ? "tak" : "nie", tempo: untimed || reducedMotion ? "spokojne" : "standardowe" });
  }

  function answer(value: number) {
    if (!state) return;
    const answers = state.answers.map((list) => list.slice());
    answers[state.person][state.task] = value;
    if (state.task + 1 < SHORT_LENGTH) {
      update({ ...state, answers, task: state.task + 1 });
      return;
    }
    answers[state.person] = answers[state.person].slice(0, SHORT_LENGTH);
    if (state.person + 1 < state.names.length) {
      update({ ...state, answers, person: state.person + 1, task: 0, handover: true });
      return;
    }
    finish({ ...state, answers });
  }

  function finish(final: TableState) {
    const day = dayNumber(new Date());
    const codes = tableCodes(final, day);
    codes.forEach((code, i) => {
      // Analytics count in Polish labels, so both editions add up to the same statistics.
      const result = evaluate({ version: 3, answers: final.answers[i], day }, "pl");
      track("Test ukończony", { strefa: result.verdict.label, gatunek: result.diagnosis.name, tryb: "przy stole" });
      // Into the anonymous census, without the name. Fire and forget: the ranking doesn't wait.
      fetch("/api/wyniki", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code, attempt: final.attempts[i] }),
      })
        .then((response) => {
          if (!response.ok) track("Spis: zapis odrzucony", { status: response.status });
          if (i === 0) void refreshAccount();
        })
        .catch(() => track("Spis: zapis odrzucony", { status: 0 }));
    });
    save(null);
    setState(null);
    const steps = 5;
    setProcessing({ people: codes.length, step: 0 });
    window.scrollTo({ top: 0 });
    const target = localizePath(tablePath(codes, final.group), locale);
    router.prefetch(target);
    for (let i = 1; i <= steps; i++) timers.current.push(window.setTimeout(() => setProcessing((p) => p && { ...p, step: i }), 400 + (i - 1) * 520));
    timers.current.push(window.setTimeout(() => router.push(target), reducedMotion ? 0 : 400 + steps * 520 + 700));
  }

  function back() {
    if (!state) return;
    if (state.handover) {
      // Only before anyone has answered: later handovers never reopen someone else's answers.
      if (state.person === 0) {
        setTouched(true);
        setDraftNames(state.names);
        save(null);
        setState(null);
      }
      return;
    }
    if (state.task === 0) update({ ...state, handover: true });
    else update({ ...state, task: state.task - 1 });
  }

  useKeys(
    (key, event) => {
      if (key === "backspace" && phase === "task") {
        event.preventDefault();
        back();
      } else if (phase === "handover" && key === "enter" && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault();
        if (state) update({ ...state, handover: false });
      }
    },
    phase === "task" || phase === "handover",
  );

  if (phase === "processing" && processing) {
    const p = t.processing;
    const steps = [
      { label: p.count, detail: p.countDetail(processing.people) },
      { label: p.atlas, detail: p.atlasDetail(DIAGNOSABLE.length) },
      { label: p.pairs, detail: p.pairsDetail((processing.people * (processing.people - 1)) / 2) },
      { label: p.ranking, detail: p.ready },
      { label: p.stamp, detail: p.ready },
    ];
    return (
      <section className="wrap py-14 md:py-24">
        <div className="mx-auto max-w-2xl" role="status" aria-live="polite">
          <p className="label text-ink-soft">{p.label}</p>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">{p.title}</h1>
          <p className="mt-4 text-2xl italic text-ink-soft">{p.note}</p>
          <ol className="mt-12 border-t border-ink">
            {steps.map((item, i) => (
              <li
                key={item.label}
                className={cx(
                  "grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 border-b border-rule py-4 transition-opacity duration-300",
                  i < processing.step ? "opacity-100" : i === processing.step ? "opacity-60" : "opacity-25",
                )}
              >
                <span className="text-red">{i < processing.step ? <Check /> : i === processing.step ? "…" : ""}</span>
                <span className="text-lg">{item.label}</span>
                <span className="label text-ink-soft">{i < processing.step ? item.detail : ""}</span>
              </li>
            ))}
          </ol>
          {processing.step >= steps.length && <Seal locale={locale} className="mx-auto mt-12 block size-36 animate-stamp text-red [--stamp-rotate:-12deg]" />}
        </div>
      </section>
    );
  }

  if (phase === "handover" && state) {
    const h = t.handover;
    const name = state.names[state.person];
    const previous = state.person > 0 ? state.names[state.person - 1] : null;
    return (
      <section ref={top} className="scroll-mt-0 bg-ink text-paper">
        <div className="wrap flex min-h-[calc(100svh-4rem)] flex-col justify-center py-12 md:py-20">
          <div className="mx-auto w-full max-w-3xl">
            {previous && (
              <Stamp tone="paper" className="mb-10 animate-stamp [--stamp-rotate:-4deg]">
                {h.stamp(previous)}
              </Stamp>
            )}
            <p className="label text-paper/60">
              {previous ? h.next : h.first} · {h.of(state.person + 1, state.names.length)}
            </p>
            <h1
              ref={heading}
              tabIndex={-1}
              className="mt-4 break-words text-[clamp(3.2rem,14vw,7rem)] font-bold leading-[0.9] tracking-[-0.03em] focus:outline-none"
            >
              {name}
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-snug text-paper/75">{typo(previous ? h.nextNote : h.firstNote)}</p>
            <button
              type="button"
              autoFocus
              onClick={() => update({ ...state, handover: false })}
              className="btn mt-9 bg-paper text-ink hover:bg-red hover:text-paper"
            >
              {h.start} <span aria-hidden="true">→</span>
            </button>

            <div className="mt-14 border-t border-paper/25 pt-5">
              <p className="label text-paper/60">{h.table}</p>
              <div className="mt-4">
                <TableRow names={state.names} person={state.person} label={h.table} />
              </div>
              <ol className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[0.95rem]">
                {state.names.map((item, i) => (
                  <li key={item} className={cx(i > state.person && "text-paper/50", i === state.person && "underline decoration-red decoration-2 underline-offset-4")}>
                    {item}{" "}
                    <span className="text-paper/50">· {i < state.person ? h.examined : i === state.person ? h.now : h.waiting}</span>
                  </li>
                ))}
              </ol>
            </div>
            {state.person === 0 && (
              <button type="button" onClick={back} className="label mt-10 py-2 text-paper/60 transition-colors hover:text-paper">
                ← {h.back}
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (phase === "task" && state) {
    const task = tasks[state.task];
    const station = stations[task.station];
    const name = state.names[state.person];
    return (
      <section ref={top} className="wrap scroll-mt-6 pb-16 pt-8 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <ol aria-hidden="true" className="flex gap-1.5">
            {tasks.map((item, i) => (
              <li key={item.section} className={cx("h-1.5 flex-1", i < state.task ? "bg-ink" : i === state.task ? "bg-red" : "bg-ink/15")} />
            ))}
          </ol>
          <p className="label mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-ink-soft">
            <span>
              <span className="font-semibold text-ink">{name}</span> · {station.name} · {task.section}
            </span>
            <span>
              {t.task.number} <span className="text-ink">{pad(state.task + 1)}</span> / {pad(SHORT_LENGTH)}
            </span>
          </p>
          <div key={`${state.person}-${state.task}`} className="animate-question-in">
            <h1
              ref={heading}
              tabIndex={-1}
              id="zadanie"
              className="mt-6 max-w-3xl text-[clamp(1.8rem,4.2vw,2.9rem)] font-bold leading-[1.08] tracking-[-0.01em] focus:outline-none md:mt-8"
            >
              {typo(task.prompt)}
            </h1>
            <div className="mt-8 md:mt-10">
              <TaskBody
                task={task}
                proxy={false}
                value={state.answers[state.person][state.task]}
                seed={state.seed + state.person * 104_729 + state.task * 7919}
                onAnswer={answer}
                untimed={state.untimed || reducedMotion}
              />
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between gap-4">
            <button type="button" onClick={back} className="label py-2 text-ink-soft transition-colors hover:text-ink">
              ← {state.task === 0 ? t.task.handover : t.task.previous}
            </button>
            <span className="label hidden text-ink-faint md:inline">{t.task.keys}</span>
          </div>
        </div>
      </section>
    );
  }

  const i = t.intro;
  const shown = draftNames.slice(0, capacity);
  return (
    <section className="wrap pb-16 pt-6 md:pb-24 md:pt-12">
      <nav aria-label={i.trail} className="label text-ink-soft">
        <Link href="/" className="link">{i.home}</Link>
        <span className="mx-2">/</span>
        <Link href="/test" className="link">{i.test}</Link>
        <span className="mx-2">/</span>
        {i.title}
      </nav>
      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="break-words text-[clamp(2.25rem,11vw,2.75rem)] font-bold leading-[0.95] tracking-[-0.02em] sm:text-[clamp(2.75rem,7.4vw,6rem)]">{i.title}</h1>
          <p className="mt-4 max-w-xl text-xl leading-snug text-ink-soft">{typo(i.lead)}</p>
          {saved && (
            <button type="button" onClick={() => setState(saved)} className="btn mt-6 border border-ink hover:bg-ink hover:text-paper">
              {i.resume(saved.names[saved.person], saved.task + 1)}
            </button>
          )}
          <form onSubmit={start} noValidate className="mt-8 max-w-xl">
            <fieldset>
              <legend className="label text-ink-soft">{i.list}</legend>
              {invite && <p className="label mt-3 border-l-2 border-red pl-3 text-ink-soft">{joining ? i.joined(invite.length) : i.closed}</p>}
              <ol className="mt-3 border-t border-ink">
                {shown.map((value, n) => {
                  const problem = checked ? names.problems[n] : null;
                  return (
                    <li key={n} className="border-b border-rule">
                      <div className="grid grid-cols-[2rem_1fr_auto] items-center gap-3">
                        <span className="font-sans text-[0.9rem] font-semibold text-red">{pad(n + 1)}</span>
                        <input
                          value={value}
                          onChange={(event) => setDraftNames(shown.map((item, k) => (k === n ? event.target.value : item)))}
                          maxLength={24}
                          autoComplete="off"
                          enterKeyHint={n + 1 < shown.length ? "next" : "done"}
                          aria-label={i.person(n + 1)}
                          aria-invalid={problem ? true : undefined}
                          aria-describedby={problem ? `osoba-${n}-blad` : undefined}
                          placeholder={i.placeholders[n % i.placeholders.length]}
                          className="w-full min-w-0 bg-transparent py-3.5 text-2xl placeholder:text-ink-faint focus-visible:outline-none"
                        />
                        {shown.length > minimum ? (
                          <button
                            type="button"
                            onClick={() => setDraftNames(shown.filter((_, k) => k !== n))}
                            aria-label={i.remove(value.trim() || i.person(n + 1))}
                            className="flex size-10 items-center justify-center text-ink-soft transition-colors hover:text-red"
                          >
                            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
                            </svg>
                          </button>
                        ) : (
                          <span className="size-10" />
                        )}
                      </div>
                      {problem && (
                        <p id={`osoba-${n}-blad`} className="label pb-3 pl-11 text-red">
                          {i.problems[problem]}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
              {checked && names.few && (
                <p role="alert" className="label mt-3 border-l-2 border-red pl-3 text-red">
                  {i.few(minimum)}
                </p>
              )}
              {shown.length < capacity ? (
                <button type="button" onClick={() => setDraftNames([...shown, ""])} className="link mt-3 py-2 font-sans">
                  + {i.add}
                </button>
              ) : (
                <p className="label mt-3 py-2 text-ink-soft">{i.full(capacity)}</p>
              )}
            </fieldset>
            <label className="label mt-4 flex cursor-pointer items-center gap-3 py-2">
              <input type="checkbox" checked={untimed} onChange={(event) => setUntimed(event.target.checked)} className="size-5 accent-red" />
              {i.untimed}
            </label>
            <button type="submit" className="btn mt-5 bg-ink text-paper hover:bg-red">
              {i.start} <span aria-hidden="true">→</span>
            </button>
            <p className="label mt-3 text-ink-soft">{i.facts}</p>
            <p className="mt-7 max-w-xl border-t border-rule pt-4 font-sans text-[0.9rem] leading-snug text-ink-soft">
              {typo(i.notice)}{" "}
              <Link href="/test" className="link text-ink">{i.full16} →</Link>
            </p>
          </form>
        </div>
        <aside className="lg:col-span-5" aria-label={i.card}>
          <figure className="border border-ink bg-card p-2">
            <div className="border border-ink px-5 pb-5 pt-4 md:px-6">
              <p className="label flex justify-between gap-4 text-ink-soft">
                <span>{i.form}</span>
                <span>{pad(SHORT_LENGTH)}</span>
              </p>
              <p className="mt-4 text-[1.9rem] font-bold leading-none">{i.card}</p>
              <p className="mt-2 italic text-ink-soft">{typo(i.instruction)}</p>
              <ol className="mt-5 border-t border-ink">
                {tasks.map((task, n) => (
                  <li key={task.section} className="grid grid-cols-[2.2rem_3.4rem_1fr] items-baseline gap-2 border-b border-rule py-2.5">
                    <span className="font-sans text-[0.85rem] font-semibold text-red">{pad(n + 1)}</span>
                    <span className="label text-ink-soft">{i.room} {stations[task.station].numeral}</span>
                    <span className="font-bold leading-tight">{task.section}</span>
                  </li>
                ))}
              </ol>
              <p className="label mt-4 text-ink-faint">{i.slipFacts}</p>
            </div>
          </figure>
        </aside>
      </div>
    </section>
  );
}
