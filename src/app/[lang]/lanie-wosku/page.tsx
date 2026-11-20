import type { Metadata } from "next";
import { breadcrumbList, JsonLd, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { castCount, WAX_COPY, WaxHeader, waxTableFor } from "@/components/wax-page";
import { WaxReading } from "@/components/wax-reading";
import { CASTS } from "@/content/wax";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getToday } from "@/lib/today";
import { typo } from "@/lib/typo";
import { sampleReading } from "@/lib/wax";
import { yearFor } from "@/lib/wax-code";

const COPY = defineCopy({
  pl: {
    catalogue: "Katalog odlewów",
    catalogueAside: "Wzorce cieni w zbiorach Pracowni",
    catalogueIntro: "Pracownia odczytuje tylko cienie, które zna. Odlew, którego cień nie pasuje do żadnego wzorca, topi się i leje ponownie.",
    method: "Metodyka",
    methodAside: "Instrukcja stanowiskowa IBD-W1",
    steps: [
      "Wosk ze świecy roztapia się w rondelku, na małym ogniu, bez pośpiechu.",
      "Nad miską z zimną wodą trzyma się klucz, najlepiej stary, z dużym uchem. Wosk leje się przez ucho jednym strumieniem.",
      "Wosk tężeje w wodzie w chwili zetknięcia. Odlewu nie poprawia się palcami: liczy się kształt, który wyszedł.",
      "Odlew przykłada się do świecy i czyta jego cień na ścianie, nie sam odlew. Odlew bywa mylący, cień nigdy.",
      "Odczyt zapisuje się w protokole. Instytut zaleca odczyt w gronie rodzinnym, które i tak przy stole wszystko skomentuje.",
    ],
    reliability: "Zgodność odczytów między pracownikami Pracowni wynosi 100%. Pracownia zatrudnia jednego pracownika.",
    promoTitle: "Wosk wskazał gatunek. Badanie go potwierdzi.",
    promoText: "Cień pokazuje, co cię czeka. Test Dziadersa mierzy, co już się stało. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    catalogue: "Katalog odlitkov",
    catalogueAside: "Vzorci senc v zbirkah Laboratorija",
    catalogueIntro: "Laboratorij bere samo sence, ki jih pozna. Odlitek, katerega senca ne ustreza nobenemu vzorcu, se stopi in vlije znova.",
    method: "Metodika",
    methodAside: "Navodilo za delovno mesto IBD-W1",
    steps: [
      "Vosek iz sveče se stopi v kozici, na majhnem ognju, brez naglice.",
      "Nad skledo z mrzlo vodo se drži ključ, najbolje star, z velikim ušescem. Vosek se vliva skozi ušesce v enem curku.",
      "Vosek se v vodi strdi v trenutku stika. Odlitka se s prsti ne popravlja: šteje oblika, ki je nastala.",
      "Odlitek se drži pred svečo in bere se njegova senca na steni, ne sam odlitek. Odlitek lahko zavaja, senca nikoli.",
      "Branje se vpiše v zapisnik. Inštitut priporoča branje v družinskem krogu, ki bo za mizo tako ali tako vse komentiral.",
    ],
    reliability: "Skladnost branj med zaposlenimi v Laboratoriju je 100-odstotna. Laboratorij zaposluje enega delavca.",
    promoTitle: "Vosek je pokazal vrsto. Pregled jo bo potrdil.",
    promoText: "Senca pokaže, kaj te čaka. Test dziadersa izmeri, kar se je že zgodilo. Pet ordinacij, štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = WAX_COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/lanie-wosku",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function WaxPage() {
  const locale = await getLocale();
  const t = { ...WAX_COPY[locale], ...COPY[locale] };
  const today = await getToday();
  const year = yearFor(today.year, today.month);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/lanie-wosku" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/lanie-wosku", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            isAccessibleForFree: true,
            publisher: institute(locale),
          },
        ]}
      />
      <WaxHeader locale={locale} crumbs={[{ label: t.title }]} year={year} meta={t.meta(castCount)} />

      <section aria-label={t.title} className="wrap py-12 md:py-16">
        <WaxReading table={waxTableFor(locale)} />
        <TranslatorNotes notes={t.notes} className="mt-14 max-w-2xl" />
      </section>

      <Section id="katalog" title={t.catalogue} aside={t.catalogueAside} intro={typo(t.catalogueIntro)}>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {CASTS.map((cast, i) => {
            const sample = sampleReading(i, locale, year);
            return (
              <li key={cast.slug} className="border-t border-ink pt-3">
                <Link href={`/lanie-wosku/${sample.code}`} className="group block">
                  {/* eslint-disable-next-line @next/next/no-img-element -- encoded WebPs in public/wosk */}
                  <img
                    src={`/wosk/${cast.slug}-360.webp`}
                    width={360}
                    height={360}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-square h-auto w-full transition-[filter,opacity] duration-300 group-hover:opacity-80 group-hover:brightness-0"
                  />
                  <span className="label block text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="block font-bold leading-tight group-hover:text-red">{sample.cast.shape}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="metodyka" title={t.method} aside={t.methodAside}>
        <ol className="max-w-3xl">
          {t.steps.map((step, i) => (
            <li key={step} className="grid grid-cols-[2.5rem_1fr] border-b border-rule py-4 first:pt-0">
              <span className="label pt-1 text-red">{i + 1}.</span>
              <span className="text-[1.15rem] leading-snug">{typo(step)}</span>
            </li>
          ))}
        </ol>
        <p className="label mt-6 max-w-3xl text-ink-soft">{typo(t.reliability)}</p>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
