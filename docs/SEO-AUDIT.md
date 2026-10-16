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

## Raport SEOMaster i Search Console — 16 października 2026

Sprawdzono pełny eksport SEOMaster z 16 października: 8 otwartych ostrzeżeń, 9 informacji, inwentarz 543 adresów, 2108 wystąpień reguł oraz dane Search Console z okna 18.07–16.10.2026. Wszystkie zmiany sprawdzono na lokalnym buildzie produkcyjnym.

### Osiem ostrzeżeń

| Ostrzeżenie | Ustalenie | Zmiana |
| --- | --- | --- |
| PageSpeed 84/100 i LCP 4,2 s (telefon) | Elementem LCP na telefonie jest nagłówek strony głównej, nie obraz. Spadek z 93 do 84 zbiegł się z wdrożeniem z 13 października: React wstawiał na początek `<head>` preload trzech rycin populacji (151 KB), preload obejmował też dwa pliki kursywy Półtawskiego (74 KB), a zamknięte okno wyszukiwania pobierało indeks wyszukiwarki (124 KB) przy każdym wejściu na stronę. | Ryciny w nagłówku są ładowane leniwie (React nie dodaje dla nich preloadu), kursywa należy do tej samej rodziny, ale nie jest wstępnie ładowana, a indeks pobiera dopiero otwarcie wyszukiwarki. Lighthouse 13.5 (telefon, lokalnie, 3 pomiary): wydajność 82 → 85–90, LCP 5,0 → 3,5–4,2 s, dostępność 97 → 100. Wariant z wstępnie ładowaną kursywą dał 85 i LCP 4,4 s. |
| Powtórzony title (1 grupa) | `/kontakt` i `/sl/kontakt` miały ten sam tytuł „Kontakt · DZIADER.SI”: słowo brzmi tak samo w obu językach. | Osobne tytuły w obu wydaniach; nagłówek strony bez zmian. W 318 stronach sitemap nie ma już tytułu wspólnego dla dwóch adresów. |
| WCAG 1.4.3, kontrast | Etykieta zapowiedzi „Króla grilla” (czerwień `#c4362c` na `#ebe5d7`): 4,28:1. axe na wszystkich 318 stronach znalazł to samo połączenie w nagłówku sygnałów przewodników i w bieżącym wierszu tabeli sezonów Indeksu (4,34:1). | Na tych tłach `text-red-deep` (5,75:1). Tabela sezonów, przewijana w bok na telefonie, jest dostępna z klawiatury (`tabindex`, `role="region"`). |
| Strony osierocone: 20 | Wynik pochodzi ze skanu z 12 października (436 adresów, 234 odpowiedzi 429 z zabezpieczenia Vercel), więc mapa linków była niepełna. Skan z 13 października: 0 stron osieroconych. | Dodatkowo strona główna i Atlas linkują do `/dziaders` opisowym tekstem, a każdy przewodnik okazjonalny linkuje do dwóch pozostałych (wcześniej pojedyncze linki wewnętrzne). |
| Hreflang wskazuje noindex: 172 | Karty bingo, wypowiedzi Rozmówek, egzaminy, wersje do druku i konto miały wzajemne hreflang, choć oba adresy są `noindex`. | `pageMetadata` nie dodaje hreflang do stron `noindex` (canonical zostaje). Test regresji w `tests/seo.test.ts`. |
| Błędy JS podczas renderowania | Skan z 12 października renderował stronę zabezpieczenia Vercel (25 słów, brak H1, 1 błąd konsoli na stronę). Skan z 13 października: 0 błędów, treść zgodna z HTML. | Bez zmian w kodzie. W WebKit (iPhone) i Chromium nie wystąpiły błędy JS na żadnej z 327 sprawdzonych stron (poza przerwanymi prefetchami przy przejściu na kolejną stronę). |
| Linki zewnętrzne 4xx: 50 (i 50 przekierowań) | Przyciski udostępniania były zwykłymi linkami do `x.com/intent/post` (robot dostaje 404) i `facebook.com/sharer` (przekierowanie do logowania). | Facebook, WhatsApp i X otwierają się z przycisku (`window.open`) i nie są publikowane jako linki w HTML. W HTML stron udostępnianych nie ma już linków zewnętrznych. |
| LCP 4,2 s | Ten sam pomiar co PageSpeed. | Jak wyżej. |

### Informacje i warianty adresów

- **Linki wewnętrzne nofollow (170) i warianty z parametrem (41).** Każdy link „zaloguj się, a…” niesie adres powrotu (`/konto?dalej=…`), więc 60 stron gatunków i pomocy tworzyło ok. 170 odmian stron konta i rejestracji. `robots.txt` zamyka robotom pobieranie odmian z parametrem (`/konto?`, `/rejestracja?`, `/sl/racun?`, `/sl/registracija?`), `/auth/` oraz kroki zapisu do profilu, w obu grupach robotów. Same strony konta pozostają dostępne z `noindex`. `rel="nofollow"` usunięto z linków wewnętrznych.
- **Strony z noindex (172) i linki do nich.** Zamierzone: konto, profil, karty, wypowiedzi, wyniki. Bez zmian.
- **Rekord CAA.** Wymaga dostępu do DNS. Vercel wystawia certyfikaty przez Let's Encrypt; jeśli domena nie korzysta z innego wystawcy: `@ 3600 IN CAA 0 issue "letsencrypt.org"`. Przed dodaniem sprawdzić wystawcę bieżącego certyfikatu.

### Search Console

Domena jest młoda: 61 wyświetleń i 2 kliknięcia w 28 dniach, średnia pozycja 11,1. Jedyną spójną grupą zapytań są pytania o znaczenie słowa („dziaderstwo”, „dziaders”, „dziaders co to znaczy”, „dziaderstwo co to znaczy”; pozycje 16–38). Odpowiadały na nie na zmianę strona główna, `/dziaders`, Atlas i strony gatunków.

- `/dziaders`: tytuł „Dziaders i dziaderstwo — co to znaczy? Definicja” (SL: „… kaj pomeni? Definicija”), definicja wprost obejmuje także „dziaderstwo”, dwa nowe pytania (czym jest dziaderstwo, skąd pochodzi słowo), dane `FAQPage` i `DefinedTerm`.
- Strona główna i Atlas linkują do `/dziaders` tekstem „Co znaczy „dziaders”?”, wskazując ją jako stronę z definicją.
- Pozostałe zapytania mają 1–3 wyświetlenia. „Mały rocznik statystyczny 2026” dotyczy najpewniej publikacji GUS, więc tytuł `/statystyki` pozostał bez roku.

### Telefony i iPhone

Wszystkie strony sitemap oraz konto, rejestracja, profil, wyszukiwarka, 404, karta bingo i wypowiedź (327 adresów) sprawdzono w WebKit (profile iPhone SE 1. i 3. generacji, iPhone 15, iPhone 17 Pro Max) i Chromium (Pixel 7, Galaxy S8 360 px): poziome przepełnienie, pola formularzy poniżej 16 px (iOS powiększa stronę przy fokusie), błędy JS i wielkość celów dotyku. Sprawdzono też arkusz działów, wyszukiwarkę (pole 20 px) i start testu. Przed zmianami: 166 stron z przepełnieniem przy 320 px i 3 przy 375–393 px. Po zmianach: 0 na każdym profilu, 0 błędów JS, 0 pól poniżej 16 px. axe (WCAG 2.2 AA) na wszystkich 318 stronach: 0 naruszeń.

- Przy szerokości 320 px (iPhone SE 1. generacji, tryb Display Zoom na nowszych iPhone'ach) przycisk testu w nagłówku wychodził poza ekran na 166 stronach. Poniżej 360 px przycisk ma krótki napis „Test”, nagłówek strony głównej i nagłówki stron są mniejsze, a stopka ma jedną kolumnę.
- Przy 375 i 393 px: dymek z cytatem (długie słowa słoweńskie), przykładowy protokół egzaminu i długie nazwy gatunków poszerzały kolumnę. Siatki dostały `grid-cols-1` (kolumna nie rośnie ponad ekran), a nagłówki, dymki, nazwy gatunków w kafelkach i ranking województw łamią słowo tylko wtedy, gdy nie mieści się w wierszu.
- Okruszki i przyciski udostępniania mają cel dotyku co najmniej 24 px wysokości.

Surowe wyniki (ignorowane przez Git) i skrypty kontroli są w katalogu roboczym sesji; `artifacts/qa/check-seo.mjs` sprawdza teraz link zakładki bez `nofollow`.

### Po wdrożeniu

- Ponowić skan SEOMaster. Wyniki z 12 października (osierocone strony, błędy JS) należy zamknąć dopiero po nowym, pełnym skanie.
- W Search Console: inspekcja `/dziaders` i `/sl/dziaders` z prośbą o indeksowanie, test `robots.txt`.
- Rozważyć regułę zapory Vercel przepuszczającą zweryfikowane roboty i narzędzie audytu; challenge z 12 października fałszował wyniki audytu.
