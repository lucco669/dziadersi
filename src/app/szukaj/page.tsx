import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import { SearchPage } from "@/components/search";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

export const metadata: Metadata = pageMetadata({
  title: "Wyszukiwarka Instytutu",
  description: "Szukaj w zbiorach Instytutu Badań nad Dziaderstwem: gatunki z Atlasu, hasła ze Słownika, sprawy Komisji Orzekającej, raporty i działy.",
  path: "/szukaj",
  noindex: true,
});

export default function SearchRoute() {
  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: "Wyszukiwarka" }]}
        title="Wyszukiwarka"
        lead={typo("Gatunki, hasła, sprawy, raporty i działy Instytutu. Polskie znaki są mile widziane, ale nieobowiązkowe.")}
      />
      <section className="wrap pb-24 pt-12">
        <Suspense fallback={<p className="label text-ink-soft">Instytut otwiera kartotekę…</p>}>
          <SearchPage />
        </Suspense>
      </section>
    </main>
  );
}
