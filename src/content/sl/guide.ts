import type { Guide } from "@/content/guide";
import type { Text } from "@/i18n/overlay";

export const GUIDE_TEXT: Text<Guide> = {
  title: "Dziaders — kdo je to?",
  lead: "Kaj pomeni »dziaders«, kako prepoznati dziaderstvo in zakaj sama starost ne zadošča. Uvod v zbirke Inštituta.",
  definition:
    "Dziaders je poljski pogovorni, navadno kritični izraz za osebo, ki drugim pridiga, lastne izkušnje obravnava kot dokončen argument in težko sprejme, da se je svet morda spremenil. V našem Atlasu ima različne podobe: od varuha žara do izvedenca za vsako prenovo.",
  context:
    "Beseda se lahko uporablja kot zbadljivka, njen pomen pa je odvisen od okoliščin. Inštitut opisuje navade, ne presoja vrednosti človeka. Naš katalog je satira, test pa igra; rezultat ni psihološka ali medicinska diagnoza.",
  signs: [
    {
      title: "Izkušnje zaključijo pogovor",
      text: "»To delam že trideset let« nadomesti odgovor na vprašanje, ali bi lahko poskusili drugače. Čas izvajanja opravila postane potrdilo o pravilnosti.",
    },
    {
      title: "Pomoč pride brez naročila",
      text: "Klešče, daljinec ali navodila so prevzeti, še preden uporabnik prosi za nasvet. Izvedenec začne delo brez predhodnega pogovora.",
    },
    {
      title: "Nekoč postane merska enota",
      text: "Zima, jeklo, avtomobili in vzgoja otrok so primerjani z nedoločenim vzornim obdobjem. To obdobje navadno sovpada z mladostjo govorca.",
    },
    {
      title: "Mnenje dobi status pravilnika",
      text: "»Jaz tega ne bi tako naredil« se spremeni v »tega se tako ne dela«. Lastna navada je objavljena kot predpis, ki velja za vse.",
    },
  ],
  distinction: [
    {
      title: "Starost",
      text: "Starejša oseba ne postane dziaders zaradi datuma rojstva. Mlajša ni oproščena. V Atlasu šteje vedenje, ne rojstni list.",
    },
    {
      title: "Znanje",
      text: "Sposobnost popravila pipe je koristna. Dziaderstvo se začne, ko izključuje vprašanja, druge rešitve in pravico lastnika, da pokliče mojstra.",
    },
    {
      title: "Običajna skrb",
      text: "Vprašanje, ali koga zebe, je skrb. Odločitev namesto njega, da ga ne zebe, ker termostat kaže dvojko, pa že zahteva terensko opazovanje.",
    },
  ],
  questions: [
    {
      question: "Je vsak oče ali dedek dziaders?",
      answer:
        "Ne. Sorodstvo in starost ne opisujeta teh navad. Tudi skupno pečenje na žaru ne zadošča; pomembno je, ali ob žaru ostane prostor za tuje mnenje.",
    },
    {
      question: "Se dziaderstvo nanaša samo na moške?",
      answer:
        "Na strani imajo vrste tradicionalne brke in moška imena. Navade, kot so pridiganje, nezmotljivost in nostalgija, pa se lahko pojavijo pri vsakomer.",
    },
    {
      question: "Kako preverim, ali sem sam dziaders?",
      answer:
        "Opraviš lahko satirični Test dziadersa. Traja približno štiri minute, obsega pet ordinacij in se konča z rezultatom ter certifikatom, ki ga lahko deliš.",
    },
    {
      question: "Kaj naredim, ko ta vedenja prepoznam pri bližnji osebi?",
      answer:
        "Pogovarjaj se o konkretni situaciji, namesto da lepiš oznake. V Inštitutu lahko prebereš podoben primer Komisije ali igraš bingo s tistimi, ki želijo sodelovati.",
    },
  ],
};
