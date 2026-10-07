import type { QueueEvent } from "../queue";
import type { Text } from "@/i18n/overlay";

export const QUEUE_SL: Record<string, Text<QueueEvent, "id" | "effect">> = {
  question: { title: "Samo eno vprašanje", speaker: "Občan z mapo", line: "Samo nekaj bi vprašal.", description: "Mapa ima tri predale. V vsakem je druga zadeva.", choices: [
    { label: "Kar izvolite. Eno vprašanje.", reply: "Vprašanje je imelo sedem podtočk. Vrsta je tvojo prijaznost razumela kot dovoljenje za naslednje." },
    { label: "Vi pa niste bili v vrsti!", reply: "Mapa se umakne na konec. Dva prikimata. Eden si nekaj zapiše." },
    { label: "Informacije so pri sosednjem okencu.", reply: "Občan odkrije ustanovo informacij. Vrsta v tebi odkrije vodstveni potencial." },
  ] },
  coat: { title: "Občan plašč", speaker: "Glas iz ozadja", line: "Ta plašč je pred mano.", description: "Na stolu sedi plašč. Lastnika so nazadnje videli pred prenovo.", choices: [
    { label: "Priznaj plašču pravno osebnost.", reply: "Plašč ne ugovarja. Naslednjih šest minut tudi ničesar drugega ne stori." },
    { label: "Prosi plašč za številko zadeve.", reply: "Plašč ne predloži dokumentov. Premestijo ga v garderobo." },
    { label: "Mirno vprašaj, kdo je zadnji.", reply: "Po kratki razpravi ugotovijo, da je zadnji človek. Postopkovni napredek." },
  ] },
  window: { title: "Okence številka tri", speaker: "Interno obvestilo", line: "Vabljeni k okencu številka tri.", description: "Roleta se dvigne za dvanajst centimetrov. V čakalnici se prebudi upanje.", choices: [
    { label: "Pojdi s celo vrsto.", reply: "Okence tri sprejema le pritožbe čez okence dve. Vrnete se bogatejši za to spoznanje." },
    { label: "Najprej preberi napis.", reply: "Napis ti prihrani izlet. Dva pred tabo sta še vedno na poti." },
    { label: "Odredi ohranitev vrstnega reda.", reply: "Vrstni red se ohrani v obeh vrstah hkrati. Nihče ne ve, kako, a deluje." },
  ] },
  copy: { title: "Izvirnik kopije", speaker: "Gospa za okencem", line: "Potrebujemo kopijo. Ampak originalno.", description: "Kopirni stroj stoji ob steni. Na njem listek: »Listek ne pomeni okvare.«", choices: [
    { label: "Naredi kopijo in ostani miren.", reply: "Stroj izda kopijo, nato kopijo kopije. Izbereš bolj izvirno." },
    { label: "Pokaži izvirnik v mapi.", reply: "Izvirnik je priznan kot dovolj podoben svoji kopiji." },
    { label: "Zahtevaj pisno pojasnilo.", reply: "Dobiš obrazec, ki pojasnjuje, zakaj se pojasnila dajejo ustno." },
  ] },
  coffee: { title: "Tehnični odmor", speaker: "Uradni napis", line: "Takoj se vrnem.", description: "Ob napisu se hladi čaj. Ni znano, ali je prvi.", choices: [
    { label: "Sedi. Sprosti ramena.", reply: "Za trenutek se ne boriš z upravo. Tudi uprava počiva." },
    { label: "Preveri sosednje okence.", reply: "Sosednje okence deluje. Sprejema celo isto vrsto človeka." },
    { label: "Spomni na uradne ure.", reply: "Napis umaknejo. Uradnikov vzdih se prišteje času obravnave." },
  ] },
  return: { title: "Gospod je samo stopil ven", speaker: "Občan, ki se vrača", line: "Saj sem bil tukaj. Gospod bo potrdil.", description: "Navedena priča se pretvarja, da zelo pozorno bere navodila na gasilnem aparatu.", choices: [
    { label: "Verjemi na besedo.", reply: "Gospod se vrne na svoje mesto. Kmalu se vrne še njegov svak." },
    { label: "Prosi pričo za potrditev.", reply: "Gasilni aparat ni več zanimiv. Priča potrdi mesto, vendar na koncu." },
    { label: "Zahtevaj dokaz o prejšnjem čakanju.", reply: "Občan nima potrdila o čakanju. Prvič ti pomaga manjkajoči dokument." },
  ] },
  ticket: { title: "Sistem številk", speaker: "Avtomat za listke", line: "Vzemite številko.", description: "Imaš A-038. Zaslon kaže B-004. Črka dobiva pomen.", choices: [
    { label: "Preveri vrsto zadeve.", reply: "Črka A je bila prava. B pomeni bife. Čakalnica si oddahne." },
    { label: "Vzemi še eno za rezervo.", reply: "Zdaj imaš dve številki in natanko isto zadevo. Statistično je to napredek." },
    { label: "Razvrsti vrsto po črkah.", reply: "Nastane abecedni red. Občani s črko Ą imajo pripombe." },
  ] },
  pen: { title: "Privezani kemični svinčnik", speaker: "Občan pri mizici", line: "Pišete? Potem sem jaz na vrsti.", description: "Edini kemični svinčnik je na vrvici. Vrvica ima daljši doseg kot črnilo.", choices: [
    { label: "Posodi svoj kemični svinčnik.", reply: "Vrsta se premakne. Svinčnik postane skupna dobrina. Vračilo ni vključeno v simulacijo." },
    { label: "Razpiši uradni svinčnik.", reply: "Nastane osem krogcev. Deveti se izkaže za čitljiv podpis." },
    { label: "Narekuj pritožbo zaradi črnila.", reply: "Pritožbo sprejmejo ustno. Pisna potrditev sledi po dobavi črnila." },
  ] },
  expert: { title: "Krajevni strokovnjak", speaker: "Gospod v brezrokavniku", line: "Jaz tukaj že leta vse urejam.", description: "Strokovnjak predlaga odhod v drugo stavbo. Ne pove, katero.", choices: [
    { label: "Poslušaj celotno zgodbo.", reply: "Zgodba se začne leta 1987. Do sedanjosti ne pride." },
    { label: "Preveri seznam zadev na steni.", reply: "Seznam potrdi pravo stavbo. Strokovnjak izjavi, da je mislil prav to." },
    { label: "Sklicuj se na lastne izkušnje.", reply: "Strokovnjak prizna strokovnjaka. V znak vzajemnega priznanja te spusti naprej." },
  ] },
  lunch: { title: "Vonj po zaprtju", speaker: "Glas za steklom", line: "Zadnja zadeva pred odmorom.", description: "Iz ozadja se oglasi mikrovalovna pečica. To ni signal za stranke.", choices: [
    { label: "Uredi dokumente po vrsti.", reply: "Zadeva pred tabo se konča hitreje. Razvrščanje papirja prvič obrodi sadove." },
    { label: "Mirno počakaj na vrnitev.", reply: "Juha je rešena ugodno. Ti še vedno čakaš na rešitev." },
    { label: "Priglasi nujnost svoje zadeve.", reply: "Zadeva dobi status nujne. Uradnik dobi mrzlo juho." },
  ] },
  form: { title: "Nova izdaja obrazca", speaker: "Gospa z žigom", line: "Ta obrazec ni več veljaven.", description: "Novi obrazec ima datum na drugem mestu. Datum ostaja isti.", choices: [
    { label: "Prepiši. Brez pripomb.", reply: "Datum se premakne tri centimetre v levo. Država lahko deluje naprej." },
    { label: "Vprašaj za prehodno obdobje.", reply: "Prehodno obdobje obstaja. Pravkar greš skozenj." },
    { label: "Vzemi po tri izvode obeh različic.", reply: "Pripravljen si na šest možnih preteklosti. Na prihodnost še ne." },
  ] },
  phone: { title: "Javni pogovor", speaker: "Telefon v vrsti", line: "ZDAJ NE MOREM, NA URADU SEM.", description: "Sogovornik podrobno razlaga, zakaj ne more govoriti.", choices: [
    { label: "Preštej ploščice na tleh.", reply: "Oseminštirideset. Danes je bilo torej nekaj le ugotovljeno." },
    { label: "Prosi za tišji glas.", reply: "Pogovor preide v poljavni način. Vrsta ceni pobudo." },
    { label: "Pokaži prost hodnik.", reply: "Občan prenese oddajanje na hodnik. Pridobiš mesto in tišino, pogled pa ostane." },
  ] },
  delivery: { title: "Uradna pošiljka", speaker: "Gospod z vozičkom", line: "Samo te žige odložim.", description: "Voziček zapira prehod. Na škatlah piše: »Nujno, 2019.«", choices: [
    { label: "Pomagaj odmakniti voziček.", reply: "Pot do okenca je spet prehodna. Dostava pridobi sedem let pravočasnosti." },
    { label: "Počakaj na prevzemni zapisnik.", reply: "Zapisnik zahteva žig, ki je v škatli. Škatla čaka na zapisnik." },
    { label: "Določi obvoz vrste.", reply: "Nastane začasna prometna ureditev. Prvič jo vsi upoštevajo." },
  ] },
  witness: { title: "Neuradni seznam", speaker: "Samooklicani tajnik", line: "Jaz zapisujem, da bo red.", description: "Seznam ima dve strani. Obe se začneta s številko ena.", choices: [
    { label: "Pomagaj uskladiti oba seznama.", reply: "Dve vrsti so združili brez ustanovitve komisije. To se še ni zgodilo." },
    { label: "Za vsak primer se vpiši na oba.", reply: "Uradno čakaš dvakrat. Praktično stojiš na istem mestu." },
    { label: "Priznaj samo uradne številke.", reply: "Tajnik zapre zvezek. Vrsta se vrne k državnemu sistemu štetja." },
  ] },
  draft: { title: "Spor o prepihu", speaker: "Dve stranki v postopku", line: "Zaprite! Odprite!", description: "Okno razdeli čakalnico na dva tabora. Vrsta stoji v obeh.", choices: [
    { label: "Predlagaj priprto okno.", reply: "Obe strani sta enako nezadovoljni. Inštitut to šteje za kompromis." },
    { label: "Ostani nepristranski opazovalec.", reply: "Spor traja. Vsaj ti mu ne predseduješ." },
    { label: "Končaj razpravo s pravilnikom.", reply: "Pravilnik ne omenja oken. Nihče ne zahteva vpogleda v pravilnik." },
  ] },
  stamp: { title: "Potujoči žig", speaker: "Nadomestni uradnik", line: "Žig ima sodelavka.", description: "Sodelavka je pri sodelavcu. Sodelavec je na izobraževanju o dostopnosti storitev.", choices: [
    { label: "Vprašaj za nadomestni žig.", reply: "V predalu najdejo žig, ki nadomešča nadomestnega. Ima vsa pooblastila." },
    { label: "Počakaj na sodelavko.", reply: "Sodelavka se vrne. Žig je ostal na izobraževanju." },
    { label: "Zahtevaj neprekinjeno poslovanje.", reply: "Neprekinjenost se obnovi z močnejšim pritiskom starega žiga." },
  ] },
};
