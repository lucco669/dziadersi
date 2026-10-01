"use client";

import { track } from "@vercel/analytics";
import { useState, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

const noSubscription = () => () => {};

/** Share links for any page: native share sheet where available, the usual outlets, and copy. */
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
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => site.url);
  const canShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === "function", () => false);
  const [copied, setCopied] = useState(false);
  const url = `${origin}${path}`;

  const log = (channel: string) => track("Udostępnienie", { kanal: channel, typ: kind });

  async function copy() {
    log("link");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Skopiuj link:", url);
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
      <span className={tone === "paper" ? "text-paper/60" : "text-ink-soft"}>Udostępnij</span>
      {canShare && (
        <button type="button" onClick={share} className={`link ${color}`}>
          Udostępnij
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
        {copied ? "Skopiowano ✓" : "Kopiuj link"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link skopiowany do schowka." : ""}
      </span>
    </div>
  );
}
