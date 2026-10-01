import Link from "next/link";
import type { ReactNode } from "react";
import { ESTIMATED_SPECIES, SPECIES, statusLabel, type Species } from "@/content/species";
import { cx, plural, typo } from "@/lib/typo";
import { SectionHeading, Stamp } from "./brand";
import { StatusScale, TraitBars } from "./species-parts";

const NATIONWIDE = SPECIES.filter((species) => !species.region);

export function AtlasSection({ week }: { week: number }) {
  const featured = SPECIES[week % SPECIES.length];

  return (
    <section id="atlas" aria-labelledby="atlas-title" className="wrap scroll-mt-20 py-20 md:py-28">
      <SectionHeading
        id="atlas-title"
        number="02"
        kicker="Zbiory"
        aside={`Opisano ${SPECIES.length} z ok. ${ESTIMATED_SPECIES} gatunków`}
        title="Atlas Dziadersów"
        dek={typo(
          "Systematyczny katalog gatunków występujących na terenie Rzeczypospolitej. Każdy wpis zawiera siedlisko, typowe wokalizacje, naturalnych wrogów i status ochrony.",
        )}
      />

      <div className="mt-14 grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
        <SpeciesEntry species={featured} week={week} className="lg:col-span-8" />
        <SpeciesIndex featured={featured.code} className="lg:col-span-4" />
      </div>
    </section>
  );
}

function SpeciesEntry({ species, week, className }: { species: Species; week: number; className?: string }) {
  return (
    <article aria-labelledby={`${species.code}-name`} className={cx("border border-ink bg-paper-light", className)}>
      <header className="flex items-center justify-between gap-4 border-b border-ink px-5 py-3 md:px-8">
        <p className="kicker">
          Gatunek tygodnia <span className="text-ink-faint">· tydzień {week}</span>
        </p>
        <p className="kicker text-ink-faint">{species.code}</p>
      </header>

      <div className="px-5 py-8 md:px-8 md:py-10">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div>
            <h3
              id={`${species.code}-name`}
              className="font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-bold leading-[0.95] tracking-[-0.025em]"
            >
              <Link href={`/atlas/${species.slug}`} className="transition-colors hover:text-green">
                {species.name}
              </Link>
            </h3>
            <p className="mt-3 text-lg">
              <em>{species.latin}</em> <span className="text-ink-faint">({species.authority})</span>
            </p>
          </div>
          {species.isNew && <Stamp className="mt-2 rotate-[-4deg]">Nowy gatunek</Stamp>}
        </div>

        <dl className="mt-10 grid gap-x-10 gap-y-7 md:grid-cols-2">
          <Field label="Występowanie">{typo(species.habitat)}</Field>
          <Field label="Aktywność">{typo(species.activity)}</Field>
          <Field label="Typowe wokalizacje">
            {species.calls.map((call) => (
              <span key={call} className="block font-display text-[1.2rem] italic leading-snug">
                „{call}”
              </span>
            ))}
          </Field>
          <Field label="Naturalni wrogowie">{typo(species.enemies)}</Field>
          <Field label="Rozpoznanie w terenie" wide>
            {typo(species.fieldMarks)}
          </Field>
        </dl>

        <div className="mt-10 grid gap-10 border-t border-rule pt-8 md:grid-cols-2">
          <TraitBars traits={species.traits} />
          <StatusScale status={species.status} note={species.statusNote} />
        </div>

        <p className="kicker mt-10 border-t border-rule pt-5">
          <Link href={`/atlas/${species.slug}`} className="link">
            Pełna karta gatunku: 7 objawów i postępowanie w kontakcie →
          </Link>
        </p>
      </div>
    </article>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={cx("border-t border-rule pt-3", wide && "md:col-span-2")}>
      <dt className="kicker text-ink-faint">{label}</dt>
      <dd className="mt-2 text-[1.05rem] leading-relaxed">{children}</dd>
    </div>
  );
}

function SpeciesIndex({ featured, className }: { featured: string; className?: string }) {
  const regional = SPECIES.length - NATIONWIDE.length;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
        <h3 className="kicker">Gatunki ogólnopolskie</h3>
        <span className="kicker text-ink-faint">
          {NATIONWIDE.length} / {SPECIES.length}
        </span>
      </div>
      <ol>
        {NATIONWIDE.map((species) => (
          <li key={species.code} className="border-b border-rule">
            <Link
              href={`/atlas/${species.slug}`}
              className="group grid grid-cols-[4.1rem_1fr_auto] items-baseline gap-3 py-3.5"
            >
              <span className="kicker text-ink-faint">{species.code}</span>
              <span>
                <span
                  className={cx(
                    "block font-display text-[1.15rem] font-semibold leading-tight transition-colors group-hover:text-green",
                    species.code === featured && "text-green",
                  )}
                >
                  {species.name}
                </span>
                <span className="mt-0.5 block text-[0.9rem] leading-snug text-ink-soft">{typo(species.teaser)}</span>
              </span>
              <abbr title={statusLabel(species.status)} className="font-mono text-[0.7rem] text-ink-faint no-underline">
                {species.status}
              </abbr>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-6">
        <Link href="/atlas" className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
          Pełny Atlas <span aria-hidden="true">→</span>
        </Link>
      </p>
      <p className="kicker mt-4 text-ink-faint">
        W tym {regional} {plural(regional, "gatunek regionalny", "gatunki regionalne", "gatunków regionalnych")}
      </p>
    </div>
  );
}
