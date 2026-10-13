"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { advanceGrill, dailyGrillSeed, dismissGrillHazard, GRILL_SECONDS, grillPhase, grillRank, newGrill, PERFECT_WINDOW, readGrillBest, sausageBurnt, sidePerfect, sideReady, tapGrill, type GrillState } from "@/lib/grill";
import styles from "./grill-game.module.css";

const COPY = defineCopy({
  pl: {
    title: "Król grilla", lab: "Pracownia obróbki termicznej", protocol: "Próba sprawności IBD-G1", intro: "Szczypce są tylko jedne.",
    lead: "Dwie strony kiełbasy. Sześć miejsc na ruszcie. Cała rodzina wie lepiej. Utrzymaj ogień, wyczuj moment i nie oddaj szczypiec.",
    start: "Przejmij szczypce", duration: "90 sekund · bez konta", best: "Twój rekord", points: "Punkty", seconds: "Do końca", served: "Podane", perfect: "Idealne", combo: "Seria", smoke: "Zadymienie", pause: "Przerwa", resume: "Wracaj do rusztu", paused: "Grill może poczekać.", pausedNote: "Ogień, rodzina i zegar zostały chwilowo wstrzymane.", sound: "Dźwięk", on: "włączony", off: "wyłączony", ruleTitle: "Trzy ruchy szczypcami", rules: ["Kliknij puste miejsce, żeby położyć kiełbasę.", "W niebieskim polu kliknij, żeby obrócić. Druga strona piecze się od początku.", "Znów poczekaj na niebieskie pole i kliknij, żeby podać. Dwie idealne strony budują serię."],
    place: "Połóż", flip: "Obróć", serve: "Podaj", clear: "Usuń", side: (n: number) => `Strona ${n}/2`, slot: (n: number) => `Miejsce ${n}`, ready: "Teraz!", early: "Jeszcze chwilę", burnt: "Spalona", over: "Ostatni moment", first: "Najpierw obróć", hotkeys: "1–6: ruszt · W: osa · Spacja: broń szczypiec · P: przerwa", touch: "Dotknij kiełbasy. Obserwuj pasek, nie rady rodziny.",
    phases: ["Spokojny początek", "Rodzina przy stole", "Wszyscy są ekspertami"], phaseNotes: ["Ogień spokojny. Autorytet jeszcze niekwestionowany.", "Żar rośnie. Głodnych przybywa. Szczypce nadal twoje.", "Pełny żar. Rady ze wszystkich stron. Liczy się refleks."], voices: ["„Nie obracaj tyle. Ja bym już obrócił.”", "„Daj szczypce. Pokażę ci tylko jedną rzecz.”", "„Za moich czasów kiełbasa piekła się sama.”"], heat: "Natężenie żaru", heatLevels: ["umiarkowane", "podwyższone", "rodzinne"], observation: "Obserwacja terenowa", wasp: "Osa przy ruszcie!", swat: "Odpędź osę", tongs: "Szwagier sięga po szczypce.", defend: "Szczypce zostają u mnie", hazardNote: "Masz 5 sekund. Ruszt nie czeka.", locked: "Szwagier przejął szczypce…", lockedNote: "Za chwilę je odzyskasz. Ogień działa dalej.", tip: "Niebieskie pole = idealny moment", legendRaw: "piecze się", legendReady: "idealny moment", legendBurnt: "przypalona", noStorage: "Rekordu nie można zapisać w tej przeglądarce.",
    notices: { loaded: "Kiełbasa na ruszcie.", flip: "Obrócona. Teraz druga strona.", perfectFlip: "Idealny obrót. Utrzymaj poziom.", served: "Porcja przyjęta bez zastrzeżeń.", perfect: "Dwie idealne strony. Autorytet rośnie.", raw: "Środek jeszcze niegotowy. Rodzina odnotowała.", burnt: "Eksponat węglowy usunięty.", wasp: "Osa zmieniła lokal gastronomiczny.", defended: "Szczypce pozostają w jednych rękach.", stung: "Osa przerwała serię.", stolen: "Szwagier przejął stanowisko na chwilę." },
    result: "Protokół z grillowania", finished: "Próba zakończona.", ranks: { king: "Król grilla", master: "Mistrz rusztu", apprentice: "Praktykant przy szczypcach", smoke: "Specjalista od zadymienia" }, verdicts: { king: "Kiełbasy podane. Szczypce obronione. Rodzina nadal twierdzi, że zrobiłaby to lepiej.", master: "Większość porcji przeszła kontrolę jakości. Dalsze rady rodziny uznano za zbędne.", apprentice: "Potencjał stwierdzono. Na razie dopuszczono do podawania musztardy.", smoke: "Widoczność spadła do zera. Badanie przeniesiono pod wiatr." },
    stamp: "Zbadano przy ruszcie", burned: "Zwęglone", rawCount: "Podane za wcześnie", swatted: "Osy odpędzone", defendedCount: "Szczypce obronione", longest: "Najdłuższa seria", replay: "Jeszcze jedna partia", share: "Kopiuj wynik", copied: "Wynik i link skopiowane.", copyLabel: "Wynik do skopiowania", copyFallback: "Skopiuj przygotowany wynik poniżej.", download: "Pobierz protokół PNG", downloading: "Przygotowywanie protokołu…", downloadFail: "Nie udało się przygotować protokołu. Spróbuj ponownie.", reportFooter: "Źródło: IBD. Próba sprawności przy ruszcie.", scoreNote: "Idealna porcja: 100 pkt + do 100 za serię. Zwykła: 65. Osa lub obrona szczypiec: 25. Surowa: −25. Spalona: −30.", shareChallenge: "Przejmij szczypce i pobij mój wynik.", back: "Poznaj Dziadersa Grillowego", illustration: "Samozwańczy ekspert przy grillu, do którego szczypiec sięgają doradcy", practice: "Możesz zatrzymać grę w każdej chwili. Zmiana karty automatycznie włącza przerwę.",
  },
  sl: {
    title: "Kralj žara", lab: "Laboratorij za toplotno obdelavo", protocol: "Preizkus spretnosti IBD-G1", intro: "Klešče so samo ene.",
    lead: "Dve strani klobase. Šest mest na rešetki. Vsa družina ve bolje. Ohrani žerjavico, ujemi pravi trenutek in ne predaj klešč.",
    start: "Prevzemi klešče", duration: "90 sekund · brez računa", best: "Tvoj rekord", points: "Točke", seconds: "Do konca", served: "Postrežene", perfect: "Popolne", combo: "Niz", smoke: "Zadimljenost", pause: "Premor", resume: "Vrni se k žaru", paused: "Žar lahko počaka.", pausedNote: "Ogenj, družina in ura so začasno ustavljeni.", sound: "Zvok", on: "vklopljen", off: "izklopljen", ruleTitle: "Trije gibi s kleščami", rules: ["Klikni prazno mesto, da položiš klobaso.", "V modrem polju klikni, da jo obrneš. Druga stran se začne peči od začetka.", "Spet počakaj na modro polje in klikni, da postrežeš. Dve popolni strani gradita niz."],
    place: "Položi", flip: "Obrni", serve: "Postrezi", clear: "Odstrani", side: (n: number) => `Stran ${n}/2`, slot: (n: number) => `Mesto ${n}`, ready: "Zdaj!", early: "Še malo", burnt: "Zažgana", over: "Zadnji trenutek", first: "Najprej obrni", hotkeys: "1–6: rešetka · W: osa · Preslednica: brani klešče · P: premor", touch: "Dotakni se klobase. Opazuj kazalnik, ne družinskih nasvetov.",
    phases: ["Miren začetek", "Družina pri mizi", "Vsi so strokovnjaki"], phaseNotes: ["Ogenj je miren. Avtoritete še nihče ne izpodbija.", "Žerjavica se krepi. Lačnih je več. Klešče so še tvoje.", "Polna žerjavica. Nasveti z vseh strani. Odloča hitrost odziva."], voices: ["»Ne obračaj toliko. Jaz bi jo že obrnil.«", "»Daj klešče. Samo eno stvar ti pokažem.«", "»V mojih časih se je klobasa pekla sama.«"], heat: "Moč žerjavice", heatLevels: ["zmerna", "povišana", "družinska"], observation: "Terensko opazovanje", wasp: "Osa pri žaru!", swat: "Odženi oso", tongs: "Svak sega po kleščah.", defend: "Klešče ostanejo pri meni", hazardNote: "Imaš 5 sekund. Rešetka ne čaka.", locked: "Svak je prevzel klešče …", lockedNote: "Kmalu jih dobiš nazaj. Ogenj deluje naprej.", tip: "Modro polje = popoln trenutek", legendRaw: "se peče", legendReady: "popoln trenutek", legendBurnt: "zažgana", noStorage: "Rekorda v tem brskalniku ni mogoče shraniti.",
    notices: { loaded: "Klobasa je na rešetki.", flip: "Obrnjena. Zdaj druga stran.", perfectFlip: "Popoln obrat. Ohrani raven.", served: "Porcija sprejeta brez pripomb.", perfect: "Dve popolni strani. Avtoriteta raste.", raw: "Sredica še ni pripravljena. Družina je zabeležila.", burnt: "Ogljeni eksponat odstranjen.", wasp: "Osa je zamenjala gostinski lokal.", defended: "Klešče ostajajo v enih rokah.", stung: "Osa je prekinila niz.", stolen: "Svak je za trenutek prevzel delovno mesto." },
    result: "Zapisnik peke na žaru", finished: "Preizkus je končan.", ranks: { king: "Kralj žara", master: "Mojster rešetke", apprentice: "Vajenec s kleščami", smoke: "Strokovnjak za zadimljenost" }, verdicts: { king: "Klobase postrežene. Klešče obranjene. Družina še vedno trdi, da bi to opravila bolje.", master: "Večina porcij je prestala nadzor kakovosti. Nadaljnji nasveti družine so odveč.", apprentice: "Potencial ugotovljen. Za zdaj je dovoljeno podajanje gorčice.", smoke: "Vidljivost je padla na nič. Preizkus smo prestavili proti vetru." },
    stamp: "Preizkušeno pri žaru", burned: "Pooglenele", rawCount: "Postrežene prezgodaj", swatted: "Odgnane ose", defendedCount: "Obranjene klešče", longest: "Najdaljši niz", replay: "Še ena runda", share: "Kopiraj rezultat", copied: "Rezultat in povezava sta kopirana.", copyLabel: "Rezultat za kopiranje", copyFallback: "Kopiraj pripravljeni rezultat spodaj.", download: "Prenesi zapisnik PNG", downloading: "Priprava zapisnika …", downloadFail: "Zapisnika ni bilo mogoče pripraviti. Poskusi znova.", reportFooter: "Vir: IBD. Preizkus spretnosti pri žaru.", scoreNote: "Popolna porcija: 100 točk + do 100 za niz. Navadna: 65. Osa ali obramba klešč: 25. Surova: −25. Zažgana: −30.", shareChallenge: "Prevzemi klešče in presezi moj rezultat.", back: "Spoznaj Žarnega dziadersa", illustration: "Samooklicani strokovnjak pri žaru, po čigar kleščah segajo svetovalci", practice: "Igro lahko kadarkoli ustaviš. Menjava zavihka samodejno vključi premor.",
  },
});

const BEST_KEY = "ibd-grill-best-v1";
const subscribeBest = (callback: () => void) => {
  window.addEventListener("storage", callback); window.addEventListener("ibd-grill-best", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("ibd-grill-best", callback); };
};
const getBest = () => { try { return readGrillBest(localStorage.getItem(BEST_KEY)); } catch { return 0; } };
const serverBest = () => 0;

function Tongs({ className }: { className?: string }) {
  return <svg viewBox="0 0 100 100" className={className} aria-hidden="true"><path d="M20 12Q11 8 13 21L41 76Q48 90 55 76L84 18Q87 8 78 12L48 68Z" fill="#cec6b6" stroke="#161513" strokeWidth="3" /><path d="M13 21L24 30M78 12L70 25M41 76L48 68" stroke="#161513" strokeWidth="2" /></svg>;
}

export function GrillGame({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [game, setGame] = useState<GrillState | null>(null);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(false);
  const [message, setMessage] = useState("");
  const [shareText, setShareText] = useState("");
  const [downloading, setDownloading] = useState(false);
  const gameRef = useRef<GrillState | null>(null);
  const stationRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const best = useSyncExternalStore(subscribeBest, getBest, serverBest);
  const running = game?.status === "playing" && !paused;

  const commit = useCallback((next: GrillState) => {
    const finished = next.status === "finished" && gameRef.current?.status !== "finished";
    gameRef.current = next; setGame(next);
    if (finished) {
      try { localStorage.setItem(BEST_KEY, String(Math.max(getBest(), next.score))); window.dispatchEvent(new Event("ibd-grill-best")); }
      catch { setMessage(COPY[locale].noStorage); }
      requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
    }
  }, [locale]);

  const tone = useCallback((kind: "tap" | "serve" | "hazard") => {
    if (!sound) return;
    try {
      const context = audioRef.current ?? new AudioContext(); audioRef.current = context;
      void context.resume();
      const notes = kind === "serve" ? [523, 659, 784] : kind === "hazard" ? [330, 440] : [220];
      notes.forEach((frequency, i) => {
        const oscillator = context.createOscillator(), gain = context.createGain(), at = context.currentTime + i * 0.055;
        oscillator.type = "triangle"; oscillator.frequency.setValueAtTime(frequency, at);
        gain.gain.setValueAtTime(0.001, at); gain.gain.exponentialRampToValueAtTime(0.055, at + 0.01); gain.gain.exponentialRampToValueAtTime(0.001, at + 0.16);
        oscillator.connect(gain); gain.connect(context.destination); oscillator.start(at); oscillator.stop(at + 0.17);
      });
    } catch { /* The game remains playable when audio is unavailable. */ }
  }, [sound]);

  const act = useCallback((slot: number) => {
    if (!gameRef.current || paused) return;
    const next = tapGrill(gameRef.current, slot);
    if (next === gameRef.current) return;
    tone(next.notice?.kind === "perfect" || next.notice?.kind === "served" ? "serve" : "tap"); commit(next);
  }, [paused, tone, commit]);
  const hazardAction = useCallback(() => {
    if (!gameRef.current || paused) return;
    const next = dismissGrillHazard(gameRef.current);
    if (next !== gameRef.current) { tone("hazard"); commit(next); }
  }, [paused, tone, commit]);

  useEffect(() => {
    if (!running) return;
    let frame = 0, previous = performance.now();
    const tick = (now: number) => {
      const seconds = (now - previous) / 1000;
      if (seconds >= 0.1 && gameRef.current) {
        previous = now;
        // A suspended browser or long main-thread stall gets a fair, paused grill.
        if (seconds > 1) { setPaused(true); return; }
        const next = advanceGrill(gameRef.current, seconds); commit(next);
        if (next.status === "finished") return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, commit]);

  useEffect(() => {
    const hide = () => { if (document.hidden && gameRef.current?.status === "playing") setPaused(true); };
    const blur = () => { if (gameRef.current?.status === "playing") setPaused(true); };
    document.addEventListener("visibilitychange", hide); window.addEventListener("blur", blur);
    return () => { document.removeEventListener("visibilitychange", hide); window.removeEventListener("blur", blur); };
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, a")) || gameRef.current?.status !== "playing") return;
      if (event.key.toLowerCase() === "p" || event.key === "Escape") { event.preventDefault(); setPaused((value) => !value); return; }
      if (paused) return;
      if (/^[1-6]$/.test(event.key)) { event.preventDefault(); act(Number(event.key) - 1); }
      if (event.key.toLowerCase() === "w" && gameRef.current.hazard?.kind === "wasp") { event.preventDefault(); hazardAction(); }
      if (event.code === "Space" && gameRef.current.hazard?.kind === "tongs") { event.preventDefault(); hazardAction(); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [act, hazardAction, paused]);
  useEffect(() => () => { void audioRef.current?.close(); }, []);

  function start() {
    setPaused(false); setMessage(""); setShareText(""); commit(newGrill(dailyGrillSeed()));
    requestAnimationFrame(() => { stationRef.current?.focus({ preventScroll: true }); document.getElementById("grill-game")?.scrollIntoView({ block: "start", behavior: "instant" }); });
  }
  async function share() {
    if (!game) return;
    const text = `${t.title} · ${t.ranks[grillRank(game)]}\n${t.points}: ${game.score} · ${t.served}: ${game.served} · ${t.perfect}: ${game.perfect}\n${t.shareChallenge}\n${new URL(localizePath("/krol-grilla", locale), window.location.origin)}`;
    try { await navigator.clipboard.writeText(text); setMessage(t.copied); }
    catch { setShareText(text); setMessage(t.copyFallback); }
  }
  async function download() {
    if (!game || downloading) return;
    setDownloading(true); setMessage("");
    try {
      const { createGrillReport } = await import("@/lib/grill-report");
      const url = await createGrillReport({ title: t.title, heading: t.result, rank: t.ranks[grillRank(game)], stamp: t.stamp, score: game.score, scoreLabel: t.points, rows: [[t.served, String(game.served)], [t.perfect, String(game.perfect)], [t.longest, String(game.bestCombo)], [t.burned, String(game.burnt)]], footer: t.reportFooter, url: `dziader.si${localizePath("/krol-grilla", locale)}`, serif: getComputedStyle(resultRef.current!).fontFamily, sans: getComputedStyle(document.querySelector(".label")!).fontFamily });
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `IBD-G1-${game.score}.png`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch { setMessage(t.downloadFail); }
    finally { setDownloading(false); }
  }

  const phase = game ? grillPhase(game) : 0;
  const rows = game ? [[t.served, game.served], [t.perfect, game.perfect], [t.longest, game.bestCombo], [t.burned, game.burnt], [t.rawCount, game.raw], [t.swatted, game.swatted], [t.defendedCount, game.defended]] : [];

  return <section id="grill-game" className={`wrap ${styles.game}`} aria-label={t.protocol}>
    <div className={styles.masthead}><span className="label">IBD-G1 / {t.lab}</span><button className={styles.sound} aria-pressed={sound} onClick={() => setSound((value) => !value)}>{sound ? "♪" : "♩"} {t.sound}: {sound ? t.on : t.off}</button></div>
    {!game ? <div className={styles.intro}>
      <div className={styles.introCopy}><span className={styles.tag}>{t.protocol}</span><h2>{t.intro}</h2><p>{t.lead}</p><button className={`btn btn-ink ${styles.start}`} onClick={start}>{t.start} <span aria-hidden="true">→</span></button><p className={`label ${styles.duration}`}>{t.duration} <span> / </span> {t.best}: {best}</p></div>
      <div className={styles.introArt}><Image src="/illustrations/grill/hero.webp" width={900} height={600} alt={t.illustration} priority sizes="(max-width: 700px) 90vw, 45vw" /><span className={styles.artLabel}>IBD / G–01</span><span className={styles.artCircle} aria-hidden="true" /></div>
      <div className={styles.instructions}><h3 className="label">{t.ruleTitle}</h3><ol>{t.rules.map((rule, i) => <li key={rule}><span>{String(i + 1).padStart(2, "0")}</span><p>{rule}</p></li>)}</ol><p className={styles.practice}>{t.practice}</p></div>
    </div> : game.status === "finished" ? <div ref={resultRef} tabIndex={-1} className={styles.result}>
      <div className={styles.resultTop}><span className="label">{t.result} / IBD-G1</span><span className={styles.stamp}>{t.stamp}</span></div>
      <div className={styles.resultGrid}><div><p className="label">{t.finished}</p><h2>{t.ranks[grillRank(game)]}</h2><p className={styles.verdict}>{t.verdicts[grillRank(game)]}</p><div className={styles.resultScore}><span>{game.score}</span><p className="label">{t.points}<br />{t.best}: {best}</p></div><dl className={styles.resultRows}>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div><Image src="/illustrations/grill/hero.webp" width={600} height={400} alt="" sizes="(max-width: 700px) 90vw, 40vw" className={styles.resultArt} /></div>
      <div className={styles.resultActions}><button className="btn btn-ink" onClick={start}>{t.replay} ↻</button><button className="btn btn-outline" onClick={share}>{t.share} ↗</button><button className="btn btn-outline" onClick={download} disabled={downloading}>{downloading ? t.downloading : t.download} ↓</button></div><p role="status" className={styles.message}>{message}</p>{shareText && <textarea aria-label={t.copyLabel} value={shareText} readOnly rows={5} onFocus={(event) => event.currentTarget.select()} className={styles.shareText} />}<p className={styles.scoreNote}>{t.scoreNote}</p><Link href={`/atlas/${locale === "pl" ? "dziaders-grillowy" : "zarni-dziaders"}`} className="link">{t.back} →</Link>
    </div> : <>
      <div className={styles.scoreboard}><div><span className="label">{t.seconds}</span><strong className={GRILL_SECONDS - game.elapsed <= 15 ? styles.urgent : ""}>{Math.ceil(GRILL_SECONDS - game.elapsed)}<small>s</small></strong></div><div><span className="label">{t.points}</span><strong>{game.score}</strong></div><div><span className="label">{t.served}</span><strong>{game.served}</strong></div><div><span className="label">{t.combo}</span><strong className={game.combo > 1 ? styles.combo : ""}>{game.combo || "—"}</strong></div><button className={styles.pauseButton} onClick={() => setPaused(true)} aria-label={t.pause}><span aria-hidden="true">Ⅱ</span><span>{t.pause}</span></button></div>
      <div className={styles.playLayout}>
        <div className={styles.station} ref={stationRef} tabIndex={-1}>
          <div className={styles.phaseBar}><span className="label">{String(phase + 1).padStart(2, "0")} / {t.phases[phase]}</span><span aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} className={i <= phase ? styles.phaseOn : ""} />)}</span></div>
          <div className={styles.grill} style={{ "--smoke": game.smoke / 100 } as CSSProperties}>
            <picture className={styles.grillArt}><source media="(max-width: 700px)" srcSet="/illustrations/grill/grill-mobile-360.webp 360w, /illustrations/grill/grill-mobile-600.webp 600w, /illustrations/grill/grill-mobile.webp 900w" sizes="96vw" /><Image src="/illustrations/grill/grill.webp" width={900} height={600} alt="" priority sizes="(max-width: 850px) 96vw, 65vw" /></picture>
            <div className={styles.slotGrid}>{game.slots.map((sausage, index) => {
              const burned = sausage && sausageBurnt(sausage), ready = sausage && sideReady(sausage), ideal = sausage && sidePerfect(sausage, sausage.side);
              const action = !sausage ? t.place : burned ? t.clear : sausage.side === 0 ? t.flip : t.serve;
              const status = !sausage ? "" : burned ? t.burnt : ideal ? t.ready : ready ? t.over : t.early;
              const progress = sausage ? Math.min(100, sausage.sides[sausage.side] / sausage.burnAt * 100) : 0;
              const ratio = sausage ? Math.min(1, sausage.sides[sausage.side] / sausage.burnAt) : 0;
              return <button key={index} data-slot={index + 1} className={`${styles.slot} ${burned ? styles.burntSlot : ideal ? styles.idealSlot : ""}`} disabled={paused || game.locked > 0} onClick={() => act(index)} aria-label={`${t.slot(index + 1)}: ${action}${sausage ? ` · ${t.side(sausage.side + 1)} · ${status}` : ""}`}>
                <span className={styles.slotNumber} aria-hidden="true">{index + 1}</span>
                {sausage ? <><span key={`${sausage.id}-${sausage.side}`} className={styles.sausage} style={{ filter: `brightness(${burned ? 0.32 : 1 - Math.max(0, ratio - .75) * .6}) saturate(${burned ? 0.4 : 1})` }}><Image src="/illustrations/grill/sausage-raw.webp" width={300} height={128} alt="" /><Image src="/illustrations/grill/sausage.webp" width={300} height={128} alt="" style={{ opacity: Math.min(1, sausage.sides[sausage.side] / sausage.target) }} /></span><span className={styles.slotAction}>{action} <span>{status}</span></span><span className={styles.cookMeter} aria-hidden="true"><span className={styles.perfectZone} style={{ left: `${sausage.target / sausage.burnAt * 100}%`, width: `${PERFECT_WINDOW / sausage.burnAt * 100}%` }} /><i style={{ left: `${progress}%` }} /></span><span className={styles.sideLabel}>{t.side(sausage.side + 1)}</span></> : <><span className={styles.emptyMark} aria-hidden="true">+</span><span className={styles.slotAction}>{action}</span><span className={styles.sideLabel}>{t.slot(index + 1)}</span></>}
              </button>;
            })}</div>
            <div className={styles.smokeCloud} aria-hidden="true"><i /><i /><i /></div>
            {!paused && game.hazard?.kind === "wasp" && <button className={styles.wasp} style={{ left: `${game.hazard.x}%`, top: `${game.hazard.y}%` }} onClick={hazardAction} aria-label={t.swat}><Image src="/illustrations/grill/wasp.webp" width={100} height={100} alt="" /><span>W</span></button>}
            {game.locked > 0 && !paused && <div className={styles.lockOverlay}><Tongs /><strong>{t.locked}</strong><p>{t.lockedNote}</p><span>{game.locked.toFixed(1)} s</span></div>}
            {paused && <div className={styles.pauseOverlay}><span className="label">IBD-G1 / {t.pause}</span><h3>{t.paused}</h3><p>{t.pausedNote}</p><button className="btn btn-ink" autoFocus onClick={() => { setPaused(false); stationRef.current?.focus({ preventScroll: true }); }}>{t.resume} →</button></div>}
          </div>
          <div className={styles.legend}><span><i />{t.legendRaw}</span><span><i />{t.legendReady}</span><span><i />{t.legendBurnt}</span></div>
          <p className={styles.touch}>{t.touch}</p><p className={styles.hotkeys}>{t.hotkeys}</p>
        </div>
        <aside className={styles.briefing}>
          <div className={styles.heat}><span className="label">{t.heat}</span><strong>{t.heatLevels[phase]}</strong><div aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} className={i < [4, 8, 12][phase] ? styles.heatOn : ""} />)}</div></div>
          <div className={styles.smokeGauge}><div><span className="label">{t.smoke}</span><strong>{Math.round(game.smoke)}%</strong></div><meter min={0} max={100} value={game.smoke} aria-label={t.smoke} /><p>{t.tip}</p></div>
          <div className={styles.fieldNote}><span className="label">{t.observation}</span><p>{t.voices[phase]}</p><Image src="/illustrations/grill/hero-360.webp" width={360} height={240} alt="" /><p className={styles.phaseNote}>{t.phaseNotes[phase]}</p></div>
          <div className={styles.interruption} role="status" aria-live="polite">{game.hazard ? <div className={styles.hazard}><strong>{game.hazard.kind === "wasp" ? t.wasp : t.tongs}</strong><p>{t.hazardNote}</p><div className={styles.hazardTimer} aria-hidden="true"><i style={{ width: `${game.hazard.left / 5 * 100}%` }} /></div><button disabled={paused} onClick={hazardAction}>{game.hazard.kind === "wasp" ? t.swat : t.defend}<span aria-hidden="true">{game.hazard.kind === "wasp" ? "W" : "␣"}</span></button></div> : <p className={styles.mobileVoice}>{t.voices[phase]}</p>}</div>
        </aside>
      </div>
      <div className={styles.notice} role="status" aria-live="polite"><span key={game.notice?.serial ?? 0}>{game.notice ? t.notices[game.notice.kind] : t.phaseNotes[0]}{game.notice && game.notice.points !== 0 && <strong>{game.notice.points > 0 ? "+" : ""}{game.notice.points}</strong>}</span></div>
    </>}
  </section>;
}
