# Slovenska izdaja: the Slovenian edition

The Slovenian edition is **a translation of a Polish institute's publications**, not a Slovenian institute. The Institute studies Polish dziaders; the Slovenian reader gets an exotic report on the neighbours and recognises their own uncles anyway. Polish references stay in the text. Where a Slovenian reader needs help, a dry **translator's note** (`op. prev.`) explains it, and sometimes points at the Slovenian relative ("Slovenski bralec ga pozna iz Rogaške Slatine.").

Everything is translated: pages, menus, content, share images, certificates, emails. Proper names of Polish places, brands and TV shows stay Polish.

## How it is built

- Routes live in `src/app/[lang]/`. Polish URLs have no prefix (`/atlas`); `next.config.ts` rewrites them to `/pl/…`. Slovenian URLs are `/sl/…` with Slovenian words (`/sl/slovar/…`), mapped in `src/i18n/segments.ts`. `/si` redirects to `/sl`.
- Code always builds **internal paths**: route folders without the locale, with the edition's own content slugs (`/slownik/${entry.slug}`). `import Link from "@/i18n/link"` localises them; elsewhere use `localizePath(path, locale)` from `@/i18n/routes`.
- The locale: `await getLocale()` (`@/i18n/server`) in Server Components and server utilities; `useLocale()` (`@/i18n/client`) in Client Components; `params.lang` in route handlers and image routes; an explicit argument in Server Actions and functions shared with the client. Use `useInternalPath()` instead of `usePathname()` when comparing with hrefs.
- **Interface copy** sits next to the code that uses it, in a `defineCopy({ pl: {...}, sl: {...} })` object (`@/i18n/copy`). The Polish object defines the shape; the type check fails until Slovenian matches. Functions are fine for interpolation and plurals.
- **Content** (`src/content/*.ts`) stays Polish and is the source of truth for structure and data. Each translated module has an overlay in `src/content/sl/` with only the text, in the same shape (`Text<T>` from `@/i18n/overlay`), keyed by a stable id. Arrays keep the Polish order and length, so seeds, result codes and indices mean the same in both editions. Read content through the module's `get…(locale)` accessor; lookups take the locale as their last argument.
- Slovenian content slugs live in `src/content/sl/slugs/`, keyed by the Polish slug, so the language switcher and hreflang can map a page to its twin. Codes in URLs (results, bingo cards, Rozmówki lines, exams, rankings) are the same in both editions.
- **Adding content in Polish**: add the Slovenian overlay entry (and slug) in the same change. `pnpm test` fails on missing translations; until then the entry shows in Polish.

## Voice

- Deadpan officialese of a public institute, as in a SURS yearbook or a ZRC SAZU monograph. Short sentences. The joke lives in the content, never in winks.
- Translate the joke, not the words. Keep the rhythm of lists, the three-part lines in the Rozmówki, the punchline at the end.
- Address the reader with **ti** (informal), like the Polish edition: "Preglej se, preden bo prepozno."
- Natural, current standard Slovenian. No Croatianisms, no Serbisms, no anglicisms the Polish didn't use. Light colloquial flavour only inside quoted speech ("A veš, kako je blo včasih?" is fine in a quote, not in the Institute's prose).
- Quoted speech of dziaders stays recognisably a dad, an uncle, a neighbour: the Slovenian equivalent phrase, not a literal calque. "Za moich czasów…" → "V mojih časih …".

## Typography

- Quotes: »…« (and ›…‹ inside). Use `quote(text, locale)` from `@/lib/typo` where code adds quotes.
- Decimal comma, thousands with a dot from 10.000 (`formatNumber(locale, n)`), 24-hour time, dates "3. oktober 2026" (`formatDate`).
- `typo()` keeps one-letter words (v, s, z, k, h, o, a, i, u, w) off line ends in both languages.
- Plurals: Slovenian has four forms (1, 2, 3–4, 5+ and 0): `pluralSl(n, one, two, few, other)`, e.g. `pluralSl(n, "vrsta", "vrsti", "vrste", "vrst")`.
- Superscript digits ¹ ² ³ mark a translator's note in content text; the note itself goes in the entry's `notes` array and starts with the marked term: "¹ Krupówki: glavna sprehajalna ulica v Zakopanah …".

## Translator's notes (op. prev.)

- At most three per entry, only where a Polish reference would otherwise be lost: places, TV, shops, holidays, school grades, the PRL.
- One or two sentences, in the Institute's dry voice. The best ones end with the Slovenian counterpart.
- Never explain a joke.

## Glossary

### The Institute

| Polish | Slovenian |
| --- | --- |
| Instytut Badań nad Dziaderstwem | Inštitut za raziskave dziaderstva (the acronym stays **IBD**, as foreign institutions keep theirs) |
| Instytut | Inštitut |
| dziaders (pl. dziadersi) | dziaders, -a (m.); pl. **dziadersi**, dziadersov; dual dziadersa |
| dziaderstwo | dziaderstvo |
| dziaderski | dziaderski |
| Serwis satyryczny | Satirična stran |
| Zbadaj się, zanim będzie za późno. | Preglej se, preden bo prepozno. |
| Wydanie polskie / Wydanie słoweńskie | Poljska izdaja / Slovenska izdaja |
| przypis tłumacza | opomba prevajalca, op. prev. |

### Departments (title · short · URL)

| Polish | Slovenian |
| --- | --- |
| Test Dziadersa · Test · /test | Test dziadersa · Test · /sl/test |
| Wynik (result page) · /wynik | Izvid · /sl/izvid |
| Egzamin terenowy · Egzamin · /egzamin | Terenski izpit · Izpit · /sl/izpit |
| Komisja Orzekająca · Komisja · /czy-to-juz-dziaderstwo | Razsodna komisija · Komisija · /sl/je-to-ze-dziaderstvo |
| Czy to już dziaderstwo? | Je to že dziaderstvo? |
| Atlas Dziadersów · Atlas | Atlas dziadersov · Atlas |
| Słownik Dziaderski · Słownik · /slownik | Dziaderski slovar · Slovar · /sl/slovar |
| Raporty Instytutu · Raporty · /raporty | Poročila Inštituta · Poročila · /sl/porocila |
| Biuletyn tygodniowy · Biuletyn · /biuletyn | Tedenski bilten · Bilten · /sl/bilten |
| Narodowy Indeks Dziaderstwa (NID) · Indeks | Nacionalni indeks dziaderstva (NID) · Indeks |
| Narodowy Spis Dziadersów · Spis · /spis | Nacionalni popis dziadersov · Popis · /sl/popis |
| Mały Rocznik Statystyczny · Rocznik · /statystyki | Mali statistični letopis · Letopis · /sl/statistika |
| Mapa obserwacji · Mapa · /obserwacje | Zemljevid opazovanj · Zemljevid · /sl/opazovanja |
| Tablica Honorowa · Tablica · /tablica-honorowa | Častna tabla · Tabla · /sl/castna-tabla |
| Rozmówki dziaderskie · Rozmówki · /generator | Dziaderski pogovornik · Pogovornik · /sl/pogovornik |
| Superinteligencja · SI · /superinteligencja | Superinteligenca · SI · /sl/superinteligenca (the model keeps its name, SZWAGIER 1.9 TDI; a translator's note says szwagier is svak) |
| 1.9 TDI z namysłem · Elektryk | 1.9 TDI s premislekom · Električni |
| Dziaders Bingo · Bingo | Dziaders bingo · Bingo |
| Kartka z kalendarza · Kalendarz · /kalendarz | Trgalni koledar · Koledar · /sl/koledar |
| Profil Dziaderski · Profil | Dziaderski profil · Profil |
| Legitymacja Obserwatora | Opazovalska izkaznica |
| Wyszukiwarka · /szukaj | Iskalnik · /sl/iskanje |
| O Instytucie · Regulamin · Polityka prywatności | O Inštitutu · Pogoji uporabe · Politika zasebnosti |
| Konto (sign-in) · /konto | Račun · /sl/racun |
| Ranking (grupa) · /grupa | Lestvica · /sl/lestvica |
| Groups: Badania · Zbiory · Dane · Pomoce naukowe | Raziskave · Zbirke · Podatki · Učni pripomočki (short: Pripomočki) |
| Wykonaj test | Opravi test |
| Nowość | Novo |

### The test and the result

| Polish | Slovenian |
| --- | --- |
| badanie okresowe | obdobni pregled |
| gabinet (Gabinet I…V) | ordinacija (Ordinacija I…V) |
| Wywiad lekarski · Pracownia psychologiczna · Pracownia sprawności · Inwentaryzacja · Konsultacja końcowa | Anamneza · Psihološki laboratorij · Laboratorij za spretnost · Inventura · Zaključni posvet |
| Karta obiegowa | Obhodni list |
| wywiad rodzinny (testing someone else) | heteroanamneza (po pripovedi svojcev) |
| rozpoznanie | diagnoza |
| certyfikat | certifikat |
| wyniki badań laboratoryjnych | laboratorijski izvidi |
| protokół badania | zapisnik pregleda |
| plansza (Rorschach) | tabla (Tabla I, II…) |
| klakson, falstart | hupa, prehiter start |
| krzyżówka (hybrid) | križanec |
| poziom: podwyższony etc. | keep the clinical register: povišan, močno povišan … |
| Utajony / Pospolity | Prikriti / Navadni |
| Polish school grades 1–6 (egzamin) | keep the 1–6 scale and explain once: "po poljski šolski lestvici, kjer je 6 najvišja" |

### Species

Species names are proper names in both editions: capitalised first word, adjective first, as Slovenian vernacular names go. Latin names and authorities never change. Hybrids join a prefix and a lowercase suffix: **Žarno-avtomobilski dziaders**.

| key | Polish | Slovenian | genitive | prefix · suffix | sl slug |
| --- | --- | --- | --- | --- | --- |
| grill | Dziaders Grillowy | Žarni dziaders | Žarnega dziadersa | Žarno · žarni | zarni-dziaders |
| parking | Dziaders Parkingowy | Parkirni dziaders | Parkirnega dziadersa | Parkirno · parkirni | parkirni-dziaders |
| budowa | Dziaders Budowlany | Gradbeni dziaders | Gradbenega dziadersa | Gradbeno · gradbeni | gradbeni-dziaders |
| moto | Dziaders Motoryzacyjny | Avtomobilski dziaders | Avtomobilskega dziadersa | Avtomobilsko · avtomobilski | avtomobilski-dziaders |
| wakacje | Dziaders Wakacyjny | Počitniški dziaders | Počitniškega dziadersa | Počitniško · počitniški | pocitniski-dziaders |
| facebook | Dziaders Facebookowy | Facebookovski dziaders | Facebookovskega dziadersa | Facebookovsko · facebookovski | facebookovski-dziaders |
| smart | Dziaders Smart-Home | Smart-home dziaders | Smart-home dziadersa | Tehnološko · tehnološki | smart-home-dziaders |
| dzialka | Dziaders Działkowy | Vrtičkarski dziaders | Vrtičkarskega dziadersa | Vrtičkarsko · vrtičkarski | vrtickarski-dziaders |
| wedka | Dziaders Wędkarski | Ribiški dziaders | Ribiškega dziadersa | Ribiško · ribiški | ribiski-dziaders |
| korpo | Dziaders Korporacyjny | Korporativni dziaders | Korporativnega dziadersa | Korporativno · korporativni | korporativni-dziaders |
| zeglarz | Dziaders Żeglarski | Jadralski dziaders | Jadralskega dziadersa | | jadralski-dziaders |
| grzybiarz | Dziaders Grzybiarski | Gobarski dziaders | Gobarskega dziadersa | | gobarski-dziaders |
| przygraniczny | Dziaders Przygraniczny | Obmejni dziaders | Obmejnega dziadersa | | obmejni-dziaders |
| oszczednosciowy | Dziaders Oszczędnościowy | Varčni dziaders | Varčnega dziadersa | | varcni-dziaders |
| uzdrowiskowy | Dziaders Uzdrowiskowy | Zdraviliški dziaders | Zdraviliškega dziadersa | | zdraviliski-dziaders |
| gorski | Dziaders Górski | Gorski dziaders | Gorskega dziadersa | | gorski-dziaders |
| festiwalowy | Dziaders Festiwalowy | Festivalski dziaders | Festivalskega dziadersa | | festivalski-dziaders |
| golebiarz | Dziaders Gołębiarz | Golobarski dziaders | Golobarskega dziadersa | | golobarski-dziaders |
| jurajski | Dziaders Jurajski | Jurski dziaders | Jurskega dziadersa | | jurski-dziaders |
| meteorologiczny | Dziaders Meteorologiczny | Meteorološki dziaders | Meteorološkega dziadersa | | meteoroloski-dziaders |
| krupowkowy | Dziaders Krupówkowy | Krupówkovski dziaders | Krupówkovskega dziadersa | | krupowkovski-dziaders |
| bieszczadzki | Dziaders Bieszczadzki | Bieszczadski dziaders | Bieszczadskega dziadersa | | bieszczadski-dziaders |
| weselny | Dziaders Weselny | Svatbeni dziaders | Svatbenega dziadersa | occasion: na svatbah | svatbeni-dziaders |
| wigilijny | Dziaders Wigilijny | Svetovečerni dziaders | Svetovečernega dziadersa | occasion: na sveti večer | svetovecerni-dziaders |
| parapetowy | Dziaders Parapetowy | Okenski dziaders | Okenskega dziadersa | occasion: na oknu | okenski-dziaders |
| kolejkowy | Dziaders Kolejkowy | Čakalni dziaders | Čakalnega dziadersa | occasion: v čakalnih vrstah | cakalni-dziaders |
| kibicowski | Dziaders Kibicowski | Navijaški dziaders | Navijaškega dziadersa | occasion: ob prenosih tekem | navijaski-dziaders |
| kempingowy | Dziaders Kempingowy | Kamperski dziaders | Kamperskega dziadersa | occasion: v kampih | kamperski-dziaders |

Threat status (IUCN, Slovenian terms, masculine): EX izumrl · EW izumrl v naravi · CR skrajno ogrožen · EN ogrožen · VU ranljiv · NT potencialno ogrožen · LC najmanj ogrožen.

### Voivodeships

Polish data stays Polish: the sixteen voivodeships, with their Slovenian names (as on Slovenian Wikipedia), "vojvodstvo" after the adjective:

ZP Zahodnopomorjansko · PM Pomorjansko · WN Varminsko-mazursko · PD Podlaško · LB Lubuško · WP Velikopoljsko · KP Kujavsko-pomorjansko · MZ Mazovijsko · DS Spodnješlezijsko · LD Lodžko · SK Svetokriško · LU Lublinsko · OP Opolsko · SL Šlezijsko · MA Malopoljsko · PK Podkarpatsko

### Places and things

Established exonyms: Varšava, Krakov, Gdansk, Vroclav, Poznanj, Lodž, Šlezija, Pomorjanska, Mazurija, Tatre, Baltik, Visla. Everything smaller keeps its Polish spelling (Zakopane, Krupówki, Ciechocinek, Hel, Bieszczady, Jura). Money stays in złoty: "zlot", pl. "zlotov", symbol zł. PRL → "Ljudska republika Poljska (PRL)" on first mention, then PRL. Wigilia → sveti večer (the Polish Christmas Eve supper is explained once in a note). Majówka → prvomajski podaljšani vikend. Imieniny → godovanje. Działka → vrtiček (allotment). Szczypce (grill tongs) → **klešče** (za žar), never prijemalka. Parawan → vetrobran. Pilot → daljinec. Szwagier → svak. Fachowiec → mojster. Ławnik → porotnik.
