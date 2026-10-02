import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BingoBoard } from "@/components/bingo-board";
import { OccasionPlate } from "@/components/occasions";
import { Breadcrumbs } from "@/components/page";
import { ShareBar } from "@/components/share-bar";
import { OCCASIONS } from "@/content/bingo";
import { decodeCard, sampleCard } from "@/lib/bingo";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

// A card renders in one pass: the code holds the occasion and the seed.
export const instant = false;

// The sample card of every occasion is prerendered; other cards render on first visit.
export function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({ karta: sampleCard(occasion).code }));
}

export async function generateMetadata({ params }: PageProps<"/bingo/[karta]">): Promise<Metadata> {
  const card = decodeCard((await params).karta);
  if (!card) return {};
  return pageMetadata({
    title: `${card.occasion.title}, karta nr ${card.number}`,
    description: `${card.occasion.title}: karta nr ${card.number}. ${card.occasion.intro} Skreślaj na telefonie albo wydrukuj.`,
    path: `/bingo/${card.code}`,
    noindex: true,
  });
}

export default async function CardPage({ params }: PageProps<"/bingo/[karta]">) {
  const card = decodeCard((await params).karta);
  if (!card) notFound();
  const others = OCCASIONS.filter((occasion) => occasion !== card.occasion);

  return (
    <main id="tresc" className="wrap pb-20 pt-8 md:pb-28 md:pt-12 print:p-0">
      <Breadcrumbs crumbs={[{ label: "Dziaders Bingo", href: "/bingo" }, { label: card.occasion.name }]} className="print:hidden" />

      <header className="mt-8 flex items-end justify-between gap-6 md:mt-10 print:hidden">
        <div>
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">{card.occasion.title}</h1>
          <p className="mt-4 max-w-xl text-lg leading-snug text-ink-soft">{typo(card.occasion.intro)}</p>
        </div>
        <OccasionPlate slug={card.occasion.slug} animated className="hidden w-48 shrink-0 sm:block md:w-56" />
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-12 print:mt-0 print:block">
        <div className="lg:col-span-7">
          <BingoBoard card={card} />
        </div>

        <aside className="lg:col-span-5 print:hidden" aria-label="Gra ze znajomymi">
          <div className="border-t border-ink pt-5">
            <h2 className="text-2xl font-bold">Gra przy stole</h2>
            <p className="mt-2 max-w-md leading-snug text-ink-soft">
              {typo("Wyślij znajomym link do gry. Każdy wylosuje własną kartę, a ta zostanie twoja. Skreślenia zapisują się tylko na tym telefonie.")}
            </p>
            <div className="mt-4">
              <ShareBar path={`/bingo/${card.code}`} text={`${card.occasion.title}: gramy? Każdy losuje swoją kartę.`} kind="bingo" />
            </div>
          </div>

          <div className="mt-10 border-t border-ink pt-5">
            <h2 className="text-2xl font-bold">Zasady</h2>
            <ol className="mt-2 space-y-2 leading-snug text-ink-soft">
              <li>{typo("Skreślaj, co usłyszysz albo zobaczysz. Sens wystarczy, słowo w słowo nie jest wymagane.")}</li>
              <li>{typo("Pięć w linii, w poziomie, w pionie albo po skosie, to bingo. Należy wstać i krzyknąć.")}</li>
            </ol>
          </div>

          <div className="mt-10 border-t border-ink pt-5">
            <p className="label text-ink-soft">Inne okazje</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-sans font-medium">
              {others.map((occasion) => (
                <li key={occasion.slug}>
                  <Link href={`/bingo/${sampleCard(occasion).code}`} className="link">
                    {occasion.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
