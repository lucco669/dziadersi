# Competitor keyword plan (SEOMaster Studio fraz, 2026-11-20)

Source: `64-studio-konkurenci-frazy.csv` from the SEOMaster export of 2026-11-20. It has 4,868 keywords from
miejski.pl, nonsa.pl, joemonster.org, kwejk.pl, demotywatory.pl (1,000 each), aszdziennik.pl (128),
nowewyrazy.uw.edu.pl (87) and fran.si (43). Market: PL. dziader.si is in the top 20 for none of them.
Most of the list is noise for us: memes, celebrities, aszdziennik news, and fran.si words measured on the Polish market.
The clusters below are the ones that fit the Institute concept. Volumes are monthly Polish searches. KD = SEOMaster difficulty, 0–100.

| # | Cluster | Volume | KD | Competitor now | Fit | Effort |
|---|---|---:|---:|---|---|---|
| 1 | Unusual-holiday calendar ("kalendarz świąt nietypowych", "jakie dziś święto") | ~220k | ≤29 | nonsa.pl #8–19 | high: `/kalendarz` already has its own observances | M |
| 2 | Boomer ("boomer", "boomer kto to", "boomerzy co to znaczy", "ok boomers") | ~32k | ≤7 | miejski.pl #1–4, nowewyrazy #6 | very high: closest sibling of "dziaders" | S |
| 3 | Youth slang decoded for dziadersi ("67 co to znaczy", "sybau", "tuff", "sigma", "cringe", "slay", "delulu"…) | ~550k incl. bare head terms; ~150k for the "co to znaczy" forms | ≤10 | miejski.pl #1–4 | high: a reversed dictionary (dziaders decodes the youth) | M |
| 4 | Related types (janusz, szwagier, wujek / wujek dobra rada, majster, pan areczek, sąsiad, teściowa) | ~135k, mostly generic heads | ≤5 | miejski.pl #11–18, kwejk | medium: only the definition intent fits | M |
| 5 | Days of people (Dzień Teściowej, Dzień Mężczyzn, Dzień Chłopaka, Dzień Ojca/Dziadka, Dzień Piwa) | ~20k | 0 | demotywatory, kwejk | high for `/okazje` | S each |
| 6 | Ageism ("ageizm", "ageizm co to") | ~5k | 0 | nowewyrazy #13–16 | high: the honest question "is 'dziaders' ageist?" | S |

Skip: memes (kwejk #1–3, image intent, high KD), madka/karyna (derogatory toward women, off-tone),
aszdziennik celebrity/news queries, and the fran.si words.

## 1. Calendar of unusual holidays (biggest prize)

`/kalendarz` is a single tear-off page with ~25 `OBSERVANCES` (`src/content/calendar.ts`).
Intent check: people want to know *what today is*. A day-by-day calendar meets that, and the joke
holidays are the hook. nonsa.pl ranks only #8–19, so the slot is weak.

- Grow `OBSERVANCES` to at least one per week (~60), then towards one per day. Same voice as now.
- An indexable page per observance: `/kalendarz/[slug]` (e.g. `/kalendarz/dzien-bialej-skarpety`) with the date, the note,
  a related species/dictionary link, and an OG card.
- An index page `/kalendarz/swieta` ("Kalendarz świąt nietypowych Instytutu") listed by month, plus a "Dziś obchodzimy" block
  on `/kalendarz` and home (updated every day, so freshness signal).
- Title pattern: "Dzień Białej Skarpety (20 maja) · Kalendarz świąt nietypowych".
- JSON-LD `Event` per observance (yearly) is optional. Breadcrumbs are required.
- SL: Slovenian overlay and slugs as usual ("koledar nenavadnih praznikov").

## 2. `/dziaders/boomer`: "Boomer — kto to jest i czym różni się od dziadersa"

The pattern already exists (`/dziaders/kobieta`). `src/content/guide.ts` already has the FAQ answer
"Czym różni się dziaders od boomera?", so grow that into its own page:
- the meaning of boomer / "OK boomer" (origin, years 1946–1964), plural forms (boomerzy, boomerskie);
- a comparison table boomer / dziaders / dziad / zgred;
- a link to the Test ("Sprawdź, czy jesteś boomerem, czy dziadersem");
- FAQ JSON-LD; internal links from `/dziaders`, the guide FAQ and the dictionary.

## 3. "Słownik odwrotny": youth slang for dziadersi

A new section (e.g. `/slownik-mlodziezowy` or `/slownik/odwrotny/[slug]`). The Institute explains youth words
to a dziaders, with a correct plain meaning first (that's what ranks) and a deadpan "objaśnienie dla dziadersa" second.
Start with 15–20 entries that have the most "co to znaczy" demand: 67 / six seven, sybau, tuff, sigma, slay,
cringe, lowkey, delulu, skibidi, goat, pov, tbh, idk, fr, szon/szponcić, rizz, aura, larp, twin.
Each entry: meaning, example, "jak zareagowałby dziaders", link to the matching dziaders phrase.
These words date fast, so give each entry a "stan na" date and review it every quarter.

## 4. Related types: "Gatunki pokrewne"

One hub page in the atlas: "Janusz, szwagier, wujek dobra rada, pan Areczek — kim są i czy to już dziaders?",
with a short definition section per type and anchor links. Text only: under `docs/ILLUSTRATIONS.md` this needs
no new species artwork (reuse pictograms). Promote a type to a full species only together with the full artwork set.
`/superinteligencja` (SZWAGIER 1.9 TDI) already owns "szwagier", so link to it.

## 5. Days of people in `/okazje`

Add occasion pages for: Dzień Teściowej (5 March), Dzień Mężczyzn (10 March), Dzień Ojca (23 June),
Dzień Chłopaka (30 September), Dzień Dziadka (22 January, close and very on-brand). Each one: "jak przetrwać", bingo/phrasebook lines,
shareable card ("kartka na Dzień…") in place of the gifs people search for.

## 6. "Czy dziaders to ageizm?"

An essay page or a long FAQ section on `/dziaders`: the honest answer (the Institute's line is that dziaderstwo
is an attitude, not an age, see `guide.ts`), citing Obserwatorium Językowe UW and nowewyrazy.
It's cheap and strengthens the definition cluster.

## Order

1. Boomer page (#2) and ageism section (#6): small, and they back up the dziaders cluster the content session is working on.
2. Calendar per-day pages (#1): biggest volume, mostly content in an existing module.
3. Youth slang decoder (#3).
4. Okazje days (#5), timed before each date (Dzień Dziadka 22 Jan is next).
5. Related-types hub (#4).

Once each page is live, add its head keyword to SEOMaster tracked phrases.
