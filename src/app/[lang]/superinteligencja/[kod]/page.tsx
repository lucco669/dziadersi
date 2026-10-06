import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, TestPromo } from "@/components/page";
import { SzwagierConsole } from "@/components/szwagier";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { answerPath, decodeAnswer, sampleAnswer } from "@/lib/szwagier";
import { quote, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Superinteligencja",
    answer: "Odpowiedź",
    browserTitle: "Odpowiedź SZWAGRA 1.9 TDI",
    lead: "Odpowiedź Superinteligencji Instytutu, przesłana dalej. Pod spodem można zadać własne pytanie: SZWAGIER odpowiada każdemu.",
    meta: (field: string) => `SZWAGIER 1.9 TDI · dziedzina: ${field.toLowerCase()}`,
    promoTitle: "Odpowiadasz jak SZWAGIER? To nie jest dobry znak.",
    promoText: "Jeśli te odpowiedzi brzmią jak twoje, czas na badanie. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    title: "Superinteligenca",
    answer: "Odgovor",
    browserTitle: "Odgovor SZWAGRA 1.9 TDI",
    lead: "Odgovor superinteligence Inštituta, poslan naprej. Spodaj lahko zastaviš svoje vprašanje: SZWAGIER odgovori vsakomur.",
    meta: (field: string) => `SZWAGIER 1.9 TDI · področje: ${field.toLowerCase()}`,
    promoTitle: "Odgovarjaš kot SZWAGIER? To ni dober znak.",
    promoText: "Če se ti ti odgovori zdijo tvoji, je čas za pregled. Pet ordinacij, štiri minute.",
  },
});

// An answer renders in one pass: the code holds every part and the question.
export const instant = false;

// The sample answer is prerendered; other codes render on first visit. Codes are the same in both editions.
export function generateStaticParams() {
  return [{ kod: answerPath(sampleAnswer("pl")).split("/").pop()! }];
}

function read(kod: string, locale: Locale) {
  try {
    return decodeAnswer(decodeURIComponent(kod), locale);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<"/[lang]/superinteligencja/[kod]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const answer = read((await params).kod, locale);
  if (!answer) return {};
  return pageMetadata(locale, {
    title: answer.question ? quote(answer.question, locale) : t.browserTitle,
    description: answer.text.slice(0, 160),
    path: answerPath(answer),
    shareTitle: answer.question ? `${quote(answer.question, locale)} · SZWAGIER 1.9 TDI` : t.browserTitle,
    shareDescription: answer.text,
    noindex: true,
    nofollow: true,
  });
}

export default async function AnswerPage({ params }: PageProps<"/[lang]/superinteligencja/[kod]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const { kod } = await params;
  const answer = read(kod, locale);
  if (!answer) notFound();

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: t.title, href: "/superinteligencja" }, { label: t.answer }]}
        title={t.title.replace(/^Super/, "Super­")}
        lead={typo(t.lead)}
        meta={t.meta(answer.topic.name)}
      />
      <section aria-label={t.answer} className="wrap py-12 md:py-16">
        <SzwagierConsole initial={decodeURIComponent(kod)} />
      </section>
      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
