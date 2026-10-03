import type { Metadata } from "next";
import { JsonLd, breadcrumbList } from "@/components/page";
import { TestRunner } from "@/components/test-runner";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const COPY = defineCopy({
  pl: {
    title: "Test Dziadersa",
    browserTitle: "Test Dziadersa: sprawdź, ile masz w sobie dziadersa",
    description:
      "Test Dziadersa: badanie okresowe w pięciu gabinetach, od plansz Rorschacha po próbę klaksonową. Wynik w procentach, rozpoznanie gatunku i certyfikat.",
    shareDescription: "Pięć gabinetów, około czterech minut. Plansze Rorschacha, próba klaksonowa, szuflada. Zbadaj się, zanim będzie za późno.",
  },
  sl: {
    title: "Test dziadersa",
    browserTitle: "Test dziadersa: preveri, koliko dziadersa je v tebi",
    description:
      "Test dziadersa: obdobni pregled v petih ordinacijah, od Rorschachovih tabel do preizkusa s hupo. Izvid v odstotkih, diagnoza vrste in certifikat.",
    shareDescription: "Pet ordinacij, približno štiri minute. Rorschachove table, preizkus s hupo, predal. Preglej se, preden bo prepozno.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/test",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function TestPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/test" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/test", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            timeRequired: "PT4M",
            publisher: institute(locale),
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
        ]}
      />
      <TestRunner />
    </main>
  );
}
