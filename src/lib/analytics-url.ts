/** Path segments followed by something personal: a result with a name, an invitation, a question, a seating plan with labels. Both editions. */
const PRIVATE_SEGMENTS = ["wynik", "izvid", "grupa", "lestvica", "grupy", "skupina", "zespol", "kolektiv", "zapisz", "shrani", "superinteligencja", "superinteligenca", "plan-stolu", "sedezni-red"];

/** Analytics needs the kind of page, never a person's result, invitation, question or search. */
export function analyticsUrl(input: string, origin?: string): string {
  try {
    const url = new URL(input, origin);
    const parts = url.pathname.split("/");
    for (let i = 0; i < parts.length; i++) {
      if (PRIVATE_SEGMENTS.includes(parts[i]) && parts[i + 1]) parts[i + 1] = "anonimowe";
    }
    url.pathname = parts.join("/");
    // Invitation parameters can themselves contain encoded result names.
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

export function analyticsPayload(payload: Record<string, unknown>, origin: string) {
  const clean = { ...payload };
  // A duel title contains both signatures. During client navigation the title can lag the URL.
  delete clean.title;
  if (typeof clean.url === "string") clean.url = analyticsUrl(clean.url, origin);
  if (typeof clean.referrer === "string" && clean.referrer) {
    const safe = analyticsUrl(clean.referrer, origin);
    const referrerOrigin = safe && new URL(safe).origin;
    clean.referrer = referrerOrigin === origin ? safe : referrerOrigin;
  }
  return clean;
}
