/** Path segments followed by something personal: a result with a name, an invitation, a question. Both editions. */
const PRIVATE_SEGMENTS = ["wynik", "izvid", "grupa", "lestvica", "grupy", "skupina", "zapisz", "shrani", "superinteligencja", "superinteligenca"];

/** Analytics needs the kind of page, never a person's result, invitation, question or search. */
export function analyticsUrl(input: string): string {
  try {
    const url = new URL(input);
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
