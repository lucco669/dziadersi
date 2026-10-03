import { DEFAULT_LOCALE, hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { sheetFor } from "@/lib/almanac";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";
import { pageFor } from "@/lib/tear-off";
import { getToday } from "@/lib/today";

export const alt = "Kartka z kalendarza Instytutu Badań nad Dziaderstwem · Trgalni koledar Inštituta za raziskave dziaderstva";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Kartka z kalendarza",
    sun: (sunrise: string, sunset: string, daylight: string) => `Wschód ${sunrise} · zachód ${sunset} · ${daylight}`,
  },
  sl: {
    section: "Trgalni koledar",
    sun: (sunrise: string, sunset: string, daylight: string) => `V Varšavi vzhod ${sunrise} · zahod ${sunset} · ${daylight}`,
  },
});

/** Today's page: the number, the weekday and the proverb. Changes at midnight. */
/** Both editions' cards are drawn at build time, like the other section cards. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const t = COPY[locale];
  const today = await getToday();
  const page = pageFor(sheetFor(today.year, today.month, today.day, locale), locale);
  const [first, second] = page.proverb.split(" / ");
  return render(
    <OgFrame locale={locale} section={t.section} path="/kalendarz">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 380, padding: "18px 0", border: `3px solid ${C.ink}`, background: C.card }}>
        <div style={{ ...sans, display: "flex", fontSize: 26, letterSpacing: 4 }}>{page.monthName.toUpperCase()}</div>
        <div style={{ ...bold, display: "flex", fontSize: 220, lineHeight: 0.95, letterSpacing: -6, color: page.red ? C.red : C.ink }}>{page.day}</div>
        <div style={{ ...bold, display: "flex", fontSize: 36, color: page.red ? C.red : C.ink }}>{page.weekday}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 54 }}>
        <div style={{ ...sans, display: "flex", fontSize: 24, color: C.soft }}>{t.sun(page.sunrise, page.sunset, page.daylight)}</div>
        <div style={{ ...italic, display: "flex", flexDirection: "column", marginTop: 26, fontSize: 44, lineHeight: 1.2 }}>
          <span>{first}</span>
          {second && <span>{second}</span>}
        </div>
        {page.observance && <div style={{ ...sans, display: "flex", marginTop: 26, fontSize: 26, color: C.red }}>{page.observance.name}</div>}
      </div>
    </OgFrame>,
  );
}
