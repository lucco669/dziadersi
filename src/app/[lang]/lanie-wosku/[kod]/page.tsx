import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestPromo, TranslatorNotes } from "@/components/page";
import { castCount, WAX_COPY, WaxHeader, WaxProtocol, waxTableFor } from "@/components/wax-page";
import { WaxReading } from "@/components/wax-reading";
import { CASTS } from "@/content/wax";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";
import { decodeReading, sampleReading } from "@/lib/wax";

const COPY = defineCopy({
  pl: {
    metaTitle: (shape: string, species: string) => `Lanie wosku: ${shape}, ${species}`,
    description: (shape: string, species: string, year: number, prophecy: string) => `Cień odlewu: ${shape}. Gatunek na rok ${year}: ${species}. ${prophecy}`,
    promoTitle: "Wosk wskazał gatunek. Badanie go potwierdzi.",
    promoText: "Cień pokazuje, co cię czeka. Test Dziadersa mierzy, co już się stało. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    metaTitle: (shape: string, species: string) => `Vlivanje voska: ${shape}, ${species}`,
    description: (shape: string, species: string, year: number, prophecy: string) => `Senca odlitka: ${shape}. Vrsta za leto ${year}: ${species}. ${prophecy}`,
    promoTitle: "Vosek je pokazal vrsto. Pregled jo bo potrdil.",
    promoText: "Senca pokaže, kaj te čaka. Test dziadersa izmeri, kar se je že zgodilo. Pet ordinacij, štiri minute.",
  },
});

// A reading renders in one pass: the code holds the cast, the species, the prophecy and the words.
export const instant = false;

// One reading per cast is prerendered (the catalogue links to them); other codes render on first visit.
export function generateStaticParams() {
  return CASTS.map((_, i) => ({ kod: sampleReading(i, "pl").code }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/lanie-wosku/[kod]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const reading = decodeReading((await params).kod, locale);
  if (!reading) return {};
  return pageMetadata(locale, {
    title: t.metaTitle(reading.cast.shape, reading.species.name),
    description: t.description(reading.cast.shape, reading.species.name, reading.year, reading.prophecy).slice(0, 160),
    path: `/lanie-wosku/${reading.code}`,
    shareTitle: `${WAX_COPY[locale].title} · ${reading.species.name}`,
    shareDescription: `${reading.cast.shape}. ${reading.prophecy}`,
    noindex: true,
  });
}

export default async function WaxReadingPage({ params }: PageProps<"/[lang]/lanie-wosku/[kod]">) {
  const locale = await getLocale();
  const t = { ...WAX_COPY[locale], ...COPY[locale] };
  const reading = decodeReading((await params).kod, locale);
  if (!reading) notFound();

  return (
    <main id="tresc">
      <WaxHeader
        locale={locale}
        crumbs={[{ label: t.title, href: "/lanie-wosku" }, { label: t.resultCrumb(reading.number) }]}
        year={reading.year}
        meta={t.resultMeta(reading.number, castCount, reading.code)}
      />
      <section aria-label={t.title} className="wrap py-12 md:py-16">
        <WaxReading table={waxTableFor(locale)} result={{ code: reading.code, cast: reading.picks.cast }}>
          <WaxProtocol reading={reading} locale={locale} />
        </WaxReading>
        <TranslatorNotes notes={t.notes} className="mt-14 max-w-2xl" />
      </section>
      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
