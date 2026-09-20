import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"toute_all",surfaceFormId:"srf_toute",senseId:"sns_tout_primary",target:"toute",meaning:"all; whole; every (feminine singular)",
    early:[["Marie travaille toute la journée.",["part of","after","before"]],["Toute la famille attend devant la maison.",["No","Another","Our"]],["Elle a lu toute la lettre.",["half the","a new","this short"]]],
    blank:["La neige couvre ___ la vallée.",["toute","tout","toutes","tous"]],
    comprehension:["Paul marche toute la nuit pour atteindre le village.","Pendant combien de temps Paul marche-t-il ?",["the whole night","one hour","until noon","part of the evening"],"the whole night"],
    advanced:[["Toute la ville célèbre la victoire, mais le village voisin reste silencieux.","Quel mot indique la totalité de la ville ?",["Toute","ville","village","silencieux"]],["Marie connaît toute l’histoire et peut répondre aux questions.","Quel mot signifie l’histoire entière ?",["Marie","toute","histoire","questions"]],["La pluie tombe pendant toute la matinée.","Quel déterminant féminin exprime la durée complète ?",["pluie","toute","matinée","pendant"]]] },
  { key:"autre_adjective_other",surfaceFormId:"srf_autre",senseId:"sns_autre_adjective",target:"autre",meaning:"other; another (adjective)",
    early:[["Paul choisit une autre route.",["same","short","first"]],["Il faut trouver un autre moyen.",["old","simple","certain"]],["Marie attend dans une autre salle.",["large","empty","nearby"]]],
    blank:["Prenons une ___ barque pour traverser.",["autre","autres","même","seconde"]],
    comprehension:["Cette clé ne convient pas ; Luc essaie une autre clé.","Que fait Luc ?",["he tries another key","he repairs the lock","he opens the door","he gives the key away"],"he tries another key"],
    advanced:[["Une autre voiture arrive, mais Paul attend toujours le bus.","Quel adjectif distingue la nouvelle voiture de la première ?",["autre","voiture","Paul","bus"]],["Marie propose un autre plan après l’échec du premier.","Quel mot signifie différent ou supplémentaire ?",["Marie","autre","plan","premier"]],["Nous devons chercher une autre entrée puisque cette porte est fermée.","Quel mot qualifie entrée comme différente ?",["chercher","autre","entrée","porte"]]] },
  { key:"autre_pronoun_other_one",surfaceFormId:"srf_autre",senseId:"sns_autre_pronoun",target:"autre",meaning:"other one; the other",
    early:[["Une porte est ouverte ; l’autre reste fermée.",["another door as an adjective","the same one","neither one"]],["Paul prend ce chemin et Marie choisit l’autre.",["both","herself","the first place"]],["Des deux clés, l’une fonctionne et l’autre non.",["each key","no key","one more key"]]],
    blank:["Ce livre est ancien ; l’___ est moderne.",["autre","autres","auteur","ouvrage"]],
    comprehension:["Deux bateaux attendent au port : l’un part aujourd’hui, l’autre demain.","Quand part le second bateau ?",["tomorrow","today","next week","the sentence does not say"],"tomorrow"],
    advanced:[["Paul garde une lettre et donne l’autre à Marie.","Quel pronom désigne la seconde lettre ?",["Paul","lettre","autre","Marie"]],["Une route mène au village ; l’autre rejoint directement la rivière.","Quel mot signifie the other one ?",["route","village","autre","rivière"]],["Entre les deux chevaux, l’un est rapide et l’autre plus résistant.","Quel pronom remplace le second cheval ?",["chevaux","rapide","autre","résistant"]]] },
  { key:"chose_thing",surfaceFormId:"srf_chose",senseId:"sns_chose_primary",target:"chose",meaning:"thing; matter",
    early:[["Paul veut montrer une chose importante.",["person","place","hour"]],["La première chose à faire est de fermer la porte.",["road","voice","question"]],["Cette chose appartient au vieux marchand.",["letter","animal","house"]]],
    blank:["Il reste une ___ à vérifier.",["chose","cause","partie","fois"]],
    comprehension:["Marie cache une chose dans la boîte, mais refuse de dire ce que c’est.","Que sait-on de l’objet ?",["it is hidden in the box","it is a key","it belongs to Paul","it is very old"],"it is hidden in the box"],
    advanced:[["Une chose demeure certaine : le train est déjà parti.","Quel nom général désigne un fait ou un objet ?",["chose","train","parti","certaine"]],["Paul pense à autre chose tandis que Marie explique le plan.","Quel mot signifie thing ?",["Paul","chose","Marie","plan"]],["La seule chose qui manque est la signature du témoin.","Quel nom reprend l’élément manquant ?",["chose","signature","témoin","manque"]]] },
  { key:"fin_end",surfaceFormId:"srf_fin",senseId:"sns_fin_primary",target:"fin",meaning:"end; conclusion",
    early:[["Le voyage touche à sa fin.",["beginning","middle","purpose"]],["Paul attend la fin du discours.",["author","subject","title"]],["À la fin, tous rentrent au village.",["At first","Meanwhile","Perhaps"]]],
    blank:["La cloche annonce la ___ de la cérémonie.",["fin","suite","cause","durée"]],
    comprehension:["À la fin du repas, Marie apporte du café.","Quand apporte-t-elle le café ?",["at the end of the meal","before the meal","during the first course","the next morning"],"at the end of the meal"],
    advanced:[["La fin de l’histoire surprend tous les lecteurs.","Quel mot désigne la dernière partie ?",["fin","histoire","lecteurs","surprend"]],["Paul arrive avant la fin et entend encore quelques phrases.","Quel nom signifie moment où quelque chose cesse ?",["Paul","fin","phrases","arrive"]],["Le soleil disparaît à la fin du jour derrière les collines.","Quel mot indique l’achèvement du jour ?",["soleil","fin","jour","collines"]]] },
];

export const lievreQuizBatch23 = specs.flatMap(authoredSet);
