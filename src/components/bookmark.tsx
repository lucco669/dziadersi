"use client";

import { useState } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { signInPath } from "@/lib/account";
import type { BookmarkKind } from "@/lib/profile";
import { cx } from "@/lib/typo";
import { patchAccount, useAccount } from "./account";

const COPY = defineCopy({
  pl: { keep: "Zachowaj w Profilu", kept: "W zakładkach ✓", failed: "Nie zapisano. Jeszcze raz?", saving: "Zapisuję…" },
  sl: { keep: "Ohrani v profilu", kept: "Med zaznamki ✓", failed: "Ni shranjeno. Še enkrat?", saving: "Shranjujem …" },
});

/**
 * "Zachowaj w Profilu": a Rozmówki line, a winning bingo card or an exam. Signed-in visitors
 * save in place; guests go through sign-in and land in the profile with the bookmark filed.
 * `label` replaces the default wording and should be in the edition being shown.
 */
export function BookmarkButton({ kind, code, className, label }: { kind: BookmarkKind; code: string; className?: string; label?: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const account = useAccount();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const member = account.status === "member" ? account.account : null;
  const saved = member?.saved[kind].includes(code) ?? false;
  const text = label ?? t.keep;

  if (!member) {
    return (
      <Link
        href={signInPath(`/profil/zachowaj?rodzaj=${kind}&kod=${encodeURIComponent(code)}`, locale)}
        prefetch={false}
        rel="nofollow"
        className={className}
      >
        {text}
      </Link>
    );
  }

  if (saved) {
    return (
      <Link href="/profil#zakladki" className={cx(className, "text-red")}>
        {t.kept}
      </Link>
    );
  }

  async function save() {
    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch("/api/zakladki", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, code }),
      });
      if (!response.ok) throw new Error(String(response.status));
      patchAccount((current) => ({ ...current, saved: { ...current.saved, [kind]: [...current.saved[kind], code] } }));
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={save} disabled={busy} className={cx(className, "disabled:opacity-60")}>
      {failed ? t.failed : busy ? t.saving : text}
    </button>
  );
}
