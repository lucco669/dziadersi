import { PrintMaterial, printMaterialMetadata } from "@/components/print-materials";
export const generateMetadata = () => printMaterialMetadata("guide");
export default function PocketGuidePage() {
  return <PrintMaterial kind="guide" />;
}
