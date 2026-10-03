import type { Text } from "@/i18n/overlay";
import type { Region } from "../regions";

/*
 * The sixteen voivodeships, keyed by their code. Names are the Slovenian adjective forms used on
 * their own as labels ("Mazovijsko"), as on Slovenian Wikipedia; in running text the noun follows:
 * "Mazovijsko vojvodstvo" (regionFullName in ../regions).
 */

export const REGIONS: Record<string, Text<Region, "code">> = {
  ZP: { name: "Zahodnopomorjansko", note: "Vstane ob 4.00, nič ne ujame, vrne se zadovoljen." },
  PM: { name: "Pomorjansko", note: "Vetrobran stoji od 6.30, še preden se je sonce sploh zavedlo." },
  WN: { name: "Varminsko-mazursko", note: "»Tukaj jadram od oseminsedemdesetega.« Zadnjič je jadral oseminsedemdesetega." },
  PD: { name: "Podlaško", note: "Pozna rastišča. Ne bo povedal." },
  LB: { name: "Lubuško", note: "Prevozi 40 km, da natoči 3 groše ceneje." },
  WP: { name: "Velikopoljsko", note: "Vrečke hrani v vrečki." },
  KP: { name: "Kujavsko-pomorjansko", note: "Ciechocinek, gradirnice, plesni večer. Več ni treba reči." },
  MZ: { name: "Mazovijsko", note: "Pravi »dajmo en call«, potem pa natisne zapisnik sestanka." },
  DS: { name: "Spodnješlezijsko", note: "Na Śnieżko v sandalih. V vsaki koči vpraša, koliko stane čaj." },
  LD: { name: "Lodžko", note: "Uta iz leta 1983. Načrti za njeno povečavo prav tako." },
  SK: { name: "Svetokriško", note: "Pomni čase, ko je bilo vse boljše. Vključno z dinozavri." },
  LU: { name: "Lublinsko", note: "Vreme napoveduje s kolenom. Uspešnost: 54 %." },
  OP: { name: "Opolsko", note: "Vsako leto gleda festival, da se prepriča, da so bile včasih pesmi boljše." },
  SL: { name: "Šlezijsko", note: "Golobnjak ima novejšo streho kot hiša." },
  MA: { name: "Malopoljsko", note: "Kupi oscypek in pravi, da je bil včasih večji." },
  PK: { name: "Podkarpatsko", note: "Že 30 let načrtuje, da bo pustil vse in odšel v Bieszczady. Živi v Bieszczadih." },
};
