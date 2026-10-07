import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, render, OgPlate } from "@/lib/og-cards";
import { OgFrame, bold, sans, C } from "@/lib/og";

export const alt = "Pan tu nie stał! · Vi pa niste bili v vrsti! · DZIADER.SI";
export const size = OG_SIZE;
export const contentType = "image/png";
export function generateStaticParams() { return LOCALES.map((lang) => ({ lang })); }
const COPY = defineCopy({
  pl: { title: "Pan tu nie stał!", sub: "Jedna sprawa. Cały aparat państwa.", section: "Laboratorium zachowań kolejkowych", detail: "9 osób przed tobą. 40 minut do zamknięcia." },
  sl: { title: "Vi pa niste bili v vrsti!", sub: "Ena zadeva. Ves državni aparat.", section: "Laboratorij vedenja v vrstah", detail: "9 ljudi pred tabo. 40 minut do zaprtja." },
});
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = COPY[lang];
  return render(<OgFrame locale={lang} section={t.section} path="/kolejka"><div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 20 }}><div style={{ ...bold, fontSize: lang === "pl" ? 94 : 77, lineHeight: 1, maxWidth: 660 }}>{t.title}</div><div style={{ ...bold, fontSize: 32, marginTop: 28 }}>{t.sub}</div><div style={{ ...sans, fontSize: 22, color: C.soft, marginTop: 20 }}>{t.detail}</div></div><OgPlate species="kolejkowy" width={420} /></OgFrame>);
}
