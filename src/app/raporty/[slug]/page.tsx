import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd, TestCallout, breadcrumbList } from "@/components/page";
import { ShareBar } from "@/components/share-bar";
import { REPORTS, formatReportDate, reportBySlug, type Report } from "@/content/reports";
import { speciesByKey } from "@/content/species";
import { site } from "@/lib/site";
import { cx, typo } from "@/lib/typo";

// Every report is prerendered; unknown slugs 404.
export const instant = false;

export function generateStaticParams() {
  return REPORTS.map((report) => ({ slug: report.slug }));
}

export async function generateMetadata({ params }: PageProps<"/raporty/[slug]">): Promise<Metadata> {
  const report = reportBySlug((await params).slug);
  if (!report) return {};
  return {
    title: report.title,
    description: report.lede,
    alternates: { canonical: `/raporty/${report.slug}` },
    openGraph: {
      type: "article",
      locale: "pl_PL",
      siteName: site.name,
      url: `/raporty/${report.slug}`,
      title: report.title,
      description: report.lede,
      publishedTime: report.date,
    },
    twitter: { card: "summary_large_image", title: report.title, description: report.lede },
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

export default async function ReportPage({ params }: PageProps<"/raporty/[slug]">) {
  const report = reportBySlug((await params).slug);
  if (!report) notFound();

  const index = REPORTS.indexOf(report);
  const newer = REPORTS[index - 1];
  const older = REPORTS[index + 1];
  const url = `${site.url}/raporty/${report.slug}`;
  const year = report.date.slice(0, 4);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([
            { label: "Raporty Instytutu", href: "/raporty" },
            { label: report.title, href: `/raporty/${report.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: report.title,
            description: report.lede,
            abstract: report.abstract,
            url,
            image: `${url}/opengraph-image`,
            datePublished: report.date,
            inLanguage: "pl",
            articleSection: "Raporty Instytutu",
            author: { "@type": "Organization", name: site.institute, url: site.url },
            publisher: { "@type": "Organization", name: site.institute, url: site.url },
          },
        ]}
      />

      <article aria-labelledby="raport" className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
        <Breadcrumbs crumbs={[{ label: "Raporty Instytutu", href: "/raporty" }, { label: report.number }]} />
        <div className="kicker mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
          <p>
            § Raporty Instytutu <span className="mx-1.5 opacity-50">/</span> {report.category}
          </p>
          <p className="text-ink-faint">
            {report.number} · {formatReportDate(report.date)}
          </p>
        </div>

        <header className="mt-8 md:mt-10">
          <h1
            id="raport"
            className="max-w-5xl font-display text-[clamp(2.5rem,6vw,5.25rem)] font-black leading-[0.95] tracking-[-0.03em] [text-wrap:balance]"
          >
            {report.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-ink-soft md:text-2xl">{typo(report.lede)}</p>
          <dl className="kicker mt-8 flex flex-wrap gap-x-8 gap-y-2 text-ink-faint">
            <div className="flex gap-2">
              <dt>Opracowanie:</dt>
              <dd className="text-ink">Pracownia Terenowa IBD</dd>
            </div>
            <div className="flex gap-2">
              <dt>Próba:</dt>
              <dd className="text-ink">{report.sample}</dd>
            </div>
          </dl>
        </header>

        <dl className="mt-12 grid border-y-2 border-ink md:grid-cols-3">
          {report.findings.map((finding, i) => (
            <div key={finding.label} className={cx("py-7 md:px-8", i === 0 ? "md:pl-0" : "border-t border-rule md:border-l md:border-t-0")}>
              <dt className="sr-only">{finding.label}</dt>
              <dd>
                <span className={cx("block font-display text-[clamp(3rem,6vw,4.75rem)] font-black leading-none tracking-[-0.04em] tabular-nums", i === 0 && "text-bordo")}>
                  {finding.value}
                </span>
                <span className="mt-3 block max-w-xs text-lg leading-snug">{typo(finding.label)}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <section aria-labelledby="streszczenie" className="border-l-[3px] border-ink pl-6">
              <h2 id="streszczenie" className="kicker">
                Streszczenie
              </h2>
              <p className="mt-3 text-lg leading-relaxed md:text-xl">{typo(report.abstract)}</p>
            </section>

            {report.sections.map((section, i) => (
              <section key={section.heading} aria-labelledby={`rozdzial-${i + 1}`} className="mt-14">
                <h2
                  id={`rozdzial-${i + 1}`}
                  className="font-display text-[clamp(1.75rem,3vw,2.4rem)] font-bold leading-tight tracking-[-0.02em]"
                >
                  <span className="mr-3 font-mono text-base font-medium text-ink-faint">{i + 1}.</span>
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-5 text-lg leading-relaxed md:text-[1.2rem]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{typo(paragraph)}</p>
                  ))}
                </div>
              </section>
            ))}

            <section aria-labelledby="wnioski" className="mt-14">
              <h2 id="wnioski" className="font-display text-[clamp(1.75rem,3vw,2.4rem)] font-bold tracking-[-0.02em]">
                <span className="mr-3 font-mono text-base font-medium text-ink-faint">{report.sections.length + 1}.</span>
                Wnioski
              </h2>
              <ol className="mt-6 border-t border-ink">
                {report.conclusions.map((conclusion, i) => (
                  <li key={conclusion} className="grid grid-cols-[3rem_1fr] items-baseline border-b border-rule py-4">
                    <span className="font-display text-2xl font-black text-bordo tabular-nums">{pad(i + 1)}</span>
                    <span className="font-display text-xl font-semibold leading-snug md:text-2xl">{typo(conclusion)}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-12 border-t border-ink pt-5">
              <ShareBar path={`/raporty/${report.slug}`} text={report.lede} kind="raport" />
            </div>
          </div>

          <aside className="space-y-12 self-start lg:col-span-5">
            <BarChart report={report} />

            <section aria-labelledby="metodologia" className="border border-ink bg-paper-light px-5 py-6 md:px-7">
              <h2 id="metodologia" className="kicker">
                Metodologia
              </h2>
              <p className="mt-3 leading-relaxed">{typo(report.methodology)}</p>
            </section>

            <section aria-labelledby="gatunki">
              <h2 id="gatunki" className="kicker border-b-2 border-ink pb-3">
                Gatunki objęte badaniem
              </h2>
              <ul>
                {report.species.map((key) => {
                  const species = speciesByKey(key);
                  return (
                    <li key={key} className="border-b border-rule">
                      <Link href={`/atlas/${species.slug}`} className="group flex items-baseline justify-between gap-4 py-3">
                        <span className="font-display text-xl font-semibold transition-colors group-hover:text-green">
                          {species.name}
                        </span>
                        <span className="kicker text-ink-faint">{species.code}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-labelledby="cytowanie">
              <h2 id="cytowanie" className="kicker border-b-2 border-ink pb-3">
                Jak cytować
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
                {site.institute} ({year}). <em>{report.title}</em>. Raporty IBD, {report.number}. dziader.si/raporty/
                {report.slug}
              </p>
            </section>
          </aside>
        </div>

        <nav aria-label="Sąsiednie raporty" className="mt-16 grid gap-4 border-t border-ink pt-6 sm:grid-cols-2">
          {older ? (
            <Link href={`/raporty/${older.slug}`} className="group">
              <span className="kicker text-ink-faint">← Wcześniejszy raport · {older.number}</span>
              <span className="mt-1 block font-display text-xl font-semibold leading-tight transition-colors group-hover:text-green">
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/raporty/${newer.slug}`} className="group sm:text-right">
              <span className="kicker text-ink-faint">Nowszy raport · {newer.number} →</span>
              <span className="mt-1 block font-display text-xl font-semibold leading-tight transition-colors group-hover:text-green">
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      </article>

      <TestCallout
        title="Chcesz trafić do statystyk?"
        text={typo("Test Dziadersa to dwadzieścia cztery pytania i około trzech minut. Wynik zostaje w linku, nie w bazie Instytutu.")}
      />
    </main>
  );
}

const number = new Intl.NumberFormat("pl-PL");

function BarChart({ report }: { report: Report }) {
  const { chart } = report;
  const max = Math.max(...chart.bars.map((bar) => bar.value));
  const unit = chart.unit === "%" ? "%" : ` ${chart.unit}`;
  return (
    <figure>
      <figcaption className="kicker border-b border-ink pb-3">
        Wykres 1. {chart.title} ({chart.unit})
      </figcaption>
      <ol className="mt-6 space-y-4">
        {chart.bars.map((bar) => (
          <li key={bar.label}>
            <div className="flex items-baseline justify-between gap-4 text-[0.95rem] leading-snug">
              <span>{bar.label}</span>
              <span className="whitespace-nowrap font-mono text-[0.8rem] tabular-nums">
                {number.format(bar.value)}
                {unit}
              </span>
            </div>
            <div className="mt-1.5 h-3 bg-ink/10">
              <div
                className={cx("h-full", bar.value === max ? "bg-bordo" : "bg-green")}
                style={{ width: `${(bar.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
      <p className="kicker mt-5 text-ink-faint">Źródło: IBD, {report.number}.</p>
    </figure>
  );
}
