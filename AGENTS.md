<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Two editions

Every page renders in Polish (the original, at the root) and Slovenian (a translation, under `/sl`). Before adding a page, interface text or content, read `docs/SLOVENIAN.md`: routes live in `src/app/[lang]`, interface text goes in `defineCopy({ pl, sl })`, content entries need their Slovenian overlay in `src/content/sl/` (and a slug in `src/content/sl/slugs/`), links use `@/i18n/link`. `pnpm test` fails on missing translations.

# Illustrations

Before adding or replacing artwork, read `docs/ILLUSTRATIONS.md`. Use the original specimen for drawing style only: people vary in age, face and gender. New subject prompts use the style-only shared prompt in `assets/illustrations/specimens/prompts.json`; the older prompt set is a historical record. Keep both editions on the same text-free artwork. Use `SpeciesPlate` for species illustrations and its `pictogram` variant for small data markers. New species need three specimens, Polish/Slovenian observations, the artwork registry entry, saved prompts, all five static WebP sizes and embedded PNGs in the same change. Never enable runtime image resizing: `images.unoptimized` stays true. `pnpm test` checks coverage.
