import type { Metadata } from "next";
import { publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, Section } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { getOccasions } from "@/content/bingo";
import { getDossiers } from "@/content/dossiers";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { sampleCard } from "@/lib/bingo";
import { pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    title: "Materiały do druku",
    description:
      "Bingo wigilijne i weselne do druku, karty gatunków i kieszonkowy przewodnik. Gotowe arkusze A4 dla rodziny i obserwatorów terenowych.",
    lead: "Pomoce naukowe do użytku przy stole, na działce i w terenie. Zwykły papier A4. Długopis we własnym zakresie.",
    field: "Wyposażenie obserwatora",
    cards: "Karty oznaczania gatunków",
    cardsText:
      "Dziesięć gatunków z testu, po cztery karty na arkuszu. Każda zawiera rycinę, siedlisko, wokalizację i cechy rozpoznawcze. Wydrukuj trzy strony i rozetnij.",
    cardsFacts: "3 arkusze A4 · 10 kart",
    guide: "Kieszonkowy przewodnik",
    guideText:
      "Dziesięć gatunków, ich charakterystyczne wypowiedzi i krótki protokół obserwacji. Cztery pola na jednym arkuszu; po złożeniu mieści się w kieszeni.",
    guideFacts: "1 arkusz A4 · złóż na cztery",
    preview: "Otwórz arkusz",
    bingo: "Bingo do druku",
    bingoIntro:
      "Każdy zestaw zawiera cztery różne karty na jednej stronie A4. Rozetnij, rozdaj osobom, które chcą grać, i skreślaj zasłyszane zdania. Pięć pól w linii oznacza bingo.",
    four: "Cztery karty · A4",
    dossier: "Przewodnik na tę okazję",
    instructions: "Przed drukowaniem",
    steps: [
      "Otwórz wybrany arkusz i naciśnij „Drukuj”.",
      "Wybierz papier A4 i skalę 100%. Wyłącz nagłówki i stopki przeglądarki.",
      "Aby zachować plik, wybierz zapis do PDF w oknie drukowania.",
      "Kolor jest pomocny, ale wszystkie materiały pozostają czytelne w czerni i bieli.",
    ],
    museum: "Karty muzealne możesz też pobrać jako PNG w Muzeum rzeczy.",
    museumLink: "Otwórz Muzeum",
  },
  sl: {
    title: "Gradivo za tisk",
    description:
      "Bingo za sveti večer in svatbo za tisk, kartice vrst in žepni vodnik. Pripravljene strani A4 za družino in terenske opazovalce.",
    lead: "Učni pripomočki za uporabo pri mizi, na vrtičku in na terenu. Navaden papir A4. Kemični svinčnik priskrbi sam.",
    field: "Oprema opazovalca",
    cards: "Kartice za določanje vrst",
    cardsText:
      "Deset vrst iz testa, po štiri kartice na strani. Vsaka vsebuje risbo, habitat, oglašanje in prepoznavne znake. Natisni tri strani in razreži.",
    cardsFacts: "3 strani A4 · 10 kartic",
    guide: "Žepni vodnik",
    guideText:
      "Deset vrst, njihove značilne izjave in kratek opazovalni zapisnik. Štiri polja na eni strani; prepognjen gre v žep.",
    guideFacts: "1 stran A4 · prepogni na četrtine",
    preview: "Odpri stran",
    bingo: "Bingo za tisk",
    bingoIntro:
      "Vsak komplet vsebuje štiri različne listke na eni strani A4. Razreži, razdeli tistim, ki želijo igrati, in prečrtuj slišane stavke. Pet polj v vrsti pomeni bingo.",
    four: "Štirje listki · A4",
    dossier: "Vodnik za to priložnost",
    instructions: "Pred tiskanjem",
    steps: [
      "Odpri izbrano stran in pritisni »Natisni«.",
      "Izberi papir A4 in merilo 100 %. Izklopi glave in noge brskalnika.",
      "Če želiš shraniti datoteko, v oknu za tisk izberi zapis v PDF.",
      "Barva pomaga, vendar je vse gradivo berljivo tudi črno-belo.",
    ],
    museum: "Muzejske kartice lahko v Muzeju stvari preneseš tudi kot PNG.",
    museumLink: "Odpri Muzej",
  },
});
const META_COPY = defineCopy({
  pl: { title: "Materiały do druku: bingo i przewodniki A4" },
  sl: { title: "Gradivo za tisk: bingo in vodniki A4" },
});
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: META_COPY[locale].title, description: t.description, path: "/do-druku" });
}
export default async function PrintHub() {
  const locale = await getLocale();
  const t = COPY[locale];
  const dossiers = getDossiers(locale);
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, [{ label: t.title }]),
          publicationSchema(locale, "/do-druku", t.title, t.description),
        ]}
      />
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={t.lead} meta="IBD-P · A4" />
      <Section id="teren" title={t.field}>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: t.cards,
              text: t.cardsText,
              facts: t.cardsFacts,
              href: "/do-druku/karty-gatunkow",
              species: "grill" as const,
            },
            {
              title: t.guide,
              text: t.guideText,
              facts: t.guideFacts,
              href: "/do-druku/przewodnik",
              species: "dzialka" as const,
            },
          ].map((item) => (
            <article key={item.href} className="border border-rule bg-card p-6 md:p-8">
              <div className="flex items-center justify-between gap-5">
                <span className="label text-red">{item.facts}</span>
                <SpeciesPlate species={item.species} className="h-28 w-32 shrink-0" />
              </div>
              <h3 className="mt-5 text-3xl font-bold">{item.title}</h3>
              <p className="mt-4 text-ink-soft">{typo(item.text)}</p>
              <Link href={item.href} className="btn mt-6 bg-ink text-paper hover:bg-red">
                {t.preview} →
              </Link>
            </article>
          ))}
        </div>
      </Section>
      <Section id="bingo" title={t.bingo} intro={t.bingoIntro}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getOccasions(locale).map((occasion) => {
            const card = sampleCard(occasion);
            const dossier = dossiers.find((item) => item.bingo === occasion.slug);
            return (
              <article key={occasion.slug} className="border-t border-rule pt-5">
                <p className="label text-ink-faint">{t.four}</p>
                <h3 className="mt-3 text-2xl font-bold">{occasion.title}</h3>
                <p className="mt-3 text-ink-soft">{typo(occasion.intro)}</p>
                <p className="mt-5">
                  <Link href={"/bingo/" + card.code + "/druk"} className="link font-sans font-medium">
                    {t.preview} →
                  </Link>
                </p>
                {dossier && (
                  <p className="mt-3">
                    <Link href={"/okazje/" + dossier.slug} className="link font-sans text-sm">
                      {t.dossier}
                    </Link>
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </Section>
      <Section id="instrukcja" title={t.instructions}>
        <ol className="max-w-2xl list-decimal space-y-4 pl-5 text-lg">
          {t.steps.map((step) => (
            <li key={step}>{typo(step)}</li>
          ))}
        </ol>
        <p className="mt-8 text-ink-soft">{t.museum}</p>
        <Link href="/muzeum" className="link mt-3 inline-block font-sans">
          {t.museumLink} →
        </Link>
      </Section>
    </main>
  );
}
