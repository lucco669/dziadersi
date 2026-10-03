"use client";

import { useState, useTransition } from "react";
import { setNewsletter } from "@/app/[lang]/profil/actions";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { typo } from "@/lib/typo";
import { patchAccount, signInHref, useAccount } from "./account";

const COPY = defineCopy({
  pl: {
    guest: "Biuletyn przychodzi w poniedziałek rano do osób z Profilem Dziaderskim, które go zamówiły. Wypisać się można jednym kliknięciem.",
    signIn: "Zaloguj się i zamów",
    on: (email: string) => `Biuletyn przychodzi na adres ${email} w poniedziałki rano.`,
    off: (email: string) => `Biuletyn może przychodzić na adres ${email}, w poniedziałki rano. Raz w tygodniu, bez reklam.`,
    saving: "Zapisuję…",
    unsubscribe: "Wypisz mnie",
    subscribe: "Zamów biuletyn",
    failed: "Sekretariat nie przyjął zmiany. Spróbuj za chwilę.",
  },
  sl: {
    guest: "Bilten prihaja v ponedeljek zjutraj osebam z Dziaderskim profilom, ki so ga naročile. Odjaviš se z enim klikom.",
    signIn: "Prijavi se in naroči",
    on: (email: string) => `Bilten prihaja na naslov ${email} ob ponedeljkih zjutraj.`,
    off: (email: string) => `Bilten lahko prihaja na naslov ${email}, ob ponedeljkih zjutraj. Enkrat na teden, brez oglasov.`,
    saving: "Shranjujem …",
    unsubscribe: "Odjavi me",
    subscribe: "Naroči bilten",
    failed: "Tajništvo spremembe ni sprejelo. Poskusi znova čez trenutek.",
  },
});

/** Subscribing to the weekly bulletin: one click for members, sign-in first for guests. */
export function NewsletterBox() {
  const locale = useLocale();
  const t = COPY[locale];
  const account = useAccount();
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  if (account.status === "loading") return <div className="min-h-32" />;

  if (account.status === "guest") {
    return (
      <div>
        <p className="max-w-md text-lg leading-snug">{typo(t.guest)}</p>
        <Link href={signInHref("/biuletyn#zapisy")} className="btn mt-6 bg-ink text-paper hover:bg-red">
          {t.signIn} <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  const on = account.account.newsletter;
  const toggle = () =>
    start(async () => {
      setFailed(false);
      const result = await setNewsletter(!on, locale);
      if (result === null) setFailed(true);
      else patchAccount((current) => ({ ...current, newsletter: result }));
    });

  return (
    <div>
      <p className="max-w-md text-lg leading-snug">
        {on ? (
          <>
            <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-2px] rounded-full bg-red" />
            {typo(t.on(account.account.email))}
          </>
        ) : (
          typo(t.off(account.account.email))
        )}
      </p>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={on ? "btn mt-6 border border-ink hover:bg-ink hover:text-paper disabled:opacity-60" : "btn mt-6 bg-ink text-paper hover:bg-red disabled:opacity-60"}
      >
        {pending ? t.saving : on ? t.unsubscribe : t.subscribe}
      </button>
      {failed && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          {t.failed}
        </p>
      )}
    </div>
  );
}
