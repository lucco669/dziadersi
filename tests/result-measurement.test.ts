import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { analyticsPayload } from "../src/lib/analytics-url";
import { trackSecondParticipant } from "../src/lib/ranking-measurement";
import { copyResultLink, resultShareIntent, shareResult } from "../src/lib/result-sharing";
import { encodeResult, groupPath, SAMPLE_DRAFT } from "../src/lib/test";

const origin = "https://dziader.si";
const first = encodeResult({ ...SAMPLE_DRAFT, name: "Zenek" });
const second = encodeResult({ ...SAMPLE_DRAFT, name: "Tone" });
const third = encodeResult({ ...SAMPLE_DRAFT, name: "Jan" });
const url = `${origin}/wynik/${first}`;

function browser(t: TestContext, apis: { share?: Navigator["share"]; clipboard?: Pick<Clipboard, "writeText"> } = {}) {
  const events: unknown[][] = [];
  const tallies: unknown[] = [];
  const prompts: string[][] = [];
  const globals = {
    window: {
      umami: { track: (name: string, data?: unknown) => events.push([name, data]) },
      prompt: (...args: string[]) => { prompts.push(args); return null; },
    },
    navigator: {
      sendBeacon: (_url: string, data: string) => { tallies.push(JSON.parse(data)); return true; },
      ...apis,
    },
  };
  for (const [key, value] of Object.entries(globals)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (previous) Object.defineProperty(globalThis, key, previous);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
  return { events, tallies, prompts };
}

for (const kanal of ["natywne", "obraz", "link"] as const) {
  test(`result handoff waits for ${kanal} to resolve`, async (t) => {
    let resolve!: () => void;
    const pending = new Promise<void>((done) => { resolve = done; });
    const { events, tallies, prompts } = browser(t, {
      share: () => pending,
      clipboard: { writeText: () => pending },
    });
    const doing = kanal === "link" ? copyResultLink(url, "Copy")
      : shareResult(kanal === "obraz" ? { files: [new File(["png"], "Zenek.png")], text: url } : { url, title: "Zenek" });
    const intent = ["Wynik: próba udostępnienia", { kanal }];
    assert.deepEqual(events, [intent]);
    assert.deepEqual(tallies, []);
    resolve();
    assert.equal(await doing, true);
    assert.deepEqual(events, [intent, ["Wynik: przekazano", { kanal }]]);
    assert.deepEqual(tallies, [{ kind: "udostepnienie" }]);
    assert.deepEqual(prompts, []);
  });
}

for (const kanal of ["natywne", "obraz"] as const) {
  for (const [name, powod] of [["AbortError", "anulowano"], ["NotAllowedError", "błąd"]]) {
    test(`${kanal} records ${name} without a handoff or fallback`, async (t) => {
      const { events, tallies, prompts } = browser(t, { share: async () => { throw new DOMException(url, name); } });
      assert.equal(await shareResult(kanal === "obraz" ? { files: [new File([], "Zenek.png")] } : { url }), false);
      assert.deepEqual(events, [
        ["Wynik: próba udostępnienia", { kanal }], ["Wynik: bez przekazania", { kanal, powod }],
      ]);
      assert.deepEqual(tallies, []);
      assert.deepEqual(prompts, []);
    });
  }
}

for (const available of [true, false]) {
  test(`manual copy after clipboard ${available ? "denial" : "unavailability"} leaves success unknown`, async (t) => {
    const { events, tallies, prompts } = browser(t, available ? {
      clipboard: { writeText: async () => { throw new Error(url); } },
    } : {});
    assert.equal(await copyResultLink(url, "Copy"), false);
    assert.deepEqual(prompts, [["Copy", url]]);
    assert.deepEqual(events, [
      ["Wynik: próba udostępnienia", { kanal: "link" }],
      ["Wynik: bez przekazania", { kanal: "link", powod: "ręczne kopiowanie" }],
    ]);
    assert.deepEqual(tallies, []);
  });
}

test("outlets, mail and download requests only emit intent", (t) => {
  const { events, tallies } = browser(t);
  const channels = ["Facebook", "WhatsApp", "X", "email", "post", "relacja", "badania"] as const;
  channels.forEach(resultShareIntent);
  assert.deepEqual(events, channels.map(kanal => ["Wynik: próba udostępnienia", { kanal }]));
  assert.deepEqual(tallies, []);
});

test("a completed snapshot join crosses the second-member threshold once, including a table", (t) => {
  const { events } = browser(t);
  const two = groupPath([first, second]);
  const three = groupPath([first, second, third]);
  for (const [before, after] of [
    ["", two], [first, groupPath([first, first + "!1"])], [first + "." + second, three],
    ["invalid", two], [first, "/grupy/id"], [first, "/wynik/code"],
  ]) trackSecondParticipant(before, after);
  assert.deepEqual(events, []);
  trackSecondParticipant(first, two);
  trackSecondParticipant(first, three);
  assert.deepEqual(events, Array(2).fill(["Ranking: druga osoba", undefined]));
});

test("both editions keep comparable view paths and strip private URLs and duel titles from any event", () => {
  for (const [result, ranking] of [["/wynik", "/grupa"], ["/sl/izvid", "/sl/lestvica"]]) {
    const payload = { url: `${ranking}/${first}.${second}?name=Zenek`, referrer: `${origin}${result}/${first}#Tone`, title: "Zenek – Tone" };
    assert.deepEqual(analyticsPayload(payload, origin), { url: `${origin}${ranking}/anonimowe`, referrer: `${origin}${result}/anonimowe` });
  }
  assert.deepEqual(analyticsPayload({ url: "/sl/test?grupa=" + first, referrer: "/sl/kolektiv/secret", title: "Zenek – Tone" }, origin),
    { url: origin + "/sl/test", referrer: origin + "/sl/kolektiv/anonimowe" });
  assert.deepEqual(analyticsPayload({ referrer: "https://other.test/path?name=Tone" }, origin), { referrer: "https://other.test" });
});
