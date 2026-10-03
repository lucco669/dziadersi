import type { Report } from "@/content/reports";
import type { Text } from "@/i18n/overlay";

/*
 * Poročila Inštituta: the Slovenian text of the reports, keyed by the Polish slug. The Slovenian
 * slug comes from slugs/reports.ts; numbers, dates and species stay as in Polish. Percentages
 * take a space before the sign (in `findings` a no-break space, so the figure never splits).
 */

type ReportText = Text<Report, "slug" | "number" | "date" | "species">;

export const REPORTS: Record<string, ReportText> = {
  "sezon-grzewczy": {
    category: "Sezonsko poročilo",
    title: "»Obleci se bolj toplo«. Ogrevalna politika poljskega doma",
    lede: "Na prijavo »zebe me« v 61 % primerov sledi odgovor »obleci se bolj toplo«. Ventil, ki ga kdo navije brez soglasja gospodarja, je povprečno po 12 minutah spet na 2,5.",
    sample: "1040 gospodinjstev, 5824 radiatorjev, kurilna sezona 2025/2026",
    abstract:
      "Inštitut je raziskal, kdo in po kakšnih pravilih upravlja ogrevanje v 1040 poljskih gospodinjstvih. V 83 % domov je radiatorske ventile upravljala ena sama oseba, ki jih je najpogosteje nastavila na 2,5. Na 61 % prijav »zebe me« je sledil nasvet »obleci se bolj toplo«. Ventil, ki ga je navil kdo drug od domačih, se je povprečno po 12 minutah vrnil na 2,5.",
    findings: [
      { value: "61 %", label: "prijav »zebe me« se konča z nasvetom »obleci se bolj toplo«" },
      { value: "2,5", label: "najpogostejša nastavitev radiatorskega ventila v proučevanih domovih" },
      { value: "12 min", label: "mine povprečno, preden se navit ventil vrne na 2,5" },
    ],
    chart: {
      title: "Odziv na prijavo »zebe me«",
      unit: "%",
      bars: [
        { label: "»Obleci se bolj toplo«" },
        { label: "»Saj greje«" },
        { label: "»Malo se razmigaj, pa ti bo toplo«" },
        { label: "Sklicevanje na stenski termometer" },
        { label: "Navitje ventila" },
      ],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Formalno se kurilna sezona začne, ko stanovanjska zadruga¹ vklopi ogrevanje ali ko v kleti zagori peč. V praksi se začne šele, ko to dovoli oseba, ki je v domu pristojna za ventile. Inštitut se je odločil ugotoviti, kdo je ta oseba in po kakšnih pravilih razdeljuje toploto.",
        ],
      },
      {
        heading: "Potek raziskave",
        paragraphs: [
          "Opazovanja so potekala vso kurilno sezono 2025/2026 v 1040 gospodinjstvih, v blokih in enodružinskih hišah. Na 5824 radiatorjih so beležili vsako spremembo nastavitve ventila, v dnevnih sobah in spalnicah pa merili temperaturo. Domači so v dnevnike zapisovali vse prijave »zebe me« in odgovore, ki so jim sledili. Prijav je bilo 2316.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "V 83 % domov je ventile upravljala ena sama oseba, v nadaljevanju poročila imenovana gospodar. Najpogosteje je bila izbrana nastavitev 2,5 (44 % radiatorjev). Če je ventil navil kdo drug od domačih, se je povprečno po 12 minutah vrnil na 2,5. Povprečna temperatura v dnevnih sobah je znašala 19,2 °C, gospodarji pa so na vprašanje o njej navajali 22 °C.",
          "Na prijavo »zebe me« so najpogosteje odgovorili z nasvetom »obleci se bolj toplo« (61 %), v 18 % primerov pa z besedami »saj greje«, potem ko so se s hrbtno stranjo dlani dotaknili radiatorja. Ventil so navili samo, kadar je zeblo vnuke, torej v odgovor na 3 % prijav. Nasvet je bil ob tem izvedljiv: na posameznega člana gospodinjstva je prišlo povprečno 4,3 puloverja.",
          "V 57 % spalnic je bilo okno vso noč odprto na kip, ventil radiatorja pod njim pa nastavljen na 2,5. V 81 od 94 domov s pametnimi termostatskimi glavami so nastavitev spreminjali izključno ročno. Aplikacijo, ki jo je namestil vnuk, so odprli samo zato, da bi preverili, ali ni kdo česa prestavil.",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "Ogrevanje v poljskem domu ni podrejeno toliko zakonom fizike kot načelom. Nastavitev 2,5 ni kompromis med toploto in računom, temveč znak, da nekdo obvladuje položaj. Pulover ima v tem sistemu vlogo dopolnilnega grelnega telesa, ki ima to prednost, da na njem ne visi delilnik. Okno, odprto na kip, pa po razumevanju gospodarjev ni odprto okno, zato ne krši načela »ne bomo kurili za vrabce«.",
        ],
      },
    ],
    conclusions: [
      "Prijava »zebe me« se v poljskem domu rešuje po oblačilni, ne po ogrevalni poti.",
      "Nastavitev 2,5 ni nastavitev, temveč stališče.",
      "Okno, odprto na kip, ni odprto okno.",
      "Pravica do navitja ventila pripada izključno vnukom.",
    ],
    methodology:
      "Neprekinjeno merjenje temperature in nastavitev ventilov, dopolnjeno z dnevniki domačih. Raziskovalci so domove obiskovali vsaka dva tedna. Kadar so rekli, da jih zebe, so dobili nasvet, skladen z rezultati raziskave.",
    notes: [
      "¹ Stanovanjska zadruga: na Poljskem pogost upravljavec blokov, podedovan iz Ljudske republike Poljske (PRL). Slovenski bralec jo pozna kot upravnika.",
    ],
  },
  "kartka-za-wycieraczka": {
    category: "Korpusna analiza",
    title: "Listek za brisalcem. Korpusna analiza parkirne korespondence",
    lede: "Inštitut je analiziral 1274 listkov, puščenih za brisalci. V 97 % se pojavi beseda »vljudno«, v 64 % pa napoved, da bodo obveščene »pristojne službe«.",
    sample: "1274 listkov iz 38 mest, zbranih v letih 2019–2026",
    abstract:
      "Inštitut je zbral prvi poljski korpus listkov, ki jih ljudje puščajo za brisalci avtomobilov: 1274 izvodov iz 38 mest. Z velikimi tiskanimi črkami je bilo napisanih 94 % listkov, povprečen listek pa je imel 27 besed. Beseda »vljudno« se je pojavila v 97 % listkov, v 64 % pa je avtor napovedal, da bo obvestil »pristojne službe«. Noben listek ni navedel, katere službe so mišljene.",
    findings: [
      { value: "97 %", label: "listkov vsebuje besedo »vljudno«" },
      { value: "64 %", label: "listkov napoveduje, da bodo obveščene »pristojne službe«" },
      { value: "27", label: "besed ima povprečen listek" },
    ],
    chart: {
      title: "Gradivo, na katerem je bil listek napisan",
      unit: "%",
      bars: [
        { label: "Hrbtna stran računa iz trgovine" },
        { label: "List iz zvezka na kvadratke" },
        { label: "Ovojnica od položnice" },
        { label: "Karton z embalaže" },
        { label: "Rob reklamnega letaka" },
      ],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Listek za brisalcem je besedilna vrsta, ki je enako izrazito oblikovana kot uradna prošnja ali uradni dopis, le da se je v nasprotju z njima v šoli ne učimo. Kljub temu se vsi njeni avtorji držijo istih pravil. Inštitut se je odločil, da jih opiše.",
        ],
      },
      {
        heading: "Gradivo in metode",
        paragraphs: [
          "Korpus obsega 1274 listkov, zbranih v letih 2019–2026 v 38 mestih. Inštitutu so jih predali naslovniki skupaj z opisom okoliščin: kje in za koliko časa so parkirali. Vsak listek je bil prepisan z ohranjenim pravopisom, podčrtavanji in številom klicajev, nato pa označen glede na nosilec, dolžino, vsebino in podpis. Listke, ki jih je namočil dež, so brali pri stranski osvetlitvi.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "Z velikimi tiskanimi črkami je bilo napisanih 94 % listkov. Najpogostejši nosilec je bila hrbtna stran računa iz trgovine (34 %). Iz sprednje strani računov je razvidno, da so avtorji kupovali predvsem kruh, maslo in tekočino za pranje stekel. Povprečen listek je imel 27 besed, najdaljši 318: zasedal je obe strani ovojnice, prehod na drugo stran pa je avtor označil s pripisom »verte«.",
          "Beseda »vljudno« se je pojavila v 97 % listkov. V preostalih 3 % je bila napisana in prečrtana. V 64 % listkov je avtor napovedal, da bo obvestil »pristojne službe«, povprečno 9 besed za besedo »vljudno«. Noben listek ni navedel, katere službe so mišljene.",
          "S podpisom »Dobronamerni«¹ je bilo opremljenih 14 % listkov, 36 % pa jih ni bilo podpisanih sploh. To naslovnikom ni preprečilo, da bi ugotovili, kdo je avtor, navadno še isti dan. V 52 primerih je naslovnik odgovoril z lastnim listkom. Dopisovanje je nato trajalo povprečno 7 mesecev in se navadno končalo s selitvijo ene od strani.",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "Listek za brisalcem združuje dva registra: uradno vljudnost in grožnjo. Beseda »vljudno« grožnje ne blaži, temveč ji daje obliko uradnega dopisa. Najskrbneje napisani listki so se za brisalcem pojavili povprečno 6 minut po parkiranju, kar kaže na avtorja, ki parkirišče opazuje z okna, s komolci na blazini, in ima čas za kaligrafijo.",
        ],
      },
    ],
    conclusions: [
      "»Vljudno« je v parkirni korespondenci napoved grožnje.",
      "»Pristojne službe« ostajajo neidentificirane.",
      "Na listek za brisalcem se ne odgovarja z listkom.",
    ],
    methodology:
      "Korpusna analiza z elementi grafologije. Med raziskavo je skupina za brisalci lastnih avtomobilov našla 14 listkov. Zaradi nasprotja interesov niso bili vključeni v korpus.",
    notes: [
      "¹ Dobronamerni: v izvirniku Życzliwy, ustaljen podpis poljskih anonimnih pisem in ovadb še iz časov Ljudske republike Poljske (PRL).",
    ],
  },
  "ja-tylko-zapytac": {
    category: "Terenski eksperiment",
    title: "»Samo za vprašat«. Koliko traja vprašanje, zastavljeno mimo vrste",
    lede: "»Samo za vprašat« traja povprečno 4 minute in obsega 3,4 dodatnega vprašanja. V 71 % primerov spraševalec ob tem uredi celotno zadevo.",
    sample: "572 dogodkov pri 120 blagajnah in okencih, junij–avgust 2026",
    abstract:
      "Inštitut je zabeležil 572 dogodkov »samo za vprašat«, torej primerov, ko je kdo obšel vrsto pred blagajno ali okencem s pretvezo, da ima eno samo vprašanje. Dogodek, ki naj bi bil po napovedi »čisto na hitro«, je trajal povprečno 4 minute in obsegal 3,4 dodatnega vprašanja. V 71 % primerov je spraševalec ob tem uredil celotno zadevo. Tablica »Informacije dajemo izključno v vrsti« je število takih dogodkov povečala za 8 %.",
    findings: [
      { value: "4 min", label: "traja povprečno »samo za vprašat«" },
      { value: "3,4", label: "dodatnega vprašanja povprečno sledi vprašanju, ki naj bi bilo edino" },
      { value: "71 %", label: "spraševalcev ob tem uredi celotno zadevo" },
    ],
    chart: {
      title: "Odziv vrste na »samo za vprašat«",
      unit: "%",
      bars: [
        { label: "Molk in vzdih" },
        { label: "Pripomba osebi zraven" },
        { label: "»Vsi smo tu samo za vprašat«" },
        { label: "Pogled na uro" },
        { label: "Pristop z lastnim vprašanjem" },
      ],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Poljska čakalna vrsta ima eno pravilo: kdor je prišel pozneje, stoji dlje zadaj. Pravilo ima izjemo, nikjer zapisano, a splošno uveljavljeno. Napovejo jo besede »oprostite, samo za vprašat«. Inštitut se je odločil preveriti, koliko traja vprašanje, zaradi katerega ni treba stati v vrsti.",
        ],
      },
      {
        heading: "Potek raziskave",
        paragraphs: [
          "Od junija do avgusta so raziskovalci stali v vrstah pred 120 blagajnami in okenci: v trgovinah, na pošti, na uradih in na postajah. Beležili so vsak dogodek »samo za vprašat«: trajanje, število vprašanj in odziv vrste. Pri polovici okenc in blagajn so namestili tablico »Informacije dajemo izključno v vrsti«. Skupno so zabeležili 572 dogodkov.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "Spraševalci so navadno napovedali, da bo »čisto na hitro«. Dogodek je povprečno trajal 4 minute, najdaljši pa 26 minut in se je končal z oddajo treh paketov. Prvemu vprašanju je povprečno sledilo 3,4 dodatnega vprašanja, pri čemer se je skoraj vsako začelo z besedama »pa še«. V 71 % primerov je vprašanje gladko prešlo v ureditev celotne zadeve, vključno s plačilom.",
          "Spraševalci so navadno stali bočno proti vrsti, s komolcem na pultu. Pri blagajnah v trgovinah so najpogosteje spraševali, zakaj ima izdelek iz reklamnega letaka na polici drugačno ceno. Letak so imeli s seboj. Vrsta se je najpogosteje odzvala z molkom in vzdihom (41 %). Odkrit ugovor, »Vsi smo tu samo za vprašat«, je bil zabeležen v 17 % primerov, v 6 % pa je kdo iz vrste izkoristil priložnost in pristopil z lastnim vprašanjem.",
          "Tablica »Informacije dajemo izključno v vrsti« števila dogodkov ni zmanjšala. Povečala ga je za 8 % (297 proti 275), ker so nekateri spraševalci pristopili samo zato, da bi vprašali, ali tablica velja tudi zanje.",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "»Samo za vprašat« ni vprašanje, temveč poseben način poslovanja s strankami. Beseda »samo« v njem deluje kot prepustnica: napoveduje zadevo, tako drobno, da bi bilo čakanje v vrsti v primerjavi z njo nesorazmerno. Vrsta to napoved sprejme, ker se ugovor zoper eno samo vprašanje zdi malenkosten. Ko sledijo dodatna vprašanja, je za ugovor že prepozno.",
        ],
      },
    ],
    conclusions: [
      "»Samo« traja povprečno 4 minute.",
      "Vprašanje, ki naj bi bilo edino, je povprečno prvo od 4,4.",
      "Tablica »Informacije dajemo izključno v vrsti« poveča število vprašanj, zastavljenih mimo vrste.",
    ],
    methodology:
      "Terenski eksperiment s kontrolno skupino: okenca in blagajne s tablico in brez nje. Čas so merili od besed »oprostite, samo za vprašat …« do odhoda od blagajne ali okenca. Besede »hvala« niso šteli za konec meritve, ker je po njej navadno sledilo še eno vprašanje.",
  },
  "pilot-od-telewizora": {
    category: "Posebno poročilo",
    title: "Daljinec kot insignija oblasti v poljskem domu",
    lede: "V 87 % domov ostane daljinec v rokah najstarejšega moškega. V preostalih 13 % se je izgubil v naslanjaču.",
    sample: "960 gospodinjstev, opazovanja med 19.00 in 23.00",
    abstract:
      "Inštitut je raziskal porazdelitev oblasti nad daljincem v 960 gospodinjstvih. V 87 % je daljinec ves večer ostal v rokah najstarejšega moškega. V 9 % domov so daljinec hranili v plastični vrečki, ki naj bi ga varovala pred obrabo. Pojav kaže znake dednosti.",
    findings: [
      { value: "87 %", label: "domov, v katerih daljinec pripada najstarejšemu moškemu" },
      { value: "9 %", label: "daljincev, shranjenih v plastični vrečki" },
      { value: "64 %", label: "domov gleda en sam program, »da se ne razštima«" },
    ],
    chart: {
      title: "Kje je daljinec med večerom",
      unit: "%",
      bars: [
        { label: "V roki" },
        { label: "Na naslonu za roke" },
        { label: "Izgubljen v naslanjaču" },
        { label: "V plastični vrečki" },
        { label: "Drugje" },
      ],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Daljinski upravljalnik televizorja, v nadaljevanju daljinec, je najmanjša, a najpomembnejša naprava v poljskem domu. Kdor ima daljinec, odloča o večeru. Inštitut se je odločil preveriti, kdo ima daljinec.",
        ],
      },
      {
        heading: "Potek raziskave",
        paragraphs: [
          "Opazovanja so potekala med 19.00 in 23.00 v 960 gospodinjstvih. Beležili so, kdo drži daljinec, kako dolgo in ali ga na prošnjo drugih domačih preda. Niti enkrat ni bila zabeležena predaja daljinca na prošnjo.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "V 87 % domov je daljinec ves večer ostal v rokah najstarejšega moškega. V 13 % domov se je daljinec izgubil v naslanjaču, iskanje pa je trajalo povprečno 11 minut in je obsegalo vsaj dvakratno dvigovanje vseh blazin.",
          "V 9 % domov so daljinec hranili v plastični vrečki, ki naj bi ga varovala pred prahom in obrabo. Vrečke so menjavali povprečno vsaka štiri leta, daljince vsakih dvanajst.",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "Daljinec ima simbolno vlogo, primerljivo z vlogo žezla. Navadno se preda skupaj z naslanjačem, kar se je v proučevanih družinah dogajalo redkeje kot menjava televizorja.",
        ],
      },
    ],
    conclusions: [
      "Daljinec je insignija oblasti.",
      "Ta oblast se prenaša z očeta na sina, skupaj z naslanjačem.",
      "Plastična vrečka podaljša življenjsko dobo daljinca povprečno za osem let.",
    ],
    methodology: "Opazovanje z udeležbo. Raziskovalci so bili na večer vabljeni kot gostje. Nobeden od njih ni dobil daljinca.",
  },
  "sandal-a-skarpeta": {
    category: "Sistematični pregled",
    title: "Sandal in nogavica. Sistematični pregled 412 terenskih opazovanj",
    lede: "Inštitut je analiziral 412 dokumentiranih primerov nošenja nogavic v sandalih. Glavna ugotovitev: nogavica je bela. Stranska ugotovitev: vedno.",
    sample: "412 opazovanj iz 9 obmorskih letovišč in 3 gorovij",
    abstract:
      "Kombinacija sandala in nogavice je eden najlaže prepoznavnih simptomov dziaderstva, kljub temu pa doslej ni bila sistematično analizirana. Pregled je zajel 412 terenskih opazovanj iz poletne sezone 2026. V 87 % primerov je bila nogavica bela, v 100 % primerov pa je bila oseba, ki jo je nosila, prepričana o pravilnosti svoje izbire.",
    findings: [
      { value: "87 %", label: "nogavic, nošenih v sandalih, je belih" },
      { value: "64 %", label: "je frotirnih, tudi v vročini nad 30 °C" },
      { value: "100 %", label: "opazovanih je prepričanih o pravilnosti izbire" },
    ],
    chart: {
      title: "Barva nogavice, nošene v sandalih",
      unit: "%",
      bars: [{ label: "Bela" }, { label: "Siva" }, { label: "Črna" }, { label: "Črtasta" }],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Nogavica v sandalu vzbuja na Poljskem čustva, primerljiva s sporom o večvrednosti praznikov¹. Inštitut se je odločil ločiti čustva od podatkov in si pojav ogledati tam, kjer je najštevilčnejši: na obmorskih promenadah in planinskih poteh.",
        ],
      },
      {
        heading: "Gradivo in metode",
        paragraphs: [
          "Opazovanja so potekala od junija do avgusta, med 7.00 in 19.00. Beležili so barvo in debelino nogavice, model sandala in temperaturo zraka. Opazovalce so usposobili, da ne kažejo čustev. Dva nista zdržala in sta bila izključena iz raziskave.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "Bela nogavica brezpogojno prevladuje: 87 % opazovanj. V 64 % primerov je šlo za frotirno nogavico, ne glede na temperaturo. Najvišja zabeležena temperatura, pri kateri je bila nošena frotirna nogavica, je znašala 34 °C (Mielno, julij).",
          "Na vprašanje o razlogu so opazovani najpogosteje odgovorili: »Ker je bolj udobno« (52 %), »Da me ne ožuli« (31 %) in »Kaj pa vas to briga?« (17 %).",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "Nogavica nima toliko oblačilne kot identitetno vlogo. Njena belina sporoča čistost namenov, frotir pa pripravljenost na vse razmere. Pojav je popolnoma odporen proti kritiki, modi in meteorološkim podatkom.",
        ],
      },
    ],
    conclusions: ["Nogavica je bela.", "Vedno.", "Pojav ne zahteva ukrepanja, ker noben ukrep ne bo učinkoval."],
    methodology:
      "Sistematični pregled terenskih opazovanj. Opazovanje brez udeležbe, izvedeno s klopi. Vsako opazovanje sta potrdila dva neodvisna raziskovalca, od katerih se je eden delal, da bere časopis.",
    notes: [
      "¹ Spor o večvrednosti praznikov: poljski frazem za brezploden in nerešljiv prepir, v celoti »spor o večvrednosti božiča nad veliko nočjo«. Slovenski bralec ga pozna kot prepir za oslovo senco.",
    ],
  },
  "system-start-stop": {
    category: "Eksperimentalna raziskava",
    title: "Vpliv sistema start-stop na raven razdraženosti voznikov po petdesetem",
    shortTitle: "Sistem start-stop in razdraženost voznikov po petdesetem",
    lede: "Sistem start-stop takoj po zagonu motorja izklopi 96 % proučevanih voznikov. Povprečni reakcijski čas: 1,8 sekunde.",
    sample: "240 voznikov, starih 50 let ali več, proga s tremi križišči",
    abstract:
      "Sistem start-stop, ki med postankom ugasne motor, je standardna oprema novih avtomobilov. Inštitut je raziskal, kako se 240 voznikov po petdesetem odzove na samodejni izklop motorja pri rdeči luči. Rezultati kažejo, da je sistem izklopljen hitreje, kot utegne začeti delovati.",
    findings: [
      { value: "96 %", label: "proučevanih izklopi sistem ob vsakem zagonu motorja" },
      { value: "1,8 s", label: "je povprečni čas od zagona motorja do izklopa sistema" },
      { value: "78 %", label: "jih je prepričanih, da sistem »uničuje anlaser«" },
    ],
    chart: {
      title: "Odziv na samodejni izklop motorja pri rdeči luči",
      unit: "%",
      bars: [
        { label: "Trajni izklop sistema" },
        { label: "Pripomba o zaganjalniku" },
        { label: "Trkanje po armaturni plošči" },
        { label: "Mirnost" },
      ],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Sistem start-stop naj bi varčeval z gorivom in zmanjševal izpuste. Nihče pa ni predvidel, da bo njegov največji nasprotnik voznik, ki se spominja časov, ko se je motor ugašal s ključem, in to samo takrat, ko se je hotelo.",
        ],
      },
      {
        heading: "Potek raziskave",
        paragraphs: [
          "Določeno progo s tremi križišči je prevozilo 240 voznikov. V testnih avtomobilih je bil sistem start-stop privzeto vklopljen. Beležili so čas do njegovega izklopa in izjave voznikov, ki jih je skupina prepisala s posnetkov, pred tem pa jih je cenzurirala.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "Sistem je izklopilo 96 % voznikov, še preden je avtomobil speljal. Povprečni reakcijski čas je znašal 1,8 sekunde, najkrajši 0,4 sekunde: voznik je sistem izklopil, še preden je motor utegnil vžgati.",
          "Vsi vozniki iz preostalih 4 % so po raziskavi priznali, da »gumba niso opazili«. Ko so jim ga pokazali, so sistem takoj izklopili.",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "Sistem start-stop v proučevani skupini vzbuja načelen odpor, neodvisen od tehničnega znanja. Proučevani niso znali pojasniti, kako sistem uničuje zaganjalnik, a 78 % jih je bilo o tem prepričanih.",
        ],
      },
    ],
    conclusions: [
      "Sistem start-stop je izklopljen hitreje, kot utegne začeti delovati.",
      "Prepričanje o škodljivosti sistema ne zahteva znanja o njegovem delovanju.",
      "Proizvajalci naj razmislijo o gumbu, ki sistem izklopi za vedno.",
    ],
    methodology:
      "Eksperimentalna raziskava v razmerah mestnega prometa. Kontrolna skupina, vozniki, mlajši od 30 let, obstoja sistema ni opazila.",
  },
  "zaraz-to-naprawie": {
    category: "Longitudinalna raziskava",
    title: "Od »takoj bom popravil« do klica mojstra. Longitudinalna raziskava",
    lede: "Od napovedi »takoj bom popravil« do klica mojstra mine povprečno 3 leta in 2 meseca. V 41 % primerov se izkaže, da je mojster svak.",
    sample: "318 okvar v 204 gospodinjstvih, spremljanih od leta 2019",
    abstract:
      "Inštitut je sedem let spremljal usodo 318 okvar v domovih, ob katerih je padlo »takoj bom popravil«. Povprečni čas do klica mojstra je znašal 3 leta in 2 meseca. Niti ena okvara ni bila popravljena v napovedanem »takoj«. V 41 % primerov se je izkazalo, da je mojster svak.",
    findings: [
      { value: "38 mes.", label: "mine povprečno od »takoj bom popravil« do klica mojstra" },
      { value: "41 %", label: "popravil na koncu opravi svak" },
      { value: "0", label: "okvar, popravljenih »takoj«" },
    ],
    chart: {
      title: "Čas od napovedi popravila do klica mojstra",
      unit: "mes.",
      bars: [
        { label: "Kapljajoča pipa" },
        { label: "Vratca omarice" },
        { label: "Vtičnica v kuhinji" },
        { label: "Fuga v kopalnici" },
        { label: "Roleta v spalnici" },
      ],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Stavek »takoj bom popravil« je ena najpogosteje danih obljub na Poljskem. Inštitut se je odločil preveriti, kaj natančno pomeni v njem beseda »takoj«.",
        ],
      },
      {
        heading: "Potek raziskave",
        paragraphs: [
          "Od leta 2019 je skupina spremljala 318 okvar v 204 gospodinjstvih. Beležili so trenutek prve napovedi popravila, nadaljnje napovedi in trenutek, ko je v dom vstopil mojster. Raziskava je bila končana leta 2026, čeprav 12 okvar še vedno čaka na svoj »takoj«.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "Povprečni čas od prvega »takoj bom popravil« do klica mojstra je znašal 38 mesecev. Najhitreje je bila popravljena kapljajoča pipa (9 mesecev), najpočasneje roleta v spalnici (80 mesecev). Pred klicem mojstra je bilo popravilo vsake okvare napovedano povprečno 46-krat.",
          "V 41 % primerov je bil mojster svak, v 33 % mojster, ki ga je priporočil svak, v preostalih 26 % pa mojster, za katerega je svak rekel, da so »preplačali«.",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "Besede »takoj« ni treba razumeti kot časovne opredelitve, temveč kot izjavo o usposobljenosti. Kdor jo izreče, ne obljublja popravila, ampak sporoča, da bi ga lahko opravil. To razlikovanje pojasni večino rezultatov raziskave.",
        ],
      },
    ],
    conclusions: [
      "»Takoj« traja povprečno 3 leta in 2 meseca.",
      "Napoved popravila ni popravilo.",
      "Svak je ključni element poljskega trga obnovitvenih storitev.",
    ],
    methodology:
      "Longitudinalna raziskava, neprekinjeno opazovanje. Okvara je bila uvrščena v raziskavo, če je bilo njeno popravilo napovedano z besedami »takoj bom popravil« v navzočnosti vsaj ene priče.",
  },
  "kabel-nieznanego-przeznaczenia": {
    category: "Terenska raziskava",
    title: "Kabel neznanega namena. Inventura predalov v 1200 gospodinjstvih",
    shortTitle: "Kabel neznanega namena: inventura predalov",
    lede: "Vsaj en kabel, za katerega ne vedo, čemu služi, ima 73 % proučevanih očetov. Inštitut je izvedel prvo inventuro predalov s kabli na Poljskem.",
    sample: "1200 gospodinjstev, 2847 predalov, 5640 kablov",
    abstract:
      "Predal s kabli najdemo skoraj v vsakem poljskem domu, a doslej ni bil predmet sistematičnih raziskav. Skupina Terenske sekcije IBD je popisala vsebino 2847 predalov v 1200 gospodinjstvih. V 61 % primerov namena kabla ni bilo mogoče ugotoviti. Lastniki predalov so dosledno zavračali, da bi zavrgli kateri koli izvod.",
    findings: [
      { value: "73 %", label: "očetov ima kabel, za katerega ne ve, čemu služi" },
      { value: "4,7", label: "kabla neznanega namena pride na en predal" },
      { value: "0", label: "kablov, zavrženih med raziskavo" },
    ],
    chart: {
      title: "Namen kablov v proučevanih predalih",
      unit: "%",
      bars: [
        { label: "Neznan" },
        { label: "Za telefon, ki ga ni več" },
        { label: "Za fotoaparat iz leta 2006" },
        { label: "Podaljšek za podaljšek" },
        { label: "Pravilno ugotovljen" },
      ],
    },
    sections: [
      {
        heading: "Uvod",
        paragraphs: [
          "Predal s kabli je eden najbolj razširjenih in hkrati najslabše raziskanih elementov poljskega gospodinjstva. Navadno je v kuhinji, pod televizorjem ali v predsobi, njegova vsebina pa se nalaga v plasteh, v ritmu, ki ga narekujejo nove generacije telefonov.",
        ],
      },
      {
        heading: "Potek raziskave",
        paragraphs: [
          "Raziskovalci so obiskali 1200 gospodinjstev v vseh šestnajstih vojvodstvih¹. Vsak kabel so vzeli iz predala, ga opisali in fotografirali, nato pa ga pokazali lastniku s prošnjo, naj pove, čemu služi. Jemanje kablov iz predala je trajalo povprečno 23 minut na predal, ker so bili zapleteni na način, ki ga je skupina v zapisniku označila kot »nameren«.",
        ],
      },
      {
        heading: "Rezultati",
        paragraphs: [
          "Namena 61 % kablov niso ugotovili ne lastniki ne raziskovalci. Nadaljnjih 17 % so polnilniki za telefone, ki jih v gospodinjstvu ni več. Med anketiranci jih je 19 % trdilo, da vedo, čemu služi posamezni kabel, »ampak zdaj ne bom iskal«.",
          "Na vprašanje, ali je mogoče zavreči kateri koli kabel, so vsi anketiranci odgovorili: »To bo še prav prišlo.« Odgovor je sledil povprečno po 1,2 sekunde, kar kaže na refleks, ne na premislek.",
        ],
      },
      {
        heading: "Razprava",
        paragraphs: [
          "Rezultati potrjujejo hipotezo, da predal s kabli nima uporabne, temveč rezervno funkcijo. Njegova vsebina je zavarovanje za primer scenarija, ki ga nobeden od proučevanih ni znal opisati, vsi pa so ga ocenili kot verjetnega.",
        ],
      },
    ],
    conclusions: [
      "Predal s kabli je razširjen in trajen pojav.",
      "Znanje o namenu kablov izginja hitreje kot kabli sami.",
      "Verjetnost, da bo oseba po petdesetem zavrgla kabel, je statistično neznačilna.",
    ],
    methodology:
      "Terenska raziskava: neposredni intervju, združen z inventuro. Izbor vzorca naključno-sosedski. Vzorčna napaka ni znana, prav tako ne namen večine kablov.",
    notes: [
      "¹ Vojvodstvo: največja upravna enota na Poljskem, po vlogi pokrajina. Slovenski bralec sorodno ime pozna iz vojvodine Kranjske.",
    ],
  },
};
