import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Saying } from "@/components/saying";
import { DICTIONARY, DICTIONARY_SORTED } from "@/content/dictionary";
import { getBulletin } from "@/lib/bulletin";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, typo } from "@/lib/typo";

const title = "Słownik Dziaderski";
const description = `${DICTIONARY.length} zwrotów, które każdy słyszał przy rodzinnym stole, od „za moich czasów” po „diesel to jest diesel”. Znaczenie, wymowa i przykłady użycia.`;

export const metadata: Metadata = pageMetadata({
  title: "Słownik Dziaderski: zwroty dziadersa z objaśnieniami",
  description,
  path: "/slownik",
  shareTitle: `${title} · ${site.name}`,
});

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
            publisher: institute,
            hasDefinedTerm: DICTIONARY.map((entry) => ({
              "@type": "DefinedTerm",
              name: entry.headword,
              description: entry.senses[0].text,
              url: `${site.url}/slownik/${entry.slug}`,
            })),
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Zwroty, wykrzyknienia i formuły, które każdy słyszał przy rodzinnym stole. Opracowane naukowo, objaśnione bez litości, z przykładami użycia zebranymi w terenie.",
        )}
        meta={`${DICTIONARY.length} ${plural(DICTIONARY.length, "hasło", "hasła", "haseł")} · wydanie pierwsze, ${site.founded}`}
      />

      <Section id="haslo-dnia" title="Hasło dnia" aside={bulletin.date}>
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[clamp(2.6rem,6vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.02em]">
              <Link href={`/slownik/${today.slug}`} className="transition-colors hover:text-red">
                {today.headword}
              </Link>
            </p>
            <p className="mt-3 italic text-ink-soft">
              {today.grammar} · {today.pronunciation}
            </p>
            <p className="mt-5 max-w-xl text-[1.25rem] leading-relaxed">{typo(today.senses[0].text)}</p>
          </div>
          <Saying className="lg:col-span-5">„{today.example}”</Saying>
        </div>
      </Section>

      <Section id="hasla" title="Hasła od A do Ż">
        <nav aria-label="Litery" className="flex flex-wrap gap-2">
          {GROUPS.map((group) => (
            <a
              key={group.letter}
              href={`#litera-${group.letter}`}
              className="grid size-10 place-items-center border border-ink text-lg font-bold transition-colors hover:bg-ink hover:text-paper"
            >
              {group.letter}
            </a>
          ))}
        </nav>
        <div className="mt-8 border-t border-ink">
          {GROUPS.map((group) => (
            <section
              key={group.letter}
              id={`litera-${group.letter}`}
              aria-label={`Litera ${group.letter}`}
              className="grid scroll-mt-6 gap-x-10 border-b border-rule py-7 md:grid-cols-[5rem_1fr]"
            >
              <p className="text-6xl font-bold leading-none text-red" aria-hidden="true">
                {group.letter}
              </p>
              <ul className="mt-4 grid gap-x-10 md:mt-0 md:grid-cols-2">
                {group.entries.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/slownik/${entry.slug}`} className="group block py-3">
                      <span className="block text-xl font-bold leading-tight transition-colors group-hover:text-red">
                        {entry.headword}
                      </span>
                      <span className="mt-0.5 block italic text-ink-soft">{entry.grammar}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <TestPromo
        title="Używasz tych zwrotów?"
        text={typo("Test Dziadersa sprawdzi, czy to jeszcze cytat, czy już objaw. Pięć gabinetów, około czterech minut.")}
      />
    </main>
  );
}
