import type { Metadata } from "next";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo } from "@/components/page";
import { publicationSchema } from "@/components/fieldwork-parts";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { getGuide } from "@/content/guide";
import { getSpecies, type SpeciesKey } from "@/content/species";
import { defaultSpecimen, getSpecimens, SPECIMENS } from "@/content/specimens";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { plural, pluralSl, typo } from "@/lib/typo";

const PATH = "/dziaders/kobieta";

/** Women from the Atlas shown on the page: one per species, from different habitats. */
const FEATURED: SpeciesKey[] = ["grill", "wigilijny", "korpo", "kolejkowy", "dzialka", "kibicowski"];

type Counts = { women: number; total: number; speciesWith: number; species: number; main: number };

const COPY = defineCopy({
  pl: {
    title: "Dziaders — kobieta też?",
    metaTitle: "Dziaders kobieta: czy kobieta może być dziadersem?",
    description:
      "Czy kobieta może być dziadersem? Tak: dziaderstwo to postawa, nie płeć. Forma żeńska, przykłady z Atlasu Dziadersów i objawy niezależne od płci.",
    lead: "Słowo ma rodzaj męski, zjawisko nie. Co o dziaderstwie kobiet mówią zbiory Instytutu, czy istnieje forma żeńska i po czym rozpoznać dziaderstwo bez względu na płeć.",
    answerTitle: "Krótka odpowiedź",
    answer:
      "Tak. „Dziaders” opisuje postawę: pouczanie bez pytania, przekonanie o własnej nieomylności i traktowanie dawnych czasów jak normy. Ta postawa nie zależy od płci ani od wieku, więc dziadersem może być także kobieta.",
    counts: ({ women, total, speciesWith, species, main }: Counts) =>
      `Udział kobiet w Atlasie Dziadersów: ${women} z ${total} okazów, odnotowane w ${speciesWith} z ${species} gatunków. Okaz wzorcowy, ten z ryciny głównej, jest kobietą w ${main} z ${species} gatunków.`,
    formTitle: "Czy jest żeńska forma słowa „dziaders”?",
    form: [
      "Ustalonej formy żeńskiej nie ma. W rozmowach pojawiają się żartobliwe próby w rodzaju „dziaderki”, ale żadna się nie przyjęła. O kobiecie najczęściej mówi się po prostu „dziaders”: „ciocia to straszny dziaders”.",
      "Bez kłopotu odmienia się za to przymiotnik: dziaderska ciocia, dziaderska uwaga, dziaderskie podejście. Samo zjawisko nazywa się zawsze tak samo: dziaderstwo.",
      "Instytut stosuje nazwę „dziaders” niezależnie od płci, tak jak nazwy gatunków w Atlasie: Dziaders Grillowy to zarówno pan przy ruszcie, jak i pani, która osobiście zatwierdza każdą kiełbasę.",
    ],
    specimensTitle: "Kobiety w Atlasie Dziadersów",
    specimensIntro: "Po jednym okazie z wybranych gatunków. Objawy, siedliska i naturalnych wrogów opisuje Atlas.",
    age: (years: number) => `${years} ${plural(years, "rok", "lata", "lat")}`,
    atlasAll: "Cały Atlas Dziadersów",
    whyTitle: "Dlaczego to słowo kojarzy się z mężczyznami?",
    why: [
      "Rdzeń „dziad” oznacza starszego mężczyznę, a końcówka „-ers” nadaje mu żartobliwie angielskie brzmienie. Słowo upowszechniło się jako docinek wobec mężczyzn, którzy zabierają głos z pozycji niepodważalnego autorytetu, i ten obraz został w nim do dziś.",
      "Znaczenie przesunęło się jednak z osoby na sposób prowadzenia rozmowy. Dlatego w obserwacjach Instytutu liczy się to, co ktoś robi z cudzym pytaniem, a nie to, kim jest.",
    ],
    signsTitle: "Objawy niezależne od płci",
    signs: [
      {
        title: "Rada wydana przed pytaniem",
        text: "Ciocia przestawia talerze na stole, zanim gospodyni zdąży powiedzieć, gdzie stoją. Pomoc nie czeka na zgłoszenie.",
      },
      {
        title: "Przepis ma status dokumentu zamkniętego",
        text: "Barszcz robi się jednym sposobem: tym z rodzinnego zeszytu. Każda zmiana składu wymaga zgody wszystkich, którzy pamiętają poprzednią Wigilię.",
      },
      {
        title: "Dawniej jako jednostka miary",
        text: "„Za moich czasów nikt nie marudził” zamyka rozmowę o pracy, zimie i obiedzie. Okres wzorcowy zbiega się z młodością mówiącej.",
      },
      {
        title: "Opinia staje się regulaminem",
        text: "„Ja bym tak nie zrobiła” zmienia się w „tak się nie robi”. Od tej chwili obowiązuje wszystkich w promieniu jednego podwórka.",
      },
    ],
    questionsTitle: "Najczęstsze pytania",
    questions: [
      {
        question: "Czy kobieta może być dziadersem?",
        answer:
          "Tak. Dziaderstwo to postawa: pouczanie, przekonanie o nieomylności i odrzucanie cudzych rozwiązań. Nie zależy od płci ani od wieku, dlatego Atlas Dziadersów opisuje kobiety i mężczyzn pod wspólnymi nazwami gatunków.",
      },
      {
        question: "Jak nazwać kobietę, która zachowuje się jak dziaders?",
        answer:
          "Najprościej: dziaders. Forma żeńska się nie utrwaliła, a żartobliwa „dziaderka” pozostaje rzadkością. Można też użyć przymiotnika: dziaderska ciocia, dziaderska sąsiadka.",
      },
      {
        question: "Czy „dziaders” to słowo obraźliwe?",
        answer:
          "Bywa docinkiem i zależy od tonu. Jest łagodniejsze niż „dziad”, od którego pochodzi. Instytut używa go do opisu nawyków, nie do oceny człowieka; lepiej mówić o konkretnym zachowaniu, niż przyklejać etykietę.",
      },
      {
        question: "Czy młoda kobieta też może być dziadersem?",
        answer:
          "Tak. Wiek nie daje zwolnienia. Najmłodsza kobieta w Atlasie, okaz Dziadersa Kibicowskiego, poprawia taktykę zespołu z fotela.",
      },
      {
        question: "Jak sprawdzić, czy jestem dziadersem?",
        answer:
          "Wykonaj satyryczny Test Dziadersa: pięć gabinetów, około czterech minut i certyfikat. Test nie pyta o płeć; ocenia wyłącznie nawyki.",
      },
    ],
    nextTitle: "Czytaj dalej",
    next: [
      { href: "/dziaders", label: "Dziaders — kto to jest? Definicja i objawy" },
      { href: "/atlas", label: "Atlas Dziadersów: wszystkie gatunki" },
      { href: "/czy-to-juz-dziaderstwo", label: "Czy to już dziaderstwo? Sprawy Komisji" },
    ],
    promo: "Test nie pyta o płeć.",
    promoText: "Pięć gabinetów, około czterech minut i certyfikat. Ocenie podlegają wyłącznie nawyki.",
  },
  sl: {
    title: "Dziaders — tudi ženska?",
    metaTitle: "Je lahko ženska dziaders? Dziaders in spol",
    description:
      "Je lahko ženska dziaders? Da: dziaderstvo je drža, ne spol. Ženska oblika, primeri iz Atlasa dziadersov in znaki, neodvisni od spola.",
    lead: "Beseda je moškega spola, pojav ni. Kaj o dziaderstvu žensk pravijo zbirke Inštituta, ali obstaja ženska oblika in kako dziaderstvo prepoznati ne glede na spol.",
    answerTitle: "Kratek odgovor",
    answer:
      "Da. »Dziaders« opisuje držo: pridiganje brez vprašanja, prepričanje o lastni nezmotljivosti in obravnavanje nekdanjih časov kot merila. Ta drža ni odvisna od spola ali starosti, zato je dziaders lahko tudi ženska.",
    counts: ({ women, total, speciesWith, species, main }: Counts) =>
      `Delež žensk v Atlasu dziadersov: ${women} od ${total} osebkov, zabeleženih pri ${speciesWith} od ${species} vrst. Vzorčni osebek, tisti z glavne slike, je ženska pri ${main} od ${species} vrst.`,
    formTitle: "Ali obstaja ženska oblika besede »dziaders«?",
    form: [
      "Uveljavljene ženske oblike ni. Šaljivi poskusi, kot je poljska »dziaderka«, se niso prijeli. O ženski se navadno reče kar »dziaders«: »teta je pravi dziaders«.",
      "Brez težav pa se sklanja pridevnik: dziaderska teta, dziaderska pripomba, dziadersko ravnanje. Pojav se vedno imenuje enako: dziaderstvo.",
      "Inštitut uporablja ime »dziaders« ne glede na spol, tako kot imena vrst v Atlasu: Žarni dziaders je gospod ob žaru in tudi gospa, ki osebno odobri vsako klobaso.",
    ],
    specimensTitle: "Ženske v Atlasu dziadersov",
    specimensIntro: "Po en osebek iz izbranih vrst. Znake, habitate in naravne sovražnike opisuje Atlas.",
    age: (years: number) => `${years} ${pluralSl(years, "leto", "leti", "leta", "let")}`,
    atlasAll: "Ves Atlas dziadersov",
    whyTitle: "Zakaj se beseda povezuje z moškimi?",
    why: [
      "Koren »dziad« v poljščini pomeni starca, dedca, končnica »-ers« pa mu da šaljivo angleški zven. Beseda se je razširila kot zbadljivka za moške, ki se oglašajo z mesta nedotakljive avtoritete, in ta podoba je v njej ostala do danes.",
      "Pomen pa se je premaknil z osebe na način pogovora. Zato pri opazovanjih Inštituta šteje, kaj kdo naredi s tujim vprašanjem, ne pa, kdo je.",
    ],
    signsTitle: "Znaki, neodvisni od spola",
    signs: [
      {
        title: "Nasvet pred vprašanjem",
        text: "Teta prestavi krožnike na mizi, še preden gostiteljica pove, kje stojijo. Pomoč ne čaka na prijavo.",
      },
      {
        title: "Recept ima status zaprtega dokumenta",
        text: "Boršč se kuha na en sam način: po družinskem zvezku. Vsaka sprememba sestavin zahteva soglasje vseh, ki se spomnijo prejšnjega svetega večera.",
      },
      {
        title: "Nekoč kot merska enota",
        text: "»V mojih časih ni nihče tarnal« zaključi pogovor o službi, zimi in kosilu. Vzorčno obdobje sovpada z mladostjo govorke.",
      },
      {
        title: "Mnenje postane pravilnik",
        text: "»Jaz tega ne bi tako naredila« se spremeni v »tega se tako ne dela«. Od tega trenutka velja za vse v polmeru enega dvorišča.",
      },
    ],
    questionsTitle: "Pogosta vprašanja",
    questions: [
      {
        question: "Je lahko ženska dziaders?",
        answer:
          "Da. Dziaderstvo je drža: pridiganje, prepričanje o nezmotljivosti in zavračanje tujih rešitev. Ni odvisno od spola ali starosti, zato Atlas dziadersov opisuje ženske in moške pod skupnimi imeni vrst.",
      },
      {
        question: "Kako rečemo ženski, ki se vede kot dziaders?",
        answer:
          "Najpreprosteje: dziaders. Ženska oblika se ni uveljavila, šaljiva poljska »dziaderka« ostaja redkost. Uporabiš lahko tudi pridevnik: dziaderska teta, dziaderska soseda.",
      },
      {
        question: "Je »dziaders« žaljivka?",
        answer:
          "Lahko je zbadljivka, odvisno od tona. Je blažja od poljske besede »dziad«, iz katere izhaja. Inštitut z njo opisuje navade, ne ocenjuje človeka; bolje je govoriti o konkretnem vedenju kot lepiti oznake.",
      },
      {
        question: "Je lahko dziaders tudi mlada ženska?",
        answer:
          "Da. Starost ne daje oprostitve. Najmlajša ženska v Atlasu, osebek Navijaškega dziadersa, popravlja taktiko moštva iz naslanjača.",
      },
      {
        question: "Kako preverim, ali sem dziaders?",
        answer:
          "Opravi satirični Test dziadersa: pet ordinacij, približno štiri minute in certifikat. Test ne sprašuje po spolu; ocenjuje samo navade.",
      },
    ],
    nextTitle: "Beri naprej",
    next: [
      { href: "/dziaders", label: "Dziaders — kdo je to? Definicija in znaki" },
      { href: "/atlas", label: "Atlas dziadersov: vse vrste" },
      { href: "/czy-to-juz-dziaderstwo", label: "Je to že dziaderstvo? Primeri Komisije" },
    ],
    promo: "Test ne sprašuje po spolu.",
    promoText: "Pet ordinacij, približno štiri minute in certifikat. Ocenjujejo se samo navade.",
  },
});

/** The figures come from the specimen registry, so the page stays true when the cast changes. */
function counts(): Counts {
  const lists = Object.entries(SPECIMENS) as [SpeciesKey, readonly { index: number; gender: string }[]][];
  const people = lists.flatMap(([, list]) => list);
  return {
    women: people.filter((person) => person.gender === "woman").length,
    total: people.length,
    speciesWith: lists.filter(([, list]) => list.some((person) => person.gender === "woman")).length,
    species: lists.length,
    main: lists.filter(([key, list]) => list[defaultSpecimen(key)].gender === "woman").length,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.metaTitle, description: t.description, path: PATH, type: "article" });
}

export default async function WomanGuidePage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const guide = getGuide(locale);
  const species = getSpecies(locale);
  const featured = FEATURED.map((key) => {
    const item = species.find((entry) => entry.key === key)!;
    const person = getSpecimens(key, locale).find((specimen) => specimen.gender === "woman")!;
    return { item, person };
  });
  const crumbs = [{ label: guide.title, href: "/dziaders" }, { label: t.title }];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          {
            ...publicationSchema(locale, PATH, t.title, t.description, "Article"),
            about: { "@type": "DefinedTerm", name: "dziaders", description: guide.definition, inLanguage: LOCALE_INFO[locale].tag },
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
        aside={<SpeciesPlate species="weselny" specimen={2} eager className="mx-auto w-64 max-w-full" />}
      />
      <Section id="odpowiedz" title={t.answerTitle}>
        <div className="max-w-3xl space-y-5">
          <p className="text-2xl leading-snug">{typo(t.answer)}</p>
          <p className="text-ink-soft">{typo(t.counts(counts()))}</p>
        </div>
      </Section>
      <Section id="forma" title={t.formTitle}>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
          {t.form.map((paragraph) => (
            <p key={paragraph}>{typo(paragraph)}</p>
          ))}
        </div>
      </Section>
      <Section id="okazy" title={t.specimensTitle} intro={typo(t.specimensIntro)}>
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(({ item, person }) => (
            <li key={item.key}>
              <Link href={"/atlas/" + item.slug} className="group block">
                <SpeciesPlate species={item.key} specimen={person.index} className="mx-auto h-40 w-52 max-w-full" />
                <h3 className="mt-4 text-2xl font-bold group-hover:text-red">{item.name}</h3>
              </Link>
              <p className="label mt-2 text-ink-faint">{t.age(person.age)}</p>
              <p className="mt-2 text-ink-soft">{typo(person.observation)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-sans text-lg">
          <Link href="/atlas" className="link">
            {t.atlasAll} →
          </Link>
        </p>
      </Section>
      <Section id="skojarzenia" title={t.whyTitle}>
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed">
          {t.why.map((paragraph) => (
            <p key={paragraph}>{typo(paragraph)}</p>
          ))}
        </div>
      </Section>
      <Section id="objawy" title={t.signsTitle}>
        <ol className="grid gap-8 md:grid-cols-2">
          {t.signs.map((item, i) => (
            <li key={item.title} className="border-l-2 border-red pl-6">
              <p className="label text-red">0{i + 1}</p>
              <h3 className="mt-3 text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 text-ink-soft">{typo(item.text)}</p>
            </li>
          ))}
        </ol>
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
