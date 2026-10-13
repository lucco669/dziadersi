# Institute illustration system

The species plates extend the existing `public/illustrations/specimen.webp` and report drawings. Use that original as the visual reference for every new illustration, rather than a later generation: this prevents gradual style drift.

## Art direction

Vintage Polish educational field guide: natural human proportions, precise dark pen contours, fine restrained crosshatching and flat hand-tinted colours. The humour lives in the pose and recognisable objects. Keep the subject's expression matter-of-fact.

Use the site's palette: ink `#161513`, ivory `#f4f0e7`, muted blue `#3d6696`, ochre `#d49a2a`, small stamp-red accents `#c4362c`, pale warm skin and brown leather. Illustrations sit directly on the page's paper through a real transparent background. No white rectangles, scenic backdrops, labels, speech bubbles, logos or lettering. This makes every plate usable in both editions.

Each species has one principal character and its defining props, taken from `fieldMarks` and `activity` in `src/content/species.ts`. Keep the props recognisable at 180px. Standing, seated and window specimens should share the same visual weight; avoid adding scenery just to fill space.

## People and behaviour

The original specimen is a **style reference only**. Never copy its age, face, gender or compulsory moustache into the shared prompt. Dziaderstwo is a behavioural attitude; neither age nor gender changes a test score.

The collection has 84 species plates: three distinct people for each of 28 species, including contemporary younger men and women of varied ages. Three additional general portraits cover unspecified test diagnoses. These are independent people, not stages in one man's ageing. Each subject prompt specifies age, face, hair, build, wardrobe, pose and defining props. Women's plates use the same behavioural taxonomy.

`src/content/specimens.ts` records stable indices, fictional ages, gender, Polish observations and curated defaults. Slovenian observations live in `src/content/sl/specimens.ts`. Specimens share their species' existing translated routes; they have no separate slugs. Public Atlas defaults are deliberately mixed and remain stable across both editions and navigation. A species page lets visitors select another specimen. Saved results choose a stable specimen from the result identity, with an explicit optional `!0`, `!1` or `!2` suffix for a chosen portrait. The suffix changes neither the score, certificate number nor laboratory readings. It travels with the name, share card and certificate download.

## Static image delivery

Every plate has locally encoded WebPs at **180, 360, 600, 900 and 1200 px** wide, with real alpha and the same 6:5 canvas. The full image is `public/illustrations/species/KEY.webp`; smaller versions are in `public/illustrations/species/sizes/`. The classic specimen uses `KEY`, and additional people use `KEY-1` and `KEY-2`. `StaticArtwork` supplies a native `srcset` and `sizes`. Next's configuration sets `images.unoptimized: true` globally: page artwork never requests `/_next/image` or a runtime resizing service. Report artwork and test plates also have pre-generated responsive WebPs.

Satori requires local 600 × 500 PNG copies; those are rendering inputs, not page image downloads. `OgPlate` embeds the selected specimen directly and production tracing includes these files.

The newer subject prompts live in `assets/illustrations/specimens/prompts.json`. After generation, run `python scripts/prepare-specimen-art.py --manifest PATH_TO_KEY_SOURCE_MAP --existing --site`. The script checks source transparency, fits the drawing without stretching, writes all WebP sizes and the local PNG. Review every specimen on paper and card backgrounds, check both editions and mobile, and run all four project checks before delivery.

## Where artwork belongs

The **Król grilla** arcade uses six text-free ImageGen assets in `assets/illustrations/grill/`: an introductory vignette, landscape and square overhead grills, matching raw and cooked sausage sprites, and a wasp. Exact prompts and sources are in its `prompts.json`. `scripts/prepare-grill-art.py` preserves source alpha while encoding the WebPs in `public/illustrations/grill/` and the 600px hero PNG used in both editions' share cards. Cooking crossfades the paired sausage sprites; the square board keeps phone controls large without stretching the landscape drawing. These game assets do not replace species plates.

`SpeciesPlate` defaults to the detailed illustration: Atlas listings and entries, homepage specimens, results, profiles, field guides, examination clues, bulletin and calendar features, and print materials. An optional `title` supplies localised alternative text; plates alongside their species name are decorative. Never put the species name into an examination clue.

Use `variant="pictogram"` for small search markers, data rankings, hybrid markers and picture statistics. The existing SVG figures also remain appropriate for interactive scenes, animated mouth/arm gestures, navigation, the institute mark and seals.

`OgPlate` embeds the same illustration in share cards and certificate images. Its local PNGs are included in Next's output tracing so production rendering does not rely on a network request.

## Add or replace a species plate

1. Add the species and its Slovenian overlay/slug following `docs/SLOVENIAN.md`.
2. Add its stable key to `src/lib/species-art.ts`. The exhaustive registry requires an entry for every species key.
3. `assets/illustrations/species/prompts.json` preserves the historical prompts for the original 28 plates. For new people, use the style-only `sharedPrompt` in `assets/illustrations/specimens/prompts.json`, add their individual subject descriptions and generate **one individual plate per tool call**, with the original specimen as the style reference and transparent output enabled. Add all three metadata entries and their Slovenian observations together.
4. Inspect the result for correct props, anatomy, colour, ink treatment and real transparency. Generate a targeted correction if needed. Keep the generation source until verification is finished.
5. With Python and Pillow installed, run `python scripts/prepare-specimen-art.py --manifest PATH_TO_KEY_SOURCE_MAP --existing --site`. This fits complete drawings into transparent 1200 × 1000 canvases, writes the five responsive WebP sizes and the local 600 × 500 PNG inputs for Satori. Commit every rendition. `python scripts/check-specimen-art.py` verifies dimensions and alpha and creates contact sheets for visual review.
6. Run `pnpm test`, `pnpm typecheck`, `pnpm lint` and `pnpm build`. Check the Atlas in both editions, a species page, mobile layout, an examination image clue and a certificate/share image. Review drawings on paper and card backgrounds for visible edge halos or accidental opaque backgrounds.

The artwork was generated with the built-in image generation tool. Existing original specimen and report artwork is retained as the reference collection.
