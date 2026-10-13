import type { Metadata } from "next";
import { GrillGame } from "@/components/grill-game";
import { breadcrumbList, JsonLd, PageHeader } from "@/components/page";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";

const COPY = defineCopy({
  pl: { title: "Król grilla", lead: "Próba sprawności przy ruszcie. Obracaj w punkt, podawaj idealne porcje i broń szczypiec przed rodziną.", meta: "Laboratorium terenowe · 90 sekund · 6 miejsc na ruszcie" },
  sl: { title: "Kralj žara", lead: "Preizkus spretnosti pri žaru. Obračaj ob pravem času, postrezi popolne porcije in brani klešče pred družino.", meta: "Terenski laboratorij · 90 sekund · 6 mest na rešetki" },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale(), t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.lead, path: "/krol-grilla", shareTitle: `${t.title} · DZIADER.SI` });
}

export default async function GrillPage() {
  const locale = await getLocale(), t = COPY[locale];
  return <main id="tresc"><JsonLd data={breadcrumbList(locale, [{ label: t.title, href: "/krol-grilla" }])} /><PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={t.lead} meta={t.meta} /><GrillGame locale={locale} /></main>;
}
