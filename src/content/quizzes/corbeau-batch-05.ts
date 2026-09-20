import type { ContentBundle } from "../../domain/model.js";
import { authoredSet } from "./authoring.js";

export const corbeauQuizBatch05: ContentBundle["quizItems"] = [
  ...authoredSet({ key:"corbeau", surfaceFormId:"srf_corbeau", senseId:"sns_corbeau_primary", target:"Corbeau", meaning:"crow",
    early:[["Un Corbeau noir traverse le ciel.",["fox","eagle","sparrow"]],["Le Corbeau cherche des graines dans le champ.",["owl","duck","swan"]],["Ce Corbeau construit son nid dans un grand chêne.",["hawk","pigeon","robin"]]],
    blank:["Un grand ___ noir se pose près du chemin.",["Corbeau","Corbeaux","Renard","corbeille"]],
    comprehension:["Le Corbeau cache une noix sous les feuilles.","Que cache l’oiseau sous les feuilles ?",["a nut","a feather","a stone","a key"],"a nut"],
    advanced:[["Le Corbeau croasse, le merle chante et la pie saute près du nid.","Quel mot désigne le grand oiseau noir qui croasse ?",["Corbeau","merle","pie","nid"]],["Dans le pré, un Corbeau noir observe le lapin, le cheval et la rivière.","Quel mot nomme l’oiseau noir présent dans le pré ?",["Corbeau","lapin","cheval","rivière"]],["Le naturaliste distingue le Corbeau à son plumage noir ; le faucon plane au-dessus du rocher.","Quel mot désigne l’oiseau reconnu à son plumage noir ?",["naturaliste","Corbeau","faucon","rocher"]]] }),
  ...authoredSet({ key:"renard", surfaceFormId:"srf_renard", senseId:"sns_renard_primary", target:"Renard", meaning:"fox",
    early:[["Un Renard roux traverse le sentier.",["wolf","rabbit","deer"]],["Le Renard retourne silencieusement dans son terrier.",["badger","bear","dog"]],["Ce Renard chasse les souris au bord du champ.",["foxhound","weasel","squirrel"]]],
    blank:["Le ___ roux rejoint son terrier avant l’aube.",["Renard","Renards","Corbeau","renardeau"]],
    comprehension:["Le Renard attend près du poulailler pendant la nuit.","Où l’animal attend-il ?",["near the henhouse","inside the forest","beside the river","under a bridge"],"near the henhouse"],
    advanced:[["Le Renard quitte son terrier, croise un lièvre et disparaît dans les fougères.","Quel mot désigne l’animal roux qui habite le terrier ?",["Renard","terrier","lièvre","fougères"]],["Au crépuscule, le Renard observe les poules tandis que le chien garde la ferme.","Quel mot nomme le prédateur roux qui observe les poules ?",["crépuscule","Renard","chien","ferme"]],["Le zoologue suit les traces du Renard dans la neige, puis remarque celles du cerf près du ruisseau.","Quel mot désigne l’animal dont le zoologue suit d’abord les traces ?",["zoologue","Renard","cerf","ruisseau"]]] }),
  ...authoredSet({ key:"monsieur", surfaceFormId:"srf_monsieur", senseId:"sns_monsieur_primary", target:"Monsieur", meaning:"mister; sir",
    early:[["Bonjour, Monsieur Martin ; votre rendez-vous est prêt.",["doctor","friend","child"]],["Excusez-moi, Monsieur, avez-vous perdu ce gant ?",["madam","officer","neighbor"]],["Monsieur Leroy attend devant le bureau du directeur.",["master","student","servant"]]],
    blank:["« Votre table est prête, ___ Dupont », annonce la serveuse.",["Monsieur","Madame","Messieurs","Docteur"]],
    comprehension:["Monsieur Vidal présente son billet à la contrôleuse.","Que présente Monsieur Vidal ?",["his ticket","his passport","his bag","his receipt"],"his ticket"],
    advanced:[["Monsieur Brun entre dans la salle, salue la secrétaire et rejoint le directeur.","Quel mot est le titre placé devant le nom Brun ?",["Monsieur","salle","secrétaire","directeur"]],["La réceptionniste appelle Monsieur Roy ; Madame Blanc attend encore près de la porte.","Quel mot est le titre masculin employé devant Roy ?",["réceptionniste","Monsieur","Madame","porte"]],["Le président répond : « Monsieur Garnier, le comité examinera votre demande demain. »","Quel mot sert ici d’appellation polie pour Garnier ?",["président","Monsieur","comité","demain"]]] }),
];
