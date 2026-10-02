import Link from "next/link";
import { SECTIONS, site } from "@/lib/site";
import { typo } from "@/lib/typo";
import { Mark, Wordmark } from "./brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink">
      <div className="wrap grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <Link href="/" className="flex items-center gap-3" aria-label="DZIADER.SI, strona główna">
            <Mark className="size-12 text-ink" />
            <Wordmark className="text-[2rem] leading-none" />
          </Link>
          <p className="mt-6 max-w-md text-ink-soft">
            {typo(
              "Instytut Badań nad Dziaderstwem opisuje i klasyfikuje dziaderstwo w Polsce, od parkingu pod marketem budowlanym po wigilijny stół. Działa niezależnie, bez grantów i bez zgody rodziny.",
            )}
          </p>
        </div>

        <nav aria-label="Działy" className="md:col-span-3">
          <p className="label text-ink-faint">Działy</p>
          <ul className="mt-4 space-y-2 font-sans font-medium">
            {SECTIONS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-red">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="label text-ink-faint">Zastrzeżenie</p>
          <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-ink-soft">
            {typo(site.disclaimer)}
          </p>
        </div>
      </div>

      <div className="wrap">
        <p className="label flex flex-col gap-1 border-t border-rule py-6 text-ink-faint sm:flex-row sm:justify-between">
          <span>
            © {site.founded} {site.institute}
          </span>
          <span>dziader.si</span>
        </p>
      </div>
    </footer>
  );
}
