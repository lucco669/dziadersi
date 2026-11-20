/* eslint-disable @next/next/no-img-element -- Satori renders this card; next/image does not apply. */
import { MeetingTableDrawing } from "@/components/team-art";
import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, OgStamp, bold, italic, sans } from "@/lib/og";
import { OgTally, render } from "@/lib/og-cards";
import { svgDataUri } from "@/lib/svg-string";
import { docket, teamReport, TEAM_LIMIT } from "@/lib/team";
import { lookupTeam } from "@/lib/team-server";

const COPY = defineCopy({
  pl: {
    section: (count: number) => `Badanie okresowe zespołu · ${count} z ${TEAM_LIMIT} os.`,
    average: "średni poziom dziaderstwa",
    waiting: "Skierowanie wystawione.",
    join: "Zrób test i dołącz do zespołu.",
    risk: "ryzyko calla",
    people: (count: number) => `${count} os.`,
    sign: (sign: string) => `Sygn. ${sign}`,
  },
  sl: {
    section: (count: number) => `Obdobni pregled kolektiva · ${count} od ${TEAM_LIMIT} os.`,
    average: "povprečna raven dziaderstva",
    waiting: "Napotnica je izdana.",
    join: "Opravi test in se pridruži kolektivu.",
    risk: "tveganje za call",
    people: (count: number) => `${count} os.`,
    sign: (sign: string) => `Opr. št. ${sign}`,
  },
});

const fit = (text: string) => (text.length <= 16 ? 76 : text.length <= 26 ? 60 : text.length <= 40 ? 48 : 40);
const percent = (value: number, lang: string) => (lang === "sl" ? `${value} %` : `${value}%`);

/**
 * The team's card for link previews (Slack, Microsoft Teams, Messenger). Live data, so a short
 * private cache; the page links it with ?n=<members> so every new member gets a new preview.
 */
export async function GET(_request: Request, { params }: RouteContext<"/[lang]/zespol/[id]/podglad">) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const found = await lookupTeam(id);
  if (found.status === "unavailable") return new Response(null, { status: 503, headers: { "Retry-After": "60" } });
  if (found.status !== "team") return new Response("Nie znaleziono", { status: 404 });
  const { team } = found;
  const t = COPY[lang];
  const report = teamReport(team, lang);
  const count = report.members.length;
  const rows = report.rows.filter((row) => row.members.length > 0).slice(0, 4);
  const riskiest = report.riskiest;

  return render(
    <OgFrame locale={lang} section={t.section(count)} path="/zespol">
      <div style={{ display: "flex", flexDirection: "column", width: count ? 520 : 560 }}>
        <div style={{ ...sans, display: "flex", fontSize: 20, color: C.red, letterSpacing: 1 }}>{t.sign(docket(team))}</div>
        <div style={{ ...bold, display: "flex", marginTop: 10, fontSize: fit(team.name), lineHeight: 0.98, letterSpacing: -1.5 }}>{team.name}</div>
        {count ? (
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 26 }}>
            <span style={{ ...bold, fontSize: 104, lineHeight: 0.85, color: C.ink }}>{percent(report.average, lang)}</span>
            <span style={{ ...italic, display: "flex", marginLeft: 18, marginBottom: 6, width: 190, fontSize: 26, lineHeight: 1.1, color: C.soft }}>{t.average}</span>
          </div>
        ) : (
          <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 34, color: C.soft }}>{t.waiting}</div>
        )}
        {report.verdict && count >= 3 ? (
          <div style={{ display: "flex", marginTop: 30 }}>
            <OgStamp label={report.verdict.stamp} fontSize={22} />
          </div>
        ) : (
          <div style={{ ...sans, display: "flex", marginTop: 30, fontSize: 24, color: C.red }}>{t.join}</div>
        )}
      </div>
      {count ? (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 36, borderTop: `2px solid ${C.ink}` }}>
          {rows.map((row) => (
            <div key={row.name} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.rule}` }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <span style={{ ...bold, fontSize: 30, lineHeight: 1, color: riskiest === row && rows.length > 1 ? C.red : C.ink }}>{row.name}</span>
                <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
                  <OgTally count={Math.round(row.average / 10)} width={170} />
                  <span style={{ ...sans, marginLeft: 12, fontSize: 18, color: C.soft }}>
                    {`${t.people(row.members.length)} · ${t.risk} ${percent(row.risk, lang)}`}
                  </span>
                </div>
              </div>
              <span style={{ ...bold, fontSize: 44, lineHeight: 1 }}>{percent(row.average, lang)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1, marginLeft: 20, justifyContent: "center" }}>
          <img src={svgDataUri("0 0 250 118", <MeetingTableDrawing />)} width={500} height={236} alt="" />
        </div>
      )}
    </OgFrame>,
    {
      "cache-control": "private, max-age=300",
      "x-robots-tag": "noindex, nofollow",
      "referrer-policy": "no-referrer",
    },
  );
}
