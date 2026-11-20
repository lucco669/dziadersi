import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OG_FONTS, OgFrame, OgLogo, OgMark, OgSeal, bold, italic, printedUrl, sans, serif } from "./og";
import { OgPlate } from "./og-cards";
import { typo } from "./typo";
import { chapterNumber, LETTER, type Wish } from "./wishes";

/*
 * The Institute's greetings as images: the share card (1200 × 630) with the wish and the plate, and
 * the whole letter for chats and stories, 4:5 and 9:16, as paper on ink like the certificate.
 */

export const WISH_FORMATS = {
  og: { width: 1200, height: 630 },
  post: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;

export type WishFormat = keyof typeof WISH_FORMATS;

const COPY = defineCopy({
  pl: {
    section: (chapter: string) => `Życzenia od Instytutu · ${chapter}`,
    cta: "Wyślij swoje z",
    own: "Wylosuj własne życzenia na",
  },
  sl: {
    section: (chapter: string) => `Voščila Inštituta · ${chapter}`,
    cta: "Pošlji svoje z",
    own: "Izžrebaj svoje voščilo na",
  },
});

export function wishImage(card: Wish, format: WishFormat, locale: Locale, headers?: Record<string, string>) {
  return new ImageResponse(
    format === "og" ? <Landscape card={card} locale={locale} /> : <Portrait card={card} locale={locale} story={format === "story"} />,
    { ...WISH_FORMATS[format], fonts: OG_FONTS, headers },
  );
}

const fit = (length: number, sizes: [number, number][], fallback: number) => sizes.find(([max]) => length <= max)?.[1] ?? fallback;

/** The share card: the plate, the salutation and the wish itself; the rest is on the page. */
function Landscape({ card, locale }: { card: Wish; locale: Locale }) {
  const t = COPY[locale];
  const letter = LETTER[locale];
  const wish = card.parts[1];
  return (
    <OgFrame locale={locale} section={t.section(card.chapter.name)} path="/zyczenia" cta={t.cta}>
      <OgPlate species={card.chapter.plate.species} specimen={card.chapter.plate.specimen} width={400} />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 30 }}>
        <div style={{ ...bold, display: "flex", fontSize: 34, lineHeight: 1.1 }}>{card.chapter.salutation}</div>
        <div style={{ ...serif, display: "flex", marginTop: 16, fontSize: fit(wish.length, [[70, 44], [100, 40], [130, 36]], 32), lineHeight: 1.22 }}>
          {typo(wish)}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
          <OgSeal size={104} rotate={-11} />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 22 }}>
            <div style={{ ...italic, display: "flex", fontSize: 26, color: C.soft }}>{`${letter.regards},`}</div>
            <div style={{ ...bold, display: "flex", fontSize: 44, lineHeight: 1, letterSpacing: 3 }}>{letter.signature}</div>
          </div>
        </div>
      </div>
    </OgFrame>
  );
}

/** The whole letter on paper, on an ink ground; the story leaves room for the app's own controls. */
function Portrait({ card, locale, story }: { card: Wish; locale: Locale; story: boolean }) {
  const t = COPY[locale];
  const letter = LETTER[locale];
  const length = card.text.length + card.chapter.salutation.length;
  const size = story ? fit(length, [[200, 46], [260, 43], [320, 40]], 37) : fit(length, [[200, 42], [260, 40], [320, 37]], 34);
  const plate = story ? 560 : 470;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: story ? "170px 56px 150px" : "48px 56px 40px",
        background: C.ink,
        color: C.ink,
      }}
    >
      {story && (
        <div style={{ display: "flex", marginBottom: 40 }}>
          <OgLogo size={46} color={C.paper} cutout={C.ink} />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          padding: story ? "48px 56px 52px" : "36px 50px 40px",
          background: C.card,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", paddingBottom: 18, borderBottom: `3px solid ${C.ink}` }}>
          <OgMark size={58} />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 18 }}>
            <div style={{ ...bold, display: "flex", fontSize: 28, lineHeight: 1.1 }}>{letter.institute}</div>
            <div style={{ ...sans, display: "flex", marginTop: 4, fontSize: 19, color: C.soft }}>{letter.department}</div>
          </div>
        </div>
        <div style={{ ...sans, display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 19, color: C.soft }}>
          <span>{letter.reference(chapterNumber(card.chapter), card.number)}</span>
          <span>{card.occasion.dateline}</span>
        </div>
        <div style={{ ...sans, display: "flex", marginTop: 4, fontSize: 19, color: C.soft }}>{card.occasion.subject}</div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: story ? 34 : 14 }}>
          <OgPlate species={card.chapter.plate.species} specimen={card.chapter.plate.specimen} width={plate} />
        </div>

        <div style={{ ...bold, display: "flex", marginTop: story ? 26 : 8, fontSize: size + 4, lineHeight: 1.15 }}>{card.chapter.salutation}</div>
        <div style={{ ...serif, display: "flex", marginTop: 14, fontSize: size, lineHeight: 1.36 }}>{typo(card.text)}</div>

        <div style={{ display: "flex", flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 20 }}>
          <OgSeal size={story ? 170 : 140} rotate={-11} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: 28 }}>
            <div style={{ ...italic, display: "flex", fontSize: 28, color: C.soft }}>{`${letter.regards},`}</div>
            <div style={{ ...bold, display: "flex", marginTop: 2, fontSize: 60, lineHeight: 1, letterSpacing: 4 }}>{letter.signature}</div>
            {card.chapter.cosigner ? (
              <div style={{ ...italic, display: "flex", marginTop: 6, fontSize: 22, color: C.soft }}>{card.chapter.cosigner}</div>
            ) : null}
          </div>
        </div>
      </div>
      <div style={{ ...sans, display: "flex", marginTop: story ? 36 : 22, fontSize: story ? 28 : 23, color: C.paper }}>
        {`${t.own} `}
        <span style={{ color: C.red, marginLeft: 8 }}>{printedUrl("/zyczenia", locale)}</span>
      </div>
    </div>
  );
}
