import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Stamp } from "@/components/brand";
import { Breadcrumbs, JsonLd, TestCallout, breadcrumbList } from "@/components/page";
import { ActivityCalendar, RangeMap, SpeciesCard, StatusScale, TraitBars } from "@/components/species-parts";
import { DICTIONARY } from "@/content/dictionary";
import { REGIONS } from "@/content/regions";
import { REPORTS } from "@/content/reports";
import { SPECIES, speciesByKey, speciesBySlug, statusLabel } from "@/content/species";
import { site } from "@/lib/site";
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
  const shareTitle = `${species.name} · Atlas Dziadersów`;
  return {
    title: headline(species.name),
    description: species.summary,
    alternates: { canonical: `/atlas/${species.slug}` },
    openGraph: {
      type: "article",
      locale: "pl_PL",
      siteName: site.name,
      url: `/atlas/${species.slug}`,
      title: shareTitle,
      description: species.summary,
    },
    twitter: { card: "summary_large_image", title: shareTitle, description: species.summary },
  };
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
            image: `${url}/opengraph-image`,
            inLanguage: "pl",
            articleSection: "Atlas Dziadersów",
            about: { "@type": "Thing", name: species.name, alternateName: species.latin },
            author: { "@type": "Organization", name: site.institute, url: site.url },
            publisher: { "@type": "Organization", name: site.institute, url: site.url },
          },
        ]}
      />

      <article aria-labelledby="gatunek">
        <header className="wrap pt-10 md:pt-14">
          <Breadcrumbs crumbs={[{ label: "Atlas Dziadersów", href: "/atlas" }, { label: species.code }]} />
          <div className="kicker mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
            <p>
              § Zbiory <span className="mx-1.5 opacity-50">/</span> Atlas Dziadersów
            </p>
            <p className="text-ink-faint">
              {species.code} ·{" "}
              {species.region ? `Gatunek regionalny · ${REGIONS[species.region].name}` : "Gatunek ogólnopolski"}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 md:mt-10">
            <div>
              <h1
                id="gatunek"
                className="font-display text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.9] tracking-[-0.035em]"
              >
                {species.name}
              </h1>
              <p className="mt-4 text-xl">
                <em>{species.latin}</em> <span className="text-ink-faint">({species.authority})</span>
              </p>
            </div>
            <div className="flex items-center gap-4 pb-2">
              {species.isNew && <Stamp className="rotate-[-4deg]">Nowy gatunek</Stamp>}
              <p className="kicker border border-ink px-2.5 py-1.5">
                {species.status} · {statusLabel(species.status)}
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-ink-soft md:text-2xl">{typo(species.summary)}</p>
        </header>

        <div className="wrap mt-14 grid gap-16 pb-20 md:mt-16 md:pb-28 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-16 lg:col-span-7">
            <Part id="opis" title="Opis gatunku">
              <div className="space-y-5 text-lg leading-relaxed md:text-[1.2rem]">
                {species.description.map((paragraph) => (
                  <p key={paragraph}>{typo(paragraph)}</p>
                ))}
              </div>
            </Part>

            <Part id="objawy" title={`7 objawów ${species.genitive}`}>
              <ol className="border-t border-ink">
                {species.symptoms.map((symptom, i) => (
                  <li key={symptom} className="grid grid-cols-[3.25rem_1fr] items-baseline border-b border-rule py-4">
                    <span className="font-display text-2xl font-black text-bordo tabular-nums">{pad(i + 1)}</span>
                    <span className="text-lg leading-snug md:text-xl">{typo(symptom)}</span>
                  </li>
                ))}
              </ol>
            </Part>

            <Part id="wokalizacje" title="Typowe wokalizacje">
              <div className="space-y-4 border-l-[3px] border-bordo pl-6">
                {species.calls.map((call) => (
                  <p key={call} className="font-display text-[clamp(1.6rem,3vw,2.25rem)] italic leading-snug">
                    „{call}”
                  </p>
                ))}
              </div>
            </Part>

            <Part id="postepowanie" title="Postępowanie w kontakcie">
              <ol className="border-t border-ink">
                {species.handling.map((step, i) => (
                  <li key={step} className="grid grid-cols-[3.25rem_1fr] items-baseline border-b border-rule py-4">
                    <span className="kicker text-ink-faint">{pad(i + 1)}</span>
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
                      <Link href={`/slownik/${entry.slug}`} className="link font-display text-xl italic">
                        {entry.headword}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Part>
            )}
          </div>

          <aside aria-label="Karta gatunku" className="self-start border border-ink bg-paper-light lg:col-span-5">
            <p className="kicker flex justify-between gap-4 border-b border-ink px-5 py-3 md:px-7">
              <span>Karta gatunku</span>
              <span className="text-ink-faint">{species.code}</span>
            </p>
            <dl className="px-5 md:px-7">
              {[
                ["Występowanie", species.habitat],
                ["Aktywność", species.activity],
                ["Naturalni wrogowie", species.enemies],
                ["Rozpoznanie w terenie", species.fieldMarks],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-rule py-4">
                  <dt className="kicker text-ink-faint">{label}</dt>
                  <dd className="mt-1.5 leading-relaxed">{typo(value)}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-9 px-5 py-8 md:px-7">
              <TraitBars traits={species.traits} />
              <StatusScale status={species.status} note={species.statusNote} />
              <ActivityCalendar months={species.calendar} />
              <RangeMap region={species.region} />
            </div>
          </aside>
        </div>

        {reports.length > 0 && (
          <section aria-labelledby="badania" className="wrap pb-20 md:pb-24">
            <h2 id="badania" className="kicker border-b-2 border-ink pb-3">
              Badania Instytutu
            </h2>
            <ul>
              {reports.map((report) => (
                <li key={report.slug} className="border-b border-rule">
                  <Link
                    href={`/raporty/${report.slug}`}
                    className="group grid gap-x-8 gap-y-1 py-5 md:grid-cols-[9rem_1fr]"
                  >
                    <span className="kicker pt-1 text-ink-faint">{report.number}</span>
                    <span>
                      <span className="block font-display text-2xl font-semibold leading-tight transition-colors group-hover:text-green">
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

        <section aria-labelledby="pokrewne" className="border-t border-ink bg-paper-deep/70">
          <div className="wrap py-16 md:py-20">
            <h2 id="pokrewne" className="kicker">
              Gatunki pokrewne
            </h2>
            <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.key}>
                  <SpeciesCard species={item} />
                </li>
              ))}
            </ol>
            <nav aria-label="Sąsiednie gatunki" className="mt-12 grid gap-4 border-t border-ink pt-6 sm:grid-cols-2">
              <Link href={`/atlas/${previous.slug}`} className="group">
                <span className="kicker text-ink-faint">← {previous.code}</span>
                <span className="mt-1 block font-display text-xl font-semibold transition-colors group-hover:text-green">
                  {previous.name}
                </span>
              </Link>
              <Link href={`/atlas/${next.slug}`} className="group sm:text-right">
                <span className="kicker text-ink-faint">{next.code} →</span>
                <span className="mt-1 block font-display text-xl font-semibold transition-colors group-hover:text-green">
                  {next.name}
                </span>
              </Link>
            </nav>
          </div>
        </section>
      </article>

      <TestCallout
        title="Rozpoznajesz te objawy?"
        text={typo(
          `Test Dziadersa sprawdzi, czy to ${species.name}, czy coś poważniejszego. Dwadzieścia cztery pytania, około trzech minut.`,
        )}
      />
    </main>
  );
}

function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="mb-6 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.02em]"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
