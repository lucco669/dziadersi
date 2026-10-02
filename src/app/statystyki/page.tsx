import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { IsoKey, IsoRow, isoUnit, type IsoKind } from "@/components/isotype";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Figure, SpeciesPlate } from "@/components/pictograms";
import { OCCASIONS } from "@/content/bingo";
import { CASES, docket, VERDICTS } from "@/content/cases";
import { DICTIONARY } from "@/content/dictionary";
import { REPORTS } from "@/content/reports";
import { ESTIMATED_SPECIES, SPECIES, type SpeciesKey } from "@/content/species";
import { STATIONS, TASKS } from "@/content/test";
import { getBulletin } from "@/lib/bulletin";
import { getCensus, MIN_RESULTS } from "@/lib/census";
import { getCommunity } from "@/lib/community";
import { TOTAL_LINES } from "@/lib/phrasebook";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, pct, plural, typo } from "@/lib/typo";

const title = "Mały Rocznik Statystyczny";
const description =
  "Wszystko, co policzył Instytut Badań nad Dziaderstwem: badania, obserwacje terenowe, orzeczenia Komisji, skreślenia w bingo, wypowiedzi z Rozmówek i trąbienia klaksonem. Na żywo, z przeliczeniem na rosoły.";

export const metadata: Metadata = pageMetadata({
  title: "Mały Rocznik Statystyczny Dziaderstwa",
  description,
  path: "/statystyki",
  shareTitle: `${title} · ${site.name}`,
  shareDescription: "Badania, obserwacje, orzeczenia i trąbienia klaksonem. Z przeliczeniem na rosoły.",
});

const number = new Intl.NumberFormat("pl-PL");
const decimal = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 1 });
const stamp = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
const known = new Map(SPECIES.map((species) => [species.key as string, species]));

/** GUS conventions: "·" when the figure is unknown, "–" when the phenomenon did not occur. */
function figure(value: number | null | undefined, format: (value: number) => string = (n) => number.format(n)) {
  if (value === null || value === undefined || Number.isNaN(value)) return "·";
  return value === 0 ? "–" : format(value);
}

const share = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

/** A number with its noun in the right form; Polish takes the genitive singular after a fraction ("2,5 godziny"). */
function counted(value: number, one: string, few: string, many: string, fraction: string) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${number.format(rounded)} ${plural(rounded, one, few, many)}` : `${decimal.format(rounded)} ${fraction}`;
}

/* The cover of the yearbook, with the specimen pointing at the stack. */
function Cover() {
  return (
    <svg viewBox="0 0 200 150" className="ml-auto w-full max-w-sm" role="img" aria-label="Rys. Stos roczników statystycznych i dziaders, który je czytał">
      <g>
        <rect x={60} y={118} width={128} height={20} fill="#cec6b6" />
        <rect x={60} y={118} width={10} height={20} fill="#8a8376" />
        <rect x={66} y={98} width={120} height={20} fill="#161513" />
        <rect x={66} y={98} width={10} height={20} fill="#3d6696" />
        <rect x={84} y={104} width={60} height={8} fill="#f4f0e7" opacity={0.85} />
        <g transform="rotate(-4 124 82)">
          <rect x={62} y={66} width={124} height={32} fill="#c4362c" />
          <rect x={62} y={66} width={10} height={32} fill="#a32a21" />
          <rect x={82} y={72} width={70} height={20} fill="#f4f0e7" />
          <text x={117} y={81} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={6.2} fontWeight={600} fill="#161513">
            MAŁY ROCZNIK
          </text>
          <text x={117} y={89} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={7.4} fontWeight={700} fill="#c4362c">
            2026
          </text>
        </g>
      </g>
      <g transform="translate(4 42) scale(0.98)">
        <Figure right="point" glasses="eyes" />
      </g>
    </svg>
  );
}

function Figures({ items }: { items: [string, string, string?][] }) {
  return (
    <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-3 lg:grid-cols-6">
      {items.map(([label, value, note]) => (
        <div key={label} className="border-b border-rule py-4 pr-4">
          <dt className="label text-ink-soft">{label}</dt>
          <dd className="mt-1 text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-none tabular-nums">{value}</dd>
          {note && <dd className="label mt-1.5 text-ink-faint">{note}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** "Tabl. 3." in the Rocznik's own numbering, with the source line under it. */
function Table({ number: index, title: caption, children, source = "Źródło: IBD." }: { number: number; title: string; children: ReactNode; source?: string }) {
  return (
    <figure>
      <figcaption className="border-b border-ink pb-3">
        <span className="label block text-ink-soft">Tabl. {index}.</span>
        <span className="mt-0.5 block font-bold leading-tight">{caption}</span>
      </figcaption>
      {children}
      <p className="label mt-3 text-ink-faint">{source}</p>
    </figure>
  );
}

function Picture({ kind, value, max = 36, label, unitLabel }: { kind: IsoKind; value: number | null; max?: number; label: string; unitLabel: (unit: number) => string }) {
  if (value === null) return <p className="label text-ink-faint">· Brak informacji.</p>;
  const unit = isoUnit(value, max);
  return (
    <div>
      <IsoRow kind={kind} value={value} unit={unit} label={label} />
      <IsoKey kind={kind}>{unitLabel(unit)}</IsoKey>
    </div>
  );
}

type Conversion = { value: string; label: string; method: string };

export default async function YearbookPage() {
  const [census, community, bulletin] = await Promise.all([getCensus(), getCommunity(), getBulletin()]);
  const updated = community?.updated ?? census?.updated ?? bulletin.updated;
  // "Now" comes from the cached data, so the page can be prerendered and refreshed in the background.
  const now = Date.parse(updated);
  const tallies = community?.tallies ?? null;
  const t = (kind: string) => (tallies ? (tallies[kind] ?? 0) : null);

  /* Dział I. Badania. */
  const tests = census?.total ?? null;
  const hours = tests === null ? null : (tests * 4) / 60;
  const broths = hours === null ? null : hours / 3;
  const enough = (census?.total ?? 0) >= MIN_RESULTS;
  const zoneLabels = ["Śladowe", "Umiarkowane", "Podwyższone", "Kliniczne"];

  /* Dział II. Obserwacje. */
  const sightings = community?.sightings ?? null;
  const observedSpecies = sightings ? Object.keys(sightings.species).filter((key) => known.has(key)).length : null;
  const topObserved = Object.entries(sightings?.species ?? {})
    .filter(([key]) => known.has(key))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const hoursOfDay = Array.from({ length: 24 }, (_, hour) => sightings?.hours[String(hour)] ?? 0);
  const peakHour = hoursOfDay.indexOf(Math.max(...hoursOfDay));
  const busiest = Math.max(1, ...hoursOfDay);

  /* Dział III. Komisja. */
  const verdicts = community?.verdicts ?? null;
  const totals = Object.fromEntries(VERDICTS.map((option) => [option.key, 0])) as Record<string, number>;
  let agreeing = 0;
  const contested: { slug: string; spread: number; votes: number }[] = [];
  for (const item of CASES) {
    const counts = verdicts?.cases[item.slug] ?? {};
    const votes = VERDICTS.reduce((sum, option) => sum + (counts[option.key] ?? 0), 0);
    for (const option of VERDICTS) totals[option.key] += counts[option.key] ?? 0;
    agreeing += counts[item.expert] ?? 0;
    if (votes >= 5) contested.push({ slug: item.slug, spread: Math.max(...VERDICTS.map((option) => counts[option.key] ?? 0)) / votes, votes });
  }
  const allVotes = VERDICTS.reduce((sum, option) => sum + totals[option.key], 0);
  contested.sort((a, b) => a.spread - b.spread);
  const disputed = contested[0] ? CASES.find((item) => item.slug === contested[0].slug) : undefined;
  const unanimous = contested.at(-1) ? CASES.find((item) => item.slug === contested.at(-1)!.slug) : undefined;

  /* Dział V. Zbiory. */
  const regional = SPECIES.filter((species) => species.region).length;
  const occasional = SPECIES.filter((species) => species.occasion).length;
  const squares = OCCASIONS.reduce((sum, occasion) => sum + occasion.squares.length, 0);
  const monthsOfWork = Math.max(1, (now - Date.UTC(2026, 0, 1)) / (30.44 * 86_400_000));
  const perMonth = SPECIES.length / monthsOfWork;
  const completeYear = 2026 + Math.ceil((ESTIMATED_SPECIES - SPECIES.length) / perMonth / 12);
  const definitionWords = DICTIONARY.reduce((sum, entry) => sum + entry.senses.reduce((words, sense) => words + sense.text.split(/\s+/).length, 0), 0);

  /* Dział VI. Przeliczenia. */
  const lines = t("rozmowki");
  const honks = t("klakson");
  const crossed = t("bingo-pole");
  const certificates = t("certyfikat");
  const accounts = community?.accounts ?? null;
  const daysOpen = Math.max(1, (now - Date.UTC(2026, 9, 1)) / 86_400_000);
  const poolYear = lines ? 2026 + Math.ceil(TOTAL_LINES / (lines / daysOpen) / 365) : null;

  const conversions: Conversion[] = [
    {
      value: figure(tests === null ? null : (tests * 7) / 100, (n) => `${decimal.format(n)} m`),
      label: "wąsa łącznie, gdyby wąsy wszystkich zbadanych ułożyć w jednej linii",
      method: `Instytut przyjmuje 7 cm wąsa na osobę badaną, także u osób bez wąsów. To ${figure(tests === null ? null : (tests * 0.07) / 4.7, (n) => decimal.format(n))} długości Passata kombi.`,
    },
    {
      value: figure(broths, (n) => counted(n, "rosół", "rosoły", "rosołów", "rosołu")),
      label: "tyle trwały wszystkie badania w gabinetach Instytutu",
      method: "Badanie trwa około 4 minut. Rosół, jednostka czasu niedzielnego, gotuje się 3 godziny na małym ogniu.",
    },
    {
      value: figure(honks === null ? null : (honks * 0.6) / 60, (n) => `${decimal.format(n)} min`),
      label: "nieprzerwanego trąbienia, gdyby wszystkie klaksony z próby klaksonowej nacisnąć po kolei",
      method: "Jedno trąbnięcie trwa średnio 0,6 sekundy. Zielone światło na skrzyżowaniu trwa 30 sekund, więc większość trąbień zmieściłaby się na jednym, przy dobrej organizacji.",
    },
    {
      value: figure(lines === null ? null : (lines * 9) / 3600 / 14, (n) => counted(n, "wesele", "wesela", "wesel", "wesela")),
      label: "trzeba by przegadać, żeby powiedzieć przy stole wszystko, co wylosowały Rozmówki",
      method: "Wypowiedź trwa około 9 sekund, wesele 14 godzin. Poprawiny liczone osobno.",
    },
    {
      value: figure(crossed === null ? null : crossed / 3, (n) => number.format(Math.round(n))),
      label: "tylu wujków skreślono w Dziaders Bingo",
      method: "Instytut przyjmuje, że co trzecie skreślone pole dotyczy wujka. Pozostałe dotyczą szwagra.",
    },
    {
      value: figure(certificates === null ? null : certificates / 12, (n) => counted(n, "lodówki", "lodówek", "lodówek", "lodówki")),
      label: "potrzeba, żeby przypiąć magnesem do drzwi wszystkie pobrane certyfikaty",
      method: "Na drzwiach przeciętnej lodówki mieści się 12 certyfikatów, licząc zaproszenie na komunię kuzyna jako jeden.",
    },
    {
      value: figure(accounts === null ? null : accounts / 3.4, (n) => `${decimal.format(n)}%`),
      label: "szuflady ze wszystkim zajęłyby kartoteki Profilu Dziaderskiego, wydrukowane",
      method: "Do szuflady mieści się 340 kartotek, po wyjęciu gumek recepturek, baterii i instrukcji do tostera z 1998 roku.",
    },
    {
      value: poolYear ? String(poolYear) : figure(lines),
      label: `rok, w którym Rozmówki wyczerpią pulę ${number.format(TOTAL_LINES)} wypowiedzi`,
      method: "Przy obecnym tempie losowania i pod warunkiem, że nikt nie wylosuje dwa razy tej samej. Wujek wylosuje.",
    },
  ];

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/statystyki" }]),
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${title} Dziaderstwa`,
            description,
            url: `${site.url}/statystyki`,
            inLanguage: "pl",
            creator: institute,
            publisher: institute,
            isAccessibleForFree: true,
            temporalCoverage: `${site.launched}/..`,
            dateModified: updated,
            variableMeasured: ["Badania", "Obserwacje terenowe", "Orzeczenia", "Wypowiedzi z Rozmówek", "Skreślenia w bingo", "Trąbienia klaksonem"],
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Wszystko, co Instytut policzył od otwarcia: badania, obserwacje, orzeczenia, skreślenia w bingo i trąbienia klaksonem. Dane z Narodowego Spisu, Sieci Obserwatorów Terenowych, Komisji Orzekającej i liczników w pomocach naukowych.",
        )}
        meta={
          <>
            Rocznik 2026 · Stan na <time dateTime={updated}>{stamp.format(new Date(updated))}</time> · aktualizacja co kilka minut
          </>
        }
        aside={<Cover />}
      />

      <nav aria-label="Działy Rocznika" className="wrap mt-12">
        <ol className="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["#badania", "I", "Badania"],
            ["#obserwacje", "II", "Obserwacje terenowe"],
            ["#komisja", "III", "Komisja Orzekająca"],
            ["#pomoce", "IV", "Pomoce naukowe"],
            ["#zbiory", "V", "Zbiory Instytutu"],
            ["#przeliczenia", "VI", "Przeliczenia Instytutu"],
            ["#znaki", "", "Objaśnienia znaków umownych"],
          ].map(([href, numeral, label]) => (
            <li key={href} className="border-b border-rule">
              <a href={href} className="group flex items-baseline gap-3 py-3">
                <span className="w-8 font-sans text-[0.85rem] font-semibold text-red">{numeral}</span>
                <span className="font-bold leading-tight transition-colors group-hover:text-red">{label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <Section id="badania" title="Dział I. Badania" aside="Źródło: Narodowy Spis Dziadersów">
        <Figures
          items={[
            ["Badań ogółem", figure(tests)],
            ["W tym dziś", figure(census?.today)],
            ["Średni wynik", figure(census?.average, (n) => `${pct(n)}%`)],
            ["Wywiady rodzinne", figure(census ? share(census.proxy, census.total) : null, (n) => `${n}%`), "badań"],
            ["Powtórki", figure(census?.retakes), census?.retakeChange ? `śr. zmiana ${census.retakeChange > 0 ? "+" : ""}${decimal.format(census.retakeChange)} pkt` : undefined],
            ["Indeks dziś", `${pct(bulletin.index.value)}%`, bulletin.index.zone.label],
          ]}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="font-bold leading-tight">Czas spędzony w gabinetach Instytutu</h3>
            <p className="mt-1 max-w-xl leading-snug text-ink-soft">
              {typo(
                hours === null
                  ? "Brak informacji: Spis jest chwilowo nieczynny."
                  : hours === 0
                    ? "Zjawisko nie wystąpiło. Pierwszy rosół czeka na pierwszego zbadanego."
                    : `Łącznie ${counted(hours, "godzina", "godziny", "godzin", "godziny")} badań, czyli ${counted(broths ?? 0, "rosół", "rosoły", "rosołów", "rosołu")} w jednostkach niedzielnych.`,
              )}
            </p>
            <div className="mt-5">
              <Picture
                kind="pot"
                value={broths}
                label={counted(broths ?? 0, "rosół", "rosoły", "rosołów", "rosołu")}
                unitLabel={(unit) => `1 garnek = ${number.format(unit)} ${plural(unit, "rosół", "rosoły", "rosołów")}, czyli ${number.format(unit * 3)} godz. badań`}
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Table number={1} title="Zbadani według natężenia dziaderstwa" source="Źródło: Narodowy Spis Dziadersów, IBD.">
              {enough && census ? (
                <ol>
                  {zoneLabels.map((label, i) => {
                    const n = census.zones[String(i)] ?? 0;
                    return (
                      <li key={label} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-4 border-b border-rule py-2.5">
                        <span className="font-sans text-[0.95rem]">{label}</span>
                        <span className="h-2.5 bg-ink/10">
                          <span className={cx("block h-full", i === 3 ? "bg-red" : "bg-ink")} style={{ width: `${share(n, census.total)}%` }} />
                        </span>
                        <span className="text-right font-sans text-[0.95rem] font-semibold tabular-nums">{share(n, census.total)}%</span>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="py-4 leading-snug text-ink-soft">
                  <span className="mr-2 font-sans font-semibold">x</span>
                  {typo(`Rozkłady publikuje się od ${MIN_RESULTS} wyników. Wcześniej mówiłyby więcej o konkretnym wujku niż o społeczeństwie.`)}
                </p>
              )}
            </Table>
            <Link href="/spis" className="link mt-5 inline-block font-sans font-medium">
              Pełne wyniki: Narodowy Spis Dziadersów
            </Link>
          </div>
        </div>
      </Section>

      <Section id="obserwacje" title="Dział II. Obserwacje terenowe" aside="Źródło: Sieć Obserwatorów Terenowych">
        <Figures
          items={[
            ["Zgłoszeń", figure(sightings?.total)],
            ["W tym dziś", figure(sightings?.today)],
            ["Obserwatorów", figure(sightings?.observers)],
            ["Na obserwatora", figure(sightings && sightings.observers ? sightings.total / sightings.observers : sightings ? 0 : null, (n) => decimal.format(n)), "zgłoszeń"],
            ["Gatunki zaobserwowane", figure(observedSpecies), `z ${SPECIES.length}`],
            ["Województwa", figure(sightings ? Object.keys(sightings.regions).length : null), "z 16"],
          ]}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Table number={2} title="Gatunki najczęściej obserwowane" source="Źródło: zgłoszenia z Profili Dziaderskich, IBD.">
              {topObserved.length ? (
                <ol>
                  {topObserved.map(([key, n], i) => {
                    const species = known.get(key)!;
                    return (
                      <li key={key} className="grid grid-cols-[1.5rem_3rem_1fr_auto] items-center gap-3 border-b border-rule py-2">
                        <span className="font-sans text-[0.85rem] font-semibold text-red">{i + 1}</span>
                        <SpeciesPlate species={key as SpeciesKey} className="w-full" />
                        <Link href={`/atlas/${species.slug}`} className="font-bold leading-tight hover:text-red">
                          {species.name}
                        </Link>
                        <span className="font-sans text-[0.95rem] font-semibold tabular-nums">{number.format(n)}</span>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="py-4 leading-snug text-ink-soft">
                  <span className="mr-2 font-sans font-semibold">–</span>
                  {typo("Zjawisko nie wystąpiło. Teren czeka na pierwszego obserwatora.")}
                </p>
              )}
            </Table>
          </div>
          <div className="lg:col-span-7">
            <figure>
              <figcaption className="border-b border-ink pb-3">
                <span className="label block text-ink-soft">Wykres 1.</span>
                <span className="mt-0.5 block font-bold leading-tight">O której Polacy widzą dziadersa</span>
              </figcaption>
              <div className="mt-6 flex h-40 items-end gap-[3px]" aria-hidden="true">
                {hoursOfDay.map((n, hour) => (
                  <div key={hour} className="flex h-full flex-1 flex-col justify-end">
                    <div className={cx("w-full", hour === peakHour && n > 0 ? "bg-red" : "bg-ink")} style={{ height: `${n ? Math.max(3, (n / busiest) * 100) : 1}%` }} />
                  </div>
                ))}
              </div>
              <div className="label mt-2 flex justify-between text-[0.75rem] text-ink-soft">
                {["0:00", "6:00", "12:00", "18:00", "23:00"].map((hour) => (
                  <span key={hour}>{hour}</span>
                ))}
              </div>
              <p className="mt-4 max-w-xl leading-snug">
                {typo(
                  sightings && sightings.total
                    ? `Najwięcej zgłoszeń o godzinie ${peakHour}:00. ${peakHour >= 17 && peakHour <= 20 ? "Wtedy wraca się z pracy i widać cały parking." : peakHour < 9 ? "Wtedy dziaders myje samochód i jest dobrze widoczny." : "O tej porze dziaders jest w szczytowej formie, a obserwator ma przerwę."}`
                    : "Wykres wypełni się wraz z pierwszymi zgłoszeniami. Godziny liczone według czasu warszawskiego.",
                )}
              </p>
              <p className="label mt-3 text-ink-faint">Źródło: IBD. Liczba zgłoszeń według godziny, czas warszawski.</p>
            </figure>
            <div className="mt-10">
              <Picture
                kind="binoculars"
                value={sightings?.total ?? null}
                label={counted(sightings?.total ?? 0, "zgłoszenie", "zgłoszenia", "zgłoszeń", "zgłoszenia")}
                unitLabel={(unit) => `1 lornetka = ${number.format(unit)} ${plural(unit, "zgłoszenie", "zgłoszenia", "zgłoszeń")}`}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="komisja" title="Dział III. Komisja Orzekająca" aside="Źródło: akta Komisji">
        <Figures
          items={[
            ["Głosów ławników", figure(verdicts?.total)],
            ["Ławnicy z profilem", figure(verdicts?.jurors)],
            ["Spraw na wokandzie", number.format(CASES.length)],
            ["Zgodność z Komisją", figure(verdicts ? share(agreeing, allVotes) : null, (n) => `${n}%`), "głosów"],
            ["Orzeczeń „kliniczne”", figure(verdicts ? share(totals.kliniczne, allVotes) : null, (n) => `${n}%`), "głosów"],
            ["Zgłoszeń spraw", figure(community?.submissions), "w sekretariacie"],
          ]}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Table number={3} title="Głosy ławników według rodzaju orzeczenia">
              {allVotes ? (
                <>
                  <div className="mt-5 flex h-10" aria-hidden="true">
                    {VERDICTS.map((option) => (
                      <div
                        key={option.key}
                        className={cx("h-full", option.key === "nie" ? "bg-ink/15" : option.key === "tak" ? "bg-ink" : "bg-red")}
                        style={{ width: `${share(totals[option.key], allVotes)}%` }}
                      />
                    ))}
                  </div>
                  <ul className="mt-3">
                    {VERDICTS.map((option) => (
                      <li key={option.key} className="grid grid-cols-[1fr_auto_3rem] gap-4 border-b border-rule py-2 font-sans text-[0.95rem]">
                        <span>{option.label}</span>
                        <span className="tabular-nums text-ink-soft">{number.format(totals[option.key])}</span>
                        <span className="text-right font-semibold tabular-nums">{share(totals[option.key], allVotes)}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="py-4 leading-snug text-ink-soft">
                  <span className="mr-2 font-sans font-semibold">{verdicts ? "–" : "·"}</span>
                  {typo(verdicts ? "Zjawisko nie wystąpiło. Wokanda czeka na ławników." : "Brak informacji. Sekretariat Komisji jest chwilowo nieczynny.")}
                </p>
              )}
            </Table>
            <div className="mt-10">
              <Picture
                kind="gavel"
                value={verdicts?.total ?? null}
                label={counted(verdicts?.total ?? 0, "głos", "głosy", "głosów", "głosu")}
                unitLabel={(unit) => `1 młotek = ${number.format(unit)} ${plural(unit, "głos", "głosy", "głosów")}`}
              />
            </div>
          </div>
          <div className="space-y-8 lg:col-span-5">
            {[
              { label: "Sprawa najbardziej sporna", item: disputed },
              { label: "Sprawa najbardziej jednomyślna", item: unanimous !== disputed ? unanimous : undefined },
            ].map(({ label, item }) => (
              <div key={label} className="border-t border-ink pt-4">
                <p className="label text-ink-soft">{label}</p>
                {item ? (
                  <Link href={`/czy-to-juz-dziaderstwo/${item.slug}`} className="group mt-2 block">
                    <span className="label block text-ink-faint">{docket(item)}</span>
                    <span className="block text-2xl font-bold leading-tight group-hover:text-red">{item.title}</span>
                  </Link>
                ) : (
                  <p className="mt-2 leading-snug text-ink-soft">{typo("x Za mało głosów. Komisja wskazuje sprawę od pięciu głosów.")}</p>
                )}
              </div>
            ))}
            <Link href="/czy-to-juz-dziaderstwo" className="btn border border-ink hover:bg-ink hover:text-paper">
              Do Komisji <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Section>

      <Section id="pomoce" title="Dział IV. Pomoce naukowe" aside="Źródło: liczniki Instytutu">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Table number={4} title="Użycie pomocy naukowych" source="Źródło: IBD. Liczniki bez identyfikatorów, od 2 października 2026.">
              <table className="w-full font-sans text-[0.95rem]">
                <tbody>
                  {(
                    [
                      ["Rozmówki dziaderskie", null],
                      ["wylosowane wypowiedzi", t("rozmowki")],
                      ["odczytane na głos", t("rozmowki-glos")],
                      ["zachowane w profilach", community ? (community.saved.rozmowki ?? 0) : null],
                      ["Dziaders Bingo", null],
                      ["wylosowane karty", t("bingo-karta")],
                      ["skreślone pola", t("bingo-pole")],
                      ["okrzyki „Bingo!”", t("bingo")],
                      ["Egzamin terenowy", null],
                      ["zdawane egzaminy", t("egzamin")],
                      ["zachowane w profilach", community ? (community.saved.egzamin ?? 0) : null],
                      ["Test Dziadersa", null],
                      ["trąbnięcia w próbie klaksonowej", t("klakson")],
                      ["pobrane certyfikaty i wyniki", t("certyfikat")],
                      ["udostępnienia", t("udostepnienie")],
                    ] as [string, number | null][]
                  ).map(([label, value], i) =>
                    value === null && /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(label) ? (
                      <tr key={`${label}-${i}`} className="border-b border-ink">
                        <th scope="rowgroup" colSpan={2} className="pb-2 pt-5 text-left font-serif text-[1.1rem] font-bold">
                          {label}
                        </th>
                      </tr>
                    ) : (
                      <tr key={`${label}-${i}`} className="border-b border-rule">
                        <th scope="row" className="py-2 pl-4 text-left font-normal text-ink-soft">
                          {label}
                        </th>
                        <td className="py-2 text-right font-semibold tabular-nums">{figure(value)}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </Table>
          </div>
          <div className="space-y-10 lg:col-span-6">
            {(
              [
                ["horn", t("klakson"), "Trąbnięcia w próbie klaksonowej", (unit: number) => `1 klakson = ${number.format(unit)} ${plural(unit, "trąbnięcie", "trąbnięcia", "trąbnięć")}`],
                ["bubble", t("rozmowki"), "Wypowiedzi z Rozmówek", (unit: number) => `1 dymek = ${number.format(unit)} ${plural(unit, "wypowiedź", "wypowiedzi", "wypowiedzi")}`],
                ["cross", t("bingo-pole"), "Pola skreślone w bingo", (unit: number) => `1 krzyżyk = ${number.format(unit)} ${plural(unit, "pole", "pola", "pól")}`],
                ["exam", t("egzamin"), "Egzaminy terenowe", (unit: number) => `1 arkusz = ${number.format(unit)} ${plural(unit, "egzamin", "egzaminy", "egzaminów")}`],
              ] as [IsoKind, number | null, string, (unit: number) => string][]
            ).map(([kind, value, label, unitLabel]) => (
              <div key={kind}>
                <h3 className="mb-3 font-bold leading-tight">
                  {label} <span className="label font-normal text-ink-soft">· {figure(value)}</span>
                </h3>
                <Picture kind={kind} value={value} label={`${label}: ${figure(value)}`} unitLabel={unitLabel} max={30} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="zbiory" title="Dział V. Zbiory Instytutu" aside="Stan zbiorów">
        <Figures
          items={[
            ["Gatunki w Atlasie", number.format(SPECIES.length), `${SPECIES.length - regional - occasional} ogólnopolskich · ${regional} regionalnych · ${occasional} okazjonalnych`],
            ["Hasła w Słowniku", number.format(DICTIONARY.length), `${number.format(definitionWords)} słów definicji`],
            ["Raporty", number.format(REPORTS.length), REPORTS[0].number],
            ["Sprawy Komisji", number.format(CASES.length), `${docket(CASES[0])} – ${docket(CASES[CASES.length - 1])}`],
            ["Pola bingo", number.format(squares), `${OCCASIONS.length} okazji`],
            ["Wypowiedzi w Rozmówkach", number.format(TOTAL_LINES), "możliwych kombinacji"],
          ]}
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <p className="max-w-xl text-[1.2rem] leading-relaxed">
            {typo(
              `Atlas opisuje ${SPECIES.length} z około ${ESTIMATED_SPECIES} gatunków występujących w Polsce, czyli ${share(SPECIES.length, ESTIMATED_SPECIES)}%. Przy obecnym tempie prac Pracowni Taksonomii komplet zostanie opisany w roku ${completeYear}. Pracownia uważa, że wcześniej, ale tak samo mówiła o remoncie łazienki.`,
            )}
          </p>
          <p className="max-w-xl text-[1.2rem] leading-relaxed">
            {typo(
              `Test Dziadersa ma ${TASKS.length} zadań w ${STATIONS.length} gabinetach. Egzamin terenowy losuje 12 pytań z ${SPECIES.length} gatunków i 7 rodzajów wskazówek, co daje więcej wariantów, niż Instytut potrafi policzyć bez kalkulatora z drukarką.`,
            )}
          </p>
        </div>
      </Section>

      <Section
        id="przeliczenia"
        title="Dział VI. Przeliczenia Instytutu"
        aside="Dane szacunkowe"
        intro={typo("Liczby z działów I–V w jednostkach, które rozumie cała rodzina. Metodologia pod każdą pozycją.")}
      >
        <ol className="grid gap-x-10 gap-y-12 border-t border-ink pt-8 md:grid-cols-2">
          {conversions.map((item, i) => (
            <li key={item.label} className="grid grid-cols-[2.5rem_1fr] gap-x-2">
              <span className="pt-2 font-sans text-[0.9rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[clamp(2.6rem,5vw,3.75rem)] font-bold leading-none tracking-[-0.02em] tabular-nums">{item.value}</p>
                <p className="mt-2 text-[1.15rem] leading-snug">{typo(item.label)}</p>
                <p className="label mt-3 max-w-md text-ink-soft">Metodologia: {typo(item.method)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="znaki" title="Objaśnienia znaków umownych" aside="Zgodnie z praktyką statystyki publicznej">
        <dl className="max-w-3xl border-t border-ink">
          {[
            ["–", "Kreska", "Zjawisko nie wystąpiło. Wujek twierdzi, że wystąpiło."],
            ["·", "Kropka", "Zupełny brak informacji albo brak informacji wiarygodnych. Dziaders wie, ale nie powie."],
            ["x", "Znak x", "Wypełnienie rubryki jest niemożliwe lub niecelowe. Zwykle dlatego, że pilot zaginął w fotelu."],
            ["w tym", "W tym", "Nie podaje się wszystkich składników sumy. Reszta poszła do szwagra."],
          ].map(([sign, name, text]) => (
            <div key={name} className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-b border-rule py-4 sm:grid-cols-[4.5rem_8rem_1fr]">
              <dt className="whitespace-nowrap text-2xl font-bold leading-none">{sign}</dt>
              <dd className="label pt-1 text-ink-soft sm:col-start-2">{name}</dd>
              <dd className="col-start-2 leading-snug sm:col-start-3">{typo(text)}</dd>
            </div>
          ))}
        </dl>
        <p className="label mt-6 max-w-3xl text-ink-soft">
          {typo(
            "Dane są zaokrąglone, więc suma składników może się różnić od wartości ogółem, jak paragon od tego, co pamięta tata. Rozkłady procentowe publikuje się od 30 obserwacji. Liczniki pomocy naukowych nie zawierają identyfikatorów: Instytut wie, ile razy zatrąbiono, ale nie wie kto.",
          )}{" "}
          <Link href="/prywatnosc" className="link text-ink">
            Prywatność
          </Link>
        </p>
      </Section>

      <TestPromo
        title="Każdy wynik to wkład w statystykę publiczną."
        text={typo("Test Dziadersa: pięć gabinetów, około czterech minut. Twój rosół zostanie doliczony do Działu I.")}
      />
    </main>
  );
}
