import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"brouter_graze",surfaceFormId:"srf_brouter",senseId:"sns_brouter_primary",target:"brouter",meaning:"to graze; browse",
    early:[["Les chèvres vont brouter près de la rivière.",["to sleep","to run","to hide"]],["Le cheval préfère brouter dans ce pré.",["to drink","to jump","to rest"]],["On laisse les moutons brouter librement.",["to follow","to carry","to count"]]],
    blank:["Les vaches sortent pour ___ l’herbe fraîche.",["brouter","boire","courir","dormir"]],
    comprehension:["Le berger conduit son troupeau dans la prairie pour brouter.","Pourquoi le troupeau va-t-il dans la prairie ?",["to graze","to cross a river","to find shelter","to meet another flock"],"to graze"],
    advanced:[["Les moutons aiment brouter cette herbe courte au bord du chemin.","Quel infinitif désigne l’action de manger l’herbe sur pied ?",["moutons","brouter","herbe","chemin"]],["Le cerf vient brouter dans la clairière lorsque la forêt est calme.","Quel mot indique que le cerf se nourrit de végétation ?",["cerf","brouter","clairière","forêt"]],["Après la pluie, les chevaux peuvent brouter une herbe abondante.","Quel verbe signifie paître ?",["pluie","chevaux","brouter","herbe"]]] },
  { key:"dormir_sleep",surfaceFormId:"srf_dormir",senseId:"sns_dormir_primary",target:"dormir",meaning:"to sleep",
    early:[["Paul veut dormir près du feu.",["to eat","to read","to leave"]],["Le chien préfère dormir dehors.",["to bark","to walk","to play"]],["Il faut dormir avant le long voyage.",["to work","to speak","to wait"]]],
    blank:["Marie monte dans sa chambre pour ___.",["dormir","dort","rêver","reposer"]],
    comprehension:["Luc ferme les volets et se couche tôt pour dormir huit heures.","Pourquoi Luc se couche-t-il tôt ?",["to sleep eight hours","to read a book","to catch a train","to avoid the rain"],"to sleep eight hours"],
    advanced:[["Les voyageurs essaient de dormir, mais le vent secoue les fenêtres.","Quel infinitif désigne le sommeil ?",["voyageurs","dormir","vent","fenêtres"]],["Paul va dormir dans la petite chambre au-dessus de la cuisine.","Quel mot signifie être endormi ?",["Paul","dormir","chambre","cuisine"]],["Il préfère dormir maintenant et reprendre la route à l’aube.","Quel verbe indique l’action opposée à rester éveillé ?",["préfère","dormir","route","aube"]]] },
  { key:"ecouter_listen",surfaceFormId:"srf_ecouter",senseId:"sns_ecouter_primary",target:"écouter",meaning:"to listen to",
    early:[["Les enfants viennent écouter cette histoire.",["to repeat","to forget","to write"]],["Il faut écouter attentivement le témoin.",["to question","to avoid","to interrupt"]],["Marie préfère écouter la radio le soir.",["to watch","to repair","to turn off"]]],
    blank:["Paul s’arrête pour ___ le chant des oiseaux.",["écouter","entendre","parler","regarder"]],
    comprehension:["Le juge demande le silence afin d’écouter chaque réponse.","Pourquoi demande-t-il le silence ?",["to listen to every answer","to end the meeting","to read the report","to call another witness"],"to listen to every answer"],
    advanced:[["Nous allons écouter le guide avant de choisir notre chemin.","Quel infinitif signifie prêter l’oreille ?",["écouter","guide","choisir","chemin"]],["Paul cesse de parler pour écouter Marie.","Quel mot désigne l’attention portée aux paroles de Marie ?",["Paul","parler","écouter","Marie"]],["Les élèves doivent écouter la question jusqu’à la fin.","Quel verbe demande une attention auditive ?",["élèves","écouter","question","fin"]]] },
  { key:"ou_where",surfaceFormId:"srf_ou_accent",senseId:"sns_ou_interrogative",target:"où",meaning:"where",
    early:[["Où habite votre frère ?",["when","why","how"]],["Savez-vous où mène ce chemin ?",["who","what","whose"]],["Où avez-vous trouvé cette lettre ?",["how many","which","whether"]]],
    blank:["___ se trouve la gare la plus proche ?",["où","ou","qui","quand"]],
    comprehension:["Marie demande : « Où Paul a-t-il posé les clés ? »", "Quelle information Marie cherche-t-elle ?",["the location of the keys","the owner of the keys","the number of keys","the age of the keys"],"the location of the keys"],
    advanced:[["Où commence la route qui traverse la forêt ?", "Quel mot interroge sur un lieu ?",["Où","route","traverse","forêt"]],["Paul ignore où le bateau doit accoster.","Quel mot signifie à quel endroit ?",["Paul","où","bateau","accoster"]],["Dites-moi où vous avez caché le document.","Quel adverbe demande le lieu ?",["Dites","où","caché","document"]]] },
  { key:"vient_comes",surfaceFormId:"srf_vient",senseId:"sns_venir_primary",target:"vient",meaning:"comes; is coming",
    early:[["Paul vient chaque matin au marché.",["leaves","stays","sleeps"]],["Le bruit vient de la rue.",["goes toward","stops near","passes under"]],["Marie vient nous aider aujourd’hui.",["refuses","forgets","waits"]]],
    blank:["Le train ___ de quitter la gare.",["vient","viens","viennent","venait"]],
    comprehension:["Le médecin vient au village pour soigner le vieux berger.","Pourquoi le médecin vient-il ?",["to treat the old shepherd","to buy a horse","to visit the mayor","to cross the river"],"to treat the old shepherd"],
    advanced:[["Le bateau vient du nord tandis que le vent souffle de l’ouest.","Quel verbe indique l’origine du bateau ?",["bateau","vient","vent","ouest"]],["Paul vient ouvrir la porte après avoir entendu frapper.","Quel mot signifie arrive pour faire quelque chose ?",["Paul","vient","porte","frapper"]],["Cette décision vient trop tard pour changer le résultat.","Quel mot est une forme du verbe venir ?",["décision","vient","tard","résultat"]]] },
];

export const lievreQuizBatch17 = specs.flatMap(authoredSet);
