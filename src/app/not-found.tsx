import type { Metadata } from "next";
import Link from "next/link";
import { Stamp } from "@/components/brand";

export const metadata: Metadata = {
  title: "Brak w archiwum",
};

export default function NotFound() {
  return (
    <main id="tresc" className="wrap py-24 md:py-36">
      <p className="kicker text-bordo">Błąd 404 · Archiwum IBD</p>
      <h1 className="mt-6 max-w-4xl font-display text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.9] tracking-[-0.035em]">
        Brak w&nbsp;archiwum.
      </h1>
      <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink-soft">
        Teczka, której szukasz, została prawdopodobnie odłożona do piwnicy, bo &bdquo;jeszcze się przyda&rdquo;.
        Poszukiwania mogą potrwać do wiosny.
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-8">
        <Link href="/" className="btn bg-green text-paper hover:bg-ink">
          Wróć do Instytutu <span aria-hidden="true">→</span>
        </Link>
        <Stamp className="rotate-[-6deg]">Nie odnaleziono</Stamp>
      </div>
    </main>
  );
}
