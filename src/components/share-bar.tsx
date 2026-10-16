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

/** The usual outlets' share pages for `url`, with `text` where the outlet takes one. */
export const shareOutlets = (url: string, text: string) => [
  { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
  { label: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
];

/**
 * A share outlet opened on click. Share pages answer crawlers with a login redirect or a 404, so their
 * addresses are not published as links: every shareable page would otherwise report dozens of broken
 * outbound links.
 */
export function ShareOutlet({ href, label, onOpen, className }: { href: string; label: string; onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        onOpen();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
      className={className}
    >
      {label}
    </button>
  );
}

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

  const color = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <div className="label flex flex-wrap items-center gap-x-5 gap-y-1">
      <span className={tone === "paper" ? "text-paper/60" : "text-ink-soft"}>{t.label}</span>
      {canShare && (
        <button type="button" onClick={share} className={`link min-w-6 py-1.5 text-center ${color}`}>
          {t.share}
        </button>
      )}
      {shareOutlets(url, text).map((outlet) => (
        <ShareOutlet key={outlet.label} {...outlet} onOpen={() => log(outlet.label)} className={`link min-w-6 py-1.5 text-center ${color}`} />
      ))}
      <button type="button" onClick={copy} className={`link min-w-6 py-1.5 text-center ${color}`}>
        {copied ? t.copied : t.copy}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.announce : ""}
      </span>
    </div>
  );
}
