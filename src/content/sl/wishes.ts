import type { Text } from "@/i18n/overlay";
import type { WishChapter, WishOccasion } from "../wishes";

/*
 * Voščila Inštituta. Keyed by the Polish slugs, which are part of every card code ("swieta-wujek-3b7").
 * A code picks sentences by index, so every list keeps the Polish length and order. Each sentence is
 * whole: any opener, wish and closing line of a chapter read as one letter. The letter addresses its
 * reader formally (vi), as an office does; the salutation ends in "!" so the text starts with a capital.
 */

export const OCCASIONS: Record<string, Text<WishOccasion, "season" | "dossier">> = {
  swieta: {
    name: "Prazniki",
    subject: "Zadeva: praznična voščila",
    dateline: "Varšava, v predprazničnem času",
  },
  "nowy-rok": {
    name: "Novo leto",
    subject: "Zadeva: novoletna voščila",
    dateline: "Varšava, ob prelomu leta",
  },
};

/** Every Christmas chapter starts with these, in the Polish order. */
const OPENERS = [
  "Inštitut ob bližajočih se praznikih pošilja pričujoča voščila.",
  "Obveščamo, da se je praznični čas začel po urniku.",
  "Na podlagi 412 terenskih opazovanj Inštitut izreka naslednja voščila.",
  "Inštitut je ugotovil, da je sveti večer, kot vsako leto, 24. decembra.",
  "Po posvetu z Oddelkom za priložnostno korespondenco posredujemo voščila po rednem postopku.",
  "S tem posredujemo praznična voščila v besedilu, usklajenem z družino.",
  "Dopis vročamo pred prvo zvezdo, v predpisanem roku.",
  "Inštitut beleži še eno leto brez sprememb v razporedu za mizo in izreka voščila.",
];

/** Every Christmas chapter's wishes start with these, in the Polish order. */
const WISHES = [
  "Želimo, da bi krap izpraznil kad najpozneje 23. decembra ob 18.00.",
  "Želimo dvanajst jedi, od tega največ tri z zeljem.",
  "Želimo, da bi se daljinec našel pred filmom Sam doma, ne med njim.",
  "Želimo nogavice v drugačni barvi kot lani, ob nespremenjeni velikosti.",
  "Želimo, da bi lučke na smrečici zasvetile v prvem poskusu, brez iskanja pregorele žarnice.",
  "Želimo, da bi bilo število cmokov deljivo s številom gostov.",
];

/** Every Christmas chapter ends with these, in the Polish order. */
const CLOSERS = [
  "Voščila veljajo do 6. januarja in jih ni mogoče zamenjati.",
  "Dopis ne zahteva odgovora, vendar bo Inštitut njegovo odsotnost zabeležil.",
  "Kopija pričujočih voščil je shranjena v arhivu.",
  "Potrdilo o prejemu oddajte za mizo, s kimanjem.",
  "Reklamacije sprejemamo po praznikih, med 8.00 in 8.15.",
  "Vsaka podobnost z lanskimi voščili je namerna.",
  "Če odgovora ne bo v 14 dneh, bo Inštitut štel voščila za vrnjena.",
  "Voščila se sme posredovati naprej brez spremembe besedila.",
];

export const CHAPTERS: Record<string, Text<WishChapter, "slug" | "plate">> = {
  "swieta-wujek": {
    name: "Za strica",
    short: "Stric",
    salutation: "Spoštovani gospod stric!",
    openers: [
      ...OPENERS,
      "Inštitut beleži, da gospod stric že 31 let sedi na istem mestu za mizo.",
      "Uvodoma se zahvaljujemo za vsakoletno navodilo za rezanje krapa.",
    ],
    wishes: [
      ...WISHES,
      "Želimo, da bi zgodba o fiatu 126p iz leta 1987 letos našla novega poslušalca.",
      "Želimo, da bi naslanjač pred televizorjem ostal prost ves čas, ko ste v kuhinji.",
      "Želimo dremež v naslanjaču najpozneje ob 19.40, v skladu s tradicijo.",
      "Želimo, da bi pot domov potekala natanko tako, kot ste jo načrtovali za mizo.",
      "Želimo, da bi zdravica, izrečena stoje, trajala manj kot šest minut.",
      "Želimo, da bi smrečica letos stala ravno, brez časopisa pod stojalom.",
    ],
    closers: [...CLOSERS, "Odgovor »Hvala, enako« bo sprejet kot zadosten.", "Mesto za mizo ostaja rezervirano, kot vsako leto."],
  },
  "swieta-szwagier": {
    name: "Za svaka",
    short: "Svak",
    salutation: "Spoštovani gospod svak!",
    openers: [
      ...OPENERS,
      "Inštitut pošilja voščila skupaj z zahvalo za vrtalnik, izposojen maja.",
      "Uvodoma opominjamo, da letos stole pripeljete vi.",
    ],
    wishes: [
      ...WISHES,
      "Želimo, da bi bila avtopralnica 23. decembra odprta, vrsta pa krajša od treh avtomobilov.",
      "Želimo, da vas letos za mizo nihče ne bi vprašal, koliko porabi na sto kilometrov.",
      "Želimo parkirno mesto pred blokom, oddaljeno največ 40 metrov.",
      "Želimo, da dodatnega pogrinjka za popotnika tokrat ne bi zasedli vi.",
      "Želimo, da bi zimske gume, nameščene oktobra, končno prišle prav.",
      "Želimo pod smrečico ključ, ki ga v kompletu še nimate.",
    ],
    closers: [
      ...CLOSERS,
      "Vrtalnik lahko vrnete ob priložnosti, najbolje pred veliko nočjo.",
      "Nadaljnje dogovore glede parkiranja posredujemo po telefonu.",
    ],
  },
  "swieta-szef": {
    name: "Za šefa",
    short: "Šef",
    salutation: "Spoštovano vodstvo!",
    openers: [
      ...OPENERS,
      "V zvezi z zadnjim sestankom pošiljamo praznična voščila.",
      "V skladu z dogovorom s ponedeljkovega statusnega sestanka Inštitut izreka voščila.",
    ],
    wishes: [
      ...WISHES,
      "Želimo, da bi nabiralnik 23. decembra dosegel ničlo in tak tudi ostal.",
      "Želimo, da noben sestanek ne bi bil prestavljen na 27. december.",
      "Želimo, da bi zadeve »za včeraj« počakale do januarja.",
      "Želimo rezultat nad načrtom in sveti večer brez klica iz pisarne.",
      "Želimo, da bi bil samodejni odgovor »Nisem v pisarni« letos resničen.",
      "Želimo koledar brez enega samega vabila od 24. decembra do 1. januarja.",
    ],
    closers: [...CLOSERS, "Prosimo, ne odgovarjajte vsem.", "Na voljo smo od 2. januarja, od 9.00 dalje."],
  },
  "swieta-rodzina": {
    name: "Od vse družine",
    short: "Družina",
    salutation: "Spoštovani!",
    cosigner: "v imenu vse družine, v polni zasedbi",
    openers: [
      ...OPENERS,
      "Vsa družina po glasovanju za mizo soglasno posreduje voščila.",
      "Družina pošilja voščila prek Inštituta, ker v skupini tako ali tako nihče ne bere.",
    ],
    wishes: [
      ...WISHES,
      "Želimo, da bi imela družinska skupina letos manj kot 400 neprebranih sporočil.",
      "Želimo skupinsko fotografijo v prvem poskusu, vsi z odprtimi očmi.",
      "Želimo, da nihče ne bi spal na raztegljivem naslanjaču dlje kot dve noči.",
      "Želimo, da bi ostanki s svetega večera pošli pred silvestrovim.",
      "Želimo, da za mizo nihče ne bi vprašal, kdaj bo poroka, kdaj otroci in koliko je to stalo.",
      "Želimo, da bi vsi prišli pravočasno, brez izgovarjanja na gnečo na obvoznici.",
    ],
    closers: [...CLOSERS, "Podpisano v imenu vseh, tudi odsotnih.", "Fotografija z večerje bo v skupino poslana v treh izvodih."],
  },
  "nowy-rok": {
    name: "Za novo leto",
    short: "Novo leto",
    salutation: "Spoštovani!",
    openers: [
      "Ob novem letu Inštitut pravočasno izreka voščila.",
      "Inštitut potrjuje, da se bo novo leto začelo po načrtu, opolnoči.",
      "Po zaključku knjig Inštitut ugotavlja, da se je staro leto izteklo.",
      "Uvodoma se zahvaljujemo za sodelovanje v iztekajočem se letu, tudi za neuspešno.",
      "Obveščamo, da so bile lanske zaobljube zaključene brez obravnave.",
      "Ob koncu koledarskega leta pošiljamo voščila po rednem postopku.",
      "Inštitut je preštel iztekajoče se leto in izreka voščila za naslednjih 365 dni.",
      "S tem odpiramo novo opazovalno leto in izrekamo voščila.",
      "Dopis pošiljamo pred polnočjo, preden se omrežje zatakne.",
      "Po tradiciji Inštitut izreka voščila, preden kdo odpre penino.",
    ],
    wishes: [
      "Želimo, da bi se penina odprla opolnoči, ne ob 23.58 v smeri lestenca.",
      "Želimo, da bi opolnoči vse ure v hiši kazale isti čas.",
      "Želimo, da bi se letnica v dokumentih nehala zapisovati narobe najpozneje sredi februarja.",
      "Želimo, da bi novoletne zaobljube zdržale vsaj do prvega ponedeljka.",
      "Želimo, da bi bila karta za fitnes letos v uporabi dlje kot do 19. januarja.",
      "Želimo, da bi se sosedov ognjemet končal pred 0.15.",
      "Želimo leto, v katerem bo vprašanje »kdaj bo poroka« padlo največ enkrat.",
      "Želimo, da bi se silvestrski koncert na televiziji slišal samo v eni sobi.",
      "Želimo, da bi vsa voščila iz družinske skupine uspeli prebrati do 3. januarja.",
      "Želimo, da bi novi koledar visel na steni pred 10. januarjem.",
      "Želimo, da francoska solata ne bi prešla v novo leto v več kot eni skledi.",
      "Želimo, da bi vsi SMS-i z voščili prispeli še isto noč.",
    ],
    closers: [
      "Neizkoriščena voščila se prenesejo v naslednje leto.",
      "Voščila veljajo 365 dni, razen ob ponedeljkih.",
      "Letno bilanco bo Inštitut poslal z ločenim dopisom.",
      "Prosimo, da ta dopis shranite do 31. decembra za primerjavo.",
      "Srečno novo leto. Tako se reče, Inštitut je preveril.",
      "Naslednja voščila bo Inštitut poslal čez eno leto, če se nič ne spremeni.",
      "Dopis ne zahteva odgovora pred 2. januarjem.",
      "Kopija voščil je shranjena v arhivu za primer reklamacije.",
      "Voščila so sestavljena v enem izvodu, za razpošiljanje vsem.",
      "Odgovor »Enako« Inštitut jemlje na znanje.",
    ],
  },
};
