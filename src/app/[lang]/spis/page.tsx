import type { Metadata } from "next";
import { Crowd, Tally } from "@/components/crowd";
import { breadcrumbList, DataLicense, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Figure, SpeciesPlate } from "@/components/pictograms";
import { CensusProfileNote } from "@/components/profile-notes";
import { getRegions, REGION_GRID } from "@/content/regions";
import { getSpecies, type Species } from "@/content/species";
import { getTasks, getVerdicts } from "@/content/test";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getAnswerCounts, getCensus, MIN_RESULTS, type AnswerCounts, type Census } from "@/lib/census";
import { dataset, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { choices, DIAGNOSABLE } from "@/lib/test";
import { cx, formatDate, formatNumber, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Narodowy Spis Dziadersów",
    metaTitle: "Narodowy Spis Dziadersów: wyniki Testu Dziadersa",
    description:
      "Narodowy Spis Dziadersów: wyniki badań, gatunki, krzyżówki, najczęstsze odpowiedzi i województwa. Anonimowe dane aktualizowane co kilka minut.",
    days: ["", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"],
    clock: (hour: number) => `${hour}:00`,
    figures: {
      title: "Zbadano dotąd",
      today: "dziś",
      average: "średni wynik",
      proxy: "wywiady rodzinne",
      crowd: (n: number) => `${n} na 100 zbadanych ma dziaderstwo co najmniej podwyższone`,
      caption: (n: number) =>
        `Rys. 1. Na 100 zbadanych ${n} ${plural(n, "osoba ma", "osoby mają", "osób ma")} dziaderstwo co najmniej podwyższone. Źródło: Spis IBD.`,
    },
    zones: { title: "Stopień dziaderstwa", aside: "Odsetek zbadanych" },
    species: {
      title: "Gatunki",
      aside: "Rozpoznania, krzyżówki liczone u obu rodziców",
      intro: (unspecified: number, hybrid: number) =>
        `Utajony i Pospolity, czyli rozpoznania bez gatunku z Atlasu: ${unspecified}% badań. Krzyżówki: ${hybrid}%.`,
      first: "najczęstszy",
      last: "najrzadszy",
      diagnoses: (n: number) => plural(n, "rozpoznanie", "rozpoznania", "rozpoznań"),
      hybrids: "Najczęstsze krzyżówki",
      hybrid: (a: Species, b: Species) => `Dziaders ${a.prefix}-${b.suffix}`,
    },
    answers: {
      title: "Najczęstsze odpowiedzi",
      aside: "Formularz IBD-T2",
      horn: (falstart: number) => `W próbie klaksonowej ${falstart}% badanych zatrąbiło przed zielonym.`,
    },
    hours: {
      title: "Pora badania",
      aside: "Czas warszawski",
      peak: (day: string, hour: number, average: string) =>
        `Najbardziej dziaderska pora: ${day}, godzina ${hour}:00. Średni wynik o tej porze: ${average}%.`,
      caption: "Liczba badań według godziny rozpoczęcia.",
    },
    regions: {
      title: "Województwa",
      aside: "Średni wynik, od 5 badań",
      intro: "Województwo podaje się dobrowolnie przed badaniem. Kafelki ułożono jak na mapie, kształty uproszczono.",
    },
    retakes: {
      title: "Powtórki",
      aside: "Ta sama przeglądarka, kolejne badanie",
      share: "badań to powtórki: ktoś już się badał i wrócił, żeby sprawdzić jeszcze raz.",
      change: "punktu procentowego: o tyle średnio zmienia się wynik przy powtórce. Instytut uznaje to za objaw.",
    },
    lead: "Wyniki wszystkich badań przeprowadzonych w Instytucie. Anonimowo: bez imion, bez adresów i bez zgody rodziny.",
    asOf: (date: string) => `Stan na ${date} · aktualizacja co kilka minut`,
    preparing: "Spis w przygotowaniu",
    pending: "Spis w toku",
    closed: "Spis chwilowo nieczynny",
    soFar: (n: string, total: number) =>
      `Dotąd ${n} ${plural(total, "badanie", "badania", "badań")}. Instytut publikuje wyniki od ${MIN_RESULTS} badań, żeby nikt nie rozpoznał wujka po jednym kafelku.`,
    away: "Rachmistrzowie są na przerwie. Wyniki wrócą wkrótce.",
    method: {
      title: "Metodologia",
      text: "Spis obejmuje każde ukończone badanie formularzem IBD-T2: odpowiedzi, wynik, rozpoznanie, porę badania i, jeśli ktoś je podał, województwo. Imię z certyfikatu nie trafia do spisu, podobnie jak adres IP czy jakikolwiek identyfikator. Zestawienia odświeżane są co kilka minut. Dane są prawdziwe, badani nie zawsze.",
      privacy: "Polityka prywatności",
    },
    promo: { title: "Każde badanie trafia do spisu.", text: "Anonimowo. Zbadaj się i przesuń średnią krajową." },
  },
  sl: {
    title: "Nacionalni popis dziadersov",
    metaTitle: "Nacionalni popis dziadersov: rezultati testa dziadersa",
    description:
      "Rezultati vseh pregledov Inštituta: vrste, križanci, najpogostejši odgovori, najbolj dziaderska ura in vojvodstva. Anonimno, posodobljeno vsakih nekaj minut.",
    days: ["", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota", "nedelja"],
    clock: (hour: number) => `${hour}.00`,
    figures: {
      title: "Doslej pregledanih",
      today: "danes",
      average: "povprečni rezultat",
      proxy: "heteroanamneze",
      crowd: (n: number) => `${n} od 100 pregledanih ima vsaj povišano dziaderstvo`,
      caption: (n: number) =>
        `Slika 1. Od 100 pregledanih ${n} ${pluralSl(n, "oseba ima", "osebi imata", "osebe imajo", "oseb ima")} vsaj povišano dziaderstvo. Vir: Popis IBD.`,
    },
    zones: { title: "Stopnja dziaderstva", aside: "Delež pregledanih" },
    species: {
      title: "Vrste",
      aside: "Diagnoze, križanci šteti pri obeh starših",
      intro: (unspecified: number, hybrid: number) =>
        `Prikriti in Navadni, torej diagnoze brez vrste iz Atlasa: ${unspecified}% pregledov. Križanci: ${hybrid}%.`,
      first: "najpogostejši",
      last: "najredkejši",
      diagnoses: (n: number) => pluralSl(n, "diagnoza", "diagnozi", "diagnoze", "diagnoz"),
      hybrids: "Najpogostejši križanci",
      hybrid: (a: Species, b: Species) => `${a.prefix}-${b.suffix} dziaders`,
    },
    answers: {
      title: "Najpogostejši odgovori",
      aside: "Obrazec IBD-T2",
      horn: (falstart: number) => `Pri preizkusu s hupo je ${falstart}% preiskovanih zatrobilo pred zeleno.`,
    },
    hours: {
      title: "Čas pregleda",
      aside: "Varšavski čas",
      peak: (day: string, hour: number, average: string) =>
        `Najbolj dziaderski čas: ${day} ob ${hour}.00. Povprečni rezultat ob tem času: ${average}%.`,
      caption: "Število pregledov po uri začetka.",
    },
    regions: {
      title: "Vojvodstva",
      aside: "Povprečni rezultat, od 5 pregledov",
      intro: "Vojvodstvo se pred pregledom navede prostovoljno. Ploščice so razporejene kot na zemljevidu, oblike so poenostavljene.",
    },
    retakes: {
      title: "Ponovitve",
      aside: "Isti brskalnik, nov pregled",
      share: "pregledov je ponovitev: nekdo se je že pregledal in se vrnil, da preveri še enkrat.",
      change: "odstotne točke: za toliko se pri ponovitvi v povprečju spremeni rezultat. Inštitut to šteje za simptom.",
    },
    lead: "Rezultati vseh pregledov, opravljenih na Inštitutu. Anonimno: brez imen, brez naslovov in brez soglasja družine.",
    asOf: (date: string) => `Stanje na ${date} · posodobitev vsakih nekaj minut`,
    preparing: "Popis v pripravi",
    pending: "Popis poteka",
    closed: "Popis je začasno zaprt",
    soFar: (n: string, total: number) =>
      `Doslej ${n} ${pluralSl(total, "pregled", "pregleda", "pregledi", "pregledov")}. Inštitut objavlja rezultate šele od ${MIN_RESULTS} pregledov naprej, da nihče ne bi prepoznal strica po eni sami ploščici.`,
    away: "Popisovalci so na malici. Rezultati bodo kmalu spet tu.",
    method: {
      title: "Metodologija",
      text: "Popis zajema vsak končan pregled z obrazcem IBD-T2: odgovore, rezultat, diagnozo, čas pregleda in, če ga je kdo navedel, vojvodstvo. Ime s certifikata ne pride v popis, prav tako ne naslov IP ali kakršen koli identifikator. Preglednice se osvežujejo vsakih nekaj minut. Podatki so resnični, preiskovanci pa ne vedno.",
      privacy: "Politika zasebnosti",
    },
    promo: { title: "Vsak pregled gre v popis.", text: "Anonimno. Preglej se in premakni državno povprečje." },
  },
});

type Copy = (typeof COPY)[Locale];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/spis",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

const share = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

function Figures({ census, locale, t }: { census: Census; locale: Locale; t: Copy }) {
  const high = (census.zones["2"] ?? 0) + (census.zones["3"] ?? 0);
  const perHundred = share(high, census.total);
  return (
    <section aria-labelledby="liczby" className="border-t border-ink">
      <div className="wrap grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="liczby" className="label text-ink-soft">
            {t.figures.title}
          </h2>
          <p className="mt-2 text-[clamp(4.5rem,9vw,7rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
            {formatNumber(locale, census.total)}
          </p>
          <dl className="mt-8 grid grid-cols-3 border-t border-ink">
            {[
              [formatNumber(locale, census.today), t.figures.today],
              [`${census.average.toLocaleString(LOCALE_INFO[locale].intl)}%`, t.figures.average],
              [`${share(census.proxy, census.total)}%`, t.figures.proxy],
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
          <CensusProfileNote />
        </div>
        <figure className="lg:col-span-8">
          <Crowd count={perHundred} columns={25} className="w-full" label={t.figures.crowd(perHundred)} />
          <figcaption className="label mt-4 text-ink-soft">{t.figures.caption(perHundred)}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Zones({ census, locale, t }: { census: Census; locale: Locale; t: Copy }) {
  return (
    <Section id="stopnie" title={t.zones.title} aside={t.zones.aside}>
      <ol className="border-t border-ink">
        {getVerdicts(locale).map((verdict, i) => {
          const percent = share(census.zones[i] ?? 0, census.total);
          return (
            <li key={verdict.label} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 border-b border-rule py-4 md:grid-cols-[16rem_1fr_6rem]">
              <span className="text-xl font-bold leading-tight">{verdict.title}</span>
              <Tally percent={percent} locale={locale} className="col-span-2 row-start-2 w-full max-w-md md:col-span-1 md:row-start-1" />
              <span className="text-right text-3xl font-bold tabular-nums">{percent}%</span>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

function SpeciesRanking({ census, locale, t }: { census: Census; locale: Locale; t: Copy }) {
  // The diagnosable species, by key, with the edition's names and slugs.
  const edition = new Map(getSpecies(locale).map((species) => [species.key, species]));
  const diagnosable = DIAGNOSABLE.map((species) => edition.get(species.key) ?? species);
  const ranked = diagnosable.map((species) => ({ species, n: census.species[species.key] ?? 0 })).sort((a, b) => b.n - a.n);
  const top = ranked[0]?.n ?? 0;
  const byKey = Object.fromEntries(diagnosable.map((species) => [species.key, species]));
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
      title={t.species.title}
      aside={t.species.aside}
      intro={typo(t.species.intro(share(census.unspecified, census.total), share(census.hybrid, census.total)))}
    >
      <ol className="border-t border-ink">
        {ranked.map(({ species, n }, i) => (
          <li key={species.key}>
            <Link href={`/atlas/${species.slug}`} className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-5 border-b border-rule py-3 md:grid-cols-[6rem_16rem_1fr_5rem]">
              <SpeciesPlate species={species.key} className="w-full" />
              <span>
                <span className="block font-bold leading-tight group-hover:text-red">{species.name}</span>
                <span className="label text-ink-faint">
                  {i === 0 ? t.species.first : i === ranked.length - 1 ? t.species.last : `${formatNumber(locale, n)} ${t.species.diagnoses(n)}`}
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
          <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.species.hybrids}</h3>
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {hybrids.map(({ a, b, n }) => (
              <li key={`${a.key}-${b.key}`} className="flex items-center gap-3 border-b border-rule py-3">
                <span className="flex shrink-0">
                  <SpeciesPlate species={a.key} className="w-14" />
                  <SpeciesPlate species={b.key} className="-ml-3 w-14" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold leading-tight">{t.species.hybrid(a, b)}</span>
                  <span className="label text-ink-faint">
                    {formatNumber(locale, n)} {t.species.diagnoses(n)}
                  </span>
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
function Answers({ counts, locale, t }: { counts: AnswerCounts; locale: Locale; t: Copy }) {
  const tasks = getTasks(locale);
  const rows = tasks.flatMap((task, index) => {
    const options = choices(task);
    const row = counts[index];
    if (!options.length || !row) return [];
    const total = Object.values(row).reduce((sum, n) => sum + n, 0);
    const [value, n] = Object.entries(row).sort((a, b) => b[1] - a[1])[0] ?? [];
    const option = options[Number(value)];
    if (!option || total < MIN_RESULTS) return [];
    return [{ index, task, option, percent: share(n, total) }];
  });

  const reflex = counts[tasks.findIndex((task) => task.kind === "reflex")] ?? {};
  const reflexTotal = Object.values(reflex).reduce((sum, n) => sum + n, 0);
  const falstart = share((reflex[0] ?? 0) + (reflex[1] ?? 0), reflexTotal);

  return (
    <Section
      id="odpowiedzi"
      title={t.answers.title}
      aside={t.answers.aside}
      intro={reflexTotal >= MIN_RESULTS ? typo(t.answers.horn(falstart)) : undefined}
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

function Hours({ census, locale, t }: { census: Census; locale: Locale; t: Copy }) {
  const perHour = Array.from({ length: 24 }, (_, hour) => census.hours.filter((cell) => cell.hour === hour).reduce((sum, cell) => sum + cell.n, 0));
  const max = Math.max(1, ...perHour);
  const peak = census.hours.filter((cell) => cell.n >= 5).sort((a, b) => b.average - a.average)[0];

  return (
    <Section
      id="pory"
      title={t.hours.title}
      aside={t.hours.aside}
      intro={peak ? typo(t.hours.peak(t.days[peak.dow], peak.hour, peak.average.toLocaleString(LOCALE_INFO[locale].intl))) : undefined}
    >
      <figure>
        <div className="flex h-44 items-end gap-[3px] border-b border-ink" aria-hidden="true">
          {perHour.map((n, hour) => (
            <div key={hour} className={cx("flex-1", peak?.hour === hour ? "bg-red" : "bg-ink")} style={{ height: `${(n / max) * 100}%` }} />
          ))}
        </div>
        <div className="label mt-2 grid grid-cols-4 text-ink-soft" aria-hidden="true">
          {[0, 6, 12, 18].map(t.clock).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <figcaption className="sr-only">{t.hours.caption}</figcaption>
      </figure>
    </Section>
  );
}

function Regions({ census, locale, t }: { census: Census; locale: Locale; t: Copy }) {
  const names = getRegions(locale);
  const known = Object.values(census.regions).filter((region) => region.n >= 5);
  const shade = (average: number) => {
    const values = known.map((region) => region.average);
    const [low, high] = [Math.min(...values), Math.max(...values)];
    const level = high > low ? (average - low) / (high - low) : 0.5;
    return level > 0.75 ? "bg-ink text-paper" : level > 0.5 ? "bg-[#5d574e] text-paper" : level > 0.25 ? "bg-[#a69d8c]" : "bg-[#d3cbbb]";
  };
  return (
    <Section id="wojewodztwa" title={t.regions.title} aside={t.regions.aside} intro={typo(t.regions.intro)}>
      <div className="grid max-w-2xl grid-cols-4 gap-1.5">
        {REGION_GRID.flat().map((code) => {
          const region = census.regions[code];
          const enough = region && region.n >= 5;
          return (
            <div key={code} className={cx("flex aspect-square flex-col justify-between p-2 md:p-3", enough ? shade(region.average) : "border border-dashed border-rule text-ink-faint")}>
              <span className="font-sans text-[0.75rem] font-semibold leading-tight [overflow-wrap:anywhere]" title={names[code].name}>
                {code}
                <span className="hidden font-medium sm:block">{names[code].name}</span>
              </span>
              <span className="text-xl font-bold leading-none tabular-nums md:text-2xl">{enough ? `${Math.round(region.average)}%` : "—"}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Retakes({ census, locale, t }: { census: Census; locale: Locale; t: Copy }) {
  const change = census.retakeChange;
  return (
    <Section id="powtorki" title={t.retakes.title} aside={t.retakes.aside}>
      <div className="grid gap-10 border-t border-ink pt-6 md:grid-cols-2">
        <p>
          <span className="block text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-none tabular-nums">{share(census.retakes, census.total)}%</span>
          <span className="mt-2 block max-w-sm leading-snug text-ink-soft">{typo(t.retakes.share)}</span>
        </p>
        <p>
          <span className="block text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-none tabular-nums">
            {change === null ? "—" : `${change > 0 ? "+" : ""}${change.toLocaleString(LOCALE_INFO[locale].intl)}`}
          </span>
          <span className="mt-2 block max-w-sm leading-snug text-ink-soft">{typo(t.retakes.change)}</span>
        </p>
      </div>
    </Section>
  );
}

export default async function CensusPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const [census, counts] = await Promise.all([getCensus(), getAnswerCounts()]);
  const ready = census !== null && census.total >= MIN_RESULTS;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/spis" }]),
          dataset(locale, "/spis", {
            name: t.title,
            description: t.description,
            datePublished: site.launched,
            temporalCoverage: `${site.launched}/..`,
            ...(census ? { dateModified: census.updated } : {}),
          }),
        ]}
      />
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={
          census ? (
            <>
              {t.asOf(formatDate(locale, census.updated, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }))} ·{" "}
              <DataLicense />
            </>
          ) : (
            t.preparing
          )
        }
        aside={
          <svg viewBox="-4 -1 56 97" className="ml-auto hidden h-44 lg:block" aria-hidden="true">
            <Figure right="point" glasses="eyes" />
          </svg>
        }
      />

      {ready ? (
        <>
          <Figures census={census} locale={locale} t={t} />
          <Zones census={census} locale={locale} t={t} />
          <SpeciesRanking census={census} locale={locale} t={t} />
          {counts && <Answers counts={counts} locale={locale} t={t} />}
          <Hours census={census} locale={locale} t={t} />
          <Regions census={census} locale={locale} t={t} />
          <Retakes census={census} locale={locale} t={t} />
        </>
      ) : (
        <Section id="w-toku" title={census ? t.pending : t.closed}>
          <p className="max-w-2xl border-t border-ink pt-6 text-xl leading-snug">
            {typo(census ? t.soFar(formatNumber(locale, census.total), census.total) : t.away)}
          </p>
        </Section>
      )}

      <Section id="metodologia" title={t.method.title}>
        <p className="max-w-3xl border-t border-ink pt-6 leading-relaxed text-ink-soft">
          {typo(t.method.text)}{" "}
          <Link href="/prywatnosc" className="link text-ink">
            {t.method.privacy}
          </Link>
        </p>
      </Section>

      <TestPromo title={t.promo.title} text={typo(t.promo.text)} />
    </main>
  );
}
