import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { OG_SIZE, render } from "@/lib/og-cards";
import { OgFrame, bold, sans, C } from "@/lib/og";

export const alt = "Król grilla · Kralj žara · DZIADER.SI";
export const size = OG_SIZE;
export const contentType = "image/png";
export function generateStaticParams() { return LOCALES.map((lang) => ({ lang })); }
const COPY = defineCopy({
  pl: { title: "Król grilla", sub: "Szczypce są tylko jedne.", section: "Pracownia obróbki termicznej", detail: "90 sekund. Sześć miejsc. Cała rodzina wie lepiej." },
  sl: { title: "Kralj žara", sub: "Klešče so samo ene.", section: "Laboratorij za toplotno obdelavo", detail: "90 sekund. Šest mest. Vsa družina ve bolje." },
});

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = COPY[lang], art = await readFile(join(process.cwd(), "assets/illustrations/grill/hero-600.png"));
  return render(<OgFrame locale={lang} section={t.section} path="/krol-grilla"><div style={{ display: "flex", flexDirection: "column", flex: 1 }}><div style={{ ...bold, fontSize: 106, lineHeight: 1, maxWidth: 520 }}>{t.title}</div><div style={{ ...bold, fontSize: 35, marginTop: 25 }}>{t.sub}</div><div style={{ ...sans, fontSize: 23, color: C.soft, marginTop: 24, maxWidth: 430 }}>{t.detail}</div></div>{/* Satori requires an embedded local raster. */}<img src={`data:image/png;base64,${art.toString("base64")}`} width={550} height={367} alt="" style={{ objectFit: "contain", alignSelf: "center" }} /></OgFrame>);
}
