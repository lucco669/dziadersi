import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { siteCopy } from "@/lib/site";
import { Mark, Wordmark } from "./brand";
import { LanguageSwitch } from "./language";
import { AccountLink, DesktopMenu, MobileMenu } from "./main-menu";
import { SearchButton, SearchDialog } from "./search";

const COPY = defineCopy({
  pl: { skip: "Przejdź do treści", home: "DZIADER.SI, strona główna", test: "Wykonaj test", sections: "Działy", main: "Główna" },
  sl: { skip: "Skoči na vsebino", home: "DZIADER.SI, domača stran", test: "Opravi test", sections: "Oddelki", main: "Glavni meni" },
});

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <>
      <a
        href="#tresc"
        className="label sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skip}
      </a>

      <header className="relative z-40 border-b border-ink print:hidden">
        <div className="wrap flex items-center justify-between gap-4 py-4 md:py-5">
          <Link href="/" className="group flex items-center gap-2.5 md:gap-4" aria-label={t.home}>
            <Mark className="size-10 shrink-0 text-ink transition-transform duration-300 group-hover:-rotate-12 md:size-14" />
            <span className="flex flex-col">
              <Wordmark className="text-[1.35rem] leading-none min-[400px]:text-[1.55rem] sm:text-[1.75rem] md:text-[2.45rem]" />
              <span className="label mt-1 hidden text-[0.8rem] text-ink-soft sm:block md:text-[0.875rem]">{siteCopy(locale).institute}</span>
            </span>
          </Link>

          <div className="test-navigation flex items-center gap-4 xl:gap-6">
            <nav aria-label={t.main} className="hidden lg:block">
              <DesktopMenu />
            </nav>
            <SearchButton className="hidden py-2 transition-colors hover:text-red lg:block" />
            <div className="hidden lg:block">
              <AccountLink />
            </div>
            <LanguageSwitch className="hidden min-[420px]:block" />
            <Link href="/test" className="btn bg-ink px-3.5 text-[0.95rem] text-paper hover:bg-red sm:px-4 sm:text-base md:px-5">
              {t.test}
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label={t.sections} className="test-navigation lg:hidden print:hidden">
        <MobileMenu />
      </nav>
      <SearchDialog />
    </>
  );
}
