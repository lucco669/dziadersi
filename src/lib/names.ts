/* Personal names typed by visitors (a result's name, a seat's label): cleaned the same way everywhere. */

// Kept off certificates and images served from our domain: Polish, Slovenian and English.
const BLOCKED =
  /kurw|chuj|huj|pierd|jeb|pizd|cipa|cipe|cipk|kutas|dziwk|szmat|pedal|cwel|fiut|zjeb|kurac|kurba|picka|fukat|hitler|nazi|fuck|shit|cunt|nigg|fagg/;

const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/gi, "l")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

/** Letters, spaces and a little punctuation, at most 24 characters, nothing vulgar. */
export function cleanName(raw: string) {
  const name = raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M} .'’-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24)
    .trim();
  return name && !BLOCKED.test(fold(name)) ? name : "";
}
