import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tally } from "@/components/crowd";
import { breadcrumbList, JsonLd, PageHeader, Pager, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { REPORTS, formatReportDate, reportBySlug, type Report } from "@/content/reports";
import { speciesByKey } from "@/content/species";
import { institute, pageMetadata } from "@/lib/seo";
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
  return pageMetadata({
    title: report.shortTitle ?? report.title,
    description: report.lede,
    path: `/raporty/${report.slug}`,
    shareTitle: report.title,
    type: "article",
    publishedTime: report.date,
  });
}

const pad = (value: number) => String(value).padStart(2, "0");

const percentOf = (value: string) => {
  const match = /^(\d+)%$/.exec(value);
  return match ? Number(match[1]) : null;
};

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
            "@type": "Report",
            headline: report.title,
            description: report.lede,
            abstract: report.abstract,
            url,
            mainEntityOfPage: url,
            image: `${url}/opengraph-image`,
            datePublished: report.date,
            reportNumber: report.number,
            inLanguage: "pl",
            articleSection: "Raporty Instytutu",
            author: institute,
            publisher: institute,
          },
        ]}
      />

      <article aria-labelledby="raport">
        <PageHeader
          crumbs={[{ label: "Raporty Instytutu", href: "/raporty" }, { label: report.number }]}
          titleId="raport"
          title={<span className="block max-w-5xl text-[clamp(2.4rem,5.6vw,4.75rem)]">{report.title}</span>}
          lead={typo(report.lede)}
          meta={`${report.number} · ${report.category} · ${formatReportDate(report.date)} · Opracowanie: Pracownia Terenowa IBD · Próba: ${report.sample}`}
        />

        <div className="wrap">
          <dl className="mt-12 grid border-y border-ink md:grid-cols-3">
            {report.findings.map((finding, i) => {
              const percent = percentOf(finding.value);
              return (
                <div key={finding.label} className={cx("py-7 md:px-8", i === 0 ? "md:pl-0" : "border-t border-rule md:border-l md:border-t-0")}>
                  <dt className="sr-only">{finding.label}</dt>
                  <dd>
                    <span className={cx("block text-[clamp(3rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.03em] tabular-nums", i === 0 && "text-red")}>
                      {finding.value}
                    </span>
                    <span className="mt-3 block max-w-xs leading-snug">{typo(finding.label)}</span>
                    {percent !== null && <Tally percent={percent} className="mt-4 w-full max-w-60" />}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-14 grid gap-16 pb-20 md:pb-28 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <section aria-labelledby="streszczenie" className="border-l-2 border-ink pl-6">
                <h2 id="streszczenie" className="label text-ink-soft">
                  Streszczenie
                </h2>
                <p className="mt-2 text-[1.25rem] leading-relaxed">{typo(report.abstract)}</p>
              </section>

              {report.sections.map((section, i) => (
                <section key={section.heading} aria-labelledby={`rozdzial-${i + 1}`} className="mt-14">
                  <h2 id={`rozdzial-${i + 1}`} className="text-[clamp(1.75rem,3vw,2.3rem)] font-bold leading-tight tracking-[-0.01em]">
                    <span className="mr-3 font-sans text-base font-semibold text-red">{i + 1}.</span>
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5 text-[1.2rem] leading-relaxed">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{typo(paragraph)}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section aria-labelledby="wnioski" className="mt-14">
                <h2 id="wnioski" className="text-[clamp(1.75rem,3vw,2.3rem)] font-bold tracking-[-0.01em]">
                  <span className="mr-3 font-sans text-base font-semibold text-red">{report.sections.length + 1}.</span>
                  Wnioski
                </h2>
                <ol className="mt-6 border-t border-ink">
                  {report.conclusions.map((conclusion, i) => (
                    <li key={conclusion} className="grid grid-cols-[3rem_1fr] items-baseline border-b border-rule py-4">
                      <span className="text-2xl font-bold text-red tabular-nums">{pad(i + 1)}</span>
                      <span className="text-xl font-bold leading-snug md:text-2xl">{typo(conclusion)}</span>
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

              <section aria-labelledby="metodologia" className="border-t border-ink pt-5">
                <h2 id="metodologia" className="label text-ink-soft">
                  Metodologia
                </h2>
                <p className="mt-2 leading-relaxed">{typo(report.methodology)}</p>
              </section>

              <section aria-labelledby="gatunki" className="border-t border-ink pt-5">
                <h2 id="gatunki" className="label text-ink-soft">
                  Gatunki objęte badaniem
                </h2>
                <ul className="mt-3 grid grid-cols-3 gap-4">
                  {report.species.map((key) => {
                    const species = speciesByKey(key);
                    return (
                      <li key={key}>
                        <Link href={`/atlas/${species.slug}`} className="group block">
                          <SpeciesPlate species={key} className="w-full" />
                          <span className="mt-1 block font-sans text-[0.85rem] font-semibold leading-tight transition-colors group-hover:text-red">
                            {species.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section aria-labelledby="cytowanie" className="border-t border-ink pt-5">
                <h2 id="cytowanie" className="label text-ink-soft">
                  Jak cytować
                </h2>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {site.institute} ({year}). <i>{report.title}</i>. Raporty IBD, {report.number}. dziader.si/raporty/{report.slug}
                </p>
              </section>
            </aside>
          </div>

          <div className="pb-20 md:pb-28">
            <Pager
              label="Sąsiednie raporty"
              previous={older && { href: `/raporty/${older.slug}`, label: `Wcześniejszy raport · ${older.number}`, title: older.title }}
              next={newer && { href: `/raporty/${newer.slug}`, label: `Nowszy raport · ${newer.number}`, title: newer.title }}
            />
          </div>
        </div>
      </article>

      <TestPromo
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
    <figure className="border-t border-ink pt-5">
      <figcaption className="label text-ink-soft">
        Wykres 1. {chart.title} ({chart.unit})
      </figcaption>
      <ol className="mt-6 space-y-4">
        {chart.bars.map((bar) => (
          <li key={bar.label}>
            <div className="flex items-baseline justify-between gap-4 leading-snug">
              <span>{bar.label}</span>
              <span className="whitespace-nowrap font-sans text-[0.9rem] font-semibold tabular-nums">
                {number.format(bar.value)}
                {unit}
              </span>
            </div>
            <div className="mt-1.5 h-3 bg-ink/10">
              <div className={cx("h-full", bar.value === max ? "bg-red" : "bg-ink")} style={{ width: `${(bar.value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ol>
      <p className="label mt-5 text-ink-soft">Źródło: IBD, {report.number}.</p>
    </figure>
  );
}
