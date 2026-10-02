import Link from "next/link";
import { REGIONS } from "@/content/regions";
import { SPECIES, type SpeciesKey } from "@/content/species";
import type { Community } from "@/lib/community";
import { plural, typo } from "@/lib/typo";
import { Section } from "./page";
import { SpeciesPlate } from "./pictograms";
import { ObserverCta } from "./sighting";

const count = new Intl.NumberFormat("pl-PL");
const when = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
const known = new Map(SPECIES.map((species) => [species.key as string, species]));

/** Obserwacje terenowe on the Atlas: totals, this week's most observed species and the latest reports. */
export function Sightings({ community }: { community: Community | null }) {
  const sightings = community?.sightings;
  const week = Object.entries(sightings?.week ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const top = week[0]?.[1] ?? 1;
  const latest = (sightings?.latest ?? []).filter((item) => known.has(item.species)).slice(0, 8);

  return (
    <Section
      id="obserwacje"
      title="Obserwacje terenowe"
      aside="Sieć Obserwatorów Terenowych IBD"
      intro={typo(
        "Obserwatorzy z Profilem Dziaderskim zgłaszają gatunki spotkane w terenie: na stronie gatunku, jednym przyciskiem. Jedna obserwacja gatunku dziennie, województwo nieobowiązkowe.",
      )}
    >
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="label text-ink-soft">Zgłoszeń od początku</p>
          <p className="mt-1 text-[clamp(4rem,8vw,6rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
            {count.format(sightings?.total ?? 0)}
          </p>
          <dl className="mt-6 grid grid-cols-2 border-t border-ink">
            {[
              [count.format(sightings?.observers ?? 0), plural(sightings?.observers ?? 0, "obserwator", "obserwatorów", "obserwatorów")],
              [count.format(sightings?.today ?? 0), "dziś"],
            ].map(([value, label]) => (
              <div key={label} className="pt-3">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-3xl font-bold leading-none">{value}</span>
                  <span className="label mt-1 block text-ink-soft">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <ObserverCta species={SPECIES.length} />
          </div>
          <Link href="/obserwacje" className="link mt-6 inline-block font-sans font-medium">
            Mapa obserwacji według województw
          </Link>
        </div>

        <div className="lg:col-span-4">
          <h3 className="label border-b border-ink pb-3 text-ink-soft">Najczęściej obserwowane w tym tygodniu</h3>
          {week.length ? (
            <ol>
              {week.map(([key, n]) => {
                const species = known.get(key)!;
                return (
                  <li key={key}>
                    <Link href={`/atlas/${species.slug}`} className="group grid grid-cols-[3.5rem_1fr] items-center gap-3 border-b border-rule py-2.5">
                      <SpeciesPlate species={species.key as SpeciesKey} className="w-full" />
                      <span>
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-bold leading-tight group-hover:text-red">{species.name}</span>
                          <span className="font-sans text-[0.9rem] font-semibold tabular-nums">{count.format(n)}</span>
                        </span>
                        <span className="mt-1.5 block h-1.5 bg-ink/10">
                          <span className="block h-full bg-ink" style={{ width: `${(n / top) * 100}%` }} />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-4 max-w-sm leading-snug text-ink-soft">
              {typo("W tym tygodniu jeszcze nikt niczego nie zgłosił. Teren jest, obserwatorów brak.")}
            </p>
          )}
        </div>

        <div className="lg:col-span-4">
          <h3 className="label border-b border-ink pb-3 text-ink-soft">Ostatnie zgłoszenia</h3>
          {latest.length ? (
            <ol>
              {latest.map((item, i) => {
                const species = known.get(item.species)!;
                return (
                  <li key={`${item.at}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-rule py-2.5">
                    <Link href={`/atlas/${species.slug}`} className="font-bold leading-tight hover:text-red">
                      {species.name}
                    </Link>
                    <span className="label text-ink-soft">{when.format(new Date(item.at))}</span>
                    <span className="label col-span-2 text-ink-faint">{item.region ? REGIONS[item.region]?.name : "Miejsce nieujawnione"}</span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-4 max-w-sm leading-snug text-ink-soft">
              {typo("Rejestr czeka na pierwsze zgłoszenie. Pierwszy obserwator wchodzi do historii Instytutu, bo nikt inny jeszcze w niej nie jest.")}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
