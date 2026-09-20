import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"landes_heaths",surfaceFormId:"srf_landes",senseId:"sns_lande_primary",target:"landes",meaning:"heaths; moorlands",
    early:[["De vastes landes entourent le village.",["forests","lakes","gardens"]],["Les moutons traversent les landes couvertes de bruyère.",["bridges","streets","vineyards"]],["Le vent souffle librement sur les landes.",["mountains","islands","courtyards"]]],
    blank:["Les ___ s’étendent jusqu’à l’horizon.",["landes","lande","plaines","vallées"]],
    comprehension:["Les landes sont des terres ouvertes où poussent surtout des plantes basses.","Quel paysage la phrase décrit-elle ?",["open moorland with low plants","a dense tropical forest","cultivated fields of wheat","a crowded city park"],"open moorland with low plants"],
    advanced:[["Les landes deviennent violettes lorsque la bruyère fleurit.","Quel mot désigne ces étendues de terre ouverte ?",["landes","violettes","bruyère","fleurit"]],["Nous marchons sur les landes tandis que la forêt reste au loin.","Quel nom pluriel signifie terrains de bruyère ?",["marchons","landes","forêt","loin"]],["Ces landes sauvages abritent des oiseaux et quelques moutons.","Quel mot signifie moorlands ?",["landes","sauvages","oiseaux","moutons"]]] },
  { key:"ayant_having",surfaceFormId:"srf_ayant",senseId:"sns_avoir_primary",target:"ayant",meaning:"having",
    early:[["Ayant une carte, Paul trouve facilement la route.",["losing","drawing","seeking"]],["Marie, ayant du temps, relit la lettre.",["lacking","measuring","promising"]],["Ayant deux clés, il essaie la plus petite.",["finding","breaking","returning"]]],
    blank:["Paul, ___ terminé son travail, quitte le bureau.",["ayant","avoir","avait","étant"]],
    comprehension:["Ayant entendu la cloche, les voyageurs se dirigent vers le quai.","Pourquoi vont-ils vers le quai ?",["because they heard the bell","because they missed the train","because the station closed","because Paul called them"],"because they heard the bell"],
    advanced:[["Ayant perdu son chemin, Paul demande de l’aide au garde.","Quel mot est le participe présent de avoir ?",["Ayant","chemin","Paul","garde"]],["Marie, ayant une lampe, entre la première dans la cave.","Quel mot signifie possédant ?",["Marie","ayant","lampe","cave"]],["Ayant choisi la route courte, nous arrivons avant midi.","Quel mot introduit ici une action déjà accomplie ?",["Ayant","route","arrivons","midi"]]] },
  { key:"dis_say",surfaceFormId:"srf_dis",senseId:"sns_dire_primary",target:"dis",meaning:"say; tell",
    early:[["Je dis toujours la vérité.",["hear","know","forget"]],["Dis ton nom au gardien.",["Write","Hide","Change"]],["Tu dis que le train est parti.",["ask","believe","deny"]]],
    blank:["Je ___ ce que j’ai vu.",["dis","dit","dire","disons"]],
    comprehension:["Je dis à Paul que la route est fermée.","Quelle information est donnée à Paul ?",["the road is closed","the train is late","the bridge is open","the key is missing"],"the road is closed"],
    advanced:[["Je dis la réponse, mais Marie préfère garder le silence.","Quel verbe signifie j’exprime par la parole ?",["dis","réponse","Marie","silence"]],["Dis la vérité au juge avant de quitter la salle.","Quel mot donne l’ordre de parler ?",["Dis","vérité","juge","salle"]],["Tu dis oui tandis que ton frère refuse le marché.","Quel mot est une forme de dire ?",["dis","oui","frère","marché"]]] },
  { key:"temps_time",surfaceFormId:"srf_temps",senseId:"sns_temps_primary",target:"temps",meaning:"time; weather",
    early:[["Nous avons encore du temps avant le départ.",["distance","money","work"]],["Le temps passe vite pendant le voyage.",["road","wind","train"]],["Quel temps fera-t-il demain ?",["place","choice","price"]]],
    blank:["Il faut du ___ pour terminer ce travail.",["temps","moment","jour","retard"]],
    comprehension:["Paul n’a pas le temps de lire la lettre avant l’arrivée du train.","Pourquoi Paul ne lit-il pas la lettre ?",["he does not have enough time","he cannot read","he lost the letter","the train was cancelled"],"he does not have enough time"],
    advanced:[["Le temps manque, mais il reste encore beaucoup de travail.","Quel mot désigne la durée disponible ?",["temps","reste","travail","beaucoup"]],["Par mauvais temps, les bateaux restent dans le port.","Quel mot désigne ici les conditions météorologiques ?",["temps","bateaux","restent","port"]],["Marie prend le temps de répondre clairement à chaque question.","Quel nom signifie durée ?",["Marie","temps","répondre","question"]]] },
  { key:"reste_remainder",surfaceFormId:"srf_reste",senseId:"sns_reste_primary",target:"reste",meaning:"remainder; rest",
    early:[["Le reste du pain est sur la table.",["beginning","price","bag"]],["Paul garde le reste pour demain.",["everything new","first part","empty box"]],["Le reste de l’équipe arrive plus tard.",["captain","opponent","audience"]]],
    blank:["Marie partage le ___ du gâteau entre les enfants.",["reste","milieu","début","morceau"]],
    comprehension:["Luc boit une tasse de café et verse le reste dans une bouteille.","Que met-il dans la bouteille ?",["the coffee that remains","a cup of water","all the milk","an empty cup"],"the coffee that remains"],
    advanced:[["Le reste du voyage se fait à pied après la panne de la voiture.","Quel mot désigne la partie qui demeure ?",["reste","voyage","pied","voiture"]],["Paul lit une page et laisse le reste du rapport pour demain.","Quel nom signifie la partie non encore lue ?",["Paul","page","reste","rapport"]],["Nous vendons les pommes et gardons le reste des fruits.","Quel mot désigne ce qui n’est pas vendu ?",["vendons","pommes","reste","fruits"]]] },
];

export const lievreQuizBatch16 = specs.flatMap(authoredSet);
