import { Figure, Sweater } from "@/components/pictograms";
import { occasionDrawing } from "@/components/occasions";
import type { Occasion } from "@/content/bingo";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import type { Line } from "./phrasebook";
import { C, OgFrame, bold, italic, sans } from "./og";
import { render } from "./og-cards";
import { svgDataUri } from "./svg-string";
import type { Answer } from "./szwagier";
import { formatNumber, quote, typo } from "./typo";

const IMMUTABLE = { "cache-control": "public, max-age=86400, s-maxage=31536000, immutable" };

const COPY = defineCopy({
  pl: {
    phrasebook: (chapter: string) => `Rozmówki dziaderskie · ${chapter}`,
    line: (number: number, total: number) => `Wypowiedź nr ${number} z ${total} · losuj swoją na dziader.si`,
    bingo: (number: string) => `Dziaders Bingo · karta nr ${number}`,
    play: "Graj na",
    wins: "Pięć w linii wygrywa.",
    free: "WOLNE POLE",
    szwagier: "Superinteligencja · SZWAGIER 1.9 TDI",
    asked: "Pytanie",
    withheld: "Pytanie zawierało słowa, których Instytut nie drukuje.",
    ask: "Zapytaj na",
  },
  sl: {
    phrasebook: (chapter: string) => `Dziaderski pogovornik · ${chapter}`,
    line: (number: number, total: number) =>
      `Izjava št. ${formatNumber("sl", number)} od ${formatNumber("sl", total)} · izžrebaj svojo na dziader.si`,
    bingo: (number: string) => `Dziaders bingo · listek št. ${number}`,
    play: "Igraj na",
    wins: "Pet v vrsto zmaga.",
    free: "PROSTO POLJE",
    szwagier: "Superinteligenca · SZWAGIER 1.9 TDI",
    asked: "Vprašanje",
    withheld: "Vprašanje je vsebovalo besede, ki jih Inštitut ne tiska.",
    ask: "Vprašaj na",
  },
});

/** A line from the Rozmówki in the red speech bubble, said by the pointing figure. */
export function lineCard(line: Line, locale: Locale, { cached = false }: { cached?: boolean } = {}) {
  const t = COPY[locale];
  const size = line.text.length > 150 ? 40 : line.text.length > 110 ? 46 : 52;
  return render(
    <OgFrame locale={locale} section={t.phrasebook(line.situation.name)} path="/generator">
      <img src={svgDataUri("-4 -1 56 97", <Figure right="point" glasses="eyes" />)} width={196} height={340} alt="" />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 26, marginBottom: 70 }}>
        <div style={{ position: "relative", display: "flex", padding: "30px 38px", background: C.red }}>
          <svg width="24" height="34" viewBox="0 0 24 34" style={{ position: "absolute", left: -23, bottom: 30 }}>
            <path d="M24 0V34L0 17Z" fill={C.red} />
          </svg>
          <div style={{ ...bold, display: "flex", fontSize: size, lineHeight: 1.16, color: C.paper }}>{typo(line.text)}</div>
        </div>
        <div style={{ ...sans, display: "flex", marginTop: 16, fontSize: 21, color: C.soft }}>
          {t.line(line.number, line.total)}
        </div>
      </div>
    </OgFrame>,
    cached ? IMMUTABLE : undefined,
  );
}

/**
 * An answer of SZWAGIER as a share image: the question above, the gist of the answer in the red
 * bubble (opener, claim and closer; the anecdotes and sources stay on the page).
 */
export function answerCard(answer: Answer, locale: Locale, { cached = false }: { cached?: boolean } = {}) {
  const t = COPY[locale];
  const { sentences } = answer;
  const gist = (answer.topic.special ? sentences : [sentences[0], sentences[1], sentences[sentences.length - 1]]).map((sentence) => sentence.text).join(" ");
  const size = gist.length > 170 ? 36 : gist.length > 130 ? 41 : gist.length > 90 ? 46 : 52;
  const cut = answer.question.lastIndexOf(" ", 95);
  const question = answer.question.length > 96 ? `${answer.question.slice(0, cut > 40 ? cut : 95)}…` : answer.question;
  return render(
    <OgFrame locale={locale} section={t.szwagier} path="/superinteligencja" cta={t.ask}>
      <img src={svgDataUri("-4 -1 56 97", <Figure right="point" glasses="eyes" torso={<Sweater />} />)} width={180} height={312} alt="" />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 26 }}>
        <div style={{ ...sans, display: "flex", fontSize: 19, color: C.soft }}>{t.asked}</div>
        <div style={{ ...(question ? bold : italic), display: "flex", marginTop: 4, fontSize: question ? 30 : 24, lineHeight: 1.15, color: question ? C.ink : C.soft }}>
          {question ? quote(typo(question), locale) : t.withheld}
        </div>
        <div style={{ position: "relative", display: "flex", marginTop: 22, padding: "26px 34px", background: C.red }}>
          <svg width="24" height="34" viewBox="0 0 24 34" style={{ position: "absolute", left: -23, bottom: 26 }}>
            <path d="M24 0V34L0 17Z" fill={C.red} />
          </svg>
          <div style={{ ...bold, display: "flex", fontSize: size, lineHeight: 1.16, color: C.paper }}>{typo(gist)}</div>
        </div>
        <div style={{ ...sans, display: "flex", marginTop: 14, fontSize: 19, color: C.soft }}>{answer.thought}</div>
      </div>
    </OgFrame>,
    cached ? IMMUTABLE : undefined,
  );
}

/** A bingo card as a share image: the occasion, the card number and its 5 × 5 grid. */
export function bingoCard(occasion: Occasion, number: string, squares: string[], locale: Locale) {
  const t = COPY[locale];
  return render(
    <OgFrame locale={locale} section={t.bingo(number)} path="/bingo" cta={t.play}>
      <div style={{ display: "flex", flexDirection: "column", width: 400 }}>
        <img src={svgDataUri("0 0 120 100", occasionDrawing(occasion.slug))} width={240} height={200} alt="" />
        <div style={{ ...bold, display: "flex", marginTop: 10, fontSize: 66, lineHeight: 0.95, letterSpacing: -1.5 }}>{occasion.title}</div>
        <div style={{ ...sans, display: "flex", marginTop: 14, fontSize: 22, color: C.soft }}>{t.wins}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 40, padding: 8, background: C.card, border: `2px solid ${C.ink}` }}>
        <div style={{ display: "flex" }}>
          {"BINGO".split("").map((letter) => (
            <div key={letter} style={{ ...bold, display: "flex", justifyContent: "center", width: 92, fontSize: 26, lineHeight: 1.2 }}>
              {letter}
            </div>
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} style={{ display: "flex" }}>
            {[0, 1, 2, 3, 4].map((col) => {
              const i = row * 5 + col;
              const free = i === 12;
              return (
                <div
                  key={col}
                  style={{
                    ...sans,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 92,
                    height: 70,
                    padding: 6,
                    border: `1px solid ${C.ink}`,
                    marginLeft: col ? -1 : 0,
                    marginTop: -1,
                    background: free ? C.red : C.card,
                    color: free ? C.paper : C.ink,
                    fontSize: 11,
                    lineHeight: 1.15,
                    textAlign: "center",
                  }}
                >
                  {free ? t.free : typo(squares[i])}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </OgFrame>,
    IMMUTABLE,
  );
}
