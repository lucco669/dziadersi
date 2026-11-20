import type { Dossier } from "@/content/dossiers";
import type { Text } from "@/i18n/overlay";

type DossierText = Text<Dossier, "slug" | "code" | "bingo" | "dictionary" | "caseSlug" | "reportSlug">;
export const DOSSIER_TEXT: Record<string, DossierText> = {
  wigilia: {
    title: "Sveti večer z dziadersem",
    short: "Sveti večer",
    season: "24. december · družinska miza",
    lead: "Terenski vodnik po večerji, med katero temperatura v sobi raste, termostat pa ostaja na dvojki. Simptomi, oglašanje in bingo za sveti večer za tisk.",
    introduction: [
      "Svetovečerni dziaders se pojavi pred prvo zvezdo. Preveri, ali stoli praskajo tla, določi vrstni red jedi in opozori, da je bila riba lani cenejša. Ni ga treba iskati. Sam prevzame položaj.",
      "Opazuj pri svojem krožniku. Zapisuj izjave, ne imen. En stavek o ceni krapa še ne zadošča za določitev vrste; ponovitev po vsaki jedi pa že omogoča določitev ritma aktivnosti.",
    ],
    signals: [
      "Daljinec izgine pred začetkom večerje.",
      "Število jedi je preverjeno dvakrat.",
      "Cena krapa se vrne v treh različnih pogovorih.",
      "Navodila vsakega darila mora prebrati gostitelj.",
    ],
    protocol: [
      {
        title: "Pred prvo zvezdo",
        text: "Razdeli bingo listke in pripravi kemične svinčnike. Dogovorite se, da prečrtavate slišane stavke, ne udeležencev večerje. Telefon odloži z zaslonom navzdol.",
      },
      {
        title: "Med večerjo",
        text: "Opazuj brez namigovanja na gesla. Vprašanje o lanskem računu za ogrevanje je poseg v okolje, ne terenska raziskava.",
      },
      {
        title: "Po kompotu",
        text: "Primerjajte listke. Pet polj v eni vrsti pomeni bingo. Sporno izjavo predloži Komisiji; družinsko glasovanje lahko poteka po sladici.",
      },
    ],
    packing: [
      "Štirje različni listki na eni strani A4",
      "Kemični svinčnik za vsakega opazovalca",
      "Atlas, odprt pri svetovečerni vrsti",
      "Zaloga potrpljenja brez roka uporabe",
    ],
    questions: [
      {
        question: "Koliko jedi je na poljskem svetem večeru?",
        answer:
          "Po tradiciji dvanajst, vse brez mesa: med drugim barszcz z uszki (rdeča pesna juha z majhnimi cmoki), krap, pierogi, zelje z grahom, kutia in kompot iz suhega sadja. V mnogih domovih jih štejejo bolj približno. Svetovečerni dziaders jih prešteje dvakrat in vedno mu jih pride enajst.",
      },
      {
        question: "Kdaj se začne poljska večerja na sveti večer?",
        answer:
          "Po običaju, ko se na nebu prikaže prva zvezda. V praksi ob uri, ki jo določi oseba, ki pazi na krapa, ne glede na oblačnost.",
      },
      {
        question: "Kaj je opłatek?",
        answer:
          "Tanek oblat iz moke in vode, ki si jo pred večerjo razdelijo vsi za mizo in si ob tem voščijo. Slovenski sveti večer pozna kropljenje in kajenje doma, jaslice in polnočnico; Poljaki imajo opłatek in darila takoj po večerji. V tem trenutku svetovečerni dziaders vsem zaželi zdravja, nato pa dve minuti razlaga, kaj je zdravo.",
      },
      {
        question: "Zakaj je za poljsko mizo prazen pogrinjek?",
        answer:
          "Dodatni pogrinjek je namenjen nepričakovanemu gostu, v mnogih družinah pa tudi v spomin na bližnje, ki jih za mizo ni več. Po opažanjih Inštituta je to edini stol, ki ga nihče ne premakne.",
      },
      {
        question: "Kako preživeti sveti večer z dziadersom?",
        answer:
          "Vnaprej določi varne teme, sedi stran od termostata in razdeli bingo. Prečrtavanje stavkov namesto odgovarjanja nanje zniža temperaturo pogovora za nekaj stopinj. Sporne izjave prepusti Komisiji.",
      },
    ],
    notes: [
      "Wigilia: poljska večerja na sveti večer, tradicionalno z dvanajstimi jedmi, krapom in kompotom iz suhega sadja. Začne se ob prvi zvezdi.",
    ],
  },
  wesele: {
    title: "Svatba z dziadersem",
    short: "Svatba",
    season: "Od juhe do zadnje skladbe",
    lead: "Navodila za opazovanje pri mizi številka sedem. Kako prepoznati svatbeno vrsto, kaj zapisati in kdaj razdeliti svatbeni bingo.",
    introduction: [
      "Svatbeni dziaders oceni dvorano, ansambel in ceno enega krožnika, še preden pride juha. Prvi ples spremlja s položaja izvedenca. Sam zapleše šele po pripombah na repertoar.",
      "Najboljše opazovališče je pri mizi. Na plesišču je težje pisati zapiske, izjavo o ceni dvorane pa lahko preglasi saksofon. Gradivo zbiraj med jedmi.",
    ],
    signals: [
      "Cena enega krožnika je ugotovljena pred juho.",
      "Ansambel prejme navodila glede normalne glasbe.",
      "Pot domov je obravnavana še pred torto.",
      "Kuverta ima lastno računovodsko zgodovino.",
    ],
    protocol: [
      {
        title: "Zasedi položaj",
        text: "Razdeli listke tistim, ki želijo igrati. Pri vsaki mizi lahko deluje posebna opazovalna skupina. Ne zapiraj poti natakarju.",
      },
      {
        title: "Zapisuj med jedmi",
        text: "Prečrtaj pomen izjave, ne zahtevaj dobesednega citata. Predavanje o vožnji in predavanje o ceni goriva sta dva pojava, tudi če med njima ni bilo premora.",
      },
      {
        title: "Zaključi zapisnik",
        text: "Bingo razglasi pri svoji mizi. Mikrofon ansambla ni del raziskovalne opreme. Rezultate primerjajte pred odhodom, ko se vsi še spomnijo, kdo je govoril.",
      },
    ],
    packing: [
      "Listki svatbenega binga",
      "Kemični svinčnik, ki piše",
      "Številka svoje mize",
      "Čevlji, ki omogočajo menjavo položaja",
    ],
  },
  majowka: {
    title: "Prvomajski vikend z dziadersem",
    short: "Prvomajski vikend",
    season: "Podaljšani vikend · vrtiček in žar",
    lead: "Vodnik po položaju ob žaru. Določanje vrst, varna razdalja od klešč in bingo za prvomajski vikend za tisk.",
    introduction: [
      "Prvomajski vikend združi tri močne populacije: žarno, vrtičkarsko in meteorološko. Vse vedo, kako zakuriti. Nobena ni odgovorna za dež. Poveljniški položaj prepoznaš po človeku, ki ne izpusti klešč.",
      "Raziskavo začni pred postavitvijo ležalnika. Pozneje dim zastira pogled, stavki o svinjski vratovini pa postanejo del ozadja. Ne popravljaj načina kurjenja samo zato, da bi dobil odziv.",
    ],
    signals: [
      "Klešče imajo enega uporabnika.",
      "Vremenska napoved se osvežuje pogosteje kot rešetka.",
      "Sosedova kosilnica moti mir, lastna opravlja delo.",
      "Vsaka porcija vratovine mora dovolj dolgo počivati.",
    ],
    protocol: [
      {
        title: "Določi teren",
        text: "Izberi mizico zunaj dima. Listke in svinčnike razdeli pred jedjo. Krožnik ni utež za zapisnik.",
      },
      {
        title: "Ohrani razdaljo",
        text: "Klešče so orodje in insignija. Opazuj predajo, vendar je ne sproži. Spor o oglju zapiši brez dodajanja svoje teorije.",
      },
      {
        title: "Primerjaj opažanja",
        text: "Pet polj v vrsti zaključi krog. Listek lahko še naprej dopolnjuješ. Po vrnitvi preveri v Atlasu, ali si opazoval eno vrsto ali mešano skupino.",
      },
    ],
    packing: ["Bingo za prvomajski vikend", "Podloga za listek", "Pokrivalo", "Lastno mnenje o gorčici, zadržano zase"],
  },
  imieniny: {
    title: "Godovanje z dziadersom",
    short: "Godovanje",
    season: "Vse leto · dnevna soba in kavč na razteg",
    lead: "Vodnik po praznovanju v dnevni sobi, od copat v predsobi do slovesa v predsobi. Družinski simptomi dziaderstva, značilna vprašanja in godovni bingo za tisk.",
    introduction: [
      "Godovanje¹ je družinski praznik, ki v mnogih poljskih domovih še vedno premaga rojstni dan. Poteka v dnevni sobi, ob raztegnjeni mizi in regalu, ki ve več kot gostje. Dziaders pride s šopkom in že na pragu preveri, ali lahko ostane v čevljih.",
      "Opazuj s kavča, najbolje s srednjega mesta. Od tam slišiš pogovor o plačah in posvet na balkonu. Zapisuj vprašanja o službi in stanovanju, a nanje ne odgovarjaj izčrpno: natančen odgovor podaljša trajanje simptoma.",
    ],
    signals: [
      "Copati za goste čakajo v predsobi, še preden kdo pride.",
      "Prvo vprašanje je o službi, drugo o plači.",
      "Televizor je ves večer prižgan brez zvoka.",
      "Slovo v predsobi traja dlje od sladice.",
    ],
    protocol: [
      {
        title: "Po prvem »Sto lat«²",
        text: "Razdeli bingo listke tistim, ki želijo igrati. Slavljenca oprosti opazovanja: dovolj dela ima z rezanjem torte.",
      },
      {
        title: "Za mizo",
        text: "Zapisuj vprašanja, ne odgovorov. »Koliko ti pa plačajo?« prečrtaj enkrat, tudi če je padlo pri vsaki jedi. Tuje plače ne računaj na prtičku; to je stričeva naloga.",
      },
      {
        title: "V predsobi",
        text: "Zapisnik zaključi pred slovesom, ker lahko slovo traja eno uro. Rezultate primerjajte na stopnišču, s pritišanim glasom.",
      },
    ],
    packing: [
      "Godovni bingo listki",
      "Lastni copati, za vsak primer",
      "Kemični svinčnik, skrit pred stricem s križanko",
      "Pripravljen odgovor na vprašanje o plači",
    ],
    questions: [
      {
        question: "Kaj je godovanje na Poljskem?",
        answer:
          "Praznik na dan svetnika, po katerem slavljenec nosi ime, po koledarju imen. Na Poljskem je bil, zlasti pri starejših generacijah, pogosto pomembnejši od rojstnega dne: ve se, kdaj je, in nihče ne sprašuje po letih.",
      },
      {
        question: "Kako je videti godovanje v poljskem domu?",
        answer:
          "Gostje pridejo s cvetjem, voščijo in zapojejo »Sto lat«. Sledijo zelenjavna solata, topla jed in torta. Inštitut beleži tudi vprašanja o službi, plači, stanovanju in poročnih načrtih, zastavljena v tem vrstnem redu.",
      },
      {
        question: "God ali rojstni dan?",
        answer:
          "Odvisno od družine. Mlajše generacije pogosteje praznujejo rojstni dan, starejše god. Dziaders praznuje oboje, a ob vsakem opomni, da se je nekoč praznoval samo god.",
      },
    ],
    notes: [
      "¹ Godovanje: poljsko imieniny. V Sloveniji god danes praznujejo redkeje kot rojstni dan; na Poljskem ga starejše generacije še vedno praznujejo z gosti in torto.",
      "² Sto lat: poljska pesem za rojstni dan in god, »sto let naj živi«. Slovenski bralec jo pozna kot »Kol'kor kapljic, tol'ko let«.",
    ],
  },
};
