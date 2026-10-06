# Kontrola SEO i stanu serwisu — 6 października 2026

Sprawdzono dziesięć dostarczonych raportów CSV i raport SEOMaster, aktualną stronę produkcyjną oraz kod obu wydań. Zalecenia zapisane w załączniku potraktowano jako materiał audytu, a nie polecenie dodawania nieistniejących danych firmy.

## Potwierdzone problemy i poprawki

| Obszar | Ustalenie | Zmiana |
| --- | --- | --- |
| Podglądy linków | Regulamin i prywatność w obu wydaniach miały tytuł, opis i adres OG, ale nie miały obrazu. | Karty tych stron korzystają z obrazu strony głównej odpowiedniego wydania. Dodano też obraz zapasowy dla kontaktu, logowania, profilu i wyszukiwarki. Własne karty Atlasu, raportów i pozostałych działów zachowano. Twitter dziedziczy ostateczny obraz OG. |
| Opisy | 19 stron w produkcyjnej mapie miało opisy dłuższe niż przyjęty budżet 160 znaków; polska prywatność miała krótki, ogólny opis. | Skrócono opisy działów po polsku i słoweńsku. Uzupełniono opis prywatności w obu wydaniach. Wspólny helper ogranicza również opisy dynamiczne na granicy słowa; naprawiono przypadek długiego tekstu bez spacji. |
| Kontakt | Kontakt e-mail i administrator byli podani na istniejących podstronach, lecz nie w stopce; brakowało osobnej strony kontaktowej. | Dodano `/kontakt` i `/sl/kontakt`, linki i e-mail w stopce, wpisy sitemap z hreflang oraz dane `ContactPage`. `Organization` zawiera opublikowany e-mail i `ContactPoint`. |
| Zakładki | Link „Zachowaj” dla gościa prowadził do endpointu zapisu, a dopiero potem przez 307 do logowania. | Link prowadzi bezpośrednio do logowania, z zachowaniem właściwego adresu kontynuacji w obu językach. Ma `rel="nofollow"` i wyłączony prefetch. Zapis po zalogowaniu pozostaje dostępny. |
| Prywatne wyniki | HTML mówił `noindex, follow`, a nagłówek HTTP wyników i rankingów mówił `noindex, nofollow`. | Ujednolicono te reguły dla wyników, rankingów migawkowych i udostępnionych odpowiedzi. Uzupełniono prywatne nagłówki endpointów zachowywania zakładek. |
| Zgłaszanie bezpieczeństwa | Brak `security.txt`. | Dodano `/.well-known/security.txt`, kontakt e-mail, canonical, języki i termin ważności. `/security.txt` przekierowuje 308 na właściwy adres. |

160 znaków to budżet redakcyjny, a nie wymaganie Google. Google dobiera długość fragmentu do szerokości urządzenia i może wykorzystać treść strony zamiast meta description: [dokumentacja fragmentów wyników](https://developers.google.com/search/docs/appearance/snippet). Obraz jest wymaganym polem [Open Graph](https://ogp.me/).

## Ostrzeżenia, które nie wymagają usuwania

- Logowanie, profil, wyszukiwarka, wyniki, karty bingo, pojedyncze wypowiedzi i pozostałe warianty generowane mają zamierzone `noindex`. Nie są dodawane do mapy stron. Raporty `noindex` częściowo obejmują te same adresy.
- Samo występowanie `noindex` zarówno w HTML, jak i HTTP nie jest błędem. Najistotniejsze są zgodne reguły i brak przypadkowego wykluczenia treści publicznych: [dokumentacja robots Google](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).
- Przekierowania wymagane przez logowanie oraz aliasy językowe zachowano. Nie należy otwierać prywatnych zapisów dla robotów tylko po to, aby zmniejszyć liczbę 3xx.
- Telefon, siedziba, godziny otwarcia, identyfikatory firmy, opinie i `LocalBusiness` nie zostały dopisane: serwis przedstawia fikcyjny instytut satyryczny. Istniejące CTA wykonania testu są widoczne na stronie głównej.
- Nie potwierdzono zgłoszonego powielonego identyfikatora ani błędu JavaScript na produkcyjnej stronie głównej. Wszystkie 272 adresy produkcyjnej sitemap miały status 200, canonical i jeden H1.
- Zgłoszone 26 s dla logowania nie powtórzyło się w tej próbie: około 1,3 s. Wypowiedź `/generator/komputer-029` zwróciła 200 w około 0,47 s. To pojedyncze pomiary, nie wyniki Core Web Vitals ani dowód usunięcia okresowych opóźnień.
- CSP zachowuje obsługę skryptów inline potrzebnych do prerenderowanych stron Next.js. Zmiana na nonce wymaga osobnego rozwiązania uwzględniającego cache i wydajność.

## Weryfikacja zmian

- `pnpm test`: 36 testów, wszystkie poprawne, w tym regresje SEO i kompletność tłumaczeń.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`: poprawne.
- HTTP na lokalnym buildzie produkcyjnym: wszystkie 274 strony sitemap mają 200, poprawny język, canonical, hreflang, pojedynczy H1 i pełne OG/Twitter. Opisy mieszczą się w budżecie. Nie stwierdzono powielonych identyfikatorów ani tytułów/opisów w obrębie wydania; JSON-LD jest poprawnym JSON-em.
- Wszystkie 270 odrębnych adresów obrazów podglądu oraz 35 zasobów wskazanych w HTML zwróciły 200. Sprawdzono wybór karty językowej i zachowanie dedykowanej karty gatunku, prywatne reguły wyników, linki zakładek, `security.txt` i status 404.
- Przeglądarka: kontakt w obu językach, przełącznik języka, układ mobilny 390 px i bezpośrednie przejście gościa do logowania w wydaniu słoweńskim. W sprawdzonych widokach nie odnotowano ostrzeżeń ani błędów konsoli; polski kontakt nie ma poziomego przepełnienia.
- Lokalne wyniki i zrzut ekranu znajdują się w ignorowanym `artifacts/qa/`. Kontrola nie obejmuje wysyłania e-maila ani zapisywania do konta zalogowanego użytkownika.

## Poza repozytorium i po wdrożeniu

W odczycie publicznego DNS potwierdzono brak CAA, delegacji DNSSEC przez DS oraz rekordów `_mta-sts` i `_smtp._tls`. Ich konfiguracja wymaga dostępu do operatora DNS/poczty i zweryfikowania używanych usług. Nie zmieniano rekordów ani SPF na podstawie samej punktacji audytora.

Zmiany są lokalne. Po wdrożeniu należy powtórzyć skan produkcji i sprawdzić indeksowanie w Google Search Console. Ta kontrola techniczna nie gwarantuje wyniku 100/100 ani pozycji w wyszukiwarce.

Kontakt w `security.txt` należy ponownie sprawdzić i odnowić przed **5 października 2027**, zgodnie z [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116.html).
