/**
 * Custom events for Umami (stats.szram.uk). The tracker loads after hydration and a
 * content blocker may stop it, so a missing `window.umami` is normal: the event simply
 * goes uncounted.
 */

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
    umamiBeforeSend?: (type: string, payload: Record<string, unknown>) => unknown;
  }
}

export function track(name: string, data?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  window.umami?.track(name, data);
}
