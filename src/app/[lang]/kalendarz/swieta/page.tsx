import type { Metadata } from "next";
import { publicationSchema } from "@/components/fieldwork-parts";
import { TodayObservance } from "@/components/observance-today";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { getCalendar } from "@/content/calendar";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { dayLabel, observancesByMonth } from "@/lib/observances";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { getToday } from "@/lib/today";
import { typo } from "@/lib/typo";

const PATH = "/kalendarz/swieta";

const COPY = defineCopy({
  pl: {
    title: "Kalendarz świąt nietypowych",
    metaTitle: "Kalendarz świąt nietypowych: jakie dziś święto?",
    description: (count: number) =>
      `Jakie dziś święto? ${count} świąt nietypowych Instytutu, miesiąc po miesiącu: od Dnia Białej Skarpety po Dzień Karpia w Wannie. Obchodzić zgodnie z instrukcją.`,
    lead: "Święta Instytutu, miesiąc po miesiącu. Żadne nie jest dniem wolnym od pracy. Każde ma instrukcję obchodów, gatunek patronacki i stałą datę.",
    meta: (count: number) => `${count} świąt · mniej więcej jedno na tydzień · daty stałe`,
    calendar: "Kartka z kalendarza",
    today: "dziś",
    months: "Miesiąc po miesiącu",
    monthsIntro: "Kliknij święto, żeby przeczytać instrukcję obchodów i sprawdzić, na jaki dzień tygodnia wypada w tym roku.",
    rules: "Zasady",
    rulesList: [
      "Świąt Instytutu nie obchodzi się kosztem cudzego urlopu.",
      "Nie nakładają się na święta o stałej dacie. Wigilia, Boże Narodzenie, 1 i 3 maja oraz 11 listopada należą do kogo innego.",
      "Nowe święta ustanawia Instytut. Propozycje przyjmuje się na piśmie, rozpatruje bez pośpiechu.",
    ],
    promo: "Święto świętem, a badanie?",
    promoText: "Test Dziadersa wykonuje się w każdy dzień roku, także w święta Instytutu. Około czterech minut.",
  },
  sl: {
    title: "Koledar nenavadnih praznikov",
    metaTitle: "Koledar nenavadnih praznikov: kaj praznujemo danes?",
    description: (count: number) =>
      `Kaj praznujemo danes? ${count} nenavadnih praznikov Inštituta, mesec za mesecem: od Dneva bele nogavice do Dneva krapa v kadi. Praznovati po navodilih.`,
    lead: "Prazniki Inštituta, mesec za mesecem. Noben ni dela prost dan. Vsak ima navodila za praznovanje, zavetniško vrsto in stalen datum.",
    meta: (count: number) => `${count} praznikov · približno eden na teden · stalni datumi`,
    calendar: "Trgalni koledar",
    today: "danes",
    months: "Mesec za mesecem",
    monthsIntro: "Klikni praznik, da prebereš navodila za praznovanje in preveriš, na kateri dan v tednu pade letos.",
    rules: "Pravila",
    rulesList: [
      "Praznikov Inštituta se ne praznuje na račun tujega dopusta.",
      "Ne prekrivajo se s prazniki s stalnim datumom. Sveti večer, božič, 1. in 3. maj ter 11. november pripadajo drugim.",
      "Nove praznike razglaša Inštitut. Predloge sprejema pisno in jih obravnava brez naglice.",
    ],
    promo: "Praznik je praznik, kaj pa pregled?",
    promoText: "Test dziadersa se opravlja vsak dan v letu, tudi na praznike Inštituta. Približno štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description(getCalendar(locale).OBSERVANCES.length),
    path: PATH,
  });
}

export default async function ObservancesPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const today = await getToday();
  const months = observancesByMonth(locale);
  const all = getCalendar(locale).OBSERVANCES;
  const crumbs = [{ label: t.calendar, href: "/kalendarz" }, { label: t.title }];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          {
            ...publicationSchema(locale, PATH, t.title, t.description(all.length)),
            dateModified: today.date,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: all.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${item.name} (${dayLabel(item, locale)})`,
                url: absoluteUrl("/kalendarz/" + item.slug, locale),
              })),
            },
          },
        ]}
      />
      <PageHeader crumbs={crumbs} title={t.title} lead={typo(t.lead)} meta={t.meta(all.length)} />
      <div className="wrap mt-10">
        <TodayObservance today={today} locale={locale} all={false} className="max-w-3xl" />
      </div>
      <Section id="miesiace" title={t.months} intro={typo(t.monthsIntro)}>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {months.map((month) => (
            <section key={month.month} aria-labelledby={`m${month.month}`}>
              <h3 id={`m${month.month}`} className="border-b border-ink pb-2 text-2xl font-bold first-letter:uppercase">
                {month.name}
              </h3>
              <ol>
                {month.items.map((item) => {
                  const current = item.date === `${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`;
                  return (
                    <li key={item.date} className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-rule py-3">
                      <span className="label pt-1 text-red">{dayLabel(item, locale).replace(/\s.*$/, "")}</span>
                      <span>
                        <Link href={"/kalendarz/" + item.slug} className="font-bold leading-tight hover:text-red">
                          {item.name}
                        </Link>
                        {current && <span className="label ml-2 font-semibold text-red-deep">{t.today}</span>}
                        <span className="mt-1 block text-[0.95rem] leading-snug text-ink-soft">{typo(item.note)}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </Section>
      <Section id="zasady" title={t.rules}>
        <ol className="max-w-3xl list-decimal space-y-3 pl-6 text-lg">
          {t.rulesList.map((rule) => (
            <li key={rule}>{typo(rule)}</li>
          ))}
        </ol>
        <p className="mt-8 font-sans text-lg">
          <Link href="/kalendarz" className="link">
            {t.calendar} →
          </Link>
        </p>
      </Section>
      <TestPromo title={t.promo} text={typo(t.promoText)} />
    </main>
  );
}
