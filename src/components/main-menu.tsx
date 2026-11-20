"use client";

import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import { useInternalPath, useLocale } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { groups, sections, type GroupKey } from "@/lib/site";
import { cx, plural, pluralSl } from "@/lib/typo";
import { AccountSync, useAccount } from "./account";
import { LanguageSwitch } from "./language";
import { SearchButton } from "./search";

export const byGroup = (locale: Locale, group: GroupKey) => sections(locale).filter((section) => section.group === group);
export const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const COPY = defineCopy({
  pl: {
    extra: [
      { href: "/o-instytucie", label: "O Instytucie" },
      { href: "/regulamin", label: "Regulamin" },
      { href: "/prywatnosc", label: "Prywatność" },
    ],
    isNew: "Nowość",
    file: (nickname: string) => `Kartoteka: ${nickname || "Profil Dziaderski"}`,
    counts: (results: number, observed: number, earned: number, total: number) =>
      `${results} ${plural(results, "badanie", "badania", "badań")} · ${observed} ${plural(observed, "gatunek", "gatunki", "gatunków")} w dzienniku · ${earned} z ${total} odznak`,
    profile: "Profil Dziaderski",
    pitch: "Kolekcja gatunków, dziennik obserwacji, odznaki. Załóż kartotekę w minutę.",
    figure: "Rys. 0. Dziaders wskazujący drogę",
    index: "Spis działów Instytutu",
    sheetButton: "Działy",
    sheetTitle: "Spis działów",
    close: "Zamknij",
    profileShort: "Profil",
    signIn: "Profil Dziaderski: zaloguj się",
    signedIn: "(zalogowano)",
  },
  sl: {
    extra: [
      { href: "/o-instytucie", label: "O Inštitutu" },
      { href: "/regulamin", label: "Pogoji uporabe" },
      { href: "/prywatnosc", label: "Zasebnost" },
    ],
    isNew: "Novo",
    file: (nickname: string) => `Kartoteka: ${nickname || "Dziaderski profil"}`,
    counts: (results: number, observed: number, earned: number, total: number) =>
      `${results} ${pluralSl(results, "pregled", "pregleda", "pregledi", "pregledov")} · ${observed} ${pluralSl(observed, "vrsta", "vrsti", "vrste", "vrst")} v dnevniku · ${earned} od ${total} značk`,
    profile: "Dziaderski profil",
    pitch: "Zbirka vrst, dnevnik opazovanj, značke. Kartoteko odpreš v minuti.",
    figure: "Sl. 0. Dziaders, ki kaže pot",
    index: "Seznam oddelkov Inštituta",
    sheetButton: "Oddelki",
    sheetTitle: "Seznam oddelkov",
    close: "Zapri",
    profileShort: "Profil",
    signIn: "Dziaderski profil: prijava",
    signedIn: "(prijavljen)",
  },
});

/* The panel and the sheet list every department with its pictogram: loaded when the menu is first reached, not with the page. */
const loadPanels = () => import("./menu-panels");
const Panel = lazy(() => loadPanels().then((module) => ({ default: module.Panel })));
const SheetBody = lazy(() => loadPanels().then((module) => ({ default: module.SheetBody })));

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 10 6" className={cx("ml-1.5 inline w-2.5 transition-transform", open && "rotate-180")} aria-hidden="true">
      <path d="M1 1L5 5L9 1" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Desktop: four group buttons, one panel with every department. Opens on hover or click. */
export function DesktopMenu() {
  const locale = useLocale();
  const t = COPY[locale];
  const pathname = useInternalPath();
  const [active, setActive] = useState<GroupKey | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const buttons = useRef<Partial<Record<GroupKey, HTMLButtonElement | null>>>({});
  const panelId = useId();
  const open = active !== null;

  const later = (fn: () => void, ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, ms);
  };
  const close = () => {
    window.clearTimeout(timer.current);
    setActive(null);
  };

  // A navigation closes the menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setActive(null);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const current = active;
      setActive(null);
      if (current) buttons.current[current]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const groupOf = (path: string) => sections(locale).find((section) => isCurrent(path, section.href))?.group;
  const here = groupOf(pathname);

  return (
    <div
      onMouseLeave={() => later(close, 220)}
      onMouseEnter={() => {
        window.clearTimeout(timer.current);
        void loadPanels();
      }}
      onFocus={() => void loadPanels()}
    >
      <ul className="flex items-center gap-1 font-sans text-[1.0625rem] font-medium">
        {groups(locale).map((group) => (
          <li key={group.key}>
            <button
              ref={(node) => {
                buttons.current[group.key] = node;
              }}
              type="button"
              aria-expanded={active === group.key}
              aria-controls={panelId}
              onClick={() => setActive(active === group.key ? null : group.key)}
              onMouseEnter={() => later(() => setActive(group.key), open ? 0 : 140)}
              className={cx(
                "flex items-center whitespace-nowrap px-2.5 py-2 transition-colors hover:text-red xl:px-3",
                (active === group.key || (!open && here === group.key)) && "text-red",
              )}
            >
              <span className="xl:hidden">{group.short}</span>
              <span className="hidden xl:inline">{group.label}</span>
              <Chevron open={active === group.key} />
            </button>
          </li>
        ))}
      </ul>
      <div
        id={panelId}
        role="region"
        aria-label={t.index}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-y border-ink bg-paper"
      >
        {open && (
          <>
            <Suspense fallback={null}>
              <Panel active={active} pathname={pathname} onNavigate={close} />
            </Suspense>
            <div aria-hidden="true" onClick={close} className="absolute inset-x-0 top-[calc(100%+1px)] h-screen bg-ink/15" />
          </>
        )}
      </div>
    </div>
  );
}

/** Phones and tablets: a row of the most visited departments, and a button for the full list. */
export function MobileMenu() {
  const locale = useLocale();
  const t = COPY[locale];
  const pathname = useInternalPath();
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="flex items-stretch border-b border-rule">
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen(true)}
          className="flex shrink-0 items-center gap-2 border-r border-rule py-3 pl-5 pr-4 font-sans text-[1rem] font-semibold md:pl-10"
        >
          <svg viewBox="0 0 16 12" className="w-4" aria-hidden="true">
            <path d="M0 1H16M0 6H16M0 11H11" stroke="currentColor" strokeWidth={1.8} />
          </svg>
          {t.sheetButton}
        </button>
        <SearchButton className="flex shrink-0 items-center border-r border-rule px-4" />
        <ul className="flex min-w-0 flex-1 gap-6 overflow-x-auto px-5 py-3 font-sans text-[1rem] font-medium [scrollbar-width:none]">
          {sections(locale).filter((section) => section.href !== "/test").map((item) => (
            <li key={item.href} className="shrink-0">
              <Link href={item.href} className={cx(isCurrent(pathname, item.href) && "text-red")}>
                {item.short}
              </Link>
            </li>
          ))}
          <li className="shrink-0 pr-5">
            <Link href="/profil" className={cx(isCurrent(pathname, "/profil") && "text-red")}>
              {t.profileShort}
            </Link>
          </li>
        </ul>
        {/* On the narrowest phones the other edition moves here from the header. */}
        <LanguageSwitch className="flex shrink-0 items-center border-l border-rule px-3 min-[420px]:hidden" />
      </div>

      <div
        id={sheetId}
        role="dialog"
        aria-modal="true"
        aria-label={t.index}
        hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-paper"
      >
        {open && (
          <div className="wrap pb-16">
            <div className="flex items-center justify-between border-b border-ink py-4">
              <p className="text-2xl font-bold">{t.sheetTitle}</p>
              <button type="button" onClick={close} className="btn -mr-3 px-3 font-sans">
                {t.close}
                <svg viewBox="0 0 12 12" className="w-3" aria-hidden="true">
                  <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth={1.8} />
                </svg>
              </button>
            </div>
            <Suspense fallback={null}>
              <SheetBody pathname={pathname} onNavigate={close} />
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
}

/** "Profil" in the header: a red dot and the nickname once signed in. */
export function AccountLink() {
  const t = COPY[useLocale()];
  const account = useAccount();
  const member = account.status === "member" ? account.account : null;
  return (
    <>
      <AccountSync />
      <Link
        href="/profil"
        title={member ? t.profile : t.signIn}
        className="flex max-w-36 items-center gap-2 py-2 font-sans text-[1.0625rem] font-medium transition-colors hover:text-red"
      >
        {member && <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-red" />}
        <span className="truncate">{member?.nickname || t.profileShort}</span>
        {member && <span className="sr-only">{t.signedIn}</span>}
      </Link>
    </>
  );
}
