import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Stamp } from "@/components/brand";
import { ExamActions } from "@/components/exam-actions";
import { ExamCertificate } from "@/components/exam-certificate";
import { Clue } from "@/components/exam-runner";
import { Section, TestPromo } from "@/components/page";
import { speciesByKey } from "@/content/species";
import { CLUE_LABELS, decodeExam, encodeExam, evaluateExam, SAMPLE_EXAM } from "@/lib/exam";
import { pageMetadata } from "@/lib/seo";
import { cx, typo } from "@/lib/typo";

// A result renders in one pass: the code holds everything the page needs.
export const instant = false;

export function generateStaticParams() {
  return [{ kod: encodeExam(SAMPLE_EXAM) }];
}

function load(kod: string) {
  const draft = decodeExam(kod);
  return draft ? evaluateExam(draft) : null;
}

export async function generateMetadata({ params }: PageProps<"/egzamin/[kod]">): Promise<Metadata> {
  const result = load((await params).kod);
  if (!result) return {};
  return pageMetadata({
    title: `${result.points} z 12 · ${result.grade.title}`,
    description: `Egzamin terenowy z oznaczania dziadersów zdany ze stopniem ${result.grade.name}: ${result.points} z 12. Instytut Badań nad Dziaderstwem.`,
    path: `/egzamin/${result.code}`,
    shareTitle: `Egzamin terenowy: ${result.points} z 12 · ${result.grade.title}`,
    noindex: true,
  });
}

const pad = (value: number) => String(value).padStart(2, "0");

export default async function ExamResultPage({ params }: PageProps<"/egzamin/[kod]">) {
  const { kod } = await params;
  const result = load(kod);
  if (!result) notFound();
  if (kod !== result.code) redirect(`/egzamin/${result.code}`);

  return (
    <main id="tresc">
      <section className="wrap pb-16 pt-8 md:pb-24 md:pt-12">
        <p className="label flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
          <span>
            <Link href="/egzamin" className="transition-colors hover:text-red">
              Egzamin terenowy
            </Link>{" "}
            · wynik
          </span>
          <span>
            Protokół {result.number} · {result.date}
          </span>
        </p>
        <div className="mt-8 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="sr-only">{`Egzamin terenowy: ${result.points} z 12, stopień ${result.grade.name}. ${result.grade.title}.`}</h1>
            <div aria-hidden="true">
              <p className="label text-ink-soft">Stopień</p>
              <p className="mt-2 flex items-end gap-6">
                <span className="text-[clamp(7.5rem,24vw,15rem)] font-bold leading-[0.8] tracking-[-0.04em]">{result.grade.value}</span>
                <span className="pb-3 text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-none">{result.grade.name}</span>
              </p>
              <Stamp className="mt-8 animate-stamp text-[0.9rem] [--stamp-rotate:-3deg]">{result.grade.title}</Stamp>
            </div>
            <p className="mt-8 max-w-xl text-[1.2rem] leading-relaxed">{typo(result.grade.text)}</p>
            <ol className="mt-10 grid max-w-xl grid-cols-12 gap-1" aria-label={`${result.points} z 12 poprawnych odpowiedzi`}>
              {result.questions.map((question, i) => (
                <li key={i} className={cx("h-3", result.answers[i] === question.correct ? "bg-ink" : "bg-red")} />
              ))}
            </ol>
            <p className="label mt-2 text-ink-soft">{result.points} z 12 oznaczeń poprawnych. Czerwone pola to błędy.</p>
            <ExamActions code={result.code} points={result.points} title={result.grade.title} />
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <ExamCertificate result={result} className="border border-ink" />
          </div>
        </div>
      </section>

      <Section id="protokol" title="Protokół egzaminu" aside="Formularz IBD-E1 · 12 pytań" intro={typo("Pytania, odpowiedzi i poprawne oznaczenia. Każdy gatunek ma kartę w Atlasie.")}>
        <ol className="border-t border-ink">
          {result.questions.map((question, i) => {
            const right = result.answers[i] === question.correct;
            const given = speciesByKey(question.options[result.answers[i]]);
            const answer = speciesByKey(question.answer);
            return (
              <li key={i} className="grid gap-x-8 gap-y-3 border-b border-rule py-6 md:grid-cols-[6rem_minmax(0,1.3fr)_minmax(0,1fr)]">
                <span className="label text-ink-soft">
                  Pyt. {pad(i + 1)}
                  <span className="block">{CLUE_LABELS[question.kind]}</span>
                </span>
                <div className="min-w-0">
                  <p className="font-bold leading-tight">{question.prompt}</p>
                  <div className="mt-3 [&_svg]:max-w-56 [&_p]:text-[1.15rem]">
                    <Clue question={question} />
                  </div>
                </div>
                <div>
                  <p className="leading-snug">
                    <span className="label block text-ink-soft">Odpowiedź</span>
                    <span className={cx(!right && "text-red line-through decoration-1")}>{given.name}</span>
                    {right && <span className="ml-2 text-ink-soft">✓</span>}
                  </p>
                  {!right && (
                    <p className="mt-2 leading-snug">
                      <span className="label block text-ink-soft">Poprawnie</span>
                      {answer.name}
                    </p>
                  )}
                  <Link href={`/atlas/${answer.slug}`} className="link mt-2 inline-block font-sans text-[0.9rem]">
                    Karta gatunku {answer.code}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      <TestPromo
        title="Oznaczanie innych zdane. Pora na siebie."
        text={typo("Test Dziadersa rozpozna twój gatunek. Pięć gabinetów, około czterech minut, certyfikat.")}
      />
    </main>
  );
}
