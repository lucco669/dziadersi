import type { Metadata } from "next";
import Link from "next/link";
import { Tally } from "@/components/crowd";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { REPORTS, formatReportDate } from "@/content/reports";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, typo } from "@/lib/typo";

const title = "Raporty Instytutu";
const description =
  "Wyniki badań Instytutu: sezon grzewczy, kartki za wycieraczką, „ja tylko zapytać”, pilot od telewizora i szuflada z kablami. Dane są zmyślone, a mimo to się zgadzają.";

export const metadata: Metadata = pageMetadata({
  title: "Raporty Instytutu: badania nad dziaderstwem",
  description,
  path: "/raporty",
  shareTitle: `${title} · ${site.name}`,
});

const percentOf = (value: string) => {
  const match = /^(\d+)%$/.exec(value);
  return match ? Number(match[1]) : null;
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
            publisher: institute,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: REPORTS.length,
              itemListElement: REPORTS.map((report, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: report.title,
                url: `${site.url}/raporty/${report.slug}`,
              })),
            },
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Wyniki badań terenowych, przeglądów systematycznych i eksperymentów prowadzonych przez Instytut. Wszystkie dane są zmyślone, a mimo to się zgadzają.",
        )}
        meta={`${REPORTS.length} ${plural(REPORTS.length, "raport", "raporty", "raportów")} · seria wydawnicza IBD, ${site.founded}`}
      />

      <Section id="lista" title="Wszystkie raporty">
        <ol className="border-t border-ink">
          {REPORTS.map((report) => {
            const finding = report.findings[0];
            const percent = percentOf(finding.value);
            return (
              <li key={report.slug} className="border-b border-ink">
                <Link
                  href={`/raporty/${report.slug}`}
                  className="group grid gap-x-10 gap-y-5 py-8 md:grid-cols-[9rem_1fr] lg:grid-cols-[9rem_1fr_17rem]"
                >
                  <p className="label text-ink-soft">
                    <span className="block text-ink">{report.number}</span>
                    <span className="mt-1 block">{formatReportDate(report.date)}</span>
                  </p>
                  <div>
                    <p className="label text-red">{report.category}</p>
                    <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.3rem)] font-bold leading-[1.05] tracking-[-0.01em] transition-colors group-hover:text-red">
                      {report.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-ink-soft">{typo(report.lede)}</p>
                  </div>
                  <div className="md:col-start-2 lg:col-start-auto">
                    <p className="text-5xl font-bold leading-none tracking-[-0.02em] text-red tabular-nums">{finding.value}</p>
                    <p className="mt-2 font-sans text-[0.9rem] leading-snug text-ink-soft">{typo(finding.label)}</p>
                    {percent !== null && <Tally percent={percent} className="mt-4 w-full max-w-64" />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <TestPromo
        title="Zostań przypadkiem badawczym."
        text={typo("Test Dziadersa to najprostszy sposób, by trafić do statystyk Instytutu. Wynik zostaje w linku, nie w bazie.")}
      />
    </main>
  );
}
