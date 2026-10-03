"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./client";
import { localizePath } from "./routes";

/**
 * next/link for the editions: takes an internal href ("/slownik/x") and links to it in the
 * edition being shown ("/sl/slovar/x" in Slovenian). External and already public hrefs pass through.
 */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  return <NextLink href={typeof href === "string" ? localizePath(href, locale) : href} {...props} />;
}
