import Link from "next/link";
import { Mark, Wordmark } from "./brand";
import { AccountLink, DesktopMenu, MobileMenu } from "./main-menu";
import { SearchButton, SearchDialog } from "./search";

export function SiteHeader() {
  return (
    <>
      <a
        href="#tresc"
        className="label sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Przejdź do treści
      </a>

      <header className="relative z-40 border-b border-ink print:hidden">
        <div className="wrap flex items-center justify-between gap-4 py-4 md:py-5">
          <Link href="/" className="group flex items-center gap-2.5 md:gap-4" aria-label="DZIADER.SI, strona główna">
            <Mark className="size-10 shrink-0 text-ink transition-transform duration-300 group-hover:-rotate-12 md:size-14" />
            <span className="flex flex-col">
              <Wordmark className="text-[1.35rem] leading-none min-[400px]:text-[1.55rem] sm:text-[1.75rem] md:text-[2.45rem]" />
              <span className="label mt-1 hidden text-[0.8rem] text-ink-soft sm:block md:text-[0.875rem]">
                Instytut Badań nad Dziaderstwem
              </span>
            </span>
          </Link>

          <div className="test-navigation flex items-center gap-4 xl:gap-6">
            <nav aria-label="Główna" className="hidden lg:block">
              <DesktopMenu />
            </nav>
            <SearchButton className="hidden py-2 transition-colors hover:text-red lg:block" />
            <div className="hidden lg:block">
              <AccountLink />
            </div>
            <Link href="/test" className="btn bg-ink px-3.5 text-[0.95rem] text-paper hover:bg-red sm:px-4 sm:text-base md:px-5">
              Wykonaj test
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label="Działy" className="test-navigation lg:hidden print:hidden">
        <MobileMenu />
      </nav>
      <SearchDialog />
    </>
  );
}
