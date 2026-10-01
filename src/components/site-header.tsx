import Link from "next/link";
import type { Bulletin } from "@/lib/bulletin";
import { roman } from "@/lib/typo";
import { SealMark, Wordmark } from "./brand";

const NAV = [
  { href: "/#test", label: "Test" },
  { href: "/#atlas", label: "Atlas" },
  { href: "/#indeks", label: "Indeks" },
  { href: "/#slownik", label: "Słownik" },
  { href: "/#dzialy", label: "Działy" },
];

export function SiteHeader({ bulletin }: { bulletin: Bulletin }) {
  const { season } = bulletin.index;

  return (
    <>
      <a
        href="#tresc"
        className="kicker sr-only z-50 bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Przejdź do treści
      </a>

      <div className="border-b border-rule">
        <div className="wrap kicker flex items-center justify-between gap-6 py-2.5 text-ink-soft">
          <p>
            {bulletin.dateLong}
            <span className="hidden sm:inline">
              <span className="mx-2.5 text-rule">|</span>Biuletyn dzienny nr {bulletin.issue}
            </span>
          </p>
          <Link href="/#indeks" className="hidden items-center gap-2 hover:text-ink md:flex">
            <span className="size-1.5 rounded-full bg-bordo" aria-hidden="true" />
            Ostrzeżenie {roman(season.level)} stopnia · {season.title}
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-ink bg-paper">
        <div className="wrap flex h-16 items-center justify-between gap-3 md:h-[4.5rem] md:gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="DZIADER.SI, strona główna">
            <SealMark className="size-10 shrink-0 text-bordo transition-transform duration-300 group-hover:-rotate-12 md:size-11" />
            <span className="flex flex-col">
              <Wordmark className="text-[1.55rem] leading-none md:text-[1.75rem]" />
              <span className="kicker mt-1 hidden text-[0.58rem] text-ink-faint sm:block">
                Instytut Badań nad Dziaderstwem
              </span>
            </span>
          </Link>

          <nav aria-label="Główna" className="hidden lg:block">
            <ul className="kicker flex items-center gap-8 text-[0.72rem]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="py-2 transition-colors hover:text-green">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/#test" className="btn shrink-0 whitespace-nowrap bg-green px-3 py-3 text-[0.72rem] text-paper hover:bg-ink sm:text-[0.8125rem] md:px-5">
            Wykonaj test
          </Link>
        </div>
      </header>

      <nav aria-label="Główna" className="border-b border-rule lg:hidden">
        <ul className="wrap kicker flex gap-7 overflow-x-auto py-3 [scrollbar-width:none]">
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
