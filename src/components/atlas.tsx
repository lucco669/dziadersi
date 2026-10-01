import type { ReactNode } from "react";
import { ESTIMATED_SPECIES, SPECIES, STATUSES, type Species, type Status } from "@/content/species";
import { cx, typo } from "@/lib/typo";
import { SectionHeading, Stamp } from "./brand";

const statusLabel = (status: Status) => STATUSES.find((item) => item.code === status)?.label ?? status;

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
              {species.name}
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

function TraitBars({ traits }: { traits: Species["traits"] }) {
  return (
    <div>
      <p className="kicker text-ink-faint">Profil behawioralny (0–100)</p>
      <ul className="mt-5 space-y-4">
        {traits.map((trait) => (
          <li key={trait.label}>
            <div className="flex items-baseline justify-between gap-4 text-[0.95rem] leading-snug">
              <span>{trait.label}</span>
              <span className="font-mono text-[0.8rem] tabular-nums">{trait.value}</span>
            </div>
            <div className="mt-1.5 h-1.5 bg-ink/10">
              <div className="h-full bg-green" style={{ width: `${trait.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusScale({ status, note }: { status: Status; note: string }) {
  const label = statusLabel(status);

  return (
    <div>
      <p className="kicker text-ink-faint">Status ochrony</p>
      <ol className="mt-5 grid grid-cols-7 border border-ink">
        {STATUSES.map((item, i) => (
          <li
            key={item.code}
            aria-current={item.code === status ? "true" : undefined}
            className={cx(
              "py-2 text-center font-mono text-[0.72rem] font-semibold",
              i > 0 && "border-l border-ink",
              item.code === status ? "bg-ink text-paper" : "text-ink-faint",
            )}
          >
            <abbr title={item.label} className="no-underline">
              {item.code}
            </abbr>
          </li>
        ))}
      </ol>
      <p className="kicker mt-2 flex justify-between text-[0.58rem] text-ink-faint">
        <span>Wymarły</span>
        <span>Najmniejszej troski</span>
      </p>
      <p className="mt-4 text-[0.95rem] leading-snug">
        <span className="font-semibold">{label.charAt(0).toUpperCase() + label.slice(1)}.</span> {typo(note)}
      </p>
    </div>
  );
}

function SpeciesIndex({ featured, className }: { featured: string; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
        <h3 className="kicker">Indeks gatunków</h3>
        <span className="kicker text-ink-faint">
          {SPECIES.length} / {ESTIMATED_SPECIES}
        </span>
      </div>
      <ol>
        {SPECIES.map((species) => (
          <li
            key={species.code}
            className="grid grid-cols-[4.1rem_1fr_auto] items-baseline gap-3 border-b border-rule py-3.5"
          >
            <span className="kicker text-ink-faint">{species.code}</span>
            <span>
              <span
                className={cx(
                  "block font-display text-[1.15rem] font-semibold leading-tight",
                  species.code === featured && "text-green",
                )}
              >
                {species.name}
              </span>
              <span className="mt-0.5 block text-[0.9rem] leading-snug text-ink-soft">{typo(species.teaser)}</span>
              {species.code === featured && (
                <span className="kicker mt-1.5 block text-[0.58rem] text-green">◆ Gatunek tygodnia</span>
              )}
            </span>
            <abbr title={statusLabel(species.status)} className="font-mono text-[0.7rem] text-ink-faint no-underline">
              {species.status}
            </abbr>
          </li>
        ))}
      </ol>
      <p className="kicker mt-6 text-ink-faint">Osobne karty gatunków — wkrótce</p>
    </div>
  );
}
