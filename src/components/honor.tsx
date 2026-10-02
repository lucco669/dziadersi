"use client";

import Link from "next/link";
import { signInHref, useAccount } from "./account";
import { typo } from "@/lib/typo";

/** How to get onto the Tablica Honorowa: a nickname and one tick in the profile. */
export function HonorCta() {
  const account = useAccount();
  if (account.status === "loading") return null;
  if (account.status === "member") {
    const { honor, nickname } = account.account;
    return honor && nickname ? (
      <p className="leading-snug">
        <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-1px] rounded-full bg-red" />
        {typo(`Pseudonim „${nickname}” jest widoczny na Tablicy. Miejsce zależy od obserwacji, orzeczeń i kartek.`)}{" "}
        <Link href="/profil#ustawienia" className="link font-sans text-[0.95rem]">
          Ustawienia
        </Link>
      </p>
    ) : (
      <p className="leading-snug">
        {typo(nickname ? "Twój pseudonim nie jest jeszcze widoczny na Tablicy." : "Do Tablicy potrzebny jest pseudonim.")}{" "}
        <Link href="/profil#ustawienia" className="btn mt-4 border border-ink hover:bg-ink hover:text-paper">
          Włącz w Profilu <span aria-hidden="true">→</span>
        </Link>
      </p>
    );
  }
  return (
    <div>
      <p className="max-w-md leading-snug">
        {typo("Na Tablicę trafiają obserwatorzy, ławnicy i zdzieracze z Profilem Dziaderskim, którzy zgodzą się pokazać pseudonim. Nikt nie trafia tu bez zgody.")}
      </p>
      <Link href={signInHref("/profil#ustawienia")} className="btn mt-5 bg-ink text-paper hover:bg-red">
        Załóż Profil <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
