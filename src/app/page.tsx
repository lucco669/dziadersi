import { AtlasSection } from "@/components/atlas";
import { Briefs } from "@/components/briefs";
import { Departments } from "@/components/departments";
import { DictionarySection } from "@/components/dictionary";
import { Hero } from "@/components/hero";
import { IndexSection } from "@/components/index-section";
import { TestSection } from "@/components/test-section";
import { getBulletin } from "@/lib/bulletin";

export default async function Home() {
  const bulletin = await getBulletin();

  return (
    <main id="tresc">
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
