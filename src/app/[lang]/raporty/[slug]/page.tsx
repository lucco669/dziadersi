import type { Metadata } from "next";
import Image from "next/image";
import { reportArt } from "@/lib/illustrations";
import { notFound } from "next/navigation";
import { Tally } from "@/components/crowd";
import { breadcrumbList, JsonLd, PageHeader, Pager, TestPromo, TranslatorNotes } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { REPORTS, formatReportDate, getReports, reportBySlug, type Report } from "@/content/reports";
import { speciesByKey } from "@/content/species";
import { hasLocale, LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { siteCopy } from "@/lib/site";
import { cx, formatNumber, typo } from "@/lib/typo";

// Every report is prerendered; unknown slugs 404.
export const instant = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? getReports(params.lang).map((report) => ({ slug: report.slug })) : [];
}

const COPY = defineCopy({
  pl: {
    reports: "Raporty Instytutu",
    meta: (report: Report, date: string) =>
      `${report.number} · ${report.category} · ${date} · Opracowanie: Pracownia Terenowa IBD · Próba: ${report.sample}`,
    abstract: "Streszczenie",
    conclusions: "Wnioski",
    methodology: "Metodologia",
    species: "Gatunki objęte badaniem",
    cite: "Jak cytować",
    series: (number: string) => `Raporty IBD, ${number}.`,
    neighbours: "Sąsiednie raporty",
    older: (number: string) => `Wcześniejszy raport · ${number}`,
    newer: (number: string) => `Nowszy raport · ${number}`,
    chart: (title: string, unit: string) => `Wykres 1. ${title} (${unit})`,
    unit: (unit: string) => (unit === "%" ? "%" : ` ${unit}`),
    source: (number: string) => `Źródło: IBD, ${number}.`,
    promoTitle: "Chcesz trafić do statystyk?",
    promoText: "Test Dziadersa to pięć gabinetów i około czterech minut. Wynik z imieniem zostaje w linku, do Spisu trafia anonimowo.",
  },
  sl: {
    reports: "Poročila Inštituta",
    meta: (report: Report, date: string) =>
      `${report.number} · ${report.category} · ${date} · Pripravila: Terenska sekcija IBD · Prevedla: Prevajalska služba IBD · Vzorec: ${report.sample}`,
    abstract: "Povzetek",
    conclusions: "Sklepi",
    methodology: "Metodologija",
    species: "Vrste, zajete v raziskavi",
    cite: "Kako citirati",
    series: (number: string) => `V: Poročila Inštituta, slovenska izdaja, ${number}, prev. Prevajalska služba IBD.`,
    neighbours: "Sosednja poročila",
    older: (number: string) => `Starejše poročilo · ${number}`,
    newer: (number: string) => `Novejše poročilo · ${number}`,
    chart: (title: string, unit: string) => `Graf 1. ${title} (${unit})`,
    // A no-break space before every unit, the percent sign included: "61 %".
    unit: (unit: string) => ` ${unit}`,
    source: (number: string) => `Vir: IBD, ${number}.`,
    promoTitle: "Želiš v statistiko?",
    promoText: "Test dziadersa je pet ordinacij in približno štiri minute. Izvid z imenom ostane v povezavi, v Popis gre anonimno.",
  },
});

type Copy = (typeof COPY)[Locale];

export async function generateMetadata({ params }: PageProps<"/[lang]/raporty/[slug]">): Promise<Metadata> {
  const locale = await getLocale();
  const report = reportBySlug((await params).slug, locale);
  if (!report) return {};
  return pageMetadata(locale, {
    title: report.shortTitle ?? report.title,
    description: report.lede,
    path: `/raporty/${report.slug}`,
    shareTitle: report.title,
    type: "article",
    publishedTime: report.date,
  });
}

const pad = (value: number) => String(value).padStart(2, "0");

/** "61%" in Polish, "61 %" in Slovenian. */
const percentOf = (value: string) => {
  const match = /^(\d+)\s?%$/.exec(value);
  return match ? Number(match[1]) : null;
};

export default async function ReportPage({ params }: PageProps<"/[lang]/raporty/[slug]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const report = reportBySlug((await params).slug, locale);
  if (!report) notFound();

  const reports = getReports(locale);
  const index = reports.indexOf(report);
  const newer = reports[index - 1];
  const older = reports[index + 1];
  const path = `/raporty/${report.slug}`;
  const url = absoluteUrl(path, locale);
  const year = report.date.slice(0, 4);
  // Illustrations are filed under the Polish slug; both editions list the reports in the same order.
  const artKey = REPORTS[index].slug;
  const art = reportArt(artKey, locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [
            { label: t.reports, href: "/raporty" },
            { label: report.title, href: path },
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
            inLanguage: LOCALE_INFO[locale].tag,
            articleSection: t.reports,
            author: institute(locale),
            publisher: institute(locale),
          },
        ]}
      />

      <article aria-labelledby="raport">
        <PageHeader
          crumbs={[{ label: t.reports, href: "/raporty" }, { label: report.number }]}
          titleId="raport"
          title={<span className="block max-w-5xl text-[clamp(2.4rem,5.6vw,4.75rem)]">{report.title}</span>}
          lead={typo(report.lede)}
          meta={t.meta(report, formatReportDate(report.date, locale))}
        />

        <div className="wrap">
          {art && <figure className="mt-8 max-w-3xl">
            <Image src={`/illustrations/${artKey}.webp`} width={1200} height={800} alt={art.alt} sizes="(max-width: 767px) 90vw, 768px" className="h-auto w-full" />
            <figcaption className="label mt-3 text-ink-soft">{art.caption}</figcaption>
          </figure>}
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
                    {percent !== null && <Tally percent={percent} locale={locale} className="mt-4 w-full max-w-60" />}
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-14 grid gap-16 pb-20 md:pb-28 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <section aria-labelledby="streszczenie" className="border-l-2 border-ink pl-6">
                <h2 id="streszczenie" className="label text-ink-soft">
                  {t.abstract}
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
                  {t.conclusions}
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

              <TranslatorNotes notes={report.notes} className="mt-14" />

              <div className="mt-12 border-t border-ink pt-5">
                <ShareBar path={path} text={report.lede} kind="raport" />
              </div>
            </div>

            <aside className="space-y-12 self-start lg:col-span-5">
              <BarChart report={report} locale={locale} t={t} />

              <section aria-labelledby="metodologia" className="border-t border-ink pt-5">
                <h2 id="metodologia" className="label text-ink-soft">
                  {t.methodology}
                </h2>
                <p className="mt-2 leading-relaxed">{typo(report.methodology)}</p>
              </section>

              <section aria-labelledby="gatunki" className="border-t border-ink pt-5">
                <h2 id="gatunki" className="label text-ink-soft">
                  {t.species}
                </h2>
                <ul className="mt-3 grid grid-cols-3 gap-4">
                  {report.species.map((key) => {
                    const species = speciesByKey(key, locale);
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
                  {t.cite}
                </h2>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {siteCopy(locale).institute} ({year}). <i>{report.title}</i>. {t.series(report.number)} dziader.si{localizePath(path, locale)}
                </p>
              </section>
            </aside>
          </div>

          <div className="pb-20 md:pb-28">
            <Pager
              label={t.neighbours}
              previous={older && { href: `/raporty/${older.slug}`, label: t.older(older.number), title: older.title }}
              next={newer && { href: `/raporty/${newer.slug}`, label: t.newer(newer.number), title: newer.title }}
            />
          </div>
        </div>
      </article>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}

function BarChart({ report, locale, t }: { report: Report; locale: Locale; t: Copy }) {
  const { chart } = report;
  const max = Math.max(...chart.bars.map((bar) => bar.value));
  const unit = t.unit(chart.unit);
  return (
    <figure className="border-t border-ink pt-5">
      <figcaption className="label text-ink-soft">{t.chart(chart.title, chart.unit)}</figcaption>
      <ol className="mt-6 space-y-4">
        {chart.bars.map((bar) => (
          <li key={bar.label}>
            <div className="flex items-baseline justify-between gap-4 leading-snug">
              <span>{bar.label}</span>
              <span className="whitespace-nowrap font-sans text-[0.9rem] font-semibold tabular-nums">
                {formatNumber(locale, bar.value)}
                {unit}
              </span>
            </div>
            <div className="mt-1.5 h-3 bg-ink/10">
              <div className={cx("h-full", bar.value === max ? "bg-red" : "bg-ink")} style={{ width: `${(bar.value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ol>
      <p className="label mt-5 text-ink-soft">{t.source(report.number)}</p>
    </figure>
  );
}
