import type { ZolaVocabularySpec } from "./zola-authoring.js";
const nE:[string,string,string]=["a mirror","a basket","a lemon"];
const nF:[string,string,string]=["miroir","panier","citron"];
const vE:[string,string,string]=["to stitch","to dive","to snore"];
const vF:[string,string,string]=["coudre","plonger","ronfler"];
const aE:[string,string,string]=["striped","wooden","peppery"];
export const zolaVocabularyBatch10: ZolaVocabularySpec[] = [
 {normalized:"clérical",lemmaKey:"clerical",headword:"clérical",partOfSpeech:"adjective",senseKey:"clerical_religious",gloss:"clerical; religious",definition:"relatif au clergé",englishDistractors:aE,frenchDistractors:["rayé","boisé","poivré"]},
 {normalized:"cléricale",lemmaKey:"clerical",headword:"clérical",partOfSpeech:"adjective",senseKey:"clerical_religious",gloss:"clerical; religious",definition:"relatif au clergé",englishDistractors:aE,frenchDistractors:["rayée","boisée","poivrée"]},
 {normalized:"clos",lemmaKey:"clos",headword:"clos",partOfSpeech:"adjective",senseKey:"clos_closed",gloss:"closed; private",definition:"fermé et inaccessible au public",englishDistractors:aE,frenchDistractors:["rayé","boisé","poivré"]},
 {normalized:"cœur",lemmaKey:"coeur",headword:"cœur",partOfSpeech:"noun",senseKey:"coeur_heart",gloss:"heart",definition:"organe ou siège figuré des sentiments",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"cœurs",lemmaKey:"coeur",headword:"cœur",partOfSpeech:"noun",senseKey:"coeur_heart",gloss:"heart",quizMeaning:"hearts",definition:"organe ou siège figuré des sentiments",englishDistractors:["mirrors","baskets","lemons"],frenchDistractors:["miroirs","paniers","citrons"]},
 {normalized:"colonel",lemmaKey:"colonel",headword:"colonel",partOfSpeech:"noun",senseKey:"colonel_officer",gloss:"colonel",definition:"officier supérieur de l’armée",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"colportent",lemmaKey:"colporter",headword:"colporter",partOfSpeech:"verb",senseKey:"colporter_spread",gloss:"to spread; circulate",quizMeaning:"spread; circulate",definition:"faire circuler des propos ou des informations",englishDistractors:["stitch","dive","snore"],frenchDistractors:["cousent","plongent","ronflent"]},
 {normalized:"combat",lemmaKey:"combat",headword:"combat",partOfSpeech:"noun",senseKey:"combat_struggle",gloss:"struggle; fight",definition:"lutte ou affrontement",englishDistractors:nE,frenchDistractors:nF},
 {normalized:"combien",lemmaKey:"combien",headword:"combien",partOfSpeech:"adverb",senseKey:"combien_how_much",gloss:"how much; how many",definition:"interroge sur une quantité ou un degré",englishDistractors:["quietly","upstairs","clockwise"],frenchDistractors:["calmement","à l’étage","dans le sens horaire"]},
 {normalized:"commence",lemmaKey:"commencer",headword:"commencer",partOfSpeech:"verb",senseKey:"commencer_begin",gloss:"to begin",quizMeaning:"begins",definition:"prendre son début",englishDistractors:["stitches","dives","snores"],frenchDistractors:["coud","plonge","ronfle"]},
 {normalized:"comment",lemmaKey:"comment",headword:"comment",partOfSpeech:"adverb",senseKey:"comment_how",gloss:"how",definition:"interroge sur la manière",englishDistractors:["when","where","why"],frenchDistractors:["quand","où","pourquoi"]},
 {normalized:"commérages",lemmaKey:"commérage",headword:"commérage",partOfSpeech:"noun",senseKey:"commerage_gossip",gloss:"gossip",definition:"propos répandus sans fondement sérieux",englishDistractors:["mirrors","baskets","lemons"],frenchDistractors:["miroirs","paniers","citrons"]},
 {normalized:"commettant",lemmaKey:"commettre",headword:"commettre",partOfSpeech:"verb",senseKey:"commettre_commit",gloss:"to commit",quizMeaning:"committing",definition:"accomplir une faute ou un acte",englishDistractors:["stitching","diving","snoring"],frenchDistractors:["cousant","plongeant","ronflant"]},
 {normalized:"commis",lemmaKey:"commettre",headword:"commettre",partOfSpeech:"verb",senseKey:"commettre_commit",gloss:"to commit",quizMeaning:"committed",definition:"accomplir une faute ou un acte",englishDistractors:["stitched","dived","snored"],frenchDistractors:["cousu","plongé","ronflé"]},
 {normalized:"commise",lemmaKey:"commettre",headword:"commettre",partOfSpeech:"verb",senseKey:"commettre_commit",gloss:"to commit",quizMeaning:"committed (feminine)",definition:"accomplir une faute ou un acte",englishDistractors:["stitched","dived","snored"],frenchDistractors:["cousue","plongée","ronflée"]},
];
