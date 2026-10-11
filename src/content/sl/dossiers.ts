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
};
