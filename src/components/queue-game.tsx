"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { getQueueEvents, type QueueEffect } from "@/content/queue";
import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import Link from "@/i18n/link";
import { localizePath } from "@/i18n/routes";
import { canChoose, chooseQueue, dailyQueueSeed, managerOutcome, newQueue, OFFICE_MINUTES, parseQueueCode, previousQueue, queueCode, queueEventIndex, queueScore, restoreQueue, saveQueue, type QueueAction, type QueueState } from "@/lib/queue";
import { plural, pluralSl, typo } from "@/lib/typo";
import { QueueScene } from "./queue-scene";
import styles from "./queue-game.module.css";

const STORAGE = "ibd-queue-v1";
const BEST = "ibd-queue-best-v1";
const subscribe = () => () => {};
const COPY = defineCopy({
  pl: {
    office: "Wydział spraw do załatwienia", hours: "Czynne do 16:00", simulation: "Symulacja IBD-K1", ticket: "Twój numerek", goal: "Jedna sprawa. Cały aparat państwa.",
    intro: "Przed tobą dziewięć osób. Do zamknięcia czterdzieści urzędowych minut. Dotrzyj do okienka, zanim skończy się czas albo twoja cierpliwość.",
    start: "Pobierz numerek", daily: "Kolejka dnia", dailyNote: "Dziś wszyscy zaczynają w tej samej kolejce. Nowy układ o północy czasu polskiego.", random: "Inna kolejka", invited: "Kolejka z zaproszenia", invalid: "Ten numer kolejki jest nieprawidłowy. Przygotowano kolejkę dnia.",
    resume: "Wróć na swoje miejsce", saved: "Twoje miejsce zostało zachowane.", overwrite: "Nowy numerek zastąpi poprzedni zapis.", loading: "Otwieranie urzędu…", noRush: "Czas płynie tylko po wyborze odpowiedzi. Można spokojnie czytać.",
    ahead: "Przed tobą", time: "Do zamknięcia", irritation: "Irytacja", authority: "Autorytet", people: (n: number) => plural(n, "osoba", "osoby", "osób"), minutes: "min", step: (n: number) => `Zdarzenie ${String(n).padStart(2, "0")}`, choose: "Twoja reakcja", effect: "Skutek decyzji", next: "Dalej w kolejce", report: "Odbierz protokół", forward: (n: number) => `${n} do przodu`, backward: (n: number) => `${n} do tyłu`, stays: "miejsce bez zmian", needs: (n: number) => `Wymaga ${n} pkt autorytetu`,
    manager: "Proszę zawołać kierownika", managerNote: "Raz na grę. Zastępuje bieżącą decyzję. Kierownik może pomóc, spisać protokół albo zwołać zebranie. Koszt: 4–8 minut.", managerUsed: "Kierownik został już wezwany", managerTitle: "Interwencja kierownictwa", managerReplies: ["Kierownik otwiera dodatkowe okienko. Trzy osoby zostają obsłużone. Prosi, żeby nie robić z tego precedensu.", "Kierownik spisuje protokół. W rubryce „przyczyna kolejki” wpisuje „ludzie”. Jedna osoba odchodzi w trakcie.", "Kierownik zwołuje zebranie w sprawie zbyt długiego oczekiwania. Na czas zebrania obsługa zostaje wstrzymana."],
    pause: "Przerwa w grze", paused: "Miejsce zajęte. Możesz odetchnąć.", continue: "Wracam do kolejki", pauseNote: "Urzędowy zegar czeka razem z tobą. Zapis pozwala wrócić po zamknięciu strony.", storageFail: "Przeglądarka nie pozwala zapisać gry. Możesz grać dalej, ale postęp zniknie po zamknięciu strony.",
    log: "Dziennik oczekiwania", emptyLog: "Na razie wszystko idzie zgodnie z planem. To się zmieni.", rules: "Instrukcja dla obywatela", rulesList: ["Przesuń się o dziewięć miejsc, żeby załatwić sprawę. Skutki każdej decyzji widzisz przed wyborem.", "Każda decyzja kosztuje urzędowe minuty. Przy 0 urząd się zamyka, także jeśli właśnie docierasz do okienka.", "Irytacja na poziomie 100 oznacza wyjście z urzędu. Czasem warto stracić chwilę i odzyskać spokój.", "Stanowcze reakcje zużywają autorytet. Spokojne rozwiązania go odbudowują. Kierownika możesz wezwać tylko raz."],
    result: "Protokół z oczekiwania", served: "Sprawa załatwiona.", closed: "Prosimy przyjść jutro.", walked: "Obywatel opuścił urząd.", servedText: "Pieczątka przybita. Wniosek o wydanie potwierdzenia złożenia wniosku został przyjęty. Potwierdzenie do odbioru w osobnej kolejce.", closedText: "Zegar wykazał brak dalszych godzin przyjęć. Twoją determinację odnotowano. Miejsca na jutro nie odnotowano.", walkedText: "Próg cierpliwości został przekroczony. Drzwi zamknięto z naciskiem. Sprawa pozostaje otwarta.",
    stampWin: "Rozpatrzono", stampLose: "Do ponowienia", score: "Wynik urzędowy", best: "Twój rekord", completed: "Spraw załatwionych", spent: "Czas oczekiwania", decisions: "Podjęte decyzje", remaining: "Osób przed tobą", scoreNote: "500 pkt za załatwienie sprawy + 25 za każde zdobyte miejsce + 5 za każdą pozostałą minutę + 2 za każdy punkt spokoju + autorytet.",
    replay: "Ta sama kolejka jeszcze raz", newGame: "Pobierz nowy numerek", share: "Kopiuj wynik i wyzwanie", copied: "Wynik i link skopiowane.", copyFallback: "Zaznacz tekst poniżej i skopiuj go ręcznie.", shareLabel: "Wynik z linkiem do tej samej kolejki", download: "Przygotuj protokół PNG", saveImage: "Zapisz plik PNG", preview: "Podgląd protokołu do pobrania", downloading: "Przygotowywanie protokołu…", downloadFail: "Nie udało się pobrać protokołu. Spróbuj ponownie lub skopiuj wynik.", challenge: "Sprawdź, czy załatwisz to szybciej.", shareTitle: "Pan tu nie stał!", source: "Źródło: IBD. Symulacja, nie zalecenie urzędowe.", back: "Wróć do Instytutu", hotkeys: "Klawiatura: 1, 2, 3 — wybór; Enter — dalej.",
  },
  sl: {
    office: "Oddelek za zadeve, ki jih je treba urediti", hours: "Odprto do 16.00", simulation: "Simulacija IBD-K1", ticket: "Tvoja številka", goal: "Ena zadeva. Ves državni aparat.",
    intro: "Pred tabo je devet ljudi. Do zaprtja štirideset uradnih minut. Pridi do okenca, preden zmanjka časa ali tvoje potrpežljivosti.",
    start: "Vzemi številko", daily: "Današnja vrsta", dailyNote: "Danes vsi začnete v isti vrsti. Nova razporeditev ob polnoči po poljskem času.", random: "Druga vrsta", invited: "Vrsta iz povabila", invalid: "Ta številka vrste ni veljavna. Pripravljena je današnja vrsta.",
    resume: "Vrni se na svoje mesto", saved: "Tvoje mesto je shranjeno.", overwrite: "Nova številka bo nadomestila prejšnji zapis.", loading: "Odpiranje urada …", noRush: "Čas teče šele po izbiri odgovora. Bereš lahko v miru.",
    ahead: "Pred tabo", time: "Do zaprtja", irritation: "Razdraženost", authority: "Avtoriteta", people: (n: number) => pluralSl(n, "oseba", "osebi", "osebe", "oseb"), minutes: "min", step: (n: number) => `Dogodek ${String(n).padStart(2, "0")}`, choose: "Tvoj odziv", effect: "Posledica odločitve", next: "Naprej v vrsti", report: "Prevzemi zapisnik", forward: (n: number) => `${n} naprej`, backward: (n: number) => `${n} nazaj`, stays: "mesto ostane isto", needs: (n: number) => `Zahteva ${n} točk avtoritete`,
    manager: "Pokličite vodjo, prosim", managerNote: "Enkrat na igro. Nadomesti trenutno odločitev. Vodja lahko pomaga, napiše zapisnik ali skliče sestanek. Cena: 4–8 minut.", managerUsed: "Vodja je bil že poklican", managerTitle: "Posredovanje vodstva", managerReplies: ["Vodja odpre dodatno okence. Obravnavajo tri osebe. Prosi, naj iz tega ne nastane precedens.", "Vodja napiše zapisnik. V rubriko »vzrok za vrsto« vpiše »ljudje«. Medtem ena oseba odide.", "Vodja skliče sestanek o predolgem čakanju. Med sestankom se delo s strankami prekine."],
    pause: "Premor v igri", paused: "Mesto je zasedeno. Lahko zadihaš.", continue: "Vračam se v vrsto", pauseNote: "Uradna ura čaka s tabo. Shranjena igra omogoča vrnitev po zaprtju strani.", storageFail: "Brskalnik ne dovoli shranjevanja. Lahko igraš naprej, vendar bo napredek po zaprtju strani izgubljen.",
    log: "Dnevnik čakanja", emptyLog: "Za zdaj gre vse po načrtu. To se bo spremenilo.", rules: "Navodila za občana", rulesList: ["Premakni se za devet mest, da urediš zadevo. Posledice vsake odločitve vidiš pred izbiro.", "Vsaka odločitev stane uradne minute. Pri 0 se urad zapre, tudi če prav takrat prideš do okenca.", "Razdraženost 100 pomeni odhod iz urada. Včasih se splača izgubiti trenutek in ohraniti mir.", "Odločni odzivi porabljajo avtoriteto. Mirne rešitve jo obnavljajo. Vodjo lahko pokličeš le enkrat."],
    result: "Zapisnik o čakanju", served: "Zadeva urejena.", closed: "Pridite jutri, prosim.", walked: "Občan je zapustil urad.", servedText: "Žig je odtisnjen. Vloga za izdajo potrdila o oddaji vloge je sprejeta. Potrdilo prevzameš v drugi vrsti.", closedText: "Ura je pokazala, da uradnih ur ni več. Tvoja odločnost je zabeležena. Mesto za jutri ni.", walkedText: "Prag potrpežljivosti je presežen. Vrata so se odločno zaprla. Zadeva ostaja odprta.",
    stampWin: "Obravnavano", stampLose: "Ponoviti", score: "Uradni rezultat", best: "Tvoj rekord", completed: "Urejene zadeve", spent: "Čas čakanja", decisions: "Sprejete odločitve", remaining: "Oseb pred tabo", scoreNote: "500 točk za urejeno zadevo + 25 za vsako pridobljeno mesto + 5 za vsako preostalo minuto + 2 za vsako točko mirnosti + avtoriteta.",
    replay: "Še enkrat ista vrsta", newGame: "Vzemi novo številko", share: "Kopiraj rezultat in izziv", copied: "Rezultat in povezava sta kopirana.", copyFallback: "Označi spodnje besedilo in ga kopiraj ročno.", shareLabel: "Rezultat s povezavo do iste vrste", download: "Pripravi zapisnik PNG", saveImage: "Shrani datoteko PNG", preview: "Predogled zapisnika za prenos", downloading: "Priprava zapisnika …", downloadFail: "Zapisnika ni bilo mogoče prenesti. Poskusi znova ali kopiraj rezultat.", challenge: "Preveri, ali lahko to urediš hitreje.", shareTitle: "Vi pa niste bili v vrsti!", source: "Vir: IBD. Simulacija, ne uradno priporočilo.", back: "Nazaj na Inštitut", hotkeys: "Tipkovnica: 1, 2, 3 — izbira; Enter — naprej.",
  },
});

function storedGame() { try { return restoreQueue(localStorage.getItem(STORAGE)); } catch { return null; } }
function storedBest() { try { const n = Number(localStorage.getItem(BEST)); return Number.isInteger(n) && n >= 0 && n <= 1500 ? n : 0; } catch { return 0; } }
const randomSeed = () => crypto.getRandomValues(new Uint32Array(1))[0] || 1;

function Effects({ effect, locale }: { effect: QueueEffect; locale: Locale }) {
  const t = COPY[locale];
  return <span className={styles.effects}><span>−{effect.minutes} {t.minutes}</span><span>{effect.advance > 0 ? t.forward(effect.advance) : effect.advance < 0 ? t.backward(-effect.advance) : t.stays}</span><span>{t.irritation} {effect.irritation > 0 ? "+" : ""}{effect.irritation}</span><span>{t.authority} {effect.authority > 0 ? "+" : ""}{effect.authority}</span></span>;
}

export function QueueGame({ locale }: { locale: Locale }) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  return <Game key={ready ? "live" : "preview"} locale={locale} ready={ready} />;
}

function Game({ locale, ready }: { locale: Locale; ready: boolean }) {
  const t = COPY[locale];
  const events = getQueueEvents(locale);
  const [state, setState] = useState<QueueState | null>(() => ready ? storedGame() : null);
  const [mode, setMode] = useState<"lobby" | "play" | "pause" | "result">("lobby");
  const [receipt, setReceipt] = useState(false);
  const [best, setBest] = useState(() => ready ? storedBest() : 0);
  const [storageFailed, setStorageFailed] = useState(false);
  const [message, setMessage] = useState("");
  const [shareText, setShareText] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [reportUrl, setReportUrl] = useState("");
  const reportRequest = useRef(0);
  const [invitation] = useState(() => ready ? new URLSearchParams(window.location.search).get("kolejka") : null);
  const focusRef = useRef<HTMLHeadingElement>(null);
  const seed = parseQueueCode(invitation);
  const event = state ? events[queueEventIndex(state)] : events[0];
  const before = state && receipt ? previousQueue(state) : null;
  const lastAction = state?.actions.at(-1);
  const lastEvent = before ? events[queueEventIndex(before)] : null;
  const reply = before && lastAction !== undefined ? lastAction === "manager" ? t.managerReplies[managerOutcome(before)] : lastEvent!.choices[lastAction].reply : "";

  useEffect(() => () => { if (reportUrl) URL.revokeObjectURL(reportUrl); }, [reportUrl]);
  useEffect(() => () => { reportRequest.current++; }, []);

  useEffect(() => {
    if (mode === "lobby") return;
    const heading = focusRef.current;
    heading?.focus({ preventScroll: true });
    if (heading && heading.getBoundingClientRect().top < 140) heading.scrollIntoView({ block: "start", behavior: "instant" });
  }, [mode, receipt]);

  function persist(next: QueueState) {
    try { localStorage.setItem(STORAGE, saveQueue(next)); } catch { setStorageFailed(true); }
  }
  function start(nextSeed: number) {
    reportRequest.current++;
    setDownloading(false);
    const next = newQueue(nextSeed);
    setState(next); setReceipt(false); setMode("play"); setMessage(""); setShareText(""); setReportUrl(""); persist(next);
    const url = new URL(window.location.href);
    url.searchParams.set("kolejka", queueCode(nextSeed));
    window.history.replaceState(null, "", url);
    requestAnimationFrame(() => document.getElementById("queue-game")?.scrollIntoView({ block: "start" }));
  }
  function choose(action: QueueAction) {
    if (!state || mode !== "play" || receipt || !canChoose(state, action)) return;
    const next = chooseQueue(state, action);
    setState(next); setReceipt(true); persist(next);
    if (next.status !== "playing") {
      const record = Math.max(best, queueScore(next)); setBest(record);
      try { localStorage.setItem(BEST, String(record)); } catch { setStorageFailed(true); }
    }
  }
  function advance() { if (state?.status !== "playing") { setMode("result"); setReceipt(false); } else setReceipt(false); }

  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || mode !== "play") return;
      const target = e.target;
      if (target instanceof HTMLElement && (target.closest("button, a, input, textarea, select, summary, [contenteditable]"))) return;
      if (receipt && e.key === "Enter") { e.preventDefault(); advance(); }
      else if (!receipt && ["1", "2", "3"].includes(e.key)) { e.preventDefault(); choose((Number(e.key) - 1) as 0 | 1 | 2); }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  });

  const outcomeTitle = state?.status === "served" ? t.served : state?.status === "walked" ? t.walked : t.closed;
  const outcomeText = state?.status === "served" ? t.servedText : state?.status === "walked" ? t.walkedText : t.closedText;
  async function share() {
    if (!state) return;
    const url = new URL(localizePath("/kolejka", locale), window.location.origin);
    url.searchParams.set("kolejka", queueCode(state.seed));
    const text = `${t.shareTitle}\n${outcomeTitle}\n${t.score}: ${queueScore(state)}. ${t.spent}: ${OFFICE_MINUTES - state.minutes} ${t.minutes}.\n${t.challenge}\n${url}`;
    setShareText(text); setMessage(t.copyFallback);
    try { await navigator.clipboard.writeText(text); setMessage(t.copied); } catch { setMessage(t.copyFallback); }
  }
  async function download() {
    if (!state || downloading) return;
    const request = ++reportRequest.current;
    setDownloading(true); setMessage("");
    try {
      const { createQueueReport } = await import("@/lib/queue-report");
      const url = await createQueueReport({ title: t.shareTitle, heading: t.result, outcome: outcomeTitle, stamp: state.status === "served" ? t.stampWin : t.stampLose, code: queueCode(state.seed), score: queueScore(state), scoreLabel: t.score, rows: [[t.completed, state.status === "served" ? "1" : "0"], [t.spent, `${OFFICE_MINUTES - state.minutes} ${t.minutes}`], [t.irritation, `${state.irritation}/100`], [t.authority, `${state.authority}/100`]], footer: t.source, url: `dziader.si${localizePath("/kolejka", locale)}`, serif: getComputedStyle(focusRef.current!).fontFamily, sans: getComputedStyle(document.querySelector(".label")!).fontFamily });
      if (request === reportRequest.current) setReportUrl(url);
      else URL.revokeObjectURL(url);
    } catch { if (request === reportRequest.current) setMessage(t.downloadFail); }
    finally { if (request === reportRequest.current) setDownloading(false); }
  }

  return <section id="queue-game" className={`${styles.game} wrap my-10 md:my-14`} aria-label={t.simulation}>
    <div className={styles.office}><span>{t.office}</span><span>{t.hours}</span></div>
    {storageFailed && <p role="status" className={styles.notice}>{t.storageFail}</p>}
    {mode === "lobby" ? <>
      <QueueScene locale={locale} />
      <div className={styles.intro}>
        <div><p className="label text-red">{t.simulation} · 2–4 min</p><h2 className={styles.title}>{t.goal}</h2><p className={styles.lead}>{typo(t.intro)}</p><p className={styles.note}>{t.noRush}</p></div>
        <div className={styles.ticket}><p className="label">{t.ticket}</p><p className={styles.ticketNumber}>A–038</p><p className="label text-ink-soft">{seed ? t.invited : t.daily}</p>
          {!ready ? <p role="status">{t.loading}</p> : <>
            {state && <><p className={styles.note}>{t.saved}</p><button className="btn btn-ink w-full" onClick={() => { setMode(state.status === "playing" ? "play" : "result"); setReceipt(state.status === "playing" && state.actions.length > 0); }}>{state.status === "playing" ? t.resume : t.report} →</button><p className={styles.note}>{t.overwrite}</p></>}
            <button className={`btn w-full ${state ? "btn-outline" : "btn-ink"}`} onClick={() => start(seed ?? dailyQueueSeed())}>{t.start} <span aria-hidden="true">→</span></button>
            <button className={styles.textButton} onClick={() => start(randomSeed())}>{t.random}</button>
            {invitation && !seed && <p className={styles.note}>{t.invalid}</p>}
          </>}
          {!seed && <p className={styles.note}>{t.dailyNote}</p>}
        </div>
      </div>
    </> : state && <>
      {mode !== "result" && <>
        <div className={styles.stats}>
          <div><span>{t.ahead}</span><strong>{state.ahead}<small>{t.people(state.ahead)}</small></strong><div className={styles.track}><i style={{ width: `${Math.max(0, 9 - state.ahead) / 9 * 100}%` }} /></div></div>
          <div data-warning={state.minutes <= 10}><span>{t.time}</span><strong>{state.minutes}<small>{t.minutes}</small></strong><div className={styles.track}><i style={{ width: `${state.minutes / 40 * 100}%` }} /></div></div>
          <div data-warning={state.irritation >= 75}><span>{t.irritation}</span><strong>{state.irritation}<small>/100</small></strong><meter className="sr-only" min="0" max="100" value={state.irritation} aria-label={t.irritation} /><div className={styles.track}><i style={{ width: `${state.irritation}%` }} /></div></div>
          <div><span>{t.authority}</span><strong>{state.authority}<small>/100</small></strong><meter className="sr-only" min="0" max="100" value={state.authority} aria-label={t.authority} /><div className={styles.track}><i style={{ width: `${state.authority}%` }} /></div></div>
        </div>
        <QueueScene locale={locale} ahead={state.ahead} minutes={state.minutes} prop={(lastEvent ?? event).prop} closed={state.status === "closed"} />
      </>}
      {mode === "pause" ? <div className={styles.pause}><p className="label">A–038 · {t.ticket}</p><h2 tabIndex={-1} ref={focusRef} className={styles.title}>{t.paused}</h2><p>{t.pauseNote}</p><button className="btn btn-ink mt-6" onClick={() => setMode("play")}>{t.continue} →</button></div> : mode === "result" ? <>
        <div className={styles.result}>
          <div className={styles.resultHeading}><span className="label">IBD-K1 / {queueCode(state.seed)}</span><span className={styles.stamp}>{state.status === "served" ? t.stampWin : t.stampLose}</span></div>
          <p className="label mt-8 text-ink-soft">{t.result}</p><h2 ref={focusRef} tabIndex={-1} className={styles.resultTitle}>{outcomeTitle}</h2><p className={styles.lead}>{typo(outcomeText)}</p>
          <div className={styles.resultGrid}><div><p className="label">{t.score}</p><p className={styles.score}>{queueScore(state)}</p><p className="label text-ink-soft">{t.best}: {best}</p></div><dl className={styles.rows}>{[[t.completed, state.status === "served" ? "1" : "0"], [t.spent, `${OFFICE_MINUTES - state.minutes} ${t.minutes}`], [t.decisions, state.actions.length], [t.remaining, state.ahead], [t.irritation, `${state.irritation}/100`], [t.authority, `${state.authority}/100`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
          <p className={styles.note}>{t.scoreNote}</p><p className="label mt-6 text-ink-soft">{t.source}</p>
        </div>
        <div className={styles.resultActions}><button className="btn btn-ink" onClick={share}>{t.share}</button>{reportUrl ? <a className="btn btn-outline" href={reportUrl} download={`IBD-K1-${queueCode(state.seed)}.png`}>{t.saveImage} ↓</a> : <button className="btn btn-outline" onClick={download} disabled={downloading}>{downloading ? t.downloading : t.download}</button>}</div>
        {reportUrl && <a href={reportUrl} download={`IBD-K1-${queueCode(state.seed)}.png`} className="mx-auto block w-fit"><Image unoptimized src={reportUrl} alt={t.preview} width={270} height={338} /></a>}<p role="status" className="label mt-3">{message}</p>{shareText && <textarea readOnly aria-label={t.shareLabel} className={styles.shareText} value={shareText} rows={5} onFocus={(e) => e.currentTarget.select()} />}
        <div className={styles.resultActions}><button className={styles.textButton} onClick={() => start(state.seed)}>{t.replay} →</button><button className={styles.textButton} onClick={() => start(randomSeed())}>{t.newGame} →</button><Link className={styles.textButton} href="/">{t.back}</Link></div>
      </> : <div className={styles.play}>
        <div className={styles.encounter}>
          <div className={styles.eventMeta}><p className="label text-red">{t.step(receipt ? state.actions.length : state.actions.length + 1)} · {receipt ? t.effect : event.speaker}</p><button className={styles.textButton} onClick={() => setMode("pause")}>{t.pause}</button></div>
          {receipt ? <div key={`receipt-${state.actions.length}`} className={styles.arrival}><h2 ref={focusRef} tabIndex={-1} className={styles.title}>{lastAction === "manager" ? t.managerTitle : lastEvent?.title}</h2><p className={styles.reply}>{typo(reply)}</p>
            {before && <div className={styles.actualEffects} aria-live="polite"><Effects locale={locale} effect={{ minutes: before.minutes - state.minutes, advance: before.ahead - state.ahead, irritation: state.irritation - before.irritation, authority: state.authority - before.authority }} /></div>}
            <button className="btn btn-ink mt-8" onClick={advance}>{state.status === "playing" ? t.next : t.report} <span aria-hidden="true">→</span></button>
          </div> : <div key={`event-${state.actions.length}`} className={styles.arrival}><h2 ref={focusRef} tabIndex={-1} className={styles.title}>{event.title}</h2><blockquote className={styles.quote}>{locale === "pl" ? `„${event.line}”` : `»${event.line}«`}</blockquote><p className={styles.description}>{typo(event.description)}</p><p className="label mb-3 mt-7 text-ink-soft">{t.choose}</p>
            <div>{event.choices.map((choice, i) => <button key={i} className={styles.choice} disabled={!canChoose(state, i as 0 | 1 | 2)} onClick={() => choose(i as 0 | 1 | 2)}><span className={styles.choiceNumber} aria-hidden="true">{i + 1}</span><span><span className={styles.choiceLabel}>{choice.label}</span><Effects locale={locale} effect={choice.effect} />{!canChoose(state, i as 0 | 1 | 2) && <span className={styles.requirement}>{t.needs(-choice.effect.authority)}</span>}</span><span className={styles.arrow} aria-hidden="true">↗</span></button>)}</div>
          </div>}
        </div>
        <aside className={styles.aside}><p className="label">{t.ticket}</p><p className={styles.smallTicket}>A–038</p><p className={styles.note}>{t.noRush}</p><hr /><button className={styles.manager} disabled={receipt || state.managerUsed || state.status !== "playing"} onClick={() => choose("manager")}><span aria-hidden="true">↗</span>{state.managerUsed ? t.managerUsed : t.manager}</button><p className={styles.note}>{t.managerNote}</p><hr /><p className={styles.note}>{t.hotkeys}</p></aside>
      </div>}
      {state.actions.length > 0 && <details className={styles.details}><summary>{t.log} <span className="label">({state.actions.length})</span></summary><ol className={styles.log}>{state.actions.map((action, i) => {
        const prior = restoreQueue(JSON.stringify({ version: 1, seed: state.seed, actions: state.actions.slice(0, i) }))!;
        const entry = events[queueEventIndex(prior)];
        return <li key={i}><span className="label text-red">{String(i + 1).padStart(2, "0")}</span><div><strong>{action === "manager" ? t.managerTitle : entry.title}</strong><p>{action === "manager" ? t.managerReplies[managerOutcome(prior)] : entry.choices[action].reply}</p></div></li>;
      })}</ol></details>}
    </>}
    <details className={styles.details}><summary>{t.rules}</summary><ol className={styles.rules}>{t.rulesList.map((rule) => <li key={rule}>{typo(rule)}</li>)}</ol></details>
  </section>;
}
