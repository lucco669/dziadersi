"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { ShareBar } from "@/components/share-bar";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";

const COPY = defineCopy({
  pl: {
    step: (n: number) => `Krok ${n}`,
    choose: "Który opis pasuje do okazu?",
    result: "Oznaczony gatunek",
    observations: "Wybrane cechy",
    species: "Zobacz kartę gatunku",
    back: "Cofnij o krok",
    restart: "Zacznij od nowa",
  },
  sl: {
    step: (n: number) => `${n}. korak`,
    choose: "Kateri opis ustreza osebku?",
    result: "Določena vrsta",
    observations: "Izbrani znaki",
    species: "Odpri kartico vrste",
    back: "Korak nazaj",
    restart: "Začni znova",
  },
});

type Destination = number | { name: string; latin: string; href: string; plate: ReactNode };
type Choice = { clue: string; to: Destination };

/** The same sequence of a/b choices identifies a finding in either edition. */
function follow(steps: Choice[][], path: string) {
  let to: Destination = 1;
  const clues: string[] = [];
  for (const branch of path) {
    if (typeof to !== "number" || (branch !== "a" && branch !== "b")) {
      return { to: 1, clues: [], path: "" };
    }
    const choice: Choice = steps[to - 1][branch === "a" ? 0 : 1];
    clues.push(choice.clue);
    to = choice.to;
  }
  return { to, clues, path };
}

export function GuidedKey({ steps }: { steps: Choice[][] }) {
  const t = COPY[useLocale()];
  const params = useSearchParams();
  const { to, clues, path } = follow(steps, params.get("klucz") ?? "");
  const heading = useRef<HTMLHeadingElement>(null);
  const focusNextStep = useRef(false);

  useEffect(() => {
    if (focusNextStep.current) {
      heading.current?.focus();
      focusNextStep.current = false;
    }
  }, [path]);

  function go(next: string) {
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("klucz", next);
    else url.searchParams.delete("klucz");
    url.hash = "klucz";
    focusNextStep.current = true;
    window.history.replaceState(null, "", url);
  }

  const isStep = typeof to === "number";
  return (
    <section aria-labelledby="klucz-krok" className="mb-12 max-w-2xl border border-ink bg-card p-4 sm:p-7">
      <h3 ref={heading} tabIndex={-1} id="klucz-krok" className="scroll-mt-6 text-2xl font-bold leading-tight sm:text-3xl">
        <span className="label mb-2 block text-red">{isStep ? t.step(path.length + 1) : t.result}</span>
        {isStep ? t.choose : to.name}
      </h3>
      {isStep ? (
        <div className="mt-5 grid gap-3">
          {steps[to - 1].map(({ clue }, i) => {
            const branch = i === 0 ? "a" : "b";
            return (
              <button key={branch} type="button" onClick={() => go(path + branch)}
                className="flex min-h-12 items-baseline gap-3 border border-rule bg-paper px-4 py-3 text-left text-lg leading-snug hover:border-ink">
                <span aria-hidden="true" className="label shrink-0 text-ink-soft">{to}{branch}.</span>
                {clue}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <p className="mt-1 italic text-ink-soft">{to.latin}</p>
          <div className="mt-4 grid items-center gap-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            {to.plate}
            <div>
              <h4 className="font-sans font-semibold">{t.observations}</h4>
              <ol className="mt-2 list-decimal space-y-1 pl-6 marker:text-ink-soft">
                {clues.map((clue, i) => <li key={i}>{clue}</li>)}
              </ol>
            </div>
          </div>
          <Link href={to.href} className="link mt-3 inline-flex min-h-11 items-center font-sans font-semibold">
            {t.species} →
          </Link>
          <div className="mt-3 [&_button]:min-h-11">
            <ShareBar path={`/atlas?klucz=${path}#klucz`} text={`${t.result}: ${to.name}`} kind="atlas-klucz" />
          </div>
        </>
      )}
      {path && (
        <div className="label mt-5 flex flex-wrap justify-between gap-x-4 border-t border-rule pt-1">
          <button type="button" className="link min-h-11" onClick={() => go(path.slice(0, -1))}>← {t.back}</button>
          <button type="button" className="link min-h-11" onClick={() => go("")}>{t.restart}</button>
        </div>
      )}
    </section>
  );
}
