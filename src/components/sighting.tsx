"use client";

import { useState, useSyncExternalStore } from "react";
import { getRegions } from "@/content/regions";
import type { SpeciesKey } from "@/content/species";
import { useLocale } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { cx, formatNumber, plural, pluralSl, typo } from "@/lib/typo";
import { patchAccount, signInHref, useAccount } from "./account";
import { Stamp } from "./brand";

const REGION_KEY = "ibd-wojewodztwo";
const REGION_OPTIONS: Record<Locale, ReturnType<typeof getRegions>[string][]> = {
  pl: Object.values(getRegions("pl")).sort((a, b) => a.name.localeCompare(b.name, "pl")),
  sl: Object.values(getRegions("sl")).sort((a, b) => a.name.localeCompare(b.name, "sl")),
};
const noSubscription = () => () => {};

const COPY = defineCopy({
  pl: {
    title: "Obserwacje terenowe",
    total: (total: string, n: number) => `${total} ${plural(n, "zgłoszenie", "zgłoszenia", "zgłoszeń")}`,
    week: (week: string) => `, ${week} w tym tygodniu`,
    none: "Brak zgłoszeń",
    stamp: "Zaobserwowano",
    nth: (n: number) => `To twoja ${n}. obserwacja tego gatunku.`,
    first: "Pierwsza obserwacja w dzienniku.",
    today: "Dziś już zgłoszone. Kolejna obserwacja jutro.",
    log: "Dziennik",
    where: "Gdzie",
    region: "Województwo (nieobowiązkowo)",
    sending: "Zgłaszam…",
    report: "Zgłoś obserwację",
    pitch: "Obserwacje zapisuje Profil Dziaderski, razem z kolekcją gatunków i odznakami. Logowanie przez e-mail, bez hasła.",
    error: "Rejestr obserwacji jest chwilowo nieczynny. Spróbuj za chwilę.",
    expired: "Sesja wygasła.",
    signInAgain: "Zaloguj się ponownie",
    collected: "W kolekcji.",
    collectedText: "Rozpoznany w twoim teście.",
    missing: "Poza kolekcją: test jeszcze go u ciebie nie rozpoznał.",
    proxy: "Wywiad rodzinny",
    proxyAfter: "też się liczy.",
    yourLog: (observed: number, species: number) => `Twój dziennik: ${observed} z ${species}`,
    join: "Dołącz do sieci obserwatorów",
    joinText: "Profil Dziaderski: dziennik obserwacji, kolekcja gatunków i odznaki. Logowanie przez e-mail, bez hasła.",
  },
  sl: {
    title: "Terenska opazovanja",
    total: (total: string, n: number) => `${total} ${pluralSl(n, "prijava", "prijavi", "prijave", "prijav")}`,
    week: (week: string) => `, ${week} ta teden`,
    none: "Ni prijav",
    stamp: "Opaženo",
    nth: (n: number) => `To je tvoje ${n}. opazovanje te vrste.`,
    first: "Prvo opazovanje v dnevniku.",
    today: "Danes je že prijavljeno. Naslednje opazovanje jutri.",
    log: "Dnevnik",
    where: "Kje",
    region: "Vojvodstvo (neobvezno)",
    sending: "Prijavljam …",
    report: "Prijavi opazovanje",
    pitch: "Opazovanja beleži Dziaderski profil, skupaj z zbirko vrst in značkami. Prijava brez gesla, z napotnico po e-pošti.",
    error: "Register opazovanj trenutno ne deluje. Poskusi čez trenutek.",
    expired: "Seja je potekla.",
    signInAgain: "Prijavi se znova",
    collected: "V zbirki.",
    collectedText: "Diagnosticiran v tvojem testu.",
    missing: "Zunaj zbirke: test ga pri tebi še ni diagnosticiral.",
    proxy: "Heteroanamneza",
    proxyAfter: "prav tako šteje.",
    yourLog: (observed: number, species: number) => `Tvoj dnevnik: ${observed} od ${species}`,
    join: "Pridruži se mreži opazovalcev",
    joinText: "Dziaderski profil: dnevnik opazovanj, zbirka vrst in značke. Prijava brez gesla, z napotnico po e-pošti.",
  },
});

function storedRegion() {
  try {
    return localStorage.getItem(REGION_KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * Obserwacje terenowe on a species page: the public count, and for signed-in visitors a button
 * that files today's sighting in their Profil Dziaderski. Guests get one line about the profile.
 */
export function SightingPanel({
  species,
  slug,
  diagnosable,
  total,
  week,
}: {
  species: SpeciesKey;
  slug: string;
  diagnosable: boolean;
  /** All sightings so far, from the cached community summary; null without a database. */
  total: number | null;
  week: number;
}) {
  const locale = useLocale();
  const t = COPY[locale];
  const count = (n: number) => formatNumber(locale, n);
  const account = useAccount();
  const remembered = useSyncExternalStore(noSubscription, storedRegion, () => "");
  const [region, setRegion] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "expired">("idle");
  const [mine, setMine] = useState(0);
  const chosen = region ?? remembered;

  const member = account.status === "member" ? account.account : null;
  const today = member?.observedToday.includes(species) ?? false;
  const collected = member?.collected.includes(species) ?? false;
  const here = `/atlas/${slug}#obserwacja`;

  async function report() {
    setState("sending");
    try {
      localStorage.setItem(REGION_KEY, chosen);
    } catch {
      // Not remembering the voivodeship is fine.
    }
    try {
      const response = await fetch("/api/obserwacje", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ species, region: chosen || null }),
      });
      if (response.status === 401) return setState("expired");
      if (!response.ok) return setState("error");
      const data = (await response.json()) as { count: number };
      setMine(data.count);
      setState("done");
      patchAccount((current) => ({
        ...current,
        observed: current.observed.includes(species) ? current.observed : [...current.observed, species],
        observedToday: [...current.observedToday, species],
      }));
    } catch {
      setState("error");
    }
  }

  return (
    <section id="obserwacja" aria-labelledby="obserwacja-tytul" className="scroll-mt-8 border-b border-rule py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 id="obserwacja-tytul" className="label text-ink-soft">
          {t.title}
        </h3>
        {total !== null && (
          <p className="label text-ink-soft">{total ? `${t.total(count(total), total)}${week ? t.week(count(week)) : ""}` : t.none}</p>
        )}
      </div>

      {state === "done" || (today && state !== "sending") ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3" role="status">
          <Stamp className={cx("text-[0.8rem] [--stamp-rotate:-4deg]", state === "done" ? "animate-stamp" : "rotate-[-4deg]")}>
            {t.stamp}
          </Stamp>
          <p className="leading-snug">
            {state === "done" && mine > 1 ? typo(t.nth(mine)) : state === "done" ? t.first : t.today}{" "}
            <Link href="/profil#obserwacje" className="link font-sans text-[0.95rem]">
              {t.log}
            </Link>
          </p>
        </div>
      ) : member ? (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 basis-40">
            <span className="label block text-ink-soft">{t.where}</span>
            <select
              value={chosen}
              onChange={(event) => setRegion(event.target.value)}
              className="mt-1 w-full border-0 border-b-2 border-ink bg-transparent py-1.5 font-sans text-[0.95rem] focus:border-red focus-visible:outline-none"
            >
              <option value="">{t.region}</option>
              {REGION_OPTIONS[locale].map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={report} disabled={state === "sending"} className="btn bg-ink text-paper hover:bg-red disabled:opacity-60">
            {state === "sending" ? t.sending : t.report}
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <Link href={signInHref(here)} className="btn border border-ink hover:bg-ink hover:text-paper">
            {t.report}
          </Link>
          <p className="label mt-3 max-w-sm text-ink-soft">{typo(t.pitch)}</p>
        </div>
      )}

      {state === "error" && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          {t.error}
        </p>
      )}
      {state === "expired" && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          {t.expired}{" "}
          <Link href={signInHref(here)} className="link">
            {t.signInAgain}
          </Link>
        </p>
      )}

      {member && diagnosable && (
        <p className="label mt-4 text-ink-soft">
          {collected ? (
            <>
              <span className="text-red">{t.collected}</span> {t.collectedText}
            </>
          ) : (
            <>
              {t.missing}{" "}
              <Link href="/test?tryb=wywiad" className="link">
                {t.proxy}
              </Link>{" "}
              {t.proxyAfter}
            </>
          )}
        </p>
      )}
    </section>
  );
}

/** The way into the observer network, under the Atlas's observation figures. */
export function ObserverCta({ species }: { species: number }) {
  const t = COPY[useLocale()];
  const account = useAccount();
  if (account.status === "member") {
    const observed = account.account.observed.length;
    return (
      <Link href="/profil#obserwacje" className="btn border border-ink hover:bg-ink hover:text-paper">
        {t.yourLog(observed, species)} <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return (
    <div>
      <Link href={signInHref("/atlas#obserwacje")} className="btn bg-ink text-paper hover:bg-red">
        {t.join} <span aria-hidden="true">→</span>
      </Link>
      <p className="label mt-3 max-w-sm text-ink-soft">{typo(t.joinText)}</p>
    </div>
  );
}
