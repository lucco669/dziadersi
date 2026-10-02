import type { Metadata } from "next";
import Link from "next/link";
import { ExamCertificate } from "@/components/exam-certificate";
import { ExamRunner } from "@/components/exam-runner";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SPECIES } from "@/content/species";
import { encodeExam, evaluateExam, GRADES, SAMPLE_EXAM } from "@/lib/exam";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const title = "Egzamin terenowy";
const description = `Egzamin z oznaczania gatunków dziadersów: dwanaście pytań z ${SPECIES.length} gatunków Atlasu. Wokalizacje, ryciny, siedliska, objawy i łacina. Ocena od niedostatecznej do celującej i zaświadczenie.`;

export const metadata: Metadata = pageMetadata({
  title: "Egzamin terenowy z oznaczania dziadersów",
  description,
  path: "/egzamin",
  shareTitle: `${title} · ${site.name}`,
  shareDescription: "Dwanaście pytań z Atlasu Dziadersów. Rozpoznasz Parkingowego po wokalizacji?",
});

const sample = evaluateExam(SAMPLE_EXAM);

export default function ExamPage() {
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/egzamin" }]),
          {
            "@context": "https://schema.org",
            "@type": "Quiz",
            name: title,
            description,
            url: `${site.url}/egzamin`,
            inLanguage: "pl",
            educationalLevel: "Obserwator terenowy",
            isAccessibleForFree: true,
            publisher: institute,
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Egzamin na obserwatora terenowego Instytutu. Dwanaście pytań z oznaczania gatunków: po wokalizacji, rycinie, siedlisku, objawach, naturalnych wrogach i nazwie łacińskiej.",
        )}
        meta={`12 pytań · ${SPECIES.length} gatunków w puli · każdy egzamin inny`}
      />

      <Section id="egzamin" title="Arkusz egzaminacyjny" aside="Formularz IBD-E1">
        <ExamRunner />
      </Section>

      <Section
        id="oceny"
        title="Skala ocen"
        aside="Według skali szkolnej"
        intro={typo("Komisja Egzaminacyjna ocenia w skali od 1 do 6. Zaświadczenie z czerwonym paskiem przysługuje od oceny bardzo dobrej.")}
      >
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <ol className="border-t border-ink lg:col-span-6">
            {[...GRADES].reverse().map((grade) => (
              <li key={grade.value} className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-b border-rule py-4">
                <span className="text-[2rem] font-bold leading-none">{grade.value}</span>
                <span>
                  <span className="block font-bold leading-tight">
                    {grade.name.charAt(0).toUpperCase() + grade.name.slice(1)} · {grade.title}
                  </span>
                  <span className="label mt-1 block text-ink-soft">{grade.range} z 12</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-6">
            <ExamCertificate result={sample} sample className="border border-ink" />
            <p className="label mt-4 text-center text-ink-soft">
              <Link href={`/egzamin/${encodeExam(SAMPLE_EXAM)}`} className="link text-ink">
                Przykładowy protokół
              </Link>
            </p>
          </div>
        </div>
      </Section>

      <TestPromo
        title="Rozpoznawanie innych to połowa sukcesu."
        text={typo("Druga połowa to Test Dziadersa. Pięć gabinetów, około czterech minut, rozpoznanie własnego gatunku.")}
      />
    </main>
  );
}
