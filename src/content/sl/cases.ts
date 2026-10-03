import type { Text } from "@/i18n/overlay";
import type { Case, CASE_CATEGORIES as CaseCategoriesPl, VERDICTS as VerdictsPl } from "../cases";

/*
 * Razsodna komisija. The register is a Slovenian commission's ruling: dejansko stanje, zagovor,
 * obrazložitev. The Polish "Uczestnik" (a participant in non-contentious proceedings) is
 * "Udeleženec", capitalised like the Komisija, as the Polish does. Times are written with a full
 * stop (ob 6.40), as Slovenian prose writes them; money stays in złoty (zł).
 */

/** The three stamps, in the order of the Polish VERDICTS. */
export const VERDICTS: Text<(typeof VerdictsPl)[number]>[] = [
  { label: "To še ni dziaderstvo", short: "Ne" },
  { label: "To že je dziaderstvo", short: "Da" },
  { label: "Klinično dziaderstvo", short: "Klinično" },
];

export const CASE_CATEGORIES: Text<typeof CaseCategoriesPl> = {
  dom: "Dom in vrt",
  samochod: "Avto",
  rodzina: "Družina in prazniki",
  praca: "Delo",
  technologia: "Tehnologija",
  wakacje: "Počitnice",
  zakupy: "Nakupi in denar",
  sasiedzi: "Sosedje in soseska",
};

/** Keyed by the case number. Slugs are not translated here: they come from slugs/cases.ts. */
export const CASES: Record<number, Text<Case, "slug">> = {
  1: {
    title: "Ključi v ključavnici, da se ne izgubijo",
    facts:
      "Udeleženec pušča ključe v ključavnici vhodnih vrat, z notranje strani, štiriindvajset ur na dan. Člani gospodinjstva, ki se vračajo iz službe, vrat s svojimi ključi ne morejo odkleniti, zato zvonijo. Udeleženec odpre po tretjem zvonjenju.",
    defence: "Če so v ključavnici, vem, kje so.",
    opinion:
      "Komisija priznava, da je sistem učinkovit: od leta 1994 se ključi niso izgubili niti enkrat. Izgubil pa se je dostop do stanovanja za druge člane gospodinjstva, kar Komisija opredeljuje kot stranski učinek, značilen za dziaderstvo.",
  },
  2: {
    title: "Škatle od aparatov, za selitev",
    facts:
      "Udeleženec v kleti hrani originalne škatle vseh aparatov, kupljenih od leta 1993, skupaj s stiroporom in vrečkami. Škatle naj bi prišle prav ob selitvi. Udeleženec živi v istem stanovanju od leta 1988 in se ne namerava seliti.",
    defence: "Ko se bomo pa selili, v kaj bom zapakiral mikrovalovko?",
    opinion:
      "Komisija je ugotovila, da ima od 41 škatel le še 9 svoj aparat v stanovanju. Selitev Udeleženca bi bila torej predvsem prevoz praznih škatel iz ene kleti v drugo, na kar je Udeleženec vzorno pripravljen.",
  },
  3: {
    title: "Glasovno sporočilo, ki se začne z »Halo?«",
    facts:
      "Udeleženec snema glasovna sporočila, ki se začnejo z »Halo?« in nekajsekundnim premorom za odgovor. Povprečno sporočilo traja 2 minuti in 40 sekund, od tega 20 sekund čakanja, da se kdo oglasi.",
    defence: "Ja kako pa naj vem, če kdo posluša?",
    opinion:
      "Komisija opozarja, da glasovno sporočilo ni telefonski pogovor. Udeleženec ga kljub temu vodi kot pogovor, vključno z vprašanjem »Se me sliši?« in pozdravom »No, bom končal, ker to gotovo stane«.",
  },
  4: {
    title: "Brisača na ležalniku ob 6.00",
    facts:
      "Udeleženec ob 6.00 rezervira ležalnike ob hotelskem bazenu, tako da nanje razgrne brisače. Nato odide na celodnevni fakultativni izlet. Ležalniki ostanejo zasedeni do 18.00, ko se Udeleženec vrne in brisače pobere.",
    defence: "Ležalnik je moj, pa če ležim na njem ali ne.",
    opinion:
      "Komisija je ugotovila, da je v tednu bivanja Udeleženčeva brisača na ležalniku preživela 61 ur na polnem soncu, Udeleženec sam pa 4. Brisača se je v domovino vrnila vidno spočita.",
  },
  5: {
    title: "Pripomba natakarju, da je biftek predrag",
    facts:
      "Udeleženec v restavraciji naroči biftek, ga poje do zadnjega grižljaja, ob plačilu pa natakarja obvesti, da je biftek predrag. Natakar na cene v restavraciji nima vpliva. Udeleženec to pripombo podaja od leta 2016, ob vsakem naročenem bifteku.",
    defence: "Jaz mu samo povem. Naj sporoči naprej.",
    opinion:
      "Komisija ugotavlja, da ima reklamacija, vložena po tem, ko je bil njen predmet pojeden, omejeno dokazno vrednost. Udeleženec pa ne zahteva niti znižanja cene niti spremembe jedilnika. Hoče le, da nekdo ve.",
  },
  6: {
    title: "Tekma na televiziji, komentar po radiu",
    facts:
      "Udeleženec gleda tekme reprezentance pri utišanem televizorju, komentar pa posluša po radiu. Radio je približno štiri sekunde pred sliko, zato se Udeleženec vsakemu golu razveseli prej kot člani gospodinjstva, ki tekmo gledajo v isti sobi.",
    defence: "Na televiziji blebetajo, po radiu pa komentirajo.",
    opinion:
      "Komisija dziaderstva ni ugotovila. Udeleženec v dobri veri izkorišča razliko v zamiku signala, za katero večina gledalcev ne ve. Vzklik »gol« štiri sekunde pred zadetkom Komisija opredeljuje kot razkritje vsebine pred predvajanjem, za take zadeve pa ni pristojna.",
  },
  7: {
    title: "Pranje čistega avta v soboto ob 7.00",
    facts:
      "Udeleženec vsako soboto ob 7.00 opere avto, ročno, z dvema vedroma, gobo in jelenjo kožo. Pranje traja uro in pol. Avto je pred pranjem čist, ker je bil opran prejšnjo soboto.",
    defence: "Če ga pereš vsak teden, se ne umaže.",
    opinion:
      "Komisija je ugotovila, da avto na teden prevozi povprečno 23 kilometrov, večinoma do trgovine in nazaj. Sosedje že leta prepoznajo soboto po zvoku vedra, postavljenega na asfalt ob 6.58. Komisija to opredeljuje kot dziaderstvo, čeprav izjemno negovano.",
  },
  8: {
    title: "Nadzor nad ločevanjem odpadkov pri sosedih",
    facts:
      "Udeleženec vsak dan pregleda zabojnike za ločeno zbiranje odpadkov pred blokom in iz njih pobere vse, kar je napačno ločeno. Pobrane odpadke odnese pred vrata stanovanj, iz katerih po njegovem mnenju izvirajo.",
    defence: "Jaz ničesar ne mečem stran. Jaz samo vračam vsakemu, kar je njegovo.",
    opinion:
      "Komisija je ugotovila, da Udeleženec po vsebini vreče prepozna 23 od 24 gospodinjstev v bloku. Ne prepozna svojega: maja je sosedu iz pritličja odnesel kozarec z neodvitim pokrovčkom, ki ga je sam vrgel v zabojnik za steklo.",
  },
  9: {
    title: "V pisarni ob 6.40, čeprav se delo začne ob 9.00",
    facts:
      "Udeleženec vsak dan pride v pisarno ob 6.40, čeprav se delovni čas v podjetju začne ob 9.00. Med 6.40 in 9.00 kuha kavo, bere novice in nastavlja žaluzije v vsem nadstropju. Nadur ne prijavlja.",
    defence: "Zjutraj je mir, nihče ne kliče in kavni aparat je še čist.",
    opinion:
      "Komisija je ugotovila, da Udeleženec prvi dve uri in dvajset minut dela v prazni pisarni, naslednjih osem ur pa pripoveduje, ob kateri uri je prišel. Nastavitev žaluzij sodelavci vsak dan popravijo ob 9.05, Udeleženec pa ob 6.41 naslednjega dne.",
  },
  10: {
    title: "Največja pisava na telefonu",
    facts:
      "Udeleženec ima na telefonu nastavljeno največjo razpoložljivo pisavo. Na zaslon gredo hkrati štiri besede, sporočilo »Dober dan, kaj je novega?« pa ne gre več na en zaslon. Ura na zaklenjenem zaslonu zavzema pol telefona.",
    defence: "Zakaj bi se pa matral, če se mi ni treba?",
    opinion:
      "Komisija dziaderstva ni ugotovila. Udeleženec je napravo prilagodil sebi, ne sebe napravi, kar je po dosedanji praksi Komisije redka drža. Komisija beleži le, da ves avtobus že ve za svakovo godovanje in da je treba kupiti hren.",
  },
  11: {
    title: "Svatbeni zvezek s ceno ene jedi",
    facts:
      "Udeleženec od leta 1991 vodi zvezek, v katerega ob vsaki svatbi zapiše znesek, ki ga je dal v kuverto, in število postreženih toplih jedi. Iz tega izračuna ceno ene jedi. Rezultat družini razglasi na poti domov s svatbe.",
    defence: "Jaz nikogar ne ocenjujem. Jaz samo računam.",
    opinion:
      "Komisija je ugotovila, da zvezek obsega 64 svatb, najboljši rezultat zadnjih trideset let pa ima bratrančeva svatba iz leta 1996: 4,10 zł na jed. Udeleženec ne upošteva inflacije, zato se vsaka naslednja svatba v družini odreže slabše od prejšnje.",
  },
  12: {
    title: "Vstajanje, preden se letalo ustavi",
    facts:
      "Udeleženec takoj po pristanku odpne varnostni pas in vstane. Iz omarice nad sedeži vzame prtljago, obleče jakno in do odprtja vrat stoji v prehodu, sklonjen pod omarico. To traja povprečno 14 minut.",
    defence: "Kdor prej vstane, prej izstopi.",
    opinion:
      "Komisija je ugotovila, da Udeleženec zapusti letalo kot 63. potnik, torej natanko takrat, kot bi ga zapustil, če bi do odprtja vrat sedel. Nato 9 minut čaka na avtobus, ki do terminala odpelje vse potnike hkrati.",
  },
  13: {
    title: "Tri vrečke v žepu in nova na blagajni",
    facts:
      "Udeleženec v žepu jakne nosi tri zložene vrečke, za primer nakupov. Na blagajni pa vseeno kupi novo, tistih treh ne vzame iz žepa. Doma nova vrečka konča v vrečki z vrečkami pod pomivalnim koritom.",
    defence: "Tiste so dobre, škoda jih je za nakupe.",
    opinion:
      "Komisija je ugotovila, da se zaloga pod koritom povečuje za eno vrečko na teden in trenutno šteje 412 kosov. Tri vrečke iz žepa so od leta 2016 opravile približno 1300 poti v trgovino in niso bile niti enkrat razprte.",
  },
  14: {
    title: "Tovarniška folija na sedežih od leta 2017",
    facts:
      "Udeleženec s sedežev, volana in prestavne ročice avta, kupljenega leta 2017, ni odstranil tovarniške folije. Folija šumi ob vsakem gibu, poleti pa se sopotniki prilepijo na sedeže. Avto ima prevoženih 180 tisoč kilometrov.",
    defence: "Snel jo bom, ko ga bom prodajal. Takrat bo kot nov.",
    opinion:
      "Komisija je ugotovila, da se Udeleženec že devet let vozi z avtom, katerega notranjosti se še nihče ni dotaknil, vključno z njim samim. Folija na volanu se je obrabila na mestih, kjer ga Udeleženec drži, zato je volan oblepil z novo folijo.",
  },
  15: {
    title: "Registrator z navodili za uporabo",
    facts:
      "Udeleženec hrani navodila za uporabo vseh gospodinjskih aparatov v registratorju, v plastičnih srajčkah, z abecednim kazalom. Najstarejše navodilo je za polavtomatski pralni stroj iz leta 1986. Udeleženec ni prebral nobenega.",
    defence: "Navodila niso za branje. Navodila so za vsak primer.",
    opinion:
      "Komisija v samem registratorju dziaderstva ni ugotovila: zbirka je popolna, urejena in dostopna vsem članom gospodinjstva. Ti jo uporabljajo predvsem, kadar je treba popraviti aparat, ki ga je Udeleženec pred tem popravil brez navodil. Ta zadeva bo obravnavana ločeno.",
  },
  16: {
    title: "»Prosim, s kom govorim?«, čeprav kliče hči",
    facts:
      "Udeleženec se na vsak klic oglasi z besedami »Prosim, s kom govorim?«, tudi kadar se na zaslonu prikažeta napis »Hči« in njena fotografija. Hči se vsakič predstavi z imenom, priimkom in sorodstvenim razmerjem.",
    defence: "Pa kako naj vem, kdo ima njen telefon?",
    opinion:
      "Komisija ocenjuje previdnost Udeleženca kot upravičeno v obsegu, v katerem bi hči lahko izgubila telefon. Ugotovljeno pa je bilo, da ga od leta 2014 ni izgubila niti enkrat, v tem času pa se je očetu predstavila približno 1900-krat.",
  },
  17: {
    title: "Preverjanje preglednice na kalkulatorju",
    facts:
      "Udeleženec vsak rezultat iz preglednice preveri na kalkulatorju s tiskalnikom. Kadar se rezultata razlikujeta, popravi preglednico. Trakove z izpisi hrani v registratorjih, po enega za vsako leto od leta 2009.",
    defence: "Računalnik je tudi samo stroj. Lahko se zmoti.",
    opinion:
      "Komisija je ugotovila, da sta kalkulator in preglednica od leta 2009 dala različen rezultat 37-krat. V 36 primerih se je Udeleženec zmotil pri vnašanju številk v kalkulator, preglednica pa je bila vseeno popravljena, kar Komisija opredeljuje kot klinično dziaderstvo z vplivom na poslovni izid podjetja.",
  },
  18: {
    title: "»Dober dan«, dokler ne odzdravi",
    facts:
      "Udeleženec reče »dober dan« vsem prebivalcem soseske, tudi tistim, ki jih ne pozna. Zapomni si, kdo ni odzdravil, in tej osebi ob naslednjih srečanjih reče »dober dan« vedno razločneje, dokler ne odzdravi.",
    defence: "Jaz nikogar ne silim. Jaz si samo zapomnim.",
    opinion:
      "Komisija v samem pozdravu, ki je vljuden, dziaderstva ni ugotovila. Dziaderstvo se je začelo leta 2017, ko sosed iz tretjega nadstropja ni odzdravil, ker je imel v ušesih slušalke. Od takrat ga Udeleženec pozdravlja z razdalje 40 metrov, sosed pa odzdravi, še preden Udeleženec odpre usta.",
  },
  19: {
    title: "Fotografija vremenske napovedi s televizorja",
    facts:
      "Udeleženec s telefonom fotografira zaslon televizorja, kadar ta kaže kaj, kar se mu zdi pomembno, in fotografijo pošlje v družinsko skupino. Najpogosteje je to vremenska napoved. Na vsaki fotografiji se vidi tudi odsev Udeleženca in lestenca.",
    defence: "Kako pa naj vam drugače pokažem, kaj so rekli na televiziji?",
    opinion:
      "Komisija je ugotovila, da fotografije prikazujejo vremensko napoved, ki je na voljo v aplikaciji na telefonu, s katerim so bile posnete. Imajo pa dokumentarno vrednost: od leta 2019 se v odsevu nista spremenila ne lestenec ne Udeleženčeva spodnja majica.",
  },
  20: {
    title: "»Dober tek« vsaki mizi na poti",
    facts:
      "Ko gre Udeleženec skozi hotelsko restavracijo, vsaki mizi, mimo katere pride, zaželi »dober tek«. Pri zajtrku s švedsko mizo to pomeni približno 40 voščil, ker gre Udeleženec k švedski mizi sedemkrat.",
    defence: "Mene to nič ne stane, ljudje se pa razveselijo.",
    opinion:
      "Komisija dziaderstva ni ugotovila. Želeti neznancem dober tek je vljuden, brezplačen in učinkovit običaj: 31 % naslovnikov odgovori »hvala«, 6 % pa »enako«, čeprav Udeleženec takrat nima ničesar na krožniku.",
  },
  21: {
    title: "Znižane žemlje ob 19.45",
    facts:
      "Udeleženec pride v trgovino vsak dan ob 19.40, ker ob 19.45 kruh in pecivo znižajo za polovico. Kupi vse, kar je ostalo, ne glede na potrebe gospodinjstva. Presežek zamrzne.",
    defence: "Za pol cene se vedno splača, tudi če se ne poje.",
    opinion:
      "Komisija je ugotovila, da je v Udeleženčevih zamrzovalnikih 640 žemelj, kar gospodinjstvu ob sedanji porabi zagotavlja kruh do leta 2028. Udeleženec tako prihrani 11 zł na teden, za drugi zamrzovalnik pa je dal 1400 zł.",
  },
  22: {
    title: "Obešanka na termostatu",
    facts:
      "Udeleženec je na termostatske glave v vseh sobah namestil plastične pokrove z obešankami. Ključek nosi pri sebi, na istem obročku kot ključ od garaže. V stanovanju je 19 stopinj, članom gospodinjstva, ki jih zebe, pa Udeleženec izdaja puloverje.",
    defence: "Radiator ni igrača, da bi ga vsak vrtel po svoje.",
    opinion:
      "Komisija opozarja, da termostatska glava služi članom gospodinjstva za uravnavanje temperature, ne pa za varovanje temperature pred člani gospodinjstva. Ugotovljeno je bilo tudi, da Udeleženec popoldneve preživlja v garaži, ob kaloriferju, navitem na maksimum.",
  },
  23: {
    title: "Ura v avtu po zimskem času",
    facts:
      "Udeleženec ob prehodu na poletni čas ne prestavi ure v avtu. Od konca marca do konca oktobra ta zaostaja za eno uro, ki jo Udeleženec prišteje na pamet. Sopotnikom, ki ga vprašajo, koliko je ura, svetuje, naj storijo enako.",
    defence: "Zakaj bi prestavljal, ko pa bo čez pol leta samo od sebe spet prav.",
    opinion:
      "Komisija dziaderstva ni ugotovila. Strategijo Udeleženca uporablja precejšen del voznikov na Poljskem, ura, ki iz nje izhaja, pa kaže pravi čas pet mesecev na leto. To je pet mesecev več kot ura na Udeleženčevi pečici, ki od leta 2015 utripa in kaže 00.00.",
  },
  24: {
    title: "Sporočila z velikimi črkami in podpisom",
    facts:
      "Udeleženec družini piše sporočila izključno z velikimi tiskanimi črkami in vsako podpiše z besedo »ATI«, čeprav aplikacija pošiljatelja izpiše nad vsakim sporočilom. Povprečno sporočilo šteje štiri besede, od tega je ena podpis.",
    defence: "Če pišem z velikimi, se ve, da mislim resno.",
    opinion:
      "Komisija je ugotovila, da družina vsako Udeleženčevo sporočilo bere kot kreg, tudi sporočilo »KUPIL SEM KRUH. ATI«, po katerem je hči poklicala nazaj in vprašala, kaj se je zgodilo. Komisija ocenjuje podpis kot odveč: pošiljatelja tako ali tako izda slog.",
  },
  25: {
    title: "Lonček z napisom »Najboljši šef«",
    facts:
      "Udeleženec v službi pije izključno iz lončka z napisom »Najboljši šef na svetu«. Udeleženec ni šef: lonček je izžrebal leta 2012 na izmenjavi daril v podjetju. Lončka nikomur ne posodi in ga osebno pomiva.",
    defence: "Lonček je lonček. Napis pa ni moja stvar.",
    opinion:
      "Komisija dziaderstva ni ugotovila. Navezanost na lasten lonček je v pisarnah splošno razširjen pojav, napis pa ne pomeni izjave volje, saj Udeleženec na njegovi podlagi ni nikoli izdal nobenega navodila. Komisija beleži le, da pravi šef pije iz lončka brez napisa.",
  },
  26: {
    title: "Rekord v vožnji na morje",
    facts:
      "Udeleženec meri čas vsake vožnje na morje in ga primerja z rekordom iz leta 2011: 5 ur in 52 minut. Postanki so dovoljeni samo za tankanje. O zaostanku za rekordom Udeleženec družino obvešča vsake pol ure.",
    defence: "Lulat ste lahko šli v Toruńu, ko sem tankal.",
    opinion:
      "Komisija je ugotovila, da rekord iz leta 2011 doslej še ni bil izboljšan. Od takrat je bila prometu predana avtocesta, ki se ji Udeleženec izogiba, ker rekord, postavljen po avtocesti, »ne bi štel«.",
  },
  27: {
    title: "Predlog glede klopi pred blokom",
    facts:
      "Udeleženec od leta 2003 na vsakem zboru etažnih lastnikov vloži predlog, da se klop pred blokom premakne za meter proti soncu. Predlog je propadel 16-krat. Udeleženec na zbore prinaša lasten načrt, narisan na milimetrskem papirju.",
    defence: "Jaz na tisti klopi sploh ne sedim. Gre za princip.",
    opinion:
      "Komisija je ugotovila, da je bil predlog leta 2019 sprejet in klop premaknjena. Na naslednjem zboru je Udeleženec vložil predlog, da se jo premakne nazaj, ker je bilo »tam bolje«. Novi predlog propada že sedem let.",
  },
  28: {
    title: "Telefon na zvočniku, držan kot sendvič",
    facts:
      "Udeleženec vse telefonske pogovore opravlja na zvočniku, telefon pa drži vodoravno pred usti, kot sendvič. To počne tudi v tramvaju, v vrsti pri blagajni in na uradu. Pogovori trajajo povprečno 12 minut.",
    defence: "Jaz nimam ničesar skrivati.",
    opinion:
      "Komisija je ugotovila, da redni sopotniki Udeleženca poznajo stanje njegovega vrtička, izid tehničnega pregleda njegovega avta in razlog, zakaj ne govori z bratrancem. Komisija izjave Udeleženca ne izpodbija: po osmih letih takih pogovorov res nima več ničesar skrivati.",
  },
  29: {
    title: "Vrsta pred prazno trgovino ob 5.40",
    facts:
      "Udeleženec vsak dan ob 5.40 pride pred trgovino v soseski in čaka, da odprejo ob 6.00. Trgovina je odprta do 23.00 in ves dan v njej ni vrste. Udeleženec običajno kupi maslo in časopis.",
    defence: "Zjutraj je vse sveže in se nihče ne riva.",
    opinion:
      "Komisija je ugotovila, da je Udeleženec od leta 2009 edina oseba v vrsti pred to trgovino in hkrati vsa vrsta. Ko se je leta 2023 pojavila druga oseba, jo je Udeleženec prosil, naj si zapomni, da je za njim, in za trenutek odšel domov.",
  },
  30: {
    title: "Likanje papirja od daril",
    facts:
      "Udeleženec po odpiranju daril na sveti večer pobere ves papir, ga zlika z likalnikom in ga do naslednjih praznikov hrani v omari. Nekatere pole so v obtoku od leta 2008. Člani gospodinjstva darila odvijajo previdno, ker Udeleženec gleda.",
    defence: "Papir je cel, zakaj bi šel v smeti.",
    opinion:
      "Komisija je ugotovila, da je ena pola s severnimi jeleni v sedemnajstih letih obkrožila vso družino in se je za lanske praznike k Udeležencu vrnila kot ovoj darila od vnukinje. Komisija z zaskrbljenostjo beleži, da je bila zlikana.",
  },
};
