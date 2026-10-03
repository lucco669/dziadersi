"use client";

import { track } from "@vercel/analytics";
import { useState, useSyncExternalStore } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { site } from "@/lib/site";

const COPY = defineCopy({
  pl: { label: "Udostępnij", share: "Udostępnij", copy: "Kopiuj link", copied: "Skopiowano ✓", announce: "Link skopiowany do schowka.", prompt: "Skopiuj link:" },
  sl: { label: "Deli", share: "Deli", copy: "Kopiraj povezavo", copied: "Kopirano ✓", announce: "Povezava je kopirana v odložišče.", prompt: "Kopiraj povezavo:" },
});

const noSubscription = () => () => {};

/**
 * Share links for any page: native share sheet where available, the usual outlets, and copy.
 * `path` is internal ("/raporty/x"); the link goes to it in the reader's edition. `text` is in that edition too.
 */
export function ShareBar({
  path,
  text,
  kind,
  tone = "ink",
}: {
  path: string;
  text: string;
  kind: string;
  /** "paper" on the ink bands. */
  tone?: "ink" | "paper";
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => site.url);
  const canShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === "function", () => false);
  const [copied, setCopied] = useState(false);
  const url = `${origin}${localizePath(path, locale)}`;

  const log = (channel: string) => track("Udostępnienie", { kanal: channel, typ: kind });

  async function copy() {
    log("link");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt(t.prompt, url);
    }
  }

  async function share() {
    log("natywne");
    try {
      await navigator.share({ text, url });
    } catch {
      // Closing the share sheet is not an error worth reporting.
    }
  }

  const outlets = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { label: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
  ];

  const color = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <div className="label flex flex-wrap items-center gap-x-5 gap-y-3">
      <span className={tone === "paper" ? "text-paper/60" : "text-ink-soft"}>{t.label}</span>
      {canShare && (
        <button type="button" onClick={share} className={`link ${color}`}>
          {t.share}
        </button>
      )}
      {outlets.map((outlet) => (
        <a
          key={outlet.label}
          href={outlet.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => log(outlet.label)}
          className={`link ${color}`}
        >
          {outlet.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={`link ${color}`}>
        {copied ? t.copied : t.copy}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.announce : ""}
      </span>
    </div>
  );
}
