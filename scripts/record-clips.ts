/**
 * Records the site's own animations as vertical clips for Reels, Stories and TikTok.
 *
 *   pnpm build && pnpm start              (or pnpm dev) in another terminal, then:
 *   pnpm record-clips                     all clips, both editions, from http://localhost:3000
 *   pnpm record-clips komisja kalendarz   some clips
 *   pnpm record-clips --lang sl --url http://localhost:3200 --out DIR
 *
 * Clips (6–10 s each, 1080 × 1920, 30 fps):
 *   komisja    the Komisja's bench, the chair bringing the gavel down
 *   kalendarz  yesterday's page torn off the tear-off calendar
 *   klakson    the horn test from the Test Dziadersa: red, amber, green, honk
 *   szwagier   SZWAGIER 1.9 TDI reading a question at arm's length and answering
 *
 * A phone-sized browser (400 × 711 CSS px at 2.7×) opens each page with Playwright, adds a thin
 * Institute strip on top and the address below, and records the screen through the DevTools
 * screencast at full resolution; ffmpeg turns the frames into an H.264 MP4 at 30 fps. Without
 * ffmpeg the JPEG frames are kept. Playwright uses its own Chromium if installed
 * (npx playwright install chromium), otherwise Chrome or Edge.
 * Output goes to out/clips/ (ignored by git).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright-core";
import { TASKS } from "../src/content/test";
import { LOCALES, type Locale } from "../src/i18n/config";
import { localizePath } from "../src/i18n/routes";

const VIEWPORT = { width: 400, height: 711 };
const SCALE = 2.7;
const SIZE = { width: 1080, height: 1920 };

type Clip = {
  path: string;
  seconds: number;
  title: Record<Locale, string>;
  /** Called once the page has loaded: set the scene, then start the motion. */
  act: (page: Page, locale: Locale) => Promise<void>;
  /** Runs before any page script, e.g. to put a saved test in sessionStorage. */
  init?: () => void | string;
};

function option(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

/** Brings an element to the middle of the screen, under the strip. */
async function centre(page: Page, selector: string, block: "center" | "start" = "center") {
  await page.locator(selector).first().evaluate((element, where) => element.scrollIntoView({ block: where, behavior: "instant" }), block);
  if (block === "start") await page.evaluate(() => window.scrollBy(0, -64));
}

/** A saved test that stops at the horn test, so the clip starts there. */
function hornProgress() {
  const current = TASKS.findIndex((task) => task.kind === "reflex");
  return JSON.stringify({
    answers: TASKS.map((_, i) => (i < current ? 0 : null)),
    current,
    name: "",
    proxy: false,
    seed: 4242,
    group: "",
    region: "",
    untimed: false,
  });
}

const CLIPS: Record<string, Clip> = {
  komisja: {
    path: "/czy-to-juz-dziaderstwo",
    seconds: 8,
    title: { pl: "Komisja Orzekająca", sl: "Razsodna komisija" },
    async act(page) {
      await centre(page, "svg.pg-animated");
    },
  },
  kalendarz: {
    path: "/kalendarz",
    seconds: 7,
    title: { pl: "Kartka z kalendarza", sl: "Trgalni koledar" },
    async act(page) {
      await centre(page, '[class*="max-w-[26rem]"]', "start");
      await page.waitForTimeout(2200);
      await page.locator('[class*="max-w-[26rem]"] button').first().click();
    },
  },
  klakson: {
    path: "/test",
    seconds: 9,
    title: { pl: "Test Dziadersa · próba klaksonu", sl: "Test dziadersa · preizkus hupe" },
    init: hornProgress,
    async act(page) {
      await page.getByRole("button", { name: /Wznów od zadania|Nadaljuj pri nalogi/ }).click();
      await centre(page, "figure svg", "start");
      await page.waitForTimeout(1200);
      await page.getByRole("button", { name: /Rozpocznij próbę|Začni preizkus/ }).click();
      await page.waitForSelector('circle[fill="#4e8b5f"]', { timeout: 15_000 });
      await page.waitForTimeout(450);
      await page.getByRole("button", { name: /^(Trąb|Hupaj)/ }).click();
    },
  },
  szwagier: {
    path: "/superinteligencja",
    seconds: 10,
    title: { pl: "SZWAGIER 1.9 TDI", sl: "SZWAGIER 1.9 TDI" },
    async act(page, locale) {
      // Phones get SZWAGIER small beside the conversation; the clip draws him at a readable size.
      await page.addStyleTag({ content: "svg.h-24 { height: 12rem !important; width: auto !important; }" });
      await centre(page, "textarea", "center");
      await page.evaluate(() => window.scrollBy(0, 160));
      await page.waitForTimeout(900);
      await page.locator("textarea").first().pressSequentially(locale === "sl" ? "Ali se splača kupiti dizel?" : "Czy warto kupić diesla?", { delay: 55 });
      await page.keyboard.press("Enter");
      // The console moves up to the conversation: keep SZWAGIER and his phone in the shot.
      await page.waitForTimeout(300);
      await centre(page, "svg.h-24", "start");
    },
  },
};

/**
 * The Institute's strip on top and the address at the bottom, in the page's own fonts.
 * Plain JavaScript in a string: tsx would wrap named functions in a helper the page doesn't have.
 */
const FRAME = `(title, address) => {
  for (const [text, edge] of [["DZIADER.SI · " + title, "top"], [address, "bottom"]]) {
    const element = document.createElement("div");
    element.textContent = text;
    Object.assign(element.style, {
      position: "fixed", left: "0", right: "0", [edge]: "0", zIndex: "2147483647",
      padding: edge === "top" ? "12px 18px 10px" : "12px 18px 16px",
      background: edge === "top" ? "var(--color-ink)" : "var(--color-paper)",
      color: edge === "top" ? "var(--color-paper)" : "var(--color-red)",
      borderTop: edge === "bottom" ? "2px solid var(--color-ink)" : "0",
      font: "600 15px/1.2 var(--font-schibsted), sans-serif",
      letterSpacing: "0.02em",
    });
    document.body.append(element);
  }
  // No language slip or dev badge in the shot.
  document.querySelectorAll("nextjs-portal, aside[lang]").forEach((element) => element.remove());
}`;

async function frame(page: Page, title: string, address: string) {
  await page.evaluate(`(${FRAME})(${JSON.stringify(title)}, ${JSON.stringify(address)})`);
}

async function launch(): Promise<Browser> {
  for (const channel of [undefined, "chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel });
    } catch {
      // Try the next browser.
    }
  }
  throw new Error("No Chromium found. Run `npx playwright install chromium`, or install Chrome or Edge.");
}

function hasFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

type Frame = { data: Buffer; time: number };

async function record(browser: Browser, base: string, name: string, clip: Clip, locale: Locale, out: string, ffmpeg: boolean) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    isMobile: true,
    hasTouch: true,
    locale: locale === "sl" ? "sl-SI" : "pl-PL",
    reducedMotion: "no-preference",
  });
  // The edition is chosen, so no language slip; a saved test, if the clip needs one.
  await context.addCookies([{ name: "jezyk", value: locale, url: base }]);
  // A recording is not a visit: no tallies, votes or results reach the Rocznik or the Spis.
  await context.route("**/api/**", (route) => route.abort());
  await context.addInitScript(() => {
    navigator.sendBeacon = () => true;
  });
  if (clip.init) await context.addInitScript(([key, value]) => sessionStorage.setItem(key, value), ["ibd-t2", String(clip.init())]);

  const page = await context.newPage();
  const path = localizePath(clip.path, locale);
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await frame(page, clip.title[locale], `dziader.si${path}`);

  // Device-pixel frames as the compositor paints them, each with its timestamp.
  const frames: Frame[] = [];
  const session = await context.newCDPSession(page);
  session.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    frames.push({ data: Buffer.from(data, "base64"), time: metadata.timestamp ?? Date.now() / 1000 });
    void session.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await session.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: SIZE.width, maxHeight: SIZE.height });
  const started = Date.now();
  await clip.act(page, locale);
  await page.waitForTimeout(Math.max(0, clip.seconds * 1000 - (Date.now() - started)));
  await session.send("Page.stopScreencast");
  await context.close();
  if (frames.length === 0) throw new Error(`${name}: the screencast sent no frames`);

  // Each frame lasts until the next one; the last fills the clip to its length.
  const dir = join(out, ".frames", `${name}-${locale}`);
  mkdirSync(dir, { recursive: true });
  const first = frames[0].time;
  const list = frames.map((item, i) => {
    const file = `${String(i).padStart(5, "0")}.jpg`;
    writeFileSync(join(dir, file), item.data);
    const until = i + 1 < frames.length ? frames[i + 1].time : first + clip.seconds;
    return `file '${file}'\nduration ${Math.max(0.001, until - item.time).toFixed(4)}`;
  });
  // The concat demuxer needs the last file twice for its duration to count.
  list.push(`file '${String(frames.length - 1).padStart(5, "0")}.jpg'`);
  writeFileSync(join(dir, "frames.txt"), `${list.join("\n")}\n`);

  const file = join(out, `${name}-${locale}`);
  if (!ffmpeg) return `${dir} (${frames.length} frames; install ffmpeg for an MP4)`;
  execFileSync(
    "ffmpeg",
    [
      "-y", "-loglevel", "error",
      "-f", "concat", "-safe", "0", "-i", join(dir, "frames.txt"),
      "-vf", `fps=30,scale=${SIZE.width}:${SIZE.height}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${SIZE.width}:${SIZE.height}:(ow-iw)/2:(oh-ih)/2:color=0xf4f0e7`,
      "-t", String(clip.seconds),
      "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
      `${file}.mp4`,
    ],
    { stdio: "inherit" },
  );
  rmSync(dir, { recursive: true, force: true });
  return `${file}.mp4`;
}

async function main() {
  const base = (option("url") ?? "http://localhost:3000").replace(/\/$/, "");
  const out = resolve(option("out") ?? join("out", "clips"));
  const locales = (option("lang")?.split(",") ?? [...LOCALES]).filter((value): value is Locale => (LOCALES as readonly string[]).includes(value));
  const named = process.argv.slice(2).filter((arg, i, all) => !arg.startsWith("--") && !all[i - 1]?.startsWith("--"));
  const names = named.length ? named : Object.keys(CLIPS);
  const unknown = names.filter((name) => !CLIPS[name]);
  if (unknown.length) throw new Error(`Unknown clip: ${unknown.join(", ")}. Clips: ${Object.keys(CLIPS).join(", ")}`);

  try {
    await fetch(base, { method: "HEAD" });
  } catch {
    throw new Error(`Nothing answers at ${base}. Start the site first (pnpm build && pnpm start, or pnpm dev), or pass --url.`);
  }
  const ffmpeg = hasFfmpeg();
  if (!ffmpeg) console.warn("ffmpeg not found: keeping the JPEG frames. Install ffmpeg for MP4s.");
  mkdirSync(out, { recursive: true });

  const browser = await launch();
  try {
    for (const name of names) {
      for (const locale of locales) {
        console.log(`  ${await record(browser, base, name, CLIPS[name], locale, out, ffmpeg)}`);
      }
    }
  } finally {
    await browser.close();
    if (ffmpeg) rmSync(join(out, ".frames"), { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
