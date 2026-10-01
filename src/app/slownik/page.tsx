import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd, PageHeading, TestCallout, breadcrumbList } from "@/components/page";
import { DICTIONARY, DICTIONARY_SORTED } from "@/content/dictionary";
import { getBulletin } from "@/lib/bulletin";
import { site } from "@/lib/site";
import { plural, typo } from "@/lib/typo";

const title = "Słownik Dziaderski";
const description = `${DICTIONARY.length} zwrotów, wykrzyknień i formuł, które każdy słyszał przy rodzinnym stole, od „za moich czasów” po „diesel to jest diesel”. Z definicjami, wymową i przykładami użycia.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/slownik" },
  openGraph: { type: "website", locale: "pl_PL", siteName: site.name, url: "/slownik", title: `${title} · ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
};

const initial = (headword: string) => headword.charAt(0).toLocaleUpperCase("pl");

const GROUPS = DICTIONARY_SORTED.reduce<{ letter: string; entries: typeof DICTIONARY }[]>((groups, entry) => {
  const letter = initial(entry.headword);
  const last = groups.at(-1);
  if (last?.letter === letter) last.entries.push(entry);
  else groups.push({ letter, entries: [entry] });
  return groups;
}, []);

export default async function DictionaryPage() {
  const bulletin = await getBulletin();
  const today = DICTIONARY[bulletin.today % DICTIONARY.length];

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/slownik" }]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: title,
            description,
            url: `${site.url}/slownik`,
            inLanguage: "pl",
            hasDefinedTerm: DICTIONARY.map((entry) => ({
              "@type": "DefinedTerm",
              name: entry.headword,
              description: entry.senses[0].text,
              url: `${site.url}/slownik/${entry.slug}`,
            })),
          },
        ]}
      />

      <div className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
        <Breadcrumbs crumbs={[{ label: title }]} />
        <PageHeading
          className="mt-8"
          kicker={
            <>
              § Leksykografia <span className="mx-1.5 opacity-50">/</span> Wydanie pierwsze
            </>
          }
          aside={`${DICTIONARY.length} ${plural(DICTIONARY.length, "hasło", "hasła", "haseł")}`}
          title={title}
          lead={typo(
            "Zwroty, wykrzyknienia i formuły, które każdy słyszał przy rodzinnym stole. Opracowane naukowo, objaśnione bez litości, z przykładami użycia zebranymi w terenie.",
          )}
        />

        <Link
          href={`/slownik/${today.slug}`}
          className="group mt-14 block border border-ink bg-paper-light px-5 py-7 md:px-8 md:py-9"
        >
          <span className="kicker flex justify-between gap-4">
            <span className="text-bordo">Hasło dnia</span>
            <span className="text-ink-faint">{bulletin.date}</span>
          </span>
          <span className="mt-4 block font-display text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em] transition-colors group-hover:text-green">
            {today.headword}
          </span>
          <span className="mt-3 block text-lg text-ink-soft">
            <em>{today.grammar}</em> · {typo(today.senses[0].text)}
          </span>
        </Link>

        <nav aria-label="Litery" className="mt-14 flex flex-wrap gap-2 border-y border-ink py-4">
          {GROUPS.map((group) => (
            <a
              key={group.letter}
              href={`#litera-${group.letter}`}
              className="grid size-9 place-items-center border border-ink/30 font-display text-lg font-bold transition-colors hover:bg-ink hover:text-paper"
            >
              {group.letter}
            </a>
          ))}
        </nav>

        <div className="mt-6">
          {GROUPS.map((group) => (
            <section
              key={group.letter}
              id={`litera-${group.letter}`}
              aria-label={`Litera ${group.letter}`}
              className="grid scroll-mt-28 gap-x-10 border-b border-rule py-8 md:grid-cols-[6rem_1fr]"
            >
              <p className="font-display text-6xl font-black leading-none text-bordo" aria-hidden="true">
                {group.letter}
              </p>
              <ul className="mt-4 grid gap-x-10 md:mt-0 md:grid-cols-2">
                {group.entries.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/slownik/${entry.slug}`} className="group block py-3.5">
                      <span className="block font-display text-xl font-semibold leading-tight transition-colors group-hover:text-green">
                        {entry.headword}
                      </span>
                      <span className="mt-0.5 block text-[0.92rem] italic text-ink-soft">{entry.grammar}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <TestCallout
        title="Używasz tych zwrotów?"
        text={typo("Test Dziadersa sprawdzi, czy to jeszcze cytat, czy już objaw. Dwadzieścia cztery pytania, około trzech minut.")}
      />
    </main>
  );
}
