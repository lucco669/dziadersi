import type { ReactNode } from "react";
import type { Exhibit } from "@/content/museum";
import { museumDrawing } from "@/components/museum-drawing";
import { defineCopy } from "@/i18n/copy";
import type { Locale } from "@/i18n/config";
import { C, OgFrame, bold, sans, serif } from "./og";
import { OgPlate, render } from "./og-cards";
import { svgDataUri } from "./svg-string";

const COPY = defineCopy({
  pl: { museum: "Muzeum rzeczy, które jeszcze się przydadzą", stamp: "NIE WYRZUCAĆ" },
  sl: { museum: "Muzej stvari, ki bodo še prišle prav", stamp: "NE ZAVRZI" },
});

export function fieldworkCard(
  locale: Locale,
  fields: { title: string; subtitle: string; path: string; section: string; art?: ReactNode },
) {
  return render(
    <OgFrame locale={locale} section={fields.section} path={fields.path}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 28 }}>
        <div
          style={{
            ...bold,
            display: "flex",
            fontSize: fields.title.length > 35 ? 64 : 82,
            lineHeight: 1,
            letterSpacing: -1.5,
          }}
        >
          {fields.title}
        </div>
        <div style={{ ...serif, display: "flex", marginTop: 24, fontSize: 30, lineHeight: 1.2, color: C.soft }}>
          {fields.subtitle}
        </div>
      </div>
      {fields.art ?? <OgPlate species="grill" width={380} />}
    </OgFrame>,
  );
}

export function museumCard(exhibit: Exhibit, locale: Locale, headers?: Record<string, string>) {
  const t = COPY[locale];
  return render(
    <OgFrame locale={locale} section={t.museum} path={"/muzeum/" + exhibit.slug}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 24 }}>
        <div style={{ ...sans, fontSize: 22, color: C.soft }}>{exhibit.code}</div>
        <div style={{ ...bold, display: "flex", marginTop: 16, fontSize: 66, lineHeight: 1 }}>{exhibit.name}</div>
        <div style={{ ...serif, display: "flex", marginTop: 20, fontSize: 28, color: C.soft }}>{exhibit.subtitle}</div>
        <div
          style={{
            ...sans,
            display: "flex",
            alignSelf: "flex-start",
            marginTop: 28,
            border: "3px solid " + C.red,
            padding: "10px 16px",
            color: C.red,
            fontSize: 23,
            transform: "rotate(-3deg)",
          }}
        >
          {t.stamp}
        </div>
      </div>
      <img src={svgDataUri("0 0 240 164", museumDrawing(exhibit.kind))} width={430} height={294} alt="" />
    </OgFrame>,
    headers,
  );
}
