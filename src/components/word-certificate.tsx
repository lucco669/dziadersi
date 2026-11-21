import { SpeciesPlate } from "@/components/pictograms";
import type { Entry } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { siteCopy } from "@/lib/site";
import { cx, quote, typo } from "@/lib/typo";
import { Seal } from "./brand";

const COPY = defineCopy({
  pl: {
    number: (year: number) => `Uchwała nr KO/${year}/1`,
    title: (year: number) => `Dziaderskie Słowo Roku ${year}`,
    announces: "Komisja Orzekająca Instytutu ogłasza, że dziaderskim słowem roku został zwrot",
    signed: "Za Komisję Orzekającą",
    office: "Sekretariat Komisji",
  },
  sl: {
    number: (year: number) => `Sklep št. KO/${year}/1`,
    title: (year: number) => `Dziaderska beseda leta ${year}`,
    announces: "Razsodna komisija Inštituta razglaša, da je dziaderska beseda leta izraz",
    signed: "Za Razsodno komisijo",
    office: "Tajništvo Komisije",
  },
});

/** The announcement as a document: the red stripe of a certificate with distinction, the phrase and the seal. */
export function WordCertificate({
  locale,
  year,
  entry,
  verdict,
  date,
  className,
}: {
  locale: Locale;
  year: number;
  entry: Entry;
  /** One line under the phrase: how the Komisja decided ("n = 212, 34% głosów"). */
  verdict: string;
  date: string;
  className?: string;
}) {
  const t = COPY[locale];
  return (
    <figure className={cx("relative mx-auto w-full max-w-[34rem] overflow-hidden bg-[#fbf8f1] p-2 text-ink", className)}>
      <div aria-hidden="true" className="absolute -left-20 top-4 h-6 w-56 -rotate-45 bg-red md:-left-16 md:top-12 md:h-7" />
      <div className="relative border border-ink px-6 pb-6 pt-6 text-center md:px-10 md:pb-8">
        <p className="label text-[0.75rem] text-ink-soft">
          {siteCopy(locale).institute} <span className="block sm:inline">· {t.number(year)}</span>
        </p>
        <p className="mt-7 text-balance text-[clamp(1.85rem,4vw,2.4rem)] font-bold leading-none tracking-[-0.01em]">{t.title(year)}</p>
        <p className="mx-auto mt-4 max-w-sm text-[1rem] italic leading-relaxed text-ink-soft">{typo(t.announces)}</p>
        <p className="mx-auto mt-3 max-w-md text-balance text-[clamp(2.3rem,7vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.02em]">
          {quote(entry.headword, locale)}
        </p>
        {entry.original && <p className="mt-1 italic text-ink-soft">{quote(entry.original, "pl")}</p>}
        <p className="mx-auto mt-4 max-w-sm leading-snug">{typo(entry.senses[0].text)}</p>
        {entry.species && (
          <div className="mt-4 flex justify-center">
            <SpeciesPlate locale={locale} species={entry.species} sizes="160px" className="h-24 md:h-28" />
          </div>
        )}
        <p className="label mt-4 text-red">{verdict}</p>

        <div className="mt-8 flex items-end justify-between gap-6 text-left">
          <Seal locale={locale} className="size-24 shrink-0 rotate-[-10deg] text-red md:size-28" />
          <div className="w-full max-w-[13rem]">
            <p className="text-[1.35rem] italic leading-none">{t.signed}</p>
            <p className="label mt-2 border-t border-ink pt-2 text-[0.72rem] leading-snug text-ink-soft">
              {t.office}
              <br />
              {date}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
