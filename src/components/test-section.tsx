import { typo } from "@/lib/typo";
import { SectionHeading, Seal, Stamp } from "./brand";
import { SampleQuestion } from "./sample-question";

const STEPS = [
  "Odpowiadasz szczerze. Instytut i tak się zorientuje.",
  "Otrzymujesz wynik od 0 do 100% i rozpoznanie gatunku według Atlasu.",
  "Pobierasz certyfikat i wysyłasz go znajomym. Niech też się zbadają.",
];

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

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Stamp tone="paper" className="-rotate-3">
                Otwarcie wkrótce
              </Stamp>
              <p className="max-w-xs text-[0.95rem] leading-snug text-paper/75">
                {typo("Laboratorium jest w przygotowaniu. Do tego czasu zapraszamy na pytanie próbne poniżej.")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <Certificate />
          </div>
        </div>

        <SampleQuestion />
      </div>
    </section>
  );
}

function Certificate() {
  return (
    <figure className="relative mx-auto max-w-xl -rotate-[1.25deg] bg-paper-light p-2.5 text-ink shadow-[0_40px_60px_-35px_rgba(0,0,0,0.65)] md:p-3">
      <div className="border border-ink p-1">
        <div className="border-2 border-ink px-5 pb-8 pt-6 text-center md:px-10 md:pb-10">
          <div className="kicker flex justify-between gap-4 text-left text-[0.6rem] text-ink-faint">
            <span>IBD · Pracownia Diagnostyczna</span>
            <span>Nr 000412</span>
          </div>

          <p className="mt-9 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-none tracking-[-0.02em]">
            Certyfikat Dziaderstwa
          </p>
          <p className="mx-auto mt-5 max-w-sm text-[0.98rem] leading-relaxed text-ink-soft">
            {typo("Niniejszym zaświadcza się, że osoba badana uzyskała w Teście Dziadersa IBD-T1 wynik")}
          </p>
          <p className="mt-3 font-display text-[clamp(4.75rem,11vw,7.25rem)] font-black leading-none tracking-[-0.045em] tabular-nums">
            82%
          </p>

          <p className="kicker mt-6 text-ink-faint">Rozpoznanie</p>
          <p className="mt-2 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.01em]">
            Dziaders Grillowo-Motoryzacyjny
          </p>
          <p className="mt-1 text-ink-soft">
            <em>Dziadersus grillensis × automobilis</em>
          </p>

          <div className="mt-10 flex items-end justify-between gap-6 text-left">
            <Seal className="size-24 shrink-0 rotate-[-10deg] text-bordo md:size-28" />
            <div className="w-full max-w-[13rem]">
              <p className="font-display text-2xl italic leading-none text-green">Z. Wąsik</p>
              <p className="kicker mt-2 border-t border-ink pt-2 text-[0.58rem] leading-relaxed text-ink-soft">
                dr hab. Zenon Wąsik
                <br />
                Kierownik Pracowni Diagnostycznej
              </p>
            </div>
          </div>
        </div>
      </div>

      <Stamp className="absolute right-5 top-[5.5rem] rotate-[-14deg] text-sm md:right-8">Wzór</Stamp>
      <figcaption className="sr-only">
        Przykładowy certyfikat: wynik 82%, rozpoznanie Dziaders Grillowo-Motoryzacyjny.
      </figcaption>
    </figure>
  );
}
