"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ComponentProps } from "react";
import { useLocale } from "@/i18n/client";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import type { AccountState } from "@/lib/profile";

/*
 * The visitor's account, for personalising pages that are otherwise static.
 * Signed-out visitors cost nothing: without a Supabase session cookie nothing is fetched.
 * Signed-in visitors get one small request to /api/konto, kept for a minute in sessionStorage.
 */

export type AccountStatus = { status: "loading" } | { status: "guest" } | { status: "member"; account: AccountState };

const LOADING: AccountStatus = { status: "loading" };
const GUEST: AccountStatus = { status: "guest" };
/** Bump when AccountState changes shape, so old cached copies are ignored. */
const CACHE_KEY = "ibd-konto-2";
const CACHE_MS = 60_000;

let state: AccountStatus = LOADING;
let loadedWithSession: boolean | null = null;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function set(next: AccountStatus) {
  state = next;
  listeners.forEach((listener) => listener());
}

/** @supabase/ssr keeps the session in a readable cookie, sometimes split into chunks (.0, .1). */
const hasSession = () => /(?:^|;\s*)sb-[^=;]+-auth-token(?:\.\d+)?=/.test(document.cookie);

function cached(): AccountState | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    const entry = raw ? (JSON.parse(raw) as { at: number; account: AccountState }) : null;
    return entry && Date.now() - entry.at < CACHE_MS ? entry.account : null;
  } catch {
    return null;
  }
}

function remember(account: AccountState | null) {
  try {
    if (account) sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), account }));
    else sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage blocked: the account is fetched on every page load instead.
  }
}

function load(force = false): Promise<void> {
  const session = hasSession();
  loadedWithSession = session;
  if (!session) {
    remember(null);
    set(GUEST);
    return Promise.resolve();
  }
  const hit = force ? null : cached();
  if (hit) {
    set({ status: "member", account: hit });
    return Promise.resolve();
  }
  inflight ??= fetch("/api/konto", { cache: "no-store", credentials: "same-origin" })
    .then((response) => (response.ok ? (response.json() as Promise<{ user: AccountState | null }>) : { user: null }))
    .then(({ user }) => {
      remember(user);
      set(user ? { status: "member", account: user } : GUEST);
    })
    .catch(() => set(GUEST))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (loadedWithSession === null) void load();
  return () => {
    listeners.delete(listener);
  };
}

export function useAccount(): AccountStatus {
  return useSyncExternalStore(subscribe, () => state, () => LOADING);
}

/** Fetch the account again, after something was saved. */
export const refreshAccount = () => load(true);

/** Update the account in place, before the server confirms. */
export function patchAccount(update: (account: AccountState) => AccountState) {
  if (state.status !== "member") return;
  const account = update(state.account);
  remember(account);
  set({ status: "member", account });
}

/**
 * Signing in or out happens on a server and comes back as a client-side navigation, so the
 * cookie is checked again on every route change. Mounted once, in the header.
 */
export function AccountSync() {
  const pathname = usePathname();
  useEffect(() => {
    if (loadedWithSession !== null && hasSession() !== loadedWithSession) void load(true);
  }, [pathname]);
  return null;
}

/**
 * "Zaloguj się, a …": a sign-in link that returns to `next`. Both are internal paths: Link localises
 * the account page, and the account page localises `dalej` into the edition it is shown in.
 * The profile is where the account page goes anyway, so that link stays the bare, crawlable `/konto`.
 */
export const signInHref = (next: string) => (next === "/profil" ? "/konto" : `/konto?dalej=${encodeURIComponent(next)}`);

/**
 * A sign-in link that returns to `next` (an internal path). The page links the bare account page, which is
 * crawlable and noindex; the way back is added on click. Every page offering an account would otherwise
 * publish its own `/konto?dalej=…` address: hundreds of noindex variants for search engines to discover.
 * A click with a modifier (new tab) opens the bare account page, which returns to the profile.
 */
export function SignInLink({ next, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { next: string }) {
  const router = useRouter();
  const locale = useLocale();
  return (
    <Link
      href="/konto"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        router.push(localizePath(signInHref(next), locale));
      }}
      {...props}
    />
  );
}
