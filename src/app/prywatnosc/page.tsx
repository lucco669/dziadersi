import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader, Section } from "@/components/page";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";

export const metadata: Metadata = pageMetadata({
  title: "Polityka prywatności",
  description: "Jakie dane zbiera Instytut Badań nad Dziaderstwem, po co, jak długo je trzyma i jak je usunąć.",
  path: "/prywatnosc",
});

const P = ({ children }: { children: string }) => <p className="mt-4 max-w-3xl leading-relaxed first:mt-0">{typo(children)}</p>;

function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <Section id={id} title={title} className="py-10 md:py-12">
      <div className="border-t border-ink pt-6">{children}</div>
    </Section>
  );
}

export default function PrivacyPage() {
  const { name, email } = site.controller;

  return (
    <main id="tresc">
      <PageHeader
        crumbs={[{ label: "Polityka prywatności" }]}
        title="Polityka prywatności"
        lead={typo("Instytut bada dziaderstwo, nie ludzi. Zbiera tyle danych, ile trzeba do spisu i do konta, i ani jednej skarpety więcej.")}
        meta={`Obowiązuje od ${site.privacyDate}`}
      />

      <Part id="administrator" title="Kto odpowiada za dane">
        {name && email ? (
          <p className="max-w-3xl leading-relaxed">
            {typo(`Administratorem danych jest ${name}. W sprawach danych osobowych prosimy pisać na adres`)}{" "}
            <a href={`mailto:${email}`} className="link">
              {email}
            </a>
            .
          </p>
        ) : (
          <p className="max-w-3xl border-l-2 border-red pl-4 leading-relaxed text-red">
            {typo("Dane administratora zostaną uzupełnione przed uruchomieniem kont.")}
          </p>
        )}
      </Part>

      <Part id="spis" title="Test i Narodowy Spis Dziadersów">
        <P>
          Po zakończeniu Testu Dziadersa do Narodowego Spisu trafiają: odpowiedzi, wynik, rozpoznanie, dzień i godzina badania, informacja, czy był to wywiad rodzinny, czy ta sama przeglądarka badała się już wcześniej (wtedy z poprzednim wynikiem), a także województwo, jeśli ktoś je podał. Do spisu nie trafia imię z certyfikatu, adres IP ani żaden identyfikator osoby lub urządzenia.
        </P>
        <P>
          Tak zebrane dane są anonimowe: nie da się z nich ustalić, kto się badał. Służą do zestawień w Narodowym Spisie i do porównań w teście („tak samo odpowiedziało 38% badanych”). Przechowujemy je bez ograniczenia czasu. W zakresie, w jakim mogłyby być uznane za dane osobowe, podstawą jest prawnie uzasadniony interes Instytutu w prowadzeniu statystyki (art. 6 ust. 1 lit. f RODO).
        </P>
        <P>
          Imię wpisane na certyfikat zapisuje się tylko w linku do wyniku. Instytut go nie przechowuje: widzi je każdy, komu przekażesz link.
        </P>
      </Part>

      <Part id="konto" title="Profil Dziaderski">
        <P>
          Konto wymaga adresu e-mail. Przechowujemy go razem z pseudonimem (jeśli go podasz), zapisanymi wynikami i datami logowania. Robimy to, żeby prowadzić konto (art. 6 ust. 1 lit. b RODO), i tylko tak długo, jak konto istnieje.
        </P>
        <P>
          Konto usuwa się przyciskiem w Profilu Dziaderskim, natychmiast i na zawsze, razem z pseudonimem i kartoteką. Anonimowe wpisy w Narodowym Spisie zostają, bo nie wiadomo, czyje są.
        </P>
        <P>Na adres e-mail wysyłamy wyłącznie wiadomości potrzebne do konta: skierowania do logowania i potwierdzenia zmian. Nie ma newslettera ani reklam.</P>
      </Part>

      <Part id="dostawcy" title="Kto jeszcze ma dostęp">
        <P>
          Supabase przechowuje bazę danych i obsługuje logowanie, na serwerach w Unii Europejskiej. Vercel utrzymuje serwis i liczy odwiedziny bez plików cookie. Brevo wysyła wiadomości e-mail. Każdy z nich przetwarza dane wyłącznie na zlecenie Instytutu. Jeśli dane trafiają przy tym poza Europejski Obszar Gospodarczy, dzieje się to na podstawie standardowych klauzul umownych Komisji Europejskiej.
        </P>
      </Part>

      <Part id="przegladarka" title="Pliki cookie i pamięć przeglądarki">
        <P>
          Plików cookie używamy tylko do logowania: bez nich nie da się utrzymać sesji. Nie ma cookies reklamowych ani śledzących.
        </P>
        <P>
          W pamięci przeglądarki zostają: postęp testu (do zamknięcia karty), ostatni własny wynik (żeby spis policzył powtórki bez żadnego identyfikatora) i skreślenia w Dziaders Bingo. Te dane nie opuszczają przeglądarki, poza poprzednim wynikiem dołączanym do kolejnego badania.
        </P>
      </Part>

      <Part id="prawa" title="Twoje prawa">
        <P>
          Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania i przeniesienia, a także prawo sprzeciwu. Większość z nich załatwia Profil Dziaderski: tam widać wszystko, co o koncie wiemy, i tam można je usunąć. W pozostałych sprawach napisz do Instytutu. Przysługuje ci też skarga do Prezesa Urzędu Ochrony Danych Osobowych.
        </P>
      </Part>
    </main>
  );
}
