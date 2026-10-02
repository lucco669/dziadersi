"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { REGIONS } from "@/content/regions";
import type { SpeciesKey } from "@/content/species";
import { cx, plural, typo } from "@/lib/typo";
import { patchAccount, signInHref, useAccount } from "./account";
import { Stamp } from "./brand";

const REGION_KEY = "ibd-wojewodztwo";
const REGION_OPTIONS = Object.values(REGIONS).sort((a, b) => a.name.localeCompare(b.name, "pl"));
const count = new Intl.NumberFormat("pl-PL");
const noSubscription = () => () => {};

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
          Obserwacje terenowe
        </h3>
        {total !== null && (
          <p className="label text-ink-soft">
            {total
              ? `${count.format(total)} ${plural(total, "zgłoszenie", "zgłoszenia", "zgłoszeń")}${week ? `, ${count.format(week)} w tym tygodniu` : ""}`
              : "Brak zgłoszeń"}
          </p>
        )}
      </div>

      {state === "done" || (today && state !== "sending") ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3" role="status">
          <Stamp className={cx("text-[0.8rem] [--stamp-rotate:-4deg]", state === "done" ? "animate-stamp" : "rotate-[-4deg]")}>
            Zaobserwowano
          </Stamp>
          <p className="leading-snug">
            {state === "done" && mine > 1
              ? typo(`To twoja ${mine}. obserwacja tego gatunku.`)
              : state === "done"
                ? "Pierwsza obserwacja w dzienniku."
                : "Dziś już zgłoszone. Kolejna obserwacja jutro."}{" "}
            <Link href="/profil#obserwacje" className="link font-sans text-[0.95rem]">
              Dziennik
            </Link>
          </p>
        </div>
      ) : member ? (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 basis-40">
            <span className="label block text-ink-soft">Gdzie</span>
            <select
              value={chosen}
              onChange={(event) => setRegion(event.target.value)}
              className="mt-1 w-full border-0 border-b-2 border-ink bg-transparent py-1.5 font-sans text-[0.95rem] focus:border-red focus-visible:outline-none"
            >
              <option value="">Województwo (nieobowiązkowo)</option>
              {REGION_OPTIONS.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={report} disabled={state === "sending"} className="btn bg-ink text-paper hover:bg-red disabled:opacity-60">
            {state === "sending" ? "Zgłaszam…" : "Zgłoś obserwację"}
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <Link href={signInHref(here)} className="btn border border-ink hover:bg-ink hover:text-paper">
            Zgłoś obserwację
          </Link>
          <p className="label mt-3 max-w-sm text-ink-soft">
            {typo("Obserwacje zapisuje Profil Dziaderski, razem z kolekcją gatunków i odznakami. Logowanie przez e-mail, bez hasła.")}
          </p>
        </div>
      )}

      {state === "error" && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          Rejestr obserwacji jest chwilowo nieczynny. Spróbuj za chwilę.
        </p>
      )}
      {state === "expired" && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          Sesja wygasła.{" "}
          <Link href={signInHref(here)} className="link">
            Zaloguj się ponownie
          </Link>
        </p>
      )}

      {member && diagnosable && (
        <p className="label mt-4 text-ink-soft">
          {collected ? (
            <>
              <span className="text-red">W kolekcji.</span> Rozpoznany w twoim teście.
            </>
          ) : (
            <>
              Poza kolekcją: test jeszcze go u ciebie nie rozpoznał.{" "}
              <Link href="/test?tryb=wywiad" className="link">
                Wywiad rodzinny
              </Link>{" "}
              też się liczy.
            </>
          )}
        </p>
      )}
    </section>
  );
}

/** The way into the observer network, under the Atlas's observation figures. */
export function ObserverCta({ species }: { species: number }) {
  const account = useAccount();
  if (account.status === "member") {
    const observed = account.account.observed.length;
    return (
      <Link href="/profil#obserwacje" className="btn border border-ink hover:bg-ink hover:text-paper">
        Twój dziennik: {observed} z {species} <span aria-hidden="true">→</span>
      </Link>
    );
  }
  return (
    <div>
      <Link href={signInHref("/atlas#obserwacje")} className="btn bg-ink text-paper hover:bg-red">
        Dołącz do sieci obserwatorów <span aria-hidden="true">→</span>
      </Link>
      <p className="label mt-3 max-w-sm text-ink-soft">
        {typo("Profil Dziaderski: dziennik obserwacji, kolekcja gatunków i odznaki. Logowanie przez e-mail, bez hasła.")}
      </p>
    </div>
  );
}
