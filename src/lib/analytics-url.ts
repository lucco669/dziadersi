/** Analytics needs the kind of page, never a person's result, invitation or search. */
export function analyticsUrl(input: string): string {
  try {
    const url = new URL(input);
    const parts = url.pathname.split("/");
    for (let i = 0; i < parts.length; i++) {
      if (["wynik", "grupa", "grupy", "zapisz"].includes(parts[i]) && parts[i + 1]) parts[i + 1] = "anonimowe";
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
