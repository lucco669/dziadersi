import type { Dossier } from "@/content/dossiers";
import type { Text } from "@/i18n/overlay";

type DossierText = Text<Dossier, "slug" | "code" | "bingo" | "dictionary" | "caseSlug" | "reportSlug" | "date">;
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
  "dzien-dziadka": {
    title: "Dan dedka z dziadersem",
    short: "Dan dedka",
    season: "22. januar · obisk pri starih starših",
    lead: "Vodnik za 22. januar: kako ločiti dedka od dziadersa, kaj boš slišal ob pecivu, kako preživeti slovo v predsobi in kaj napisati na voščilnico za dan dedka.",
    introduction: [
      "Dan dedka¹ je na Poljskem 22. januarja, dan po dnevu babic, in navadno se oba praznujeta skupaj: ob enem pecivu, v eni sobi, pred enim televizorjem. Dedek ni po uradni dolžnosti dziaders. Sorodstvo in starost ne odločata o diagnozi.",
      "O diagnozi odloča to, kar se zgodi po prvem kosu skutne torte: ali dedek vpraša, kako si, ali takoj razloži, kako je bilo pri njem. Opazuj prijazno. To je edini predmet raziskav Inštituta, ki ti lahko da dvajset zlotov za na pot.",
    ],
    signals: [
      "Risbica je pregledana proti svetlobi in vložena v registrator.",
      "Vprašanje o šoli pade pred vprašanjem o počutju.",
      "Daljinec leži na dedkovi strani in tam tudi ostane.",
      "Vnuk dobi v roke dedkov telefon s prošnjo za večjo pisavo.",
    ],
    protocol: [
      {
        title: "Pred obiskom",
        text: "Z brati in sestrami se dogovori, kdo prinese pecivo in kdo rože. Pot načrtuj tako, da dedku ne bo treba razlagati, kod bi bilo hitreje.",
      },
      {
        title: "Za mizo",
        text: "Postavi eno vprašanje o starih časih in odgovor poslušaj do konca. To ni terenska raziskava, ampak darilo. Bingo razdeli šele po čaju.",
      },
      {
        title: "Ob slovesu",
        text: "Slovo v predsobi traja eno uro; vpiši ga v urnik. Bankovec »za na pot« sprejmi brez razprave. Razprava slovo podaljša še za pol ure.",
      },
    ],
    packing: [
      "Voščilnica za dan dedka, ročno podpisana",
      "Pecivo, ki ga bo dedek pohvalil s primerjavo z drugim",
      "Polnilec za njegov telefon",
      "Godovni bingo, ker so pravila ista",
    ],
    card: {
      title: "Voščilnica za dan dedka",
      wishes: [
        "Dedek, ob tvojem prazniku ti želimo zdravja, potrpljenja z našimi telefoni in zim, kakršne so bile nekoč, ampak samo v pripovedih.",
        "Najboljšemu dedku: naj daljinec vedno leži tam, kjer si ga pustil, vrtiček pa naj rodi več, kot ga utegneš razdeliti sosedom.",
        "Dedek, hvala za vsak nasvet, tudi za tistega, za katerega nismo prosili. Večina se je izkazala za pravilne, a ne povej nikomur.",
      ],
    },
    notes: ["¹ Dan dedka: na Poljskem ga praznujejo 22. januarja, dan po dnevu babic. V Sloveniji ni uveljavljen; najbližje mu je nedeljsko kosilo pri starih starših."],
  },
  "dzien-tesciowej": {
    title: "Dan tašče z dziadersem",
    short: "Dan tašče",
    season: "5. marec · kosilo pri tastu in tašči",
    lead: "Navodila za preživetje kosila 5. marca: znaki, zapisnik, značilne izjave in voščilnica za dan tašče, ki jo je mogoče izročiti brez tveganja.",
    introduction: [
      "Dan tašče¹ praznujejo na Poljskem 5. marca. Tašča ni vrsta, temveč funkcija: prevzame jo na dan otrokove poroke in jo opravlja dosmrtno. Dziaderstvo na tej funkciji ni obvezno, čeprav ga Inštitut beleži pogosteje kot med vodilnimi kadri.",
      "Teren raziskave je navadno kuhinja tasta in tašče, kjer ima vse svoje mesto, tudi gostje. Opazuj s stola, ki ti ga pokaže gostiteljica. Ponudba pomoči pri pomivanju je dovoljena, a bo zavrnjena, zato jo daj samo enkrat.",
    ],
    signals: [
      "»Jej, jej« pade pred prvim grižljajem.",
      "Juha se primerja z juho, ki jo kuhate doma.",
      "Kozarci za na pot so pripravljeni, še preden vprašaš.",
      "Vprašanje o vnukih je zastavljeno v obliki trdilnega stavka.",
    ],
    protocol: [
      {
        title: "Pred kosilom",
        text: "Rože kupi v cvetličarni, ne na bencinski črpalki. Tašča razliko prepozna. Pridi točno ali pet minut prej; deset minut prej je že inšpekcija.",
      },
      {
        title: "Za mizo",
        text: "Hvali konkretno: nadev, pecivo, način rezanja. Splošni »odlično« bo razumljen kot vljudnost. Na vprašanja o prenovi in poletnih načrtih odgovarjaj na kratko in v pretekliku.",
      },
      {
        title: "Po kosilu",
        text: "Sprejmi vse kozarce. Vračilo praznih kozarcev je del dogovora in poteka ob naslednjem obisku, pomitih.",
      },
    ],
    packing: [
      "Rože iz cvetličarne, z računom v žepu",
      "Voščilnica za dan tašče",
      "Torba za kozarce",
      "Pripravljen odgovor na vprašanje o vnukih",
    ],
    card: {
      title: "Voščilnica za dan tašče",
      wishes: [
        "Draga mama, ob dnevu tašče ti želimo zdravja, miru in kozarcev, ki se vedno vrnejo. Hvala za sina in za juho; o vrstnem redu se ne bomo prepirali.",
        "Najboljši tašči: da bi gostje prihajali pravočasno, vnuki klicali sami, mi pa se končno naučili rezati tako, kot je treba.",
        "Mama, hvala za vsak nasvet. Nekaj smo jih uvedli, ostale hranimo za pozneje. Bodo še prav prišli.",
      ],
    },
    notes: ["¹ Tašča: poljščina ima za ženino in moževo mater eno besedo, teściowa. Inštitut obe obravnava skupaj, tako kot obe kuhinji."],
  },
  "dzien-mezczyzn": {
    title: "Dan moških z dziadersem",
    short: "Dan moških",
    season: "10. marec · pisarna in dom",
    lead: "Vodnik za 10. marec: nogavice, čokolada in moški, ki ne potrebujejo ničesar. Znaki, opazovalni zapisnik in voščilnica za dan moških.",
    introduction: [
      "Dan moških¹ praznujejo na Poljskem 10. marca, dva dni po dnevu žena, ki v marsikateri pisarni določi raven povračila. Praznovanje je skromno: nogavice, čokolada, včasih komplet kozmetike v škatli v obliki avtomobila.",
      "Teren raziskave je pisarna ali dom. Korporativni dziaders in njegov domači ustreznik se na voščilo odzoveta enako: »Kaj pa to, saj ne rabim ničesar.« Zapiši ta obrazec in nato opazuj, kako nogavice z vidnim zadovoljstvom romajo v predal.",
    ],
    signals: [
      "»Saj ne rabim ničesar« pade, še preden je darilo odvito.",
      "Darilo je ocenjeno po ceni, ne po barvi.",
      "Rožica za moškega sproži vprašanje, kam z njo.",
      "Nekdo opomni, da ima dan žena daljšo tradicijo in boljši proračun.",
    ],
    protocol: [
      {
        title: "Pripravi darilo",
        text: "Izberi uporabno stvar. Nogavice so dovoljene, če imajo ojačano peto; da jo imajo, bo obdarovanec povedal sam.",
      },
      {
        title: "Izreci voščilo",
        text: "Na kratko in brez besede »starost«. Voščila za zdravje so sprejeta, voščilo »da bi se končno odpočil« velja za namig.",
      },
      {
        title: "Zapiši odziv",
        text: "Lestvica odzivov: od »kaj pa to« prek »no, bo prišlo prav« do »dobro, ker je nemško«. Druga in tretja stopnja pomenita uspeh.",
      },
    ],
    packing: [
      "Nogavice z ojačano peto",
      "Voščilnica za dan moških",
      "Čokolada, ne iz akcije",
      "Godovni bingo, za primer zabave doma",
    ],
    card: {
      title: "Voščilnica za dan moških",
      wishes: [
        "Ob dnevu moških ti želimo zdravja, moči in naprav, pri katerih ni treba brati navodil, ker delujejo takoj.",
        "Vse najboljše: naj se zagonski kabli vedno vrnejo od svaka, vrtalnik pa od soseda.",
        "Želimo ti, da bi se vse, česar ne potrebuješ, vendarle izkazalo za koristno. Nogavice so priložene.",
      ],
    },
    notes: ["¹ Dan moških: na Poljskem 10. marca, kot odgovor na 8. marec. Mednarodni dan moških je sicer 19. novembra; Inštitut ga ne obeležuje dvakrat."],
  },
  "dzien-ojca": {
    title: "Dan očetov z dziadersem",
    short: "Dan očetov",
    season: "23. junij · žar in risbica",
    lead: "Vodnik za 23. junij: ata, žar in darilo, »ki ga ni bilo treba«. Znaki, opazovalni zapisnik, bingo za žar in voščilnica za dan očetov.",
    introduction: [
      "Dan očetov¹ je na Poljskem 23. junija, na začetku sezone žara in počitnic. V mnogih hišah ga praznujejo ob žaru, kar olajša opazovanje: oče stoji na enem mestu, drži klešče in se rad oglasi.",
      "Oče ni po uradni dolžnosti dziaders. Ta dan Inštitut prosi, da ločiš nasvete, dane iz skrbi, od nasvetov, danih iz navade. Prve zapiši v zvezek, druge prečrtaj na bingu. Včasih so to isti nasveti.",
    ],
    signals: [
      "Darilo se odvija previdno, da bo papir še prišel prav.",
      "»Zakaj ste zapravljali« pade skupaj z nasmehom.",
      "Klešče se ne predajo niti na praznik.",
      "Vprašanje o otrokovem avtu se konča z ogledom avta.",
    ],
    protocol: [
      {
        title: "Zjutraj",
        text: "Voščilo izreci pred prvim klicem v servis ali sosedu. Pozneje je oče zaseden.",
      },
      {
        title: "Ob žaru",
        text: "Ne popravljaj kurjenja. Raje vprašaj za metodo in poslušaj odgovor. To je najdragocenejše darilo za očeta, tudi dziadersa, in stane dvajset minut.",
      },
      {
        title: "Zvečer",
        text: "Preštej polja na bingu, a rezultata ne razglasi. Dan očetov je edini dan v letu, ko ima zadnjo besedo uradno on.",
      },
    ],
    packing: [
      "Voščilnica za dan očetov",
      "Darilo, »ki ga ni bilo treba«",
      "Prvomajski bingo, veljaven do konca sezone žara",
      "Dvajset minut za poslušanje metode kurjenja",
    ],
    card: {
      title: "Voščilnica za dan očetov",
      wishes: [
        "Ata, ob tvojem prazniku ti želimo zdravja, cest brez zastojev in žara, ki se prižge v prvem poskusu. Po tvoji metodi.",
        "Najboljšemu atu: hvala za nasvete, poskusne vožnje po parkirišču in luč, ki jo za nami ugašaš že dvajset let. Elektrika ni zastonj, vemo.",
        "Ata, želimo ti, da bi se vse, kar boš »takoj popravil«, popravilo samo. Za ostalo bomo poskrbeli skupaj.",
      ],
    },
    notes: ["¹ Dan očetov: na Poljskem vedno 23. junija, v Sloveniji tretjo nedeljo v juniju. Žar je v obeh državah isti."],
  },
  "dzien-chlopaka": {
    title: "Dan fantov z dziadersem",
    short: "Dan fantov",
    season: "30. september · šola in zmenek",
    lead: "Vodnik za 30. september: mladi dziaders v naravnem okolju. Znaki, opazovalni zapisnik in voščilnica za dan fantov, ki jo je mogoče izročiti brez tveganja.",
    introduction: [
      "Dan fantov¹ praznujejo na Poljskem 30. septembra: v šolah, kjer dekleta iz razreda pripravijo drobna darila, in v zvezah, kjer je darilo drobno, a zapomnjeno. Primeren dan za opomnik, da dziaderstvo nima starosti.",
      "Mladi dziaders ima dvajset let, a že ve, kako je treba parkirati, igrati nogomet in nastaviti usmerjevalnik. Prepoznaš ga po tem, da darilo pospremi s predavanjem o boljšem modelu. Opazuj z naklonjenostjo: osebek je v zgodnji fazi in veliko se lahko še spremeni.",
    ],
    signals: [
      "Darilo se primerja z boljšim modelom s spleta.",
      "Tekma na televiziji ima prednost pred večerjo.",
      "Pojasnilo prepovedanega položaja je podano brez prošnje.",
      "»Jaz bi to naredil drugače« pade pred »hvala«.",
    ],
    protocol: [
      {
        title: "Izberi darilo",
        text: "Nekaj za konjiček, ne za dom. Orodje za dom bo sprejeto kot namig, namige pa mladi dziaders obravnava do dneva moških.",
      },
      {
        title: "Izroči ga",
        text: "Med polčasom ali po tekmi. Izročitev med akcijo je dovoljena samo, ko njegovo moštvo vodi.",
      },
      {
        title: "Zapiši odziv",
        text: "Če po odvijanju pade vprašanje o ceni, zapiši simptom. Če pade »hvala« brez komentarja, je napoved za osebek ugodna.",
      },
    ],
    packing: [
      "Voščilnica za dan fantov",
      "Darilo za konjiček, ne za dom",
      "Spored tekem za ta večer",
      "Godovni bingo, za primer večerje z družino",
    ],
    card: {
      title: "Voščilnica za dan fantov",
      wishes: [
        "Ob dnevu fantov ti želimo, da bi tvoje moštvo zmagovalo, sodniki videli isto kot ti, usmerjevalnik pa deloval brez tvoje pomoči.",
        "Vse najboljše: naj vsak nasvet, ki ga daš, pride do nekoga, ki je zanj prosil.",
        "Ostani to, kar si, samo brez »v mojih časih«. Za to imaš še štirideset let.",
      ],
    },
    notes: ["¹ Dan fantov: poljski običaj 30. septembra, ko sošolke obdarijo fante. Fantje jim vrnejo 8. marca, za dan žena."],
  },
};
