import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BingoBoard } from "@/components/bingo-board";
import { OccasionPlate } from "@/components/occasions";
import { Breadcrumbs, TranslatorNotes } from "@/components/page";
import { ShareBar } from "@/components/share-bar";
import { getOccasions, OCCASIONS } from "@/content/bingo";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { decodeCard, sampleCard } from "@/lib/bingo";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    bingo: "Dziaders Bingo",
    title: (title: string, number: string) => `${title}, karta nr ${number}`,
    description: (title: string, number: string, intro: string) =>
      `${title}: karta nr ${number}. ${intro} Skreślaj na telefonie albo wydrukuj.`,
    friends: "Gra ze znajomymi",
    table: "Gra przy stole",
    tableText: "Wyślij znajomym link do gry. Każdy wylosuje własną kartę, a ta zostanie twoja. Skreślenia zapisują się tylko na tym telefonie.",
    invite: (title: string) => `${title}: gramy? Każdy losuje swoją kartę.`,
    rules: "Zasady",
    rulesList: [
      "Skreślaj, co usłyszysz albo zobaczysz. Sens wystarczy, słowo w słowo nie jest wymagane.",
      "Pięć w linii, w poziomie, w pionie albo po skosie, to bingo. Należy wstać i krzyknąć.",
    ],
    others: "Inne okazje",
  },
  sl: {
    bingo: "Dziaders bingo",
    title: (title: string, number: string) => `${title}, listek št. ${number}`,
    description: (title: string, number: string, intro: string) =>
      `${title}: listek št. ${number}. ${intro} Prečrtuj na telefonu ali natisni.`,
    friends: "Igra s prijatelji",
    table: "Igra za mizo",
    tableText: "Pošlji prijateljem povezavo do igre. Vsak bo izžrebal svoj listek, ta pa ostane tvoj. Prečrtana polja se shranijo samo na tem telefonu.",
    invite: (title: string) => `${title}: igramo? Vsak izžreba svoj listek.`,
    rules: "Pravila",
    rulesList: [
      "Prečrtaj, kar slišiš ali vidiš. Dovolj je smisel, dobesedno ni treba.",
      "Pet v vrsti, vodoravno, navpično ali poševno, je bingo. Treba je vstati in zavpiti.",
    ],
    others: "Druge priložnosti",
  },
});

/** The intro without the superscripts that point to translator's notes, for metadata. */
const plain = (text: string) => text.replace(/[¹²³]/g, "");

// A card renders in one pass: the code holds the occasion and the seed.
export const instant = false;

// The sample card of every occasion is prerendered; other cards render on first visit. Codes are the same in both editions.
export function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({ karta: sampleCard(occasion).code }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/bingo/[karta]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const card = decodeCard((await params).karta, locale);
  if (!card) return {};
  return pageMetadata(locale, {
    title: t.title(card.occasion.title, card.number),
    description: t.description(card.occasion.title, card.number, plain(card.occasion.intro)),
    path: `/bingo/${card.code}`,
    noindex: true,
  });
}

export default async function CardPage({ params }: PageProps<"/[lang]/bingo/[karta]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const card = decodeCard((await params).karta, locale);
  if (!card) notFound();
  const others = getOccasions(locale).filter((occasion) => occasion.slug !== card.occasion.slug);

  return (
    <main id="tresc" className="wrap pb-20 pt-8 md:pb-28 md:pt-12 print:p-0">
      <Breadcrumbs crumbs={[{ label: t.bingo, href: "/bingo" }, { label: card.occasion.name }]} className="print:hidden" />

      <header className="mt-8 flex items-end justify-between gap-6 md:mt-10 print:hidden">
        <div>
          <h1 className="text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.02em]">{card.occasion.title}</h1>
          <p className="mt-4 max-w-xl text-lg leading-snug text-ink-soft">{typo(card.occasion.intro)}</p>
          <TranslatorNotes notes={card.occasion.notes} className="mt-6 max-w-xl" />
        </div>
        <OccasionPlate slug={card.occasion.slug} animated className="hidden w-48 shrink-0 sm:block md:w-56" />
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-12 print:mt-0 print:block">
        <div className="lg:col-span-7">
          <BingoBoard card={card} />
        </div>

        <aside className="lg:col-span-5 print:hidden" aria-label={t.friends}>
          <div className="border-t border-ink pt-5">
            <h2 className="text-2xl font-bold">{t.table}</h2>
            <p className="mt-2 max-w-md leading-snug text-ink-soft">{typo(t.tableText)}</p>
            <div className="mt-4">
              <ShareBar path={`/bingo/${card.code}`} text={t.invite(card.occasion.title)} kind="bingo" />
            </div>
          </div>

          <div className="mt-10 border-t border-ink pt-5">
            <h2 className="text-2xl font-bold">{t.rules}</h2>
            <ol className="mt-2 space-y-2 leading-snug text-ink-soft">
              {t.rulesList.map((rule) => (
                <li key={rule}>{typo(rule)}</li>
              ))}
            </ol>
          </div>

          <div className="mt-10 border-t border-ink pt-5">
            <p className="label text-ink-soft">{t.others}</p>
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
