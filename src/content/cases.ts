import type { Locale } from "@/i18n/config";
import { overlay, overlayList } from "@/i18n/overlay";
import * as sl from "./sl/cases";
import { CASE_SLUGS } from "./sl/slugs/cases";
import type { SpeciesKey } from "./species";

/*
 * Komisja Orzekająca: "Czy to już dziaderstwo?". The Institute publishes a case, visitors vote
 * as lay judges (ławnicy), and the Commission's own opinion is revealed after the vote.
 *
 * Cases are curated here, never user-submitted text published as is. Slugs and numbers are
 * stable: never change or reuse them. Add new cases at the end with the next number.
 */

export type Verdict = "nie" | "tak" | "kliniczne";

export const VERDICTS: { key: Verdict; label: string; short: string }[] = [
  { key: "nie", label: "To jeszcze nie dziaderstwo", short: "Nie" },
  { key: "tak", label: "To już dziaderstwo", short: "Tak" },
  { key: "kliniczne", label: "Dziaderstwo kliniczne", short: "Kliniczne" },
];

export type CaseCategory = "dom" | "samochod" | "rodzina" | "praca" | "technologia" | "wakacje" | "zakupy" | "sasiedzi";

export const CASE_CATEGORIES: Record<CaseCategory, string> = {
  dom: "Dom i ogród",
  samochod: "Samochód",
  rodzina: "Rodzina i święta",
  praca: "Praca",
  technologia: "Technologia",
  wakacje: "Wakacje",
  zakupy: "Zakupy i pieniądze",
  sasiedzi: "Sąsiedzi i osiedle",
};

export type Case = {
  /** URL segment. Stable: never change it once published. */
  slug: string;
  /** Docket number: case 7 is "IBD-K 7/26". Consecutive, in order of publication. */
  number: number;
  /** The case in a few words, sentence case, no full stop: "Klucze w zamku, żeby nie zgubić". */
  title: string;
  category: CaseCategory;
  /** Stan faktyczny: two or three plain sentences in the third person, as in a court file. */
  facts: string;
  /** What the party said in its defence: one quote, without quotation marks. */
  defence: string;
  /** The Commission's justification, revealed after the vote: one to three sentences, deadpan. */
  opinion: string;
  /** The Commission's own verdict. */
  expert: Verdict;
  species?: SpeciesKey[];
};

export const CASES: Case[] = [
  {
    slug: "klucze-w-zamku",
    number: 1,
    title: "Klucze w zamku, żeby nie zgubić",
    category: "dom",
    facts:
      "Uczestnik zostawia klucze w zamku drzwi wejściowych od wewnątrz, przez całą dobę. Domownicy wracający z pracy nie mogą otworzyć drzwi swoimi kluczami i dzwonią. Uczestnik otwiera po trzecim dzwonku.",
    defence: "Jak są w zamku, to wiem, gdzie są.",
    opinion:
      "Komisja uznaje, że system jest skuteczny: od 1994 roku klucze nie zginęły ani razu. Zginął za to dostęp do mieszkania dla pozostałych domowników, co Komisja kwalifikuje jako skutek uboczny, typowy dla dziaderstwa.",
    expert: "tak",
    species: ["oszczednosciowy", "smart"],
  },
  {
    slug: "kartony-po-sprzetach",
    number: 2,
    title: "Kartony po sprzętach na przeprowadzkę",
    category: "dom",
    facts:
      "Uczestnik przechowuje w piwnicy oryginalne kartony po wszystkich sprzętach kupionych od 1993 roku, razem ze styropianem i woreczkami. Kartony mają posłużyć przy przeprowadzce. Uczestnik mieszka w tym samym mieszkaniu od 1988 roku i nie zamierza się przeprowadzać.",
    defence: "A jak przyjdzie przeprowadzka, to w co spakuję mikrofalówkę?",
    opinion:
      "Komisja ustaliła, że z 41 kartonów tylko 9 ma jeszcze w domu swój sprzęt. Przeprowadzka Uczestnika polegałaby więc głównie na przewiezieniu pustych kartonów z jednej piwnicy do drugiej, na co Uczestnik jest przygotowany wzorowo.",
    expert: "tak",
    species: ["oszczednosciowy"],
  },
  {
    slug: "halo-w-wiadomosci",
    number: 3,
    title: "Wiadomość głosowa zaczynająca się od „Halo?”",
    category: "technologia",
    facts:
      "Uczestnik nagrywa wiadomości głosowe, które zaczynają się od „Halo?” i kilkusekundowej przerwy na odpowiedź. Przeciętna wiadomość trwa 2 minuty i 40 sekund, z czego 20 sekund zajmuje czekanie, aż ktoś się odezwie.",
    defence: "No a skąd mam wiedzieć, czy ktoś tam słucha?",
    opinion:
      "Komisja przypomina, że wiadomość głosowa nie jest rozmową telefoniczną. Uczestnik prowadzi ją jednak jak rozmowę, łącznie z pytaniem „Słychać mnie?” i pożegnaniem „Dobra, kończę, bo to pewnie kosztuje”.",
    expert: "tak",
    species: ["smart"],
  },
  {
    slug: "recznik-na-lezaku",
    number: 4,
    title: "Ręcznik na leżaku o 6:00",
    category: "wakacje",
    facts:
      "Uczestnik rezerwuje leżaki przy hotelowym basenie o 6:00, rozkładając na nich ręczniki. Następnie wyjeżdża na całodniową wycieczkę fakultatywną. Leżaki pozostają zajęte do 18:00, kiedy Uczestnik wraca i zabiera ręczniki.",
    defence: "Leżak jest mój, czy na nim leżę, czy nie leżę.",
    opinion:
      "Komisja ustaliła, że w ciągu tygodniowego pobytu ręcznik Uczestnika spędził na leżaku 61 godzin w pełnym słońcu, a sam Uczestnik 4. Ręcznik wrócił do kraju wyraźnie wypoczęty.",
    expert: "kliniczne",
    species: ["wakacje"],
  },
  {
    slug: "stek-za-drogi",
    number: 5,
    title: "Uwaga do kelnera, że stek jest za drogi",
    category: "zakupy",
    facts:
      "Uczestnik zamawia w restauracji stek, zjada go w całości, a przy płaceniu informuje kelnera, że stek jest za drogi. Kelner nie ma wpływu na ceny w restauracji. Uczestnik przekazuje tę uwagę od 2016 roku, przy każdym zamówionym steku.",
    defence: "Ja mu tylko mówię. Niech przekaże dalej.",
    opinion:
      "Komisja zauważa, że reklamacja złożona po zjedzeniu jej przedmiotu ma ograniczoną moc dowodową. Uczestnik nie żąda jednak obniżki ceny ani zmiany karty. Chce tylko, żeby ktoś wiedział.",
    expert: "tak",
    species: ["oszczednosciowy"],
  },
  {
    slug: "mecz-z-radiem",
    number: 6,
    title: "Mecz w telewizji, komentarz z radia",
    category: "rodzina",
    facts:
      "Uczestnik ogląda mecze reprezentacji przy wyciszonym telewizorze, słuchając komentarza w radiu. Radio wyprzedza obraz mniej więcej o cztery sekundy, dlatego Uczestnik cieszy się z każdego gola wcześniej niż domownicy, którzy oglądają mecz w tym samym pokoju.",
    defence: "W telewizji gadają, a w radiu komentują.",
    opinion:
      "Komisja nie dopatrzyła się dziaderstwa. Uczestnik korzysta w dobrej wierze z różnicy w opóźnieniu sygnału, o której nie wie większość widzów. Okrzyk „gol” cztery sekundy przed bramką Komisja kwalifikuje jako ujawnienie treści przed emisją, a takie sprawy nie należą do jej właściwości.",
    expert: "nie",
    species: ["kibicowski"],
  },
  {
    slug: "mycie-w-sobote",
    number: 7,
    title: "Mycie czystego samochodu w sobotę o 7:00",
    category: "samochod",
    facts:
      "Uczestnik myje samochód w każdą sobotę o 7:00, ręcznie, przy użyciu dwóch wiader, gąbki i irchy. Mycie trwa półtorej godziny. Samochód jest przed myciem czysty, ponieważ był myty w poprzednią sobotę.",
    defence: "Jak się myje co tydzień, to się nie brudzi.",
    opinion:
      "Komisja ustaliła, że samochód przejeżdża w tygodniu średnio 23 kilometry, głównie do sklepu i z powrotem. Sąsiedzi od lat rozpoznają sobotę po dźwięku wiadra stawianego na asfalcie o 6:58. Komisja kwalifikuje to jako dziaderstwo, choć wyjątkowo zadbane.",
    expert: "tak",
    species: ["moto"],
  },
  {
    slug: "kontrola-segregacji",
    number: 8,
    title: "Kontrola segregacji śmieci u sąsiadów",
    category: "sasiedzi",
    facts:
      "Uczestnik codziennie sprawdza pojemniki na odpady segregowane przy bloku i wyjmuje z nich to, co zostało źle posegregowane. Wyjęte odpady odnosi pod drzwi mieszkań, z których jego zdaniem pochodzą.",
    defence: "Ja nic nie wyrzucam. Ja tylko oddaję, co czyje.",
    opinion:
      "Komisja ustaliła, że Uczestnik rozpoznaje po zawartości worka 23 z 24 gospodarstw domowych w bloku. Nie rozpoznaje własnego: w maju odniósł sąsiadowi z parteru słoik z niezdjętą zakrętką, który sam wyrzucił do szkła.",
    expert: "kliniczne",
    species: ["parapetowy", "oszczednosciowy"],
  },
  {
    slug: "biuro-o-6-40",
    number: 9,
    title: "W biurze o 6:40, choć praca od 9:00",
    category: "praca",
    facts:
      "Uczestnik przychodzi do biura codziennie o 6:40, choć godziny pracy w firmie zaczynają się o 9:00. Między 6:40 a 9:00 parzy kawę, czyta wiadomości i ustawia żaluzje na całym piętrze. Nadgodzin nie zgłasza.",
    defence: "Rano jest cicho, nikt nie dzwoni i ekspres jest jeszcze czysty.",
    opinion:
      "Komisja ustaliła, że Uczestnik przez pierwsze dwie godziny i dwadzieścia minut pracuje w pustym biurze, a przez kolejne osiem opowiada, o której przyszedł. Ustawienie żaluzji jest codziennie korygowane przez współpracowników o 9:05, a przez Uczestnika o 6:41 następnego dnia.",
    expert: "tak",
    species: ["korpo"],
  },
  {
    slug: "duza-czcionka",
    number: 10,
    title: "Największa czcionka w telefonie",
    category: "technologia",
    facts:
      "Uczestnik ma w telefonie ustawioną największą dostępną czcionkę. Na ekranie mieszczą się jednocześnie cztery słowa, a wiadomość „Dzień dobry, co słychać?” trzeba przewijać. Godzina na ekranie blokady zajmuje pół telefonu.",
    defence: "A po co mam się męczyć, jak mogę się nie męczyć?",
    opinion:
      "Komisja nie dopatrzyła się dziaderstwa. Uczestnik dostosował urządzenie do siebie, a nie siebie do urządzenia, co w świetle dotychczasowych orzeczeń jest postawą rzadką. Komisja odnotowuje jedynie, że cały autobus wie już o imieninach szwagra i o tym, że trzeba kupić chrzan.",
    expert: "nie",
    species: ["smart"],
  },
  {
    slug: "zeszyt-weselny",
    number: 11,
    title: "Zeszyt weselny z kosztem jednego dania",
    category: "rodzina",
    facts:
      "Uczestnik od 1991 roku prowadzi zeszyt, w którym przy każdym weselu zapisuje kwotę włożoną do koperty i liczbę podanych ciepłych dań. Na tej podstawie wylicza koszt jednego dania. Wynik ogłasza rodzinie w drodze powrotnej z wesela.",
    defence: "Ja nikogo nie oceniam. Ja tylko liczę.",
    opinion:
      "Komisja ustaliła, że zeszyt obejmuje 64 wesela, a najlepszy wynik od trzydziestu lat należy do wesela kuzyna z 1996 roku: 4,10 zł za danie. Uczestnik nie uwzględnia inflacji, dlatego każde kolejne wesele w rodzinie wypada gorzej niż poprzednie.",
    expert: "kliniczne",
    species: ["weselny"],
  },
  {
    slug: "wstawanie-w-samolocie",
    number: 12,
    title: "Wstawanie, zanim samolot się zatrzyma",
    category: "wakacje",
    facts:
      "Uczestnik odpina pas i wstaje z miejsca zaraz po przyziemieniu samolotu. Zdejmuje bagaż z półki, wkłada kurtkę i do otwarcia drzwi stoi w przejściu, pochylony pod schowkiem. Trwa to średnio 14 minut.",
    defence: "Kto pierwszy wstanie, ten pierwszy wyjdzie.",
    opinion:
      "Komisja ustaliła, że Uczestnik opuszcza samolot jako 63. pasażer, czyli dokładnie wtedy, kiedy opuściłby go, gdyby do otwarcia drzwi siedział. Następnie czeka 9 minut na autobus, którym do terminalu jadą wszyscy pasażerowie naraz.",
    expert: "tak",
    species: ["wakacje", "kolejkowy"],
  },
  {
    slug: "reklamowki-w-kieszeni",
    number: 13,
    title: "Trzy reklamówki w kieszeni i nowa przy kasie",
    category: "zakupy",
    facts:
      "Uczestnik nosi w kieszeni kurtki trzy złożone reklamówki, na wypadek zakupów. Przy kasie kupuje jednak nową, a tamtych nie wyjmuje. Po powrocie nowa reklamówka trafia do reklamówki z reklamówkami pod zlewem.",
    defence: "Tamte są dobre, szkoda ich na zakupy.",
    opinion:
      "Komisja ustaliła, że zasób pod zlewem rośnie o jedną reklamówkę tygodniowo i liczy obecnie 412 sztuk. Trzy reklamówki noszone w kieszeni odbyły od 2016 roku około 1300 wyjść do sklepu i ani razu nie zostały rozwinięte.",
    expert: "tak",
    species: ["oszczednosciowy"],
  },
  {
    slug: "folia-na-fotelach",
    number: 14,
    title: "Folia fabryczna na fotelach od 2017 roku",
    category: "samochod",
    facts:
      "Uczestnik nie zdjął fabrycznej folii z foteli, kierownicy i dźwigni zmiany biegów samochodu kupionego w 2017 roku. Folia szeleści przy każdym ruchu, a latem pasażerowie przyklejają się do siedzeń. Samochód ma 180 tysięcy kilometrów przebiegu.",
    defence: "Zdejmę, jak będę sprzedawał. Wtedy będzie jak nowy.",
    opinion:
      "Komisja ustaliła, że Uczestnik od dziewięciu lat jeździ samochodem, którego wnętrza nikt jeszcze nie dotknął, łącznie z nim samym. Folia na kierownicy przetarła się w miejscach, w których Uczestnik ją trzyma, dlatego okleił kierownicę nową folią.",
    expert: "kliniczne",
    species: ["moto", "oszczednosciowy"],
  },
  {
    slug: "segregator-instrukcji",
    number: 15,
    title: "Segregator z instrukcjami obsługi",
    category: "dom",
    facts:
      "Uczestnik przechowuje instrukcje obsługi wszystkich domowych urządzeń w segregatorze, w koszulkach, z alfabetycznym spisem treści. Najstarsza dotyczy pralki wirnikowej z 1986 roku. Uczestnik nie przeczytał żadnej.",
    defence: "Instrukcja nie jest do czytania. Instrukcja jest na wszelki wypadek.",
    opinion:
      "Komisja nie dopatrzyła się dziaderstwa w samym segregatorze: zbiór jest kompletny, opisany i dostępny dla wszystkich domowników. Korzystają z niego zwłaszcza wtedy, gdy trzeba naprawić urządzenie, które Uczestnik wcześniej naprawił bez instrukcji. Ta sprawa zostanie rozpatrzona odrębnie.",
    expert: "nie",
    species: ["budowa"],
  },
  {
    slug: "kto-mowi",
    number: 16,
    title: "„Słucham, kto mówi?”, choć dzwoni córka",
    category: "rodzina",
    facts:
      "Uczestnik odbiera każdy telefon słowami „Słucham, kto mówi?”, także wtedy, gdy na ekranie wyświetla się napis „Córka” i jej zdjęcie. Córka za każdym razem przedstawia się imieniem, nazwiskiem i stopniem pokrewieństwa.",
    defence: "A skąd mam wiedzieć, kto ma jej telefon?",
    opinion:
      "Komisja uznaje ostrożność Uczestnika za uzasadnioną w zakresie, w jakim córka mogła zgubić telefon. Ustalono jednak, że od 2014 roku nie zgubiła go ani razu, a w tym czasie przedstawiła się ojcu około 1900 razy.",
    expert: "tak",
    species: ["smart"],
  },
  {
    slug: "kalkulator-z-drukarka",
    number: 17,
    title: "Sprawdzanie arkusza na kalkulatorze",
    category: "praca",
    facts:
      "Uczestnik sprawdza każdy wynik z arkusza kalkulacyjnego na kalkulatorze z drukarką. Gdy wyniki się różnią, poprawia arkusz. Taśmy z wydrukami przechowuje w segregatorach, po jednym na każdy rok od 2009.",
    defence: "Komputer to też tylko maszyna. Może się pomylić.",
    opinion:
      "Komisja ustaliła, że od 2009 roku kalkulator i arkusz dały różne wyniki 37 razy. W 36 przypadkach pomylił się Uczestnik przy wpisywaniu liczb do kalkulatora, a arkusz i tak został poprawiony, co Komisja kwalifikuje jako dziaderstwo kliniczne z wpływem na wynik finansowy firmy.",
    expert: "kliniczne",
    species: ["korpo"],
  },
  {
    slug: "dzien-dobry",
    number: 18,
    title: "„Dzień dobry” aż do skutku",
    category: "sasiedzi",
    facts:
      "Uczestnik mówi „dzień dobry” wszystkim mieszkańcom osiedla, także tym, których nie zna. Zapamiętuje, kto nie odpowiedział, i przy kolejnych spotkaniach mówi tej osobie „dzień dobry” coraz wyraźniej, aż do skutku.",
    defence: "Ja nikogo nie zmuszam. Ja tylko pamiętam.",
    opinion:
      "Komisja nie dopatrzyła się dziaderstwa w samym powitaniu, które jest uprzejme. Dziaderstwo zaczęło się w 2017 roku, kiedy sąsiad z trzeciego piętra nie odpowiedział, bo miał słuchawki w uszach. Od tego czasu Uczestnik wita go z odległości 40 metrów, a sąsiad odpowiada, zanim Uczestnik otworzy usta.",
    expert: "tak",
    species: ["parapetowy"],
  },
  {
    slug: "zdjecie-telewizora",
    number: 19,
    title: "Zdjęcie prognozy pogody z telewizora",
    category: "technologia",
    facts:
      "Uczestnik fotografuje telefonem ekran telewizora, gdy pokazuje coś, co uważa za ważne, i wysyła zdjęcie na rodzinną grupę. Najczęściej jest to prognoza pogody. Na każdym zdjęciu widać także odbicie Uczestnika i żyrandola.",
    defence: "A jak inaczej mam wam pokazać, co mówili w telewizji?",
    opinion:
      "Komisja ustaliła, że zdjęcia przedstawiają prognozę pogody dostępną w aplikacji na telefonie, którym je zrobiono. Mają jednak wartość dokumentalną: od 2019 roku w odbiciu nie zmienił się ani żyrandol, ani podkoszulek Uczestnika.",
    expert: "tak",
    species: ["smart", "meteorologiczny"],
  },
  {
    slug: "smacznego",
    number: 20,
    title: "„Smacznego” dla każdego stolika po drodze",
    category: "wakacje",
    facts:
      "Uczestnik, przechodząc przez hotelową restaurację, życzy „smacznego” każdemu stolikowi, który mija. Przy śniadaniu w formie bufetu oznacza to około 40 życzeń, ponieważ Uczestnik podchodzi do bufetu siedem razy.",
    defence: "Mnie to nic nie kosztuje, a ludziom miło.",
    opinion:
      "Komisja nie dopatrzyła się dziaderstwa. Życzenie smacznego nieznajomym jest zwyczajem uprzejmym, bezpłatnym i skutecznym: 31% adresatów odpowiada „dziękuję”, a 6% „nawzajem”, mimo że Uczestnik w tym czasie niczego nie je.",
    expert: "nie",
    species: ["wakacje"],
  },
  {
    slug: "przecena-pieczywa",
    number: 21,
    title: "Bułki z przeceny o 19:45",
    category: "zakupy",
    facts:
      "Uczestnik przychodzi do sklepu codziennie o 19:40, ponieważ o 19:45 pieczywo jest przeceniane o połowę. Kupuje wszystko, co zostało, niezależnie od potrzeb gospodarstwa domowego. Nadwyżkę zamraża.",
    defence: "Za pół ceny to się zawsze opłaca, nawet jak się nie zje.",
    opinion:
      "Komisja ustaliła, że w zamrażarkach Uczestnika znajduje się 640 bułek, co przy obecnym spożyciu zapewnia gospodarstwu domowemu pieczywo do 2028 roku. Uczestnik oszczędza w ten sposób 11 zł tygodniowo i wydał 1400 zł na drugą zamrażarkę.",
    expert: "kliniczne",
    species: ["oszczednosciowy", "kolejkowy"],
  },
  {
    slug: "klodka-na-termostacie",
    number: 22,
    title: "Kłódka na termostacie",
    category: "dom",
    facts:
      "Uczestnik założył na głowice termostatyczne we wszystkich pokojach plastikowe osłony z kłódkami. Kluczyk nosi przy sobie, na jednym kółku z kluczem do garażu. W mieszkaniu jest 19 stopni, a domownikom, którym jest zimno, Uczestnik wydaje swetry.",
    defence: "Kaloryfer to nie zabawka, żeby każdy sobie kręcił.",
    opinion:
      "Komisja przypomina, że głowica termostatyczna służy domownikom do regulacji temperatury, a nie do ochrony temperatury przed domownikami. Ustalono ponadto, że popołudnia Uczestnik spędza w garażu, przy farelce ustawionej na maksimum.",
    expert: "kliniczne",
    species: ["oszczednosciowy"],
  },
  {
    slug: "zegar-w-samochodzie",
    number: 23,
    title: "Zegar w samochodzie na czasie zimowym",
    category: "samochod",
    facts:
      "Uczestnik nie przestawia zegara w samochodzie przy zmianie czasu. Od końca marca do końca października zegar spóźnia się o godzinę, a Uczestnik dodaje ją w pamięci. Pasażerom, którzy pytają o godzinę, radzi zrobić to samo.",
    defence: "Po co mam przestawiać, jak za pół roku samo się zrobi dobrze.",
    opinion:
      "Komisja nie dopatrzyła się dziaderstwa. Strategię Uczestnika stosuje znaczna część kierowców w Polsce, a zegar, który z niej wynika, pokazuje właściwą godzinę przez pięć miesięcy w roku. To o pięć miesięcy więcej niż zegar w piekarniku Uczestnika, który od 2015 roku miga, pokazując 00:00.",
    expert: "nie",
    species: ["moto"],
  },
  {
    slug: "wielkie-litery",
    number: 24,
    title: "Wiadomości wielkimi literami, z podpisem",
    category: "rodzina",
    facts:
      "Uczestnik pisze wiadomości do rodziny wyłącznie wielkimi literami i podpisuje każdą słowem „TATA”, choć komunikator wyświetla nadawcę nad każdą wiadomością. Przeciętna wiadomość liczy cztery słowa, z czego jedno to podpis.",
    defence: "Jak piszę wielkimi, to wiadomo, że poważnie.",
    opinion:
      "Komisja ustaliła, że rodzina odczytuje każdą wiadomość Uczestnika jako awanturę, w tym wiadomość „KUPIŁEM CHLEB. TATA”, po której córka oddzwoniła z pytaniem, co się stało. Komisja uznaje podpis za zbędny: nadawcę i tak zdradza styl.",
    expert: "tak",
    species: ["facebook"],
  },
  {
    slug: "kubek-szefa",
    number: 25,
    title: "Kubek z napisem „Najlepszy szef”",
    category: "praca",
    facts:
      "Uczestnik pije w pracy wyłącznie z kubka z napisem „Najlepszy szef na świecie”. Uczestnik nie jest szefem: kubek wylosował w 2012 roku na firmowej wymianie prezentów. Kubka nikomu nie pożycza i myje go osobiście.",
    defence: "Kubek to kubek. Napis to już nie moja sprawa.",
    opinion:
      "Komisja nie dopatrzyła się dziaderstwa. Przywiązanie do własnego kubka jest w biurach zjawiskiem powszechnym, a napis nie stanowi oświadczenia woli, skoro Uczestnik nigdy nie wydał na jego podstawie żadnego polecenia. Komisja odnotowuje jedynie, że prawdziwy szef pije z kubka bez napisu.",
    expert: "nie",
    species: ["korpo"],
  },
  {
    slug: "rekord-nad-morze",
    number: 26,
    title: "Rekord przejazdu nad morze",
    category: "wakacje",
    facts:
      "Uczestnik mierzy czas każdego przejazdu nad morze i porównuje go z rekordem z 2011 roku: 5 godzin i 52 minuty. Postoje są dozwolone wyłącznie przy tankowaniu. O stracie do rekordu Uczestnik informuje rodzinę co pół godziny.",
    defence: "Siku można było zrobić w Toruniu, jak tankowałem.",
    opinion:
      "Komisja ustaliła, że rekord z 2011 roku nie został dotąd pobity. Od tego czasu oddano do użytku autostradę, którą Uczestnik omija, ponieważ rekord ustanowiony autostradą „by się nie liczył”.",
    expert: "kliniczne",
    species: ["moto", "wakacje"],
  },
  {
    slug: "lawka-pod-blokiem",
    number: 27,
    title: "Wniosek w sprawie ławki pod blokiem",
    category: "sasiedzi",
    facts:
      "Uczestnik od 2003 roku na każdym zebraniu wspólnoty mieszkaniowej składa wniosek o przesunięcie ławki pod blokiem o metr w stronę słońca. Wniosek przepadał 16 razy. Uczestnik przynosi na zebrania własny projekt, narysowany na papierze milimetrowym.",
    defence: "Ja na tej ławce nawet nie siadam. Chodzi o zasadę.",
    opinion:
      "Komisja ustaliła, że w 2019 roku wniosek przyjęto, a ławkę przesunięto. Na kolejnym zebraniu Uczestnik złożył wniosek o przesunięcie jej z powrotem, ponieważ „tam było lepiej”. Nowy wniosek przepada od siedmiu lat.",
    expert: "tak",
    species: ["parapetowy", "budowa"],
  },
  {
    slug: "rozmowy-na-glosniku",
    number: 28,
    title: "Telefon na głośniku, trzymany jak kanapka",
    category: "technologia",
    facts:
      "Uczestnik prowadzi wszystkie rozmowy telefoniczne na głośniku, trzymając telefon poziomo przed ustami, jak kanapkę. Robi to także w tramwaju, w kolejce do kasy i w urzędzie. Rozmowy trwają średnio 12 minut.",
    defence: "Ja nie mam nic do ukrycia.",
    opinion:
      "Komisja ustaliła, że stali współpasażerowie Uczestnika znają stan jego działki, wynik przeglądu jego samochodu i powód, dla którego nie rozmawia z kuzynem. Komisja nie kwestionuje deklaracji Uczestnika: po ośmiu latach takich rozmów rzeczywiście nie ma już nic do ukrycia.",
    expert: "kliniczne",
    species: ["smart"],
  },
  {
    slug: "kolejka-przed-otwarciem",
    number: 29,
    title: "Kolejka przed pustym sklepem o 5:40",
    category: "zakupy",
    facts:
      "Uczestnik przychodzi pod osiedlowy sklep codziennie o 5:40 i czeka na otwarcie o 6:00. Sklep jest czynny do 23:00 i przez cały dzień nie ma w nim kolejki. Uczestnik kupuje zwykle masło i gazetę.",
    defence: "Rano jest wszystko świeże i nikt się nie pcha.",
    opinion:
      "Komisja ustaliła, że od 2009 roku Uczestnik jest jedyną osobą w kolejce przed tym sklepem, a zarazem całą kolejką. Gdy w 2023 roku pojawiła się druga osoba, Uczestnik poprosił ją, żeby zapamiętała, że jest za nim, i poszedł na chwilę do domu.",
    expert: "kliniczne",
    species: ["kolejkowy"],
  },
  {
    slug: "prasowany-papier",
    number: 30,
    title: "Prasowanie papieru po prezentach",
    category: "rodzina",
    facts:
      "Uczestnik po rozpakowaniu prezentów w Wigilię zbiera papier, prasuje go żelazkiem i przechowuje w szafie do następnych świąt. Część arkuszy jest w obiegu od 2008 roku. Domownicy rozpakowują prezenty ostrożnie, bo Uczestnik patrzy.",
    defence: "Papier jest cały, to po co ma iść na śmieci.",
    opinion:
      "Komisja ustaliła, że jeden arkusz w renifery obiegł w ciągu siedemnastu lat całą rodzinę i w ubiegłe święta wrócił do Uczestnika jako opakowanie prezentu od wnuczki. Komisja odnotowuje z niepokojem, że był wyprasowany.",
    expert: "tak",
    species: ["wigilijny", "oszczednosciowy"],
  },
];

export const docket = (item: Case) => `IBD-K ${item.number}/26`;

/* Editions: the Polish cases above with each edition's text and slugs laid over them. */

const EDITIONS = {
  pl: { cases: CASES, verdicts: VERDICTS, categories: CASE_CATEGORIES },
  sl: {
    cases: overlayList("cases.CASES", CASES, (item) => item.number, sl.CASES).map((item) => ({
      ...item,
      slug: CASE_SLUGS[item.slug] ?? item.slug,
    })),
    verdicts: overlay(VERDICTS, sl.VERDICTS, "cases.VERDICTS"),
    categories: overlay(CASE_CATEGORIES, sl.CASE_CATEGORIES, "cases.CASE_CATEGORIES"),
  },
} satisfies Record<Locale, { cases: Case[]; verdicts: typeof VERDICTS; categories: typeof CASE_CATEGORIES }>;

/** The cases in the edition's language, with the edition's slugs: same order, numbers and verdicts as CASES. */
export const getCases = (locale: Locale): Case[] => EDITIONS[locale].cases;

/** The three verdicts in the edition's language: same order and keys as VERDICTS. */
export const getVerdicts = (locale: Locale): typeof VERDICTS => EDITIONS[locale].verdicts;

/** Category names in the edition's language. */
export const caseCategories = (locale: Locale): typeof CASE_CATEGORIES => EDITIONS[locale].categories;

/** A case by the edition's own slug ("klucze-w-zamku" in Polish, "kljuci-v-kljucavnici" in Slovenian). */
export const caseBySlug = (slug: string, locale: Locale) => getCases(locale).find((item) => item.slug === slug);

const KEYS = new Map(CASES.map((item) => [item.number, item.slug]));

/**
 * The key of a case in shared data (votes, tallies, the profile, this browser's verdicts): its Polish
 * slug, whatever the edition. Both editions vote on the same case and see the same split.
 */
export const caseKey = (item: Pick<Case, "number">) => KEYS.get(item.number)!;
