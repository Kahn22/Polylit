import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "enjeux_stakes", surfaceFormId: "srf_enjeux", senseId: "sns_enjeu_primary", target: "enjeux", meaning: "stakes; things at risk",
    early: [
      ["Les enjeux de cette décision sont considérables.", ["instructions", "witnesses", "routes"]],
      ["Avant le pari, chacun dépose ses enjeux sur la table.", ["letters", "tools", "meals"]],
      ["Elle comprend enfin les enjeux du débat.", ["dates", "speakers", "mistakes"]],
    ],
    blank: ["Les ___ de la négociation dépassent la simple question d’argent.", ["enjeux", "enquêtes", "ennuis", "engins"]],
    comprehension: ["Les enjeux sont élevés : l’entreprise risque de perdre son unique contrat.", "Pourquoi la situation est-elle importante ?", ["the company’s only contract is at risk", "the company has hired new workers", "the meeting has been postponed", "the contract is already signed"], "the company’s only contract is at risk"],
    advanced: [
      ["Les enjeux du vote concernent l’école, le budget et le village.", "Quel mot désigne ce qui peut être gagné, perdu ou décidé ?", ["enjeux", "vote", "budget", "village"]],
      ["Paul explique les enjeux, puis Marie évalue les risques du projet.", "Quel mot nomme les intérêts importants liés au projet ?", ["Paul", "enjeux", "risques", "projet"]],
      ["Dans ce pari, les enjeux comprennent une pièce, un livre et une promesse.", "Quel mot désigne les choses mises en jeu ?", ["pari", "enjeux", "livre", "promesse"]],
    ],
  },
  {
    key: "savoir_know", surfaceFormId: "srf_savoir", senseId: "sns_savoir_primary", target: "savoir", meaning: "to know",
    early: [
      ["Je voudrais savoir la vérité.", ["to hide", "to repeat", "to change"]],
      ["Il faut savoir lire cette ancienne écriture.", ["to begin", "to refuse", "to forget"]],
      ["Elle espère savoir bientôt le résultat.", ["to announce", "to invent", "to erase"]],
    ],
    blank: ["Pour répondre, vous devez ___ où se trouve la clé.", ["savoir", "voir", "croire", "dire"]],
    comprehension: ["Luc veut savoir pourquoi le train est en retard.", "Que cherche Luc ?", ["the reason for the delay", "the price of a ticket", "the name of the driver", "the length of the journey"], "the reason for the delay"],
    advanced: [
      ["Pour savoir la réponse, Marie consulte le livre et interroge Paul.", "Quel infinitif signifie connaître ?", ["savoir", "réponse", "livre", "Paul"]],
      ["Il pense savoir le chemin, mais le guide vérifie encore la carte.", "Quel mot exprime la possession d’une connaissance ?", ["pense", "savoir", "guide", "carte"]],
      ["Nous voulons savoir la date avant de préparer le voyage.", "Quel mot indique que nous cherchons une information ?", ["voulons", "savoir", "date", "voyage"]],
    ],
  },
  {
    key: "quoi_what", surfaceFormId: "srf_quoi", senseId: "sns_quoi_primary", target: "quoi", meaning: "what",
    early: [
      ["De quoi parlez-vous ?", ["where", "when", "who"]],
      ["Je ne sais pas quoi choisir.", ["how", "why", "which person"]],
      ["À quoi sert cet outil ?", ["how many", "whose", "from where"]],
    ],
    blank: ["Vous cherchez ___ exactement ?", ["quoi", "qui", "où", "quand"]],
    comprehension: ["Paul demande : « Avec quoi dois-je ouvrir cette boîte ? »", "Quelle information Paul cherche-t-il ?", ["what object to use", "who owns the box", "where the box came from", "when the box arrived"], "what object to use"],
    advanced: [
      ["Tu veux quoi : le livre, la carte ou la lettre ?", "Quel mot demande de préciser la chose désirée ?", ["veux", "quoi", "livre", "lettre"]],
      ["De quoi avez-vous peur, du bruit ou de l’orage ?", "Quel pronom interrogatif porte sur la cause de la peur ?", ["quoi", "peur", "bruit", "orage"]],
      ["Elle ignore quoi répondre et demande conseil à son frère.", "Quel mot représente la chose encore inconnue ?", ["ignore", "quoi", "conseil", "frère"]],
    ],
  },
  {
    key: "est_is", surfaceFormId: "srf_est", senseId: "sns_etre_primary", target: "est", meaning: "is",
    early: [
      ["La porte est ouverte.", ["was", "will be", "becomes"]],
      ["Ce livre est très ancien.", ["has", "makes", "seems"]],
      ["Paul est devant la maison.", ["goes", "stays", "arrives"]],
    ],
    blank: ["La réponse ___ correcte.", ["est", "sont", "être", "sera"]],
    comprehension: ["Le chemin est dangereux après la pluie.", "Comment est le chemin ?", ["it is dangerous", "it is closed", "it is short", "it is dry"], "it is dangerous"],
    advanced: [
      ["La tasse est vide, mais la bouteille reste pleine.", "Quel mot est la forme de être au présent singulier ?", ["tasse", "est", "bouteille", "pleine"]],
      ["Cette maison est grande et son jardin paraît immense.", "Quel mot relie maison à sa description ?", ["maison", "est", "jardin", "paraît"]],
      ["Le témoin est ici, tandis que le juge attend dehors.", "Quel mot indique l’état ou la présence du témoin ?", ["témoin", "est", "juge", "dehors"]],
    ],
  },
  {
    key: "affaire_matter", surfaceFormId: "srf_affaire", senseId: "sns_affaire_primary", target: "affaire", meaning: "matter; business; concern",
    early: [
      ["Cette affaire reste difficile à comprendre.", ["journey", "answer", "building"]],
      ["Le juge examine une affaire ancienne.", ["letter", "road", "meal"]],
      ["Ce choix est mon affaire, pas la vôtre.", ["mistake", "reward", "schedule"]],
    ],
    blank: ["La police enquête sur une ___ mystérieuse.", ["affaire", "armoire", "adresse", "arrivée"]],
    comprehension: ["Cette affaire concerne un contrat disparu et deux signatures contestées.", "De quoi s’agit-il ?", ["a matter involving a missing contract", "a planned family journey", "a new school building", "a village celebration"], "a matter involving a missing contract"],
    advanced: [
      ["L’affaire paraît simple, mais le dossier contient plusieurs contradictions.", "Quel mot désigne le cas examiné ?", ["affaire", "simple", "dossier", "contradictions"]],
      ["Paul dit que cette affaire concerne Marie et son entreprise.", "Quel mot signifie question ou situation à traiter ?", ["Paul", "affaire", "Marie", "entreprise"]],
      ["Le tribunal classe l’affaire après le témoignage et la décision finale.", "Quel mot nomme le dossier judiciaire considéré ?", ["tribunal", "affaire", "témoignage", "décision"]],
    ],
  },
];

export const lievreQuizBatch06 = specs.flatMap(authoredSet);
