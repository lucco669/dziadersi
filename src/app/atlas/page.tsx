import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { RegionMap } from "@/components/region-map";
import { SpeciesTile } from "@/components/species-parts";
import { MAP_REGIONS } from "@/content/map";
import { ESTIMATED_SPECIES, SPECIES, speciesByKey, type SpeciesKey } from "@/content/species";
import { getBulletin } from "@/lib/bulletin";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, typo } from "@/lib/typo";

const NATIONWIDE = SPECIES.filter((species) => !species.region);
const REGIONAL = SPECIES.filter((species) => species.region);

const title = "Atlas Dziadersów";
const description = `Katalog ${SPECIES.length} gatunków dziadersów występujących w Polsce, od Grillowego po Bieszczadzkiego: objawy, siedliska, wokalizacje, naturalni wrogowie, status ochrony i klucz do oznaczania.`;

export const metadata: Metadata = pageMetadata({
  title: "Atlas Dziadersów: gatunki, objawy i klucz do oznaczania",
  description,
  path: "/atlas",
  shareTitle: `${title} · ${site.name}`,
});

type Step = { text: string; to: number | SpeciesKey };

/** Dichotomous identification key for the nationwide species. */
const KEY: [Step, Step][] = [
  [
    { text: "Trzyma szczypce, także z dala od rusztu", to: "grill" },
    { text: "Nie trzyma szczypiec", to: 2 },
  ],
  [
    { text: "Przebywa w pobliżu samochodu", to: 3 },
    { text: "Nie przebywa w pobliżu samochodu", to: 4 },
  ],
  [
    { text: "Kopie w opony", to: "moto" },
    { text: "Pilnuje miejsca parkingowego, w razie potrzeby wiadrem", to: "parking" },
  ],
  [
    { text: "Ma przy sobie parawan", to: "wakacje" },
    { text: "Nie ma parawanu", to: 5 },
  ],
  [
    { text: "Wstaje przed piątą rano", to: 6 },
    { text: "Wstaje później", to: 7 },
  ],
  [
    { text: "Siedzi nad wodą w milczeniu", to: "wedka" },
    { text: "Podlewa pomidory i doradza sąsiadowi", to: "dzialka" },
  ],
  [
    { text: "Porozumiewa się głównie na piśmie", to: 8 },
    { text: "Porozumiewa się głównie ustnie", to: 9 },
  ],
  [
    { text: "Pisze wielkimi literami i udostępnia", to: "facebook" },
    { text: "Kończy każdą wiadomość „Pozdrawiam serdecznie”", to: "korpo" },
  ],
  [
    { text: "Pyta: „Kto panu to tak zrobił?”", to: "budowa" },
    { text: "Wyłącza router na noc, żeby odpoczął", to: "smart" },
  ],
];

export default async function AtlasPage() {
  const bulletin = await getBulletin();
  const featured = SPECIES[bulletin.week % SPECIES.length];

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/atlas" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url: `${site.url}/atlas`,
            inLanguage: "pl",
            publisher: institute,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: SPECIES.length,
              itemListElement: SPECIES.map((species, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: species.name,
                url: `${site.url}/atlas/${species.slug}`,
              })),
            },
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Systematyczny katalog gatunków występujących na terenie Rzeczypospolitej. Każdy wpis zawiera opis, siedem objawów rozpoznawczych, typowe wokalizacje, naturalnych wrogów, kalendarz aktywności i status ochrony.",
        )}
        meta={`Opisano ${SPECIES.length} z ok. ${ESTIMATED_SPECIES} gatunków: ${NATIONWIDE.length} ogólnopolskich i ${REGIONAL.length} regionalnych`}
        aside={
          <Link href={`/atlas/${featured.slug}`} className="group block border-t border-ink pt-4">
            <span className="label text-red">Gatunek tygodnia</span>
            <SpeciesPlate species={featured.key} animated className="mt-2 w-full" />
            <span className="mt-2 block text-xl font-bold transition-colors group-hover:text-red">{featured.name}</span>
            <span className="block font-sans text-[0.9rem] text-ink-soft">{typo(featured.teaser)}</span>
          </Link>
        }
      />

      <Section
        id="ogolnopolskie"
        title="Gatunki ogólnopolskie"
        aside={`${NATIONWIDE.length} ${plural(NATIONWIDE.length, "gatunek", "gatunki", "gatunków")}`}
        intro={typo("Występują w całym kraju. Test Dziadersa rozpoznaje każdy z nich, a także ich krzyżówki.")}
      >
        <ol className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {NATIONWIDE.map((species) => (
            <li key={species.key}>
              <SpeciesTile species={species} />
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="regionalne"
        title="Gatunki regionalne"
        aside={`${REGIONAL.length} ${plural(REGIONAL.length, "gatunek", "gatunki", "gatunków")}`}
        intro={typo("Każde województwo ma swój gatunek dominujący. Mapa pokazuje natężenie dziaderstwa według badań terenowych Instytutu.")}
      >
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <RegionMap regions={MAP_REGIONS} className="lg:col-span-4" />
          <ol className="grid grid-cols-2 content-start gap-x-6 gap-y-12 md:grid-cols-3 lg:col-span-8">
            {REGIONAL.map((species) => (
              <li key={species.key}>
                <SpeciesTile species={species} />
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section
        id="klucz"
        title="Klucz do oznaczania gatunków"
        intro={typo("Zacznij od punktu 1 i wybieraj opis, który pasuje do obserwowanego osobnika. Klucz prowadzi do jednego z dziesięciu gatunków ogólnopolskich.")}
      >
        <ol className="max-w-4xl border-t border-ink">
          {KEY.map((pair, i) => (
            <li key={i} id={`klucz-${i + 1}`} className="scroll-mt-6 border-b border-rule py-2">
              {pair.map((step, j) => {
                const target = typeof step.to === "number" ? null : speciesByKey(step.to);
                return (
                  <div key={step.text} className="grid grid-cols-[3rem_1fr] items-baseline gap-2 py-2.5">
                    <span className="font-sans text-[0.9rem] font-semibold text-ink-soft">
                      {i + 1}
                      {j === 0 ? "a" : "b"}.
                    </span>
                    <span className="flex flex-wrap items-baseline gap-x-3 sm:flex-nowrap">
                      <span className="text-lg leading-snug">{typo(step.text)}</span>
                      <span aria-hidden="true" className="hidden min-w-8 flex-1 border-b border-dotted border-ink/40 sm:block" />
                      {target ? (
                        <Link href={`/atlas/${target.slug}`} className="whitespace-nowrap text-lg font-bold hover:text-red">
                          {target.name}
                        </Link>
                      ) : (
                        <a href={`#klucz-${step.to}`} className="label whitespace-nowrap text-ink-soft hover:text-red">
                          przejdź do {step.to}
                        </a>
                      )}
                    </span>
                  </div>
                );
              })}
            </li>
          ))}
        </ol>
      </Section>

      <TestPromo
        title="Nie wiesz, do którego gatunku należysz?"
        text={typo("Test Dziadersa ustali to w dwudziestu czterech pytaniach. Wynik od 0 do 100%, rozpoznanie gatunku i certyfikat.")}
      />
    </main>
  );
}
