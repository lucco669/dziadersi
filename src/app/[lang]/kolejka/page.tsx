import type { Metadata } from "next";
import { PageHeader, TestPromo, JsonLd, breadcrumbList } from "@/components/page";
import { QueueGame } from "@/components/queue-game";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

const COPY = defineCopy({
  pl: { title: "Pan tu nie stał!", lead: "Symulator kolejki urzędowej. Broń swojego miejsca, zachowaj resztki spokoju i załatw jedną, zupełnie prostą sprawę.", meta: "Laboratorium zachowań kolejkowych · 1 obywatel · 16 rodzajów utrudnień", promo: "Kolejka się skończyła. Badania trwają.", promoText: "Sprawdź, czy twoje kompetencje kolejkowe to już objaw szerszego zjawiska." },
  sl: { title: "Vi pa niste bili v vrsti!", lead: "Simulator čakanja na uradu. Brani svoje mesto, ohrani ostanke mirnosti in uredi eno, povsem preprosto zadevo.", meta: "Laboratorij vedenja v vrstah · 1 občan · 16 vrst ovir", promo: "Vrste je konec. Raziskave se nadaljujejo.", promoText: "Preveri, ali so tvoje spretnosti čakanja že simptom širšega pojava." },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.lead, path: "/kolejka", shareTitle: `${t.title} · DZIADER.SI` });
}

export default async function QueuePage() {
  const locale = await getLocale();
  const t = COPY[locale];
  return <main id="tresc">
    <JsonLd data={breadcrumbList(locale, [{ label: t.title, href: "/kolejka" }])} />
    <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={t.lead} meta={t.meta} />
    <QueueGame locale={locale} />
    <TestPromo title={t.promo} text={t.promoText} />
  </main>;
}
