import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { publicationSchema } from "@/components/fieldwork-parts";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { getGuide } from "@/content/guide";
import { speciesByKey, type SpeciesKey } from "@/content/species";
import { getSpecimens } from "@/content/specimens";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { plural, pluralSl, typo } from "@/lib/typo";

const PATH = "/dziaders/boomer";

/** Two people of one species, 35 years apart: the age differs, the habit does not. */
const PAIR: { species: SpeciesKey; specimen: number }[] = [
  { species: "facebook", specimen: 0 },
  { species: "facebook", specimen: 1 },
];

const COPY = defineCopy({
  pl: {
    title: "Boomer czy dziaders?",
    crumb: "Boomer",
    metaTitle: "Boomer: kto to jest i czym różni się od dziadersa",
    description:
      "Boomer, czyli kto? Znaczenie słowa, skąd się wzięło „OK boomer”, odmiana (boomerzy) i tabela: boomer, dziaders, dziad, zgred. Plus pytanie o ageizm.",
    lead: "Jedno słowo mówi o roczniku, drugie o zachowaniu. Instytut wyjaśnia, kto to jest boomer, skąd się wzięło „OK boomer” i dlaczego boomer nie musi być dziadersem, a dziaders boomerem.",
    meta: "Wprowadzenie do Instytutu · terminologia pokrewna",
    answerTitle: "Krótka odpowiedź",
    answer:
      "Boomer to osoba z powojennego wyżu demograficznego, urodzona mniej więcej w latach 1946–1964. Potocznie: starsza osoba, która nie nadąża za nowościami i chętnie o tym poucza. Dziaders nie ma rocznika. To postawa: pouczanie bez pytania, nieomylność i przekonanie, że dawniej było lepiej.",
    meaningTitle: "Boomer — co to znaczy?",
    meaning: [
      "Słowo pochodzi od angielskiego „baby boomer”, czyli dziecka z powojennego wyżu demograficznego (ang. „baby boom”). W Stanach Zjednoczonych granice tego pokolenia wyznacza się zwykle na lata 1946–1964. Polski powojenny wyż przypadł na podobny okres, ze szczytem urodzeń w połowie lat 50.",
      "W polszczyźnie potocznej „boomer” rzadko oznacza sam rocznik. Częściej nazywa kogoś, kto drukuje maile, pisze wielkimi literami i komentuje świat, którego nie próbuje zrozumieć. W tym znaczeniu boomerem można nazwać także czterdziestolatka.",
      "Wymowa: [bumer]. W internecie spotyka się też pisownię „bumer”; w tekstach starannych przyjęła się angielska, „boomer”.",
    ],
    okTitle: "„OK boomer”: skąd się wzięło?",
    ok: [
      "„OK boomer” to odpowiedź na pouczanie ze strony starszych: krótka, uprzejma w formie i lekceważąca w treści. Znaczy mniej więcej „dobrze, dobrze, tylko że świat wygląda dziś inaczej”.",
      "Zwrot krążył w internecie od kilku lat, a jesienią 2019 roku rozpowszechnił się na TikToku. W listopadzie 2019 roku użyła go w parlamencie Nowej Zelandii 25-letnia posłanka, której przerwano wystąpienie o klimacie. Od tego czasu „OK boomer” jest znany na całym świecie, także w Polsce.",
      "Z punktu widzenia Instytutu „OK boomer” jest wokalizacją obronną: wydaje ją młodszy osobnik, kiedy dziaders zaczyna wykład. Odpowiedź rzadko skraca wykład. Częściej otwiera jego drugą część.",
    ],
    formsTitle: "Odmiana: boomer, boomerzy, boomerka",
    formsIntro:
      "„Boomer” odmienia się jak inne rzeczowniki męskoosobowe zakończone na -er. W liczbie mnogiej poprawne są „boomerzy”, potocznie mówi się też „boomery”. Forma żeńska to „boomerka”, przymiotnik: „boomerski” (boomerskie żarty, boomerski humor).",
    formsHead: ["Przypadek", "Liczba pojedyncza", "Liczba mnoga"],
    forms: [
      { name: "mianownik", singular: "boomer", plural: "boomerzy" },
      { name: "dopełniacz", singular: "boomera", plural: "boomerów" },
      { name: "celownik", singular: "boomerowi", plural: "boomerom" },
      { name: "biernik", singular: "boomera", plural: "boomerów" },
      { name: "narzędnik", singular: "boomerem", plural: "boomerami" },
      { name: "miejscownik", singular: "boomerze", plural: "boomerach" },
    ],
    formsNote: "Dla porównania: dziaders, dziadersa, dziadersowi; liczba mnoga: dziadersi.",
    tableTitle: "Boomer, dziaders, dziad, zgred: porównanie",
    tableIntro: "Cztery słowa, którymi młodsi opisują starszych. Tylko jedno nie mówi nic o wieku.",
    tableHead: ["Słowo", "Co opisuje", "Wiek", "Pochodzenie", "Ton", "Typowe zdanie"],
    table: [
      {
        word: "boomer",
        what: "pokolenie powojennego wyżu; potocznie kogoś, kto nie nadąża za nowościami",
        age: "zwykle 60+",
        origin: "ang. „baby boomer”",
        tone: "kpiący, raczej łagodny",
        line: "„Wydrukuj mi ten mail”",
      },
      {
        word: "dziaders",
        what: "postawę: pouczanie bez pytania, nieomylność, „dawniej było lepiej”",
        age: "dowolny",
        origin: "„dziad” z żartobliwą końcówką -ers",
        tone: "kpiący, z przymrużeniem oka",
        line: "„Za moich czasów…”",
      },
      {
        word: "dziad",
        what: "starszego mężczyznę; obraźliwie kogoś skąpego, zaniedbanego albo nieuprzejmego",
        age: "zwykle starszy",
        origin: "staropolskie: dziadek, dawniej też żebrak",
        tone: "obraźliwy",
        line: "„Nie bądź dziad”",
      },
      {
        word: "zgred",
        what: "zrzędliwego, zwykle starszego mężczyznę",
        age: "zwykle starszy",
        origin: "potoczne, pochodzenie niejasne",
        tone: "lekceważący",
        line: "„Stary zgred znowu narzeka”",
      },
    ],
    pairTitle: "Boomer bez dziaderstwa, dziaders bez boomerstwa",
    pairIntro: "Dwa okazy jednego gatunku z Atlasu. Dzieli je trzydzieści pięć lat, łączy sposób prowadzenia dyskusji.",
    age: (years: number) => `${years} ${plural(years, "rok", "lata", "lat")}`,
    pairLabels: ["Rocznikowo boomer", "Rocznikowo milenials"],
    pairNote:
      "Wniosek z obserwacji: rok urodzenia przewiduje, czy ktoś drukuje maile. Nie przewiduje, czy zamyka dyskusję po przeczytaniu tytułu.",
    ageismTitle: "Czy „dziaders” to ageizm?",
    ageism: [
      "Ageizm to uprzedzenie albo dyskryminacja ze względu na wiek. Termin wprowadził w 1969 roku amerykański gerontolog Robert Butler. Ageizmem jest odmówienie komuś pracy, bo ma sześćdziesiąt lat, ale też zbycie każdego jego zdania tylko dlatego, że jest starszy.",
      "„OK boomer” bywa krytykowany właśnie za to: odpowiada na rocznik, a nie na argument. „Dziaders” ma ten sam problem w rdzeniu, bo „dziad” oznacza starego mężczyznę. Obserwatorium Językowe Uniwersytetu Warszawskiego, które odnotowało słowo w serwisie „Nowe wyrazy”, opisuje dziadersa jako osobę, głównie mężczyznę, której poglądy i sposób bycia mówiący uważa za przestarzałe.",
      "Stanowisko Instytutu: dziaderstwo to postawa, nie wiek. Test nie pyta o datę urodzenia, a Atlas opisuje osoby od trzydziestu kilku do ponad siedemdziesięciu lat. Słowo staje się ageistyczne wtedy, gdy zastępuje odpowiedź na argument. Dlatego Instytut opisuje zachowania, nie ludzi, i zaleca to samo obserwatorom.",
    ],
    ageismRule: "Zasada obserwatora: komentuj zdanie, nie rocznik.",
    questionsTitle: "Najczęstsze pytania",
    questions: [
      {
        question: "Kto to jest boomer?",
        answer:
          "Boomer to osoba z pokolenia powojennego wyżu demograficznego, urodzona mniej więcej w latach 1946–1964. Potocznie tak nazywa się starszą osobę, która nie nadąża za nowościami technicznymi i obyczajowymi, a mimo to chętnie się na ich temat wypowiada.",
      },
      {
        question: "Co znaczy „OK boomer”?",
        answer:
          "To lekceważąca odpowiedź na pouczanie ze strony starszej osoby, w sensie „dobrze, dobrze, ale świat się zmienił”. Zwrot rozpowszechnił się w 2019 roku w mediach społecznościowych, zwłaszcza na TikToku.",
      },
      {
        question: "Jak jest „boomer” w liczbie mnogiej?",
        answer:
          "Boomerzy (o osobach), potocznie także boomery. Dopełniacz: boomerów. Forma żeńska: boomerka, przymiotnik: boomerski.",
      },
      {
        question: "Czym boomer różni się od dziadersa?",
        answer:
          "Boomer to określenie pokoleniowe, związane z rokiem urodzenia. Dziaders opisuje postawę: pouczanie bez pytania, przekonanie o własnej nieomylności i traktowanie dawnych czasów jak normy. Boomer nie musi być dziadersem, a dziadersem można zostać przed trzydziestką.",
      },
      {
        question: "Czy można być jednocześnie boomerem i dziadersem?",
        answer:
          "Tak. Jedno wynika z metryki, drugie z nawyków, więc obie cechy mogą wystąpić u jednej osoby. Atlas Dziadersów opisuje jednak także okazy, u których nawyki wyprzedziły metrykę o kilka dekad.",
      },
      {
        question: "Czy „dziaders” to ageizm?",
        answer:
          "Może nim być, jeśli służy do zbycia kogoś z powodu wieku. Instytut używa słowa do opisu zachowań, które występują w każdym wieku, i nie łączy ich z datą urodzenia.",
      },
      {
        question: "Jak sprawdzić, czy jestem boomerem, czy dziadersem?",
        answer:
          "Boomerem jest się z metryki, więc wystarczy dowód osobisty. Dziaderstwo sprawdza satyryczny Test Dziadersa: pięć gabinetów, około czterech minut i certyfikat. Test nie pyta o rok urodzenia.",
      },
    ],
    nextTitle: "Czytaj dalej",
    next: [
      { href: "/dziaders", label: "Dziaders — kto to jest? Definicja i objawy" },
      { href: "/dziaders/kobieta", label: "Dziaders — kobieta też?" },
      { href: "/slownik", label: "Słownik Dziaderski: zwroty i ich znaczenie" },
      { href: "/test", label: "Sprawdź, czy jesteś boomerem, czy dziadersem" },
    ],
    promo: "Test nie pyta o rok urodzenia.",
    promoText: "Pięć gabinetów, około czterech minut i certyfikat. Boomerem jest się z metryki, dziadersem z nawyków.",
  },
  sl: {
    title: "Boomer ali dziaders?",
    crumb: "Boomer",
    metaTitle: "Boomer: kdo je to in v čem se razlikuje od dziadersa",
    description:
      "Kdo je boomer? Pomen besede, od kod »OK boomer«, sklanjatev (boomerji) in primerjava: boomer, dziaders, dziad, zgred. In vprašanje starizma.",
    lead: "Ena beseda govori o letniku, druga o vedenju. Inštitut pojasnjuje, kdo je boomer, od kod »OK boomer« in zakaj boomer ni nujno dziaders, dziaders pa ne boomer.",
    meta: "Uvod v Inštitut · sorodno izrazje",
    answerTitle: "Kratek odgovor",
    answer:
      "Boomer je oseba iz povojnega demografskega razcveta, rojena približno med letoma 1946 in 1964. Pogovorno: starejša oseba, ki ne sledi novostim in o tem rada poučuje. Dziaders nima letnika. To je drža: pridiganje brez vprašanja, nezmotljivost in prepričanje, da je bilo nekoč bolje.",
    meaningTitle: "Boomer — kaj pomeni?",
    meaning: [
      "Beseda izhaja iz angleškega »baby boomer«, torej otroka iz povojnega demografskega razcveta (angl. »baby boom«). V Združenih državah meje te generacije navadno postavljajo na leta 1946–1964. Poljski povojni razcvet je padel v podobno obdobje, z vrhom rojstev sredi petdesetih let.",
      "V pogovornem jeziku »boomer« redko pomeni samo letnik. Pogosteje označuje nekoga, ki tiska e-pošto, piše z velikimi črkami in komentira svet, ki ga ne poskuša razumeti. V tem pomenu je boomer lahko tudi štiridesetletnik.",
      "Izgovarjava: [búmer]. Na spletu se pojavlja tudi zapis »bumer«; v skrbnejših besedilih se je prijel angleški, »boomer«.",
    ],
    okTitle: "»OK boomer«: od kod?",
    ok: [
      "»OK boomer« je odgovor na pridiganje starejših: kratek, vljuden po obliki in omalovažujoč po vsebini. Pomeni približno »že, že, samo svet je danes drugačen«.",
      "Izraz je po spletu krožil že nekaj let, jeseni 2019 pa se je razširil na TikToku. Novembra 2019 ga je v novozelandskem parlamentu uporabila 25-letna poslanka, ki so jo prekinili med govorom o podnebju. Od takrat je »OK boomer« znan po vsem svetu, tudi na Poljskem in v Sloveniji.",
      "Z vidika Inštituta je »OK boomer« obrambno oglašanje: odda ga mlajši osebek, ko dziaders začne predavanje. Odgovor redko skrajša predavanje. Pogosteje odpre njegov drugi del.",
    ],
    formsTitle: "Sklanjatev: boomer, boomerji, boomerka",
    formsIntro:
      "»Boomer« se sklanja kot drugi samostalniki moškega spola na -er. Množina je »boomerji«, dvojina »boomerja«. Ženska oblika je »boomerka«, pridevnik »boomerski« (boomerske šale, boomerski humor). Poljsko: boomer, množina boomerzy.",
    formsHead: ["Sklon", "Ednina", "Množina"],
    forms: [
      { name: "imenovalnik", singular: "boomer", plural: "boomerji" },
      { name: "rodilnik", singular: "boomerja", plural: "boomerjev" },
      { name: "dajalnik", singular: "boomerju", plural: "boomerjem" },
      { name: "tožilnik", singular: "boomerja", plural: "boomerje" },
      { name: "mestnik", singular: "pri boomerju", plural: "pri boomerjih" },
      { name: "orodnik", singular: "z boomerjem", plural: "z boomerji" },
    ],
    formsNote: "Za primerjavo: dziaders, dziadersa, dziadersu; množina: dziadersi.",
    tableTitle: "Boomer, dziaders, dziad, zgred: primerjava",
    tableIntro: "Štiri besede, s katerimi mlajši na Poljskem opisujejo starejše. Samo ena ne pove ničesar o starosti.",
    tableHead: ["Beseda", "Kaj opisuje", "Starost", "Izvor", "Ton", "Značilni stavek"],
    table: [
      {
        word: "boomer",
        what: "generacijo povojnega razcveta; pogovorno nekoga, ki ne sledi novostim",
        age: "navadno 60+",
        origin: "angl. »baby boomer«",
        tone: "posmehljiv, precej mil",
        line: "»Natisni mi to e-pošto«",
      },
      {
        word: "dziaders",
        what: "držo: pridiganje brez vprašanja, nezmotljivost, »nekoč je bilo bolje«",
        age: "katera koli",
        origin: "polj. »dziad« s šaljivo končnico -ers",
        tone: "posmehljiv, z nasmeškom",
        line: "»V mojih časih …«",
      },
      {
        word: "dziad (polj.)",
        what: "starejšega moškega; žaljivo skopuha, zanemarjenega ali nevljudnega človeka",
        age: "navadno starejši",
        origin: "staropoljsko: ded, nekoč tudi berač",
        tone: "žaljiv",
        line: "»Ne bodi dziad« (ne bodi skopuh)",
      },
      {
        word: "zgred (polj.)",
        what: "godrnjavega, navadno starejšega moškega; slovensko najbližje godrnjač",
        age: "navadno starejši",
        origin: "pogovorno, izvor nejasen",
        tone: "omalovažujoč",
        line: "»Stari zgred spet godrnja«",
      },
    ],
    pairTitle: "Boomer brez dziaderstva, dziaders brez boomerstva",
    pairIntro: "Dva osebka iste vrste iz Atlasa. Loči ju petintrideset let, druži ju način vodenja razprave.",
    age: (years: number) => `${years} ${pluralSl(years, "leto", "leti", "leta", "let")}`,
    pairLabels: ["Po letniku boomer", "Po letniku milenijec"],
    pairNote:
      "Sklep opazovanja: letnik rojstva napove, ali kdo tiska e-pošto. Ne napove, ali zaključi razpravo, ko prebere naslov.",
    ageismTitle: "Je »dziaders« starizem?",
    ageism: [
      "Starizem (angl. ageism) je predsodek ali diskriminacija zaradi starosti. Izraz je leta 1969 uvedel ameriški gerontolog Robert Butler. Starizem je, če komu odrečeš službo, ker ima šestdeset let, pa tudi, če zavrneš vsako njegovo misel samo zato, ker je starejši.",
      "»OK boomer« pogosto kritizirajo prav zaradi tega: odgovarja na letnik, ne na argument. »Dziaders« ima isto težavo v korenu, saj »dziad« pomeni starca. Jezikovni observatorij Varšavske univerze, ki je besedo zabeležil v zbirki »Nowe wyrazy«, opisuje dziadersa kot osebo, predvsem moškega, katere nazore in način življenja govorec dojema kot zastarele.",
      "Stališče Inštituta: dziaderstvo je drža, ne starost. Test ne sprašuje po datumu rojstva, Atlas pa opisuje osebe od dobrih trideset do več kot sedemdeset let. Beseda postane starizem takrat, ko nadomesti odgovor na argument. Zato Inštitut opisuje vedenje, ne ljudi, in isto priporoča opazovalcem.",
    ],
    ageismRule: "Pravilo opazovalca: komentiraj stavek, ne letnika.",
    questionsTitle: "Pogosta vprašanja",
    questions: [
      {
        question: "Kdo je boomer?",
        answer:
          "Boomer je oseba iz generacije povojnega demografskega razcveta, rojena približno med letoma 1946 in 1964. Pogovorno tako rečemo starejši osebi, ki ne sledi tehničnim in družbenim novostim, a se o njih kljub temu rada izreka.",
      },
      {
        question: "Kaj pomeni »OK boomer«?",
        answer:
          "Je omalovažujoč odgovor na pridiganje starejše osebe, v smislu »že, že, ampak svet se je spremenil«. Izraz se je razširil leta 2019 na družbenih omrežjih, zlasti na TikToku.",
      },
      {
        question: "Kako je »boomer« v množini?",
        answer: "Boomerji, rodilnik boomerjev; v dvojini boomerja. Ženska oblika: boomerka, pridevnik: boomerski.",
      },
      {
        question: "V čem se boomer razlikuje od dziadersa?",
        answer:
          "Boomer je generacijska oznaka, povezana z letom rojstva. Dziaders opisuje držo: pridiganje brez vprašanja, prepričanje o lastni nezmotljivosti in obravnavanje nekdanjih časov kot merila. Boomer ni nujno dziaders, dziaders pa lahko postaneš že pred tridesetim.",
      },
      {
        question: "Je lahko kdo hkrati boomer in dziaders?",
        answer:
          "Da. Eno izhaja iz rojstnega lista, drugo iz navad, zato se lahko pojavita pri isti osebi. Atlas dziadersov pa opisuje tudi osebke, pri katerih so navade prehitele rojstni list za nekaj desetletij.",
      },
      {
        question: "Je »dziaders« starizem?",
        answer:
          "Lahko je, če služi temu, da koga odpraviš zaradi starosti. Inštitut besedo uporablja za opis vedenja, ki se pojavlja v vsaki starosti, in ga ne povezuje z datumom rojstva.",
      },
      {
        question: "Kako preverim, ali sem boomer ali dziaders?",
        answer:
          "Boomer si po rojstnem listu, zato zadošča osebna izkaznica. Dziaderstvo preveri satirični Test dziadersa: pet ordinacij, približno štiri minute in certifikat. Test ne sprašuje po letu rojstva.",
      },
    ],
    nextTitle: "Beri naprej",
    next: [
      { href: "/dziaders", label: "Dziaders — kdo je to? Definicija in znaki" },
      { href: "/dziaders/kobieta", label: "Dziaders — tudi ženska?" },
      { href: "/slownik", label: "Dziaderski slovar: izrazi in njihov pomen" },
      { href: "/test", label: "Preveri, ali si boomer ali dziaders" },
    ],
    promo: "Test ne sprašuje po letu rojstva.",
    promoText: "Pet ordinacij, približno štiri minute in certifikat. Boomer si po rojstnem listu, dziaders po navadah.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.metaTitle, description: t.description, path: PATH, type: "article" });
}

export default async function BoomerGuidePage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const guide = getGuide(locale);
  const pair = PAIR.map(({ species, specimen }) => ({
    item: speciesByKey(species, locale),
    person: getSpecimens(species, locale)[specimen],
  }));
  const crumbs = [{ label: guide.title, href: "/dziaders" }, { label: t.crumb }];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          {
            ...publicationSchema(locale, PATH, t.metaTitle, t.description, "Article"),
            about: [
              { "@type": "DefinedTerm", name: "boomer", description: t.questions[0].answer, inLanguage: LOCALE_INFO[locale].tag },
              { "@type": "DefinedTerm", name: "dziaders", description: guide.definition, inLanguage: LOCALE_INFO[locale].tag },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: absoluteUrl(PATH, locale),
            inLanguage: LOCALE_INFO[locale].tag,
            mainEntity: t.questions.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <PageHeader
        crumbs={crumbs}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.meta}
        aside={<SpeciesPlate species="facebook" specimen={0} eager className="mx-auto w-64 max-w-full" />}
      />
      <Section id="odpowiedz" title={t.answerTitle}>
        <p className="max-w-3xl text-2xl leading-snug">{typo(t.answer)}</p>
      </Section>
      <Section id="znaczenie" title={t.meaningTitle}>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
          {t.meaning.map((paragraph) => (
            <p key={paragraph}>{typo(paragraph)}</p>
          ))}
        </div>
      </Section>
      <Section id="ok-boomer" title={t.okTitle}>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
          {t.ok.map((paragraph) => (
            <p key={paragraph}>{typo(paragraph)}</p>
          ))}
        </div>
      </Section>
      <Section id="odmiana" title={t.formsTitle} intro={typo(t.formsIntro)}>
        <div className="max-w-2xl">
          <table className="w-full border-t border-ink text-left">
            <thead>
              <tr className="label text-ink-soft">
                {t.formsHead.map((label) => (
                  <th key={label} scope="col" className="border-b border-rule py-3 pr-4 font-normal">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.forms.map((row) => (
                <tr key={row.name} className="border-b border-rule">
                  <th scope="row" className="label py-3 pr-4 font-normal text-ink-soft">
                    {row.name}
                  </th>
                  <td className="py-3 pr-4 text-lg font-bold">{row.singular}</td>
                  <td className="py-3 text-lg font-bold">{row.plural}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="label mt-6 text-ink-soft">{typo(t.formsNote)}</p>
        </div>
      </Section>
      <Section id="porownanie" title={t.tableTitle} intro={typo(t.tableIntro)}>
        {/* Scrolls sideways on phones; focusable so the keyboard can scroll it too. */}
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-labelledby="porownanie">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <thead>
              <tr className="label border-b border-ink text-ink-soft">
                {t.tableHead.map((label) => (
                  <th key={label} scope="col" className="py-3 pr-5 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.table.map((row) => (
                <tr key={row.word} className={row.word === "dziaders" ? "border-b border-rule bg-red/[0.06] align-baseline" : "border-b border-rule align-baseline"}>
                  <th scope="row" className="py-4 pr-5 text-xl font-bold">
                    {row.word}
                  </th>
                  <td className="py-4 pr-5">{typo(row.what)}</td>
                  <td className="py-4 pr-5 font-sans text-[0.95rem]">{row.age}</td>
                  <td className="py-4 pr-5 font-sans text-[0.95rem] text-ink-soft">{row.origin}</td>
                  <td className="py-4 pr-5 font-sans text-[0.95rem] text-ink-soft">{row.tone}</td>
                  <td className="py-4 italic">{row.line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="okazy" title={t.pairTitle} intro={typo(t.pairIntro)}>
        <ul className="grid max-w-4xl gap-x-10 gap-y-12 sm:grid-cols-2">
          {pair.map(({ item, person }, i) => (
            <li key={person.index}>
              <Link href={"/atlas/" + item.slug} className="group block">
                <SpeciesPlate species={item.key} specimen={person.index} className="mx-auto h-44 w-56 max-w-full" />
                <p className="label mt-4 text-red">{t.pairLabels[i]}</p>
                <h3 className="mt-2 text-2xl font-bold group-hover:text-red">{item.name}</h3>
              </Link>
              <p className="label mt-2 text-ink-faint">{t.age(person.age)}</p>
              <p className="mt-2 text-ink-soft">{typo(person.observation)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-3xl text-xl leading-snug">{typo(t.pairNote)}</p>
      </Section>
      <Section id="ageizm" title={t.ageismTitle}>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
          {t.ageism.map((paragraph) => (
            <p key={paragraph}>{typo(paragraph)}</p>
          ))}
          <p className="border-l-2 border-red pl-6 text-xl font-bold">{typo(t.ageismRule)}</p>
        </div>
      </Section>
      <Section id="pytania" title={t.questionsTitle}>
        <div className="max-w-3xl divide-y divide-rule">
          {t.questions.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="cursor-pointer text-xl font-bold hover:text-red">{item.question}</summary>
              <p className="mt-4 leading-relaxed text-ink-soft">{typo(item.answer)}</p>
            </details>
          ))}
        </div>
      </Section>
      <Section id="dalej" title={t.nextTitle}>
        <ul className="space-y-4 font-sans text-lg">
          {t.next.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="link">
                {item.label} →
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ShareBar path={PATH} text={t.title} kind="przewodnik" />
        </div>
      </Section>
      <TestPromo title={t.promo} text={t.promoText} />
    </main>
  );
}
