# DZIADER.SI · Instytut Badań nad Dziaderstwem

A satirical "research institute" documenting dziaderstwo. The design is dead serious (a Polish public institute: Antykwa Półtawskiego and Isotype-style picture statistics); the content is not.

Production: https://dziader.si · Roadmap and design rules: [docs/PLAN.md](docs/PLAN.md)

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

## Where things live

| Path | What |
| --- | --- |
| `src/app/` | Routes, metadata, share images, favicon set and manifest, robots, sitemap, llms.txt, 404 |
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
| `src/lib/seo.ts` | `pageMetadata()`: canonical, Open Graph and Twitter for every page |
| `src/lib/indeks.ts` | The Narodowy Indeks Dziaderstwa model: seasons, calendar peaks, deterministic noise |
| `src/lib/bulletin.ts` | Everything date-dependent, computed in Europe/Warsaw time and cached for an hour (`"use cache"`) |
| `src/lib/typo.ts` | Polish typesetting helper (non-breaking spaces after one-letter words), number formatting |
| `assets/fonts/` | Static TTFs used by the OG image (SIL Open Font License) |

## Deploy

On Vercel: import the repository, keep the Next.js defaults (pnpm is detected from the lockfile), and add `dziader.si` under Project → Settings → Domains. Environment variables are listed in [supabase/README.md](supabase/README.md); without them the census and accounts show a closed state and the rest of the site works. `NEXT_PUBLIC_SITE_URL` only needs to be set if the canonical domain changes.
