import type { Locale } from "@/i18n/config";
import { overlayList } from "@/i18n/overlay";
import { DOSSIER_TEXT } from "./sl/dossiers";
import { DOSSIER_SLUGS } from "./sl/slugs/dossiers";
import type { SpeciesKey } from "./species";

export type Dossier = {
  slug: string;
  code: string;
  bingo: string;
  title: string;
  short: string;
  season: string;
  lead: string;
  introduction: string[];
  signals: string[];
  protocol: { title: string; text: string }[];
  packing: string[];
  species: SpeciesKey[];
  dictionary: string[];
  caseSlug: string;
  reportSlug?: string;
  /** Days of people (Dzień Dziadka…): the date, "MM-DD", and a card of wishes to give or share. */
  date?: string;
  card?: { title: string; wishes: string[] };
  notes?: string[];
};

/** Editorial guides; references keep their Polish keys in both editions. */
export const DOSSIERS: Dossier[] = [
  {
    slug: "wigilia",
    code: "IBD-O 01",
    bingo: "wigilia",
    title: "Wigilia z dziadersem",
    short: "Wigilia",
    season: "24 grudnia · stół rodzinny",
    lead: "Przewodnik terenowy po kolacji, podczas której temperatura w pokoju rośnie, a termostat pozostaje na dwójce. Objawy, wokalizacje i bingo wigilijne do druku.",
    introduction: [
      "Dziaders Wigilijny pojawia się przed pierwszą gwiazdką. Sprawdza, czy krzesła nie rysują podłogi, ustala kolejność potraw i przypomina, że w zeszłym roku ryba była tańsza. Nie trzeba go szukać. Sam obejmuje stanowisko.",
      "Obserwację prowadź przy własnym talerzu. Zapisuj wypowiedzi, nie nazwiska. Jedno zdanie o cenie karpia nie przesądza o rozpoznaniu; powtórzenie go po każdym daniu pozwala już wyznaczyć rytm aktywności.",
    ],
    signals: [
      "Pilot znika przed rozpoczęciem kolacji.",
      "Liczba potraw jest sprawdzana dwukrotnie.",
      "Cena karpia wraca w trzech różnych rozmowach.",
      "Każdy prezent wymaga odczytania instrukcji przez gospodarza.",
    ],
    protocol: [
      {
        title: "Przed pierwszą gwiazdką",
        text: "Rozdaj karty bingo i przygotuj długopisy. Ustal, że skreśla się zasłyszane zdania, a nie uczestników kolacji. Telefon odłóż ekranem do dołu.",
      },
      {
        title: "W trakcie kolacji",
        text: "Obserwuj bez podpowiadania haseł. Pytanie o zeszłoroczny rachunek za ogrzewanie jest ingerencją w środowisko, nie badaniem terenowym.",
      },
      {
        title: "Po kompotach",
        text: "Porównaj karty. Pięć pól w jednej linii oznacza bingo. Sporną wypowiedź skieruj do Komisji; rodzinne głosowanie można przeprowadzić po deserze.",
      },
    ],
    packing: [
      "Cztery różne karty na jednym arkuszu A4",
      "Długopis dla każdego obserwatora",
      "Atlas otwarty na gatunku wigilijnym",
      "Zapas cierpliwości bez daty ważności",
    ],
    species: ["wigilijny", "oszczednosciowy", "meteorologiczny"],
    dictionary: ["znowu-puszczaja-kevina", "umawialismy-sie-ze-bez-prezentow", "za-moich-czasow"],
    caseSlug: "prasowany-papier",
    reportSlug: "sezon-grzewczy",
  },
  {
    slug: "wesele",
    code: "IBD-O 02",
    bingo: "wesele",
    title: "Wesele z dziadersem",
    short: "Wesele",
    season: "Od rosołu do ostatniego utworu",
    lead: "Instrukcja obserwacji przy stole numer siedem. Jak rozpoznać gatunek weselny, co zanotować i kiedy rozdać bingo weselne.",
    introduction: [
      "Dziaders Weselny ocenia salę, zespół i koszt jednego talerza, zanim pojawi się rosół. Pierwszy taniec ogląda z pozycji eksperta. Sam tańczy dopiero po zgłoszeniu uwag do repertuaru.",
      "Najlepsze stanowisko obserwacyjne znajduje się przy stole. Na parkiecie trudniej sporządzać notatki, a wypowiedź o cenie sali może zostać zagłuszona przez saksofon. Materiał zbieraj między daniami.",
    ],
    signals: [
      "Koszt jednego talerza zostaje ustalony przed rosołem.",
      "Zespół otrzymuje instrukcje dotyczące normalnej muzyki.",
      "Droga do domu jest omawiana jeszcze przed tortem.",
      "Koperta ma własną historię rozliczeniową.",
    ],
    protocol: [
      {
        title: "Zajmij stanowisko",
        text: "Rozdaj karty osobom, które chcą grać. Na każdym stole może działać osobny zespół obserwacyjny. Nie blokuj miejsca dla kelnera.",
      },
      {
        title: "Notuj między daniami",
        text: "Skreślaj sens wypowiedzi, nie wymagaj cytatu słowo w słowo. Wykład o dojeździe i wykład o cenach paliwa to dwa zjawiska, nawet jeśli nie było między nimi pauzy.",
      },
      {
        title: "Zamknij protokół",
        text: "Bingo ogłoś przy własnym stole. Mikrofon zespołu pozostaje poza wyposażeniem badawczym. Wyniki porównaj przed wyjazdem, gdy wszyscy jeszcze pamiętają, kto mówił.",
      },
    ],
    packing: [
      "Karty bingo weselnego",
      "Długopis, który pisze",
      "Numer własnego stołu",
      "Buty umożliwiające zmianę stanowiska",
    ],
    species: ["weselny", "moto", "korpo"],
    dictionary: ["pusc-pan-cos-normalnego", "ile-pan-za-to-dal", "za-moich-czasow"],
    caseSlug: "zeszyt-weselny",
  },
  {
    slug: "majowka",
    code: "IBD-O 03",
    bingo: "majowka",
    title: "Majówka z dziadersem",
    short: "Majówka",
    season: "Długi weekend · działka i grill",
    lead: "Przewodnik po stanowisku grillowym. Rozpoznawanie gatunków, bezpieczny dystans od szczypiec i bingo na majówkę do wydrukowania.",
    introduction: [
      "Majówka skupia trzy silne populacje: grillową, działkową i meteorologiczną. Wszystkie wiedzą, jak rozpalić. Żadna nie odpowiada za deszcz. Stanowisko dowodzenia rozpoznasz po człowieku, który nie oddaje szczypiec.",
      "Badanie rozpocznij przed rozłożeniem leżaka. Później pole widzenia zasłania dym, a zdania o karkówce stają się częścią tła. Nie poprawiaj sposobu rozpalania tylko po to, żeby uzyskać reakcję.",
    ],
    signals: [
      "Szczypce mają jednego użytkownika.",
      "Prognoza pogody jest odświeżana częściej niż ruszt.",
      "Cudza kosiarka zakłóca ciszę, własna wykonuje pracę.",
      "Każda porcja karkówki musi swoje odstać.",
    ],
    protocol: [
      {
        title: "Wyznacz teren",
        text: "Wybierz stolik poza dymem. Karty i długopisy rozdaj przed jedzeniem. Talerz nie służy do przytrzymywania protokołu.",
      },
      {
        title: "Zachowaj dystans",
        text: "Szczypce są narzędziem i insygnium. Obserwuj przekazanie, ale nie inicjuj go. Spór o węgiel zanotuj bez dokładania własnej teorii.",
      },
      {
        title: "Porównaj obserwacje",
        text: "Pięć pól w linii kończy rundę. Kartę można nadal uzupełniać. Po powrocie sprawdź w Atlasie, czy oglądałeś jeden gatunek, czy zespół mieszany.",
      },
    ],
    packing: [
      "Bingo na majówkę",
      "Podkładka pod arkusz",
      "Nakrycie głowy",
      "Własna opinia o musztardzie, zachowana dla siebie",
    ],
    species: ["grill", "dzialka", "meteorologiczny"],
    dictionary: ["nie-tak-sie-rozpala", "karkowka-musi-swoje-odstac", "swoje-bez-chemii"],
    caseSlug: "mycie-w-sobote",
    reportSlug: "sandal-a-skarpeta",
  },  {
    slug: "dzien-dziadka",
    code: "IBD-O 04",
    bingo: "imieniny",
    date: "01-22",
    title: "Dzień Dziadka z dziadersem",
    short: "Dzień Dziadka",
    season: "22 stycznia · wizyta u dziadków",
    lead: "Przewodnik na 22 stycznia: jak odróżnić dziadka od dziadersa, co usłyszysz przy cieście, jak przetrwać pożegnanie w przedpokoju i co napisać na kartce na Dzień Dziadka.",
    introduction: [
      "Dzień Dziadka wypada 22 stycznia, dzień po Dniu Babci, i zwykle obchodzi się oba naraz: przy jednym cieście, w jednym pokoju, przy jednym telewizorze. Dziadek nie jest z urzędu dziadersem. Pokrewieństwo i wiek nie przesądzają o rozpoznaniu.",
      "Rozpoznanie przesądza to, co dzieje się po pierwszym kawałku sernika: czy dziadek pyta, co u ciebie, czy od razu wyjaśnia, jak było u niego. Obserwację prowadź życzliwie. To jedyny obiekt badań Instytutu, który może dać ci dwadzieścia złotych na drogę.",
    ],
    signals: [
      "Laurka jest oglądana pod światło i odkładana do segregatora.",
      "Pytanie o szkołę pada przed pytaniem o samopoczucie.",
      "Pilot leży po stronie dziadka i tam zostaje.",
      "Wnuk dostaje do ręki telefon dziadka z prośbą o większą czcionkę.",
    ],
    protocol: [
      {
        title: "Przed wizytą",
        text: "Ustal z rodzeństwem, kto przynosi ciasto, a kto kwiaty. Zaplanuj dojazd tak, żeby dziadek nie musiał tłumaczyć, którędy byłoby szybciej.",
      },
      {
        title: "Przy stole",
        text: "Zadaj jedno pytanie o dawne czasy i wysłuchaj odpowiedzi do końca. To nie jest badanie terenowe, tylko prezent. Bingo rozdaj dopiero po herbacie.",
      },
      {
        title: "Przy pożegnaniu",
        text: "Pożegnanie w przedpokoju trwa godzinę; wpisz je do harmonogramu. Banknot „na drogę” przyjmij bez dyskusji. Dyskusja przedłuża pożegnanie o kolejne pół godziny.",
      },
    ],
    packing: [
      "Kartka na Dzień Dziadka, podpisana ręcznie",
      "Ciasto, które dziadek pochwali, porównując je z innym",
      "Ładowarka do jego telefonu",
      "Bingo imieninowe, bo zasady są te same",
    ],
    card: {
      title: "Kartka na Dzień Dziadka",
      wishes: [
        "Dziadku, z okazji Twojego święta życzymy zdrowia, cierpliwości do naszych telefonów i zim takich jak dawniej, ale tylko w opowieściach.",
        "Najlepszemu dziadkowi: niech pilot zawsze leży tam, gdzie go zostawiłeś, a działka rodzi więcej, niż zdążysz rozdać sąsiadom.",
        "Dziadku, dziękujemy za każdą radę, także tę, o którą nie prosiliśmy. Większość okazała się słuszna, ale nie mów nikomu.",
      ],
    },
    species: ["dzialka", "meteorologiczny", "facebook"],
    dictionary: ["za-moich-czasow", "wnuczek-mi-to-ustawil", "kiedys-to-byly-zimy"],
    caseSlug: "duza-czcionka",
    reportSlug: "pilot-od-telewizora",
  },
  {
    slug: "dzien-tesciowej",
    code: "IBD-O 05",
    bingo: "imieniny",
    date: "03-05",
    title: "Dzień Teściowej z dziadersem",
    short: "Dzień Teściowej",
    season: "5 marca · obiad u teściów",
    lead: "Instrukcja przetrwania obiadu 5 marca: sygnały, protokół, typowe wypowiedzi i kartka na Dzień Teściowej, którą da się wręczyć bez ryzyka.",
    introduction: [
      "Dzień Teściowej obchodzi się w Polsce 5 marca. Teściowa nie jest gatunkiem, tylko stanowiskiem: obejmuje się je w dniu ślubu dziecka i sprawuje dożywotnio. Dziaderstwo jest na tym stanowisku nieobowiązkowe, choć Instytut odnotowuje je częściej niż w kadrze kierowniczej.",
      "Terenem badań jest zwykle kuchnia teściów, w której wszystko ma swoje miejsce, w tym goście. Obserwację prowadź z krzesła wskazanego przez gospodynię. Propozycja pomocy przy zmywaniu jest dopuszczalna, ale zostanie odrzucona, więc składaj ją raz.",
    ],
    signals: [
      "„Jedz, jedz” pada przed pierwszym kęsem.",
      "Rosół jest porównywany z rosołem podawanym w twoim domu.",
      "Słoiki na drogę są przygotowane, zanim zapytasz.",
      "Pytanie o wnuki pada w formie zdania oznajmującego.",
    ],
    protocol: [
      {
        title: "Przed obiadem",
        text: "Kwiaty kup w kwiaciarni, nie na stacji benzynowej. Teściowa rozpoznaje różnicę. Przyjdź punktualnie albo pięć minut wcześniej; dziesięć minut wcześniej to już kontrola.",
      },
      {
        title: "Przy stole",
        text: "Chwal konkretnie: farsz, ciasto, sposób krojenia. Ogólne „pyszne” zostanie uznane za uprzejmość. Na pytania o remont i plany na lato odpowiadaj krótko i w czasie przeszłym.",
      },
      {
        title: "Po obiedzie",
        text: "Słoiki przyjmij wszystkie. Zwrot pustych słoików jest częścią umowy i odbywa się przy następnej wizycie, po umyciu.",
      },
    ],
    packing: [
      "Kwiaty z kwiaciarni, z paragonem w kieszeni",
      "Kartka na Dzień Teściowej",
      "Torba na słoiki",
      "Gotowa odpowiedź na pytanie o wnuki",
    ],
    card: {
      title: "Kartka na Dzień Teściowej",
      wishes: [
        "Droga Mamo, z okazji Dnia Teściowej życzymy zdrowia, spokoju i słoików, które zawsze wracają. Dziękujemy za syna i za rosół; o kolejność nie będziemy się spierać.",
        "Najlepszej teściowej: żeby goście przychodzili na czas, wnuki dzwoniły same, a my w końcu nauczyli się kroić tak, jak należy.",
        "Mamo, dziękujemy za każdą radę. Część wdrożyliśmy, resztę zachowujemy na później. To się jeszcze przyda.",
      ],
    },
    species: ["wigilijny", "oszczednosciowy", "dzialka"],
    dictionary: ["nie-ruszaj-mam-to-poustawiane", "dobrze-karmili", "umawialismy-sie-ze-bez-prezentow"],
    caseSlug: "kto-mowi",
  },
  {
    slug: "dzien-mezczyzn",
    code: "IBD-O 06",
    bingo: "imieniny",
    date: "03-10",
    title: "Dzień Mężczyzn z dziadersem",
    short: "Dzień Mężczyzn",
    season: "10 marca · biuro i dom",
    lead: "Przewodnik na 10 marca: skarpety, czekolada i mężczyźni, którym nic nie trzeba. Sygnały, protokół obserwacji i kartka na Dzień Mężczyzn.",
    introduction: [
      "Dzień Mężczyzn obchodzi się w Polsce 10 marca, dwa dni po Dniu Kobiet, który w niejednym biurze wyznacza poziom rewanżu. Obchody są skromne: skarpety, czekolada, czasem zestaw kosmetyków w pudełku w kształcie samochodu.",
      "Terenem badań jest biuro albo dom. W obu Dziaders Korporacyjny i jego domowy odpowiednik reagują na życzenia tak samo: „A po co to, mnie nic nie trzeba”. Zapisz tę formułę, a potem zaobserwuj, jak skarpety trafiają do szuflady z wyraźną satysfakcją.",
    ],
    signals: [
      "„Mnie nic nie trzeba” pada przed rozpakowaniem prezentu.",
      "Prezent jest oceniany według ceny, a nie koloru.",
      "Kwiatek dla mężczyzny wywołuje pytanie, gdzie go postawić.",
      "Ktoś przypomina, że Dzień Kobiet ma dłuższą tradycję i lepszy budżet.",
    ],
    protocol: [
      {
        title: "Przygotuj prezent",
        text: "Wybierz rzecz użyteczną. Skarpety są dopuszczalne, jeśli mają wzmocnioną piętę; o tym, że ją mają, obdarowany powie sam.",
      },
      {
        title: "Złóż życzenia",
        text: "Krótko i bez słowa „wiek”. Życzenia zdrowia są przyjmowane, życzenia „żebyś w końcu odpoczął” uznaje się za sugestię.",
      },
      {
        title: "Zanotuj reakcję",
        text: "Skala reakcji: od „po co to” przez „no, przyda się” do „dobre, bo niemieckie”. Druga i trzecia oznaczają sukces.",
      },
    ],
    packing: [
      "Skarpety ze wzmocnioną piętą",
      "Kartka na Dzień Mężczyzn",
      "Czekolada, nie z przeceny",
      "Bingo imieninowe na wypadek przyjęcia w domu",
    ],
    card: {
      title: "Kartka na Dzień Mężczyzn",
      wishes: [
        "Z okazji Dnia Mężczyzn życzymy zdrowia, sił i sprzętów, przy których nie trzeba czytać instrukcji, bo działają od razu.",
        "Wszystkiego najlepszego: niech kable rozruchowe zawsze wracają od szwagra, a wiertarka od sąsiada.",
        "Życzymy, żeby wszystko, czego nie potrzebujesz, okazało się jednak przydatne. Skarpety w załączeniu.",
      ],
    },
    species: ["korpo", "budowa", "moto"],
    dictionary: ["ja-nie-potrzebuje-instrukcji", "kto-panu-to-tak-zrobil", "oryginal-niemiecki"],
    caseSlug: "kubek-szefa",
  },
  {
    slug: "dzien-ojca",
    code: "IBD-O 07",
    bingo: "majowka",
    date: "06-23",
    title: "Dzień Ojca z dziadersem",
    short: "Dzień Ojca",
    season: "23 czerwca · grill i laurka",
    lead: "Przewodnik na 23 czerwca: tata, grill i prezent, którego „nie trzeba było”. Sygnały, protokół obserwacji, bingo grillowe i kartka na Dzień Ojca.",
    introduction: [
      "Dzień Ojca przypada w Polsce 23 czerwca, na początku sezonu grillowego i wakacji. W wielu domach obchodzi się go przy ruszcie, co ułatwia obserwację: ojciec stoi w jednym miejscu, trzyma szczypce i chętnie zabiera głos.",
      "Ojciec nie jest z urzędu dziadersem. Tego dnia Instytut prosi o odróżnianie rad udzielanych z troski od rad udzielanych z przyzwyczajenia. Pierwsze zapisz w zeszycie, drugie odhacz w bingo. Bywa, że to te same rady.",
    ],
    signals: [
      "Prezent jest otwierany ostrożnie, żeby papier się jeszcze przydał.",
      "„Po co wydawaliście” pada razem z uśmiechem.",
      "Szczypce nie są przekazywane nawet w dniu święta.",
      "Pytanie o samochód dziecka kończy się oględzinami samochodu.",
    ],
    protocol: [
      {
        title: "Rano",
        text: "Złóż życzenia przed pierwszym telefonem do warsztatu albo do sąsiada. Później ojciec jest zajęty.",
      },
      {
        title: "Przy grillu",
        text: "Nie poprawiaj rozpalania. Zapytaj za to o metodę i wysłuchaj odpowiedzi. To najcenniejszy prezent dla ojca, także dziadersa, i kosztuje dwadzieścia minut.",
      },
      {
        title: "Wieczorem",
        text: "Policz pola w bingo, ale wyniku nie ogłaszaj. Dzień Ojca to jedyny dzień w roku, w którym ostatnie słowo należy do niego oficjalnie.",
      },
    ],
    packing: [
      "Kartka na Dzień Ojca",
      "Prezent, „którego nie trzeba było”",
      "Bingo majówkowe, ważne do końca sezonu grillowego",
      "Dwadzieścia minut na wysłuchanie metody rozpalania",
    ],
    card: {
      title: "Kartka na Dzień Ojca",
      wishes: [
        "Tato, z okazji Twojego święta życzymy zdrowia, tras bez korków i grilla, który rozpala się za pierwszym razem. Twoją metodą.",
        "Najlepszemu tacie: dziękujemy za rady, jazdy próbne po parkingu i światło gaszone za nami od dwudziestu lat. Prąd nie jest za darmo, wiemy.",
        "Tato, życzymy, żeby wszystko, co „zaraz naprawisz”, naprawiło się samo. Resztą zajmiemy się razem.",
      ],
    },
    species: ["grill", "moto", "budowa"],
    dictionary: ["nie-tak-sie-rozpala", "zgas-swiatlo-prad-nie-jest-za-darmo", "a-ile-pali"],
    caseSlug: "zegar-w-samochodzie",
    reportSlug: "zaraz-to-naprawie",
  },
  {
    slug: "dzien-chlopaka",
    code: "IBD-O 08",
    bingo: "imieniny",
    date: "09-30",
    title: "Dzień Chłopaka z dziadersem",
    short: "Dzień Chłopaka",
    season: "30 września · szkoła i randka",
    lead: "Przewodnik na 30 września: młody dziaders w naturalnym środowisku. Sygnały, protokół obserwacji i kartka na Dzień Chłopaka do wręczenia bez ryzyka.",
    introduction: [
      "Dzień Chłopaka obchodzi się w Polsce 30 września: w szkołach, gdzie dziewczyny z klasy przygotowują drobne prezenty, i w związkach, gdzie prezent jest drobny, ale zapamiętany. To dobry dzień, żeby przypomnieć, że dziaderstwo nie ma wieku.",
      "Młody dziaders ma dwadzieścia lat, a już wie, jak powinno się parkować, grać w piłkę i ustawiać router. Rozpoznasz go po tym, że prezent komentuje wykładem o lepszym modelu. Obserwację prowadź z sympatią: to okaz we wczesnym stadium i wiele jeszcze może się zmienić.",
    ],
    signals: [
      "Prezent jest porównywany z lepszym modelem z internetu.",
      "Mecz w telewizji ma pierwszeństwo przed kolacją.",
      "Wyjaśnienie spalonego zostaje udzielone bez prośby.",
      "„Ja bym to zrobił inaczej” pada przed „dziękuję”.",
    ],
    protocol: [
      {
        title: "Wybierz prezent",
        text: "Coś do hobby, nie do domu. Narzędzie do domu zostanie przyjęte jako sugestia, a sugestie młody dziaders rozpatruje do Dnia Mężczyzn.",
      },
      {
        title: "Wręcz go",
        text: "W przerwie meczu albo po nim. Wręczenie w trakcie akcji jest dopuszczalne wyłącznie wtedy, gdy jego drużyna prowadzi.",
      },
      {
        title: "Zanotuj reakcję",
        text: "Jeśli po rozpakowaniu pada pytanie o cenę, zanotuj objaw. Jeśli pada „dziękuję” bez komentarza, okaz dobrze rokuje.",
      },
    ],
    packing: [
      "Kartka na Dzień Chłopaka",
      "Prezent do hobby, nie do domu",
      "Terminarz meczów na ten wieczór",
      "Bingo imieninowe na wypadek kolacji z rodziną",
    ],
    card: {
      title: "Kartka na Dzień Chłopaka",
      wishes: [
        "Z okazji Dnia Chłopaka życzymy, żeby Twoja drużyna wygrywała, sędziowie widzieli to co Ty, a router działał bez Twojej pomocy.",
        "Wszystkiego najlepszego: niech każda rada, której udzielasz, trafia do kogoś, kto o nią prosił.",
        "Zostań sobą, tylko bez „za moich czasów”. Na to masz jeszcze czterdzieści lat.",
      ],
    },
    species: ["kibicowski", "facebook", "smart"],
    dictionary: ["sedzia-kalosz", "ja-bym-to-strzelil", "ile-pan-za-to-dal"],
    caseSlug: "mecz-z-radiem",
  },
];

const EDITIONS = {
  pl: DOSSIERS,
  sl: overlayList("dossiers", DOSSIERS, (item) => item.slug, DOSSIER_TEXT).map((item) => ({
    ...item,
    slug: DOSSIER_SLUGS[item.slug],
  })),
};
export const getDossiers = (locale: Locale) => EDITIONS[locale];
export const dossierBySlug = (slug: string, locale: Locale) => getDossiers(locale).find((item) => item.slug === slug);
