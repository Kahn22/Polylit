import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "d_elided_de", surfaceFormId: "srf_d_elided", senseId: "sns_de_primary", target: "d’", meaning: "of; from; some (elided de)",
    early: [
      ["La porte d’entrée reste ouverte.", ["toward", "with", "under"]],
      ["Paul revient d’Italie au printemps.", ["into", "beside", "through"]],
      ["Elle boit un verre d’eau fraîche.", ["without", "before", "against"]],
    ],
    blank: ["Nous avons besoin ___une lampe.", ["d’", "de", "à", "en"]],
    comprehension: ["Marie reçoit une lettre d’Anne chaque semaine.", "De qui vient la lettre ?", ["Anne", "Marie", "Paul", "the postman"], "Anne"],
    advanced: [
      ["Le toit d’ardoise protège la maison contre la pluie.", "Quel élément est la forme élidée de de ?", ["toit", "d’", "maison", "pluie"]],
      ["Paul sort d’ici avant la fermeture de la porte.", "Quel élément signifie de ce lieu ?", ["Paul", "d’", "fermeture", "porte"]],
      ["Elle demande un peu d’aide à son voisin.", "Quel élément introduit le nom aide ?", ["demande", "d’", "aide", "voisin"]],
    ],
  },
  {
    key: "ou_or", surfaceFormId: "srf_ou", senseId: "sns_ou_primary", target: "ou", meaning: "or",
    early: [
      ["Voulez-vous du thé ou du café ?", ["and", "but", "because"]],
      ["Nous partirons lundi ou mardi.", ["after", "until", "without"]],
      ["Choisissez la route courte ou la route sûre.", ["with", "behind", "among"]],
    ],
    blank: ["Préférez-vous marcher ___ attendre le train ?", ["ou", "où", "et", "mais"]],
    comprehension: ["Paul prendra le bateau ou restera au village.", "Quelles possibilités Paul considère-t-il ?", ["taking the boat or staying", "walking or running", "leaving today or tomorrow", "working or sleeping"], "taking the boat or staying"],
    advanced: [
      ["Marie choisit la robe rouge ou la robe bleue.", "Quel mot relie les deux choix ?", ["Marie", "rouge", "ou", "bleue"]],
      ["Est-ce une erreur ou une décision volontaire ?", "Quel mot présente une alternative ?", ["erreur", "ou", "décision", "volontaire"]],
      ["Vous pouvez écrire ou répondre directement à l’oral.", "Quel mot sépare les deux actions possibles ?", ["pouvez", "écrire", "ou", "répondre"]],
    ],
  },
  {
    key: "non_no", surfaceFormId: "srf_non", senseId: "sns_non_primary", target: "non", meaning: "no; not",
    early: [
      ["Non, je ne partirai pas ce soir.", ["yes", "perhaps", "certainly"]],
      ["Paul répond non à la proposition.", ["agrees", "asks why", "says nothing"]],
      ["La réponse est non, malgré leurs efforts.", ["welcome", "tomorrow", "again"]],
    ],
    blank: ["Acceptez-vous ce marché ? — ___, monsieur.", ["non", "oui", "merci", "peut-être"]],
    comprehension: ["Marie demande si Luc viendra, et Paul répond : « Non. »", "Luc viendra-t-il selon Paul ?", ["no", "yes", "perhaps", "Paul does not know"], "no"],
    advanced: [
      ["Non, cette clé n’ouvre pas le coffre ; essayez l’autre.", "Quel mot exprime directement le refus ou la négation ?", ["Non", "clé", "coffre", "autre"]],
      ["Le juge demande une réponse claire, oui ou non.", "Quel mot représente la réponse négative ?", ["juge", "claire", "oui", "non"]],
      ["Paul dit non au voyage, tandis que Marie prépare déjà sa valise.", "Quel mot indique que Paul refuse ?", ["Paul", "non", "Marie", "valise"]],
    ],
  },
  {
    key: "je_i", surfaceFormId: "srf_je", senseId: "sns_je_primary", target: "je", meaning: "I",
    early: [
      ["Je ferme la fenêtre avant de sortir.", ["you", "he", "we"]],
      ["Je connais bien ce chemin.", ["she", "they", "one"]],
      ["Demain, je prendrai le premier train.", ["you all", "it", "they"]],
    ],
    blank: ["___ garde cette lettre dans mon bureau.", ["je", "tu", "il", "nous"]],
    comprehension: ["Je prépare le repas pendant que Paul met la table.", "Qui prépare le repas ?", ["the speaker", "Paul", "both people", "nobody"], "the speaker"],
    advanced: [
      ["Je lis le rapport, tandis que vous examinez les cartes.", "Quel pronom désigne le locuteur ?", ["Je", "rapport", "vous", "cartes"]],
      ["Paul veut partir, mais je préfère attendre Marie.", "Quel mot signifie I ?", ["Paul", "partir", "je", "Marie"]],
      ["Si je trouve la clé, nous pourrons ouvrir la porte.", "Quel pronom est le sujet de trouve ?", ["je", "clé", "nous", "porte"]],
    ],
  },
  {
    key: "encore_still_again", surfaceFormId: "srf_encore", senseId: "sns_encore_primary", target: "encore", meaning: "still; again; more",
    early: [
      ["Paul attend encore devant la gare.", ["never", "elsewhere", "quietly"]],
      ["Elle relit encore la même lettre.", ["once only", "tomorrow", "secretly"]],
      ["Nous avons encore deux heures avant le départ.", ["almost", "already", "outside"]],
    ],
    blank: ["La porte est ___ ouverte malgré le vent.", ["encore", "déjà", "jamais", "ailleurs"]],
    comprehension: ["Marie demande encore une tasse de thé avant de partir.", "Que demande Marie ?", ["another cup of tea", "the bill", "a glass of water", "more time"], "another cup of tea"],
    advanced: [
      ["Le train n’est pas encore arrivé, mais les voyageurs attendent sur le quai.", "Quel mot signifie jusqu’à maintenant dans cette négation ?", ["train", "encore", "voyageurs", "quai"]],
      ["Lisez encore ce passage afin de bien comprendre la conclusion.", "Quel mot demande de répéter la lecture ?", ["Lisez", "encore", "passage", "conclusion"]],
      ["Il reste encore du pain, tandis que tout le fromage a disparu.", "Quel mot indique qu’une quantité demeure ?", ["reste", "encore", "pain", "fromage"]],
    ],
  },
];

export const lievreQuizBatch12 = specs.flatMap(authoredSet);
