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
    signs: "Cztery zachowania do obserwacji",
    difference: "Co odróżnia dziaderstwo od zwykłych przyzwyczajeń?",
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
    signs: "Štiri vedenja za opazovanje",
    difference: "Kaj loči dziaderstvo od običajnih navad?",
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
  const species = getSpecies(locale).filter((item) => ["grill", "budowa", "korpo"].includes(item.key));
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
            </details>
          ))}
        </div>
      </Section>
      <Section id="dalej" title={t.next}>
        <ul className="space-y-4 font-sans text-lg">
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
