import { commissionDrawing } from "@/components/court";
import { CASE_CATEGORIES, docket, type Case } from "@/content/cases";
import { C, OgFrame, OgStamp, bold, italic, sans } from "./og";
import { render } from "./og-cards";
import { svgDataUri } from "./svg-string";

const plate = (width: number) => (
  <img src={svgDataUri("0 -14 120 114", commissionDrawing())} width={width} height={(width * 114) / 120} alt="" />
);

/** The Komisja's share card: the bench and the question. */
export function commissionCard(cases: number) {
  return render(
    <OgFrame section="Komisja Orzekająca" url="dziader.si/czy-to-juz-dziaderstwo">
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 30 }}>
        <div style={{ ...bold, display: "flex", fontSize: 104, lineHeight: 0.92, letterSpacing: -2.5 }}>Czy to już dziaderstwo?</div>
        <div style={{ ...italic, display: "flex", marginTop: 24, maxWidth: 600, fontSize: 34, lineHeight: 1.2, color: C.soft }}>
          {`${cases} spraw z życia wziętych. Orzekasz jako ławnik, Komisja uzasadnia.`}
        </div>
      </div>
      {plate(400)}
    </OgFrame>,
  );
}

/** One case: the docket number, the title, the defence, and three stamps to choose from. */
export function caseCard(item: Case) {
  return render(
    <OgFrame section={`Sygn. akt ${docket(item)} · ${CASE_CATEGORIES[item.category]}`} url={`dziader.si/czy-to-juz-dziaderstwo/${item.slug}`}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ ...sans, display: "flex", fontSize: 26, color: C.red }}>Czy to już dziaderstwo?</div>
        <div
          style={{
            ...bold,
            display: "flex",
            marginTop: 12,
            fontSize: item.title.length > 34 ? 70 : 84,
            lineHeight: 0.98,
            letterSpacing: -1.6,
          }}
        >
          {item.title}
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 22, maxWidth: 900, fontSize: 32, lineHeight: 1.2, color: C.soft }}>
          {`„${item.defence}”`}
        </div>
        <div style={{ display: "flex", marginTop: 34, gap: 26 }}>
          <OgStamp label="Nie" fontSize={22} rotate={-2} />
          <OgStamp label="Tak" fontSize={22} rotate={1} />
          <OgStamp label="Kliniczne" fontSize={22} rotate={-3} />
        </div>
      </div>
    </OgFrame>,
  );
}
