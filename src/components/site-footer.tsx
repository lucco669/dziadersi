import Link from "next/link";
import { GROUPS, SECTIONS, site } from "@/lib/site";
import { typo } from "@/lib/typo";
import { Mark, Wordmark } from "./brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink print:hidden">
      <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="flex items-center gap-3" aria-label="DZIADER.SI, strona główna">
            <Mark className="size-12 text-ink" />
            <Wordmark className="text-[2rem] leading-none" />
          </Link>
          <p className="mt-6 max-w-md text-ink-soft">
            {typo(
              "Instytut Badań nad Dziaderstwem opisuje i klasyfikuje dziaderstwo w Polsce, od parkingu pod marketem budowlanym po wigilijny stół. Działa niezależnie, bez grantów i bez zgody rodziny.",
            )}
          </p>
          <p className="mt-6 max-w-md font-sans text-[0.9rem] leading-relaxed text-ink-soft">{typo(site.disclaimer)}</p>
        </div>

        <nav aria-label="Działy" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8">
          {GROUPS.map((group) => (
            <div key={group.key}>
              <p className="label text-ink-faint">{group.label}</p>
              <ul className="mt-4 space-y-2 font-sans font-medium leading-snug">
                {SECTIONS.filter((item) => item.group === group.key).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-red">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="wrap">
        <div className="label flex flex-col gap-2 border-t border-rule py-6 text-ink-faint sm:flex-row sm:justify-between">
          <span>
            © {site.founded} {site.institute}
          </span>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {[
              ["/profil", "Profil Dziaderski"],
              ["/o-instytucie", "O Instytucie"],
              ["/regulamin", "Regulamin"],
              ["/prywatnosc", "Prywatność"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-red">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
