import type { Metadata } from "next";
import Link from "next/link";
import { Stamp } from "@/components/brand";
import { Figure } from "@/components/pictograms";

export const metadata: Metadata = {
  title: "Brak w archiwum",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="tresc" className="wrap grid items-center gap-12 py-20 md:grid-cols-12 md:py-28">
      <div className="md:col-span-8">
        <p className="label text-red">Błąd 404 · Archiwum Instytutu</p>
        <h1 className="mt-6 text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.02em]">Brak w&nbsp;archiwum.</h1>
        <p className="mt-8 max-w-xl text-[1.3rem] leading-relaxed text-ink-soft">
          Teczka, której szukasz, została prawdopodobnie odłożona do piwnicy, bo &bdquo;jeszcze się przyda&rdquo;. Poszukiwania
          mogą potrwać do wiosny.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Link href="/" className="btn bg-ink text-paper hover:bg-red">
            Wróć do Instytutu <span aria-hidden="true">→</span>
          </Link>
          <Stamp className="rotate-[-6deg]">Nie odnaleziono</Stamp>
        </div>
      </div>
      <svg viewBox="-4 -2 48 98" className="hidden h-80 md:col-span-4 md:block md:justify-self-center" aria-hidden="true">
        <Figure left="hip" right="hip" glasses="forehead" />
      </svg>
    </main>
  );
}
