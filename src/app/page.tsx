import { AtlasSection } from "@/components/atlas";
import { Briefs } from "@/components/briefs";
import { Departments } from "@/components/departments";
import { DictionarySection } from "@/components/dictionary";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/page";
import { IndexSection } from "@/components/index-section";
import { TestSection } from "@/components/test-section";
import { getBulletin } from "@/lib/bulletin";
import { site } from "@/lib/site";

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
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.institute,
            alternateName: "IBD",
            url: site.url,
            logo: `${site.url}/icon.svg`,
            slogan: site.tagline,
            foundingDate: String(site.founded),
          },
        ]}
      />
      <Hero bulletin={bulletin} />
      <Briefs bulletin={bulletin} />
      <TestSection />
      <AtlasSection week={bulletin.week} />
      <IndexSection bulletin={bulletin} />
      <DictionarySection bulletin={bulletin} />
      <Departments />
    </main>
  );
}
