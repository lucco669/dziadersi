import type { Metadata } from "next";
import Link from "next/link";
import { MenuIcon } from "@/components/menu-icons";
import { NewsletterBox } from "@/components/newsletter-box";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { docket, VERDICTS } from "@/content/cases";
import { getBulletin } from "@/lib/bulletin";
import { getWeekly } from "@/lib/community";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getToday } from "@/lib/today";
import { cx, plural, typo } from "@/lib/typo";
import { composeIssue } from "@/lib/weekly";

const title = "Biuletyn tygodniowy";
const description =
  "Tydzień w liczbach Instytutu Badań nad Dziaderstwem: badania, obserwacje terenowe, sprawa tygodnia w Komisji, Indeks i komunikat. Co tydzień na stronie, po zapisaniu także e-mailem.";

export const metadata: Metadata = pageMetadata({
  title: "Biuletyn tygodniowy: tydzień w liczbach",
  description,
  path: "/biuletyn",
  shareTitle: `${title} · ${site.name}`,
});

export default async function BulletinPage() {
  const [weekly, bulletin, today] = await Promise.all([getWeekly(), getBulletin(), getToday()]);
  const issue = composeIssue(weekly, bulletin, today);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/biuletyn" }]),
          {
            "@context": "https://schema.org",
            "@type": "PublicationIssue",
            name: `${title} nr ${issue.week}/${issue.year}`,
            issueNumber: String(issue.week),
            description,
            url: `${site.url}/biuletyn`,
            inLanguage: "pl",
            publisher: institute,
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: title }]}
        title={`Tydzień ${issue.week} w liczbach`}
        lead={typo(`Biuletyn tygodniowy Instytutu, ostatnie siedem dni: ${issue.period}. Co poniedziałek także e-mailem, dla tych, którzy zamówili.`)}
        meta={`Biuletyn nr ${issue.week}/${issue.year} · Dział Statystyki IBD · aktualizacja co godzinę`}
        aside={<MenuIcon href="/biuletyn" className="ml-auto hidden w-48 lg:block" />}
      />

      <section aria-label="Liczby tygodnia" className="wrap pt-12">
        <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-3 lg:grid-cols-6">
          {issue.figures.map((item) => (
            <div key={item.label} className="border-b border-rule py-4 pr-4">
              <dd className="text-[clamp(2.2rem,4vw,3.25rem)] font-bold leading-none tabular-nums">{item.value}</dd>
              <dt className="label mt-1.5 text-ink-soft">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <Section id="tydzien" title="Z kraju i z terenu" aside={issue.period}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <ol className="space-y-5 lg:col-span-7">
            {issue.lines.map((line, i) => (
              <li key={line} className="grid grid-cols-[2.5rem_1fr] text-[1.2rem] leading-relaxed">
                <span className="font-sans text-[0.9rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
                {typo(line)}
              </li>
            ))}
          </ol>
          <div className="space-y-10 lg:col-span-5">
            {issue.caseOfWeek && (
              <div className="border-t border-ink pt-4">
                <p className="label text-red">Sprawa tygodnia</p>
                <Link href={`/czy-to-juz-dziaderstwo/${issue.caseOfWeek.item.slug}`} className="group mt-2 block">
                  <span className="label block text-ink-faint">{docket(issue.caseOfWeek.item)}</span>
                  <span className="block text-2xl font-bold leading-tight group-hover:text-red">{issue.caseOfWeek.item.title}</span>
                  <span className="mt-3 flex h-2" aria-hidden="true">
                    {VERDICTS.map((option) => (
                      <span
                        key={option.key}
                        className={cx("h-full", option.key === "nie" ? "bg-ink/15" : option.key === "tak" ? "bg-ink" : "bg-red")}
                        style={{ width: `${((issue.caseOfWeek!.counts[option.key] ?? 0) / issue.caseOfWeek!.total) * 100}%` }}
                      />
                    ))}
                  </span>
                  <span className="label mt-2 block text-ink-soft">
                    {issue.caseOfWeek.total} {plural(issue.caseOfWeek.total, "głos", "głosy", "głosów")} w tym tygodniu
                  </span>
                </Link>
              </div>
            )}
            {[
              { label: "Rozpoznanie tygodnia", species: issue.diagnosed },
              { label: "Obserwacja tygodnia", species: issue.observed },
            ].map(({ label, species }) =>
              species ? (
                <div key={label} className="border-t border-ink pt-4">
                  <p className="label text-red">{label}</p>
                  <Link href={`/atlas/${species.slug}`} className="group mt-2 flex items-center gap-4">
                    <SpeciesPlate species={species.key} animated className="w-28 shrink-0" />
                    <span className="text-2xl font-bold leading-tight group-hover:text-red">{species.name}</span>
                  </Link>
                </div>
              ) : null,
            )}
          </div>
        </div>
      </Section>

      <Section id="komunikat" title="Komunikat Instytutu">
        <p className="max-w-3xl border-l-2 border-red pl-6 text-[clamp(1.35rem,2.2vw,1.75rem)] leading-snug">{typo(issue.notice)}</p>
      </Section>

      <Section id="zapisy" title="Biuletyn e-mailem" aside="Poniedziałki, rano">
        <div className="grid gap-12 border-t border-ink pt-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <NewsletterBox />
          </div>
          <p className="label max-w-sm text-ink-soft lg:col-span-5">
            {typo(
              "W liście: liczby tygodnia, sprawa tygodnia, rozpoznanie i obserwacja tygodnia, komunikat oraz twój własny tydzień: obserwacje, kartki z kalendarza i orzeczenia. Bez reklam, bez przekazywania adresu dalej.",
            )}{" "}
            <Link href="/prywatnosc#spolecznosc" className="link text-ink">
              Prywatność
            </Link>
          </p>
        </div>
      </Section>

      <TestPromo
        title="W przyszłym tygodniu w statystyce możesz być ty."
        text={typo("Test Dziadersa: pięć gabinetów, około czterech minut. Wynik trafia anonimowo do Spisu.")}
      />
    </main>
  );
}
