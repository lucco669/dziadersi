import type { Metadata } from "next";
import { Stamp } from "@/components/brand";
import { Figure } from "@/components/pictograms";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { getLocale } from "@/i18n/server";

const COPY = defineCopy({
  pl: {
    title: "Brak w archiwum",
    label: "Błąd 404 · Archiwum Instytutu",
    heading: "Brak w archiwum.",
    text: "Teczka, której szukasz, została prawdopodobnie odłożona do piwnicy, bo „jeszcze się przyda”. Poszukiwania mogą potrwać do wiosny.",
    back: "Wróć do Instytutu",
    stamp: "Nie odnaleziono",
  },
  sl: {
    title: "Ni v arhivu",
    label: "Napaka 404 · Arhiv Inštituta",
    heading: "Ni v arhivu.",
    text: "Mapo, ki jo iščeš, so najbrž odnesli v klet, ker »bo še prav prišla«. Iskanje lahko traja do pomladi.",
    back: "Nazaj na Inštitut",
    stamp: "Ni najdeno",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  return { title: COPY[await getLocale()].title, robots: { index: false } };
}

export default async function NotFound() {
  const t = COPY[await getLocale()];
  return (
    <main id="tresc" className="wrap grid items-center gap-12 py-20 md:grid-cols-12 md:py-28">
      <div className="md:col-span-8">
        <p className="label text-red">{t.label}</p>
        <h1 className="mt-6 text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.02em]">{t.heading}</h1>
        <p className="mt-8 max-w-xl text-[1.3rem] leading-relaxed text-ink-soft">{t.text}</p>
        <div className="mt-12 flex flex-wrap items-center gap-8">
          <Link href="/" className="btn bg-ink text-paper hover:bg-red">
            {t.back} <span aria-hidden="true">→</span>
          </Link>
          <Stamp className="rotate-[-6deg]">{t.stamp}</Stamp>
        </div>
      </div>
      <svg viewBox="-4 -2 48 98" className="hidden h-80 md:col-span-4 md:block md:justify-self-center" aria-hidden="true">
        <Figure left="hip" right="hip" glasses="forehead" />
      </svg>
    </main>
  );
}
