import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { site } from "@/lib/site";

/**
 * AI crawlers, named so the policy is explicit rather than implied by "*":
 * assistants and AI search may read and quote the Institute.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
];

/**
 * Every sign-in link carries its way back (`/konto?dalej=…`), so each page that offers an account adds
 * another address of the same noindex form. The bare account pages stay open; their variants, the auth
 * handlers and the save-to-profile steps are not crawled. Both editions, in their public spelling.
 */
const PRIVATE_STEPS = LOCALES.flatMap((locale) => [
  ...["/konto", "/rejestracja"].map((path) => `${localizePath(path, locale)}?`),
  `${localizePath("/profil/zapisz", locale)}/`,
  localizePath("/profil/zachowaj", locale),
]).concat("/auth/");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_STEPS },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE_STEPS },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
