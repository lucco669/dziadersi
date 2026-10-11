import type { Metadata } from "next";
import { DossierTile, publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, TestPromo } from "@/components/page";
import { getDossiers } from "@/content/dossiers";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const COPY = defineCopy({
  pl: {
    title: "Dziaders na każdą okazję",
    description:
      "Przewodniki na Wigilię, wesele i majówkę: gatunki dziadersów, typowe powiedzenia, sprawy Komisji i bingo do druku.",
    lead: "Instrukcje prowadzenia obserwacji tam, gdzie wszyscy się znają. Wybierz teren, poznaj gatunki i przygotuj materiały dla swojego stołu.",
    meta: "3 przewodniki · obserwacja uczestnicząca",
    promo: "Przed wyjściem sprawdź obserwatora.",
    promoText: "Test Dziadersa nie wymaga sprzętu terenowego. Wystarczą cztery minuty i gotowość do przyjęcia wyniku.",
  },
  sl: {
    title: "Dziaders za vsako priložnost",
    description:
      "Vodniki za sveti večer, svatbo in prvomajski vikend: vrste dziadersov, značilne izjave, primeri Komisije in bingo za tisk.",
    lead: "Navodila za opazovanje tam, kjer se vsi poznajo. Izberi teren, spoznaj vrste in pripravi gradivo za svojo mizo.",
    meta: "3 vodniki · opazovanje z udeležbo",
    promo: "Pred odhodom preveri opazovalca.",
    promoText: "Test dziadersa ne zahteva terenske opreme. Zadoščajo štiri minute in pripravljenost sprejeti rezultat.",
  },
});
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/okazje" });
}
export default async function OccasionsPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const dossiers = getDossiers(locale);
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title }]),
          {
            ...publicationSchema(locale, "/okazje", t.title, t.description),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: dossiers.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.title,
                url: absoluteUrl("/okazje/" + item.slug, locale),
              })),
            },
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={t.lead} meta={t.meta} />
      <div className="wrap grid gap-6 py-14 md:grid-cols-3 md:py-20">
        {dossiers.map((dossier) => (
          <DossierTile key={dossier.code} dossier={dossier} locale={locale} />
        ))}
      </div>
      <TestPromo title={t.promo} text={t.promoText} />
    </main>
  );
}
