import type { Metadata } from "next";
import Link from "next/link";
import { Crowd } from "@/components/crowd";
import { IndexChart } from "@/components/index-chart";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { RegionMap } from "@/components/region-map";
import { MAP_REGIONS } from "@/content/map";
import { getBulletin } from "@/lib/bulletin";
import { SEASONS, ZONES } from "@/lib/indeks";
import { institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, pct, plural, roman, typo } from "@/lib/typo";

const title = "Narodowy Indeks Dziaderstwa";
const description =
  "Natężenie dziaderstwa w Polsce, aktualizowane co godzinę: bieżąca wartość, przebieg w tym roku, prognoza na Wigilię, mapa województw i metodologia.";

export const metadata: Metadata = pageMetadata({
  title: "Narodowy Indeks Dziaderstwa: natężenie w Polsce",
  description,
  path: "/indeks",
  shareTitle: `${title} · ${site.name}`,
});

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

const RANKING = Object.values(MAP_REGIONS).sort((a, b) => b.value - a.value);

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

export default async function IndexPage() {
  const bulletin = await getBulletin();
  const { value, delta, season, zone } = bulletin.index;
  const count = Math.round(value);
  const trend = delta === 0 ? "bez zmian" : `${delta > 0 ? "+" : "−"}${pct(Math.abs(delta))} pkt`;

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
            creator: institute,
            isAccessibleForFree: true,
            datePublished: site.launched,
            dateModified: bulletin.updated,
            temporalCoverage: String(bulletin.year),
            spatialCoverage: { "@type": "Place", name: "Polska" },
            variableMeasured: "Natężenie dziaderstwa (0–100)",
          },
        ]}
      />

      <PageHeader
        crumbs={[{ label: title }]}
        title={title}
        lead={typo(
          "Natężenie dziaderstwa w skali kraju, aktualizowane co godzinę. Indeks łączy sezonowość zjawiska, kalendarz wydarzeń wysokiego ryzyka i wyniki obserwacji terenowych.",
        )}
        meta={
          <>
            Aktualizacja:{" "}
            <time dateTime={bulletin.updated}>
              {bulletin.date}, godz. {bulletin.time}
            </time>{" "}
            · Źródło: IBD
          </>
        }
      />

      <Section id="dzis" title="Stan na dziś" aside={`${season.title.charAt(0).toUpperCase()}${season.title.slice(1)}`}>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[clamp(5rem,12vw,9rem)] font-bold leading-[0.85] tracking-[-0.03em] tabular-nums">
              {pct(value)}
              <span className="text-[0.45em]">%</span>
            </p>
            <p className="label mt-4 text-ink-soft">
              Natężenie <span className="font-semibold text-ink">{zone.label}</span> · {trend} od początku {season.name}
            </p>
            <div className="mt-8 border-l-2 border-red pl-5">
              <p className="label font-semibold text-red">Ostrzeżenie {roman(season.level)} stopnia</p>
              <p className="mt-1 text-lg leading-snug">{typo(season.alert)}</p>
            </div>
          </div>
          <figure className="lg:col-span-7">
            <Crowd count={count} columns={25} className="w-full" label={`${count} na 100 osób wykazuje objawy dziaderstwa`} />
            <figcaption className="label mt-4 text-ink-soft">
              Rys. 1. Natężenie w przeliczeniu na 100 osób: {count} {plural(count, "osoba", "osoby", "osób")} z objawami.
            </figcaption>
          </figure>
        </div>

        <ol className="mt-14 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {ZONES.map((item, i) => {
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
                  {current && <span className="ml-2 font-semibold text-red">obecnie</span>}
                </p>
                <p className="mt-1 text-xl font-bold">Natężenie {item.label}</p>
                <p className="mt-1 leading-snug text-ink-soft">{typo(ZONE_NOTES[item.label])}</p>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section
        id="przebieg"
        title="Rok w dziaderstwie"
        aside={`Rok ${bulletin.year}`}
        intro={typo(`Linia ciągła to pomiar, przerywana to prognoza Instytutu. Najwyższej wartości w roku Instytut spodziewa się w Wigilię.`)}
      >
        <IndexChart bulletin={bulletin} />
      </Section>

      <Section
        id="sezony"
        title="Sezony i poziomy ostrzeżeń"
        intro={typo("Rok dziaderski dzieli się na siedem sezonów. Każdy ma własny poziom ostrzeżenia, ogłaszany jak ostrzeżenia meteorologiczne.")}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="label border-b border-ink text-ink-soft">
                <th scope="col" className="py-3 pr-6 font-medium">
                  Od
                </th>
                <th scope="col" className="py-3 pr-6 font-medium">
                  Sezon
                </th>
                <th scope="col" className="py-3 pr-6 font-medium">
                  Stopień
                </th>
                <th scope="col" className="py-3 font-medium">
                  Komunikat
                </th>
              </tr>
            </thead>
            <tbody>
              {SEASONS.map((item) => {
                // The bulletin is a cached copy, so compare by value.
                const current = item.title === season.title;
                return (
                  <tr key={item.title} className={cx("border-b border-rule align-baseline", current && "bg-red/[0.06]")}>
                    <td className="whitespace-nowrap py-4 pr-6 font-sans text-[0.9rem] text-ink-soft">
                      {item.from[1]} {MONTHS_GENITIVE[item.from[0] - 1]}
                    </td>
                    <th scope="row" className="py-4 pr-6 text-xl font-bold">
                      {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                      {current && <span className="label ml-3 align-middle font-semibold text-red">obecnie</span>}
                    </th>
                    <td className="py-4 pr-6">
                      <span
                        className={cx(
                          "label inline-block whitespace-nowrap border px-2 py-1 font-semibold",
                          item.level === 3 ? "border-red bg-red text-paper" : item.level === 2 ? "border-red text-red" : "border-ink/40 text-ink-soft",
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
      </Section>

      <Section
        id="regiony"
        title="Dziaderstwo według województw"
        aside="Badanie terenowe 2026"
        intro={typo("Mapa pokazuje gatunek dominujący w każdym województwie. Lista obok porządkuje województwa według natężenia zjawiska.")}
      >
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <RegionMap regions={MAP_REGIONS} className="lg:col-span-5" />
          <ol className="border-t border-ink lg:col-span-7">
            {RANKING.map((region, i) => (
              <li key={region.code} className="border-b border-rule">
                <Link href={`/atlas/${region.speciesSlug}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3">
                  <span className="font-sans text-[0.9rem] font-semibold text-ink-soft tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="text-lg font-bold">{region.name}</span>
                    <span className="ml-2 text-ink-soft transition-colors group-hover:text-red">· {region.speciesName}</span>
                  </span>
                  <span className="font-sans text-[0.95rem] font-semibold tabular-nums">{pct(region.value)}%</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section id="metodologia" title="Jak powstaje indeks" intro={typo("Instytut ujawnia metodologię w zakresie, w jakim sam ją rozumie.")}>
        <div className="grid gap-10 lg:grid-cols-3">
          {METHOD.map((block, i) => (
            <div key={block.title} className="border-t border-rule pt-5">
              <p className="label text-red">Składnik {roman(i + 1)}</p>
              <h3 className="mt-2 text-2xl font-bold leading-tight">{block.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{typo(block.text)}</p>
            </div>
          ))}
        </div>
        <p className="label mt-12 text-ink-soft">
          Indeks jest przeliczany co godzinę według czasu warszawskiego. Wszystkie dane są zmyślone, a mimo to się zgadzają.
        </p>
      </Section>

      <TestPromo
        title="Podnieś indeks osobiście."
        text={typo("Każdy wynik powyżej średniej krajowej jest wkładem w naukę. Test Dziadersa: dwadzieścia cztery pytania, około trzech minut.")}
      />
    </main>
  );
}
