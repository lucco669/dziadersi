import type { Metadata } from "next";
import { JsonLd, breadcrumbList } from "@/components/page";
import { TestRunner } from "@/components/test-runner";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Test Dziadersa";
const description =
  "Test Dziadersa: 24 pytania z życia codziennego, około trzech minut. Wynik od 0 do 100%, rozpoznanie gatunku według Atlasu Dziadersów i certyfikat do udostępnienia.";

export const metadata: Metadata = pageMetadata({
  title: "Test Dziadersa: sprawdź, ile masz w sobie dziadersa",
  description,
  path: "/test",
  shareTitle: `${title} · ${site.name}`,
  shareDescription: "24 pytania, około trzech minut. Wynik, rozpoznanie gatunku i certyfikat. Zbadaj się, zanim będzie za późno.",
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
            timeRequired: "PT3M",
            publisher: institute,
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
        ]}
      />
      <TestRunner />
    </main>
  );
}
