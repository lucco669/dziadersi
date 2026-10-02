# DZIADER.SI · Instytut Badań nad Dziaderstwem

A satirical "research institute" documenting dziaderstwo. The design is dead serious (a Polish public institute: Antykwa Półtawskiego and Isotype-style picture statistics); the content is not.

Production: https://dziader.si · Roadmap and design rules: [docs/PLAN.md](docs/PLAN.md)

## Stack

- Next.js 16.3 (App Router, Turbopack, Cache Components), React 19.2, TypeScript
- Tailwind CSS 4, with design tokens in `src/app/globals.css`
- Fonts via `next/font`: Poltawski Nowy (headlines and text) and Schibsted Grotesk (interface)
- Illustrations are hand-written SVG pictograms (`src/components/pictograms.tsx`), reused in the generated share images
- Supabase (Postgres, Auth) for the anonymous census and accounts, Brevo for branded email. Everything else is static; the homepage regenerates hourly. Setup: [supabase/README.md](supabase/README.md)

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Before pushing, run `pnpm lint` and `pnpm build`.

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
