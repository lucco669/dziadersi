import type { ExamResult } from "@/lib/exam";
import { cx, typo } from "@/lib/typo";
import { Seal, Stamp } from "./brand";
import { Figure } from "./pictograms";

/**
 * Zaświadczenie o zdaniu egzaminu terenowego. Grades five and six get the red stripe,
 * as a Polish school certificate does for a distinction.
 */
export function ExamCertificate({ result, sample, className }: { result: ExamResult; sample?: boolean; className?: string }) {
  const distinction = result.grade.value >= 5;
  return (
    <figure className={cx("relative mx-auto w-full max-w-[34rem] overflow-hidden bg-card p-2 text-ink", className)}>
      {distinction && <div aria-hidden="true" className="absolute -left-20 top-4 h-6 w-56 -rotate-45 bg-red md:-left-16 md:top-12 md:h-7" />}
      <div className="relative border border-ink px-6 pb-6 pt-6 text-center md:px-10 md:pb-8">
        <p className="label text-[0.75rem] text-ink-soft">
          Instytut Badań nad Dziaderstwem <span className="block sm:inline">· Protokół {result.number}</span>
        </p>
        <p className="mt-7 text-[clamp(1.7rem,3.6vw,2.3rem)] font-bold leading-none tracking-[-0.01em]">Zaświadczenie</p>
        <p className="mx-auto mt-4 max-w-sm italic leading-relaxed text-ink-soft">
          {typo("o zdaniu egzaminu terenowego z oznaczania gatunków dziadersów występujących w Polsce, ze stopniem")}
        </p>
        <div className="relative mt-3 flex items-center justify-center gap-5">
          <span className="text-[clamp(5rem,12vw,7rem)] font-bold leading-none tabular-nums">{result.grade.value}</span>
          <span className="text-left">
            <span className="block text-[1.6rem] font-bold leading-tight">{result.grade.name}</span>
            <span className="label block text-ink-soft">{result.points} z 12 oznaczeń poprawnych</span>
          </span>
          {sample && <Stamp className="absolute right-0 top-1/2 -translate-y-1/2 rotate-[-12deg] bg-card/70">Wzór</Stamp>}
        </div>
        <p className="label mt-6 text-ink-soft">Uprawnienia</p>
        <p className="mt-1 text-balance text-[1.45rem] font-bold leading-tight">{result.grade.title}</p>
        <div className="mt-8 flex items-end justify-between gap-6 text-left">
          <Seal className="size-24 shrink-0 rotate-[-10deg] text-red md:size-28" />
          <svg viewBox="-4 -1 48 97" className="h-24 shrink-0" aria-hidden="true">
            <Figure right="point" glasses="eyes" hat="bucket" />
          </svg>
          <div className="w-full max-w-[11rem]">
            <p className="text-[1.4rem] italic leading-none">podpis nieczytelny</p>
            <p className="label mt-2 border-t border-ink pt-2 text-[0.72rem] leading-snug text-ink-soft">
              Przewodniczący Komisji
              <br />
              Egzaminacyjnej IBD
            </p>
          </div>
        </div>
        <p className="label mt-6 flex justify-between gap-4 border-t border-rule pt-3 text-left text-[0.75rem] text-ink-soft">
          <span>Data egzaminu: {result.date}</span>
          <span>dziader.si</span>
        </p>
      </div>
      <figcaption className="sr-only">{`Zaświadczenie o zdaniu egzaminu terenowego: stopień ${result.grade.name}, ${result.points} z 12.`}</figcaption>
    </figure>
  );
}
