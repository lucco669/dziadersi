import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { editorialPath, publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { getCalendar, observanceBySlug } from "@/content/calendar";
import { getDictionary } from "@/content/dictionary";
import { speciesByKey } from "@/content/species";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { dayLabel, daysUntil, neighbours, nextSheet } from "@/lib/observances";
import { pageMetadata } from "@/lib/seo";
import { pageFor } from "@/lib/tear-off";
import { getToday } from "@/lib/today";
import { plural, pluralSl, quote, typo } from "@/lib/typo";

type Props = { params: Promise<{ lang: string; slug: string }> };

const COPY = defineCopy({
  pl: {
    calendar: "Kartka z kalendarza",
    index: "Kalendarz świąt nietypowych",
    title: (name: string, day: string) => `${name} (${day})`,
    description: (name: string, day: string, note: string) => `${name}, ${day}: święto nietypowe z kalendarza Instytutu. ${note}`,
    meta: (day: string) => `${day} · święto Instytutu · obchodzone co roku`,
    rite: "Jak obchodzić",
    when: "Najbliższe obchody",
    today: "Dziś. Obchody trwają do północy.",
    inDays: (days: number) => (days === 1 ? "Jutro." : `Za ${days} ${plural(days, "dzień", "dni", "dni")}.`),
    sun: (sunrise: string, sunset: string) => `Wschód słońca w Warszawie ${sunrise}, zachód ${sunset}.`,
    proverb: "Przysłowie z kartki tego dnia",
    dayOff: "Uwaga: w tym roku święto wypada w dzień wolny od pracy. Obchodzić w domu.",
    patron: "Gatunek patronacki",
    entry: "Hasło na ten dzień",
    month: "Inne święta w tym miesiącu",
    previous: "Poprzednie święto",
    next: "Następne święto",
    all: "Wszystkie święta nietypowe, miesiąc po miesiącu",
    tear: "Dzisiejsza kartka z kalendarza",
    promo: "Obchody obchodami, a badanie?",
    promoText: "Test Dziadersa: pięć gabinetów, około czterech minut. Wynik ważny także w święta.",
  },
  sl: {
    calendar: "Trgalni koledar",
    index: "Koledar nenavadnih praznikov",
    title: (name: string, day: string) => `${name} (${day})`,
    description: (name: string, day: string, note: string) => `${name}, ${day}: nenavaden praznik iz koledarja Inštituta. ${note}`,
    meta: (day: string) => `${day} · praznik Inštituta · praznuje se vsako leto`,
    rite: "Kako praznovati",
    when: "Naslednje praznovanje",
    today: "Danes. Praznovanje traja do polnoči.",
    inDays: (days: number) => (days === 1 ? "Jutri." : `Čez ${days} ${pluralSl(days, "dan", "dneva", "dnevi", "dni")}.`),
    sun: (sunrise: string, sunset: string) => `Vzhod sonca v Varšavi ob ${sunrise}, zahod ob ${sunset}.`,
    proverb: "Pregovor z lista tega dne",
    dayOff: "Opomba: letos praznik pade na dela prost dan na Poljskem. Praznovati doma.",
    patron: "Zavetniška vrsta",
    entry: "Geslo za ta dan",
    month: "Drugi prazniki ta mesec",
    previous: "Prejšnji praznik",
    next: "Naslednji praznik",
    all: "Vsi nenavadni prazniki, mesec za mesecem",
    tear: "Današnji list trgalnega koledarja",
    promo: "Praznik je praznik, kaj pa pregled?",
    promoText: "Test dziadersa: pet ordinacij, približno štiri minute. Izvid velja tudi ob praznikih.",
  },
});

/** Titles longer than this drop the calendar's name; search engines cut them anyway. */
const MAX_TITLE = 70;

export const instant = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getCalendar(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).OBSERVANCES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const item = observanceBySlug((await params).slug, locale);
  if (!item) return {};
  const t = COPY[locale];
  const day = dayLabel(item, locale);
  const title = t.title(item.name, day);
  const full = `${title} · ${t.index}`;
  return pageMetadata(locale, {
    title: full.length <= MAX_TITLE ? full : title,
    description: t.description(item.name, day, item.note),
    path: "/kalendarz/" + item.slug,
    type: "article",
  });
}

export default async function ObservancePage({ params }: Props) {
  const locale = await getLocale();
  const t = COPY[locale];
  const item = observanceBySlug((await params).slug, locale);
  if (!item) notFound();
  const today = await getToday();
  const day = dayLabel(item, locale);
  const sheet = nextSheet(item, today, locale);
  const page = pageFor(sheet, locale);
  const days = daysUntil(sheet, today);
  const species = speciesByKey(item.species, locale);
  const entryPath = item.entry ? editorialPath("slownik", item.entry, locale) : undefined;
  const entry = entryPath ? getDictionary(locale).find((other) => "/slownik/" + other.slug === entryPath) : undefined;
  const { previous, next } = neighbours(item, locale);
  const sameMonth = getCalendar(locale).OBSERVANCES.filter((other) => other.date.slice(0, 2) === item.date.slice(0, 2) && other.date !== item.date);
  const path = "/kalendarz/" + item.slug;
  const crumbs = [
    { label: t.calendar, href: "/kalendarz" },
    { label: t.index, href: "/kalendarz/swieta" },
    { label: item.name },
  ];
  return (
    <main id="tresc">
      <JsonLd data={[breadcrumbList(locale, crumbs), publicationSchema(locale, path, t.title(item.name, day), t.description(item.name, day, item.note), "Article")]} />
      <PageHeader
        crumbs={crumbs}
        title={item.name}
        lead={typo(item.note)}
        meta={t.meta(day)}
        aside={
          <div className="mx-auto flex w-56 max-w-full flex-col items-center border-2 border-ink bg-card py-5" aria-hidden="true">
            <span className="font-sans text-sm uppercase tracking-[0.3em]">{sheet.monthName}</span>
            <span className={`text-[7rem] font-bold leading-[0.9] tracking-[-0.04em] ${page.red ? "text-red" : ""}`}>{sheet.day}</span>
            <span className={`text-xl font-bold ${page.red ? "text-red" : ""}`}>{sheet.weekday}</span>
          </div>
        }
      />
      <Section id="obchody" title={t.rite}>
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <p className="max-w-2xl text-2xl leading-snug">{typo(item.rite)}</p>
          <div className="border border-rule bg-paper-deep p-6">
            <h3 className="label text-red-deep">{t.when}</h3>
            <p className="mt-3 text-xl font-bold first-letter:uppercase">
              {sheet.weekday}, {sheet.date}
            </p>
            <p className="mt-1 text-ink-soft">{days === 0 ? t.today : t.inDays(days)}</p>
            <p className="mt-3 font-sans text-[0.95rem] text-ink-soft">{t.sun(page.sunrise, page.sunset)}</p>
            {sheet.dayOff && <p className="mt-3 font-sans text-[0.95rem] text-ink-soft">{t.dayOff}</p>}
            <h3 className="label mt-6 text-ink-soft">{t.proverb}</h3>
            <p className="mt-2 italic leading-snug">
              {page.proverb.split(" / ").map((line) => (
                <span key={line} className="block">
                  {typo(line)}
                </span>
              ))}
            </p>
          </div>
        </div>
      </Section>
      <Section id="patron" title={t.patron}>
        <div className="grid gap-10 md:grid-cols-2">
          <Link href={"/atlas/" + species.slug} className="group flex items-center gap-6">
            <SpeciesPlate species={species.key} className="w-40 shrink-0" />
            <span>
              <span className="block text-2xl font-bold leading-tight group-hover:text-red">{species.name}</span>
              <span className="mt-2 block text-ink-soft">{typo(species.teaser)}</span>
            </span>
          </Link>
          {entry && (
            <div className="border-t border-rule pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <p className="label text-ink-soft">{t.entry}</p>
              <Link href={"/slownik/" + entry.slug} className="mt-2 block text-2xl font-bold leading-tight hover:text-red">
                {quote(entry.headword, locale)}
              </Link>
              <p className="mt-2 text-ink-soft">{typo(entry.senses[0].text)}</p>
            </div>
          )}
        </div>
      </Section>
      <Section id="miesiac" title={t.month}>
        {sameMonth.length > 0 && (
          <ul className="grid gap-x-10 md:grid-cols-2">
            {sameMonth.map((other) => (
              <li key={other.date} className="grid grid-cols-[6rem_1fr] gap-3 border-b border-rule py-3">
                <span className="label pt-1 text-red">{dayLabel(other, locale)}</span>
                <Link href={"/kalendarz/" + other.slug} className="font-bold leading-tight hover:text-red">
                  {other.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <nav className="mt-10 grid gap-5 font-sans sm:grid-cols-2" aria-label={t.index}>
          <Link href={"/kalendarz/" + previous.slug} className="group block border-t border-ink pt-3">
            <span className="label text-ink-soft">← {t.previous}</span>
            <span className="mt-1 block font-serif text-xl font-bold group-hover:text-red">{previous.name}</span>
            <span className="label text-ink-faint">{dayLabel(previous, locale)}</span>
          </Link>
          <Link href={"/kalendarz/" + next.slug} className="group block border-t border-ink pt-3 sm:text-right">
            <span className="label text-ink-soft">{t.next} →</span>
            <span className="mt-1 block font-serif text-xl font-bold group-hover:text-red">{next.name}</span>
            <span className="label text-ink-faint">{dayLabel(next, locale)}</span>
          </Link>
        </nav>
        <ul className="mt-10 space-y-3 font-sans text-lg">
          <li>
            <Link href="/kalendarz/swieta" className="link">
              {t.all} →
            </Link>
          </li>
          <li>
            <Link href="/kalendarz" className="link">
              {t.tear} →
            </Link>
          </li>
        </ul>
        <div className="mt-10">
          <ShareBar path={path} text={item.name} kind="swieto" />
        </div>
      </Section>
      <TestPromo title={t.promo} text={typo(t.promoText)} />
    </main>
  );
}
