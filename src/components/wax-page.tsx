import { CASTS, getWax } from "@/content/wax";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { site } from "@/lib/site";
import { quote, typo } from "@/lib/typo";
import { waxTable, type Reading } from "@/lib/wax";
import { PageHeader, type Crumb } from "./page";
import { SpeciesPlate } from "./pictograms";
import { ShareBar } from "./share-bar";
import { StoryShare } from "./story-share";

/* The parts the Lanie wosku page and a reading's page share: the header, the table, the protocol. */

export const WAX_COPY = defineCopy({
  pl: {
    title: "Lanie wosku",
    browserTitle: "Lanie wosku online: andrzejkowa wróżba z wosku",
    description:
      "Andrzejkowe lanie wosku w Pracowni Wróżb Instytutu: wosk przez ucho klucza, cień na ścianie i odczyt. W jaki gatunek dziadersa przejdziesz w nowym roku i co powiesz pierwsze.",
    shareDescription: "Wosk przez ucho klucza, cień na ścianie. Pracownia Wróżb odczyta, w jaki gatunek przejdziesz w nowym roku.",
    lead: (year: number) =>
      `Pracownia Wróżb leje wosk metodą andrzejkową: przez ucho klucza, do zimnej wody. Odczytuje się cień odlewu na ścianie. Pokazuje on, w jaki gatunek przejdziesz w ${year} roku, co cię czeka i co powiesz pierwsze.`,
    meta: (casts: number) => `Pracownia Wróżb · ${casts} odlewów w katalogu · odczyt na miejscu`,
    resultMeta: (number: number, casts: number, code: string) => `Protokół odczytu ${code} · odlew nr ${number} z ${casts}`,
    resultCrumb: (number: number) => `Odlew nr ${number}`,
    notes: [] as string[],
    protocol: "Protokół odczytu",
    protocolAside: (code: string) => `Nr ${code}`,
    shape: "Kształt cienia",
    reading: "Odczyt Pracowni",
    species: (year: number) => `Gatunek na rok ${year}`,
    prophecy: "Wróżba",
    first: "Pierwsze słowa w nowym gatunku",
    atlas: "Opis gatunku w Atlasie",
    dictionary: "Hasło w Słowniku",
    signed: "Odczytu dokonała Pracownia Wróżb IBD. Odlew zwraca się do pudełka po świecach, a wosk wykorzystuje ponownie za rok.",
    shareText: (shape: string, species: string, year: number) => `Mój cień z wosku: ${shape}. W ${year} roku przechodzę w gatunek: ${species}.`,
  },
  sl: {
    title: "Vlivanje voska",
    browserTitle: "Vlivanje voska na spletu: silvestrsko vedeževanje",
    description:
      "Silvestrsko vlivanje voska v Laboratoriju za vedeževanje: vosek skozi ušesce ključa, senca na steni in branje. V katero vrsto dziadersa se preleviš v novem letu in kaj rečeš najprej.",
    shareDescription: "Vosek skozi ušesce ključa, senca na steni. Laboratorij za vedeževanje prebere, v katero vrsto se preleviš v novem letu.",
    lead: (year: number) =>
      `Na silvestrovo Laboratorij za vedeževanje vliva vosek po poljskem andrejevem običaju:¹ skozi ušesce ključa v mrzlo vodo. Bere se senca odlitka na steni. Pokaže, v katero vrsto se preleviš v letu ${year}, kaj te čaka in kaj rečeš najprej.`,
    meta: (casts: number) => `Laboratorij za vedeževanje · ${casts} odlitkov v katalogu · branje na kraju samem`,
    resultMeta: (number: number, casts: number, code: string) => `Zapisnik branja ${code} · odlitek št. ${number} od ${casts}`,
    resultCrumb: (number: number) => `Odlitek št. ${number}`,
    notes: [
      "¹ Andrzejki: andrejev večer, 29. novembra, na Poljskem večer vedeževanja. Najbolj znano opravilo je vlivanje voska skozi ključ, ki ga mladi tam izvajajo še danes. Slovenski bralec isto opravilo pozna s silvestrovega, ko se v vodo vliva svinec ali vosek, zato ga Inštitut v slovenski izdaji izvaja ob koncu leta.",
    ],
    protocol: "Zapisnik branja",
    protocolAside: (code: string) => `Št. ${code}`,
    shape: "Oblika sence",
    reading: "Branje Laboratorija",
    species: (year: number) => `Vrsta za leto ${year}`,
    prophecy: "Napoved",
    first: "Prve besede v novi vrsti",
    atlas: "Opis vrste v Atlasu",
    dictionary: "Geslo v slovarju",
    signed: "Branje je opravil Laboratorij za vedeževanje IBD. Odlitek se vrne v škatlo za sveče, vosek pa se znova uporabi čez leto dni.",
    shareText: (shape: string, species: string, year: number) => `Moja senca iz voska: ${shape}. V letu ${year} se prelevim v vrsto: ${species}.`,
  },
});

/** What the browser pours with: the code table and the shapes, in the edition's language. */
export const waxTableFor = (locale: Locale) => ({ ...waxTable(), shapes: getWax(locale).CASTS.map((cast) => cast.shape) });

/** The same header on both pages, so the stage stays in place when a reading opens. */
export function WaxHeader({ locale, crumbs, year, meta }: { locale: Locale; crumbs: Crumb[]; year: number; meta: string }) {
  const t = WAX_COPY[locale];
  return <PageHeader crumbs={crumbs} title={t.title} lead={typo(t.lead(year))} meta={meta} />;
}

export const castCount = CASTS.length;

/** The Pracownia's protocol of a reading, under the wall. */
export function WaxProtocol({ reading, locale }: { reading: Reading; locale: Locale }) {
  const t = WAX_COPY[locale];
  const path = `/lanie-wosku/${reading.code}`;
  const rows: [string, React.ReactNode][] = [
    [t.shape, <span key="shape" className="text-[1.35rem] font-bold leading-tight">{reading.cast.shape}</span>],
    [t.reading, <span key="reading" className="text-[1.15rem] leading-snug">{typo(reading.cast.reading)}</span>],
    [t.prophecy, <span key="prophecy" className="text-[1.25rem] italic leading-snug">{typo(reading.prophecy)}</span>],
    [
      t.first,
      <span key="first">
        <Link href={`/slownik/${reading.entry.slug}`} className="text-[1.35rem] font-bold leading-tight hover:text-red">
          {quote(reading.entry.headword, locale)}
        </Link>
        <span className="mt-1 block leading-snug text-ink-soft">{typo(reading.entry.senses[0].text)}</span>
      </span>,
    ],
  ];
  return (
    <section aria-labelledby="protokol" className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-ink pt-5">
        <h2 id="protokol" className="text-[clamp(1.85rem,3.4vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.015em]">
          {t.protocol}
        </h2>
        <p className="label text-ink-soft">{t.protocolAside(reading.code)}</p>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label text-red">{t.species(reading.year)}</p>
          <Link href={`/atlas/${reading.species.slug}`} className="group mt-2 block">
            <SpeciesPlate locale={locale} species={reading.species.key} className="w-full max-w-[18rem]" sizes="(max-width: 1023px) 70vw, 18rem" />
            <span className="mt-3 block text-[clamp(1.8rem,3vw,2.4rem)] font-bold leading-none group-hover:text-red">{reading.species.name}</span>
            <span className="mt-2 block leading-snug text-ink-soft">{typo(reading.species.teaser)}</span>
          </Link>
          <Link href={`/atlas/${reading.species.slug}`} className="link label mt-3 inline-block">
            {t.atlas} →
          </Link>
        </div>
        <dl className="lg:col-span-8">
          {rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 border-b border-rule py-4 first:pt-0 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="label pt-1 text-ink-soft">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          <p className="label mt-5 text-ink-faint">{typo(t.signed)}</p>
          <div className="mt-8 space-y-3">
            <ShareBar path={path} text={t.shareText(reading.cast.shape, reading.species.name, reading.year)} kind="wosk" />
            <StoryShare
              image={`${path}/karta`}
              file={`${locale === "sl" ? "vlivanje-voska" : "lanie-wosku"}-${reading.code}`}
              text={t.shareText(reading.cast.shape, reading.species.name, reading.year)}
              url={`${site.url}${localizePath(path, locale)}`}
              kind="wosk"
            />
          </div>
        </dl>
      </div>
    </section>
  );
}
