import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, TestPromo } from "@/components/page";
import { Phrasebook } from "@/components/phrasebook";
import { SITUATIONS } from "@/content/phrasebook";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { decodeLine, seededLine } from "@/lib/phrasebook";
import { pageMetadata } from "@/lib/seo";
import { formatNumber, quote, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Rozmówki dziaderskie",
    description: (text: string, chapter: string) => `„${text}” Rozmówki dziaderskie, rozdział ${chapter.toLowerCase()}.`,
    line: (number: number) => `Wypowiedź nr ${number}`,
    meta: (number: number, total: number) => `Wypowiedź nr ${number} z ${total}`,
    lead: "Wypowiedź przesłana z Rozmówek dziaderskich. Można ją powtórzyć przy stole albo wylosować własną.",
    promoTitle: "Mówisz tak? To nie generator.",
    promoText: "Jeśli te wypowiedzi brzmią znajomo, ale z twoich ust, czas na badanie. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    title: "Dziaderski pogovornik",
    description: (text: string, chapter: string) => `»${text}« Dziaderski pogovornik, poglavje ${chapter.toLowerCase()}.`,
    line: (number: number) => `Izjava št. ${formatNumber("sl", number)}`,
    meta: (number: number, total: number) => `Izjava št. ${formatNumber("sl", number)} od ${formatNumber("sl", total)}`,
    lead: "Izjava, poslana iz Dziaderskega pogovornika. Lahko jo ponoviš za mizo ali izžrebaš svojo.",
    promoTitle: "Tako govoriš? To ni generator.",
    promoText: "Če se ti te izjave zdijo znane, ampak iz tvojih ust, je čas za pregled. Pet ordinacij, štiri minute.",
  },
});

// A line renders in one pass: the code holds the chapter and the three parts.
export const instant = false;

// One line per chapter is prerendered; other codes render on first visit. Codes are the same in both editions.
export function generateStaticParams() {
  return SITUATIONS.map((situation, i) => ({ kod: seededLine(101 + i * 13, "pl", situation).code }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/generator/[kod]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const line = decodeLine((await params).kod, locale);
  if (!line) return {};
  const claim = line.parts[1].length > 56 ? `${line.parts[1].slice(0, line.parts[1].lastIndexOf(" ", 55))}…` : line.parts[1];
  return pageMetadata(locale, {
    title: quote(claim, locale),
    description: t.description(line.text, line.situation.name).slice(0, 160),
    path: `/generator/${line.code}`,
    shareTitle: `${t.title} · ${line.situation.name}`,
    shareDescription: line.text,
    noindex: true,
  });
}

export default async function LinePage({ params }: PageProps<"/[lang]/generator/[kod]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const line = decodeLine((await params).kod, locale);
  if (!line) notFound();

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: t.title, href: "/generator" }, { label: t.line(line.number) }]}
        title={line.situation.name}
        lead={typo(t.lead)}
        meta={t.meta(line.number, line.total)}
      />
      <section aria-label="Generator" className="wrap py-12 md:py-16">
        <Phrasebook initial={{ slug: line.situation.slug, picks: line.picks }} original />
      </section>
      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
