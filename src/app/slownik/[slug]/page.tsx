import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbList, JsonLd, PageHeader, Pager, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { Saying } from "@/components/saying";
import { DICTIONARY, DICTIONARY_SORTED, entryByHeadword, entryBySlug } from "@/content/dictionary";
import { speciesByKey } from "@/content/species";
import { describe, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

// Every entry is prerendered; unknown slugs 404.
export const instant = false;

export function generateStaticParams() {
  return DICTIONARY.map((entry) => ({ slug: entry.slug }));
}

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("pl") + text.slice(1);

export async function generateMetadata({ params }: PageProps<"/slownik/[slug]">): Promise<Metadata> {
  const entry = entryBySlug((await params).slug);
  if (!entry) return {};
  return pageMetadata({
    title: `„${capitalize(entry.headword)}”: znaczenie i przykłady`,
    description: describe(
      `${capitalize(entry.headword)}: ${entry.grammar}. ${entry.senses[0].text}`,
      " Znaczenie i przykłady użycia w Słowniku Dziaderskim.",
      " Słownik Dziaderski.",
    ),
    path: `/slownik/${entry.slug}`,
    shareTitle: `${capitalize(entry.headword)} · Słownik Dziaderski`,
    shareDescription: entry.senses[0].text,
    type: "article",
  });
}

export default async function EntryPage({ params }: PageProps<"/slownik/[slug]">) {
  const entry = entryBySlug((await params).slug);
  if (!entry) notFound();

  const index = DICTIONARY_SORTED.indexOf(entry);
  const previous = DICTIONARY_SORTED[(index - 1 + DICTIONARY_SORTED.length) % DICTIONARY_SORTED.length];
  const next = DICTIONARY_SORTED[(index + 1) % DICTIONARY_SORTED.length];
  const species = entry.species ? speciesByKey(entry.species) : undefined;
  const url = `${site.url}/slownik/${entry.slug}`;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([
            { label: "Słownik Dziaderski", href: "/slownik" },
            { label: entry.headword, href: `/slownik/${entry.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: entry.headword,
            description: entry.senses.map((sense) => sense.text).join(" "),
            url,
            inLanguage: "pl",
            inDefinedTermSet: { "@type": "DefinedTermSet", name: "Słownik Dziaderski", url: `${site.url}/slownik` },
          },
        ]}
      />

      <article aria-labelledby="haslo">
        <PageHeader
          crumbs={[{ label: "Słownik Dziaderski", href: "/slownik" }, { label: entry.headword }]}
          titleId="haslo"
          title={entry.headword}
          lead={
            <p className="italic">
              {entry.grammar} <span className="mx-1.5 not-italic text-ink-faint">|</span> {entry.pronunciation}
            </p>
          }
          meta={`Hasło ${index + 1} z ${DICTIONARY.length}`}
        />

        <div className="wrap grid gap-16 pb-20 pt-12 md:pb-28 md:pt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ol className="space-y-5 border-t border-ink pt-8">
              {entry.senses.map((sense, i) => (
                <li key={sense.text} className="grid grid-cols-[2.25rem_1fr] gap-2 text-[1.35rem] leading-relaxed md:text-[1.5rem]">
                  <span className="font-bold text-red">{i + 1}.</span>
                  <span>
                    {sense.figurative && <i className="text-ink-soft">przen. </i>}
                    {typo(sense.text)}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <p className="label text-ink-soft">Przykład użycia</p>
              <Saying className="mt-2" note={entry.exampleNote}>
                „{entry.example}”
              </Saying>
            </div>

            <Pager
              label="Sąsiednie hasła"
              previous={{ href: `/slownik/${previous.slug}`, label: "Poprzednie hasło", title: previous.headword }}
              next={{ href: `/slownik/${next.slug}`, label: "Następne hasło", title: next.headword }}
            />
          </div>

          <aside className="space-y-12 self-start lg:col-span-5">
            {species && (
              <Link href={`/atlas/${species.slug}`} className="group block border-t border-ink pt-5">
                <span className="label text-ink-soft">Typowa wokalizacja gatunku</span>
                <SpeciesPlate species={species.key} className="mt-3 w-full max-w-sm" />
                <span className="mt-2 block text-2xl font-bold leading-tight transition-colors group-hover:text-red">
                  {species.name} <span aria-hidden="true">→</span>
                </span>
                <span className="block italic text-ink-soft">{species.latin}</span>
              </Link>
            )}

            {entry.seeAlso.length > 0 && (
              <div className="border-t border-ink pt-5">
                <p className="label text-ink-soft">Zobacz też</p>
                <ul className="mt-2">
                  {entry.seeAlso.map((headword) => {
                    const related = entryByHeadword(headword);
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

      <TestPromo
        title="Mówisz tak?"
        text={typo("Test Dziadersa sprawdzi, czy to jeszcze cytat, czy już objaw. Dwadzieścia cztery pytania, około trzech minut.")}
      />
    </main>
  );
}
