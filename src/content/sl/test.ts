import type { Text } from "@/i18n/overlay";
import type {
  BlotTask,
  ChoiceTask,
  InventoryTask,
  MapTask,
  RapidTask,
  ReflexTask,
  ScaleTask,
  SmsTask,
  Station,
  Task,
  UNSPECIFIED as UnspecifiedPl,
  Verdict,
  WordsTask,
} from "../test";

/** Fields of the test that are data, not text: zone ids, icon names, plate numerals and images. */
type Skip = "zone" | "icon" | "plate" | "image";

/** Obhodni list: the five rooms, in the Polish order. */
export const STATIONS: Text<Station, "numeral" | "room">[] = [
  {
    name: "Anamneza",
    note: "Nekaj vprašanj o vsakdanjem življenju. Zdravnik tako ali tako ve, zato odkrito.",
    next: "Anamneza končana. Zdravnik si je nekaj zapisal in list zakril z roko.",
  },
  {
    name: "Psihološki laboratorij",
    note: "Rorschachove table in asociacijski test. Napačnih odgovorov ni, so samo dziaderski.",
    next: "Psiholog prosi, da se ne vračaš k tablam. Tudi table potrebujejo počitek.",
  },
  {
    name: "Laboratorij za spretnost",
    note: "Preizkus s hupo in orientacija na terenu. Pripni varnostni pas.",
    next: "Spretnost potrjena. Inštitut ne odgovarja za udrtine na parkirišču.",
  },
  {
    name: "Inventura",
    note: "Predal, prtljažnik, nogavice. Kar hraniš, pove več kot to, kar rečeš.",
    next: "Inventura zaključena. Predal se je vrnil na mesto, z odporom.",
  },
  {
    name: "Zaključni posvet",
    note: "Zadnja vprašanja, zadnja tabla in hitra serija. Potem žig.",
    next: "",
  },
];

/** Obrazec IBD-T2, task by task in the Polish order: result codes store answers by position. */
export const TASKS: Text<Task, Skip>[] = [
  {
    section: "Avtomobili",
    prompt: "Sosed ti pokaže svoj novi avto. Kaj narediš?",
    proxyPrompt: "Sosed pokaže svoj novi avto. Kaj naredi preiskovana oseba?",
    options: [
      { text: "Čestitam in takoj pozabim, katere znamke je.", proxy: "Čestita in takoj pozabi, katere znamke je." },
      { text: "Vprašam, koliko porabi na odprti cesti in koliko v mestu.", proxy: "Vpraša, koliko porabi na odprti cesti in koliko v mestu." },
      { text: "Rečem, da za ta denar dobiš dva passata iz Nemčije.", proxy: "Reče, da za ta denar dobiš dva passata iz Nemčije." },
      { text: "Brez besed brcnem v gumo in pokimam.", proxy: "Brez besed brcne v gumo in pokima." },
    ],
  } satisfies Text<ChoiceTask, Skip>,
  {
    section: "Komunikacija",
    prompt: "Pride sporočilo: »DELI, PREDEN ZBRIŠEJO!!!« Kaj narediš?",
    proxyPrompt: "Pride sporočilo: »DELI, PREDEN ZBRIŠEJO!!!« Kaj naredi preiskovana oseba?",
    options: [
      { text: "Družinsko skupino utišam do leta 2031.", proxy: "Družinsko skupino utiša do leta 2031." },
      { text: "Preverim na internetu. Internet potrdi.", proxy: "Preveri na internetu. Internet potrdi." },
      { text: "Pošljem naprej družini. Za vsak primer.", proxy: "Pošlje naprej družini. Za vsak primer." },
      {
        text: "Delim javno in dopišem tri klicaje. Da bo zanesljivo, štiri.",
        proxy: "Deli javno in dopiše tri klicaje. Da bo zanesljivo, štiri.",
      },
    ],
  } satisfies Text<ChoiceTask, Skip>,
  {
    section: "Zveze",
    prompt: "Mali piše: »sem tu«. Kaj odpišeš?",
    proxyPrompt: "Mali piše preiskovani osebi: »sem tu«. Kaj mu odpiše?",
    contact: "Mali",
    message: "sem tu",
    options: [
      { text: "k" },
      { text: "Dobro." },
      { text: "Dobro. Lep pozdrav" },
      { text: "DOBRO SIN PAZI NASE IN JAVI KO PRIDES" },
    ],
  } satisfies Text<SmsTask, Skip>,
  {
    section: "Tabla I",
    prompt: "Tabla I. Kaj vidiš?",
    proxyPrompt: "Tabla I. Kaj bo na njej videla preiskovana oseba?",
    options: [
      { text: "Veščo. Ali metulja. Nekaj, kar leti." },
      { text: "Brke po tednu brez prirezovanja." },
      { text: "Vratovino. Prezgodaj obrnjeno." },
      { text: "Načrt vrtička: uta, kompostnik in sosedova meja." },
    ],
  } satisfies Text<BlotTask, Skip>,
  {
    section: "Asociacije",
    prompt: "Asociacijski test. Prvo, kar ti pade na misel.",
    proxyPrompt: "Asociacijski test. Prvo, kar bi padlo na misel preiskovani osebi.",
    words: [
      {
        word: "Sobota",
        options: [{ text: "Spanje do poldneva" }, { text: "Železnina" }, { text: "Avtopralnica" }, { text: "Vrtiček" }],
      },
      {
        word: "Poletje",
        options: [{ text: "Festival" }, { text: "Vetrobran" }, { text: "Vratovina" }, { text: "Ščuka" }],
      },
      {
        word: "Ponedeljek",
        options: [{ text: "Kava" }, { text: "Kolegij ob osmih" }, { text: "Posodobitev Windowsov" }, { text: "Sličica »Lep začetek tedna«" }],
      },
    ],
  } satisfies Text<WordsTask, Skip>,
  {
    section: "Tabla II",
    prompt: "Tabla II. Pa tukaj?",
    proxyPrompt: "Tabla II. Kaj bo na njej videla preiskovana oseba?",
    options: [
      { text: "Dve osebi si dajeta petko." },
      { text: "Debato v komentarjih. Ena stran ima prav." },
      { text: "Sprednji del passata. Nekdo vozi z dolgimi." },
      { text: "Dva soseda se prepirata za mesto pred blokom." },
    ],
  } satisfies Text<BlotTask, Skip>,
  {
    section: "Preizkus s hupo",
    prompt: "Stojiš pri semaforju. Prižge se zelena, avto pred tabo pa ne spelje. Pohupaj.",
    proxyPrompt: "Pohupaj tako, kot bi pohupala preiskovana oseba. Prižge se zelena, avto pred njo pa ne spelje.",
    outcomes: {
      red: { text: "Hupanje pri rdeči. Na zalogo." },
      amber: { text: "Hupanje pri rdeči in rumeni. Ker bo vsak hip zelena." },
      fast: { text: "Hupanje, še preden se je zelena utegnila ogreti." },
      normal: { text: "Hupanje po kratkem premoru, kot veleva bonton." },
      slow: { text: "Kratek, sramežljiv pisk." },
      none: { text: "Brez hupanja. Avto spredaj je naposled speljal sam." },
    },
  } satisfies Text<ReflexTask, Skip>,
  {
    section: "Parkiranje",
    prompt: "Sobota, deset dopoldne, parkirišče pred marketom. Tapni, kje parkiraš.",
    proxyPrompt: "Sobota, deset dopoldne, parkirišče pred marketom. Tapni, kje parkira preiskovana oseba.",
    zones: [
      { place: "Prvo prosto mesto", text: "Na prvem prostem mestu. Brez filozofije." },
      { place: "Mesto za družine ob vhodu", text: "Na družinskem parkirnem mestu. Družina je ostala doma, a obstaja." },
      { place: "Zadnja vrsta, daleč od vseh", text: "Čisto na koncu parkirišča. Nihče ne bo oplazil vrat." },
      { place: "Dve prosti mesti drugo ob drugem", text: "Na dveh mestih hkrati. Poševno, zaradi varnosti." },
      { place: "Vozni pas tik pred vhodom", text: "Na voznem pasu, z vklopljenimi utripalkami. Samo po žemlje." },
    ],
  } satisfies Text<MapTask, Skip>,
  {
    section: "Plaža",
    prompt: "Prvi dan dopusta na morju, 6.30. Tapni, kam postaviš vetrobran.",
    proxyPrompt: "Prvi dan dopusta na morju, 6.30. Tapni, kam preiskovana oseba postavi vetrobran.",
    zones: [
      { place: "Ob dostopu na plažo", text: "Ob dostopu, blizu vafljev in stranišča." },
      { place: "Prva vrsta ob vodi", text: "V prvi vrsti ob vodi. Osem metrov vetrobrana, vhod s kopnega." },
      { place: "Sredina plaže", text: "Na sredini, okrog treh odej. Družina pride ob enajstih." },
      { place: "Sipina", text: "Na sipini. Prepoved vstopa velja za turiste." },
    ],
    skip: { text: "Nikamor. Ob 6.30 spim.", proxy: "Nikamor. Ob 6.30 spi." },
  } satisfies Text<MapTask, Skip>,
  {
    section: "Predal",
    prompt: "Predal za vse. Označi, kaj je v njem.",
    proxyPrompt: "Predal za vse pri preiskovani osebi. Označi, kaj je v njem.",
    done: "Zaprem predal",
    things: [
      { text: "Kabli za naprave, ki jih ni več" },
      { text: "Navodila za televizor iz leta 2004" },
      { text: "Vrečka z vrečkami" },
      { text: "Ključi. Ne ve se, od česa. Ne zavreči." },
      { text: "Rezervni vijaki od sestavljanja omare" },
      { text: "Baterije. Menda dobre." },
      { text: "Plovec in trnki, razsuti" },
      { text: "Kemični svinčnik iz banke, ki je ni več" },
      { text: "Polnilec za Nokio" },
    ],
  } satisfies Text<InventoryTask, Skip>,
  {
    section: "Prtljažnik",
    prompt: "Prtljažnik. Označi, kaj stalno voziš v njem.",
    proxyPrompt: "Prtljažnik preiskovane osebe. Označi, kaj se stalno vozi v njem.",
    done: "Zaprem prtljažnik",
    things: [
      { text: "Trikotnik, gasilnik in dve prvi pomoči" },
      { text: "Kabli za zagon. Za druge." },
      { text: "Liter olja za vsak primer" },
      { text: "Vetrobran" },
      { text: "Zložljiv stolček in termovka" },
      { text: "Vreča oglja" },
      { text: "Libela" },
      { text: "Vedro. Za rezerviranje mesta." },
      { text: "Registrator z računi za avto, odkar je nov" },
    ],
  } satisfies Text<InventoryTask, Skip>,
  {
    section: "Oblačenje",
    prompt: "Do katere temperature nosiš nogavice v sandalih?",
    proxyPrompt: "Do katere temperature nosi preiskovana oseba nogavice v sandalih?",
    ticks: ["nikoli", "12 °C", "20 °C", "28 °C", "vedno"],
    steps: [
      { text: "Ne nosim. Ne sandalov ne nogavic zraven.", proxy: "Ne nosi. Ne sandalov ne nogavic zraven." },
      { text: "Do 12 °C. Nad tem je že pretiravanje." },
      { text: "Do 20 °C. Tanke, nihče ne bo opazil." },
      { text: "Do 28 °C. Bele, frotirne." },
      { text: "Vedno. Tudi na plaži v Hurgadi." },
    ],
  } satisfies Text<ScaleTask, Skip>,
  {
    section: "Družabno življenje",
    prompt: "Piknik pri prijateljih. Gostitelj ravno obrača vratovino. Ti:",
    proxyPrompt: "Piknik pri prijateljih. Gostitelj obrača vratovino. Preiskovana oseba:",
    options: [
      { text: "Vprašam, ali je kaj veganskega.", proxy: "Vpraša, ali je kaj veganskega." },
      { text: "Stojim zraven s pivom in nadziram.", proxy: "Stoji zraven s pivom in nadzira." },
      { text: "Rečem, da je prezgodaj. In da oglje ni pravo.", proxy: "Reče, da je prezgodaj. In da oglje ni pravo." },
      { text: "Prevzamem klešče. Nekdo mora.", proxy: "Prevzame klešče. Nekdo mora." },
    ],
  } satisfies Text<ChoiceTask, Skip>,
  {
    section: "Delo",
    prompt: "Sestanek, ki bi lahko bil e-mail. Kaj narediš?",
    proxyPrompt: "Sestanek, ki bi lahko bil e-mail. Kaj naredi preiskovana oseba?",
    options: [
      { text: "Izklopim kamero in obešam perilo.", proxy: "Izklopi kamero in obeša perilo." },
      { text: "Delam zapiske. Na roko, v zvezek A4.", proxy: "Dela zapiske. Na roko, v zvezek A4." },
      { text: "Natisnem dnevni red. In zapisnik prejšnjega sestanka.", proxy: "Natisne dnevni red. In zapisnik prejšnjega sestanka." },
      {
        text: "Na koncu rečem: »Bom čisto na kratko, samo za povzetek.«",
        proxy: "Na koncu reče: »Bom čisto na kratko, samo za povzetek.«",
      },
    ],
  } satisfies Text<ChoiceTask, Skip>,
  {
    section: "Tabla III",
    prompt: "Tabla III. Zadnja, obljubimo.",
    proxyPrompt: "Tabla III. Kaj bo na njej videla preiskovana oseba?",
    options: [
      { text: "Hrošča v obleki." },
      { text: "Router od znotraj. Utripa rdeče." },
      { text: "Puščanje pod koritom. Bom že sam popravil.", proxy: "Puščanje pod koritom. Bo že sam popravil." },
      { text: "Ribo v obeh rokah. Bila je takale." },
    ],
  } satisfies Text<BlotTask, Skip>,
  {
    section: "Hitra serija",
    prompt: "Hitra serija. Ali to velja zate?",
    proxyPrompt: "Hitra serija. Ali to velja za preiskovano osebo?",
    statements: [
      { text: "Ploskanje ob pristanku letala." },
      { text: "Izklapljanje routerja čez noč, da se spočije." },
      { text: "Srajca s kratkimi rokavi, zatlačena v hlače." },
      { text: "Pranje avta v nedeljo ob osmih zjutraj." },
      { text: "Razdajanje paradižnika z vrtička po vrečkah." },
      { text: "Fotografija z ribo kot profilna slika." },
      { text: "Komentar »Lepo« pod vsako družinsko fotografijo." },
      { text: "Predpasnik z napisom »Mojster žara«." },
      { text: "Udarni vrtalnik kot darilo za vsako priložnost." },
      { text: "Prometni stožec na parkirnem mestu pred blokom." },
    ],
  } satisfies Text<RapidTask, Skip>,
];

export const VERDICTS: Text<Verdict>[] = [
  {
    label: "v sledovih",
    title: "Dziaderstvo v sledovih",
    description:
      "Simptomi na ravni statistične napake. Inštitut ne ugotavlja ogroženosti, priporoča pa budnost: prvi simptomi se navadno pojavijo po nakupu prvega vrtalnika.",
    recommendations: [
      "Kontrolni pregled čez pet let.",
      "Izogibati se železninam ob sobotah pred deseto.",
      "Predpasnika za žar ne sprejeti v dar.",
    ],
  },
  {
    label: "zmerno",
    title: "Zmerno dziaderstvo",
    description:
      "Simptomi se pojavljajo sezonsko, navadno v času piknikov, svetega večera in menjave gum. Stanje je stabilno, prognoza dobra.",
    recommendations: [
      "Rabo besedne zveze »v mojih časih« omejiti na enkrat na dan.",
      "Ne komentirati tujih gum brez izrecne prošnje.",
      "Enkrat na mesec prebrati navodila. Katera koli.",
    ],
  },
  {
    label: "povišano",
    title: "Povišano dziaderstvo",
    description:
      "Simptomi so utrjeni. Preiskovana oseba ima vsaj en predal, katerega vsebine se ne sme nihče dotikati, in vsaj eno mnenje o dizlu.",
    recommendations: [
      "Enkrat na teden zavreči en predmet, ki »bo še prišel prav«. Pod nadzorom.",
      "Pred deljenjem česar koli počakati 24 ur.",
      "Dovoliti komu drugemu, da obrne vratovino.",
    ],
  },
  {
    label: "klinično",
    title: "Klinično dziaderstvo",
    description:
      "Napredovalo stanje. Inštitut potrjuje diagnozo in izreka priznanje. Zdravljenje ni priporočeno, ker tako ali tako ne bi učinkovalo.",
    recommendations: [
      "Sprijazniti se z diagnozo.",
      "Naročiti predpasnik z napisom »Certificiran«.",
      "Znanje prenesti na mlajše. Najbolje za mizo na sveti večer.",
    ],
  },
];

/** Latin names and authorities never change. */
export const UNSPECIFIED: Text<typeof UnspecifiedPl, "latin" | "authority"> = {
  latent: {
    name: "Prikriti dziaders",
    description:
      "Težko zaznavna vrsta. Simptomi so s prostim očesom nevidni in se navadno pokažejo po tridesetem letu ali po nakupu prvega vrtalnika.",
  },
  common: {
    name: "Navadni dziaders",
    description:
      "Klasična oblika, brez specializacije. Simptomi so enakomerno razporejeni po vseh področjih življenja: od vremena do politike.",
  },
};
