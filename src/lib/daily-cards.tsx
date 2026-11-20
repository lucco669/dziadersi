import type { Page } from "@/components/tear-off";
import type { Entry } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import type { Bulletin } from "./bulletin";
import { Sparkline } from "./index-badge";
import { C, OgStamp, bold, italic, sans, serif } from "./og";
import type { StoryFormat } from "./share-file";
import { StoryFrame } from "./story-cards";
import { plural, pluralSl, pct, quote, roman, typo } from "./typo";

/*
 * The day's rotating content as portrait posts, for scripts/social-kit.ts: the tear-off calendar
 * page, the word of the day and the Index bulletin. The case of the day is caseStory().
 */

/** Translator's note markers (¹ ² ³) point at notes the image has no room for. */
const bare = (text: string) => text.replace(/[¹²³]/g, "");

const fit = (length: number, steps: [number, number][], smallest: number) => steps.find(([max]) => length <= max)?.[1] ?? smallest;

const COPY = defineCopy({
  pl: {
    calendar: "Kartka z kalendarza",
    calendarAsk: "Zerwij dzisiejszą kartkę na",
    sunrise: "Wschód",
    sunset: "Zachód",
    daylight: "Dzień",
    dayOfYear: (day: number, left: number) => `${day}. dzień roku, zostało ${left}`,
    toEve: (days: number) => (days === 0 ? "Dziś Wigilia" : `Do Wigilii: ${days} ${plural(days, "dzień", "dni", "dni")}`),
    dictionary: "Słownik Dziaderski · Hasło dnia",
    example: "Przykład użycia",
    original: "",
    entryAsk: "Całe hasło i cały Słownik na",
    index: "Narodowy Indeks Dziaderstwa · Komunikat",
    state: "Stan dziaderstwa dziś",
    percent: (value: string) => `${value}%`,
    warning: (level: string) => `Ostrzeżenie ${level} stopnia`,
    days: "Ostatnie 30 dni",
    indexAsk: "Prognoza na Wigilię na",
  },
  sl: {
    calendar: "Trgalni koledar",
    calendarAsk: "Odtrgaj današnji list na",
    sunrise: "Vzhod",
    sunset: "Zahod",
    daylight: "Dan",
    dayOfYear: (day: number, left: number) => `${day}. dan v letu, ostane jih ${left}`,
    toEve: (days: number) => (days === 0 ? "Danes je sveti večer" : `Do svetega večera: ${days} ${pluralSl(days, "dan", "dneva", "dnevi", "dni")}`),
    dictionary: "Dziaderski slovar · Geslo dneva",
    example: "Primer rabe",
    original: "polj.",
    entryAsk: "Celo geslo in ves slovar na",
    index: "Nacionalni indeks dziaderstva · Sporočilo",
    state: "Jakost dziaderstva danes",
    percent: (value: string) => `${value} %`,
    warning: (level: string) => `Opozorilo ${level}. stopnje`,
    days: "Zadnjih 30 dni",
    indexAsk: "Napoved za sveti večer na",
  },
});

/** Today's page of the tear-off calendar: the day, the sun, the observance and the proverb. */
export function calendarStory(page: Page, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const [first, second] = page.proverb.split(" / ");
  const color = page.red ? C.red : C.ink;
  return (
    <StoryFrame locale={locale} format={format} section={t.calendar} path="/kalendarz" ask={t.calendarAsk}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 40px",
          padding: "0 44px 26px",
          background: C.card,
          border: `2px solid ${C.ink}`,
          textAlign: "center",
        }}
      >
        {/* The perforation the page was torn along. */}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginTop: 14, marginBottom: 16 }}>
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} style={{ display: "flex", width: 10, height: 10, borderRadius: 9999, background: C.paper, border: `1.5px solid ${C.rule}` }} />
          ))}
        </div>
        <div style={{ ...sans, display: "flex", width: "100%", justifyContent: "space-between", fontSize: 28, letterSpacing: 3 }}>
          <span>{page.monthName.toUpperCase()}</span>
          <span style={{ color: C.soft }}>{page.year}</span>
        </div>
        <div style={{ ...bold, display: "flex", marginTop: 4, fontSize: story ? 330 : 270, lineHeight: 0.9, letterSpacing: -12, color }}>{page.day}</div>
        <div style={{ ...bold, display: "flex", fontSize: 50, color }}>{page.weekday}</div>
        {page.holiday && <div style={{ ...sans, display: "flex", marginTop: 4, fontSize: 24, color: C.red }}>{page.holiday}</div>}
        <div
          style={{
            ...sans,
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            marginTop: 20,
            padding: "10px 0",
            borderTop: `2px solid ${C.ink}`,
            borderBottom: `2px solid ${C.ink}`,
            fontSize: 24,
          }}
        >
          {[
            [t.sunrise, page.sunrise],
            [t.sunset, page.sunset],
            [t.daylight, page.daylight],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: C.soft }}>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
        {page.observance && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
            <div style={{ ...sans, display: "flex", fontSize: 28, color: C.red }}>{page.observance.name}</div>
            <div style={{ ...sans, display: "flex", marginTop: 4, fontSize: 22, color: C.soft }}>{typo(page.observance.note)}</div>
          </div>
        )}
        <div style={{ ...italic, display: "flex", flexDirection: "column", alignItems: "center", marginTop: 22, fontSize: story ? 40 : 36, lineHeight: 1.25 }}>
          <span>{typo(first)}</span>
          {second && <span>{typo(second)}</span>}
        </div>
        <div
          style={{
            ...sans,
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            marginTop: 22,
            paddingTop: 10,
            borderTop: `1px solid ${C.rule}`,
            fontSize: 20,
            color: C.soft,
          }}
        >
          <span>{t.dayOfYear(page.dayOfYear, page.daysLeft)}</span>
          <span>{t.toEve(page.toChristmasEve)}</span>
        </div>
      </div>
    </StoryFrame>
  );
}

/** The word of the day: headword, grammar and pronunciation, the first sense and the example. */
export function entryStory(entry: Entry, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const sense = bare(entry.senses[0].text);
  const example = bare(entry.example);
  return (
    <StoryFrame locale={locale} format={format} section={t.dictionary} path={`/slownik/${entry.slug}`} ask={t.entryAsk}>
      <div style={{ ...bold, display: "flex", fontSize: fit(entry.headword.length, [[16, 112], [26, 92], [36, 76]], 64), lineHeight: 0.98, letterSpacing: -2 }}>
        {typo(bare(entry.headword))}
      </div>
      <div style={{ ...italic, display: "flex", flexWrap: "wrap", alignItems: "baseline", marginTop: 18, fontSize: 34, color: C.soft }}>
        <span style={{ marginRight: 22 }}>{entry.grammar}</span>
        <span style={{ ...sans, fontStyle: "normal", fontSize: 26 }}>{entry.pronunciation}</span>
      </div>
      {t.original && entry.original && <div style={{ ...sans, display: "flex", marginTop: 10, fontSize: 24, color: C.soft }}>{`${t.original} ${entry.original}`}</div>}
      <div
        style={{
          ...serif,
          display: "flex",
          marginTop: 34,
          paddingTop: 24,
          borderTop: `2px solid ${C.ink}`,
          fontSize: fit(sense.length, [[120, story ? 44 : 40], [220, 36]], 32),
          lineHeight: 1.3,
        }}
      >
        {typo(sense)}
      </div>
      <div style={{ ...sans, display: "flex", marginTop: 34, fontSize: 24, color: C.soft }}>{t.example}</div>
      <div
        style={{
          ...italic,
          display: "flex",
          marginTop: 8,
          paddingLeft: 26,
          borderLeft: `4px solid ${C.red}`,
          fontSize: fit(example.length, [[110, 38], [200, 33]], 29),
          lineHeight: 1.25,
        }}
      >
        {quote(typo(example), locale)}
      </div>
    </StoryFrame>
  );
}

/** The Index bulletin: today's value and zone, the season's warning and alert, the last thirty days. */
export function indexStory(bulletin: Bulletin, locale: Locale, format: StoryFormat) {
  const t = COPY[locale];
  const story = format === "story";
  const { value, zone, season } = bulletin.index;
  return (
    <StoryFrame locale={locale} format={format} section={t.index} path="/indeks" ask={t.indexAsk}>
      <div style={{ ...sans, display: "flex", fontSize: 30, color: C.soft }}>{`${t.state} · ${bulletin.date}`}</div>
      <div style={{ ...bold, display: "flex", marginTop: 6, fontSize: story ? 260 : 230, lineHeight: 0.9, letterSpacing: -9 }}>{t.percent(pct(value))}</div>
      <div style={{ ...bold, display: "flex", marginTop: 4, fontSize: 70, lineHeight: 1 }}>{zone.label}</div>
      <div style={{ display: "flex", marginTop: 36 }}>
        <OgStamp label={t.warning(roman(season.level))} fontSize={28} />
      </div>
      <div style={{ ...serif, display: "flex", marginTop: 30, paddingLeft: 26, borderLeft: `4px solid ${C.red}`, fontSize: 36, lineHeight: 1.3 }}>
        {typo(season.alert)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 44 }}>
        <Sparkline values={bulletin.chart.measured.slice(-30)} width={936} height={story ? 220 : 170} />
        <div style={{ ...sans, display: "flex", marginTop: 10, fontSize: 24, color: C.soft }}>{t.days}</div>
      </div>
    </StoryFrame>
  );
}
