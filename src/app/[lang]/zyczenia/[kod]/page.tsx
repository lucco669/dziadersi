import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, TestPromo } from "@/components/page";
import { WishMachine } from "@/components/wishes";
import { CHAPTERS } from "@/content/wishes";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { formatNumber, quote, typo } from "@/lib/typo";
import { decodeWish, seededWish } from "@/lib/wishes";

const COPY = defineCopy({
  pl: {
    title: "Życzenia od Instytutu",
    shareTitle: (chapter: string) => `Życzenia od Instytutu · ${chapter}`,
    description: (wish: string, chapter: string) => `„${wish}” Życzenia od Instytutu · ${chapter}.`,
    card: (number: number) => `Pismo nr ${formatNumber("pl", number)}`,
    meta: (number: number, total: number) => `Pismo nr ${formatNumber("pl", number)} z ${formatNumber("pl", total)} · podpisuje IBD`,
    lead: "Życzenia doręczone przez Instytut. Można je przesłać dalej bez zmiany treści albo wylosować własne.",
    promoTitle: "Życzenia przyjęte. Teraz badanie.",
    promoText: "Przy stole i tak ktoś zapyta, czy to już dziaderstwo. Lepiej znać wynik wcześniej. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    title: "Voščila Inštituta",
    shareTitle: (chapter: string) => `Voščila Inštituta · ${chapter}`,
    description: (wish: string, chapter: string) => `»${wish}« Voščila Inštituta · ${chapter}.`,
    card: (number: number) => `Dopis št. ${formatNumber("sl", number)}`,
    meta: (number: number, total: number) => `Dopis št. ${formatNumber("sl", number)} od ${formatNumber("sl", total)} · podpisuje IBD`,
    lead: "Voščila, ki jih je vročil Inštitut. Lahko jih posreduješ naprej brez spremembe besedila ali izžrebaš svoja.",
    promoTitle: "Voščila so prejeta. Zdaj pa pregled.",
    promoText: "Za mizo bo tako ali tako kdo vprašal, ali je to že dziaderstvo. Bolje je izvid poznati prej. Pet ordinacij, štiri minute.",
  },
});

// A card renders in one pass: the code holds the chapter and the three sentences.
export const instant = false;

// One card per chapter is prerendered; other codes render on first visit. Codes are the same in both editions.
export function generateStaticParams() {
  return CHAPTERS.map((chapter, i) => ({ kod: seededWish(211 + i * 17, chapter, "pl").code }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/zyczenia/[kod]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const card = decodeWish((await params).kod, locale);
  if (!card) return {};
  const wish = card.parts[1];
  const short = wish.length > 56 ? `${wish.slice(0, wish.lastIndexOf(" ", 55))}…` : wish;
  return pageMetadata(locale, {
    title: quote(short, locale),
    description: t.description(wish, card.chapter.name).slice(0, 160),
    path: `/zyczenia/${card.code}`,
    shareTitle: t.shareTitle(card.chapter.name),
    shareDescription: `${card.chapter.salutation} ${card.text}`,
    noindex: true,
  });
}

export default async function WishPage({ params }: PageProps<"/[lang]/zyczenia/[kod]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const card = decodeWish((await params).kod, locale);
  if (!card) notFound();

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: t.title, href: "/zyczenia" }, { label: t.card(card.number) }]}
        title={card.chapter.name}
        lead={typo(t.lead)}
        meta={t.meta(card.number, card.total)}
      />
      <section aria-label={t.title} className="wrap py-12 md:py-16">
        <WishMachine key={card.code} initial={{ slug: card.chapter.slug, picks: card.picks }} />
      </section>
      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
