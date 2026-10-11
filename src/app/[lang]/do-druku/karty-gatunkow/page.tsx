import { PrintMaterial, printMaterialMetadata } from "@/components/print-materials";
export const generateMetadata = () => printMaterialMetadata("cards");
export default function SpeciesCardsPage() {
  return <PrintMaterial kind="cards" />;
}
