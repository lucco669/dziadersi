import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { WishMachine } from "@/components/wishes";
import { getWishChapters, getWishOccasions } from "@/content/wishes";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { getToday } from "@/lib/today";
import { formatNumber, pluralSl, quote, typo } from "@/lib/typo";
import { chapterFor, seededWish, TOTAL_WISHES } from "@/lib/wishes";

const COPY = defineCopy({
  pl: {
    title: "Życzenia od Instytutu",
    browserTitle: "Życzenia świąteczne i noworoczne od Instytutu: generator",
    description:
      "Życzenia świąteczne i noworoczne w formie pisma urzędowego: dla wujka, dla szwagra, dla szefa i od całej rodziny. Losuj, zostaw najlepsze zdanie i wyślij na WhatsAppie albo Messengerze.",
    shareDescription: "Życzenia świąteczne w formie pisma urzędowego, z pieczęcią. Dla wujka, szwagra, szefa i od całej rodziny.",
    lead: "Instytut składa życzenia w trybie urzędowym. Pismo ma trzy zdania: wstęp, życzenie i zakończenie, każde zatwierdzone przez Dział Korespondencji Okolicznościowej. Każde pasuje do każdego.",
    meta: (count: number, chapters: number) => `${formatNumber("pl", count)} wariantów pisma · ${chapters} wzorów · podpisuje IBD`,
    steps: "Tryb doręczenia",
    stepsAside: "Wyciąg z instrukcji kancelaryjnej",
    stepList: [
      { title: "Wybierz adresata", text: "Wzór pisma zależy od adresata. Szefowi nie pisze się o wiertarce." },
      { title: "Losuj do skutku", text: "Zdanie, które pasuje, można zostawić. Pozostałe losuje się dalej, bez limitu." },
      { title: "Doręcz przed gwiazdką", text: "Na WhatsAppie albo Messengerze, jako link albo obrazek. Instytut zaleca grupę rodzinną." },
    ],
    samples: "Wzory pism",
    samplesAside: "Po dwa przykłady dla każdego adresata",
    promoTitle: "Życzenia wysłane. Teraz badanie.",
    promoText: "Przy stole i tak ktoś zapyta, czy to już dziaderstwo. Lepiej znać wynik wcześniej. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    title: "Voščila Inštituta",
    browserTitle: "Praznična in novoletna voščila Inštituta: generator",
    description:
      "Praznična in novoletna voščila v obliki uradnega dopisa: za strica, za svaka, za šefa in od vse družine. Žrebaj, zadrži najboljši stavek in pošlji na WhatsApp ali Messenger.",
    shareDescription: "Praznična voščila v obliki uradnega dopisa, s pečatom. Za strica, svaka, šefa in od vse družine.",
    lead: "Inštitut izreka voščila po uradni poti. Dopis ima tri stavke: uvod, voščilo in zaključek, vsakega je odobril Oddelek za priložnostno korespondenco. Vsak se poda k vsakemu.",
    meta: (count: number, chapters: number) =>
      `${formatNumber("sl", count)} ${pluralSl(count, "različica", "različici", "različice", "različic")} dopisa · ${chapters} ${pluralSl(chapters, "vzorec", "vzorca", "vzorci", "vzorcev")} · podpisuje IBD`,
    steps: "Način vročitve",
    stepsAside: "Izvleček iz pisarniškega navodila",
    stepList: [
      { title: "Izberi naslovnika", text: "Vzorec dopisa je odvisen od naslovnika. Šefu se ne piše o vrtalniku." },
      { title: "Žrebaj do uspeha", text: "Stavek, ki se poda, lahko zadržiš. Druge žrebaš naprej, brez omejitve." },
      { title: "Vroči pred prvo zvezdo", text: "Na WhatsApp ali Messenger, kot povezavo ali sliko. Inštitut priporoča družinsko skupino." },
    ],
    samples: "Vzorci dopisov",
    samplesAside: "Po dva primera za vsakega naslovnika",
    promoTitle: "Voščila so poslana. Zdaj pa pregled.",
    promoText: "Za mizo bo tako ali tako kdo vprašal, ali je to že dziaderstvo. Bolje je izvid poznati prej. Pet ordinacij, štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/zyczenia",
    shareTitle: t.title,
    shareDescription: t.shareDescription,
  });
}

export default async function WishesPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const chapters = getWishChapters(locale);
  const occasions = getWishOccasions(locale);
  const today = await getToday();
  // The card of the day, from the occasion in season.
  const daily = seededWish(today.year * 400 + today.month * 31 + today.day, chapterFor(today.month, today.day, locale), locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/zyczenia" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/zyczenia", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            isAccessibleForFree: true,
            publisher: institute(locale),
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(TOTAL_WISHES, chapters.length)} />

      <section aria-label={t.title} className="wrap py-12 md:py-16">
        <WishMachine key={daily.code} initial={{ slug: daily.chapter.slug, picks: daily.picks }} />
      </section>

      <Section id="tryb" title={t.steps} aside={t.stepsAside}>
        <ol className="grid gap-8 md:grid-cols-3">
          {t.stepList.map((step, i) => (
            <li key={step.title} className="border-t border-rule pt-4">
              <p className="label text-red">{`0${i + 1}`}</p>
              <h3 className="mt-2 text-2xl font-bold">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{typo(step.text)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="wzory" title={t.samples} aside={t.samplesAside}>
        {occasions.map((occasion) => (
          <div key={occasion.slug} className="mb-12 last:mb-0">
            <h3 className="label mb-4 text-ink-soft">{occasion.name}</h3>
            <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2">
              {chapters
                .filter((chapter) => chapter.occasion === occasion.slug)
                .map((chapter, i) => (
                  <li key={chapter.slug} className="border-t border-ink pt-5">
                    <div className="flex items-center gap-4">
                      <SpeciesPlate locale={locale} species={chapter.plate.species} specimen={chapter.plate.specimen} sizes="96px" className="w-24 shrink-0" />
                      <h4 className="text-[1.6rem] font-bold leading-tight">{chapter.name}</h4>
                    </div>
                    <ul className="mt-3">
                      {[0, 1].map((n) => {
                        const sample = seededWish(211 + i * 17 + n * 5, chapter, locale);
                        return (
                          <li key={sample.code} className="border-b border-rule py-3">
                            <Link href={`/zyczenia/${sample.code}`} className="group block leading-snug">
                              <span className="italic transition-colors group-hover:text-red">{quote(typo(sample.parts[1]), locale)}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
