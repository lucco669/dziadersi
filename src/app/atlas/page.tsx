import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/brand";
import { Breadcrumbs, JsonLd, PageHeading, TestCallout, breadcrumbList } from "@/components/page";
import { RegionMap } from "@/components/region-map";
import { SpeciesCard } from "@/components/species-parts";
import { MAP_REGIONS } from "@/content/map";
import { ESTIMATED_SPECIES, SPECIES, STATUSES, speciesByKey, type SpeciesKey } from "@/content/species";
import { getBulletin } from "@/lib/bulletin";
import { site } from "@/lib/site";
import { cx, plural, typo } from "@/lib/typo";

const NATIONWIDE = SPECIES.filter((species) => !species.region);
const REGIONAL = SPECIES.filter((species) => species.region);

const title = "Atlas Dziadersów";
const description = `Systematyczny katalog ${SPECIES.length} gatunków dziadersów występujących w Polsce, od Grillowego po Bieszczadzkiego: objawy, siedliska, wokalizacje, naturalni wrogowie i status ochrony.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/atlas" },
  openGraph: { type: "website", locale: "pl_PL", siteName: site.name, url: "/atlas", title: `${title} · ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
};

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
            hasPart: SPECIES.map((species) => ({
              "@type": "Article",
              headline: species.name,
              url: `${site.url}/atlas/${species.slug}`,
            })),
          },
        ]}
      />

      <div className="wrap pb-16 pt-10 md:pb-20 md:pt-14">
        <Breadcrumbs crumbs={[{ label: title }]} />
        <PageHeading
          className="mt-8"
          kicker={
            <>
              § Zbiory <span className="mx-1.5 opacity-50">/</span> Katalog gatunków
            </>
          }
          aside={`Opisano ${SPECIES.length} z ok. ${ESTIMATED_SPECIES} gatunków`}
          title={title}
          lead={typo(
            "Systematyczny katalog gatunków występujących na terenie Rzeczypospolitej. Każdy wpis zawiera opis, siedem objawów rozpoznawczych, typowe wokalizacje, naturalnych wrogów, kalendarz aktywności i status ochrony.",
          )}
        />

        <dl className="mt-12 grid grid-cols-2 border-y border-ink md:grid-cols-4">
          {[
            ["Gatunki w Atlasie", String(SPECIES.length)],
            ["Ogólnopolskie", String(NATIONWIDE.length)],
            ["Regionalne", String(REGIONAL.length)],
            ["Szacunek Instytutu", `ok. ${ESTIMATED_SPECIES}`],
          ].map(([label, value], i) => (
            <div key={label} className={cx("py-5", i % 2 === 1 && "border-l border-rule pl-5", i === 2 && "md:border-l md:pl-5")}>
              <dt className="kicker text-ink-faint">{label}</dt>
              <dd className="mt-1 font-display text-4xl font-black tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed">
          <span className="kicker mr-3 text-bordo">Gatunek tygodnia</span>
          <Link href={`/atlas/${featured.slug}`} className="link font-display text-xl font-semibold">
            {featured.name}
          </Link>
          <span className="text-ink-soft"> · {typo(featured.teaser)}</span>
        </p>
      </div>

      <section aria-labelledby="ogolnopolskie" className="wrap pb-20 md:pb-28">
        <SectionHeading
          id="ogolnopolskie"
          number="01"
          kicker="Gatunki ogólnopolskie"
          aside={`${NATIONWIDE.length} ${plural(NATIONWIDE.length, "gatunek", "gatunki", "gatunków")}`}
          title="Występują w całym kraju"
          dek={typo("Dziesięć gatunków, które Test Dziadersa potrafi rozpoznać. Pasek pod opisem to kalendarz aktywności, od stycznia do grudnia.")}
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NATIONWIDE.map((species) => (
            <li key={species.key}>
              <SpeciesCard species={species} />
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="regionalne" className="border-y border-ink bg-paper-deep/70">
        <div className="wrap py-20 md:py-28">
          <SectionHeading
            id="regionalne"
            number="02"
            kicker="Gatunki regionalne"
            aside={`${REGIONAL.length} ${plural(REGIONAL.length, "gatunek", "gatunki", "gatunków")}`}
            title="Każde województwo ma swojego"
            dek={typo("Gatunki przywiązane do jednego regionu. Mapa pokazuje gatunek dominujący w każdym województwie i natężenie dziaderstwa według badań terenowych Instytutu.")}
          />
          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
            <RegionMap regions={MAP_REGIONS} className="lg:col-span-4" />
            <ol className="grid content-start gap-5 sm:grid-cols-2 lg:col-span-8">
              {REGIONAL.map((species) => (
                <li key={species.key}>
                  <SpeciesCard species={species} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="klucz" className="wrap py-20 md:py-28">
        <SectionHeading
          id="klucz"
          number="03"
          kicker="Oznaczanie"
          aside="Gatunki ogólnopolskie"
          title="Klucz do oznaczania gatunków"
          dek={typo("Zacznij od punktu 1 i wybieraj opis, który pasuje do obserwowanego osobnika. Klucz prowadzi do jednego z dziesięciu gatunków ogólnopolskich.")}
        />
        <ol className="mt-12 max-w-4xl border-t border-ink">
          {KEY.map((pair, i) => (
            <li key={i} id={`klucz-${i + 1}`} className="scroll-mt-28 border-b border-rule py-2">
              {pair.map((step, j) => {
                const target = typeof step.to === "number" ? null : speciesByKey(step.to);
                return (
                  <div key={step.text} className="grid grid-cols-[3rem_1fr] items-baseline gap-2 py-2.5">
                    <span className="font-mono text-sm text-ink-faint">
                      {i + 1}
                      {j === 0 ? "a" : "b"}.
                    </span>
                    <span className="flex flex-wrap items-baseline gap-x-3 sm:flex-nowrap">
                      <span className="text-lg leading-snug">{typo(step.text)}</span>
                      <span aria-hidden="true" className="hidden min-w-8 flex-1 border-b border-dotted border-ink/40 sm:block" />
                      {target ? (
                        <Link
                          href={`/atlas/${target.slug}`}
                          className="whitespace-nowrap font-display text-lg font-bold text-green hover:underline"
                        >
                          {target.name}
                        </Link>
                      ) : (
                        <a href={`#klucz-${step.to}`} className="kicker whitespace-nowrap text-ink-soft hover:text-ink">
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
      </section>

      <section aria-labelledby="kategorie" className="wrap pb-20 md:pb-28">
        <SectionHeading
          id="kategorie"
          number="04"
          kicker="Ochrona gatunkowa"
          title="Kategorie zagrożenia"
          dek={typo("Instytut stosuje kategorie Czerwonej Księgi. Żaden gatunek dziadersa nie wymarł, choć kilka twierdzi, że widziało, jak wymierały inne.")}
        />
        <ol className="mt-12 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-7">
          {STATUSES.map((status) => {
            const count = SPECIES.filter((species) => species.status === status.code).length;
            return (
              <li key={status.code} className="border-b border-rule py-5 pr-4 lg:border-b-0 lg:border-r lg:pl-4 lg:first:pl-0 lg:last:border-r-0">
                <p className={cx("font-mono text-2xl font-semibold", count ? "text-ink" : "text-ink-faint")}>{status.code}</p>
                <p className="mt-1 leading-snug">{status.label}</p>
                <p className="kicker mt-3 text-ink-faint">
                  {count} {plural(count, "gatunek", "gatunki", "gatunków")}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <TestCallout
        title="Nie wiesz, do którego gatunku należysz?"
        text={typo("Test Dziadersa ustali to w dwudziestu czterech pytaniach. Wynik od 0 do 100%, rozpoznanie gatunku i certyfikat.")}
      />
    </main>
  );
}
