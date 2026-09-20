import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "gageons_wager", surfaceFormId: "srf_gageons", senseId: "sns_gager_primary", target: "Gageons", meaning: "let us wager; let us bet",
    early: [
      ["Gageons que Paul arrivera le premier.", ["let us leave", "let us wait", "let us agree"]],
      ["« Gageons une pièce sur le résultat », propose Luc.", ["let us borrow", "let us count", "let us hide"]],
      ["Gageons que la pluie cessera avant midi.", ["let us hope", "let us announce", "let us prove"]],
    ],
    blank: ["___ que notre équipe gagnera ce soir.", ["Gageons", "Partons", "Pensons", "Disons"]],
    comprehension: ["« Gageons que ce cheval remportera la course », dit Anne.", "Que propose Anne ?", ["to make a wager", "to cancel the race", "to buy the horse", "to leave immediately"], "to make a wager"],
    advanced: [
      ["Gageons dix euros, puis regardons la partie ensemble.", "Quel mot propose de faire un pari ?", ["Gageons", "euros", "regardons", "partie"]],
      ["Pierre dit : « Gageons sur le vainqueur », mais Marie refuse le pari.", "Quel mot invite à miser ?", ["Pierre", "Gageons", "vainqueur", "pari"]],
      ["Gageons que le bateau atteindra le port avant le train.", "Quel mot exprime la proposition d’un pari ?", ["Gageons", "bateau", "port", "train"]],
    ],
  },
  {
    key: "atteindrez_reach", surfaceFormId: "srf_atteindrez", senseId: "sns_atteindre_primary", target: "atteindrez", meaning: "will reach; will catch",
    early: [
      ["Vous atteindrez le sommet avant midi.", ["will leave", "will avoid", "will forget"]],
      ["Avec ce train, vous atteindrez Paris ce soir.", ["will cross", "will lose", "will describe"]],
      ["Si vous accélérez, vous atteindrez bientôt le coureur.", ["will follow", "will greet", "will hear"]],
    ],
    blank: ["En marchant régulièrement, vous ___ le refuge avant la nuit.", ["atteindrez", "attendrez", "quitterez", "verrez"]],
    comprehension: ["Vous atteindrez la rivière après deux heures de marche.", "Que se passera-t-il après deux heures ?", ["you will reach the river", "you will leave the forest", "you will cross a bridge", "you will return home"], "you will reach the river"],
    advanced: [
      ["Vous atteindrez la gare, puis le train partira.", "Quel mot indique l’arrivée future à la gare ?", ["atteindrez", "gare", "train", "partira"]],
      ["Demain, vous atteindrez votre objectif malgré la difficulté.", "Quel verbe signifie parvenir jusqu’à l’objectif ?", ["Demain", "atteindrez", "objectif", "difficulté"]],
      ["Vous atteindrez le village avant vos amis et attendrez sur la place.", "Quel mot exprime le fait de parvenir au village ?", ["atteindrez", "village", "amis", "place"]],
    ],
  },
  {
    key: "sitot_soon", surfaceFormId: "srf_sitot", senseId: "sns_sitot_primary", target: "sitôt", meaning: "so soon; as soon",
    early: [
      ["Je ne pensais pas vous revoir sitôt.", ["so late", "outside", "silently"]],
      ["Sitôt arrivé, il téléphone à sa famille.", ["before leaving", "after lunch", "very slowly"]],
      ["Pourquoi partir sitôt après le dîner ?", ["tomorrow", "together", "far away"]],
    ],
    blank: ["Elle vient d’entrer ; pourquoi ressort-elle ___ ?", ["sitôt", "jamais", "partout", "autrement"]],
    comprehension: ["Luc est revenu sitôt que la porte s’est ouverte.", "Quand Luc est-il revenu ?", ["as soon as the door opened", "before the door opened", "the following morning", "long after everyone left"], "as soon as the door opened"],
    advanced: [
      ["Il arrive sitôt, tandis que son frère viendra beaucoup plus tard.", "Quel mot indique une arrivée très prochaine ?", ["arrive", "sitôt", "frère", "tard"]],
      ["Sitôt le signal donné, les coureurs partent et le public applaudit.", "Quel mot signifie dès que ou aussitôt ?", ["Sitôt", "signal", "coureurs", "public"]],
      ["Elle répond sitôt la question posée, sans prendre le temps de réfléchir.", "Quel mot souligne la rapidité de sa réponse ?", ["répond", "sitôt", "question", "réfléchir"]],
    ],
  },
  {
    key: "moi_stressed", surfaceFormId: "srf_moi", senseId: "sns_moi_primary", target: "Moi", meaning: "me; I (stressed pronoun)",
    early: [
      ["Moi, je préfère rester ici.", ["you", "him", "them"]],
      ["Elle partira avec moi demain.", ["you", "her", "us"]],
      ["Ce cadeau est pour moi.", ["him", "you", "them"]],
    ],
    blank: ["Paul choisit le thé ; ___, je prends du café.", ["Moi", "Toi", "Lui", "Eux"]],
    comprehension: ["Julie demande : « Veux-tu venir avec moi ? »", "Avec qui Julie propose-t-elle de venir ?", ["with Julie herself", "with Paul", "with her parents", "with the teacher"], "with Julie herself"],
    advanced: [
      ["Toi, tu cuisines ; moi, je prépare la table.", "Quel mot désigne la personne qui parle ?", ["Toi", "cuisines", "moi", "table"]],
      ["Le guide marche devant moi et les autres restent derrière.", "Quel pronom représente le locuteur ?", ["guide", "devant", "moi", "autres"]],
      ["Entre Paul, Léa et moi, personne ne connaît la réponse.", "Quel mot inclut le locuteur dans le groupe ?", ["Paul", "Léa", "moi", "réponse"]],
    ],
  },
  {
    key: "but_goal", surfaceFormId: "srf_but", senseId: "sns_but_primary", target: "but", meaning: "goal; objective",
    early: [
      ["Notre but est de terminer avant midi.", ["delay", "fear", "method"]],
      ["Elle avance avec un but précis.", ["mistake", "memory", "question"]],
      ["Le but de cet exercice est de mieux comprendre le texte.", ["author", "difficulty", "answer"]],
    ],
    blank: ["Son ___ principal est d’apprendre le français.", ["but", "bout", "bruit", "doute"]],
    comprehension: ["Le but de Marie est de courir dix kilomètres.", "Quel est l’objectif de Marie ?", ["to run ten kilometers", "to buy new shoes", "to watch a race", "to rest all morning"], "to run ten kilometers"],
    advanced: [
      ["Le but paraît difficile, mais notre équipe poursuit cet objectif.", "Quel mot signifie objectif ?", ["but", "difficile", "équipe", "objectif"]],
      ["Paul explique le but du voyage avant de montrer la route.", "Quel mot désigne la finalité du voyage ?", ["Paul", "but", "voyage", "route"]],
      ["Sans but clair, ce projet avance lentement et perd son énergie.", "Quel mot désigne ici l’objectif recherché ?", ["but", "projet", "lentement", "énergie"]],
    ],
  },
];

export const lievreQuizBatch02 = specs.flatMap(authoredSet);
