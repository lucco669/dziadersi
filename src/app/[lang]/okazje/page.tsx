import type { Metadata } from "next";
import { DossierTile, publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { getDossiers } from "@/content/dossiers";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { plural, pluralSl } from "@/lib/typo";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const COPY = defineCopy({
  pl: {
    title: "Dziaders na każdą okazję",
    description:
      "Przewodniki na Wigilię, wesele, majówkę, imieniny, Dzień Dziadka, Dzień Teściowej, Dzień Mężczyzn, Dzień Ojca i Dzień Chłopaka: gatunki, typowe powiedzenia, bingo i kartki.",
    lead: "Instrukcje prowadzenia obserwacji tam, gdzie wszyscy się znają. Wybierz teren, poznaj gatunki i przygotuj materiały dla swojego stołu.",
    meta: (count: number) => `${count} ${plural(count, "przewodnik", "przewodniki", "przewodników")} · obserwacja uczestnicząca`,
    field: "Przewodniki terenowe",
    days: "Święta ludzi",
    daysIntro: "Dni, w które obchodzi się konkretną osobę. Każdy przewodnik ma kartkę z życzeniami do przepisania albo wysłania.",
    promo: "Przed wyjściem sprawdź obserwatora.",
    promoText: "Test Dziadersa nie wymaga sprzętu terenowego. Wystarczą cztery minuty i gotowość do przyjęcia wyniku.",
  },
  sl: {
    title: "Dziaders za vsako priložnost",
    description:
      "Vodniki za sveti večer, svatbo, prvomajski vikend, godovanje, dan dedka, dan tašče, dan moških, dan očetov in dan fantov: vrste, značilne izjave, bingo in voščilnice.",
    lead: "Navodila za opazovanje tam, kjer se vsi poznajo. Izberi teren, spoznaj vrste in pripravi gradivo za svojo mizo.",
    meta: (count: number) => `${count} ${pluralSl(count, "vodnik", "vodnika", "vodniki", "vodnikov")} · opazovanje z udeležbo`,
    field: "Terenski vodniki",
    days: "Prazniki ljudi",
    daysIntro: "Dnevi, ko se praznuje določena oseba. Vsak vodnik ima voščilnico z voščili za prepis ali pošiljanje.",
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
  const field = dossiers.filter((item) => !item.date);
  const days = dossiers.filter((item) => item.date).sort((a, b) => a.date!.localeCompare(b.date!));
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title }]),
          {
            ...publicationSchema(locale, "/okazje", t.title, t.description),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: [...field, ...days].map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.title,
                url: absoluteUrl("/okazje/" + item.slug, locale),
              })),
            },
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={t.lead} meta={t.meta(dossiers.length)} />
      <Section id="przewodniki" title={t.field}>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {field.map((dossier) => (
            <DossierTile key={dossier.code} dossier={dossier} locale={locale} />
          ))}
        </div>
      </Section>
      <Section id="swieta-ludzi" title={t.days} intro={t.daysIntro}>
        <div className="grid gap-6 md:grid-cols-3">
          {days.map((dossier) => (
            <DossierTile key={dossier.code} dossier={dossier} locale={locale} />
          ))}
        </div>
      </Section>
      <TestPromo title={t.promo} text={t.promoText} />
    </main>
  );
}
