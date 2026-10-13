"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { COMMON_SPECIMENS, SPECIMENS } from "@/content/specimens";
import { CommonPlate } from "./common-plate";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { decodeResult, encodeResult, evaluate } from "@/lib/test";
import { cx } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";

const COPY = defineCopy({
  pl: { heading: "Wybierz okaz na certyfikat", note: "Rycina przedstawia fikcyjną osobę. Wybór nie zmienia wyniku ani numeru certyfikatu.",
    label: (index: number, age: number) => `Okaz ${index + 1} · wiek: ${age}`, pending: "Zmieniam rycinę…" },
  sl: { heading: "Izberi osebek za certifikat", note: "Risba prikazuje izmišljeno osebo. Izbira ne spremeni rezultata ali številke certifikata.",
    label: (index: number, age: number) => `Osebek ${index + 1} · starost: ${age}`, pending: "Spreminjam risbo …" },
});

export function ResultSpecimenChoice({ code }: { code: string }) {
  const router = useRouter();
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const t = COPY[locale];
  const draft = decodeResult(code);
  if (!draft) return null;
  const result = evaluate(draft, locale);
  const species = result.diagnosis.species[0];
  const people = species ? SPECIMENS[species.key] : COMMON_SPECIMENS;
  return (
    <fieldset className="mb-8">
      <legend className="label text-ink-soft">{t.heading}</legend>
      <div className="mt-3 grid max-w-md grid-cols-3 gap-2">
        {people.map((person) => (
          <button key={person.index} type="button" disabled={pending} aria-pressed={result.specimen === person.index}
            onClick={() => startTransition(() => router.replace(localizePath(`/wynik/${encodeResult({ ...draft, specimen: person.index })}`, locale), { scroll: false }))}
            className={cx("border p-2 text-left hover:border-red disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red", result.specimen === person.index ? "border-ink bg-ink/5" : "border-rule")}>
            {species ? <SpeciesPlate species={species.key} specimen={person.index} sizes="120px" className="w-full" /> : <CommonPlate specimen={person.index} sizes="120px" className="w-full" />}
            <span className="mt-1 block font-sans text-xs leading-snug">{t.label(person.index, person.age)}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 max-w-md font-sans text-xs leading-relaxed text-ink-soft">{t.note}</p>
      <p className="sr-only" role="status">{pending ? t.pending : ""}</p>
    </fieldset>
  );
}
