"use client";

import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { signInHref, useAccount } from "./account";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    visible: (nickname: string) => `Pseudonim „${nickname}” jest widoczny na Tablicy. Miejsce zależy od obserwacji, orzeczeń i kartek.`,
    settings: "Ustawienia",
    hidden: "Twój pseudonim nie jest jeszcze widoczny na Tablicy.",
    needed: "Do Tablicy potrzebny jest pseudonim.",
    enable: "Włącz w Profilu",
    invite: "Na Tablicę trafiają obserwatorzy, ławnicy i zdzieracze z Profilem Dziaderskim, którzy zgodzą się pokazać pseudonim. Nikt nie trafia tu bez zgody.",
    join: "Załóż Profil",
  },
  sl: {
    visible: (nickname: string) => `Psevdonim »${nickname}« je viden na Tabli. Mesto je odvisno od opazovanj, razsodb in listov.`,
    settings: "Nastavitve",
    hidden: "Tvoj psevdonim še ni viden na Tabli.",
    needed: "Za Tablo potrebuješ psevdonim.",
    enable: "Vklopi v profilu",
    invite: "Na Tablo pridejo opazovalci, porotniki in trgalci z Dziaderskim profilom, ki se strinjajo, da se pokaže njihov psevdonim. Nihče ne pride sem brez soglasja.",
    join: "Ustvari profil",
  },
});

/** How to get onto the Tablica Honorowa: a nickname and one tick in the profile. */
export function HonorCta() {
  const t = COPY[useLocale()];
  const account = useAccount();
  if (account.status === "loading") return null;
  if (account.status === "member") {
    const { honor, nickname } = account.account;
    return honor && nickname ? (
      <p className="leading-snug">
        <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-1px] rounded-full bg-red" />
        {typo(t.visible(nickname))}{" "}
        <Link href="/profil#ustawienia" className="link font-sans text-[0.95rem]">
          {t.settings}
        </Link>
      </p>
    ) : (
      <p className="leading-snug">
        {typo(nickname ? t.hidden : t.needed)}{" "}
        <Link href="/profil#ustawienia" className="btn mt-4 border border-ink hover:bg-ink hover:text-paper">
          {t.enable} <span aria-hidden="true">→</span>
        </Link>
      </p>
    );
  }
  return (
    <div>
      <p className="max-w-md leading-snug">{typo(t.invite)}</p>
      <Link href={signInHref("/profil#ustawienia")} className="btn mt-5 bg-ink text-paper hover:bg-red">
        {t.join} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
