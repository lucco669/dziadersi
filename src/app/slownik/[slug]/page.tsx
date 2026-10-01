import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd, TestCallout, breadcrumbList } from "@/components/page";
import { DICTIONARY, DICTIONARY_SORTED, entryByHeadword, entryBySlug } from "@/content/dictionary";
import { speciesByKey } from "@/content/species";
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
  const title = `„${capitalize(entry.headword)}”: znaczenie i przykłady`;
  const description = `${capitalize(entry.headword)}: ${entry.grammar}. ${entry.senses[0].text} Słownik Dziaderski.`;
  return {
    title,
    description,
    alternates: { canonical: `/slownik/${entry.slug}` },
    openGraph: {
      type: "article",
      locale: "pl_PL",
      siteName: site.name,
      url: `/slownik/${entry.slug}`,
      title: `${capitalize(entry.headword)} · Słownik Dziaderski`,
      description: entry.senses[0].text,
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalize(entry.headword)} · Słownik Dziaderski`,
      description: entry.senses[0].text,
    },
  };
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

      <article aria-labelledby="haslo" className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
        <Breadcrumbs crumbs={[{ label: "Słownik Dziaderski", href: "/slownik" }, { label: entry.headword }]} />
        <div className="kicker mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-ink pt-4">
          <p>
            § Leksykografia <span className="mx-1.5 opacity-50">/</span> Słownik Dziaderski
          </p>
          <p className="text-ink-faint">
            Hasło {index + 1} z {DICTIONARY.length}
          </p>
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <h1
              id="haslo"
              className="font-display text-[clamp(3rem,8vw,6.25rem)] font-black leading-[0.9] tracking-[-0.035em]"
            >
              {entry.headword}
            </h1>
            <p className="mt-6 text-xl text-ink-soft">
              <em>{entry.grammar}</em>
              <span className="mx-2.5 text-rule">|</span>
              {entry.pronunciation}
            </p>

            <ol className="mt-10 space-y-5 border-t border-ink pt-8">
              {entry.senses.map((sense, i) => (
                <li key={sense.text} className="grid grid-cols-[2.25rem_1fr] gap-2 text-xl leading-relaxed md:text-[1.5rem]">
                  <span className="font-display font-bold">{i + 1}.</span>
                  <span>
                    {sense.figurative && <em className="text-ink-soft">przen. </em>}
                    {typo(sense.text)}
                  </span>
                </li>
              ))}
            </ol>

            <blockquote className="mt-10 border-l-[3px] border-bordo pl-6">
              <p className="kicker text-ink-faint">Przykład użycia</p>
              <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.25rem)] italic leading-snug">„{entry.example}”</p>
              {entry.exampleNote && <p className="kicker mt-3 text-ink-faint">{entry.exampleNote}</p>}
            </blockquote>
          </div>

          <aside className="space-y-10 self-start lg:col-span-4 lg:pt-4">
            {species && (
              <div className="border border-ink bg-paper-light">
                <p className="kicker border-b border-ink px-5 py-3">Typowa wokalizacja gatunku</p>
                <Link href={`/atlas/${species.slug}`} className="group block px-5 py-5">
                  <span className="kicker text-ink-faint">{species.code}</span>
                  <span className="mt-1 block font-display text-2xl font-bold leading-tight transition-colors group-hover:text-green">
                    {species.name} <span aria-hidden="true">→</span>
                  </span>
                  <span className="mt-1 block text-ink-soft">
                    <em>{species.latin}</em>
                  </span>
                </Link>
              </div>
            )}

            {entry.seeAlso.length > 0 && (
              <div>
                <p className="kicker border-b-2 border-ink pb-3">Zobacz też</p>
                <ul>
                  {entry.seeAlso.map((headword) => {
                    const related = entryByHeadword(headword);
                    return (
                      <li key={headword} className="border-b border-rule py-3">
                        {related ? (
                          <Link href={`/slownik/${related.slug}`} className="font-display text-xl italic transition-colors hover:text-green">
                            {headword}
                          </Link>
                        ) : (
                          <span className="font-display text-xl italic">{headword}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>

        <nav aria-label="Sąsiednie hasła" className="mt-16 grid gap-4 border-t border-ink pt-6 sm:grid-cols-2">
          <Link href={`/slownik/${previous.slug}`} className="group">
            <span className="kicker text-ink-faint">← Poprzednie hasło</span>
            <span className="mt-1 block font-display text-xl font-semibold transition-colors group-hover:text-green">
              {previous.headword}
            </span>
          </Link>
          <Link href={`/slownik/${next.slug}`} className="group sm:text-right">
            <span className="kicker text-ink-faint">Następne hasło →</span>
            <span className="mt-1 block font-display text-xl font-semibold transition-colors group-hover:text-green">
              {next.headword}
            </span>
          </Link>
        </nav>
      </article>

      <TestCallout
        title="Mówisz tak?"
        text={typo("Test Dziadersa sprawdzi, czy to jeszcze cytat, czy już objaw. Dwadzieścia cztery pytania, około trzech minut.")}
      />
    </main>
  );
}
