import type { Metadata } from "next";
import { ObservationMap, type MapSpecies } from "@/components/observation-map";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Sightings } from "@/components/sightings";
import { REGIONS } from "@/content/regions";
import { getSpecies } from "@/content/species";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { getCommunity, getSightingsMap } from "@/lib/community";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatNumber, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Mapa obserwacji",
    metaTitle: "Mapa obserwacji dziadersów według województw",
    description:
      "Gdzie widziano dziadersa: zgłoszenia Sieci Obserwatorów Terenowych według województw, dla wszystkich gatunków z Atlasu albo jednego. Aktualizowane co kilka minut.",
    dataset: "Mapa obserwacji: zgłoszenia według województw",
    country: "Polska",
    lead: "Gdzie widziano dziadersa. Zgłoszenia obserwatorów terenowych z Profilem Dziaderskim, według województw, dla wszystkich gatunków albo jednego.",
    meta: (total: number, species: number) =>
      `${formatNumber("pl", total)} ${plural(total, "zgłoszenie", "zgłoszenia", "zgłoszeń")} · ${species} gatunków w Atlasie · 16 województw`,
    map: "Zgłoszenia według województw",
    network: "Sieć Obserwatorów Terenowych IBD",
    promoTitle: "Obserwujesz innych? Zbadaj siebie.",
    promoText: "Test Dziadersa rozpozna twój gatunek. Pięć gabinetów, około czterech minut, certyfikat.",
  },
  sl: {
    title: "Zemljevid opazovanj",
    metaTitle: "Zemljevid opazovanj dziadersov po vojvodstvih",
    description:
      "Kje so videli dziadersa: prijave Mreže terenskih opazovalcev po vojvodstvih, za vse vrste iz Atlasa ali za eno. Posodobitev vsakih nekaj minut.",
    dataset: "Zemljevid opazovanj: prijave po vojvodstvih",
    country: "Poljska",
    lead: "Kje so videli dziadersa. Prijave terenskih opazovalcev z Dziaderskim profilom, po vojvodstvih, za vse vrste ali za eno.",
    meta: (total: number, species: number) =>
      `${formatNumber("sl", total)} ${pluralSl(total, "prijava", "prijavi", "prijave", "prijav")} · ${species} vrst v Atlasu · 16 vojvodstev`,
    map: "Prijave po vojvodstvih",
    network: "Mreža terenskih opazovalcev IBD",
    promoTitle: "Opazuješ druge? Preglej sebe.",
    promoText: "Test dziadersa bo diagnosticiral tvojo vrsto. Pet ordinacij, približno štiri minute, certifikat.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description,
    path: "/obserwacje",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

export default async function ObservationsPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const all = getSpecies(locale);
  const [map, community] = await Promise.all([getSightingsMap(), getCommunity()]);
  const matrix: Record<string, Record<string, number>> = {};
  const totals: Record<string, number> = {};
  let unplaced = 0;
  for (const row of map ?? []) {
    totals[row.species] = (totals[row.species] ?? 0) + row.n;
    if (!row.region || !(row.region in REGIONS)) {
      unplaced += row.n;
      continue;
    }
    (matrix[row.region] ??= {})[row.species] = row.n;
  }
  const species: MapSpecies[] = all.map((item) => ({ key: item.key, name: item.name, slug: item.slug, total: totals[item.key] ?? 0 })).sort(
    (a, b) => b.total - a.total || a.name.localeCompare(b.name, LOCALE_INFO[locale].tag),
  );
  const total = Object.values(totals).reduce((sum, n) => sum + n, 0);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/obserwacje" }]),
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: t.dataset,
            description: t.description,
            url: absoluteUrl("/obserwacje", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            creator: institute(locale),
            publisher: institute(locale),
            isAccessibleForFree: true,
            spatialCoverage: t.country,
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.meta(total, all.length)} />

      <Section id="mapa" title={t.map} aside={t.network}>
        <ObservationMap matrix={matrix} species={species} unplaced={unplaced} />
      </Section>

      <Sightings community={community} />

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
