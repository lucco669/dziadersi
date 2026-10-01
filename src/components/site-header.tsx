import Link from "next/link";
import { Mark, Wordmark } from "./brand";

export const NAV = [
  { href: "/atlas", label: "Atlas" },
  { href: "/slownik", label: "Słownik" },
  { href: "/raporty", label: "Raporty" },
  { href: "/indeks", label: "Indeks" },
];

export function SiteHeader() {
  return (
    <>
      <a
        href="#tresc"
        className="label sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Przejdź do treści
      </a>

      <header className="border-b border-ink">
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

          <div className="flex items-center gap-8">
            <nav aria-label="Główna" className="hidden lg:block">
              <ul className="flex items-center gap-7 font-sans text-[1.0625rem] font-medium">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="py-2 transition-colors hover:text-red">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link href="/test" className="btn bg-ink px-3.5 text-[0.95rem] text-paper hover:bg-red sm:px-4 sm:text-base md:px-5">
              Wykonaj test
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label="Główna" className="border-b border-rule lg:hidden">
        <ul className="wrap flex gap-6 overflow-x-auto py-3 font-sans text-[1rem] font-medium [scrollbar-width:none]">
          {NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
