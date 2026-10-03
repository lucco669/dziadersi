import { getRegions } from "@/content/regions";
import { getSpecies, type SpeciesKey } from "@/content/species";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import type { Community } from "@/lib/community";
import { formatDate, formatNumber, plural, pluralSl, typo } from "@/lib/typo";
import { Section } from "./page";
import { SpeciesPlate } from "./pictograms";
import { ObserverCta } from "./sighting";

const WHEN: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };

const COPY = defineCopy({
  pl: {
    title: "Obserwacje terenowe",
    network: "Sieć Obserwatorów Terenowych IBD",
    intro:
      "Obserwatorzy z Profilem Dziaderskim zgłaszają gatunki spotkane w terenie: na stronie gatunku, jednym przyciskiem. Jedna obserwacja gatunku dziennie, województwo nieobowiązkowe.",
    total: "Zgłoszeń od początku",
    observers: (n: number) => plural(n, "obserwator", "obserwatorów", "obserwatorów"),
    today: "dziś",
    map: "Mapa obserwacji według województw",
    week: "Najczęściej obserwowane w tym tygodniu",
    weekEmpty: "W tym tygodniu jeszcze nikt niczego nie zgłosił. Teren jest, obserwatorów brak.",
    latest: "Ostatnie zgłoszenia",
    unknown: "Miejsce nieujawnione",
    latestEmpty: "Rejestr czeka na pierwsze zgłoszenie. Pierwszy obserwator wchodzi do historii Instytutu, bo nikt inny jeszcze w niej nie jest.",
  },
  sl: {
    title: "Terenska opazovanja",
    network: "Mreža terenskih opazovalcev IBD",
    intro:
      "Opazovalci z Dziaderskim profilom prijavljajo vrste, srečane na terenu: na strani vrste, s pritiskom na gumb. Eno opazovanje vrste na dan, vojvodstvo neobvezno.",
    total: "Prijav od začetka",
    observers: (n: number) => pluralSl(n, "opazovalec", "opazovalca", "opazovalci", "opazovalcev"),
    today: "danes",
    map: "Zemljevid opazovanj po vojvodstvih",
    week: "Najpogosteje opažene ta teden",
    weekEmpty: "Ta teden še nihče ni ničesar prijavil. Teren je, opazovalcev ni.",
    latest: "Zadnje prijave",
    unknown: "Kraj ni razkrit",
    latestEmpty: "Register čaka na prvo prijavo. Prvi opazovalec se zapiše v zgodovino Inštituta, ker v njej še ni nikogar drugega.",
  },
});

/** Obserwacje terenowe on the Atlas: totals, this week's most observed species and the latest reports. */
export async function Sightings({ community }: { community: Community | null }) {
  const locale = await getLocale();
  const t = COPY[locale];
  const regions = getRegions(locale);
  const all = getSpecies(locale);
  const known = new Map(all.map((species) => [species.key as string, species]));
  const count = (n: number) => formatNumber(locale, n);
  const sightings = community?.sightings;
  const week = Object.entries(sightings?.week ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const top = week[0]?.[1] ?? 1;
  const latest = (sightings?.latest ?? []).filter((item) => known.has(item.species)).slice(0, 8);

  return (
    <Section id="obserwacje" title={t.title} aside={t.network} intro={typo(t.intro)}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="label text-ink-soft">{t.total}</p>
          <p className="mt-1 text-[clamp(4rem,8vw,6rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
            {count(sightings?.total ?? 0)}
          </p>
          <dl className="mt-6 grid grid-cols-2 border-t border-ink">
            {[
              [count(sightings?.observers ?? 0), t.observers(sightings?.observers ?? 0)],
              [count(sightings?.today ?? 0), t.today],
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
            <ObserverCta species={all.length} />
          </div>
          <Link href="/obserwacje" className="link mt-6 inline-block font-sans font-medium">
            {t.map}
          </Link>
        </div>

        <div className="lg:col-span-4">
          <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.week}</h3>
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
                          <span className="font-sans text-[0.9rem] font-semibold tabular-nums">{count(n)}</span>
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
            <p className="mt-4 max-w-sm leading-snug text-ink-soft">{typo(t.weekEmpty)}</p>
          )}
        </div>

        <div className="lg:col-span-4">
          <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.latest}</h3>
          {latest.length ? (
            <ol>
              {latest.map((item, i) => {
                const species = known.get(item.species)!;
                return (
                  <li key={`${item.at}-${i}`} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-rule py-2.5">
                    <Link href={`/atlas/${species.slug}`} className="font-bold leading-tight hover:text-red">
                      {species.name}
                    </Link>
                    <span className="label text-ink-soft">{formatDate(locale, new Date(item.at), WHEN)}</span>
                    <span className="label col-span-2 text-ink-faint">{item.region ? regions[item.region]?.name : t.unknown}</span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-4 max-w-sm leading-snug text-ink-soft">{typo(t.latestEmpty)}</p>
          )}
        </div>
      </div>
    </Section>
  );
}
