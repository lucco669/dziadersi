import { track } from "./analytics";
import { tally } from "./tally";

type HandoffChannel = "natywne" | "obraz" | "link";
type ShareChannel = HandoffChannel | "Facebook" | "WhatsApp" | "X" | "email" | "post" | "relacja" | "badania";

export function resultShareIntent(kanal: ShareChannel) {
  track("Wynik: próba udostępnienia", { kanal });
}

async function handoff(kanal: HandoffChannel, send: () => Promise<void>) {
  resultShareIntent(kanal);
  try {
    await send();
  } catch (error) {
    const aborted = typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
    const powod = kanal === "link" ? "ręczne kopiowanie" : aborted ? "anulowano" : "błąd";
    track("Wynik: bez przekazania", { kanal, powod });
    return false;
  }
  track("Wynik: przekazano", { kanal });
  tally("udostepnienie");
  return true;
}

export function shareResult(data: ShareData) {
  return handoff(data.files?.length ? "obraz" : "natywne", () => navigator.share(data));
}

export async function copyResultLink(url: string, prompt: string) {
  const copied = await handoff("link", () => navigator.clipboard.writeText(url));
  // Even accepting the manual prompt cannot confirm a copy.
  if (!copied) window.prompt(prompt, url);
  return copied;
}
