"use client";

import { track } from "@vercel/analytics";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { site } from "@/lib/site";
import { cleanName, decodeResult, encodeResult } from "@/lib/test";
import { cx } from "@/lib/typo";

const noSubscription = () => () => {};

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
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => site.url);
  const canShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === "function", () => false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(name);
  const [nameError, setNameError] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);

  const url = `${origin}/wynik/${code}`;
  const text = `Mam ${score}% w Teście Dziadersa. Rozpoznanie: ${diagnosis}. A ty?`;
  const image = (format: "post" | "relacja") => `/wynik/${code}/certyfikat?format=${format}&pobierz`;

  // On phones, fetch the story image up front: iOS only allows sharing a file
  // straight from the tap, with no network request in between.
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches || typeof navigator.canShare !== "function") return;
    let cancelled = false;
    fetch(`/wynik/${code}/certyfikat?format=relacja`)
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (!blob || cancelled) return;
        const file = new File([blob], `certyfikat-dziadersa-${score}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) setStoryFile(file);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [code, score]);

  async function copy() {
    track("Udostępnienie", { kanal: "link" });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Skopiuj link do wyniku:", url);
    }
  }

  async function share() {
    if (!canShare) return copy();
    track("Udostępnienie", { kanal: "natywne" });
    try {
      await navigator.share({ title: `${score}% · ${diagnosis}`, text, url });
    } catch {
      // Closing the share sheet is not an error worth reporting.
    }
  }

  async function shareImage() {
    if (!storyFile) return;
    track("Udostępnienie", { kanal: "obraz" });
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
    router.replace(`/wynik/${encodeResult({ ...draft, name: cleaned })}`, { scroll: false });
  }

  const outlets = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { label: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    {
      label: "E-mail",
      href: `mailto:?subject=${encodeURIComponent(`Certyfikat Dziaderstwa: ${score}%`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
    },
  ];

  return (
    <div className="mt-10 border-t border-ink pt-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={share} className="btn bg-ink text-paper hover:bg-red">
          Udostępnij wynik <span aria-hidden="true">→</span>
        </button>
        <button type="button" onClick={copy} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
          {copied ? "Skopiowano link ✓" : "Kopiuj link"}
        </button>
        {storyFile && (
          <button type="button" onClick={shareImage} className="btn border border-ink text-ink hover:bg-ink hover:text-paper">
            Wyślij certyfikat
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? "Link skopiowany do schowka." : ""}
      </p>

      <dl className="mt-7 grid gap-x-8 gap-y-3 font-sans text-[0.95rem] sm:grid-cols-[auto_1fr]">
        <dt className="label pt-0.5 text-ink-soft">Certyfikat</dt>
        <dd className="flex flex-wrap gap-x-5 gap-y-1">
          <a href={image("post")} download onClick={() => track("Udostępnienie", { kanal: "post" })} className="link">
            Pobierz post 4:5
          </a>
          <a href={image("relacja")} download onClick={() => track("Udostępnienie", { kanal: "relacja" })} className="link">
            Pobierz relację 9:16
          </a>
          <a
            href={`/wynik/${code}/badania?pobierz`}
            download
            onClick={() => track("Udostępnienie", { kanal: "badania" })}
            className="link"
          >
            Wyniki badań
          </a>
        </dd>
        <dt className="label pt-0.5 text-ink-soft">Wyślij</dt>
        <dd className="flex flex-wrap gap-x-5 gap-y-1">
          {outlets.map((outlet) => (
            <a
              key={outlet.label}
              href={outlet.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("Udostępnienie", { kanal: outlet.label })}
              className="link"
            >
              {outlet.label}
            </a>
          ))}
        </dd>
        <dt className="label pt-0.5 text-ink-soft">Profil</dt>
        <dd>
          <a href={`/profil/zapisz/${code}`} onClick={() => track("Profil", { akcja: "zapisz" })} className="link">
            Zapisz w Profilu Dziaderskim
          </a>
        </dd>
        <dt className="label pt-0.5 text-ink-soft">Osoba badana</dt>
        <dd>
          {editing ? (
            <form onSubmit={saveName} className="flex flex-wrap items-end gap-x-4 gap-y-2">
              <label htmlFor="imie" className="sr-only">
                Imię na certyfikacie
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
                placeholder="Imię na certyfikat"
                className="w-56 border-0 border-b-2 border-ink bg-transparent px-0 py-1 font-serif text-xl font-bold placeholder:font-normal placeholder:text-ink/30 focus:border-red focus-visible:outline-none"
              />
              <button type="submit" className="label py-1.5 font-semibold text-ink hover:text-red">
                Zapisz
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
                Anuluj
              </button>
              {nameError && (
                <p className="w-full font-sans text-sm text-red" role="alert">
                  Tego Instytut nie wpisze na certyfikat. Spróbuj samego imienia.
                </p>
              )}
            </form>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className={cx("link text-left", !name && "text-red")}>
              {name ? `${name} · zmień` : "Dopisz imię do certyfikatu"}
            </button>
          )}
        </dd>
      </dl>
    </div>
  );
}
