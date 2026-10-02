"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { setNewsletter } from "@/app/profil/actions";
import { typo } from "@/lib/typo";
import { patchAccount, signInHref, useAccount } from "./account";

/** Subscribing to the weekly bulletin: one click for members, sign-in first for guests. */
export function NewsletterBox() {
  const account = useAccount();
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  if (account.status === "loading") return <div className="min-h-32" />;

  if (account.status === "guest") {
    return (
      <div>
        <p className="max-w-md text-lg leading-snug">
          {typo("Biuletyn przychodzi w poniedziałek rano do osób z Profilem Dziaderskim, które go zamówiły. Wypisać się można jednym kliknięciem.")}
        </p>
        <Link href={signInHref("/biuletyn#zapisy")} className="btn mt-6 bg-ink text-paper hover:bg-red">
          Zaloguj się i zamów <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  const on = account.account.newsletter;
  const toggle = () =>
    start(async () => {
      setFailed(false);
      const result = await setNewsletter(!on);
      if (result === null) setFailed(true);
      else patchAccount((current) => ({ ...current, newsletter: result }));
    });

  return (
    <div>
      <p className="max-w-md text-lg leading-snug">
        {on ? (
          <>
            <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-2px] rounded-full bg-red" />
            {typo(`Biuletyn przychodzi na adres ${account.account.email} w poniedziałki rano.`)}
          </>
        ) : (
          typo(`Biuletyn może przychodzić na adres ${account.account.email}, w poniedziałki rano. Raz w tygodniu, bez reklam.`)
        )}
      </p>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={on ? "btn mt-6 border border-ink hover:bg-ink hover:text-paper disabled:opacity-60" : "btn mt-6 bg-ink text-paper hover:bg-red disabled:opacity-60"}
      >
        {pending ? "Zapisuję…" : on ? "Wypisz mnie" : "Zamów biuletyn"}
      </button>
      {failed && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          Sekretariat nie przyjął zmiany. Spróbuj za chwilę.
        </p>
      )}
    </div>
  );
}
