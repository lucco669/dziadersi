import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Stamp } from "@/components/brand";
import { Certificate } from "@/components/certificate";
import { LabSheet } from "@/components/lab-sheet";
import { Section } from "@/components/page";
import { Figure, SpeciesPlate, INK, PAPER } from "@/components/pictograms";
import { ResultProfileNote } from "@/components/profile-notes";
import { ResultActions } from "@/components/result-actions";
import type { Species } from "@/content/species";
import { getVerdicts, TASKS } from "@/content/test";
import { QUESTIONS_V1 } from "@/content/test-v1";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { sameAnswer } from "@/lib/answer-stats";
import { getBulletin } from "@/lib/bulletin";
import { getAnswerCounts, getScoreHistogram, realPercentile, type AnswerCounts } from "@/lib/census";
import { pageMetadata } from "@/lib/seo";
import { decodeResult, encodeResult, evaluate, groupPath, SAMPLE_DRAFT, type Diagnosis, type Result } from "@/lib/test";
import { cx, formatNumber, pct, pluralSl, quote, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: (score: number, diagnosis: string) => `${score}% · ${diagnosis}`,
    description: (result: Result) =>
      `${result.name ? `Osoba badana: ${result.name}${result.proxy ? " (wywiad rodzinny)" : ""}. ` : ""}${result.verdict.title}, rozpoznanie: ${result.diagnosis.name}. Test Dziadersa w Instytucie Badań nad Dziaderstwem. Zbadaj się, zanim będzie za późno.`,
    result: "Wynik Testu Dziadersa",
    certificate: (number: string, date: string) => `Certyfikat nr ${number} · ${date}`,
    heading: (result: Result) =>
      `Wynik Testu Dziadersa: ${result.score}%. ${result.verdict.title}. Rozpoznanie: ${result.diagnosis.name}.`,
    respondent: "Osoba badana",
    proxy: " · wywiad rodzinny",
    diagnosis: "Rozpoznanie",
    census: (percentile: number, total: string, nid: string) =>
      `Wynik wyższy niż u ${percentile}% z ${total} zbadanych w Narodowym Spisie. Narodowy Indeks Dziaderstwa wynosi dziś ${nid}%.`,
    model: (percentile: number, nid: string) => `Wynik wyższy niż u ${percentile}% badanych. Narodowy Indeks Dziaderstwa wynosi dziś ${nid}%.`,
    censusLink: "Narodowy Spis",
    notYours: "Nie twój wynik?",
    takeTest: "Wykonaj test",
    scale: "Skala dziaderstwa",
    nidToday: (nid: string) => `NID dziś ${nid}`,
    score: (score: number) => `Wynik ${score}`,
    points: (points: number, max: number) => `${points} z ${max} pkt`,
    recommendations: "Zalecenia Instytutu",
    dominant: "Gatunek dominujący",
    accompanying: "Gatunek towarzyszący",
    species: "Gatunek",
    habitat: "Występowanie",
    calls: "Typowe wokalizacje",
    enemies: "Naturalni wrogowie",
    fieldMarks: "Rozpoznanie w terenie",
    atlas: "Pełna karta gatunku w Atlasie",
    outside: "Gatunek · poza Atlasem",
    protocol: "Protokół badania",
    form2: (count: number) => `Formularz IBD-T2 · ${count} zadań`,
    form1: (count: number) => `Formularz IBD-T1 · ${count} pytania`,
    protocolIntro: "Odpowiedzi, które w największym stopniu wpłynęły na rozpoznanie.",
    task: "Zad.",
    question: "Pyt.",
    award: (points: number) => `+${points} pkt`,
    clean: "Nie stwierdzono objawów istotnych klinicznie. Instytut prosi o zgłoszenie się na badanie kontrolne za pięć lat.",
    total: (points: number, max: number) => `Suma punktów: ${points} z ${max}. Link do wyniku zawiera pełny protokół badania.`,
    lab: "Wyniki badań laboratoryjnych",
    labUnit: "Zakład Diagnostyki Dziaderstwa IBD",
    labIntro: "Parametry wyliczone z odpowiedzi. Krew nie była potrzebna, choć laboratorium proponowało.",
    labNote:
      "Strzałka przy wyniku oznacza wartość poza zakresem referencyjnym. Zakresy ustalono na grupie kontrolnej, która nie posiada szuflady ze wszystkim.",
    labDownload: "Pobierz wyniki",
    labFormat: "Obraz 4:5, do wysłania lekarzowi rodzinnemu. Albo rodzinie.",
    referral: "Zbadaj kogoś jeszcze.",
    referralText: "Wyślij test komuś, kto „nie potrzebuje instrukcji”. Albo zrób go jeszcze raz, tym razem szczerze.",
    friends: "Ranking znajomych",
    friendsText: "Twój wynik na górze listy. Wyślij link, a każdy, kto zrobi test, dopisze się poniżej.",
    interview: "Wywiad rodzinny",
    interviewText: "Odpowiadasz za tatę, wujka albo szefa. Certyfikat dostaje osoba badana.",
    again: "Test jeszcze raz",
    againText: "Instytut zakłada, że tym razem szczerze.",
  },
  sl: {
    title: (score: number, diagnosis: string) => `${score} % · ${diagnosis}`,
    description: (result: Result) =>
      `${result.name ? `Preiskovana oseba: ${result.name}${result.proxy ? " (heteroanamneza)" : ""}. ` : ""}${result.verdict.title}, diagnoza: ${result.diagnosis.name}. Test dziadersa na Inštitutu za raziskave dziaderstva. Preglej se, preden bo prepozno.`,
    result: "Izvid testa dziadersa",
    certificate: (number: string, date: string) => `Certifikat št. ${number} · ${date}`,
    heading: (result: Result) =>
      `Izvid testa dziadersa: ${result.score} %. ${result.verdict.title}. Diagnoza: ${result.diagnosis.name}.`,
    respondent: "Preiskovana oseba",
    proxy: " · heteroanamneza",
    diagnosis: "Diagnoza",
    census: (percentile: number, total: string, nid: string) =>
      `Rezultat je višji kot pri ${percentile} % izmed ${total} preiskovanih v Nacionalnem popisu. Nacionalni indeks dziaderstva danes znaša ${nid} %.`,
    model: (percentile: number, nid: string) =>
      `Rezultat je višji kot pri ${percentile} % preiskovanih. Nacionalni indeks dziaderstva danes znaša ${nid} %.`,
    censusLink: "Nacionalni popis",
    notYours: "Ni tvoj izvid?",
    takeTest: "Opravi test",
    scale: "Skala dziaderstva",
    nidToday: (nid: string) => `NID danes ${nid}`,
    score: (score: number) => `Rezultat ${score}`,
    points: (points: number, max: number) => `${points} od ${max} točk`,
    recommendations: "Priporočila Inštituta",
    dominant: "Prevladujoča vrsta",
    accompanying: "Spremljevalna vrsta",
    species: "Vrsta",
    habitat: "Razširjenost",
    calls: "Značilno oglašanje",
    enemies: "Naravni sovražniki",
    fieldMarks: "Prepoznavanje na terenu",
    atlas: "Celotna kartica vrste v Atlasu",
    outside: "Vrsta · zunaj Atlasa",
    protocol: "Zapisnik pregleda",
    form2: (count: number) => `Obrazec IBD-T2 · ${count} ${pluralSl(count, "naloga", "nalogi", "naloge", "nalog")}`,
    form1: (count: number) => `Obrazec IBD-T1 · ${count} ${pluralSl(count, "vprašanje", "vprašanji", "vprašanja", "vprašanj")}`,
    protocolIntro: "Odgovori, ki so najbolj vplivali na diagnozo.",
    task: "Nal.",
    question: "Vpr.",
    award: (points: number) => `+${points} ${pluralSl(points, "točka", "točki", "točke", "točk")}`,
    clean: "Klinično pomembnih simptomov ni bilo ugotovljenih. Inštitut te prosi, da se čez pet let zglasiš na kontrolnem pregledu.",
    total: (points: number, max: number) => `Skupaj točk: ${points} od ${max}. Povezava do izvida vsebuje celoten zapisnik pregleda.`,
    lab: "Laboratorijski izvidi",
    labUnit: "Oddelek za diagnostiko dziaderstva IBD",
    labIntro: "Parametri so izračunani iz odgovorov. Kri ni bila potrebna, čeprav se je laboratorij ponudil.",
    labNote:
      "Puščica ob rezultatu pomeni vrednost zunaj referenčnega območja. Območja so bila določena na kontrolni skupini, ki nima predala z vsem mogočim.",
    labDownload: "Prenesi izvide",
    labFormat: "Slika 4:5, za pošiljanje osebnemu zdravniku. Ali družini.",
    referral: "Preglej še koga.",
    referralText: "Pošlji test nekomu, ki »ne potrebuje navodil«. Ali ga opravi še enkrat, tokrat iskreno.",
    friends: "Lestvica prijateljev",
    friendsText: "Tvoj rezultat na vrhu seznama. Pošlji povezavo in vsak, ki opravi test, se vpiše pod tabo.",
    interview: "Heteroanamneza",
    interviewText: "Odgovarjaš namesto očeta, strica ali šefa. Certifikat dobi preiskovana oseba.",
    again: "Test še enkrat",
    againText: "Inštitut predpostavlja, da tokrat iskreno.",
  },
});

// A result renders in one pass, with no loading state: the code holds everything the page needs.
export const instant = false;

// One sample is prerendered in each edition; every other code is rendered on its first visit and then served from cache.
export function generateStaticParams() {
  return [{ kod: encodeResult(SAMPLE_DRAFT) }];
}

/** The same code gives the same result in both editions, in the edition's language. */
function load(kod: string, locale: Locale) {
  let requested = kod;
  try {
    requested = decodeURIComponent(kod);
  } catch {
    // Malformed escape: use the raw segment.
  }
  const draft = decodeResult(requested);
  return draft ? { requested, result: evaluate(draft, locale) } : null;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/wynik/[kod]">): Promise<Metadata> {
  const locale = await getLocale();
  const loaded = load((await params).kod, locale);
  if (!loaded) return {};
  const { result } = loaded;
  const t = COPY[locale];
  const title = t.title(result.score, result.diagnosis.name);
  return pageMetadata(locale, {
    title,
    description: t.description(result),
    path: `/wynik/${result.code}`,
    shareTitle: title,
    noindex: true,
    nofollow: true,
  });
}

export default async function ResultPage({ params }: PageProps<"/[lang]/wynik/[kod]">) {
  const locale = await getLocale();
  const loaded = load((await params).kod, locale);
  if (!loaded) notFound();
  const { requested, result } = loaded;
  // Normalised codes only, e.g. when a name was filtered out.
  if (requested !== result.code) redirect(localizePath(`/wynik/${result.code}`, locale));

  const [bulletin, histogram, counts] = await Promise.all([
    getBulletin(locale),
    getScoreHistogram(),
    result.version === 2 ? getAnswerCounts("counts") : null,
  ]);
  const real = realPercentile(histogram, result.score);

  return (
    <main id="tresc">
      <Summary result={result} nid={bulletin.index.value} real={real} locale={locale} />
      <CaseDescription result={result} locale={locale} />
      <Lab result={result} locale={locale} />
      <Protocol result={result} counts={counts} locale={locale} />
      <Referral code={result.code} locale={locale} />
    </main>
  );
}

const pad = (value: number) => String(value).padStart(2, "0");

function Summary({
  result,
  nid,
  real,
  locale,
}: {
  result: Result;
  nid: number;
  /** From the census, once it has enough results; until then the model's estimate. */
  real: { percentile: number; total: number } | null;
  locale: Locale;
}) {
  const t = COPY[locale];
  return (
    <section className="wrap pb-16 pt-8 md:pb-24 md:pt-12">
      <p className="label flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
        <span>{t.result}</span>
        <span>{t.certificate(result.certificate, result.date)}</span>
      </p>

      <div className="mt-8 grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 className="sr-only">{t.heading(result)}</h1>
          <div aria-hidden="true">
            <p className="label text-ink-soft">
              {t.respondent}
              {result.name && <span className="text-ink">: {result.name}</span>}
              {result.proxy && <span className="text-red">{t.proxy}</span>}
            </p>
            <p className="mt-2 text-[clamp(7.5rem,24vw,15rem)] font-bold leading-[0.8] tracking-[-0.04em] tabular-nums">
              {result.score}
              <span className="text-[0.4em]">%</span>
            </p>
            <Stamp className="mt-8 animate-stamp text-[0.9rem] [--stamp-rotate:-3deg]">{result.verdict.title}</Stamp>
            <p className="label mt-10 text-ink-soft">{t.diagnosis}</p>
            <p className="mt-1 text-[clamp(2.25rem,4.8vw,3.5rem)] font-bold leading-[1] tracking-[-0.015em] [text-wrap:balance]">
              {result.diagnosis.name}
            </p>
            <p className="mt-2 text-lg italic text-ink-soft">{result.diagnosis.latin}</p>
          </div>

          <ScoreScale score={result.score} nid={nid} locale={locale} />
          <p className="mt-5 max-w-xl text-ink-soft">
            {typo(
              real
                ? t.census(real.percentile, formatNumber(locale, real.total), pct(nid))
                : t.model(result.percentile, pct(nid)),
            )}{" "}
            <Link href="/spis" className="link text-ink">
              {t.censusLink}
            </Link>
          </p>

          <ResultActions code={result.code} score={result.score} diagnosis={result.diagnosis.name} name={result.name} />
        </div>

        <div className="lg:col-span-5 lg:pt-2">
          <Certificate
            locale={locale}
            score={result.score}
            diagnosis={result.diagnosis.name}
            latin={result.diagnosis.latin}
            number={result.certificate}
            species={result.diagnosis.species.map((species) => species.key)}
            name={result.name || undefined}
            date={result.date}
            proxy={result.proxy}
            className="border border-ink"
          />
          <p className="label mt-6 text-center text-ink-soft">
            {t.notYours}{" "}
            <Link href="/test" className="link text-ink">
              {t.takeTest}
            </Link>
          </p>
          <ResultProfileNote
            code={result.code}
            species={result.diagnosis.species.map((species) => ({ key: species.key, name: species.name }))}
          />
        </div>
      </div>
    </section>
  );
}

const ZONE_FILL = ["bg-ink/[0.07]", "bg-ink/15", "bg-ink/30", "bg-red/85"];

/** The four zones of the scale are the four verdicts, named as the verdicts name them. */
function ScoreScale({ score, nid, locale }: { score: number; nid: number; locale: Locale }) {
  const t = COPY[locale];
  const zones = getVerdicts(locale);
  return (
    <figure className="mt-12 max-w-xl">
      <figcaption className="label flex justify-between text-ink-soft">
        <span>{t.scale}</span>
        <span>0–100</span>
      </figcaption>
      <div className="relative mt-14">
        <div className="flex h-3">
          {zones.map((zone, i) => (
            <div key={zone.label} className={cx("flex-1", ZONE_FILL[i], i > 0 && "border-l-2 border-paper")} />
          ))}
        </div>
        <Marker at={nid} label={t.nidToday(pct(nid))} high className="bg-ink/60" labelClassName="text-ink-soft" />
        <Marker at={score} label={t.score(score)} className="w-[3px] bg-red" labelClassName="text-red" />
      </div>
      <div className="label mt-2.5 grid grid-cols-4 text-[0.75rem] text-ink-soft">
        {zones.map((zone) => (
          <span key={zone.label}>{zone.label}</span>
        ))}
      </div>
    </figure>
  );
}

function Marker({
  at,
  label,
  high,
  className,
  labelClassName,
}: {
  at: number;
  label: string;
  high?: boolean;
  className?: string;
  labelClassName?: string;
}) {
  const align = at > 85 ? "-translate-x-full" : at < 15 ? "" : "-translate-x-1/2";
  return (
    <div className="absolute -bottom-1.5" style={{ left: `${at}%`, top: high ? "-2.6rem" : "-1.3rem" }}>
      <span className={cx("label absolute bottom-full mb-1 whitespace-nowrap text-[0.75rem]", align, labelClassName)}>
        {label}
      </span>
      <span className={cx("absolute inset-y-0 w-0.5 -translate-x-1/2", className)} />
    </div>
  );
}

function CaseDescription({ result, locale }: { result: Result; locale: Locale }) {
  const t = COPY[locale];
  const { verdict, diagnosis } = result;
  return (
    <Section id="opis" title={verdict.title} aside={t.points(result.points, result.max)} intro={typo(verdict.description)}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h3 className="label border-b border-ink pb-3 text-ink-soft">{t.recommendations}</h3>
          <ol>
            {verdict.recommendations.map((recommendation, i) => (
              <li key={recommendation} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-4 leading-snug">
                <span className="font-sans text-[0.9rem] font-semibold text-red">{pad(i + 1)}</span>
                {typo(recommendation)}
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-12 lg:col-span-7">
          {diagnosis.species.length > 0 ? (
            diagnosis.species.map((species, i) => (
              <SpeciesNote
                key={species.key}
                species={species}
                role={diagnosis.species.length > 1 ? (i === 0 ? t.dominant : t.accompanying) : t.species}
                locale={locale}
              />
            ))
          ) : (
            <UnspecifiedNote diagnosis={diagnosis} locale={locale} />
          )}
        </div>
      </div>
    </Section>
  );
}

function SpeciesNote({ species, role, locale }: { species: Species; role: string; locale: Locale }) {
  const t = COPY[locale];
  return (
    <article aria-labelledby={`gatunek-${species.key}`} className="border-t border-ink pt-5">
      <div className="grid gap-6 sm:grid-cols-[1fr_12rem]">
        <div>
          <p className="label text-ink-soft">
            {role} · {species.code}
          </p>
          <h3 id={`gatunek-${species.key}`} className="mt-2 text-[2rem] font-bold leading-tight tracking-[-0.01em]">
            {species.name}
          </h3>
          <p className="mt-1 italic text-ink-soft">
            {species.latin} ({species.authority})
          </p>
        </div>
        <SpeciesPlate species={species.key} className="w-full max-w-48" />
      </div>
      <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <Field label={t.habitat}>{typo(species.habitat)}</Field>
        <Field label={t.calls}>
          {species.calls.map((call) => (
            <span key={call} className="block italic">
              {quote(call, locale)}
            </span>
          ))}
        </Field>
        <Field label={t.enemies}>{typo(species.enemies)}</Field>
        <Field label={t.fieldMarks}>{typo(species.fieldMarks)}</Field>
      </dl>
      <Link href={`/atlas/${species.slug}`} className="link mt-6 inline-block font-sans font-medium">
        {t.atlas}
      </Link>
    </article>
  );
}

function UnspecifiedNote({ diagnosis, locale }: { diagnosis: Diagnosis; locale: Locale }) {
  return (
    <article className="border-t border-ink pt-5">
      <p className="label text-ink-soft">{COPY[locale].outside}</p>
      <h3 className="mt-2 text-[2rem] font-bold leading-tight tracking-[-0.01em]">{diagnosis.name}</h3>
      <p className="mt-1 italic text-ink-soft">
        {diagnosis.latin} ({diagnosis.authority})
      </p>
      <p className="mt-5 text-lg leading-relaxed">{typo(diagnosis.description ?? "")}</p>
    </article>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-rule pt-3">
      <dt className="label text-ink-soft">{label}</dt>
      <dd className="mt-1.5 leading-relaxed">{children}</dd>
    </div>
  );
}

function Protocol({ result, counts, locale }: { result: Result; counts: AnswerCounts | null; locale: Locale }) {
  const t = COPY[locale];
  return (
    <Section
      id="protokol"
      title={t.protocol}
      aside={result.version === 2 ? t.form2(TASKS.length) : t.form1(QUESTIONS_V1.length)}
      intro={typo(t.protocolIntro)}
    >
      {result.symptoms.length > 0 ? (
        <ol className="border-t border-ink">
          {result.symptoms.map((symptom) => (
            <li
              key={symptom.number}
              className="grid gap-x-8 gap-y-2 border-b border-rule py-5 md:grid-cols-[4.5rem_minmax(0,1.25fr)_minmax(0,1fr)_4.5rem] md:items-baseline"
            >
              <span className="label text-ink-soft">
                {result.version === 2 ? t.task : t.question} {pad(symptom.number)}
              </span>
              <span className="leading-snug">
                {typo(symptom.question)}
                <span className="label mt-1.5 block text-ink-faint">{symptom.section}</span>
              </span>
              <span className="text-xl italic leading-snug">
                {typo(symptom.answer)}
                {result.version === 2 && <SameAnswer result={result} number={symptom.number} counts={counts} locale={locale} />}
              </span>
              <span className="label font-semibold text-red md:text-right">{t.award(symptom.points)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="max-w-2xl border-t border-ink pt-6 text-xl leading-relaxed">{typo(t.clean)}</p>
      )}
      <p className="label mt-6 text-ink-soft">{t.total(result.points, result.max)}</p>
    </Section>
  );
}

function Lab({ result, locale }: { result: Result; locale: Locale }) {
  const t = COPY[locale];
  return (
    <Section id="badania" title={t.lab} aside={t.labUnit} intro={typo(t.labIntro)}>
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <LabSheet result={result} locale={locale} className="border border-ink lg:col-span-8" />
        <div className="lg:col-span-4">
          <p className="max-w-sm text-lg leading-relaxed">{typo(t.labNote)}</p>
          <a
            href={localizePath(`/wynik/${result.code}/badania?pobierz`, locale)}
            download
            className="btn mt-8 border border-ink hover:bg-ink hover:text-paper"
          >
            {t.labDownload} <span aria-hidden="true">↓</span>
          </a>
          <p className="label mt-3 text-ink-soft">{t.labFormat}</p>
        </div>
      </div>
    </Section>
  );
}

/** "Tak samo odpowiedziało 23% badanych", under a protocol entry. */
function SameAnswer({ result, number, counts, locale }: { result: Result; number: number; counts: AnswerCounts | null; locale: Locale }) {
  const index = number - 1;
  const same = sameAnswer(TASKS[index], index, result.answers[index], counts, locale);
  return same ? <span className="label mt-1.5 block not-italic text-ink-soft">{same.text}</span> : null;
}

/** One more person: a ranking with friends, an interview about someone at home, or the test again. */
function Referral({ code, locale }: { code: string; locale: Locale }) {
  const t = COPY[locale];
  return (
    <section aria-labelledby="skierowanie" className="bg-ink text-paper">
      <div className="wrap grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="flex gap-10 lg:col-span-5">
          <svg viewBox="-2 -1 56 97" className="hidden h-40 shrink-0 md:block" aria-hidden="true">
            <Figure color={PAPER} cutout={INK} right="point" />
          </svg>
          <div>
            <h2 id="skierowanie" className="text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
              {t.referral}
            </h2>
            <p className="mt-4 max-w-md text-paper/75">{typo(t.referralText)}</p>
          </div>
        </div>
        <ul className="border-t border-paper/30 lg:col-span-7">
          {[
            { href: groupPath([code]), title: t.friends, text: t.friendsText },
            { href: "/test?tryb=wywiad", title: t.interview, text: t.interviewText },
            { href: "/test", title: t.again, text: t.againText },
          ].map((item) => (
            <li key={item.title}>
              <Link href={item.href} className="group grid gap-1 border-b border-paper/30 py-5 sm:grid-cols-[14rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="text-2xl font-bold leading-tight transition-colors group-hover:text-red">{item.title}</span>
                <span className="font-sans text-[0.95rem] leading-snug text-paper/70">{typo(item.text)}</span>
                <span aria-hidden="true" className="hidden text-xl transition-transform group-hover:translate-x-1 sm:block">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
