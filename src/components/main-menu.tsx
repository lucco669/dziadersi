"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInternalPath, useLocale } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { groups, sections, type Department, type GroupKey } from "@/lib/site";
import { cx, plural, pluralSl, typo } from "@/lib/typo";
import { AccountSync, useAccount } from "./account";
import { EditionSwitch, LanguageSwitch } from "./language";
import { MenuIcon } from "./menu-icons";
import { Figure } from "./pictograms";
import { SearchButton } from "./search";

const byGroup = (locale: Locale, group: GroupKey) => sections(locale).filter((section) => section.group === group);
const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

const COPY = defineCopy({
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

function Item({ item, pathname, onNavigate, compact }: { item: Department; pathname: string; onNavigate: () => void; compact?: boolean }) {
  const t = COPY[useLocale()];
  const current = isCurrent(pathname, item.href);
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={current ? "page" : undefined}
        className="mi group grid grid-cols-[3rem_1fr] items-start gap-3 py-3"
      >
        <MenuIcon href={item.href} className="mt-0.5 w-12" />
        <span>
          <span className={cx("flex flex-wrap items-baseline gap-x-2 text-[1.15rem] font-bold leading-tight transition-colors group-hover:text-red", current && "text-red")}>
            {item.label}
            {item.isNew && <span className="label text-[0.75rem] font-semibold text-red">{t.isNew}</span>}
          </span>
          <span className={cx("mt-1 font-sans text-[0.85rem] leading-snug text-ink-soft", compact ? "hidden xl:line-clamp-2" : "block")}>
            {typo(item.summary)}
          </span>
        </span>
      </Link>
    </li>
  );
}

/** The bottom line of the menu: a nudge towards the profile for guests, the file for members. */
function AccountLine({ onNavigate }: { onNavigate: () => void }) {
  const t = COPY[useLocale()];
  const account = useAccount();
  if (account.status === "member") {
    const { nickname, results, observed, badges } = account.account;
    return (
      <Link href="/profil" onClick={onNavigate} className="mi group flex items-center gap-3">
        <MenuIcon href="/profil" className="w-11" />
        <span>
          <span className="block font-bold leading-tight group-hover:text-red">{t.file(nickname)}</span>
          <span className="label block text-ink-soft">{t.counts(results, observed.length, badges.earned, badges.total)}</span>
        </span>
      </Link>
    );
  }
  return (
    <Link href="/profil" onClick={onNavigate} className="mi group flex items-center gap-3">
      <MenuIcon href="/profil" className="w-11" />
      <span>
        <span className="block font-bold leading-tight group-hover:text-red">{t.profile}</span>
        <span className="label block text-ink-soft">{typo(t.pitch)}</span>
      </span>
    </Link>
  );
}

function Panel({ active, pathname, onNavigate }: { active: GroupKey | null; pathname: string; onNavigate: () => void }) {
  const locale = useLocale();
  const t = COPY[locale];
  return (
    <div className="wrap pb-8 pt-7">
      <div className="grid grid-cols-4 gap-8">
        {groups(locale).map((group) => (
          <section key={group.key} aria-label={group.label} className={cx("border-t-2 pt-3 transition-colors", active === group.key ? "border-red" : "border-ink")}>
            <p className="flex items-baseline justify-between gap-2">
              <span className={cx("font-sans text-[0.95rem] font-semibold", active === group.key && "text-red")}>{group.label}</span>
              <span className="label hidden text-[0.75rem] text-ink-faint xl:inline">{group.note}</span>
            </p>
            <ul className="mt-2">
              {byGroup(locale, group.key).map((item) => (
                <Item key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} compact />
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-6 flex items-end justify-between gap-8 border-t border-rule pt-5">
        <AccountLine onNavigate={onNavigate} />
        <div className="flex items-end gap-6">
          <ul className="label flex gap-5 pb-1 text-ink-soft">
            {t.extra.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onNavigate} className="transition-colors hover:text-red">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <figure className="hidden items-end gap-2 xl:flex" aria-hidden="true">
            <figcaption className="label max-w-28 pb-1 text-right text-[0.72rem] leading-tight text-ink-faint">
              {t.figure}
            </figcaption>
            <svg viewBox="-2 -1 56 97" className="h-16 -scale-x-100">
              <Figure right="point" />
            </svg>
          </figure>
        </div>
      </div>
    </div>
  );
}

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
    <div onMouseLeave={() => later(close, 220)} onMouseEnter={() => window.clearTimeout(timer.current)}>
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
            <Panel active={active} pathname={pathname} onNavigate={close} />
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
            <div className="mt-6 border-b border-rule pb-5">
              <AccountLine onNavigate={close} />
            </div>
            {groups(locale).map((group) => (
              <section key={group.key} aria-label={group.label} className="mt-8 border-t border-ink pt-3">
                <p className="flex items-baseline justify-between gap-2">
                  <span className="font-sans text-[0.95rem] font-semibold">{group.label}</span>
                  <span className="label text-[0.75rem] text-ink-faint">{group.note}</span>
                </p>
                <ul className="mt-1">
                  {byGroup(locale, group.key).map((item) => (
                    <Item key={item.href} item={item} pathname={pathname} onNavigate={close} />
                  ))}
                </ul>
              </section>
            ))}
            <ul className="label mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-5 text-ink-soft">
              {t.extra.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-ink pt-5">
              <EditionSwitch />
            </div>
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
