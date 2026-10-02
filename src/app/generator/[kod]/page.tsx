import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, TestPromo } from "@/components/page";
import { Phrasebook } from "@/components/phrasebook";
import { SITUATIONS } from "@/content/phrasebook";
import { decodeLine, seededLine } from "@/lib/phrasebook";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

// A line renders in one pass: the code holds the chapter and the three parts.
export const instant = false;

// One line per chapter is prerendered; other codes render on first visit.
export function generateStaticParams() {
  return SITUATIONS.map((situation, i) => ({ kod: seededLine(101 + i * 13, situation).code }));
}

export async function generateMetadata({ params }: PageProps<"/generator/[kod]">): Promise<Metadata> {
  const line = decodeLine((await params).kod);
  if (!line) return {};
  const claim = line.parts[1].length > 56 ? `${line.parts[1].slice(0, line.parts[1].lastIndexOf(" ", 55))}…` : line.parts[1];
  return pageMetadata({
    title: `„${claim}”`,
    description: `„${line.text}” Rozmówki dziaderskie, rozdział ${line.situation.name.toLowerCase()}.`.slice(0, 160),
    path: `/generator/${line.code}`,
    shareTitle: `Rozmówki dziaderskie · ${line.situation.name}`,
    shareDescription: line.text,
    noindex: true,
  });
}

export default async function LinePage({ params }: PageProps<"/generator/[kod]">) {
  const line = decodeLine((await params).kod);
  if (!line) notFound();

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: "Rozmówki dziaderskie", href: "/generator" }, { label: `Wypowiedź nr ${line.number}` }]}
        title={line.situation.name}
        lead={typo("Wypowiedź przesłana z Rozmówek dziaderskich. Można ją powtórzyć przy stole albo wylosować własną.")}
        meta={`Wypowiedź nr ${line.number} z ${line.total}`}
      />
      <section aria-label="Generator" className="wrap py-12 md:py-16">
        <Phrasebook initial={{ slug: line.situation.slug, picks: line.picks }} />
      </section>
      <TestPromo
        title="Mówisz tak? To nie generator."
        text={typo("Jeśli te wypowiedzi brzmią znajomo, ale z twoich ust, czas na badanie. Pięć gabinetów, cztery minuty.")}
      />
    </main>
  );
}
