import { ImageResponse } from "next/og";
import { TableScene } from "@/components/seating-scene";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OG_FONTS, OgFrame, OgLogo, OgStamp, bold, printedUrl, sans } from "./og";
import { render } from "./og-cards";
import { assess, pairSubject, protocolNumber, seatingLayout, shortName, type Pair, type Plan } from "./seating";
import { percent, seatName, VERDICT_COPY } from "./seating-text";
import { siteCopy } from "./site";
import { svgDataUri } from "./svg-string";
import { typo } from "./typo";

/*
 * Plan stołu as images: the 1200 × 630 link preview and the portrait post (4:5) and story (9:16),
 * all with the table from above. Portrait images follow the contract of the growth toolkit's
 * story cards: `?format=post|relacja` and `?pobierz` on one route.
 */

export type SeatingFormat = "post" | "story";
export const SEATING_STORY_SIZES = { post: { width: 1080, height: 1350 }, story: { width: 1080, height: 1920 } } as const;
/** The query value and file suffix: `?format=relacja` is the story. Both editions use the Polish words. */
export const SEATING_FORMAT_QUERY: Record<SeatingFormat, string> = { post: "post", story: "relacja" };

const IMMUTABLE = "public, max-age=86400, s-maxage=31536000, immutable";

const COPY = defineCopy({
  pl: {
    section: (number: string) => `Plan stołu · protokół nr ${number}`,
    protocol: "Protokół rozsadzenia",
    modes: { wigilia: "Wigilia", wesele: "Wesele" },
    index: "Wskaźnik zapalności",
    beside: "obok siebie",
    facing: "naprzeciwko",
    none: "Brak punktów zapalnych.",
    cta: "Rozsadź swoich na",
    ask: "A twój stół? Sprawdź na",
    file: "plan-stolu",
  },
  sl: {
    section: (number: string) => `Sedežni red · zapisnik št. ${number}`,
    protocol: "Zapisnik o sedežnem redu",
    modes: { wigilia: "Sveti večer", wesele: "Svatba" },
    index: "Indeks vnetljivosti",
    beside: "drug ob drugem",
    facing: "nasproti",
    none: "Brez žarišč.",
    cta: "Posedi svoje na",
    ask: "Kaj pa tvoja miza? Preveri na",
    file: "sedezni-red",
  },
});

/** The table from above with every guest as a plate, as an <img> `height` tall. */
function OgTable({ plan, height, marked }: { plan: Plan; height: number; marked: Pair[] }) {
  const layout = seatingLayout(plan.mode, plan.seats.length);
  const drawing = (
    <TableScene layout={layout} marked={marked.map((pair) => [pair.a, pair.b] as [number, number])} seats={plan.seats.map((seat) => seat.species)} />
  );
  const width = Math.round((height * layout.width) / layout.height);
  return <img src={svgDataUri(`0 0 ${layout.width} ${layout.height}`, drawing)} width={width} height={height} alt="" />;
}

function Flashpoint({ plan, pair, locale, size }: { plan: Plan; pair: Pair; locale: Locale; size: number }) {
  const t = COPY[locale];
  const a = plan.seats[pair.a];
  const b = plan.seats[pair.b];
  const who = (seat: typeof a) => (seat.label && seat.species ? `${seat.label} (${shortName(seat.species, locale)})` : seatName(seat, locale));
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: size * 0.45, paddingBottom: size * 0.45, borderTop: `1.5px solid ${C.rule}` }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginRight: 16 }}>
        <div style={{ ...bold, display: "flex", fontSize: size, lineHeight: 1.15 }}>{typo(`${who(a)} · ${who(b)}`)}</div>
        <div style={{ ...sans, display: "flex", marginTop: 4, fontSize: size * 0.62, color: C.soft }}>
          {`${pair.kind === "beside" ? t.beside : t.facing} · ${pairSubject(a.species, b.species, locale) ?? "—"}`}
        </div>
      </div>
      <div style={{ ...sans, display: "flex", fontSize: size * 1.25, color: C.red }}>{percent(locale, pair.risk)}</div>
    </div>
  );
}

/** The 1200 × 630 card for a plan: the table on the left, the protocol's verdict on the right. */
export function seatingCard(plan: Plan, locale: Locale, { cached = false }: { cached?: boolean } = {}) {
  const t = COPY[locale];
  const assessment = assess(plan);
  const verdict = VERDICT_COPY[locale][assessment.verdict];
  const marked = assessment.flashpoints.slice(0, 4);
  return render(
    <OgFrame locale={locale} section={t.section(protocolNumber(plan))} path="/plan-stolu" cta={t.cta}>
      <div style={{ display: "flex", width: 470, height: 470, alignItems: "center", justifyContent: "center" }}>
        <OgTable plan={plan} height={plan.mode === "wigilia" ? 470 : 440} marked={marked} />
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", marginLeft: 36 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ ...sans, display: "flex", fontSize: 21, color: C.soft }}>{`${t.modes[plan.mode]} · ${t.index} ${assessment.index}/100`}</div>
            <div style={{ ...bold, display: "flex", marginTop: 6, fontSize: 50, lineHeight: 1, letterSpacing: -1 }}>{verdict.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 18, marginBottom: 18 }}>
          <OgStamp label={verdict.stamp} fontSize={22} />
        </div>
        {marked.length ? (
          marked.slice(0, 2).map((pair) => <Flashpoint key={`${pair.a}-${pair.b}`} plan={plan} pair={pair} locale={locale} size={25} />)
        ) : (
          <div style={{ ...bold, display: "flex", fontSize: 28, paddingTop: 12, borderTop: `1.5px solid ${C.rule}` }}>{t.none}</div>
        )}
      </div>
    </OgFrame>,
    cached ? { "cache-control": IMMUTABLE } : undefined,
  );
}

/**
 * The portrait images: the table large, the verdict and the three worst pairs. A story keeps its
 * words clear of Instagram's bars (250 px at the top, 300 at the bottom) and ends on the ink band.
 */
export function seatingStory(plan: Plan, locale: Locale, format: SeatingFormat, headers: Record<string, string> = {}) {
  const t = COPY[locale];
  const story = format === "story";
  const assessment = assess(plan);
  const verdict = VERDICT_COPY[locale][assessment.verdict];
  const marked = assessment.flashpoints.slice(0, 4);
  const tall = plan.mode === "wigilia";
  const tableHeight = story ? (tall ? 860 : 700) : tall ? 640 : 540;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: C.paper, color: C.ink }}>
        <div style={{ display: "flex", height: 14, background: C.red }} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: story ? "230px 72px 0" : "48px 64px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <OgLogo size={38} />
            <div style={{ ...sans, display: "flex", fontSize: 24, color: C.soft }}>{`${t.modes[plan.mode]} · nr ${protocolNumber(plan)}`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: story ? 40 : 28 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ ...sans, display: "flex", fontSize: 26, color: C.soft }}>{t.protocol}</div>
              <div style={{ ...bold, display: "flex", marginTop: 6, fontSize: 66, lineHeight: 1, letterSpacing: -1.5 }}>{verdict.title}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <div style={{ ...sans, display: "flex", fontSize: 28 }}>{`${t.index}: ${assessment.index}/100`}</div>
            <OgStamp label={verdict.stamp} fontSize={24} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: story ? 40 : 20 }}>
            <OgTable plan={plan} height={tableHeight} marked={marked} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: story ? 36 : 16 }}>
            {marked.length ? (
              marked.slice(0, story ? 3 : 2).map((pair) => <Flashpoint key={`${pair.a}-${pair.b}`} plan={plan} pair={pair} locale={locale} size={30} />)
            ) : (
              <div style={{ ...bold, display: "flex", fontSize: 34, paddingTop: 14, borderTop: `1.5px solid ${C.rule}` }}>{t.none}</div>
            )}
          </div>
        </div>
        {story ? (
          <div style={{ display: "flex", flexDirection: "column", height: 300, padding: "56px 72px", background: C.ink, color: C.paper }}>
            <div style={{ ...bold, display: "flex", fontSize: 44 }}>{t.ask}</div>
            <div style={{ ...sans, display: "flex", marginTop: 12, fontSize: 40, color: C.red }}>{printedUrl("/plan-stolu", locale)}</div>
          </div>
        ) : (
          <div style={{ ...sans, display: "flex", justifyContent: "space-between", margin: "0 64px", padding: "18px 0 40px", borderTop: `2px solid ${C.ink}`, fontSize: 24 }}>
            <span style={{ color: C.soft }}>{siteCopy(locale).institute}</span>
            <span style={{ color: C.red }}>{`${t.cta} ${printedUrl("/plan-stolu", locale)}`}</span>
          </div>
        )}
      </div>
    ),
    { ...SEATING_STORY_SIZES[format], fonts: OG_FONTS, headers: { "cache-control": IMMUTABLE, "x-robots-tag": "noindex", ...headers } },
  );
}

/** "plan-stolu-wigilia-4127-relacja.png" */
export const seatingFile = (plan: Plan, locale: Locale, format: SeatingFormat) =>
  `${COPY[locale].file}-${plan.mode}-${protocolNumber(plan)}-${SEATING_FORMAT_QUERY[format]}.png`;
