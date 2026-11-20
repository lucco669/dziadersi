"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { track } from "@/lib/analytics";
import { ShareBar } from "./share-bar";

const COPY = defineCopy({
  pl: {
    preview: "Protokół jako obraz do posta",
    send: "Wyślij do relacji",
    post: "Pobierz post 4:5",
    story: "Pobierz relację 9:16",
    note: "Obrazy pokazują podpisy gości. Wysyłaj je tym, którzy przy tym stole siedzą.",
  },
  sl: {
    preview: "Zapisnik kot slika za objavo",
    send: "Pošlji v zgodbo",
    post: "Prenesi objavo 4:5",
    story: "Prenesi zgodbo 9:16",
    note: "Na slikah so oznake gostov. Pošlji jih tistim, ki sedijo za to mizo.",
  },
});

const noSubscription = () => () => {};

/** Phones and tablets with a share sheet that takes files. */
const canShareFiles = () =>
  window.matchMedia("(pointer: coarse)").matches && typeof navigator.share === "function" && typeof navigator.canShare === "function";

/**
 * Sharing a protocol: the link, and the post and story images to download. On phones the story
 * goes straight into the share sheet; iOS allows files only straight from a tap, so the image is
 * fetched when the block appears and shared on the tap.
 */
export function SeatingShare({ code, text }: { code: string; text: string }) {
  const locale = useLocale();
  const t = COPY[locale];
  const image = (format: "post" | "relacja", download = false) =>
    `${localizePath(`/plan-stolu/${code}/karta`, locale)}?format=${format}${download ? "&pobierz" : ""}`;
  const phone = useSyncExternalStore(noSubscription, canShareFiles, () => false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!phone) return;
    let live = true;
    fetch(image("relacja"))
      .then((response) => (response.ok ? response.blob() : null))
      .then((blob) => {
        if (!live || !blob) return;
        const ready = new File([blob], `plan-stolu-${code.split("~")[0]}.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [ready] })) setFile(ready);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
    // The image depends only on the code and the edition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, code, locale]);

  const send = async () => {
    if (!file) return;
    track("Udostępnienie", { kanal: "relacja", typ: "plan-stolu" });
    try {
      await navigator.share({ files: [file], text });
    } catch {
      // Closing the share sheet is not an error worth reporting.
    }
  };

  return (
    <div className="grid items-start gap-10 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- a generated PNG, never resized at runtime */}
      <img src={image("post")} alt={t.preview} width={1080} height={1350} loading="lazy" className="h-auto w-full max-w-72 border border-rule" />
      <div>
        <div className="flex flex-wrap gap-3">
          {file && (
            <button type="button" onClick={send} className="btn bg-red text-paper hover:bg-ink">
              {t.send}
            </button>
          )}
          <a href={image("post", true)} download onClick={() => track("Udostępnienie", { kanal: "post", typ: "plan-stolu" })} className="btn bg-ink text-paper hover:bg-red">
            {t.post}
          </a>
          <a href={image("relacja", true)} download onClick={() => track("Udostępnienie", { kanal: "pobranie-relacji", typ: "plan-stolu" })} className="btn border border-ink hover:bg-ink hover:text-paper">
            {t.story}
          </a>
        </div>
        <p className="label mt-4 max-w-md text-ink-faint">{t.note}</p>
        <div className="mt-8">
          <ShareBar path={`/plan-stolu/${code}`} text={text} kind="plan-stolu" />
        </div>
      </div>
    </div>
  );
}
