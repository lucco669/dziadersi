import { hasLocale } from "@/i18n/config";
import { CERTIFICATE_FORMATS, certificateImage } from "@/lib/certificate-image";
import { decodeResult, evaluate } from "@/lib/test";

export const alt =
  "Certyfikat Dziaderstwa: wynik Testu Dziadersa w Instytucie Badań nad Dziaderstwem · Certifikat dziaderstva: izvid testa dziadersa na Inštitutu za raziskave dziaderstva";
export const size = CERTIFICATE_FORMATS.og;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; kod: string }> }) {
  const { lang, kod } = await params;
  const draft = decodeResult(kod);
  if (!hasLocale(lang) || !draft) return new Response("Nie znaleziono", { status: 404 });

  // A code always renders the same certificate, in the edition's language.
  return certificateImage(evaluate(draft, lang), "og", lang, {
    "cache-control": "public, max-age=86400, s-maxage=31536000, immutable",
  });
}
