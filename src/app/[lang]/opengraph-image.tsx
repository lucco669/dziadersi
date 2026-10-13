import { hasLocale, LOCALES } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, bold, italic, sans } from "@/lib/og";
import { OG_SIZE, OgPlate, render } from "@/lib/og-cards";
import { siteCopy } from "@/lib/site";

export const alt = "DZIADER.SI, Instytut Badań nad Dziaderstwem. Zbadaj się, zanim będzie za późno. · DZIADER.SI, Inštitut za raziskave dziaderstva. Preglej se, preden bo prepozno.";
export const size = OG_SIZE;
export const contentType = "image/png";

const COPY = defineCopy({
  pl: {
    section: "Test · Atlas · Słownik · Indeks",
    heading: ["Dziaderstwo", "nie wybiera."],
    test: "Test Dziadersa: 5 gabinetów, wynik i certyfikat",
  },
  sl: {
    section: "Test · Atlas · Slovar · Indeks",
    heading: ["Dziaderstvo", "ne izbira."],
    test: "Test dziadersa: 5 ordinacij, izvid in certifikat",
  },
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "pl";
  const t = COPY[locale];
  return render(
    <OgFrame locale={locale} section={t.section} path="/">
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ ...bold, display: "flex", flexDirection: "column", fontSize: 106, lineHeight: 0.9, letterSpacing: -3 }}>
          <span>{t.heading[0]}</span>
          <span>{t.heading[1]}</span>
        </div>
        <div style={{ ...italic, display: "flex", marginTop: 26, fontSize: 40, color: C.soft }}>{siteCopy(locale).tagline}</div>
        <div style={{ ...sans, display: "flex", marginTop: 26, fontSize: 22, color: C.red }}>{t.test}</div>
      </div>
      <div style={{ display: "flex", position: "relative", width: 390, height: 310 }}>
        <div style={{ display: "flex", position: "absolute", left: -20, top: 40 }}><OgPlate species="grill" specimen={1} width={220} /></div>
        <div style={{ display: "flex", position: "absolute", left: 100, top: 0 }}><OgPlate species="korpo" specimen={2} width={220} /></div>
        <div style={{ display: "flex", position: "absolute", left: 200, top: 80 }}><OgPlate species="budowa" specimen={0} width={220} /></div>
      </div>
    </OgFrame>,
  );
}
