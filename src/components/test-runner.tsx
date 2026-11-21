"use client";

import { track } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import type { SpeciesKey } from "@/content/species";
import { getStations, getTasks, TASKS, type Task } from "@/content/test";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { sameAnswer } from "@/lib/answer-stats";
import type { AnswerCounts } from "@/lib/census";
import { cleanName, DIAGNOSABLE, dayNumber, decodeGroup, encodeResult, evaluate, GROUP_LIMIT, groupPath, suspect } from "@/lib/test";
import { cx, pluralSl, typo } from "@/lib/typo";
import { readProgress, type Progress } from "@/lib/test-progress";
import { isFamilyId } from "@/lib/write-policy";
import { refreshAccount } from "./account";
import { Seal } from "./brand";
import { SpeciesPlate } from "./pictograms";
import { Check, useKeys } from "./test/shared";
import { RoutingSlip } from "./test/slip";
import { TaskBody } from "./test/task-body";
import { TestIntro as Intro } from "./test/intro";
import { useReducedMotion } from "./hooks";

const TOTAL = TASKS.length;
const PROGRESS_KEY = "ibd-t2";
/** The last own score in this browser, so the census can count retakes without any identifier. */
const LAST_SCORE_KEY = "ibd-ostatni-wynik";

const pad = (value: number) => String(value).padStart(2, "0");

const COPY = defineCopy({
  pl: {
    steps: {
      count: "Zliczanie odpowiedzi",
      countDetail: (total: number) => `${total} z ${total}`,
      plates: "Interpretacja plansz Rorschacha",
      platesDetail: "3 plansze",
      atlas: "Porównanie z Atlasem Dziadersów",
      atlasDetail: (species: number) => `${species} gatunków`,
      lab: "Wyniki laboratoryjne",
      labDetail: "13 parametrów",
      ranking: "Dopisywanie do rankingu",
      stamp: "Przybijanie pieczątki",
      ready: "gotowe",
    },
    errors: {
      full: "Ranking ma już komplet 12 osób. Twój wynik jest gotowy.",
      expired: "Zaproszenie wygasło. Twój wynik jest gotowy.",
      failed: "Nie udało się dopisać do rankingu. Spróbuj ponownie lub odbierz wynik bez dołączania.",
      offline: "Brak połączenia z rankingiem. Spróbuj ponownie lub odbierz wynik bez dołączania.",
      teamFull: "Zespół ma już komplet 50 osób. Twój wynik jest gotowy.",
      teamExpired: "Badanie zespołu wygasło. Twój wynik jest gotowy.",
      taken: "Ten pseudonim jest już zajęty w zespole. Wybierz inny.",
      nickname: "Podaj pseudonim: litery i spacje, do 24 znaków.",
      department: "Wybierz swój dział.",
    },
    details: {
      label: "Wszystkie gabinety zaliczone",
      title: "Na kogo wystawić certyfikat?",
      name: "Imię lub pseudonim (nieobowiązkowe)",
      placeholderProxy: "np. Tata",
      placeholder: "np. Zenek",
      shared: "Wynik i podpis będą widoczne dla każdego, kto ma link do rankingu. Możesz pozostawić podpis pusty.",
      private: "Podpis trafi do linku i na certyfikat. Możesz pozostawić to pole puste.",
      wait: "Chwileczkę…",
      collectAndJoin: "Odbierz wynik i dołącz do rankingu",
      collect: "Odbierz wynik",
      withoutJoining: "Pokaż wynik bez dołączania",
      teamTitle: (team: string) => `Pod jakim pseudonimem występujesz w zespole ${team}?`,
      teamTitlePlain: "Pod jakim pseudonimem występujesz w zespole?",
      nickname: "Pseudonim (trafi też na certyfikat)",
      nicknamePlaceholder: "np. Marek z IT",
      department: "Twój dział",
      choose: "Wybierz dział",
      teamShared: "Pseudonim, dział i wynik zobaczy każdy, kto ma link zespołu.",
      collectAndJoinTeam: "Odbierz wynik i dopisz się do zespołu",
    },
    processing: {
      label: "Formularz IBD-T2 · Opracowanie wyników",
      title: "Instytut analizuje wyniki.",
      proxy: "Proszę nie mówić nic osobie badanej.",
      self: "Proszę nie zamykać okna i nie wzywać rodziny.",
    },
    pause: {
      done: (numeral: string) => `Gabinet ${numeral} zaliczony.`,
      next: (room: string, numeral: string) => `Następny: pok. ${room} · Gabinet ${numeral}`,
      enter: "Wchodzę",
      suspicion: "Wstępne podejrzenie",
      suspicionLabel: "Wstępne podejrzenie lekarza",
      confirm: "Do potwierdzenia w kolejnych gabinetach.",
      none: "Na razie bez podejrzeń. Instytut zachowuje czujność.",
      census: "Na tle Narodowego Spisu",
    },
    task: {
      room: "pok.",
      number: "Zadanie",
      proxy: " · wywiad rodzinny",
      intro: "Pouczenie",
      previous: "Poprzednie zadanie",
      keys: "Klawisze cyfr wybierają odpowiedź",
    },
  },
  sl: {
    steps: {
      count: "Štetje odgovorov",
      countDetail: (total: number) => `${total} od ${total}`,
      plates: "Razlaga Rorschachovih tabel",
      platesDetail: "3 table",
      atlas: "Primerjava z Atlasom dziadersov",
      atlasDetail: (species: number) => `${species} ${pluralSl(species, "vrsta", "vrsti", "vrste", "vrst")}`,
      lab: "Laboratorijski izvidi",
      labDetail: "13 parametrov",
      ranking: "Vpis na lestvico",
      stamp: "Žigosanje",
      ready: "opravljeno",
    },
    errors: {
      full: "Lestvica je že polna, na njej je 12 oseb. Tvoj izvid je pripravljen.",
      expired: "Vabilo je poteklo. Tvoj izvid je pripravljen.",
      failed: "Vpis na lestvico ni uspel. Poskusi znova ali prevzemi izvid brez pridružitve.",
      offline: "Z lestvico ni povezave. Poskusi znova ali prevzemi izvid brez pridružitve.",
      teamFull: "Kolektiv je že poln, v njem je 50 oseb. Tvoj izvid je pripravljen.",
      teamExpired: "Pregled kolektiva je potekel. Tvoj izvid je pripravljen.",
      taken: "Ta vzdevek je v kolektivu že zaseden. Izberi drugega.",
      nickname: "Vpiši vzdevek: črke in presledki, do 24 znakov.",
      department: "Izberi svoj oddelek.",
    },
    details: {
      label: "Vse ordinacije opravljene",
      title: "Na čigavo ime izdamo certifikat?",
      name: "Ime ali vzdevek (neobvezno)",
      placeholderProxy: "npr. Oči",
      placeholder: "npr. Tone",
      shared: "Izvid in podpis bosta vidna vsakomur, ki ima povezavo do lestvice. Podpis lahko pustiš prazen.",
      private: "Podpis bo v povezavi in na certifikatu. To polje lahko pustiš prazno.",
      wait: "Trenutek …",
      collectAndJoin: "Prevzemi izvid in se pridruži lestvici",
      collect: "Prevzemi izvid",
      withoutJoining: "Pokaži izvid brez pridružitve",
      teamTitle: (team: string) => `Pod katerim vzdevkom nastopaš v kolektivu ${team}?`,
      teamTitlePlain: "Pod katerim vzdevkom nastopaš v kolektivu?",
      nickname: "Vzdevek (bo tudi na certifikatu)",
      nicknamePlaceholder: "npr. Marko iz IT",
      department: "Tvoj oddelek",
      choose: "Izberi oddelek",
      teamShared: "Vzdevek, oddelek in izvid vidi vsak, ki ima povezavo do kolektiva.",
      collectAndJoinTeam: "Prevzemi izvid in se vpiši v kolektiv",
    },
    processing: {
      label: "Obrazec IBD-T2 · Obdelava izvidov",
      title: "Inštitut analizira izvide.",
      proxy: "Prosimo, preiskovani osebi ne povej ničesar.",
      self: "Prosimo, ne zapiraj okna in ne kliči sorodnikov.",
    },
    pause: {
      done: (numeral: string) => `Ordinacija ${numeral} opravljena.`,
      next: (room: string, numeral: string) => `Naslednja: soba ${room} · Ordinacija ${numeral}`,
      enter: "Vstopam",
      suspicion: "Začetni sum",
      suspicionLabel: "Zdravnikov začetni sum",
      confirm: "Potrditev sledi v naslednjih ordinacijah.",
      none: "Zaenkrat brez suma. Inštitut ostaja na preži.",
      census: "V primerjavi z Nacionalnim popisom",
    },
    task: {
      room: "soba",
      number: "Naloga",
      proxy: " · heteroanamneza",
      intro: "Navodila",
      previous: "Prejšnja naloga",
      keys: "Odgovor izbereš s številskimi tipkami",
    },
  },
});

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

export function TestRunner() {
  const router = useRouter();
  const locale = useLocale();
  const t = COPY[locale];
  const tasks = getTasks(locale);
  const stations = getStations(locale);
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
  /** `family` holds an office team's id: then a nickname and department are asked at the end. */
  const [team, setTeam] = useState(false);
  const [teamInfo, setTeamInfo] = useState<{ name: string; departments: string[] } | null>(null);
  const [department, setDepartment] = useState("");
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
  const teamParam = params.get("zespol") ?? "";
  const invite = useMemo(() => decodeGroup(groupParam), [groupParam]);
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

  // The team's name and departments for the last screen; the join works without them (no departments).
  useEffect(() => {
    if (!team || !family || teamInfo || phase === "intro") return;
    let cancelled = false;
    fetch(`/api/grupy/${family}`, { cache: "no-store" })
      .then((response) => (response.ok ? (response.json() as Promise<{ kind?: string; name?: string; departments?: string[] }>) : null))
      .then((data) => {
        if (!cancelled && data?.kind === "team") setTeamInfo({ name: data.name ?? "", departments: data.departments ?? [] });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [team, family, teamInfo, phase]);

  const steps = [
    { label: t.steps.count, detail: t.steps.countDetail(TOTAL) },
    { label: t.steps.plates, detail: t.steps.platesDetail },
    { label: t.steps.atlas, detail: t.steps.atlasDetail(DIAGNOSABLE.length) },
    { label: t.steps.lab, detail: t.steps.labDetail },
    ...(group || team ? [{ label: t.steps.ranking, detail: t.steps.ready }] : []),
    { label: t.steps.stamp, detail: t.steps.ready },
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
    const teamId = isFamilyId(teamParam) ? teamParam : "";
    setFamily(isFamilyId(familyParam) ? familyParam : teamId);
    setTeam(!isFamilyId(familyParam) && Boolean(teamId));
    setTeamInfo(null);
    setDepartment("");
    setAttempt(crypto.randomUUID());
    completedRooms.current = [];
    setMode(proxy ? "proxy" : "self");
    setPhase("task");
    writeProgress(null);
    loadCounts();
    track("Test rozpoczęty", { tryb: proxy ? "wywiad" : "osobiście", ranking: joined || isFamilyId(familyParam) ? "tak" : isFamilyId(teamParam) ? "zespół" : "nie", tempo: untimed || reducedMotion ? "spokojne" : "standardowe" });
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
    setTeam(Boolean(progress.family && progress.team));
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
      const departments = teamInfo?.departments ?? [];
      if (team && !cleanName(name)) { setFinishError(t.errors.nickname); setFinishing(false); return; }
      if (team && departments.length > 0 && department === "") { setFinishError(t.errors.department); setFinishing(false); return; }
      const body = team
        ? { code, attempt, nickname: cleanName(name), department: departments.length > 0 ? Number(department) : null }
        : { code, attempt };
      try {
        const response = await fetch(`/api/grupy/${family}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
        if (!response.ok) {
          const reason = response.status === 409 ? ((await response.json().catch(() => null)) as { status?: string } | null)?.status : undefined;
          setFinishError(
            reason === "taken" ? t.errors.taken
              : response.status === 409 ? (team ? t.errors.teamFull : t.errors.full)
                : response.status === 404 ? (team ? t.errors.teamExpired : t.errors.expired)
                  : t.errors.failed,
          );
          setFinishing(false);
          return;
        }
        href = team ? `/zespol/${family}` : `/grupy/${family}`;
      } catch {
        setFinishError(t.errors.offline);
        setFinishing(false);
        return;
      }
    }
    // Analytics count in Polish labels, so both editions add up to the same statistics.
    const result = evaluate(draft, "pl");
    track("Test ukończony", { strefa: result.verdict.label, gatunek: result.diagnosis.name, tryb: proxy ? "wywiad" : "osobiście" });
    record(code, result.score);
    writeProgress(null);
    setPhase("processing");
    window.scrollTo({ top: 0 });
    const target = localizePath(href, locale);
    router.prefetch(target);
    steps.forEach((_, i) => later(400 + i * 480, () => setStep(i + 1)));
    later(reducedMotion ? 0 : 400 + steps.length * 480 + 650, () => router.push(target));
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
      .then((response) => {
        // The visitor never sees this fail, so analytics has to: a broken census shows up as these events.
        if (!response.ok) track("Spis: zapis odrzucony", { status: response.status });
        void refreshAccount();
      })
      .catch(() => track("Spis: zapis odrzucony", { status: 0 }));
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
    writeProgress({ answers: next, current: current + 1, name, proxy, seed, group, region, untimed, attempt, family, team, rooms: completedRooms.current });
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
        family={isFamilyId(familyParam) || isFamilyId(teamParam)}
        team={!isFamilyId(familyParam) && isFamilyId(teamParam)}
      />
    );
  }

  if (phase === "details") {
    return (
      <section ref={top} className="wrap py-10 md:py-16">
        <form className="mx-auto max-w-xl" onSubmit={(event) => { event.preventDefault(); void finish(answers as number[]); }}>
          <p className="label text-red">{t.details.label}</p>
          <h1 ref={heading} tabIndex={-1} className="mt-4 break-words text-4xl font-bold leading-tight focus:outline-none">
            {team ? (teamInfo?.name ? t.details.teamTitle(teamInfo.name) : t.details.teamTitlePlain) : t.details.title}
          </h1>
          <label htmlFor="podpis" className="label mt-7 block">{team ? t.details.nickname : t.details.name}</label>
          <input id="podpis" value={name} onChange={(event) => setName(event.target.value)} maxLength={24} autoComplete={team ? "nickname" : "off"} required={team} placeholder={team ? t.details.nicknamePlaceholder : proxy ? t.details.placeholderProxy : t.details.placeholder} className="mt-2 w-full border-b-2 border-ink bg-transparent py-3 text-3xl focus:border-red focus-visible:outline-none" />
          {team && teamInfo && teamInfo.departments.length > 0 && (
            <>
              <label htmlFor="dzial" className="label mt-7 block">{t.details.department}</label>
              <select id="dzial" value={department} onChange={(event) => setDepartment(event.target.value)} required className="mt-2 w-full border-b-2 border-ink bg-transparent py-3 text-2xl focus:border-red focus-visible:outline-none">
                <option value="">{t.details.choose}</option>
                {teamInfo.departments.map((item, i) => <option key={item} value={i}>{item}</option>)}
              </select>
            </>
          )}
          <p className="label mt-4 text-ink-soft">{team ? t.details.teamShared : family || group ? t.details.shared : t.details.private}</p>
          {finishError && <p role="alert" className="mt-5 border-l-2 border-red pl-4">{finishError}</p>}
          <button disabled={finishing} className="btn mt-7 bg-ink text-paper hover:bg-red disabled:opacity-50">{finishing ? t.details.wait : team ? t.details.collectAndJoinTeam : family ? t.details.collectAndJoin : t.details.collect}</button>
          {finishError && <button type="button" disabled={finishing} onClick={() => void finish(answers as number[], true)} className="link mt-5 block font-sans">{t.details.withoutJoining}</button>}
        </form>
      </section>
    );
  }

  if (phase === "processing") {
    return (
      <section className="wrap py-14 md:py-24">
        <div className="mx-auto max-w-2xl" role="status" aria-live="polite">
          <p className="label text-ink-soft">{t.processing.label}</p>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            {t.processing.title}
          </h1>
          <p className="mt-4 text-2xl italic text-ink-soft">
            {proxy ? t.processing.proxy : t.processing.self}
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
            <Seal locale={locale} className="mx-auto mt-12 block size-36 animate-stamp text-red [--stamp-rotate:-12deg]" />
          )}
        </div>
      </section>
    );
  }

  if (phase === "break") {
    const finished = tasks[current - 1].station;
    const station = stations[tasks[current].station];
    const suspected = suspect(answers.map((value) => value ?? undefined), locale);
    const comparisons = tasks.flatMap((task, index) => {
      const value = answers[index];
      if (task.station !== finished || value === null) return [];
      const same = sameAnswer(task, index, value, counts, locale);
      return same ? [{ section: task.section, text: same.text }] : [];
    });
    return (
      <section ref={top} className="wrap scroll-mt-6 pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="mx-auto max-w-4xl">
          <RoutingSlip locale={locale} current={-1} done={finished + 1} fresh={finished} />
          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-14">
            <div>
              <h1
                ref={heading}
                tabIndex={-1}
                className="text-[clamp(2.4rem,5.4vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em] focus:outline-none"
              >
                {t.pause.done(stations[finished].numeral)}
              </h1>
              <p className="mt-4 text-xl italic text-ink-soft">{typo(stations[finished].next)}</p>

              <div className="mt-10 border-t border-ink pt-5">
                <p className="label text-ink-soft">
                  {t.pause.next(station.room, station.numeral)}
                </p>
                <p className="mt-1 text-2xl font-bold">{station.name}</p>
                <p className="mt-2 max-w-md text-ink-soft">{typo(station.note)}</p>
                <button
                  type="button"
                  onClick={() => setPhase("task")}
                  autoFocus
                  className="btn mt-7 bg-ink text-paper hover:bg-red"
                >
                  {t.pause.enter} <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <aside className="border-t border-ink pt-5" aria-label={t.pause.suspicion}>
              <p className="label text-ink-soft">{t.pause.suspicionLabel}</p>
              {suspected ? (
                <>
                  <SpeciesPlate locale={locale} species={suspected.key} animated className="mt-4 w-full max-w-64" />
                  <p className="mt-3 text-2xl font-bold leading-tight">{suspected.name}</p>
                  <p className="mt-1 font-sans text-[0.9rem] text-ink-soft">{typo(t.pause.confirm)}</p>
                </>
              ) : (
                <p className="mt-4 text-xl leading-snug">{typo(t.pause.none)}</p>
              )}
              {comparisons.length > 0 && (
                <div className="mt-10 border-t border-ink pt-5">
                  <p className="label text-ink-soft">{t.pause.census}</p>
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
            ← {t.task.previous}
          </button>
        </div>
      </section>
    );
  }

  const task = tasks[current];
  const station = stations[task.station];
  const plate = illustration(task);
  const stationTasks = tasks.filter((item) => item.station === task.station);

  return (
    <section ref={top} className="wrap scroll-mt-6 pb-16 pt-8 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-5xl">
        <RoutingSlip locale={locale} current={task.station} done={task.station} step={stationTasks.indexOf(task)} />
        <p className="label mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-ink-soft">
          <span>
            {t.task.room} {station.room} · {station.name} · {task.section}
          </span>
          <span>
            {t.task.number} <span className="text-ink">{pad(current + 1)}</span> / {TOTAL}
            {proxy && <span className="text-red">{t.task.proxy}</span>}
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
            {plate && <SpeciesPlate locale={locale} species={plate} animated className="hidden w-40 shrink-0 sm:block md:w-48" />}
          </div>
          <div className="mt-8 md:mt-10">
            <TaskBody task={task} proxy={proxy} value={answers[current] ?? undefined} seed={seed + current * 7919} onAnswer={answer} untimed={untimed || reducedMotion} />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <button type="button" onClick={back} className="label py-2 text-ink-soft transition-colors hover:text-ink">
            ← {current === 0 ? t.task.intro : t.task.previous}
          </button>
          <span className="label hidden text-ink-faint md:inline">{t.task.keys}</span>
        </div>
      </div>
    </section>
  );
}
