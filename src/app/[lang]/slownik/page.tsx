import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Saying } from "@/components/saying";
import { getDictionary, getDictionarySorted, type Entry } from "@/content/dictionary";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getBulletin } from "@/lib/bulletin";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, pluralSl, quote, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Słownik Dziaderski",
    metaTitle: "Słownik Dziaderski: zwroty dziadersa z objaśnieniami",
    description: (count: number) =>
      `${count} zwrotów, które każdy słyszał przy rodzinnym stole, od „za moich czasów” po „diesel to jest diesel”. Znaczenie, wymowa i przykłady użycia.`,
    lead: "Zwroty, wykrzyknienia i formuły, które każdy słyszał przy rodzinnym stole. Opracowane naukowo, objaśnione bez litości, z przykładami użycia zebranymi w terenie.",
    meta: (count: number) => `${count} ${plural(count, "hasło", "hasła", "haseł")} · wydanie pierwsze, ${site.founded}`,
    today: "Hasło dnia",
    index: "Hasła od A do Ż",
    letters: "Litery",
    letter: (letter: string) => `Litera ${letter}`,
    /** Before the Polish headword; the Polish edition has none to show. */
    original: "oryg.",
    promoTitle: "Używasz tych zwrotów?",
    promoText: "Test Dziadersa sprawdzi, czy to jeszcze cytat, czy już objaw. Pięć gabinetów, około czterech minut.",
  },
  sl: {
    title: "Dziaderski slovar",
    metaTitle: "Dziaderski slovar: reki dziadersov z razlagami",
    description: (count: number) =>
      `${count} ${pluralSl(count, "rek", "reka", "reki", "rekov")}, ki jih je vsak slišal za družinsko mizo, od »v mojih časih« do »dizel je dizel«. Pomen, izgovorjava, primeri rabe in poljski izvirnik.`,
    lead: "Reki, medmeti in formule, ki jih je vsak slišal za družinsko mizo. Znanstveno obdelani, razloženi brez usmiljenja, s primeri rabe, zbranimi na terenu. Ob vsakem geslu je naveden poljski izvirnik.",
    meta: (count: number) => `${count} ${pluralSl(count, "geslo", "gesli", "gesla", "gesel")} · prva slovenska izdaja, ${site.founded}`,
    today: "Geslo dneva",
    index: "Gesla od A do Ž",
    letters: "Črke",
    letter: (letter: string) => `Črka ${letter}`,
    original: "polj.",
    promoTitle: "Uporabljaš te reke?",
    promoText: "Test dziadersa bo preveril, ali je to še citat ali že simptom. Pet ordinacij, približno štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description(getDictionary(locale).length),
    path: "/slownik",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

/** Entries under their initial, in the edition's alphabet: Slovenian Č, Š and Ž are letters of their own. */
function letterGroups(entries: Entry[], locale: Locale) {
  return entries.reduce<{ letter: string; entries: Entry[] }[]>((groups, entry) => {
    const letter = entry.headword.charAt(0).toLocaleUpperCase(LOCALE_INFO[locale].tag);
    const last = groups.at(-1);
    if (last?.letter === letter) last.entries.push(entry);
    else groups.push({ letter, entries: [entry] });
    return groups;
  }, []);
}

export default async function DictionaryPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const bulletin = await getBulletin(locale);
  const entries = getDictionary(locale);
  const groups = letterGroups(getDictionarySorted(locale), locale);
  const today = entries[bulletin.today % entries.length];

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/slownik" }]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: t.title,
            description: t.description(entries.length),
            url: absoluteUrl("/slownik", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
            hasDefinedTerm: entries.map((entry) => ({
              "@type": "DefinedTerm",
              name: entry.headword,
              description: entry.senses[0].text,
              url: absoluteUrl(`/slownik/${entry.slug}`, locale),
            })),
          },
        ]}
      />

      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(entries.length)} />

      <Section id="haslo-dnia" title={t.today} aside={bulletin.date}>
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
            {today.original && (
              <p className="label mt-2 text-ink-faint">
                {t.original} <span lang="pl">{today.original}</span>
              </p>
            )}
            <p className="mt-5 max-w-xl text-[1.25rem] leading-relaxed">{typo(today.senses[0].text)}</p>
          </div>
          <Saying className="lg:col-span-5">{quote(today.example, locale)}</Saying>
        </div>
      </Section>

      <Section id="hasla" title={t.index}>
        <nav aria-label={t.letters} className="flex flex-wrap gap-2">
          {groups.map((group) => (
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
          {groups.map((group) => (
            <section
              key={group.letter}
              id={`litera-${group.letter}`}
              aria-label={t.letter(group.letter)}
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
                      {entry.original && (
                        <span className="label mt-0.5 block text-ink-faint">
                          {t.original} <span lang="pl">{entry.original}</span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
