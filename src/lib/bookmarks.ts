import { DEFAULT_LOCALE } from "@/i18n/config";
import { decodeCard } from "./bingo";
import { decodeExam, encodeExam } from "./exam";
import { decodeLine } from "./phrasebook";
import type { BookmarkKind } from "./profile";

/** The normalised code of a bookmark, or null when the kind or the code is not valid. Codes are the same in both editions. */
export function bookmarkCode(kind: unknown, code: unknown): { kind: BookmarkKind; code: string } | null {
  if (typeof code !== "string") return null;
  switch (kind) {
    case "rozmowki": {
      const line = decodeLine(code, DEFAULT_LOCALE);
      return line ? { kind, code: line.code } : null;
    }
    case "bingo": {
      const card = decodeCard(code, DEFAULT_LOCALE);
      return card ? { kind, code: card.code } : null;
    }
    case "egzamin": {
      const exam = decodeExam(code);
      return exam ? { kind, code: encodeExam(exam) } : null;
    }
    default:
      return null;
  }
}

/** Where a bookmark lives on the site, as an internal path. */
export const bookmarkHref = (kind: BookmarkKind, code: string) =>
  kind === "rozmowki" ? `/generator/${code}` : kind === "bingo" ? `/bingo/${code}` : `/egzamin/${code}`;
