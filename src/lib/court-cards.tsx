import { commissionDrawing } from "@/components/court";
import { caseCategories, docket, getVerdicts, type Case } from "@/content/cases";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { C, OgFrame, OgStamp, bold, italic, sans } from "./og";
import { render } from "./og-cards";
import { svgDataUri } from "./svg-string";
import { pluralSl, quote } from "./typo";

const COPY = defineCopy({
  pl: {
    section: "Komisja Orzekająca",
    question: "Czy to już dziaderstwo?",
    subtitle: (cases: number) => `${cases} spraw z życia wziętych. Orzekasz jako ławnik, Komisja uzasadnia.`,
    docket: "Sygn. akt",
  },
  sl: {
    section: "Razsodna komisija",
    question: "Je to že dziaderstvo?",
    subtitle: (cases: number) =>
      `${cases} ${pluralSl(cases, "primer", "primera", "primeri", "primerov")} iz življenja. Razsojaš kot porotnik, Komisija obrazloži.`,
    docket: "Opr. št.",
  },
});

const plate = (width: number) => (
  <img src={svgDataUri("0 -14 120 114", commissionDrawing())} width={width} height={(width * 114) / 120} alt="" />
);

/** The Komisja's share card: the bench and the question. */
export function commissionCard(cases: number, locale: Locale) {
  const t = COPY[locale];
  return render(
    <OgFrame locale={locale} section={t.section} path="/czy-to-juz-dziaderstwo">
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 30 }}>
        <div style={{ ...bold, display: "flex", fontSize: 104, lineHeight: 0.92, letterSpacing: -2.5 }}>{t.question}</div>
        <div style={{ ...italic, display: "flex", marginTop: 24, maxWidth: 600, fontSize: 34, lineHeight: 1.2, color: C.soft }}>
          {t.subtitle(cases)}
        </div>
      </div>
      {plate(400)}
    </OgFrame>,
  );
}

const STAMP_ROTATIONS = [-2, 1, -3];

/** One case, in its edition: the docket number, the title, the defence, and three stamps to choose from. */
export function caseCard(item: Case, locale: Locale) {
  const t = COPY[locale];
  return render(
    <OgFrame locale={locale} section={`${t.docket} ${docket(item)} · ${caseCategories(locale)[item.category]}`} path={`/czy-to-juz-dziaderstwo/${item.slug}`}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ ...sans, display: "flex", fontSize: 26, color: C.red }}>{t.question}</div>
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
          {quote(item.defence, locale)}
        </div>
        <div style={{ display: "flex", marginTop: 34, gap: 26 }}>
          {getVerdicts(locale).map((verdict, i) => (
            <OgStamp key={verdict.key} label={verdict.short} fontSize={22} rotate={STAMP_ROTATIONS[i]} />
          ))}
        </div>
      </div>
    </OgFrame>,
  );
}
