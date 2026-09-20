import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "avait_had", surfaceFormId: "srf_avait", senseId: "sns_avoir_primary", target: "avait", meaning: "had",
    early: [
      ["Paul avait une vieille montre.", ["will have", "finds", "wants"]],
      ["Elle avait encore du temps avant le départ.", ["lost", "needed", "measured"]],
      ["Le village avait deux fontaines autrefois.", ["will build", "removed", "described"]],
    ],
    blank: ["Avant le voyage, Marie ___ un petit sac rouge.", ["avait", "avaient", "aura", "avoir"]],
    comprehension: ["Luc avait une clé, mais il ne savait pas quelle porte elle ouvrait.", "Que possédait Luc ?", ["a key", "a map", "a letter", "a lock"], "a key"],
    advanced: [
      ["Le marchand avait trois chevaux et son voisin possédait deux ânes.", "Quel mot est la forme imparfaite singulière de avoir ?", ["marchand", "avait", "chevaux", "voisin"]],
      ["Elle avait peur, pourtant son frère avançait calmement.", "Quel mot place la possession ou l’état dans le passé ?", ["avait", "peur", "frère", "calmement"]],
      ["Autrefois, cette maison avait un jardin, une cour et un puits.", "Quel mot signifie possédait dans cette phrase ?", ["maison", "avait", "jardin", "puits"]],
    ],
  },
  {
    key: "faire_do", surfaceFormId: "srf_faire", senseId: "sns_faire_primary", target: "faire", meaning: "to do; to make",
    early: [
      ["Que voulez-vous faire demain ?", ["to see", "to leave", "to know"]],
      ["Elle apprend à faire du pain.", ["to buy", "to cut", "to carry"]],
      ["Il reste beaucoup de travail à faire.", ["to forget", "to hide", "to refuse"]],
    ],
    blank: ["Nous devons ___ un choix avant midi.", ["faire", "fait", "font", "faisons"]],
    comprehension: ["Marie veut faire une table avec ce vieux bois.", "Quel est le projet de Marie ?", ["to make a table", "to sell the wood", "to repair a chair", "to paint the floor"], "to make a table"],
    advanced: [
      ["Pour faire le repas, Paul coupe les légumes et chauffe la soupe.", "Quel infinitif signifie préparer ou réaliser ?", ["faire", "repas", "légumes", "soupe"]],
      ["Il faut faire le travail, puis vérifier chaque réponse.", "Quel mot désigne l’action d’accomplir le travail ?", ["faire", "travail", "vérifier", "réponse"]],
      ["Que peut faire Luc avec une corde, un couteau et cette branche ?", "Quel mot demande quelle action Luc peut accomplir ?", ["faire", "Luc", "corde", "branche"]],
    ],
  },
  {
    key: "j_elided_i", surfaceFormId: "srf_j_elided", senseId: "sns_je_primary", target: "j’", meaning: "I (elided before a vowel)",
    early: [
      ["J’attends le train depuis une heure.", ["you", "he", "we"]],
      ["J’écoute attentivement cette histoire.", ["she", "they", "one"]],
      ["J’ignore encore la réponse.", ["you", "it", "they"]],
    ],
    blank: ["___aime marcher près de la rivière.", ["j’", "je", "tu", "il"]],
    comprehension: ["J’emporte ma veste parce que le soir sera froid.", "Qui emporte une veste ?", ["the speaker", "the listener", "Paul", "the neighbors"], "the speaker"],
    advanced: [
      ["J’écris une lettre, tandis que tu lis le journal.", "Quel élément représente le locuteur devant une voyelle ?", ["j’", "lettre", "tu", "journal"]],
      ["Paul parle, mais j’attends encore la réponse de Marie.", "Quel pronom élidé désigne la personne qui parle ?", ["Paul", "j’", "réponse", "Marie"]],
      ["J’ouvre la porte et le chien traverse aussitôt la cour.", "Quel élément est la forme élidée de je ?", ["j’", "porte", "chien", "cour"]],
    ],
  },
  {
    key: "entends_mean", surfaceFormId: "srf_entends", senseId: "sns_entendre_mean", target: "entends", meaning: "mean; intend",
    early: [
      ["J’entends par là une règle générale.", ["hear", "repeat", "deny"]],
      ["Quand je dis bientôt, j’entends avant midi.", ["listen to", "forget", "announce"]],
      ["Par ce projet, j’entends la nouvelle école, et non l’ancienne.", ["hear a sound", "leave", "write"]],
    ],
    blank: ["Par ce mot, j’___ une idée très précise.", ["entends", "entend", "attends", "écoute"]],
    comprehension: ["Quand Luc dit « le groupe », il entend tous les élèves, mais j’entends seulement les nouveaux.", "Qui le locuteur inclut-il ?", ["only the new students", "all the students", "only the teachers", "the entire village"], "only the new students"],
    advanced: [
      ["J’entends par liberté le droit de choisir, tandis que Paul parle d’indépendance.", "Quel mot signifie je veux dire ?", ["entends", "liberté", "choisir", "Paul"]],
      ["Par demain, j’entends le matin et non le soir.", "Quel mot précise le sens voulu par le locuteur ?", ["demain", "entends", "matin", "soir"]],
      ["J’entends ceux du premier groupe, mais Marie désigne tous les participants.", "Quel mot indique ce que le locuteur veut dire ?", ["entends", "groupe", "Marie", "participants"]],
    ],
  },
  {
    key: "ceux_those", surfaceFormId: "srf_ceux", senseId: "sns_celui_primary", target: "ceux", meaning: "those; the ones",
    early: [
      ["Ceux qui arrivent tôt trouveront une place.", ["this one", "that woman", "everyone"]],
      ["Je préfère ceux de la première boîte.", ["this", "hers", "none"]],
      ["Parmi les livres, ceux de Paul sont anciens.", ["that one", "each book", "somewhere"]],
    ],
    blank: ["Gardez les dossiers rouges et classez ___ qui sont bleus.", ["ceux", "celui", "celles", "ce"]],
    comprehension: ["Ceux qui ont terminé peuvent quitter la salle.", "Qui peut partir ?", ["the ones who have finished", "everyone in the building", "only the teacher", "the people who just arrived"], "the ones who have finished"],
    advanced: [
      ["Ceux du village marchent, tandis que les visiteurs prennent le train.", "Quel mot désigne plusieurs personnes déjà identifiées ?", ["Ceux", "village", "visiteurs", "train"]],
      ["Je prends les petits gâteaux et laisse ceux au chocolat à Marie.", "Quel pronom remplace les gâteaux au chocolat ?", ["petits", "gâteaux", "ceux", "Marie"]],
      ["Entre ceux qui parlent et les autres qui écoutent, Paul choisit les premiers.", "Quel mot signifie les personnes qui ?", ["ceux", "autres", "Paul", "premiers"]],
    ],
  },
];

export const lievreQuizBatch08 = specs.flatMap(authoredSet);
