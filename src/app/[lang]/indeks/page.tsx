import type { Metadata } from "next";
import { Crowd } from "@/components/crowd";
import { IndexChart } from "@/components/index-chart";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { RegionMap } from "@/components/region-map";
import { getMapRegions } from "@/content/map";
import { LOCALE_INFO, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getBulletin } from "@/lib/bulletin";
import { formatDayMonth } from "@/lib/calendar";
import { seasons, zones } from "@/lib/indeks";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, pct, plural, pluralSl, roman, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Narodowy Indeks Dziaderstwa",
    metaTitle: "Narodowy Indeks Dziaderstwa: natężenie w Polsce",
    description:
      "Natężenie dziaderstwa w Polsce, aktualizowane co godzinę: bieżąca wartość, przebieg w tym roku, prognoza na Wigilię, mapa województw i metodologia.",
    place: "Polska",
    variable: "Natężenie dziaderstwa (0–100)",
    lead: "Natężenie dziaderstwa w skali kraju, aktualizowane co godzinę. Indeks łączy sezonowość zjawiska, kalendarz wydarzeń wysokiego ryzyka i wyniki obserwacji terenowych.",
    updated: "Aktualizacja:",
    at: (date: string, time: string) => `${date}, godz. ${time}`,
    source: "Źródło: IBD",
    today: "Stan na dziś",
    /** The percent sign after the big figure. */
    percent: "%",
    percentOf: (value: string) => `${value}%`,
    unchanged: "bez zmian",
    points: (delta: string) => `${delta} pkt`,
    intensity: "Natężenie",
    since: (trend: string, season: string) => ` · ${trend} od początku ${season}`,
    warning: (level: string) => `Ostrzeżenie ${level} stopnia`,
    crowd: (count: number) => `${count} na 100 osób wykazuje objawy dziaderstwa`,
    figure: (count: number) => `Rys. 1. Natężenie w przeliczeniu na 100 osób: ${count} ${plural(count, "osoba", "osoby", "osób")} z objawami.`,
    now: "obecnie",
    zoneNotes: [
      "Objawy pojedyncze i nieszkodliwe. W tym przedziale indeks nie był notowany od 1989 roku.",
      "Zjawisko obecne, ale pod kontrolą. Pojedyncze uwagi o oponach i cenach gofrów.",
      "Stan typowy dla polskiej codzienności. Komentarze przy grillu, kartki za wycieraczkami.",
      "Wigilia, majówka, pierwszy dzień urlopu nad morzem. Zaleca się unikanie tematów.",
    ],
    year: "Rok w dziaderstwie",
    yearAside: (year: number) => `Rok ${year}`,
    yearIntro: "Linia ciągła to pomiar, przerywana to prognoza Instytutu. Najwyższej wartości w roku Instytut spodziewa się w Wigilię.",
    seasons: "Sezony i poziomy ostrzeżeń",
    seasonsIntro: "Rok dziaderski dzieli się na siedem sezonów. Każdy ma własny poziom ostrzeżenia, ogłaszany jak ostrzeżenia meteorologiczne.",
    from: "Od",
    season: "Sezon",
    level: "Stopień",
    alert: "Komunikat",
    levelBadge: (level: string) => `${level} stopnia`,
    regions: "Dziaderstwo według województw",
    regionsAside: "Badanie terenowe 2026",
    regionsIntro: "Mapa pokazuje gatunek dominujący w każdym województwie. Lista obok porządkuje województwa według natężenia zjawiska.",
    method: "Jak powstaje indeks",
    methodIntro: "Instytut ujawnia metodologię w zakresie, w jakim sam ją rozumie.",
    component: (n: string) => `Składnik ${n}`,
    methods: [
      {
        title: "Sezonowość",
        text: "Bazowy poziom dziaderstwa zmienia się w rytmie pór roku. Rośnie latem, kiedy zjawisko ma więcej okazji do wystąpienia na zewnątrz, i spada w lutym, kiedy wszyscy są zbyt zmęczeni zimą.",
      },
      {
        title: "Kalendarz zagrożeń",
        text: "Na bazowy poziom nakładają się wydarzenia wysokiego ryzyka: Wielkanoc, majówka, szczyt sezonu parawanowego, wymiana opon i Wigilia. Każde ma ustaloną przez Instytut siłę i czas trwania.",
      },
      {
        title: "Obserwacje terenowe",
        text: "Codzienne i cogodzinne wahania pochodzą z obserwacji terenowych. Instytut nie ujawnia ich źródeł, ale zapewnia, że wszyscy obserwatorzy siedzieli na ławkach.",
      },
    ],
    footnote: "Indeks jest przeliczany co godzinę według czasu warszawskiego. Wszystkie dane są zmyślone, a mimo to się zgadzają.",
    promoTitle: "Podnieś indeks osobiście.",
    promoText: "Każdy wynik powyżej średniej krajowej jest wkładem w naukę. Test Dziadersa: pięć gabinetów, około czterech minut.",
  },
  sl: {
    title: "Nacionalni indeks dziaderstva",
    metaTitle: "Nacionalni indeks dziaderstva: jakost na Poljskem",
    description:
      "Jakost dziaderstva na Poljskem, posodobljena vsako uro: trenutna vrednost, potek v tem letu, napoved za sveti večer, zemljevid vojvodstev in metodologija.",
    place: "Poljska",
    variable: "Jakost dziaderstva (0–100)",
    lead: "Jakost dziaderstva na ravni države, posodobljena vsako uro. Indeks združuje sezonskost pojava, koledar dogodkov z visokim tveganjem in izsledke terenskih opazovanj.",
    updated: "Posodobljeno:",
    at: (date: string, time: string) => `${date} ob ${time}`,
    source: "Vir: IBD",
    today: "Stanje danes",
    // No-break spaces before "%" and inside "o. t.".
    percent: " %",
    percentOf: (value: string) => `${value} %`,
    unchanged: "brez sprememb",
    // Odstotne točke, as in SURS releases.
    points: (delta: string) => `${delta} o. t.`,
    intensity: "Jakost",
    since: (trend: string, season: string) => ` · ${trend} od začetka ${season}`,
    warning: (level: string) => `Opozorilo ${level}. stopnje`,
    crowd: (count: number) => `${count} od 100 oseb s simptomi dziaderstva`,
    figure: (count: number) =>
      `Slika 1. Jakost, preračunana na 100 oseb: ${count} ${pluralSl(count, "oseba", "osebi", "osebe", "oseb")} s simptomi.`,
    now: "trenutno",
    zoneNotes: [
      "Posamezni in neškodljivi simptomi. V tem razponu indeksa niso zabeležili od leta 1989.",
      "Pojav je prisoten, a pod nadzorom. Posamezne pripombe o pnevmatikah in cenah vafljev.",
      "Stanje, značilno za poljski vsakdan. Komentarji ob žaru, listki za brisalci.",
      "Sveti večer, prvomajski vikend, prvi dan dopusta na morju. Priporoča se izogibanje temam.",
    ],
    year: "Leto v dziaderstvu",
    yearAside: (year: number) => `Leto ${year}`,
    yearIntro: "Polna črta je meritev, črtkana napoved Inštituta. Najvišjo vrednost v letu Inštitut pričakuje na sveti večer.",
    seasons: "Sezone in stopnje opozoril",
    seasonsIntro: "Dziadersko leto se deli na sedem sezon. Vsaka ima svojo stopnjo opozorila, ki jo Inštitut razglaša po zgledu vremenskih opozoril.",
    from: "Od",
    season: "Sezona",
    level: "Stopnja",
    alert: "Obvestilo",
    levelBadge: (level: string) => `${level}. stopnja`,
    regions: "Dziaderstvo po vojvodstvih",
    regionsAside: "Terenska raziskava 2026",
    regionsIntro: "Zemljevid kaže prevladujočo vrsto v vsakem vojvodstvu. Seznam ob njem razvršča vojvodstva po jakosti pojava.",
    method: "Kako nastane indeks",
    methodIntro: "Inštitut razkriva metodologijo v obsegu, v katerem jo razume sam.",
    component: (n: string) => `Sestavina ${n}`,
    methods: [
      {
        title: "Sezonskost",
        text: "Osnovna raven dziaderstva se spreminja v ritmu letnih časov. Poleti raste, ko ima pojav več priložnosti, da se pokaže na prostem, februarja pa pade, ko so vsi preveč utrujeni od zime.",
      },
      {
        title: "Koledar nevarnosti",
        text: "Na osnovno raven se nalagajo dogodki z visokim tveganjem: velika noč, prvomajski vikend, vrhunec sezone vetrobranov, menjava pnevmatik in sveti večer. Vsak ima moč in trajanje, ki ju je določil Inštitut.",
      },
      {
        title: "Terenska opazovanja",
        text: "Dnevna in urna nihanja izhajajo iz terenskih opazovanj. Inštitut ne razkriva njihovih virov, zagotavlja pa, da so vsi opazovalci sedeli na klopeh.",
      },
    ],
    footnote: "Indeks se preračunava vsako uro po varšavskem času. Vsi podatki so izmišljeni, pa vendar držijo.",
    promoTitle: "Dvigni indeks osebno.",
    promoText: "Vsak izvid nad državnim povprečjem je prispevek k znanosti. Test dziadersa: pet ordinacij, približno štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/indeks",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

const capitalize = (text: string, locale: Locale) => text.charAt(0).toLocaleUpperCase(LOCALE_INFO[locale].tag) + text.slice(1);

export default async function IndexPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const bulletin = await getBulletin(locale);
  const { value, delta, season, zone } = bulletin.index;
  const count = Math.round(value);
  const trend = delta === 0 ? t.unchanged : t.points(`${delta > 0 ? "+" : "−"}${pct(Math.abs(delta))}`);
  const regions = getMapRegions(locale);
  const ranking = Object.values(regions).sort((a, b) => b.value - a.value);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/indeks" }]),
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: t.title,
            description: t.description,
            url: absoluteUrl("/indeks", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            creator: institute(locale),
            isAccessibleForFree: true,
            datePublished: site.launched,
            dateModified: bulletin.updated,
            temporalCoverage: String(bulletin.year),
            spatialCoverage: { "@type": "Place", name: t.place },
            variableMeasured: t.variable,
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={
          <>
            {t.updated}{" "}
            <time dateTime={bulletin.updated}>{t.at(bulletin.date, bulletin.time)}</time>{" "}
            · {t.source}
          </>
        }
      />

      <Section id="dzis" title={t.today} aside={capitalize(season.title, locale)}>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[clamp(5rem,12vw,9rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
              {pct(value)}
              <span className="text-[0.45em]">{t.percent}</span>
            </p>
            <p className="label mt-4 text-ink-soft">
              {t.intensity} <span className="font-semibold text-ink">{zone.label}</span>
              {t.since(trend, season.name)}
            </p>
            <div className="mt-8 border-l-2 border-red pl-5">
              <p className="label font-semibold text-red">{t.warning(roman(season.level))}</p>
              <p className="mt-1 text-lg leading-snug">{typo(season.alert)}</p>
            </div>
          </div>
          <figure className="lg:col-span-7">
            <Crowd count={count} columns={25} className="w-full" label={t.crowd(count)} />
            <figcaption className="label mt-4 text-ink-soft">{t.figure(count)}</figcaption>
          </figure>
        </div>

        <ol className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {zones(locale).map((item, i) => {
            const current = item.label === zone.label;
            return (
              <li
                key={item.label}
                className={cx(
                  "border-b border-rule py-5 sm:pr-6 lg:border-b-0",
                  i > 0 && "lg:border-l lg:pl-6",
                  current && "bg-red/[0.06]",
                )}
              >
                <p className="label text-ink-soft">
                  {item.from}–{item.to}
                  {current && <span className="ml-2 font-semibold text-red">{t.now}</span>}
                </p>
                <p className="mt-1 text-xl font-bold">
                  {t.intensity} {item.label}
                </p>
                <p className="mt-1 leading-snug text-ink-soft">{typo(t.zoneNotes[i])}</p>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="przebieg" title={t.year} aside={t.yearAside(bulletin.year)} intro={typo(t.yearIntro)}>
        <IndexChart bulletin={bulletin} locale={locale} />
      </Section>

      <Section id="sezony" title={t.seasons} intro={typo(t.seasonsIntro)}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="label border-b border-ink text-ink-soft">
                <th scope="col" className="py-3 pr-6 font-medium">
                  {t.from}
                </th>
                <th scope="col" className="py-3 pr-6 font-medium">
                  {t.season}
                </th>
                <th scope="col" className="py-3 pr-6 font-medium">
                  {t.level}
                </th>
                <th scope="col" className="py-3 font-medium">
                  {t.alert}
                </th>
              </tr>
            </thead>
            <tbody>
              {seasons(locale).map((item) => {
                // The bulletin is a cached copy, so compare by value.
                const current = item.title === season.title;
                return (
                  <tr key={item.title} className={cx("border-b border-rule align-baseline", current && "bg-red/[0.06]")}>
                    <td className="whitespace-nowrap py-4 pr-6 font-sans text-[0.9rem] text-ink-soft">
                      {formatDayMonth(item.from[0], item.from[1], locale)}
                    </td>
                    <th scope="row" className="py-4 pr-6 text-xl font-bold">
                      {capitalize(item.title, locale)}
                      {current && <span className="label ml-3 align-middle font-semibold text-red">{t.now}</span>}
                    </th>
                    <td className="py-4 pr-6">
                      <span
                        className={cx(
                          "label inline-block whitespace-nowrap border px-2 py-1 font-semibold",
                          item.level === 3 ? "border-red bg-red text-paper" : item.level === 2 ? "border-red text-red" : "border-ink/40 text-ink-soft",
                        )}
                      >
                        {t.levelBadge(roman(item.level))}
                      </span>
                    </td>
                    <td className="py-4 leading-snug">{typo(item.alert)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="regiony" title={t.regions} aside={t.regionsAside} intro={typo(t.regionsIntro)}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <RegionMap regions={regions} className="lg:col-span-5" />
          <ol className="border-t border-ink lg:col-span-7">
            {ranking.map((region, i) => (
              <li key={region.code} className="border-b border-rule">
                <Link href={`/atlas/${region.speciesSlug}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3">
                  <span className="font-sans text-[0.9rem] font-semibold text-ink-soft tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="text-lg font-bold">{region.name}</span>
                    <span className="ml-2 text-ink-soft transition-colors group-hover:text-red">· {region.speciesName}</span>
                  </span>
                  <span className="font-sans text-[0.95rem] font-semibold tabular-nums">{t.percentOf(pct(region.value))}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="metodologia" title={t.method} intro={typo(t.methodIntro)}>
        <div className="grid gap-10 lg:grid-cols-3">
          {t.methods.map((block, i) => (
            <div key={block.title} className="border-t border-rule pt-5">
              <p className="label text-red">{t.component(roman(i + 1))}</p>
              <h3 className="mt-2 text-2xl font-bold leading-tight">{block.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{typo(block.text)}</p>
            </div>
          ))}
        </div>
        <p className="label mt-12 text-ink-soft">{t.footnote}</p>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
