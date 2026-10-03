"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useLocale } from "@/i18n/client";
import { LOCALE_COOKIE, LOCALE_INFO, LOCALES, hasLocale, type Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import { switchPath } from "@/i18n/routes";
import { cx } from "@/lib/typo";

const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Remembers the reader's edition for a year; next.config.ts sends "/" to it. */
function remember(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  listeners.forEach((listener) => listener());
}

function remembered(): Locale | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  return match && hasLocale(match[1]) ? match[1] : null;
}

/** The edition the browser asks for first, if it is one of ours. */
function preferred(): Locale | null {
  for (const language of navigator.languages ?? [navigator.language]) {
    const primary = language.toLowerCase().split("-")[0];
    if (hasLocale(primary)) return primary;
  }
  return null;
}

/** Each edition's own words, so a reader finds their language whichever page they are on. */
const OWN = defineCopy({
  pl: {
    switchTo: "Czytaj po polsku",
    current: "Czytasz wydanie polskie",
    original: "oryginał",
    suggestion: "Instytut wydaje swoje prace po polsku. Tę stronę możesz przeczytać w oryginale.",
    accept: "Czytaj po polsku",
    decline: "Zostań przy słoweńskim",
  },
  sl: {
    switchTo: "Beri v slovenščini",
    current: "Bereš slovensko izdajo",
    original: "prevod",
    suggestion: "Inštitut ima slovensko izdajo. To stran lahko prebereš v slovenščini.",
    accept: "Beri v slovenščini",
    decline: "Ostani na poljski strani",
  },
});

const COPY = defineCopy({
  pl: { nav: "Wydania Instytutu", editions: "Wydania", note: "Instytut wydaje swoje prace po polsku i w przekładzie na słoweński.", close: "Zamknij" },
  sl: {
    nav: "Izdaje Inštituta",
    editions: "Izdaje",
    note: "Slovenska izdaja je prevod. Poljske posebnosti pojasnjujejo opombe prevajalca.",
    close: "Zapri",
  },
});

function useTargets() {
  const pathname = usePathname() ?? "/";
  return Object.fromEntries(LOCALES.map((target) => [target, switchPath(pathname, target)])) as Record<Locale, string>;
}

/** Header: "PL · SL", the current edition underlined in red. On narrow screens only the other code. */
export function LanguageSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const targets = useTargets();
  return (
    <nav aria-label={COPY[locale].nav} className={className}>
      <ul className="flex items-center font-sans text-[0.95rem] font-semibold tracking-[0.06em]">
        {LOCALES.map((target, i) => {
          const current = target === locale;
          return (
            <li key={target} className={cx("items-center", current ? "hidden lg:flex" : "flex")}>
              {i > 0 && (
                <span aria-hidden="true" className="hidden px-1 text-ink-faint lg:inline">
                  /
                </span>
              )}
              <NextLink
                href={targets[target]}
                hrefLang={LOCALE_INFO[target].tag}
                lang={LOCALE_INFO[target].tag}
                prefetch={false}
                aria-current={current ? "true" : undefined}
                title={current ? OWN[target].current : OWN[target].switchTo}
                onClick={() => remember(target)}
                className={cx(
                  "relative px-1.5 py-2 transition-colors",
                  current ? "text-ink" : "text-ink-soft hover:text-red",
                  // Below lg the other edition is a small bordered tab next to the test button.
                  !current && "max-lg:border max-lg:border-ink max-lg:px-2 max-lg:py-1 max-lg:text-ink",
                )}
              >
                <span className="sr-only">{LOCALE_INFO[target].name}: </span>
                {LOCALE_INFO[target].short}
                {current && <span aria-hidden="true" className="absolute inset-x-1.5 bottom-1 h-0.5 bg-red" />}
              </NextLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Footer: both editions as title-page cards, each in its own language. */
export function EditionSwitch() {
  const locale = useLocale();
  const targets = useTargets();
  const t = COPY[locale];
  return (
    <nav aria-label={t.nav}>
      <p className="label text-ink-faint">{t.editions}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {LOCALES.map((target) => {
          const current = target === locale;
          const info = LOCALE_INFO[target];
          return (
            <li key={target}>
              <NextLink
                href={targets[target]}
                hrefLang={info.tag}
                lang={info.tag}
                prefetch={false}
                aria-current={current ? "true" : undefined}
                onClick={() => remember(target)}
                className={cx(
                  "group flex items-center gap-4 border px-4 py-3 transition-colors",
                  current ? "border-ink bg-card" : "border-rule hover:border-ink",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "grid size-11 shrink-0 place-items-center rounded-full border-2 font-sans text-[0.85rem] font-bold tracking-[0.06em]",
                    current ? "border-red text-red" : "border-ink text-ink group-hover:border-red group-hover:text-red",
                  )}
                >
                  {info.short}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold leading-tight">{info.edition}</span>
                  <span className="label block text-ink-soft">
                    {info.name} · {OWN[target].original}
                  </span>
                </span>
              </NextLink>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 max-w-md font-sans text-[0.85rem] leading-relaxed text-ink-soft">{t.note}</p>
    </nav>
  );
}

/**
 * A slip in the corner when the browser prefers the other edition and the reader has not chosen yet.
 * Nothing redirects automatically (search engines and shared links see the page they asked for);
 * a choice made here or in a switcher is remembered.
 */
export function LanguageSuggestion() {
  const locale = useLocale();
  const targets = useTargets();
  // The browser's languages are known only in the browser: nothing renders on the server.
  const suggested = useSyncExternalStore(
    subscribe,
    () => (remembered() ? null : preferred()),
    () => null,
  );

  if (!suggested || suggested === locale) return null;
  const own = OWN[suggested];
  const dismiss = () => remember(locale);

  return (
    <aside
      lang={LOCALE_INFO[suggested].tag}
      aria-label={LOCALE_INFO[suggested].edition}
      className="test-navigation fixed inset-x-4 bottom-4 z-50 max-w-sm motion-safe:animate-question-in sm:inset-x-auto sm:right-6 sm:bottom-6 print:hidden"
    >
      <div className="relative border border-ink bg-card p-5 shadow-[6px_6px_0_var(--color-ink)]">
        <p className="label flex items-center gap-2 text-red">
          <span aria-hidden="true" className="grid size-7 place-items-center rounded-full border-2 border-red text-[0.7rem] font-bold">
            {LOCALE_INFO[suggested].short}
          </span>
          {LOCALE_INFO[suggested].edition}
        </p>
        <p className="mt-3 leading-snug">{own.suggestion}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <NextLink
            href={targets[suggested]}
            hrefLang={LOCALE_INFO[suggested].tag}
            prefetch={false}
            onClick={() => remember(suggested)}
            className="btn bg-ink px-4 text-paper hover:bg-red"
          >
            {own.accept} <span aria-hidden="true">→</span>
          </NextLink>
          <button type="button" onClick={dismiss} className="font-sans text-[0.95rem] font-medium text-ink-soft underline-offset-4 hover:text-red hover:underline">
            {own.decline}
          </button>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={COPY[suggested].close}
          className="absolute right-2 top-2 grid size-9 place-items-center text-ink-soft hover:text-red"
        >
          <svg viewBox="0 0 12 12" className="w-3" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.8} />
          </svg>
        </button>
      </div>
    </aside>
  );
}

