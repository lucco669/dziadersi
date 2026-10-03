import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { RegionMap } from "@/components/region-map";
import { Sightings } from "@/components/sightings";
import { SpeciesTile } from "@/components/species-parts";
import { getMapRegions } from "@/content/map";
import { ESTIMATED_SPECIES, getSpecies, speciesByKey, type SpeciesKey } from "@/content/species";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { getBulletin } from "@/lib/bulletin";
import { getCommunity } from "@/lib/community";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { plural, pluralSl, typo } from "@/lib/typo";

/** Dichotomous identification key for the nationwide species: where each pair of steps leads. */
const KEY: [number | SpeciesKey, number | SpeciesKey][] = [
  ["grill", 2],
  [3, 4],
  ["moto", "parking"],
  ["wakacje", 5],
  [6, 7],
  ["wedka", "dzialka"],
  [8, 9],
  ["facebook", "korpo"],
  ["budowa", "smart"],
];

const COPY = defineCopy({
  pl: {
    title: "Atlas Dziadersów",
    metaTitle: "Atlas Dziadersów: gatunki, objawy i klucz do oznaczania",
    description: (count: number) =>
      `Katalog ${count} gatunków dziadersów występujących w Polsce, od Grillowego po Bieszczadzkiego: objawy, siedliska, naturalni wrogowie i klucz do oznaczania.`,
    lead: "Systematyczny katalog gatunków występujących na terenie Rzeczypospolitej. Każdy wpis zawiera opis, siedem objawów rozpoznawczych, typowe wokalizacje, naturalnych wrogów, kalendarz aktywności i status ochrony.",
    meta: (count: number, nationwide: number, regional: number, occasional: number) =>
      `Opisano ${count} z ok. ${ESTIMATED_SPECIES} gatunków: ${nationwide} ogólnopolskich, ${regional} regionalnych i ${occasional} okazjonalnych`,
    featured: "Gatunek tygodnia",
    count: (n: number) => `${n} ${plural(n, "gatunek", "gatunki", "gatunków")}`,
    isNew: "nowość",
    nationwide: "Gatunki ogólnopolskie",
    nationwideIntro: "Występują w całym kraju. Test Dziadersa rozpoznaje każdy z nich, a także ich krzyżówki.",
    regional: "Gatunki regionalne",
    regionalIntro: "Każde województwo ma swój gatunek dominujący. Mapa pokazuje natężenie dziaderstwa według badań terenowych Instytutu.",
    occasional: "Gatunki okazjonalne",
    occasionalIntro:
      "Występują w całym kraju, ale tylko w określonych okolicznościach: na weselu, w Wigilię, w kolejce, w oknie, przy transmisji meczu i na kempingu. Poza swoją okazją zachowują się jak gatunki pospolite.",
    key: "Klucz do oznaczania gatunków",
    keyIntro: "Zacznij od punktu 1 i wybieraj opis, który pasuje do obserwowanego osobnika. Klucz prowadzi do jednego z dziesięciu gatunków ogólnopolskich.",
    steps: [
      ["Trzyma szczypce, także z dala od rusztu", "Nie trzyma szczypiec"],
      ["Przebywa w pobliżu samochodu", "Nie przebywa w pobliżu samochodu"],
      ["Kopie w opony", "Pilnuje miejsca parkingowego, w razie potrzeby wiadrem"],
      ["Ma przy sobie parawan", "Nie ma parawanu"],
      ["Wstaje przed piątą rano", "Wstaje później"],
      ["Siedzi nad wodą w milczeniu", "Podlewa pomidory i doradza sąsiadowi"],
      ["Porozumiewa się głównie na piśmie", "Porozumiewa się głównie ustnie"],
      ["Pisze wielkimi literami i udostępnia", "Kończy każdą wiadomość „Pozdrawiam serdecznie”"],
      ["Pyta: „Kto panu to tak zrobił?”", "Wyłącza router na noc, żeby odpoczął"],
    ],
    goTo: "przejdź do",
    promoTitle: "Nie wiesz, do którego gatunku należysz?",
    promoText: "Test Dziadersa ustali to w pięciu gabinetach. Wynik od 0 do 100%, rozpoznanie gatunku i certyfikat.",
  },
  sl: {
    title: "Atlas dziadersov",
    metaTitle: "Atlas dziadersov: vrste, simptomi in določevalni ključ",
    description: (count: number) =>
      `Katalog ${count} vrst dziadersov, ki živijo na Poljskem, od Žarnega do Bieszczadskega: simptomi, habitati, naravni sovražniki in določevalni ključ.`,
    lead: "Sistematični katalog vrst, ki živijo na ozemlju Republike Poljske. Vsak vnos vsebuje opis, sedem prepoznavnih simptomov, značilno oglašanje, naravne sovražnike, koledar aktivnosti in varstveni status.",
    meta: (count: number, nationwide: number, regional: number, occasional: number) =>
      `Opisanih ${count} od pribl. ${ESTIMATED_SPECIES} vrst: ${nationwide} vsepoljskih, ${regional} regionalnih in ${occasional} priložnostnih`,
    featured: "Vrsta tedna",
    count: (n: number) => `${n} ${pluralSl(n, "vrsta", "vrsti", "vrste", "vrst")}`,
    isNew: "novo",
    nationwide: "Vsepoljske vrste",
    nationwideIntro: "Živijo po vsej državi. Test dziadersa diagnosticira vsako od njih, pa tudi njihove križance.",
    regional: "Regionalne vrste",
    regionalIntro: "Vsako vojvodstvo ima svojo prevladujočo vrsto. Zemljevid kaže jakost dziaderstva po podatkih terenskih raziskav Inštituta.",
    occasional: "Priložnostne vrste",
    occasionalIntro:
      "Živijo po vsej državi, a le v določenih okoliščinah: na svatbi, na sveti večer, v čakalni vrsti, na oknu, ob prenosu tekme in v kampu. Zunaj svoje priložnosti se vedejo kot navadne vrste.",
    key: "Določevalni ključ",
    keyIntro: "Začni pri točki 1 in izbiraj opis, ki ustreza opazovanemu osebku. Ključ te pripelje do ene od desetih vsepoljskih vrst.",
    steps: [
      ["Drži klešče, tudi daleč od žara", "Ne drži klešč"],
      ["Zadržuje se v bližini avtomobila", "Ne zadržuje se v bližini avtomobila"],
      ["Brca v gume", "Varuje parkirno mesto, po potrebi z vedrom"],
      ["Ima s seboj vetrobran", "Nima vetrobrana"],
      ["Vstane pred peto zjutraj", "Vstane pozneje"],
      ["Molče sedi ob vodi", "Zaliva paradižnik in svetuje sosedu"],
      ["Sporazumeva se predvsem pisno", "Sporazumeva se predvsem ustno"],
      ["Piše z velikimi črkami in deli naprej", "Vsako sporočilo konča z »Lep pozdrav«"],
      ["Sprašuje: »Kdo vam je pa to delal?«", "Ponoči izklopi usmerjevalnik, da se spočije"],
    ],
    goTo: "pojdi na",
    promoTitle: "Ne veš, kateri vrsti pripadaš?",
    promoText: "Test dziadersa to ugotovi v petih ordinacijah. Rezultat od 0 do 100 %, diagnoza vrste in certifikat.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.metaTitle,
    description: t.description(getSpecies(locale).length),
    path: "/atlas",
    shareTitle: `${t.title} · ${site.name}`,
  });
}

export default async function AtlasPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const species = getSpecies(locale);
  const nationwide = species.filter((item) => !item.region && !item.occasion);
  const regional = species.filter((item) => item.region);
  const occasional = species.filter((item) => item.occasion);
  const [bulletin, community] = await Promise.all([getBulletin(locale), getCommunity()]);
  const featured = species[bulletin.week % species.length];

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/atlas" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: t.title,
            description: t.description(species.length),
            url: absoluteUrl("/atlas", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            publisher: institute(locale),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: species.length,
              itemListElement: species.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.name,
                url: absoluteUrl(`/atlas/${item.slug}`, locale),
              })),
            },
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: t.title }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.meta(species.length, nationwide.length, regional.length, occasional.length)}
        aside={
          <Link href={`/atlas/${featured.slug}`} className="group block border-t border-ink pt-4">
            <span className="label text-red">{t.featured}</span>
            <SpeciesPlate species={featured.key} animated className="mt-2 w-full" />
            <span className="mt-2 block text-xl font-bold transition-colors group-hover:text-red">{featured.name}</span>
            <span className="block font-sans text-[0.9rem] text-ink-soft">{typo(featured.teaser)}</span>
          </Link>
        }
      />

      <Section id="ogolnopolskie" title={t.nationwide} aside={t.count(nationwide.length)} intro={typo(t.nationwideIntro)}>
        <ol className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {nationwide.map((item) => (
            <li key={item.key}>
              <SpeciesTile species={item} />
            </li>
          ))}
        </ol>
      </Section>

      <Section id="regionalne" title={t.regional} aside={t.count(regional.length)} intro={typo(t.regionalIntro)}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <RegionMap regions={getMapRegions(locale)} className="lg:col-span-4" />
          <ol className="grid grid-cols-2 content-start gap-x-6 gap-y-12 md:grid-cols-3 lg:col-span-8">
            {regional.map((item) => (
              <li key={item.key}>
                <SpeciesTile species={item} />
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section
        id="okazjonalne"
        title={t.occasional}
        aside={`${t.count(occasional.length)} · ${t.isNew}`}
        intro={typo(t.occasionalIntro)}
      >
        <ol className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {occasional.map((item) => (
            <li key={item.key}>
              <SpeciesTile species={item} />
            </li>
          ))}
        </ol>
      </Section>

      <Sightings community={community} />

      <Section id="klucz" title={t.key} intro={typo(t.keyIntro)}>
        <ol className="max-w-4xl border-t border-ink">
          {KEY.map((pair, i) => (
            <li key={i} id={`klucz-${i + 1}`} className="scroll-mt-6 border-b border-rule py-2">
              {pair.map((to, j) => {
                const text = t.steps[i][j];
                const target = typeof to === "number" ? null : speciesByKey(to, locale);
                return (
                  <div key={text} className="grid grid-cols-[3rem_1fr] items-baseline gap-2 py-2.5">
                    <span className="font-sans text-[0.9rem] font-semibold text-ink-soft">
                      {i + 1}
                      {j === 0 ? "a" : "b"}.
                    </span>
                    <span className="flex flex-wrap items-baseline gap-x-3 sm:flex-nowrap">
                      <span className="text-lg leading-snug">{typo(text)}</span>
                      <span aria-hidden="true" className="hidden min-w-8 flex-1 border-b border-dotted border-ink/40 sm:block" />
                      {target ? (
                        <Link href={`/atlas/${target.slug}`} className="whitespace-nowrap text-lg font-bold hover:text-red">
                          {target.name}
                        </Link>
                      ) : (
                        <a href={`#klucz-${to}`} className="label whitespace-nowrap text-ink-soft hover:text-red">
                          {t.goTo} {to}
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

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
