import { ImageResponse } from "next/og";
import type { Entry } from "@/content/dictionary";
import { WORD_OF_YEAR } from "@/content/word-of-year";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { CERTIFICATE_FORMATS } from "./certificate-image";
import { C, OG_FONTS, OgFrame, OgLogo, OgSeal, OgStamp, bold, italic, printedUrl, sans, serif } from "./og";
import { OgPlate } from "./og-cards";
import { siteCopy } from "./site";
import { formatDate, quote, typo } from "./typo";
import type { WordPhase } from "./word-of-year";

/*
 * Images of the Dziaderskie Słowo Roku: the link preview of the page (the vote, then the word) and
 * the certificate as an Instagram post (4:5) and story (9:16), the way the test's certificate is.
 */

const PATH = "/slowo-roku";

const COPY = defineCopy({
  pl: {
    section: (year: number) => `Komisja Orzekająca · Słowo Roku ${year}`,
    title: (year: number) => `Dziaderskie Słowo Roku ${year}`,
    stamp: { upcoming: "Nominacje", voting: "Głosowanie trwa", closed: "Komisja obraduje", announced: "Ogłoszono" } satisfies Record<WordPhase, string>,
    dates: (opens: string, closes: string, announced: string) => `Głosowanie ${opens}–${closes} · ogłoszenie ${announced}`,
    nominees: (count: number) => `${count} zwrotów nominowanych przez Komisję`,
    cta: "Głosuj na",
    see: "Zobacz na",
    number: (year: number) => `Uchwała nr KO/${year}/1`,
    announces: "Komisja Orzekająca Instytutu ogłasza, że dziaderskim słowem roku został zwrot",
    signed: "Za Komisję Orzekającą",
    office: "Sekretariat Komisji",
    ask: "A u ciebie w domu?",
  },
  sl: {
    section: (year: number) => `Razsodna komisija · Beseda leta ${year}`,
    title: (year: number) => `Dziaderska beseda leta ${year}`,
    stamp: { upcoming: "Nominacije", voting: "Glasovanje poteka", closed: "Komisija zaseda", announced: "Razglašeno" } satisfies Record<WordPhase, string>,
    dates: (opens: string, closes: string, announced: string) => `Glasovanje ${opens}–${closes} · razglasitev ${announced}`,
    nominees: (count: number) => `${count} izrazov, ki jih je nominirala Komisija`,
    cta: "Glasuj na",
    see: "Poglej na",
    number: (year: number) => `Sklep št. KO/${year}/1`,
    announces: "Razsodna komisija Inštituta razglaša, da je dziaderska beseda leta izraz",
    signed: "Za Razsodno komisijo",
    office: "Tajništvo Komisije",
    ask: "Pa pri vas doma?",
  },
});

const day = (locale: Locale, iso: string) => formatDate(locale, iso, { day: "numeric", month: "long" });
const lastVotingDay = () => new Date(Date.parse(WORD_OF_YEAR.closes) - 60_000).toISOString();

const fit = (text: string, sizes: [number, number][], fallback: number) => sizes.find(([max]) => text.length <= max)?.[1] ?? fallback;

/** 1200 × 630: the vote with three of the nominees before the announcement, the word after it. */
export function wordShareCard(locale: Locale, phase: WordPhase, headwords: string[], winner?: { entry: Entry; verdict: string }) {
  const t = COPY[locale];
  const { year } = WORD_OF_YEAR;
  if (winner) {
    const phrase = quote(winner.entry.headword, locale);
    return new ImageResponse(
      <OgFrame locale={locale} section={t.section(year)} path={PATH} cta={t.see}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 30 }}>
          <div style={{ ...sans, display: "flex", fontSize: 24, color: C.soft }}>{t.title(year)}</div>
          <div style={{ ...bold, display: "flex", marginTop: 12, fontSize: fit(phrase, [[18, 92], [28, 76], [40, 62]], 52), lineHeight: 1, letterSpacing: -1.5 }}>
            {phrase}
          </div>
          <div style={{ ...serif, display: "flex", marginTop: 18, fontSize: 27, lineHeight: 1.3, color: C.soft }}>{typo(winner.entry.senses[0].text)}</div>
          <div style={{ ...sans, display: "flex", marginTop: 18, fontSize: 22, color: C.red }}>{winner.verdict}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300 }}>
          {winner.entry.species && <OgPlate species={winner.entry.species} width={250} />}
          <div style={{ display: "flex", marginTop: 6 }}>
            <OgSeal size={130} />
          </div>
        </div>
      </OgFrame>,
      { width: 1200, height: 630, fonts: OG_FONTS },
    );
  }
  return new ImageResponse(
    <OgFrame locale={locale} section={t.section(year)} path={PATH} cta={phase === "voting" ? t.cta : t.see}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex" }}>
          <OgStamp label={t.stamp[phase]} fontSize={20} />
        </div>
        <div style={{ ...bold, display: "flex", marginTop: 26, fontSize: 78, lineHeight: 0.98, letterSpacing: -1.5 }}>{t.title(year)}</div>
        <div style={{ ...sans, display: "flex", marginTop: 18, fontSize: 24, color: C.soft }}>
          {t.dates(day(locale, WORD_OF_YEAR.opens), day(locale, lastVotingDay()), day(locale, WORD_OF_YEAR.announced))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 360, paddingLeft: 34, borderLeft: `2px solid ${C.ink}` }}>
        <div style={{ ...sans, display: "flex", fontSize: 19, color: C.soft }}>{t.nominees(WORD_OF_YEAR.nominees.length)}</div>
        {headwords.slice(0, 5).map((headword, i) => (
          <div key={headword} style={{ ...bold, display: "flex", marginTop: 12, fontSize: 30, lineHeight: 1.08 }}>
            <span style={{ ...sans, width: 34, fontSize: 18, marginTop: 8, color: C.red }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ display: "flex", flex: 1 }}>{quote(headword, locale)}</span>
          </div>
        ))}
        <div style={{ ...italic, display: "flex", marginTop: 12, fontSize: 24, color: C.soft }}>…</div>
      </div>
    </OgFrame>,
    { width: 1200, height: 630, fonts: OG_FONTS },
  );
}

/** The certificate on ink, as an Instagram post (4:5) or story (9:16). */
export function wordCertificateImage(locale: Locale, entry: Entry, verdict: string, date: string, format: "post" | "story", headers?: Record<string, string>) {
  const t = COPY[locale];
  const story = format === "story";
  const { year } = WORD_OF_YEAR;
  const phrase = quote(entry.headword, locale);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: story ? "150px 60px 120px" : "50px 60px",
        background: C.ink,
      }}
    >
      {story && (
        <div style={{ display: "flex", marginBottom: 56 }}>
          <OgLogo size={46} color={C.paper} cutout={C.ink} />
        </div>
      )}
      <div style={{ position: "relative", display: "flex", width: "100%", ...(story ? {} : { flex: 1 }), padding: 12, background: C.card, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -120, top: 40, width: 420, height: 46, background: C.red, transform: "rotate(-45deg)" }} />
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            padding: "34px 54px 36px",
            border: `2px solid ${C.ink}`,
            textAlign: "center",
          }}
        >
          <div style={{ ...sans, display: "flex", width: "100%", justifyContent: "space-between", fontSize: 21, color: C.soft }}>
            <span style={{ marginLeft: 70 }}>{siteCopy(locale).institute}</span>
            <span>{t.number(year)}</span>
          </div>
          <div style={{ ...bold, display: "flex", marginTop: story ? 56 : 38, fontSize: 54, lineHeight: 1, letterSpacing: -1 }}>{t.title(year)}</div>
          <div style={{ ...italic, display: "flex", marginTop: 22, maxWidth: 760, fontSize: 31, lineHeight: 1.3, color: C.soft, justifyContent: "center" }}>
            {t.announces}
          </div>
          <div
            style={{
              ...bold,
              display: "flex",
              justifyContent: "center",
              marginTop: 18,
              maxWidth: 880,
              fontSize: fit(phrase, [[18, story ? 104 : 96], [28, 84], [40, 68]], 58),
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            {phrase}
          </div>
          {entry.original && <div style={{ ...italic, display: "flex", marginTop: 8, fontSize: 30, color: C.soft }}>{quote(entry.original, "pl")}</div>}
          <div style={{ ...serif, display: "flex", justifyContent: "center", marginTop: 22, maxWidth: 760, fontSize: 30, lineHeight: 1.3 }}>
            {typo(entry.senses[0].text)}
          </div>
          {entry.species && (
            <div style={{ display: "flex", marginTop: story ? 40 : 22 }}>
              <OgPlate species={entry.species} width={story ? 400 : 260} />
            </div>
          )}
          <div style={{ ...sans, display: "flex", marginTop: 14, fontSize: 24, color: C.red }}>{verdict}</div>
          <div style={{ display: "flex", width: "100%", alignItems: "flex-end", justifyContent: "space-between", marginTop: story ? 56 : "auto" }}>
            <OgSeal size={story ? 180 : 160} />
            <div style={{ display: "flex", flexDirection: "column", width: 380, textAlign: "left" }}>
              <div style={{ ...italic, display: "flex", fontSize: 32 }}>{t.signed}</div>
              <div
                style={{
                  ...serif,
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 8,
                  paddingTop: 10,
                  borderTop: `2px solid ${C.ink}`,
                  fontSize: 22,
                  lineHeight: 1.35,
                  color: C.soft,
                }}
              >
                <span>{t.office}</span>
                <span>{date}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              ...sans,
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              marginTop: 26,
              paddingTop: 14,
              borderTop: `1px solid ${C.rule}`,
              fontSize: 20,
              color: C.soft,
            }}
          >
            <span>{printedUrl(PATH, locale)}</span>
          </div>
        </div>
      </div>
      {story && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 52, color: C.paper }}>
          <div style={{ ...italic, display: "flex", fontSize: 44 }}>{t.ask}</div>
          <div style={{ ...sans, display: "flex", marginTop: 10, fontSize: 34, color: C.red }}>{printedUrl(PATH, locale)}</div>
        </div>
      )}
    </div>,
    { ...CERTIFICATE_FORMATS[format], fonts: OG_FONTS, headers },
  );
}
