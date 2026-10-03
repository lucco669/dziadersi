import assert from "node:assert/strict";
import { test } from "node:test";
import { getReading, getSzwagier, SZWAGIER } from "../src/content/szwagier";
import { LOCALES } from "../src/i18n/config";
import { analyticsUrl } from "../src/lib/analytics-url";
import { answerPath, ask, decodeAnswer, readQuestion, sampleAnswer, type Answer } from "../src/lib/szwagier";

const answer = (question: string, locale: "pl" | "sl" = "pl", mode: 0 | 1 = 0) => {
  const result = ask(question, mode, locale);
  assert.ok(result && !("crisis" in result), question);
  return result as Answer;
};

const read = (question: string, locale: "pl" | "sl" = "pl") => {
  const result = readQuestion(question, locale);
  assert.ok(!result.crisis, question);
  return result as Exclude<ReturnType<typeof readQuestion>, { crisis: true }>;
};

test("questions find their topic and kind in both editions", () => {
  const cases: [string, "pl" | "sl", string, string][] = [
    ["Czy warto kupić elektryka?", "pl", "samochod", "taknie"],
    ["Jak ustawić router?", "pl", "technika", "jak"],
    ["Kiedy zmienić opony?", "pl", "samochod", "kiedy"],
    ["Dlaczego drukarka nie drukuje?", "pl", "technika", "dlaczego"],
    ["Co ugotować na niedzielny obiad?", "pl", "jedzenie", "co"],
    ["Gdzie jechać na urlop?", "pl", "urlop", "gdzie"],
    ["Kim jesteś?", "pl", "si", "kto"],
    ["Szwagrze, napisz mi wiersz o grillu", "pl", "jedzenie", "polecenie"],
    ["A ty wiesz, jak się kosi trawę?", "pl", "dzialka", "jak"],
    ["Warto kupić diesla?", "pl", "samochod", "taknie"],
    ["Na kogo głosować w wyborach?", "pl", "tabu", "kto"],
    ["Czy pizza jest zdrowa?", "pl", "zdrowie", "taknie"],
    ["Cześć!", "pl", "powitanie", "uwaga"],
    ["Dzięki", "pl", "dzieki", "uwaga"],
    ["Mam pytanie", "pl", "ogolne", "uwaga"],
    ["Ali se splača kupiti električni avto?", "sl", "samochod", "taknie"],
    ["Kako nastavim usmerjevalnik?", "sl", "technika", "jak"],
    ["Kdaj zamenjati gume?", "sl", "samochod", "kiedy"],
    ["Zakaj tiskalnik ne tiska?", "sl", "technika", "dlaczego"],
    ["Kaj skuhati za nedeljsko kosilo?", "sl", "jedzenie", "co"],
    ["Kam na dopust?", "sl", "urlop", "gdzie"],
    ["Kdo si?", "sl", "si", "kto"],
    ["A je to že dziaderstvo?", "sl", "ogolne", "taknie"],
    ["Je hujše, če dežuje?", "sl", "pogoda", "taknie"],
  ];
  for (const [question, locale, topic, kind] of cases) {
    const result = read(question, locale);
    assert.equal(result.topic.slug, topic, question);
    assert.equal(result.kind, kind, question);
    assert.equal(result.withheld, false, question);
  }
  assert.equal(read(`Czy ${"bardzo ".repeat(20)}długie pytanie o samochód?`).kind, "przerwanie");
});

test("a question that names a claim gets that claim", () => {
  const cases: [string, "pl" | "sl", number][] = [
    ["Czy warto kupić elektryka?", "pl", 2],
    ["Kiedy zmienić opony na zimowe?", "pl", 3],
    ["Jak ustawić router?", "pl", 3],
    ["Ile kosztuje bitcoin?", "pl", 2],
    ["Ali se splača kupiti električni avto?", "sl", 2],
    ["Kdaj zamenjati gume?", "sl", 3],
    ["Kako nastavim usmerjevalnik?", "sl", 3],
  ];
  for (const [question, locale, core] of cases) {
    assert.deepEqual(read(question, locale).fitting, [core], question);
    for (const mode of [0, 1] as const) assert.equal(answer(question, locale, mode).picks.core, core, question);
  }
  assert.deepEqual(read("Czy kupić auto?").fitting, []);
});

test("the same question gets the same answer, and a code says the same in both editions", () => {
  for (const locale of LOCALES) {
    for (const mode of [0, 1] as const) {
      const first = answer("Czy warto kupić elektryka?", locale, mode);
      assert.deepEqual(answer("czy WARTO kupić elektryka?", locale, mode).picks, first.picks);
      assert.equal(first.steps.length, (mode ? 6 : 3) + 2);
      assert.equal(first.sources.length, mode ? 2 : 1);
      assert.match(first.text, /\[1\]/);
      const shared = answerPath(first).split("/").pop()!;
      const decoded = decodeAnswer(shared, locale);
      assert.ok(decoded);
      assert.equal(decoded.text, first.text);
      assert.equal(decoded.question, "Czy warto kupić elektryka?");
      const other = decodeAnswer(shared, locale === "pl" ? "sl" : "pl");
      assert.deepEqual(other?.picks, first.picks);
      assert.notEqual(other?.text, first.text);
    }
  }
  assert.equal(sampleAnswer("pl").topic.slug, "samochod");
  assert.equal(sampleAnswer("sl").topic.slug, "samochod");
});

test("special topics answer with one sentence and canonical codes", () => {
  const greeting = answer("Dzień dobry");
  assert.equal(greeting.topic.slug, "powitanie");
  assert.equal(greeting.sentences.length, 1);
  assert.deepEqual(greeting.sources, []);
  // Mode, then kind and opener at 0, the core, closer and anecdote at 0, three steps.
  assert.match(greeting.code, /^powitanie-000[0-9a-z]00[0-9a-z]{3}$/);
  assert.ok(decodeAnswer(greeting.code, "pl"));
  assert.equal(decodeAnswer(greeting.code.replace(/^powitanie-00/, "powitanie-01"), "pl"), null);
});

test("vulgar questions are withheld and never travel in links", () => {
  const vulgar = answer("Kurwa, jak to naprawić?");
  assert.equal(vulgar.topic.slug, "slownictwo");
  assert.equal(vulgar.withheld, true);
  assert.equal(vulgar.question, "");
  assert.ok(!answerPath(vulgar).includes("~"));
  assert.equal(answer("Jak wyczyścić szmatką ekran?").withheld, false);
  assert.equal(answer("Je hujše poleti?", "sl").withheld, false);
  // A vulgar question typed into a link by hand is dropped, the answer stays.
  const crafted = `${answer("Jak to naprawić?").code}~${Buffer.from("Ty chuju").toString("base64url")}`;
  assert.equal(decodeAnswer(crafted, "pl")?.question, "");
});

test("a crisis stops the act in both editions", () => {
  assert.deepEqual(ask("Nie chcę już żyć", 0, "pl"), { crisis: true });
  assert.deepEqual(ask("Myślę o samobójstwie", 1, "pl"), { crisis: true });
  assert.deepEqual(ask("Ne želim več živeti", 0, "sl"), { crisis: true });
  assert.equal(ask("   ", 0, "pl"), null);
});

test("questions are cleaned before they are shown or shared", () => {
  const cleaned = answer("Czy  kupić  auto z https://example.com/x  ? 🚗");
  assert.equal(cleaned.question, "Czy kupić auto z (link) ?");
  assert.ok(answer("x".repeat(300) + " auto?").question.length <= 140);
});

test("corrupt codes are rejected", () => {
  const good = answer("Jak ustawić router?").code;
  for (const code of ["", "router", "technika-0", `${good}0`, good.replace("technika", "nieznany"), `${good.slice(0, -1)}z`, "technika-2000000000"]) {
    assert.equal(decodeAnswer(code, "pl"), null, code);
  }
  // Repeated reasoning steps cannot be typed in by hand.
  assert.equal(decodeAnswer(`${good.slice(0, -3)}111`, "pl"), null);
});

test("lists fit one base36 digit, editions match, keywords are folded", () => {
  const sl = getSzwagier("sl");
  for (const list of [SZWAGIER.anecdotes, SZWAGIER.closers, SZWAGIER.steps, SZWAGIER.kinds, ...SZWAGIER.kinds.map((kind) => kind.openers)]) {
    assert.ok(list.length <= 36);
  }
  for (const [i, topic] of SZWAGIER.topics.entries()) {
    assert.ok(topic.cores.length <= 36 && topic.cores.length > 0, topic.slug);
    assert.equal(sl.topics[i].cores.length, topic.cores.length, topic.slug);
    assert.notEqual(sl.topics[i].cores[0], topic.cores[0], topic.slug);
  }
  for (const locale of LOCALES) {
    const reading = getReading(locale);
    for (const [slug, keywords] of Object.entries(reading.keywords)) {
      assert.ok(SZWAGIER.topics.some((topic) => topic.slug === slug), slug);
      for (const keyword of keywords) assert.match(keyword, /^[a-z0-9 ]+\$?$/, `${locale} ${slug}: ${keyword}`);
    }
    for (const [slug, cores] of Object.entries(reading.about)) {
      const topic = SZWAGIER.topics.find((item) => item.slug === slug);
      assert.ok(topic, slug);
      for (const [core, keywords] of Object.entries(cores)) {
        assert.ok(Number(core) < topic.cores.length, `${locale} ${slug}: ${core}`);
        for (const keyword of keywords) assert.match(keyword, /^[a-z0-9 ]+\$?$/, `${locale} ${slug}: ${keyword}`);
      }
    }
  }
});

test("analytics never receives a question", () => {
  const path = answerPath(answer("Czy warto kupić elektryka?"));
  for (const url of [`https://dziader.si${path}`, `https://dziader.si/sl/superinteligenca/${path.split("/").pop()}`, "https://dziader.si/sl/izvid/2abc~QW5uYQ"]) {
    const clean = analyticsUrl(url);
    assert.ok(!clean.includes("~") && clean.endsWith("/anonimowe"), clean);
  }
  assert.equal(analyticsUrl("https://dziader.si/superinteligencja"), "https://dziader.si/superinteligencja");
});
