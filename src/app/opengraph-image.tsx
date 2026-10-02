import { Figure, SummerTorso } from "@/components/pictograms";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";
import { site } from "@/lib/site";
import { svgDataUri } from "@/lib/svg-string";

export const alt = `${site.name}, ${site.institute}. ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return render(
    <OgFrame section="Test · Atlas · Słownik · Indeks" url="dziader.si">
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 124, lineHeight: 0.9, letterSpacing: -3 }}>
          <span>Dziaderstwo</span>
          <span>nie wybiera.</span>
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 40, color: C.soft }}>{site.tagline}</div>
        <div style={{ ...sans, display: "flex", marginTop: 26, fontSize: 22, color: C.red }}>Test Dziadersa: 5 gabinetów, wynik i certyfikat</div>
      </div>
      <img src={svgDataUri("-6 -1 52 97", <Figure glasses="forehead" torso={<SummerTorso />} />)} width={226} height={421} alt="" />
    </OgFrame>,
  );
}
