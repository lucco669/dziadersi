import { Figure } from "@/components/pictograms";
import { occasionDrawing } from "@/components/occasions";
import type { Occasion } from "@/content/bingo";
import type { Line } from "./phrasebook";
import { C, OgFrame, bold, sans } from "./og";
import { render } from "./og-cards";
import { svgDataUri } from "./svg-string";
import { typo } from "./typo";

const IMMUTABLE = { "cache-control": "public, max-age=86400, s-maxage=31536000, immutable" };

/** A line from the Rozmówki in the red speech bubble, said by the pointing figure. */
export function lineCard(line: Line, { cached = false }: { cached?: boolean } = {}) {
  const size = line.text.length > 150 ? 40 : line.text.length > 110 ? 46 : 52;
  return render(
    <OgFrame section={`Rozmówki dziaderskie · ${line.situation.name}`} url={`dziader.si/generator`}>
      <img src={svgDataUri("-4 -1 56 97", <Figure right="point" glasses="eyes" />)} width={196} height={340} alt="" />
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 26, marginBottom: 70 }}>
        <div style={{ position: "relative", display: "flex", padding: "30px 38px", background: C.red }}>
          <svg width="24" height="34" viewBox="0 0 24 34" style={{ position: "absolute", left: -23, bottom: 30 }}>
            <path d="M24 0V34L0 17Z" fill={C.red} />
          </svg>
          <div style={{ ...bold, display: "flex", fontSize: size, lineHeight: 1.16, color: C.paper }}>{typo(line.text)}</div>
        </div>
        <div style={{ ...sans, display: "flex", marginTop: 16, fontSize: 21, color: C.soft }}>
          Wypowiedź nr {line.number} z {line.total} · losuj swoją na dziader.si
        </div>
      </div>
    </OgFrame>,
    cached ? IMMUTABLE : undefined,
  );
}

/** A bingo card as a share image: the occasion, the card number and its 5 × 5 grid. */
export function bingoCard(occasion: Occasion, number: string, squares: string[]) {
  return render(
    <OgFrame section={`Dziaders Bingo · karta nr ${number}`} url="Graj na dziader.si/bingo">
      <div style={{ display: "flex", flexDirection: "column", width: 400 }}>
        <img src={svgDataUri("0 0 120 100", occasionDrawing(occasion.slug))} width={240} height={200} alt="" />
        <div style={{ ...bold, display: "flex", marginTop: 10, fontSize: 66, lineHeight: 0.95, letterSpacing: -1.5 }}>{occasion.title}</div>
        <div style={{ ...sans, display: "flex", marginTop: 14, fontSize: 22, color: C.soft }}>Pięć w linii wygrywa.</div>
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
                  {free ? "WOLNE POLE" : typo(squares[i])}
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
