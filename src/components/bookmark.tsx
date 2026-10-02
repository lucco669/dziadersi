"use client";

import Link from "next/link";
import { useState } from "react";
import type { BookmarkKind } from "@/lib/profile";
import { cx } from "@/lib/typo";
import { patchAccount, useAccount } from "./account";

/**
 * "Zachowaj w Profilu": a Rozmówki line, a winning bingo card or an exam. Signed-in visitors
 * save in place; guests go through sign-in and land in the profile with the bookmark filed.
 */
export function BookmarkButton({ kind, code, className, label = "Zachowaj w Profilu" }: { kind: BookmarkKind; code: string; className?: string; label?: string }) {
  const account = useAccount();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const member = account.status === "member" ? account.account : null;
  const saved = member?.saved[kind].includes(code) ?? false;

  if (!member) {
    return (
      <Link href={`/profil/zachowaj?rodzaj=${kind}&kod=${encodeURIComponent(code)}`} className={className}>
        {label}
      </Link>
    );
  }

  if (saved) {
    return (
      <Link href="/profil#zakladki" className={cx(className, "text-red")}>
        W zakładkach ✓
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
      {failed ? "Nie zapisano. Jeszcze raz?" : busy ? "Zapisuję…" : label}
    </button>
  );
}
