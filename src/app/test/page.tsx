import type { Metadata } from "next";
import { JsonLd, breadcrumbList } from "@/components/page";
import { TestRunner } from "@/components/test-runner";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Test Dziadersa";
const description =
  "Test Dziadersa: badanie okresowe w pięciu gabinetach, od plansz Rorschacha po próbę klaksonową. Wynik w procentach, rozpoznanie gatunku i certyfikat.";

export const metadata: Metadata = pageMetadata({
  title: "Test Dziadersa: sprawdź, ile masz w sobie dziadersa",
  description,
  path: "/test",
  shareTitle: `${title} · ${site.name}`,
  shareDescription: "Pięć gabinetów, około czterech minut. Plansze Rorschacha, próba klaksonowa, szuflada. Zbadaj się, zanim będzie za późno.",
});

export default function TestPage() {
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/test" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url: `${site.url}/test`,
            inLanguage: "pl",
            timeRequired: "PT4M",
            publisher: institute,
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
        ]}
      />
      <TestRunner />
    </main>
  );
}
