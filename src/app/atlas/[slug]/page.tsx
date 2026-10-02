import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Stamp } from "@/components/brand";
import { breadcrumbList, JsonLd, PageHeader, Pager, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { SightingPanel } from "@/components/sighting";
import { ActivityCalendar, RangeMap, SpeciesTile, StatusScale, TraitBars } from "@/components/species-parts";
import { DICTIONARY } from "@/content/dictionary";
import { REGIONS } from "@/content/regions";
import { REPORTS } from "@/content/reports";
import { SPECIES, speciesByKey, speciesBySlug, statusLabel } from "@/content/species";
import { getCommunity } from "@/lib/community";
import { describe, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { DIAGNOSABLE } from "@/lib/test";
import { typo } from "@/lib/typo";

// Every species is prerendered; unknown slugs 404.
export const instant = false;

export function generateStaticParams() {
  return SPECIES.map((species) => ({ slug: species.slug }));
}

const headline = (name: string) => `${name}: 7 objawów, siedlisko i naturalni wrogowie`;

export async function generateMetadata({ params }: PageProps<"/atlas/[slug]">): Promise<Metadata> {
  const species = speciesBySlug((await params).slug);
  if (!species) return {};
  return pageMetadata({
    title: headline(species.name),
    description: describe(species.summary, " Objawy, siedlisko i naturalni wrogowie w Atlasie Dziadersów.", " Atlas Dziadersów."),
    path: `/atlas/${species.slug}`,
    shareTitle: `${species.name} · Atlas Dziadersów`,
    type: "article",
  });
}

const pad = (value: number) => String(value).padStart(2, "0");

export default async function SpeciesPage({ params }: PageProps<"/atlas/[slug]">) {
  const species = speciesBySlug((await params).slug);
  if (!species) notFound();

  const index = SPECIES.indexOf(species);
  const previous = SPECIES[(index - 1 + SPECIES.length) % SPECIES.length];
  const next = SPECIES[(index + 1) % SPECIES.length];
  const related = species.related.map(speciesByKey);
  const phrases = DICTIONARY.filter((entry) => entry.species === species.key);
  const reports = REPORTS.filter((report) => report.species.includes(species.key));
  const url = `${site.url}/atlas/${species.slug}`;
  const range = species.region
    ? `Gatunek regionalny: ${REGIONS[species.region].name}`
    : species.occasion
      ? `Gatunek okazjonalny, spotykany ${species.occasion}`
      : "Gatunek ogólnopolski";
  const community = await getCommunity();

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([
            { label: "Atlas Dziadersów", href: "/atlas" },
            { label: species.name, href: `/atlas/${species.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: headline(species.name),
            description: species.summary,
            url,
            mainEntityOfPage: url,
            image: `${url}/opengraph-image`,
            inLanguage: "pl",
            articleSection: "Atlas Dziadersów",
            datePublished: site.launched,
            about: { "@type": "Thing", name: species.name, alternateName: species.latin },
            author: institute,
            publisher: institute,
          },
        ]}
      />

      <article aria-labelledby="gatunek">
        <PageHeader
          crumbs={[{ label: "Atlas Dziadersów", href: "/atlas" }, { label: species.name }]}
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
                {species.code} · {range} · {species.status}, {statusLabel(species.status)}
              </span>
              {species.isNew && <Stamp className="rotate-[-3deg] text-[0.7rem]">Nowy gatunek</Stamp>}
            </span>
          }
          aside={<SpeciesPlate species={species.key} animated title={`${species.name}: rycina`} className="w-full" />}
        />

        <div className="wrap mt-14 grid gap-16 pb-16 md:mt-20 md:pb-24 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-14 lg:col-span-7">
            <Part id="opis" title="Opis gatunku">
              <div className="space-y-5 text-[1.2rem] leading-relaxed">
                {species.description.map((paragraph) => (
                  <p key={paragraph}>{typo(paragraph)}</p>
                ))}
              </div>
            </Part>

            <Part id="objawy" title={`7 objawów ${species.genitive}`}>
              <ol className="border-t border-ink">
                {species.symptoms.map((symptom, i) => (
                  <li key={symptom} className="grid grid-cols-[3.25rem_1fr] items-baseline border-b border-rule py-4">
                    <span className="text-2xl font-bold text-red tabular-nums">{pad(i + 1)}</span>
                    <span className="text-[1.2rem] leading-snug">{typo(symptom)}</span>
                  </li>
                ))}
              </ol>
            </Part>

            <Part id="wokalizacje" title="Typowe wokalizacje">
              <div className="space-y-4 border-l-2 border-red pl-6">
                {species.calls.map((call) => (
                  <p key={call} className="text-[clamp(1.6rem,3vw,2.2rem)] italic leading-snug">
                    „{call}”
                  </p>
                ))}
              </div>
            </Part>

            <Part id="postepowanie" title="Postępowanie w kontakcie">
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
              <Part id="slownik" title="W Słowniku Dziaderskim">
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
          </div>

          <aside aria-label="Karta gatunku" className="self-start border-t border-ink pt-5 lg:col-span-5">
            <h2 className="label text-ink-soft">Karta gatunku · {species.code}</h2>
            <dl className="mt-2">
              {[
                ["Występowanie", species.habitat],
                ["Aktywność", species.activity],
                ["Naturalni wrogowie", species.enemies],
                ["Rozpoznanie w terenie", species.fieldMarks],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-rule py-4">
                  <dt className="label text-ink-soft">{label}</dt>
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
              Badania Instytutu
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
            Gatunki pokrewne
          </h2>
          <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
            {related.map((item) => (
              <li key={item.key}>
                <SpeciesTile species={item} />
              </li>
            ))}
          </ol>
          <Pager
            label="Sąsiednie gatunki"
            previous={{ href: `/atlas/${previous.slug}`, label: previous.code, title: previous.name }}
            next={{ href: `/atlas/${next.slug}`, label: next.code, title: next.name }}
          />
        </section>
      </article>

      <TestPromo
        title="Rozpoznajesz te objawy?"
        text={typo(
          species.occasion || species.region
            ? `${species.name} nie jest rozpoznawany w teście, ale jego krewni z Atlasu tak. Pięć gabinetów, około czterech minut, certyfikat.`
            : `Test Dziadersa sprawdzi, czy to ${species.name}, czy coś poważniejszego. Pięć gabinetów, około czterech minut, certyfikat.`,
        )}
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
