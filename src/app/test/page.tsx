import type { Metadata } from "next";
import { TestRunner } from "@/components/test-runner";
import { site } from "@/lib/site";

const title = "Test Dziadersa";
const description =
  "Badanie przesiewowe IBD-T1: 24 pytania, około trzech minut. Wynik od 0 do 100%, rozpoznanie gatunku i certyfikat do udostępnienia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/test" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: site.name,
    url: "/test",
    title: `${title} · ${site.name}`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description },
};

export default function TestPage() {
  return (
    <main id="tresc">
      <TestRunner />
    </main>
  );
}
