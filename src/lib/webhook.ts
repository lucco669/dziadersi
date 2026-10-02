import { createHmac, timingSafeEqual } from "node:crypto";

/** Requests older or newer than this are refused: replayed hooks don't send a second email. */
const TOLERANCE_SECONDS = 5 * 60;

/**
 * Verifies a Standard Webhooks signature (what Supabase Auth Hooks send).
 * The secret is the "v1,whsec_…" value from the Supabase dashboard.
 */
export function verifyWebhook(body: string, headers: Headers, secret: string) {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!id || !timestamp || !signatures || !secret) return false;

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt) || Math.abs(Date.now() / 1000 - sentAt) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();

  return signatures.split(" ").some((entry) => {
    const [version, value] = entry.split(",");
    if (version !== "v1" || !value) return false;
    const given = Buffer.from(value, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
