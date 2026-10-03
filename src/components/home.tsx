import { caseKey, getCases } from "@/content/cases";
import { getDictionary } from "@/content/dictionary";
import { formatReportDate, getReports } from "@/content/reports";
import { getSpecies } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { sheetFor } from "@/lib/almanac";
import type { Bulletin } from "@/lib/bulletin";
import { warsawTime } from "@/lib/calendar";
import type { VerdictCounts } from "@/lib/community";
import { pageFor } from "@/lib/tear-off";
import { encodeResult, evaluate, SAMPLE_DRAFT } from "@/lib/test";
import { pct, plural, pluralSl, quote, typo } from "@/lib/typo";
import { Certificate } from "./certificate";
import { Crowd } from "./crowd";
import { CollectionLine } from "./profile-notes";
import { SpeciesPlate } from "./pictograms";
import { Section } from "./page";
import { Specimen } from "./specimen";
import { CaseFile } from "./verdict";

const COPY = defineCopy({
  pl: {
    heading: "Dziaderstwo nie wybiera.",
    lead: "Instytut Badań nad Dziaderstwem opisuje, klasyfikuje i mierzy dziaderstwo w Polsce. Zbadaj się, zanim będzie za późno: badanie trwa cztery minuty i kończy się certyfikatem.",
    test: "Wykonaj test",
    atlas: "Atlas Dziadersów",
    facts: "5 gabinetów · ok. 4 minuty · bez pobierania krwi",
    edition: null as { stamp: string; text: string } | null,
    index: "Narodowy Indeks Dziaderstwa",
    at: (date: string, time: string) => `${date}, godz. ${time}`,
    level: (zone: string) => `Natężenie ${zone}.`,
    forecast: "Przebieg i prognoza na Wigilię",
    crowdLabel: (count: number) => `${count} na 100 osób wykazuje objawy dziaderstwa`,
    crowdCaption: (count: number) =>
      `Rys. 2. Natężenie dziaderstwa w przeliczeniu na 100 osób: ${count} ${plural(count, "osoba", "osoby", "osób")} z objawami. Źródło: IBD.`,
    testTitle: "Test Dziadersa",
    testLead:
      "Badanie okresowe w pięciu gabinetach: plansze Rorschacha, próba klaksonowa, inwentaryzacja szuflady. Wynik, rozpoznanie gatunku, wyniki laboratoryjne i certyfikat do wysłania rodzinie.",
    testFacts: [
      ["5", "gabinetów"],
      ["16", "zadań"],
      ["1", "certyfikat"],
    ],
    start: "Rozpocznij badanie",
    sample: "Przykładowy wynik",
    atlasCount: (count: number) => `${count} ${plural(count, "gatunek", "gatunki", "gatunków")} w Atlasie`,
    atlasIntro: "Trzy okazy z kolekcji Instytutu. Brzmi znajomo? Test rozpoznaje dziesięć gatunków i ich krzyżówki.",
    atlasAll: "Cały Atlas",
    caseTitle: "Sprawa dnia",
    commission: "Komisja Orzekająca",
    casePosition: (number: number, total: number) => `Sprawa ${number} z ${total}`,
    docket: (total: number) => `Cała wokanda: ${total} spraw`,
    shelf: "Słownik, raporty i kalendarz",
    word: "Hasło dnia · Słownik Dziaderski",
    dictionaryAll: (count: number) => `Cały słownik: ${count} ${plural(count, "hasło", "hasła", "haseł")}`,
    latest: (number: string, date: string) => `Najnowszy raport · ${number} · ${date}`,
    reportsAll: "Wszystkie raporty Instytutu",
    calendar: (weekday: string) => `Kartka z kalendarza · ${weekday}`,
    sun: (sunrise: string, sunset: string) => `Wschód ${sunrise} · zachód ${sunset}`,
    tear: "Zerwij dzisiejszą kartkę",
  },
  sl: {
    heading: "Dziaderstvo ne izbira.",
    lead: "Inštitut za raziskave dziaderstva opisuje, razvršča in meri dziaderstvo na Poljskem. Preglej se, preden bo prepozno: pregled traja štiri minute in se konča s certifikatom.",
    test: "Opravi test",
    atlas: "Atlas dziadersov",
    facts: "5 ordinacij · pribl. 4 minute · brez odvzema krvi",
    edition: {
      stamp: "Slovenska izdaja",
      text: "Poljski inštitut v slovenskem prevodu. Poljske posebnosti pojasnjujejo opombe prevajalca, slovenske bralec prepozna sam.",
    },
    index: "Nacionalni indeks dziaderstva",
    at: (date: string, time: string) => `${date}, ob ${time}`,
    level: (zone: string) => `Jakost: ${zone}.`,
    forecast: "Potek in napoved za sveti večer",
    crowdLabel: (count: number) => `${count} od 100 oseb kaže znake dziaderstva`,
    crowdCaption: (count: number) =>
      `Sl. 2. Jakost dziaderstva na 100 oseb: ${count} ${pluralSl(count, "oseba", "osebi", "osebe", "oseb")} s simptomi. Vir: IBD.`,
    testTitle: "Test dziadersa",
    testLead:
      "Obdobni pregled v petih ordinacijah: Rorschachove table, preizkus s hupo, inventura predala. Rezultat, diagnoza vrste, laboratorijski izvidi in certifikat, ki ga pošlješ družini.",
    testFacts: [
      ["5", "ordinacij"],
      ["16", "nalog"],
      ["1", "certifikat"],
    ],
    start: "Začni pregled",
    sample: "Primer izvida",
    atlasCount: (count: number) => `${count} ${pluralSl(count, "vrsta", "vrsti", "vrste", "vrst")} v Atlasu`,
    atlasIntro: "Trije primerki iz zbirke Inštituta. Se ti zdijo znani? Test prepozna deset vrst in njihove križance.",
    atlasAll: "Ves Atlas",
    caseTitle: "Primer dneva",
    commission: "Razsodna komisija",
    casePosition: (number: number, total: number) => `Primer ${number} od ${total}`,
    docket: (total: number) => `Ves seznam obravnav: ${total} primerov`,
    shelf: "Slovar, poročila in koledar",
    word: "Geslo dneva · Dziaderski slovar",
    dictionaryAll: (count: number) => `Ves slovar: ${count} ${pluralSl(count, "geslo", "gesli", "gesla", "gesel")}`,
    latest: (number: string, date: string) => `Najnovejše poročilo · ${number} · ${date}`,
    reportsAll: "Vsa poročila Inštituta",
    calendar: (weekday: string) => `Trgalni koledar · ${weekday}`,
    sun: (sunrise: string, sunset: string) => `V Varšavi vzhod ${sunrise} · zahod ${sunset}`,
    tear: "Odtrgaj današnji list",
  },
});

const nationwide = (locale: Locale) => getSpecies(locale).filter((species) => !species.region && !species.occasion);
const FEATURED = ["grill", "parking", "wakacje"];

export function Hero({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section className="wrap grid items-center gap-14 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-6">
        {t.edition && (
          <p className="mb-7 flex max-w-xl flex-wrap items-center gap-x-4 gap-y-2">
            <span className="ink-worn inline-block rotate-[-2deg] border-4 border-double border-red px-3 py-1.5 font-sans text-[0.8rem] font-bold uppercase leading-none tracking-[0.12em] text-red">
              {t.edition.stamp}
            </span>
            <span className="font-sans text-[0.9rem] leading-snug text-ink-soft">{typo(t.edition.text)}</span>
          </p>
        )}
        <h1 className="text-[clamp(3.4rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.025em]">{t.heading}</h1>
        <p className="mt-7 max-w-xl text-[clamp(1.2rem,2vw,1.45rem)] leading-snug text-ink-soft">{typo(t.lead)}</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link href="/test" className="btn bg-ink text-paper hover:bg-red">
            {t.test} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/atlas" className="link font-sans font-medium">
            {t.atlas}
          </Link>
        </div>
        <p className="label mt-6 text-ink-faint">{t.facts}</p>
      </div>
      <Specimen locale={locale} className="lg:col-span-6" />
    </section>
  );
}

export function IndexBand({ bulletin, locale }: { bulletin: Bulletin; locale: Locale }) {
  const t = COPY[locale];
  const { value, season, zone } = bulletin.index;
  const count = Math.round(value);
  return (
    <section aria-labelledby="nid" className="border-t border-ink">
      <div className="wrap grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="nid" className="text-2xl font-bold leading-tight">
            {t.index}
          </h2>
          <p className="label mt-1 text-ink-soft">
            <time dateTime={bulletin.updated}>{t.at(bulletin.date, bulletin.time)}</time>
          </p>
          <p className="mt-6 text-[clamp(4.5rem,9vw,7rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
            {pct(value)}
            <span className="text-[0.45em]">%</span>
          </p>
          <p className="mt-5 max-w-sm">
            <span className="font-bold">{t.level(zone.label)}</span> <span className="text-ink-soft">{typo(season.alert)}</span>
          </p>
          <Link href="/indeks" className="link mt-5 inline-block font-sans font-medium">
            {t.forecast}
          </Link>
        </div>
        <figure className="lg:col-span-8">
          <Crowd count={count} columns={25} className="w-full" label={t.crowdLabel(count)} />
          <figcaption className="label mt-4 text-ink-soft">{t.crowdCaption(count)}</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function TestBand({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const sample = evaluate(SAMPLE_DRAFT, locale);
  return (
    <section aria-labelledby="test" className="bg-ink text-paper">
      <div className="wrap grid items-center gap-14 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <h2 id="test" className="text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            {t.testTitle}
          </h2>
          <p className="mt-6 max-w-lg text-[clamp(1.15rem,1.8vw,1.35rem)] leading-snug text-paper/80">{typo(t.testLead)}</p>
          <dl className="mt-10 grid max-w-lg grid-cols-3 border-t border-paper/30">
            {t.testFacts.map(([value, label]) => (
              <div key={label} className="pt-4">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="block text-5xl font-bold leading-none">{value}</span>
                  <span className="label mt-1 block text-paper/70">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/test" className="btn bg-paper text-ink hover:bg-red hover:text-paper">
              {t.start} <span aria-hidden="true">→</span>
            </Link>
            <Link href={`/wynik/${encodeResult(SAMPLE_DRAFT)}`} className="link font-sans font-medium text-paper/85">
              {t.sample}
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6">
          <Certificate
            locale={locale}
            sample
            score={sample.score}
            diagnosis={sample.diagnosis.name}
            latin={sample.diagnosis.latin}
            number={sample.certificate}
            species={sample.diagnosis.species.map((species) => species.key)}
          />
        </div>
      </div>
    </section>
  );
}

export function AtlasPlates({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const species = getSpecies(locale);
  const common = nationwide(locale);
  const featured = FEATURED.map((key) => common.find((item) => item.key === key)!);
  return (
    <Section id="atlas" title={t.atlas} aside={t.atlasCount(species.length)} intro={typo(t.atlasIntro)}>
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
        {featured.map((item) => (
          <li key={item.key}>
            <Link href={`/atlas/${item.slug}`} className="group block">
              <SpeciesPlate species={item.key} className="mx-auto w-full max-w-80 transition-transform duration-300 motion-safe:group-hover:-translate-y-1" />
              <span className="mt-3 block text-[1.2rem] font-bold leading-tight transition-colors group-hover:text-red">{item.name}</span>
              <span className="mt-1 block font-sans text-[0.9rem] leading-snug text-ink-soft">{typo(item.teaser)}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
        <Link href="/atlas" className="btn border border-ink hover:bg-ink hover:text-paper">
          {t.atlasAll} <span aria-hidden="true">→</span>
        </Link>
        <CollectionLine species={common.map((item) => item.key)} />
      </div>
    </Section>
  );
}

/** Today's case before the Komisja Orzekająca, to vote on right here. Votes are kept under the Polish slug. */
export function CaseOfTheDay({ bulletin, counts, locale }: { bulletin: Bulletin; counts: Record<string, VerdictCounts> | null; locale: Locale }) {
  const t = COPY[locale];
  const cases = getCases(locale);
  const item = cases[bulletin.today % cases.length];
  return (
    <Section
      id="wokanda-dnia"
      title={t.caseTitle}
      aside={
        <Link href="/czy-to-juz-dziaderstwo" className="transition-colors hover:text-red">
          {t.commission}
        </Link>
      }
    >
      <CaseFile item={item} initial={counts?.[caseKey(item)] ?? null} position={t.casePosition(item.number, cases.length)} />
      <p className="mt-10">
        <Link href="/czy-to-juz-dziaderstwo#wokanda" className="link font-sans font-medium">
          {t.docket(cases.length)}
        </Link>
      </p>
    </Section>
  );
}

export function Shelf({ bulletin, locale }: { bulletin: Bulletin; locale: Locale }) {
  const t = COPY[locale];
  const dictionary = getDictionary(locale);
  const entry = dictionary[bulletin.today % dictionary.length];
  const report = getReports(locale)[0];
  const finding = report.findings[0];
  const local = warsawTime(new Date(bulletin.updated));
  const page = pageFor(sheetFor(local.year, local.month, local.day, locale), locale);
  const [first, second] = page.proverb.split(" / ");

  return (
    <section aria-label={t.shelf} className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-3 lg:gap-10">
      <article className="border-t border-ink pt-5">
        <p className="label text-ink-soft">{t.word}</p>
        <h2 className="mt-6 text-[clamp(2.4rem,4.6vw,3.75rem)] font-bold leading-[0.95] tracking-[-0.02em]">
          <Link href={`/slownik/${entry.slug}`} className="transition-colors hover:text-red">
            {entry.headword}
          </Link>
        </h2>
        <p className="mt-3 italic text-ink-soft">{entry.grammar}</p>
        <p className="mt-5 max-w-lg text-[1.2rem] leading-relaxed">{typo(entry.senses[0].text)}</p>
        <p className="mt-5 max-w-lg border-l-2 border-red pl-4 italic">{quote(entry.example, locale)}</p>
        <Link href="/slownik" className="link mt-7 inline-block font-sans font-medium">
          {t.dictionaryAll(dictionary.length)}
        </Link>
      </article>

      <article className="border-t border-ink pt-5">
        <p className="label text-ink-soft">{t.latest(report.number, formatReportDate(report.date, locale))}</p>
        <p className="mt-6 text-[clamp(4rem,8vw,6.5rem)] font-bold leading-[0.85] tracking-[-0.03em] text-red">{finding.value}</p>
        <p className="mt-2 max-w-sm font-sans text-[0.95rem] leading-snug text-ink-soft">{typo(finding.label)}</p>
        <h2 className="mt-6 max-w-lg text-[1.6rem] font-bold leading-tight">
          <Link href={`/raporty/${report.slug}`} className="transition-colors hover:text-red">
            {report.title}
          </Link>
        </h2>
        <Link href="/raporty" className="link mt-7 inline-block font-sans font-medium">
          {t.reportsAll}
        </Link>
      </article>

      <article className="border-t border-ink pt-5">
        <p className="label text-ink-soft">{t.calendar(page.weekday)}</p>
        <Link href="/kalendarz" className="group mt-6 flex items-end gap-5">
          <span className={`text-[clamp(5rem,9vw,7.5rem)] font-bold leading-[0.8] tracking-[-0.03em] ${page.red ? "text-red" : ""}`}>{page.day}</span>
          <span className="pb-1 text-2xl font-bold leading-tight transition-colors group-hover:text-red">{page.monthGenitive}</span>
        </Link>
        <p className="mt-6 max-w-sm text-[1.15rem] italic leading-snug">
          {typo(first)}
          {second && (
            <>
              <br />
              {typo(second)}
            </>
          )}
        </p>
        <p className="label mt-4 text-ink-soft">{t.sun(page.sunrise, page.sunset)}</p>
        <Link href="/kalendarz" className="link mt-7 inline-block font-sans font-medium">
          {t.tear}
        </Link>
      </article>
    </section>
  );
}
