"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { REGIONS } from "@/content/regions";
import { evaluate, GROUP_LIMIT } from "@/lib/test";
import { cx, typo } from "@/lib/typo";
import { TASKS } from "@/content/test";
import { TestProfileNote } from "../profile-notes";
import type { Progress } from "@/lib/test-progress";
import { Box } from "./shared";
import { RoutingSlipDocument } from "./slip";

const regions = Object.values(REGIONS).sort((a, b) => a.name.localeCompare(b.name, "pl"));

export function TestIntro({ region, setRegion, proxy, setProxy, invite, saved, onStart, onResume, untimed, setUntimed, family }: {
  region: string;
  setRegion: (region: string) => void;
  proxy: boolean;
  setProxy: (proxy: boolean) => void;
  invite: ReturnType<typeof evaluate>[] | null;
  saved: Progress | null;
  onStart: (event?: FormEvent) => void;
  onResume: (progress: Progress) => void;
  untimed: boolean;
  setUntimed: (value: boolean) => void;
  family: boolean;
}) {
  const full = invite !== null && invite.length >= GROUP_LIMIT;
  return (
    <section className="wrap pb-16 pt-6 md:pb-24 md:pt-12">
      <nav aria-label="Ścieżka" className="label text-ink-soft"><Link href="/" className="link">Instytut</Link><span className="mx-2">/</span>Test Dziadersa</nav>
      <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(2.75rem,7.4vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em]">Test Dziadersa</h1>
          <p className="mt-4 max-w-xl text-xl leading-snug text-ink-soft">{typo("Pięć gabinetów, cztery minuty. Na końcu rozpoznanie i certyfikat, który możesz pokazać rodzinie.")}</p>
          <form onSubmit={onStart} className="mt-6">
            <fieldset>
              <legend className="label text-ink-soft">Kogo badamy?</legend>
              <div className="mt-2 grid max-w-xl grid-cols-2 border-y border-ink">
                {[{ value: false, label: "Siebie" }, { value: true, label: "Kogoś bliskiego" }].map((option) => (
                  <label key={option.label} className={cx("relative flex cursor-pointer items-center justify-between gap-2 px-3 py-4 focus-within:outline-2 focus-within:outline-red", proxy === option.value ? "bg-red/[0.06]" : "hover:bg-paper-deep")}>
                    <input type="radio" name="tryb" checked={proxy === option.value} onChange={() => setProxy(option.value)} className="sr-only" />
                    <span className="text-lg font-bold">{option.label}</span><Box checked={proxy === option.value} />
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="label mt-4 flex cursor-pointer items-center gap-3 py-2">
              <input type="checkbox" checked={untimed} onChange={(event) => setUntimed(event.target.checked)} className="size-5 accent-red" />Bez pośpiechu — bez limitu na odpowiedź
            </label>
            {untimed && <p className="label mt-1 text-ink-soft">Próba klaksonowa nadal mierzy czas reakcji. Samodzielnie decydujesz, kiedy ją zakończyć.</p>}
            {(family || invite) && <p className="label mt-3 border-l-2 border-red pl-3 text-ink-soft">{family ? "Dołączasz do rankingu rodzinnego. Podpis i wynik będą widoczne dla osób z linkiem. Podpis podasz na końcu." : full ? "Ten ranking jest pełny. Możesz wykonać własne badanie." : "Dołączasz do rankingu. Podpis podasz na końcu badania."}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="submit" className="btn bg-ink text-paper hover:bg-red">{proxy ? "Rozpocznij wywiad" : "Rozpocznij badanie"}<span aria-hidden="true">→</span></button>
              {saved && <button type="button" onClick={() => onResume(saved)} className="link py-3 font-sans">{saved.current === TASKS.length ? "Odbierz gotowy wynik" : `Wznów od zadania ${saved.current + 1}`}</button>}
            </div>
            <p className="label mt-3 text-ink-soft">16 zadań · bez konta · imię dopiero na końcu</p>
            <details className="mt-7 max-w-xl border-y border-rule py-4">
              <summary className="cursor-pointer font-sans text-sm">Przed badaniem i dane opcjonalne</summary>
              <p className="mt-4 leading-snug">{typo(proxy ? "Odpowiadaj tak, jak zachowałaby się osoba badana. Nie tak, jak by chciała." : "Odpowiadaj szczerze. Nie konsultuj odpowiedzi z rodziną. Rodzina jest stroną w sprawie.")}</p>
              <label htmlFor="wojewodztwo" className="label mt-5 block">Województwo (nieobowiązkowe)</label>
              <select id="wojewodztwo" value={region} onChange={(event) => setRegion(event.target.value)} className="mt-2 w-full border-b border-ink bg-transparent py-3">
                <option value="">Nie podaję</option>{regions.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
              </select>
              <p className="label mt-5 text-ink-soft">W gabinecie III jest klakson z dźwiękiem. Odpowiedzi trafiają anonimowo do Narodowego Spisu Dziadersów, bez podpisu. Podpis jest częścią linku do wyniku.</p>
            </details>
            <TestProfileNote />
          </form>
        </div>
        <aside className="lg:col-span-5" aria-label="Karta obiegowa"><RoutingSlipDocument /></aside>
      </div>
    </section>
  );
}
