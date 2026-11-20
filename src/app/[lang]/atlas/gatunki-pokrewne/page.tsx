import type { Metadata } from "next";
import { publicationSchema } from "@/components/fieldwork-parts";
import { breadcrumbList, JsonLd, PageHeader, Section, TestPromo, TranslatorNotes } from "@/components/page";
import { SpeciesPlate } from "@/components/pictograms";
import { ShareBar } from "@/components/share-bar";
import { speciesByKey, type SpeciesKey } from "@/content/species";
import { LOCALE_INFO } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { alternatePath } from "@/i18n/routes";
import { getLocale } from "@/i18n/server";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { typo } from "@/lib/typo";

const PATH = "/atlas/gatunki-pokrewne";

/*
 * Links are written with Polish slugs and mapped to the edition's own (alternatePath).
 *
 * Related types: words for men (mostly) that sit next to "dziaders" in Polish. Text only, by
 * design: none of them is a species, so none gets artwork. A type becomes a species only together
 * with the full artwork set (docs/ILLUSTRATIONS.md). The pictograms point at the nearest species.
 */

type Verdict = "yes" | "no" | "depends";

type RelatedType = {
  /** Anchor on the page. Stable: links point at it. */
  id: string;
  name: string;
  /** What the word means, plainly. */
  meaning: string;
  /** The Institute's description. */
  field: string;
  verdict: Verdict;
  verdictText: string;
  species: SpeciesKey;
  link?: { href: string; label: string };
};

const VERDICT: Record<Verdict, { pl: string; sl: string }> = {
  yes: { pl: "Tak", sl: "Da" },
  no: { pl: "Nie", sl: "Ne" },
  depends: { pl: "Zależy", sl: "Odvisno" },
};

const COPY = defineCopy({
  pl: {
    title: "Gatunki pokrewne",
    metaTitle: "Janusz, szwagier, wujek dobra rada: czy to już dziaders?",
    description:
      "Kim jest Janusz, szwagier, wujek dobra rada, majster, pan Areczek i sąsiad? Znaczenie każdego słowa i odpowiedź Instytutu: czy to już dziaders.",
    lead: "Janusz, szwagier, wujek dobra rada, majster, pan Areczek i sąsiad żyją obok dziadersa i bywają z nim myleni. Instytut podaje, co znaczy każde słowo, i rozstrzyga, czy to już dziaderstwo.",
    meta: "Atlas Dziadersów · aneks · typy, nie gatunki",
    atlas: "Atlas Dziadersów",
    contents: "Spis typów",
    meaning: "Znaczenie",
    field: "Rozpoznanie Instytutu",
    verdict: "Czy to już dziaders?",
    nearest: "Najbliższy gatunek w Atlasie",
    why: "Dlaczego nie ma ich w Atlasie",
    whyText:
      "Atlas opisuje gatunki: zespoły zachowań, które można rozpoznać w terenie bez pytania o imię, zawód i pokrewieństwo. Janusz, szwagier i majster to role i stereotypy. Każdy z nich może należeć do kilku gatunków naraz albo do żadnego. Typ zostanie gatunkiem, gdy Instytut zbierze wystarczająco dużo obserwacji i trzy okazy do ryciny.",
    tableTitle: "Zestawienie",
    tableHead: ["Typ", "Co opisuje", "Czy to dziaders?"],
    questionsTitle: "Najczęstsze pytania",
    nextTitle: "Czytaj dalej",
    next: [
      { href: "/dziaders", label: "Dziaders — kto to jest? Definicja i objawy" },
      { href: "/dziaders/boomer", label: "Boomer czy dziaders? Porównanie z dziadem i zgredem" },
      { href: "/okazje/dzien-tesciowej", label: "Teściowa: przewodnik na Dzień Teściowej" },
      { href: "/atlas", label: "Atlas Dziadersów: wszystkie gatunki" },
    ],
    notes: [] as string[],
    types: [
      {
        id: "janusz",
        name: "Janusz",
        meaning:
          "Pejoratywne, żartobliwe określenie mężczyzny, zwykle w średnim wieku, uosabiającego stereotypowe przywary: skąpstwo, cwaniactwo, brak gustu i pewność siebie. Typowy obraz z memów: wąsy, sandały ze skarpetami, reklamówka z dyskontu. „Janusz biznesu” to szef, który oszczędza na wszystkim, zwłaszcza na pracownikach. Słowo pochodzi od popularnego imienia.",
        field:
          "Janusz jest przede wszystkim oszczędny i zadowolony z siebie. Instytut odnotowuje go na parkingach, w kolejkach do kasy i nad morzem, za parawanem rozstawionym o świcie.",
        verdict: "depends",
        verdictText: "Janusz to obciach i oszczędność. Dziaders zaczyna się w chwili, w której Janusz zaczyna pouczać innych, jak należy żyć.",
        species: "oszczednosciowy",
      },
      {
        id: "szwagier",
        name: "Szwagier",
        meaning:
          "Brat żony albo męża, a także mąż siostry. Potocznie także zwrot do kolegi („szwagier, pomożesz?”) i bohater rodzinnych anegdot: ten, który zna się na samochodach, ma znajomego w każdej branży i pożycza kable rozruchowe na stałe.",
        field:
          "Szwagier jest głównym nosicielem rady motoryzacyjnej. Instytut przygotował na jego podstawie model językowy SZWAGIER 1.9 TDI, który odpowiada na każde pytanie, nawet jeśli nikt go nie zadał.",
        verdict: "depends",
        verdictText: "Z urzędu nie. Pokrewieństwo nie przesądza o rozpoznaniu; przesądza „ja bym to inaczej zrobił” wypowiedziane nad cudzą maską.",
        species: "moto",
        link: { href: "/superinteligencja", label: "Zapytaj SZWAGRA 1.9 TDI" },
      },
      {
        id: "wujek-dobra-rada",
        name: "Wujek dobra rada",
        meaning:
          "Ironicznie o kimś, kto udziela rad, o które nikt nie prosił, zwykle oczywistych albo spóźnionych: „trzeba było kupić zimowe”. Nie musi być wujkiem ani nawet krewnym; może nim być kolega z pracy albo komentator w internecie.",
        field: "Najbliższy krewny dziadersa. Wujek dobra rada udziela porad bez przerwy, na każdy temat, w każdym miejscu, także przez otwarte okno samochodu.",
        verdict: "yes",
        verdictText: "Tak. Nieproszona rada to podstawowy objaw dziaderstwa. Wujkowi dobra rada brakuje do pełnego obrazu tylko „za moich czasów”, i to nie zawsze.",
        species: "grill",
      },
      {
        id: "majster",
        name: "Majster",
        meaning:
          "Kierownik grupy robotników, brygadzista; potocznie każdy fachowiec od remontu („majster od płytek”). Z niemieckiego Meister. W zwrocie „panie majster” bywa ironiczne: o kimś, kto uważa się za specjalistę od wszystkiego.",
        field:
          "Majster w pracy wykonuje zawód. Instytut obserwuje go dopiero po godzinach, kiedy ogląda cudze płytki, ostukuje ścianę i pyta: „Kto panu to tak zrobił?”.",
        verdict: "depends",
        verdictText: "Majster przy pracy nie. Majster po godzinach, oceniający cudzy remont bez zaproszenia, już tak.",
        species: "budowa",
        link: { href: "/slownik/kto-panu-to-tak-zrobil", label: "„Kto panu to tak zrobił?” w Słowniku Dziaderskim" },
      },
      {
        id: "pan-areczek",
        name: "Pan Areczek",
        meaning:
          "Bohater memów o pracy w polskiej firmie: pracownik, do którego szef zwraca się „Panie Areczku”, zanim wyda mu absurdalne polecenie („Panie Areczku, zamiast owocowych czwartków będą nadgodzinowe soboty”). Mem wyśmiewa szefów, którzy traktują pracowników jak własność.",
        field:
          "Pan Areczek nie jest okazem, tylko ofiarą. Okazem jest prezes, który mówi do niego „Panie Areczku”, a w wolnych chwilach wyjaśnia, że za jego czasów pracowało się za darmo i nikt nie narzekał.",
        verdict: "no",
        verdictText: "Pan Areczek nie. Jego szef najczęściej tak, z objawami gatunku korporacyjnego, choć korporacją nie kieruje.",
        species: "korpo",
      },
      {
        id: "sasiad",
        name: "Sąsiad",
        meaning:
          "Osoba mieszkająca obok: za ścianą, piętro niżej, za płotem działki. W rozmowach potocznych występuje w kilku stałych rolach: sąsiad z wiertarką w niedzielę, sąsiad zza firanki, sąsiad, który ma lepszy trawnik.",
        field:
          "Sąsiad prowadzi obserwację z okna, z balkonu albo zza płotu, z uwagą równą pracy Instytutu, ale bez metodologii. Zostawia kartki za wycieraczką i wie, kto wczoraj wrócił po północy.",
        verdict: "depends",
        verdictText: "Sąsiedztwo nie jest objawem. Objawem jest kartka za wycieraczką, kontrola segregacji śmieci i komentarz do cudzego trawnika.",
        species: "parapetowy",
        link: { href: "/czy-to-juz-dziaderstwo/kontrola-segregacji", label: "Sprawa w Komisji: kontrola segregacji u sąsiadów" },
      },
    ] as RelatedType[],
    promo: "Janusz, szwagier czy dziaders?",
    promoText: "Test Dziadersa nie pyta o imię ani pokrewieństwo. Pięć gabinetów, około czterech minut.",
  },
  sl: {
    title: "Sorodne vrste",
    metaTitle: "Janusz, svak, stric dober nasvet: je to že dziaders?",
    description:
      "Kdo so janusz, svak, stric dober nasvet, mojster, gospod Areček in sosed? Pomen vsake poljske besede in odgovor Inštituta: je to že dziaders.",
    lead: "Janusz, svak, stric dober nasvet, mojster, gospod Areček in sosed živijo poleg dziadersa in jih z njim pogosto zamenjujejo. Inštitut pove, kaj pomeni vsaka beseda, in razsodi, ali je to že dziaderstvo.",
    meta: "Atlas dziadersov · dodatek · tipi, ne vrste",
    atlas: "Atlas dziadersov",
    contents: "Seznam tipov",
    meaning: "Pomen",
    field: "Izvid Inštituta",
    verdict: "Je to že dziaders?",
    nearest: "Najbližja vrsta v Atlasu",
    why: "Zakaj jih ni v Atlasu",
    whyText:
      "Atlas opisuje vrste: skupke vedenj, ki jih je na terenu mogoče prepoznati brez vprašanja o imenu, poklicu in sorodstvu. Janusz, svak in mojster so vloge in stereotipi. Vsak lahko pripada več vrstam hkrati ali nobeni. Tip postane vrsta, ko Inštitut zbere dovolj opazovanj in tri osebke za sliko.",
    tableTitle: "Pregled",
    tableHead: ["Tip", "Kaj opisuje", "Je to dziaders?"],
    questionsTitle: "Pogosta vprašanja",
    nextTitle: "Beri naprej",
    next: [
      { href: "/dziaders", label: "Dziaders — kdo je to? Definicija in znaki" },
      { href: "/dziaders/boomer", label: "Boomer ali dziaders? Primerjava z dziadom in zgredom" },
      { href: "/okazje/dzien-tesciowej", label: "Tašča: vodnik za dan tašče" },
      { href: "/atlas", label: "Atlas dziadersov: vse vrste" },
    ],
    notes: [
      "Imena tipov so poljska. Janusz je pogosto poljsko moško ime, Areček (Arek, Arkadiusz) prav tako; v slovenščini bi jima najbolj ustrezala Janez in Franci.",
    ],
    types: [
      {
        id: "janusz",
        name: "Janusz",
        meaning:
          "Slabšalna, šaljiva poljska oznaka za moškega, navadno srednjih let, ki pooseblja stereotipne slabosti: skopost, prebrisanost, pomanjkanje okusa in samozavest. Tipična podoba z memov: brki, sandali z nogavicami, vrečka iz diskonta. »Janusz biznesa« je šef, ki varčuje pri vsem, zlasti pri zaposlenih. Beseda izhaja iz pogostega imena.",
        field:
          "Janusz je predvsem varčen in sam s sabo zadovoljen. Inštitut ga beleži na parkiriščih, v vrstah pri blagajni in na morju, za vetrobranom, postavljenim ob zori.",
        verdict: "depends",
        verdictText: "Janusz pomeni zadrego in varčnost. Dziaders se začne v trenutku, ko začne Janusz druge učiti, kako je treba živeti.",
        species: "oszczednosciowy",
      },
      {
        id: "szwagier",
        name: "Svak (szwagier)",
        meaning:
          "Ženin ali možev brat in tudi sestrin mož. Pogovorno na Poljskem tudi nagovor prijatelja (»svak, mi pomagaš?«) in junak družinskih anekdot: tisti, ki se spozna na avtomobile, ima znanca v vsaki panogi in si zagonske kable izposodi za vedno.",
        field:
          "Svak je glavni prenašalec avtomobilskega nasveta. Inštitut je po njegovem vzoru pripravil jezikovni model SZWAGIER 1.9 TDI, ki odgovori na vsako vprašanje, tudi če ga ni nihče postavil.",
        verdict: "depends",
        verdictText: "Po uradni dolžnosti ne. O diagnozi ne odloča sorodstvo, temveč »jaz bi to naredil drugače«, izrečeno nad tujim pokrovom motorja.",
        species: "moto",
        link: { href: "/superinteligencja", label: "Vprašaj SZWAGRA 1.9 TDI" },
      },
      {
        id: "wujek-dobra-rada",
        name: "Stric dober nasvet",
        meaning:
          "Poljski ironični izraz (»wujek dobra rada«) za nekoga, ki daje nasvete, za katere ni nihče prosil, navadno očitne ali zapoznele: »Moral bi kupiti zimske.« Ni nujno stric ali sploh sorodnik; lahko je sodelavec ali spletni komentator.",
        field: "Najbližji sorodnik dziadersa. Stric dober nasvet svetuje neprestano, o vsem, povsod, tudi skozi odprto okno avtomobila.",
        verdict: "yes",
        verdictText: "Da. Nenaročen nasvet je osnovni simptom dziaderstva. Stricu dober nasvet do popolne slike manjka samo »v mojih časih«, pa še to ne vedno.",
        species: "grill",
      },
      {
        id: "majster",
        name: "Mojster (majster)",
        meaning:
          "Vodja skupine delavcev, delovodja; pogovorno vsak obrtnik za prenovo (»mojster za ploščice«). Iz nemškega Meister. V nagovoru »gospod mojster« je lahko ironično: o nekom, ki se ima za strokovnjaka za vse.",
        field:
          "Mojster pri delu opravlja poklic. Inštitut ga opazuje šele po službi, ko si ogleduje tuje ploščice, trka po steni in sprašuje: »Kdo vam je pa to delal?«",
        verdict: "depends",
        verdictText: "Mojster pri delu ne. Mojster po službi, ki brez povabila ocenjuje tujo prenovo, pa že.",
        species: "budowa",
        link: { href: "/slownik/kto-panu-to-tak-zrobil", label: "»Kdo vam je pa to delal?« v Dziaderskem slovarju" },
      },
      {
        id: "pan-areczek",
        name: "Gospod Areček (pan Areczek)",
        meaning:
          "Junak poljskih memov o delu v podjetju: uslužbenec, ki ga šef nagovori z »gospod Areček«, preden mu da absurdno navodilo (»Gospod Areček, namesto sadnih četrtkov bodo nadurne sobote«). Mem zasmehuje šefe, ki z zaposlenimi ravnajo kot z lastnino.",
        field:
          "Gospod Areček ni osebek, temveč žrtev. Osebek je direktor, ki ga tako nagovarja, v prostem času pa razlaga, da se je v njegovih časih delalo zastonj in se ni nihče pritoževal.",
        verdict: "no",
        verdictText: "Gospod Areček ne. Njegov šef pa največkrat da, s simptomi korporativne vrste, čeprav ne vodi korporacije.",
        species: "korpo",
      },
      {
        id: "sasiad",
        name: "Sosed",
        meaning:
          "Oseba, ki živi zraven: za steno, nadstropje nižje, za ograjo vrtička. V pogovorih nastopa v nekaj stalnih vlogah: sosed z vrtalnikom v nedeljo, sosed izza zavese, sosed, ki ima lepšo trato.",
        field:
          "Sosed opazuje z okna, balkona ali izza ograje, s pozornostjo, enako delu Inštituta, a brez metodologije. Pušča listke za brisalcem in ve, kdo se je včeraj vrnil po polnoči.",
        verdict: "depends",
        verdictText: "Sosedstvo ni simptom. Simptomi so listek za brisalcem, nadzor ločevanja odpadkov in komentar o tuji trati.",
        species: "parapetowy",
        link: { href: "/czy-to-juz-dziaderstwo/kontrola-segregacji", label: "Primer v Komisiji: nadzor ločevanja pri sosedih" },
      },
    ] as RelatedType[],
    promo: "Janusz, svak ali dziaders?",
    promoText: "Test dziadersa ne sprašuje po imenu ali sorodstvu. Pet ordinacij, približno štiri minute.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.metaTitle, description: t.description, path: PATH, type: "article" });
}

export default async function RelatedTypesPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const language = LOCALE_INFO[locale].tag;
  const crumbs = [{ label: t.atlas, href: "/atlas" }, { label: t.title }];
  return (
    <main id="tresc">
      <JsonLd
        data={[
          breadcrumbList(locale, crumbs),
          publicationSchema(locale, PATH, t.metaTitle, t.description, "Article"),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: t.title,
            url: absoluteUrl(PATH, locale),
            inLanguage: language,
            hasDefinedTerm: t.types.map((type) => ({
              "@type": "DefinedTerm",
              name: type.name,
              description: type.meaning,
              url: absoluteUrl(PATH, locale) + "#" + type.id,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            url: absoluteUrl(PATH, locale),
            inLanguage: language,
            mainEntity: t.types.map((type) => ({
              "@type": "Question",
              name: `${type.name}: ${t.verdict.toLowerCase()}`,
              acceptedAnswer: { "@type": "Answer", text: `${type.meaning} ${type.verdictText}` },
            })),
          },
        ]}
      />
      <PageHeader crumbs={crumbs} title={t.title} lead={typo(t.lead)} meta={t.meta} />
      <nav aria-label={t.contents} className="wrap mt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 font-sans text-lg">
          {t.types.map((type) => (
            <li key={type.id}>
              <a href={"#" + type.id} className="link">
                {type.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {t.types.map((type) => {
        const species = speciesByKey(type.species, locale);
        return (
          <Section key={type.id} id={type.id} title={type.name}>
            <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="label text-ink-soft">{t.meaning}</h3>
                  <p className="mt-2 text-xl leading-snug">{typo(type.meaning)}</p>
                </div>
                <div>
                  <h3 className="label text-ink-soft">{t.field}</h3>
                  <p className="mt-2 text-lg leading-relaxed">{typo(type.field)}</p>
                </div>
                {type.link && (
                  <p className="font-sans text-lg">
                    <Link href={alternatePath(type.link.href, "pl", locale)} className="link">
                      {type.link.label} →
                    </Link>
                  </p>
                )}
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-red pl-6">
                  <p className="label text-red">
                    {t.verdict} {VERDICT[type.verdict][locale]}
                  </p>
                  <p className="mt-2 text-lg font-bold leading-snug">{typo(type.verdictText)}</p>
                </div>
                <Link href={"/atlas/" + species.slug} className="group flex items-center gap-4 border-t border-rule pt-4">
                  <SpeciesPlate species={species.key} variant="pictogram" className="h-14 w-14 shrink-0" />
                  <span>
                    <span className="label block text-ink-soft">{t.nearest}</span>
                    <span className="block text-xl font-bold leading-tight group-hover:text-red">{species.name}</span>
                  </span>
                </Link>
              </div>
            </div>
          </Section>
        );
      })}
      <Section id="zestawienie" title={t.tableTitle}>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-labelledby="zestawienie">
          <table className="w-full min-w-[36rem] border-collapse text-left">
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
              {t.types.map((type) => (
                <tr key={type.id} className="border-b border-rule align-baseline">
                  <th scope="row" className="py-4 pr-5 text-xl font-bold">
                    <a href={"#" + type.id} className="hover:text-red">
                      {type.name}
                    </a>
                  </th>
                  <td className="py-4 pr-5 text-ink-soft">{typo(type.meaning.split(/(?<=\.)\s/)[0])}</td>
                  <td className="py-4 font-sans font-semibold">{VERDICT[type.verdict][locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="dlaczego" title={t.why}>
        <p className="max-w-3xl text-lg leading-relaxed">{typo(t.whyText)}</p>
        <TranslatorNotes notes={t.notes} className="mt-10 max-w-2xl" />
      </Section>
      <Section id="dalej" title={t.nextTitle}>
        <ul className="space-y-4 font-sans text-lg">
          {t.next.map((item) => (
            <li key={item.href}>
              <Link href={alternatePath(item.href, "pl", locale)} className="link">
                {item.label} →
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ShareBar path={PATH} text={t.metaTitle} kind="przewodnik" />
        </div>
      </Section>
      <TestPromo title={t.promo} text={typo(t.promoText)} />
    </main>
  );
}
