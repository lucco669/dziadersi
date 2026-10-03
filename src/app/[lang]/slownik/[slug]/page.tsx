import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbList, JsonLd, PageHeader, Pager, TestPromo, TranslatorNotes } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { Saying } from "@/components/saying";
import { entryByHeadword, entryBySlug, getDictionary, getDictionarySorted } from "@/content/dictionary";
import { speciesByKey } from "@/content/species";
import { hasLocale, LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, describe, pageMetadata } from "@/lib/seo";
import { quote, typo } from "@/lib/typo";

// Every entry is prerendered; unknown slugs 404.
export const instant = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return hasLocale(params.lang) ? getDictionary(params.lang).map((entry) => ({ slug: entry.slug })) : [];
}

const COPY = defineCopy({
  pl: {
    dictionary: "Słownik Dziaderski",
    title: (headword: string) => `„${headword}”: znaczenie i przykłady`,
    describeLong: " Znaczenie i przykłady użycia w Słowniku Dziaderskim.",
    describeShort: " Słownik Dziaderski.",
    position: (index: number, total: number) => `Hasło ${index} z ${total}`,
    /** Before the Polish headword; the Polish edition has none to show. */
    original: "Oryginał:",
    figurative: "przen.",
    example: "Przykład użycia",
    neighbours: "Sąsiednie hasła",
    previous: "Poprzednie hasło",
    next: "Następne hasło",
    species: "Typowa wokalizacja gatunku",
    seeAlso: "Zobacz też",
    promoTitle: "Mówisz tak?",
    promoText: "Test Dziadersa sprawdzi, czy to jeszcze cytat, czy już objaw. Pięć gabinetów, około czterech minut.",
  },
  sl: {
    dictionary: "Dziaderski slovar",
    title: (headword: string) => `»${headword}«: pomen in primeri`,
    describeLong: " Pomen in primeri rabe v Dziaderskem slovarju.",
    describeShort: " Dziaderski slovar.",
    position: (index: number, total: number) => `Geslo ${index} od ${total}`,
    original: "Poljski izvirnik:",
    figurative: "pren.",
    example: "Primer rabe",
    neighbours: "Sosednja gesla",
    previous: "Prejšnje geslo",
    next: "Naslednje geslo",
    species: "Značilno oglašanje vrste",
    seeAlso: "Glej tudi",
    promoTitle: "Tako govoriš?",
    promoText: "Test dziadersa bo preveril, ali je to še citat ali že simptom. Pet ordinacij, približno štiri minute.",
  },
});

const capitalize = (text: string, locale: Locale) => text.charAt(0).toLocaleUpperCase(LOCALE_INFO[locale].tag) + text.slice(1);

export async function generateMetadata({ params }: PageProps<"/[lang]/slownik/[slug]">): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  const entry = entryBySlug((await params).slug, locale);
  if (!entry) return {};
  const headword = capitalize(entry.headword, locale);
  return pageMetadata(locale, {
    title: t.title(headword),
    description: describe(`${headword}: ${entry.grammar}. ${entry.senses[0].text}`, t.describeLong, t.describeShort),
    path: `/slownik/${entry.slug}`,
    shareTitle: `${headword} · ${t.dictionary}`,
    shareDescription: entry.senses[0].text,
    type: "article",
  });
}

export default async function EntryPage({ params }: PageProps<"/[lang]/slownik/[slug]">) {
  const locale = await getLocale();
  const t = COPY[locale];
  const entry = entryBySlug((await params).slug, locale);
  if (!entry) notFound();

  const entries = getDictionary(locale);
  const sorted = getDictionarySorted(locale);
  const index = sorted.indexOf(entry);
  const previous = sorted[(index - 1 + sorted.length) % sorted.length];
  const next = sorted[(index + 1) % sorted.length];
  const species = entry.species ? speciesByKey(entry.species, locale) : undefined;
  const url = absoluteUrl(`/slownik/${entry.slug}`, locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [
            { label: t.dictionary, href: "/slownik" },
            { label: entry.headword, href: `/slownik/${entry.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: entry.headword,
            alternateName: entry.original,
            description: entry.senses.map((sense) => sense.text).join(" "),
            url,
            inLanguage: LOCALE_INFO[locale].tag,
            inDefinedTermSet: { "@type": "DefinedTermSet", name: t.dictionary, url: absoluteUrl("/slownik", locale) },
          },
        ]}
      />

      <article aria-labelledby="haslo">
        <PageHeader
          crumbs={[{ label: t.dictionary, href: "/slownik" }, { label: entry.headword }]}
          titleId="haslo"
          title={entry.headword}
          lead={
            <>
              <p className="italic">
                {entry.grammar} <span className="mx-1.5 not-italic text-ink-faint">|</span> {entry.pronunciation}
              </p>
              {entry.original && (
                <p className="label mt-3 text-ink-faint">
                  {t.original} <span lang="pl">{entry.original}</span>
                </p>
              )}
            </>
          }
          meta={t.position(index + 1, entries.length)}
        />

        <div className="wrap grid gap-16 pb-20 pt-12 md:pb-28 md:pt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ol className="space-y-5 border-t border-ink pt-8">
              {entry.senses.map((sense, i) => (
                <li key={sense.text} className="grid grid-cols-[2.25rem_1fr] gap-2 text-[1.35rem] leading-relaxed md:text-[1.5rem]">
                  <span className="font-bold text-red">{i + 1}.</span>
                  <span>
                    {sense.figurative && <i className="text-ink-soft">{`${t.figurative} `}</i>}
                    {typo(sense.text)}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <p className="label text-ink-soft">{t.example}</p>
              <Saying className="mt-2" note={entry.exampleNote}>
                {quote(entry.example, locale)}
              </Saying>
            </div>

            <TranslatorNotes notes={entry.notes} className="mt-12" />

            <Pager
              label={t.neighbours}
              previous={{ href: `/slownik/${previous.slug}`, label: t.previous, title: previous.headword }}
              next={{ href: `/slownik/${next.slug}`, label: t.next, title: next.headword }}
            />
          </div>

          <aside className="space-y-12 self-start lg:col-span-5">
            {species && (
              <Link href={`/atlas/${species.slug}`} className="group block border-t border-ink pt-5">
                <span className="label text-ink-soft">{t.species}</span>
                <SpeciesPlate species={species.key} className="mt-3 w-full max-w-sm" />
                <span className="mt-2 block text-2xl font-bold leading-tight transition-colors group-hover:text-red">
                  {species.name} <span aria-hidden="true">→</span>
                </span>
                <span className="block italic text-ink-soft">{species.latin}</span>
              </Link>
            )}

            {entry.seeAlso.length > 0 && (
              <div className="border-t border-ink pt-5">
                <p className="label text-ink-soft">{t.seeAlso}</p>
                <ul className="mt-2">
                  {entry.seeAlso.map((headword) => {
                    const related = entryByHeadword(headword, locale);
                    return (
                      <li key={headword} className="border-b border-rule py-3">
                        {related ? (
                          <Link href={`/slownik/${related.slug}`} className="text-xl font-bold transition-colors hover:text-red">
                            {headword}
                          </Link>
                        ) : (
                          <span className="text-xl font-bold">{headword}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
