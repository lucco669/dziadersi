"use client";

import Script from "next/script";
import { analyticsUrl } from "@/lib/analytics-url";
import "@/lib/analytics";

/**
 * Runs before Umami's first send, at module load during hydration. Every send waits for a
 * first real pointer, touch, wheel or key event and automated browsers are dropped: Umami's
 * own bot check is the user agent alone. The page address is stripped of result codes,
 * names, invitations and queries first.
 */
if (typeof window !== "undefined" && !window.umamiBeforeSend) {
  let human = false;
  const waiting: (() => void)[] = [];
  const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown"] as const;
  const go = (event: Event) => {
    if (!event.isTrusted || human) return;
    human = true;
    for (const name of events) removeEventListener(name, go, true);
    waiting.splice(0).forEach((resume) => resume());
  };
  for (const name of events) addEventListener(name, go, { capture: true, passive: true });

  window.umamiBeforeSend = (_type, payload) => {
    if (navigator.webdriver) return null;
    const clean = { ...payload };
    if (typeof clean.url === "string") clean.url = analyticsUrl(new URL(clean.url, location.origin).href);
    if (typeof clean.referrer === "string" && clean.referrer.startsWith(location.origin)) {
      clean.referrer = analyticsUrl(clean.referrer);
    }
    return human ? clean : new Promise((resolve) => waiting.push(() => resolve(clean)));
  };
}

/** Umami, self-hosted on stats.szram.uk (allowed in the CSP in next.config.ts). */
export function Analytics() {
  return (
    <Script
      src="https://stats.szram.uk/script.js"
      data-website-id="df10af75-9e0d-4048-b00a-b79af05ef187"
      data-before-send="umamiBeforeSend"
      strategy="afterInteractive"
    />
  );
}
