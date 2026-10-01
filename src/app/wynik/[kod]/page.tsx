import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { SectionHeading, Stamp } from "@/components/brand";
import { Certificate } from "@/components/certificate";
import { ResultActions } from "@/components/result-actions";
import type { Species } from "@/content/species";
import { QUESTIONS } from "@/content/test";
import { getBulletin } from "@/lib/bulletin";
import { ZONES } from "@/lib/indeks";
import { site } from "@/lib/site";
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
  const description = `${result.name ? `Osoba badana: ${result.name}. ` : ""}${result.verdict.title}, rozpoznanie: ${result.diagnosis.name}. Test Dziadersa w Instytucie Badań nad Dziaderstwem. Zbadaj się, zanim będzie za późno.`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `/wynik/${result.code}` },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: site.name,
      url: `/wynik/${result.code}`,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
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
    <section className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
      <p className="kicker flex flex-wrap justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
        <span>
          Wynik badania <span className="mx-1.5 opacity-50">/</span> Formularz IBD-T1
        </span>
        <span className="text-ink-faint">
          Certyfikat nr {result.certificate} · {result.date}
        </span>
      </p>

      <div className="mt-10 grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <h1 className="sr-only">
            {`Wynik Testu Dziadersa: ${result.score}%. ${result.verdict.title}. Rozpoznanie: ${result.diagnosis.name}.`}
          </h1>
          <div aria-hidden="true">
            <p className="kicker text-ink-faint">
              Osoba badana{result.name && <span className="text-ink">: {result.name}</span>}
            </p>
            <p className="mt-3 font-display text-[clamp(7.5rem,24vw,15rem)] font-black leading-[0.8] tracking-[-0.05em] tabular-nums">
              {result.score}
              <span className="ml-1 align-top text-[0.36em] tracking-normal">%</span>
            </p>
            <Stamp className="mt-8 animate-stamp text-sm [--stamp-rotate:-3deg] md:text-base">{result.verdict.title}</Stamp>
            <p className="kicker mt-10 text-ink-faint">Rozpoznanie</p>
            <p className="mt-2 font-display text-[clamp(2.25rem,4.8vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.025em] [text-wrap:balance]">
              {result.diagnosis.name}
            </p>
            <p className="mt-3 text-lg">
              <em>{result.diagnosis.latin}</em>
            </p>
          </div>

          <ScoreScale score={result.score} nid={nid} />
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            {typo(
              `Wynik wyższy niż u ${result.percentile}% badanych. Narodowy Indeks Dziaderstwa wynosi dziś ${pct(nid)}%.`,
            )}
          </p>

          <ResultActions code={result.code} score={result.score} diagnosis={result.diagnosis.name} name={result.name} />
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <Certificate
            score={result.score}
            diagnosis={result.diagnosis.name}
            latin={result.diagnosis.latin}
            number={result.certificate}
            name={result.name || undefined}
            date={result.date}
          />
          <p className="kicker mt-10 text-center text-ink-faint">
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

const ZONE_FILL = ["bg-ink/[0.07]", "bg-ink/15", "bg-ink/30", "bg-bordo/85"];

function ScoreScale({ score, nid }: { score: number; nid: number }) {
  return (
    <figure className="mt-12 max-w-xl">
      <figcaption className="kicker flex justify-between text-ink-faint">
        <span>Skala dziaderstwa</span>
        <span>0–100</span>
      </figcaption>
      <div className="relative mt-14">
        <div className="flex h-3">
          {ZONES.map((zone, i) => (
            <div key={zone.label} className={cx("flex-1", ZONE_FILL[i], i > 0 && "border-l-2 border-paper")} />
          ))}
        </div>
        <Marker at={nid} label={`NID dziś ${pct(nid)}`} high className="bg-ink/60" labelClassName="text-ink-faint" />
        <Marker at={score} label={`Wynik ${score}`} className="w-[3px] bg-bordo" labelClassName="text-bordo" />
      </div>
      <div className="kicker mt-2.5 grid grid-cols-4 text-[0.6rem] tracking-[0.04em] text-ink-faint">
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
      <span className={cx("kicker absolute bottom-full mb-1 whitespace-nowrap text-[0.6rem]", align, labelClassName)}>
        {label}
      </span>
      <span className={cx("absolute inset-y-0 w-0.5 -translate-x-1/2", className)} />
    </div>
  );
}

function CaseDescription({ result }: { result: Result }) {
  const { verdict, diagnosis } = result;
  return (
    <section aria-labelledby="opis" className="border-y border-ink bg-paper-deep/70">
      <div className="wrap py-20 md:py-28">
        <SectionHeading
          id="opis"
          number="02"
          kicker="Opis przypadku"
          aside={`${result.points} z ${MAX_POINTS} pkt`}
          title={verdict.title}
          dek={typo(verdict.description)}
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h3 className="kicker border-b-2 border-ink pb-3">Zalecenia Instytutu</h3>
            <ol>
              {verdict.recommendations.map((recommendation, i) => (
                <li key={recommendation} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-4 text-lg leading-snug">
                  <span className="kicker pt-1.5 text-ink-faint">{pad(i + 1)}</span>
                  {typo(recommendation)}
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-8 lg:col-span-7">
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
      </div>
    </section>
  );
}

function SpeciesNote({ species, role }: { species: Species; role: string }) {
  return (
    <article aria-labelledby={`gatunek-${species.key}`} className="border border-ink bg-paper-light">
      <header className="kicker flex justify-between gap-4 border-b border-ink px-5 py-3 md:px-7">
        <span>{role}</span>
        <span className="text-ink-faint">
          {species.code} · {species.status}
        </span>
      </header>
      <div className="px-5 py-6 md:px-7 md:py-7">
        <h3 id={`gatunek-${species.key}`} className="font-display text-[1.9rem] font-bold leading-tight tracking-[-0.02em]">
          {species.name}
        </h3>
        <p className="mt-1 text-ink-soft">
          <em>{species.latin}</em> ({species.authority})
        </p>
        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Field label="Występowanie">{typo(species.habitat)}</Field>
          <Field label="Typowe wokalizacje">
            {species.calls.map((call) => (
              <span key={call} className="block font-display italic">
                „{call}”
              </span>
            ))}
          </Field>
          <Field label="Naturalni wrogowie">{typo(species.enemies)}</Field>
          <Field label="Rozpoznanie w terenie">{typo(species.fieldMarks)}</Field>
        </dl>
        <p className="kicker mt-7">
          <Link href={`/atlas/${species.slug}`} className="link">
            Pełna karta gatunku →
          </Link>
        </p>
      </div>
    </article>
  );
}

function UnspecifiedNote({ diagnosis }: { diagnosis: Diagnosis }) {
  return (
    <article className="border border-ink bg-paper-light">
      <header className="kicker flex justify-between gap-4 border-b border-ink px-5 py-3 md:px-7">
        <span>Gatunek</span>
        <span className="text-ink-faint">Poza Atlasem</span>
      </header>
      <div className="px-5 py-6 md:px-7 md:py-7">
        <h3 className="font-display text-[1.9rem] font-bold leading-tight tracking-[-0.02em]">{diagnosis.name}</h3>
        <p className="mt-1 text-ink-soft">
          <em>{diagnosis.latin}</em> ({diagnosis.authority})
        </p>
        <p className="mt-5 text-lg leading-relaxed">{typo(diagnosis.description ?? "")}</p>
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-rule pt-3">
      <dt className="kicker text-ink-faint">{label}</dt>
      <dd className="mt-1.5 leading-relaxed">{children}</dd>
    </div>
  );
}

function Protocol({ result }: { result: Result }) {
  return (
    <section aria-labelledby="protokol" className="wrap py-20 md:py-28">
      <SectionHeading
        id="protokol"
        number="03"
        kicker="Dokumentacja"
        aside={`Formularz IBD-T1 · ${QUESTIONS.length} pytania`}
        title="Protokół badania"
        dek={typo("Odpowiedzi, które w największym stopniu wpłynęły na rozpoznanie.")}
      />
      {result.symptoms.length > 0 ? (
        <ol className="mt-14 border-t border-ink">
          {result.symptoms.map((symptom) => (
            <li
              key={symptom.number}
              className="grid gap-x-8 gap-y-2 border-b border-rule py-5 md:grid-cols-[4.5rem_minmax(0,1.25fr)_minmax(0,1fr)_4.5rem] md:items-baseline"
            >
              <span className="kicker text-ink-faint">Pyt. {pad(symptom.number)}</span>
              <span className="text-lg leading-snug">
                {typo(symptom.question)}
                <span className="kicker mt-1.5 block text-ink-faint">{symptom.section}</span>
              </span>
              <span className="font-display text-xl italic leading-snug text-green">{typo(symptom.answer)}</span>
              <span className="kicker text-bordo md:text-right">+{symptom.points} pkt</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-14 max-w-2xl border-t border-ink pt-6 text-xl leading-relaxed">
          {typo("Nie stwierdzono objawów istotnych klinicznie. Instytut prosi o zgłoszenie się na badanie kontrolne za pięć lat.")}
        </p>
      )}
      <p className="kicker mt-6 text-ink-faint">
        Suma punktów: {result.points} z {MAX_POINTS}. Pełny protokół jest zapisany wyłącznie w linku do wyniku.
      </p>
    </section>
  );
}

function Referral() {
  return (
    <section aria-labelledby="skierowanie" className="bg-green text-paper">
      <div className="wrap grid gap-10 py-20 md:py-24 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="kicker text-paper/70">
            § 04 <span className="mx-1.5 opacity-50">/</span> Skierowanie
          </p>
          <h2
            id="skierowanie"
            className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.92] tracking-[-0.03em]"
          >
            Zbadaj kogoś jeszcze.
          </h2>
          <p className="mt-5 max-w-xl text-xl leading-relaxed text-paper/80">
            {typo("Wyślij test komuś, kto „nie potrzebuje instrukcji”. Albo zrób go jeszcze raz, tym razem szczerze.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <Link href="/test" className="btn bg-paper text-green hover:bg-paper-light">
            Wykonaj test <span aria-hidden="true">→</span>
          </Link>
          <Link href="/atlas" className="btn border border-paper/60 text-paper hover:bg-paper/10">
            Atlas Dziadersów
          </Link>
        </div>
      </div>
    </section>
  );
}
