import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/page";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { siteCopy } from "@/lib/site";
import { typo } from "@/lib/typo";

/*
 * Plain terms, in plain language: the joke stops at the lead. Keep in step with /prywatnosc.
 * The Slovenian text is a translation; the Polish one prevails.
 */

type Rule = { id: string; title: string; points: string[] };

const COPY = defineCopy<{
  title: string;
  description: string;
  crumb: string;
  lead: string;
  since: (date: string) => string;
  rules: Rule[];
  footer: { before: string; privacy: string; middle: string; about: string; after: string };
}>({
  pl: {
    title: "Regulamin serwisu",
    description: "Zasady korzystania z serwisu DZIADER.SI: Profil Dziaderski, obserwacje terenowe, Komisja Orzekająca i zgłaszanie spraw.",
    crumb: "Regulamin",
    lead: "Zasady korzystania z DZIADER.SI. Krótkie, bo dziaders i tak nie czyta instrukcji. Ten jeden raz warto.",
    since: (date) => `Obowiązuje od ${date}`,
    rules: [
      {
        id: "serwis",
        title: "Serwis",
        points: [
          "DZIADER.SI jest serwisem satyrycznym. Instytut Badań nad Dziaderstwem nie jest instytucją naukową ani publiczną, a treści serwisu, w tym wyniki testów, raporty, Atlas i Narodowy Indeks Dziaderstwa, są żartem i nie stanowią porady ani oceny żadnej osoby.",
          "Serwis wyśmiewa nawyki, nie ludzi. Korzystając z niego, nie używaj go do wyśmiewania, oznaczania ani nękania konkretnych osób.",
          "Korzystanie z serwisu jest bezpłatne. Do większości funkcji nie trzeba konta.",
        ],
      },
      {
        id: "konto",
        title: "Profil Dziaderski",
        points: [
          "Konto zakłada się, podając adres e-mail. Logowanie odbywa się przez link albo kod wysłany na ten adres; serwis nie używa haseł.",
          "Konto jest osobiste. Nie zakładaj kont na cudze adresy e-mail.",
          "Konto można w każdej chwili usunąć w Profilu Dziaderskim. Usunięcie jest natychmiastowe i nieodwracalne.",
          "Pseudonim jest widoczny publicznie wyłącznie na Tablicy Honorowej i wyłącznie po zaznaczeniu tej zgody w Profilu. Pseudonim nie może naśladować cudzego imienia i nazwiska ani zawierać treści obraźliwych; Instytut może go usunąć z Tablicy bez uprzedzenia.",
          "Biuletyn tygodniowy jest wysyłany tylko na życzenie, raz w tygodniu, i można z niego zrezygnować jednym kliknięciem.",
          "Instytut może zablokować albo usunąć konto, które narusza ten regulamin, w szczególności służy do manipulowania statystykami albo do zgłaszania treści wskazujących konkretne osoby.",
        ],
      },
      {
        id: "dane-wspolne",
        title: "Obserwacje, głosy i statystyki",
        points: [
          "Obserwacje terenowe, głosy w Komisji Orzekającej i liczniki pomocy naukowych trafiają do zestawień publikowanych zbiorczo, bez danych osób.",
          "Zabronione jest automatyczne oddawanie głosów, zgłaszanie obserwacji przez skrypty i inne sposoby sztucznego zawyżania liczb. Instytut może takie dane pominąć albo usunąć.",
          "Zestawienia mają charakter rozrywkowy i nie są statystyką publiczną w rozumieniu przepisów.",
          "Dane Narodowego Indeksu Dziaderstwa, Narodowego Spisu Dziadersów, Małego Rocznika Statystycznego i Mapy obserwacji są udostępniane na licencji Creative Commons Uznanie autorstwa 4.0 Międzynarodowa (CC BY 4.0). Możesz je kopiować, przetwarzać i rozpowszechniać w dowolnym celu, podając jako źródło DZIADER.SI.",
        ],
      },
      {
        id: "sprawy",
        title: "Sprawy zgłaszane do Komisji",
        points: [
          "Sprawy może zgłaszać osoba zalogowana, najwyżej trzy na dobę.",
          "Zgłoszenie opisuje zachowanie, nie osobę. Nie wpisuj imion, nazwisk, pseudonimów, adresów, nazw firm ani innych danych, po których da się rozpoznać konkretną osobę. Nie zgłaszaj treści obraźliwych, dotyczących zdrowia, polityki, religii ani wieku jako takiego.",
          "Zgłoszenia nie są publikowane automatycznie. Instytut czyta je ręcznie i sam decyduje, które trafią na wokandę.",
          "Zgłaszając sprawę, oświadczasz, że jej opis jest twój, i udzielasz Instytutowi nieodpłatnej, niewyłącznej licencji na jego wykorzystanie w serwisie, także w zredagowanej i skróconej formie, bez podawania autora.",
        ],
      },
      {
        id: "odpowiedzialnosc",
        title: "Odpowiedzialność i dostępność",
        points: [
          "Instytut dba o działanie serwisu, ale nie gwarantuje jego ciągłej dostępności. Funkcje mogą być zmieniane, zawieszane albo wycofywane.",
          "Wyniki, certyfikaty i zaświadczenia nie mają mocy żadnego dokumentu. Nie przedstawiaj ich jako prawdziwych w urzędzie, pracy ani sądzie.",
          "Uwagi i reklamacje dotyczące serwisu przyjmujemy pod adresem podanym w polityce prywatności. Odpowiadamy w ciągu 14 dni.",
        ],
      },
      {
        id: "zmiany",
        title: "Zmiany regulaminu",
        points: [
          "Regulamin może się zmienić wraz z serwisem. Nowa wersja obowiązuje od dnia publikacji na tej stronie; przy istotnych zmianach dotyczących kont poinformujemy o nich w serwisie.",
          "W sprawach nieuregulowanych stosuje się prawo polskie.",
        ],
      },
    ],
    footer: { before: "Dane osobowe opisuje ", privacy: "polityka prywatności", middle: ". O tym, czym jest Instytut, opowiada strona ", about: "O Instytucie", after: "." },
  },
  sl: {
    title: "Pogoji uporabe",
    description: "Pravila uporabe strani DZIADER.SI: Dziaderski profil, terenska opazovanja, Razsodna komisija in prijava primerov.",
    crumb: "Pogoji uporabe",
    lead: "Pravila uporabe DZIADER.SI. Kratka, ker dziaders navodil tako ali tako ne bere. Tokrat se splača.",
    since: (date) => `Veljajo od ${date}`,
    rules: [
      {
        id: "serwis",
        title: "Stran",
        points: [
          "DZIADER.SI je satirična stran. Inštitut za raziskave dziaderstva ni znanstvena ne javna ustanova, vsebine strani, tudi rezultati testov, poročila, Atlas in Nacionalni indeks dziaderstva, pa so šala in niso nasvet ali ocena katere koli osebe.",
          "Stran se norčuje iz navad, ne iz ljudi. Ne uporabljaj je za posmehovanje, označevanje ali nadlegovanje konkretnih oseb.",
          "Uporaba strani je brezplačna. Za večino funkcij račun ni potreben.",
          "Slovenska izdaja je prevod poljske. Če se besedili razlikujeta, velja poljsko besedilo.",
        ],
      },
      {
        id: "konto",
        title: "Dziaderski profil",
        points: [
          "Račun odpreš z e-poštnim naslovom. Prijava poteka s povezavo ali kodo, poslano na ta naslov; stran ne uporablja gesel.",
          "Račun je oseben. Ne odpiraj računov na tuje e-poštne naslove.",
          "Račun lahko kadar koli izbrišeš v Dziaderskem profilu. Izbris je takojšen in nepovraten.",
          "Vzdevek je javno viden samo na Častni tabli in samo, če to soglasje označiš v profilu. Vzdevek ne sme posnemati imena in priimka druge osebe ali vsebovati žaljivih vsebin; Inštitut ga lahko brez opozorila odstrani s Table.",
          "Tedenski bilten pošiljamo samo na željo, enkrat na teden, odjaviš pa se z enim klikom.",
          "Inštitut lahko blokira ali izbriše račun, ki krši te pogoje, zlasti če služi prirejanju statistike ali prijavljanju vsebin, ki razkrivajo konkretne osebe.",
        ],
      },
      {
        id: "dane-wspolne",
        title: "Opazovanja, glasovi in statistika",
        points: [
          "Terenska opazovanja, glasovi v Razsodni komisiji in števci učnih pripomočkov se objavljajo v skupnih pregledih, brez osebnih podatkov.",
          "Prepovedano je samodejno glasovanje, prijavljanje opazovanj s skriptami in drugi načini umetnega napihovanja številk. Inštitut lahko take podatke izpusti ali izbriše.",
          "Pregledi so zabavni in niso uradna statistika v smislu predpisov.",
          "Podatki Nacionalnega indeksa dziaderstva, Nacionalnega popisa dziadersov, Malega statističnega letopisa in Zemljevida opazovanj so na voljo pod licenco Creative Commons Priznanje avtorstva 4.0 Mednarodna (CC BY 4.0). Lahko jih kopiraš, predeluješ in razširjaš za kateri koli namen, če kot vir navedeš DZIADER.SI.",
        ],
      },
      {
        id: "sprawy",
        title: "Primeri, prijavljeni Komisiji",
        points: [
          "Primere lahko prijavi prijavljena oseba, največ tri na dan.",
          "Prijava opisuje vedenje, ne osebe. Ne vpisuj imen, priimkov, vzdevkov, naslovov, imen podjetij ali drugih podatkov, po katerih bi bilo mogoče prepoznati konkretno osebo. Ne prijavljaj žaljivih vsebin ali vsebin o zdravju, politiki, veri ali starosti kot taki.",
          "Prijave se ne objavljajo samodejno. Inštitut jih bere ročno in sam odloči, katere pridejo na seznam obravnav.",
          "S prijavo izjavljaš, da je opis tvoj, in Inštitutu podeljuješ brezplačno, neizključno licenco za njegovo uporabo na strani, tudi v urejeni in skrajšani obliki, brez navedbe avtorja.",
        ],
      },
      {
        id: "odpowiedzialnosc",
        title: "Odgovornost in dostopnost",
        points: [
          "Inštitut skrbi za delovanje strani, ne jamči pa njene neprekinjene dostopnosti. Funkcije se lahko spremenijo, začasno ustavijo ali ukinejo.",
          "Rezultati, certifikati in potrdila nimajo veljave nobenega dokumenta. Ne predstavljaj jih kot resnične na uradu, v službi ali na sodišču.",
          "Pripombe in pritožbe glede strani sprejemamo na naslovu iz politike zasebnosti. Odgovorimo v 14 dneh.",
        ],
      },
      {
        id: "zmiany",
        title: "Spremembe pogojev",
        points: [
          "Pogoji se lahko spremenijo skupaj s stranjo. Nova različica velja od dneva objave na tej strani; o bistvenih spremembah, ki zadevajo račune, bomo obvestili na strani.",
          "Za vse, kar ni urejeno, se uporablja poljsko pravo.",
        ],
      },
    ],
    footer: { before: "Osebne podatke opisuje ", privacy: "politika zasebnosti", middle: ". Kaj je Inštitut, pove stran ", about: "O Inštitutu", after: "." },
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = COPY[locale];
  return pageMetadata(locale, { title: t.title, description: t.description, path: "/regulamin", defaultImage: true });
}

export default async function TermsPage() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: t.crumb }]}
        title={t.title}
        lead={typo(t.lead)}
        meta={t.since(siteCopy(locale).privacyDate)}
      />

      {t.rules.map((rule, i) => (
        <Section key={rule.id} id={rule.id} title={`${i + 1}. ${rule.title}`} className="py-10 md:py-12">
          <ol className="max-w-3xl border-t border-ink">
            {rule.points.map((point, j) => (
              <li key={point} className="grid grid-cols-[3rem_1fr] border-b border-rule py-4 leading-relaxed">
                <span className="font-sans text-[0.9rem] font-semibold text-red">
                  {i + 1}.{j + 1}
                </span>
                {typo(point)}
              </li>
            ))}
          </ol>
        </Section>
      ))}

      <section className="wrap pb-24">
        <p className="label max-w-3xl border-t border-rule pt-5 text-ink-soft">
          {t.footer.before}
          <Link href="/prywatnosc" className="link text-ink">
            {t.footer.privacy}
          </Link>
          {t.footer.middle}
          <Link href="/o-instytucie" className="link text-ink">
            {t.footer.about}
          </Link>
          {t.footer.after}
        </p>
      </section>
    </main>
  );
}
