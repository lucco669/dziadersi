import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Stamp } from "@/components/brand";
import { breadcrumbList, JsonLd, PageHeader, Pager, TestPromo, TranslatorNotes } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { SightingPanel } from "@/components/sighting";
import { ActivityCalendar, RangeMap, SpeciesTile, StatusScale, TraitBars } from "@/components/species-parts";
import { getDictionary } from "@/content/dictionary";
import { getRegions, regionFullName } from "@/content/regions";
import { getReports } from "@/content/reports";
import { getSpecies, speciesByKey, speciesBySlug, statusLabel } from "@/content/species";
import { DEFAULT_LOCALE, hasLocale, LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getCommunity } from "@/lib/community";
import { absoluteUrl, describe, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { DIAGNOSABLE } from "@/lib/test";
import { quote, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    section: "Atlas Dziadersów",
    headline: (name: string) => `${name}: 7 objawów, siedlisko i naturalni wrogowie`,
    description: [" Objawy, siedlisko i naturalni wrogowie w Atlasie Dziadersów.", " Atlas Dziadersów."],
    regional: (code: string) => `Gatunek regionalny: ${getRegions("pl")[code].name}`,
    occasional: (occasion: string) => `Gatunek okazjonalny, spotykany ${occasion}`,
    nationwide: "Gatunek ogólnopolski",
    isNew: "Nowy gatunek",
    plate: (name: string) => `${name}: rycina`,
    about: "Opis gatunku",
    symptoms: (genitive: string) => `7 objawów ${genitive}`,
    calls: "Typowe wokalizacje",
    handling: "Postępowanie w kontakcie",
    dictionary: "W Słowniku Dziaderskim",
    card: "Karta gatunku",
    fields: ["Występowanie", "Aktywność", "Naturalni wrogowie", "Rozpoznanie w terenie"],
    reports: "Badania Instytutu",
    related: "Gatunki pokrewne",
    pager: "Sąsiednie gatunki",
    promoTitle: "Rozpoznajesz te objawy?",
    promoUndiagnosed: (name: string) =>
      `${name} nie jest rozpoznawany w teście, ale jego krewni z Atlasu tak. Pięć gabinetów, około czterech minut, certyfikat.`,
    promoDiagnosed: (name: string) =>
      `Test Dziadersa sprawdzi, czy to ${name}, czy coś poważniejszego. Pięć gabinetów, około czterech minut, certyfikat.`,
  },
  sl: {
    section: "Atlas dziadersov",
    headline: (name: string) => `${name}: 7 simptomov, habitat in naravni sovražniki`,
    description: [" Simptomi, habitat in naravni sovražniki v Atlasu dziadersov.", " Atlas dziadersov."],
    regional: (code: string) => `Regionalna vrsta: ${regionFullName(code, "sl")}`,
    occasional: (occasion: string) => `Priložnostna vrsta, ki se pojavlja ${occasion}`,
    nationwide: "Vsepoljska vrsta",
    isNew: "Nova vrsta",
    plate: (name: string) => `${name}: risba`,
    about: "Opis vrste",
    symptoms: (genitive: string) => `7 simptomov ${genitive}`,
    calls: "Značilno oglašanje",
    handling: "Ravnanje ob stiku",
    dictionary: "V Dziaderskem slovarju",
    card: "Kartica vrste",
    fields: ["Habitat", "Aktivnost", "Naravni sovražniki", "Prepoznavanje na terenu"],
    reports: "Raziskave Inštituta",
    related: "Sorodne vrste",
    pager: "Sosednje vrste",
    promoTitle: "Prepoznaš te simptome?",
    promoUndiagnosed: (name: string) =>
      `${name} v testu ni diagnosticiran, njegovi sorodniki iz Atlasa pa so. Pet ordinacij, približno štiri minute, certifikat.`,
    promoDiagnosed: (name: string) =>
      `Test dziadersa bo preveril, ali je to ${name} ali kaj hujšega. Pet ordinacij, približno štiri minute, certifikat.`,
  },
});

// Every species is prerendered; unknown slugs 404.
export const instant = false;

/** Each edition's own slugs. */
export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getSpecies(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).map((species) => ({ slug: species.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/atlas/[slug]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const species = speciesBySlug((await params).slug, locale);
  if (!species) return {};
  return pageMetadata(locale, {
    title: t.headline(species.name),
    description: describe(species.summary, ...t.description),
    path: `/atlas/${species.slug}`,
    shareTitle: `${species.name} · ${t.section}`,
    type: "article",
  });
}

const pad = (value: number) => String(value).padStart(2, "0");

export default async function SpeciesPage({ params }: PageProps<"/[lang]/atlas/[slug]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const all = getSpecies(locale);
  const species = speciesBySlug((await params).slug, locale);
  if (!species) notFound();

  const index = all.indexOf(species);
  const previous = all[(index - 1 + all.length) % all.length];
  const next = all[(index + 1) % all.length];
  const related = species.related.map((key) => speciesByKey(key, locale));
  const phrases = getDictionary(locale).filter((entry) => entry.species === species.key);
  const reports = getReports(locale).filter((report) => report.species.includes(species.key));
  const path = `/atlas/${species.slug}`;
  const url = absoluteUrl(path, locale);
  const range = species.region ? t.regional(species.region) : species.occasion ? t.occasional(species.occasion) : t.nationwide;
  const community = await getCommunity("counts");

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [
            { label: t.section, href: "/atlas" },
            { label: species.name, href: path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t.headline(species.name),
            description: species.summary,
            url,
            mainEntityOfPage: url,
            image: `${url}/opengraph-image`,
            inLanguage: LOCALE_INFO[locale].tag,
            articleSection: t.section,
            datePublished: site.launched,
            about: { "@type": "Thing", name: species.name, alternateName: species.latin },
            author: institute(locale),
            publisher: institute(locale),
          },
        ]}
      />

      <article aria-labelledby="gatunek">
        <PageHeader
          crumbs={[{ label: t.section, href: "/atlas" }, { label: species.name }]}
          titleId="gatunek"
          title={species.name}
          lead={
            <>
              <p className="italic text-ink">
                {species.latin} <span className="not-italic text-ink-soft">({species.authority})</span>
              </p>
              <p className="mt-4">{typo(species.summary)}</p>
            </>
          }
          meta={
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span>
                {species.code} · {range} · {species.status}, {statusLabel(species.status, locale)}
              </span>
              {species.isNew && <Stamp className="rotate-[-3deg] text-[0.7rem]">{t.isNew}</Stamp>}
            </span>
          }
          aside={<SpeciesPlate species={species.key} animated title={t.plate(species.name)} className="w-full" />}
        />

        <div className="wrap mt-14 grid gap-16 pb-16 md:mt-20 md:pb-24 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-14 lg:col-span-7">
            <Part id="opis" title={t.about}>
              <div className="space-y-5 text-[1.2rem] leading-relaxed">
                {species.description.map((paragraph) => (
                  <p key={paragraph}>{typo(paragraph)}</p>
                ))}
              </div>
            </Part>

            <Part id="objawy" title={t.symptoms(species.genitive)}>
              <ol className="border-t border-ink">
                {species.symptoms.map((symptom, i) => (
                  <li key={symptom} className="grid grid-cols-[3.25rem_1fr] items-baseline border-b border-rule py-4">
                    <span className="text-2xl font-bold text-red tabular-nums">{pad(i + 1)}</span>
                    <span className="text-[1.2rem] leading-snug">{typo(symptom)}</span>
                  </li>
                ))}
              </ol>
            </Part>

            <Part id="wokalizacje" title={t.calls}>
              <div className="space-y-4 border-l-2 border-red pl-6">
                {species.calls.map((call) => (
                  <p key={call} className="text-[clamp(1.6rem,3vw,2.2rem)] italic leading-snug">
                    {quote(call, locale)}
                  </p>
                ))}
              </div>
            </Part>

            <Part id="postepowanie" title={t.handling}>
              <ol className="border-t border-ink">
                {species.handling.map((step, i) => (
                  <li key={step} className="grid grid-cols-[3.25rem_1fr] items-baseline border-b border-rule py-4">
                    <span className="font-sans text-[0.9rem] font-semibold text-ink-soft">{pad(i + 1)}</span>
                    <span className="text-lg leading-snug">{typo(step)}</span>
                  </li>
                ))}
              </ol>
            </Part>

            {phrases.length > 0 && (
              <Part id="slownik" title={t.dictionary}>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {phrases.map((entry) => (
                    <li key={entry.slug}>
                      <Link href={`/slownik/${entry.slug}`} className="link text-xl italic">
                        {entry.headword}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Part>
            )}

            <TranslatorNotes notes={species.notes} />
          </div>

          <aside aria-label={t.card} className="self-start border-t border-ink pt-5 lg:col-span-5">
            <h2 className="label text-ink-soft">
              {t.card} · {species.code}
            </h2>
            <dl className="mt-2">
              {[species.habitat, species.activity, species.enemies, species.fieldMarks].map((value, i) => (
                <div key={t.fields[i]} className="border-b border-rule py-4">
                  <dt className="label text-ink-soft">{t.fields[i]}</dt>
                  <dd className="mt-1 leading-relaxed">{typo(value)}</dd>
                </div>
              ))}
            </dl>
            <SightingPanel
              species={species.key}
              slug={species.slug}
              diagnosable={DIAGNOSABLE.some((item) => item.key === species.key)}
              total={community ? (community.sightings.species[species.key] ?? 0) : null}
              week={community?.sightings.week[species.key] ?? 0}
            />
            <div className="space-y-10 pt-8">
              <TraitBars traits={species.traits} />
              <StatusScale status={species.status} note={species.statusNote} />
              <ActivityCalendar months={species.calendar} />
              <RangeMap region={species.region} occasion={species.occasion} />
            </div>
          </aside>
        </div>

        {reports.length > 0 && (
          <section aria-labelledby="badania" className="wrap pb-16 md:pb-20">
            <h2 id="badania" className="border-t border-ink pt-5 text-[clamp(1.6rem,2.8vw,2.1rem)] font-bold">
              {t.reports}
            </h2>
            <ul className="mt-4">
              {reports.map((report) => (
                <li key={report.slug} className="border-b border-rule">
                  <Link href={`/raporty/${report.slug}`} className="group grid gap-x-8 gap-y-1 py-5 md:grid-cols-[9rem_1fr]">
                    <span className="label pt-1.5 text-ink-soft">{report.number}</span>
                    <span>
                      <span className="block text-2xl font-bold leading-tight transition-colors group-hover:text-red">
                        {report.title}
                      </span>
                      <span className="mt-1.5 block leading-snug text-ink-soft">{typo(report.lede)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="pokrewne" className="wrap pb-20 md:pb-28">
          <h2 id="pokrewne" className="border-t border-ink pt-5 text-[clamp(1.6rem,2.8vw,2.1rem)] font-bold">
            {t.related}
          </h2>
          <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.key}>
                <SpeciesTile species={item} />
              </li>
            ))}
          </ol>
          <Pager
            label={t.pager}
            previous={{ href: `/atlas/${previous.slug}`, label: previous.code, title: previous.name }}
            next={{ href: `/atlas/${next.slug}`, label: next.code, title: next.name }}
          />
        </section>
      </article>

      <TestPromo
        title={t.promoTitle}
        text={typo(species.occasion || species.region ? t.promoUndiagnosed(species.name) : t.promoDiagnosed(species.name))}
      />
    </main>
  );
}

function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-6 text-[clamp(1.75rem,3.2vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.01em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
