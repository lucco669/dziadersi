import type { Metadata } from "next";
import { Tally } from "@/components/crowd";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { formatReportDate, getReports } from "@/content/reports";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Raporty Instytutu",
    metaTitle: "Raporty Instytutu: badania nad dziaderstwem",
    description:
      "Raporty Instytutu: sezon grzewczy, kartki za wycieraczką, „ja tylko zapytać”, pilot i szuflada z kablami. Dane są zmyślone, a mimo to się zgadzają.",
    lead: "Wyniki badań terenowych, przeglądów systematycznych i eksperymentów prowadzonych przez Instytut. Wszystkie dane są zmyślone, a mimo to się zgadzają.",
    meta: (count: number) => `${count} ${plural(count, "raport", "raporty", "raportów")} · seria wydawnicza IBD, ${site.founded}`,
    all: "Wszystkie raporty",
    promoTitle: "Zostań przypadkiem badawczym.",
    promoText: "Test Dziadersa to najprostszy sposób, by trafić do statystyk Instytutu. Wynik zostaje w linku, nie w bazie.",
  },
  sl: {
    title: "Poročila Inštituta",
    metaTitle: "Poročila Inštituta: raziskave dziaderstva",
    description:
      "Izsledki raziskav Inštituta: kurilna sezona, listki za brisalcem, »samo za vprašat«, daljinec in predal s kabli. Podatki so izmišljeni, pa vendar držijo.",
    lead: "Izsledki terenskih raziskav, sistematičnih pregledov in poskusov, ki jih izvaja Inštitut. Vsi podatki so izmišljeni, pa vendar držijo.",
    meta: (count: number) =>
      `${count} ${pluralSl(count, "poročilo", "poročili", "poročila", "poročil")} · zbirka IBD v slovenskem prevodu, ${site.founded}`,
    all: "Vsa poročila",
    promoTitle: "Postani raziskovalni primer.",
    promoText: "Test dziadersa je najpreprostejša pot v statistiko Inštituta. Izvid ostane v povezavi, ne v bazi.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/raporty",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

/** "61%" in Polish, "61 %" in Slovenian. */
const percentOf = (value: string) => {
  const match = /^(\d+)\s?%$/.exec(value);
  return match ? Number(match[1]) : null;
};

export default async function ReportsPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const reports = getReports(locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/raporty" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/raporty", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: reports.length,
              itemListElement: reports.map((report, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: report.title,
                url: absoluteUrl(`/raporty/${report.slug}`, locale),
              })),
            },
          },
        ]}
      />

      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(reports.length)} />

      <Section id="lista" title={t.all}>
        <ol className="border-t border-ink">
          {reports.map((report) => {
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
                    <span className="mt-1 block">{formatReportDate(report.date, locale)}</span>
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
                    {percent !== null && <Tally percent={percent} locale={locale} className="mt-4 w-full max-w-64" />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
