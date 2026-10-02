"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitCase, type SubmissionState } from "@/app/czy-to-juz-dziaderstwo/actions";
import { typo } from "@/lib/typo";
import { signInHref, useAccount } from "./account";

/** "Zgłoś sprawę": signed-in judges only, into a queue the Institute reads by hand. */
export function CaseSubmission() {
  const account = useAccount();
  const [state, action, pending] = useActionState(submitCase, { status: "idle" } as SubmissionState);
  const back = signInHref("/czy-to-juz-dziaderstwo#zglos");

  if (account.status !== "member" || state.status === "signin") {
    return (
      <div className="border-t border-ink pt-5">
        <p className="max-w-xl text-xl leading-snug">
          {typo("Sprawy przyjmuje się od ławników z Profilem Dziaderskim. Instytut musi wiedzieć, komu odpisać, gdy sprawa trafi na wokandę.")}
        </p>
        <Link href={back} className="btn mt-6 bg-ink text-paper hover:bg-red">
          Zaloguj się i zgłoś sprawę <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  if (state.status === "sent") {
    return (
      <div className="border-t border-ink pt-5" role="status">
        <p className="text-2xl font-bold leading-tight">Pismo przyjęte do sekretariatu.</p>
        <p className="mt-3 max-w-xl leading-snug text-ink-soft">
          {typo("Komisja czyta zgłoszenia ręcznie. Stan sprawy widać w kartotece, w dziale Komisja.")}
        </p>
        <Link href="/profil#komisja" className="link mt-4 inline-block font-sans font-medium">
          Moje sprawy
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="border-t border-ink pt-5">
      <label htmlFor="sprawa" className="label text-ink-soft">
        Stan faktyczny
      </label>
      <textarea
        id="sprawa"
        name="sprawa"
        required
        minLength={30}
        maxLength={600}
        rows={5}
        defaultValue={state.body}
        placeholder="Uczestnik od 2011 roku… W obronie mówi, że…"
        className="mt-2 block w-full max-w-2xl resize-y border-2 border-ink bg-transparent p-3 text-lg leading-snug placeholder:text-ink/30 focus:border-red focus-visible:outline-none"
      />
      {state.status === "error" && (
        <p className="mt-2 font-sans text-sm text-red" role="alert">
          {state.message}
        </p>
      )}
      <p className="label mt-3 max-w-2xl text-ink-soft">
        {typo("Bez imion, nazwisk i adresów: Komisja orzeka o zachowaniach, nie o ludziach. Najwyżej trzy sprawy na dobę.")}{" "}
        <Link href="/regulamin" className="link">
          Regulamin
        </Link>
      </p>
      <button type="submit" disabled={pending} className="btn mt-6 bg-ink text-paper hover:bg-red disabled:opacity-60">
        {pending ? "Składam pismo…" : "Złóż pismo do Komisji"} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
