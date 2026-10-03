import { hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { loadGroup, ranked } from "@/lib/group";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, OgPlate, OgTally, render } from "@/lib/og-cards";
import { compatibility } from "@/lib/test";

export const alt =
  "Ranking dziaderstwa: wyniki Testu Dziadersa w grupie znajomych · Lestvica dziaderstva: rezultati testa dziadersa v skupini prijateljev";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    cta: "Dopisz się na",
    duel: "Pojedynek",
    ranking: (count: number) => `Ranking · ${count} os.`,
    title: ["Ranking", "dziader-", "stwa"],
    compatibility: (value: number) => `Zgodność dziaderska: ${value}%`,
    join: "A ty? Dopisz się.",
  },
  sl: {
    cta: "Vpiši se na",
    duel: "Dvoboj",
    ranking: (count: number) => `Lestvica · ${count} os.`,
    title: ["Lestvica", "dziader-", "stva"],
    // A non-breaking space keeps the figure and its sign together on the card.
    compatibility: (value: number) => `Združljivost: ${value} %`,
    join: "Pa ti? Vpiši se.",
  },
});

export default async function Image({ params }: { params: Promise<{ lang: string; lista: string }> }) {
  const { lang, lista } = await params;
  if (!hasLocale(lang)) return new Response("Nie znaleziono", { status: 404 });
  const group = loadGroup(lista, lang);
  if (!group) return new Response("Nie znaleziono", { status: 404 });
  const t = COPY[lang];
  const order = ranked(group.members);
  const duel = group.members.length === 2;

  return render(
    <OgFrame locale={lang} section={duel ? t.duel : t.ranking(group.members.length)} path="/" cta={t.cta}>
      <div style={{ display: "flex", flexDirection: "column", width: 380 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.9, letterSpacing: -2 }}>
          {t.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 22, fontSize: 30, color: C.soft }}>
          {duel ? t.compatibility(compatibility(group.members[0].result, group.members[1].result)) : t.join}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 30, borderTop: `2px solid ${C.ink}` }}>
        {order.slice(0, 4).map((member, i) => (
          <div
            key={member.result.code}
            style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.rule}` }}
          >
            <span style={{ ...sans, width: 40, fontSize: 22, color: C.red }}>{String(i + 1).padStart(2, "0")}</span>
            {member.result.diagnosis.species[0] ? (
              <OgPlate species={member.result.diagnosis.species[0].key} width={96} />
            ) : (
              <div style={{ display: "flex", width: 96 }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 14 }}>
              <span style={{ ...bold, fontSize: 34, lineHeight: 1 }}>{member.label}</span>
              <div style={{ display: "flex", marginTop: 6 }}>
                <OgTally count={Math.round(member.result.score / 10)} width={200} />
              </div>
            </div>
            <span style={{ ...bold, fontSize: 52, lineHeight: 1, color: i === 0 ? C.red : C.ink }}>{member.result.score}%</span>
          </div>
        ))}
      </div>
    </OgFrame>,
    // A list always renders the same card.
    { "cache-control": "public, max-age=86400, s-maxage=31536000, immutable" },
  );
}
