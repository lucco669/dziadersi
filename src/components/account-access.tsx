"use client";

import { useActionState } from "react";
import { registerPassword, requestPasswordReset, resendConfirmation, signInPassword, updatePassword } from "@/app/[lang]/konto/actions";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { PASSWORD_MAX, PASSWORD_MIN, type PasswordMode, type PasswordState } from "@/lib/password-auth";
import { typo } from "@/lib/typo";
import { SignInForm } from "./sign-in-form";

const COPY = defineCopy({
  pl: {
    login: "Zaloguj się", register: "Załóż konto", recovery: "Odzyskaj hasło", password: "Ustaw nowe hasło",
    email: "Adres e-mail", passwordLabel: "Hasło", newPassword: "Nowe hasło", confirm: "Powtórz hasło",
    hint: "Od 8 do 128 znaków. Użyj unikalnego hasła.",
    wait: "Proszę czekać…", send: "Wyślij link do zmiany hasła", save: "Zapisz nowe hasło",
    forgot: "Nie pamiętasz hasła?", back: "Wróć do logowania", magic: "Zaloguj się linkiem z e-maila",
    google: "Zaloguj się przez Google", or: "lub", resend: "Wyślij potwierdzenie ponownie",
    recoveryHint: "Podaj adres swojego konta. Wyślemy link do ustawienia nowego hasła. W ten sposób możesz też dodać hasło do konta założonego przez e-mail lub Google.",
    signupHint: "Po rejestracji poprosimy o potwierdzenie adresu e-mail.",
    linkFailed: "Link wygasł albo został już użyty. Poproś o nowy link lub zaloguj się ponownie.",
    googleFailed: "Nie udało się zalogować przez Google. Spróbuj ponownie lub skorzystaj z e-maila.",
    resetFor: (email: string) => `Nowe hasło dla: ${email}`,
  },
  sl: {
    login: "Prijavi se", register: "Ustvari račun", recovery: "Ponastavi geslo", password: "Nastavi novo geslo",
    email: "E-naslov", passwordLabel: "Geslo", newPassword: "Novo geslo", confirm: "Ponovi geslo",
    hint: "Od 8 do 128 znakov. Uporabi edinstveno geslo.",
    wait: "Počakaj …", send: "Pošlji povezavo za spremembo gesla", save: "Shrani novo geslo",
    forgot: "Si pozabil geslo?", back: "Nazaj na prijavo", magic: "Prijavi se s povezavo iz e-pošte",
    google: "Prijavi se z Googlom", or: "ali", resend: "Znova pošlji potrditev",
    recoveryHint: "Vnesi e-naslov svojega računa. Poslali ti bomo povezavo za nastavitev novega gesla. Tako lahko dodaš geslo tudi računu, ustvarjenemu po e-pošti ali z Googlom.",
    signupHint: "Po registraciji te bomo prosili za potrditev e-naslova.",
    linkFailed: "Povezava je potekla ali pa je že bila uporabljena. Naroči novo povezavo ali se znova prijavi.",
    googleFailed: "Prijava z Googlom ni uspela. Poskusi znova ali uporabi e-pošto.",
    resetFor: (email: string) => `Novo geslo za: ${email}`,
  },
});

const actions = { login: signInPassword, register: registerPassword, recovery: requestPasswordReset, password: updatePassword };
const field = "mt-2 block w-full border-0 border-b-2 border-ink bg-transparent px-0 py-2 font-sans text-xl focus:border-red focus-visible:outline-none";

function FormContext({ next }: { next: string }) {
  return <><input type="hidden" name="dalej" value={next} /><input type="hidden" name="jezyk" value={useLocale()} /></>;
}

function Confirmation({ email, next }: { email: string; next: string }) {
  const t = COPY[useLocale()];
  const [state, action, pending] = useActionState(resendConfirmation, {} as PasswordState);
  return (
    <form action={action} className="mt-6">
      <FormContext next={next} />
      <input type="hidden" name="email" value={email} />
      <button disabled={pending} className="link font-sans text-sm disabled:opacity-60">{pending ? t.wait : t.resend}</button>
      {state.error && <p className="mt-3 font-sans text-sm text-red" role="alert">{state.error}</p>}
      {state.message && <p className="mt-3 font-sans text-sm" role="status">{state.message}</p>}
    </form>
  );
}

function PasswordForm({ mode, next, email }: { mode: PasswordMode; next: string; email?: string }) {
  const t = COPY[useLocale()];
  const [state, action, pending] = useActionState(actions[mode], {} as PasswordState);
  const newPassword = mode === "register" || mode === "password";
  return (
    <>
      <h2 className="text-3xl font-bold">{t[mode]}</h2>
      {mode === "recovery" && <p className="mt-3 text-lg leading-snug text-ink-soft">{typo(t.recoveryHint)}</p>}
      {mode === "password" && email && <p className="mt-3 break-words font-sans text-sm text-ink-soft">{t.resetFor(email)}</p>}
      {state.message ? <p className="mt-6 border-l-2 border-ink pl-4 text-lg" role="status">{typo(state.message)}</p> : (
        <form action={action} className="mt-8">
          <FormContext next={next} />
          <fieldset disabled={pending} className="space-y-6 disabled:opacity-60">
            {mode !== "password" && <div>
              <label htmlFor="email" className="label text-ink-soft">{t.email}</label>
              <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={state.email} className={field} />
            </div>}
            {mode !== "recovery" && <div>
              <label htmlFor="password" className="label text-ink-soft">{mode === "password" ? t.newPassword : t.passwordLabel}</label>
              <input id="password" name="password" type="password" autoComplete={newPassword ? "new-password" : "current-password"} required minLength={newPassword ? PASSWORD_MIN : undefined} maxLength={PASSWORD_MAX} aria-describedby={newPassword ? "password-hint" : undefined} className={field} />
              {newPassword && <p id="password-hint" className="mt-2 font-sans text-sm text-ink-soft">{t.hint}</p>}
            </div>}
            {newPassword && <div>
              <label htmlFor="password-confirm" className="label text-ink-soft">{t.confirm}</label>
              <input id="password-confirm" name="passwordConfirm" type="password" autoComplete="new-password" required minLength={PASSWORD_MIN} maxLength={PASSWORD_MAX} className={field} />
            </div>}
            {state.error && <p className="font-sans text-sm text-red" role="alert">{state.error}</p>}
            <button type="submit" className="btn w-full justify-center bg-ink text-paper hover:bg-red">
              {pending ? t.wait : mode === "recovery" ? t.send : mode === "password" ? t.save : t[mode]} <span aria-hidden="true">→</span>
            </button>
          </fieldset>
          {mode === "register" && <p className="mt-4 font-sans text-sm text-ink-soft">{t.signupHint}</p>}
        </form>
      )}
      {state.confirm && state.email && <Confirmation email={state.email} next={next} />}
    </>
  );
}

export function AccountAccess({ mode, next, failure, email }: { mode: PasswordMode | "magic"; next: string; failure?: "link" | "google"; email?: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const href = (mode: string) => `/konto?tryb=${mode}&dalej=${encodeURIComponent(next)}`;
  return (
    <div className="max-w-md">
      {failure && <p className="mb-8 border-l-2 border-red pl-4 font-sans text-sm text-red" role="alert">{failure === "google" ? t.googleFailed : t.linkFailed}</p>}
      {(mode === "login" || mode === "register") && <nav aria-label={`${t.login} / ${t.register}`} className="mb-8 flex gap-6 border-b border-ink/20 pb-4">
        <Link href={href("login")} aria-current={mode === "login" ? "page" : undefined} className={`label ${mode === "login" ? "text-red" : "link text-ink-soft"}`}>{t.login}</Link>
        <Link href={href("register")} aria-current={mode === "register" ? "page" : undefined} className={`label ${mode === "register" ? "text-red" : "link text-ink-soft"}`}>{t.register}</Link>
      </nav>}
      {mode === "magic" ? <SignInForm next={next} /> : <PasswordForm key={mode} mode={mode} next={next} email={email} />}
      {(mode === "login" || mode === "register") && <>
        <Link href={href("recovery")} className="link mt-5 inline-block font-sans text-sm">{t.forgot}</Link>
        <div className="my-7 flex items-center gap-4 text-ink-soft"><span className="h-px flex-1 bg-ink/20" /><span className="label">{t.or}</span><span className="h-px flex-1 bg-ink/20" /></div>
        {/* Auth routes are shared by both editions and must not be localised or prefetched. */}
        <a href={`/auth/google?${new URLSearchParams({ dalej: next, jezyk: locale })}`} className="btn w-full justify-center border border-ink bg-paper hover:bg-ink hover:text-paper">{t.google}</a>
        <Link href={href("magic")} className="link mt-6 inline-block font-sans text-sm text-ink-soft">{t.magic}</Link>
      </>}
      {mode !== "login" && mode !== "register" && <Link href={href("login")} className="link mt-8 inline-block font-sans text-sm">{t.back}</Link>}
    </div>
  );
}
