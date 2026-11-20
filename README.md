# DZIADER.SI · Instytut Badań nad Dziaderstwem

A satirical "research institute" documenting dziaderstwo. The design is dead serious (a Polish public institute: Antykwa Półtawskiego and Isotype-style picture statistics); the content is not.

Production: https://dziader.si (Polish original) and https://dziader.si/sl (Slovenian edition) · Roadmap and design rules: [docs/PLAN.md](docs/PLAN.md) · Slovenian edition: [docs/SLOVENIAN.md](docs/SLOVENIAN.md)

## Stack

- Next.js 16.3 (App Router, Turbopack, Cache Components), React 19.2, TypeScript
- Tailwind CSS 4, with design tokens in `src/app/globals.css`
- Fonts via `next/font`: Poltawski Nowy (headlines and text) and Schibsted Grotesk (interface)
- All 28 Atlas species use the same SVG pictogram system, including homepage previews, related-species lists, results, certificates and share images. Icons, charts and interactive scenes also stay SVG. Generated schoolbook illustrations are reserved for the homepage hero and three report scenes (`public/illustrations/`); source PNGs and exact prompts are in `assets/illustrations/`. The three unused species illustration studies are retained there for reference; do not introduce partial raster replacements into the Atlas.
- Supabase (Postgres, Auth) for the anonymous census and accounts, Brevo for branded email. Everything else is static; the homepage regenerates hourly. Setup: [supabase/README.md](supabase/README.md)

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Before pushing, run `pnpm lint` and `pnpm build`.

Also run `pnpm test` and `pnpm typecheck`. Tests cover published T1/T2 codes, scoring, resumable tests, privacy filtering, write validation, and the new SQL migration in ephemeral Postgres (PGlite). Tests need no hosted database credentials.

For isolated browser QA, run `pnpm exec tsx scripts/dev-fixture.ts`, then start Next with `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54329`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=local-fixture`, and `SUPABASE_SECRET_KEY=local-fixture` set in that process. The fixture never connects to Supabase; it implements only the result/group APIs and intentionally leaves account and community services unavailable. Never deploy the fixture or these environment values.

The test now asks for a signature after the last task, offers “Bez pośpiechu”, and records one anonymous completion event per room. Persistent family groups use `/grupy/[id]`; existing snapshot rankings at `/grupa/[lista]` are unchanged. Apply the new migration listed in `supabase/README.md` before deploying.

Browser QA on 3 October 2026 covered a complete 16-task examination at the mobile breakpoint, resuming saved untimed progress, optional final signature, the result and downloaded 4:5 certificate, family creation, invitation disclosure and automatic ranking updates. HTTP checks against the isolated fixture covered duplicate submissions/joins, invalid and oversized bodies, cross-origin rejection, missing groups, private response headers and cron authentication. Desktop checks covered the homepage, three featured species and an illustrated report. Local screenshots are kept in ignored `artifacts/qa/`.

## Social media kit

Two scripts make the Institute's daily posts from what the site already rotates. Both write into `out/`, which git ignores.

```bash
pnpm social-kit                     # today in Warsaw, both editions
pnpm social-kit --date 2026-12-24   # any day
pnpm social-kit --lang sl --out DIR # one edition, another folder
```

`scripts/social-kit.ts` renders four posts per edition into `out/social-kit/<date>/`, each as a 1080 × 1350 post and a 1080 × 1920 story: **sprawa** (the Komisja's case of the day as a three-stamp poll), **kartka** (the tear-off calendar page), **haslo** (the word of the day) and **indeks** (the Narodowy Indeks bulletin with the last thirty days). The picks are the front page's for that date. `captions.md` and `captions.json` hold a caption, the link, a story link and hashtags for each post in both languages. It runs in-process with `next/og`, no server needed; the cards are in `src/lib/daily-cards.tsx` and `src/lib/story-cards.tsx`.

```bash
pnpm build && pnpm start            # in another terminal (or pnpm dev)
pnpm record-clips                   # all clips, both editions, from http://localhost:3000
pnpm record-clips komisja kalendarz # some clips
pnpm record-clips --lang pl --url http://localhost:3200 --out DIR
```

`scripts/record-clips.ts` records the site's own animations as 6–10 s vertical MP4s (1080 × 1920, 30 fps) into `out/clips/`: **komisja** (the gavel comes down), **kalendarz** (yesterday's page is torn off), **klakson** (the horn test, from red to the honk) and **szwagier** (SZWAGIER reads a question at arm's length and answers). It drives a phone-sized browser with `playwright-core` (Playwright's own Chromium if `npx playwright install chromium` was run, otherwise Chrome or Edge), captures full-resolution frames through the DevTools screencast and encodes them with ffmpeg. Without ffmpeg on the PATH it keeps the JPEG frames. Recordings block `/api/*` and `sendBeacon`, so they never add tallies, votes or results.

Share images for single results come from the toys themselves: `…/karta?format=post|relacja` for Komisja cases, Rozmówki lines, exams and SZWAGIER answers, `/wynik/[kod]/certyfikat?format=post|relacja` for the test, and the canvas reports of Król grilla and Kolejka. `src/components/story-share.tsx` (`StoryShare`) offers both downloads and, on phones, sends the story to the share sheet as a file. The Narodowy Indeks badge for other sites is `/indeks/plakietka` (PNG) and `/indeks/ramka` (iframe); the snippets are on `/indeks`.

## Where things live

`/krol-grilla` (Slovenian: `/sl/kralj-zara`) is **Król grilla**, a 90-second barbecue arcade game. Six grill positions, independently cooking sausage sides, perfect-serving streaks, three heat phases, wasps and a relative reaching for the tongs. Mouse, touch and keyboard controls, automatic pause on blur or hidden tabs, optional procedural sound, a local best score and a downloadable PNG report. Both editions use the same Warsaw-date seed and text-free artwork. The pure game model is in `src/lib/grill.ts`, the translated interface in `src/components/grill-game.tsx`, and the local report in `src/lib/grill-report.ts`. ImageGen sources and exact prompts are saved in `assets/illustrations/grill/`; `python scripts/prepare-grill-art.py` regenerates the alpha-preserving WebPs and embedded share-card PNG. The portrait grill is selected on phones, with larger touch controls.

The introductory guide (`/dziaders`), occasion dossiers (`/okazje`: Wigilia, wesele, majówka), print library (`/do-druku`) and satirical museum (`/muzeum`) connect the existing Atlas, dictionary, cases and bingo. Their Slovenian addresses are `/sl/dziaders`, `/sl/priloznosti`, `/sl/za-tisk` and `/sl/muzej`. Dossier and museum content has translated overlays and slug maps; both collections are in search and the bilingual sitemap. Print-only views remain `noindex`.

The museum has six SVG catalogue drawings, native expandable drawers, exhibit permalinks and PNG downloads at `/muzeum/[slug]/karta`. The visitor's collection uses `ibd-museum-v1` in local storage, with the same exhibit identifiers in both editions; it needs no account. `src/components/print-materials.tsx` provides ten species cards on three A4 sheets and a one-sheet folding field guide. Their print styles are isolated in `print-materials.module.css`.

`/kolejka` (Slovenian: `/sl/cakalna-vrsta`) is **Pan tu nie stał!**, a turn-based queue game. Sixteen translated encounters, a Warsaw-date daily seed, random queues, one manager intervention, three endings, local resume and records, challenge links and a downloadable PNG report. No account or backend is required. Time advances only on decisions. Version 1 seeds and decisions are replayed by `src/lib/queue.ts`; keep its encounter pool and effects stable or version the format. Encounters and their Slovenian overlay live in `src/content/queue.ts` and `src/content/sl/queue.ts`, the interface in `src/components/queue-game.tsx`, the SVG waiting room in `queue-scene.tsx` and the local certificate renderer in `src/lib/queue-report.ts`.

| Path | What |
| --- | --- |
| `src/app/[lang]/` | Every page and share image, in both editions (`pl` without a URL prefix, `sl` under `/sl`); the root layout, 404 and catch-all |
| `src/app/` | Root-level routes shared by the editions: API, auth callback, favicon set and manifest, robots, sitemap (both editions with hreflang), llms.txt |
| `src/i18n/` | Editions: locale config, Slovenian URL segments (`segments.ts`, also used by `next.config.ts`), path helpers (`routes.ts`), `getLocale()` / `useLocale()`, the localising `Link`, `defineCopy()` for interface text and `overlay()` for content translations |
| `src/content/sl/` | Slovenian content overlays (text only, keyed to the Polish entries) and Slovenian slugs (`slugs/`) |
| `src/components/language.tsx` | Language switcher in the header and footer, and the strip under the header that offers the other edition to readers whose browser prefers it |
| `src/components/` | Page template (`page.tsx`: header, sections, test band, pager), brand (`brand.tsx`: head mark, wordmark, seal, stamp), pictograms (`pictograms.tsx`, `specimen.tsx`, `crowd.tsx`) |
| `src/content/` | All copy: 22 species, 26 dictionary entries, 5 reports, regions, the 16 test tasks in five rooms (`test.ts`), the retired 24 questions kept for old links (`test-v1.ts`) and the lab parameters (`lab.ts`) |
| `src/lib/test.ts` | Test scoring, species diagnosis, and stateless result codes (answers, date and name in the URL), both editions |
| `src/components/test-runner.tsx`, `src/components/test/` | The test: intro, routing slip, and one view per task format (choice, SMS, Rorschach plate, words, horn test, map, inventory, thermometer, rapid series) |
| `src/lib/lab.ts`, `src/lib/lab-image.tsx` | Lab results for a result code, on the page and as a PNG |
| `src/lib/group.ts`, `src/app/grupa/[lista]` | Rankings: result codes joined with dots, duel and group views |
| `src/content/phrasebook.ts`, `src/lib/phrasebook.ts`, `src/components/phrasebook.tsx` | Rozmówki dziaderskie: lines, codes and the generator |
| `src/content/bingo.ts`, `src/lib/bingo.ts`, `src/components/bingo-*.tsx` | Dziaders Bingo: squares, seeded cards and the playable and printable card |
| `src/components/occasions.tsx`, `src/lib/toy-cards.tsx` | Chapter icons, occasion plates and the share cards of both toys |
| `supabase/migrations/`, `supabase/README.md` | Database schema (run by hand in the SQL Editor) and the Supabase, Brevo and hook setup |
| `src/lib/supabase/`, `src/proxy.ts` | Supabase clients (visitor with cookies, server with the secret key) and session refresh on account routes |
| `src/app/api/wyniki`, `src/lib/census.ts`, `src/app/spis` | Recording finished tests and the Narodowy Spis Dziadersów |
| `src/app/konto`, `src/app/profil`, `src/app/auth`, `src/lib/profile.ts` | Magic-link sign-in and the Profil Dziaderski |
| `src/emails/`, `src/app/api/auth/email` | Branded auth emails via Supabase's Send Email Hook and Brevo |
| `public/plansze/`, `assets/plansze/` | Rorschach plates (generated with ChatGPT): WebP for the site, PNG for share images |
| `src/lib/certificate-image.tsx` | Generated certificates: link preview, Instagram post and story |
| `src/app/test`, `src/app/wynik/[kod]` | The test page and the shareable result pages, with certificate and lab images |
| `src/app/atlas`, `src/app/slownik`, `src/app/raporty`, `src/app/indeks` | Content sections; each `[slug]` page is prerendered from `src/content/` |
| `src/lib/og-cards.tsx`, `src/lib/og.tsx` | Share cards for species, dictionary entries, reports and section pages |
| `src/lib/story-cards.tsx`, `src/lib/daily-cards.tsx`, `src/components/story-share.tsx` | Portrait share images (4:5 post, 9:16 story) for the toys and the daily kit, and the share-as-file buttons |
| `src/lib/site.ts` | Site facts, the data controller, the departments and `SOCIAL` (Instagram, Facebook, Threads, TikTok handles: fill one in and it appears in the footer, on `/dla-mediow` and in Organization `sameAs`) |
| `src/lib/seo.ts` | `pageMetadata()`: canonical, Open Graph and Twitter for every page |
| `src/lib/indeks.ts` | The Narodowy Indeks Dziaderstwa model: seasons, calendar peaks, deterministic noise |
| `src/lib/bulletin.ts` | Everything date-dependent, computed in Europe/Warsaw time and cached for an hour (`"use cache"`) |
| `src/lib/typo.ts` | Polish typesetting helper (non-breaking spaces after one-letter words), number formatting |
| `assets/fonts/` | Static TTFs used by the OG image (SIL Open Font License) |

## Deploy

On Vercel: import the repository, keep the Next.js defaults (pnpm is detected from the lockfile), and add `dziader.si` under Project → Settings → Domains. Environment variables are listed in [supabase/README.md](supabase/README.md); without them the census and accounts show a closed state and the rest of the site works. `NEXT_PUBLIC_SITE_URL` only needs to be set if the canonical domain changes.
