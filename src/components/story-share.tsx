"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { track } from "@/lib/analytics";
import { canShareFiles, downloadBlob, loadShareFile, shareFile, STORY_QUERY, type StoryFormat } from "@/lib/share-file";
import { tally } from "@/lib/tally";
import { cx } from "@/lib/typo";

const COPY = defineCopy({
  pl: {
    image: "Obraz",
    send: "Wyślij do relacji",
    post: "Post 4:5",
    story: "Relacja 9:16",
    download: "Pobierz",
    working: "Przygotowanie…",
    failed: "Nie udało się przygotować obrazu.",
  },
  sl: {
    image: "Slika",
    send: "Pošlji v zgodbo",
    post: "Objava 4:5",
    story: "Zgodba 9:16",
    download: "Prenesi",
    working: "Pripravljam …",
    failed: "Slike ni bilo mogoče pripraviti.",
  },
});

const FORMATS: StoryFormat[] = ["post", "story"];

export type StoryShareProps = {
  /**
   * The internal path of an image route that serves `?format=post|relacja` (and `?pobierz`), such as
   * "/generator/samochod-3b7/karta". Build the route with `storyResponse()` from `@/lib/story-cards`.
   */
  image?: string;
  /** Or a picture drawn in the page: return a 1080 × 1350 (post) or 1080 × 1920 (story) PNG. */
  create?: (format: StoryFormat) => Promise<Blob>;
  /** The file name without the format and extension: "rozmowki-samochod-3b7". */
  file: string;
  /** Sent with the image on phones, in the reader's edition. */
  text: string;
  /** The absolute address sent with the text. */
  url?: string;
  /** Analytics: what is shared ("rozmowki", "sprawa", …). */
  kind: string;
  /** "paper" on the ink bands. */
  tone?: "ink" | "paper";
  className?: string;
};

/**
 * Story-size images of a result: on phones a button that puts the 9:16 picture in the share sheet
 * (Instagram, Messenger, TikTok), everywhere the post and the story to download.
 *
 * Seasonal toys use it as is: give `image` for a server image route, or `create` for a canvas.
 */
export function StoryShare({ image, create, file, text, url, kind, tone = "ink", className }: StoryShareProps) {
  const locale = useLocale();
  const t = COPY[locale];
  const [ready, setReady] = useState<{ key: string; file: File } | null>(null);
  const [busy, setBusy] = useState<StoryFormat | null>(null);
  const [failed, setFailed] = useState(false);
  const key = `${image ?? ""}|${file}|${locale}`;
  const storyFile = ready?.key === key ? ready.file : null;

  const href = (format: StoryFormat, download = false) =>
    image ? `${localizePath(image, locale)}?format=${STORY_QUERY[format]}${download ? "&pobierz" : ""}` : "";
  const name = (format: StoryFormat) => `${file}-${STORY_QUERY[format]}.png`;

  // The story is ready before the tap: iOS refuses to share a file after a request.
  useEffect(() => {
    if (!canShareFiles()) return;
    let cancelled = false;
    const source = image ? href("story") : create ? () => create("story") : null;
    if (!source) return;
    void loadShareFile(source, name("story")).then((loaded) => {
      if (loaded && !cancelled) setReady({ key, file: loaded });
    });
    return () => {
      cancelled = true;
    };
    // `create` is a new function on every render of the caller; the key says when the picture changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const counted = (channel: string) => {
    track("Udostępnienie", { kanal: channel, typ: kind });
    tally("udostepnienie");
  };

  async function send() {
    if (!storyFile) return;
    counted("obraz");
    await shareFile(storyFile, { text, url });
  }

  async function save(format: StoryFormat) {
    if (!create || busy) return;
    setBusy(format);
    setFailed(false);
    counted(format === "story" ? "relacja" : "post");
    try {
      downloadBlob(await create(format), name(format));
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  }

  const color = tone === "paper" ? "text-paper" : "text-ink";
  const link = `link inline-flex min-h-6 items-center py-1.5 ${color}`;
  return (
    <div className={cx("label flex flex-wrap items-center gap-x-5 gap-y-1", className)}>
      <span className={tone === "paper" ? "text-paper/60" : "text-ink-soft"}>{t.image}</span>
      {storyFile && (
        <button type="button" onClick={send} className={link}>
          {t.send}
        </button>
      )}
      {FORMATS.map((format) =>
        image ? (
          <a
            key={format}
            href={href(format, true)}
            download={name(format)}
            onClick={() => counted(format === "story" ? "relacja" : "post")}
            className={link}
          >
            <span className="sr-only">{t.download}: </span>
            {format === "post" ? t.post : t.story}
          </a>
        ) : (
          <button
            key={format}
            type="button"
            disabled={busy !== null}
            onClick={() => save(format)}
            className={cx(link, "disabled:opacity-60")}
          >
            <span className="sr-only">{t.download}: </span>
            {busy === format ? t.working : format === "post" ? t.post : t.story}
          </button>
        ),
      )}
      {failed && (
        <span role="alert" className="text-red">
          {t.failed}
        </span>
      )}
    </div>
  );
}
