import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BingoGrid } from "@/components/bingo-grid";
import { PrintButton } from "@/components/print-button";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { decodeCard, series } from "@/lib/bingo";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: (title: string) => `${title}: cztery karty do druku`,
    description: (title: string) => `${title}: cztery różne karty na jednej stronie A4, do rozdania przy stole.`,
    back: "← Wróć do karty",
    heading: (title: string) => `${title}: cztery karty`,
    lead: "Strona A4, cztery różne karty. Wydrukuj, rozetnij, rozdaj przy stole. Długopis każdy ma swój.",
  },
  sl: {
    title: (title: string) => `${title}: štirje listki za tisk`,
    description: (title: string) => `${title}: štirje različni listki na eni strani A4, za razdelitev pri mizi.`,
    back: "← Nazaj na listek",
    heading: (title: string) => `${title}: štirje listki`,
    lead: "Stran A4, štirje različni listki. Natisni, razreži, razdeli pri mizi. Kemični svinčnik ima vsak svoj.",
  },
});

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/bingo/[karta]/druk">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const card = decodeCard((await params).karta, locale);
  if (!card) return {};
  return pageMetadata(locale, {
    title: t.title(card.occasion.title),
    description: t.description(card.occasion.title),
    path: `/bingo/${card.code}/druk`,
    noindex: true,
  });
}

/** Four different cards on one A4 sheet, for a table without phones. */
export default async function PrintPage({ params }: PageProps<"/[lang]/bingo/[karta]/druk">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const card = decodeCard((await params).karta, locale);
  if (!card) notFound();
  const cards = series(card, 4);

  return (
    <main id="tresc" className="wrap pb-20 pt-8 md:pt-12 print:max-w-none print:p-0">
      <div className="flex flex-wrap items-end justify-between gap-6 print:hidden">
        <div>
          <p className="label text-ink-soft">
            <Link href={`/bingo/${card.code}`} className="link">
              {t.back}
            </Link>
          </p>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[0.95] tracking-[-0.02em]">{t.heading(card.occasion.title)}</h1>
          <p className="mt-3 max-w-xl text-ink-soft">{typo(t.lead)}</p>
        </div>
        <PrintButton />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 print:mt-0 print:grid-cols-2 print:gap-[6mm]">
        {cards.map((item) => (
          <BingoGrid key={item.code} card={item} locale={locale} compact className="border border-ink print:break-inside-avoid" />
        ))}
      </div>
    </main>
  );
}
