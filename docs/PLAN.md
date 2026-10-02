# DZIADER.SI: plan, design and content rules

## 1. The product in one paragraph

**Instytut Badań nad Dziaderstwem** is the wrapper brand. The **Atlas Dziadersów** is the main body of content. The **Test Dziadersa** is the engine. Everything is presented completely seriously, like a statistics office or a natural history institute, and the joke lives only in the content. The growth loop:

> Google → "7 objawów Dziadersa Grillowego" → Test → 82%, Dziaders Grillowo-Motoryzacyjny → certificate → Messenger / Instagram → friends click dziader.si → they take the test.

The Atlas, Słownik and Raporty bring search traffic (a long tail of pages). The Test turns that traffic into shares.

## 2. Phases

### Phase 0: front page and brand system ✅ (this repository)

- The Institute's front page, five blocks with one idea each: the hero with Rys. 1 (the labelled specimen), the live National Index drawn as 100 figures, the Atlas plate of the ten nationwide species, the test with the certificate, and the dictionary entry of the day next to the latest report.
- Brand primitives: the head mark, the wordmark, the seal, stamps and the pictogram set (`src/components/pictograms.tsx`).
- Share images for every page, the favicon set (`favicon.ico`, adaptive `icon.svg`, `apple-touch-icon.png`, manifest icons including a maskable one), the web manifest, robots, sitemap, 404.
- Fully static. Date-dependent parts regenerate every hour, so the site looks alive with no backend.

### Phase 1: Test Dziadersa and the certificate (the viral loop) ✅

- `/test`: form "IBD-T2", a periodic check-up in five rooms. The intro asks who is being examined (yourself, or someone close in a **family interview**) and for an optional name, and shows the routing slip ("Karta obiegowa"). Then 16 tasks, one per screen, in different formats:
  - **Room I, Wywiad lekarski:** two choices and an SMS reply in a phone ("Młody pisze: jestem").
  - **Room II, Pracownia psychologiczna:** two Rorschach plates and a timed word association (Sobota, Lato, Poniedziałek; hesitation is noted, not punished).
  - **Room III, Pracownia sprawności:** the horn test (red, red and amber, green: honk at the car that doesn't move; honking early is a "falstart", and the horn sounds), then tap where you park at the market and where the windbreak goes at 6:30 on the beach. What a spot means is revealed only after the tap.
  - **Room IV, Inwentaryzacja:** tick what is in the drawer and in the boot (the drawing fills up), and a thermometer for socks with sandals (the sock grows).
  - **Room V, Konsultacja końcowa:** two choices, the third plate, and a rapid yes/no series against the clock ("milczenie oznacza zgodę").
- Answer order is shuffled per respondent (seeded, so a reload keeps it), and every answer is written as a joke, the sensible ones included. Each room ends with a stamp on the slip and the doctor's interim suspicion. Number keys answer, Enter continues, Backspace goes back, and progress survives a reload. Countdowns are off for `prefers-reduced-motion`.
- Scoring (`src/lib/test.ts`): every task gives 0–3 points (the score is the percentage of 48) and weights towards Atlas species. Species affinity is measured against random answering and damped for thin evidence. The result is one species or a hybrid; "Utajony" and "Pospolity" cover answers with no clear species. In simulations every species wins under random answering, and a respondent leaning to one species is recognised 73–84% of the time.
- Result codes are stateless: "2" + every answer packed as one mixed-radix number (14 base36 chars, the family-interview flag included) + the date, then the name after `~`. **Codes starting with "1" are the retired 24-question IBD-T1**: they decode and score exactly as before (`src/content/test-v1.ts`, never edit). Tasks in IBD-T2 must never be reordered or resized; a new edition gets a new code version.
- `/wynik/[kod]`: score, verdict stamp, diagnosis, scale against today's NID, certificate (marked "na podstawie wywiadu rodzinnego" for family interviews), case description, species notes, **lab results** ("Wyniki badań laboratoryjnych": 12 parameters on real blood-test abbreviations such as OB, CRP, PLT and ALT, plus the horn reaction time, driven by the score and species shares and flagged ↑/↓; `src/content/lab.ts`), the examination protocol, and a band for the next person: ranking, family interview, test again.
- **Rankings** (`/grupa/[lista]`): result codes joined with dots, at most 12. A result links to its own ranking; anyone opening it can join through `/test?grupa=…` and lands on the updated list, which they share on. Two people get a duel (scores, "zgodność dziaderska", shared symptoms); three or more get the list with Isotype tallies, the dominant species and the most and least compatible pair. Still no database: the URL is the ranking.
- Images: `/wynik/[kod]/opengraph-image` (1200×630), `/wynik/[kod]/certyfikat?format=post|relacja` (1080×1350, 1080×1920), `/wynik/[kod]/badania` (the lab printout, 1080×1350) and `/grupa/[lista]/opengraph-image`. All are CDN-cached for a year. `/test` has its own card with Plansza IV.
- Result and ranking pages are `noindex`. One sample of each is prerendered; other codes render on first visit and are then served from cache.

### Phase 2: Atlas, Słownik, Raporty and Indeks (search traffic) ✅

- `/atlas` covers 28 species: 10 nationwide (the ones the test diagnoses), 12 regional ones (one per voivodeship on the map) and 6 occasional ones (`occasion` set: seen only at weddings, on Christmas Eve, in the window, in queues, at football on TV, on campsites). Occasional and regional species are never diagnosed; the test edition is frozen.
  - The index page has the species plates (pictograms), the regional map and a dichotomous identification key.
  - Each `/atlas/[slug]` page has a description, "7 objawów …" (the title targets searches like "objawy dziadersa"), vocalisations, handling advice, and a species card: traits, status, a 12-month activity calendar, and the range.
  - Each also links to related species, dictionary phrases, reports, and the test.
- `/slownik` holds 50 phrases in an A–Z index with the word of the day. Each `/slownik/[slug]` page has the definition, pronunciation, example, cross-references, and the species it belongs to.
- `/raporty` holds 8 papers. Each `/raporty/[slug]` page has headline figures, an abstract, sections, conclusions, a bar chart, methodology, "Jak cytować" and share links.
- `/indeks` has the live panel, the full-year chart, the seasons and warning levels, this year's risk calendar, the regional ranking, and the methodology.
- Every page has its own OG card, all prerendered at build. JSON-LD covers BreadcrumbList, Article, Report, DefinedTerm(Set), CollectionPage with an ItemList, and Dataset on the relevant pages, and WebSite + Organization on the homepage. Metadata for every page comes from one helper, `pageMetadata()` in `src/lib/seo.ts` (canonical, Open Graph, Twitter). The sitemap is generated from content.
- Content is plain TS under `src/content/`. URL slugs are explicit and must never change once published.
- **Still to grow before heavy promotion:** 50 species and 10 reports (the dictionary reached 50). Adding an entry is one object in the relevant file, and its page, OG image, sitemap entry and links are generated automatically.

### Phase 3: toys (cheap, shareable, no backend) ✅

- **Rozmówki dziaderskie** (`/generator`): a phrasebook in eight chapters (samochód, remont, urlop, restauracja, komputer, dzieci sąsiadów, pogoda, zakupy). A line is an opener, a claim and a punchline, each a whole sentence, so any three read as one line (9,600 in all). The parts spin like reels, any of them can be held ("Zostaw", keys 1–3), the figure reads the line aloud (Web Speech, Polish voice when available), and a "rozbiór" underlines the parts the way Polish lessons mark parts of a sentence. Each line has its own page and share card at `/generator/[kod]` ("samochod-3b7": chapter plus one base36 digit per part). Content: `src/content/phrasebook.ts`, append-only.
- **Dziaders Bingo** (`/bingo`): cards for a wedding, Christmas Eve, a name day, the May long weekend, a family car trip and the seaside. A card (`/bingo/[karta]`, "wesele-3k9fz") is 24 squares drawn from the occasion's pool by a seed, around a free centre. Tap to cross out in red ink; five in a line draws a red line and stamps BINGO. Marks stay in this browser only. Each card has a share card, a print style (A4, without the site around it) and `/bingo/[karta]/druk` with four different cards on one sheet. Content: `src/content/bingo.ts`; changing a pool reshuffles that occasion's cards.
- Drawings: eight chapter icons and occasion plates in `src/components/occasions.tsx`. The wedding and Christmas Eve reuse the Weselny and Wigilijny species plates, the long weekend and the seaside the Grillowy and Wakacyjny ones; the name day (sweater, raised glass, wall unit, salad bowl) and the car trip (paper map, estate car with a roof box) have their own.
- Signed-in players get more: a winning bingo card files itself in the profile, and any Rozmówki line can be kept with "Zachowaj".

### Phase 4: Supabase, accounts and community (in progress)

Setup, environment variables and the email hook: `supabase/README.md`. SQL migrations live in `supabase/migrations/` and are run by hand in the SQL Editor.

- **Narodowy Spis Dziadersów** (`/spis`) ✅: every finished test goes to `/api/wyniki`, which validates the code and stores it in `public.results` without the name, with the optional voivodeship from the test intro and a retake flag (the last own score is remembered in the browser; no identifier is sent). The page shows totals, the share with at least "podwyższone", zones, species ranking, top hybrids, the most common answer to every task, the falstart share, results by hour with the most dziaderski time, voivodeships and retakes. Aggregates come from server-only SQL functions, cached for minutes; nothing is published below 30 results.
- **Live comparisons** ✅: between rooms the test shows "tak samo odpowiedziało X% badanych" for the room just finished (`/api/spis/odpowiedzi`), the result protocol shows it per finding, and the percentile on the result page becomes real once the census has 30 results.
- **Profil Dziaderski** ✅: magic-link accounts (`/konto`: email, then the link or the six-digit code). `/profil` shows the species collection (10 plates, missing ones faded), nine badges computed from saved results, the test history, nickname, sign-out and account deletion. Tests finished while signed in are filed automatically; older results via "Zapisz w Profilu Dziaderskim" on the result page (`/profil/zapisz/[kod]`). `src/proxy.ts` refreshes sessions on these routes only; the rest of the site stays static.
- **Branded email** ✅: Supabase's Send Email Hook calls `/api/auth/email` (Standard Webhooks signature checked), which renders the Institute's letterhead (`src/emails/`: paper card, red certificate stripe, ink button, the code as a red stamp, text version included) and sends through Brevo.
- **Privacy** ✅: `/prywatnosc`. The data controller (`site.controller` in `src/lib/site.ts`) must be filled in before launch.
- **Community migration** (`supabase/migrations/20261002160000_community.sql`, run it by hand like the others): sightings, bookmarks (`saved_items`), verdicts, case submissions and daily tallies, plus `community_summary()`, `case_tally()` and `tally()`. Everything reads through `getCommunity()` (`src/lib/community.ts`), cached for minutes, and every page degrades to dots and dashes while the migration is missing.
- **Account presence, quietly** ✅: the header shows "Profil" (a red dot and the nickname once signed in), and one-line mentions sit where they help: under the test's start button, under the certificate on a result page, next to "Cały Atlas" on the front page, under the census figures, after a bingo and after a guest's verdict. Static pages stay static: `src/components/account.tsx` checks for the Supabase cookie first, and only signed-in visitors call `/api/konto` (cached a minute in sessionStorage).
- **Obserwacje terenowe** ✅: on every species page a signed-in visitor reports a sighting (one per species per day, voivodeship optional). The Atlas shows totals, this week's most observed species and the latest reports; the profile keeps the observation log (all 28 plates, counts, first dates).
- **Zakładki** ✅: Rozmówki lines, winning bingo cards and exams, kept with one button. Guests go through `/profil/zachowaj?rodzaj=…&kod=…`, which signs them in and files the bookmark.
- **Badges** now number 16, all computed: the original nine plus Obserwator, Sieć terenowa, Regionalista, Egzamin zdany, Ławnik, Sygnalista and Bingo.
- **Komisja Orzekająca** (`/czy-to-juz-dziaderstwo`) ✅: 30 curated cases (`src/content/cases.ts`, docket numbers IBD-K n/26, append-only). A case shows the facts and the party's defence; visitors vote with three stamps (to jeszcze nie / to już / kliniczne), then see the split and the Commission's justification and verdict. Anonymous votes are remembered by the browser, signed-in judges vote once per case and see their verdicts in the profile. The front page carries the case of the day. Signed-in judges can propose cases (three a day) into a moderation queue that is never published automatically: read `case_submissions` in the Supabase table editor and write accepted cases into `cases.ts`.
- **Egzamin terenowy** (`/egzamin`) ✅: 12 identification questions drawn by a seed from a frozen pool of the 28 species (`src/lib/exam.ts`), with seven kinds of clue (call, symptom, habitat, enemies, field marks, plate, Latin). Graded on the Polish school scale, 1 to 6; grades 5 and 6 get the red stripe on the certificate. Result codes are stateless like the test's (`/egzamin/[kod]`, "1" + seed + answers + day), with a share card.
- **Mały Rocznik Statystyczny** (`/statystyki`) ✅: the yearbook in the manner of GUS: six divisions (badania, obserwacje, Komisja, pomoce naukowe, zbiory, przeliczenia), numbered tables, Isotype rows where the last symbol is cut to the remainder (one pot of rosół = three hours of testing), unit conversions with their methodology, and the GUS legend of conventional signs ("–" did not occur, "·" no information, "x" not applicable). Tallies come from `/api/licznik` (sendBeacon, allowlisted kinds, no identifiers): Rozmówki lines and readings, bingo cards, squares and bingos, exams, horn presses in the test, certificate downloads and shares.
- **O Instytucie** and **Regulamin** ✅: the statute, history, organisation chart (each unit runs a real department) and FAQ in `src/content/institute.ts`; plain terms of use, needed before user-submitted cases.
- **Navigation** ✅: a mega menu grouped like an organisation chart (Badania, Zbiory, Dane, Pomoce naukowe), with a pictogram per department (`src/components/menu-icons.tsx`) and the profile line at the bottom. Phones get a "Działy" sheet and a scrolling row of the departments. The footer uses the same groups.
- Next: the Hall of Fame; rankings as real groups that update for everyone; a weekly census email; Google sign-in; a public map of observations by voivodeship.

### Phase 5: shop

- Merch that looks like a good lifestyle brand, not a market-stall T-shirt: the seal, species plates, "Certyfikowany Dziaders". Use print-on-demand (Printful/Gelato) behind a simple storefront, and only after traffic proves out.

## 3. Information architecture

| URL | Phase |
| --- | --- |
| `/` | 0 |
| `/test`, `/wynik/[kod]`, `/wynik/[kod]/badania`, `/grupa/[lista]` | 1 |
| `/atlas`, `/atlas/[slug]` | 2 |
| `/slownik`, `/slownik/[slug]` | 2 |
| `/raporty`, `/raporty/[slug]` | 2 |
| `/indeks` (methodology and archive) | 2 |
| `/generator`, `/generator/[kod]`, `/bingo`, `/bingo/[karta]`, `/bingo/[karta]/druk` | 3 |
| `/spis`, `/konto`, `/profil`, `/profil/zachowaj`, `/prywatnosc` | 4 |
| `/czy-to-juz-dziaderstwo`, `/czy-to-juz-dziaderstwo/[slug]`, `/egzamin`, `/egzamin/[kod]`, `/statystyki` | 4 |
| `/o-instytucie`, `/regulamin` | 4 |
| `/hall-of-fame` | next |

## 4. Design system

**Concept:** a real Polish public institute that happens to study dziaderstwo. It is set in Antykwa Półtawskiego, the typeface of Polish schoolbooks and official print, and illustrated with picture statistics in the manner of Isotype, the pictograms statistics offices used in the 1930s. The seriousness is the joke. Restraint is the style: no costume props.

**Never:** gradients, glow, glassmorphism, emoji as icons, rows of rounded cards with shadows, grain textures, rotated decorations, uppercase letter-spaced kickers on every element, `§` section numbering, giant footer wordmarks, meme fonts, stock photos, photos of real people, or "haha" copy.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#f4f0e7` | Page background, flat |
| `paper-deep` | `#ebe5d7` | Hover fills |
| `ink` | `#161513` | Text, rules, buttons, pictograms, the test band |
| `ink-soft` / `ink-faint` / `rule` | `#57524a` / `#8a8376` / `#d8d0c0` | Secondary text, captions, hairlines |
| `red` | `#c4362c` | The stamp: the logo dot, stamps and seals, the certificate stripe, "today" markers, numbering, hover |
| `blue` / `ochre` / `grey` | `#3d6696` / `#d49a2a` / `#cec6b6` | Pictograms only |

**Type:**
- **Poltawski Nowy** (the revival of Antykwa Półtawskiego) for headlines, running text and the wordmark. Bold for headings, italic for Latin names and quotes.
- **Schibsted Grotesk** for the interface: navigation, buttons, labels, captions and figures in charts. Sentence case.
- No monospace.

**Pictograms** (`src/components/pictograms.tsx`):
- One figure on a 40 × 100 grid: a round head with a white mustache, a torso with a belly, shorts, white socks and sandals. Poses, hats, legs and torso details (apron, vest, tie, sweater) are options.
- Every species has a plate (120 × 100): the figure with its attributes, e.g. tongs and a grill, a bucket on a parking space, a parawan. A new species needs a plate in `PLATES`.
- Picture statistics: `Crowd` (100 figures, `count` of them dziaders, in a fixed scattered order) and `Tally` (ten figures for a percentage).
- The same drawings render in generated images through `src/lib/svg-string.ts`.
- Motion: plates animate on hover and where marked `animated` (smoke, the kick, the float, rain). The hero diagram draws its leader lines and the mustache twitches. Everything stops for `prefers-reduced-motion`.
- Test scenes are drawn in the same language (`src/components/test/`): the car park and the beach from above, the crossing for the horn test, the drawer and the boot with 18 small objects, the thermometer with the sock. The traffic light's green (`#4e8b5f`) is the only colour outside the palette.
- The Komisja's bench (three judges, the chair with a gavel that comes down now and then) is in `src/components/court.tsx`; the field observer with binoculars (`Binoculars` torso) heads the exam.
- Menu pictograms (`src/components/menu-icons.tsx`, 48 × 40): one per department, each with one small movement on hover (the stamp lands, the gavel strikes, the bars grow, the cross is drawn).
- Isotype symbols for the Rocznik (`src/components/isotype.tsx`, 24 × 24): a pot of rosół, a horn, a speech bubble, a crossed square, binoculars, a gavel, a certificate, a fridge. `IsoRow` picks a round unit and cuts the last symbol to the remainder.

**Raster art:** the Rorschach plates are the one place where drawing by hand would look fake. They were generated with ChatGPT image generation (through the Codex CLI), converted to transparent WebP (`public/plansze/`, colour-to-alpha against white, so they sit on any background) and kept as PNG for share images (`assets/plansze/`). Plansza IV appears only on the `/test` share card.

**Layout:**
- Every page is the same template: `PageHeader` (breadcrumbs, h1, lead, a line of facts, an optional picture), then `Section`s, each starting on one ink hairline, then `TestPromo`, the one black band before the footer.
- Lists are rows on hairlines. The only framed object is the certificate, which is a document.
- The red stripe on the certificate is the stripe of a Polish school certificate awarded with distinction.

## 5. Voice and content rules

- Deadpan academic Polish. Specific numbers ("73%", "3 lata i 2 miesiące", "n = 412"). Cite "Źródło: IBD".
- Mock habits, not people: no real names or photos, no politics, religion or health, and nothing aimed at age as such.
- Regional jokes stay affectionate (Ciechocinek dancing, yes; insults, no).
- Polish typography: „cudzysłowy”, an en dash for ranges, non-breaking spaces after one-letter words (`typo()` does this), and balanced headline wrapping.
- **New species checklist** (fields from `Species`): code, name, Latin name with authority, status (IUCN code), habitat, activity, two vocalisations, natural enemies, field marks, three behavioural traits (0–100), a one-line teaser, and a plate in `PLATES` (`src/components/pictograms.tsx`). An LLM can draft entries, but a human edits every one for the tone above.

## 6. Technical decisions

- **Next.js 16.3 with Cache Components.** `getBulletin()` is `"use cache"` with `cacheLife("hours")`, so the homepage is prerendered and regenerated in the background every hour. Dates are computed in Europe/Warsaw, not UTC.
- **The index is a model, not data:** seasonal peaks plus deterministic noise, so every visitor sees the same number, the chart has a real-looking history and forecast, and it never needs a database.
- **No database until Phase 4.** Test results live in the URL.
- **OG images** use `next/og` with static TTFs bundled in `assets/fonts` (no network at build time). Pictograms are embedded as SVG data URIs via `src/lib/svg-string.ts`.
- **Icons:** `src/app/favicon.ico` (16, 32 and 48 px), `src/app/icon.svg` (switches to paper on ink in dark mode), `public/apple-touch-icon.png` (no link tag: iOS fetches it from the root by name), and `public/icon-192.png`, `icon-512.png` and `icon-maskable-512.png` for the manifest (`src/app/manifest.ts`). They are all drawn from the head mark.
- **Analytics:** Vercel Web Analytics (`src/components/analytics.tsx`), cookieless. The name part of result URLs (`~…`) is stripped before anything is sent. Page views of `/test` against `/wynik/[kod]` give the completion funnel. Custom events (`Test rozpoczęty`, `Test ukończony` with zone and species, `Udostępnienie` with the channel) are only visible on Vercel's Pro plan.

## 7. Launch checklist

- [ ] Vercel project connected to `main`, `dziader.si` added, `www` redirecting to the apex
- [ ] Check the link preview in the Facebook Sharing Debugger, the LinkedIn Post Inspector and a real Messenger chat
- [ ] Google Search Console with the sitemap submitted
- [x] Privacy page before adding analytics; terms before any user-generated content
- [ ] Run `supabase/migrations/20261002160000_community.sql` (observations, bookmarks, Komisja, tallies)
- [ ] Fill in `site.controller` (name and email) in `src/lib/site.ts`: the privacy policy, terms and About page point to it
- [x] Phase 1 shipped before any promotion. The test is what turns visits into shares.
- [ ] Paste a real result link into Messenger and WhatsApp and check the certificate preview

## 8. Deploying to Vercel with dziader.si

1. vercel.com → **Add New → Project** → import `lucco669/dziadersi`. The Next.js preset and pnpm are detected automatically, and no environment variables are needed.
2. **Project → Settings → Domains**: add `dziader.si`, then `www.dziader.si` set to redirect to `dziader.si`.
3. At the `.si` domain registrar, create exactly the DNS records Vercel shows on that screen (an A record for the apex and a CNAME for `www`), or point the domain's nameservers to Vercel. HTTPS is issued automatically once DNS resolves.
4. Every push to `main` deploys to production, and other branches get preview URLs.
