import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "rien_nothing", surfaceFormId: "srf_rien", senseId: "sns_rien_primary", target: "rien", meaning: "nothing; anything (with negation)",
    early: [
      ["Rien ne bouge dans la maison silencieuse.", ["someone", "everything", "somewhere"]],
      ["Paul ne trouve rien dans la boîte.", ["a letter", "several objects", "the key"]],
      ["Elle n’entend rien derrière la porte.", ["a voice", "the music", "every sound"]],
    ],
    blank: ["Après la tempête, il ne reste ___.", ["rien", "personne", "jamais", "ailleurs"]],
    comprehension: ["Luc ouvre le coffre, mais il n’y découvre rien.", "Que découvre Luc dans le coffre ?", ["nothing", "a document", "some coins", "an old map"], "nothing"],
    advanced: [
      ["Rien ne pousse sur ce terrain sec, mais le jardin voisin reste vert.", "Quel mot signifie aucune chose ?", ["Rien", "terrain", "jardin", "vert"]],
      ["Marie ne dit rien et Paul attend toujours une explication.", "Quel mot indique l’absence de parole ?", ["Marie", "rien", "Paul", "explication"]],
      ["Nous n’avons rien perdu pendant le voyage, contrairement à nos voisins.", "Quel pronom exprime ici l’absence de chose perdue ?", ["Nous", "rien", "voyage", "voisins"]],
    ],
  },
  {
    key: "sert_serves", surfaceFormId: "srf_sert", senseId: "sns_servir_primary", target: "sert", meaning: "serves; is useful",
    early: [
      ["Cette clé sert à ouvrir la petite porte.", ["closes", "hides", "breaks"]],
      ["Le guide sert de témoin pendant la cérémonie.", ["runs away", "falls asleep", "changes"]],
      ["À quoi sert cet outil de bois ?", ["Who owns", "Where lies", "When arrives"]],
    ],
    blank: ["Cette lampe ___ à éclairer l’escalier.", ["sert", "sers", "servent", "servait"]],
    comprehension: ["Le vieux seau sert à recueillir l’eau de pluie.", "Quelle est l’utilité du seau ?", ["to collect rainwater", "to carry grain", "to cover a well", "to mark the road"], "to collect rainwater"],
    advanced: [
      ["Ce banc sert de table, tandis que les voyageurs s’assoient par terre.", "Quel mot exprime la fonction du banc ?", ["banc", "sert", "voyageurs", "terre"]],
      ["La corde sert à tirer la barque jusqu’au rivage.", "Quel verbe signifie est utile pour ?", ["corde", "sert", "barque", "rivage"]],
      ["Cette pièce sert de réserve et la salle voisine accueille les visiteurs.", "Quel mot indique l’usage de cette pièce ?", ["pièce", "sert", "salle", "visiteurs"]],
    ],
  },
  {
    key: "faut_must", surfaceFormId: "srf_faut", senseId: "sns_falloir_primary", target: "faut", meaning: "must; is necessary",
    early: [
      ["Il faut partir avant la nuit.", ["is possible", "was forbidden", "seems pleasant"]],
      ["Il faut répondre à cette lettre aujourd’hui.", ["might forget", "has already", "refuses to"]],
      ["Pour réussir, il faut travailler avec patience.", ["can sleep", "used to travel", "wants to sing"]],
    ],
    blank: ["Il ___ fermer la porte avant de sortir.", ["faut", "font", "fait", "fallait"]],
    comprehension: ["Il faut traverser le pont pour atteindre le village.", "Que doit-on faire pour atteindre le village ?", ["cross the bridge", "follow the river", "wait for a boat", "climb the hill"], "cross the bridge"],
    advanced: [
      ["Il faut garder ce document, mais les anciennes lettres peuvent être jetées.", "Quel mot exprime une nécessité ?", ["faut", "document", "lettres", "jetées"]],
      ["Pour ouvrir le coffre, il faut tourner deux fois la clé.", "Quel mot signifie il est nécessaire ?", ["coffre", "faut", "fois", "clé"]],
      ["Il faut attendre ici, tandis que Paul va chercher le médecin.", "Quel mot impose l’attente comme nécessaire ?", ["faut", "ici", "Paul", "médecin"]],
    ],
  },
  {
    key: "point_timely_moment", surfaceFormId: "srf_point_noun", senseId: "sns_point_opportune", target: "point", meaning: "right moment; fitting point (in à point)",
    early: [
      ["Le secours arrive à point pour sauver les voyageurs.", ["far away", "too late", "by chance"]],
      ["Cette pluie vient à point après plusieurs semaines de sécheresse.", ["without warning", "in vain", "everywhere"]],
      ["Paul paraît à point pour entendre la décision.", ["secretly", "yesterday", "alone"]],
    ],
    blank: ["Le médecin est arrivé à ___ pour soigner le blessé.", ["point", "temps", "lieu", "peine"]],
    comprehension: ["La lettre arrive à point : Marie allait justement quitter la maison.", "Pourquoi le moment de l’arrivée est-il opportun ?", ["Marie was just about to leave", "Marie had lost the letter", "the house was empty", "the journey was cancelled"], "Marie was just about to leave"],
    advanced: [
      ["Le vent se lève à point et permet au bateau de quitter le port.", "Quel mot appartient à l’expression signifiant au moment opportun ?", ["vent", "point", "bateau", "port"]],
      ["Vous venez à point : nous avions précisément besoin de votre aide.", "Quel mot indique que l’arrivée tombe bien ?", ["venez", "point", "besoin", "aide"]],
      ["Le repas est servi à point, juste avant le départ des invités.", "Quel mot marque ici le moment convenable ?", ["repas", "servi", "point", "invités"]],
    ],
  },
  {
    key: "point_not_at_all", surfaceFormId: "srf_point_adverb", senseId: "sns_point_negation", target: "point", meaning: "not at all (literary, with ne)",
    early: [
      ["Je ne doute point de sa parole.", ["sometimes", "already", "greatly"]],
      ["Elle ne répond point aux accusations.", ["answers quickly", "agrees completely", "speaks loudly"]],
      ["Nous ne craignons point cette menace.", ["still fear", "often discuss", "hardly understand"]],
    ],
    blank: ["Le témoin ne change ___ son récit.", ["point", "plus", "rien", "aucun"]],
    comprehension: ["Paul ne connaît point le chemin qui mène au château.", "Paul connaît-il le chemin ?", ["no, not at all", "yes, perfectly", "only the first part", "the sentence does not say"], "no, not at all"],
    advanced: [
      ["Le vieil homme ne proteste point, mais son fils refuse la décision.", "Quel mot complète la négation littéraire ?", ["homme", "point", "fils", "décision"]],
      ["Je ne crois point cette histoire malgré les affirmations du marchand.", "Quel mot signifie pas du tout dans ce registre ?", ["crois", "point", "histoire", "marchand"]],
      ["La porte ne s’ouvre point et les voyageurs cherchent une autre entrée.", "Quel mot renforce la négation du verbe s’ouvre ?", ["porte", "point", "voyageurs", "entrée"]],
    ],
  },
];

export const lievreQuizBatch10 = specs.flatMap(authoredSet);
