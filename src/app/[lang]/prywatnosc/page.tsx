import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader, Section } from "@/components/page";
import { defineCopy } from "@/i18n/copy";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { site, siteCopy } from "@/lib/site";
import { typo } from "@/lib/typo";

type Part = { id: string; title: string; paragraphs: string[] };

/* The Slovenian text is a translation; the Polish one prevails. Keep both in step with /regulamin. */
const COPY = defineCopy<{
  title: string;
  description: string;
  lead: string;
  since: (date: string) => string;
  controller: { title: string; text: (name: string) => string; missing: string };
  parts: Part[];
}>({
  pl: {
    title: "Polityka prywatności",
    description: "Polityka prywatności DZIADER.SI: jakie dane zbiera Instytut, po co i jak długo je przechowuje. Konta, cookies, statystyki i usuwanie danych.",
    lead: "Instytut bada dziaderstwo, nie ludzi. Zbiera tyle danych, ile trzeba do spisu i do konta, i ani jednej skarpety więcej.",
    since: (date) => `Obowiązuje od ${date}`,
    controller: {
      title: "Kto odpowiada za dane",
      text: (name) => `Administratorem danych jest ${name}. W sprawach danych osobowych prosimy pisać na adres`,
      missing: "Dane administratora zostaną uzupełnione przed uruchomieniem kont.",
    },
    parts: [
      {
        id: "spis",
        title: "Test i Narodowy Spis Dziadersów",
        paragraphs: [
          "Po zakończeniu Testu Dziadersa do Narodowego Spisu trafiają: odpowiedzi, wynik, rozpoznanie, dzień i godzina badania, informacja, czy był to wywiad rodzinny, czy ta sama przeglądarka badała się już wcześniej (wtedy z poprzednim wynikiem), a także województwo, jeśli ktoś je podał. Do spisu nie trafia imię z certyfikatu, adres IP ani żaden identyfikator osoby lub urządzenia.",
          "Dane spisu nie zawierają podpisu ani bezpośrednich danych kontaktowych. Służą do zbiorczych zestawień w Narodowym Spisie i do porównań w teście („tak samo odpowiedziało 38% badanych”). Wynik zapisany także w profilu lub rankingu może jednak zostać powiązany z podpisem na podstawie tego zgłoszenia. Dane statystyczne przechowujemy bez ograniczenia czasu. W zakresie, w jakim mogłyby być uznane za dane osobowe, podstawą jest prawnie uzasadniony interes Instytutu w prowadzeniu statystyki (art. 6 ust. 1 lit. f RODO).",
          "Podpis certyfikatu jest zapisany w linku do wyniku: widzi go każdy, komu przekażesz link. Zapisanie wyniku w Profilu Dziaderskim lub rankingu rodzinnym zapisuje również podpis w tej usłudze.",
        ],
      },
      {
        id: "rankingi",
        title: "Rankingi rodzinne i ochrona przed nadużyciami",
        paragraphs: [
          "Ranking rodzinny przechowuje wyniki, podpisy i daty dołączenia. Każdy, kto zna losowy link zaproszenia, może zobaczyć listę i dołączyć. Ranking nie wymaga konta. Po 90 dniach przestaje być dostępny, a jego dane usuwa codzienne zadanie porządkowe. W sprawie wcześniejszego usunięcia napisz na adres administratora i podaj link rankingu.",
          "Każde badanie otrzymuje losowy identyfikator zgłoszenia, aby ponowne wysłanie nie zwiększało spisu. Nie identyfikuje on osoby ani urządzenia. Aby ograniczyć automatyczne nadużycia, serwer wylicza codziennie zmieniany skrót adresu sieciowego. W licznikach ochronnych zapisujemy ten skrót zamiast adresu IP; stare liczniki są usuwane przy kolejnych zapisach i w codziennym zadaniu porządkowym.",
          "Do analityki odsłon i zdarzeń nie przekazujemy kodów wyników, podpisów, tokenów zaproszeń ani parametrów zapytania. Zdarzenia ukończenia gabinetu obejmują numer gabinetu, tryb badania i wybrane tempo, bez odpowiedzi ani podpisu.",
        ],
      },
      {
        id: "konto",
        title: "Profil Dziaderski",
        paragraphs: [
          "Konto wymaga adresu e-mail. Przechowujemy go razem z pseudonimem (jeśli go podasz), zapisanymi wynikami i datami logowania. Robimy to, żeby prowadzić konto (art. 6 ust. 1 lit. b RODO), i tylko tak długo, jak konto istnieje.",
          "Konto usuwa się przyciskiem w Profilu Dziaderskim, natychmiast i na zawsze, razem z pseudonimem, kartoteką, obserwacjami, zakładkami, kartkami z kalendarza, zgodami i zgłoszonymi sprawami. Anonimowe wpisy w Narodowym Spisie zostają, bo nie wiadomo, czyje są. Głosy w Komisji Orzekającej zostają w statystyce, ale tracą powiązanie z kontem.",
          "Na adres e-mail wysyłamy wiadomości potrzebne do konta (potwierdzenie rejestracji, linki do logowania i odzyskania hasła oraz potwierdzenia zmian), a Biuletyn tygodniowy tylko wtedy, gdy go zamówisz. Reklam nie wysyłamy.",
          "Możesz logować się hasłem, linkiem z e-maila lub przez Google. Hasła obsługuje Supabase. Przy logowaniu przez Google Supabase otrzymuje adres e-mail, identyfikator konta i podstawowe dane profilu Google, takie jak nazwa i zdjęcie. Nie prosimy o dostęp do poczty, kontaktów ani plików na Dysku Google.",
        ],
      },
      {
        id: "spolecznosc",
        title: "Obserwacje, zakładki i Komisja Orzekająca",
        paragraphs: [
          "Obserwacja terenowa zgłoszona z Profilu Dziaderskiego to gatunek, data i godzina, a także województwo, jeśli je wskażesz. Zakładki to kody wypowiedzi z Rozmówek, kart bingo i egzaminów, które zachowasz. Obie rzeczy są przypisane do konta, widzisz je w Profilu i możesz je tam usunąć. W zestawieniach publicznych (Atlas, Mały Rocznik Statystyczny) pokazujemy je wyłącznie zbiorczo, bez pseudonimów.",
          "Głos w Komisji Orzekającej zapisujemy z nazwą sprawy i rodzajem orzeczenia. Głos osoby niezalogowanej jest anonimowy; o tym, że już głosowała, pamięta tylko jej przeglądarka. Głos osoby zalogowanej jest przypisany do konta, żeby można było głosować raz w sprawie i widzieć swoje orzeczenia w Profilu.",
          "Sprawę zgłoszoną do Komisji czytamy ręcznie. Nic nie jest publikowane automatycznie. Jeśli sprawa trafi na wokandę, publikujemy ją zredagowaną i bez danych zgłaszającego. Prosimy nie wpisywać imion, nazwisk, adresów ani innych danych, po których można rozpoznać konkretną osobę. Zgłoszenia przechowujemy, dopóki istnieje konto.",
          "Liczniki do Małego Rocznika Statystycznego (na przykład ile wypowiedzi wylosowały Rozmówki albo ile razy zatrąbiono w teście) to dzienne sumy bez żadnych identyfikatorów. Podstawą tych zestawień jest prawnie uzasadniony interes Instytutu w prowadzeniu statystyki (art. 6 ust. 1 lit. f RODO), a dla danych przypisanych do konta prowadzenie konta (art. 6 ust. 1 lit. b RODO).",
          "Pytania do Superinteligencji odczytuje przeglądarka i nie trafiają one na serwer. Liczymy tylko, ile pytań zadano (dzienna suma bez identyfikatorów), a do analityki zdarzeń trafia dziedzina pytania, na przykład motoryzacja, bez jego treści. Jeśli udostępnisz odpowiedź, pytanie jest zapisane w linku: widzi je każdy, komu przekażesz link, a otwarcie linku przechodzi przez serwer jak każda strona. Do analityki odsłon link trafia bez pytania.",
        ],
      },
      {
        id: "zgody",
        title: "Biuletyn, Tablica Honorowa i kalendarz",
        paragraphs: [
          "Biuletyn tygodniowy wysyłamy tylko osobom, które zaznaczyły go w Profilu Dziaderskim (zgoda, art. 6 ust. 1 lit. a RODO). Zgodę można cofnąć w każdej chwili: w Profilu albo jednym kliknięciem w stopce każdego listu. W liście, oprócz liczb ogólnych, są twoje liczby z ostatniego tygodnia: obserwacje, kartki z kalendarza, liczba badań i orzeczeń. Zapamiętujemy, kiedy zgoda została wyrażona.",
          "Pseudonim na Tablicy Honorowej pokazujemy tylko wtedy, gdy zaznaczysz to w Profilu (zgoda). Obok pseudonimu widać wyłącznie liczby: zaobserwowane gatunki, zgłoszenia, orzeczenia, kartki i najdłuższą serię. Odznaczenie zgody usuwa pseudonim z Tablicy przy najbliższym odświeżeniu, zwykle w ciągu kilku minut.",
          "Zerwana kartka z kalendarza to data przypisana do konta, potrzebna do serii dni i odznak. Bez konta liczymy ją tylko anonimowo, w dziennej sumie. Legitymacja Obserwatora powstaje na bieżąco z danych konta i nie jest nigdzie zapisywana.",
        ],
      },
      {
        id: "dostawcy",
        title: "Kto jeszcze ma dostęp",
        paragraphs: [
          "Supabase przechowuje bazę danych i obsługuje logowanie, na serwerach w Unii Europejskiej. Vercel utrzymuje serwis i liczy odwiedziny bez plików cookie. Brevo wysyła wiadomości e-mail. Każdy z nich przetwarza dane wyłącznie na zlecenie Instytutu. Jeśli dane trafiają przy tym poza Europejski Obszar Gospodarczy, dzieje się to na podstawie standardowych klauzul umownych Komisji Europejskiej.",
        ],
      },
      {
        id: "przegladarka",
        title: "Pliki cookie i pamięć przeglądarki",
        paragraphs: [
          "Plików cookie używamy do logowania (bez nich nie da się utrzymać sesji) i do zapamiętania wydania, które wybierzesz: polskiego albo słoweńskiego, żeby strona główna otwierała się w tym języku. Nie ma cookies reklamowych ani śledzących.",
          "W pamięci przeglądarki zostają: postęp testu (do zamknięcia karty), ostatni własny wynik (żeby spis policzył powtórki bez żadnego identyfikatora), skreślenia w Dziaders Bingo, głosy oddane w Komisji bez logowania, województwo wybrane przy obserwacjach i, po zalogowaniu, podsumowanie konta na minutę, żeby nie pytać serwera przy każdej stronie. Te dane nie opuszczają przeglądarki, poza poprzednim wynikiem dołączanym do kolejnego badania.",
        ],
      },
      {
        id: "prawa",
        title: "Twoje prawa",
        paragraphs: [
          "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, a także prawo sprzeciwu. Większość z nich załatwia Profil Dziaderski: tam widać wszystko, co o koncie wiemy, i tam można je usunąć. W pozostałych sprawach napisz do Instytutu. Przysługuje ci też skarga do Prezesa Urzędu Ochrony Danych Osobowych.",
        ],
      },
    ],
  },
  sl: {
    title: "Politika zasebnosti",
    description: "Politika zasebnosti DZIADER.SI: katere podatke zbira Inštitut, zakaj in kako dolgo jih hrani. Računi, piškotki, statistika in izbris podatkov.",
    lead: "Inštitut raziskuje dziaderstvo, ne ljudi. Zbere toliko podatkov, kot jih potrebujeta popis in račun, in niti ene nogavice več.",
    since: (date) => `Velja od ${date}`,
    controller: {
      title: "Kdo je odgovoren za podatke",
      text: (name) => `Upravljavec podatkov je ${name}. Glede osebnih podatkov nam piši na naslov`,
      missing: "Podatki o upravljavcu bodo dopolnjeni pred zagonom računov.",
    },
    parts: [
      {
        id: "spis",
        title: "Test in Nacionalni popis dziadersov",
        paragraphs: [
          "Ko končaš test dziadersa, se v Nacionalni popis zapišejo: odgovori, rezultat, diagnoza, dan in ura pregleda, podatek, ali je šlo za heteroanamnezo, ali je isti brskalnik že kdaj opravil pregled (v tem primeru s prejšnjim rezultatom), in vojvodstvo, če ga je kdo navedel. V popis se ne zapišejo ime s certifikata, naslov IP ali kakršen koli identifikator osebe ali naprave.",
          "Podatki popisa ne vsebujejo podpisa ali neposrednih kontaktnih podatkov. Uporabljamo jih za skupne preglede v Nacionalnem popisu in za primerjave v testu (»enako je odgovorilo 38 % preiskovanih«). Rezultat, ki ga shraniš tudi v profil ali lestvico, pa se lahko na podlagi te prijave poveže s podpisom. Statistične podatke hranimo brez časovne omejitve. Kolikor bi jih lahko šteli za osebne podatke, je pravna podlaga zakoniti interes Inštituta za vodenje statistike (točka (f) prvega odstavka 6. člena Splošne uredbe o varstvu podatkov, GDPR).",
          "Podpis s certifikata je zapisan v povezavi do rezultata: vidi ga vsak, komur povezavo pošlješ. Če rezultat shraniš v Dziaderski profil ali družinsko lestvico, se podpis shrani tudi tam.",
        ],
      },
      {
        id: "rankingi",
        title: "Družinske lestvice in zaščita pred zlorabami",
        paragraphs: [
          "Družinska lestvica hrani rezultate, podpise in datume pridružitve. Vsak, ki pozna naključno povezavo vabila, lahko vidi seznam in se pridruži. Lestvica ne potrebuje računa. Po 90 dneh ni več dostopna, njene podatke pa izbriše vsakodnevno čiščenje. Če želiš, da jo izbrišemo prej, piši na naslov upravljavca in priloži povezavo do lestvice.",
          "Vsak pregled dobi naključni identifikator prijave, da ponovno pošiljanje ne poveča popisa. Ta ne identificira osebe ali naprave. Da omejimo samodejne zlorabe, strežnik izračuna izvleček omrežnega naslova, ki se vsak dan spremeni. V zaščitnih števcih hranimo ta izvleček namesto naslova IP; stare števce brišemo ob novih zapisih in pri vsakodnevnem čiščenju.",
          "V analitiko ogledov in dogodkov ne pošiljamo kod rezultatov, podpisov, žetonov vabil ali parametrov poizvedbe. Dogodki ob koncu ordinacije vsebujejo številko ordinacije, način pregleda in izbrani tempo, brez odgovorov ali podpisa.",
        ],
      },
      {
        id: "konto",
        title: "Dziaderski profil",
        paragraphs: [
          "Za račun potrebujemo e-poštni naslov. Hranimo ga skupaj z vzdevkom (če ga navedeš), shranjenimi rezultati in datumi prijav. To počnemo zaradi vodenja računa (točka (b) prvega odstavka 6. člena GDPR) in samo dokler račun obstaja.",
          "Račun izbrišeš z gumbom v Dziaderskem profilu, takoj in za vedno, skupaj z vzdevkom, kartoteko, opazovanji, zaznamki, listi koledarja, soglasji in prijavljenimi primeri. Anonimni vpisi v Nacionalnem popisu ostanejo, ker se ne ve, čigavi so. Glasovi v Razsodni komisiji ostanejo v statistiki, vendar niso več povezani z računom.",
          "Na e-poštni naslov pošiljamo sporočila, potrebna za račun (potrditev registracije, povezave za prijavo in ponastavitev gesla ter potrditve sprememb), Tedenski bilten pa samo, če ga naročiš. Oglasov ne pošiljamo.",
          "Prijaviš se lahko z geslom, s povezavo iz e-pošte ali z Googlom. Za gesla skrbi Supabase. Ob prijavi z Googlom Supabase prejme e-naslov, identifikator računa in osnovne podatke profila Google, kot sta ime in fotografija. Ne zahtevamo dostopa do pošte, stikov ali datotek v storitvi Google Drive.",
        ],
      },
      {
        id: "spolecznosc",
        title: "Opazovanja, zaznamki in Razsodna komisija",
        paragraphs: [
          "Terensko opazovanje, prijavljeno iz Dziaderskega profila, sestavljajo vrsta, datum in ura ter vojvodstvo, če ga navedeš. Zaznamki so kode izjav iz Pogovornika, bingo listkov in izpitov, ki jih shraniš. Oboje je povezano z računom, vidiš ga v profilu in ga tam lahko izbrišeš. V javnih pregledih (Atlas, Mali statistični letopis) jih prikazujemo samo skupno, brez vzdevkov.",
          "Glas v Razsodni komisiji shranimo z imenom primera in vrsto razsodbe. Glas neprijavljene osebe je anoniman; da je že glasovala, si zapomni samo njen brskalnik. Glas prijavljene osebe je povezan z računom, da lahko v vsakem primeru glasuje enkrat in vidi svoje razsodbe v profilu.",
          "Primer, prijavljen Komisiji, preberemo ročno. Nič se ne objavi samodejno. Če primer pride na seznam obravnav, ga objavimo urejenega in brez podatkov prijavitelja. Prosimo, ne vpisuj imen, priimkov, naslovov ali drugih podatkov, po katerih bi bilo mogoče prepoznati konkretno osebo. Prijave hranimo, dokler obstaja račun.",
          "Števci za Mali statistični letopis (na primer koliko izjav je izžrebal Pogovornik ali kolikokrat je kdo pohupal v testu) so dnevne vsote brez kakršnih koli identifikatorjev. Pravna podlaga teh pregledov je zakoniti interes Inštituta za vodenje statistike (točka (f) prvega odstavka 6. člena GDPR), za podatke, povezane z računom, pa vodenje računa (točka (b) prvega odstavka 6. člena GDPR).",
          "Vprašanja za Superinteligenco prebere brskalnik in ne pridejo na strežnik. Štejemo samo, koliko vprašanj je bilo zastavljenih (dnevna vsota brez identifikatorjev), v analitiko dogodkov pa gre področje vprašanja, na primer avtomobilizem, brez njegove vsebine. Če odgovor deliš, je vprašanje zapisano v povezavi: vidi ga vsak, komur povezavo pošlješ, odpiranje povezave pa gre prek strežnika kot pri vsaki strani. V analitiko ogledov gre povezava brez vprašanja.",
        ],
      },
      {
        id: "zgody",
        title: "Bilten, Častna tabla in koledar",
        paragraphs: [
          "Tedenski bilten pošiljamo samo osebam, ki so ga označile v Dziaderskem profilu (privolitev, točka (a) prvega odstavka 6. člena GDPR). Privolitev lahko kadar koli prekličeš: v profilu ali z enim klikom v nogi vsakega pisma. V pismu so poleg splošnih številk tudi tvoje številke iz zadnjega tedna: opazovanja, listi koledarja, število pregledov in razsodb. Zapomnimo si, kdaj je bila privolitev dana.",
          "Vzdevek na Častni tabli prikažemo samo, če to označiš v profilu (privolitev). Ob vzdevku so vidne samo številke: opažene vrste, prijave, razsodbe, listi in najdaljši niz. Ko soglasje odznačiš, vzdevek izgine s Table ob naslednji osvežitvi, običajno v nekaj minutah.",
          "Odtrgan list koledarja je datum, povezan z računom, ki ga potrebujemo za nize dni in značke. Brez računa ga štejemo samo anonimno, v dnevni vsoti. Opazovalska izkaznica nastane sproti iz podatkov računa in se nikjer ne shranjuje.",
        ],
      },
      {
        id: "dostawcy",
        title: "Kdo še ima dostop",
        paragraphs: [
          "Supabase hrani podatkovno zbirko in skrbi za prijavo, na strežnikih v Evropski uniji. Vercel gosti stran in šteje obiske brez piškotkov. Brevo pošilja e-pošto. Vsak od njih obdeluje podatke izključno po naročilu Inštituta. Če pri tem podatki zapustijo Evropski gospodarski prostor, se to zgodi na podlagi standardnih pogodbenih klavzul Evropske komisije.",
        ],
      },
      {
        id: "przegladarka",
        title: "Piškotki in pomnilnik brskalnika",
        paragraphs: [
          "Piškotke uporabljamo za prijavo (brez njih seje ni mogoče ohraniti) in za to, da si zapomnimo izdajo, ki jo izbereš, poljsko ali slovensko, da se domača stran odpre v tem jeziku. Oglasnih in sledilnih piškotkov ni.",
          "V pomnilniku brskalnika ostanejo: napredek testa (do zaprtja zavihka), zadnji lastni rezultat (da popis prešteje ponovitve brez kakršnega koli identifikatorja), prečrtana polja v Dziaders bingu, glasovi, oddani v Komisiji brez prijave, vojvodstvo, izbrano pri opazovanjih, in po prijavi povzetek računa za eno minuto, da strežnika ne sprašujemo na vsaki strani. Ti podatki ne zapustijo brskalnika, razen prejšnjega rezultata, ki se priloži naslednjemu pregledu.",
        ],
      },
      {
        id: "prawa",
        title: "Tvoje pravice",
        paragraphs: [
          "Imaš pravico do dostopa do svojih podatkov, do njihovega popravka, izbrisa, omejitve obdelave in prenosljivosti ter pravico do ugovora. Večino tega urediš v Dziaderskem profilu: tam vidiš vse, kar o računu vemo, in tam ga lahko izbrišeš. Za vse drugo piši Inštitutu. Pritožbo lahko vložiš tudi pri poljskem predsedniku Urada za varstvo osebnih podatkov (UODO) ali pri slovenskem Informacijskem pooblaščencu.",
        ],
      },
    ],
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/prywatnosc", defaultImage: true });
}

const P = ({ children }: { children: string }) => <p className="mt-4 max-w-3xl leading-relaxed first:mt-0">{typo(children)}</p>;

function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Section id={id} title={title} className="py-10 md:py-12">
      <div className="border-t border-ink pt-6">{children}</div>
    </Section>
  );
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  const { name, email } = site.controller;

  return (
    <main id="tresc">
      <PageHeader crumbs={[{ label: t.title }]} title={t.title} lead={typo(t.lead)} meta={t.since(siteCopy(locale).privacyDate)} />

      <Part id="administrator" title={t.controller.title}>
        {name && email ? (
          <p className="max-w-3xl leading-relaxed">
            {typo(t.controller.text(name))}{" "}
            <a href={`mailto:${email}`} className="link">
              {email}
            </a>
            .
          </p>
        ) : (
          <p className="max-w-3xl border-l-2 border-red pl-4 leading-relaxed text-red">{typo(t.controller.missing)}</p>
        )}
      </Part>

      {t.parts.map((part) => (
        <Part key={part.id} id={part.id} title={part.title}>
          {part.paragraphs.map((paragraph) => (
            <P key={paragraph}>{paragraph}</P>
          ))}
        </Part>
      ))}
    </main>
  );
}
