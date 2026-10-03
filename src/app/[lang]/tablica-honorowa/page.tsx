import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CommissionPlate, Medal } from "@/components/court";
import { HonorCta } from "@/components/honor";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { CASES, docket, getCases, VERDICTS, type Case } from "@/content/cases";
import { getRegions } from "@/content/regions";
import { getSpecies, SPECIES, type Species, type SpeciesKey } from "@/content/species";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getCensus, MIN_RESULTS } from "@/lib/census";
import { getCommunity, getHonorBoard, type VerdictCounts } from "@/lib/community";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, formatNumber, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Tablica Honorowa",
    metaTitle: "Tablica Honorowa Instytutu",
    description:
      "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza Instytutu Badań nad Dziaderstwem. Sprawy, które podzieliły naród, gatunki najlepiej obserwowane i najczęstsze rozpoznania.",
    lead: "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza. Do tego sprawy, które podzieliły naród, i gatunki, których nie dało się przeoczyć. Aktualizowana co kilka minut.",
    visible: (n: string, count: number) => `${n} ${plural(count, "osoba", "osoby", "osób")} na Tablicy · tylko pseudonimy, tylko za zgodą`,
    /** The three orders of each board, first to third place. */
    orders: {
      observers: ["Order Złotej Lornetki", "Srebrna Lornetka", "Lornetka z Brązu"],
      jurors: ["Order Złotego Młotka", "Srebrny Młotek", "Młotek z Brązu"],
      calendar: ["Order Złotej Kartki", "Srebrna Kartka", "Kartka z Brązu"],
    },
    leaders: {
      title: "Przodownicy",
      aside: "Za zgodą zainteresowanych",
      observers: "Obserwatorzy terenowi",
      observersEmpty: "Tablica czeka na pierwszych obserwatorów. Gwoździe już są.",
      ofSpecies: (n: number) => `z ${n} gat.`,
      sightings: "zgłoszeń",
      jurors: "Ławnicy Komisji",
      jurorsEmpty: "Wokanda pełna, ławy puste. Pierwszy ławnik z pseudonimem trafi tu od razu.",
      votes: "orzeczeń",
      calendar: "Zdzieracze kalendarza",
      calendarEmpty: "Nikt jeszcze nie zrywa kartek regularnie. Kalendarz wisi i czeka.",
      streak: "dni z rzędu",
      pages: "kartek",
      order:
        "Kolejność: obserwatorzy według liczby gatunków, potem zgłoszeń; ławnicy według liczby orzeczeń; zdzieracze według najdłuższej serii. Instytut nie publikuje niczego poza pseudonimem i tymi liczbami.",
    },
    cases: {
      title: "Sprawy, które podzieliły naród",
      aside: "Od pięciu głosów",
      disputed: "Najbardziej sporna",
      disputedNote: "ławnicy podzieleni",
      unanimous: "Najbardziej jednomyślna",
      unanimousNote: "prawie jednogłośnie",
      clinical: "Najbardziej kliniczna",
      clinicalNote: (percent: number) => `${percent}% „kliniczne”`,
      votes: (n: number) => `${n} ${plural(n, "głos", "głosy", "głosów")}`,
      none: "Żadna sprawa nie zebrała jeszcze pięciu głosów. Komisja nie wyróżnia spraw, o których zdecydowały dwie osoby i kot.",
      link: "Do Komisji",
    },
    species: {
      title: "Gatunki wyróżnione",
      aside: "Obserwacje i Narodowy Spis",
      observed: "Najlepiej obserwowane od początku",
      observedNone: "– Zjawisko nie wystąpiło. Obserwatorzy jeszcze się rozglądają.",
      week: "Gatunek tygodnia w terenie",
      weekCount: (n: number) => `${n} ${plural(n, "zgłoszenie", "zgłoszenia", "zgłoszeń")} w 7 dni`,
      weekNone: "Ten tydzień jest jeszcze bez zgłoszeń.",
      region: "Najczujniejsze województwo",
      regionCount: (n: string, count: number) => `${n} ${plural(count, "zgłoszenie", "zgłoszenia", "zgłoszeń")} · mapa obserwacji`,
      regionNone: "Jeszcze żadne. Województwa obserwują się nawzajem.",
      diagnosed: "Najczęstsze rozpoznania w teście",
      hybrid: "Krzyżówka najczęstsza:",
      /** "Grillowy" from "Dziaders Grillowy", for the hybrid line. */
      short: (species: Species) => species.name.replace("Dziaders ", ""),
      diagnosedNone: `Ranking rozpoznań publikuje się od ${MIN_RESULTS} badań w Narodowym Spisie.`,
    },
    promo: { title: "Na Tablicę trafia się czynami.", text: "A na certyfikat testem. Pięć gabinetów, około czterech minut." },
  },
  sl: {
    title: "Častna tabla",
    metaTitle: "Častna tabla Inštituta",
    description:
      "Udarniki opazovanja, porotniki in trgalci koledarja Inštituta za raziskave dziaderstva. Primeri, ki so razdelili narod, najbolje opazovane vrste in najpogostejše diagnoze.",
    lead: "Udarniki opazovanja, porotniki in trgalci koledarja. Poleg tega primeri, ki so razdelili narod, in vrste, ki jih ni bilo mogoče spregledati. Posodablja se vsakih nekaj minut.",
    visible: (n: string, count: number) =>
      `${n} ${pluralSl(count, "oseba", "osebi", "osebe", "oseb")} na Tabli · samo psevdonimi, samo s soglasjem`,
    orders: {
      observers: ["Red zlatega daljnogleda", "Srebrni daljnogled", "Bronasti daljnogled"],
      jurors: ["Red zlatega kladivca", "Srebrno kladivce", "Bronasto kladivce"],
      calendar: ["Red zlatega lista", "Srebrni list", "Bronasti list"],
    },
    leaders: {
      title: "Udarniki",
      aside: "S soglasjem vpletenih",
      observers: "Terenski opazovalci",
      observersEmpty: "Tabla čaka na prve opazovalce. Žeblji so že zabiti.",
      ofSpecies: (n: number) => `od ${n} vrst`,
      sightings: "prijav",
      jurors: "Porotniki Komisije",
      jurorsEmpty: "Dnevni red je poln, klopi so prazne. Prvi porotnik s psevdonimom pride sem takoj.",
      votes: "razsodb",
      calendar: "Trgalci koledarja",
      calendarEmpty: "Nihče še ne trga listov redno. Koledar visi in čaka.",
      streak: "dni zapored",
      pages: "listov",
      order:
        "Vrstni red: opazovalci po številu vrst, nato prijav; porotniki po številu razsodb; trgalci po najdaljšem nizu. Inštitut ne objavlja ničesar razen psevdonima in teh številk.",
    },
    cases: {
      title: "Primeri, ki so razdelili narod",
      aside: "Od petih glasov naprej",
      disputed: "Najbolj sporen",
      disputedNote: "porotniki razdeljeni",
      unanimous: "Najbolj enoglasen",
      unanimousNote: "skoraj soglasno",
      clinical: "Najbolj kliničen",
      clinicalNote: (percent: number) => `${percent}% »klinično«`,
      votes: (n: number) => `${n} ${pluralSl(n, "glas", "glasova", "glasovi", "glasov")}`,
      none: "Noben primer še ni zbral petih glasov. Komisija ne izpostavlja primerov, o katerih so odločile dve osebi in mačka.",
      link: "Na Komisijo",
    },
    species: {
      title: "Odlikovane vrste",
      aside: "Opazovanja in Nacionalni popis",
      observed: "Najbolje opazovane od začetka",
      observedNone: "– Pojava ni bilo. Opazovalci se še razgledujejo.",
      week: "Vrsta tedna na terenu",
      weekCount: (n: number) => `${n} ${pluralSl(n, "prijava", "prijavi", "prijave", "prijav")} v 7 dneh`,
      weekNone: "Ta teden je še brez prijav.",
      region: "Najbolj budno vojvodstvo",
      regionCount: (n: string, count: number) => `${n} ${pluralSl(count, "prijava", "prijavi", "prijave", "prijav")} · zemljevid opazovanj`,
      regionNone: "Še nobeno. Vojvodstva opazujejo druga drugo.",
      diagnosed: "Najpogostejše diagnoze v testu",
      hybrid: "Najpogostejši križanec:",
      /** "Žarni" from "Žarni dziaders", for the hybrid line. */
      short: (species: Species) => species.name.replace(/ dziaders$/, ""),
      diagnosedNone: `Lestvica diagnoz se objavlja šele od ${MIN_RESULTS} pregledov v Nacionalnem popisu naprej.`,
    },
    promo: { title: "Na Tablo prideš z dejanji.", text: "Do certifikata pa s testom. Pet ordinacij, približno štiri minute." },
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/tablica-honorowa",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

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

function CaseLine({ item, counts, note, votes }: { item: Case; counts: VerdictCounts; note: string; votes: (n: number) => string }) {
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
        {note} · {votes(total)}
      </span>
    </Link>
  );
}

export default async function HonorPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const known = new Map(getSpecies(locale).map((species) => [species.key as string, species]));
  const regions = getRegions(locale);
  const [board, community, census] = await Promise.all([getHonorBoard(), getCommunity(), getCensus()]);

  // Votes are kept under the Polish slugs; the edition's cases share their order.
  const edition = getCases(locale);
  const cases = CASES.flatMap((source, index) => {
    const counts = community?.verdicts.cases[source.slug] ?? {};
    const total = VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
    if (total < 5) return [];
    const top = Math.max(...VERDICTS.map((option) => counts[option.key] ?? 0));
    return [{ item: edition[index], counts, total, spread: top / total, clinical: (counts.kliniczne ?? 0) / total }];
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
          breadcrumbList(locale, [{ label: t.title, href: "/tablica-honorowa" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/tablica-honorowa", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.visible(formatNumber(locale, board?.visible ?? 0), board?.visible ?? 0)}
        aside={
          <div className="flex justify-end gap-3" aria-hidden="true">
            <Medal place={2} className="mt-8 h-28" />
            <Medal place={1} className="h-36" />
            <Medal place={3} className="mt-12 h-24" />
          </div>
        }
      />

      <Section id="przodownicy" title={t.leaders.title} aside={t.leaders.aside}>
        <div className="grid gap-14 lg:grid-cols-3 lg:gap-10">
          <div>
            <h3 className="mb-4 text-2xl font-bold leading-tight">{t.leaders.observers}</h3>
            <Leaders
              rows={board?.observers ?? []}
              orders={t.orders.observers}
              empty={t.leaders.observersEmpty}
              figures={(row) => [
                [`${row.species}`, t.leaders.ofSpecies(SPECIES.length)],
                [formatNumber(locale, row.sightings), t.leaders.sightings],
              ]}
            />
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold leading-tight">{t.leaders.jurors}</h3>
            <Leaders
              rows={board?.jurors ?? []}
              orders={t.orders.jurors}
              empty={t.leaders.jurorsEmpty}
              figures={(row) => [[formatNumber(locale, row.votes), t.leaders.votes]]}
            />
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold leading-tight">{t.leaders.calendar}</h3>
            <Leaders
              rows={board?.calendar ?? []}
              orders={t.orders.calendar}
              empty={t.leaders.calendarEmpty}
              figures={(row) => [
                [`${row.best}`, t.leaders.streak],
                [formatNumber(locale, row.pages), t.leaders.pages],
              ]}
            />
          </div>
        </div>
        <div className="mt-12 grid gap-10 border-t border-rule pt-8 lg:grid-cols-2">
          <HonorCta />
          <p className="label max-w-md text-ink-soft lg:justify-self-end">{typo(t.leaders.order)}</p>
        </div>
      </Section>

      <Section id="sprawy" title={t.cases.title} aside={t.cases.aside}>
        {cases.length ? (
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            {disputed && (
              <Plaque label={t.cases.disputed}>
                <CaseLine item={disputed.item} counts={disputed.counts} note={t.cases.disputedNote} votes={t.cases.votes} />
              </Plaque>
            )}
            {unanimous && (
              <Plaque label={t.cases.unanimous}>
                <CaseLine item={unanimous.item} counts={unanimous.counts} note={t.cases.unanimousNote} votes={t.cases.votes} />
              </Plaque>
            )}
            {clinical && (
              <Plaque label={t.cases.clinical}>
                <CaseLine item={clinical.item} counts={clinical.counts} note={t.cases.clinicalNote(Math.round(clinical.clinical * 100))} votes={t.cases.votes} />
              </Plaque>
            )}
          </div>
        ) : (
          <div className="grid items-center gap-10 border-t border-ink pt-6 lg:grid-cols-12">
            <p className="max-w-xl text-xl leading-snug lg:col-span-7">{typo(t.cases.none)}</p>
            <div className="lg:col-span-5">
              <CommissionPlate animated className="ml-auto w-full max-w-xs" />
            </div>
          </div>
        )}
        <p className="mt-10">
          <Link href="/czy-to-juz-dziaderstwo" className="btn border border-ink hover:bg-ink hover:text-paper">
            {t.cases.link} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Section>

      <Section id="gatunki" title={t.species.title} aside={t.species.aside}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.species.observed}</h3>
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
                        <span className="font-sans font-semibold tabular-nums">{formatNumber(locale, n)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-4 leading-snug text-ink-soft">{typo(t.species.observedNone)}</p>
            )}
          </div>
          <div className="space-y-8 lg:col-span-5">
            <Plaque label={t.species.week}>
              {weekTop ? (
                <Link href={`/atlas/${known.get(weekTop[0])!.slug}`} className="group flex items-center gap-4">
                  <SpeciesPlate species={weekTop[0] as SpeciesKey} animated className="w-28 shrink-0" />
                  <span>
                    <span className="block text-2xl font-bold leading-tight group-hover:text-red">{known.get(weekTop[0])!.name}</span>
                    <span className="label block text-ink-soft">{t.species.weekCount(weekTop[1])}</span>
                  </span>
                </Link>
              ) : (
                <p className="leading-snug text-ink-soft">{typo(t.species.weekNone)}</p>
              )}
            </Plaque>
            <Plaque label={t.species.region}>
              {region ? (
                <Link href="/obserwacje" className="group block">
                  <span className="block text-2xl font-bold leading-tight group-hover:text-red">{regions[region[0]]?.name}</span>
                  <span className="label block text-ink-soft">{t.species.regionCount(formatNumber(locale, region[1]), region[1])}</span>
                </Link>
              ) : (
                <p className="leading-snug text-ink-soft">{typo(t.species.regionNone)}</p>
              )}
            </Plaque>
            <Plaque label={t.species.diagnosed}>
              {diagnosed.length ? (
                <ol className="space-y-1">
                  {diagnosed.map(([key, n], i) => (
                    <li key={key} className="flex justify-between gap-4">
                      <Link href={`/atlas/${known.get(key)!.slug}`} className="font-bold hover:text-red">
                        {i + 1}. {known.get(key)!.name}
                      </Link>
                      <span className="font-sans tabular-nums">{formatNumber(locale, n)}</span>
                    </li>
                  ))}
                  {hybrid && (
                    <li className="label pt-2 text-ink-soft">
                      {t.species.hybrid}{" "}
                      {hybrid.pair
                        .split("+")
                        .map((key) => {
                          const species = known.get(key);
                          return species && t.species.short(species);
                        })
                        .join(" × ")}{" "}
                      ({formatNumber(locale, hybrid.n)})
                    </li>
                  )}
                </ol>
              ) : (
                <p className="leading-snug text-ink-soft">{typo(t.species.diagnosedNone)}</p>
              )}
            </Plaque>
          </div>
        </div>
      </Section>

      <TestPromo title={t.promo.title} text={typo(t.promo.text)} />
    </main>
  );
}
