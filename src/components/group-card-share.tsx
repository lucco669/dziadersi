"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { track } from "@/lib/analytics";

const COPY = defineCopy({
  pl: {
    alt: "Karta rankingu: wszyscy, wyniki i rozpoznania na jednym obrazie",
    send: "Wyślij obraz",
    download: "Pobierz obraz",
    format: "Obraz 4:5, do wklejenia na czat.",
  },
  sl: {
    alt: "Kartica lestvice: vsi, rezultati in diagnoze na eni sliki",
    send: "Pošlji sliko",
    download: "Prenesi sliko",
    format: "Slika 4 : 5, za lepljenje v klepet.",
  },
});

const noSubscription = () => () => {};

/**
 * The ranking card with a send button where the phone's share sheet takes files, and a download.
 * The file is fetched on mount: iOS refuses a share that waits for the network after the tap.
 * (When the growth-surfaces StoryShare lands, this can become `<StoryShare image=… />`.)
 */
export function GroupCardShare({ path, file, text }: { path: string; file: string; text: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const src = localizePath(path, locale);
  const [ready, setReady] = useState<File | null>(null);
  const canShareFiles = useSyncExternalStore(
    noSubscription,
    () => typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], "x.png", { type: "image/png" })] }),
    () => false,
  );

  useEffect(() => {
    if (!canShareFiles) return;
    let live = true;
    fetch(src)
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (live && blob) setReady(new File([blob], `${file}.png`, { type: "image/png" }));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [canShareFiles, src, file]);

  async function send() {
    if (!ready) return;
    track("Udostępnienie", { kanal: "obraz", typ: "ranking" });
    try {
      await navigator.share({ files: [ready], text, url: window.location.href });
    } catch {
      // Closing the share sheet is not an error worth reporting.
    }
  }

  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element -- a generated PNG, cached for a year; next/image would resize it */}
      <img src={src} alt={t.alt} width={1080} height={1350} className="h-auto w-full max-w-sm border border-ink bg-card" />
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {canShareFiles && (
          <button type="button" onClick={send} disabled={!ready} className="btn bg-ink text-paper hover:bg-red disabled:opacity-50">
            {t.send}
          </button>
        )}
        <a
          href={`${src}?pobierz`}
          download={`${file}.png`}
          onClick={() => track("Udostępnienie", { kanal: "pobranie", typ: "ranking" })}
          className={canShareFiles ? "link font-sans" : "btn border border-ink hover:bg-ink hover:text-paper"}
        >
          {t.download}
        </a>
        <span className="label w-full text-ink-soft">{t.format}</span>
      </figcaption>
    </figure>
  );
}
