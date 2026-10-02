import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CommissionPlate, Medal } from "@/components/court";
import { HonorCta } from "@/components/honor";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { CASES, docket, VERDICTS, type Case } from "@/content/cases";
import { REGIONS } from "@/content/regions";
import { SPECIES, type SpeciesKey } from "@/content/species";
import { getCensus, MIN_RESULTS } from "@/lib/census";
import { getCommunity, getHonorBoard, type VerdictCounts } from "@/lib/community";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, plural, typo } from "@/lib/typo";

const title = "Tablica Honorowa";
const description =
  "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza Instytutu Badań nad Dziaderstwem. Sprawy, które podzieliły naród, gatunki najlepiej obserwowane i najczęstsze rozpoznania.";

export const metadata: Metadata = pageMetadata({
  title: "Tablica Honorowa Instytutu",
  description,
  path: "/tablica-honorowa",
  shareTitle: `${title} · ${site.name}`,
});

const number = new Intl.NumberFormat("pl-PL");
const known = new Map(SPECIES.map((species) => [species.key as string, species]));
/** The three orders of each board, first to third place. */
const ORDERS = {
  observers: ["Order Złotej Lornetki", "Srebrna Lornetka", "Lornetka z Brązu"],
  jurors: ["Order Złotego Młotka", "Srebrny Młotek", "Młotek z Brązu"],
  calendar: ["Order Złotej Kartki", "Srebrna Kartka", "Kartka z Brązu"],
};

function Leaders<T extends { nickname: string }>({
  rows,
  orders,
  empty,
  figures,
}: {
  rows: T[];
  orders: string[];
  empty: string;
  figures: (row: T) => [string, string][];
}) {
  if (!rows.length) return <p className="max-w-md border-t border-ink pt-5 leading-snug text-ink-soft">{typo(empty)}</p>;
  return (
    <ol className="border-t border-ink">
      {rows.map((row, i) => (
        <li key={row.nickname} className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-rule py-3">
          {i < 3 ? (
            <Medal place={(i + 1) as 1 | 2 | 3} className="h-12" />
          ) : (
            <span className="text-center font-sans text-[0.95rem] font-semibold text-ink-soft">{i + 1}</span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-xl font-bold leading-tight">{row.nickname}</span>
            {i < 3 && <span className="label block text-red">{orders[i]}</span>}
          </span>
          <span className="flex gap-5 text-right">
            {figures(row).map(([value, label]) => (
              <span key={label}>
                <span className="block text-xl font-bold leading-none tabular-nums">{value}</span>
                <span className="label block text-[0.72rem] text-ink-soft">{label}</span>
              </span>
            ))}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Plaque({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink pt-4">
      <p className="label text-red">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function CaseLine({ item, counts, note }: { item: Case; counts: VerdictCounts; note: string }) {
  const total = VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
  return (
    <Link href={`/czy-to-juz-dziaderstwo/${item.slug}`} className="group block">
      <span className="label block text-ink-faint">{docket(item)}</span>
      <span className="block text-2xl font-bold leading-tight group-hover:text-red">{item.title}</span>
      <span className="mt-2 flex h-2" aria-hidden="true">
        {VERDICTS.map((option) => (
          <span
            key={option.key}
            className={cx("h-full", option.key === "nie" ? "bg-ink/15" : option.key === "tak" ? "bg-ink" : "bg-red")}
            style={{ width: `${total ? ((counts[option.key] ?? 0) / total) * 100 : 0}%` }}
          />
        ))}
      </span>
      <span className="label mt-2 block text-ink-soft">
        {note} · {total} {plural(total, "głos", "głosy", "głosów")}
      </span>
    </Link>
  );
}

export default async function HonorPage() {
  const [board, community, census] = await Promise.all([getHonorBoard(), getCommunity(), getCensus()]);

  const cases = CASES.flatMap((item) => {
    const counts = community?.verdicts.cases[item.slug] ?? {};
    const total = VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
    if (total < 5) return [];
    const top = Math.max(...VERDICTS.map((option) => counts[option.key] ?? 0));
    return [{ item, counts, total, spread: top / total, clinical: (counts.kliniczne ?? 0) / total }];
  });
  const disputed = [...cases].sort((a, b) => a.spread - b.spread)[0];
  const unanimous = [...cases].sort((a, b) => b.spread - a.spread).find((entry) => entry !== disputed);
  const clinical = [...cases].sort((a, b) => b.clinical - a.clinical).find((entry) => entry !== disputed && entry !== unanimous);

  const observed = Object.entries(community?.sightings.species ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const weekTop = Object.entries(community?.sightings.week ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])[0];
  const region = Object.entries(community?.sightings.regions ?? {}).sort((a, b) => b[1] - a[1])[0];
  const diagnosed =
    census && census.total >= MIN_RESULTS
      ? Object.entries(census.species)
          .filter(([key]) => known.has(key))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
      : [];
  const hybrid = census && census.total >= MIN_RESULTS ? census.hybrids[0] : undefined;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/tablica-honorowa" }]),
          { "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url: `${site.url}/tablica-honorowa`, inLanguage: "pl", publisher: institute },
        ]}
      />
      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza. Do tego sprawy, które podzieliły naród, i gatunki, których nie dało się przeoczyć. Aktualizowana co kilka minut.",
        )}
        meta={`${number.format(board?.visible ?? 0)} ${plural(board?.visible ?? 0, "osoba", "osoby", "osób")} na Tablicy · tylko pseudonimy, tylko za zgodą`}
        aside={
          <div className="flex justify-end gap-3" aria-hidden="true">
            <Medal place={2} className="mt-8 h-28" />
            <Medal place={1} className="h-36" />
            <Medal place={3} className="mt-12 h-24" />
          </div>
        }
      />

      <Section id="przodownicy" title="Przodownicy" aside="Za zgodą zainteresowanych">
        <div className="grid gap-14 lg:grid-cols-3 lg:gap-10">
          <div>
            <h3 className="mb-4 text-2xl font-bold leading-tight">Obserwatorzy terenowi</h3>
            <Leaders
              rows={board?.observers ?? []}
              orders={ORDERS.observers}
              empty="Tablica czeka na pierwszych obserwatorów. Gwoździe już są."
              figures={(row) => [
                [`${row.species}`, `z ${SPECIES.length} gat.`],
                [number.format(row.sightings), "zgłoszeń"],
              ]}
            />
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold leading-tight">Ławnicy Komisji</h3>
            <Leaders
              rows={board?.jurors ?? []}
              orders={ORDERS.jurors}
              empty="Wokanda pełna, ławy puste. Pierwszy ławnik z pseudonimem trafi tu od razu."
              figures={(row) => [[number.format(row.votes), "orzeczeń"]]}
            />
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold leading-tight">Zdzieracze kalendarza</h3>
            <Leaders
              rows={board?.calendar ?? []}
              orders={ORDERS.calendar}
              empty="Nikt jeszcze nie zrywa kartek regularnie. Kalendarz wisi i czeka."
              figures={(row) => [
                [`${row.best}`, "dni z rzędu"],
                [number.format(row.pages), "kartek"],
              ]}
            />
          </div>
        </div>
        <div className="mt-12 grid gap-10 border-t border-rule pt-8 lg:grid-cols-2">
          <HonorCta />
          <p className="label max-w-md text-ink-soft lg:justify-self-end">
            {typo(
              "Kolejność: obserwatorzy według liczby gatunków, potem zgłoszeń; ławnicy według liczby orzeczeń; zdzieracze według najdłuższej serii. Instytut nie publikuje niczego poza pseudonimem i tymi liczbami.",
            )}
          </p>
        </div>
      </Section>

      <Section id="sprawy" title="Sprawy, które podzieliły naród" aside="Od pięciu głosów">
        {cases.length ? (
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            {disputed && (
              <Plaque label="Najbardziej sporna">
                <CaseLine item={disputed.item} counts={disputed.counts} note="ławnicy podzieleni" />
              </Plaque>
            )}
            {unanimous && (
              <Plaque label="Najbardziej jednomyślna">
                <CaseLine item={unanimous.item} counts={unanimous.counts} note="prawie jednogłośnie" />
              </Plaque>
            )}
            {clinical && (
              <Plaque label="Najbardziej kliniczna">
                <CaseLine item={clinical.item} counts={clinical.counts} note={`${Math.round(clinical.clinical * 100)}% „kliniczne”`} />
              </Plaque>
            )}
          </div>
        ) : (
          <div className="grid items-center gap-10 border-t border-ink pt-6 lg:grid-cols-12">
            <p className="max-w-xl text-xl leading-snug lg:col-span-7">
              {typo("Żadna sprawa nie zebrała jeszcze pięciu głosów. Komisja nie wyróżnia spraw, o których zdecydowały dwie osoby i kot.")}
            </p>
            <div className="lg:col-span-5">
              <CommissionPlate animated className="ml-auto w-full max-w-xs" />
            </div>
          </div>
        )}
        <p className="mt-10">
          <Link href="/czy-to-juz-dziaderstwo" className="btn border border-ink hover:bg-ink hover:text-paper">
            Do Komisji <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      <Section id="gatunki" title="Gatunki wyróżnione" aside="Obserwacje i Narodowy Spis">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">Najlepiej obserwowane od początku</h3>
            {observed.length ? (
              <ol>
                {observed.map(([key, n], i) => {
                  const species = known.get(key)!;
                  return (
                    <li key={key}>
                      <Link href={`/atlas/${species.slug}`} className="group grid grid-cols-[2rem_4.5rem_1fr_auto] items-center gap-4 border-b border-rule py-2.5">
                        <span className="font-sans text-[0.9rem] font-semibold text-red">{i + 1}</span>
                        <SpeciesPlate species={key as SpeciesKey} className="w-full" />
                        <span className="text-xl font-bold leading-tight group-hover:text-red">{species.name}</span>
                        <span className="font-sans font-semibold tabular-nums">{number.format(n)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-4 leading-snug text-ink-soft">{typo("– Zjawisko nie wystąpiło. Obserwatorzy jeszcze się rozglądają.")}</p>
            )}
          </div>
          <div className="space-y-8 lg:col-span-5">
            <Plaque label="Gatunek tygodnia w terenie">
              {weekTop ? (
                <Link href={`/atlas/${known.get(weekTop[0])!.slug}`} className="group flex items-center gap-4">
                  <SpeciesPlate species={weekTop[0] as SpeciesKey} animated className="w-28 shrink-0" />
                  <span>
                    <span className="block text-2xl font-bold leading-tight group-hover:text-red">{known.get(weekTop[0])!.name}</span>
                    <span className="label block text-ink-soft">
                      {weekTop[1]} {plural(weekTop[1], "zgłoszenie", "zgłoszenia", "zgłoszeń")} w 7 dni
                    </span>
                  </span>
                </Link>
              ) : (
                <p className="leading-snug text-ink-soft">{typo("Ten tydzień jest jeszcze bez zgłoszeń.")}</p>
              )}
            </Plaque>
            <Plaque label="Najczujniejsze województwo">
              {region ? (
                <Link href="/obserwacje" className="group block">
                  <span className="block text-2xl font-bold leading-tight group-hover:text-red">{REGIONS[region[0]]?.name}</span>
                  <span className="label block text-ink-soft">
                    {number.format(region[1])} {plural(region[1], "zgłoszenie", "zgłoszenia", "zgłoszeń")} · mapa obserwacji
                  </span>
                </Link>
              ) : (
                <p className="leading-snug text-ink-soft">{typo("Jeszcze żadne. Województwa obserwują się nawzajem.")}</p>
              )}
            </Plaque>
            <Plaque label="Najczęstsze rozpoznania w teście">
              {diagnosed.length ? (
                <ol className="space-y-1">
                  {diagnosed.map(([key, n], i) => (
                    <li key={key} className="flex justify-between gap-4">
                      <Link href={`/atlas/${known.get(key)!.slug}`} className="font-bold hover:text-red">
                        {i + 1}. {known.get(key)!.name}
                      </Link>
                      <span className="font-sans tabular-nums">{number.format(n)}</span>
                    </li>
                  ))}
                  {hybrid && (
                    <li className="label pt-2 text-ink-soft">
                      Krzyżówka najczęstsza:{" "}
                      {hybrid.pair
                        .split("+")
                        .map((key) => known.get(key)?.name.replace("Dziaders ", ""))
                        .join(" × ")}{" "}
                      ({number.format(hybrid.n)})
                    </li>
                  )}
                </ol>
              ) : (
                <p className="leading-snug text-ink-soft">{typo(`Ranking rozpoznań publikuje się od ${MIN_RESULTS} badań w Narodowym Spisie.`)}</p>
              )}
            </Plaque>
          </div>
        </div>
      </Section>

      <TestPromo
        title="Na Tablicę trafia się czynami."
        text={typo("A na certyfikat testem. Pięć gabinetów, około czterech minut.")}
      />
    </main>
  );
}
