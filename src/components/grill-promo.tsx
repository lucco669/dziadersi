import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";

const COPY = defineCopy({
  pl: { tag: "Nowa próba sprawności · IBD-G1", title: "Król grilla", text: "90 sekund przy ruszcie. Cała rodzina wie lepiej. Szczypce są tylko jedne.", play: "Przejmij szczypce" },
  sl: { tag: "Nov preizkus spretnosti · IBD-G1", title: "Kralj žara", text: "90 sekund pri žaru. Vsa družina ve bolje. Klešče so samo ene.", play: "Prevzemi klešče" },
});

export function GrillPromo({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return <section className="border-y border-ink bg-paper-deep" aria-labelledby="grill-promo"><div className="wrap grid items-center gap-6 py-10 md:grid-cols-12 md:py-12"><div className="md:col-span-7"><p className="label text-red-deep">{t.tag}</p><h2 id="grill-promo" className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-tight">{t.title}</h2><p className="mt-4 max-w-md text-xl leading-snug text-ink-soft">{t.text}</p><Link href="/krol-grilla" className="btn btn-ink mt-6">{t.play} <span aria-hidden="true">→</span></Link></div><Image src="/illustrations/grill/hero-360.webp" width={360} height={240} alt="" className="mx-auto h-auto w-full max-w-sm md:col-span-5" loading="lazy" /></div></section>;
}
