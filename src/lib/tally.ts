import type { TallyKind } from "./community";

/** One more of something for the Mały Rocznik Statystyczny. Fire and forget, from the browser. */
export function tally(kind: TallyKind) {
  try {
    const body = JSON.stringify({ kind });
    if (!navigator.sendBeacon?.("/api/licznik", body)) {
      void fetch("/api/licznik", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Counting is never worth an error.
  }
}
