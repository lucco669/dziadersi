import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { publicationSchema } from "@/components/fieldwork-parts";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { getGuide } from "@/content/guide";
import { getSpecies } from "@/content/species";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    definition: "Co znaczy „dziaders”?",
    origin: "Skąd się wziął dziaders? Pochodzenie i historia słowa",
    signs: "Jak rozpoznać dziadersa: cztery zachowania",
    difference: "Co odróżnia dziaderstwo od zwykłych przyzwyczajeń?",
    relatives: "Dziaders, dziad, dziadostwo, boomer: słowa pokrewne i mylone",
    relativesHead: ["Słowo", "Co znaczy", "Czym różni się od dziadersa"],
    settings: "Dziaders w pracy, w domu i w internecie",
    species: "Gatunek w Atlasie:",
    usage: "Odmiana i przykłady użycia",
    usageHead: ["Przypadek", "Liczba pojedyncza", "Liczba mnoga"],
    examples: "W zdaniu",
    more: "Więcej",
    woman: "Dziaders — kobieta też? Dziaderstwo bez względu na płeć",
    atlas: "Jedno zjawisko, różne gatunki",
    questions: "Najczęstsze pytania",
    next: "Wybierz dalszy kierunek",
    occasions: "Przewodniki na rodzinne okazje",
    dictionary: "Słownik charakterystycznych zwrotów",
    museum: "Muzeum rzeczy zachowanych na wszelki wypadek",
    promo: "Obserwację zacznij od siebie.",
    promoText:
      "Pięć gabinetów, około czterech minut i certyfikat. Wynik można wysłać rodzinie; uzasadnienia przyjmuje Komisja.",
  },
  sl: {
    definition: "Kaj pomeni »dziaders«?",
    origin: "Od kod dziaders? Izvor in zgodovina besede",
    signs: "Kako prepoznati dziadersa: štiri vedenja",
    difference: "Kaj loči dziaderstvo od običajnih navad?",
    relatives: "Dziaders, dziad, dziadostwo, boomer: sorodne in zamenljive besede",
    relativesHead: ["Beseda", "Kaj pomeni", "Razlika od dziadersa"],
    settings: "Dziaders v službi, doma in na spletu",
    species: "Vrsta v Atlasu:",
    usage: "Sklanjatev in primeri rabe",
    usageHead: ["Sklon", "Ednina", "Množina"],
    examples: "V stavku",
    more: "Več",
    woman: "Dziaders — tudi ženska? Dziaderstvo ne glede na spol",
    atlas: "En pojav, različne vrste",
    questions: "Pogosta vprašanja",
    next: "Izberi naslednjo smer",
    occasions: "Vodniki za družinske priložnosti",
    dictionary: "Slovar značilnih izrazov",
    museum: "Muzej stvari, ohranjenih za vsak primer",
    promo: "Opazovanje začni pri sebi.",
    promoText:
      "Pet ordinacij, približno štiri minute in certifikat. Rezultat lahko pošlješ družini; utemeljitve sprejema Komisija.",
  },
});
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const guide = getGuide(locale);
  return pageMetadata(locale, { title: guide.metaTitle, description: guide.lead, path: "/dziaders", type: "article" });
}
export default async function GuidePage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const guide = getGuide(locale);
  const all = getSpecies(locale);
  const species = all.filter((item) => ["grill", "budowa", "korpo"].includes(item.key));
  const byKey = new Map(all.map((item) => [item.key, item]));
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: guide.title }]),
          {
            ...publicationSchema(locale, "/dziaders", guide.title, guide.lead, "Article"),
            about: { "@type": "DefinedTerm", name: "dziaders", description: guide.definition, inLanguage: LOCALE_INFO[locale].tag },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: absoluteUrl("/dziaders", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            mainEntity: guide.questions.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: guide.title }]}
        title={guide.title}
        lead={typo(guide.lead)}
        aside={<SpeciesPlate species="korpo" className="mx-auto w-64 max-w-full" />}
      />
      <Section id="znaczenie" title={t.definition}>
        <div className="max-w-3xl space-y-5">
          <p className="text-2xl leading-snug">{typo(guide.definition)}</p>
          <p className="text-ink-soft">{typo(guide.context)}</p>
        </div>
      </Section>
      <Section id="pochodzenie" title={t.origin}>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
          {guide.origin.map((text) => (
            <p key={text}>{typo(text)}</p>
          ))}
        </div>
      </Section>
      <Section id="zachowania" title={t.signs}>
        <ol className="grid gap-8 md:grid-cols-2">
          {guide.signs.map((item, i) => (
            <li key={item.title} className="border-l-2 border-red pl-6">
              <p className="label text-red">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{typo(item.text)}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="roznice" title={t.difference}>
        <div className="grid gap-8 md:grid-cols-3">
          {guide.distinction.map((item) => (
            <article key={item.title}>
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{typo(item.text)}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section id="slowa" title={t.relatives}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-t border-ink text-left">
            <thead>
              <tr className="label text-ink-soft">
                {t.relativesHead.map((label) => (
                  <th key={label} scope="col" className="border-b border-rule py-3 pr-6 font-normal">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.relatives.map((row) => (
                <tr key={row.word} className="border-b border-rule align-top">
                  <th scope="row" className="py-4 pr-6 text-xl font-bold">
                    {row.word}
                  </th>
                  <td className="py-4 pr-6">{typo(row.meaning)}</td>
                  <td className="py-4 text-ink-soft">{typo(row.difference)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="odmiana" title={t.usage} intro={typo(guide.usage.intro)}>
        <div className="grid gap-10 lg:grid-cols-2">
          <table className="w-full border-t border-ink text-left">
            <thead>
              <tr className="label text-ink-soft">
                {t.usageHead.map((label) => (
                  <th key={label} scope="col" className="border-b border-rule py-3 pr-4 font-normal">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.usage.cases.map((row) => (
                <tr key={row.name} className="border-b border-rule">
                  <th scope="row" className="label py-3 pr-4 font-normal text-ink-soft">
                    {row.name}
                  </th>
                  <td className="py-3 pr-4 text-lg font-bold">{row.singular}</td>
                  <td className="py-3 text-lg font-bold">{row.plural}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <h3 className="label text-ink-soft">{t.examples}</h3>
            <ul className="mt-4 space-y-3 text-lg">
              {guide.usage.examples.map((example) => (
                <li key={example} className="border-l-2 border-red pl-4">
                  {typo(example)}
                </li>
              ))}
            </ul>
            <p className="label mt-6 text-ink-soft">{typo(guide.usage.note)}</p>
          </div>
        </div>
      </Section>
      <Section id="gdzie" title={t.settings}>
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {guide.settings.map((item) => {
            const kind = byKey.get(item.species)!;
            return (
              <article key={item.title} className="border-t border-rule pt-5">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 text-ink-soft">{typo(item.text)}</p>
                <p className="label mt-4 text-ink-soft">
                  {t.species}{" "}
                  <Link href={"/atlas/" + kind.slug} className="link text-ink">
                    {kind.name}
                  </Link>
                </p>
              </article>
            );
          })}
        </div>
      </Section>
      <Section id="gatunki" title={t.atlas}>
        <div className="grid gap-8 sm:grid-cols-3">
          {species.map((item) => (
            <Link key={item.key} href={"/atlas/" + item.slug} className="group">
              <SpeciesPlate species={item.key} className="mx-auto h-40 w-52 max-w-full" />
              <h3 className="mt-4 text-2xl font-bold group-hover:text-red">{item.name}</h3>
              <p className="mt-2 text-ink-soft">{typo(item.teaser)}</p>
            </Link>
          ))}
        </div>
      </Section>
      <Section id="pytania" title={t.questions}>
        <div className="max-w-3xl divide-y divide-rule">
          {guide.questions.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="cursor-pointer text-xl font-bold hover:text-red">{item.question}</summary>
              <p className="mt-4 leading-relaxed text-ink-soft">{typo(item.answer)}</p>
              {item.href && (
                <p className="mt-3 font-sans">
                  <Link href={item.href} className="link">
                    {t.more} →
                  </Link>
                </p>
              )}
            </details>
          ))}
        </div>
      </Section>
      <Section id="dalej" title={t.next}>
        <ul className="space-y-4 font-sans text-lg">
          <li>
            <Link href="/dziaders/kobieta" className="link">
              {t.woman} →
            </Link>
          </li>
          <li>
            <Link href="/okazje" className="link">
              {t.occasions} →
            </Link>
          </li>
          <li>
            <Link href="/slownik" className="link">
              {t.dictionary} →
            </Link>
          </li>
          <li>
            <Link href="/muzeum" className="link">
              {t.museum} →
            </Link>
          </li>
        </ul>
        <div className="mt-10">
          <ShareBar path="/dziaders" text={guide.title} kind="przewodnik" />
        </div>
      </Section>
      <TestPromo title={t.promo} text={t.promoText} />
    </main>
  );
}
