import type { SpeciesKey } from "@/content/species";
import { cx, typo } from "@/lib/typo";
import { Seal, Stamp } from "./brand";
import { Figure, SpeciesPlate } from "./pictograms";

export type CertificateProps = {
  score: number;
  diagnosis: string;
  latin: string;
  number: string;
  /** The diagnosed species (two for a hybrid), drawn on the certificate; none for an unspecified diagnosis. */
  species: SpeciesKey[];
  name?: string;
  date?: string;
  /** Marks the certificate as a specimen. */
  sample?: boolean;
  className?: string;
};

/** The certificate, with the red stripe of a Polish school certificate awarded with distinction. */
export function Certificate({ score, diagnosis, latin, number, species, name, date, sample, className }: CertificateProps) {
  return (
    <figure className={cx("relative mx-auto w-full max-w-[34rem] overflow-hidden bg-[#fbf8f1] p-2 text-ink", className)}>
      <div aria-hidden="true" className="absolute -left-20 top-4 h-6 w-56 -rotate-45 bg-red md:-left-16 md:top-12 md:h-7" />
      <div className="relative border border-ink px-6 pb-6 pt-6 text-center md:px-10 md:pb-8">
        <p className="label text-[0.75rem] text-ink-soft">
          Instytut Badań nad Dziaderstwem <span className="block sm:inline">· Nr {number}</span>
        </p>

        <p className="mt-7 text-[clamp(1.85rem,4vw,2.5rem)] font-bold leading-none tracking-[-0.01em]">Certyfikat Dziaderstwa</p>
        <p className="mx-auto mt-4 max-w-sm text-[1rem] italic leading-relaxed text-ink-soft">
          {typo("Niniejszym zaświadcza się, że osoba badana")}
          {name ? <span className="my-1 block text-[1.75rem] not-italic font-bold leading-tight text-ink">{name}</span> : " "}
          {typo("uzyskała w Teście Dziadersa wynik")}
        </p>

        <div className="relative">
          <p className="mt-1 text-[clamp(4.5rem,11vw,6.75rem)] font-bold leading-none tracking-[-0.03em] tabular-nums">{score}%</p>
          {sample && (
            <Stamp className="absolute right-0 top-1/2 -translate-y-1/2 rotate-[-12deg] bg-[#fbf8f1]/70">Wzór</Stamp>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {species.length > 0 ? (
            species.map((key) => (
              <SpeciesPlate key={key} species={key} className={species.length > 1 ? "h-20 md:h-24" : "h-24 md:h-28"} />
            ))
          ) : (
            <svg viewBox="-40 0 120 100" className="h-24 md:h-28" aria-hidden="true">
              <Figure />
            </svg>
          )}
        </div>

        <p className="label mt-4 text-ink-soft">Rozpoznanie</p>
        <p className="mt-1 text-balance text-[1.5rem] font-bold leading-tight">{diagnosis}</p>
        <p className="mt-0.5 italic text-ink-soft">{latin}</p>

        <div className="mt-8 flex items-end justify-between gap-6 text-left">
          <Seal className="size-24 shrink-0 rotate-[-10deg] text-red md:size-28" />
          <div className="w-full max-w-[13rem]">
            <p className="text-[1.6rem] italic leading-none">Z. Wąsik</p>
            <p className="label mt-2 border-t border-ink pt-2 text-[0.72rem] leading-snug text-ink-soft">
              dr hab. Zenon Wąsik
              <br />
              Kierownik Pracowni Diagnostycznej
            </p>
          </div>
        </div>

        {date && (
          <p className="label mt-6 flex justify-between gap-4 border-t border-rule pt-3 text-left text-[0.75rem] text-ink-soft">
            <span>Data badania: {date}</span>
            <span>dziader.si</span>
          </p>
        )}
      </div>

      <figcaption className="sr-only">
        {`Certyfikat Dziaderstwa${name ? ` dla: ${name}` : ""}. Wynik ${score}%, rozpoznanie: ${diagnosis}.`}
      </figcaption>
    </figure>
  );
}
