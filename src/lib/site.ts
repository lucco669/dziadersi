import { defineCopy } from "@/i18n/copy";
import type { Locale } from "@/i18n/config";

/** Facts that are the same in both editions. Texts are in `siteCopy(locale)`. */
export const site = {
  name: "DZIADER.SI",
  founded: 2026,
  /** The day the site went public. */
  launched: "2026-10-01",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dziader.si",
  /** The license of the Institute's data (Indeks, Spis, Rocznik, Mapa obserwacji); the Regulamin says so in point 3.4. */
  dataLicense: "https://creativecommons.org/licenses/by/4.0/",
  /** The data controller and contact supplied by the site owner. */
  controller: { name: "Łukasz Szramuk", email: "admin@dziader.si" },
} as const;

export type SocialNetwork = "instagram" | "facebook" | "threads" | "tiktok";

/**
 * The Institute's accounts. Fill in the handle (without @) once an account exists: the footer, the
 * press page and Organization `sameAs` pick it up. Empty handles are never shown or linked.
 */
export const SOCIAL: Record<SocialNetwork, string> = {
  instagram: "",
  facebook: "",
  threads: "",
  tiktok: "",
};

const SOCIAL_NETWORKS: Record<SocialNetwork, { label: string; url: (handle: string) => string }> = {
  instagram: { label: "Instagram", url: (handle) => `https://www.instagram.com/${handle}/` },
  facebook: { label: "Facebook", url: (handle) => `https://www.facebook.com/${handle}` },
  threads: { label: "Threads", url: (handle) => `https://www.threads.com/@${handle}` },
  tiktok: { label: "TikTok", url: (handle) => `https://www.tiktok.com/@${handle}` },
};

export type SocialProfile = { network: SocialNetwork; label: string; handle: string; url: string };

/** The accounts that exist, in a fixed order. */
export function socialProfiles(accounts: Record<SocialNetwork, string> = SOCIAL): SocialProfile[] {
  return (Object.keys(SOCIAL_NETWORKS) as SocialNetwork[]).flatMap((network) => {
    const handle = accounts[network].trim().replace(/^@/, "");
    return handle ? [{ network, label: SOCIAL_NETWORKS[network].label, handle, url: SOCIAL_NETWORKS[network].url(handle) }] : [];
  });
}

const SITE_COPY = defineCopy({
  pl: {
    institute: "Instytut Badań nad Dziaderstwem",
    tagline: "Zbadaj się, zanim będzie za późno.",
    description:
      "Instytut Badań nad Dziaderstwem: Test Dziadersa z certyfikatem, Atlas Dziadersów, Słownik Dziaderski i Narodowy Indeks Dziaderstwa. Serwis satyryczny.",
    disclaimer: "Serwis satyryczny. Wszystkie dane są zmyślone, a mimo to się zgadzają. Instytut wyśmiewa nawyki, nie ludzi.",
    privacyDate: "3 października 2026",
  },
  sl: {
    institute: "Inštitut za raziskave dziaderstva",
    tagline: "Preglej se, preden bo prepozno.",
    description:
      "Inštitut za raziskave dziaderstva: test s certifikatom, Atlas dziadersov, slovar in Nacionalni indeks dziaderstva. Slovenska izdaja satirične strani.",
    disclaimer: "Satirična stran. Vsi podatki so izmišljeni, pa vendar držijo. Inštitut se norčuje iz navad, ne iz ljudi.",
    privacyDate: "3. oktober 2026",
  },
});

export const siteCopy = (locale: Locale) => SITE_COPY[locale];

export type GroupKey = "badania" | "zbiory" | "dane" | "pomoce";

export type Group = { key: GroupKey; label: string; short: string; note: string };

/** How the departments are grouped in the menu, like the Institute's organisational chart. */
const GROUP_COPY = defineCopy<Group[]>({
  pl: [
    { key: "badania", label: "Badania", short: "Badania", note: "Diagnostyka i orzecznictwo" },
    { key: "zbiory", label: "Zbiory", short: "Zbiory", note: "Katalogi i publikacje" },
    { key: "dane", label: "Dane", short: "Dane", note: "Statystyka publiczna" },
    { key: "pomoce", label: "Pomoce naukowe", short: "Pomoce", note: "Do użytku przy stole" },
  ],
  sl: [
    { key: "badania", label: "Raziskave", short: "Raziskave", note: "Diagnostika in razsojanje" },
    { key: "zbiory", label: "Zbirke", short: "Zbirke", note: "Katalogi in publikacije" },
    { key: "dane", label: "Podatki", short: "Podatki", note: "Javna statistika" },
    { key: "pomoce", label: "Učni pripomočki", short: "Pripomočki", note: "Za uporabo pri mizi" },
  ],
});

export const groups = (locale: Locale) => GROUP_COPY[locale];

export type Department = {
  /** Internal path; links localise it. */
  href: string;
  label: string;
  /** In the mobile menu row. */
  short: string;
  group: GroupKey;
  summary: string;
  isNew?: boolean;
};

/** The departments of the Institute, in the order of the footer and the menu. */
const SECTION_COPY = defineCopy<Department[]>({
  pl: [
    { href: "/okazje", label: "Przewodniki na okazje", short: "Okazje", group: "zbiory", summary: "Wigilia, wesele i majówka: gatunki, powiedzenia, sprawy Komisji i bingo do druku.", isNew: true },
    { href: "/muzeum", label: "Muzeum rzeczy", short: "Muzeum", group: "zbiory", summary: "Rzeczy, które jeszcze się przydadzą: sześć szuflad, karty eksponatów i własne zbiory.", isNew: true },
    { href: "/do-druku", label: "Materiały do druku", short: "Do druku", group: "pomoce", summary: "Bingo na rodzinne okazje, karty oznaczania gatunków i kieszonkowy przewodnik na papierze A4.", isNew: true },
    {
      href: "/test",
      label: "Test Dziadersa",
      short: "Test",
      group: "badania",
      summary: "Badanie okresowe w pięciu gabinetach. Wynik w procentach, rozpoznanie gatunku, wyniki laboratoryjne i certyfikat.",
    },
    {
      href: "/test/przy-stole",
      label: "Badanie przy stole",
      short: "Przy stole",
      group: "badania",
      summary: "Test dla całego stołu na jednym telefonie: od dwóch do ośmiu osób, sześć zadań na osobę, wspólny ranking i certyfikat dla każdego.",
      isNew: true,
    },
    {
      href: "/egzamin",
      label: "Egzamin terenowy",
      short: "Egzamin",
      group: "badania",
      summary: "Dwanaście pytań z oznaczania gatunków: wokalizacje, ryciny, siedliska. Ocena od niedostatecznej do celującej.",
      isNew: true,
    },
    {
      href: "/czy-to-juz-dziaderstwo",
      label: "Komisja Orzekająca",
      short: "Komisja",
      group: "badania",
      summary: "Czy to już dziaderstwo? Sprawy z życia wzięte, głosy ławników i uzasadnienie Komisji.",
      isNew: true,
    },
    {
      href: "/atlas",
      label: "Atlas Dziadersów",
      short: "Atlas",
      group: "zbiory",
      summary: "Katalog gatunków dziadersów występujących w Polsce: objawy, siedliska, naturalni wrogowie i klucz do oznaczania.",
    },
    {
      href: "/slownik",
      label: "Słownik Dziaderski",
      short: "Słownik",
      group: "zbiory",
      summary: "Zwroty, które każdy słyszał przy rodzinnym stole: znaczenie, wymowa i przykłady użycia.",
    },
    {
      href: "/raporty",
      label: "Raporty Instytutu",
      short: "Raporty",
      group: "zbiory",
      summary: "Wyniki badań terenowych, przeglądów systematycznych i eksperymentów Instytutu.",
    },
    {
      href: "/biuletyn",
      label: "Biuletyn tygodniowy",
      short: "Biuletyn",
      group: "zbiory",
      summary: "Tydzień w liczbach: badania, obserwacje, sprawa tygodnia i prognoza. Co poniedziałek na stronie, a po zapisaniu także e-mailem.",
      isNew: true,
    },
    {
      href: "/indeks",
      label: "Narodowy Indeks Dziaderstwa",
      short: "Indeks",
      group: "dane",
      summary: "Natężenie dziaderstwa w Polsce, aktualizowane co godzinę, z prognozą na Wigilię.",
    },
    {
      href: "/spis",
      label: "Narodowy Spis Dziadersów",
      short: "Spis",
      group: "dane",
      summary: "Wyniki wszystkich badań Instytutu, na żywo: gatunki, krzyżówki, najczęstsze odpowiedzi i województwa.",
    },
    {
      href: "/statystyki",
      label: "Mały Rocznik Statystyczny",
      short: "Rocznik",
      group: "dane",
      summary: "Wszystko, co policzył Instytut: badania, obserwacje, orzeczenia, skreślenia w bingo i trąbienia klaksonem.",
      isNew: true,
    },
    {
      href: "/obserwacje",
      label: "Mapa obserwacji",
      short: "Mapa",
      group: "dane",
      summary: "Gdzie widziano dziadersa: zgłoszenia obserwatorów terenowych według województw, z podziałem na gatunki.",
      isNew: true,
    },
    {
      href: "/tablica-honorowa",
      label: "Tablica Honorowa",
      short: "Tablica",
      group: "dane",
      summary: "Przodownicy obserwacji, ławnicy i zdzieracze kalendarza. Sprawy, które podzieliły naród, i gatunki najlepiej obserwowane.",
      isNew: true,
    },
    {
      href: "/superinteligencja",
      label: "Superinteligencja",
      short: "SI",
      group: "pomoce",
      summary: "SZWAGIER 1.9 TDI, model językowy Instytutu. Odpowiada na każde pytanie, podaje źródła i nigdy nie zmienia zdania.",
      isNew: true,
    },
    {
      href: "/generator",
      label: "Rozmówki dziaderskie",
      short: "Rozmówki",
      group: "pomoce",
      summary: "Generator wypowiedzi na każdą okazję: samochód, remont, urlop, restauracja, komputer, pogoda, zakupy i dzieci sąsiadów.",
    },
    {
      href: "/bingo",
      label: "Dziaders Bingo",
      short: "Bingo",
      group: "pomoce",
      summary: "Karty bingo na wesele, Wigilię, imieniny, majówkę, podróż autem i plażę, do skreślania na telefonie albo do druku.",
    },
    {
      href: "/zyczenia",
      label: "Życzenia od Instytutu",
      short: "Życzenia",
      group: "pomoce",
      summary: "Życzenia świąteczne i noworoczne w formie pisma urzędowego, z pieczęcią. Dla wujka, szwagra, szefa i od całej rodziny.",
      isNew: true,
    },
    {
      href: "/kolejka",
      label: "Pan tu nie stał!",
      short: "Kolejka",
      group: "pomoce",
      summary: "Symulator kolejki urzędowej. Broń miejsca, zarządzaj cierpliwością i zdąż przed zamknięciem. Kolejka dnia i protokół wyniku.",
      isNew: true,
    },
    {
      href: "/krol-grilla",
      label: "Król grilla",
      short: "Grill",
      group: "pomoce",
      summary: "90 sekund przy ruszcie. Obracaj kiełbasy w punkt, odpędzaj osy i nie oddawaj szczypiec. Gra zręcznościowa z protokołem wyniku.",
      isNew: true,
    },
    {
      href: "/kalendarz",
      label: "Kartka z kalendarza",
      short: "Kalendarz",
      group: "pomoce",
      summary: "Codziennie nowa kartka: wschód słońca, przysłowie, porada i patron dnia. Zrywać rano, najlepiej przy herbacie.",
      isNew: true,
    },
    {
      href: "/lanie-wosku",
      label: "Lanie wosku",
      short: "Wosk",
      group: "pomoce",
      summary: "Andrzejkowa wróżba Pracowni Wróżb: wosk przez ucho klucza, cień na ścianie i gatunek, w który przejdziesz w nowym roku.",
      isNew: true,
    },
  ],
  sl: [
    { href: "/okazje", label: "Vodniki za priložnosti", short: "Priložnosti", group: "zbiory", summary: "Sveti večer, svatba in prvomajski vikend: vrste, izjave, primeri Komisije in bingo za tisk.", isNew: true },
    { href: "/muzeum", label: "Muzej stvari", short: "Muzej", group: "zbiory", summary: "Stvari, ki bodo še prišle prav: šest predalov, kartice eksponatov in lastna zbirka.", isNew: true },
    { href: "/do-druku", label: "Gradivo za tisk", short: "Za tisk", group: "pomoce", summary: "Bingo za družinske priložnosti, kartice za določanje vrst in žepni vodnik na papirju A4.", isNew: true },
    {
      href: "/test",
      label: "Test dziadersa",
      short: "Test",
      group: "badania",
      summary: "Obdobni pregled v petih ordinacijah. Rezultat v odstotkih, diagnoza vrste, laboratorijski izvidi in certifikat.",
    },
    {
      href: "/test/przy-stole",
      label: "Pregled za mizo",
      short: "Za mizo",
      group: "badania",
      summary: "Test za vso mizo na enem telefonu: od dveh do osmih oseb, šest nalog na osebo, skupna lestvica in certifikat za vsakogar.",
      isNew: true,
    },
    {
      href: "/egzamin",
      label: "Terenski izpit",
      short: "Izpit",
      group: "badania",
      summary: "Dvanajst vprašanj iz določanja vrst: oglašanje, risbe, habitati. Ocena od nezadostne do odlične.",
      isNew: true,
    },
    {
      href: "/czy-to-juz-dziaderstwo",
      label: "Razsodna komisija",
      short: "Komisija",
      group: "badania",
      summary: "Je to že dziaderstvo? Primeri iz življenja, glasovi porotnikov in obrazložitev Komisije.",
      isNew: true,
    },
    {
      href: "/atlas",
      label: "Atlas dziadersov",
      short: "Atlas",
      group: "zbiory",
      summary: "Katalog vrst dziadersov, ki živijo na Poljskem: simptomi, habitati, naravni sovražniki in določevalni ključ.",
    },
    {
      href: "/slownik",
      label: "Dziaderski slovar",
      short: "Slovar",
      group: "zbiory",
      summary: "Besede, ki jih je vsak slišal za družinsko mizo: pomen, izgovorjava, primeri rabe in poljski izvirnik.",
    },
    {
      href: "/raporty",
      label: "Poročila Inštituta",
      short: "Poročila",
      group: "zbiory",
      summary: "Izsledki terenskih raziskav, sistematičnih pregledov in poskusov Inštituta.",
    },
    {
      href: "/biuletyn",
      label: "Tedenski bilten",
      short: "Bilten",
      group: "zbiory",
      summary: "Teden v številkah: pregledi, opazovanja, primer tedna in napoved. Vsak ponedeljek na strani, po prijavi tudi po e-pošti.",
      isNew: true,
    },
    {
      href: "/indeks",
      label: "Nacionalni indeks dziaderstva",
      short: "Indeks",
      group: "dane",
      summary: "Jakost dziaderstva na Poljskem, posodobljena vsako uro, z napovedjo za sveti večer.",
    },
    {
      href: "/spis",
      label: "Nacionalni popis dziadersov",
      short: "Popis",
      group: "dane",
      summary: "Rezultati vseh pregledov Inštituta v živo: vrste, križanci, najpogostejši odgovori in vojvodstva.",
    },
    {
      href: "/statystyki",
      label: "Mali statistični letopis",
      short: "Letopis",
      group: "dane",
      summary: "Vse, kar je Inštitut preštel: preglede, opazovanja, razsodbe, prečrtana polja v bingu in pritiske na hupo.",
      isNew: true,
    },
    {
      href: "/obserwacje",
      label: "Zemljevid opazovanj",
      short: "Zemljevid",
      group: "dane",
      summary: "Kje so videli dziadersa: prijave terenskih opazovalcev po vojvodstvih, ločeno po vrstah.",
      isNew: true,
    },
    {
      href: "/tablica-honorowa",
      label: "Častna tabla",
      short: "Tabla",
      group: "dane",
      summary: "Udarniki opazovanja, porotniki in trgalci koledarja. Primeri, ki so razdelili narod, in najbolje opazovane vrste.",
      isNew: true,
    },
    {
      href: "/superinteligencja",
      label: "Superinteligenca",
      short: "SI",
      group: "pomoce",
      summary: "SZWAGIER 1.9 TDI, jezikovni model Inštituta. Odgovori na vsako vprašanje, navede vire in nikoli ne spremeni mnenja.",
      isNew: true,
    },
    {
      href: "/generator",
      label: "Dziaderski pogovornik",
      short: "Pogovornik",
      group: "pomoce",
      summary: "Generator izjav za vsako priložnost: avto, prenova, dopust, restavracija, računalnik, vreme, nakupi in sosedovi otroci.",
    },
    {
      href: "/bingo",
      label: "Dziaders bingo",
      short: "Bingo",
      group: "pomoce",
      summary: "Bingo listki za svatbo, sveti večer, godovanje, prvomajski vikend, vožnjo z avtom in plažo, za prečrtavanje na telefonu ali za tisk.",
    },
    {
      href: "/zyczenia",
      label: "Voščila Inštituta",
      short: "Voščila",
      group: "pomoce",
      summary: "Praznična in novoletna voščila v obliki uradnega dopisa, s pečatom. Za strica, svaka, šefa in od vse družine.",
      isNew: true,
    },
    {
      href: "/kolejka",
      label: "Vi pa niste bili v vrsti!",
      short: "Vrsta",
      group: "pomoce",
      summary: "Simulator čakanja na uradu. Brani mesto, ohrani potrpežljivost in pridi na vrsto pred zaprtjem. Današnja vrsta in zapisnik rezultata.",
      isNew: true,
    },
    {
      href: "/krol-grilla",
      label: "Kralj žara",
      short: "Žar",
      group: "pomoce",
      summary: "90 sekund pri žaru. Obračaj klobase ob pravem času, odganjaj ose in ne predaj klešč. Spretnostna igra z zapisnikom rezultata.",
      isNew: true,
    },
    {
      href: "/kalendarz",
      label: "Trgalni koledar",
      short: "Koledar",
      group: "pomoce",
      summary: "Vsak dan nov list: sončni vzhod, pregovor, nasvet in zavetnik dneva. Trgati zjutraj, najbolje ob čaju.",
      isNew: true,
    },
    {
      href: "/lanie-wosku",
      label: "Vlivanje voska",
      short: "Vosek",
      group: "pomoce",
      summary: "Silvestrsko vedeževanje Laboratorija: vosek skozi ušesce ključa, senca na steni in vrsta, v katero se preleviš v novem letu.",
      isNew: true,
    },
  ],
});

export const sections = (locale: Locale) => SECTION_COPY[locale];

/** Pages outside the departments, for search and the bottom of the menu. */
const EXTRA_COPY = defineCopy<Pick<Department, "href" | "label" | "summary">[]>({
  pl: [
    { href: "/dziaders", label: "Dziaders — kto to jest?", summary: "Znaczenie słowa, zachowania i różnica między dziaderstwem a zwykłymi przyzwyczajeniami. Wprowadzenie do Instytutu." },
    { href: "/dziaders/boomer", label: "Boomer czy dziaders?", summary: "Kto to jest boomer, skąd „OK boomer”, odmiana i porównanie: boomer, dziaders, dziad, zgred. Czy dziaders to ageizm." },
    { href: "/kalendarz/swieta", label: "Kalendarz świąt nietypowych", summary: "Jakie dziś święto? Święta Instytutu miesiąc po miesiącu, z instrukcją obchodów i gatunkiem patronackim." },
    { href: "/slownik-mlodziezowy", label: "Słownik młodzieżowy dla dziadersów", summary: "Co znaczy 67, sigma, tuff, sybau, rizz i unc: zwykłe znaczenie, objaśnienie dla dziadersa i jego przewidywana reakcja." },
    { href: "/atlas/gatunki-pokrewne", label: "Gatunki pokrewne: Janusz, szwagier, wujek dobra rada", summary: "Janusz, szwagier, wujek dobra rada, majster, pan Areczek i sąsiad: co znaczą i czy to już dziaders." },
    { href: "/slowo-roku", label: "Dziaderskie Słowo Roku 2026", summary: "Plebiscyt Komisji Orzekającej: dwanaście zwrotów ze Słownika, głosowanie w grudniu i uchwała Komisji." },
    { href: "/profil", label: "Profil Dziaderski", summary: "Kartoteka badań, kolekcja gatunków, dziennik obserwacji, zakładki, odznaki i legitymacja obserwatora." },
    { href: "/szukaj", label: "Wyszukiwarka", summary: "Gatunki, hasła, sprawy, raporty i działy Instytutu w jednym miejscu." },
    { href: "/o-instytucie", label: "O Instytucie", summary: "Statut, historia, struktura organizacyjna i najczęstsze pytania." },
    { href: "/regulamin", label: "Regulamin", summary: "Zasady korzystania z serwisu, kont, obserwacji i Komisji Orzekającej." },
    { href: "/prywatnosc", label: "Polityka prywatności", summary: "Jakie dane zbiera Instytut, po co, jak długo je trzyma i jak je usunąć." },
  ],
  sl: [
    { href: "/dziaders", label: "Dziaders — kdo je to?", summary: "Pomen besede, vedenja in razlika med dziaderstvom in običajnimi navadami. Uvod v Inštitut." },
    { href: "/dziaders/boomer", label: "Boomer ali dziaders?", summary: "Kdo je boomer, od kod »OK boomer«, sklanjatev in primerjava: boomer, dziaders, dziad, zgred. Je dziaders starizem." },
    { href: "/kalendarz/swieta", label: "Koledar nenavadnih praznikov", summary: "Kaj praznujemo danes? Prazniki Inštituta mesec za mesecem, z navodili za praznovanje in zavetniško vrsto." },
    { href: "/slownik-mlodziezowy", label: "Mladinski slovar za dziaderse", summary: "Kaj pomenijo 67, sigma, tuff, sybau, rizz in unc: običajni pomen, pojasnilo za dziadersa in njegov predvideni odziv." },
    { href: "/atlas/gatunki-pokrewne", label: "Sorodne vrste: janusz, svak, stric dober nasvet", summary: "Janusz, svak, stric dober nasvet, mojster, gospod Areček in sosed: kaj pomenijo in ali je to že dziaders." },
    { href: "/slowo-roku", label: "Dziaderska beseda leta 2026", summary: "Izbor Razsodne komisije: dvanajst izrazov iz Slovarja, glasovanje decembra in sklep Komisije." },
    { href: "/profil", label: "Dziaderski profil", summary: "Kartoteka pregledov, zbirka vrst, dnevnik opazovanj, zaznamki, značke in opazovalska izkaznica." },
    { href: "/szukaj", label: "Iskalnik", summary: "Vrste, gesla, primeri, poročila in oddelki Inštituta na enem mestu." },
    { href: "/o-instytucie", label: "O Inštitutu", summary: "Statut, zgodovina, organizacijska struktura, pogosta vprašanja in beseda o slovenski izdaji." },
    { href: "/regulamin", label: "Pogoji uporabe", summary: "Pravila uporabe strani, računov, opazovanj in Razsodne komisije." },
    { href: "/prywatnosc", label: "Politika zasebnosti", summary: "Katere podatke zbira Inštitut, zakaj, kako dolgo jih hrani in kako jih izbrišeš." },
  ],
});

export const extraPages = (locale: Locale) => EXTRA_COPY[locale];
