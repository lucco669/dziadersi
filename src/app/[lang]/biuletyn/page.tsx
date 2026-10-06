import type { Metadata } from "next";
import { MenuIcon } from "@/components/menu-icons";
import { NewsletterBox } from "@/components/newsletter-box";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { docket, VERDICTS } from "@/content/cases";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getBulletin } from "@/lib/bulletin";
import { getWeekly } from "@/lib/community";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getToday } from "@/lib/today";
import { cx, plural, pluralSl, typo } from "@/lib/typo";
import { composeIssue } from "@/lib/weekly";

const COPY = defineCopy({
  pl: {
    title: "Biuletyn tygodniowy",
    metaTitle: "Biuletyn tygodniowy: tydzień w liczbach",
    description:
      "Biuletyn Instytutu: tydzień w liczbach, badania, obserwacje, sprawa tygodnia i Indeks Dziaderstwa. Czytaj na stronie lub zapisz się na e-mail.",
    issue: (week: number, year: number) => `Biuletyn tygodniowy nr ${week}/${year}`,
    heading: (week: number) => `Tydzień ${week} w liczbach`,
    lead: (period: string) =>
      `Biuletyn tygodniowy Instytutu, ostatnie siedem dni: ${period}. Co poniedziałek także e-mailem, dla tych, którzy zamówili.`,
    meta: (week: number, year: number) => `Biuletyn nr ${week}/${year} · Dział Statystyki IBD · aktualizacja co godzinę`,
    figures: "Liczby tygodnia",
    news: "Z kraju i z terenu",
    caseOfWeek: "Sprawa tygodnia",
    votes: (n: number) => `${n} ${plural(n, "głos", "głosy", "głosów")} w tym tygodniu`,
    diagnosed: "Rozpoznanie tygodnia",
    observed: "Obserwacja tygodnia",
    notice: "Komunikat Instytutu",
    email: "Biuletyn e-mailem",
    emailAside: "Poniedziałki, rano",
    contents:
      "W liście: liczby tygodnia, sprawa tygodnia, rozpoznanie i obserwacja tygodnia, komunikat oraz twój własny tydzień: obserwacje, kartki z kalendarza i orzeczenia. Bez reklam, bez przekazywania adresu dalej.",
    privacy: "Prywatność",
    promo: {
      title: "W przyszłym tygodniu w statystyce możesz być ty.",
      text: "Test Dziadersa: pięć gabinetów, około czterech minut. Wynik trafia anonimowo do Spisu.",
    },
  },
  sl: {
    title: "Tedenski bilten",
    metaTitle: "Tedenski bilten: teden v številkah",
    description:
      "Bilten Inštituta: teden v številkah, pregledi, opazovanja, primer tedna in Indeks dziaderstva. Beri na strani ali se naroči po e-pošti.",
    issue: (week: number, year: number) => `Tedenski bilten št. ${week}/${year}`,
    heading: (week: number) => `${week}. teden v številkah`,
    lead: (period: string) =>
      `Tedenski bilten Inštituta, zadnjih sedem dni: ${period}. Vsak ponedeljek tudi po e-pošti, za tiste, ki so ga naročili.`,
    meta: (week: number, year: number) => `Bilten št. ${week}/${year} · Služba za statistiko IBD · posodobitev vsako uro`,
    figures: "Številke tedna",
    news: "Doma in na terenu",
    caseOfWeek: "Primer tedna",
    votes: (n: number) => `${n} ${pluralSl(n, "glas", "glasova", "glasovi", "glasov")} ta teden`,
    diagnosed: "Diagnoza tedna",
    observed: "Opazovanje tedna",
    notice: "Obvestilo Inštituta",
    email: "Bilten po e-pošti",
    emailAside: "Ob ponedeljkih, zjutraj",
    contents:
      "V pismu: številke tedna, primer tedna, diagnoza in opazovanje tedna, obvestilo in tvoj lastni teden: opazovanja, listi s koledarja in razsodbe. Brez oglasov, brez posredovanja naslova naprej.",
    privacy: "Zasebnost",
    promo: {
      title: "Prihodnji teden si v statistiki lahko ti.",
      text: "Test dziadersa: pet ordinacij, približno štiri minute. Rezultat gre anonimno v Popis.",
    },
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/biuletyn",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

export default async function BulletinPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const [weekly, bulletin, today] = await Promise.all([getWeekly(), getBulletin(locale), getToday()]);
  const issue = composeIssue(weekly, bulletin, today, locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/biuletyn" }]),
          {
            "@context": "https://schema.org",
            "@type": "PublicationIssue",
            name: t.issue(issue.week, issue.year),
            issueNumber: String(issue.week),
            description: t.description,
            url: absoluteUrl("/biuletyn", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.heading(issue.week)}
        lead={typo(t.lead(issue.period))}
        meta={t.meta(issue.week, issue.year)}
        aside={<MenuIcon href="/biuletyn" className="ml-auto hidden w-48 lg:block" />}
      />

      <section aria-label={t.figures} className="wrap pt-12">
        <dl className="grid grid-cols-2 border-t border-ink sm:grid-cols-3 lg:grid-cols-6">
          {issue.figures.map((item) => (
            <div key={item.label} className="border-b border-rule py-4 pr-4">
              <dd className="text-[clamp(2.2rem,4vw,3.25rem)] font-bold leading-none tabular-nums">{item.value}</dd>
              <dt className="label mt-1.5 text-ink-soft">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <Section id="tydzien" title={t.news} aside={issue.period}>
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
                <p className="label text-red">{t.caseOfWeek}</p>
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
                  <span className="label mt-2 block text-ink-soft">{t.votes(issue.caseOfWeek.total)}</span>
                </Link>
              </div>
            )}
            {[
              { label: t.diagnosed, species: issue.diagnosed },
              { label: t.observed, species: issue.observed },
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

      <Section id="komunikat" title={t.notice}>
        <p className="max-w-3xl border-l-2 border-red pl-6 text-[clamp(1.35rem,2.2vw,1.75rem)] leading-snug">{typo(issue.notice)}</p>
      </Section>

      <Section id="zapisy" title={t.email} aside={t.emailAside}>
        <div className="grid gap-12 border-t border-ink pt-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <NewsletterBox />
          </div>
          <p className="label max-w-sm text-ink-soft lg:col-span-5">
            {typo(t.contents)}{" "}
            <Link href="/prywatnosc#spolecznosc" className="link text-ink">
              {t.privacy}
            </Link>
          </p>
        </div>
      </Section>

      <TestPromo title={t.promo.title} text={typo(t.promo.text)} />
    </main>
  );
}
