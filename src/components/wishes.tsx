"use client";

import { useState, useSyncExternalStore } from "react";
import { getWishChapters, getWishOccasions } from "@/content/wishes";
import { useLocale } from "@/i18n/client";
import { defineCopy } from "@/i18n/copy";
import { localizePath } from "@/i18n/routes";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";
import { tally } from "@/lib/tally";
import { cx, formatNumber, typo } from "@/lib/typo";
import { chapterNumber, LETTER, wish as compose, wishLists, wishMessage, type WishPicks } from "@/lib/wishes";
import { Mark, Seal } from "./brand";
import { useKeys } from "./hooks";
import { SpeciesPlate } from "./pictograms";
import { useReels } from "./reels";

const COPY = defineCopy({
  pl: {
    recipients: "Adresat",
    parts: ["Wstęp", "Życzenie", "Zakończenie"],
    hold: "Zostaw",
    held: "Zostaje",
    holdLabel: (part: string) => `Zostaw zdanie: ${part.toLowerCase()}`,
    holdNote: "Zostawione zdanie nie zmienia się przy losowaniu. Każde pasuje do każdego.",
    roll: "Losuj życzenia",
    keys: "Spacja losuje · 1–3 zostawiają zdanie",
    send: "Wyślij",
    whatsapp: "Wyślij na WhatsAppie",
    messenger: "Wyślij na Messengerze",
    messengerCopied: "Link skopiowany. Wklej go w rozmowie na Messengerze.",
    picture: "Obrazek",
    sharePicture: "Wyślij jako obrazek",
    post: "Pobierz obrazek 4:5",
    story: "Pobierz relację 9:16",
    copyText: "Kopiuj tekst",
    textCopied: "Życzenia skopiowane. Można wkleić na grupę rodzinną.",
    textPrompt: "Skopiuj życzenia:",
    copyLink: "Kopiuj link",
    linkCopied: "Link do życzeń skopiowany.",
    linkPrompt: "Skopiuj link do życzeń:",
    preparing: "Przygotowuję obrazek…",
    file: "zyczenia-od-instytutu",
    total: (number: number, total: number) => `Wariant nr ${formatNumber("pl", number)} z ${formatNumber("pl", total)}`,
  },
  sl: {
    recipients: "Naslovnik",
    parts: ["Uvod", "Voščilo", "Zaključek"],
    hold: "Zadrži",
    held: "Ostane",
    holdLabel: (part: string) => `Zadrži stavek: ${part.toLowerCase()}`,
    holdNote: "Zadržani stavek se pri žrebanju ne spremeni. Vsak se poda k vsakemu.",
    roll: "Izžrebaj voščilo",
    keys: "Preslednica žreba · 1–3 zadržijo stavek",
    send: "Pošlji",
    whatsapp: "Pošlji na WhatsApp",
    messenger: "Pošlji na Messenger",
    messengerCopied: "Povezava je kopirana. Prilepi jo v pogovor na Messengerju.",
    picture: "Slika",
    sharePicture: "Pošlji kot sliko",
    post: "Prenesi sliko 4 : 5",
    story: "Prenesi zgodbo 9 : 16",
    copyText: "Kopiraj besedilo",
    textCopied: "Voščilo je kopirano. Lahko ga prilepiš v družinsko skupino.",
    textPrompt: "Kopiraj voščilo:",
    copyLink: "Kopiraj povezavo",
    linkCopied: "Povezava do voščila je kopirana.",
    linkPrompt: "Kopiraj povezavo do voščila:",
    preparing: "Pripravljam sliko …",
    file: "voscilo-instituta",
    total: (number: number, total: number) => `Različica št. ${formatNumber("sl", number)} od ${formatNumber("sl", total)}`,
  },
});

const noSubscription = () => () => {};
const isPhone = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/**
 * The Institute's greetings machine: pick the addressee, spin the three sentences, hold the ones
 * worth keeping, send the letter. The same reels as the Rozmówki.
 */
export function WishMachine({ initial }: { initial: { slug: string; picks: WishPicks } }) {
  const locale = useLocale();
  const t = COPY[locale];
  const letter = LETTER[locale];
  const chapters = getWishChapters(locale);
  const occasions = getWishOccasions(locale);
  const [slug, setSlug] = useState(initial.slug);
  const [notice, setNotice] = useState("");
  const [preparing, setPreparing] = useState(false);
  const reels = useReels<WishPicks>(initial.picks);
  const { picks, shown, rolling, busy, held } = reels;
  const origin = useSyncExternalStore(noSubscription, () => window.location.origin, () => site.url);
  const canShareFiles = useSyncExternalStore(
    noSubscription,
    () => typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], "x.png", { type: "image/png" })] }),
    () => false,
  );

  const chapter = chapters.find((item) => item.slug === slug) ?? chapters[0];
  const lists = wishLists(chapter);
  const card = compose(chapter, picks, locale);
  const display = shown.map((pick, i) => lists[i][Math.min(pick, lists[i].length - 1)]);
  const path = `/zyczenia/${card.code}`;
  const url = `${origin}${localizePath(path, locale)}`;
  const image = (format: "post" | "relacja", download = false) =>
    `${localizePath(`${path}/karta`, locale)}?format=${format}${download ? "&pobierz" : ""}`;

  function roll(next = chapter) {
    if (busy) return;
    const lengths = wishLists(next).map((list) => list.length);
    const keep = next === chapter ? held : [false, false, false];
    if (!reels.roll(lengths, keep)) return;
    setNotice("");
    track("Życzenia", { adresat: next.slug });
  }

  function choose(nextSlug: string) {
    if (busy || nextSlug === slug) return;
    const next = chapters.find((item) => item.slug === nextSlug);
    if (!next) return;
    setSlug(nextSlug);
    reels.release();
    roll(next);
  }

  const log = (channel: string) => {
    track("Udostępnienie", { kanal: channel, typ: "zyczenia" });
    tally("udostepnienie");
  };

  function whatsapp() {
    log("WhatsApp");
    window.open(`https://wa.me/?text=${encodeURIComponent(`${wishMessage(card, locale)}\n\n${url}`)}`, "_blank", "noopener,noreferrer");
  }

  async function messenger() {
    log("Messenger");
    if (isPhone()) {
      window.location.href = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
      return;
    }
    // Messenger on a computer takes no shared link without a Facebook app: copy it and open the inbox.
    try {
      await navigator.clipboard.writeText(url);
      setNotice(t.messengerCopied);
    } catch {
      window.prompt(t.linkPrompt, url);
    }
    window.open("https://www.messenger.com/", "_blank", "noopener,noreferrer");
  }

  async function sharePicture() {
    log("obrazek");
    setPreparing(true);
    try {
      const response = await fetch(image("post"));
      const blob = await response.blob();
      const file = new File([blob], `${t.file}-${card.code}.png`, { type: "image/png" });
      await navigator.share({ files: [file], text: url });
    } catch {
      // Closing the share sheet is fine.
    } finally {
      setPreparing(false);
    }
  }

  async function copy(text: string, done: string, prompt: string, channel: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(done);
    } catch {
      window.prompt(prompt, text);
    }
    log(channel);
  }

  useKeys((key, event) => {
    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return;
    if (key === " " || key === "enter") {
      event.preventDefault();
      roll();
    } else if (["1", "2", "3"].includes(key)) {
      event.preventDefault();
      reels.toggleHold(Number(key) - 1);
    }
  });

  const secondary = "btn border border-ink text-ink hover:bg-ink hover:text-paper";

  return (
    <div>
      <div role="group" aria-label={t.recipients} className="flex flex-col gap-5 md:flex-row md:gap-0">
        {occasions.map((occasion) => {
          const own = chapters.filter((item) => item.occasion === occasion.slug);
          return (
            <div key={occasion.slug} className={cx("md:pr-0", own.length > 1 ? "md:flex-[4]" : "md:flex-1")}>
              <p className="label mb-2 text-ink-soft">{occasion.name}</p>
              <div className={cx("grid border-l border-t border-ink", own.length > 1 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1")}>
                {own.map((item) => {
                  const active = item.slug === slug;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => choose(item.slug)}
                      className={cx(
                        "flex items-center gap-2 border-b border-r border-ink px-2 py-2 text-left font-sans text-[0.92rem] font-medium leading-tight transition-colors",
                        active ? "bg-ink text-paper" : "hover:bg-paper-deep",
                      )}
                    >
                      <span className={cx("shrink-0", active && "bg-paper")}>
                        <SpeciesPlate species={item.plate.species} specimen={item.plate.specimen} sizes="60px" className="h-11 w-[3.3rem] object-contain" />
                      </span>
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <article
          aria-live="polite"
          aria-busy={busy}
          className="relative border border-ink bg-card px-5 pb-8 pt-5 sm:px-10 sm:pb-10 sm:pt-8"
        >
          <header className="flex items-center gap-3 border-b-2 border-ink pb-4">
            <Mark className="size-10 shrink-0 text-ink" />
            <div className="min-w-0">
              <p className="font-bold leading-tight">{letter.institute}</p>
              <p className="label text-ink-soft">{letter.department}</p>
            </div>
          </header>
          <div className="label mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-ink-soft">
            <span>{letter.reference(chapterNumber(chapter), card.number)}</span>
            <span>{card.occasion.dateline}</span>
          </div>
          <p className="label mt-1 text-ink-soft">{card.occasion.subject}</p>

          <div className="mt-6 flow-root">
            <SpeciesPlate
              species={chapter.plate.species}
              specimen={chapter.plate.specimen}
              eager
              sizes="(max-width: 639px) 60vw, 240px"
              className="mx-auto mb-3 w-44 max-w-full sm:float-right sm:mb-2 sm:ml-6 sm:mr-[-0.5rem] sm:w-60"
            />
            <p className="text-[1.35rem] font-bold leading-snug">{chapter.salutation}</p>
            <p className="mt-3 min-h-[9em] text-[1.15rem] leading-[1.55] sm:min-h-[7.5em] sm:text-[1.22rem]">
              {display.map((part, i) => (
                <span
                  key={i}
                  className={cx(
                    "transition-opacity",
                    rolling[i] && "opacity-50 blur-[0.4px]",
                    held[i] && "underline decoration-red decoration-[1.5px] underline-offset-[5px]",
                  )}
                >
                  {typo(part)}
                  {i < 2 ? " " : ""}
                </span>
              ))}
            </p>
          </div>

          <div className="relative mt-8 flex justify-end">
            <div className="relative text-right">
              {!busy && (
                <Seal
                  key={card.code}
                  locale={locale}
                  className="absolute -left-28 -top-6 size-28 animate-stamp text-red opacity-90 [--stamp-rotate:-11deg] sm:-left-36 sm:size-32"
                />
              )}
              <p className="italic">{letter.regards},</p>
              <p className="mt-1 text-[2.2rem] font-bold leading-none tracking-[0.06em]">{letter.signature}</p>
              {chapter.cosigner && <p className="mt-1 max-w-[14rem] text-[0.95rem] italic leading-snug text-ink-soft">{chapter.cosigner}</p>}
            </div>
          </div>
        </article>

        <div className="lg:sticky lg:top-6">
          <button type="button" onClick={() => roll()} disabled={busy} className="btn w-full justify-center border border-ink text-ink hover:bg-ink hover:text-paper disabled:opacity-60">
            {t.roll} <span aria-hidden="true">↻</span>
          </button>
          <div className="mt-3 grid grid-cols-3 border-l border-t border-ink">
            {t.parts.map((part, i) => (
              <button
                key={part}
                type="button"
                aria-pressed={held[i]}
                aria-label={t.holdLabel(part)}
                onClick={() => reels.toggleHold(i)}
                className={cx(
                  "flex flex-col items-center border-b border-r border-ink px-1 py-2 font-sans text-[0.8rem] font-medium leading-tight transition-colors",
                  held[i] ? "bg-red text-paper" : "hover:bg-paper-deep",
                )}
              >
                <span>{part}</span>
                <span className={cx("label mt-0.5", held[i] ? "text-paper" : "text-ink-faint")}>{held[i] ? t.held : t.hold}</span>
              </button>
            ))}
          </div>
          <p className="label mt-2 text-ink-faint">{typo(t.holdNote)}</p>

          <h2 className="label mt-8 border-b border-ink pb-2 text-ink">{t.send}</h2>
          <div className="mt-3 grid gap-2">
            <button type="button" onClick={whatsapp} className="btn w-full justify-center bg-ink text-paper hover:bg-red">
              {t.whatsapp}
            </button>
            <button type="button" onClick={messenger} className="btn w-full justify-center bg-ink text-paper hover:bg-red">
              {t.messenger}
            </button>
          </div>

          <h2 className="label mt-8 border-b border-ink pb-2 text-ink">{t.picture}</h2>
          <div className="mt-3 grid gap-2">
            {canShareFiles && (
              <button type="button" onClick={sharePicture} disabled={preparing} className={cx(secondary, "w-full justify-center disabled:opacity-60")}>
                {preparing ? t.preparing : t.sharePicture}
              </button>
            )}
            <a href={image("post", true)} download onClick={() => log("obrazek-post")} className={cx(secondary, "w-full justify-center")}>
              {t.post}
            </a>
            <a href={image("relacja", true)} download onClick={() => log("obrazek-relacja")} className={cx(secondary, "w-full justify-center")}>
              {t.story}
            </a>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
            <button type="button" onClick={() => copy(wishMessage(card, locale), t.textCopied, t.textPrompt, "tekst")} className="link font-sans font-medium">
              {t.copyText}
            </button>
            <button type="button" onClick={() => copy(url, t.linkCopied, t.linkPrompt, "link")} className="link font-sans font-medium">
              {t.copyLink}
            </button>
          </p>
          <p className="label mt-3 min-h-[1.2em] text-red" aria-live="polite">
            {notice}
          </p>
          <p className="label mt-3 text-ink-faint">{t.total(card.number, card.total)}</p>
          <p className="label mt-1 hidden text-ink-faint md:block">{t.keys}</p>
        </div>
      </div>
    </div>
  );
}
