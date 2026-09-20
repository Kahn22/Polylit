import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"chiens_dogs",surfaceFormId:"srf_chiens",senseId:"sns_chien_primary",target:"chiens",meaning:"dogs",
    early:[["Les chiens gardent la maison pendant la nuit.",["cats","horses","birds"]],["Deux chiens courent derrière la voiture.",["rabbits","wolves","sheep"]],["Paul donne de l’eau aux chiens.",["children","travelers","merchants"]]],
    blank:["Les ___ aboient devant la porte.",["chiens","chien","chats","chevaux"]],
    comprehension:["Les chiens suivent le chasseur jusque dans la forêt.","Qui suit le chasseur ?",["the dogs","the villagers","the horses","the children"],"the dogs"],
    advanced:[["Les chiens dorment près du feu, tandis que le chat reste dehors.","Quel mot désigne plusieurs animaux qui aboient ?",["chiens","feu","chat","dehors"]],["Paul appelle ses chiens et ouvre la barrière.","Quel nom pluriel désigne les animaux de Paul ?",["Paul","chiens","barrière","ouvre"]],["Ces chiens connaissent le chemin du village.","Quel mot signifie dogs ?",["Ces","chiens","chemin","village"]]] },
  { key:"renvoie_sends_back",surfaceFormId:"srf_renvoie",senseId:"sns_renvoyer_primary",target:"renvoie",meaning:"sends back; dismisses",
    early:[["Le juge renvoie le témoin chez lui.",["questions","welcomes","follows"]],["Marie renvoie la lettre à son auteur.",["keeps","reads","hides"]],["Paul renvoie le ballon vers Luc.",["drops","breaks","buys"]]],
    blank:["Le directeur ___ les élèves dans leur classe.",["renvoie","renvoient","renvoyait","retient"]],
    comprehension:["Le marchand renvoie le paquet parce que son contenu est cassé.","Que fait le marchand du paquet ?",["he sends it back","he sells it","he repairs it","he opens it"],"he sends it back"],
    advanced:[["Le maître renvoie le chien dehors et ferme ensuite la porte.","Quel verbe signifie fait repartir ?",["maître","renvoie","chien","porte"]],["Cette réponse renvoie le lecteur au premier chapitre.","Quel mot dirige le lecteur vers un autre passage ?",["réponse","renvoie","lecteur","chapitre"]],["Paul renvoie son guide après la fin du voyage.","Quel mot indique qu’il congédie le guide ?",["Paul","renvoie","guide","voyage"]]] },
  { key:"calendes_calends",surfaceFormId:"srf_calendes",senseId:"sns_calende_primary",target:"calendes",meaning:"calends; first day of a Roman month",
    early:[["Les calendes marquaient le premier jour du mois romain.",["last week","harvest season","winter night"]],["Le texte ancien mentionne les calendes de mars.",["village gates","royal taxes","summer roads"]],["Les Romains comptaient les jours depuis les calendes.",["hours","coins","soldiers"]]],
    blank:["Dans le calendrier romain, les ___ ouvraient le mois.",["calendes","nones","années","saisons"]],
    comprehension:["Le scribe date le document des calendes de janvier, c’est-à-dire du premier jour du mois.","À quel jour le document est-il daté ?",["the first day of January","the last day of January","the middle of January","an unknown day"],"the first day of January"],
    advanced:[["Les calendes appartiennent au calendrier romain, tandis que notre calendrier numérote directement les jours.","Quel mot nomme le premier jour du mois romain ?",["calendes","calendrier","romain","jours"]],["Cette dette devait être payée aux calendes de mai.","Quel terme historique fixe l’échéance au début du mois ?",["dette","payée","calendes","mai"]],["Le manuscrit cite les calendes avant les nones et les ides.","Quel mot désigne ici une date romaine ?",["manuscrit","calendes","nones","ides"]]] },
  { key:"leur_their",surfaceFormId:"srf_leur",senseId:"sns_leur_primary",target:"leur",meaning:"their; to them",
    early:[["Les voyageurs préparent leur départ.",["our","your","his"]],["Paul leur montre le chemin.",["to us","to him","to you"]],["Les enfants rangent leur chambre.",["my","her","this"]]],
    blank:["Marie ___ donne une réponse claire.",["leur","leurs","lui","les"]],
    comprehension:["Les voisins ferment leur porte avant de partir.","Quelle porte ferment-ils ?",["their own door","Paul’s door","the garden gate","every door"],"their own door"],
    advanced:[["Paul leur écrit chaque semaine, mais ils répondent rarement.","Quel pronom signifie à eux ?",["Paul","leur","semaine","rarement"]],["Les chevaux suivent leur maître jusqu’à l’écurie.","Quel déterminant indique la possession des chevaux ?",["chevaux","leur","maître","écurie"]],["Marie leur apporte du pain pendant que Luc prépare la soupe.","Quel mot désigne les destinataires ?",["Marie","leur","pain","Luc"]]] },
  { key:"arpenter_stride",surfaceFormId:"srf_arpenter",senseId:"sns_arpenter_primary",target:"arpenter",meaning:"to stride over; pace out; survey",
    early:[["Le garde doit arpenter les remparts toute la nuit.",["to repair","to leave","to hide"]],["Ils vont arpenter le terrain avant la vente.",["to flood","to divide","to abandon"]],["Paul aime arpenter les rues du vieux quartier.",["to avoid","to name","to close"]]],
    blank:["Le géomètre vient ___ le champ.",["arpenter","arpente","mesurerait","traversé"]],
    comprehension:["Marie passe la journée à arpenter les sentiers de la forêt.","Que fait Marie pendant la journée ?",["she walks all over the paths","she draws a map","she cuts down trees","she waits at home"],"she walks all over the paths"],
    advanced:[["Le soldat continue d’arpenter la cour à grands pas.","Quel infinitif signifie parcourir à pied ?",["soldat","arpenter","cour","pas"]],["Avant de bâtir, ils doivent arpenter précisément chaque parcelle.","Quel mot désigne l’action de mesurer un terrain ?",["bâtir","arpenter","parcelle","précisément"]],["Nous allons arpenter la plage jusqu’au coucher du soleil.","Quel verbe signifie parcourir en marchant ?",["allons","arpenter","plage","soleil"]]] },
];

export const lievreQuizBatch15 = specs.flatMap(authoredSet);
