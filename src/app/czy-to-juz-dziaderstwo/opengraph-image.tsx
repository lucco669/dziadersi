import { CASES } from "@/content/cases";
import { commissionCard } from "@/lib/court-cards";
import { OG_SIZE } from "@/lib/og-cards";

export const alt = "Komisja Orzekająca: czy to już dziaderstwo?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return commissionCard(CASES.length);
}
