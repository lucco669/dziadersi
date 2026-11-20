import type { Metadata } from "next";
import type { MapSpecies } from "@/components/observation-map";
import { LazyObservationMap } from "@/components/observation-map-lazy";
import { SignLine } from "@/components/conventional-sign";
import { breadcrumbList, DataLicense, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { Sightings } from "@/components/sightings";
import { getRegions, REGION_GRID, REGIONS } from "@/content/regions";
import { getSpecies } from "@/content/species";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { getCommunity, getSightingsMap } from "@/lib/community";
import { dataset, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatNumber, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Mapa obserwacji",
    metaTitle: "Mapa obserwacji dziadersów według województw",
    description:
      "Mapa obserwacji dziadersów: zgłoszenia obserwatorów terenowych według województw i gatunków z Atlasu. Zobacz dane aktualizowane co kilka minut.",
    dataset: "Mapa obserwacji: zgłoszenia według województw",
    country: "Polska",
    lead: "Gdzie widziano dziadersa. Zgłoszenia obserwatorów terenowych z Profilem Dziaderskim, według województw, dla wszystkich gatunków albo jednego.",
    meta: (total: number, species: number) =>
      `${formatNumber("pl", total)} ${plural(total, "zgłoszenie", "zgłoszenia", "zgłoszeń")} · ${species} ${plural(species, "gatunek", "gatunki", "gatunków")} w Atlasie · 16 województw`,
    map: "Zgłoszenia według województw",
    network: "Sieć Obserwatorów Terenowych IBD",
    empty:
      "Zjawisko nie wystąpiło. Mapa zacieni się po pierwszym zgłoszeniu z podanym województwem. Zgłoszenia przyjmuje strona każdego gatunku w Atlasie: jedno na gatunek dziennie, z Profilem Dziaderskim.",
    unknown: "Brak informacji. Sieć Obserwatorów jest chwilowo nieczynna.",
    atlas: "Do Atlasu",
    join: "Załóż Profil",
    emptyMap: "Mapa 2. Województwa bez zgłoszeń. Układ kafelkowy, kształty uproszczono. Źródło: IBD.",
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
    empty:
      "Pojava ni bilo. Zemljevid se bo obarval po prvi prijavi z navedenim vojvodstvom. Prijave sprejema stran vsake vrste v Atlasu: ena na vrsto na dan, z Dziaderskim profilom.",
    unknown: "Ni podatka. Mreža opazovalcev je začasno zaprta.",
    atlas: "V Atlas",
    join: "Ustvari profil",
    emptyMap: "Zemljevid 2. Vojvodstva brez prijav. Razporeditev v ploščicah, oblike so poenostavljene. Vir: IBD.",
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
  const regions = getRegions(locale);
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
          dataset(locale, "/obserwacje", {
            name: t.dataset,
            description: t.description,
            datePublished: site.launched,
            temporalCoverage: `${site.launched}/..`,
            spatialCoverage: { "@type": "Place", name: t.country },
          }),
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={
          <>
            {t.meta(total, all.length)} · <DataLicense />
          </>
        }
      />

      <Section id="mapa" title={t.map} aside={t.network}>
        {total > 0 ? (
          <LazyObservationMap matrix={matrix} species={species} unplaced={unplaced} />
        ) : (
          // Nothing to filter or hover yet: one line, the empty tiles, and no map script.
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              {map ? (
                <SignLine
                  sign="–"
                  actions={[
                    { href: "/atlas", label: t.atlas },
                    { href: "/rejestracja", label: t.join },
                  ]}
                >
                  {typo(t.empty)}
                </SignLine>
              ) : (
                <SignLine sign="·">{typo(t.unknown)}</SignLine>
              )}
            </div>
            <figure className="lg:col-span-6">
              <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                {REGION_GRID.flat().map((code) => (
                  <div key={code} className="flex aspect-square min-w-0 flex-col justify-between border border-dashed border-rule p-1.5 text-ink-faint min-[360px]:p-2 md:p-3">
                    <span className="font-sans text-[0.75rem] font-semibold leading-tight [overflow-wrap:anywhere]">
                      {code}
                      <span className="hidden font-medium sm:block">{regions[code].name}</span>
                    </span>
                    <span className="text-[1.2rem] font-bold leading-none md:text-2xl">{map ? "–" : "·"}</span>
                  </div>
                ))}
              </div>
              <figcaption className="label mt-5 text-ink-soft">{t.emptyMap}</figcaption>
            </figure>
          </div>
        )}
      </Section>

      {total > 0 && <Sightings community={community} />}

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
