import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"quand_when",surfaceFormId:"srf_quand",senseId:"sns_quand_primary",target:"quand",meaning:"when",
    early:[["Quand partira le prochain train ?",["where","why","how"]],["Je viendrai quand le travail sera terminé.",["because","although","unless"]],["Quand Paul arrive, Marie ouvre la porte.",["Before","Without","Toward"]]],
    blank:["___ avez-vous reçu cette lettre ?",["quand","où","qui","comment"]],
    comprehension:["Marie demande quand le bateau quittera le port.","Quelle information cherche Marie ?",["the departure time","the boat’s destination","the captain’s name","the ticket price"],"the departure time"],
    advanced:[["Quand la pluie cessera, nous reprendrons la route.","Quel mot introduit le moment du départ ?",["Quand","pluie","route","reprendrons"]],["Paul ignore quand le juge rendra sa décision.","Quel mot signifie à quel moment ?",["Paul","quand","juge","décision"]],["Dites-moi quand vous serez prêt à partir.","Quel adverbe interroge sur le temps ?",["Dites","quand","prêt","partir"]]] },
  { key:"vit_saw",surfaceFormId:"srf_vit_voir",senseId:"sns_voir_past",target:"vit",meaning:"saw (literary past historic of voir)",
    early:[["Paul vit une lumière derrière la fenêtre.",["lives","hears","finds"]],["Elle vit le bateau disparaître dans le brouillard.",["built","followed","called"]],["Le voyageur vit enfin les portes du village.",["opened","crossed","closed"]]],
    blank:["Marie ___ un homme courir vers la rivière.",["vit","voit","voyait","verrait"]],
    comprehension:["Luc vit la fumée et courut immédiatement prévenir les habitants.","Qu’est-ce que Luc aperçut ?",["smoke","a traveler","a boat","a storm"],"smoke"],
    advanced:[["Paul vit la lettre sur la table, mais il ne la lut pas.","Quel verbe au passé signifie aperçut ?",["Paul","vit","lettre","table"]],["Elle vit le soleil se lever derrière les montagnes.","Quel mot est le passé simple de voir ?",["Elle","vit","soleil","montagnes"]],["Le juge vit que le témoin hésitait avant de répondre.","Quel mot signifie constata par la vue ou l’esprit ?",["juge","vit","témoin","répondre"]]] },
  { key:"touchait_neared",surfaceFormId:"srf_touchait",senseId:"sns_toucher_primary",target:"touchait",meaning:"was reaching; was nearing; touched",
    early:[["Le bateau touchait presque le rivage.",["was leaving","was avoiding","was crossing"]],["Sa main touchait la vieille pierre.",["covered","carried","broke"]],["Le voyage touchait à sa fin.",["began","stopped suddenly","changed direction"]]],
    blank:["La branche ___ la fenêtre lorsque le vent soufflait.",["touchait","touche","touchaient","tombait"]],
    comprehension:["Le soleil touchait l’horizon lorsque les voyageurs aperçurent le village.","Où se trouvait le soleil ?",["at the horizon","high overhead","behind the travelers","under the clouds"],"at the horizon"],
    advanced:[["Paul touchait déjà la porte quand Marie l’appela.","Quel verbe indique un contact dans le passé ?",["Paul","touchait","porte","Marie"]],["La course touchait à sa fin, mais aucun coureur ne ralentissait.","Quel mot signifie approchait de ?",["course","touchait","fin","coureur"]],["L’eau touchait le bord du pont après plusieurs jours de pluie.","Quel verbe décrit le niveau qui atteignait le bord ?",["eau","touchait","pont","pluie"]]] },
  { key:"presque_almost",surfaceFormId:"srf_presque",senseId:"sns_presque_primary",target:"presque",meaning:"almost; nearly",
    early:[["Le travail est presque terminé.",["already","never","badly"]],["Paul a presque atteint le sommet.",["easily","again","perhaps"]],["Il est presque midi lorsque le train arrive.",["exactly","after","before"]]],
    blank:["La bouteille est ___ vide.",["presque","tout à fait","encore","jamais"]],
    comprehension:["Marie a presque fini sa lettre, mais il lui reste une phrase à écrire.","Quel est l’état de la lettre ?",["it is nearly finished","it has not been started","it is completely finished","it has been lost"],"it is nearly finished"],
    advanced:[["Le bateau est presque au port, mais le vent tombe soudain.","Quel mot signifie tout près de ?",["bateau","presque","port","vent"]],["Paul parle presque toujours doucement, sauf lorsqu’il est en colère.","Quel adverbe limite légèrement toujours ?",["Paul","presque","doucement","colère"]],["La rivière est presque sèche après un mois sans pluie.","Quel mot signifie pas tout à fait ?",["rivière","presque","sèche","pluie"]]] },
  { key:"au_to_the",surfaceFormId:"srf_au",senseId:"sns_au_primary",target:"au",meaning:"to the; at the (à + le)",
    early:[["Paul va au marché chaque matin.",["from the","with the","under the"]],["Le bateau reste au port pendant la tempête.",["behind the","across the","outside the"]],["Marie parle au médecin devant la maison.",["about the","without the","before the"]]],
    blank:["Nous attendons ___ bord de la rivière.",["au","aux","à la","du"]],
    comprehension:["Luc apporte la lettre au juge avant midi.","À qui Luc apporte-t-il la lettre ?",["to the judge","to the merchant","to Paul","to the mayor"],"to the judge"],
    advanced:[["Paul attend au village tandis que Marie traverse la forêt.","Quel mot est la contraction de à le ?",["Paul","au","Marie","forêt"]],["Le chien dort au pied du grand chêne.","Quel mot signifie at the devant pied ?",["chien","au","pied","chêne"]],["Nous parlerons au directeur après la réunion.","Quel mot introduit le destinataire masculin défini ?",["parlerons","au","directeur","réunion"]]] },
];

export const lievreQuizBatch24 = specs.flatMap(authoredSet);
