import type { Metadata } from "next";
import type { ReactNode } from "react";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { TearOffCalendar } from "@/components/tear-off";
import { getCalendar } from "@/content/calendar";
import { docket } from "@/content/cases";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { previousSheet, sheetFor, type Sheet } from "@/lib/almanac";
import { getBulletin } from "@/lib/bulletin";
import { getCommunity } from "@/lib/community";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { backOf, pageFor } from "@/lib/tear-off";
import { getToday } from "@/lib/today";
import { pct, plural, pluralSl, quote, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Kartka z kalendarza",
    metaTitle: "Kartka z kalendarza: przysłowie i porada na dziś",
    description:
      "Codziennie nowa kartka z kalendarza Instytutu: wschód i zachód słońca, przysłowie dziaderskie, porada na dziś, patron dnia i święto Instytutu. Zrywać rano.",
    lead: "Codziennie nowa kartka. Z przodu data, słońce i przysłowie, z tyłu porada i patron dnia. Zrywać rano, najlepiej przy herbacie.",
    meta: (sheet: Sheet) =>
      `${sheet.weekday}, ${sheet.date} · dzień ${sheet.dayOfYear} · ${sheet.toChristmasEve ? `do Wigilii ${sheet.toChristmasEve} ${plural(sheet.toChristmasEve, "dzień", "dni", "dni")}` : "Wigilia"}`,
    calendar: "Kalendarz",
    back: "Na odwrocie kartki",
    tip: "Porada na dziś",
    order: "Zalecenie Instytutu",
    index: (value: number, zone: string) => `Narodowy Indeks Dziaderstwa dziś: ${pct(value)}%, natężenie ${zone}.`,
    patron: "Patron dnia",
    entry: "Hasło dnia",
    case: "Sprawa dnia w Komisji",
    judge: "Czy to już dziaderstwo? Orzeknij →",
    observances: "Najbliższe święta Instytutu",
    promo: {
      title: "Kartka na dziś zerwana. A badanie?",
      text: "Test Dziadersa: pięć gabinetów, około czterech minut. Wynik nie zmienia się o północy.",
    },
    notes: [] as string[],
  },
  sl: {
    title: "Trgalni koledar",
    metaTitle: "Trgalni koledar: pregovor in nasvet za danes",
    description:
      "Vsak dan nov list s koledarja Inštituta: sonce nad Varšavo, dziaderski pregovor, nasvet za danes, zavetnik dneva in praznik Inštituta. Trgati zjutraj.",
    lead: "Vsak dan nov list. Spredaj datum, sonce nad Varšavo in pregovor, zadaj nasvet in zavetnik dneva. Trgati zjutraj, najbolje ob čaju.",
    meta: (sheet: Sheet) =>
      `${sheet.weekday}, ${sheet.date} · ${sheet.dayOfYear}. dan v letu · ${sheet.toChristmasEve ? `do svetega večera ${sheet.toChristmasEve} ${pluralSl(sheet.toChristmasEve, "dan", "dneva", "dnevi", "dni")}` : "sveti večer"}`,
    calendar: "Koledar",
    back: "Na hrbtni strani lista",
    tip: "Nasvet za danes",
    order: "Priporočilo Inštituta",
    index: (value: number, zone: string) => `Nacionalni indeks dziaderstva danes: ${pct(value)} %, jakost: ${zone}.`,
    patron: "Zavetnik dneva",
    entry: "Geslo dneva",
    case: "Primer dneva v Komisiji",
    judge: "Je to že dziaderstvo? Razsodi →",
    observances: "Najbližji prazniki Inštituta",
    promo: {
      title: "Današnji list je odtrgan. Kaj pa pregled?",
      text: "Test dziadersa: pet ordinacij, približno štiri minute. Izvid se opolnoči ne spremeni.",
    },
    notes: [
      "Vzhod in zahod: časi veljajo za Varšavo, kot v izvirniku. V Ljubljani so lahko drugačni tudi za skoraj eno uro.",
      "Rdeče številke: nedelje in dela prosti dnevi na Poljskem. Večina se jih ujema s slovenskimi, 3. maj in 11. november ne.",
      "Sveti večer: na Poljskem Wigilia, postna večerja z dvanajstimi jedmi, ki se začne, ko zasije prva zvezda. Od leta 2025 je dela prost dan.",
    ],
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/kalendarz",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

function Back({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink pt-4">
      <p className="label text-ink-soft">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default async function CalendarPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const [today, bulletin, community] = await Promise.all([getToday(), getBulletin(locale), getCommunity()]);
  const sheet = sheetFor(today.year, today.month, today.day, locale);
  const page = pageFor(sheet, locale);
  const back = backOf(sheet, locale);
  const upcoming = getCalendar(locale)
    .OBSERVANCES.map((item) => {
      const [month, day] = item.date.split("-").map(Number);
      const year = month * 100 + day > sheet.month * 100 + sheet.day ? sheet.year : sheet.year + 1;
      return { ...item, sheet: sheetFor(year, month, day, locale) };
    })
    .sort((a, b) => a.sheet.key.localeCompare(b.sheet.key))
    .slice(0, 5);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/kalendarz" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/kalendarz", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
            dateModified: today.at,
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(sheet)} />

      <section aria-label={t.calendar} className="wrap py-12 md:py-16">
        <TearOffCalendar
          today={page}
          yesterday={pageFor(previousSheet(sheet, locale), locale)}
          tornToday={community ? (community.talliesToday.kartka ?? 0) : null}
        />
        <TranslatorNotes notes={t.notes} className="mt-14 max-w-2xl" />
      </section>

      <Section id="odwrocie" title={t.back} aside={sheet.date}>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          <Back label={t.tip}>
            <p className="text-[1.25rem] leading-snug">{typo(back.tip)}</p>
          </Back>
          <Back label={t.order}>
            <p className="text-[1.25rem] font-bold leading-snug">{typo(back.order)}</p>
            <p className="label mt-3 text-ink-soft">{t.index(bulletin.index.value, bulletin.index.zone.label)}</p>
          </Back>
          <Back label={t.patron}>
            <Link href={`/atlas/${back.patron.slug}`} className="group flex items-center gap-4">
              <SpeciesPlate species={back.patron.key} animated className="w-28 shrink-0" />
              <span>
                <span className="block text-xl font-bold leading-tight group-hover:text-red">{back.patron.name}</span>
                <span className="mt-1 block font-sans text-[0.9rem] leading-snug text-ink-soft">{typo(back.patron.teaser)}</span>
              </span>
            </Link>
          </Back>
          <Back label={t.entry}>
            <Link href={`/slownik/${back.entry.slug}`} className="text-2xl font-bold leading-tight hover:text-red">
              {quote(back.entry.headword, locale)}
            </Link>
            <p className="mt-2 leading-snug text-ink-soft">{typo(back.entry.senses[0].text)}</p>
          </Back>
          <Back label={t.case}>
            <Link href={`/czy-to-juz-dziaderstwo/${back.case.slug}`} className="group block">
              <span className="label block text-ink-faint">{docket(back.case)}</span>
              <span className="block text-xl font-bold leading-tight group-hover:text-red">{back.case.title}</span>
              <span className="label mt-1 block text-ink-soft">{t.judge}</span>
            </Link>
          </Back>
          <Back label={t.observances}>
            <ol>
              {upcoming.map((item) => (
                <li key={item.date} className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-rule py-2 last:border-0">
                  <span className="label pt-0.5 text-red">{item.sheet.date.replace(/ \d{4}$/, "")}</span>
                  <span className="font-bold leading-tight">{item.name}</span>
                </li>
              ))}
            </ol>
          </Back>
        </div>
      </Section>

      <TestPromo title={t.promo.title} text={typo(t.promo.text)} />
    </main>
  );
}
