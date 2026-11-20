import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { daysUntil, observancesFrom, type Day } from "@/lib/observances";
import { cx, plural, pluralSl, typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    label: "Dziś obchodzimy",
    none: "Dziś Instytut nie obchodzi żadnego święta. Dzień roboczy obserwatora.",
    next: "Najbliższe święto",
    inDays: (days: number) => (days === 1 ? "jutro" : `za ${days} ${plural(days, "dzień", "dni", "dni")}`),
    all: "Wszystkie święta nietypowe",
  },
  sl: {
    label: "Danes praznujemo",
    none: "Danes Inštitut ne praznuje ničesar. Delovni dan opazovalca.",
    next: "Najbližji praznik",
    inDays: (days: number) => (days === 1 ? "jutri" : `čez ${days} ${pluralSl(days, "dan", "dneva", "dnevi", "dni")}`),
    all: "Vsi nenavadni prazniki",
  },
});

/**
 * "What are we celebrating today?": today's observance, or the next one when the day has none.
 * The date comes from the page (getToday), so it changes at midnight with the rest of the page.
 */
export function TodayObservance({ today, locale, className, all = true }: { today: Day; locale: Locale; className?: string; all?: boolean }) {
  const t = COPY[locale];
  const { today: current, upcoming } = observancesFrom(today, locale, 1);
  const next = upcoming[0];
  return (
    <div className={cx("border-l-2 border-red pl-5", className)}>
      <p className="label text-red">{t.label}</p>
      {current ? (
        <>
          <Link href={"/kalendarz/" + current.item.slug} className="mt-2 block text-2xl font-bold leading-tight hover:text-red">
            {current.item.name}
          </Link>
          <p className="mt-2 max-w-xl text-ink-soft">{typo(current.item.note)}</p>
        </>
      ) : (
        <p className="mt-2 max-w-xl text-lg leading-snug">{t.none}</p>
      )}
      {next && (
        <p className="mt-4 font-sans text-[0.95rem] text-ink-soft">
          {t.next}:{" "}
          <Link href={"/kalendarz/" + next.item.slug} className="link font-medium text-ink">
            {next.item.name}
          </Link>
          , {next.sheet.date.replace(/ \d{4}$/, "")} ({t.inDays(daysUntil(next.sheet, today))})
        </p>
      )}
      {all && (
        <p className="mt-3 font-sans text-[0.95rem]">
          <Link href="/kalendarz/swieta" className="link">
            {t.all} →
          </Link>
        </p>
      )}
    </div>
  );
}
