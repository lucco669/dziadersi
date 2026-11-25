/* eslint-disable @next/next/no-img-element -- the grill and wax cast have pre-encoded WebPs. */
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { homeActivity } from "@/lib/home-activity";
import { getToday } from "@/lib/today";
import { typo } from "@/lib/typo";
import { SpeciesPlate } from "./pictograms";

const COPY = defineCopy({
  pl: {
    wax: {
      andrzejki: "Andrzejki",
      sylwester: "Sylwester",
      title: "Lanie wosku",
      text: "Przelej wosk przez ucho klucza. Z cienia na ścianie Pracownia Wróżb odczyta twój gatunek na nowy rok.",
      cta: "Przelej wosk",
      alt: "Odlew z wosku w kształcie sandała ze skarpetą.",
    },
    table: {
      tag: "Święta przy stole",
      title: "Badanie przy stole",
      text: "Podaj telefon dalej. Od dwóch do ośmiu osób odpowiada po kolei, a Instytut ogłasza wyniki całej rodzinie naraz.",
      cta: "Zbadajcie cały stół",
    },
    grill: {
      tag: "Próba sprawności · IBD-G1",
      title: "Król grilla",
      text: "90 sekund przy ruszcie. Cała rodzina wie lepiej. Szczypce są tylko jedne.",
      cta: "Przejmij szczypce",
      alt: "Mężczyzna w niebieskim fartuchu obraca szczypcami kiełbaskę nad grillem pełnym kiełbas, papryki i kukurydzy. Z obu stron sięgają ku niemu ręce z radami.",
    },
  },
  sl: {
    wax: {
      andrzejki: "Andrejev večer",
      sylwester: "Silvestrovo",
      title: "Vlivanje voska",
      text: "Vlij vosek skozi ušesce ključa. Laboratorij za vedeževanje bo iz sence na steni razbral, v katero vrsto se preleviš v novem letu.",
      cta: "Vlij vosek",
      alt: "Voščeni odlitek v obliki sandala z nogavico.",
    },
    table: {
      tag: "Prazniki za mizo",
      title: "Pregled za mizo",
      text: "Podaj telefon naprej. Od dveh do osmih oseb odgovarja po vrsti, Inštitut pa izvide razglasi vsej družini hkrati.",
      cta: "Preglejte vso mizo",
    },
    grill: {
      tag: "Preizkus spretnosti · IBD-G1",
      title: "Kralj žara",
      text: "90 sekund pri žaru. Vsa družina ve bolje. Klešče so samo ene.",
      cta: "Prevzemi klešče",
      alt: "Moški v modrem predpasniku s kleščami obrača klobaso nad žarom, polnim klobas, paprik in koruze. Z obeh strani se proti njemu stegujeta roki z nasveti.",
    },
  },
});

const artSizes = "(max-width: 767px) min(90vw, 24rem), (max-width: 1023px) 40vw, 24rem";

export async function SeasonalPromo({ locale }: { locale: Locale }) {
  const { month, day } = await getToday();
  const activity = homeActivity(month, day, locale);
  const t = COPY[locale];
  const wax = activity === "andrzejki" || activity === "sylwester";
  const copy = wax ? t.wax : t[activity];
  const href = wax ? "/lanie-wosku" : activity === "table" ? "/test/przy-stole" : "/krol-grilla";
  const image = wax ? "/wosk/sandal" : "/illustrations/grill/hero";

  return (
    <section aria-labelledby="seasonal-promo" className="border-y border-ink bg-paper-deep">
      <div className="wrap grid items-center gap-6 py-10 md:grid-cols-12 md:py-12">
        <div className="md:col-span-7">
          <p className="label text-red-deep">{wax ? t.wax[activity] : t[activity].tag}</p>
          <h2 id="seasonal-promo" className="mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-tight">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-md text-xl leading-snug text-ink-soft">{typo(copy.text)}</p>
          <Link href={href} className="btn mt-6 bg-ink text-paper hover:bg-red">
            {copy.cta} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mx-auto w-full max-w-sm md:col-span-5">
          {activity === "table" ? (
            <SpeciesPlate species="wigilijny" specimen={1} locale={locale} sizes={artSizes} className="w-full" />
          ) : (
            <img
              src={`${image}-600.webp`}
              srcSet={`${image}-360.webp 360w, ${image}-600.webp 600w, ${image}.webp 900w`}
              sizes={artSizes}
              width={600}
              height={wax ? 600 : 400}
              alt={wax ? t.wax.alt : t.grill.alt}
              className="h-auto w-full"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      </div>
    </section>
  );
}
