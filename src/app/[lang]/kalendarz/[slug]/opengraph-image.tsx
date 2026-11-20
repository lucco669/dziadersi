import { notFound } from "next/navigation";
import { getCalendar, observanceBySlug } from "@/content/calendar";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { sheetFor } from "@/lib/almanac";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, render } from "@/lib/og-cards";

export const alt = "DZIADER.SI";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: { section: "Kalendarz świąt nietypowych", yearly: "Obchodzone co roku" },
  sl: { section: "Koledar nenavadnih praznikov", yearly: "Praznuje se vsako leto" },
});

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return getCalendar(hasLocale(params.lang) ? params.lang : DEFAULT_LOCALE).OBSERVANCES.map((item) => ({ slug: item.slug }));
}

/** A page of the tear-off calendar with the day's number, and the observance beside it. No year: it falls every year. */
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const item = observanceBySlug(slug, locale);
  if (!item) notFound();
  const t = COPY[locale];
  const [month, day] = item.date.split("-").map(Number);
  const sheet = sheetFor(2001, month, day, locale);
  return render(
    <OgFrame locale={locale} section={t.section} path={"/kalendarz/" + item.slug}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 340, padding: "22px 0", border: `3px solid ${C.ink}`, background: C.card }}>
        <div style={{ ...sans, display: "flex", fontSize: 26, letterSpacing: 4 }}>{sheet.monthName.toUpperCase()}</div>
        <div style={{ ...bold, display: "flex", fontSize: 220, lineHeight: 0.95, letterSpacing: -6, color: C.red }}>{day}</div>
        <div style={{ ...sans, display: "flex", fontSize: 22, color: C.soft }}>{t.yearly}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 54 }}>
        <div style={{ ...bold, display: "flex", fontSize: item.name.length > 34 ? 52 : 64, lineHeight: 1.02, letterSpacing: -1 }}>{item.name}</div>
        <div style={{ ...italic, display: "flex", marginTop: 28, fontSize: 32, lineHeight: 1.25, color: C.soft }}>{item.note}</div>
      </div>
    </OgFrame>,
  );
}
