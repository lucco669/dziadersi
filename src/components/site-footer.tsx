import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { groups, sections, site, siteCopy } from "@/lib/site";
import { typo } from "@/lib/typo";
import { Mark, Wordmark } from "./brand";
import { EditionSwitch } from "./language";

const COPY = defineCopy({
  pl: {
    home: "DZIADER.SI, strona główna",
    about:
      "Instytut Badań nad Dziaderstwem opisuje i klasyfikuje dziaderstwo w Polsce, od parkingu pod marketem budowlanym po wigilijny stół. Działa niezależnie, bez grantów i bez zgody rodziny.",
    sections: "Działy",
    links: [
      ["/profil", "Profil Dziaderski"],
      ["/o-instytucie", "O Instytucie"],
      ["/regulamin", "Regulamin"],
      ["/prywatnosc", "Prywatność"],
    ],
  },
  sl: {
    home: "DZIADER.SI, domača stran",
    about:
      "Inštitut za raziskave dziaderstva opisuje in razvršča dziaderstvo na Poljskem, od parkirišča pred gradbenim marketom do mize na sveti večer. Deluje neodvisno, brez projektnih sredstev in brez soglasja družine.",
    sections: "Oddelki",
    links: [
      ["/profil", "Dziaderski profil"],
      ["/o-instytucie", "O Inštitutu"],
      ["/regulamin", "Pogoji uporabe"],
      ["/prywatnosc", "Zasebnost"],
    ],
  },
});

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const copy = siteCopy(locale);
  return (
    <footer className="border-t border-ink print:hidden">
      <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="flex items-center gap-3" aria-label={t.home}>
            <Mark className="size-12 text-ink" />
            <Wordmark className="text-[2rem] leading-none" />
          </Link>
          <p className="mt-6 max-w-md text-ink-soft">{typo(t.about)}</p>
          <p className="mt-6 max-w-md font-sans text-[0.9rem] leading-relaxed text-ink-soft">{typo(copy.disclaimer)}</p>
        </div>

        <div className="lg:col-span-8">
          <nav aria-label={t.sections} className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {groups(locale).map((group) => (
              <div key={group.key}>
                <p className="label text-ink-faint">{group.label}</p>
                <ul className="mt-4 space-y-2 font-sans font-medium leading-snug">
                  {sections(locale)
                    .filter((item) => item.group === group.key)
                    .map((item) => (
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
          <div className="mt-12 border-t border-rule pt-8">
            <EditionSwitch />
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="label flex flex-col gap-2 border-t border-rule py-6 text-ink-faint sm:flex-row sm:justify-between">
          <span>
            © {site.founded} {copy.institute}
          </span>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {t.links.map(([href, label]) => (
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
