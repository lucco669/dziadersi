import type { Metadata } from "next";
import { AtlasPlates, Hero, IndexBand, Shelf, TestBand } from "@/components/home";
import { JsonLd } from "@/components/page";
import { getBulletin } from "@/lib/bulletin";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: site.name,
    description: site.description,
    path: "/",
    shareTitle: `${site.name} · ${site.institute}`,
    shareDescription: "Test Dziadersa, Atlas Dziadersów i Narodowy Indeks Dziaderstwa. Zbadaj się, zanim będzie za późno.",
  }),
  title: { absolute: `${site.name} · ${site.institute}: Test Dziadersa i Atlas Dziadersów` },
};

export default async function Home() {
  const bulletin = await getBulletin();

  return (
    <main id="tresc">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            alternateName: site.institute,
            url: site.url,
            description: site.description,
            inLanguage: "pl",
            publisher: institute,
          },
          {
            "@context": "https://schema.org",
            ...institute,
            alternateName: "IBD",
            slogan: site.tagline,
            foundingDate: String(site.founded),
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
