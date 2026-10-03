import type { Metadata } from "next";
import { SituationIcon } from "@/components/occasions";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Phrasebook } from "@/components/phrasebook";
import { getSituations } from "@/content/phrasebook";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getBulletin } from "@/lib/bulletin";
import { line, seededLine, TOTAL_LINES } from "@/lib/phrasebook";
import { shuffled } from "@/lib/random";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatNumber, pluralSl, quote, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Rozmówki dziaderskie",
    browserTitle: "Rozmówki dziaderskie: generator tekstów dziadersa",
    description:
      "Generator tekstów dziadersa: samochód, remont, urlop, restauracja, komputer, dzieci sąsiadów, pogoda i zakupy. Losuj, zostaw najlepszą puentę i wyślij rodzinie.",
    shareDescription: "Wypowiedzi na każdą okazję: zagajenie, teza i puenta. Losuj, posłuchaj, wyślij rodzinie.",
    lead: "Wypowiedzi na każdą okazję, w ośmiu rozdziałach. Każda składa się z zagajenia, tezy i puenty, a każda część była słyszana w terenie.",
    meta: (lines: number, founded: number, chapter: string) =>
      `${formatNumber("pl", lines)} wypowiedzi · wydanie I, ${founded} · na dziś: ${chapter.toLowerCase()}`,
    chapters: "Spis rozdziałów",
    chaptersAside: "Po trzy przykłady z każdego",
    promoTitle: "Mówisz tak? To nie generator.",
    promoText: "Jeśli te wypowiedzi brzmią znajomo, ale z twoich ust, czas na badanie. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    title: "Dziaderski pogovornik",
    browserTitle: "Dziaderski pogovornik: generator dziaderskih izjav",
    description:
      "Generator dziaderskih izjav: avto, prenova, dopust, restavracija, računalnik, sosedovi otroci, vreme in nakupi. Žrebaj, zadrži najboljšo poanto, pošlji družini.",
    shareDescription: "Izjave za vsako priložnost: uvod, teza in poanta. Žrebaj, poslušaj, pošlji družini.",
    lead: "Izjave za vsako priložnost, v osmih poglavjih. Vsaka je sestavljena iz uvoda, teze in poante, vsak del pa je bil slišan na terenu.",
    meta: (lines: number, founded: number, chapter: string) =>
      `${formatNumber("sl", lines)} ${pluralSl(lines, "izjava", "izjavi", "izjave", "izjav")} · 1. izdaja, ${founded} · za danes: ${chapter.toLowerCase()}`,
    chapters: "Kazalo poglavij",
    chaptersAside: "Po trije primeri iz vsakega",
    promoTitle: "Tako govoriš? To ni generator.",
    promoText: "Če se ti te izjave zdijo znane, ampak iz tvojih ust, je čas za pregled. Pet ordinacij, štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/generator",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

export default async function GeneratorPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const situations = getSituations(locale);
  const { today } = await getBulletin(locale);
  const daily = seededLine(today, locale);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/generator" }]),
          {
            "@context": "https://schema.org",
            // Not WebApplication: Google wants app ratings for that, and the Institute collects none.
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/generator", locale),
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
        meta={t.meta(TOTAL_LINES, site.founded, daily.situation.name)}
      />

      <section aria-label="Generator" className="wrap py-12 md:py-16">
        <Phrasebook initial={{ slug: daily.situation.slug, picks: daily.picks }} />
      </section>

      <Section id="rozdzialy" title={t.chapters} aside={t.chaptersAside}>
        <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {situations.map((situation, i) => (
            <li key={situation.slug} className="border-t border-ink pt-5">
              <div className="flex items-center gap-3">
                <SituationIcon slug={situation.slug} className="h-9 w-11" />
                <h3 className="text-[1.6rem] font-bold leading-tight">{situation.name}</h3>
              </div>
              <ul className="mt-4">
                {shuffled(situation.claims.length, 101 + i * 13)
                  .slice(0, 3)
                  .map((claim, n) => {
                    const base = seededLine(101 + i * 13 + n, locale, situation);
                    const sample = line(situation, [base.picks[0], claim, base.picks[2]]);
                    return (
                      <li key={sample.code} className="border-b border-rule py-3">
                        <Link href={`/generator/${sample.code}`} className="group block leading-snug">
                          <span className="italic transition-colors group-hover:text-red">{quote(typo(sample.parts[1]), locale)}</span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
