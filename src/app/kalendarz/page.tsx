import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { TearOffCalendar } from "@/components/tear-off";
import { OBSERVANCES } from "@/content/calendar";
import { docket } from "@/content/cases";
import { previousSheet, sheetFor } from "@/lib/almanac";
import { getBulletin } from "@/lib/bulletin";
import { getCommunity } from "@/lib/community";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { backOf, pageFor } from "@/lib/tear-off";
import { getToday } from "@/lib/today";
import { pct, plural, typo } from "@/lib/typo";

const title = "Kartka z kalendarza";
const description =
  "Codziennie nowa kartka z kalendarza Instytutu: wschód i zachód słońca, przysłowie dziaderskie, porada na dziś, patron dnia i święto Instytutu. Zrywać rano.";

export const metadata: Metadata = pageMetadata({
  title: "Kartka z kalendarza: przysłowie i porada na dziś",
  description,
  path: "/kalendarz",
  shareTitle: `${title} · ${site.name}`,
});

function Back({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink pt-4">
      <p className="label text-ink-soft">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default async function CalendarPage() {
  const [today, bulletin, community] = await Promise.all([getToday(), getBulletin(), getCommunity()]);
  const sheet = sheetFor(today.year, today.month, today.day);
  const page = pageFor(sheet);
  const back = backOf(sheet);
  const upcoming = OBSERVANCES.map((item) => {
    const [month, day] = item.date.split("-").map(Number);
    const year = month * 100 + day > sheet.month * 100 + sheet.day ? sheet.year : sheet.year + 1;
    return { ...item, sheet: sheetFor(year, month, day) };
  })
    .sort((a, b) => a.sheet.key.localeCompare(b.sheet.key))
    .slice(0, 5);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/kalendarz" }]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url: `${site.url}/kalendarz`,
            inLanguage: "pl",
            publisher: institute,
            dateModified: today.at,
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo("Codziennie nowa kartka. Z przodu data, słońce i przysłowie, z tyłu porada i patron dnia. Zrywać rano, najlepiej przy herbacie.")}
        meta={`${sheet.weekday}, ${sheet.date} · dzień ${sheet.dayOfYear} · ${sheet.toChristmasEve ? `do Wigilii ${sheet.toChristmasEve} ${plural(sheet.toChristmasEve, "dzień", "dni", "dni")}` : "Wigilia"}`}
      />

      <section aria-label="Kalendarz" className="wrap py-12 md:py-16">
        <TearOffCalendar today={page} yesterday={pageFor(previousSheet(sheet))} tornToday={community ? (community.talliesToday.kartka ?? 0) : null} />
      </section>

      <Section id="odwrocie" title="Na odwrocie kartki" aside={sheet.date}>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          <Back label="Porada na dziś">
            <p className="text-[1.25rem] leading-snug">{typo(back.tip)}</p>
          </Back>
          <Back label="Zalecenie Instytutu">
            <p className="text-[1.25rem] font-bold leading-snug">{typo(back.order)}</p>
            <p className="label mt-3 text-ink-soft">
              Narodowy Indeks Dziaderstwa dziś: {pct(bulletin.index.value)}%, natężenie {bulletin.index.zone.label}.
            </p>
          </Back>
          <Back label="Patron dnia">
            <Link href={`/atlas/${back.patron.slug}`} className="group flex items-center gap-4">
              <SpeciesPlate species={back.patron.key} animated className="w-28 shrink-0" />
              <span>
                <span className="block text-xl font-bold leading-tight group-hover:text-red">{back.patron.name}</span>
                <span className="mt-1 block font-sans text-[0.9rem] leading-snug text-ink-soft">{typo(back.patron.teaser)}</span>
              </span>
            </Link>
          </Back>
          <Back label="Hasło dnia">
            <Link href={`/slownik/${back.entry.slug}`} className="text-2xl font-bold leading-tight hover:text-red">
              „{back.entry.headword}”
            </Link>
            <p className="mt-2 leading-snug text-ink-soft">{typo(back.entry.senses[0].text)}</p>
          </Back>
          <Back label="Sprawa dnia w Komisji">
            <Link href={`/czy-to-juz-dziaderstwo/${back.case.slug}`} className="group block">
              <span className="label block text-ink-faint">{docket(back.case)}</span>
              <span className="block text-xl font-bold leading-tight group-hover:text-red">{back.case.title}</span>
              <span className="label mt-1 block text-ink-soft">Czy to już dziaderstwo? Orzeknij →</span>
            </Link>
          </Back>
          <Back label="Najbliższe święta Instytutu">
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

      <TestPromo
        title="Kartka na dziś zerwana. A badanie?"
        text={typo("Test Dziadersa: pięć gabinetów, około czterech minut. Wynik nie zmienia się o północy.")}
      />
    </main>
  );
}
