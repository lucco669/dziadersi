import type { StoryFormat } from "./share-file";

/*
 * Canvas pictures for the toys that draw their result in the page (Król grilla, Kolejka, seasonal
 * toys): a 1080 × 1350 post is the document itself; the 1080 × 1920 story sets it on ink with the
 * Institute's name above and the question and address below, like the certificate's story.
 */

const INK = "#161513";
const PAPER = "#f4f0e7";
const RED = "#c4362c";

/** A 1080 × 1350 canvas to draw the post on. */
export function postCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  return { canvas, ctx };
}

export const canvasBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed"))), "image/png"));

/**
 * The finished post as a PNG, or the story built around it. `ask` ("A ty? Zagraj na") and `url`
 * ("dziader.si/krol-grilla") sit under the document; fonts are the page's computed families.
 */
export async function storyBlob(
  post: HTMLCanvasElement,
  format: StoryFormat,
  { ask, url, serif, sans }: { ask: string; url: string; serif: string; sans: string },
): Promise<Blob> {
  if (format === "post") return canvasBlob(post);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, 1080, 1920);
  // Instagram covers about 250 px at the top and 300 px at the bottom of a story.
  ctx.fillStyle = PAPER;
  ctx.font = `700 46px ${serif}`;
  ctx.fillText("DZIADER", 80, 190);
  const width = ctx.measureText("DZIADER").width;
  ctx.fillStyle = RED;
  ctx.fillText(".", 80 + width, 190);
  ctx.fillStyle = PAPER;
  ctx.fillText("SI", 80 + width + ctx.measureText(".").width, 190);
  ctx.drawImage(post, 54, 240, 972, 1215);
  ctx.font = `400 46px ${serif}`;
  ctx.fillText(ask, 80, 1540);
  ctx.font = `600 32px ${sans}`;
  ctx.fillText(url, 80, 1596);
  return canvasBlob(canvas);
}
