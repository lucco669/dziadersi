# DZIADER.SI: plan, design and content rules

## 1. The product in one paragraph

**Instytut Badań nad Dziaderstwem** is the wrapper brand. The **Atlas Dziadersów** is the main body of content. The **Test Dziadersa** is the engine. Everything is presented completely seriously, like a statistics office or a natural history institute, and the joke lives only in the content. The growth loop:

> Google → "7 objawów Dziadersa Grillowego" → Test → 82%, Dziaders Grillowo-Motoryzacyjny → certificate → Messenger / Instagram → friends click dziader.si → they take the test.

The Atlas, Słownik and Raporty bring search traffic (a long tail of pages). The Test turns that traffic into shares.

## 2. Phases

### Phase 0: front page and brand system ✅ (this repository)

- The Institute's front page: live National Index, daily briefs, a sample test question, a certificate preview, an Atlas preview (species of the week and the species index), a year chart, a regional tile map, the dictionary entry of the day, and a public roadmap.
- Brand primitives: wordmark, seal, stamps, section headings, status labels.
- OG image, icons, robots, sitemap, 404.
- Fully static. Date-dependent parts regenerate every hour, so the site looks alive with no backend.

### Phase 1: Test Dziadersa and the certificate (the viral loop). Highest priority.

- `/test`: 24 questions, one per screen, styled as form "IBD-T1" with a progress bar. Client-side only, no login.
- Scoring: every answer adds to a 0–100 score and to weights for each Atlas species. The result is the score plus the top one or two species, for example "Dziaders Grillowo-Motoryzacyjny".
- `/wynik/[kod]`: a shareable result page. The code encodes the score and species (for example in base36), so no database is needed.
- A per-result `opengraph-image.tsx` renders the certificate, so a shared link previews as the certificate itself in Messenger, WhatsApp, X and Slack.
- "Pobierz certyfikat" downloads the same image at 1080×1350 (feed) and 1080×1920 (stories).
- Analytics events: `test_start`, `test_complete`, `share_click`.
- **Done when** someone finishes the test, pastes the link into Messenger, and sees the certificate preview.

### Phase 2: Atlas, Słownik and Raporty (search traffic)

- `/atlas` and `/atlas/[slug]`: one page per species, statically generated (`generateStaticParams`), each with its own OG image (a specimen card). The schema already exists in `src/content/species.ts`.
- `/slownik/[slug]`: one page per phrase.
- `/raporty/[slug]`: pseudo-research reports. These work well on social media too.
- Listicle-style entry pages such as "7 objawów Dziadersa Grillowego", each ending in the test.
- JSON-LD (Article, BreadcrumbList) and a sitemap generated from content.
- If content volume grows, move from TS files to MDX (`@next/mdx`) or a light CMS.
- Target before promotion: 50 species, 50 dictionary entries, 10 reports.

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

**Concept:** FT × National Geographic × research institute × Polish garage. Typographic, archival and calm. The seriousness is the joke.

**Never:** gradients, glow, glassmorphism, emoji as icons, rows of rounded cards with shadows, meme fonts, stock illustrations, or "haha" copy.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#f1ebdd` | Page background (with a subtle grain) |
| `paper-deep` / `paper-light` | `#e7decb` / `#f8f4ea` | Data band / document cards |
| `ink` | `#1b1a17` | Text, rules, the footer |
| `ink-soft` / `ink-faint` / `rule` | `#4b463d` / `#756e60` / `#cdc2aa` | Secondary text, captions, hairlines |
| `green` | `#1f3b30` | The institution and primary actions |
| `bordo` | `#8c1f2e` | Stamps, alerts, "today" markers |

**Type:**
- **Fraunces** for display: Black for headlines, italic for the voice lines. The wordmark is pinned to `opsz 144`.
- **Newsreader** for running text.
- **IBM Plex Mono** for kickers, codes, data and buttons.

**Motifs:**
- Classification codes: `DZI-04`, `IBD-T1`, `Wykres 1.`, `Mapa 1.`
- `§` numbered sections, each with a 2px rule on top.
- Hairline dividers.
- Rubber stamps: double border, worn ink.
- The Institute seal.
- An IUCN-style conservation status scale.
- FT-style annotated charts with a "Źródło:" line.

**Discipline:**
- At most one dark band per page section group (green for the lab, ink for the footer).
- Bordo is reserved for stamps and alerts.
- Any new component should look like it could appear in an annual report.

## 5. Voice and content rules

- Deadpan academic Polish. Specific numbers ("73%", "3 lata i 2 miesiące", "n = 412"). Cite "Źródło: IBD".
- Mock habits, not people: no real names or photos, no politics, religion or health, and nothing aimed at age as such.
- Regional jokes stay affectionate (Ciechocinek dancing, yes; insults, no).
- Polish typography: „cudzysłowy”, an en dash for ranges, non-breaking spaces after one-letter words (`typo()` does this), and balanced headline wrapping.
- **New species checklist** (fields from `Species`): code, name, Latin name with authority, status (IUCN code), habitat, activity, two vocalisations, natural enemies, field marks, three behavioural traits (0–100), and a one-line teaser. An LLM can draft entries, but a human edits every one for the tone above.

## 6. Technical decisions

- **Next.js 16.3 with Cache Components.** `getBulletin()` is `"use cache"` with `cacheLife("hours")`, so the homepage is prerendered and regenerated in the background every hour. Dates are computed in Europe/Warsaw, not UTC.
- **The index is a model, not data:** seasonal peaks plus deterministic noise, so every visitor sees the same number, the chart has a real-looking history and forecast, and it never needs a database.
- **No database until Phase 4.** Test results live in the URL.
- **OG images** use `next/og` with TTFs bundled in `assets/fonts` (no network at build time).
- **Analytics:** add Vercel Web Analytics (cookieless) or Plausible when the test launches.

## 7. Launch checklist

- [ ] Vercel project connected to `main`, `dziader.si` added, `www` redirecting to the apex
- [ ] Check the link preview in the Facebook Sharing Debugger, the LinkedIn Post Inspector and a real Messenger chat
- [ ] Google Search Console with the sitemap submitted
- [ ] Privacy page before adding analytics; terms before any user-generated content
- [ ] Phase 1 shipped before any promotion. The test is what turns visits into shares.

## 8. Deploying to Vercel with dziader.si

1. vercel.com → **Add New → Project** → import `lucco669/dziadersi`. The Next.js preset and pnpm are detected automatically, and no environment variables are needed.
2. **Project → Settings → Domains**: add `dziader.si`, then `www.dziader.si` set to redirect to `dziader.si`.
3. At the `.si` domain registrar, create exactly the DNS records Vercel shows on that screen (an A record for the apex and a CNAME for `www`), or point the domain's nameservers to Vercel. HTTPS is issued automatically once DNS resolves.
4. Every push to `main` deploys to production, and other branches get preview URLs.
