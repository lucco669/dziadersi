import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Stamp } from "@/components/brand";
import { Certificate } from "@/components/certificate";
import { Section } from "@/components/page";
import { Figure, SpeciesPlate, INK, PAPER } from "@/components/pictograms";
import { ResultActions } from "@/components/result-actions";
import type { Species } from "@/content/species";
import { QUESTIONS } from "@/content/test";
import { getBulletin } from "@/lib/bulletin";
import { ZONES } from "@/lib/indeks";
import { pageMetadata } from "@/lib/seo";
import { decodeResult, encodeResult, evaluate, MAX_POINTS, SAMPLE_DRAFT, type Diagnosis, type Result } from "@/lib/test";
import { cx, pct, typo } from "@/lib/typo";

// A result renders in one pass, with no loading state: the code holds everything the page needs.
export const instant = false;

// One sample is prerendered; every other code is rendered on its first visit and then served from cache.
export function generateStaticParams() {
  return [{ kod: encodeResult(SAMPLE_DRAFT) }];
}

function load(kod: string) {
  let requested = kod;
  try {
    requested = decodeURIComponent(kod);
  } catch {
    // Malformed escape: use the raw segment.
  }
  const draft = decodeResult(requested);
  return draft ? { requested, result: evaluate(draft) } : null;
}

export async function generateMetadata({ params }: PageProps<"/wynik/[kod]">): Promise<Metadata> {
  const loaded = load((await params).kod);
  if (!loaded) return {};
  const { result } = loaded;
  const title = `${result.score}% · ${result.diagnosis.name}`;
  return pageMetadata({
    title,
    description: `${result.name ? `Osoba badana: ${result.name}. ` : ""}${result.verdict.title}, rozpoznanie: ${result.diagnosis.name}. Test Dziadersa w Instytucie Badań nad Dziaderstwem. Zbadaj się, zanim będzie za późno.`,
    path: `/wynik/${result.code}`,
    shareTitle: title,
    noindex: true,
  });
}

export default async function ResultPage({ params }: PageProps<"/wynik/[kod]">) {
  const loaded = load((await params).kod);
  if (!loaded) notFound();
  const { requested, result } = loaded;
  // Normalised codes only, e.g. when a name was filtered out.
  if (requested !== result.code) redirect(`/wynik/${result.code}`);

  const bulletin = await getBulletin();

  return (
    <main id="tresc">
      <Summary result={result} nid={bulletin.index.value} />
      <CaseDescription result={result} />
      <Protocol result={result} />
      <Referral />
    </main>
  );
}

const pad = (value: number) => String(value).padStart(2, "0");

function Summary({ result, nid }: { result: Result; nid: number }) {
  return (
    <section className="wrap pb-16 pt-8 md:pb-24 md:pt-12">
      <p className="label flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
        <span>Wynik Testu Dziadersa</span>
        <span>
          Certyfikat nr {result.certificate} · {result.date}
        </span>
      </p>

      <div className="mt-8 grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 className="sr-only">
            {`Wynik Testu Dziadersa: ${result.score}%. ${result.verdict.title}. Rozpoznanie: ${result.diagnosis.name}.`}
          </h1>
          <div aria-hidden="true">
            <p className="label text-ink-soft">
              Osoba badana{result.name && <span className="text-ink">: {result.name}</span>}
            </p>
            <p className="mt-2 text-[clamp(7.5rem,24vw,15rem)] font-bold leading-[0.8] tracking-[-0.04em] tabular-nums">
              {result.score}
              <span className="text-[0.4em]">%</span>
            </p>
            <Stamp className="mt-8 animate-stamp text-[0.9rem] [--stamp-rotate:-3deg]">{result.verdict.title}</Stamp>
            <p className="label mt-10 text-ink-soft">Rozpoznanie</p>
            <p className="mt-1 text-[clamp(2.25rem,4.8vw,3.5rem)] font-bold leading-[1] tracking-[-0.015em] [text-wrap:balance]">
              {result.diagnosis.name}
            </p>
            <p className="mt-2 text-lg italic text-ink-soft">{result.diagnosis.latin}</p>
          </div>

          <ScoreScale score={result.score} nid={nid} />
          <p className="mt-5 max-w-xl text-ink-soft">
            {typo(`Wynik wyższy niż u ${result.percentile}% badanych. Narodowy Indeks Dziaderstwa wynosi dziś ${pct(nid)}%.`)}
          </p>

          <ResultActions code={result.code} score={result.score} diagnosis={result.diagnosis.name} name={result.name} />
        </div>

        <div className="lg:col-span-5 lg:pt-2">
          <Certificate
            score={result.score}
            diagnosis={result.diagnosis.name}
            latin={result.diagnosis.latin}
            number={result.certificate}
            species={result.diagnosis.species.map((species) => species.key)}
            name={result.name || undefined}
            date={result.date}
            className="border border-ink"
          />
          <p className="label mt-6 text-center text-ink-soft">
            Nie twój wynik?{" "}
            <Link href="/test" className="link text-ink">
              Wykonaj test
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

const ZONE_FILL = ["bg-ink/[0.07]", "bg-ink/15", "bg-ink/30", "bg-red/85"];

function ScoreScale({ score, nid }: { score: number; nid: number }) {
  return (
    <figure className="mt-12 max-w-xl">
      <figcaption className="label flex justify-between text-ink-soft">
        <span>Skala dziaderstwa</span>
        <span>0–100</span>
      </figcaption>
      <div className="relative mt-14">
        <div className="flex h-3">
          {ZONES.map((zone, i) => (
            <div key={zone.label} className={cx("flex-1", ZONE_FILL[i], i > 0 && "border-l-2 border-paper")} />
          ))}
        </div>
        <Marker at={nid} label={`NID dziś ${pct(nid)}`} high className="bg-ink/60" labelClassName="text-ink-soft" />
        <Marker at={score} label={`Wynik ${score}`} className="w-[3px] bg-red" labelClassName="text-red" />
      </div>
      <div className="label mt-2.5 grid grid-cols-4 text-[0.75rem] text-ink-soft">
        {ZONES.map((zone) => (
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

function CaseDescription({ result }: { result: Result }) {
  const { verdict, diagnosis } = result;
  return (
    <Section id="opis" title={verdict.title} aside={`${result.points} z ${MAX_POINTS} pkt`} intro={typo(verdict.description)}>
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h3 className="label border-b border-ink pb-3 text-ink-soft">Zalecenia Instytutu</h3>
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
                role={diagnosis.species.length > 1 ? (i === 0 ? "Gatunek dominujący" : "Gatunek towarzyszący") : "Gatunek"}
              />
            ))
          ) : (
            <UnspecifiedNote diagnosis={diagnosis} />
          )}
        </div>
      </div>
    </Section>
  );
}

function SpeciesNote({ species, role }: { species: Species; role: string }) {
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
        <Field label="Występowanie">{typo(species.habitat)}</Field>
        <Field label="Typowe wokalizacje">
          {species.calls.map((call) => (
            <span key={call} className="block italic">
              „{call}”
            </span>
          ))}
        </Field>
        <Field label="Naturalni wrogowie">{typo(species.enemies)}</Field>
        <Field label="Rozpoznanie w terenie">{typo(species.fieldMarks)}</Field>
      </dl>
      <Link href={`/atlas/${species.slug}`} className="link mt-6 inline-block font-sans font-medium">
        Pełna karta gatunku w Atlasie
      </Link>
    </article>
  );
}

function UnspecifiedNote({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <article className="border-t border-ink pt-5">
      <p className="label text-ink-soft">Gatunek · poza Atlasem</p>
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

function Protocol({ result }: { result: Result }) {
  return (
    <Section
      id="protokol"
      title="Protokół badania"
      aside={`Formularz IBD-T1 · ${QUESTIONS.length} pytania`}
      intro={typo("Odpowiedzi, które w największym stopniu wpłynęły na rozpoznanie.")}
    >
      {result.symptoms.length > 0 ? (
        <ol className="border-t border-ink">
          {result.symptoms.map((symptom) => (
            <li
              key={symptom.number}
              className="grid gap-x-8 gap-y-2 border-b border-rule py-5 md:grid-cols-[4.5rem_minmax(0,1.25fr)_minmax(0,1fr)_4.5rem] md:items-baseline"
            >
              <span className="label text-ink-soft">Pyt. {pad(symptom.number)}</span>
              <span className="leading-snug">
                {typo(symptom.question)}
                <span className="label mt-1.5 block text-ink-faint">{symptom.section}</span>
              </span>
              <span className="text-xl italic leading-snug">{typo(symptom.answer)}</span>
              <span className="label font-semibold text-red md:text-right">+{symptom.points} pkt</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="max-w-2xl border-t border-ink pt-6 text-xl leading-relaxed">
          {typo("Nie stwierdzono objawów istotnych klinicznie. Instytut prosi o zgłoszenie się na badanie kontrolne za pięć lat.")}
        </p>
      )}
      <p className="label mt-6 text-ink-soft">
        Suma punktów: {result.points} z {MAX_POINTS}. Pełny protokół jest zapisany wyłącznie w linku do wyniku.
      </p>
    </Section>
  );
}

function Referral() {
  return (
    <section aria-labelledby="skierowanie" className="bg-ink text-paper">
      <div className="wrap flex flex-col gap-10 py-16 md:flex-row md:items-center md:py-20">
        <svg viewBox="-2 -1 56 97" className="hidden h-40 shrink-0 md:block" aria-hidden="true">
          <Figure color={PAPER} cutout={INK} right="point" />
        </svg>
        <div className="flex-1">
          <h2 id="skierowanie" className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            Zbadaj kogoś jeszcze.
          </h2>
          <p className="mt-4 max-w-xl text-paper/75">
            {typo("Wyślij test komuś, kto „nie potrzebuje instrukcji”. Albo zrób go jeszcze raz, tym razem szczerze.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/test" className="btn bg-paper text-ink hover:bg-red hover:text-paper">
            Wykonaj test <span aria-hidden="true">→</span>
          </Link>
          <Link href="/atlas" className="btn border border-paper/50 text-paper hover:bg-paper/10">
            Atlas Dziadersów
          </Link>
        </div>
      </div>
    </section>
  );
}
