"use client";
import { track } from "@/lib/analytics";
import { copyResultLink, resultShareIntent, shareResult } from "@/lib/result-sharing";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { site } from "@/lib/site";
import { tally } from "@/lib/tally";
import { cleanName, decodeResult, encodeResult, groupPath } from "@/lib/test";
import { cx } from "@/lib/typo";
import { ResultSpecimenChoice } from "./result-specimen-choice";
import { ShareOutlet, shareOutlets } from "./share-bar";

const COPY = defineCopy({
  pl: {
    text: (score: number, diagnosis: string) => `Mam ${score}% w Teście Dziadersa. Rozpoznanie: ${diagnosis}. A ty?`,
    title: (score: number, diagnosis: string) => `${score}% · ${diagnosis}`,
    subject: (score: number) => `Certyfikat Dziaderstwa: ${score}%`,
    file: "certyfikat-dziadersa",
    prompt: "Skopiuj link do wyniku:",
    email: "E-mail",
    share: "Udostępnij wynik",
    copy: "Kopiuj link",
    copied: "Skopiowano link ✓",
    sendCertificate: "Wyślij certyfikat",
    compare: "Porównaj wyniki",
    options: "Rycina, podpis i pliki do pobrania",
    announce: "Link skopiowany do schowka.",
    downloads: "Do pobrania",
    post: "Pobierz post 4:5",
    story: "Pobierz relację 9:16",
    lab: "Wyniki badań",
    send: "Wyślij",
    profile: "Profil",
    save: "Zapisz w Profilu Dziaderskim",
    respondent: "Osoba badana",
    nameLabel: "Imię na certyfikacie",
    namePlaceholder: "Imię na certyfikat",
    saveName: "Zapisz",
    cancel: "Anuluj",
    nameError: "Tego Instytut nie wpisze na certyfikat. Spróbuj samego imienia.",
    change: (name: string) => `${name} · zmień`,
    addName: "Dopisz imię do certyfikatu",
  },
  sl: {
    text: (score: number, diagnosis: string) => `Na testu dziadersa imam ${score} %. Diagnoza: ${diagnosis}. Pa ti?`,
    title: (score: number, diagnosis: string) => `${score} % · ${diagnosis}`,
    subject: (score: number) => `Certifikat dziaderstva: ${score} %`,
    file: "certifikat-dziadersa",
    prompt: "Kopiraj povezavo do izvida:",
    email: "E-pošta",
    share: "Deli izvid",
    copy: "Kopiraj povezavo",
    copied: "Povezava kopirana ✓",
    sendCertificate: "Pošlji certifikat",
    compare: "Primerjaj rezultate",
    options: "Risba, podpis in datoteke za prenos",
    announce: "Povezava je kopirana v odložišče.",
    downloads: "Prenosi",
    post: "Prenesi objavo 4:5",
    story: "Prenesi zgodbo 9:16",
    lab: "Laboratorijski izvidi",
    send: "Pošlji",
    profile: "Profil",
    save: "Shrani v Dziaderski profil",
    respondent: "Preiskovana oseba",
    nameLabel: "Ime na certifikatu",
    namePlaceholder: "Ime za certifikat",
    saveName: "Shrani",
    cancel: "Prekliči",
    nameError: "Tega Inštitut ne bo vpisal na certifikat. Poskusi samo z imenom.",
    change: (name: string) => `${name} · spremeni`,
    addName: "Dopiši ime na certifikat",
  },
});

const noSubscription = () => () => {};

/** `diagnosis` is in the edition's language; links and share texts go to the reader's edition. */
export function ResultActions({
  code,
  score,
  diagnosis,
  name,
}: {
  code: string;
  score: number;
  diagnosis: string;
  name: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = COPY[locale];
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => site.url);
  const canShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === "function", () => false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(name);
  const [nameError, setNameError] = useState(false);
  const [storyAsset, setStoryAsset] = useState<{ code: string; locale: string; file: File } | null>(null);
  const storyFile = storyAsset?.code === code && storyAsset.locale === locale ? storyAsset.file : null;

  const url = `${origin}${localizePath(`/wynik/${code}`, locale)}`;
  const text = t.text(score, diagnosis);
  const image = (format: "post" | "relacja") => localizePath(`/wynik/${code}/certyfikat?format=${format}&pobierz`, locale);

  // On phones, fetch the story image up front: iOS only allows sharing a file
  // straight from the tap, with no network request in between.
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches || typeof navigator.canShare !== "function") return;
    let cancelled = false;
    fetch(localizePath(`/wynik/${code}/certyfikat?format=relacja`, locale))
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (!blob || cancelled) return;
        const file = new File([blob], `${COPY[locale].file}-${score}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) setStoryAsset({ code, locale, file });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [code, score, locale]);

  async function copy() {
    if (await copyResultLink(url, t.prompt)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  }

  async function share() {
    if (!canShare) return copy();
    await shareResult({ title: t.title(score, diagnosis), text, url });
  }

  async function shareImage() {
    if (!storyFile) return;
    await shareResult({ files: [storyFile], text: `${text} ${url}` });
  }

  function saveName(event: FormEvent) {
    event.preventDefault();
    const cleaned = cleanName(nameDraft);
    if (nameDraft.trim() && !cleaned) {
      setNameError(true);
      return;
    }
    const draft = decodeResult(code);
    if (!draft) return;
    setEditing(false);
    setNameError(false);
    router.replace(localizePath(`/wynik/${encodeResult({ ...draft, name: cleaned })}`, locale), { scroll: false });
  }

  return (
    <div>
      <div className="grid gap-2 min-[360px]:grid-cols-2">
        <button type="button" onClick={storyFile ? shareImage : share} className="btn min-h-12 whitespace-normal px-3 bg-ink text-paper hover:bg-red">
          {copied ? t.copied : t.sendCertificate}
        </button>
        <Link href={groupPath([code])} className="btn min-h-12 whitespace-normal px-3 border border-ink text-center hover:bg-ink hover:text-paper">
          {t.compare}
        </Link>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? t.announce : ""}
      </p>

      <details className="mt-4 border-y border-rule">
        <summary className="cursor-pointer py-3 font-sans text-base font-semibold hover:text-red">{t.options}</summary>
        <div className="pb-5 pt-3">
          <ResultSpecimenChoice code={code} />
          <dl className="mt-7 grid gap-x-8 gap-y-3 font-sans text-[0.95rem] sm:grid-cols-[auto_1fr]">
            <dt className="label pt-0.5 text-ink-soft">{t.downloads}</dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-1">
              <a href={image("post")} download onClick={() => {
                  resultShareIntent("post");
                  tally("certyfikat");
                }} className="link">
                {t.post}
              </a>
              <a href={image("relacja")} download onClick={() => {
                  resultShareIntent("relacja");
                  tally("certyfikat");
                }} className="link">
                {t.story}
              </a>
              <a
                href={localizePath(`/wynik/${code}/badania?pobierz`, locale)}
                download
                onClick={() => {
                  resultShareIntent("badania");
                  tally("certyfikat");
                }}
                className="link"
              >
                {t.lab}
              </a>
            </dd>
            <dt className="label pt-0.5 text-ink-soft">{t.send}</dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-1">
              <button type="button" onClick={copy} className="link">{copied ? t.copied : t.copy}</button>
              {storyFile && canShare && <button type="button" onClick={share} className="link">{t.share}</button>}
              {shareOutlets(url, text).map((outlet) => (
                <ShareOutlet key={outlet.label} {...outlet} onOpen={() => resultShareIntent(outlet.label)} className="link" />
              ))}
              <a
                href={`mailto:?subject=${encodeURIComponent(t.subject(score))}&body=${encodeURIComponent(`${text}\n\n${url}`)}`}
                onClick={() => resultShareIntent("email")}
                className="link"
              >
                {t.email}
              </a>
            </dd>
            <dt className="label pt-0.5 text-ink-soft">{t.profile}</dt>
            <dd>
              <a href={localizePath(`/profil/zapisz/${code}`, locale)} onClick={() => track("Profil", { akcja: "zapisz" })} className="link">
                {t.save}
              </a>
            </dd>
            <dt className="label pt-0.5 text-ink-soft">{t.respondent}</dt>
            <dd>
              {editing ? (
                <form onSubmit={saveName} className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <label htmlFor="imie" className="sr-only">
                    {t.nameLabel}
                  </label>
                  <input
                    id="imie"
                    autoFocus
                    value={nameDraft}
                    onChange={(event) => {
                      setNameDraft(event.target.value);
                      setNameError(false);
                    }}
                    maxLength={24}
                    autoComplete="given-name"
                    placeholder={t.namePlaceholder}
                    className="w-56 border-0 border-b-2 border-ink bg-transparent px-0 py-1 font-serif text-xl font-bold placeholder:font-normal placeholder:text-ink/30 focus:border-red focus-visible:outline-none"
                  />
                  <button type="submit" className="label py-1.5 font-semibold text-ink hover:text-red">
                    {t.saveName}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setNameError(false);
                      setNameDraft(name);
                    }}
                    className="label py-1.5 text-ink-soft hover:text-ink"
                  >
                    {t.cancel}
                  </button>
                  {nameError && (
                    <p className="w-full font-sans text-sm text-red" role="alert">
                      {t.nameError}
                    </p>
                  )}
                </form>
              ) : (
                <button type="button" onClick={() => setEditing(true)} className={cx("link text-left", !name && "text-red")}>
                  {name ? t.change(name) : t.addName}
                </button>
              )}
            </dd>
          </dl>
        </div>
      </details>
    </div>
  );
}
