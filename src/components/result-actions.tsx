"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { site } from "@/lib/site";
import { tally } from "@/lib/tally";
import { cleanName, decodeResult, encodeResult } from "@/lib/test";
import { cx } from "@/lib/typo";
import { CreateFamilyGroup } from "./family-group";

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
    announce: "Link skopiowany do schowka.",
    certificate: "Certyfikat",
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
    announce: "Povezava je kopirana v odložišče.",
    certificate: "Certifikat",
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
  const [storyFile, setStoryFile] = useState<File | null>(null);

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
        if (navigator.canShare({ files: [file] })) setStoryFile(file);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [code, score, locale]);

  async function copy() {
    track("Udostępnienie", { kanal: "link" });
    tally("udostepnienie");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt(t.prompt, url);
    }
  }

  async function share() {
    if (!canShare) return copy();
    track("Udostępnienie", { kanal: "natywne" });
    tally("udostepnienie");
    try {
      await navigator.share({ title: t.title(score, diagnosis), text, url });
    } catch {
      // Closing the share sheet is not an error worth reporting.
    }
  }

  async function shareImage() {
    if (!storyFile) return;
    track("Udostępnienie", { kanal: "obraz" });
    tally("certyfikat");
    try {
      await navigator.share({ files: [storyFile], text: `${text} ${url}` });
    } catch {
      // Cancelled by the user.
    }
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

  const outlets = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { label: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    {
      label: t.email,
      href: `mailto:?subject=${encodeURIComponent(t.subject(score))}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    },
  ];

  return (
    <div className="mt-10 border-t border-ink pt-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={share} className="btn bg-ink text-paper hover:bg-red">
          {t.share} <span aria-hidden="true">→</span>
        </button>
        <button type="button" onClick={copy} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
          {copied ? t.copied : t.copy}
        </button>
        {storyFile && (
          <button type="button" onClick={shareImage} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
            {t.sendCertificate}
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? t.announce : ""}
      </p>

      <dl className="mt-7 grid gap-x-8 gap-y-3 font-sans text-[0.95rem] sm:grid-cols-[auto_1fr]">
        <dt className="label pt-0.5 text-ink-soft">{t.certificate}</dt>
        <dd className="flex flex-wrap gap-x-5 gap-y-1">
          <a href={image("post")} download onClick={() => {
              track("Udostępnienie", { kanal: "post" });
              tally("certyfikat");
            }} className="link">
            {t.post}
          </a>
          <a href={image("relacja")} download onClick={() => {
              track("Udostępnienie", { kanal: "relacja" });
              tally("certyfikat");
            }} className="link">
            {t.story}
          </a>
          <a
            href={localizePath(`/wynik/${code}/badania?pobierz`, locale)}
            download
            onClick={() => {
              track("Udostępnienie", { kanal: "badania" });
              tally("certyfikat");
            }}
            className="link"
          >
            {t.lab}
          </a>
        </dd>
        <dt className="label pt-0.5 text-ink-soft">{t.send}</dt>
        <dd className="flex flex-wrap gap-x-5 gap-y-1">
          {outlets.map((outlet) => (
            <a
              key={outlet.label}
              href={outlet.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("Udostępnienie", { kanal: outlet.label });
                tally("udostepnienie");
              }}
              className="link"
            >
              {outlet.label}
            </a>
          ))}
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
      <CreateFamilyGroup code={code} />
    </div>
  );
}
