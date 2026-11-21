import type { Metadata } from "next";
import { JsonLd, breadcrumbList } from "@/components/page";
import { TableRunner } from "@/components/table-runner";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const COPY = defineCopy({
  pl: {
    test: "Test Dziadersa",
    title: "Badanie przy stole",
    browserTitle: "Test Dziadersa przy stole: cała rodzina, jeden telefon",
    description:
      "Test Dziadersa dla całego stołu: od dwóch do ośmiu osób na jednym telefonie, sześć zadań na osobę, a na końcu wspólny ranking, zgodność dziaderska i certyfikat dla każdego.",
    shareDescription: "Jeden telefon, cały stół. Sześć zadań na osobę, wyniki ogłaszane wszystkim naraz.",
  },
  sl: {
    test: "Test dziadersa",
    title: "Pregled za mizo",
    browserTitle: "Test dziadersa za mizo: vsa družina, en telefon",
    description:
      "Test dziadersa za vso mizo: od dveh do osmih oseb na enem telefonu, šest nalog na osebo, na koncu skupna lestvica, dziaderska združljivost in certifikat za vsakogar.",
    shareDescription: "En telefon, vsa miza. Šest nalog na osebo, izvidi razglašeni vsem hkrati.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/test/przy-stole",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function TablePage() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.test, href: "/test" }, { label: t.title, href: "/test/przy-stole" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/test/przy-stole", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
        ]}
      />
      <TableRunner />
    </main>
  );
}
