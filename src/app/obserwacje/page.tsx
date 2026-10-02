import type { Metadata } from "next";
import { ObservationMap, type MapSpecies } from "@/components/observation-map";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Sightings } from "@/components/sightings";
import { REGIONS } from "@/content/regions";
import { SPECIES } from "@/content/species";
import { getCommunity, getSightingsMap } from "@/lib/community";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, typo } from "@/lib/typo";

const title = "Mapa obserwacji";
const description =
  "Gdzie widziano dziadersa: zgłoszenia Sieci Obserwatorów Terenowych według województw, dla wszystkich gatunków z Atlasu albo jednego. Aktualizowane co kilka minut.";

export const metadata: Metadata = pageMetadata({
  title: "Mapa obserwacji dziadersów według województw",
  description,
  path: "/obserwacje",
  shareTitle: `${title} · ${site.name}`,
});

export default async function ObservationsPage() {
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
  const species: MapSpecies[] = SPECIES.map((item) => ({ key: item.key, name: item.name, slug: item.slug, total: totals[item.key] ?? 0 })).sort(
    (a, b) => b.total - a.total || a.name.localeCompare(b.name, "pl"),
  );
  const total = Object.values(totals).reduce((sum, n) => sum + n, 0);

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/obserwacje" }]),
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${title}: zgłoszenia według województw`,
            description,
            url: `${site.url}/obserwacje`,
            inLanguage: "pl",
            creator: institute,
            publisher: institute,
            isAccessibleForFree: true,
            spatialCoverage: "Polska",
          },
        ]}
      />
      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Gdzie widziano dziadersa. Zgłoszenia obserwatorów terenowych z Profilem Dziaderskim, według województw, dla wszystkich gatunków albo jednego.",
        )}
        meta={`${total.toLocaleString("pl-PL")} ${plural(total, "zgłoszenie", "zgłoszenia", "zgłoszeń")} · ${SPECIES.length} gatunków w Atlasie · 16 województw`}
      />

      <Section id="mapa" title="Zgłoszenia według województw" aside="Sieć Obserwatorów Terenowych IBD">
        <ObservationMap matrix={matrix} species={species} unplaced={unplaced} />
      </Section>

      <Sightings community={community} />

      <TestPromo
        title="Obserwujesz innych? Zbadaj siebie."
        text={typo("Test Dziadersa rozpozna twój gatunek. Pięć gabinetów, około czterech minut, certyfikat.")}
      />
    </main>
  );
}
