import { getCalendar } from "@/content/calendar";
import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";
import { dayLabel } from "@/lib/observances";

export const alt = "DZIADER.SI";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { section: "Kartka z kalendarza", title: "Kalendarz świąt nietypowych", count: (n: number) => `${n} świąt Instytutu, mniej więcej jedno na tydzień` },
  sl: { section: "Trgalni koledar", title: "Koledar nenavadnih praznikov", count: (n: number) => `${n} praznikov Inštituta, približno eden na teden` },
});

/** Picked at build time, the same in both editions: four observances spread over the year. */
const SAMPLE = ["05-20", "07-10", "10-24", "12-15"];

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = COPY[locale];
  const all = getCalendar(locale).OBSERVANCES;
  const sample = SAMPLE.map((date) => all.find((item) => item.date === date)!).filter(Boolean);
  return render(
    <OgFrame locale={locale} section={t.section} path="/kalendarz/swieta">
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ ...bold, display: "flex", fontSize: 76, lineHeight: 1, letterSpacing: -2 }}>{t.title}</div>
        <div style={{ ...italic, display: "flex", marginTop: 16, fontSize: 32, color: C.soft }}>{t.count(all.length)}</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 34 }}>
          {sample.map((item) => (
            <div key={item.date} style={{ display: "flex", alignItems: "baseline", borderTop: `2px solid ${C.ink}`, padding: "10px 0" }}>
              <div style={{ ...sans, display: "flex", width: 200, fontSize: 26, color: C.red }}>{dayLabel(item, locale)}</div>
              <div style={{ ...bold, display: "flex", fontSize: 34 }}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </OgFrame>,
  );
}
