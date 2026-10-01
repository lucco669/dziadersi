"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const NAME_IN_RESULT = /(\/wynik\/[0-9a-z]+)~[^/?#]*/;

/** Vercel Web Analytics: cookieless. The name on a result link never leaves the browser. */
export function Analytics() {
  return <VercelAnalytics beforeSend={(event) => ({ ...event, url: event.url.replace(NAME_IN_RESULT, "$1") })} />;
}
