import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BingoGrid } from "@/components/bingo-grid";
import { PrintButton } from "@/components/print-button";
import { decodeCard, series } from "@/lib/bingo";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/bingo/[karta]/druk">): Promise<Metadata> {
  const card = decodeCard((await params).karta);
  if (!card) return {};
  return pageMetadata({
    title: `${card.occasion.title}: cztery karty do druku`,
    description: `${card.occasion.title}: cztery różne karty na jednej stronie A4, do rozdania przy stole.`,
    path: `/bingo/${card.code}/druk`,
    noindex: true,
  });
}

/** Four different cards on one A4 sheet, for a table without phones. */
export default async function PrintPage({ params }: PageProps<"/bingo/[karta]/druk">) {
  const card = decodeCard((await params).karta);
  if (!card) notFound();
  const cards = series(card, 4);

  return (
    <main id="tresc" className="wrap pb-20 pt-8 md:pt-12 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-end justify-between gap-6 print:hidden">
        <div>
          <p className="label text-ink-soft">
            <Link href={`/bingo/${card.code}`} className="link">
              ← Wróć do karty
            </Link>
          </p>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.02em]">
            {card.occasion.title}: cztery karty
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            {typo("Strona A4, cztery różne karty. Wydrukuj, rozetnij, rozdaj przy stole. Długopis każdy ma swój.")}
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 print:mt-0 print:grid-cols-2 print:gap-[6mm]">
        {cards.map((item) => (
          <BingoGrid key={item.code} card={item} compact className="border border-ink print:break-inside-avoid" />
        ))}
      </div>
    </main>
  );
}
