# DZIADER.SI · Instytut Badań nad Dziaderstwem

A satirical "research institute" documenting dziaderstwo. The design is dead serious (Financial Times × National Geographic × research institute × Polish garage); the content is not.

Production: https://dziader.si · Roadmap and design rules: [docs/PLAN.md](docs/PLAN.md)

## Stack

- Next.js 16.3 (App Router, Turbopack, Cache Components), React 19.2, TypeScript
- Tailwind CSS 4, with design tokens in `src/app/globals.css`
- Fonts via `next/font`: Fraunces (display), Newsreader (text), IBM Plex Mono (labels and codes)
- No database and no external services. The homepage is static and regenerates hourly.

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Before pushing, run `pnpm lint` and `pnpm build`.

## Where things live

| Path | What |
| --- | --- |
| `src/app/` | Routes, metadata, OG image, icons, robots, sitemap, 404 |
| `src/components/` | Page sections and brand primitives (`brand.tsx`: wordmark, seal, stamp, section heading) |
| `src/content/` | All copy: 22 species, 26 dictionary entries, 5 reports, regions, daily briefs, departments, and the 24 test questions (`test.ts`) |
| `src/lib/test.ts` | Test scoring, species diagnosis, and stateless result codes (answers, date and name in the URL) |
| `src/lib/certificate-image.tsx` | Generated certificates: link preview, Instagram post and story |
| `src/app/test`, `src/app/wynik/[kod]` | The test runner and the shareable result pages |
| `src/app/atlas`, `src/app/slownik`, `src/app/raporty`, `src/app/indeks` | Content sections; each `[slug]` page is prerendered from `src/content/` |
| `src/lib/og-cards.tsx` | Share cards for species, dictionary entries, reports and section pages |
| `src/lib/indeks.ts` | The Narodowy Indeks Dziaderstwa model: seasons, calendar peaks, deterministic noise |
| `src/lib/bulletin.ts` | Everything date-dependent, computed in Europe/Warsaw time and cached for an hour (`"use cache"`) |
| `src/lib/typo.ts` | Polish typesetting helper (non-breaking spaces after one-letter words), number formatting |
| `assets/fonts/` | Static TTFs used by the OG image (SIL Open Font License) |

## Deploy

On Vercel: import the repository, keep the Next.js defaults (pnpm is detected from the lockfile), and add `dziader.si` under Project → Settings → Domains. No environment variables are required. `NEXT_PUBLIC_SITE_URL` only needs to be set if the canonical domain changes.
