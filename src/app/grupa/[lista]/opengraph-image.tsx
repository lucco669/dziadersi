import { loadGroup, ranked } from "@/lib/group";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, OgPlate, OgTally, render } from "@/lib/og-cards";
import { compatibility } from "@/lib/test";

export const alt = "Ranking dziaderstwa: wyniki Testu Dziadersa w grupie znajomych";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lista: string }> }) {
  const group = loadGroup((await params).lista);
  if (!group) return new Response("Nie znaleziono", { status: 404 });
  const order = ranked(group.members);
  const duel = group.members.length === 2;

  return render(
    <OgFrame section={duel ? "Pojedynek" : `Ranking · ${group.members.length} os.`} url="Dopisz się na dziader.si">
      <div style={{ display: "flex", flexDirection: "column", width: 380 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.9, letterSpacing: -2 }}>
          <span>Ranking</span>
          <span>dziader-</span>
          <span>stwa</span>
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 22, fontSize: 30, color: C.soft }}>
          {duel ? `Zgodność dziaderska: ${compatibility(group.members[0].result, group.members[1].result)}%` : "A ty? Dopisz się."}
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
