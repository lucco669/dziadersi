import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { pairs, ranked, type Member } from "./group";
import { C, OG_FONTS, OgLogo, OgSeal, bold, italic, printedUrl, sans } from "./og";
import { OgFigure, OgPlate, OgTally } from "./og-cards";
import { siteCopy } from "./site";
import { compatibility } from "./test";

/*
 * The ranking as one upright picture (1080 × 1350) for a family or team chat: everyone, their
 * score and diagnosis, the most and least compatible pair. Any ranking has one; it reads only the URL.
 */

export const GROUP_CARD_SIZE = { width: 1080, height: 1350 };

const COPY = defineCopy({
  pl: {
    section: (count: number) => `Ranking · ${count} os.`,
    title: "Ranking dziaderstwa",
    duel: (a: string, b: string) => `${a} kontra ${b}`,
    compatibility: (value: number) => `Zgodność dziaderska: ${value}%`,
    best: (a: string, b: string, value: number) => `Najbardziej zgodni: ${a} i ${b}, ${value}%`,
    worst: (a: string, b: string) => `Nie sadzać obok siebie: ${a} i ${b}`,
    ask: "Zbadaj się na",
  },
  sl: {
    section: (count: number) => `Lestvica · ${count} os.`,
    title: "Lestvica dziaderstva",
    duel: (a: string, b: string) => `${a} – ${b}`,
    compatibility: (value: number) => `Dziaderska združljivost: ${value} %`,
    best: (a: string, b: string, value: number) => `Najbolj združljiva: ${a} in ${b}, ${value} %`,
    worst: (a: string, b: string) => `Ne posaditi skupaj: ${a} in ${b}`,
    ask: "Preglej se na",
  },
});

const pad = (value: number) => String(value).padStart(2, "0");

export function groupCardImage(members: Member[], locale: Locale, headers?: Record<string, string>) {
  const t = COPY[locale];
  const order = ranked(members);
  const duel = members.length === 2;
  const { best, worst } = pairs(members);
  // Rows share the space between the title and the footer: roomy for a duel, tight for twelve.
  const row = Math.floor(820 / order.length);
  const plate = Math.round(Math.min(230, row * 1.1));
  const name = Math.round(Math.min(54, row * 0.36));
  const diagnosis = Math.round(Math.max(17, name * 0.46));
  const score = Math.round(Math.min(112, row * 0.6));
  // The tally gets what is left of the row under the name and the diagnosis, if enough is left.
  const tally = row - name - diagnosis * 1.3 - 40;
  // The day of the newest result: the day the table sat down.
  const day = members[members.length - 1].result.date;
  const note = duel
    ? t.compatibility(compatibility(members[0].result, members[1].result))
    : best && worst && best !== worst
      ? `${t.best(best.a.label, best.b.label, best.value)}. ${t.worst(worst.a.label, worst.b.label)}.`
      : "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "56px 64px 48px", background: C.paper, color: C.ink }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <OgLogo size={44} />
          <div style={{ ...sans, display: "flex", fontSize: 26, color: C.soft }}>{t.section(members.length)} · {day}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ ...bold, display: "flex", fontSize: duel ? 76 : 88, lineHeight: 0.95, letterSpacing: -2 }}>
              {duel ? t.duel(members[0].label, members[1].label) : t.title}
            </div>
            {note && <div style={{ ...italic, display: "flex", marginTop: 14, fontSize: 30, lineHeight: 1.2, color: C.soft }}>{note}</div>}
          </div>
          <OgSeal size={130} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginTop: 30, borderTop: `3px solid ${C.ink}` }}>
          {order.map((member, i) => (
            <div key={member.result.code} style={{ display: "flex", alignItems: "center", flex: 1, borderBottom: `1px solid ${C.rule}` }}>
              <span style={{ ...sans, width: 56, fontSize: Math.max(22, name * 0.6), color: C.red }}>{pad(i + 1)}</span>
              <div style={{ display: "flex", width: plate + 16 }}>
                {member.result.diagnosis.species[0] ? (
                  <OgPlate species={member.result.diagnosis.species[0].key} specimen={member.result.specimen} width={plate} />
                ) : (
                  <div style={{ display: "flex", width: plate, justifyContent: "center" }}>
                    <OgFigure height={row * 0.8} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, marginLeft: 8, marginRight: 24 }}>
                <span style={{ ...bold, fontSize: name, lineHeight: 1 }}>{member.label}</span>
                <span style={{ ...sans, marginTop: 6, fontSize: diagnosis, lineHeight: 1.15, color: C.soft }}>{member.result.diagnosis.name}</span>
                {tally >= 26 && (
                  <div style={{ display: "flex", marginTop: 12 }}>
                    <OgTally count={Math.round(member.result.score / 10)} width={Math.round(Math.min(320, tally * 4.4))} />
                  </div>
                )}
              </div>
              <span style={{ ...bold, flexShrink: 0, fontSize: score, lineHeight: 1, color: i === 0 ? C.red : C.ink }}>{member.result.score}%</span>
            </div>
          ))}
        </div>
        <div style={{ ...sans, display: "flex", justifyContent: "space-between", paddingTop: 18, marginTop: 20, borderTop: `2px solid ${C.ink}`, fontSize: 24 }}>
          <span style={{ color: C.soft }}>{siteCopy(locale).institute}</span>
          <span style={{ color: C.red }}>
            {t.ask} {printedUrl("/test", locale)}
          </span>
        </div>
      </div>
    ),
    { ...GROUP_CARD_SIZE, fonts: OG_FONTS, headers },
  );
}
