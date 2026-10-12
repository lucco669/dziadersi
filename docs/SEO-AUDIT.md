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

## Kontrola raportów Coverage — 12 października 2026

Sprawdzono oba archiwa `dziader.si-Coverage-Drilldown-2026-10-12`: 35 adresów w raporcie 404 oraz 48 adresów „Strona zeskanowana, ale jeszcze nie zindeksowana”. Raporty są materiałem diagnostycznym; sam status wykluczenia nie oznacza błędu wymagającego otwarcia strony do indeksowania.

- **33 artykuły z raportu 404** mają słoweńskie slugi pod polskimi ścieżkami, np. `/slownik/koliko-ste-pa-dali-za-to`. Dodano przekierowania 308 na właściwe strony `/sl/slovar/…` i `/sl/atlas/…`. Reguły powstają z istniejących słowników slugów wszystkich sześciu działów, obejmują też alias `/pl/…`, zachowują parametry zapytania i prowadzą bezpośrednio do stron z sitemap. Polskie slugi i adresy wspólne dla obu języków zachowują swoją stronę.
- **`/$` i `/&` pozostają 404**: nie mają odpowiedników w serwisie. Nie przekierowujemy nieznanych adresów na stronę główną. To zgodne z [zaleceniami Google dotyczącymi brakujących stron](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget).
- **Drugi raport zawiera 34 obrazy OG, 10 fontów, favicon, manifest, stronę główną `/sl` i adres logowania**. Fonty i manifest nie są stronami redakcyjnymi. Stare fonty mają hashe poprzedniego wdrożenia; wszystkie dziesięć historycznych adresów jest nieobecnych w lokalnym buildzie, ale wszystkie zasoby wskazane przez aktualny HTML działają. Obrazy OG pozostają dostępne dla robotów i podglądów. Nie dodajemy blokad robots.txt do CSS, JavaScript ani fontów.
- **Konto, profil i wyszukiwarka** mają spójne `noindex, follow` w HTML i HTTP. Prywatne wyniki i operacje zapisu zachowują `noindex, nofollow`. API i manifest mają HTTP `noindex`; żaden z tych adresów nie trafia do sitemap. Nagłówek działa także dla zasobów innych niż HTML: [dokumentacja Google](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).
- **`/sl` działa lokalnie z 200**, właściwym językiem, canonical, hreflang i bez `noindex`. Sam raport „zeskanowana, ale jeszcze nie zindeksowana” nie wskazuje technicznej przyczyny wykluczenia tej strony.

### Rejestracja w obu wydaniach

Dodano publiczne `/rejestracja` i `/sl/registracija`: formularz otwiera rejestrację, a treść wyjaśnia korzyści profilu, trzy sposoby logowania, potwierdzenie adresu, dobrowolne zgody, usuwanie konta i zasady udostępniania wyników. Te same informacje rozszerzają dotychczasową stronę `/konto` i `/sl/racun`. Formularze zachowują bezpieczną, lokalizowaną kontynuację `dalej`; treść nie zmienia mechanizmu uwierzytelniania ani domyślnych zgód.

Nowe strony mają wzajemne hreflang, własny canonical, opis, kartę podglądu danego wydania, `WebPage` i `BreadcrumbList`, wpisy sitemap oraz linki w stopce i menu gościa. Linki przełączające tryb prowadzą do formularza. `useId()` rozdziela etykiety i opisy pól między formularzami utrzymywanymi przez router przy przełączaniu wydania. Strony konta i rejestracji nie wysyłają referrera.

### Weryfikacja i wdrożenie

- `pnpm test`: 63 testy, wszystkie poprawne; `pnpm lint`, `pnpm typecheck`, `pnpm build`: poprawne.
- Lokalny build produkcyjny: **304 strony sitemap**, **298 odrębnych obrazów podglądu** i **44 zasoby z HTML**, bez błędów skanera SEO. Sprawdzono statusy, canonical, hreflang, język, jeden H1, tytuły i opisy, robots, OG/Twitter, JSON-LD i identyfikatory w HTML.
- Wszystkie **33 przekierowania z dostarczonego raportu** zwracają 308 i prowadzą do 200. Przypadkowe adresy `/$` i `/&` zwracają 404. Surowe wyniki: `artifacts/qa/coverage-2026-10-12.json` i `artifacts/qa/seo-local-after.json` (ignorowane przez Git).
- Przeglądarka: rejestracja w obu językach, przełącznik wydania, etykiety formularza, układ mobilny 390 px i desktop. Kontrola nie obejmuje tworzenia prawdziwego konta ani wysyłania e-maili.
- **Produkcja zwracała 429 z `X-Vercel-Mitigated: challenge`** do żądań automatycznych, w tym dla `/sl`, robots.txt i sitemap.xml. To ogranicza możliwość potwierdzenia aktualnego stanu produkcji; nie dowodzi, że zweryfikowany Googlebot lub Bingbot otrzymuje ten sam wynik.

Po wdrożeniu uruchomić test aktywnego adresu `/sl` i strony rejestracji w Google Search Console oraz inspekcję adresów w Bing Webmaster Tools. Sprawdzić w logach Vercel, czy zweryfikowane roboty otrzymują 200 dla stron publicznych, robots.txt, sitemap.xml i zasobów renderowania; dostosować regułę powodującą challenge, jeśli blokuje te roboty. Potwierdzić pobranie `https://dziader.si/sitemap.xml` przez obie usługi i uruchomić walidację naprawionych 404 w GSC. Bez dostępu do tych paneli nie wykonano zgłoszeń ani zmian zapory. [Bing ocenia zgłoszone strony przed indeksowaniem i nie gwarantuje indeksacji](https://www.bing.com/webmasters/help/why-is-my-site-not-in-the-index-2141dfab).
