import type { SlangEntry } from "@/content/slang";
import type { Text } from "@/i18n/overlay";

/*
 * Mladinski slovar za dziaderse. The words are the same in both countries' playgrounds, mostly
 * English; the plain meaning is given in Slovenian. "Młodzieżowe Słowo Roku" is the Polish PWN
 * plebiscite and stays Polish in a note, as the Institute reports on Polish youth.
 */

type SlangText = Text<SlangEntry, "slug" | "word" | "variants" | "phrase" | "checked">;

const MSR = "poljskega plebiscita Mladinska beseda leta";

export const SLANG_TEXT: Record<string, SlangText> = {
  "67": {
    grammar: "medmet, izgovorjen po angleško",
    meaning:
      "Vzklik brez stalnega pomena, izgovorjen po angleško (»six seven«) s kretnjo dlani, ki se izmenično dvigata in spuščata kot pri tehtanju. Pade, ko se v pogovoru pojavi število 67, pogosto pa tudi brez razloga. Če kaj pomeni, je to »tako-tako«, »ne vem, mogoče«.",
    origin:
      "Iz pesmi »Doot Doot (6 7)« ameriškega raperja Skrille (2024), ki se je razširila s posnetki košarkarja LaMela Balla, visokega 6 čevljev in 7 palcev. Dictionary.com je »6-7« razglasil za besedo leta 2025; bila je tudi v finalu " + MSR + " 2025.",
    example: "— Koliko strani moramo prebrati? — Sedeminšestdeset. — Six seven!",
    dziaders:
      "Ustreznik »tja v en dan«, izrečen z gibom rok kot pri ocenjevanju lubenice na tržnici. Smisla se ne išče. Inštitut ga je iskal dve četrtletji; smisel se ni razkril.",
    reaction: "Sedeminšestdeset je letnik mojega fiata¹. Tudi nihče ni vedel, zakaj tako vozi.",
    notes: ["¹ Fiat: poljski fiat 125p, ki so ga v Varšavi začeli izdelovati leta 1967. Slovenski bralec ga pozna kot zastavo 125PZ."],
  },
  aura: {
    grammar: "samostalnik",
    meaning:
      "Nevidno točkovanje karizme in sproščenosti. Kdor se odreže s slogom, dobi auro (»+1000 aure«), kdor se osramoti, jo izgubi (»−1000 aure«). »Aura farming« je načrtno poziranje kot nekdo, ki ima veliko aure.",
    origin: "Iz angleškega spletnega slenga, od približno leta 2024. V finalu " + MSR + " 2024 in 2026.",
    example: "Pred vsem razredom se je spotaknil na stopnicah. Minus tisoč aure.",
    dziaders:
      "Nekoč »spoštovanje v soseski«. Dziaders izgubi auro, ko javno ne zna plačati s telefonom, in jo dobi nazaj, ko izvleče bankovec in reče: »Kar obdržite.«",
    reaction: "Pri meni je aura samo ena: pritisk. V kolenu čutim, da bo dež.",
  },
  cringe: {
    grammar: "samostalnik in pridevnik, nesklonljiv",
    meaning:
      "Nekaj nerodnega, mučnega, kar opazovalcu vzbudi sram namesto drugega. »Totalni cringe« pomeni približno »kakšna sramota«. Iz angleškega »to cringe«, skrčiti se, zdrzniti se.",
    origin: "Iz angleščine, na spletu od druge polovice 2010-ih. V finalu " + MSR + " 2022.",
    example: "Ata je na svatbi plesal na pesem s TikToka. Cringe.",
    dziaders:
      "Občutek, znan ob gledanju lastnih svatbenih fotografij iz leta 1994. Inštitut je ugotovil, da cringe najpogosteje sproži dziaders, ki skuša uporabljati besede iz tega slovarja.",
    reaction: "Cringe? Jaz se ničesar ne sramujem. To imam po očetu.",
  },
  delulu: {
    grammar: "pridevnik, nesklonljiv",
    meaning:
      "Ljubkovalna oblika angleškega »delusional«: odtrgan od resničnosti, živeč v iluzijah, navadno nenevarnih, na primer da mu bo slavni pevec odgovoril na sporočilo. Pogosto z nasmeškom: »delulu is the solulu«, iluzija kot način življenja.",
    origin: "Iz oboževalskih skupnosti K-popa in TikToka; na spletu od približno leta 2023.",
    example: "Misli, da bo ujel vlak, če gre od doma tri minute pred odhodom. Delulu.",
    dziaders:
      "Stanje človeka, prepričanega, da bo pralni stroj popravil brez navodil, v eni uri, in da mu ne bo ostal noben vijak. Inštitut ima v kartoteki številne primere.",
    reaction: "Delulu si ti, če misliš, da boš za ta denar kupil stanovanje.",
  },
  fr: {
    grammar: "kratica",
    meaning:
      "Kratica angleškega »for real«: res, zares. Potrdi ali okrepi izjavo (»fr, ne hecam se«) ali vpraša, ali kdo misli resno (»fr?«). Za večji poudarek: »fr fr«.",
    origin: "Iz afroameriške angleščine, prek družbenih omrežij. V finalu " + MSR + " 2025.",
    example: "To je bil najtežji test v mojem življenju, fr.",
    dziaders: "Ustreznik »častna beseda« in »pri moji veri«. V dziaderski rabi napove zgodbo o zimi, ob kateri so današnje zime pomlad.",
    reaction: "Častna beseda: take zime kot devetinsedemdesetega¹ ne bo nikoli več.",
    notes: ["¹ Devetinsedemdesetega: na Poljskem »zima stoletja« 1978/79, ko so sneg in mraz ustavili vlake in elektrarne."],
  },
  goat: {
    grammar: "samostalnik, kratica",
    meaning:
      "Kratica angleškega »greatest of all time«: najboljši vseh časov. Govori se o športniku ali umetniku, za šalo pa o prijatelju, ki je prinesel pico. Včasih s kozo med emojiji, ker je »goat« po angleško koza.",
    origin: "Iz ameriškega športnega slenga s preloma devetdesetih in dvatisočih. V finalu " + MSR + " 2025.",
    example: "Babica je naredila pirohe za ves teden. GOAT.",
    dziaders: "Naziv, ki ga dziaders podeli samo igralcem izpred leta 1982. Kdor je igral pozneje, »se ne more primerjati«.",
    reaction: "Najboljši vseh časov je bil Deyna¹ in o tem se ne bomo pogovarjali.",
    notes: ["¹ Kazimierz Deyna: kapetan poljske reprezentance, ki je bila na svetovnem prvenstvu 1974 tretja. Za poljskega dziadersa merilo vsega nogometa."],
  },
  idk: {
    grammar: "kratica",
    meaning:
      "Kratica angleškega »I don't know«: ne vem. V sporočilih je kratek odgovor, pogosto v pomenu »nimam mnenja« ali »ne da se mi razmišljati o tem«.",
    origin: "Iz angleškega slenga kratkih sporočil in klepetalnic, v rabi od dvatisočih.",
    example: "— Kaj bo za kosilo? — idk.",
    dziaders:
      "Izraz, neznan v dziaderskem okolju. Inštitut ni zabeležil primera, ko dziaders česa ne bi vedel. Zabeležil je primere, ko je vedel drugače.",
    reaction: "Kako ne veš? Na televiziji so rekli.",
  },
  larp: {
    grammar: "samostalnik; glagol: larpati",
    meaning:
      "Pretvarjati se, da si nekdo drug; igrati vlogo za ogled. »Larpa bogataša« pomeni, da bogataša samo igra. Iz kratice LARP, »live action role-playing«: igranje vlog v živo, v kostumih.",
    origin: "Iz angleškega spletnega slenga. V finalu " + MSR + " 2026.",
    example: "Objavlja slike iz fitnesa, ampak športnika samo larpa.",
    dziaders:
      "Preoblačenje v delovni kombinezon, da bi zamenjal žarnico. Inštitut ima larp za temeljno dziadersko tehniko, zlasti v trgovini z gradbenim materialom.",
    reaction: "Jaz se ničesar ne delam. Strešno lepenko sem polagal, ko si ti še plenice nosil.",
  },
  lowkey: {
    grammar: "prislov",
    meaning:
      "»Malo«, »po tihem«, »ne da bi to rekel na glas«. Omili priznanje: »lowkey mi je všeč« pomeni »pravzaprav mi je všeč, a iz tega ne delam zgodbe«. Nasprotje: »highkey«, odkrito, zelo.",
    origin: "Iz angleškega »low-key«: umirjen, diskreten. V finalu " + MSR + " 2025.",
    example: "Lowkey pogrešam počitnice na morju s starši.",
    dziaders: "Stopnja navdušenja, ki jo dziaders pokaže ob tujih dosežkih. »No, bo že« je dziaderska pohvala lowkey.",
    reaction: "Jaz nič ne delam po tihem. Če mi ni všeč, povem.",
  },
  pov: {
    grammar: "kratica",
    meaning:
      "Kratica angleškega »point of view«, zorni kot. V opisih posnetkov na TikToku in Instagramu uvede prizor, v katerega naj se gledalec vživi: »POV: ata ti kaže, kako se parkira«.",
    origin: "Iz filmskega jezika (kader z vidika junaka); na družbenih omrežjih od konca 2010-ih.",
    example: "POV: si na družinskem kosilu in nekdo vpraša, koliko zaslužiš.",
    dziaders: "Zgodba, ki se začne z »Predstavljaj si, da …«. Razlika: POV traja petnajst sekund.",
    reaction: "Kakšen POV? Jaz imam svoj zorni kot in se v tridesetih letih ni spremenil.",
  },
  rizz: {
    grammar: "samostalnik",
    meaning:
      "Osebni čar, spretnost osvajanja in pridobivanja ljudi. Okrajšava angleškega »charisma«. »Imeti rizz« pomeni imeti dober jezik; »zrizzati koga« pomeni koga očarati.",
    origin: "Razširil ga je ameriški streamer Kai Cenat. Beseda leta 2023 po izboru Oxford University Press.",
    example: "Ogovoril je novo sošolko in takoj dobil njeno številko. Rizz.",
    dziaders: "Tisto, kar je imel dziaders na veselici v gasilskem domu leta 1978, po pričevanju samega dziadersa. Priče se niso ohranile.",
    reaction: "Rizz? Jaz sem ženo spoznal v avtošoli. Pri levem zavijanju, brez bližnjic.",
  },
  sigma: {
    grammar: "samostalnik in pridevnik",
    meaning:
      "Nekdo samozavesten, neodvisen, ki hodi po svoji poti in ne potrebuje odobravanja skupine. Pogosto ironično: o nekom, ki se samo dela samotnega volka, ali preprosto o nečem dobrem (»sigma ideja«).",
    origin: "Iz spletne »hierarhije samcev« (alfa, beta, sigma) in memov o »sigma samcu«. Zmagovalka " + MSR + " 2024.",
    example: "Med odmorom sedi sam in je sendvič. Sigma.",
    dziaders:
      "Samotni moški ob žaru, ki ne preda klešč in ne prosi za nasvet. Dziaders je bil sigma, še preden je bilo to moderno, le da se je temu reklo »karakter«.",
    reaction: "Sigma je bila črka pri matematiki. Pri matematiki sem imel petico.",
  },
  skibidi: {
    grammar: "medmet in pridevnik, nesklonljiv",
    meaning:
      "Beseda brez stalnega pomena, vržena v stavek za absurd ali poudarek; lahko pomeni »super«, »grozno« ali nič. Izvira iz animirane serije »Skibidi Toilet« na YouTubu, v kateri iz straniščnih školjk pojejo glave. Uporabljajo jo predvsem otroci.",
    origin: "Iz serije »Skibidi Toilet« (od leta 2023). V finalu " + MSR + " 2024 in 2025.",
    example: "Skibidi test iz zgodovine.",
    dziaders:
      "Najbližja ustreznika sta »tralala« in »bla, bla, bla«. Inštitut odsvetuje iskanje smisla in opozarja, da ogled izvorne serije v celoti ne pomaga.",
    reaction: "V mojih časih je bila risanka za lahko noč. Tudi nihče ni vedel, za kaj gre, ampak ob sedmih zvečer.",
  },
  slay: {
    grammar: "glagol in medmet",
    meaning:
      "Pohvala: odlično izgledati, odlično kaj narediti, »raztura«. Govori se o oblačilu, nastopu ali opravljenem izpitu. Iz angleškega »to slay«, dobesedno »ubiti«, v smislu »vse pustiti brez besed«.",
    origin: "Iz slenga newyorške scene ballroom, razširil ga je TikTok. V finalu " + MSR + " 2025.",
    example: "Nova frizura? Slay.",
    dziaders: "Kompliment, ustreznik »elegantno«, izrečenega ob odhodu od frizerja. Z besedo »ubiti« ima skupen samo slovar.",
    reaction: "Slay so po angleško sani. Učil sem se na tečaju v podjetju.",
  },
  sybau: {
    grammar: "kratica, vulgarna",
    meaning:
      "Kratica angleškega »shut your bitch ass up«, torej vulgarnega »utihni«. Navadno z malimi črkami, kot oster odgovor na tujo izjavo. Med prijatelji je včasih šala, do neznanca zveni žaljivo.",
    origin: "Iz angleškega TikToka in omrežja X, razširjena leta 2025.",
    example: "— A veš, da je bilo nekoč … — sybau.",
    dziaders:
      "Isto, kar se je nekoč izrazilo z zaprtjem vrat v sobo. Inštitut ugotavlja, da je kratica od predavanja, ki ga prekine, krajša povprečno za štirideset minut.",
    reaction: "Kakšen sybau? Govori slovensko, ko se pogovarjaš z očetom.",
  },
  szponcic: {
    grammar: "glagol (poljsko); samostalnik: szpont",
    meaning:
      "Poljska beseda z več pomeni, odvisno od položaja: početi kaj tveganega, nagajivega ali neumnega, pa tudi delovati z energijo, se znajti, flirtati. »Szpont« je vragolija, zmeda, včasih napaka. Lahko izraža neodobravanje ali občudovanje.",
    origin: "Zmagovalka " + MSR + " 2025. Splošni slovarji tega pomena še ne beležijo.",
    example: "Na izletu smo szponcili do jutra.",
    dziaders: "Nekdanje »norčije« in »žuriranje« v eni besedi. Za szpont ima dziaders tudi vsak poskus, da bi žar prižgal s podžigačem.",
    reaction: "Szpunt¹ se zabije v sod. Tega vas v šoli ne učijo?",
    notes: ["¹ Szpunt: poljsko za čep na sodu, iz nemškega Spund. Dziaders sliši »szpont« in razume »szpunt«."],
  },
  tbh: {
    grammar: "kratica",
    meaning:
      "Kratica angleškega »to be honest«: če sem iskren. Stoji na začetku ali koncu sporočila, navadno pred mnenjem, s katerim se drugi morda ne bo strinjal.",
    origin: "Iz angleškega spletnega slenga, v rabi od dvatisočih.",
    example: "Tbh, film je bil predolg.",
    dziaders: "Skrajšani »povem ti po pravici«, po katerem dziaders pove isto kot prej, le glasneje.",
    reaction: "Povem ti po pravici, in to brez kakršnih koli kratic.",
  },
  tuff: {
    grammar: "pridevnik, nesklonljiv",
    meaning:
      "Namerno popačeni angleški »tough«: močan, odličen, impresiven. Govori se o čevljih, potezi na tekmi, odgovoru pred tablo. Redkeje v prvotnem pomenu: težek, neprijeten (»tuff, izgubili smo«).",
    origin: "Iz angleškega spletnega slenga. V finalu " + MSR + " 2025 in 2026.",
    example: "Ti čevlji so tuff.",
    dziaders: "Nekdanji »car«, še prej »bomba«. Velja za stvari, ki jih dziaders oceni z besedami »dobro, ker je nemško«.",
    reaction: "Kakšen tuff? Soliden. Reče se: soliden.",
  },
  twin: {
    grammar: "samostalnik, navadno v nagovoru",
    meaning:
      "Nagovor bližnjemu prijatelju ali nekomu, ki misli in se vede podobno: »stari«, »brat«, sorodna duša. Ne pomeni dvojčka. »Twin, greva na igrišče.«",
    origin: "Iz angleškega spletnega slenga. V finalu " + MSR + " 2025.",
    example: "Tudi ti nisi naredil naloge? Twin.",
    dziaders: "Nekdanji »svak«, rečen nekomu, ki ni svak. Namen je isti: označiti svojega človeka.",
    reaction: "Kakšen twin? Sem edinec. Starši so rekli, da je eden dovolj.",
  },
  unc: {
    grammar: "samostalnik",
    meaning:
      "Okrajšava angleškega »uncle«: stric. Šaljivo o nekom starejšem, ki ne sledi trendom ali se vede »po stričevsko«, tudi o vrstniku čez trideset. »Unc behavior« je vedenje, ki ga povezujemo s starejšo generacijo.",
    origin: "Iz angleškega spletnega slenga. V finalu " + MSR + " 2026.",
    example: "V skupino je poslal fotografijo, posneto s tablico. Unc behavior.",
    dziaders:
      "Ta beseda opisuje dziadersa. Inštitut z zadovoljstvom ugotavlja, da je mladina vrsto izločila sama, čeprav brez latinskega imena in brez Atlasa.",
    reaction: "Kakšen unc? Stric. Zate stric Zbyszek.",
  },
};
