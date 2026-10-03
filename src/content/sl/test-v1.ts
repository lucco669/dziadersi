import type { Text } from "@/i18n/overlay";
import type { QuestionV1 } from "../test-v1";

/**
 * Obrazec IBD-T1, the retired first edition (24 questions), so that old result links read in
 * Slovenian too. Same order and number of answers as the Polish: codes store answers by position.
 */
export const QUESTIONS_V1: Text<QuestionV1>[] = [
  {
    section: "Avtomobili",
    text: "Sosed ti pokaže svoj novi avto. Kaj rečeš?",
    answers: [
      { text: "Čestitam!" },
      { text: "Koliko pa kuri?" },
      { text: "Koliko ste ga pa plačali?" },
      { text: "Brez besed brcnem v gumo in pokimam." },
    ],
  },
  {
    section: "Oddih",
    text: "Prvi dan dopusta na morju, ura je 6.30. Kaj počneš?",
    answers: [
      { text: "Spim. Dopust je." },
      { text: "Grem tekat ob obali." },
      { text: "Iščem odprto pekarno." },
      { text: "Postavljam vetrobran. Ob sedmih ne bo več prostora." },
    ],
  },
  {
    section: "Tehnika",
    text: "Sestavljaš novo omaro iz paketa. Kaj pa navodila?",
    answers: [
      { text: "Preberem jih od začetka do konca." },
      { text: "Pogledam sličice." },
      { text: "Jaz ne potrebujem navodil." },
      { text: "Ostala sta dva vijaka. To sta rezervna." },
    ],
  },
  {
    section: "Komunikacija",
    text: "Dobiš sporočilo: »DELI, PREDEN ZBRIŠEJO!!!« Kaj narediš?",
    answers: [
      { text: "Ignoriram." },
      { text: "Preverim, ali je res." },
      { text: "Pošljem naprej družini. Za vsak primer." },
      { text: "Delim javno in dopišem tri klicaje." },
    ],
  },
  {
    section: "Družabno življenje",
    text: "Piknik pri prijateljih. Gostitelj ravno obrača vratovino. Ti:",
    answers: [
      { text: "Pogovarjam se z ljudmi za mizo." },
      { text: "Vprašam, ali lahko kaj pomagam." },
      { text: "Pripomnim, da je prezgodaj." },
      { text: "Prevzamem klešče. Nekdo mora." },
    ],
  },
  {
    section: "Parkiranje",
    text: "Sobota, parkirišče pred marketom. Kje parkiraš?",
    answers: [
      { text: "Na prvem prostem mestu." },
      { text: "Krožim, dokler se ob vhodu kaj ne sprosti." },
      { text: "Na koncu parkirišča, daleč od vseh. Raje malo pešačim." },
      { text: "Na dveh mestih hkrati, da ga nihče ne oplazi." },
    ],
  },
  {
    section: "Gospodinjstvo",
    text: "Ali imaš doma predal s kabli, za katere ne veš, čemu so?",
    answers: [{ text: "Ne." }, { text: "Da." }, { text: "To bo še prišlo prav." }],
  },
  {
    section: "Avtomobili",
    text: "Električni avto je po tvoje:",
    answers: [
      { text: "Prihodnost." },
      { text: "Zanimiva možnost, ko se poceni." },
      { text: "Zarota proizvajalcev polnilnic." },
      { text: "Igrača. Dizel je dizel." },
    ],
  },
  {
    section: "Delo",
    text: "Kako končaš sporočila v službenem klepetu?",
    answers: [
      { text: "Nikakor. Preprosto pošljem." },
      { text: "S smeškom." },
      { text: "»Lep pozdrav«." },
      { text: "Pokličem, da preverim, ali je sporočilo prišlo." },
    ],
  },
  {
    section: "Prosti čas",
    text: "Idealna sobota se začne ob:",
    answers: [
      { text: "11.00, s kavo v postelji." },
      { text: "8.00, z zajtrkom." },
      { text: "6.00 na vrtičku. Paradižnik se ne bo sam zalil." },
      { text: "4.00 ob vodi. Termovka je pripravljena že od večera." },
    ],
  },
  {
    section: "Vreme",
    text: "Zunaj sneži. Tvoj komentar:",
    answers: [
      { text: "Lepo." },
      { text: "Spet bodo zastoji." },
      { text: "Včasih so bile zime." },
      { text: "To ni sneg. Sneg je bil devetinsedemdesetega." },
    ],
  },
  {
    section: "Oddih",
    text: "Hotel all inclusive v tujini. Kaj ješ prvi dan?",
    answers: [
      { text: "Lokalne specialitete." },
      { text: "Malo vsega." },
      { text: "Iščem nekaj, kar spominja na dunajca." },
      { text: "Sendviče od doma. Vsaj ve se, kaj je v njih." },
    ],
  },
  {
    section: "Tehnika",
    text: "Internet ne dela več. Prvi korak:",
    answers: [
      { text: "Ponovno zaženem router." },
      { text: "Pokličem operaterja." },
      { text: "Pokličem nekoga mlajšega." },
      { text: "Router čez noč izklopim, naj se spočije." },
    ],
  },
  {
    section: "Prenova",
    text: "Mojster ti polaga ploščice v kopalnici. Kaj počneš?",
    answers: [
      { text: "Skuham kavo in ne motim." },
      { text: "Grem od doma." },
      { text: "Stojim med vrati in gledam." },
      { text: "Razlagam, kako se to v resnici dela." },
    ],
  },
  {
    section: "Avtomobili",
    text: "Kdaj zamenjaš gume za zimske?",
    answers: [
      { text: "Ko me spomni servis." },
      { text: "Ne menjam, imam celoletne." },
      { text: "Pred prvo slano. Vedno." },
      { text: "Sam, v garaži, s ključem po očetu." },
    ],
  },
  {
    section: "Komunikacija",
    text: "Na internetu vidiš članek z naslovom, ki te razjezi. Kaj narediš?",
    answers: [
      { text: "Preberem članek." },
      { text: "Zaprem zavihek." },
      { text: "Družini pošljem povezavo s pripisom »No, vidite«." },
      { text: "Komentiram brez branja. Z velikimi črkami." },
    ],
  },
  {
    section: "Oblačenje",
    text: "Poletje, obuješ sandale. Zraven pa:",
    answers: [{ text: "Nič. To so sandali." }, { text: "Tanke nogavice. Nihče ne bo opazil." }, { text: "Bele frotirne nogavice. Klasika." }],
  },
  {
    section: "Prosti čas",
    text: "Kolega pripoveduje, kakšno ribo je ujel. Tvoj odziv:",
    answers: [
      { text: "Čestitam." },
      { text: "Vprašam, koliko je tehtala." },
      { text: "Rečem, da tam ribe že leta ne prijemljejo." },
      { text: "Razprem roke: »Moja je bila takale.«" },
    ],
  },
  {
    section: "Delo",
    text: "Sestanek, ki bi lahko bil e-mail. Kaj narediš?",
    answers: [
      { text: "Predlagam, naj bo naslednji e-mail." },
      { text: "Poslušam in si delam zapiske v telefonu." },
      { text: "Natisnem dnevni red. In zapisnik prejšnjega sestanka." },
      { text: "Skličem nov sestanek, da to pretresemo." },
    ],
  },
  {
    section: "Kultura",
    text: "Glasba, ki se zdaj vrti na radiu:",
    answers: [
      { text: "Z veseljem poslušam." },
      { text: "Nekatere pesmi so v redu." },
      { text: "Včasih so bile pesmi." },
      { text: "Ne vem. Radio imam od leta 1991 nastavljen na isto postajo." },
    ],
  },
  {
    section: "Parkiranje",
    text: "Nekdo je zasedel mesto pred blokom, kjer parkiraš že leta. Kaj narediš?",
    answers: [
      { text: "Parkiram drugje." },
      { text: "Malo se razjezim in parkiram drugje." },
      { text: "Za brisalec zataknem listek." },
      { text: "Od jutri naprej, ko se odpeljem, na mestu pustim vedro." },
    ],
  },
  {
    section: "Oddih",
    text: "Prvomajski podaljšani vikend. Načrt:",
    answers: [
      { text: "Izlet v hribe." },
      { text: "Počitek doma." },
      { text: "Žar. Zakurim sam, brez podžigalnega gela." },
      { text: "Vrtiček. Odprem uto in sezono." },
    ],
  },
  {
    section: "Tehnika",
    text: "Koliko pametnih naprav imaš doma, ki jih ne znaš upravljati?",
    answers: [
      { text: "Nobene." },
      { text: "Eno, ampak ne moti." },
      { text: "Ne vem. Nastavil jih je nekdo iz družine." },
      { text: "Nekaj. Pametne žarnice ugašam s stikalom." },
    ],
  },
  {
    section: "Družinsko življenje",
    text: "Sveti večer. Za mizo se začne pogovor o politiki. Ti:",
    answers: [
      { text: "Pogovor preusmerim na pierogi." },
      { text: "Molče poslušam." },
      { text: "Rečem, da je bilo v mojih časih drugače." },
      { text: "Začnem z besedami: »Jaz vam povem, kako je.«" },
    ],
  },
];
