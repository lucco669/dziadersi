import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { SeatingPlanner } from "@/components/seating-planner";
import { getRivalries } from "@/content/seating";
import { DOSSIER_SLUGS } from "@/content/sl/slugs/dossiers";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { samplePlan, shortName } from "@/lib/seating";
import { percent } from "@/lib/seating-text";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Plan stołu",
    browserTitle: "Plan stołu: jak rozsadzić rodzinę przy Wigilii i na weselu",
    description:
      "Urzędowy protokół rozsadzania gości przy stole wigilijnym i weselnym. Instytut ocenia każde sąsiedztwo, wskazuje punkty zapalne i proponuje własne rozsadzenie.",
    shareDescription: "Posadź rodzinę przy stole, a Instytut wskaże punkty zapalne i wyda protokół rozsadzenia z pieczęcią.",
    lead: "Urzędowy protokół rozsadzania gości przy stole wigilijnym i weselnym. Instytut ocenia każde sąsiedztwo na podstawie Atlasu Dziadersów i wskazuje miejsca, w których dojdzie do sporu.",
    meta: (rivalries: number) => `Formularz IBD-S1 · ${rivalries} udokumentowanych konfliktów · Wigilia i wesele`,
    planner: "Rozsadzenie",
    method: "Metodologia",
    methodAside: "Jak Instytut liczy ryzyko",
    steps: [
      {
        title: "Naturalni wrogowie",
        text: "Atlas notuje naturalnych wrogów każdego gatunku. Gdy wróg siedzi obok, ryzyko sporu wynosi od 55 do 88%. Przykład: system start-stop, którego Motoryzacyjny nie toleruje, a Smart-Home ma w każdym samochodzie.",
      },
      {
        title: "Konkurencja w obrębie gatunku",
        text: "Dwa osobniki tego samego gatunku walczą o jedną niszę. Przedmiotem sporu jest najsilniejsza cecha: dwóch Grillowych, jedne szczypce.",
      },
      {
        title: "Gatunki pokrewne",
        text: "Gatunki spokrewnione w Atlasie mają wspólne tematy i rozmawiają spokojnie. Ryzyko spada do kilku procent, choć reszta stołu bywa wyłączona z rozmowy.",
      },
      {
        title: "Sezon",
        text: "Liczy się aktywność gatunku w danej porze roku: w grudniu dla Wigilii, od czerwca do września dla wesela. Wigilijny w grudniu osiąga szczyt.",
      },
    ],
    weights:
      "Sąsiad obok siebie liczy się w całości, sąsiad naprzeciwko w 70% przy stole wigilijnym i w 40% przy okrągłym stole weselnym, przez stroik. Wskaźnik zapalności to średnie ryzyko wszystkich par. Puste nakrycie dla wędrowca ma ryzyko zerowe i jest najskuteczniejszym środkiem rozdzielającym, jaki zna Instytut.",
    register: "Rejestr konfliktów",
    registerAside: "Ryzyko dla sąsiadów obok siebie, przed uwzględnieniem sezonu",
    pair: "Para",
    subject: "Przedmiot sporu",
    risk: "Ryzyko",
    occasions: "Na okazje",
    wigilia: "Przewodnik: Wigilia",
    wesele: "Przewodnik: wesele",
    bingo: "Bingo dla całego stołu",
    promo: "Rozsadziłeś wszystkich. A ty?",
    promoText: "Zanim protokół trafi do rodziny, sprawdź, przy którym końcu stołu powinieneś siedzieć sam.",
  },
  sl: {
    title: "Sedežni red",
    browserTitle: "Sedežni red: kako posesti družino za sveti večer in na svatbi",
    description:
      "Uradni zapisnik o posedanju gostov za mizo na sveti večer in na svatbi. Inštitut oceni vsako sosedstvo, pokaže žarišča in predlaga svoj sedežni red.",
    shareDescription: "Posedi družino za mizo, Inštitut pa bo pokazal žarišča in izdal zapisnik o sedežnem redu z žigom.",
    lead: "Uradni zapisnik o posedanju gostov za mizo na sveti večer in na svatbi. Inštitut oceni vsako sosedstvo na podlagi Atlasa dziadersov in pokaže mesta, kjer bo prišlo do spora.",
    meta: (rivalries: number) => `Obrazec IBD-S1 · ${rivalries} dokumentiranih sporov · sveti večer in svatba`,
    planner: "Sedežni red",
    method: "Metodologija",
    methodAside: "Kako Inštitut računa tveganje",
    steps: [
      {
        title: "Naravni sovražniki",
        text: "Atlas beleži naravne sovražnike vsake vrste. Ko sovražnik sedi zraven, je tveganje spora od 55 do 88 %. Primer: sistem start-stop, ki ga Avtomobilski ne prenese, Smart-home pa ga ima v vsakem avtu.",
      },
      {
        title: "Tekmovanje znotraj vrste",
        text: "Dva osebka iste vrste tekmujeta za isto nišo. Predmet spora je najmočnejša lastnost: dva Žarna, ene klešče.",
      },
      {
        title: "Sorodne vrste",
        text: "Vrste, ki so v Atlasu sorodne, imajo skupne teme in se mirno pogovarjajo. Tveganje pade na nekaj odstotkov, čeprav preostala miza včasih ostane brez besede.",
      },
      {
        title: "Sezona",
        text: "Šteje dejavnost vrste v letnem času: decembra za sveti večer, od junija do septembra za svatbo. Svetovečerni decembra doseže vrhunec.",
      },
    ],
    weights:
      "Sosed ob strani šteje v celoti, sosed nasproti 70 % za mizo na sveti večer in 40 % za okroglo svatbeno mizo, čez cvetlični aranžma. Indeks vnetljivosti je povprečno tveganje vseh parov. Prazen pogrinjek za popotnika ima ničelno tveganje in je najučinkovitejše ločilno sredstvo, ki ga Inštitut pozna.",
    register: "Register sporov",
    registerAside: "Tveganje za soseda drug ob drugem, brez sezone",
    pair: "Par",
    subject: "Predmet spora",
    risk: "Tveganje",
    occasions: "Za priložnosti",
    wigilia: "Vodnik: sveti večer",
    wesele: "Vodnik: svatba",
    bingo: "Bingo za vso mizo",
    promo: "Vse si posedel. Kaj pa ti?",
    promoText: "Preden zapisnik pride do družine, preveri, na katerem koncu mize bi moral sedeti sam.",
  },
});

/** A dossier's slug in the edition: the Polish slug, or its Slovenian twin. */
const dossier = (slug: string, locale: "pl" | "sl") => (locale === "sl" ? DOSSIER_SLUGS[slug] : slug);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/plan-stolu",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function SeatingPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const rivalries = getRivalries(locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/plan-stolu" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/plan-stolu", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            isAccessibleForFree: true,
            publisher: institute(locale),
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(rivalries.length)} />

      <section aria-label={t.planner} className="wrap py-12 md:py-16">
        <SeatingPlanner initial={samplePlan("wigilia", locale)} />
      </section>

      <Section id="metodologia" title={t.method} aside={t.methodAside}>
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, i) => (
            <li key={step.title}>
              <p className="label text-red">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{step.title}</h3>
              <p className="mt-3 text-ink-soft">{typo(step.text)}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-3xl text-xl leading-relaxed">{typo(t.weights)}</p>
      </Section>

      <Section id="rejestr" title={t.register} aside={t.registerAside}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="label text-ink-soft">
              <th className="pb-3 font-medium">{t.pair}</th>
              <th className="hidden pb-3 font-medium sm:table-cell">{t.subject}</th>
              <th className="pb-3 text-right font-medium">{t.risk}</th>
            </tr>
          </thead>
          <tbody>
            {[...rivalries]
              .sort((a, b) => b.risk - a.risk)
              .map((rivalry) => (
                <tr key={`${rivalry.a}-${rivalry.b}`} className="border-t border-rule align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <SpeciesPlate species={rivalry.a} variant="pictogram" className="w-10 shrink-0" />
                      <SpeciesPlate species={rivalry.b} variant="pictogram" className="w-10 shrink-0" />
                      <span className="ml-1 leading-snug">
                        <span className="font-bold">{shortName(rivalry.a, locale)}</span> · <span className="font-bold">{shortName(rivalry.b, locale)}</span>
                        <span className="mt-0.5 block text-ink-soft sm:hidden">{rivalry.subject}</span>
                      </span>
                    </div>
                  </td>
                  <td className="hidden py-3 pr-4 text-ink-soft sm:table-cell">{rivalry.subject}</td>
                  <td className="py-3 text-right font-sans text-lg font-bold text-red">{percent(locale, rivalry.risk)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Section>

      <Section id="okazje" title={t.occasions}>
        <ul className="grid gap-5 md:grid-cols-3">
          {[
            { href: `/okazje/${dossier("wigilia", locale)}`, label: t.wigilia, plate: "wigilijny" as const },
            { href: `/okazje/${dossier("wesele", locale)}`, label: t.wesele, plate: "weselny" as const },
            { href: "/bingo", label: t.bingo, plate: "festiwalowy" as const },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group flex items-center gap-4 border-t border-ink pt-4">
                <SpeciesPlate species={item.plate} variant="pictogram" className="w-20 shrink-0" />
                <span className="text-2xl font-bold group-hover:text-red">{item.label} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <TestPromo title={t.promo} text={typo(t.promoText)} />
    </main>
  );
}
