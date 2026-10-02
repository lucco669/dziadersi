import Link from "next/link";
import { CASES } from "@/content/cases";
import { DICTIONARY } from "@/content/dictionary";
import { REPORTS, formatReportDate } from "@/content/reports";
import { SPECIES } from "@/content/species";
import { sheetFor } from "@/lib/almanac";
import type { Bulletin } from "@/lib/bulletin";
import { warsawTime } from "@/lib/calendar";
import type { VerdictCounts } from "@/lib/community";
import { pageFor } from "@/lib/tear-off";
import { encodeResult, evaluate, SAMPLE_DRAFT } from "@/lib/test";
import { pct, plural, typo } from "@/lib/typo";
import { Certificate } from "./certificate";
import { Crowd } from "./crowd";
import { CollectionLine } from "./profile-notes";
import { SpeciesPlate } from "./pictograms";
import { Section } from "./page";
import { Specimen } from "./specimen";
import { CaseFile } from "./verdict";

const NATIONWIDE = SPECIES.filter((species) => !species.region && !species.occasion);
const sample = evaluate(SAMPLE_DRAFT);

export function Hero() {
  return (
    <section className="wrap grid items-center gap-14 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-6">
        <h1 className="text-[clamp(3.4rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.025em]">Dziaderstwo nie&nbsp;wybiera.</h1>
        <p className="mt-7 max-w-xl text-[clamp(1.2rem,2vw,1.45rem)] leading-snug text-ink-soft">
          {typo(
            "Instytut Badań nad Dziaderstwem opisuje, klasyfikuje i mierzy dziaderstwo w Polsce. Zbadaj się, zanim będzie za późno: badanie trwa cztery minuty i kończy się certyfikatem.",
          )}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link href="/test" className="btn bg-ink text-paper hover:bg-red">
            Wykonaj test <span aria-hidden="true">→</span>
          </Link>
          <Link href="/atlas" className="link font-sans font-medium">
            Atlas Dziadersów
          </Link>
        </div>
        <p className="label mt-6 text-ink-faint">5 gabinetów · ok. 4 minuty · bez pobierania krwi</p>
      </div>
      <Specimen className="lg:col-span-6" />
    </section>
  );
}

export function IndexBand({ bulletin }: { bulletin: Bulletin }) {
  const { value, season, zone } = bulletin.index;
  const count = Math.round(value);
  return (
    <section aria-labelledby="nid" className="border-t border-ink">
      <div className="wrap grid items-center gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="nid" className="text-2xl font-bold leading-tight">
            Narodowy Indeks Dziaderstwa
          </h2>
          <p className="label mt-1 text-ink-soft">
            <time dateTime={bulletin.updated}>
              {bulletin.date}, godz. {bulletin.time}
            </time>
          </p>
          <p className="mt-6 text-[clamp(4.5rem,9vw,7rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
            {pct(value)}
            <span className="text-[0.45em]">%</span>
          </p>
          <p className="mt-5 max-w-sm">
            <span className="font-bold">Natężenie {zone.label}.</span>{" "}
            <span className="text-ink-soft">{typo(season.alert)}</span>
          </p>
          <Link href="/indeks" className="link mt-5 inline-block font-sans font-medium">
            Przebieg i prognoza na Wigilię
          </Link>
        </div>
        <figure className="lg:col-span-8">
          <Crowd count={count} columns={25} className="w-full" label={`${count} na 100 osób wykazuje objawy dziaderstwa`} />
          <figcaption className="label mt-4 text-ink-soft">
            Rys. 2. Natężenie dziaderstwa w przeliczeniu na 100 osób: {count} {plural(count, "osoba", "osoby", "osób")} z
            objawami. Źródło: IBD.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function TestBand() {
  return (
    <section aria-labelledby="test" className="bg-ink text-paper">
      <div className="wrap grid items-center gap-14 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <h2 id="test" className="text-[clamp(2.75rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            Test Dziadersa
          </h2>
          <p className="mt-6 max-w-lg text-[clamp(1.15rem,1.8vw,1.35rem)] leading-snug text-paper/80">
            {typo(
              "Badanie okresowe w pięciu gabinetach: plansze Rorschacha, próba klaksonowa, inwentaryzacja szuflady. Wynik, rozpoznanie gatunku, wyniki laboratoryjne i certyfikat do wysłania rodzinie.",
            )}
          </p>
          <dl className="mt-10 grid max-w-lg grid-cols-3 border-t border-paper/30">
            {[
              ["5", "gabinetów"],
              ["16", "zadań"],
              ["1", "certyfikat"],
            ].map(([value, label]) => (
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
              Rozpocznij badanie <span aria-hidden="true">→</span>
            </Link>
            <Link href={`/wynik/${encodeResult(SAMPLE_DRAFT)}`} className="link font-sans font-medium text-paper/85">
              Przykładowy wynik
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6">
          <Certificate
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

export function AtlasPlates() {
  return (
    <Section
      id="atlas"
      title="Atlas Dziadersów"
      aside={`${SPECIES.length} ${plural(SPECIES.length, "gatunek", "gatunki", "gatunków")} w Atlasie`}
      intro={typo("Dziesięć gatunków występuje w całej Polsce. Test rozpoznaje każdy z nich, a także ich krzyżówki.")}
    >
      <ol className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {NATIONWIDE.map((species) => (
          <li key={species.key}>
            <Link href={`/atlas/${species.slug}`} className="group block">
              <SpeciesPlate species={species.key} className="w-full" />
              <span className="mt-3 block text-[1.2rem] font-bold leading-tight transition-colors group-hover:text-red">
                {species.name}
              </span>
              <span className="mt-1 block font-sans text-[0.9rem] leading-snug text-ink-soft">{typo(species.teaser)}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
        <Link href="/atlas" className="btn border border-ink hover:bg-ink hover:text-paper">
          Cały Atlas <span aria-hidden="true">→</span>
        </Link>
        <CollectionLine species={NATIONWIDE.map((species) => species.key)} />
      </div>
    </Section>
  );
}

/** Today's case before the Komisja Orzekająca, to vote on right here. */
export function CaseOfTheDay({ bulletin, counts }: { bulletin: Bulletin; counts: Record<string, VerdictCounts> | null }) {
  const item = CASES[bulletin.today % CASES.length];
  return (
    <Section
      id="wokanda-dnia"
      title="Sprawa dnia"
      aside={
        <Link href="/czy-to-juz-dziaderstwo" className="transition-colors hover:text-red">
          Komisja Orzekająca
        </Link>
      }
    >
      <CaseFile item={item} initial={counts?.[item.slug] ?? null} position={`Sprawa ${item.number} z ${CASES.length}`} />
      <p className="mt-10">
        <Link href="/czy-to-juz-dziaderstwo#wokanda" className="link font-sans font-medium">
          Cała wokanda: {CASES.length} spraw
        </Link>
      </p>
    </Section>
  );
}

export function Shelf({ bulletin }: { bulletin: Bulletin }) {
  const entry = DICTIONARY[bulletin.today % DICTIONARY.length];
  const report = REPORTS[0];
  const finding = report.findings[0];
  const local = warsawTime(new Date(bulletin.updated));
  const page = pageFor(sheetFor(local.year, local.month, local.day));
  const [first, second] = page.proverb.split(" / ");

  return (
    <section aria-label="Słownik, raporty i kalendarz" className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-3 lg:gap-10">
      <article className="border-t border-ink pt-5">
        <p className="label text-ink-soft">Hasło dnia · Słownik Dziaderski</p>
        <h2 className="mt-6 text-[clamp(2.4rem,4.6vw,3.75rem)] font-bold leading-[0.95] tracking-[-0.02em]">
          <Link href={`/slownik/${entry.slug}`} className="transition-colors hover:text-red">
            {entry.headword}
          </Link>
        </h2>
        <p className="mt-3 italic text-ink-soft">{entry.grammar}</p>
        <p className="mt-5 max-w-lg text-[1.2rem] leading-relaxed">{typo(entry.senses[0].text)}</p>
        <p className="mt-5 max-w-lg border-l-2 border-red pl-4 italic">„{entry.example}”</p>
        <Link href="/slownik" className="link mt-7 inline-block font-sans font-medium">
          Cały słownik: {DICTIONARY.length} {plural(DICTIONARY.length, "hasło", "hasła", "haseł")}
        </Link>
      </article>

      <article className="border-t border-ink pt-5">
        <p className="label text-ink-soft">
          Najnowszy raport · {report.number} · {formatReportDate(report.date)}
        </p>
        <p className="mt-6 text-[clamp(4rem,8vw,6.5rem)] font-bold leading-[0.85] tracking-[-0.03em] text-red">{finding.value}</p>
        <p className="mt-2 max-w-sm font-sans text-[0.95rem] leading-snug text-ink-soft">{typo(finding.label)}</p>
        <h2 className="mt-6 max-w-lg text-[1.6rem] font-bold leading-tight">
          <Link href={`/raporty/${report.slug}`} className="transition-colors hover:text-red">
            {report.title}
          </Link>
        </h2>
        <Link href="/raporty" className="link mt-7 inline-block font-sans font-medium">
          Wszystkie raporty Instytutu
        </Link>
      </article>

      <article className="border-t border-ink pt-5">
        <p className="label text-ink-soft">Kartka z kalendarza · {page.weekday}</p>
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
        <p className="label mt-4 text-ink-soft">
          Wschód {page.sunrise} · zachód {page.sunset}
        </p>
        <Link href="/kalendarz" className="link mt-7 inline-block font-sans font-medium">
          Zerwij dzisiejszą kartkę
        </Link>
      </article>
    </section>
  );
}
