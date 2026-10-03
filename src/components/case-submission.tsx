"use client";

import { useActionState } from "react";
import { submitCase, type SubmissionState } from "@/app/[lang]/czy-to-juz-dziaderstwo/actions";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { typo } from "@/lib/typo";
import { signInHref, useAccount } from "./account";

const COPY = defineCopy({
  pl: {
    members:
      "Sprawy przyjmuje się od ławników z Profilem Dziaderskim. Instytut musi wiedzieć, komu odpisać, gdy sprawa trafi na wokandę.",
    signIn: "Zaloguj się i zgłoś sprawę",
    sent: "Pismo przyjęte do sekretariatu.",
    sentNote: "Komisja czyta zgłoszenia ręcznie. Stan sprawy widać w kartotece, w dziale Komisja.",
    mine: "Moje sprawy",
    facts: "Stan faktyczny",
    placeholder: "Uczestnik od 2011 roku… W obronie mówi, że…",
    rules: "Bez imion, nazwisk i adresów: Komisja orzeka o zachowaniach, nie o ludziach. Najwyżej trzy sprawy na dobę.",
    terms: "Regulamin",
    sending: "Składam pismo…",
    send: "Złóż pismo do Komisji",
  },
  sl: {
    members:
      "Primeri se sprejemajo od porotnikov z Dziaderskim profilom. Inštitut mora vedeti, komu odgovoriti, ko primer pride na dnevni red.",
    signIn: "Prijavi se in predlagaj primer",
    sent: "Tajništvo je vlogo sprejelo.",
    sentNote: "Komisija predloge bere ročno. Stanje primera je vidno v kartoteki, v razdelku Komisija.",
    mine: "Moji primeri",
    facts: "Dejansko stanje",
    placeholder: "Udeleženec od leta 2011 … V svoj zagovor pravi, da …",
    rules: "Brez imen, priimkov in naslovov: Komisija razsoja o vedenju, ne o ljudeh. Največ trije primeri na dan.",
    terms: "Pogoji uporabe",
    sending: "Vlagam vlogo …",
    send: "Vloži vlogo pri Komisiji",
  },
});

/** "Zgłoś sprawę": signed-in judges only, into a queue the Institute reads by hand. */
export function CaseSubmission() {
  const account = useAccount();
  const locale = useLocale();
  const t = COPY[locale];
  const [state, action, pending] = useActionState(submitCase, { status: "idle" } as SubmissionState);
  const back = signInHref("/czy-to-juz-dziaderstwo#zglos");

  if (account.status !== "member" || state.status === "signin") {
    return (
      <div className="border-t border-ink pt-5">
        <p className="max-w-xl text-xl leading-snug">{typo(t.members)}</p>
        <Link href={back} className="btn mt-6 bg-ink text-paper hover:bg-red">
          {t.signIn} <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  if (state.status === "sent") {
    return (
      <div className="border-t border-ink pt-5" role="status">
        <p className="text-2xl font-bold leading-tight">{t.sent}</p>
        <p className="mt-3 max-w-xl leading-snug text-ink-soft">{typo(t.sentNote)}</p>
        <Link href="/profil#komisja" className="link mt-4 inline-block font-sans font-medium">
          {t.mine}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="border-t border-ink pt-5">
      <input type="hidden" name="jezyk" value={locale} />
      <label htmlFor="sprawa" className="label text-ink-soft">
        {t.facts}
      </label>
      <textarea
        id="sprawa"
        name="sprawa"
        required
        minLength={30}
        maxLength={600}
        rows={5}
        defaultValue={state.body}
        placeholder={t.placeholder}
        className="mt-2 block w-full max-w-2xl resize-y border-2 border-ink bg-transparent p-3 text-lg leading-snug placeholder:text-ink/30 focus:border-red focus-visible:outline-none"
      />
      {state.status === "error" && (
        <p className="mt-2 font-sans text-sm text-red" role="alert">
          {state.message}
        </p>
      )}
      <p className="label mt-3 max-w-2xl text-ink-soft">
        {typo(t.rules)}{" "}
        <Link href="/regulamin" className="link">
          {t.terms}
        </Link>
      </p>
      <button type="submit" disabled={pending} className="btn mt-6 bg-ink text-paper hover:bg-red disabled:opacity-60">
        {pending ? t.sending : t.send} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
