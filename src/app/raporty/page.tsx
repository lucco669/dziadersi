import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHeading, TestCallout, breadcrumbList } from "@/components/page";
import { REPORTS, formatReportDate } from "@/content/reports";
import { site } from "@/lib/site";
import { plural, typo } from "@/lib/typo";

const title = "Raporty Instytutu";
const description =
  "Wyniki badań Instytutu Badań nad Dziaderstwem: szuflady z kablami, skarpety do sandałów, system start-stop i pilot od telewizora. Wszystkie dane są zmyślone, a mimo to się zgadzają.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/raporty" },
  openGraph: { type: "website", locale: "pl_PL", siteName: site.name, url: "/raporty", title: `${title} · ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
};

export default function ReportsPage() {
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/raporty" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: `${site.url}/raporty`,
            inLanguage: "pl",
            hasPart: REPORTS.map((report) => ({
              "@type": "Article",
              headline: report.title,
              url: `${site.url}/raporty/${report.slug}`,
              datePublished: report.date,
            })),
          },
        ]}
      />

      <div className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
        <Breadcrumbs crumbs={[{ label: title }]} />
        <PageHeading
          className="mt-8"
          kicker={
            <>
              § Badania <span className="mx-1.5 opacity-50">/</span> Seria wydawnicza IBD
            </>
          }
          aside={`${REPORTS.length} ${plural(REPORTS.length, "raport", "raporty", "raportów")} · 2026`}
          title={title}
          lead={typo(
            "Wyniki badań terenowych, przeglądów systematycznych i eksperymentów prowadzonych przez Instytut. Wszystkie dane są zmyślone, a mimo to się zgadzają.",
          )}
        />

        <ol className="mt-14 border-t-2 border-ink">
          {REPORTS.map((report) => (
            <li key={report.slug} className="border-b border-ink">
              <Link
                href={`/raporty/${report.slug}`}
                className="group grid gap-x-10 gap-y-4 py-8 md:grid-cols-[10rem_1fr] lg:grid-cols-[10rem_1fr_15rem]"
              >
                <p className="kicker text-ink-faint">
                  <span className="block text-ink">{report.number}</span>
                  <span className="mt-1 block">{formatReportDate(report.date)}</span>
                </p>
                <div>
                  <p className="kicker text-green">{report.category}</p>
                  <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-green">
                    {report.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{typo(report.lede)}</p>
                </div>
                <p className="border-t border-rule pt-4 md:col-start-2 lg:col-start-auto lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <span className="block font-display text-5xl font-black tracking-[-0.03em] tabular-nums">
                    {report.findings[0].value}
                  </span>
                  <span className="mt-2 block text-[0.95rem] leading-snug text-ink-soft">
                    {typo(report.findings[0].label)}
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <TestCallout
        title="Zostań przypadkiem badawczym."
        text={typo("Test Dziadersa to najprostszy sposób, by trafić do statystyk Instytutu. Wynik zostaje w linku, nie w bazie.")}
      />
    </main>
  );
}
