import type { ZolaVocabularySpec } from "./zola-authoring.js";
const nE:[string,string,string]=["a ladder","a pillow","a melon"];
const nF:[string,string,string]=["échelle","oreiller","melon"];
const vE:[string,string,string]=["to knit","to surf","to snore"];
const vF:[string,string,string]=["tricoter","surfer","ronfler"];
const aE:[string,string,string]=["turquoise","octagonal","buttery"];
export const zolaVocabularyBatch08: ZolaVocabularySpec[] = [
 {normalized:"carte-télégramme",lemmaKey:"carte_telegramme",headword:"carte-télégramme",partOfSpeech:"noun",senseKey:"carte_telegramme",gloss:"telegram card",definition:"message télégraphique présenté sur une carte",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"cauchemar",lemmaKey:"cauchemar",headword:"cauchemar",partOfSpeech:"noun",senseKey:"cauchemar_nightmare",gloss:"nightmare",definition:"rêve terrifiant ou situation qui y ressemble",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"cédé",lemmaKey:"ceder",headword:"céder",partOfSpeech:"verb",senseKey:"ceder_yield",gloss:"to yield; give in",quizMeaning:"yielded; gave in",definition:"cesser de résister",englishDistractors:["knitted","surfed","snored"],frenchDistractors:["tricoté","surfé","ronflé"]},
 {normalized:"céder",lemmaKey:"ceder",headword:"céder",partOfSpeech:"verb",senseKey:"ceder_yield",gloss:"to yield; give in",definition:"cesser de résister",englishDistractors:vE,frenchDistractors:vF},
 {normalized:"certain",lemmaKey:"certain",headword:"certain",partOfSpeech:"adjective",senseKey:"certain_sure",gloss:"certain; sure",definition:"tenu pour vrai ou assuré",englishDistractors:aE,frenchDistractors:["turquoise","octogonal","beurré"]},
 {normalized:"certaine",lemmaKey:"certain",headword:"certain",partOfSpeech:"adjective",senseKey:"certain_sure",gloss:"certain; sure",definition:"tenu pour vrai ou assuré",englishDistractors:aE,frenchDistractors:["turquoise","octogonale","beurrée"]},
 {normalized:"certaines",lemmaKey:"certain",headword:"certain",partOfSpeech:"adjective",senseKey:"certain_sure",gloss:"certain; sure",definition:"tenu pour vrai ou assuré",englishDistractors:aE,frenchDistractors:["turquoises","octogonales","beurrées"]},
 {normalized:"certainement",lemmaKey:"certainement",headword:"certainement",partOfSpeech:"adverb",senseKey:"certainement_certainly",gloss:"certainly",definition:"d’une manière certaine",englishDistractors:["softly","outside","clockwise"],frenchDistractors:["doucement","dehors","dans le sens horaire"]},
 {normalized:"certes",lemmaKey:"certes",headword:"certes",partOfSpeech:"adverb",senseKey:"certes_certainly",gloss:"certainly; admittedly",definition:"marque une affirmation ou une concession forte",englishDistractors:["softly","outside","clockwise"],frenchDistractors:["doucement","dehors","dans le sens horaire"]},
 {normalized:"certitude",lemmaKey:"certitude",headword:"certitude",partOfSpeech:"noun",senseKey:"certitude_certainty",gloss:"certainty",definition:"conviction qu’un fait est vrai",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"chair",lemmaKey:"chair",headword:"chair",partOfSpeech:"noun",senseKey:"chair_flesh",gloss:"flesh",definition:"partie molle du corps humain",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"chambre",lemmaKey:"chambre",headword:"chambre",partOfSpeech:"noun",senseKey:"chambre_room",gloss:"room; chamber",definition:"pièce intérieure où des personnes se réunissent",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"chasse",lemmaKey:"chasse",headword:"chasse",partOfSpeech:"noun",senseKey:"chasse_persecution",gloss:"hunt; persecution",definition:"poursuite organisée contre un groupe",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"châtiment",lemmaKey:"chatiment",headword:"châtiment",partOfSpeech:"noun",senseKey:"chatiment_punishment",gloss:"punishment",definition:"peine infligée pour une faute",englishDistractors:nE,frenchDistractors:nF},
];
