import { CERTIFICATE_FORMATS, certificateImage } from "@/lib/certificate-image";
import { decodeResult, evaluate } from "@/lib/test";

export const alt = "Certyfikat Dziaderstwa: wynik Testu Dziadersa w Instytucie Badań nad Dziaderstwem";
export const size = CERTIFICATE_FORMATS.og;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const draft = decodeResult(kod);
  if (!draft) return new Response("Nie znaleziono", { status: 404 });

  // A code always renders the same certificate.
  return certificateImage(evaluate(draft), "og", {
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
  });
}
