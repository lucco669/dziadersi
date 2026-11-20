import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, bold, italic, sans, serif } from "./og";
import { render } from "./og-cards";
import { StoryFrame, type StoryFormat } from "./story-cards";
import { quote, typo } from "./typo";
import type { Reading } from "./wax";

/*
 * Share images of the Lanie wosku: the shadow of the cast on the Pracownia's wall with the cast in
 * front, then the species, the prophecy and the first words. Satori has no CSS filters, so the
 * shadow is its own PNG (assets/wosk/<slug>-cien.png, from scripts/prepare-wax-art.py).
 */

const IMMUTABLE = { "cache-control": "public, max-age=86400, s-maxage=31536000, immutable" };
const WALL = "#ebe5d7";

const COPY = defineCopy({
  pl: {
    section: "Pracownia Wróżb · Lanie wosku",
    species: (year: number) => `Gatunek na rok ${year}`,
    shadow: (shape: string) => `Cień: ${shape}`,
    first: "Pierwsze słowa:",
    cta: "Lej wosk na",
    ask: "A tobie co wyjdzie? Lej wosk na",
  },
  sl: {
    section: "Laboratorij za vedeževanje · Vlivanje voska",
    species: (year: number) => `Vrsta za leto ${year}`,
    shadow: (shape: string) => `Senca: ${shape}`,
    first: "Prve besede:",
    cta: "Vlivaj vosek na",
    ask: "Kaj se bo pokazalo tebi? Vlivaj vosek na",
  },
});

const images = new Map<string, string>();

function waxArt(slug: string, shadow = false) {
  const key = shadow ? `${slug}-cien` : slug;
  let image = images.get(key);
  if (!image) {
    image = `data:image/png;base64,${readFileSync(join(process.cwd(), "assets/wosk", `${key}.png`)).toString("base64")}`;
    images.set(key, image);
  }
  return image;
}

const fit = (length: number, steps: [number, number][], smallest: number) => steps.find(([max]) => length <= max)?.[1] ?? smallest;

/** The wall: the shadow large and soft, the cast small in front of it, lower left. */
function Wall({ slug, width, height }: { slug: string; width: number; height: number }) {
  const shadow = Math.round(Math.min(width * 0.86, height * 0.9));
  const cast = Math.round(width * 0.36);
  return (
    <div style={{ position: "relative", display: "flex", width, height, background: WALL, borderBottom: `3px solid ${C.ink}` }}>
      <img
        src={waxArt(slug, true)}
        width={shadow}
        height={shadow}
        alt=""
        style={{ position: "absolute", top: Math.round(height * 0.03), right: Math.round(width * 0.03), opacity: 0.82 }}
      />
      <img src={waxArt(slug)} width={cast} height={cast} alt="" style={{ position: "absolute", left: Math.round(width * 0.02), bottom: -Math.round(cast * 0.06) }} />
    </div>
  );
}

/** The link preview of a reading, 1200 × 630. */
export function waxCard(reading: Reading, locale: Locale, { cached = false }: { cached?: boolean } = {}) {
  const t = COPY[locale];
  return render(
    <OgFrame locale={locale} section={t.section} path="/lanie-wosku" cta={t.cta}>
      <Wall slug={reading.cast.slug} width={420} height={420} />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 46 }}>
        <div style={{ ...sans, display: "flex", fontSize: 22, color: C.soft }}>{t.shadow(reading.cast.shape)}</div>
        <div style={{ ...sans, display: "flex", marginTop: 18, fontSize: 22, color: C.red }}>{t.species(reading.year)}</div>
        <div style={{ ...bold, display: "flex", marginTop: 4, fontSize: fit(reading.species.name.length, [[20, 60], [26, 52]], 46), lineHeight: 1, letterSpacing: -1 }}>
          {reading.species.name}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 18, fontSize: fit(reading.prophecy.length, [[90, 30], [120, 27]], 24), lineHeight: 1.22 }}>
          {typo(reading.prophecy)}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.rule}` }}>
          <span style={{ ...sans, fontSize: 20, color: C.soft, marginRight: 10 }}>{t.first}</span>
          <span style={{ ...bold, fontSize: 28 }}>{quote(reading.entry.headword, locale)}</span>
        </div>
      </div>
    </OgFrame>,
    cached ? IMMUTABLE : undefined,
  );
}

/** A reading stood upright: a post (4:5) or a story (9:16). */
export function waxStory(reading: Reading, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const wall = story ? 640 : 520;
  return (
    <StoryFrame locale={locale} format={format} section={t.section} path={`/lanie-wosku/${reading.code}`} ask={t.ask}>
      <Wall slug={reading.cast.slug} width={920} height={wall} />
      <div style={{ ...sans, display: "flex", marginTop: 22, fontSize: 26, color: C.soft }}>{t.shadow(reading.cast.shape)}</div>
      <div style={{ ...sans, display: "flex", marginTop: story ? 40 : 28, fontSize: 28, color: C.red }}>{t.species(reading.year)}</div>
      <div style={{ ...bold, display: "flex", marginTop: 6, fontSize: fit(reading.species.name.length, [[20, 84], [26, 72]], 64), lineHeight: 1, letterSpacing: -1.5 }}>
        {reading.species.name}
      </div>
      <div style={{ ...serif, display: "flex", marginTop: 24, fontSize: fit(reading.prophecy.length, [[90, 40], [120, 36]], 33), lineHeight: 1.25 }}>
        {typo(reading.prophecy)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", marginTop: 24 }}>
        <span style={{ ...sans, fontSize: 26, color: C.soft, marginRight: 14 }}>{t.first}</span>
        <span style={{ ...bold, fontSize: 40 }}>{quote(reading.entry.headword, locale)}</span>
      </div>
    </StoryFrame>
  );
}
