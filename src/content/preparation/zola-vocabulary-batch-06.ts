import type { ZolaVocabularySpec } from "./zola-authoring.js";

const nEn:[string,string,string]=["a helmet","a napkin","a pear"];
const nFr:[string,string,string]=["casque","serviette","poire"];
const vEn:[string,string,string]=["to embroider","to ski","to hiccup"];
const vFr:[string,string,string]=["broder","skier","hoqueter"];

export const zolaVocabularyBatch06: ZolaVocabularySpec[] = [
  { normalized:"avaient",lemmaKey:"avoir",headword:"avoir",partOfSpeech:"verb",senseKey:"avoir_possess_auxiliary",gloss:"to have; auxiliary avoir",quizMeaning:"had",definition:"posséder ou servir d’auxiliaire",englishDistractors:["embroidered","skied","hiccupped"],frenchDistractors:["brodaient","skiaient","hoquetaient"] },
  { normalized:"avez",lemmaKey:"avoir",headword:"avoir",partOfSpeech:"verb",senseKey:"avoir_possess_auxiliary",gloss:"to have; auxiliary avoir",quizMeaning:"you have",definition:"posséder ou servir d’auxiliaire",englishDistractors:["you embroider","you ski","you hiccup"],frenchDistractors:["vous brodez","vous skiez","vous hoquetez"] },
  { normalized:"avoir",lemmaKey:"avoir",headword:"avoir",partOfSpeech:"verb",senseKey:"avoir_possess_auxiliary",gloss:"to have; auxiliary avoir",definition:"posséder ou servir d’auxiliaire",englishDistractors:vEn,frenchDistractors:vFr },
  { normalized:"avons",lemmaKey:"avoir",headword:"avoir",partOfSpeech:"verb",senseKey:"avoir_possess_auxiliary",gloss:"to have; auxiliary avoir",quizMeaning:"we have",definition:"posséder ou servir d’auxiliaire",englishDistractors:["we embroider","we ski","we hiccup"],frenchDistractors:["nous brodons","nous skions","nous hoquetons"] },
  { normalized:"avouer",lemmaKey:"avouer",headword:"avouer",partOfSpeech:"verb",senseKey:"avouer_admit",gloss:"to admit; confess",definition:"reconnaître ouvertement ce qu’on voulait cacher",englishDistractors:vEn,frenchDistractors:vFr },
  { normalized:"avertissant",lemmaKey:"avertir",headword:"avertir",partOfSpeech:"verb",senseKey:"avertir_warn",gloss:"warning",definition:"informant d’un danger ou d’un fait à venir",englishDistractors:["embroidering","skiing","hiccupping"],frenchDistractors:["brodant","skiant","hoquetant"] },
  { normalized:"aveux",lemmaKey:"aveu",headword:"aveu",partOfSpeech:"noun",senseKey:"aveu_confession",gloss:"confessions; admissions",definition:"reconnaissances d’un fait compromettant",englishDistractors:["helmets","napkins","pears"],frenchDistractors:["casques","serviettes","poires"] },
  { normalized:"bafouera",lemmaKey:"bafouer",headword:"bafouer",partOfSpeech:"verb",senseKey:"bafouer_humiliate",gloss:"will humiliate; mock",definition:"traitera avec un mépris humiliant",englishDistractors:["will embroider","will ski","will hiccup"],frenchDistractors:["brodera","skiera","hoquetera"] },
  { normalized:"baiser",lemmaKey:"baiser",headword:"baiser",partOfSpeech:"verb",senseKey:"baiser_kiss",gloss:"to kiss",definition:"poser les lèvres sur quelque chose en signe de respect",englishDistractors:vEn,frenchDistractors:vFr },
  { normalized:"balai",lemmaKey:"balai",headword:"balai",partOfSpeech:"noun",senseKey:"balai_broom",gloss:"broom",definition:"instrument servant à balayer",englishDistractors:nEn,frenchDistractors:["casque","torchon","verger"] },
  { normalized:"bas",lemmaKey:"bas_adverb",headword:"bas",partOfSpeech:"adverb",senseKey:"a_bas_down",gloss:"down; to the ground",definition:"vers le bas, dans la locution jeter à bas",englishDistractors:["quietly","outside","clockwise"],frenchDistractors:["doucement","dehors","dans le sens horaire"] },
  { normalized:"basé",lemmaKey:"baser",headword:"baser",partOfSpeech:"verb",senseKey:"baser_base",gloss:"based",definition:"fondé sur un élément servant de base",englishDistractors:["embroidered","skied","hiccupped"],frenchDistractors:["brodé","skié","hoqueté"] },
  { normalized:"basse",lemmaKey:"bas",headword:"bas",partOfSpeech:"adjective",senseKey:"bas_low_vile",gloss:"low; base",definition:"placé bas ou moralement méprisable",englishDistractors:["purple","hexagonal","vanilla-flavored"],frenchDistractors:["violette","hexagonale","vanillée"] },
  { normalized:"basses",lemmaKey:"bas",headword:"bas",partOfSpeech:"adjective",senseKey:"bas_low_vile",gloss:"low; base",definition:"placé bas ou moralement méprisable",englishDistractors:["purple","hexagonal","vanilla-flavored"],frenchDistractors:["violettes","hexagonales","vanillées"] },
  { normalized:"beaucoup",lemmaKey:"beaucoup",headword:"beaucoup",partOfSpeech:"adverb",senseKey:"beaucoup_much_many",gloss:"much; many; a lot",definition:"en grande quantité",englishDistractors:["quietly","outside","clockwise"],frenchDistractors:["doucement","dehors","dans le sens horaire"] },
];
