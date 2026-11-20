/*
 * Sharing an image as a file from the browser. Phones put a shared PNG straight into an Instagram
 * story, a Messenger chat or TikTok; a link would only show the preview.
 *
 * iOS allows navigator.share({ files }) only straight from a tap, with no network request or slow
 * work in between, so the file has to be ready before the tap: load it when the result appears
 * (`loadShareFile`), then share it on the tap (`shareFile`).
 */

/** A post (4:5, 1080 × 1350) or a story (9:16, 1080 × 1920). */
export type StoryFormat = "post" | "story";

/** The query value of image routes and the file suffix: `?format=relacja` is the story. Both editions use the Polish words. */
export const STORY_QUERY: Record<StoryFormat, string> = { post: "post", story: "relacja" };

/** Phones and tablets: a coarse pointer and a share sheet that takes files. */
export function canShareFiles(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function"
  );
}

/** A PNG `File` from an image route (internal or absolute URL) or from a Blob made in the page. */
export async function loadShareFile(source: string | (() => Promise<Blob>), name: string): Promise<File | null> {
  try {
    const blob =
      typeof source === "string"
        ? await fetch(source).then((response) => (response.ok ? response.blob() : null))
        : await source();
    if (!blob) return null;
    const file = new File([blob], name.endsWith(".png") ? name : `${name}.png`, { type: "image/png" });
    return navigator.canShare?.({ files: [file] }) ? file : null;
  } catch {
    return null;
  }
}

/** Opens the share sheet with the file and a line of text. False when the reader closed it or it failed. */
export async function shareFile(file: File, { text, url }: { text?: string; url?: string } = {}): Promise<boolean> {
  try {
    await navigator.share({ files: [file], text: [text, url].filter(Boolean).join(" ") || undefined });
    return true;
  } catch {
    return false;
  }
}

/** Saves a Blob made in the page under `name`. */
export function downloadBlob(blob: Blob, name: string) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = name.endsWith(".png") ? name : `${name}.png`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 60_000);
}
