import Link from "next/link";
import { site } from "@/lib/site";
import { typo } from "@/lib/typo";
import { Wordmark } from "./brand";

const SECTIONS = [
  { href: "/test", label: "Test Dziadersa" },
  { href: "/atlas", label: "Atlas Dziadersów" },
  { href: "/slownik", label: "Słownik Dziaderski" },
  { href: "/raporty", label: "Raporty Instytutu" },
  { href: "/indeks", label: "Narodowy Indeks Dziaderstwa" },
  { href: "/#dzialy", label: "Plan działalności" },
];

const SOON = [
  { label: "Zgłoś obserwację", note: "wkrótce" },
  { label: "Biuro prasowe", note: "wkrótce" },
  { label: "Rada Naukowa", note: "w trakcie powoływania" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="kicker text-paper/55">O Instytucie</p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-paper/85">
              {typo(
                "Instytut Badań nad Dziaderstwem dokumentuje, klasyfikuje i opisuje dziaderstwo we wszystkich jego postaciach: od parkingowej po wigilijną. Działamy niezależnie, bez grantów i bez zgody rodziny.",
              )}
            </p>
          </div>

          <nav aria-label="Działy" className="md:col-span-3 md:col-start-7">
            <p className="kicker text-paper/55">Działy</p>
            <ul className="mt-4 space-y-2.5">
              {SECTIONS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/85 transition-colors hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="kicker text-paper/55">Współpraca</p>
            <ul className="mt-4 space-y-2.5 text-paper/85">
              {SOON.map((item) => (
                <li key={item.label}>
                  {item.label} <span className="kicker ml-1 text-paper/45">{item.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p aria-hidden="true" className="@container mt-20 md:mt-28">
          <Wordmark className="block whitespace-nowrap text-[18.2cqw] leading-[0.8]" dotClassName="text-bordo-light" />
        </p>

        <div className="kicker mt-8 flex flex-col gap-3 border-t border-paper/20 pt-6 text-paper/55 md:flex-row md:justify-between">
          <p>
            © {site.founded} {site.institute}. Serwis satyryczny.
          </p>
          <p>Wszystkie dane są zmyślone. A mimo to się zgadzają.</p>
        </div>
      </div>
    </footer>
  );
}
