import type { Text } from "@/i18n/overlay";
import type { Cast } from "../wax";

/*
 * Vlivanje voska. Casts are keyed by their slug, which stays Polish because it is part of the code.
 * Prophecies keep the Polish order and length. Slovenian future tense is gendered (boš kupil/a), so
 * prophecies use the perfective present or impersonal sentences: the reader may be anyone.
 */

export const CASTS: Record<string, Text<Cast, "slug">> = {
  szczypce: {
    shape: "Klešče za žar",
    reading: "Senca se razpre kot klešče in se noče zapreti. Branje je nedvoumno: v prihodnji sezoni ti jih nihče ne vzame.",
  },
  sandal: {
    shape: "Sandal z nogavico",
    reading: "Jasen podplat, jasen pašček, v višini gležnja pa odebelitev, ki je lahko samo nogavica. Odlitek napoveduje poletje, ki se začne aprila.",
  },
  kombi: {
    shape: "Karavan s strešnim kovčkom",
    reading: "Dolga silhueta, previs zadaj in grba na strehi. Laboratorij redko vidi tako jasen strešni kovček, praznega pa še nikoli.",
  },
  wiadro: {
    shape: "Vedro z dnom navzgor",
    reading: "Predmet, ki se postavi na prosto parkirno mesto, preden kdo parkira nanj. Odlitek stoji trdno in se ne namerava umakniti.",
  },
  kielnia: {
    shape: "Zidarska žlica",
    reading: "Trikotno rezilo in kratek ročaj. Senca kaže na zaključna dela, ki jih je opravil nekdo drug in jih bo treba popraviti.",
  },
  kciuk: {
    shape: "Palec gor",
    reading: "Pest z dvignjenim palcem. V starih vedeževanjih znamenje sreče, danes odziv pod fotografijo sestrične z dopusta.",
  },
  pilot: {
    shape: "Daljinec",
    reading: "Podolgovata oblika z gumbi. Odlitek se lepo prilega dlani in ne gre v roke drugim družinskim članom.",
  },
  konewka: {
    shape: "Zalivalka",
    reading: "Trebušasto telo in dolg dulec. Odlitek zaliva vrt tudi takrat, ko dežuje, ker dež ni isto.",
  },
  ryba: {
    shape: "Krap",
    reading: "Luske, plavuti in izraz nekoga, ki ve, kaj ga čaka decembra. Laboratorij svetuje, da ne sprašuješ, kje bo odlitek preživel praznike.",
  },
  krawat: {
    shape: "Kravata",
    reading: "Ozka, dolga, z vozlom zgoraj. Vozel je bil zavezan enkrat, za vselej: kravata se sname čez glavo.",
  },
  zaglowka: {
    shape: "Jadrnica",
    reading: "Trup in eno visoko jadro. Odlitek pluje proti vetru in ob vsakem sunku razlaga, kaj pomeni jadrati v orco.",
  },
  grzyb: {
    shape: "Jurček",
    reading: "Debel bet in klobuk z leskom. Kje je bil odlitek najden, Laboratorij ne razkrije, niti v zapisniku.",
  },
  reklamowka: {
    shape: "Plastična vrečka",
    reading: "Natlačena vrečka z dvema ročajema, v njej verjetno nove vrečke. Senca vodi po nakupih čez mejo, ker je tam ceneje.",
  },
  skarbonka: {
    shape: "Prašiček hranilnik",
    reading: "Odlitek je poln, težak in nima odprtine, skozi katero bi lahko kaj vzel. Laboratorij to šteje za zelo močno znamenje.",
  },
  taniec: {
    shape: "Plesni par",
    reading: "Dve postavi, sklonjeni druga k drugi, ena vodi. Branje: plesni večer v zdravilišču, drugi termin, za goste vstop prost.",
  },
  szczyt: {
    shape: "Gorski vrh",
    reading: "Nazobčan vrh, ob njem pa drugi, nižji. Senca napoveduje vzpon v sandalih in pripovedovanje o njem do konca leta.",
  },
  gitara: {
    shape: "Kitara",
    reading: "Trup in dolg vrat. Odlitek zna tri akorde in jih vse zaigra ob tabornem ognju, še preden ga kdo prosi.",
  },
  golab: {
    shape: "Golob",
    reading: "Izbočene prsi in majhna glava. Odlitek se vedno vrne v isti golobnjak, tudi če ga spustiš v Belgiji.",
  },
  zamek: {
    shape: "Grajska razvalina na skali",
    reading: "Stolp na apnenčasti skali. Laboratorij prepozna Juro, odlitek pa pozna zgodovino vsakega stolpa in jo pove, ne da bi ga kdo vprašal.",
  },
  parasol: {
    shape: "Dežnik",
    reading: "Razprto platno in ukrivljen ročaj. Odlitek ve, da bo deževalo, preden to pove napoved, in to pove prvi.",
  },
  niedzwiedz: {
    shape: "Medved",
    reading: "Težka hoja po štirih. Odlitek hodi po svojih poteh, tam kjer ni signala, in je s tem zadovoljen.",
  },
  tort: {
    shape: "Poročna torta",
    reading: "Tri nadstropja, vsako manjše od prejšnjega. Branje: svatba, polnočni običaji in kravata na čelu po polnoči.",
  },
  parapet: {
    shape: "Postava, naslonjena na komolce",
    reading: "Glava in rame nad prekrižanimi rokami, kot na blazini v oknu. Odlitek vidi vse, kar se dogaja na dvorišču.",
  },
  kolejka: {
    shape: "Vrsta",
    reading: "Pet postav druga za drugo, zadnja stoji malo preblizu. Če ga prisloniš k ušesu, odlitek reče: »Vi pa niste bili v vrsti!«",
  },
};

export const PROPHECIES: Text<string[]> = [
  "Marca v hišo pride tretja libela. Prvi dve se izkažeta za krivi.",
  "Spomladi prvič rečeš nekomu »mladi«. Ta nekdo ima štiriintrideset let.",
  "Aprila začneš zvezek s kvadratki: vanj pišeš prevožene kilometre, cene goriva in kdo si je kaj sposodil.",
  "Maja se geslo za wi-fi naučiš na pamet in ga odtlej narekuješ vsakemu gostu, črko za črko.",
  "Do jeseni si ustvariš mnenje o celoletnih gumah in ga deliš, ne da bi te kdo vprašal.",
  "Junija nekdo pred tabo zakuri žar s tekočim podžigalnikom. O tem spregovoriš za mizo na sveti večer.",
  "Julija začneš vstajati pred šesto, brez budilke in brez razloga.",
  "Avgusta na bencinski črpalki neznanca vprašaš, koliko porabi njegov avto. Odgovor te ne prepriča.",
  "Septembra prvič v življenju podaš mnenje o tem, kako sosed izolira hišo. Mnenje je strokovno in dolgo.",
  "Oktobra v predalu najdeš kabel neznanega namena in ga pustiš, ker bo še prišel prav.",
  "Novembra začneš preverjati vremensko napoved trikrat na dan, vsakič v drugi aplikaciji.",
  "Decembra za mizo rečeš »v mojih časih« in nihče ne ugovarja. Laboratorij to šteje za prelomnico.",
  "Proti koncu zime radiator za stalno nastaviš na dvojko in začneš deliti puloverje.",
  "V prihodnjem letu kupiš prvo torbico za pas. Izkaže se, da gre vanjo vse.",
  "V enem letu štirikrat izgubiš daljinec. Trikrat se najde v hladilniku.",
  "Do poletja se naučiš parkirati vzvratno v enem zamahu in začneš ocenjevati, kako parkirajo drugi.",
  "Nekega dne se na telefon oglasiš z »ja, poslušam«. Inštitut to zabeleži v Letopisu.",
  "Poleti ob tujem žaru vprašaš, ali je bil vrat mariniran od včeraj. Odgovor je nikalen.",
  "V prihodnjem letu začneš vrečko za vrečke. Pred koncem leta je potrebna druga.",
  "Spomladi pogledaš v navodila šele, ko je omara že sestavljena. Ostane en vijak, ki ga shraniš za vsak primer.",
  "Med počitnicami postaviš vetrobran pred sedmo zjutraj. Sosedje z desne pridejo ob osmih in razumejo.",
  "Novembra ugasneš luč v sobi, v kateri še nekdo sedi. Rečeš, da elektrika ni zastonj.",
  "V enem letu isto anekdoto poveš enajstkrat. Vsakič je riba večja.",
  "V prihodnjem letu začneš ob sobotah zjutraj ročno prati avto, pred očmi vse ulice.",
  "Jeseni na glas vprašaš, čemu komu skiro. Vprašaš ob skiroju.",
  "Februarja sandale pomeriš k nogavicam, še doma, za poskus. Poskus uspe.",
  "Maja začneš ploskati ob pristanku letala. Družina se naslednjič usede ločeno.",
  "V družinsko skupino pošlješ svojo prvo fotografijo sončnega zahoda z napisom. Napis je daljši od zahoda.",
  "Do konca leta vsako novo napravo v hiši imenuješ »ta mašina«. Nihče si ne upa ugovarjati.",
  "Avgusta izmeriš bučko in rezultat v centimetrih poveš na glas, pred gosti.",
  "Jeseni natakarja vprašaš, ali je riba današnja. Natakar reče, da je, ti pa veš svoje.",
  "V prihodnjem letu nehaš zaupati navigaciji in pelješ na pamet. Obvoz je daljši, a boljši.",
];
