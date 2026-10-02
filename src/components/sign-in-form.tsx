"use client";

import { useActionState } from "react";
import { requestLink, verifyCode, type SignInState } from "@/app/konto/actions";
import { typo } from "@/lib/typo";

const field =
  "mt-2 block w-full max-w-md border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-serif text-2xl font-bold placeholder:font-normal placeholder:text-ink/25 focus:border-red focus-visible:outline-none";

/** Two steps: an email address, then (optionally) the code from the letter. */
export function SignInForm({ next, linkFailed }: { next: string; linkFailed?: boolean }) {
  const [sent, request, requesting] = useActionState(requestLink, { step: "email", next } as SignInState);
  const [checked, verify, verifying] = useActionState(verifyCode, { step: "code", next } as SignInState);

  if (sent.step === "code") {
    return (
      <div className="max-w-xl">
        <p className="label text-red">Skierowanie wysłane</p>
        <p className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight">{typo(`Sprawdź skrzynkę: ${sent.email}`)}</p>
        <p className="mt-3 text-lg leading-snug text-ink-soft">
          {typo("W liście jest przycisk do profilu. Jeśli czytasz pocztę na innym urządzeniu, przepisz tutaj kod z listu.")}
        </p>
        <form action={verify} className="mt-8">
          <input type="hidden" name="email" value={sent.email} />
          <input type="hidden" name="dalej" value={next} />
          <label htmlFor="kod" className="label text-ink-soft">
            Kod z listu
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
            {verifying ? "Sprawdzam…" : "Wchodzę"} <span aria-hidden="true">→</span>
          </button>
        </form>
        <form action={request} className="mt-6">
          <input type="hidden" name="email" value={sent.email} />
          <input type="hidden" name="dalej" value={next} />
          <button type="submit" disabled={requesting} className="link font-sans text-[0.95rem] text-ink-soft">
            Nie doszło? Wyślij jeszcze raz
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={request} className="max-w-xl">
      {linkFailed && (
        <p className="mb-8 border-l-2 border-red pl-4 font-sans text-[0.95rem] leading-snug text-red" role="alert">
          {typo("Skierowanie wygasło albo zostało już użyte. Zamów nowe, to nic nie kosztuje.")}
        </p>
      )}
      <label htmlFor="email" className="label text-ink-soft">
        Adres e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        defaultValue={sent.email}
        placeholder="zenek@example.pl"
        className={field}
      />
      <input type="hidden" name="dalej" value={next} />
      {sent.error && (
        <p className="mt-3 font-sans text-sm text-red" role="alert">
          {sent.error}
        </p>
      )}
      <button type="submit" disabled={requesting} className="btn mt-8 bg-ink text-paper hover:bg-red disabled:opacity-60">
        {requesting ? "Wysyłam…" : "Wyślij skierowanie"} <span aria-hidden="true">→</span>
      </button>
      <p className="label mt-5 max-w-md text-ink-soft">
        {typo("Bez hasła: Instytut wyśle list z przyciskiem i kodem. Konto zakłada się samo przy pierwszym logowaniu.")}
      </p>
    </form>
  );
}
