import type { Metadata } from "next";
import { NewCardButton } from "@/components/bingo-board";
import { OccasionPlate } from "@/components/occasions";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { getOccasions } from "@/content/bingo";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { sampleCard } from "@/lib/bingo";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatNumber, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Dziaders Bingo",
    browserTitle: "Dziaders Bingo: karty na wesele, Wigilię i majówkę",
    description:
      "Bingo na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę: karty z tym, co zawsze mówi wujek. Skreślaj na telefonie albo wydrukuj cztery karty na stół.",
    shareDescription: "Karty bingo na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę. Pięć w linii wygrywa.",
    rules: [
      "Każdy gracz losuje własną kartę. Na jednej karcie gra się nieuczciwie.",
      "Skreślaj, co usłyszysz albo zobaczysz. Słowo w słowo nie jest wymagane, sens tak.",
      "Pięć skreśleń w linii, w poziomie, w pionie albo po skosie, to bingo. Należy wstać i krzyknąć.",
      "Środkowe pole jest wolne. Ktoś i tak zaraz powie „za moich czasów”.",
    ],
    lead: "Karty na okazje, przy których dziaderstwo osiąga szczyt sezonowy. Skreślaj na telefonie albo wydrukuj karty dla całego stołu.",
    meta: (occasions: number, squares: number) =>
      `${occasions} ${plural(occasions, "okazja", "okazje", "okazji")} · ${squares} pól w puli · każda karta inna`,
    occasions: "Wybierz okazję",
    occasionsAside: "Karta losowana przy każdym kliknięciu",
    draw: "Losuj kartę",
    sample: "Przykładowa karta",
    rulesTitle: "Zasady",
    rulesAside: "Regulamin gry IBD-B1",
    promoTitle: "Bingo to obserwacja. Test to diagnoza.",
    promoText: "Zanim skreślisz wujka, sprawdź siebie. Pięć gabinetów, cztery minuty, certyfikat.",
  },
  sl: {
    title: "Dziaders bingo",
    browserTitle: "Dziaders bingo: listki za svatbo, sveti večer in prvi maj",
    description:
      "Bingo za svatbo, sveti večer, godovanje, prvi maj, pot z avtom in plažo: listki s tem, kar vedno reče stric. Prečrtuj na telefonu ali natisni štiri za mizo.",
    shareDescription: "Bingo listki za svatbo, sveti večer, godovanje, prvomajski vikend, pot z avtom in plažo. Pet v vrsto zmaga.",
    rules: [
      "Vsak igralec izžreba svoj listek. Na enem listku se igra nepošteno.",
      "Prečrtaj, kar slišiš ali vidiš. Ni treba dobesedno, dovolj je smisel.",
      "Pet prečrtanih polj v vrsti, vodoravno, navpično ali poševno, je bingo. Treba je vstati in zavpiti.",
      "Srednje polje je prosto. Nekdo bo tako ali tako kmalu rekel »v mojih časih«.",
    ],
    lead: "Listki za priložnosti, ob katerih dziaderstvo doseže sezonski vrh. Prečrtuj na telefonu ali natisni listke za vso mizo.",
    meta: (occasions: number, squares: number) =>
      `${occasions} ${pluralSl(occasions, "priložnost", "priložnosti", "priložnosti", "priložnosti")} · ${formatNumber("sl", squares)} ${pluralSl(squares, "polje", "polji", "polja", "polj")} v naboru · vsak listek drugačen`,
    occasions: "Izberi priložnost",
    occasionsAside: "Listek se izžreba ob vsakem kliku",
    draw: "Izžrebaj listek",
    sample: "Vzorčni listek",
    rulesTitle: "Pravila",
    rulesAside: "Pravilnik igre IBD-B1",
    promoTitle: "Bingo je opazovanje. Test je diagnoza.",
    promoText: "Preden prečrtaš strica, preveri sebe. Pet ordinacij, štiri minute, certifikat.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/bingo",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function BingoPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const occasions = getOccasions(locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/bingo" }]),
          {
            "@context": "https://schema.org",
            // Not WebApplication: Google wants app ratings for that, and the Institute collects none.
            "@type": "Game",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/bingo", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            isAccessibleForFree: true,
            publisher: institute(locale),
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.meta(
          occasions.length,
          occasions.reduce((sum, occasion) => sum + occasion.squares.length, 0),
        )}
      />

      <Section id="okazje" title={t.occasions} aside={t.occasionsAside}>
        <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {occasions.map((occasion) => {
            const sample = sampleCard(occasion);
            return (
              <li key={occasion.slug} className="group grid gap-6 border-t border-ink pt-6 sm:grid-cols-[11rem_1fr]">
                <OccasionPlate slug={occasion.slug} animated className="w-full max-w-48" />
                <div>
                  <h3 className="text-[1.9rem] font-bold leading-tight">{occasion.title}</h3>
                  <p className="mt-2 leading-snug text-ink-soft">{typo(occasion.intro)}</p>
                  <ul className="mt-4 space-y-1 font-sans text-[0.92rem] leading-snug">
                    {sample.squares
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((square) => (
                        <li key={square} className="flex gap-2">
                          <span aria-hidden="true" className="text-red">
                            ×
                          </span>
                          {typo(square)}
                        </li>
                      ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <NewCardButton slug={occasion.slug} className="btn bg-ink text-paper hover:bg-red">
                      {t.draw} <span aria-hidden="true">→</span>
                    </NewCardButton>
                    <Link href={`/bingo/${sample.code}`} className="link font-sans font-medium">
                      {t.sample}
                    </Link>
                  </div>
                  <TranslatorNotes notes={occasion.notes} className="mt-6 max-w-md" />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="zasady" title={t.rulesTitle} aside={t.rulesAside}>
        <ol className="max-w-2xl border-t border-ink">
          {t.rules.map((rule, i) => (
            <li key={rule} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-4 text-lg leading-snug">
              <span className="font-sans text-[0.9rem] font-semibold text-red">{String(i + 1).padStart(2, "0")}</span>
              {typo(rule)}
            </li>
          ))}
        </ol>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
