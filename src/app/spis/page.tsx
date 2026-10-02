import type { Metadata } from "next";
import Link from "next/link";
import { Crowd, Tally } from "@/components/crowd";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Figure, SpeciesPlate } from "@/components/pictograms";
import { REGION_GRID, REGIONS } from "@/content/regions";
import { TASKS, VERDICTS } from "@/content/test";
import { getAnswerCounts, getCensus, MIN_RESULTS, type AnswerCounts, type Census } from "@/lib/census";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { choices, DIAGNOSABLE } from "@/lib/test";
import { cx, plural, typo } from "@/lib/typo";

const title = "Narodowy Spis Dziadersów";
const description =
  "Wyniki wszystkich badań Instytutu: gatunki, krzyżówki, najczęstsze odpowiedzi, najbardziej dziaderska godzina i województwa. Anonimowo, aktualizowane co kilka minut.";

export const metadata: Metadata = pageMetadata({
  title: "Narodowy Spis Dziadersów: wyniki Testu Dziadersa",
  description,
  path: "/spis",
  shareTitle: `${title} · ${site.name}`,
});

const DAYS = ["", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"];
const count = new Intl.NumberFormat("pl-PL");
const stamp = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" });
const share = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

function Figures({ census }: { census: Census }) {
  const high = (census.zones["2"] ?? 0) + (census.zones["3"] ?? 0);
  const perHundred = share(high, census.total);
  return (
    <section aria-labelledby="liczby" className="border-t border-ink">
      <div className="wrap grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="liczby" className="label text-ink-soft">
            Zbadano dotąd
          </h2>
          <p className="mt-2 text-[clamp(4.5rem,9vw,7rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
            {count.format(census.total)}
          </p>
          <dl className="mt-8 grid grid-cols-3 border-t border-ink">
            {[
              [count.format(census.today), "dziś"],
              [`${census.average.toLocaleString("pl-PL")}%`, "średni wynik"],
              [`${share(census.proxy, census.total)}%`, "wywiady rodzinne"],
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
        </div>
        <figure className="lg:col-span-8">
          <Crowd count={perHundred} columns={25} className="w-full" label={`${perHundred} na 100 zbadanych ma dziaderstwo co najmniej podwyższone`} />
          <figcaption className="label mt-4 text-ink-soft">
            Rys. 1. Na 100 zbadanych {perHundred} {plural(perHundred, "osoba ma", "osoby mają", "osób ma")} dziaderstwo co najmniej podwyższone. Źródło: Spis IBD.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function Zones({ census }: { census: Census }) {
  return (
    <Section id="stopnie" title="Stopień dziaderstwa" aside="Odsetek zbadanych">
      <ol className="border-t border-ink">
        {VERDICTS.map((verdict, i) => {
          const percent = share(census.zones[i] ?? 0, census.total);
          return (
            <li key={verdict.label} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 border-b border-rule py-4 md:grid-cols-[16rem_1fr_6rem]">
              <span className="text-xl font-bold leading-tight">{verdict.title}</span>
              <Tally percent={percent} className="col-span-2 row-start-2 w-full max-w-md md:col-span-1 md:row-start-1" />
              <span className="text-right text-3xl font-bold tabular-nums">{percent}%</span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

function Species({ census }: { census: Census }) {
  const ranked = DIAGNOSABLE.map((species) => ({ species, n: census.species[species.key] ?? 0 })).sort((a, b) => b.n - a.n);
  const top = ranked[0]?.n ?? 0;
  const byKey = Object.fromEntries(DIAGNOSABLE.map((species) => [species.key, species]));
  const hybrids = census.hybrids
    .map((item) => {
      const [a, b] = item.pair.split("+").map((key) => byKey[key]);
      return a && b ? { a, b, n: item.n } : null;
    })
    .filter((item) => item !== null)
    .slice(0, 6);

  return (
    <Section
      id="gatunki"
      title="Gatunki"
      aside="Rozpoznania, krzyżówki liczone u obu rodziców"
      intro={typo(`Utajony i Pospolity, czyli rozpoznania bez gatunku z Atlasu: ${share(census.unspecified, census.total)}% badań. Krzyżówki: ${share(census.hybrid, census.total)}%.`)}
    >
      <ol className="border-t border-ink">
        {ranked.map(({ species, n }, i) => (
          <li key={species.key}>
            <Link href={`/atlas/${species.slug}`} className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-5 border-b border-rule py-3 md:grid-cols-[6rem_16rem_1fr_5rem]">
              <SpeciesPlate species={species.key} className="w-full" />
              <span>
                <span className="block font-bold leading-tight group-hover:text-red">{species.name}</span>
                <span className="label text-ink-faint">
                  {i === 0 ? "najczęstszy" : i === ranked.length - 1 ? "najrzadszy" : `${count.format(n)} ${plural(n, "rozpoznanie", "rozpoznania", "rozpoznań")}`}
                </span>
              </span>
              <span className="col-span-3 row-start-2 h-2 bg-ink/10 md:col-span-1 md:row-start-1" aria-hidden="true">
                <span className={cx("block h-full", i === 0 ? "bg-red" : "bg-ink")} style={{ width: `${top ? (n / top) * 100 : 0}%` }} />
              </span>
              <span className="text-right text-2xl font-bold tabular-nums">{share(n, census.total)}%</span>
            </Link>
          </li>
        ))}
      </ol>

      {hybrids.length > 0 && (
        <div className="mt-14">
          <h3 className="label border-b border-ink pb-3 text-ink-soft">Najczęstsze krzyżówki</h3>
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {hybrids.map(({ a, b, n }) => (
              <li key={`${a.key}-${b.key}`} className="flex items-center gap-3 border-b border-rule py-3">
                <span className="flex shrink-0">
                  <SpeciesPlate species={a.key} className="w-14" />
                  <SpeciesPlate species={b.key} className="-ml-3 w-14" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold leading-tight">
                    Dziaders {a.prefix}-{b.suffix}
                  </span>
                  <span className="label text-ink-faint">{count.format(n)} {plural(n, "rozpoznanie", "rozpoznania", "rozpoznań")}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Section>
  );
}

/** The most common answer to every one-choice task, and a few numbers from the others. */
function Answers({ counts }: { counts: AnswerCounts }) {
  const rows = TASKS.flatMap((task, index) => {
    const options = choices(task);
    const row = counts[index];
    if (!options.length || !row) return [];
    const total = Object.values(row).reduce((sum, n) => sum + n, 0);
    const [value, n] = Object.entries(row).sort((a, b) => b[1] - a[1])[0] ?? [];
    const option = options[Number(value)];
    if (!option || total < MIN_RESULTS) return [];
    return [{ index, task, option, percent: share(n, total) }];
  });

  const reflex = counts[TASKS.findIndex((task) => task.kind === "reflex")] ?? {};
  const reflexTotal = Object.values(reflex).reduce((sum, n) => sum + n, 0);
  const falstart = share((reflex[0] ?? 0) + (reflex[1] ?? 0), reflexTotal);

  return (
    <Section
      id="odpowiedzi"
      title="Najczęstsze odpowiedzi"
      aside="Formularz IBD-T2"
      intro={reflexTotal >= MIN_RESULTS ? typo(`W próbie klaksonowej ${falstart}% badanych zatrąbiło przed zielonym.`) : undefined}
    >
      <ol className="border-t border-ink">
        {rows.map(({ index, task, option, percent }) => (
          <li key={index} className="grid gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_4rem] md:items-baseline">
            <span className="leading-snug text-ink-soft">
              {typo(task.prompt)}
              <span className="label mt-1 block text-ink-faint">{task.section}</span>
            </span>
            <span className="text-xl italic leading-snug">{typo(option.text)}</span>
            <span className="label font-semibold text-red md:text-right">{percent}%</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Hours({ census }: { census: Census }) {
  const perHour = Array.from({ length: 24 }, (_, hour) => census.hours.filter((cell) => cell.hour === hour).reduce((sum, cell) => sum + cell.n, 0));
  const max = Math.max(1, ...perHour);
  const peak = census.hours.filter((cell) => cell.n >= 5).sort((a, b) => b.average - a.average)[0];

  return (
    <Section
      id="pory"
      title="Pora badania"
      aside="Czas warszawski"
      intro={
        peak
          ? typo(`Najbardziej dziaderska pora: ${DAYS[peak.dow]}, godzina ${peak.hour}:00. Średni wynik o tej porze: ${peak.average.toLocaleString("pl-PL")}%.`)
          : undefined
      }
    >
      <figure>
        <div className="flex h-44 items-end gap-[3px] border-b border-ink" aria-hidden="true">
          {perHour.map((n, hour) => (
            <div key={hour} className={cx("flex-1", peak?.hour === hour ? "bg-red" : "bg-ink")} style={{ height: `${(n / max) * 100}%` }} />
          ))}
        </div>
        <div className="label mt-2 grid grid-cols-4 text-ink-soft" aria-hidden="true">
          {["0:00", "6:00", "12:00", "18:00"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <figcaption className="sr-only">Liczba badań według godziny rozpoczęcia.</figcaption>
      </figure>
    </Section>
  );
}

function Regions({ census }: { census: Census }) {
  const known = Object.values(census.regions).filter((region) => region.n >= 5);
  const shade = (average: number) => {
    const values = known.map((region) => region.average);
    const [low, high] = [Math.min(...values), Math.max(...values)];
    const level = high > low ? (average - low) / (high - low) : 0.5;
    return level > 0.75 ? "bg-ink text-paper" : level > 0.5 ? "bg-[#5d574e] text-paper" : level > 0.25 ? "bg-[#a69d8c]" : "bg-[#d3cbbb]";
  };
  return (
    <Section id="wojewodztwa" title="Województwa" aside="Średni wynik, od 5 badań" intro={typo("Województwo podaje się dobrowolnie przed badaniem. Kafelki ułożono jak na mapie, kształty uproszczono.")}>
      <div className="grid max-w-2xl grid-cols-4 gap-1.5">
        {REGION_GRID.flat().map((code) => {
          const region = census.regions[code];
          const enough = region && region.n >= 5;
          return (
            <div key={code} className={cx("flex aspect-square flex-col justify-between p-2 md:p-3", enough ? shade(region.average) : "border border-dashed border-rule text-ink-faint")}>
              <span className="font-sans text-[0.75rem] font-semibold leading-tight [overflow-wrap:anywhere]" title={REGIONS[code].name}>
                {code}
                <span className="hidden font-medium sm:block">{REGIONS[code].name}</span>
              </span>
              <span className="text-xl font-bold leading-none tabular-nums md:text-2xl">{enough ? `${Math.round(region.average)}%` : "—"}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Retakes({ census }: { census: Census }) {
  const change = census.retakeChange;
  return (
    <Section id="powtorki" title="Powtórki" aside="Ta sama przeglądarka, kolejne badanie">
      <div className="grid gap-10 border-t border-ink pt-6 md:grid-cols-2">
        <p>
          <span className="block text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-none tabular-nums">{share(census.retakes, census.total)}%</span>
          <span className="mt-2 block max-w-sm leading-snug text-ink-soft">{typo("badań to powtórki: ktoś już się badał i wrócił, żeby sprawdzić jeszcze raz.")}</span>
        </p>
        <p>
          <span className="block text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-none tabular-nums">
            {change === null ? "—" : `${change > 0 ? "+" : ""}${change.toLocaleString("pl-PL")}`}
          </span>
          <span className="mt-2 block max-w-sm leading-snug text-ink-soft">
            {typo("punktu procentowego: o tyle średnio zmienia się wynik przy powtórce. Instytut uznaje to za objaw.")}
          </span>
        </p>
      </div>
    </Section>
  );
}

export default async function CensusPage() {
  const [census, counts] = await Promise.all([getCensus(), getAnswerCounts()]);
  const ready = census !== null && census.total >= MIN_RESULTS;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/spis" }]),
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: title,
            description,
            url: `${site.url}/spis`,
            inLanguage: "pl",
            creator: institute,
            isAccessibleForFree: true,
            ...(census ? { dateModified: census.updated } : {}),
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo("Wyniki wszystkich badań przeprowadzonych w Instytucie. Anonimowo: bez imion, bez adresów i bez zgody rodziny.")}
        meta={census ? `Stan na ${stamp.format(new Date(census.updated))} · aktualizacja co kilka minut` : "Spis w przygotowaniu"}
        aside={
          <svg viewBox="-4 -1 56 97" className="ml-auto hidden h-44 lg:block" aria-hidden="true">
            <Figure right="point" glasses="eyes" />
          </svg>
        }
      />

      {ready ? (
        <>
          <Figures census={census} />
          <Zones census={census} />
          <Species census={census} />
          {counts && <Answers counts={counts} />}
          <Hours census={census} />
          <Regions census={census} />
          <Retakes census={census} />
        </>
      ) : (
        <Section id="w-toku" title={census ? "Spis w toku" : "Spis chwilowo nieczynny"}>
          <p className="max-w-2xl border-t border-ink pt-6 text-xl leading-snug">
            {typo(
              census
                ? `Dotąd ${count.format(census.total)} ${plural(census.total, "badanie", "badania", "badań")}. Instytut publikuje wyniki od ${MIN_RESULTS} badań, żeby nikt nie rozpoznał wujka po jednym kafelku.`
                : "Rachmistrzowie są na przerwie. Wyniki wrócą wkrótce.",
            )}
          </p>
        </Section>
      )}

      <Section id="metodologia" title="Metodologia">
        <p className="max-w-3xl border-t border-ink pt-6 leading-relaxed text-ink-soft">
          {typo(
            "Spis obejmuje każde ukończone badanie formularzem IBD-T2: odpowiedzi, wynik, rozpoznanie, porę badania i, jeśli ktoś je podał, województwo. Imię z certyfikatu nie trafia do spisu, podobnie jak adres IP czy jakikolwiek identyfikator. Zestawienia odświeżane są co kilka minut. Dane są prawdziwe, badani nie zawsze.",
          )}{" "}
          <Link href="/prywatnosc" className="link text-ink">
            Polityka prywatności
          </Link>
        </p>
      </Section>

      <TestPromo title="Każde badanie trafia do spisu." text={typo("Anonimowo. Zbadaj się i przesuń średnią krajową.")} />
    </main>
  );
}
