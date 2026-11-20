import type { Entry } from "@/content/dictionary";
import type { Text } from "@/i18n/overlay";

/**
 * Dziaderski slovar: the Slovenian text of each entry, keyed by the Polish slug. The headword is what
 * a Slovenian father or uncle says in the same situation, not a translation of the Polish phrase; the
 * Polish headword is kept as `original` by the accessor. Cross-references (`seeAlso`) are re-pointed
 * by the accessor too, so they are not repeated here.
 */
export const DICTIONARY_SL: Record<string, Text<Entry, "slug" | "seeAlso" | "original">> = {
  "to-sie-jeszcze-przyda": {
    headword: "to bo še prav prišlo",
    usage:
      "Rek upraviči hrambo škatle, kozarca, kabla ali stare jakne, ki jih trenutno nihče ne uporablja. Izraža varčnost iz časov, ko je bilo marsikaj težko kupiti, zato ga pogosteje slišimo pri starejših generacijah. Včasih ima prav; navadno pa se konča s kletjo, v kateri ni mogoče najti ničesar, ko stvar res pride prav.",
    grammar: "konzervatorska zveza",
    pronunciation: "izg. odločno, z roko na kljuki kletnih vrat",
    senses: [
      { text: "Formula, ki upravičuje hrambo predmeta, ki od leta 1997 ni našel uporabe." },
      { text: "Izjava o nedotakljivosti kleti, garaže in predala pod televizorjem." },
    ],
    example: "Pusti to škatlo od televizorja, to bo še prav prišlo.",
    exampleNote: "Televizor so zavrgli leta 2011.",
  },
  panie: {
    headword: "ja, veš …",
    grammar: "uvodni medmet",
    usage:
      "»Ja, veš …« je pogovorni uvod, ki napove pritožbo ali razlago s področja, na katerem se govorec čuti strokovnjaka. Zveni kot vzdih in kupi čas za premislek. V poljskem izvirniku je to »panie…«, ogovor neznanega moškega, ki ga je slišati v avtomehanični delavnici, na tržnici in na gradbišču.",
    pronunciation: "izg. z vzdihom, ki mu sledi premor",
    senses: [
      {
        text: "Univerzalni uvod v strokovno izjavo. Napove, da je bilo nekoč bolje, ceneje ali iz pravega jekla.",
      },
    ],
    example: "Ja, veš … to ni več tisto jeklo.",
  },
  "za-moich-czasow": {
    headword: "v mojih časih",
    grammar: "predložna zveza, časovna enota",
    usage:
      "Zveza uvede primerjavo sedanjosti z govorčevo mladostjo, skoraj vedno v škodo sedanjosti. Pade v pogovorih o cenah, delu, šoli in vzgoji otrok. Natančen datum se v njej le redko pojavi: »moji časi« so navadno leta, ko je imel govorec od petnajst do trideset let.",
    pronunciation: "izg. s poudarkom na »mojih«",
    senses: [
      { text: "Obdobje z nedoločenimi mejami, v katerem je bilo vse cenejše, trpežnejše in poštenejše." },
      { text: "Argument, ki konča razpravo, ne glede na njeno temo." },
    ],
    example: "V mojih časih je žemlja stala dvajset grošev in je bila večja.",
  },
  "kiedys-to-byly-zimy": {
    headword: "včasih so bile prave zime",
    grammar: "meteorološki stavek",
    usage:
      "Rek pomeni, da so bile zime nekoč hladnejše in bolj zasnežene kot danes. Pade ob vsaki odjugi, v pogovorih o vremenu in ob spominih na otroštvo. Podnebni podatki res kažejo, da so zime milejše, a stavek ne temelji na podatkih, temveč na spominu.",
    pronunciation: "izg. ne glede na letni čas",
    senses: [
      {
        text: "Trditev, da so snežne padavine v letih 1979–1987 presegle vse, kar je sledilo pozneje. Ne potrebuje podatkov.",
      },
    ],
    example: "Včasih so bile prave zime. V šolo pet kilometrov v hrib. V obe smeri.",
  },
  "ja-nie-potrzebuje-instrukcji": {
    headword: "jaz ne rabim navodil",
    usage:
      "Izjava, da bo govorec sestavil ali uporabljal napravo brez branja navodil, na podlagi izkušenj in občutka. Najpogosteje pade pri sestavljanju pohištva, priklapljanju naprav in prvem zagonu novega telefona. Navodila pridejo na vrsto šele, ko ostanejo deli, ki jih ni kam priviti.",
    grammar: "izjava o usposobljenosti",
    pronunciation: "izg. samozavestno, tik preden se izgubi vijaček",
    senses: [{ text: "Izjava pred sestavljanjem pohištva, po katerem en del ostane »rezerven«." }],
    example: "Jaz ne rabim navodil. Ta dva vijačka sta rezervna.",
  },
  "ile-pan-za-to-dal": {
    headword: "koliko ste pa dali za to?",
    usage:
      "Vprašanje o ceni, naslovljeno na lastnika novega avtomobila, kolesa, televizorja ali prenove. Navadno ne izvira iz radovednosti, temveč je uvod v oceno, ali je kupec preplačal. Po odgovoru najpogosteje sledi podatek, kje bi bilo ceneje ali kdo bi to uredil prek znancev.",
    grammar: "uvodno vprašanje",
    pronunciation: "izg. z vnaprej pripravljeno nejevero",
    senses: [{ text: "Začetek vsakega pogovora o nakupu. Vsak odgovor je previsok." }],
    example: "Koliko ste pa dali za to? Jaz bi vam to zrihtal za pol cene.",
  },
  "nie-ruszaj-mam-to-poustawiane": {
    headword: "pusti, imam nastavljeno",
    grammar: "varovalna formula",
    usage:
      "»Nastavljeno« pomeni urejeno po svoje: programi, glasnost, naslanjač ali ogledala so nastavljeni in vsaka sprememba grozi, da se ta ureditev izgubi. Zveza je prošnja, naj nihče ničesar ne premika, izrečena hitreje, kot se je kdor koli česa dotaknil. Pogosto velja za nastavitve, ki jih govorec sam ne bi znal ponoviti.",
    pronunciation: "izg. hitro, z roko, iztegnjeno proti daljincu",
    senses: [{ text: "Prepoved, ki velja za daljinec, televizor, naslanjač in ogledala v avtu." }],
    example: "Pusti daljinec, imam nastavljeno.",
    exampleNote: "Nastavljen je en sam program.",
  },
  "kto-panu-to-tak-zrobil": {
    headword: "kdo vam je pa to delal?",
    usage:
      "Retorično vprašanje mojstra ali samozvanega izvedenca, ki si ogleduje tujo napeljavo, prenovo ali popravilo in jih oceni slabo. Pomeni približno »to je narejeno narobe«. Sliši ga skoraj vsak, ki je za predhodnikom poklical vodovodarja, električarja ali mehanika; dziadersko postane, ko pade na obisku, brez povabila k ogledu.",
    grammar: "retorično vprašanje",
    pronunciation: "izg. z nejevero, ob ogledu tujega dela",
    senses: [{ text: "Uvodna formula ob vsakem ogledu tuje prenove. Odgovor ni pomemben." }],
    example: "Kdo vam je pa to delal? Sami? No, potem je vse jasno.",
  },
  "tego-juz-teraz-nie-robia": {
    headword: "tega več ne delajo",
    grammar: "povedni stavek, nostalgični",
    usage:
      "Zveza izraža prepričanje, da so bili nekdanji predmeti trpežnejši in trdnejši od današnjih. Pade ob starih avtomobilih, orodju, pohištvu in gospodinjskih aparatih, pogosto s trkanjem po ohišju. Včasih drži, saj so mnoge stare stvari preživele, a pozabi na tiste, ki so se pokvarile in so že zdavnaj na odpadu.",
    pronunciation: "izg. z dlanjo na karoseriji",
    senses: [
      { text: "Ocena predmeta, izdelanega pred letom 2004. Vedno pozitivna." },
      { text: "Prikrita ocena vsega, kar je bilo izdelano pozneje." },
    ],
    example: "Ja, veš, to je pločevina. Tega več ne delajo.",
  },
  "diesel-to-jest-diesel": {
    headword: "dizel je dizel",
    grammar: "avtomobilska tavtologija",
    usage:
      "Tavtologija, ki pomeni, da je dizelski motor po definiciji najboljša izbira: varčen, trpežen in »vleče«. Pade v sporih o pogonu, zlasti ko kdo omeni bencin, hibrid ali električni avto. Ne vsebuje argumenta, le njegovo napoved; pogovor se nato navadno nadaljuje s porabo na avtocesti in z legendarnim motorjem 1.9 TDI.",
    pronunciation: "izg. v tonu, ki zaključi razpravo",
    senses: [
      { text: "Argument, ki odloči vsak spor o avtomobilih. Ne potrebuje utemeljitve, ker je sam utemeljitev." },
    ],
    example: "Električni? Pa doseg? Pa pozimi? Dizel je dizel.",
  },
  "nie-tak-sie-rozpala": {
    headword: "tako se ne kuri",
    usage:
      "Pripomba osebi, ki prižiga žar, ogenj ali peč, da to dela narobe. V praksi napove, da bo opravilo prevzel govorec: »daj, ti pokažem«. Spori se navadno vrtijo okoli podžigalnika, vrstnega reda oglja in tega, ali je dovoljeno pihati.",
    grammar: "popravljalna zveza",
    pronunciation: "izg. z razdalje nekaj metrov, na poti k žaru",
    senses: [{ text: "Sporočilo, ki napove prevzem klešč." }],
    example: "Tako se ne kuri. Daj, ti pokažem.",
  },
  "karkowka-musi-swoje-odstac": {
    headword: "zarebrnica mora svoje odležati",
    usage:
      "Kuharsko pravilo, da mora meso za žar, zlasti zarebrnica, dovolj dolgo stati v marinadi pred peko. Da mora nekaj »svoje odležati«, pomeni, da potrebuje čas in se ga ne gre prehiteti. Rek pade tudi zunaj kuhinje: pri pecivu, domačem likerju in odločitvah.",
    grammar: "tehnološko načelo",
    pronunciation: "izg. svečano",
    senses: [
      { text: "Pravilo, po katerem se mora meso marinirati vsaj dan in noč, najbolje v skledi, pokriti s krožnikom." },
      { text: "Utemeljitev vsake zamude." },
    ],
    example: "Še ne jemo. Zarebrnica mora svoje odležati.",
  },
  "to-jest-moje-miejsce": {
    headword: "to je moj plac",
    usage:
      "Izjava o pravici do parkirnega mesta, mesta za mizo, na kavču ali v cerkveni klopi. Pogosto gre za mesto, ki formalno ne pripada nikomur, a ga nekdo zaseda že leta in ima to za pravni naslov. Med sosedi je lahko začetek dolgoletnega spora. »Plac« je pogovorno za prostor.",
    grammar: "teritorialna izjava",
    pronunciation: "izg. z balkona, z roko, ki kaže na parkirišče",
    senses: [{ text: "Pravna podlaga za zasedanje parkirnega mesta, ki ni bilo nikoli nikomur dodeljeno." }],
    example: "Gospod, to je moj plac. Od sedemindevetdesetega.",
  },
  "kiedys-to-sie-pracowalo": {
    headword: "včasih se je garalo",
    grammar: "spominski stavek",
    usage:
      "Zveza postavlja nekdanje težko fizično delo nasproti današnjemu, ki se govorcu zdi lažje: pisarniškemu, delu od doma ali »za računalnikom«. Pade v pogovorih o mlajši generaciji in dopustih. Navadno ne gre za število ur, temveč za to, ali se delo vidi: utrujenost za pisalno mizo se ne šteje v delovno dobo.",
    pronunciation: "izg. med odmorom za kavo",
    senses: [{ text: "Trditev, da je bilo delo nekoč težje, daljše in bolj resnično kot danes." }],
    example: "Včasih se je garalo, ne pa ta vaš home office.",
  },
  "zrobmy-calla": {
    headword: "dajmo en call",
    grammar: "korporativni izraz",
    usage:
      "»Call« je izposojenka iz angleščine za telefonski ali video klic, najpogosteje službeni. »Dajmo en call« torej pomeni »pogovorimo se na spletnem sestanku«. Zveza spada v korporativni jezik, ob »sestanek o sestanku«, »feedback« in »asap«; v Slovar pride zaradi dziadersa, ki jo rad uporablja, zapiske pa še vedno tiska.",
    pronunciation: "izg. tik pred sklicem sestanka v živo",
    senses: [{ text: "Predlog pogovora, po katerem se zapisnik vseeno natisne." }],
    example: "Dajmo en call. Ali pa raje skoči do mene.",
  },
  "pozdrawiam-serdecznie": {
    headword: "lep pozdrav",
    grammar: "sklepna formula",
    usage:
      "»Lep pozdrav« je vljudnostna formula, s katero se konča pismo, e-pošta ali sporočilo. V službeni korespondenci velja za vljudno in nevtralno. V kratkem sporočilu v klepetu, zlasti za besedo »ok«, pa zveni zelo uradno, včasih celo hladno. V poljskem izvirniku je to »pozdrawiam serdecznie«, dobesedno »prisrčno pozdravljam«.",
    pronunciation: "izg. s piko na koncu",
    senses: [{ text: "Zaključek vsakega sporočila, tudi sporočila v klepetu z vsebino »ok«." }],
    example: "Ok. Lep pozdrav.",
  },
  "udostepnij-zanim-usuna": {
    headword: "deli, preden izbrišejo",
    usage:
      "Poziv k hitremu deljenju objave na družbenih omrežjih, domnevno preden jo kdo blokira ali izbriše. Značilen je za verižna sporočila, senzacionalne »prikrite resnice« in lažne zdravstvene novice. Že sama formula je opozorilni znak: vsebina, ki jo kdo res hoče izbrisati, redko prosi za deljenje z velikimi črkami.",
    grammar: "poziv",
    pronunciation: "izg. z velikimi tiskanimi črkami",
    senses: [{ text: "Navodilo, priloženo vsebinam, ki jih nihče ne namerava izbrisati." }],
    example: "DELI, PREDEN IZBRIŠEJO!!! Zdravniki to sovražijo.",
  },
  "kto-pamieta": {
    headword: "kdo se še spomni?",
    usage:
      "Vprašanje pod fotografijo predmeta, oddaje ali izdelka izpred let, ki spodbuja spomine in komentarje. Priljubljeno je v nostalgičnih skupinah, zlasti o osemdesetih in devetdesetih letih. Navadno ne pričakuje odgovora, temveč plaz komentarjev »jaz se spomnim« in zgodb iz otroštva.",
    grammar: "retorično vprašanje, spletno",
    pronunciation: "izg. pod fotografijo iz osemdesetih let",
    senses: [
      {
        text: "Podpis pod fotografijo predmeta izpred štiridesetih let, ki sproži plaz komentarjev »Jaz se spomnim«.",
      },
    ],
    example: "Sifon za sodavico. Kdo se še spomni?",
  },
  "ja-te-miejsca-znam-od-czterdziestu-lat": {
    headword: "jaz ta mesta poznam že štirideset let",
    usage:
      "Izjava o izkušnjah gobarja, ribiča ali pohodnika: govorec teren pozna že dolgo in ve, kam je vredno iti. V praksi navadno pomeni, da teh mest ne bo izdal. Pade tudi kot argument v sporu o poti, ko navigacija vodi drugam.",
    grammar: "gobarska izjava",
    pronunciation: "izg. s pridušenim glasom, s košaro v roki",
    senses: [{ text: "Stavek, ki ne vsebuje nobene informacije o mestih." }],
    example: "Kje si bil? V gozdu. Jaz ta mesta poznam že štirideset let.",
  },
  "bedzie-padac-czuje-w-kolanie": {
    headword: "dež bo, me trga v kolenu",
    usage:
      "Vremenska napoved na podlagi občutkov v sklepih. Bolečina v kolenu, križu ali stari poškodbi naj bi napovedovala dež. Veliko ljudi to opisuje, raziskave pa ne dajejo enoznačnega odgovora, ali bolečino res povzročajo spremembe zračnega tlaka. V pogovoru rek deluje kot argument proti odhodu brez dežnika.",
    grammar: "vremenska napoved",
    pronunciation: "izg. z roko na kolenu",
    senses: [
      {
        text: "Meteorološko sporočilo s 54-odstotno zanesljivostjo, ki je po mnenju pošiljatelja višja od zanesljivosti televizijskih napovedi.",
      },
    ],
    example: "Ne jemlji kolesa. Dež bo, me trga v kolenu.",
  },
  "taka-byla": {
    headword: "takale je bila",
    usage:
      "Ribiški opis velikosti ribe, ki se je odtrgala ali jo je ribič spustil, s kretnjo razprtih rok. Nihče razen govorca je ni videl, razdalja med dlanmi pa raste z vsako pripovedjo. Rek je prešel v pogovorni jezik kot oznaka za vsako hvalisanje, ki ga ni mogoče preveriti.",
    grammar: "ribiški medmet",
    pronunciation: "izg. z razprtimi rokami",
    senses: [
      { text: "Opis ribe, ki je razen govorca ni videl nihče. Razpon rok se z vsako pripovedjo poveča." },
    ],
    example: "Odtrgala se je tik ob bregu. Takale je bila.",
  },
  "dzis-nie-braly": {
    headword: "danes ni prijemalo",
    usage:
      "Ribiško pojasnilo, da se ni ujelo nič, ker ribe niso prijemale vabe. Krivi so lahko zračni tlak, veter, polna luna ali pretopla oziroma premrzla voda, nikoli pa ribičeva spretnost. V šali se tako reče tudi vsakemu neuspešnemu dnevu v službi ali trgovini.",
    grammar: "povzetek dneva",
    pronunciation: "izg. vedro",
    senses: [{ text: "Pojasnilo vrnitve s prazno mrežo, ki se ne nanaša na spretnost ribiča." }],
    example: "Pritisk je skakal. Danes ni prijemalo.",
  },
  "zgas-swiatlo-prad-nie-jest-za-darmo": {
    headword: "ugasni luč, elektrika ni zastonj",
    grammar: "opomin",
    usage:
      "Opomin, naj ugašamo luč, ko zapustimo sobo, ker elektrika stane. Spada v domači kanon varčevanja, ob zapiranju vode in hladilnika. Nasvet je razumen; dziaderski postane zaradi tempa, s katerim se izreka, in zato, ker velja za vse razen za televizor, ki igra v prazni dnevni sobi.",
    pronunciation: "izg. iz druge sobe",
    senses: [{ text: "Sporočilo, izrečeno, ko član gospodinjstva zapusti sobo za dlje kot štiri sekunde." }],
    example: "Kam greš? Ugasni luč, elektrika ni zastonj.",
  },
  "rzuce-wszystko-i-wyjade-w-bieszczady": {
    headword: "vse bom pustil in šel past ovce",
    grammar: "izjava",
    usage:
      "Zveza pomeni: dovolj imam obveznosti in sanjam o preprostem življenju daleč od ljudi. Navadno je šala ali vzdih po napornem dnevu, ne pa načrt z datumom odhoda. Poljski izvirnik omenja Bieszczade, gorovje na jugovzhodu Poljske, ki je že desetletja simbol pobega iz mesta.",
    pronunciation: "izg. po drugem pivu",
    senses: [{ text: "Življenjski načrt, ki ga uresniči manj kot odstotek tistih, ki ga napovejo." }],
    example: "Še eno leto v tej firmi, potem pa bom vse pustil in šel past ovce¹.",
    notes: [
      "¹ Past ovce: v izvirniku »oditi v Bieszczady«, v gorovje na jugovzhodu Poljske. Tja se Poljaki umaknejo pred službo, večinoma v mislih.",
    ],
  },
  "wnuczek-mi-to-ustawil": {
    headword: "vnukec mi je to nastavil",
    grammar: "tehnološko pojasnilo",
    usage:
      "Zveza pojasni, da je napravo nastavil mlajši družinski član, zato govorec ne odgovarja za njeno delovanje in ničesar ne namerava spreminjati. Velja za telefone, televizorje, usmerjevalnike in bančne aplikacije. Je tudi prošnja: če nekaj preneha delovati, lahko to popravi le isti vnukec.",
    pronunciation: "izg. z nemočnim nasmehom",
    senses: [
      { text: "Formula, ki govorca odvezuje odgovornosti za delovanje katere koli elektronske naprave v hiši." },
    ],
    example: "Ne vem, zakaj igra. Vnukec mi je to nastavil.",
  },
  "a-ile-pali": {
    headword: "koliko pa porabi?",
    usage:
      "Vprašanje o porabi goriva, torej o tem, koliko litrov avto porabi na sto kilometrov. Za mnoge voznike je to prvi in najpomembnejši podatek o avtomobilu, pomembnejši od opreme in varnosti. Po odgovoru navadno sledi primerjava z lastnim dizlom, ki porabi manj.",
    grammar: "avtomobilsko vprašanje",
    pronunciation: "izg. pred katerim koli drugim vprašanjem",
    senses: [
      {
        text: "Edino vprašanje o avtomobilu, ki ga je vredno zastaviti. Hitrost, oprema in varnost niso pomembne.",
      },
    ],
    example: "Lep je. Koliko pa porabi?",
  },
  "ja-tylko-zapytac": {
    headword: "jaz bi samo vprašal",
    grammar: "pogojnik prednosti",
    usage:
      "Formula, s katero kdo stopi do okenca mimo vrste, ker ima »samo vprašanje«. Predpostavlja, da bo vprašanje trajalo trenutek in ne zahteva čakanja. V praksi se pogosto prelevi v urejanje cele zadeve, kar v vrsti sproži glasno »Vi pa niste bili v vrsti!«.",
    pronunciation: "izg. že pri okencu, s hrbtom proti vrsti",
    senses: [
      {
        text: "Formula, ki omogoča obiti vrsto katere koli dolžine. Vprašanje traja povprečno štiri minute in obsega 3,4 dodatnega vprašanja.",
      },
      { text: "Prepričanje, da vrsta velja za tiste, ki imajo opravek, ne pa za tiste, ki imajo vprašanje." },
    ],
    example: "Oprostite, jaz bi samo vprašal. Pa še paket bom kar oddal.",
    exampleNote: "Paketov je bilo pet. Vsi z odkupnino.",
  },
  "ja-tu-stalem": {
    headword: "jaz sem bil tukaj",
    usage:
      "Stavek v vrsti, s katerim nekdo sporoči, da je že čakal, a je za hip odšel. Lahko je pošten, ker je kdo res šel po košarico, in lahko je zlorabljen, ko se kdo pojavi tik pred okencem. Vrsta ga navadno sprejme z vzdihom in tiho preverbo.",
    grammar: "preteklik, lastninski",
    pronunciation: "izg. ogorčeno, po vrnitvi od mesnega pulta",
    senses: [
      { text: "Pravni naslov za mesto v vrsti, pridobljen v ne natančneje določenem trenutku v preteklosti." },
      { text: "Pravica, ki jo je mogoče prenesti na kateri koli predmet, puščen v vrsti: košaro, vrečko ali svaka." },
    ],
    example: "Oprostite, jaz sem bil tukaj. Za tem gospodom v jakni.",
    exampleNote: "Gospod v jakni je trgovino zapustil dvajset minut prej.",
  },
  "moze-by-tak-druga-kase-otworzyli": {
    headword: "a ne bi odprli še ene blagajne?",
    usage:
      "Na glas izrečena prošnja osebju trgovine, naj odpre še eno blagajno, ker je vrsta predolga. Pogosteje je namenjena vsej vrsti kot blagajničarki in pokaže, da govorec ne namerava čakati tiho. Učinkuje presenetljivo pogosto, zlasti ko jo ponovi več ljudi.",
    grammar: "postopkovni predlog",
    pronunciation: "izg. glasno, proti vrsti, ne proti blagajničarki",
    senses: [
      { text: "Zahteva, podana, ko pred govorcem stojijo že tri osebe." },
      { text: "Prepričanje, da v zaledju vsake trgovine čaka druga blagajničarka, ki je preprosto nihče ni poklical." },
    ],
    example: "A ne bi odprli še ene blagajne? Ljudje čakajo.",
    exampleNote: "Drugo blagajno so odprli. Govorec je k njej prestopil prvi.",
  },
  "kto-to-tak-zaparkowal": {
    headword: "kdo je pa tako parkiral?",
    usage:
      "Vprašanje o vozniku, ki je parkiral postrani, na dveh mestih ali zaprl izvoz. Izraža jezo in je izrečeno na glas, čeprav v bližini ni nikogar. Lahko je uvod v listek za brisalcem, klic redarstvu ali fotografijo v skupini stanovalcev.",
    grammar: "preiskovalno vprašanje",
    pronunciation: "izg. proti oknom celega bloka",
    senses: [{ text: "Vprašanje, zastavljeno ob vsakem postrani parkiranem avtomobilu, razen ob lastnem." }],
    example: "Kdo je pa tako parkiral? Saj se od tod ne da speljati.",
    exampleNote: "Govorec stoji zraven, na prepovedanem mestu, z vklopljenimi varnostnimi utripalkami.",
  },
  "w-niemczech-to-by": {
    headword: "v Nemčiji bi to …",
    usage:
      "Začetek primerjave, v kateri tujina, najpogosteje Nemčija, odreže bolje od domovine: ceste, uradi, red, plače. Navadno temelji na sezonskem delu, izletu ali pripovedi svaka. Rek izraža nezadovoljstvo z domačimi razmerami, ne pa resničnega poznavanja Nemčije.",
    grammar: "pogojnik, inozemski",
    pronunciation: "izg. s premorom, ki naj ga poslušalec zapolni sam",
    senses: [
      {
        text: "Uvod v primerjavo, katere izid je znan vnaprej. Govorčevo znanje o Nemčiji izvira iz treh sezon obiranja špargljev in enega passata.",
      },
      { text: "Vzor reda, ki velja za vse razen za govorca." },
    ],
    example: "V Nemčiji bi to luknjo zakrpali v enem dnevu.",
    exampleNote: "Luknja je pred govorčevo hišo od leta 2009. Govorec je ni prijavil.",
  },
  "oryginal-niemiecki": {
    headword: "original, iz Nemčije",
    grammar: "potrdilo o poreklu",
    usage:
      "Zveza poudari, da predmet prihaja iz Nemčije, kar na trgu rabljenih stvari že dolgo velja za jamstvo kakovosti. Pade pri prodaji avtomobilov, delov, orodja in čistil. Namiguje, da je stvar boljša od domače, tudi če je bila izdelana drugje, v Nemčiji pa le kupljena.",
    pronunciation: "izg. z eno roko na srcu, z drugo na pokrovu motorja",
    senses: [
      {
        text: "Najvišja stopnja kakovosti v dziaderski klasifikaciji. Pripada avtomobilskim delom, električnemu orodju in pralnemu prašku, če so prispeli izza Odre¹.",
      },
      { text: "Vsak predmet, ki je prestopil mejo v prtljažniku, ne glede na državo izdelave." },
    ],
    example: "Golf IV, letnik 2003. Original, iz Nemčije. Nemec je jokal, ko ga je prodajal.",
    exampleNote: "Prevoženih 186 tisoč kilometrov, po podatkih števca in prodajalca.",
    notes: ["¹ Izza Odre: iz Nemčije; Odra teče po poljsko-nemški meji. Slovenska ustreznica je pralni prašek iz Avstrije."],
  },
  "to-sie-rozjezdzi": {
    headword: "to se bo že uteklo",
    usage:
      "Avtomobilistična diagnoza, da bo zaskrbljujoč zvok, tresljaj ali nova okvara izginila sama med vožnjo. Pri novih gumah ali zavornih ploščicah je lahko resnična; pogosteje pomeni odlog obiska pri mehaniku. Mehanik jo pozneje sliši kot uvod v stavek »tolče že en mesec«.",
    grammar: "tehnična napoved",
    pronunciation: "izg. brez umika noge s plina",
    senses: [
      {
        text: "Diagnoza vsakega novega zvoka v avtomobilu, vključno s trkanjem, cviljenjem in tuljenjem v tretji prestavi.",
      },
      { text: "Splošna metoda reševanja težav, po kateri se jih pusti pri miru." },
    ],
    example: "Trka od Radoma? To se bo že uteklo.",
    exampleNote: "Trkanje je ponehalo pri Kielcah, skupaj z motorjem. Naprej z avtovleko.",
  },
  "nie-po-to-kupowalem": {
    headword: "to je za ta lepše",
    usage:
      "Pridržek, da je stvar kupljena za ogled, ne za uporabo, kot servis »za goste«, nova preproga, kavč v foliji ali kristal v regalu. Izhaja iz spoštovanja do dragih predmetov, kupljenih s trudom. Posledica je, da najlepše stvari v hiši čakajo na priložnost, ki le redko pride.",
    grammar: "muzejska klavzula",
    pronunciation: "izg. z roko, ki zapira pot do regala",
    senses: [
      {
        text: "Prepoved uporabe predmeta v skladu z njegovim namenom. Velja za jedilni servis, preprogo v dnevni sobi in nov kavč.",
      },
      { text: "Načelo, po katerem najboljše stvari v hiši čakajo na priložnost, ki ne pride." },
    ],
    example: "Iz tega servisa se ne je. To je za ta lepše.",
    exampleNote: "Od leta 1989 je servis zapustil regal dvakrat, obakrat zaradi brisanja prahu.",
  },
  "ja-bym-to-strzelil": {
    headword: "jaz bi to zabil",
    grammar: "pogojni stavek, nepreverljiv",
    usage:
      "Navijaški komentar, ki pomeni, da je igralec zapravil lahko priložnost, ki bi jo govorec zagotovo izkoristil. Pade pred televizorjem, med tekmo ali takoj po njej. V širšem smislu velja za vsako tujo odločitev, ocenjeno z udobnega položaja: s kavča je vse preprostejše, kot je bilo na igrišču.",
    pronunciation: "izg. s kavča, med ponovnim posnetkom",
    senses: [
      {
        text: "Ocena priložnosti pred vrati, podana nekaj sto kilometrov od igrišča. Govorčeva učinkovitost v teh razmerah znaša 100 %.",
      },
      { text: "Komentar vsake tuje odločitve, o kateri je govorec razmišljal dlje kot njen avtor." },
    ],
    example: "S petih metrov, na prazen gol? Jaz bi to zabil.",
    exampleNote: "Zadnji dokumentirani strel govorca, sprožen leta 1982, je zadel okno soseda iz pritličja.",
  },
  "sedzia-kalosz": {
    headword: "sodnik, očala!",
    usage:
      "Navijaški vzklik sodniku, ki po mnenju govorca slabo sodi, kot da ne vidi, kaj se dogaja na igrišču. Pade na stadionu in pred televizorjem po vsaki odločitvi v škodo »naših«. Ne velja za sodnike, ki so dosodili enajstmetrovko pravi ekipi. V poljskem izvirniku je sodnik »kalosz«, galoša, torej nerodnež.",
    grammar: "ogovor, službena ocena",
    pronunciation: "izg. proti televizorju, ki zvoka ne prenaša v nasprotno smer",
    senses: [
      { text: "Ocena usposobljenosti sodnika, podana po vsakem žvižgu v škodo moštva, za katero navija govorec." },
      {
        text: "Vsak, ki spor razsodi v škodo govorca, vključno s kontrolorjem vozovnic in svakom, ki piše točke pri taroku.",
      },
    ],
    example: "Kakšen ofsajd? Kje je tukaj ofsajd? Sodnik, očala!",
    exampleNote: "Ponovni posnetek je pokazal dva metra prepovedanega položaja. Mnenje govorca je ostalo nespremenjeno.",
  },
  "cicho-bo-ryby-sploszysz": {
    headword: "tiho, ribe boš splašil",
    grammar: "zapoved tišine, enostranska",
    usage:
      "Ribiški opomin, naj ne govorimo in ne delamo hrupa, ker hrup prežene ribe. Ribiči se prepirajo, koliko ribe slišijo pogovor na bregu, a topotanje po pomolu in udarci ob čoln jih lahko splašijo. V Slovar pride zaradi dziadersa, ker prepoved velja za vse razen za tistega, ki jo razglasi.",
    pronunciation: "izg. s šepetom, ki se sliši na drugem bregu",
    senses: [
      { text: "Prepoved pogovora, ki na pomolu velja za vse razen za govorca." },
      { text: "Rezervno pojasnilo, pripravljeno za primer, da ne bi prijemalo." },
    ],
    example: "Tiho, ribe boš splašil. A veš, kakšno ščuko sem tukaj potegnil ven šestinosemdesetega?",
    exampleNote: "Pripoved je trajala štirideset minut. Ni prijemalo.",
  },
  "a-gdzie-jest-pilot": {
    headword: "kje je pa daljinec?",
    grammar: "prijava pogrešanja",
    usage:
      "Vprašanje o izgubljenem daljincu, zastavljeno vsem v hiši hkrati. Navadno pade tik pred pomembno oddajo in preden vprašalec preišče najbližjo okolico: žepe, naslanjač in kavč. V mnogih družinah je obred, ki mu sledi skupno prekopavanje blazin in ugotavljanje, kdo je zadnji gledal.",
    pronunciation: "izg. iz naslanjača, brez vstajanja",
    senses: [
      {
        text: "Vprašanje, naslovljeno na vse člane gospodinjstva hkrati. Zastavljeno je, preden govorec preveri lastni žep, naslon za roke in mesto, na katerem sedi.",
      },
      { text: "Razpis iskalne akcije, v kateri govorec ne sodeluje." },
    ],
    example: "Zdaj bodo poročila. Kje je pa daljinec? Kdo je šaril po daljincu?",
    exampleNote: "Daljinec so našli po dvajsetih minutah, pod govorcem.",
  },
  "dobrze-karmili": {
    headword: "dobro smo jedli",
    usage:
      "Najkrajša ocena pogostitve, zlasti svatbe: hrane je bilo veliko in bila je dobra. Za mnoge goste je to osnovno merilo uspešnega slavja, poleg števila toplih jedi in tega, ali je česa zmanjkalo. Če ta ocena v pripovedi o svatbi manjka, jo poslušalci razumejo kot opozorilo.",
    grammar: "recenzija, izčrpna",
    pronunciation: "izg. s priznanjem, v ponedeljek po drugem dnevu svatbe",
    senses: [
      {
        text: "Celotno poročilo s svatbe. Drugi deli slavja, vključno z mladoporočencema, niso predmet ocene.",
      },
    ],
    example: "Kako je bilo na ohceti? Dobro smo jedli. Štiri tople jedi.",
    exampleNote: "Imena ženina si govorec ni zapomnil.",
  },
  "pusc-pan-cos-normalnego": {
    headword: "šef, daj kaj normalnega",
    grammar: "velelnik, vljudnostni",
    usage:
      "Prošnja didžeju, šoferju ali prodajalcu, naj zamenja glasbo za takšno, ki jo govorec pozna in ima rad. »Normalno« navadno pomeni uspešnice izpred let, »nenormalno« pa vse, kar je izšlo pozneje. Ogovor »šef« je značilen za svatbe, taksije in družinska praznovanja.",
    pronunciation: "izg. didžeju, s komolcem na mešalni mizi",
    senses: [
      {
        text: "Naročilo skladbe, ki jo govorec šteje za glasbo. Seznam takšnih skladb je zaprt od leta 1994 in obsega enajst enot.",
      },
    ],
    example: "Šef, kaj je pa to? Daj kaj normalnega.",
    exampleNote: "Naročilo je bilo izpolnjeno. Govorec je plesal brez prestanka do oczepin¹.",
    notes: [
      "¹ Oczepiny: polnočni obred poljske svatbe, pri katerem nevesta odloži tančico. Sledijo igre za goste, ki se jim ni mogoče izogniti.",
    ],
  },
  "znowu-puszczaja-kevina": {
    headword: "spet dajejo Sam doma",
    usage:
      "Pripomba k prazničnemu sporedu: televizija okoli božiča že leta predvaja komedijo »Sam doma«. Za ene je to pritoževanje nad ponovitvami, za druge znak, da so se prazniki res začeli. Film navadno gledajo tudi tisti, ki se pritožujejo.",
    grammar: "programsko obvestilo, ciklično",
    pronunciation: "izg. z neodobravanjem, medtem ko se udobneje namešča v naslanjač",
    senses: [
      { text: "Vsakoletno začudenje nad prazničnim televizijskim sporedom, izraženo že več kot dvajset let v istem tonu." },
      { text: "Znak, da je sveti večer¹ vstopil v naslanjačno fazo." },
    ],
    example: "Spet dajejo Sam doma². Vsako leto isto.",
    exampleNote: "Govorec je film pogledal do konca. Šestindvajsetič.",
    notes: [
      "¹ Sveti večer: na Poljskem Wigilia, osrednji praznični večer. Postna večerja z dvanajstimi jedmi se začne ob prvi zvezdi, darila se odprejo isti večer.",
      "² Sam doma: v poljščini Kevin sam w domu. Televizija Polsat ga za božič predvaja že več kot dvajset let, zato mu Poljaki pravijo kar Kevin.",
    ],
  },
  "umawialismy-sie-ze-bez-prezentow": {
    headword: "zmenili smo se, da brez daril",
    usage:
      "Opomin na družinski dogovor, da za praznike, rojstni dan ali god nihče ne kupuje daril. Dogovor naj bi prihranil denar in stres, a ga navadno prelomi nekdo s »samo malenkostjo«, drugi pa se počutijo osramočene. Zato rek najpogosteje pade v trenutku, ko se darilo izroča.",
    grammar: "dogovor, nezavezujoč",
    pronunciation: "izg. očitajoče, z zavitkom, skritim za hrbtom",
    senses: [{ text: "Dogovor, ki se sklene vsako leto novembra in ga vsako leto hkrati prekršijo vse strani." }],
    example: "Saj smo se zmenili, da brez daril. No, dobro, tudi jaz nekaj imam.",
    exampleNote: "Komplet nasadnih ključev, kupljen oktobra v akciji iz letaka.",
  },
  "a-to-do-kogo": {
    headword: "h komu je pa ta prišel?",
    grammar: "evidenčno vprašanje",
    usage:
      "Vprašanje, h komu je prišel neznani avto ali obiskovalec, ki ga zastavi sosed, ki pozna vse avtomobile na ulici. Izraža radovednost, včasih budnost, in spada v repertoar blokovskih naselij in vasi. Odgovor je le redko potreben: vprašalec ga navadno ugotovi sam, ko opazuje, pred katerim vhodom je gost parkiral.",
    pronunciation: "izg. izza zavese, s komolci na blazini",
    senses: [
      {
        text: "Vprašanje ob pogledu na vsak avtomobil in vsako osebo zunaj evidence, ki jo govorec vodi z okna od leta 1993.",
      },
      { text: "Uvedba preiskovalnega postopka, ki se praviloma zaključi pred večerjo." },
    ],
    example: "Srebrna astra, tablice niso naše. H komu je pa ta prišel?",
    exampleNote: "Zadevo so zaprli ob 18.40. K tistim iz tretjega, ki prenavljajo.",
  },
  "ja-tam-w-oknie-nie-siedze": {
    headword: "saj jaz ne visim na oknu",
    usage:
      "Pridržek, da govorec ne opazuje sosedov, izrečen tik pred natančnim poročilom o tem, kaj so sosedje počeli. Soseda ali sosed na oknu je stalnica vsakega bloka: ve, kdo je prišel, kdo odšel in ob kateri uri. Rek je torej zanikanje, ki potrjuje.",
    grammar: "uvodni pridržek",
    pronunciation: "izg. mimogrede, tik preden navede uro na minuto natančno",
    senses: [
      {
        text: "Formula pred podrobnim poročilom o tem, kdo je kdaj in s kom prišel v blok ali odšel iz njega.",
      },
    ],
    example: "Saj jaz ne visim na oknu, ampak tisti iz četrtega je prišel domov ob 2.17. S taksijem.",
    exampleNote: "Poročilo je bilo sestavljeno brez daljnogleda. Daljnogled je bil na popravilu.",
  },
  "trzeba-wypoziomowac": {
    headword: "najprej je treba izravnati",
    usage:
      "Nasvet, naj se prikolica, avtodom, šotor, pralni stroj ali polica postavi popolnoma vodoravno, navadno z libelo in podložkami. V kampu je to prva dolžnost po prihodu, saj se v nagnjenem avtodomu slabo spi, hladilnik pa slabše hladi. Težava se začne, ko izravnavanje traja dlje od dopusta.",
    grammar: "tehnično priporočilo",
    pronunciation: "izg. kleče, z libelo, prislonjeno na prag prikolice",
    senses: [
      {
        text: "Prvo opravilo po prihodu v kamp. Traja od štiridesetih minut do celega popoldneva, odstopanje, večje od dveh milimetrov, pa velja za poraz.",
      },
    ],
    example: "Ne postavljajte še stolčkov. Najprej je treba izravnati.",
    exampleNote: "Bivanje je trajalo tri dni. Prikolica je stala ravno zadnji dan.",
  },
  "a-prad-jest-w-cenie": {
    headword: "a je elektrika všteta?",
    usage:
      "Vprašanje, ali cena prenočitve, mesta v kampu ali najema vključuje porabo elektrike. V kampih je priključek pogosto plačljiv posebej, zato je vprašanje smiselno. Dziadersko postane, ko je od odgovora odvisno, ali bodo iz prtljažnika prišli kuhalnik za vodo, hladilnik in oljni radiator.",
    grammar: "povpraševanje",
    pronunciation: "izg. na recepciji, z že odvitim podaljškom",
    senses: [
      {
        text: "Prvo vprašanje v kampu. Od odgovora je odvisno, ali se bodo na parceli pojavili električni kuhalnik vode, prenosni hladilnik in oljni radiator.",
      },
    ],
    example: "Dober dan, za dva tedna. A je elektrika všteta?",
    exampleNote: "Elektrika je bila všteta. Prvi večer so v celem kampu dvakrat izpadle varovalke.",
  },
  "swoje-bez-chemii": {
    headword: "domače, brez kemije",
    usage:
      "Zagotovilo, da zelenjava ali sadje prihaja z domačega vrta ali vrtička in ni bilo škropljeno s fitofarmacevtskimi sredstvi niti gnojeno z umetnimi gnojili. Domači pridelek velja za bolj zdrav in okusnejši od trgovinskega. Rek ne upošteva vedno junijskega škropljenja proti koloradskemu hrošču.",
    grammar: "ekološki atest",
    pronunciation: "izg. čez ograjo, z vrečko v iztegnjeni roki",
    senses: [
      { text: "Potrdilo o kakovosti zelenjave z lastnega vrtička. Ne vključuje podatkov o junijskem škropljenju." },
      { text: "Razlog, zaradi katerega ni mogoče zavrniti tretje vrečke v istem tednu." },
    ],
    example: "Vzemi paradižnik. Vse domače, brez kemije.",
    exampleNote: "Od julija do septembra je govorec na ta način razdal tudi 84 kilogramov bučk.",
  },
  "wyslalem-ci-maila": {
    headword: "poslal sem ti mejl",
    grammar: "telefonsko obvestilo o pošiljki",
    usage:
      "Zveza pomeni telefonsko opozorilo, da je bilo pravkar poslano elektronsko sporočilo. Izhaja iz previdnosti do e-pošte: govorec želi biti prepričan, da je sporočilo prispelo in bo prebrano. V službi je pri nujnih zadevah lahko smiselna; dziaderska postane, ko spremlja vsak mejl, tudi tistega z vsebino »v priponki«.",
    pronunciation: "izg. v slušalko, dve minuti po pošiljanju",
    senses: [
      { text: "Telefonsko obvestilo o poslanem elektronskem sporočilu." },
      { text: "Prepričanje, da sporočilo prispe šele, ko naslovnika nanj vnaprej opozorijo po telefonu." },
    ],
    example: "Halo? Poslal sem ti mejl. Poglej, če je prišel.",
    exampleNote: "V sporočilu je bila prošnja za klic.",
  },
  "mowili-w-telewizji": {
    headword: "rekli so na televiziji",
    usage:
      "Sklicevanje na televizijo kot vir informacij, brez navedbe postaje, oddaje ali datuma. Za del starejših gledalcev je televizija bolj verodostojna od spleta, ker gredo informacije tam skozi uredništvo. V sporu naj bi rek zaključil razpravo, a ga je težko preveriti.",
    grammar: "navedba vira",
    pronunciation: "izg. z dvignjenim kazalcem, kot pri navajanju predpisa",
    senses: [
      { text: "Sklic na vir, ki ne zahteva navedbe programa, oddaje ali datuma." },
      { text: "Argument višjega ranga od vsega, kar je kdor koli prebral na internetu." },
    ],
    example: "Polnilnik v vtičnici vleče elektriko, tudi ko nič ne polni. Rekli so na televiziji.",
    exampleNote: "Oddajo so predvajali leta 2004. Programa se govorec ne spomni.",
  },
  "w-gazetce-bylo-taniej": {
    headword: "v letaku je bilo ceneje",
    grammar: "ustna reklamacija",
    usage:
      "»Letak« je akcijski katalog trgovine s cenami za tekoči teden. Zveza je reklamacija pri blagajni: cena na računu se ne ujema s tisto iz akcije. Včasih je upravičena, saj do razlik prihaja, pogosto pa se izkaže, da je akcija veljala za drugo pakiranje, za imetnike kartice zvestobe ali se je končala včeraj.",
    pronunciation: "izg. pri blagajni, z letakom, razprostrtim na tekočem traku",
    senses: [
      {
        text: "Ugovor zoper ceno na računu, podan na podlagi akcijskega letaka, ki ga govorec nosi zloženega na četrtino v žepu jakne.",
      },
      { text: "Prepričanje, da je vsaka cena, višja od tiste v letaku, napaka trgovine." },
    ],
    example: "Gospa, v letaku je bilo ceneje. Po tri devetindevetdeset.",
    exampleNote: "Letak je veljal za naslednji teden. Govorec se je vrnil v ponedeljek.",
  },
  "to-jest-na-wczoraj": {
    headword: "to rabim za včeraj",
    grammar: "rok, pretečen",
    usage:
      "»Za včeraj« pomeni »zelo nujno, takoj«: zadeva je tako nujna, da bi bilo najbolje, ko bi bila urejena že včeraj. Rek spada v pisarniški žargon in poudari prednost naloge. Ko je vse »za včeraj«, ne pomeni več ničesar razen tega, da je odpovedalo načrtovanje.",
    pronunciation: "izg. med vrati, v petek ob 16.45",
    senses: [
      { text: "Rok za izvedbo naloge, ki je potekel, še preden je bila naloga dodeljena." },
      { text: "Stopnja nujnosti, po kateri naloga čaka na podpis do torka." },
    ],
    example: "Rabim to preglednico. To rabim za včeraj.",
    exampleNote: "Preglednica je pri nadrejenem ležala od ponedeljka.",
  },
  "w-nawiazaniu-do-rozmowy-telefonicznej": {
    headword: "v zvezi z najinim telefonskim pogovorom",
    grammar: "uvodna formula, uradna",
    usage:
      "Uradna formula, s katero se začne pismo ali mejl v zvezi s prejšnjim telefonskim pogovorom. Pomeni »pišem glede tega, o čemer sva govorila« in služi pisni potrditvi dogovora. V poslovni korespondenci je pravilna in koristna; togo zveni v sporočilu nekomu, s katerim si minuto prej govoril za sosednjo mizo.",
    pronunciation: "izg. pisno, dve minuti po pogovoru",
    senses: [
      { text: "Prvi stavek mejla, ki ponovi telefonski pogovor, da bo zapisan." },
      { text: "Dokazno gradivo za primer, da sogovornik pozabi, kaj je obljubil." },
    ],
    example: "V zvezi z najinim telefonskim pogovorom pošiljam dogovorjeno. Prosim za potrditev po telefonu.",
    exampleNote: "Dogovor je bil en sam: da pošlje dogovorjeno.",
  },
  "w-stodole-mieszkasz": {
    headword: "zapri vrata, a si se v štali rodil?",
    grammar: "vzgojno vprašanje, retorično",
    usage:
      "Opomin, naj za seboj zapreš vrata stanovanja, sobe ali balkona. Štala, gospodarsko poslopje s širokimi vrati, služi kot primer kraja, kjer se vrat ne zapira. Vprašanje je retorično in najpogosteje leti na otroke, mačke in toploto, ki po mnenju staršev »uhaja na cesto«. V poljskem izvirniku sprašujejo, ali živiš v skednju.",
    pronunciation: "izg. iz druge sobe, ob odprtem oknu",
    senses: [
      { text: "Opomin, naj zapreš vrata, oblikovan kot vprašanje o kraju rojstva." },
      { text: "Varovanje toplote v stanovanju, v katerem je termostat nastavljen na dvojko." },
    ],
    example: "Zapri vrata! A si se v štali rodil? Toplota uhaja.",
    exampleNote: "Vrata so bila priprta za širino mačke.",
  },
  "dopoki-mieszkasz-pod-moim-dachem": {
    headword: "dokler živiš pod mojo streho",
    grammar: "najemna klavzula, družinska",
    usage:
      "Rek starša odraščajočemu ali odraslemu otroku, ki živi doma, naj spoštuje hišna pravila, ker uporablja stanovanje in je preskrbljen. Pade v sporih o uri vrnitve, redu, obiskih in preživljanju časa. Je argument z položaja moči in navadno konča pogovor, ne pa spora.",
    pronunciation: "izg. na pragu sobe, z roko na podboju",
    senses: [
      { text: "Pravna podlaga za starševske odločitve o uri vrnitve, glasbi in pričeski." },
      { text: "Najemna pogodba brez najemnine, s hišnim redom, ki se razglaša ustno po potrebi." },
    ],
    example: "Dokler živiš pod mojo streho, veljajo moja pravila.",
    exampleNote: "Pravila niso bila zapisana. Veljala so za nazaj.",
  },
  "ja-w-twoim-wieku": {
    headword: "ko sem bil jaz tvojih let",
    grammar: "biografska primerjava",
    usage:
      "Začetek primerjave z lastno mladostjo, v kateri sogovornik odreže slabše, ker se pozneje osamosvoji, manj dela in še nima družine ali stanovanja. Rek navadno spregleda razlike v časih, cenah stanovanj in trgu dela. Lahko je prijazna spodbuda, a pogosteje zveni kot očitek.",
    pronunciation: "izg. s premorom za naštevanje dosežkov",
    senses: [
      { text: "Uvod v pregled, iz katerega izhaja, da je imel govorec pri teh letih že službo, stanovanje, dva otroka in lastnoročno zgrajeno garažo." },
      { text: "Merilo razvojnega zaostanka mlajše generacije, izraženo v letih." },
    ],
    example: "Ko sem bil jaz tvojih let, sem imel že dva otroka in fička.",
    exampleNote: "Fičo je bil na kredit. Stanovanje družbeno.",
  },
  "pieniadze-nie-rosna-na-drzewach": {
    headword: "denar ne raste na drevesu",
    grammar: "botanična trditev",
    usage:
      "Pregovor, ki opominja, da je treba denar zaslužiti, zato ga ne kaže zapravljati lahkomiselno. Starši ga navadno rečejo otrokom, ki prosijo za kaj, kar se odraslim zdi nepotrebno. Ustreza angleškemu »money doesn't grow on trees«.",
    pronunciation: "izg. pri blagajni, ob pogledu na otrokovo košarico",
    senses: [
      { text: "Znanstvena ugotovitev, da bankovci niso sadež. Razglašena ob vsaki prošnji za žepnino." },
      { text: "Utemeljitev nakupa najcenejše različice česar koli, tudi tiste, ki se pokvari po tednu dni." },
    ],
    example: "Denar ne raste na drevesu. Vzemi te za tri devetindevetdeset.",
    exampleNote: "Kupili so jih dvakrat. Prišlo je dražje.",
  },
  "co-ludzie-powiedza": {
    headword: "kaj bodo pa ljudje rekli?",
    grammar: "vprašanje o ugledu",
    usage:
      "Vprašanje, ki izraža skrb za mnenje sosedov, sorodnikov in fare. Govorec tuje izbire ne ocenjuje po tem, ali je dobra, temveč po tem, kako jo bodo sprejeli drugi. Pade ob oblačilih, porokah, ločitvah, prenovah in življenjskih odločitvah, njegova moč pa raste s številom oken, ki gledajo na dvorišče.",
    pronunciation: "izg. s pritišanim glasom in pogledom proti oknu",
    senses: [
      { text: "Glavno merilo družinskih odločitev: od barve fasade do izbire študija." },
      { text: "Sklicevanje na mnenje oseb, ki nikogar niso vprašale za mnenje in jih tudi nihče ni vprašal." },
    ],
    example: "V trenirki v trgovino? Kaj bodo pa ljudje rekli?",
    exampleNote: "Trgovina je bila odprta noč in dan. Ljudje so bili v trenirkah.",
  },
  "do-wesela-sie-zagoi": {
    headword: "do poroke se bo zacelilo",
    grammar: "dolgoročna medicinska napoved",
    usage:
      "Tolažba otroku ali komu, ki se je lažje poškodoval. Pomeni, da rana ni nevarna in se bo zacelila veliko pred kakšnim oddaljenim dogodkom, na primer poroko. V prenesenem pomenu pomeni, da težava ni resna in bo minila. Pri resnejši poškodbi je bolje namesto pregovora poseči po prvi pomoči ali iti k zdravniku.",
    pronunciation: "izg. veselo, brez pogleda na rano",
    senses: [
      { text: "Diagnoza vsake odrgnine, modrice in razbitega kolena. Datum poroke ni nujno določen." },
      { text: "Zagotovilo, da se bo težava rešila sama, če se z njo nihče ne bo ukvarjal." },
    ],
    example: "Ne jokaj, do poroke se bo zacelilo.",
    exampleNote: "Preiskovanec je imel šest let. Zacelilo se je v enem tednu. Poroka je bila dvajset let pozneje.",
  },
};
