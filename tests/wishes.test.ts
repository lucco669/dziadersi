import assert from "node:assert/strict";
import { test } from "node:test";
import { overlayProblems } from "../src/i18n/overlay";
import { CHAPTERS, getWishChapters, getWishOccasions, OCCASIONS } from "../src/content/wishes";
import { SPECIES } from "../src/content/species";
import { alternatePath, localizePath } from "../src/i18n/routes";
import { decodeWish, encodeWish, inSeason, occasionInSeason, seededWish, wish, wishLists, wishMessage, type WishPicks } from "../src/lib/wishes";

test("every chapter of the greetings has a complete Slovenian translation", () => {
  assert.deepEqual(overlayProblems.filter((problem) => problem.startsWith("wishes.")), []);
  assert.equal(getWishChapters("sl").length, CHAPTERS.length);
  assert.equal(getWishOccasions("sl").length, OCCASIONS.length);
  getWishChapters("sl").forEach((chapter, i) => {
    const polish = CHAPTERS[i];
    assert.equal(chapter.slug, polish.slug);
    wishLists(chapter).forEach((list, part) => {
      assert.equal(list.length, wishLists(polish)[part].length, `${chapter.slug}: list ${part}`);
      list.forEach((sentence, n) => assert.notEqual(sentence, wishLists(polish)[part][n], `${chapter.slug}: untranslated ${part}/${n}`));
    });
    assert.notEqual(chapter.salutation, polish.salutation);
    assert.equal(Boolean(chapter.cosigner), Boolean(polish.cosigner));
  });
});

test("a card code holds the chapter and three sentences, at most 36 of each", () => {
  const slugs = CHAPTERS.map((chapter) => chapter.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const chapter of CHAPTERS) {
    assert.match(chapter.slug, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(OCCASIONS.some((occasion) => occasion.slug === chapter.occasion), chapter.slug);
    assert.ok(SPECIES.some((species) => species.key === chapter.plate.species), chapter.slug);
    for (const list of wishLists(chapter)) assert.ok(list.length > 1 && list.length <= 36, chapter.slug);
    const last = wishLists(chapter).map((list) => list.length - 1) as WishPicks;
    for (const picks of [[0, 0, 0], last, [1, 2, 3]] as WishPicks[]) {
      const code = encodeWish(chapter, picks);
      const card = decodeWish(code, "pl");
      assert.ok(card, code);
      assert.deepEqual(card.picks, picks);
      assert.equal(decodeWish(code, "sl")?.code, code);
    }
    assert.equal(wish(chapter, last, "pl").number, wish(chapter, last, "pl").total);
  }
  assert.equal(decodeWish("swieta-wujek-zzz", "pl"), null);
  assert.equal(decodeWish("wielkanoc-wujek-000", "pl"), null);
  assert.equal(decodeWish("swieta-wujek-00", "pl"), null);
  assert.equal(seededWish(5, CHAPTERS[0], "pl").code, seededWish(5, getWishChapters("sl")[0], "sl").code);
});

test("every sentence stands alone, and the shared ones address nobody", () => {
  for (const chapter of [...CHAPTERS, ...getWishChapters("sl")]) {
    for (const sentence of wishLists(chapter).flat()) {
      assert.match(sentence, /^[A-ZĄĆĘŁŃÓŚŹŻČŠŽ]/u, sentence);
      assert.match(sentence, /[.!?]$/, sentence);
      assert.doesNotMatch(sentence, /\s{2}|\s[,.]/, sentence);
    }
  }
  // The Christmas chapters share their first lists; those must suit any addressee.
  const christmas = CHAPTERS.filter((chapter) => chapter.occasion === "swieta");
  for (const part of [0, 1, 2]) {
    const shared = wishLists(christmas[0])[part].filter((sentence) => christmas.every((chapter) => wishLists(chapter)[part].includes(sentence)));
    assert.ok(shared.length >= 6);
    for (const sentence of shared) assert.doesNotMatch(sentence, /\bPan(a|u|em)?\b|\bPani\b/, sentence);
  }
});

test("seasons wrap the new year, and the URLs translate", () => {
  const [christmas, newYear] = OCCASIONS;
  assert.ok(inSeason(christmas, 12, 20));
  assert.ok(!inSeason(christmas, 12, 27));
  assert.ok(inSeason(newYear, 12, 31));
  assert.ok(inSeason(newYear, 1, 3));
  assert.ok(!inSeason(newYear, 1, 7));
  assert.equal(occasionInSeason(7, 1), undefined);
  assert.equal(localizePath("/zyczenia/swieta-wujek-000/kartka?format=relacja", "sl"), "/sl/voscila/swieta-wujek-000/voscilnica?format=relacja");
  assert.equal(alternatePath("/zyczenia/swieta-wujek-000", "pl", "sl"), "/zyczenia/swieta-wujek-000");
  const card = decodeWish("swieta-rodzina-000", "pl")!;
  assert.ok(wishMessage(card, "pl").startsWith("Szanowni Państwo,\n"));
  assert.ok(wishMessage(card, "pl").endsWith("IBD, w imieniu całej rodziny, w komplecie"));
});
