"use client";

import { useActionState } from "react";
import { requestLink, verifyCode, type SignInState } from "@/app/[lang]/konto/actions";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { typo } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    sent: "Skierowanie wysłane",
    check: (email: string) => `Sprawdź skrzynkę: ${email}`,
    hint: "W liście jest przycisk do profilu. Jeśli czytasz pocztę na innym urządzeniu, przepisz tutaj kod z listu.",
    code: "Kod z listu",
    checking: "Sprawdzam…",
    enter: "Wchodzę",
    resend: "Nie doszło? Wyślij jeszcze raz",
    linkFailed: "Skierowanie wygasło albo zostało już użyte. Zamów nowe, to nic nie kosztuje.",
    email: "Adres e-mail",
    placeholder: "zenek@example.pl",
    sending: "Wysyłam…",
    send: "Wyślij skierowanie",
    footnote: "Bez hasła: Instytut wyśle list z przyciskiem i kodem. Konto zakłada się samo przy pierwszym logowaniu.",
  },
  sl: {
    sent: "Napotnica poslana",
    check: (email: string) => `Preveri nabiralnik: ${email}`,
    hint: "V pismu je gumb za vstop v profil. Če pošto bereš na drugi napravi, sem prepiši kodo iz pisma.",
    code: "Koda iz pisma",
    checking: "Preverjam …",
    enter: "Vstopam",
    resend: "Ni prišlo? Pošlji še enkrat",
    linkFailed: "Napotnica je potekla ali pa je že bila uporabljena. Naroči novo, nič ne stane.",
    email: "E-naslov",
    placeholder: "joze@example.si",
    sending: "Pošiljam …",
    send: "Pošlji napotnico",
    footnote: "Brez gesla: Inštitut ti pošlje pismo z gumbom in kodo. Račun se odpre sam ob prvi prijavi.",
  },
});

const field =
  "mt-2 block w-full max-w-md border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-serif text-2xl font-bold placeholder:font-normal placeholder:text-ink/25 focus:border-red focus-visible:outline-none";

/** Two steps: an email address, then (optionally) the code from the letter. `next` is a public path of this edition. */
export function SignInForm({ next, linkFailed }: { next: string; linkFailed?: boolean }) {
  const locale = useLocale();
  const t = COPY[locale];
  const [sent, request, requesting] = useActionState(requestLink, { step: "email", next } as SignInState);
  const [checked, verify, verifying] = useActionState(verifyCode, { step: "code", next } as SignInState);

  if (sent.step === "code") {
    return (
      <div className="max-w-xl">
        <p className="label text-red">{t.sent}</p>
        <p className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight">{typo(t.check(sent.email ?? ""))}</p>
        <p className="mt-3 text-lg leading-snug text-ink-soft">{typo(t.hint)}</p>
        <form action={verify} className="mt-8">
          <input type="hidden" name="email" value={sent.email} />
          <input type="hidden" name="dalej" value={next} />
          <input type="hidden" name="jezyk" value={locale} />
          <label htmlFor="kod" className="label text-ink-soft">
            {t.code}
          </label>
          <input
            id="kod"
            name="kod"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={11}
            placeholder="000 000"
            className={`${field} tracking-[0.3em]`}
          />
          {checked.error && (
            <p className="mt-3 font-sans text-sm text-red" role="alert">
              {checked.error}
            </p>
          )}
          <button type="submit" disabled={verifying} className="btn mt-8 bg-ink text-paper hover:bg-red disabled:opacity-60">
            {verifying ? t.checking : t.enter} <span aria-hidden="true">→</span>
          </button>
        </form>
        <form action={request} className="mt-6">
          <input type="hidden" name="email" value={sent.email} />
          <input type="hidden" name="dalej" value={next} />
          <input type="hidden" name="jezyk" value={locale} />
          <button type="submit" disabled={requesting} className="link font-sans text-[0.95rem] text-ink-soft">
            {t.resend}
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={request} className="max-w-xl">
      {linkFailed && (
        <p className="mb-8 border-l-2 border-red pl-4 font-sans text-[0.95rem] leading-snug text-red" role="alert">
          {typo(t.linkFailed)}
        </p>
      )}
      <label htmlFor="email" className="label text-ink-soft">
        {t.email}
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        defaultValue={sent.email}
        placeholder={t.placeholder}
        className={field}
      />
      <input type="hidden" name="dalej" value={next} />
      <input type="hidden" name="jezyk" value={locale} />
      {sent.error && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          {sent.error}
        </p>
      )}
      <button type="submit" disabled={requesting} className="btn mt-8 bg-ink text-paper hover:bg-red disabled:opacity-60">
        {requesting ? t.sending : t.send} <span aria-hidden="true">→</span>
      </button>
      <p className="label mt-5 max-w-md text-ink-soft">{typo(t.footnote)}</p>
    </form>
  );
}
