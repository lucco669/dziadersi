import Link from "next/link";
import { encodeResult, evaluate, SAMPLE_DRAFT } from "@/lib/test";
import { typo } from "@/lib/typo";
import { SectionHeading, Stamp } from "./brand";
import { Certificate } from "./certificate";
import { SampleQuestion } from "./sample-question";

const STEPS = [
  "Odpowiadasz szczerze. Instytut i tak się zorientuje.",
  "Otrzymujesz wynik od 0 do 100% i rozpoznanie gatunku według Atlasu.",
  "Pobierasz certyfikat i wysyłasz go znajomym. Niech też się zbadają.",
];

const sample = evaluate(SAMPLE_DRAFT);

export function TestSection() {
  return (
    <section id="test" aria-labelledby="test-title" className="mt-20 scroll-mt-20 bg-green text-paper md:mt-28">
      <div className="wrap py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHeading
              inverted
              id="test-title"
              number="01"
              kicker="Laboratorium"
              aside="Formularz IBD-T1"
              title="Test Dziadersa"
              dek={typo(
                "Badanie przesiewowe w dwudziestu czterech pytaniach z życia codziennego. Około trzech minut. Na końcu wynik, rozpoznanie gatunku i certyfikat, który można pokazać rodzinie. Albo lepiej nie.",
              )}
            />

            <ol className="mt-10 border-t border-paper/25">
              {STEPS.map((step, i) => (
                <li key={step} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-paper/25 py-4">
                  <span className="kicker pt-1.5 text-paper/55">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg leading-snug">{typo(step)}</span>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-5">
              <Link href="/test" className="btn bg-paper text-green hover:bg-paper-light">
                Rozpocznij badanie <span aria-hidden="true">→</span>
              </Link>
              <Stamp tone="paper" className="-rotate-3">
                Laboratorium czynne
              </Stamp>
            </div>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-snug text-paper/75">
              {typo("Badanie jest bezpłatne i nie wymaga skierowania. Rodzina nie musi o nim wiedzieć.")}
            </p>
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <Certificate
              sample
              score={sample.score}
              diagnosis={sample.diagnosis.name}
              latin={sample.diagnosis.latin}
              number={sample.certificate}
            />
            <p className="kicker mt-10 text-center text-paper/60">
              <Link href={`/wynik/${encodeResult(SAMPLE_DRAFT)}`} className="border-b border-paper/40 pb-0.5 hover:text-paper">
                Zobacz przykładowy wynik
              </Link>
            </p>
          </div>
        </div>

        <SampleQuestion />
      </div>
    </section>
  );
}
