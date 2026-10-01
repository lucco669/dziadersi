import { cx, typo } from "@/lib/typo";
import { Seal, Stamp } from "./brand";

export type CertificateProps = {
  score: number;
  diagnosis: string;
  latin: string;
  number: string;
  name?: string;
  date?: string;
  /** Marks the certificate as a specimen. */
  sample?: boolean;
  className?: string;
};

export function Certificate({ score, diagnosis, latin, number, name, date, sample, className }: CertificateProps) {
  return (
    <figure
      className={cx(
        "relative mx-auto w-full max-w-xl -rotate-[1.25deg] bg-paper-light p-2.5 text-ink shadow-[0_40px_60px_-35px_rgba(0,0,0,0.55)] md:p-3",
        className,
      )}
    >
      <div className="border border-ink p-1">
        <div className="border-2 border-ink px-5 pb-7 pt-6 text-center md:px-10 md:pb-8">
          <div className="kicker flex justify-between gap-4 text-left text-[0.6rem] text-ink-faint">
            <span>IBD · Pracownia Diagnostyczna</span>
            <span className="whitespace-nowrap">Nr {number}</span>
          </div>

          <p className="mt-9 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-none tracking-[-0.02em]">
            Certyfikat Dziaderstwa
          </p>
          <p className="mx-auto mt-5 max-w-sm text-[0.98rem] leading-relaxed text-ink-soft">
            {typo("Niniejszym zaświadcza się, że osoba badana")}
            {name ? (
              <span className="my-1 block font-display text-[1.9rem] italic leading-tight text-green">{name}</span>
            ) : (
              " "
            )}
            {typo("uzyskała w Teście Dziadersa")} <span className="whitespace-nowrap">IBD-T1 wynik</span>
          </p>
          <div className="relative">
            <p className="mt-3 font-display text-[clamp(4.75rem,11vw,7.25rem)] font-black leading-none tracking-[-0.045em] tabular-nums">
              {score}%
            </p>
            {sample && (
              <Stamp className="absolute -right-3 top-1/2 -translate-y-1/2 rotate-[-14deg] bg-paper-light/60 text-sm md:right-0">
                Wzór
              </Stamp>
            )}
          </div>

          <p className="kicker mt-6 text-ink-faint">Rozpoznanie</p>
          <p className="mt-2 text-balance font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.01em]">
            {diagnosis}
          </p>
          <p className="mt-1 text-ink-soft">
            <em>{latin}</em>
          </p>

          <div className="mt-9 flex items-end justify-between gap-6 text-left">
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

          {date && (
            <p className="kicker mt-7 flex justify-between gap-4 border-t border-rule pt-3 text-left text-[0.6rem] text-ink-faint">
              <span>Data badania: {date}</span>
              <span>dziader.si</span>
            </p>
          )}
        </div>
      </div>

      <figcaption className="sr-only">
        {`Certyfikat Dziaderstwa${name ? ` dla: ${name}` : ""}. Wynik ${score}%, rozpoznanie: ${diagnosis}.`}
      </figcaption>
    </figure>
  );
}
