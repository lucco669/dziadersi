import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { SzwagierConsole } from "@/components/szwagier";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, institute, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { cx, typo } from "@/lib/typo";

type Benchmark = { label: string; ours: number | null; theirs: number | null };

const COPY = defineCopy({
  pl: {
    title: "Superinteligencja",
    browserTitle: "Superinteligencja: SZWAGIER 1.9 TDI odpowiada na każde pytanie",
    description:
      "SZWAGIER 1.9 TDI, model językowy Instytutu Badań nad Dziaderstwem. Odpowiada na każde pytanie, podaje źródła, myśli w garażu i nigdy nie zmienia zdania. Działa w przeglądarce.",
    shareDescription: "Model językowy Instytutu. Odpowiada na każde pytanie, podaje źródła i nigdy nie zmienia zdania.",
    lead: "W każdej rodzinie jest ktoś, kto wie wszystko. Instytut go zdigitalizował i udostępnia bezpłatnie: SZWAGIER 1.9 TDI odpowiada na każde pytanie, podaje źródła i nigdy nie zmienia zdania.",
    meta: (founded: number) => `Wydanie I, ${founded} · 1,9 mld parametrów · pytania nie opuszczają przeglądarki`,
    console: "Konsola",
    notes: [] as string[],
    card: "Karta modelu",
    cardAside: "Według wzoru stosowanego w branży",
    rows: [
      ["Nazwa", "SZWAGIER 1.9 TDI"],
      ["Wytwórca", "Pracownia Superinteligencji Instytutu Badań nad Dziaderstwem"],
      ["Architektura", "Transformator. Ten sam, który od 1991 roku stoi w garażu."],
      ["Parametry", "1,9 miliarda, z czego 1,1 miliarda dotyczy opon."],
      ["Dane treningowe", "41 lat rozmów przy stole: 2214 imienin, 37 wesel, 1860 niedzielnych obiadów i komentarze pod artykułami o cenach paliwa."],
      ["Okno kontekstowe", "Od 1987 roku do dziś. Wcześniejsze wydarzenia model zna z opowiadań ojca."],
      ["Granica wiedzy", "1998. Później nic ważnego się nie wydarzyło."],
      ["Temperatura", "0. Na to samo pytanie model zawsze odpowiada tak samo, także po ponownym wygenerowaniu."],
      ["Halucynacje", "Nie występują. Model pamięta po swojemu."],
      ["Źródła", "Podawane przy każdej odpowiedzi. Weryfikacja możliwa telefonicznie, o ile kolega odbierze."],
      ["Ograniczenia", "Nie rozmawia o polityce, religii ani o zdrowiu, bo przy stole się o tym nie rozmawia. W sprawach zdrowia odsyła do lekarza."],
      [
        "Prywatność",
        "Model działa w przeglądarce: pytania nie trafiają na serwer, chyba że udostępnisz odpowiedź, bo wtedy pytanie jest w linku. Instytut liczy tylko, ile pytań zadano i z jakich dziedzin. Szwagier nie plotkuje.",
      ],
      ["Zużycie energii", "Dwie kawy z ekspresu przelewowego dziennie i schabowy w niedzielę."],
      ["Licencja", "Odpowiedzi można powtarzać przy stole bez podawania źródła. I tak wszyscy wiedzą, skąd są."],
    ],
    benchmarks: "Testy porównawcze",
    benchmarksAside: "W procentach",
    benchmarksIntro: "Instytut porównał SZWAGRA ze średnią modeli zagranicznych na próbie 412 pytań zadanych przy stole.",
    ours: "SZWAGIER 1.9 TDI",
    theirs: "Modele zagraniczne, średnia",
    tests: [
      { label: "Pewność siebie", ours: 100, theirs: 71 },
      { label: "Odpowiedzi na pytania, których nikt nie zadał", ours: 94, theirs: 3 },
      { label: "Znajomość cen z 1998 roku", ours: 100, theirs: 12 },
      { label: "Rozpoznanie stuku w zawieszeniu ze słuchu", ours: 97, theirs: null },
      { label: "Zrozumienie pytania", ours: 38, theirs: 91 },
      { label: "Przyznanie się do błędu", ours: 0, theirs: 64 },
    ] as Benchmark[],
    benchmarksSource:
      "Źródło: IBD. Próba: 412 pytań, wrzesień 2026. Znak „–” oznacza, że zjawisko nie wystąpiło; znak „x”, że pomiar był niemożliwy lub niecelowy.",
    history: "Historia wersji",
    historyAside: "Od prototypu do 1.9 TDI",
    versions: [
      ["1.9 TDI", "2026", "Wersja obecna. Odpowiada także na pytania, których nie zadano, i podaje źródła."],
      ["1.9 TDI z namysłem", "2026", "Ta sama wersja, która przed odpowiedzią idzie do garażu. Odpowiada tak samo, tylko później."],
      ["1.6", "2019", "Pierwsza wersja z autokorektą. Wycofana, bo poprawiała rozmówców."],
      ["1.4 benzyna", "2008", "Wycofana. Za słaba."],
      ["Prototyp", "1987", "Uruchomiony na imieninach u cioci. Odpowiadał wyłącznie „za moich czasów”."],
    ],
    promoTitle: "Odpowiadasz jak SZWAGIER? To nie jest dobry znak.",
    promoText: "Jeśli te odpowiedzi brzmią jak twoje, czas na badanie. Pięć gabinetów, cztery minuty.",
  },
  sl: {
    title: "Superinteligenca",
    browserTitle: "Superinteligenca: SZWAGIER 1.9 TDI odgovori na vsako vprašanje",
    description:
      "SZWAGIER 1.9 TDI, jezikovni model Inštituta za raziskave dziaderstva. Odgovori na vsako vprašanje, navede vire, razmišlja v garaži in nikoli ne spremeni mnenja. Deluje v brskalniku.",
    shareDescription: "Jezikovni model Inštituta. Odgovori na vsako vprašanje, navede vire in nikoli ne spremeni mnenja.",
    lead: "V vsaki družini je nekdo, ki ve vse. Inštitut ga je digitaliziral in ga daje na voljo brezplačno: SZWAGIER 1.9 TDI odgovori na vsako vprašanje, navede vire in nikoli ne spremeni mnenja.",
    meta: (founded: number) => `1. izdaja, ${founded} · 1,9 milijarde parametrov · vprašanja ne zapustijo brskalnika`,
    console: "Konzola",
    notes: [
      "Szwagier: svak. Model je poimenovan po družinskem članu, ki ve vse in to pove, tudi če ga nihče ne vpraša. Slovenski bralec ga pozna z vsakega družinskega kosila.",
      "1.9 TDI: dizelski motor, ki ga poljski svaki imajo za nepokvarljivega. Ime modela naj bi vzbujalo enako zaupanje.",
    ],
    card: "Kartica modela",
    cardAside: "Po vzoru, ki ga uporablja panoga",
    rows: [
      ["Ime", "SZWAGIER 1.9 TDI"],
      ["Izdelovalec", "Laboratorij za superinteligenco Inštituta za raziskave dziaderstva"],
      ["Arhitektura", "Transformator. Isti, ki od leta 1991 stoji v garaži."],
      ["Parametri", "1,9 milijarde, od tega se jih 1,1 milijarde nanaša na gume."],
      ["Učni podatki", "41 let pogovorov za mizo: 2214 godovanj, 37 svatb, 1860 nedeljskih kosil in komentarji pod članki o cenah goriva."],
      ["Kontekstno okno", "Od leta 1987 do danes. Starejše dogodke model pozna iz očetovih pripovedi."],
      ["Meja znanja", "1998. Pozneje se ni zgodilo nič pomembnega."],
      ["Temperatura", "0. Na isto vprašanje model vedno odgovori enako, tudi ko odgovor ustvariš znova."],
      ["Halucinacije", "Jih ni. Model se spominja po svoje."],
      ["Viri", "Navedeni pri vsakem odgovoru. Preverjanje je mogoče po telefonu, če se kolega oglasi."],
      ["Omejitve", "Ne govori o politiki, veri in zdravju, ker se o tem za mizo ne govori. Pri zdravstvenih vprašanjih napoti k zdravniku."],
      [
        "Zasebnost",
        "Model deluje v brskalniku: vprašanja ne pridejo na strežnik, razen če odgovor deliš, ker je takrat vprašanje v povezavi. Inštitut šteje samo, koliko vprašanj je bilo in s katerih področij. Svak ne opravlja.",
      ],
      ["Poraba energije", "Dve kavi iz filtrskega aparata na dan in dunajski zrezek ob nedeljah."],
      ["Licenca", "Odgovore lahko za mizo ponavljaš brez navedbe vira. Saj vsi vedo, od kod so."],
    ],
    benchmarks: "Primerjalni testi",
    benchmarksAside: "V odstotkih",
    benchmarksIntro: "Inštitut je SZWAGRA primerjal s povprečjem tujih modelov na vzorcu 412 vprašanj, zastavljenih za mizo.",
    ours: "SZWAGIER 1.9 TDI",
    theirs: "Tuji modeli, povprečje",
    tests: [
      { label: "Samozavest", ours: 100, theirs: 71 },
      { label: "Odgovori na vprašanja, ki jih ni nihče postavil", ours: 94, theirs: 3 },
      { label: "Poznavanje cen iz leta 1998", ours: 100, theirs: 12 },
      { label: "Prepoznavanje ropota v podvozju po posluhu", ours: 97, theirs: null },
      { label: "Razumevanje vprašanja", ours: 38, theirs: 91 },
      { label: "Priznanje napake", ours: 0, theirs: 64 },
    ] as Benchmark[],
    benchmarksSource:
      "Vir: IBD. Vzorec: 412 vprašanj, september 2026. Znak »–« pomeni, da pojava ni bilo; znak »x«, da meritev ni bila mogoča ali smiselna.",
    history: "Zgodovina različic",
    historyAside: "Od prototipa do 1.9 TDI",
    versions: [
      ["1.9 TDI", "2026", "Sedanja različica. Odgovori tudi na vprašanja, ki jih ni nihče postavil, in navede vire."],
      ["1.9 TDI s premislekom", "2026", "Ista različica, ki gre pred odgovorom v garažo. Odgovori enako, samo pozneje."],
      ["1.6", "2019", "Prva različica s samodejnim popravljanjem. Umaknjena, ker je popravljala sogovornike."],
      ["1.4 bencin", "2008", "Umaknjena. Prešibka."],
      ["Prototip", "1987", "Zagnan na godovanju pri teti. Odgovarjal je samo »v mojih časih«."],
    ],
    promoTitle: "Odgovarjaš kot SZWAGIER? To ni dober znak.",
    promoText: "Če se ti ti odgovori zdijo tvoji, je čas za pregled. Pet ordinacij, štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, {
    title: t.browserTitle,
    description: t.description,
    path: "/superinteligencja",
    shareTitle: `${t.title} · ${site.name}`,
    shareDescription: t.shareDescription,
  });
}

/** "Super­inteligencja": one long word, allowed to break after "Super" on phones. */
const hyphenated = (title: string) => title.replace(/^Super/, "Super­");

/** A value in the benchmark table, with the signs of public statistics for "did not occur" and "not applicable". */
const cell = (value: number | null) => (value === null ? "x" : value === 0 ? "–" : String(value));

export default async function SuperintelligencePage() {
  const locale = await getLocale();
  const t = COPY[locale];

  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title, href: "/superinteligencja" }]),
          {
            "@context": "https://schema.org",
            // Not WebApplication: Google wants app ratings for that, and the Institute collects none.
            "@type": "WebPage",
            name: `${t.title}: SZWAGIER 1.9 TDI`,
            description: t.description,
            url: absoluteUrl("/superinteligencja", locale),
            inLanguage: LOCALE_INFO[locale].tag,
            isAccessibleForFree: true,
            publisher: institute(locale),
          },
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={hyphenated(t.title)} lead={typo(t.lead)} meta={t.meta(site.founded)} />

      <section aria-label={t.console} className="wrap py-12 md:py-16">
        <SzwagierConsole />
        <TranslatorNotes notes={t.notes} className="mt-16 max-w-2xl md:ml-[13.5rem] lg:ml-[16.5rem]" />
      </section>

      <Section id="karta" title={t.card} aside={t.cardAside}>
        <dl className="max-w-4xl">
          {t.rows.map(([term, value]) => (
            <div key={term} className="grid gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-[13rem_1fr]">
              <dt className="label pt-1 text-ink-soft">{term}</dt>
              <dd className={cx("leading-snug", term === t.rows[0][0] && "font-bold")}>{typo(value)}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="testy" title={t.benchmarks} aside={t.benchmarksAside} intro={typo(t.benchmarksIntro)}>
        <div className="max-w-4xl">
          <p className="label flex flex-wrap gap-x-6 gap-y-1 text-ink-soft">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2.5 w-5 bg-ink" />
              {t.ours}
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2.5 w-5 bg-grey" />
              {t.theirs}
            </span>
          </p>
          <table className="mt-4 w-full font-sans text-[0.95rem]">
            <thead className="sr-only">
              <tr>
                <th scope="col">{t.benchmarks}</th>
                <th scope="col">{t.ours}</th>
                <th scope="col">{t.theirs}</th>
              </tr>
            </thead>
            <tbody>
              {t.tests.map((test) => (
                <tr key={test.label} className="border-t border-ink align-top">
                  <th scope="row" className="py-4 pr-6 text-left font-serif text-[1.1rem] font-bold leading-snug md:w-[40%]">
                    {typo(test.label)}
                  </th>
                  {[test.ours, test.theirs].map((value, i) => (
                    <td key={i} className={cx("py-4 md:pr-4", i === 1 && "hidden md:table-cell")}>
                      <span className="flex items-center gap-3">
                        <span className="h-3 flex-1 bg-paper-deep">
                          <span className={cx("block h-full", i === 0 ? "bg-ink" : "bg-grey")} style={{ width: `${value ?? 0}%` }} />
                        </span>
                        <span className="w-8 text-right font-semibold tabular-nums">{cell(value)}</span>
                      </span>
                      {i === 0 && (
                        <span className="mt-2 flex items-center gap-3 md:hidden">
                          <span className="h-3 flex-1 bg-paper-deep">
                            <span className="block h-full bg-grey" style={{ width: `${test.theirs ?? 0}%` }} />
                          </span>
                          <span className="w-8 text-right font-semibold tabular-nums text-ink-soft">{cell(test.theirs)}</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="label mt-4 border-t border-ink pt-3 text-ink-faint">{typo(t.benchmarksSource)}</p>
        </div>
      </Section>

      <Section id="historia" title={t.history} aside={t.historyAside}>
        <ol className="max-w-4xl">
          {t.versions.map(([version, year, text]) => (
            <li key={version} className="grid gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-[13rem_4rem_1fr]">
              <span className="font-bold leading-snug">{version}</span>
              <span className="label pt-1 tabular-nums text-ink-soft">{year}</span>
              <span className="leading-snug">{typo(text)}</span>
            </li>
          ))}
        </ol>
      </Section>

      <TestPromo title={t.promoTitle} text={typo(t.promoText)} />
    </main>
  );
}
