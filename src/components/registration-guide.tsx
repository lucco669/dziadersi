import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { typo } from "@/lib/typo";
import { Section } from "./page";

const COPY = defineCopy({
  pl: {
    label: "Twoja kartoteka w Instytucie",
    title: "Wyniki zostają. Ty wracasz, kiedy chcesz.",
    intro: "Załóż bezpłatny Profil Dziaderski i zbieraj ślady swoich badań w jednym miejscu. Bez podawania nazwiska. Pseudonim wystarczy.",
    benefits: [
      { title: "Wyniki i kolekcja gatunków", text: "Wracaj do zapisanych badań, porównuj wyniki i sprawdzaj, które gatunki już rozpoznano w twojej kartotece." },
      { title: "Dziennik obserwacji", text: "Zgłaszaj gatunki napotkane w terenie. Profil pamięta twoje obserwacje i pozwala pobrać Legitymację Obserwatora." },
      { title: "Zakładki i odznaki", text: "Zachowuj wypowiedzi z Rozmówek, karty bingo i egzaminy. Odznaki przyznajemy za działalność, nie za staż przy grillu." },
      { title: "Własny rytm", text: "Zrywaj kartki z kalendarza, zbieraj serie dni i wracaj do swoich orzeczeń w Komisji. Kartoteka poczeka." },
    ],
    optional: "Test, Atlas, Słownik i gry są dostępne także bez konta.",
    stepsTitle: "Trzy kroki do własnej kartoteki",
    steps: [
      { title: "Wybierz sposób wejścia", text: "Adres e-mail i unikalne hasło, Google albo link z e-maila. Wybierz sposób, który jest dla ciebie wygodny." },
      { title: "Potwierdź dostęp", text: "Przy rejestracji hasłem potwierdź adres przyciskiem w liście. Przy logowaniu bez hasła użyj linku lub kodu z wiadomości. Google poprosi o zatwierdzenie logowania." },
      { title: "Urządź profil po swojemu", text: "Dodaj pseudonim, wykonaj test lub zgłoś obserwację. Biuletyn i obecność na Tablicy Honorowej włączysz osobno, jeśli zechcesz." },
    ],
    safetyTitle: "Satyra na stronie. Porządek w danych.",
    safetyIntro: "Rejestracja nie wymaga nazwiska, adresu zamieszkania ani numeru telefonu. Do konta potrzebny jest adres e-mail; pseudonim jest opcjonalny.",
    safeguards: [
      { title: "Ty wybierasz, co pokazujesz", text: "Kartoteka nie jest publicznym katalogiem użytkowników. Na Tablicy Honorowej pseudonim pojawia się dopiero po twojej zgodzie. Link do wyniku pokazuje jego treść osobom, którym go udostępnisz." },
      { title: "Poczta w konkretnej sprawie", text: "Wysyłamy wiadomości potrzebne do obsługi konta. Biuletyn tygodniowy dostaniesz tylko po osobnym zapisaniu. Reklam nie wysyłamy." },
      { title: "Google z ograniczonym dostępem", text: "Do logowania używamy adresu e-mail i podstawowych danych profilu Google. Nie prosimy o dostęp do twojej poczty, kontaktów ani plików na Dysku Google." },
      { title: "Możesz zamknąć kartotekę", text: "Konto i przypisane do niego dane usuniesz w Profilu Dziaderskim. Anonimowe dane statystyczne pozostają w zestawieniach Instytutu." },
    ],
    passwordTip: "Użyj unikalnego hasła, najlepiej z menedżera haseł. Linków i kodów do logowania nie przekazuj innym. Instytut nie poprosi cię o wysłanie hasła e-mailem.",
    privacy: "Polityka prywatności", terms: "Regulamin", contact: "Pomoc w sprawie konta",
    faqTitle: "Przed podejściem do okienka",
    faq: [
      { question: "Czy konto jest płatne?", answer: "Nie. Założenie i korzystanie z Profilu Dziaderskiego są bezpłatne. Przy rejestracji nie podajesz danych karty płatniczej." },
      { question: "Czy muszę mieć konto, żeby wykonać test?", answer: "Nie. Test wykonasz i pobierzesz certyfikat bez logowania. Konto przydaje się, jeśli chcesz zachować wyniki i prowadzić swoją kartotekę." },
      { question: "Czy mogę korzystać bez hasła?", answer: "Tak. Wybierz link z e-maila albo Google. Przy pierwszym poprawnym logowaniu w ten sposób powstaje konto. Zawsze korzystaj z tego samego adresu e-mail." },
      { question: "Co z wynikiem zrobionym przed rejestracją?", answer: "Otwórz link do tego wyniku i wybierz zapisanie w Profilu Dziaderskim. Po zalogowaniu wynik trafi do kartoteki. Samo utworzenie konta nie przenosi wcześniejszych wyników." },
      { question: "Nie przyszło potwierdzenie. Co zrobić?", answer: "Sprawdź poprawność adresu oraz folder spam. W formularzu możesz wysłać potwierdzenie ponownie. Jeśli problem trwa, skontaktuj się z administratorem, bez przesyłania hasła ani kodu." },
      { question: "Czy rejestracja zapisuje mnie do biuletynu?", answer: "Nie. Biuletyn i publikacja pseudonimu na Tablicy Honorowej to dwie osobne, dobrowolne opcje w ustawieniach profilu. Możesz je później wyłączyć." },
    ],
    endTitle: "Kartoteka gotowa do otwarcia.",
    endText: "Resztę Instytut będzie dopisywał razem z tobą. Pierwsze badanie można wykonać już dziś.",
    register: "Przejdź do formularza", test: "Najpierw wykonaj test",
  },
  sl: {
    label: "Tvoja kartoteka na Inštitutu",
    title: "Izvidi ostanejo. Ti se vrneš, ko želiš.",
    intro: "Ustvari brezplačni Dziaderski profil in zberi sledi svojih pregledov na enem mestu. Brez priimka. Psevdonim zadošča.",
    benefits: [
      { title: "Izvidi in zbirka vrst", text: "Vrni se k shranjenim pregledom, primerjaj rezultate in preveri, katere vrste so že prepoznali v tvoji kartoteki." },
      { title: "Dnevnik opazovanj", text: "Prijavi vrste, ki jih srečaš na terenu. Profil hrani tvoja opazovanja in omogoča prenos Opazovalske izkaznice." },
      { title: "Zaznamki in značke", text: "Shrani izjave iz Pogovornika, bingo listke in izpite. Značke podeljujemo za dejavnost, ne za delovno dobo ob žaru." },
      { title: "Lasten ritem", text: "Trgaj liste koledarja, zbiraj nize dni in se vračaj k svojim razsodbam v Komisiji. Kartoteka bo počakala." },
    ],
    optional: "Test, Atlas, Slovar in igre so dostopni tudi brez računa.",
    stepsTitle: "Trije koraki do lastne kartoteke",
    steps: [
      { title: "Izberi način vstopa", text: "E-naslov in edinstveno geslo, Google ali povezava iz e-pošte. Izberi način, ki ti najbolj ustreza." },
      { title: "Potrdi dostop", text: "Pri registraciji z geslom potrdi naslov z gumbom v pismu. Pri prijavi brez gesla uporabi povezavo ali kodo iz sporočila. Google te bo prosil za potrditev prijave." },
      { title: "Uredi profil po svoje", text: "Dodaj psevdonim, opravi test ali prijavi opazovanje. Bilten in prikaz na Častni tabli vključiš posebej, če želiš." },
    ],
    safetyTitle: "Satira na strani. Red pri podatkih.",
    safetyIntro: "Registracija ne zahteva priimka, domačega naslova ali telefonske številke. Za račun potrebuješ e-naslov; psevdonim ni obvezen.",
    safeguards: [
      { title: "Ti izbereš, kaj pokažeš", text: "Kartoteka ni javni imenik uporabnikov. Na Častni tabli se psevdonim pojavi šele s tvojim soglasjem. Povezava do izvida pokaže njegovo vsebino osebam, s katerimi jo deliš." },
      { title: "Pošta z jasnim namenom", text: "Pošiljamo sporočila, potrebna za delovanje računa. Tedenski bilten prejmeš samo po ločeni prijavi. Oglasov ne pošiljamo." },
      { title: "Google z omejenim dostopom", text: "Za prijavo uporabljamo e-naslov in osnovne podatke profila Google. Ne prosimo za dostop do tvoje pošte, stikov ali datotek v storitvi Google Drive." },
      { title: "Kartoteko lahko zapreš", text: "Račun in z njim povezane podatke izbrišeš v Dziaderskem profilu. Anonimni statistični podatki ostanejo v pregledih Inštituta." },
    ],
    passwordTip: "Uporabi edinstveno geslo, najbolje iz upravljalnika gesel. Povezav in kod za prijavo ne posreduj drugim. Inštitut te ne bo prosil, da geslo pošlješ po e-pošti.",
    privacy: "Politika zasebnosti", terms: "Pogoji uporabe", contact: "Pomoč glede računa",
    faqTitle: "Preden stopiš k okencu",
    faq: [
      { question: "Je račun plačljiv?", answer: "Ne. Ustvarjanje in uporaba Dziaderskega profila sta brezplačna. Pri registraciji ne vnašaš podatkov plačilne kartice." },
      { question: "Ali za test potrebujem račun?", answer: "Ne. Test opraviš in certifikat preneseš brez prijave. Račun pride prav, če želiš shraniti izvide in voditi svojo kartoteko." },
      { question: "Ali lahko uporabljam račun brez gesla?", answer: "Da. Izberi povezavo iz e-pošte ali Google. Ob prvi uspešni prijavi na ta način nastane račun. Vedno uporabljaj isti e-naslov." },
      { question: "Kaj pa izvid, pridobljen pred registracijo?", answer: "Odpri povezavo do tega izvida in izberi shranjevanje v Dziaderski profil. Po prijavi bo izvid v kartoteki. Samo ustvarjanje računa ne prenese prejšnjih izvidov." },
      { question: "Potrditev ni prispela. Kaj naj naredim?", answer: "Preveri pravilnost naslova in neželeno pošto. V obrazcu lahko potrditev pošlješ znova. Če težava ostaja, piši administratorju, brez gesla ali kode." },
      { question: "Ali me registracija prijavi na bilten?", answer: "Ne. Bilten in objava psevdonima na Častni tabli sta dve ločeni, prostovoljni možnosti v nastavitvah profila. Pozneje ju lahko izključiš." },
    ],
    endTitle: "Kartoteka je pripravljena za odprtje.",
    endText: "Preostalo bo Inštitut dopisoval skupaj s tabo. Prvi pregled lahko opraviš že danes.",
    register: "Pojdi na obrazec", test: "Najprej opravi test",
  },
});

export function RegistrationBenefits({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <div>
      <p className="label text-red">{t.label}</p>
      <h2 className="mt-4 max-w-xl text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.05] tracking-tight">{typo(t.title)}</h2>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{typo(t.intro)}</p>
      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {t.benefits.map((benefit, i) => (
          <div key={benefit.title} className="border-t border-rule pt-4">
            <dt className="text-xl font-bold leading-tight"><span className="label mr-2 text-red">0{i + 1}</span>{benefit.title}</dt>
            <dd className="mt-2 text-ink-soft">{typo(benefit.text)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-xl border-l-2 border-red pl-4 font-sans text-sm leading-relaxed">{typo(t.optional)}</p>
    </div>
  );
}

export function RegistrationDetails({ locale, formId }: { locale: Locale; formId: string }) {
  const t = COPY[locale];
  return (
    <>
      <Section id={`${formId}-kroki`} title={t.stepsTitle}>
        <ol className="grid gap-8 md:grid-cols-3">
          {t.steps.map((step, i) => (
            <li key={step.title}>
              <span aria-hidden="true" className="font-sans text-5xl font-bold text-red">0{i + 1}</span>
              <h3 className="mt-4 text-2xl font-bold leading-tight">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{typo(step.text)}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section id={`${formId}-dane`} title={t.safetyTitle} intro={typo(t.safetyIntro)}>
        <div className="grid gap-8 md:grid-cols-2">
          {t.safeguards.map((item) => (
            <div key={item.title}>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2 max-w-xl leading-relaxed text-ink-soft">{typo(item.text)}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl border-l-2 border-ink pl-4 font-sans text-sm leading-relaxed">{typo(t.passwordTip)}</p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-sans text-sm">
          <li><Link href="/prywatnosc#konto" className="link">{t.privacy}</Link></li>
          <li><Link href="/regulamin" className="link">{t.terms}</Link></li>
          <li><Link href="/kontakt" className="link">{t.contact}</Link></li>
        </ul>
      </Section>
      <Section id={`${formId}-pytania`} title={t.faqTitle}>
        <div className="max-w-3xl divide-y divide-rule border-y border-rule">
          {t.faq.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer items-baseline justify-between gap-4 text-xl font-bold hover:text-red">
                {item.question}<span aria-hidden="true" className="font-sans text-red group-open:hidden">+</span><span aria-hidden="true" className="hidden font-sans text-red group-open:block">−</span>
              </summary>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{typo(item.answer)}</p>
            </details>
          ))}
        </div>
      </Section>
      <section className="bg-ink text-paper">
        <div className="wrap py-12 md:py-16">
          <h2 className="text-3xl font-bold md:text-4xl">{typo(t.endTitle)}</h2>
          <p className="mt-4 max-w-2xl text-paper/75">{typo(t.endText)}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {/* Native fragments scroll again even when the URL already has this hash. */}
            <a href={`#${formId}`} className="btn bg-paper text-ink hover:bg-red hover:text-paper">{t.register} <span aria-hidden="true">↑</span></a>
            <Link href="/test" className="link font-sans">{t.test}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
