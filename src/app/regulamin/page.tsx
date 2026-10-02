import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

export const metadata: Metadata = pageMetadata({
  title: "Regulamin serwisu",
  description: "Zasady korzystania z serwisu DZIADER.SI: Profil Dziaderski, obserwacje terenowe, Komisja Orzekająca i zgłaszanie spraw.",
  path: "/regulamin",
});

/*
 * Plain terms, in plain Polish: the joke stops at the lead. Keep in step with /prywatnosc.
 */

const RULES: { id: string; title: string; points: string[] }[] = [
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
];

export default function TermsPage() {
  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: "Regulamin" }]}
        title="Regulamin serwisu"
        lead={typo("Zasady korzystania z DZIADER.SI. Krótkie, bo dziaders i tak nie czyta instrukcji. Ten jeden raz warto.")}
        meta={`Obowiązuje od ${site.privacyDate}`}
      />

      {RULES.map((rule, i) => (
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
          Dane osobowe opisuje{" "}
          <Link href="/prywatnosc" className="link text-ink">
            polityka prywatności
          </Link>
          . O tym, czym jest Instytut, opowiada strona{" "}
          <Link href="/o-instytucie" className="link text-ink">
            O Instytucie
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
