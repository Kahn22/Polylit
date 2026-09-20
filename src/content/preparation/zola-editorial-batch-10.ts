import type { EditorialQuizSet } from "./zola-editorial-quizzes.js";

export const zolaEditorialBatch10: Record<string, EditorialQuizSet> = {
  "clérical:clerical_religious": {
    early: "Le conseil clérical réunit des représentants du clergé.", englishChoices: ["clerical", "military", "commercial", "municipal"],
    intermediate: "Ce journal est qualifié de _____ parce qu’il défend les intérêts du clergé.", frenchChoices: ["clérical", "militaire", "municipal", "commercial"],
    advanced: "Le comité clérical consulte les prêtres sur ce projet. Le conseil municipal prépare le budget, et le groupe militaire vérifie les bâtiments.",
    prompt: "Quel mot rattache le comité au clergé ?", advancedChoices: ["clérical", "municipal", "militaire", "budget"],
  },
  "cléricale:clerical_religious": {
    early: "L’association cléricale a été fondée par des membres du clergé.", englishChoices: ["clerical", "military", "municipal", "commercial"],
    intermediate: "Cette organisation est _____ : plusieurs prêtres y représentent le clergé.", frenchChoices: ["cléricale", "militaire", "municipale", "commerciale"],
    advanced: "Une commission cléricale discute avec les prêtres du quartier. La mairie finance une école, tandis que les commerçants préparent un marché.",
    prompt: "Quel mot indique que la commission est liée au clergé ?", advancedChoices: ["cléricale", "mairie", "école", "marché"],
  },
  "clos:clos_closed": {
    early: "Le parc est clos après dix-huit heures : personne ne peut y entrer.", englishChoices: ["closed", "open", "crowded", "public"],
    intermediate: "À cette heure, le jardin est _____ et la grille reste verrouillée.", frenchChoices: ["clos", "ouvert", "accessible", "public"],
    advanced: "Le jardin clos n’accueille aucun visiteur aujourd’hui. La grille est verrouillée, les gardiens vérifient les allées et les voisins passent dans la rue.",
    prompt: "Quel mot indique que le jardin est fermé au public ?", advancedChoices: ["clos", "verrouillée", "gardiens", "voisins"],
  },
  "cœur:coeur_heart": {
    early: "En revoyant sa fille après des années, son cœur se remplit de joie.", englishChoices: ["heart", "mind", "voice", "hand"],
    intermediate: "En apprenant la bonne nouvelle, son _____ se remplit de joie.", frenchChoices: ["cœur", "bureau", "manteau", "carnet"],
    advanced: "Le cœur de Nina se serre quand elle lit cette lettre triste. Elle ferme les yeux, serre la main de Paul et range la photographie.",
    prompt: "Quel mot désigne ici le siège figuré des sentiments de Nina ?", advancedChoices: ["cœur", "yeux", "main", "photographie"],
  },
  "cœurs:coeur_heart": {
    early: "La chanson touche les cœurs des spectateurs et beaucoup essuient une larme.", englishChoices: ["hearts", "hands", "voices", "faces"],
    intermediate: "Le récit émeut tous les _____ : les auditeurs sont bouleversés.", frenchChoices: ["cœurs", "manteaux", "cahiers", "escaliers"],
    advanced: "Les cœurs des enfants se remplissent de joie quand leur mère revient. Leurs visages s’éclairent, leurs mains s’agitent et leurs voix résonnent dans la maison.",
    prompt: "Quel mot évoque le siège des émotions chez les enfants ?", advancedChoices: ["cœurs", "visages", "mains", "voix"],
  },
  "colonel:colonel_officer": {
    early: "Le colonel dirige son régiment pendant l’exercice militaire.", englishChoices: ["colonel", "private", "judge", "merchant"],
    intermediate: "Cet officier supérieur commande un régiment : c’est le _____.", frenchChoices: ["colonel", "soldat", "marchand", "juge"],
    advanced: "Le colonel commande le régiment depuis le quartier général. Un soldat apporte une carte, le médecin examine les blessés et le secrétaire note les ordres.",
    prompt: "Quel mot désigne l’officier supérieur qui commande le régiment ?", advancedChoices: ["colonel", "soldat", "médecin", "secrétaire"],
  },
  "colportent:colporter_spread": {
    early: "Des voisins colportent une rumeur que personne n’a vérifiée.", englishChoices: ["spread", "silence", "verify", "disprove"],
    intermediate: "Ils répètent la rumeur de maison en maison et la _____ dans tout le village.", frenchChoices: ["colportent", "démentent", "taisent", "vérifient"],
    advanced: "Les voisins colportent une rumeur sur le boulanger sans en vérifier la source. Nina enquête, Paul dément l’histoire et Léa demande des preuves.",
    prompt: "Quel mot indique que les voisins font circuler cette rumeur ?", advancedChoices: ["colportent", "enquête", "dément", "demande"],
  },
  "combat:combat_struggle": {
    early: "Son combat contre l’injustice dure depuis dix ans.", englishChoices: ["struggle", "agreement", "vacation", "reward"],
    intermediate: "Les habitants poursuivent leur _____ pour empêcher la fermeture de l’école.", frenchChoices: ["combat", "repos", "accord", "détour"],
    advanced: "Le combat des habitants pour garder leur école rassemble tout le quartier. Le maire consulte les parents, les enfants écrivent des lettres et le conseil vote lundi.",
    prompt: "Quel mot désigne la lutte menée pour conserver l’école ?", advancedChoices: ["combat", "parents", "lettres", "conseil"],
  },
  "combien:combien_how_much": {
    early: "Combien de billets faut-il pour toute la famille ?", englishChoices: ["how many", "where", "why", "when"],
    intermediate: "Nous sommes six : _____ de places devons-nous réserver ?", frenchChoices: ["combien", "comment", "pourquoi", "quand"],
    advanced: "Combien de places reste-t-il dans la salle ? Nina connaît le prix, Paul vérifie l’heure et Marc cherche une entrée.",
    prompt: "Quel mot demande le nombre de places disponibles ?", advancedChoices: ["combien", "prix", "heure", "entrée"],
  },
  "commence:commencer_begin": {
    early: "Le spectacle commence dès que les lumières s’éteignent.", englishChoices: ["begins", "ends", "pauses", "fails"],
    intermediate: "À huit heures précises, le concert _____ et l’orchestre joue ses premières notes.", frenchChoices: ["commence", "termine", "interrompt", "annule"],
    advanced: "Le cours commence à neuf heures, quand la professeure accueille les élèves. Paul distribue les cahiers, Nina ferme la fenêtre et Léa ouvre son livre.",
    prompt: "Quel mot indique que le cours débute ?", advancedChoices: ["commence", "distribue", "ferme", "ouvre"],
  },
  "comment:comment_how": {
    early: "Comment as-tu réparé cette lampe sans outils ?", englishChoices: ["how", "when", "where", "why"],
    intermediate: "_____ as-tu réussi à ouvrir cette porte ? Explique-moi ta méthode.", frenchChoices: ["comment", "quand", "où", "pourquoi"],
    advanced: "Comment Léa a-t-elle retrouvé son chien ? Elle raconte sa méthode, tandis que Paul demande l’heure et Nina vérifie l’adresse.",
    prompt: "Quel mot demande la manière dont Léa a retrouvé son chien ?", advancedChoices: ["comment", "méthode", "heure", "adresse"],
  },
  "commérages:commerage_gossip": {
    early: "Les commérages sur la vie privée de Nina circulent dans tout le quartier.", englishChoices: ["gossip", "instructions", "compliments", "records"],
    intermediate: "Ils racontent des histoires sans preuve sur leurs voisins : ces _____ les blessent.", frenchChoices: ["commérages", "consignes", "éloges", "documents"],
    advanced: "Des commérages sans preuve circulent au sujet de Luc. Une voisine raconte une histoire différente chaque jour, tandis que Paul réclame des faits vérifiés.",
    prompt: "Quel mot désigne les propos indiscrets répandus sans fondement ?", advancedChoices: ["commérages", "histoire", "jour", "faits"],
  },
  "commettant:commettre_commit": {
    early: "En commettant un vol, il enfreint la loi.", englishChoices: ["committing", "preventing", "reporting", "investigating"],
    intermediate: "En _____ une fraude pour obtenir de l’argent, il s’expose à une sanction.", frenchChoices: ["commettant", "empêchant", "dénonçant", "évitant"],
    advanced: "En commettant cette fraude, Paul a enfreint la loi. Nina découvre les comptes, le directeur avertit la police et le juge examine les faits.",
    prompt: "Quel mot indique que Paul a accompli la fraude ?", advancedChoices: ["commettant", "découvre", "avertit", "examine"],
  },
  "commis:commettre_commit": {
    early: "Paul a commis une erreur en recopiant le numéro du billet.", englishChoices: ["made", "corrected", "avoided", "reported"],
    intermediate: "En recopiant mal l’adresse, il a _____ une erreur qu’il devra corriger.", frenchChoices: ["commis", "évité", "empêché", "réparé"],
    advanced: "Marc a commis une faute en cachant le dossier. Léa a trouvé les papiers, Paul a interrogé le témoin et Nina a rédigé le rapport.",
    prompt: "Quel mot indique que Marc a accompli une faute ?", advancedChoices: ["commis", "trouvé", "interrogé", "rédigé"],
  },
  "commise:commettre_commit": {
    early: "La faute commise par Marc a retardé tout le projet.", englishChoices: ["committed", "avoided", "corrected", "reported"],
    intermediate: "La fraude qu’il a _____ pour détourner l’argent sera examinée par le juge.", frenchChoices: ["commise", "évitée", "corrigée", "dénoncée"],
    advanced: "La fraude commise par Luc a été découverte au printemps. La directrice a vérifié les comptes, un collègue a averti la police et le juge a ouvert une enquête.",
    prompt: "Quel mot indique que Luc a réalisé la fraude ?", advancedChoices: ["commise", "découverte", "vérifié", "averti"],
  },
};
