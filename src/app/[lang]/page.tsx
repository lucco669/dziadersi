import type { Metadata } from "next";
import { AtlasPlates, CaseOfTheDay, Hero, IndexBand, Shelf, TestBand } from "@/components/home";
import { JsonLd } from "@/components/page";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { getBulletin } from "@/lib/bulletin";
import { getCommunity } from "@/lib/community";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { sections, site, siteCopy } from "@/lib/site";

const COPY = defineCopy({
  pl: {
    test: "Test Dziadersa",
    share: "Test Dziadersa, Atlas Dziadersów i Narodowy Indeks Dziaderstwa. Zbadaj się, zanim będzie za późno.",
    departments: "Działy Instytutu",
    query: "zapytanie",
  },
  sl: {
    test: "Test dziadersa",
    share: "Test dziadersa, Atlas dziadersov in Nacionalni indeks dziaderstva. Preglej se, preden bo prepozno.",
    departments: "Oddelki Inštituta",
    query: "poizvedba",
  },
});

const titleOf = (institute: string, test: string) => `${site.name} · ${institute}: ${test}`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = siteCopy(locale);
  const t = COPY[locale];
  return {
    ...pageMetadata(locale, {
      title: site.name,
      description: copy.description,
      path: "/",
      shareTitle: `${site.name} · ${copy.institute}`,
      shareDescription: t.share,
    }),
    title: { absolute: titleOf(copy.institute, t.test) },
  };
}

export default async function Home() {
  const locale = await getLocale();
  const copy = siteCopy(locale);
  const t = COPY[locale];
  const [bulletin, community] = await Promise.all([getBulletin(locale), getCommunity()]);
  const home = absoluteUrl("/", locale);
  const language = LOCALE_INFO[locale].tag;
  const website = { "@id": `${site.url}/#serwis` };
  const publisher = { "@id": institute(locale)["@id"] };

  return (
    <main id="tresc">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            ...website,
            name: site.name,
            alternateName: copy.institute,
            url: site.url,
            description: copy.description,
            inLanguage: language,
            publisher,
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/szukaj", locale)}?q={${t.query}}` },
              "query-input": `required name=${t.query}`,
            },
          },
          {
            "@context": "https://schema.org",
            ...institute(locale),
            alternateName: "IBD",
            slogan: copy.tagline,
            foundingDate: String(site.founded),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${home}/#strona`,
            url: home,
            name: titleOf(copy.institute, t.test),
            description: copy.description,
            inLanguage: language,
            isPartOf: website,
            about: publisher,
            author: publisher,
            publisher,
            datePublished: site.launched,
            dateModified: bulletin.updated,
            primaryImageOfPage: { "@type": "ImageObject", url: `${home}/opengraph-image` },
            mainEntity: {
              "@type": "ItemList",
              name: t.departments,
              numberOfItems: sections(locale).length,
              itemListElement: sections(locale).map((section, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: section.label,
                description: section.summary,
                url: absoluteUrl(section.href, locale),
              })),
            },
          },
        ]}
      />
      <Hero locale={locale} />
      <TestBand locale={locale} />
      <AtlasPlates locale={locale} />
      <CaseOfTheDay bulletin={bulletin} counts={community?.verdicts.cases ?? null} locale={locale} />
      <IndexBand bulletin={bulletin} locale={locale} />
      <Shelf bulletin={bulletin} locale={locale} />
    </main>
  );
}
