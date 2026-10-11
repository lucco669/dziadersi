import type { Metadata } from "next";
import { editorialPath, publicationSchema } from "@/components/fieldwork-parts";
import { MuseumDrawing } from "@/components/museum-drawing";
import { MuseumActions, MuseumCollectionCount } from "@/components/museum-actions";
import { breadcrumbList, JsonLd, PageHeader, Section } from "@/components/page";
import { getExhibits } from "@/content/museum";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Muzeum rzeczy, które jeszcze się przydadzą",
    description:
      "Kabel bez zastosowania, pilot bez telewizora i słoik śrubek. Otwórz szuflady satyrycznego muzeum, zachowaj eksponat i pobierz kartę muzealną.",
    lead: "Kolekcja przedmiotów, których nie wolno wyrzucać, ponieważ mogą być potrzebne. Satyryczny katalog Instytutu. Wszystkie eksponaty mają nieustaloną przyszłość użytkową.",
    meta: "6 eksponatów · zbiory fikcyjne · wstęp wolny",
    cabinet: "Otwórz szufladę",
    cabinetNote: "Każda szuflada zawiera jeden eksponat. Otwieranie nie powoduje utraty gwarancji.",
    open: "Pełna karta eksponatu",
    provenance: "Pochodzenie",
    condition: "Stan zachowania",
    rules: "Zasady przechowywania",
    ruleText:
      "Możesz zachować eksponat w swoich zbiorach w tej przeglądarce, pobrać jego kartę albo wysłać link osobie odpowiedzialnej za piwnicę. Katalog nie wymaga konta.",
    dictionary: "Sprawdź znaczenie „to się jeszcze przyda”",
    print: "Materiały terenowe do wydrukowania",
  },
  sl: {
    title: "Muzej stvari, ki bodo še prišle prav",
    description:
      "Kabel brez namena, daljinec brez televizorja in kozarec vijakov. Odpri predale satiričnega muzeja, ohrani eksponat in prenesi muzejsko kartico.",
    lead: "Zbirka predmetov, ki jih ne smemo zavreči, ker jih bomo morda potrebovali. Satirični katalog Inštituta. Uporabna prihodnost vseh eksponatov je neugotovljena.",
    meta: "6 eksponatov · izmišljena zbirka · prost vstop",
    cabinet: "Odpri predal",
    cabinetNote: "Vsak predal vsebuje en eksponat. Odpiranje ne razveljavi garancije.",
    open: "Celotna kartica eksponata",
    provenance: "Izvor",
    condition: "Stanje ohranjenosti",
    rules: "Pravila shranjevanja",
    ruleText:
      "Eksponat lahko ohraniš v svoji zbirki v tem brskalniku, preneseš njegovo kartico ali pošlješ povezavo osebi, odgovorni za klet. Katalog ne zahteva računa.",
    dictionary: "Preveri pomen »to bo še prišlo prav«",
    print: "Terensko gradivo za tisk",
  },
});
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/muzeum" });
}
export default async function MuseumPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const exhibits = getExhibits(locale);
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title }]),
          {
            ...publicationSchema(locale, "/muzeum", t.title, t.description),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: exhibits.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.name,
                url: absoluteUrl("/muzeum/" + item.slug, locale),
              })),
            },
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.meta}
        aside={<MuseumDrawing kind="screws" className="mx-auto w-72 max-w-full" />}
      />
      <Section
        id="szuflady"
        title={t.cabinet}
        intro={t.cabinetNote}
        aside={<MuseumCollectionCount kinds={exhibits.map((item) => item.kind)} />}
      >
        <div className="grid gap-3 border-2 border-ink bg-ink p-3 md:grid-cols-2 lg:grid-cols-3">
          {exhibits.map((exhibit) => (
            <article key={exhibit.code} className="bg-paper-deep">
              <details className="group">
                <summary className="cursor-pointer list-none p-6 [&::-webkit-details-marker]:hidden">
                  <span className="label text-ink-soft">{exhibit.code}</span>
                  <h2 className="mt-3 min-h-16 text-2xl font-bold group-open:text-red">{exhibit.name}</h2>
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-6 block h-3 w-16 rounded-b-full border-x-2 border-b-2 border-ink transition-transform group-open:translate-y-1"
                  />
                </summary>
                <div className="border-t border-rule bg-card p-6">
                  <MuseumDrawing kind={exhibit.kind} className="mx-auto h-40 w-60 max-w-full" />
                  <p className="mt-4 text-xl font-bold">{exhibit.subtitle}</p>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="label text-ink-faint">{t.provenance}</dt>
                      <dd className="mt-1">{exhibit.provenance}</dd>
                    </div>
                    <div>
                      <dt className="label text-ink-faint">{t.condition}</dt>
                      <dd className="mt-1">{exhibit.condition}</dd>
                    </div>
                  </dl>
                  <div className="mt-6">
                    <MuseumActions kind={exhibit.kind} />
                  </div>
                </div>
              </details>
              <Link href={"/muzeum/" + exhibit.slug} className="link mx-6 mb-6 inline-block font-sans font-medium">
                {t.open} →
              </Link>
            </article>
          ))}
        </div>
      </Section>
      <Section id="regulamin" title={t.rules}>
        <p className="max-w-2xl text-xl leading-relaxed text-ink-soft">{typo(t.ruleText)}</p>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 font-sans">
          <Link href={editorialPath("slownik", "to-sie-jeszcze-przyda", locale)} className="link">
            {t.dictionary} →
          </Link>
          <Link href="/do-druku" className="link">
            {t.print} →
          </Link>
        </div>
      </Section>
    </main>
  );
}
