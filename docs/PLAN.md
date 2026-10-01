# DZIADER.SI: plan, design and content rules

## 1. The product in one paragraph

**Instytut Badań nad Dziaderstwem** is the wrapper brand. The **Atlas Dziadersów** is the main body of content. The **Test Dziadersa** is the engine. Everything is presented completely seriously, like a statistics office or a natural history institute, and the joke lives only in the content. The growth loop:

> Google → "7 objawów Dziadersa Grillowego" → Test → 82%, Dziaders Grillowo-Motoryzacyjny → certificate → Messenger / Instagram → friends click dziader.si → they take the test.

The Atlas, Słownik and Raporty bring search traffic (a long tail of pages). The Test turns that traffic into shares.

## 2. Phases

### Phase 0: front page and brand system ✅ (this repository)

- The Institute's front page, five blocks with one idea each: the hero with Rys. 1 (the labelled specimen), the live National Index drawn as 100 figures, the Atlas plate of the ten nationwide species, the test with the certificate, and the dictionary entry of the day next to the latest report.
- Brand primitives: the head mark, the wordmark, the seal, stamps and the pictogram set (`src/components/pictograms.tsx`).
- Share images for every page, the favicon set (`favicon.ico`, adaptive `icon.svg`, `apple-icon.png`, manifest icons including a maskable one), the web manifest, robots, sitemap, 404.
- Fully static. Date-dependent parts regenerate every hour, so the site looks alive with no backend.

### Phase 1: Test Dziadersa and the certificate (the viral loop) ✅

- `/test`: form "IBD-T1". An intro with an optional "signature" (the name on the certificate), then 24 questions, one per screen. Each answer is crossed out in ink before the next question. Keys 1–4 answer, Backspace goes back, and progress survives a reload. A short "Instytut analizuje wyniki" sequence runs while the result is prefetched.
- Scoring (`src/lib/test.ts`): every answer gives 0–3 points (the score is the percentage of 72) and weights towards Atlas species. Each species' affinity is measured against what random answering would give, and damped for species with few questions. The result is one species, or a hybrid ("Dziaders Grillowo-Motoryzacyjny") when two are close. "Utajony" and "Pospolity" cover answers with no clear species. In simulations every species wins about equally often, and a respondent's own species is recognised about 72% of the time.
- `/wynik/[kod]`: the code stores the 24 answers and the test date in 14 characters, plus the name as base64url after `~`. No database is involved. The page shows the score, the verdict stamp, the diagnosis, a scale against today's NID, the certificate, the case description with recommendations, species notes from the Atlas, and the examination protocol. Names are sanitised, and vulgar ones are filtered, both when written and when read.
- Sharing: native share (which reaches Messenger and Instagram on phones), copy link, Facebook, WhatsApp, X and e-mail. On phones the story image can be sent directly as a file. The name can be added or changed on the result page.
- Images: `/wynik/[kod]/opengraph-image` (the link preview certificate, 1200×630) and `/wynik/[kod]/certyfikat?format=post|relacja` (1080×1350 and 1080×1920 PNGs). A code always renders the same image, so images are CDN-cached for a year. `/test` has its own share card.
- Result pages are `noindex`. One sample is prerendered, and every other code renders on its first visit and is then served from cache.

### Phase 2: Atlas, Słownik, Raporty and Indeks (search traffic) ✅

- `/atlas` covers 22 species: 10 nationwide (the ones the test diagnoses) and 12 regional ones, one per voivodeship on the map.
  - The index page has the species plates (pictograms), the regional map and a dichotomous identification key.
  - Each `/atlas/[slug]` page has a description, "7 objawów …" (the title targets searches like "objawy dziadersa"), vocalisations, handling advice, and a species card: traits, status, a 12-month activity calendar, and the range.
  - Each also links to related species, dictionary phrases, reports, and the test.
- `/slownik` holds 26 phrases in an A–Z index with the word of the day. Each `/slownik/[slug]` page has the definition, pronunciation, example, cross-references, and the species it belongs to.
- `/raporty` holds 5 papers. Each `/raporty/[slug]` page has headline figures, an abstract, sections, conclusions, a bar chart, methodology, "Jak cytować" and share links.
- `/indeks` has the live panel, the full-year chart, the seasons and warning levels, this year's risk calendar, the regional ranking, and the methodology.
- Every page has its own OG card, all prerendered at build. JSON-LD covers BreadcrumbList, Article, Report, DefinedTerm(Set), CollectionPage with an ItemList, and Dataset on the relevant pages, and WebSite + Organization on the homepage. Metadata for every page comes from one helper, `pageMetadata()` in `src/lib/seo.ts` (canonical, Open Graph, Twitter). The sitemap is generated from content.
- Content is plain TS under `src/content/`. URL slugs are explicit and must never change once published.
- **Still to grow before heavy promotion:** 50 species, 50 dictionary entries and 10 reports. Adding an entry is one object in the relevant file, and its page, OG image, sitemap entry and links are generated automatically.

### Phase 3: toys (cheap, shareable, no backend)

- **Generator wypowiedzi**: template-based lines by situation (car, renovation, holiday, restaurant, computer, the neighbour's kids).
- **Dziaders Bingo**: seeded boards for a wedding, Christmas Eve, a long weekend or the seaside, printable and shareable by URL.

### Phase 4: community (needs a backend and moderation)

- **Czy to już dziaderstwo?**: users submit situations and the community votes TAK / NIE / DZIADERSTWO KLINICZNE.
- **Dziaderometr** (a daily 0–10 poll) and **Hall of Fame**.
- Requirements: a database (Neon/Postgres via the Vercel Marketplace, or Supabase), rate limiting, a **pre-moderation** queue, a report button, terms of use and a privacy policy (GDPR/RODO).
- Do not launch user content without moderation. Real people's stories and photos create real legal risk (image rights, personal rights).
- Later: optional accounts with a "Profil Dziaderski", badges and the history of test results.

### Phase 5: shop

- Merch that looks like a good lifestyle brand, not a market-stall T-shirt: the seal, species plates, "Certyfikowany Dziaders". Use print-on-demand (Printful/Gelato) behind a simple storefront, and only after traffic proves out.

## 3. Information architecture

| URL | Phase |
| --- | --- |
| `/` | 0 |
| `/test`, `/wynik/[kod]` | 1 |
| `/atlas`, `/atlas/[slug]` | 2 |
| `/slownik`, `/slownik/[slug]` | 2 |
| `/raporty`, `/raporty/[slug]` | 2 |
| `/indeks` (methodology and archive) | 2 |
| `/generator`, `/bingo` | 3 |
| `/czy-to-juz-dziaderstwo`, `/hall-of-fame` | 4 |
| `/o-instytucie`, `/regulamin`, `/prywatnosc` | before Phase 4, or as soon as analytics is added |

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
- **Icons:** `src/app/favicon.ico` (16, 32 and 48 px), `src/app/icon.svg` (switches to paper on ink in dark mode), `src/app/apple-icon.png`, and `public/icon-192.png`, `icon-512.png` and `icon-maskable-512.png` for the manifest (`src/app/manifest.ts`). They are all drawn from the head mark.
- **Analytics:** Vercel Web Analytics (`src/components/analytics.tsx`), cookieless. The name part of result URLs (`~…`) is stripped before anything is sent. Page views of `/test` against `/wynik/[kod]` give the completion funnel. Custom events (`Test rozpoczęty`, `Test ukończony` with zone and species, `Udostępnienie` with the channel) are only visible on Vercel's Pro plan.

## 7. Launch checklist

- [ ] Vercel project connected to `main`, `dziader.si` added, `www` redirecting to the apex
- [ ] Check the link preview in the Facebook Sharing Debugger, the LinkedIn Post Inspector and a real Messenger chat
- [ ] Google Search Console with the sitemap submitted
- [ ] Privacy page before adding analytics; terms before any user-generated content
- [x] Phase 1 shipped before any promotion. The test is what turns visits into shares.
- [ ] Paste a real result link into Messenger and WhatsApp and check the certificate preview

## 8. Deploying to Vercel with dziader.si

1. vercel.com → **Add New → Project** → import `lucco669/dziadersi`. The Next.js preset and pnpm are detected automatically, and no environment variables are needed.
2. **Project → Settings → Domains**: add `dziader.si`, then `www.dziader.si` set to redirect to `dziader.si`.
3. At the `.si` domain registrar, create exactly the DNS records Vercel shows on that screen (an A record for the apex and a CNAME for `www`), or point the domain's nameservers to Vercel. HTTPS is issued automatically once DNS resolves.
4. Every push to `main` deploys to production, and other branches get preview URLs.
