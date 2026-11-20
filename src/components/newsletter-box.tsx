"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { setNewsletter } from "@/app/[lang]/profil/actions";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { track } from "@/lib/analytics";
import { cx, typo } from "@/lib/typo";
import { patchAccount, signInHref, useAccount } from "./account";

const COPY = defineCopy({
  pl: {
    guest: "Biuletyn przychodzi w poniedziałek rano: liczby z całego kraju, sprawa tygodnia, rozpoznanie i obserwacja tygodnia. Wystarczy adres e-mail; konto nie jest potrzebne.",
    email: "Adres e-mail",
    placeholder: "nazwisko@poczta.pl",
    order: "Zamów biuletyn",
    ordering: "Wysyłam…",
    sent: (email: string) => `Sekretariat wysłał list na adres ${email}. Prenumerata zacznie się po kliknięciu w link z tego listu. Bez kliknięcia Instytut zapomni adres po siedmiu dniach.`,
    again: "Inny adres",
    invalid: "Ten adres nie wygląda na adres e-mail.",
    busy: "Sekretariat przyjmuje za dużo zamówień naraz. Spróbuj za kilka minut.",
    closed: "Sekretariat jest chwilowo nieczynny. Spróbuj później.",
    offline: "Zamówienie nie dotarło. Sprawdź połączenie i spróbuj jeszcze raz.",
    member: "Masz Profil Dziaderski?",
    signIn: "Zamów jednym kliknięciem po zalogowaniu",
    privacy: "Prywatność",
    on: (email: string) => `Biuletyn przychodzi na adres ${email} w poniedziałki rano.`,
    off: (email: string) => `Biuletyn może przychodzić na adres ${email}, w poniedziałki rano. Raz w tygodniu, bez reklam.`,
    saving: "Zapisuję…",
    unsubscribe: "Wypisz mnie",
    subscribe: "Zamów biuletyn",
    failed: "Sekretariat nie przyjął zmiany. Spróbuj za chwilę.",
  },
  sl: {
    guest: "Bilten prihaja v ponedeljek zjutraj: številke iz vse države, primer tedna, diagnoza in opazovanje tedna. Dovolj je e-poštni naslov; račun ni potreben.",
    email: "E-poštni naslov",
    placeholder: "priimek@posta.si",
    order: "Naroči bilten",
    ordering: "Pošiljam …",
    sent: (email: string) => `Tajništvo je poslalo pismo na naslov ${email}. Naročnina začne veljati po kliku na povezavo iz pisma. Brez klika Inštitut naslov po sedmih dneh pozabi.`,
    again: "Drug naslov",
    invalid: "Ta naslov ni videti kot e-poštni naslov.",
    busy: "Tajništvo sprejema preveč naročil hkrati. Poskusi čez nekaj minut.",
    closed: "Tajništvo je začasno zaprto. Poskusi pozneje.",
    offline: "Naročilo ni prispelo. Preveri povezavo in poskusi znova.",
    member: "Imaš Dziaderski profil?",
    signIn: "Naroči z enim klikom po prijavi",
    privacy: "Zasebnost",
    on: (email: string) => `Bilten prihaja na naslov ${email} ob ponedeljkih zjutraj.`,
    off: (email: string) => `Bilten lahko prihaja na naslov ${email}, ob ponedeljkih zjutraj. Enkrat na teden, brez oglasov.`,
    saving: "Shranjujem …",
    unsubscribe: "Odjavi me",
    subscribe: "Naroči bilten",
    failed: "Tajništvo spremembe ni sprejelo. Poskusi znova čez trenutek.",
  },
});

const field = "mt-2 block w-full border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-sans text-xl focus:border-red focus-visible:outline-none";

type Props = {
  /** "page": the bulletin page. "inline": under a result or a game, with its own lead. */
  variant?: "page" | "inline";
  /** The sentence that ties the bulletin to the place (inline only). */
  lead?: string;
  /** For analytics: where the order came from. */
  place: string;
};

/**
 * Subscribing to the weekly bulletin: one click for members, an address and a confirm letter
 * (double opt-in, /api/biuletyn) for everyone else.
 */
export function NewsletterBox({ variant = "page", lead, place }: Props) {
  const locale = useLocale();
  const t = COPY[locale];
  const account = useAccount();
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);
  const inline = variant === "inline";

  if (account.status === "loading") return <div className={inline ? "min-h-24" : "min-h-32"} />;

  if (account.status === "guest") return <GuestForm inline={inline} lead={lead} place={place} />;

  const on = account.account.newsletter;
  // Under a result or a game, a subscriber needs no reminder.
  if (inline && on) return null;
  const toggle = () =>
    start(async () => {
      setFailed(false);
      const result = await setNewsletter(!on, locale);
      if (result === null) setFailed(true);
      else {
        patchAccount((current) => ({ ...current, newsletter: result }));
        if (result) track("Biuletyn zamówiony", { miejsce: place, konto: "tak" });
      }
    });

  return (
    <div>
      {inline && lead && <p className="max-w-md text-lg leading-snug">{typo(lead)}</p>}
      <p className={cx("max-w-md leading-snug", inline ? "mt-2 font-sans text-[0.95rem] text-ink-soft" : "text-lg")}>
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

type Status = { step: "form"; error?: string } | { step: "sending" } | { step: "sent"; email: string };

function GuestForm({ inline, lead, place }: { inline: boolean; lead?: string; place: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const id = useId();
  const [status, setStatus] = useState<Status>({ step: "form" });

  async function order(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setStatus({ step: "sending" });
    try {
      const response = await fetch("/api/biuletyn", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, jezyk: locale }),
      });
      if (response.ok) {
        track("Biuletyn zamówiony", { miejsce: place, konto: "nie" });
        setStatus({ step: "sent", email });
      } else {
        setStatus({ step: "form", error: response.status === 400 ? t.invalid : response.status === 429 ? t.busy : t.closed });
      }
    } catch {
      setStatus({ step: "form", error: t.offline });
    }
  }

  if (status.step === "sent") {
    return (
      <div role="status">
        {inline && lead && <p className="max-w-md text-lg leading-snug">{typo(lead)}</p>}
        <p className={cx("max-w-md leading-snug", inline ? "mt-3 font-sans text-[0.95rem]" : "text-lg")}>
          <span aria-hidden="true" className="mr-2 inline-block size-2 translate-y-[-2px] rounded-full bg-red" />
          {typo(t.sent(status.email))}
        </p>
        <button type="button" onClick={() => setStatus({ step: "form" })} className="link label mt-4 text-ink-soft">
          {t.again}
        </button>
      </div>
    );
  }

  const error = status.step === "form" ? status.error : undefined;
  return (
    <form onSubmit={order} className="max-w-xl">
      <p className="max-w-md text-lg leading-snug">{typo(inline && lead ? lead : t.guest)}</p>
      <label htmlFor={id} className="label mt-6 block text-ink-soft">
        {t.email}
      </label>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <input
          id={id}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder={t.placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-blad` : undefined}
          className={cx(field, "min-w-0 flex-1 basis-60")}
        />
        <button type="submit" disabled={status.step === "sending"} className="btn shrink-0 bg-ink text-paper hover:bg-red disabled:opacity-60">
          {status.step === "sending" ? t.ordering : t.order} <span aria-hidden="true">→</span>
        </button>
      </div>
      {error && (
        <p id={`${id}-blad`} className="mt-3 font-sans text-sm text-red" role="alert">
          {error}
        </p>
      )}
      <p className="label mt-5 max-w-md text-ink-soft">
        {inline ? (
          <Link href="/prywatnosc#zgody" className="link">
            {t.privacy}
          </Link>
        ) : (
          <>
            {t.member}{" "}
            <Link href={signInHref("/biuletyn#zapisy")} className="link text-ink">
              {t.signIn}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
