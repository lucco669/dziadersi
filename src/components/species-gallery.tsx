"use client";
import { useState } from "react";
import type { SpeciesKey } from "@/content/species";
import { defaultSpecimen, getSpecimens, type SpecimenIndex } from "@/content/specimens";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { cx, typo } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";

const COPY = defineCopy({
  pl: { heading: "Inne okazy tego gatunku", note: "Trzy osoby, ten sam gatunek. Wiek i płeć nie są kryteriami klasyfikacji.",
    label: (index: number, age: number) => `Okaz ${String(index + 1).padStart(2, "0")} · wiek: ${age}`,
    alt: (name: string, age: number, gender: string) => `${name}: ${gender === "woman" ? "kobieta" : "mężczyzna"}, ${age} l.` },
  sl: { heading: "Drugi osebki te vrste", note: "Tri osebe, ista vrsta. Starost in spol nista merili za razvrščanje.",
    label: (index: number, age: number) => `Osebek ${String(index + 1).padStart(2, "0")} · starost: ${age}`,
    alt: (name: string, age: number, gender: string) => `${name}: ${gender === "woman" ? "ženska" : "moški"}, ${age} let.` },
});

export function SpeciesGallery({ species, name, locale }: { species: SpeciesKey; name: string; locale: Locale }) {
  const [selected, setSelected] = useState<SpecimenIndex>(defaultSpecimen(species));
  const t = COPY[locale], people = getSpecimens(species, locale), person = people[selected];
  return <figure className="w-full">
    <SpeciesPlate species={species} specimen={selected} eager title={t.alt(name, person.age, person.gender)} sizes="(max-width: 639px) 90vw, (max-width: 1023px) 600px, 440px" className="w-full" />
    <figcaption className="mt-3 border-t border-rule pt-3">
      <p className="label text-ink-soft">{t.label(selected, person.age)}</p>
      <p className="mt-2 min-h-[3.5rem] font-serif text-lg leading-snug" aria-live="polite" aria-atomic="true">{typo(person.observation)}</p>
    </figcaption>
    <fieldset className="mt-4">
      <legend className="label text-ink-soft">{t.heading}</legend>
      <div className="mt-2 grid grid-cols-3 gap-2">{people.map((item) => <button key={item.index} type="button" onClick={() => setSelected(item.index)} aria-pressed={selected === item.index}
        aria-label={t.label(item.index, item.age)} className={cx("border p-2 text-left transition-colors hover:border-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red", selected === item.index ? "border-ink bg-ink/5" : "border-rule")}>
        <SpeciesPlate species={species} specimen={item.index} sizes="100px" className="w-full" />
        <span className="mt-1 block font-sans text-[0.72rem] leading-snug tabular-nums">{t.label(item.index, item.age)}</span>
      </button>)}</div>
    </fieldset>
    <p className="mt-3 font-sans text-xs leading-relaxed text-ink-soft">{t.note}</p>
  </figure>;
}
