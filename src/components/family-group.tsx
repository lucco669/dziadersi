"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { familyMembers, type FamilyGroup } from "@/lib/family";
import { ranked } from "@/lib/group";
import { GROUP_LIMIT } from "@/lib/test";
import { formatDate } from "@/lib/typo";
import { Tally } from "./crowd";
import { ShareBar } from "./share-bar";

const COPY = defineCopy({
  pl: {
    expired: "Ten ranking wygasł. Możesz założyć nowy po wykonaniu testu.",
    failed: "Nie udało się odświeżyć listy. Spróbujemy ponownie.",
    offline: "Brak połączenia. Lista odświeży się po jego przywróceniu.",
    kicker: (count: number, limit: number) => `Badanie rodzinne · ${count} z ${limit} miejsc`,
    title: "Kto tu jest dziadersem?",
    lead: "Jeden link dla całej rodziny. Nowe wyniki pojawiają się na tej liście automatycznie.",
    note: (date: string) => `Każdy z linkiem może zobaczyć podpisy i wyniki oraz dołączyć. Ranking jest dostępny do ${date}.`,
    join: "Zrób test i dołącz →",
    own: "Wykonaj własny test →",
    share: "Rodzinny ranking dziaderstwa. Zrób test i dołącz!",
    full: "Komplet osób. Instytut zamyka listę.",
    refresh: "Lista odświeża się co 30 sekund.",
    createFailed: "Nie udało się otworzyć rankingu. Spróbuj ponownie za chwilę. Twój wynik jest zachowany w tym linku.",
    createTitle: "Zbadajcie się całą rodziną.",
    createText: "Utwórz ranking z tym wynikiem. Każdy z linkiem zobaczy podpisy i wyniki. Jeden link, do 12 osób, ważny przez 90 dni.",
    opening: "Otwieranie rankingu…",
    create: "Utwórz ranking rodzinny →",
  },
  sl: {
    expired: "Ta lestvica je potekla. Novo lahko odpreš, ko opraviš test.",
    failed: "Seznama ni bilo mogoče osvežiti. Poskusili bomo znova.",
    offline: "Ni povezave. Seznam se bo osvežil, ko bo povezava spet vzpostavljena.",
    kicker: (count: number, limit: number) => `Družinski pregled · ${count} od ${limit} mest`,
    title: "Kdo je tukaj dziaders?",
    lead: "Ena povezava za vso družino. Novi rezultati se na tem seznamu pojavijo samodejno.",
    note: (date: string) => `Vsak, ki ima povezavo, vidi imena in rezultate ter se lahko pridruži. Lestvica je na voljo do ${date}.`,
    join: "Opravi test in se pridruži →",
    own: "Opravi svoj test →",
    share: "Družinska lestvica dziaderstva. Opravi test in se pridruži!",
    full: "Seznam je poln. Inštitut ga zapira.",
    refresh: "Seznam se osveži vsakih 30 sekund.",
    createFailed: "Lestvice ni bilo mogoče odpreti. Poskusi znova čez trenutek. Tvoj rezultat ostaja shranjen v tej povezavi.",
    createTitle: "Preglejte se vsi v družini.",
    createText: "Ustvari lestvico s tem rezultatom. Vsak, ki ima povezavo, bo videl imena in rezultate. Ena povezava, do 12 oseb, velja 90 dni.",
    opening: "Odpiranje lestvice …",
    create: "Ustvari družinsko lestvico →",
  },
});

export function FamilyRanking({ initial }: { initial: FamilyGroup }) {
  const locale = useLocale();
  const t = COPY[locale];
  const [group, setGroup] = useState(initial);
  const [status, setStatus] = useState("");
  const [expired, setExpired] = useState(false);
  // A full list can't change and an expired one is gone: polling stops for both.
  const startsFull = initial.codes.length >= GROUP_LIMIT;
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
        const next = await response.json() as FamilyGroup;
        if (cancelled) return;
        setGroup(next);
        setStatus("");
        if (next.codes.length >= GROUP_LIMIT) stop();
      } catch {
        if (!cancelled) setStatus(copy.offline);
      }
    }
    const timer = window.setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => { cancelled = true; controller.abort(); stop(); };
  }, [initial.id, initial.expires, startsFull, locale]);
  const members = ranked(familyMembers(group, locale));
  const full = members.length >= GROUP_LIMIT;
  return (
    <div className="wrap pb-20 pt-10 md:pt-16">
      <p className="label text-red">{t.kicker(members.length, GROUP_LIMIT)}</p>
      <h1 className="mt-4 text-[clamp(2.7rem,7vw,5rem)] font-bold leading-none">{t.title}</h1>
      <p className="mt-5 max-w-2xl text-xl leading-snug text-ink-soft">{t.lead}</p>
      <p className="label mt-3 max-w-2xl text-ink-soft">{t.note(formatDate(locale, group.expires, { day: "numeric", month: "numeric", year: "numeric" }))}</p>
      <div className="mt-7 flex flex-wrap items-center gap-5">
        {!expired && !full && <Link href={`/test?rodzina=${group.id}`} className="btn bg-ink text-paper hover:bg-red">{t.join}</Link>}
        {(expired || full) && <Link href="/test" className="btn bg-ink text-paper">{t.own}</Link>}
        {!expired && <ShareBar path={`/grupy/${group.id}`} text={t.share} kind="ranking rodzinny" />}
      </div>
      <p role="status" className="label mt-5 text-ink-soft">{status || (full ? t.full : t.refresh)}</p>
      {!expired && <ol className="mt-8 border-t border-ink">
        {members.map((member, index) => <li key={member.order} className="border-b border-rule">
          <Link href={`/wynik/${member.result.code}`} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 py-5 md:grid-cols-[3rem_minmax(0,1fr)_12rem_5rem]">
            <span className="font-sans text-red">{index + 1}.</span>
            <span className="min-w-0"><strong className="block break-words text-2xl">{member.label}</strong><span className="label mt-1 block text-ink-soft">{member.result.diagnosis.name}</span></span>
            <Tally percent={member.result.score} locale={locale} className="hidden w-full md:block" />
            <strong className="text-right text-3xl tabular-nums">{member.result.score}%</strong>
          </Link>
        </li>)}
      </ol>}
    </div>
  );
}

export function CreateFamilyGroup({ code }: { code: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function create() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/grupy", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, attempt: crypto.randomUUID() }) });
      if (!response.ok) throw new Error();
      // The API answers with the internal path; the ranking opens in the reader's edition.
      const { path } = await response.json() as { path: string };
      window.location.assign(localizePath(path, locale));
    } catch {
      setError(t.createFailed); setBusy(false);
    }
  }
  return <div className="mt-8 border-t border-rule pt-6">
    <h3 className="text-xl font-bold">{t.createTitle}</h3>
    <p className="label mt-2 max-w-xl text-ink-soft">{t.createText}</p>
    <button type="button" onClick={create} disabled={busy} className="btn mt-4 border border-ink hover:bg-ink hover:text-paper disabled:opacity-50">{busy ? t.opening : t.create}</button>
    {error && <p role="alert" className="label mt-3 text-red">{error}</p>}
  </div>;
}
