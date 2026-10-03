import type { Metadata } from "next";
import { ExamCertificate } from "@/components/exam-certificate";
import { ExamRunner } from "@/components/exam-runner";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { SPECIES } from "@/content/species";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { encodeExam, evaluateExam, grades, SAMPLE_EXAM } from "@/lib/exam";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Egzamin terenowy",
    metaTitle: "Egzamin terenowy z oznaczania dziadersów",
    description: (species: number) =>
      `Egzamin z oznaczania gatunków dziadersów: dwanaście pytań z ${species} gatunków Atlasu. Wokalizacje, ryciny, siedliska, objawy i łacina. Ocena od niedostatecznej do celującej i zaświadczenie.`,
    shareDescription: "Dwanaście pytań z Atlasu Dziadersów. Rozpoznasz Parkingowego po wokalizacji?",
    level: "Obserwator terenowy",
    lead: "Egzamin na obserwatora terenowego Instytutu. Dwanaście pytań z oznaczania gatunków: po wokalizacji, rycinie, siedlisku, objawach, naturalnych wrogach i nazwie łacińskiej.",
    meta: (species: number) => `12 pytań · ${species} gatunków w puli · każdy egzamin inny`,
    sheet: "Arkusz egzaminacyjny",
    form: "Formularz IBD-E1",
    scale: "Skala ocen",
    scaleNote: "Według skali szkolnej",
    scaleIntro: "Komisja Egzaminacyjna ocenia w skali od 1 do 6. Zaświadczenie z czerwonym paskiem przysługuje od oceny bardzo dobrej.",
    notes: [] as string[],
    of: "z 12",
    sample: "Przykładowy protokół",
    promoTitle: "Rozpoznawanie innych to połowa sukcesu.",
    promoText: "Druga połowa to Test Dziadersa. Pięć gabinetów, około czterech minut, rozpoznanie własnego gatunku.",
  },
  sl: {
    title: "Terenski izpit",
    metaTitle: "Terenski izpit iz določanja dziadersov",
    description: (species: number) =>
      `Izpit iz določanja vrst dziadersov: dvanajst vprašanj iz ${species} vrst Atlasa. Oglašanje, risbe, habitati, simptomi in latinščina. Ocena od nezadostne do odlične in potrdilo.`,
    shareDescription: "Dvanajst vprašanj iz Atlasa dziadersov. Prepoznaš Parkirnega po oglašanju?",
    level: "Terenski opazovalec",
    lead: "Izpit za terenskega opazovalca Inštituta. Dvanajst vprašanj iz določanja vrst: po oglašanju, risbi, habitatu, simptomih, naravnih sovražnikih in latinskem imenu.",
    meta: (species: number) => `12 vprašanj · ${species} vrst v naboru · vsak izpit drugačen`,
    sheet: "Izpitna pola",
    form: "Obrazec IBD-E1",
    scale: "Lestvica ocen",
    scaleNote: "Po šolski lestvici",
    scaleIntro:
      "Izpitna komisija ocenjuje po poljski šolski lestvici od 1 do 6, kjer je 6 najvišja ocena. Potrdilo z rdečim trakom¹ pripada od ocene prav dobro naprej.",
    notes: [
      "¹ Rdeči trak: na Poljskem ga ima šolsko spričevalo z odliko. Slovenski bralec ga pozna kot odličen uspeh, le da je ta brez traku.",
    ],
    of: "od 12",
    sample: "Vzorčni zapisnik",
    promoTitle: "Prepoznavanje drugih je pol uspeha.",
    promoText: "Druga polovica je Test dziadersa. Pet ordinacij, približno štiri minute, diagnoza lastne vrste.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description(SPECIES.length),
    path: "/egzamin",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function ExamPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const sample = evaluateExam(SAMPLE_EXAM, locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/egzamin" }]),
          {
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: t.title,
            description: t.description(SPECIES.length),
            url: absoluteUrl("/egzamin", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            educationalLevel: t.level,
            isAccessibleForFree: true,
            publisher: institute(locale),
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(SPECIES.length)} />

      <Section id="egzamin" title={t.sheet} aside={t.form}>
        <ExamRunner />
      </Section>

      <Section id="oceny" title={t.scale} aside={t.scaleNote} intro={typo(t.scaleIntro)}>
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <ol className="border-t border-ink lg:col-span-6">
            {[...grades(locale)].reverse().map((grade) => (
              <li key={grade.value} className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-b border-rule py-4">
                <span className="text-[2rem] font-bold leading-none">{grade.value}</span>
                <span>
                  <span className="block font-bold leading-tight">
                    {grade.name.charAt(0).toUpperCase() + grade.name.slice(1)} · {grade.title}
                  </span>
                  <span className="label mt-1 block text-ink-soft">
                    {grade.range} {t.of}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-6">
            <ExamCertificate result={sample} locale={locale} sample className="border border-ink" />
            <p className="label mt-4 text-center text-ink-soft">
              <Link href={`/egzamin/${encodeExam(SAMPLE_EXAM)}`} className="link text-ink">
                {t.sample}
              </Link>
            </p>
            <TranslatorNotes notes={t.notes} className="mt-10" />
          </div>
        </div>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
