"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { familyMembers, type FamilyGroup } from "@/lib/family";
import { ranked } from "@/lib/group";
import { GROUP_LIMIT } from "@/lib/test";
import { Tally } from "./crowd";
import { ShareBar } from "./share-bar";

export function FamilyRanking({ initial }: { initial: FamilyGroup }) {
  const [group, setGroup] = useState(initial);
  const [status, setStatus] = useState("");
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function refresh() {
      if (document.hidden) return;
      try {
        const response = await fetch(`/api/grupy/${initial.id}`, { cache: "no-store", signal: controller.signal });
        if (cancelled) return;
        if (response.status === 404) { setExpired(true); setStatus("Ten ranking wygasł. Możesz założyć nowy po wykonaniu testu."); return; }
        if (!response.ok) { setStatus("Nie udało się odświeżyć listy. Spróbujemy ponownie."); return; }
        const next = await response.json() as FamilyGroup;
        if (!cancelled) { setGroup(next); setStatus(""); }
      } catch {
        if (!cancelled) setStatus("Brak połączenia. Lista odświeży się po jego przywróceniu.");
      }
    }
    const timer = window.setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => { cancelled = true; controller.abort(); window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [initial.id]);
  const members = ranked(familyMembers(group));
  const full = members.length >= GROUP_LIMIT;
  return (
    <div className="wrap pb-20 pt-10 md:pt-16">
      <p className="label text-red">Badanie rodzinne · {members.length} z {GROUP_LIMIT} miejsc</p>
      <h1 className="mt-4 text-[clamp(2.7rem,7vw,5rem)] font-bold leading-none">Kto tu jest dziadersem?</h1>
      <p className="mt-5 max-w-2xl text-xl leading-snug text-ink-soft">Jeden link dla całej rodziny. Nowe wyniki pojawiają się na tej liście automatycznie.</p>
      <p className="label mt-3 max-w-2xl text-ink-soft">Każdy z linkiem może zobaczyć podpisy i wyniki oraz dołączyć. Ranking jest dostępny do {new Date(group.expires).toLocaleDateString("pl-PL", { timeZone: "Europe/Warsaw" })}.</p>
      <div className="mt-7 flex flex-wrap items-center gap-5">
        {!expired && !full && <Link href={`/test?rodzina=${group.id}`} className="btn bg-ink text-paper hover:bg-red">Zrób test i dołącz →</Link>}
        {(expired || full) && <Link href="/test" className="btn bg-ink text-paper">Wykonaj własny test →</Link>}
        {!expired && <ShareBar path={`/grupy/${group.id}`} text="Rodzinny ranking dziaderstwa. Zrób test i dołącz!" kind="ranking rodzinny" />}
      </div>
      <p role="status" className="label mt-5 text-ink-soft">{status || (full ? "Komplet osób. Instytut zamyka listę." : "Lista odświeża się co 30 sekund.")}</p>
      {!expired && <ol className="mt-8 border-t border-ink">
        {members.map((member, index) => <li key={member.order} className="border-b border-rule">
          <Link href={`/wynik/${member.result.code}`} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 py-5 md:grid-cols-[3rem_minmax(0,1fr)_12rem_5rem]">
            <span className="font-sans text-red">{index + 1}.</span>
            <span className="min-w-0"><strong className="block break-words text-2xl">{member.label}</strong><span className="label mt-1 block text-ink-soft">{member.result.diagnosis.name}</span></span>
            <Tally percent={member.result.score} className="hidden w-full md:block" />
            <strong className="text-right text-3xl tabular-nums">{member.result.score}%</strong>
          </Link>
        </li>)}
      </ol>}
    </div>
  );
}

export function CreateFamilyGroup({ code }: { code: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function create() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/grupy", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, attempt: crypto.randomUUID() }) });
      if (!response.ok) throw new Error();
      const { path } = await response.json() as { path: string };
      window.location.assign(path);
    } catch {
      setError("Nie udało się otworzyć rankingu. Spróbuj ponownie za chwilę. Twój wynik jest zachowany w tym linku."); setBusy(false);
    }
  }
  return <div className="mt-8 border-t border-rule pt-6">
    <h3 className="text-xl font-bold">Zbadajcie się całą rodziną.</h3>
    <p className="label mt-2 max-w-xl text-ink-soft">Utwórz ranking z tym wynikiem. Każdy z linkiem zobaczy podpisy i wyniki. Jeden link, do 12 osób, ważny przez 90 dni.</p>
    <button type="button" onClick={create} disabled={busy} className="btn mt-4 border border-ink hover:bg-ink hover:text-paper disabled:opacity-50">{busy ? "Otwieranie rankingu…" : "Utwórz ranking rodzinny →"}</button>
    {error && <p role="alert" className="label mt-3 text-red">{error}</p>}
  </div>;
}
