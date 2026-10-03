import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Stamp } from "@/components/brand";
import { ExamActions } from "@/components/exam-actions";
import { ExamCertificate } from "@/components/exam-certificate";
import { Clue } from "@/components/exam-runner";
import { Section, TestPromo } from "@/components/page";
import { speciesByKey } from "@/content/species";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { clueLabel, decodeExam, encodeExam, evaluateExam, SAMPLE_EXAM } from "@/lib/exam";
import { pageMetadata } from "@/lib/seo";
import { cx, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: (points: number, title: string) => `${points} z 12 · ${title}`,
    description: (grade: string, points: number) =>
      `Egzamin terenowy z oznaczania dziadersów zdany ze stopniem ${grade}: ${points} z 12. Instytut Badań nad Dziaderstwem.`,
    shareTitle: (points: number, title: string) => `Egzamin terenowy: ${points} z 12 · ${title}`,
    exam: "Egzamin terenowy",
    result: "wynik",
    protocol: "Protokół",
    heading: (points: number, grade: string, title: string) => `Egzamin terenowy: ${points} z 12, stopień ${grade}. ${title}.`,
    grade: "Stopień",
    answers: (points: number) => `${points} z 12 poprawnych odpowiedzi`,
    summary: (points: number) => `${points} z 12 oznaczeń poprawnych. Czerwone pola to błędy.`,
    record: "Protokół egzaminu",
    form: "Formularz IBD-E1 · 12 pytań",
    recordIntro: "Pytania, odpowiedzi i poprawne oznaczenia. Każdy gatunek ma kartę w Atlasie.",
    question: "Pyt.",
    answer: "Odpowiedź",
    correct: "Poprawnie",
    card: "Karta gatunku",
    promoTitle: "Oznaczanie innych zdane. Pora na siebie.",
    promoText: "Test Dziadersa rozpozna twój gatunek. Pięć gabinetów, około czterech minut, certyfikat.",
  },
  sl: {
    title: (points: number, title: string) => `${points} od 12 · ${title}`,
    description: (grade: string, points: number) =>
      `Terenski izpit iz določanja dziadersov, opravljen z oceno ${grade}: ${points} od 12. Inštitut za raziskave dziaderstva.`,
    shareTitle: (points: number, title: string) => `Terenski izpit: ${points} od 12 · ${title}`,
    exam: "Terenski izpit",
    result: "rezultat",
    protocol: "Zapisnik",
    heading: (points: number, grade: string, title: string) => `Terenski izpit: ${points} od 12, ocena ${grade}. ${title}.`,
    grade: "Ocena",
    answers: (points: number) => `${points} od 12 pravilnih odgovorov`,
    summary: (points: number) => `${points} od 12 pravilnih določitev. Rdeča polja so napake.`,
    record: "Zapisnik izpita",
    form: "Obrazec IBD-E1 · 12 vprašanj",
    recordIntro: "Vprašanja, odgovori in pravilne določitve. Vsaka vrsta ima kartico v Atlasu.",
    question: "Vpr.",
    answer: "Odgovor",
    correct: "Pravilno",
    card: "Kartica vrste",
    promoTitle: "Določanje drugih opravljeno. Na vrsti si ti.",
    promoText: "Test dziadersa določi tvojo vrsto. Pet ordinacij, približno štiri minute, certifikat.",
  },
});

// A result renders in one pass: the code holds everything the page needs.
export const instant = false;

// Codes are the same in both editions.
export function generateStaticParams() {
  return [{ kod: encodeExam(SAMPLE_EXAM) }];
}

function load(kod: string, locale: Locale) {
  const draft = decodeExam(kod);
  return draft ? evaluateExam(draft, locale) : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/egzamin/[kod]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const result = load((await params).kod, locale);
  if (!result) return {};
  return pageMetadata(locale, {
    title: t.title(result.points, result.grade.title),
    description: t.description(result.grade.name, result.points),
    path: `/egzamin/${result.code}`,
    shareTitle: t.shareTitle(result.points, result.grade.title),
    noindex: true,
  });
}

const pad = (value: number) => String(value).padStart(2, "0");

export default async function ExamResultPage({ params }: PageProps<"/[lang]/egzamin/[kod]">) {
  const { kod } = await params;
  const locale = await getLocale();
  const t = COPY[locale];
  const result = load(kod, locale);
  if (!result) notFound();
  if (kod !== result.code) redirect(localizePath(`/egzamin/${result.code}`, locale));

  return (
    <main id="tresc">
      <section className="wrap pb-16 pt-8 md:pb-24 md:pt-12">
        <p className="label flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
          <span>
            <Link href="/egzamin" className="transition-colors hover:text-red">
              {t.exam}
            </Link>{" "}
            · {t.result}
          </span>
          <span>
            {t.protocol} {result.number} · {result.date}
          </span>
        </p>
        <div className="mt-8 grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="sr-only">{t.heading(result.points, result.grade.name, result.grade.title)}</h1>
            <div aria-hidden="true">
              <p className="label text-ink-soft">{t.grade}</p>
              <p className="mt-2 flex items-end gap-6">
                <span className="text-[clamp(7.5rem,24vw,15rem)] font-bold leading-[0.8] tracking-[-0.04em]">{result.grade.value}</span>
                <span className="pb-3 text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-none">{result.grade.name}</span>
              </p>
              <Stamp className="mt-8 animate-stamp text-[0.9rem] [--stamp-rotate:-3deg]">{result.grade.title}</Stamp>
            </div>
            <p className="mt-8 max-w-xl text-[1.2rem] leading-relaxed">{typo(result.grade.text)}</p>
            <ol className="mt-10 grid max-w-xl grid-cols-12 gap-1" aria-label={t.answers(result.points)}>
              {result.questions.map((question, i) => (
                <li key={i} className={cx("h-3", result.answers[i] === question.correct ? "bg-ink" : "bg-red")} />
              ))}
            </ol>
            <p className="label mt-2 text-ink-soft">{t.summary(result.points)}</p>
            <ExamActions code={result.code} points={result.points} title={result.grade.title} />
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <ExamCertificate result={result} locale={locale} className="border border-ink" />
          </div>
        </div>
      </section>

      <Section id="protokol" title={t.record} aside={t.form} intro={typo(t.recordIntro)}>
        <ol className="border-t border-ink">
          {result.questions.map((question, i) => {
            const right = result.answers[i] === question.correct;
            const given = speciesByKey(question.options[result.answers[i]], locale);
            const answer = speciesByKey(question.answer, locale);
            return (
              <li key={i} className="grid gap-x-8 gap-y-3 border-b border-rule py-6 md:grid-cols-[6rem_minmax(0,1.3fr)_minmax(0,1fr)]">
                <span className="label text-ink-soft">
                  {t.question} {pad(i + 1)}
                  <span className="block">{clueLabel(question.kind, locale)}</span>
                </span>
                <div className="min-w-0">
                  <p className="font-bold leading-tight">{question.prompt}</p>
                  <div className="mt-3 [&_svg]:max-w-56 [&_p]:text-[1.15rem]">
                    <Clue question={question} />
                  </div>
                </div>
                <div>
                  <p className="leading-snug">
                    <span className="label block text-ink-soft">{t.answer}</span>
                    <span className={cx(!right && "text-red line-through decoration-1")}>{given.name}</span>
                    {right && <span className="ml-2 text-ink-soft">✓</span>}
                  </p>
                  {!right && (
                    <p className="mt-2 leading-snug">
                      <span className="label block text-ink-soft">{t.correct}</span>
                      {answer.name}
                    </p>
                  )}
                  <Link href={`/atlas/${answer.slug}`} className="link mt-2 inline-block font-sans text-[0.9rem]">
                    {t.card} {answer.code}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
