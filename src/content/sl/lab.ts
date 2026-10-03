import type { Text } from "@/i18n/overlay";
import type { HORN as HornPl, LabParameter } from "../lab";

/**
 * Laboratorijski izvidi. The codes are the real blood-test abbreviations and stay; the names are
 * the Institute's readings of them, so they are translated as jokes, keeping the real Slovenian
 * lab term where the Polish pun rests on one (ploščice, holesterol, krvni tlak, železo).
 */
export const LAB: Text<LabParameter, "code">[] = [
  { name: "Mnenja, podana brez vprašanja", unit: "/h" },
  { name: "Pogostost pogovorov o vremenu", unit: "/dan" },
  { name: "Holesterol iz vratovine", unit: "mg/dl" },
  { name: "Krvni tlak med iskanjem parkirnega mesta", unit: "mmHg" },
  { name: "Ploščice (mnenja o tem, kako so položene)", unit: "tis./µl" },
  { name: "Dizel v krvi", unit: "‰" },
  { name: "Bele nogavice (frotir)", unit: "par/teden" },
  { name: "Aktivnost verižnih sporočil", unit: "U/l" },
  { name: "Odložene posodobitve sistema", unit: "U/l" },
  { name: "Staro železo v predalu (»še pride prav«)", unit: "kg" },
  { name: "Povprečna velikost ribe v pripovedi", unit: "cm" },
  { name: "Število natisnjenih e-poštnih sporočil", unit: "kos/teden" },
];

/** The horn test, Obrazec IBD-T2 only. */
export const HORN: Text<typeof HornPl, "code"> = { name: "Reakcijski čas hupanja", unit: "s" };
