"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { cleanDepartments, cleanNickname, cleanTeamName, DEPARTMENT_LIMIT, DEPARTMENT_MAX, docket, TEAM_LIMIT, TEAM_NAME_MAX, teamReport, type TeamGroup } from "@/lib/team";
import { decodeResult, evaluate } from "@/lib/test";
import { cx, formatDate, plural, pluralSl, typo } from "@/lib/typo";
import { ShareBar } from "./share-bar";
import { CommissionVerdict, DepartmentTable, TeamFacts, TeamRoster } from "./team-report";

const COPY = defineCopy({
  pl: {
    kicker: "Badanie okresowe zespołu",
    sign: (sign: string) => `Sygn. ${sign}`,
    lead: (count: number) =>
      count === 0
        ? `Skierowanie wystawione. Nikt jeszcze nie przeszedł badania. Miejsc: ${TEAM_LIMIT}.`
        : `Przebadano ${count} z ${TEAM_LIMIT} ${plural(TEAM_LIMIT, "osoby", "osób", "osób")}. Wyniki pojawiają się tu same, bez odświeżania.`,
    note: (date: string) => `Każdy z linkiem zobaczy pseudonimy, działy i wyniki oraz może dołączyć. Badanie jest dostępne do ${date}.`,
    join: "Wykonaj test i dołącz",
    own: "Wykonaj własny test",
    report: "Raport dla działu kadr",
    share: (name: string) => `${name}: badanie okresowe zespołu w Instytucie Badań nad Dziaderstwem. Zrób test i dołącz.`,
    full: "Komplet 50 osób. Instytut zamyka listę.",
    refresh: "Lista odświeża się co 30 sekund.",
    expired: "To badanie wygasło. Dział kadr może zamówić nowe.",
    failed: "Nie udało się odświeżyć listy. Spróbujemy ponownie.",
    offline: "Brak połączenia. Lista odświeży się po jego przywróceniu.",
    verdict: "Orzeczenie",
    departments: "Zestawienie według działów",
    departmentsAside: (count: number) => `${count} ${plural(count, "dział", "działy", "działów")}`,
    facts: "Ustalenia",
    roster: "Lista obecności",
    rosterAside: (count: number) => `${count} z ${TEAM_LIMIT}`,
    waiting: "Orzeczenie zapadnie po pierwszym badaniu. Wyślij link zespołowi: na czacie firmowym, w mailu albo, zgodnie z tradycją, na callu.",
    pending: "Komisja orzeka od trzech osób. Na razie zbiera materiał dowodowy.",
  },
  sl: {
    kicker: "Obdobni pregled kolektiva",
    sign: (sign: string) => `Opr. št. ${sign}`,
    lead: (count: number) =>
      count === 0
        ? `Napotnica je izdana. Pregleda še ni opravil nihče. Mest: ${TEAM_LIMIT}.`
        : `Pregledanih ${count} od ${TEAM_LIMIT} oseb. Rezultati se tu pojavijo sami, brez osveževanja.`,
    note: (date: string) => `Vsak, ki ima povezavo, vidi vzdevke, oddelke in rezultate ter se lahko pridruži. Pregled je na voljo do ${date}.`,
    join: "Opravi test in se pridruži",
    own: "Opravi svoj test",
    report: "Poročilo za kadrovsko službo",
    share: (name: string) => `${name}: obdobni pregled kolektiva pri Inštitutu za raziskave dziaderstva. Opravi test in se pridruži.`,
    full: "Vseh 50 mest je zasedenih. Inštitut zapira seznam.",
    refresh: "Seznam se osveži vsakih 30 sekund.",
    expired: "Ta pregled je potekel. Kadrovska služba lahko naroči novega.",
    failed: "Seznama ni bilo mogoče osvežiti. Poskusili bomo znova.",
    offline: "Ni povezave. Seznam se bo osvežil, ko bo povezava spet vzpostavljena.",
    verdict: "Odločba",
    departments: "Pregled po oddelkih",
    departmentsAside: (count: number) => `${count} ${pluralSl(count, "oddelek", "oddelka", "oddelki", "oddelkov")}`,
    facts: "Ugotovitve",
    roster: "Seznam prisotnih",
    rosterAside: (count: number) => `${count} od ${TEAM_LIMIT}`,
    waiting: "Odločba bo izdana po prvem pregledu. Pošlji povezavo kolektivu: v firmini klepet, po mejlu ali, po stari navadi, na callu.",
    pending: "Komisija odloča od treh oseb naprej. Zaenkrat zbira dokazno gradivo.",
  },
});

/** The commission rules once three people are in: one or two results say more about them than about the team. */
const QUORUM = 3;

export function TeamCheckup({ initial }: { initial: TeamGroup }) {
  const locale = useLocale();
  const t = COPY[locale];
  const [team, setTeam] = useState(initial);
  const [status, setStatus] = useState("");
  const [expired, setExpired] = useState(false);
  const startsFull = initial.entries.length >= TEAM_LIMIT;
  useEffect(() => {
    if (startsFull) return;
    let cancelled = false;
    const controller = new AbortController();
    const copy = COPY[locale];
    function stop() {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    }
    async function refresh() {
      if (document.hidden) return;
      if (Date.parse(initial.expires) <= Date.now()) { stop(); setExpired(true); setStatus(copy.expired); return; }
      try {
        const response = await fetch(`/api/grupy/${initial.id}`, { cache: "no-store", signal: controller.signal });
        if (cancelled) return;
        if (response.status === 404) { stop(); setExpired(true); setStatus(copy.expired); return; }
        if (!response.ok) { setStatus(copy.failed); return; }
        const next = await response.json() as TeamGroup;
        if (cancelled || next.kind !== "team") return;
        setTeam(next);
        setStatus("");
        if (next.entries.length >= TEAM_LIMIT) stop();
      } catch {
        if (!cancelled) setStatus(copy.offline);
      }
    }
    const timer = window.setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => { cancelled = true; controller.abort(); stop(); };
  }, [initial.id, initial.expires, startsFull, locale]);

  const report = useMemo(() => teamReport(team, locale), [team, locale]);
  const count = report.members.length;
  const full = count >= TEAM_LIMIT;
  const path = `/zespol/${team.id}`;

  return (
    <>
      <header className="wrap pb-6 pt-10 md:pt-16">
        <p className="label text-red">{t.kicker} · <span className="whitespace-nowrap">{t.sign(docket(team))}</span></p>
        <h1 className="mt-4 break-words text-[clamp(2.4rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.02em]">{team.name}</h1>
        <p className="mt-5 max-w-2xl text-xl leading-snug text-ink-soft">{typo(t.lead(count))}</p>
        <p className="label mt-3 max-w-2xl text-ink-soft">{t.note(formatDate(locale, team.expires, { day: "numeric", month: "numeric", year: "numeric" }))}</p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          {!expired && !full && <Link href={`/test?zespol=${team.id}`} className="btn bg-ink text-paper hover:bg-red">{t.join} <span aria-hidden="true">→</span></Link>}
          {(expired || full) && <Link href="/test" className="btn bg-ink text-paper">{t.own}</Link>}
          {!expired && count > 0 && <Link href={`${path}/raport`} className="btn border border-ink hover:bg-ink hover:text-paper">{t.report}</Link>}
          {!expired && <ShareBar path={path} text={t.share(team.name)} kind="badanie zespołu" />}
        </div>
        <p role="status" className="label mt-5 text-ink-soft">{status || (full ? t.full : t.refresh)}</p>
      </header>

      {!expired && count === 0 && (
        <section className="wrap pb-20">
          <p className="max-w-2xl border-l-2 border-red pl-4 text-lg">{typo(t.waiting)}</p>
          {team.departments.length > 0 && <DepartmentTable rows={report.rows} locale={locale} />}
        </section>
      )}

      {!expired && count > 0 && (
        <>
          <section aria-labelledby="orzeczenie" className="wrap scroll-mt-6 py-12 md:py-16">
            <h2 id="orzeczenie" className="sr-only">{t.verdict}</h2>
            <div className="border-t border-ink pt-6">
              {report.verdict && count >= QUORUM ? (
                <CommissionVerdict verdict={report.verdict} locale={locale} heading="h3" />
              ) : (
                <p className="max-w-2xl border-l-2 border-red pl-4 text-lg">{typo(t.pending)}</p>
              )}
            </div>
          </section>

          <Section id="dzialy" title={t.departments} aside={team.departments.length ? t.departmentsAside(team.departments.length) : undefined}>
            <DepartmentTable rows={report.rows} locale={locale} />
          </Section>

          {count >= 2 && (
            <Section id="ustalenia" title={t.facts}>
              <TeamFacts report={report} locale={locale} />
            </Section>
          )}

          <Section id="lista" title={t.roster} aside={t.rosterAside(count)}>
            <TeamRoster members={report.order} departments={team.departments} locale={locale} />
          </Section>
        </>
      )}
    </>
  );
}

function Section({ id, title, aside, children }: { id: string; title: string; aside?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="wrap scroll-mt-6 py-12 md:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-ink pt-5">
        <h2 id={id} className="text-[clamp(1.85rem,3.4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.015em]">{title}</h2>
        {aside && <p className="label text-ink-soft">{aside}</p>}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

const ORDER_COPY = defineCopy({
  pl: {
    name: "Nazwa zespołu lub firmy",
    namePlaceholder: "np. Biuro Rachunkowe Kaczmarek",
    nameError: "Podaj nazwę zespołu: litery, cyfry, do 60 znaków.",
    departments: "Działy (nieobowiązkowe)",
    departmentsHint: `Do ${DEPARTMENT_LIMIT} działów. Każdy badany wybierze swój. Bez działów zespół jest jednym działem.`,
    department: (number: number) => `Dział ${number}`,
    departmentPlaceholders: ["Księgowość", "IT", "Zarząd", "Sprzedaż", "Kadry", "Marketing", "Logistyka", "Recepcja"],
    add: "Dodaj dział",
    remove: (name: string) => `Usuń dział ${name}`,
    duplicate: "Dwa działy mają tę samą nazwę.",
    yours: (score: number) => `Twój wynik (${score}%) zostanie dopisany jako pierwszy.`,
    nickname: "Twój pseudonim w zespole",
    nicknamePlaceholder: "np. Marek z IT",
    nicknameError: "Podaj pseudonim: litery i spacje, do 24 znaków.",
    yourDepartment: "Twój dział",
    choose: "Wybierz dział",
    departmentError: "Wybierz swój dział.",
    privacy: "Każdy, kto dostanie link, zobaczy pseudonimy, działy i wyniki oraz będzie mógł dołączyć. Bez konta. Link działa 90 dni, potem dane są usuwane.",
    submit: "Wystaw skierowanie",
    busy: "Wystawianie skierowania…",
    failed: "Nie udało się wystawić skierowania. Spróbuj ponownie za chwilę.",
    limited: "Za dużo skierowań z tej sieci. Spróbuj ponownie za kilka minut.",
  },
  sl: {
    name: "Ime kolektiva ali podjetja",
    namePlaceholder: "npr. Računovodski servis Kovač",
    nameError: "Vpiši ime kolektiva: črke, številke, do 60 znakov.",
    departments: "Oddelki (neobvezno)",
    departmentsHint: `Do ${DEPARTMENT_LIMIT} oddelkov. Vsak pregledani izbere svojega. Brez oddelkov je kolektiv en sam oddelek.`,
    department: (number: number) => `Oddelek ${number}`,
    departmentPlaceholders: ["Računovodstvo", "IT", "Uprava", "Prodaja", "Kadrovska", "Marketing", "Logistika", "Recepcija"],
    add: "Dodaj oddelek",
    remove: (name: string) => `Odstrani oddelek ${name}`,
    duplicate: "Dva oddelka imata enako ime.",
    yours: (score: number) => `Tvoj rezultat (${score} %) bo vpisan prvi.`,
    nickname: "Tvoj vzdevek v kolektivu",
    nicknamePlaceholder: "npr. Marko iz IT",
    nicknameError: "Vpiši vzdevek: črke in presledki, do 24 znakov.",
    yourDepartment: "Tvoj oddelek",
    choose: "Izberi oddelek",
    departmentError: "Izberi svoj oddelek.",
    privacy: "Vsak, ki dobi povezavo, vidi vzdevke, oddelke in rezultate ter se lahko pridruži. Brez računa. Povezava velja 90 dni, nato se podatki izbrišejo.",
    submit: "Izdaj napotnico",
    busy: "Izdajanje napotnice …",
    failed: "Napotnice ni bilo mogoče izdati. Poskusi znova čez trenutek.",
    limited: "Iz tega omrežja je bilo izdanih preveč napotnic. Poskusi znova čez nekaj minut.",
  },
});

const noSubscription = () => () => {};

/** The order form at /zespol. With ?kod= (from a result page) the person ordering joins first. */
export function TeamOrderForm() {
  const locale = useLocale();
  const t = ORDER_COPY[locale];
  const search = useSyncExternalStore(noSubscription, () => window.location.search, () => "");
  const code = useMemo(() => new URLSearchParams(search).get("kod") ?? "", [search]);
  const own = useMemo(() => {
    const draft = code ? decodeResult(code) : null;
    return draft ? evaluate(draft, locale) : null;
  }, [code, locale]);
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState<string[]>(["", "", ""]);
  /** null until typed in: then it shows the certificate's name, when there is one. */
  const [typedNickname, setNickname] = useState<string | null>(null);
  const [mine, setMine] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const nickname = typedNickname ?? own?.name ?? "";

  const cleaned = cleanDepartments(departments);
  /** What the select offers: the departments as they will be stored, in order. */
  const listed = cleaned ?? [];
  const nameOk = Boolean(cleanTeamName(name));
  const nicknameOk = !own || Boolean(cleanNickname(nickname));
  const departmentOk = !own || listed.length === 0 || (mine !== "" && Number(mine) < listed.length);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    if (busy || !nameOk || !cleaned || !nicknameOk || !departmentOk) return;
    setBusy(true);
    setError("");
    try {
      const body = {
        kind: "team",
        name: cleanTeamName(name),
        departments: cleaned,
        ...(own ? { code: own.code, nickname: cleanNickname(nickname), department: cleaned.length ? Number(mine) : null, attempt: crypto.randomUUID() } : {}),
      };
      const response = await fetch("/api/grupy", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(response.status === 429 ? "limited" : "failed");
      const { path } = await response.json() as { path: string };
      track("Badanie zespołu", { akcja: "zamówione", dzialy: cleaned.length, z_wynikiem: own ? "tak" : "nie" });
      window.location.assign(localizePath(path, locale));
    } catch (failure) {
      setError(failure instanceof Error && failure.message === "limited" ? t.limited : t.failed);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl">
      <label htmlFor="zespol-nazwa" className="label block">{t.name}</label>
      <input
        id="zespol-nazwa"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={TEAM_NAME_MAX}
        autoComplete="organization"
        placeholder={t.namePlaceholder}
        aria-invalid={touched && !nameOk}
        aria-describedby={touched && !nameOk ? "zespol-nazwa-blad" : undefined}
        className="mt-2 w-full border-b-2 border-ink bg-transparent py-3 text-[clamp(1.6rem,5vw,2.2rem)] font-bold focus:border-red focus-visible:outline-none"
      />
      {touched && !nameOk && <p id="zespol-nazwa-blad" className="label mt-2 text-red">{t.nameError}</p>}

      <fieldset className="mt-10">
        <legend className="label">{t.departments}</legend>
        <p className="label mt-1 text-ink-soft">{t.departmentsHint}</p>
        <ol className="mt-3 border-t border-rule">
          {departments.map((value, i) => (
            <li key={i} className="flex items-center gap-3 border-b border-rule">
              <span className="w-7 font-sans text-[0.9rem] font-semibold text-red">{i + 1}.</span>
              <input
                value={value}
                onChange={(event) => setDepartments(departments.map((item, j) => (j === i ? event.target.value : item)))}
                maxLength={DEPARTMENT_MAX}
                aria-label={t.department(i + 1)}
                placeholder={t.departmentPlaceholders[i]}
                className="min-w-0 flex-1 bg-transparent py-3 text-xl focus:outline-none focus-visible:bg-paper-deep"
              />
              {departments.length > 1 && (
                <button type="button" onClick={() => { setDepartments(departments.filter((_, j) => j !== i)); setMine(""); }} className="label px-2 py-2 text-ink-soft hover:text-red" aria-label={t.remove(value || t.department(i + 1))}>
                  ×
                </button>
              )}
            </li>
          ))}
        </ol>
        {departments.length < DEPARTMENT_LIMIT && (
          <button type="button" onClick={() => setDepartments([...departments, ""])} className="link mt-3 font-sans">+ {t.add}</button>
        )}
        {!cleaned && <p role="alert" className="label mt-2 text-red">{t.duplicate}</p>}
      </fieldset>

      {own && (
        <fieldset className="mt-10 border-l-2 border-red pl-4">
          <legend className="sr-only">{t.nickname}</legend>
          <p className="font-bold">{typo(t.yours(own.score))}</p>
          <label htmlFor="zespol-pseudonim" className="label mt-5 block">{t.nickname}</label>
          <input
            id="zespol-pseudonim"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            maxLength={24}
            autoComplete="nickname"
            placeholder={t.nicknamePlaceholder}
            aria-invalid={touched && !nicknameOk}
            className="mt-2 w-full border-b-2 border-ink bg-transparent py-2 text-2xl focus:border-red focus-visible:outline-none"
          />
          {touched && !nicknameOk && <p className="label mt-2 text-red">{t.nicknameError}</p>}
          {listed.length > 0 && (
            <>
              <label htmlFor="zespol-moj-dzial" className="label mt-5 block">{t.yourDepartment}</label>
              <select id="zespol-moj-dzial" value={mine} onChange={(event) => setMine(event.target.value)} aria-invalid={touched && !departmentOk} className="mt-2 w-full border-b-2 border-ink bg-transparent py-2 text-xl focus:border-red focus-visible:outline-none">
                <option value="">{t.choose}</option>
                {listed.map((item, i) => <option key={`${i}-${item}`} value={i}>{item}</option>)}
              </select>
              {touched && !departmentOk && <p className="label mt-2 text-red">{t.departmentError}</p>}
            </>
          )}
        </fieldset>
      )}

      <p className="label mt-8 max-w-xl text-ink-soft">{t.privacy}</p>
      <button disabled={busy} className="btn mt-6 bg-ink text-paper hover:bg-red disabled:opacity-50">
        {busy ? t.busy : t.submit} {!busy && <span aria-hidden="true">→</span>}
      </button>
      {error && <p role="alert" className="label mt-3 text-red">{error}</p>}
    </form>
  );
}

const OFFER_COPY = defineCopy({
  pl: {
    title: "A jak wypada twoje biuro?",
    text: "Badanie okresowe zespołu: do 50 osób, działy, orzeczenie Komisji i raport dla działu kadr z pieczątką. Twój wynik wejdzie jako pierwszy.",
    cta: "Zamów badanie zespołu",
  },
  sl: {
    title: "Kako pa se odreže tvoja pisarna?",
    text: "Obdobni pregled kolektiva: do 50 oseb, oddelki, odločba Komisije in poročilo za kadrovsko službo z žigom. Tvoj rezultat bo vpisan prvi.",
    cta: "Naroči pregled kolektiva",
  },
});

/** Next to "Utwórz ranking rodzinny" on a result page. */
export function TeamOffer({ code, className }: { code: string; className?: string }) {
  const t = OFFER_COPY[useLocale()];
  return (
    <div className={cx("border-t border-rule pt-6", className)}>
      <h3 className="text-xl font-bold">{t.title}</h3>
      <p className="label mt-2 max-w-xl text-ink-soft">{t.text}</p>
      <Link href={`/zespol?kod=${encodeURIComponent(code)}`} className="btn mt-4 border border-ink hover:bg-ink hover:text-paper">{t.cta} <span aria-hidden="true">→</span></Link>
    </div>
  );
}
