import type { Metadata } from "next";
import { AtlasPlates, Hero, IndexBand, Shelf, TestBand } from "@/components/home";
import { JsonLd } from "@/components/page";
import { getBulletin } from "@/lib/bulletin";
import { institute, pageMetadata } from "@/lib/seo";
import { SECTIONS, site } from "@/lib/site";

const title = `${site.name} · ${site.institute}: Test Dziadersa`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: site.name,
    description: site.description,
    path: "/",
    shareTitle: `${site.name} · ${site.institute}`,
    shareDescription: "Test Dziadersa, Atlas Dziadersów i Narodowy Indeks Dziaderstwa. Zbadaj się, zanim będzie za późno.",
  }),
  title: { absolute: title },
};

export default async function Home() {
  const bulletin = await getBulletin();
  const website = { "@id": `${site.url}/#serwis` };
  const publisher = { "@id": institute["@id"] };

  return (
    <main id="tresc">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            ...website,
            name: site.name,
            alternateName: site.institute,
            url: site.url,
            description: site.description,
            inLanguage: "pl",
            publisher,
          },
          {
            "@context": "https://schema.org",
            ...institute,
            alternateName: "IBD",
            slogan: site.tagline,
            foundingDate: String(site.founded),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${site.url}/#strona`,
            url: site.url,
            name: title,
            description: site.description,
            inLanguage: "pl",
            isPartOf: website,
            about: publisher,
            author: publisher,
            publisher,
            datePublished: site.launched,
            dateModified: bulletin.updated,
            primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}/opengraph-image` },
            mainEntity: {
              "@type": "ItemList",
              name: "Działy Instytutu",
              numberOfItems: SECTIONS.length,
              itemListElement: SECTIONS.map((section, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: section.label,
                description: section.summary,
                url: `${site.url}${section.href}`,
              })),
            },
          },
        ]}
      />
      <Hero />
      <IndexBand bulletin={bulletin} />
      <AtlasPlates />
      <TestBand />
      <Shelf bulletin={bulletin} />
    </main>
  );
}
