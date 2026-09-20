import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "lievre_hare", surfaceFormId: "srf_lievre", senseId: "sns_lievre_primary", target: "Lièvre", meaning: "hare",
    early: [
      ["Un lièvre traverse rapidement le champ.", ["tortoise", "fox", "crow"]],
      ["Le lièvre se cache derrière les hautes herbes.", ["rabbit hole", "hunter", "meadow"]],
      ["Ce matin, le lièvre a laissé des traces dans la neige.", ["deer", "dog", "horse"]],
    ],
    blank: ["Au bord du bois, un ___ dresse ses longues oreilles.", ["Lièvre", "renard", "corbeau", "cheval"]],
    comprehension: ["Le lièvre bondit puis disparaît dans les buissons.", "Quel animal disparaît dans les buissons ?", ["a hare", "a tortoise", "a fox", "a bird"], "a hare"],
    advanced: [
      ["Le lièvre court, tandis que la tortue avance lentement.", "Quel mot désigne l’animal rapide aux longues oreilles ?", ["lièvre", "tortue", "court", "lentement"]],
      ["Dans la clairière, le renard observe un Lièvre près du chêne.", "Quel mot nomme la proie aux longues oreilles ?", ["renard", "Lièvre", "clairière", "chêne"]],
      ["Le chien poursuit le lièvre, mais l’animal gagne le terrier.", "Quel mot désigne ici l’animal poursuivi ?", ["chien", "lièvre", "animal", "terrier"]],
    ],
  },
  {
    key: "tortue_animal", surfaceFormId: "srf_tortue", senseId: "sns_tortue_primary", target: "Tortue", meaning: "tortoise; turtle",
    early: [
      ["La tortue avance sous les feuilles.", ["hare", "frog", "snail"]],
      ["Cette tortue porte une carapace sombre.", ["feather", "horn", "wing"]],
      ["Une tortue se repose près de l’eau.", ["fish", "duck", "lizard"]],
    ],
    blank: ["La ___ rentre lentement la tête dans sa carapace.", ["Tortue", "biche", "poule", "souris"]],
    comprehension: ["La tortue demeure immobile sur une pierre chaude.", "Quel animal demeure sur la pierre ?", ["a tortoise", "a hare", "a dog", "a crow"], "a tortoise"],
    advanced: [
      ["La tortue avance entre les roseaux pendant que le canard nage.", "Quel mot désigne l’animal muni d’une carapace ?", ["tortue", "roseaux", "canard", "nage"]],
      ["Paul nourrit une Tortue et observe sa carapace.", "Quel mot nomme l’animal observé par Paul ?", ["Paul", "Tortue", "observe", "carapace"]],
      ["Une tortue lente suit le sentier près du jardin.", "Quel mot désigne l’animal lent ?", ["tortue", "lente", "sentier", "jardin"]],
    ],
  },
  {
    key: "temoignage_evidence", surfaceFormId: "srf_temoignage", senseId: "sns_temoignage_primary", target: "témoignage", meaning: "testimony; evidence",
    early: [
      ["Son témoignage confirme les faits.", ["silence", "question", "reward"]],
      ["Le juge écoute attentivement ce témoignage.", ["judgment", "argument", "sentence"]],
      ["Ce document constitue un témoignage précieux du passé.", ["prediction", "command", "secret"]],
    ],
    blank: ["Le témoin livre son ___ devant le tribunal.", ["témoignage", "voyage", "ouvrage", "paysage"]],
    comprehension: ["Grâce au témoignage de Luc, les enquêteurs comprennent enfin l’accident.", "Qu’est-ce qui aide les enquêteurs ?", ["Luc’s testimony", "a new map", "the damaged car", "a warning sign"], "Luc’s testimony"],
    advanced: [
      ["Le témoignage du voisin complète le rapport de police.", "Quel mot désigne la déclaration du voisin ?", ["témoignage", "voisin", "rapport", "police"]],
      ["Une lettre ancienne offre un témoignage, mais aucune preuve matérielle.", "Quel mot nomme ici un récit qui atteste le passé ?", ["lettre", "témoignage", "preuve", "matérielle"]],
      ["Après le récit et la question, le tribunal retient surtout le témoignage.", "Quel mot désigne ce que le témoin rapporte ?", ["récit", "question", "tribunal", "témoignage"]],
    ],
  },
  {
    key: "courir_run", surfaceFormId: "srf_courir", senseId: "sns_courir_primary", target: "courir", meaning: "to run",
    early: [
      ["Les enfants aiment courir dans le parc.", ["to sleep", "to read", "to swim"]],
      ["Il commence à courir dès le signal.", ["to wait", "to fall", "to hide"]],
      ["Pour attraper le bus, Léa doit courir.", ["to whisper", "to sit", "to write"]],
    ],
    blank: ["Le départ est donné : il faut ___ jusqu’au pont.", ["courir", "dormir", "lire", "chanter"]],
    comprehension: ["Marc veut courir cinq kilomètres avant le déjeuner.", "Que veut faire Marc ?", ["run five kilometers", "walk to the market", "cycle after lunch", "swim in the river"], "run five kilometers"],
    advanced: [
      ["Il préfère courir le matin et marcher le soir.", "Quel mot désigne le déplacement le plus rapide ?", ["courir", "matin", "marcher", "soir"]],
      ["Pour gagner la course, Nina doit courir sans ralentir.", "Quel infinitif indique l’action principale de Nina ?", ["gagner", "course", "courir", "ralentir"]],
      ["Le médecin conseille de courir doucement, puis de respirer calmement.", "Quel mot indique l’action de se déplacer en foulées rapides ?", ["médecin", "courir", "respirer", "calmement"]],
    ],
  },
  {
    key: "partir_leave", surfaceFormId: "srf_partir", senseId: "sns_partir_primary", target: "partir", meaning: "to leave; depart",
    early: [
      ["Nous devons partir avant la nuit.", ["to arrive", "to remain", "to return"]],
      ["Le train va partir dans quelques minutes.", ["to stop", "to break", "to wait"]],
      ["Elle hésite à partir sans ses amis.", ["to enter", "to speak", "to sleep"]],
    ],
    blank: ["La cloche sonne : les voyageurs vont ___ immédiatement.", ["partir", "rester", "entrer", "dormir"]],
    comprehension: ["Paul souhaite partir de Lyon demain matin.", "Que souhaite faire Paul ?", ["leave Lyon", "visit Lyon", "buy a house", "miss the train"], "leave Lyon"],
    advanced: [
      ["Il faut partir maintenant ou rester ici toute la nuit.", "Quel mot signifie quitter le lieu ?", ["partir", "maintenant", "rester", "nuit"]],
      ["Avant de partir, Jeanne ferme la porte et prend sa valise.", "Quel infinitif annonce le départ de Jeanne ?", ["partir", "ferme", "porte", "valise"]],
      ["Le bateau peut partir à midi, mais le capitaine préfère attendre.", "Quel mot exprime l’action de quitter le port ?", ["bateau", "partir", "capitaine", "attendre"]],
    ],
  },
];

export const lievreQuizBatch01 = specs.flatMap(authoredSet);
