#!/usr/bin/env node
/**
 * Tells IndexNow (Bing, Yandex, Seznam, Naver and the others that share submissions) which pages to
 * crawl again. Plain Node, no dependencies, so it also runs inside the production container.
 *
 *   node scripts/indexnow.mjs                    every page in the live sitemap (both editions)
 *   node scripts/indexnow.mjs /atlas /sl/atlas   only these pages (paths or full URLs)
 *   --sitemap <url>                              read the sitemap from elsewhere, e.g. http://localhost:3000/sitemap.xml
 *   --dry-run                                    list what would be sent, send nothing
 *
 * The key is the one file public/<32 hex>.txt, whose content is its own name. Search engines fetch it
 * from the live site to check that the submission comes from the site's owner, so it must be deployed
 * before the first submission. Send pages that changed or are new: engines throttle sites that resend
 * everything often.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT = "https://api.indexnow.org/indexnow";
/** The protocol's limit per request. */
const BATCH = 10_000;

const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dziader.si").replace(/\/$/, "");
const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

function readKey() {
  const files = readdirSync(publicDir).filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
  if (files.length !== 1) throw new Error(`Expected one IndexNow key file in public/, found ${files.length}.`);
  const key = files[0].slice(0, -4);
  if (readFileSync(join(publicDir, files[0]), "utf8").trim() !== key) throw new Error(`public/${files[0]} must contain its own name.`);
  return key;
}

function parseArgs(argv) {
  const options = { dryRun: false, sitemap: `${site}/sitemap.xml`, pages: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--sitemap") options.sitemap = argv[++i];
    else if (arg.startsWith("--")) throw new Error(`Unknown option ${arg}`);
    else options.pages.push(arg);
  }
  return options;
}

async function sitemapUrls(location) {
  const response = await fetch(location, { headers: { "user-agent": "dziadersi-indexnow" } });
  if (!response.ok) throw new Error(`${location}: ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
}

const toUrl = (page) => (/^https?:\/\//.test(page) ? page : `${site}${page.startsWith("/") ? "" : "/"}${page}`);

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const key = readKey();
  const host = new URL(site).host;
  const keyLocation = `${site}/${key}.txt`;

  const requested = options.pages.length ? options.pages.map(toUrl) : await sitemapUrls(options.sitemap);
  const urls = [...new Set(requested)];
  const foreign = urls.filter((url) => new URL(url).host !== host);
  if (foreign.length) throw new Error(`Not on ${host}: ${foreign.join(", ")}`);
  if (!urls.length) throw new Error("No pages to submit.");

  if (options.dryRun) {
    console.log(urls.join("\n"));
    console.log(`\n${urls.length} pages for ${host}, key ${keyLocation}. Dry run: nothing sent.`);
    return;
  }

  // An engine that can't read the key answers 403 and drops the batch, so check the live file first.
  const live = await fetch(keyLocation, { headers: { "user-agent": "dziadersi-indexnow" } });
  if (!live.ok || (await live.text()).trim() !== key) {
    throw new Error(`${keyLocation} does not serve the key (${live.status}). Deploy public/${key}.txt first.`);
  }

  for (let start = 0; start < urls.length; start += BATCH) {
    const urlList = urls.slice(start, start + BATCH);
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key, keyLocation, urlList }),
    });
    // 200: received. 202: received, key not verified yet (normal on the first submission).
    const body = await response.text();
    console.log(`IndexNow ${response.status} for ${urlList.length} pages${body ? `: ${body.slice(0, 500)}` : ""}`);
    if (response.status !== 200 && response.status !== 202) process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
