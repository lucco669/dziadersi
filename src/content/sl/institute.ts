import type { Figure, Milestone, Question, Unit } from "@/content/institute";
import type { Text } from "@/i18n/overlay";

/*
 * O Inštitutu: the Slovenian text of the statute, history, organisation chart, figures, FAQ and
 * contact. Lists are keyed like the Polish ones: milestones by their Polish date, units by the
 * department they run, figures by their Polish label, questions by the Polish question. The FAQ
 * answers name the privacy policy as »politika zasebnosti«, which the page turns into a link.
 */

export const MISSION =
  "Inštitut za raziskave dziaderstva (v nadaljnjem besedilu: Inštitut) je neodvisna raziskovalna ustanova, ustanovljena z namenom opisovanja, razvrščanja in merjenja dziaderstva na Poljskem. Inštitut ta namen uresničuje zlasti z obdobnimi pregledi, terenskimi opazovanji, vodenjem Atlasa in Slovarja ter objavljanjem poročil in statističnih podatkov. Predmet raziskav Inštituta so navade, ne osebe. Inštitut deluje v javnem interesu, zlasti v interesu oseb, ki so jim odvzeli klešče.";

/** Keyed by the Polish `date`. The printed date is text: "27. julij 2025", "Oktober 2026". */
export const HISTORY: Record<string, Text<Milestone>> = {
  "27 lipca 2025": {
    date: "27. julij 2025",
    text: "Med družinskim piknikom na vrtičku traja spor o tem, kdo drži klešče, 3 ure in 20 minut. Eden od udeležencev opazi, da tega pojava še nihče ni znanstveno opisal. Ugotovitve zapišejo na kartonast krožnik, ki je danes zapisnik št. 1 v Arhivu Inštituta.",
  },
  "18 października 2025": {
    date: "18. oktober 2025",
    text: "V garaži enega od udeležencev piknika se sestane Iniciativni odbor za raziskave dziaderstva. Stol je tam samo eden, zaseden od prve seje, zato ostali člani zasedajo stoje. V zbirko Odbora preidejo zapiski o okvarah v domu, ki se vodijo od leta 2019.",
  },
  "24 grudnia 2025": {
    date: "24. december 2025",
    text: "Odbor izvede pilotno raziskavo za mizo na sveti večer¹. Rezultatov na prošnjo družine niso objavili, so pa služili za umerjanje Nacionalnega indeksa dziaderstva. Indeks še danes kaže, da je sveti večer dan največje ogroženosti v letu.",
    notes: [
      "¹ Sveti večer: poljsko Wigilia, osrednji družinski praznik leta, z dvanajstimi postnimi jedmi in praznim krožnikom za nepričakovanega gosta.",
    ],
  },
  "2 stycznia 2026": {
    date: "2. januar 2026",
    text: "Odbor sprejme statut in se preoblikuje v Inštitut za raziskave dziaderstva. Statut ima 14 strani in eno prilogo: risbo dziadersa v poletni opravi, danes znano kot Sl. 1.",
  },
  "16 lutego 2026": {
    date: "16. februar 2026",
    text: "Terenska sekcija objavi prvo poročilo Inštituta: inventuro 2847 predalov s kabli v 1200 gospodinjstvih. Namena večine kablov do danes niso ugotovili.",
  },
  "1 października 2026": {
    date: "1. oktober 2026",
    text: "Inštitut se odpre za javnost na naslovu dziader.si. Od prvega dne delujejo Test dziadersa, Atlas dziadersov, Dziaderski slovar, Poročila Inštituta in Nacionalni indeks dziaderstva.",
  },
  "2 października 2026": {
    date: "2. oktober 2026",
    text: "Začne se Nacionalni popis dziadersov: vsak opravljen pregled je preštet, anonimno in brez imena s certifikata. Popis traja do preklica. Isti dan Inštitut odpre Dziaderski profil ter zažene Dziaderski pogovornik in Dziaders bingo.",
  },
  "Październik 2026": {
    date: "Oktober 2026",
    text: "Nastanejo Razsodna komisija »Je to že dziaderstvo?«, Terenski izpit, Mali statistični letopis, Častna tabla, Tedenski bilten in Trgalni koledar. Prijavljeni obiskovalci začnejo sporočati terenska opazovanja vrst iz Atlasa. Inštitut prvič v zgodovini sprejme porotnike in opazovalce, ki niso iz družine ustanoviteljev.",
  },
};

/** Keyed by the unit's `href`, the department it runs. */
export const UNITS: Record<string, Text<Unit, "href">> = {
  "/test": {
    name: "Oddelek za diagnostiko dziaderstva",
    head: "Vodja: podpis nečitljiv",
    text: "Izvaja obdobni pregled z obrazcem IBD-T2: šestnajst nalog v petih ordinacijah, približno štiri minute. Izda diagnozo vrste, laboratorijske izvide in certifikat. Sprejema brez napotnice, tudi ob nedeljah in praznikih.",
  },
  "/atlas": {
    name: "Taksonomska sekcija",
    head: "Vodja: nezasedeno od leta 2026",
    text: "Opisuje in razvršča vrste dziadersov, ki živijo na Poljskem, ter jim dodeljuje šifre in latinska imena. Vodi Atlas dziadersov, določevalni ključ in Terenski izpit. Razpis za vodjo je bil objavljen dvakrat. Obakrat so se kandidati prepoznali v Atlasu in umaknili prijave.",
  },
  "/slownik": {
    name: "Leksikografska sekcija",
    head: "Vodja: kdor ima zadnjo besedo",
    text: "Zbira izraze, slišane za družinsko mizo, in jih obdeluje kot slovarska gesla: pomen, izgovorjava, primer rabe. Izraz pride v Slovar, če je med enim kosilom padel vsaj trikrat.",
  },
  "/raporty": {
    name: "Terenska sekcija",
    head: "Vodja: na terenu, na klopi",
    text: "Izvaja terenske raziskave, sistematične preglede in poskuse ter njihove izsledke objavlja v Poročilih Inštituta. Opazuje s klopi: dovolj blizu, da vse sliši, in dovolj daleč, da se ne vmešava.",
  },
  "/indeks": {
    name: "Center za napovedi in opozorila",
    head: "Dežurni prognostik: menjava vsako uro",
    text: "Izračunava Nacionalni indeks dziaderstva na lestvici 0–100 in ga posodablja vsako uro. Izdaja sezonska opozorila, tako kot se izdajajo vremenska. Napoved vrhunca na sveti večer se uresničuje od začetka meritev.",
  },
  "/statystyki": {
    name: "Služba za statistiko",
    head: "V. d. vodje: kalkulator na sončno celico",
    text: "Vodi Nacionalni popis dziadersov in izdaja Mali statistični letopis. Šteje vse, kar se da prešteti brez imen: preglede, glasove porotnikov, terenska opazovanja, prečrtana polja v bingu in pritiske na hupo. Zbirnih podatkov iz popisa ne objavi, dokler ne zbere 30 pregledov.",
  },
  "/czy-to-juz-dziaderstwo": {
    name: "Razsodna komisija",
    head: "Predsednik: kdor drži daljinec",
    text: "Obravnava primere iz vsakdanjega življenja in razsoja, ali je to že dziaderstvo. Razsodi v treh različicah: »to še ni dziaderstvo«, »to je že dziaderstvo« in »klinično dziaderstvo«. V senatu sedijo porotniki, torej obiskovalci, mnenje Komisije pa se razkrije šele po njihovem glasovanju.",
  },
  "/profil": {
    name: "Mreža terenskih opazovalcev",
    head: "Koordinator: dežurstvo na balkonu",
    text: "Združuje prijavljene obiskovalce, ki sporočajo opazovanja vrst iz Atlasa. Opazovalci delajo prostovoljno, v urah, ko bi tako ali tako gledali. Vsako vrsto je mogoče sporočiti enkrat na dan: nadaljnje prijave istega dne Inštitut šteje za istega osebka.",
  },
  "/kalendarz": {
    name: "Založba Inštituta",
    head: "Odgovorni urednik: kdor prvi vstane",
    text: "Izdaja Trgalni koledar in Tedenski bilten. Koledar izide vsak dan opolnoči, bilten ob ponedeljkih zjutraj. Listov na zalogo Založba ne tiska, ker kdor trga na zalogo, vara samega sebe.",
  },
  "/generator": {
    name: "Arhiv vokalizacij",
    head: "Arhivar: vse je slišal dvakrat",
    text: "Hrani izjave dziadersov iz osmih situacij, od avtomobila do sosedovih otrok, in jih daje na voljo kot Dziaderski pogovornik. Vsaka izjava je sestavljena iz uvoda, teze in poante, vedno v tem vrstnem redu. Na željo jih Arhiv prebere na glas.",
  },
};

/** Keyed by the Polish `label`. The values are numbers and are reprinted, not translated. */
export const FIGURES: Record<string, Text<Figure, "value">> = {
  "grantów i dotacji otrzymanych od dnia założenia": { label: "projektnih sredstev in subvencij, prejetih od dneva ustanovitve" },
  "gabinetów diagnostycznych czynnych całą dobę": { label: "diagnostičnih ordinacij, odprtih 24 ur na dan" },
  "wypowiedzi w zbiorach Archiwum Wokalizacji": { label: "izjav v zbirkah Arhiva vokalizacij" },
  "zszywek zużytych na protokoły": { label: "sponk, porabljenih za zapisnike" },
  "osób wpisanych do Atlasu z imienia i nazwiska": { label: "oseb, vpisanih v Atlas z imenom in priimkom" },
};

/** Keyed by the Polish `question`. */
export const FAQ: Record<string, Text<Question>> = {
  "Czy Instytut naprawdę istnieje?": {
    question: "Ali Inštitut res obstaja?",
    answer:
      "Da, kot satirična stran. Kot znanstvena ustanova ne obstaja: nima sedeža, vratarnice niti vpisa v kateri koli register. Obstaja pa pojav, ki ga Inštitut raziskuje. To zlahka preveriš na prvem pikniku z žarom.",
  },
  "Kto finansuje Instytut?": {
    question: "Kdo financira Inštitut?",
    answer:
      "Nihče od zunaj. Inštitut ne prejema projektnih sredstev ali subvencij, ne prikazuje oglasov in ne prodaja podatkov. Vzdržuje se z lastnimi sredstvi. Edina vloga za sofinanciranje je bila zavržena že pri formalnem pregledu, ker je bilo v rubriko »Cilj raziskave« vpisano »da bi že enkrat dal klešče iz rok«.",
  },
  "Czy dane Instytutu są prawdziwe?": {
    question: "Ali so podatki Inštituta resnični?",
    answer:
      "Deloma. Poročila, Atlas in Nacionalni indeks dziaderstva so izmišljeni, čeprav skrbno. Indeks je model, ne meritev: izhaja iz letnih časov in koledarja nevarnosti, zato v isti uri vsi vidijo isto vrednost. Resnične pa so številke v Nacionalnem popisu dziadersov, v Razsodni komisiji in v Malem statističnem letopisu: kažejo, kaj so obiskovalci na strani v resnici storili. Za resničnost terenskih opazovanj odgovarjajo opazovalci.",
  },
  "Czy wyniki testu są przechowywane?": {
    question: "Ali se rezultati testa shranjujejo?",
    answer:
      "Rezultat je zapisan v sami povezavi: koda v naslovu vsebuje vse odgovore, ime s certifikata pa se pripiše na njen konec. Inštitut tega imena ne hrani. V Nacionalni popis dziadersov gre anonimna kopija pregleda: med drugim odgovori, rezultat, diagnoza in čas pregleda ter vojvodstvo, če ga je kdo navedel. Tja ne gredo ime, naslov IP ali kakršen koli identifikator. Rezultati prijavljenih obiskovalcev se shranijo tudi v Dziaderski profil, od koder jih je mogoče izbrisati posamično ali skupaj z računom. Podrobnosti opisuje politika zasebnosti.",
  },
  "Czy można zostać wypisanym z Atlasu?": {
    question: "Ali je mogoč izbris iz Atlasa?",
    answer:
      "Inštitut ne more nikogar izbrisati iz Atlasa, ker vanj ni nikogar vpisal. Atlas opisuje vrste, torej navade, in nikogar ne navaja z imenom. Kdor se je prepoznal v opisu, lahko spremeni navado: izroči klešče ali odnese vedro s parkirnega mesta. Vrste v zbirki Dziaderskega profila izginejo skupaj z rezultati, v katerih so bile prepoznane, ali s celotnim računom.",
  },
  "Czy dziaderstwo zależy od wieku?": {
    question: "Ali je dziaderstvo odvisno od starosti?",
    answer:
      "Ne. Inštitut raziskuje navade, ne rojstnih listov. Prijemalko je mogoče prevzeti v vsaki starosti, listek za brisalcem pa napisati še pred tridesetim. Test dziadersa ne sprašuje po datumu rojstva, temveč po tem, kje parkiraš.",
  },
  "Jak zostać obserwatorem terenowym?": {
    question: "Kako postanem terenski opazovalec?",
    answer:
      "Ustvariti moraš Dziaderski profil. Dovolj je e-poštni naslov, brez gesla: Inštitut ti pošlje pismo z gumbom in kodo za prijavo. Prijavljeni opazovalec sporoča opazovanja na straneh vrst v Atlasu, z vojvodstvom ali brez. Fotografij Inštitut ne sprejema: opazovalec naj gleda, ne fotografira.",
  },
  "Kto może orzekać w Komisji Orzekającej?": {
    question: "Kdo lahko razsoja v Razsodni komisiji?",
    answer:
      "Vsak obiskovalec, brez prijave in brez potrdil. Porotnik se seznani z dejanskim stanjem in pojasnili stranke, odda en glas v zadevi in šele nato izve mnenje Komisije. Izidi glasovanj se objavljajo samo zbirno.",
  },
};

/** Slovenian edition only: appended after the translated FAQ. */
export const EDITION_QUESTION: Question = {
  question: "Zakaj poljski inštitut v slovenščini?",
  answer:
    "Inštitut raziskuje dziaderstvo na Poljskem in svoja dela izdaja v poljščini. Slovenska izdaja je prevod. Poljska imena krajev, trgovin in televizijskih oddaj so ostala poljska; kjer bi se slovenskemu bralcu kaj izgubilo, jih pojasnjuje opomba prevajalca, skrajšano op. prev. Ali dziaderse ima tudi Slovenija, Inštitut uradno ne ve. Prevajalska služba je prejela številne prijave slovenskih družin. Zadeva je v obravnavi.",
};

export const CONTACT =
  "Inštitut sprejema dopise v znanstvenih in organizacijskih zadevah ter v zadevah, ki se nanašajo na osebne podatke. Naslov za dopise navaja politika zasebnosti. Dopisi se obravnavajo po vrstnem redu prejema. Sporočila, napisana z velikimi tiskanimi črkami, se ne obravnavajo hitreje, listki za brisalcem pa se ne obravnavajo sploh.";
