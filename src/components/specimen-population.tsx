import { getSpecies, speciesByKey } from "@/content/species";
import { SPECIMEN_COUNT, specimenByIndex } from "@/content/specimens";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { typo } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";

const CAST = [{ species: "grill", specimen: 1 }, { species: "korpo", specimen: 2 }, { species: "budowa", specimen: 0 }] as const;
const COPY = defineCopy({
  pl: { figure: "Rys. 1. Przekrój populacji", heading: "Różne osoby. Ta sama pewność, że wiedzą lepiej.", note: "Dziaderstwo to postawa, nie metryka. Wiek i płeć nie dają zwolnienia z badania.", age: (age: number) => `Wiek: ${age}`, collection: (count: number, species: number) => `${count} okazy · ${species} gatunków · zobacz Atlas →` },
  sl: { figure: "Sl. 1. Prerez populacije", heading: "Različne osebe. Enaka prepričanost, da vedo bolje.", note: "Dziaderstvo je drža, ne letnica rojstva. Starost in spol ne pomenita oprostitve pregleda.", age: (age: number) => `Starost: ${age}`, collection: (count: number, species: number) => `${count} osebkov · ${species} vrst · odpri Atlas →` },
});

export function SpecimenPopulation({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return <figure className="w-full">
    <p className="label border-t border-ink pt-3 text-ink-soft">{t.figure}</p>
    <div className="relative mt-4" style={{ aspectRatio: "2 / 1" }}>{CAST.map(({ species, specimen }, index) => {
      return <div key={species} className="absolute top-0 w-[54%]" style={{ left: `${index * 27 - 4}%`, zIndex: index === 1 ? 2 : 1 }}>
        <SpeciesPlate species={species} specimen={specimen} eager sizes="(max-width: 639px) 50vw, (max-width: 1023px) 400px, 310px" className="w-full" />
      </div>;
    })}</div>
    <div className="grid grid-cols-3 gap-2">{CAST.map(({ species, specimen }) => <Link key={species} href={`/atlas/${speciesByKey(species, locale).slug}`} className="label text-center text-[0.72rem] text-ink-soft hover:text-red hover:underline">{speciesByKey(species, locale).code} · {t.age(specimenByIndex(species, specimen).age)}</Link>)}</div>
    <figcaption className="mt-6 border-t border-rule pt-4">
      <p className="text-balance font-serif text-[1.5rem] font-bold leading-tight sm:text-[1.8rem]">{typo(t.heading)}</p>
      <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-ink-soft">{typo(t.note)}</p>
      <Link href="/atlas" className="label mt-4 inline-block text-red hover:underline">{t.collection(SPECIMEN_COUNT, getSpecies(locale).length)}</Link>
    </figcaption>
  </figure>;
}
