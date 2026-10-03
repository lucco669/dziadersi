"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { analyticsUrl } from "@/lib/analytics-url";

/** Strip result codes, names, invitations and queries before sending analytics. */
export function Analytics() {
  return <VercelAnalytics beforeSend={(event) => ({ ...event, url: analyticsUrl(event.url) })} />;
}
