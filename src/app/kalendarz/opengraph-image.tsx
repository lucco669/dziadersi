import { sheetFor } from "@/lib/almanac";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";
import { pageFor } from "@/lib/tear-off";
import { getToday } from "@/lib/today";

export const alt = "Kartka z kalendarza Instytutu Badań nad Dziaderstwem";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Today's page: the number, the weekday and the proverb. Changes at midnight. */
export default async function Image() {
  const today = await getToday();
  const page = pageFor(sheetFor(today.year, today.month, today.day));
  const [first, second] = page.proverb.split(" / ");
  return render(
    <OgFrame section="Kartka z kalendarza" url="dziader.si/kalendarz">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 380, padding: "18px 0", border: `3px solid ${C.ink}`, background: C.card }}>
        <div style={{ ...sans, display: "flex", fontSize: 26, letterSpacing: 4 }}>{page.monthName.toUpperCase()}</div>
        <div style={{ ...bold, display: "flex", fontSize: 220, lineHeight: 0.95, letterSpacing: -6, color: page.red ? C.red : C.ink }}>{page.day}</div>
        <div style={{ ...bold, display: "flex", fontSize: 36, color: page.red ? C.red : C.ink }}>{page.weekday}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 54 }}>
        <div style={{ ...sans, display: "flex", fontSize: 24, color: C.soft }}>{`Wschód ${page.sunrise} · zachód ${page.sunset} · ${page.daylight}`}</div>
        <div style={{ ...italic, display: "flex", flexDirection: "column", marginTop: 26, fontSize: 44, lineHeight: 1.2 }}>
          <span>{first}</span>
          {second && <span>{second}</span>}
        </div>
        {page.observance && <div style={{ ...sans, display: "flex", marginTop: 26, fontSize: 26, color: C.red }}>{page.observance.name}</div>}
      </div>
    </OgFrame>,
  );
}
