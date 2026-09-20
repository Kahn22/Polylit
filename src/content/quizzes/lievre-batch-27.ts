import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"premiere_first",surfaceFormId:"srf_premiere",senseId:"sns_premier_primary",target:"première",meaning:"first (feminine)",
    early:[["Marie arrive la première au village.",["second","last","alone"]],["La première porte reste fermée.",["next","same","large"]],["Elle lit la première page du livre.",["final","blank","torn"]]],
    blank:["Paul choisit la ___ route à gauche.",["première","premier","dernière","seconde"]],
    comprehension:["Marie termine la course la première, devant toutes les autres participantes.","Quelle place Marie obtient-elle ?",["first place","second place","last place","no ranking"],"first place"],
    advanced:[["La première voiture part à midi, mais la seconde attend encore.","Quel mot indique le rang numéro un ?",["première","voiture","seconde","midi"]],["Marie est la première personne à répondre correctement.","Quel adjectif ordinal féminin précède personne ?",["Marie","première","personne","répondre"]],["Cette première victoire donne confiance à toute l’équipe.","Quel mot signifie first au féminin ?",["première","victoire","confiance","équipe"]]] },
  { key:"eh_interjection",surfaceFormId:"srf_eh",senseId:"sns_eh_primary",target:"eh",meaning:"hey; well (interjection)",
    early:[["Eh ! Attendez-moi devant la porte !",["goodbye","thanks","perhaps"]],["Eh bien, Paul, quelle décision prenez-vous ?",["because","before","without"]],["Eh quoi ! Vous partez déjà ?",["where","when","whose"]]],
    blank:["___ ! Regardez ce bateau magnifique !",["eh","et","hé","ohé"]],
    comprehension:["« Eh ! Le pont est fermé ! » crie le garde aux voyageurs.","Pourquoi le garde les interpelle-t-il ?",["the bridge is closed","the boat is leaving","the road is safe","the village is nearby"],"the bridge is closed"],
    advanced:[["Eh ! Paul ! Vous avez oublié votre lettre sur la table.","Quelle interjection attire l’attention de Paul ?",["Eh","Paul","lettre","table"]],["Eh bien, nous partirons sans attendre le prochain train.","Quel mot ouvre ici la réaction du locuteur ?",["Eh","partirons","train","attendre"]],["Eh quoi ! Le juge refuse encore d’entendre le témoin ?", "Quel mot exprime la surprise au début de la phrase ?",["Eh","juge","refuse","témoin"]]] },
  { key:"bien_discourse",surfaceFormId:"srf_bien",senseId:"sns_bien_discourse",target:"bien",meaning:"well; then (discourse marker in eh bien)",
    early:[["Eh bien, commençons sans attendre.",["correctly","comfortably","much"]],["Eh bien, quelle réponse proposez-vous ?",["carefully","successfully","kindly"]],["Eh bien, je resterai au village.",["very","good","properly"]]],
    blank:["Eh ___, Paul, dites-nous la vérité.",["bien","bon","mieux","beau"]],
    comprehension:["« Eh bien, nous prendrons l’autre route », décide Marie.","Que décide Marie ?",["they will take the other road","they will wait at the village","they will return home","they will cross the river"],"they will take the other road"],
    advanced:[["Eh bien, le juge rendra sa décision demain matin.","Quel mot complète la locution qui introduit la conclusion ?",["bien","juge","décision","demain"]],["Eh bien, vous aviez raison et je reconnais mon erreur.","Quel mot sert ici de marqueur de réaction ?",["bien","raison","erreur","reconnais"]],["Eh bien, partons avant que la pluie ne recommence.","Quel mot n’exprime pas la manière, mais ouvre la proposition ?",["bien","partons","pluie","recommence"]]] },
  { key:"cria_shouted",surfaceFormId:"srf_cria",senseId:"sns_crier_primary",target:"cria",meaning:"shouted; cried out (literary past)",
    early:[["Paul cria le nom de son frère.",["whispered","wrote","forgot"]],["Le garde cria pour avertir les voyageurs.",["slept","waited","laughed"]],["Marie cria lorsqu’elle vit la fumée.",["smiled","left","listened"]]],
    blank:["Le témoin ___ qu’il était innocent.",["cria","crie","criait","criera"]],
    comprehension:["Luc cria « Au feu ! » en voyant les flammes près de la maison.","Quel avertissement Luc lança-t-il ?",["Fire!","Help me!","The train is leaving!","The door is closed!"],"Fire!"],
    advanced:[["Paul cria très fort, mais personne ne répondit.","Quel verbe au passé signifie parla d’une voix forte ?",["Paul","cria","personne","répondit"]],["Elle cria le nom du médecin depuis la fenêtre.","Quel mot est le passé simple de crier ?",["Elle","cria","médecin","fenêtre"]],["Le capitaine cria un ordre et les marins levèrent la voile.","Quel mot décrit l’ordre lancé à haute voix ?",["capitaine","cria","marins","voile"]]] },
  { key:"avais_had",surfaceFormId:"srf_avais",senseId:"sns_avoir_primary",target:"avais",meaning:"had; used to have",
    early:[["J’avais une vieille montre dans ma poche.",["will have","find","want"]],["Tu avais raison depuis le début.",["were","said","knew"]],["J’avais encore du temps avant le départ.",["lost","needed","measured"]]],
    blank:["Avant le voyage, j’___ un petit sac rouge.",["avais","avait","avons","aurai"]],
    comprehension:["J’avais deux clés, mais aucune n’ouvrait cette porte.","Combien de clés le locuteur possédait-il ?",["two","one","three","none"],"two"],
    advanced:[["J’avais confiance en Paul, mais son mensonge changea mon opinion.","Quel mot est l’imparfait de avoir à la première personne ?",["avais","Paul","mensonge","opinion"]],["Tu avais une carte tandis que je cherchais encore le chemin.","Quel verbe signifie tu possédais ?",["avais","carte","cherchais","chemin"]],["Quand j’étais enfant, j’avais peur des orages violents.","Quel mot place la possession ou l’état dans le passé ?",["enfant","avais","orages","violents"]]] },
];

export const lievreQuizBatch27 = specs.flatMap(authoredSet);
