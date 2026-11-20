import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorialPath, publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { ShareBar } from "@/components/share-bar";
import { getDictionary } from "@/content/dictionary";
import { getSlang, slangBySlug } from "@/content/slang";
import { DEFAULT_LOCALE, hasLocale, LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { formatDate, quote, typo } from "@/lib/typo";

type Props = { params: Promise<{ lang: string; slug: string }> };

const SECTION = "/slownik-mlodziezowy";

const COPY = defineCopy({
  pl: {
    section: "Słownik młodzieżowy",
    question: (word: string) => `Co znaczy „${word}”?`,
    title: (word: string) => `${word} — co to znaczy?`,
    origin: (word: string) => `Skąd się wzięło „${word}”?`,
    meta: (grammar: string, date: string) => `${grammar} · stan na ${date}`,
    variants: "Inne formy",
    meaning: "Znaczenie",
    originTitle: "Pochodzenie",
    example: "Przykład użycia",
    dziaders: "Objaśnienie dla dziadersa",
    reaction: "Jak zareagowałby dziaders",
    phrase: "Dziaderski odpowiednik",
    more: "Inne hasła",
    all: "Cały słownik młodzieżowy",
    promo: "Rozumiesz już młodzież. A siebie?",
    promoText: "Test Dziadersa: pięć gabinetów, około czterech minut. Pytania są po polsku, bez skrótów.",
  },
  sl: {
    section: "Mladinski slovar",
    question: (word: string) => `Kaj pomeni »${word}«?`,
    title: (word: string) => `${word} — kaj pomeni?`,
    origin: (word: string) => `Od kod izvira »${word}«?`,
    meta: (grammar: string, date: string) => `${grammar} · stanje na dan ${date}`,
    variants: "Druge oblike",
    meaning: "Pomen",
    originTitle: "Izvor",
    example: "Primer rabe",
    dziaders: "Pojasnilo za dziadersa",
    reaction: "Kako bi se odzval dziaders",
    phrase: "Dziaderski ustreznik",
    more: "Druga gesla",
    all: "Ves mladinski slovar",
    promo: "Mladino zdaj razumeš. Kaj pa sebe?",
    promoText: "Test dziadersa: pet ordinacij, približno štiri minute. Vprašanja so brez kratic.",
  },
});

const MAX_TITLE = 70;

export const instant = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getSlang(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const entry = slangBySlug((await params).slug, locale);
  if (!entry) return {};
  const t = COPY[locale];
  const title = t.title(entry.word);
  const full = `${title} · ${t.section}`;
  return pageMetadata(locale, {
    title: full.length <= MAX_TITLE ? full : title,
    description: `${entry.word}: ${entry.meaning}`,
    path: SECTION + "/" + entry.slug,
    type: "article",
  });
}

export default async function SlangEntryPage({ params }: Props) {
  const locale = await getLocale();
  const t = COPY[locale];
  const entry = slangBySlug((await params).slug, locale);
  if (!entry) notFound();
  const path = SECTION + "/" + entry.slug;
  const phrasePath = entry.phrase ? editorialPath("slownik", entry.phrase, locale) : undefined;
  const phrase = phrasePath ? getDictionary(locale).find((item) => "/slownik/" + item.slug === phrasePath) : undefined;
  const others = getSlang(locale).filter((item) => item.slug !== entry.slug);
  const crumbs = [{ label: t.section, href: SECTION }, { label: entry.word }];
  const language = LOCALE_INFO[locale].tag;
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          {
            ...publicationSchema(locale, path, t.title(entry.word), entry.meaning, "Article"),
            dateModified: entry.checked,
            about: {
              "@type": "DefinedTerm",
              name: entry.word,
              ...(entry.variants ? { alternateName: entry.variants } : {}),
              description: entry.meaning,
              inLanguage: language,
              inDefinedTermSet: absoluteUrl(SECTION, locale) + "#hasla",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: absoluteUrl(path, locale),
            inLanguage: language,
            mainEntity: [
              { "@type": "Question", name: t.question(entry.word), acceptedAnswer: { "@type": "Answer", text: entry.meaning } },
              { "@type": "Question", name: t.origin(entry.word), acceptedAnswer: { "@type": "Answer", text: entry.origin } },
            ],
          },
        ]}
      />
      <PageHeader crumbs={crumbs} title={entry.word} meta={t.meta(entry.grammar, formatDate(locale, entry.checked))} />
      <Section id="znaczenie" title={t.question(entry.word)}>
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
            <p className="text-xl">{typo(entry.meaning)}</p>
            <div>
              <h3 className="label text-ink-soft">{t.originTitle}</h3>
              <p className="mt-2">{typo(entry.origin)}</p>
            </div>
            {entry.variants && (
              <div>
                <h3 className="label text-ink-soft">{t.variants}</h3>
                <p className="mt-2 font-sans">{entry.variants.join(" · ")}</p>
              </div>
            )}
          </div>
          <div className="border border-rule bg-paper-deep p-6">
            <h3 className="label text-red-deep">{t.example}</h3>
            <p className="mt-3 text-xl italic leading-snug">{typo(entry.example)}</p>
          </div>
        </div>
      </Section>
      <Section id="dla-dziadersa" title={t.dziaders}>
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="max-w-2xl text-xl leading-relaxed">{typo(entry.dziaders)}</p>
          <div className="border-l-2 border-red pl-6">
            <h3 className="label text-red">{t.reaction}</h3>
            <p className="mt-3 text-2xl font-bold leading-snug">{quote(typo(entry.reaction), locale)}</p>
          </div>
        </div>
        {phrase && (
          <div className="mt-12 max-w-2xl border-t border-rule pt-5">
            <p className="label text-ink-soft">{t.phrase}</p>
            <Link href={"/slownik/" + phrase.slug} className="mt-2 block text-2xl font-bold leading-tight hover:text-red">
              {quote(phrase.headword, locale)}
            </Link>
            <p className="mt-2 text-ink-soft">{typo(phrase.senses[0].text)}</p>
          </div>
        )}
        <TranslatorNotes notes={entry.notes} className="mt-10 max-w-2xl" />
      </Section>
      <Section id="inne" title={t.more}>
        <ul className="flex flex-wrap gap-x-6 gap-y-3 font-sans text-lg">
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={SECTION + "/" + item.slug} className="link">
                {item.word}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-sans text-lg">
          <Link href={SECTION} className="link">
            {t.all} →
          </Link>
        </p>
        <div className="mt-10">
          <ShareBar path={path} text={t.title(entry.word)} kind="slang" />
        </div>
      </Section>
      <TestPromo title={t.promo} text={typo(t.promoText)} />
    </main>
  );
}
