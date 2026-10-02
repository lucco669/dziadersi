"use client";

import Link from "next/link";
import type { SpeciesKey } from "@/content/species";
import { cx, plural, typo } from "@/lib/typo";
import { signInHref, useAccount } from "./account";

/*
 * One-line mentions of the Profil Dziaderski, placed where it actually helps: before the test,
 * next to a result, under the species collection. Members see their own file instead.
 */

function Dot() {
  return <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-1px] rounded-full bg-red" />;
}

/** On the test's intro, under the start button. */
export function TestProfileNote() {
  const account = useAccount();
  if (account.status === "loading") return null;
  if (account.status === "member") {
    const { nickname, results } = account.account;
    return (
      <p className="label mt-4 max-w-md text-ink-soft">
        <Dot />
        {typo(
          `${nickname ? `${nickname}, wynik` : "Wynik"} sam trafi do kartoteki, a rozpoznany gatunek do kolekcji. W kartotece: ${results} ${plural(results, "badanie", "badania", "badań")}.`,
        )}
      </p>
    );
  }
  return (
    <p className="label mt-4 max-w-md text-ink-soft">
      {typo("Po zalogowaniu wynik sam trafi do Profilu Dziaderskiego, a gatunek do kolekcji.")}{" "}
      <Link href={signInHref("/test")} className="link text-ink">
        Zaloguj się przed badaniem
      </Link>
    </p>
  );
}

/** Under the certificate on a result page. */
export function ResultProfileNote({ code, species }: { code: string; species: { key: SpeciesKey; name: string }[] }) {
  const account = useAccount();
  if (account.status === "loading") return null;
  const member = account.status === "member" ? account.account : null;
  const missing = species.filter((item) => !member?.collected.includes(item.key));

  return (
    <div className="mt-6 border-t border-rule pt-4 text-left">
      {member ? (
        <p className="leading-snug">
          <Dot />
          {species.length === 0
            ? typo("Rozpoznanie spoza Atlasu nie dopisuje gatunku do kolekcji. Kartoteka przyjmie wynik i tak.")
            : missing.length === 0
              ? typo(`${species.map((item) => item.name).join(" i ")} ${species.length > 1 ? "są" : "jest"} już w twojej kolekcji.`)
              : typo(`Po zapisaniu ${missing.map((item) => item.name).join(" i ")} ${missing.length > 1 ? "trafią" : "trafi"} do twojej kolekcji: ${member.collected.length + missing.length} z 10.`)}{" "}
          <Link href={`/profil/zapisz/${code}`} className="link font-sans text-[0.95rem]">
            Dopisz do kartoteki
          </Link>
        </p>
      ) : (
        <p className="leading-snug text-ink-soft">
          {typo(
            species.length
              ? `Ten wynik żyje tylko w linku. W Profilu Dziaderskim trafi do kartoteki, a ${species.map((item) => item.name).join(" i ")} do kolekcji gatunków.`
              : "Ten wynik żyje tylko w linku. W Profilu Dziaderskim trafi do kartoteki badań, obok odznak i kolekcji gatunków.",
          )}{" "}
          <Link href={`/profil/zapisz/${code}`} className="link font-sans text-[0.95rem] text-ink">
            Zapisz w Profilu
          </Link>
        </p>
      )}
    </div>
  );
}

/** Under the ten nationwide plates on the front page: the collection, as a goal. */
export function CollectionLine({ species }: { species: SpeciesKey[] }) {
  const account = useAccount();
  const member = account.status === "member" ? account.account : null;
  const have = member ? species.filter((key) => member.collected.includes(key)).length : 0;
  return (
    <p className={cx("label max-w-xl text-ink-soft transition-opacity", account.status === "loading" && "opacity-0")}>
      {member ? (
        <>
          <Dot />
          Twoja kolekcja: {have} z {species.length}.{" "}
          <Link href="/profil#kolekcja" className="link text-ink">
            Kartoteka
          </Link>
        </>
      ) : (
        <>
          {typo("Każde rozpoznanie w teście dopisuje gatunek do kolekcji w Profilu Dziaderskim. Komplet dziesięciu daje odznakę.")}{" "}
          <Link href={signInHref("/profil")} className="link text-ink">
            Załóż kartotekę
          </Link>
        </>
      )}
    </p>
  );
}

/** Under the census figures. */
export function CensusProfileNote() {
  const account = useAccount();
  if (account.status === "loading") return null;
  return (
    <p className="label mt-6 max-w-xl text-ink-soft">
      {account.status === "member" ? (
        <>
          <Dot />
          {typo(`Twoje badania są w Spisie anonimowo, a w kartotece z imieniem: ${account.account.results}.`)}{" "}
          <Link href="/profil#kartoteka" className="link text-ink">
            Kartoteka
          </Link>
        </>
      ) : (
        <>
          {typo("Spis liczy anonimowo. Własne wyniki, z historią i kolekcją gatunków, trzyma Profil Dziaderski.")}{" "}
          <Link href={signInHref("/profil")} className="link text-ink">
            Załóż kartotekę
          </Link>
        </>
      )}
    </p>
  );
}
