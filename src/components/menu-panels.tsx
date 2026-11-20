"use client";

/*
 * The full list of departments, with pictograms: the desktop panel and the body of the phone sheet.
 * main-menu.tsx loads this file when the menu is first reached, so pages don't carry it up front.
 * The markup is the menu's own, moved here unchanged.
 */

import { useLocale } from "@/i18n/client";
import { groups, type Department, type GroupKey } from "@/lib/site";
import Link from "@/i18n/link";
import { cx, typo } from "@/lib/typo";
import { useAccount } from "./account";
import { EditionSwitch } from "./language";
import { byGroup, COPY, isCurrent } from "./main-menu";
import { MenuIcon } from "./menu-icons";
import { Figure } from "./pictograms";

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
    <Link href="/rejestracja" onClick={onNavigate} className="mi group flex items-center gap-3">
      <MenuIcon href="/profil" className="w-11" />
      <span>
        <span className="block font-bold leading-tight group-hover:text-red">{t.profile}</span>
        <span className="label block text-ink-soft">{typo(t.pitch)}</span>
      </span>
    </Link>
  );
}

export function Panel({ active, pathname, onNavigate }: { active: GroupKey | null; pathname: string; onNavigate: () => void }) {
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
          <ul className="label flex gap-5 text-ink-soft">
            {t.extra.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={onNavigate} className="inline-flex min-h-6 items-center py-1 transition-colors hover:text-red">
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

/** The phone sheet below its title bar. */
export function SheetBody({ pathname, onNavigate: close }: { pathname: string; onNavigate: () => void }) {
  const locale = useLocale();
  const t = COPY[locale];
  return (
    <>
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
      <ul className="label mt-10 flex flex-wrap gap-x-6 gap-y-1 border-t border-rule pt-4 text-ink-soft">
        {t.extra.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={close} className="inline-flex min-h-6 items-center py-1.5">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t border-ink pt-5">
        <EditionSwitch />
      </div>
    </>
  );
}
