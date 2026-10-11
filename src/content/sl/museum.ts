import type { Exhibit } from "@/content/museum";
import type { Text } from "@/i18n/overlay";

export const MUSEUM_TEXT: Record<string, Text<Exhibit, "slug" | "code" | "dictionarySlug" | "reportSlug">> = {
  "kabel-nieznanego-przeznaczenia": {
    name: "Kabel neznanega namena",
    subtitle: "Oba konca znana. Namen ne.",
    provenance: "Predal pod televizorjem",
    condition: "Popoln, zavezan z lastnim koncem",
    location: "Predal I · povezave",
    history: [
      "Ohranjen po napravi, katere imena se nihče več ne spomni. Vtič je videti znan, kar je veljalo za zadosten dokaz uporabne vrednosti.",
      "Ob vsaki selitvi pristane v posebni vrečki z napisom »pomembno«. Vrečka je manj trajna od eksponata.",
    ],
    reason: "Ne zavrzi. Ko ga boš potreboval, ravno takega ne boš mogel kupiti.",
    nextUse: "Po nakupu naprave, združljive z neugotovljenim standardom.",
  },
  "pilot-bez-telewizora": {
    name: "Daljinec brez televizorja",
    subtitle: "Sprejemnik je odšel. Oblast je ostala.",
    provenance: "Košarica ob sedanjem daljincu",
    condition: "Baterije odstranjene, avtoriteta ohranjena",
    location: "Predal II · upravljanje",
    history: [
      "Televizor je šel naprej, daljinec pa je ostal kot rezerva. Ne ustreza novemu sprejemniku. To ni očitek daljincu.",
      "Tipka za glasnost kaže sledove dolgoletne službe. Tipka za utišanje je ohranila tovarniško stanje.",
    ],
    reason: "Daljinec je dober. Televizorji so se spremenili.",
    nextUse: "Po vrnitvi ustreznega televizorja v obtok.",
  },
  "sloik-ze-srubkami": {
    name: "Kozarec z vijaki",
    subtitle: "Zaloga za vse stvari razen te, ki jo popravljamo.",
    provenance: "Polica za ozimnico",
    condition: "Mešani navoji, popolna pripravljenost",
    location: "Predal III · pritrdilni elementi",
    history: [
      "Posoda je začela kot embalaža za kumarice. Po spremembi dejavnosti zbira vijake, podložke in en element, ki se ga ne smeš dotakniti.",
      "Pregled obsega stresanje vsebine na časopis, izbiro treh podobnih vijakov in vračanje vsega v kozarec.",
    ],
    reason: "Trgovina je zaprta, tukaj pa imaš vse.",
    nextUse: "Ko bo potreben vijak poljubne mere, ki ni iskana mera.",
  },
  "karton-po-sprzecie": {
    name: "Škatla od naprave",
    subtitle: "Garancija je potekla. Škatla še velja.",
    provenance: "Zgornja polica v kleti",
    condition: "Originalni stiropor, neoriginalna vsebina",
    location: "Predal IV · embalaža",
    history: [
      "Ohranjena za reklamacijo, selitev in dogodek, ki ga ni mogoče predvideti. Naprava je bila zamenjana. Dogodek se še vedno lahko zgodi.",
      "V njej je manjša škatla. Tudi ta ima zaščitni namen.",
    ],
    reason: "Brez originalne škatle tega ne bodo sprejeli.",
    nextUse: "Med selitvijo, ki ostaja v načrtih.",
  },
  "ladowarka-do-starego-telefonu": {
    name: "Polnilnik za stari telefon",
    subtitle: "Energetska pripravljenost brez naročnika.",
    provenance: "Torba z elektroniko",
    condition: "Kabel ovit okoli napajalnika",
    location: "Predal V · napajanje",
    history: [
      "Telefon je po spremembi paketa izginil iz uporabe. Polnilnik je ohranil status strateške opreme, ker »takih ne delajo več«.",
      "Vtič ne ustreza nobeni sedanji napravi. V zbirki pa je še en polnilnik z enakim vtičem.",
    ],
    reason: "To je pošten polnilnik, ne kot ti današnji.",
    nextUse: "Po najdbi telefona v škatli od drugega telefona.",
  },
  "instrukcja-do-niczego": {
    name: "Navodila za nič",
    subtitle: "Naprave ni. Dokumentacija je popolna.",
    provenance: "Fascikel »naprave«",
    condition: "Poljsko besedilo označeno, ostalo nedotaknjeno",
    location: "Predal VI · dokumentacija",
    history: [
      "Navodila so bila ohranjena kljub dolgoletni izjavi, da navodila niso potrebna. Protislovje je veljalo za navidezno: dokumentacija je za prihodnje rodove.",
      "Na zadnji strani je zapisana številka servisa. Ima premalo števk.",
    ],
    reason: "Jaz tega ne berem, ampak naj leži.",
    nextUse: "Pri ugotavljanju, čemu služi naprava, ki je ni več.",
  },
};
