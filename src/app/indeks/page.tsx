import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/brand";
import { IndexPanel } from "@/components/hero";
import { IndexChart } from "@/components/index-section";
import { Breadcrumbs, JsonLd, PageHeading, TestCallout, breadcrumbList } from "@/components/page";
import { RegionMap } from "@/components/region-map";
import { MAP_REGIONS } from "@/content/map";
import { getBulletin } from "@/lib/bulletin";
import { SEASONS, ZONES } from "@/lib/indeks";
import { site } from "@/lib/site";
import { cx, pct, roman, typo } from "@/lib/typo";

const title = "Narodowy Indeks Dziaderstwa";
const description =
  "Natężenie dziaderstwa w Polsce, aktualizowane co godzinę: bieżąca wartość, przebieg w tym roku, prognoza na Wigilię, mapa województw i metodologia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/indeks" },
  openGraph: { type: "website", locale: "pl_PL", siteName: site.name, url: "/indeks", title: `${title} · ${site.name}`, description },
  twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
};

const MONTHS_GENITIVE = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

const dayLabel = (year: number, dayOfYear: number) => {
  const date = new Date(Date.UTC(year, 0, 1 + dayOfYear));
  return `${date.getUTCDate()} ${MONTHS_GENITIVE[date.getUTCMonth()]}`;
};

const RANKING = Object.values(MAP_REGIONS).sort((a, b) => b.value - a.value);

export default async function IndexPage() {
  const bulletin = await getBulletin();
  const { season } = bulletin.index;

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList([{ label: title, href: "/indeks" }]),
          {
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: title,
            description,
            url: `${site.url}/indeks`,
            inLanguage: "pl",
            creator: { "@type": "Organization", name: site.institute, url: site.url },
            temporalCoverage: String(bulletin.year),
            spatialCoverage: { "@type": "Place", name: "Polska" },
          },
        ]}
      />

      <div className="wrap pb-20 pt-10 md:pb-28 md:pt-14">
        <Breadcrumbs crumbs={[{ label: title }]} />
        <PageHeading
          className="mt-8"
          kicker={
            <>
              § Dane <span className="mx-1.5 opacity-50">/</span> NID · PL
            </>
          }
          aside={`Aktualizacja: ${bulletin.date}, ${bulletin.time}`}
          title={title}
          lead={typo(
            "Natężenie dziaderstwa w skali kraju, aktualizowane co godzinę. Indeks łączy sezonowość zjawiska, kalendarz wydarzeń wysokiego ryzyka i wyniki obserwacji terenowych.",
          )}
        />

        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <IndexPanel bulletin={bulletin} />
          </div>
          <section aria-labelledby="skala" className="lg:col-span-7">
            <h2 id="skala" className="kicker border-b-2 border-ink pb-3">
              Jak czytać indeks
            </h2>
            <ol>
              {ZONES.map((zone) => {
                const current = zone.label === bulletin.index.zone.label;
                return (
                  <li
                    key={zone.label}
                    className={cx(
                      "grid grid-cols-[6.5rem_1fr] gap-4 border-b border-rule py-4",
                      current && "bg-bordo/[0.05]",
                    )}
                  >
                    <span className="font-mono text-sm tabular-nums text-ink-soft">
                      {zone.from}–{zone.to}
                    </span>
                    <span>
                      <span className="font-display text-xl font-semibold">Natężenie {zone.label}</span>
                      {current && <span className="kicker ml-3 text-bordo">Obecnie</span>}
                      <span className="mt-1 block leading-snug text-ink-soft">{typo(ZONE_NOTES[zone.label])}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>

      <section aria-labelledby="przebieg" className="border-y border-ink bg-paper-deep/70">
        <div className="wrap py-20 md:py-28">
          <SectionHeading
            id="przebieg"
            number="01"
            kicker="Przebieg"
            aside={`Rok ${bulletin.year}`}
            title="Rok w dziaderstwie"
            dek={typo(
              `Linia ciągła to pomiar, przerywana to prognoza Instytutu. Dziś indeks wynosi ${pct(bulletin.index.value)}%, a najwyższej wartości w roku Instytut spodziewa się w Wigilię.`,
            )}
          />
          <IndexChart bulletin={bulletin} className="mt-14" />
        </div>
      </section>

      <section aria-labelledby="sezony" className="wrap py-20 md:py-28">
        <SectionHeading
          id="sezony"
          number="02"
          kicker="Ostrzeżenia"
          aside={`Obecnie: ${season.title}`}
          title="Sezony i poziomy ostrzeżeń"
          dek={typo("Rok dziaderski dzieli się na siedem sezonów. Każdy ma własny poziom ostrzeżenia, ogłaszany jak ostrzeżenia meteorologiczne.")}
        />
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="kicker border-b-2 border-ink text-ink-faint">
                <th scope="col" className="py-3 pr-6 font-medium">Od</th>
                <th scope="col" className="py-3 pr-6 font-medium">Sezon</th>
                <th scope="col" className="py-3 pr-6 font-medium">Stopień</th>
                <th scope="col" className="py-3 font-medium">Komunikat</th>
              </tr>
            </thead>
            <tbody>
              {SEASONS.map((item) => {
                // The bulletin is a cached copy, so compare by value.
                const current = item.title === season.title;
                return (
                  <tr key={item.title} className={cx("border-b border-rule align-baseline", current && "bg-bordo/[0.05]")}>
                    <td className="whitespace-nowrap py-4 pr-6 font-mono text-sm text-ink-soft">
                      {item.from[1]} {MONTHS_GENITIVE[item.from[0] - 1]}
                    </td>
                    <th scope="row" className="py-4 pr-6 font-display text-xl font-semibold">
                      {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                      {current && <span className="kicker ml-3 align-middle text-bordo">Obecnie</span>}
                    </th>
                    <td className="py-4 pr-6">
                      <span
                        className={cx(
                          "kicker inline-block border px-2 py-1",
                          item.level === 3 ? "border-bordo bg-bordo text-paper" : item.level === 2 ? "border-bordo text-bordo" : "border-ink/40 text-ink-soft",
                        )}
                      >
                        {roman(item.level)} stopnia
                      </span>
                    </td>
                    <td className="py-4 leading-snug">{typo(item.alert)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h3 className="kicker mt-16 border-b-2 border-ink pb-3">Kalendarz zagrożeń {bulletin.year}</h3>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-5">
          {bulletin.chart.milestones.map((milestone) => {
            const past = milestone.at <= bulletin.today;
            return (
              <li key={milestone.label} className="border-b border-rule py-5 pr-6">
                <p className="kicker text-ink-faint">
                  {dayLabel(bulletin.year, milestone.at)} · {past ? "pomiar" : "prognoza"}
                </p>
                <p className="mt-2 font-display text-2xl font-bold leading-tight">{milestone.label}</p>
                <p className="mt-1 text-ink-soft">{milestone.note}</p>
                <p className="mt-3 font-mono text-sm tabular-nums">{pct(milestone.value)}%</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="regiony" className="border-y border-ink bg-paper-deep/70">
        <div className="wrap py-20 md:py-28">
          <SectionHeading
            id="regiony"
            number="03"
            kicker="Regiony"
            aside="Badanie terenowe 2026"
            title="Dziaderstwo według województw"
            dek={typo("Mapa pokazuje gatunek dominujący w każdym województwie. Tabela obok porządkuje województwa według natężenia zjawiska.")}
          />
          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-12">
            <RegionMap regions={MAP_REGIONS} className="lg:col-span-5" />
            <ol className="lg:col-span-7">
              {RANKING.map((region, i) => (
                <li key={region.code} className="border-b border-rule">
                  <Link
                    href={`/atlas/${region.speciesSlug}`}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3"
                  >
                    <span className="font-mono text-sm text-ink-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="font-display text-lg font-semibold">{region.name}</span>
                      <span className="ml-2 text-ink-soft transition-colors group-hover:text-green">· {region.speciesName}</span>
                    </span>
                    <span className="font-mono text-sm tabular-nums">{pct(region.value)}%</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="metodologia" className="wrap scroll-mt-24 py-20 md:py-28">
        <SectionHeading
          id="metodologia"
          number="04"
          kicker="Metodologia"
          title="Jak powstaje indeks"
          dek={typo("Instytut ujawnia metodologię w zakresie, w jakim sam ją rozumie.")}
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {METHOD.map((block, i) => (
            <div key={block.title} className="border-t border-ink pt-5">
              <p className="kicker text-ink-faint">Składnik {roman(i + 1)}</p>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{block.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-soft">{typo(block.text)}</p>
            </div>
          ))}
        </div>
        <p className="kicker mt-12 text-ink-faint">
          Indeks jest przeliczany co godzinę według czasu warszawskiego. Wszystkie dane są zmyślone, a mimo to się zgadzają.
        </p>
      </section>

      <TestCallout
        title="Podnieś indeks osobiście."
        text={typo("Każdy wynik powyżej średniej krajowej jest wkładem w naukę. Test Dziadersa: dwadzieścia cztery pytania, około trzech minut.")}
      />
    </main>
  );
}

const ZONE_NOTES: Record<string, string> = {
  śladowe: "Objawy pojedyncze i nieszkodliwe. W tym przedziale indeks nie był notowany od 1989 roku.",
  umiarkowane: "Zjawisko obecne, ale pod kontrolą. Pojedyncze uwagi o oponach i cenach gofrów.",
  podwyższone: "Stan typowy dla polskiej codzienności. Komentarze przy grillu, kartki za wycieraczkami.",
  kliniczne: "Wigilia, majówka, pierwszy dzień urlopu nad morzem. Zaleca się unikanie tematów.",
};

const METHOD = [
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
];
