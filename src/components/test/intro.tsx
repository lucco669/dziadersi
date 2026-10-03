"use client";

import type { FormEvent } from "react";
import { getRegions } from "@/content/regions";
import { useLocale } from "@/i18n/client";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { GROUP_LIMIT, type Draft } from "@/lib/test";
import { cx, typo } from "@/lib/typo";
import { TASKS } from "@/content/test";
import { TestProfileNote } from "../profile-notes";
import type { Progress } from "@/lib/test-progress";
import { Box } from "./shared";
import { RoutingSlipDocument } from "./slip";

/** Voivodeships for the census, in the edition's alphabetical order. The value is always the Polish code. */
const regions = (locale: Locale) =>
  Object.values(getRegions(locale)).sort((a, b) => a.name.localeCompare(b.name, LOCALE_INFO[locale].tag));

const COPY = defineCopy({
  pl: {
    trail: "Ścieżka",
    home: "Instytut",
    title: "Test Dziadersa",
    lead: "Pięć gabinetów, cztery minuty. Na końcu rozpoznanie i certyfikat, który możesz pokazać rodzinie.",
    who: "Kogo badamy?",
    self: "Siebie",
    other: "Kogoś bliskiego",
    untimed: "Bez pośpiechu — bez limitu na odpowiedź",
    untimedNote: "Próba klaksonowa nadal mierzy czas reakcji. Samodzielnie decydujesz, kiedy ją zakończyć.",
    family: "Dołączasz do rankingu rodzinnego. Podpis i wynik będą widoczne dla osób z linkiem. Podpis podasz na końcu.",
    full: "Ten ranking jest pełny. Możesz wykonać własne badanie.",
    invited: "Dołączasz do rankingu. Podpis podasz na końcu badania.",
    startProxy: "Rozpocznij wywiad",
    start: "Rozpocznij badanie",
    collect: "Odbierz gotowy wynik",
    resume: (task: number) => `Wznów od zadania ${task}`,
    facts: (tasks: number) => `${tasks} zadań · bez konta · imię dopiero na końcu`,
    more: "Przed badaniem i dane opcjonalne",
    adviceProxy: "Odpowiadaj tak, jak zachowałaby się osoba badana. Nie tak, jak by chciała.",
    advice: "Odpowiadaj szczerze. Nie konsultuj odpowiedzi z rodziną. Rodzina jest stroną w sprawie.",
    region: "Województwo (nieobowiązkowe)",
    noRegion: "Nie podaję",
    notice: "W gabinecie III jest klakson z dźwiękiem. Odpowiedzi trafiają anonimowo do Narodowego Spisu Dziadersów, bez podpisu. Podpis jest częścią linku do wyniku.",
    slip: "Karta obiegowa",
  },
  sl: {
    trail: "Pot do strani",
    home: "Inštitut",
    title: "Test dziadersa",
    lead: "Pet ordinacij, štiri minute. Na koncu diagnoza in certifikat, ki ga lahko pokažeš družini.",
    who: "Koga pregledujemo?",
    self: "Sebe",
    other: "Nekoga bližnjega",
    untimed: "Brez naglice – brez časovne omejitve za odgovor",
    untimedNote: "Preizkus s hupo še vedno meri reakcijski čas. Kdaj se konča, določiš ti.",
    family: "Pridružuješ se družinski lestvici. Podpis in izvid bosta vidna vsem s povezavo. Podpis vpišeš na koncu.",
    full: "Ta lestvica je polna. Lahko opraviš svoj pregled.",
    invited: "Pridružuješ se lestvici. Podpis vpišeš na koncu pregleda.",
    startProxy: "Začni heteroanamnezo",
    start: "Začni pregled",
    collect: "Prevzemi pripravljeni izvid",
    resume: (task: number) => `Nadaljuj pri nalogi ${task}`,
    facts: (tasks: number) => `${tasks} nalog · brez računa · ime šele na koncu`,
    more: "Pred pregledom in neobvezni podatki",
    adviceProxy: "Odgovarjaj tako, kot bi ravnala preiskovana oseba. Ne tako, kot bi si želela.",
    advice: "Odgovarjaj iskreno. Odgovorov ne usklajuj z družino. Družina je stranka v postopku.",
    // The census is Polish: the field stays for readers who examine someone in Poland.
    region: "Vojvodstvo (neobvezno, samo za preglede na Poljskem)",
    noRegion: "Ne navedem",
    notice: "V ordinaciji III je hupa z zvokom. Odgovori gredo anonimno v Nacionalni popis dziadersov, brez podpisa. Podpis je del povezave do izvida.",
    slip: "Obhodni list",
  },
});

export function TestIntro({ region, setRegion, proxy, setProxy, invite, saved, onStart, onResume, untimed, setUntimed, family }: {
  region: string;
  setRegion: (region: string) => void;
  proxy: boolean;
  setProxy: (proxy: boolean) => void;
  invite: Draft[] | null;
  saved: Progress | null;
  onStart: (event?: FormEvent) => void;
  onResume: (progress: Progress) => void;
  untimed: boolean;
  setUntimed: (value: boolean) => void;
  family: boolean;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const full = invite !== null && invite.length >= GROUP_LIMIT;
  return (
    <section className="wrap pb-16 pt-6 md:pb-24 md:pt-12">
      <nav aria-label={t.trail} className="label text-ink-soft"><Link href="/" className="link">{t.home}</Link><span className="mx-2">/</span>{t.title}</nav>
      <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(2.75rem,7.4vw,6rem)] font-bold leading-[0.95] tracking-[-0.02em]">{t.title}</h1>
          <p className="mt-4 max-w-xl text-xl leading-snug text-ink-soft">{typo(t.lead)}</p>
          <form onSubmit={onStart} className="mt-6">
            <fieldset>
              <legend className="label text-ink-soft">{t.who}</legend>
              <div className="mt-2 grid max-w-xl grid-cols-2 border-y border-ink">
                {[{ value: false, label: t.self }, { value: true, label: t.other }].map((option) => (
                  <label key={option.label} className={cx("relative flex cursor-pointer items-center justify-between gap-2 px-3 py-4 focus-within:outline-2 focus-within:outline-red", proxy === option.value ? "bg-red/[0.06]" : "hover:bg-paper-deep")}>
                    <input type="radio" name="tryb" checked={proxy === option.value} onChange={() => setProxy(option.value)} className="sr-only" />
                    <span className="text-lg font-bold">{option.label}</span><Box checked={proxy === option.value} />
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="label mt-4 flex cursor-pointer items-center gap-3 py-2">
              <input type="checkbox" checked={untimed} onChange={(event) => setUntimed(event.target.checked)} className="size-5 accent-red" />{t.untimed}
            </label>
            {untimed && <p className="label mt-1 text-ink-soft">{t.untimedNote}</p>}
            {(family || invite) && <p className="label mt-3 border-l-2 border-red pl-3 text-ink-soft">{family ? t.family : full ? t.full : t.invited}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="submit" className="btn bg-ink text-paper hover:bg-red">{proxy ? t.startProxy : t.start}<span aria-hidden="true">→</span></button>
              {saved && <button type="button" onClick={() => onResume(saved)} className="link py-3 font-sans">{saved.current === TASKS.length ? t.collect : t.resume(saved.current + 1)}</button>}
            </div>
            <p className="label mt-3 text-ink-soft">{t.facts(TASKS.length)}</p>
            <details className="mt-7 max-w-xl border-y border-rule py-4">
              <summary className="cursor-pointer font-sans text-sm">{t.more}</summary>
              <p className="mt-4 leading-snug">{typo(proxy ? t.adviceProxy : t.advice)}</p>
              <label htmlFor="wojewodztwo" className="label mt-5 block">{t.region}</label>
              <select id="wojewodztwo" value={region} onChange={(event) => setRegion(event.target.value)} className="mt-2 w-full border-b border-ink bg-transparent py-3">
                <option value="">{t.noRegion}</option>{regions(locale).map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
              </select>
              <p className="label mt-5 text-ink-soft">{t.notice}</p>
            </details>
            <TestProfileNote />
          </form>
        </div>
        <aside className="lg:col-span-5" aria-label={t.slip}><RoutingSlipDocument locale={locale} /></aside>
      </div>
    </section>
  );
}
