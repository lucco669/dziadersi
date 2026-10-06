import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page";
import { SearchPage } from "@/components/search";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Wyszukiwarka Instytutu",
    description: "Szukaj w zbiorach Instytutu Badań nad Dziaderstwem: gatunki z Atlasu, hasła ze Słownika, sprawy Komisji Orzekającej, raporty i działy.",
    crumb: "Wyszukiwarka",
    lead: "Gatunki, hasła, sprawy, raporty i działy Instytutu. Polskie znaki są mile widziane, ale nieobowiązkowe.",
    loading: "Instytut otwiera kartotekę…",
  },
  sl: {
    title: "Iskalnik Inštituta",
    description: "Išči po zbirkah Inštituta za raziskave dziaderstva: vrste iz Atlasa, gesla iz Slovarja, primeri Razsodne komisije, poročila in oddelki.",
    crumb: "Iskalnik",
    lead: "Vrste, gesla, primeri, poročila in oddelki Inštituta. Strešice so dobrodošle, niso pa obvezne.",
    loading: "Inštitut odpira kartoteko …",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/szukaj", noindex: true, defaultImage: true });
}

export default async function SearchRoute() {
  const t = COPY[await getLocale()];
  return (
    <main id="tresc">
      <PageHeader crumbs={[{ label: t.crumb }]} title={t.crumb} lead={typo(t.lead)} />
      <section className="wrap pb-24 pt-12">
        <Suspense fallback={<p className="label text-ink-soft">{t.loading}</p>}>
          <SearchPage />
        </Suspense>
      </section>
    </main>
  );
}
