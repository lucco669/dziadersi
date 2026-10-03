"use client";

import type { SpeciesKey } from "@/content/species";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { cx, plural, pluralSl, typo } from "@/lib/typo";
import { signInHref, useAccount } from "./account";

/*
 * One-line mentions of the Profil Dziaderski, placed where it actually helps: before the test,
 * next to a result, under the species collection. Members see their own file instead.
 */

const COPY = defineCopy({
  pl: {
    testMember: (nickname: string, results: number) =>
      `${nickname ? `${nickname}, wynik` : "Wynik"} sam trafi do kartoteki, a rozpoznany gatunek do kolekcji. W kartotece: ${results} ${plural(results, "badanie", "badania", "badań")}.`,
    testGuest: "Po zalogowaniu wynik sam trafi do Profilu Dziaderskiego, a gatunek do kolekcji.",
    testSignIn: "Zaloguj się przed badaniem",
    and: " i ",
    outsideAtlas: "Rozpoznanie spoza Atlasu nie dopisuje gatunku do kolekcji. Kartoteka przyjmie wynik i tak.",
    collected: (names: string, count: number) => `${names} ${count > 1 ? "są" : "jest"} już w twojej kolekcji.`,
    willCollect: (names: string, count: number, total: number) =>
      `Po zapisaniu ${names} ${count > 1 ? "trafią" : "trafi"} do twojej kolekcji: ${total} z 10.`,
    file: "Dopisz do kartoteki",
    keepSpecies: (names: string) => `Zachowaj link do wyniku. W Profilu Dziaderskim wynik trafi do kartoteki, a ${names} do kolekcji gatunków.`,
    keep: "Zachowaj link do wyniku. W Profilu Dziaderskim wynik trafi do kartoteki badań, obok odznak i kolekcji gatunków.",
    save: "Zapisz w Profilu",
    collection: (have: number, total: number) => `Twoja kolekcja: ${have} z ${total}.`,
    records: "Kartoteka",
    collectionGuest: "Każde rozpoznanie w teście dopisuje gatunek do kolekcji w Profilu Dziaderskim. Komplet dziesięciu daje odznakę.",
    open: "Załóż kartotekę",
    censusMember: (results: number) => `Twoje badania są w Spisie anonimowo, a w kartotece z imieniem: ${results}.`,
    censusGuest: "Spis liczy anonimowo. Własne wyniki, z historią i kolekcją gatunków, trzyma Profil Dziaderski.",
  },
  sl: {
    testMember: (nickname: string, results: number) =>
      `${nickname ? `${nickname}, izvid` : "Izvid"} se bo sam vpisal v kartoteko, prepoznana vrsta pa v zbirko. V kartoteki: ${results} ${pluralSl(results, "pregled", "pregleda", "pregledi", "pregledov")}.`,
    testGuest: "Po prijavi se izvid sam vpiše v Dziaderski profil, vrsta pa v zbirko.",
    testSignIn: "Prijavi se pred pregledom",
    and: " in ",
    outsideAtlas: "Diagnoza zunaj Atlasa ne doda vrste v zbirko. Kartoteka bo izvid vseeno sprejela.",
    collected: (names: string, count: number) => `${names} ${count > 1 ? "sta" : "je"} že v tvoji zbirki.`,
    willCollect: (names: string, count: number, total: number) =>
      `Ko izvid shraniš, ${count > 1 ? "prideta" : "pride"} ${names} v tvojo zbirko: ${total} od 10.`,
    file: "Vpiši v kartoteko",
    keepSpecies: (names: string) => `Shrani povezavo do izvida. V Dziaderskem profilu gre izvid v kartoteko, ${names} pa v zbirko vrst.`,
    keep: "Shrani povezavo do izvida. V Dziaderskem profilu gre izvid v kartoteko pregledov, poleg značk in zbirke vrst.",
    save: "Shrani v profil",
    collection: (have: number, total: number) => `Tvoja zbirka: ${have} od ${total}.`,
    records: "Kartoteka",
    collectionGuest: "Vsaka diagnoza v testu doda vrsto v zbirko v Dziaderskem profilu. Popolna zbirka desetih prinese značko.",
    open: "Odpri kartoteko",
    censusMember: (results: number) => `Tvoji pregledi so v Popisu anonimni, v kartoteki pa z imenom: ${results}.`,
    censusGuest: "Popis šteje anonimno. Lastne izvide skupaj z zgodovino in zbirko vrst hrani Dziaderski profil.",
  },
});

function Dot() {
  return <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-1px] rounded-full bg-red" />;
}

/** On the test's intro, under the start button. */
export function TestProfileNote() {
  const t = COPY[useLocale()];
  const account = useAccount();
  if (account.status === "loading") return null;
  if (account.status === "member") {
    const { nickname, results } = account.account;
    return (
      <p className="label mt-4 max-w-md text-ink-soft">
        <Dot />
        {typo(t.testMember(nickname, results))}
      </p>
    );
  }
  return (
    <p className="label mt-4 max-w-md text-ink-soft">
      {typo(t.testGuest)}{" "}
      <Link href={signInHref("/test")} className="link text-ink">
        {t.testSignIn}
      </Link>
    </p>
  );
}

/** Under the certificate on a result page. `species` carries the names in the edition being shown. */
export function ResultProfileNote({ code, species }: { code: string; species: { key: SpeciesKey; name: string }[] }) {
  const t = COPY[useLocale()];
  const account = useAccount();
  if (account.status === "loading") return null;
  const member = account.status === "member" ? account.account : null;
  const missing = species.filter((item) => !member?.collected.includes(item.key));
  const names = (items: { name: string }[]) => items.map((item) => item.name).join(t.and);

  return (
    <div className="mt-6 border-t border-rule pt-4 text-left">
      {member ? (
        <p className="leading-snug">
          <Dot />
          {species.length === 0
            ? typo(t.outsideAtlas)
            : missing.length === 0
              ? typo(t.collected(names(species), species.length))
              : typo(t.willCollect(names(missing), missing.length, member.collected.length + missing.length))}{" "}
          <Link href={`/profil/zapisz/${code}`} className="link font-sans text-[0.95rem]">
            {t.file}
          </Link>
        </p>
      ) : (
        <p className="leading-snug text-ink-soft">
          {typo(species.length ? t.keepSpecies(names(species)) : t.keep)}{" "}
          <Link href={`/profil/zapisz/${code}`} className="link font-sans text-[0.95rem] text-ink">
            {t.save}
          </Link>
        </p>
      )}
    </div>
  );
}

/** Under the ten nationwide plates on the front page: the collection, as a goal. */
export function CollectionLine({ species }: { species: SpeciesKey[] }) {
  const t = COPY[useLocale()];
  const account = useAccount();
  const member = account.status === "member" ? account.account : null;
  const have = member ? species.filter((key) => member.collected.includes(key)).length : 0;
  return (
    <p className={cx("label max-w-xl text-ink-soft transition-opacity", account.status === "loading" && "opacity-0")}>
      {member ? (
        <>
          <Dot />
          {t.collection(have, species.length)}{" "}
          <Link href="/profil#kolekcja" className="link text-ink">
            {t.records}
          </Link>
        </>
      ) : (
        <>
          {typo(t.collectionGuest)}{" "}
          <Link href={signInHref("/profil")} className="link text-ink">
            {t.open}
          </Link>
        </>
      )}
    </p>
  );
}

/** Under the census figures. */
export function CensusProfileNote() {
  const t = COPY[useLocale()];
  const account = useAccount();
  if (account.status === "loading") return null;
  return (
    <p className="label mt-6 max-w-xl text-ink-soft">
      {account.status === "member" ? (
        <>
          <Dot />
          {typo(t.censusMember(account.account.results))}{" "}
          <Link href="/profil#kartoteka" className="link text-ink">
            {t.records}
          </Link>
        </>
      ) : (
        <>
          {typo(t.censusGuest)}{" "}
          <Link href={signInHref("/profil")} className="link text-ink">
            {t.open}
          </Link>
        </>
      )}
    </p>
  );
}
