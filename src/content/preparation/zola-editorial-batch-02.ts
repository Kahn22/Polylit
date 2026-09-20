import type { EditorialQuizSet } from "./zola-editorial-quizzes.js";

/** Additional independently written three-band sets; keyed by surface and sense. */
export const zolaEditorialBatch02: Record<string, EditorialQuizSet> = {
  "achèvent:achever_complete": {
    early: "Les ouvriers achèvent la maison aujourd’hui.", englishChoices: ["finish", "abandon", "demolish", "inspect"],
    intermediate: "Après des mois de travaux, les ouvriers _____ enfin le pont aujourd’hui.", frenchChoices: ["achèvent", "abandonnent", "démolissent", "ignorent"],
    advanced: "Les maçons achèvent le mur ; demain, le chantier sera terminé. Les peintres préparent la porte, les électriciens vérifient les fils et les voisins observent.",
    prompt: "Quel mot annonce la fin des travaux sur le mur ?", advancedChoices: ["achèvent", "préparent", "vérifient", "observent"],
  },
  "acquitter:acquitter_acquit": {
    early: "Faute de preuve, le tribunal va acquitter la femme.", englishChoices: ["to acquit", "to accuse", "to arrest", "to question"],
    intermediate: "Le tribunal constate son innocence et décide de l’_____ de toutes les charges.", frenchChoices: ["acquitter", "accuser", "condamner", "interroger"],
    advanced: "Faute de preuves, le tribunal décide d’acquitter Léa. Le procureur examine le dossier, l’avocat rappelle les faits et le témoin attend dehors.",
    prompt: "Quel mot signifie déclarer Léa non coupable ?", advancedChoices: ["acquitter", "examine", "rappelle", "attend"],
  },
  "acte:acte_document": {
    early: "L’acte de naissance porte le nom et la date de l’enfant.", englishChoices: ["official record", "voluntary deed", "oral promise", "private opinion"],
    intermediate: "Pour inscrire le bébé, ses parents présentent un _____ de naissance délivré par la mairie.", frenchChoices: ["acte", "geste", "dessin", "récit"],
    advanced: "L’acte de naissance porte le nom de l’enfant. Le témoin observe, le secrétaire classe le dossier et la mairie conserve une copie.",
    prompt: "Quel mot désigne le document officiel qui enregistre la naissance ?", advancedChoices: ["acte", "témoin", "dossier", "copie"],
  },
  "acte:acte_deed": {
    early: "Aider une inconnue était un acte généreux.", englishChoices: ["deed", "certificate", "statement", "contract"],
    intermediate: "Donner son temps aux autres est un _____ de générosité.", frenchChoices: ["acte", "document", "contrat", "registre"],
    advanced: "En aidant sa voisine, Luc accomplit un acte généreux. Une lettre arrive plus tard, un contrat est signé et un livre reste sur la table.",
    prompt: "Quel mot désigne l’action accomplie par Luc ?", advancedChoices: ["acte", "lettre", "contrat", "livre"],
  },
  "actes:acte_deed": {
    early: "Ses actes montrent sa générosité envers les autres.", englishChoices: ["deeds", "documents", "promises", "rules"],
    intermediate: "Il promet souvent d’aider, mais ce sont ses _____ qui montrent ce qu’il fait réellement.", frenchChoices: ["actes", "paroles", "intentions", "idées"],
    advanced: "Les actes de Nina parlent pour elle : elle aide ses voisins chaque semaine. Ses paroles sont sincères, ses idées sont claires et ses lettres sont courtes.",
    prompt: "Quel mot désigne ce que Nina fait réellement ?", advancedChoices: ["actes", "paroles", "idées", "lettres"],
  },
  "adjurant:adjurer_implore": {
    early: "Adjurant sa sœur de revenir, Léa fond en larmes.", englishChoices: ["imploring", "ignoring", "reassuring", "thanking"],
    intermediate: "Le témoin, _____ le juge de l’écouter, parla les larmes aux yeux.", frenchChoices: ["adjurant", "ignorant", "interrompant", "remerciant"],
    advanced: "En adjurant le juge de l’écouter, le témoin parle avec insistance. Le greffier écrit, l’avocat attend et le gardien ferme la porte.",
    prompt: "Quel mot signifie que le témoin supplie vivement le juge ?", advancedChoices: ["adjurant", "écrit", "attend", "ferme"],
  },
  "adressée:adresser_send": {
    early: "La lettre adressée à Marc porte son nom sur l’enveloppe.", englishChoices: ["addressed", "lost", "copied", "opened"],
    intermediate: "Cette lettre, _____ à Marc, porte son nom sur l’enveloppe.", frenchChoices: ["adressée", "adressés", "adressé", "adresser"],
    advanced: "La lettre adressée à Marc est sur la table. Sa sœur a envoyé le colis, leur mère a ouvert la boîte et Léa a copié l’adresse.",
    prompt: "Quel mot indique à qui la lettre est destinée ?", advancedChoices: ["adressée", "envoyé", "ouvert", "copié"],
  },
  "affirme:affirmer_state": {
    early: "La directrice affirme que le musée ouvre demain.", englishChoices: ["states", "denies", "doubts", "asks"],
    intermediate: "Malgré les rumeurs, le témoin _____ avec certitude avoir vu le voleur.", frenchChoices: ["affirme", "hésite", "doute", "ignore"],
    advanced: "La directrice affirme que la salle est ouverte. Son collègue doute de la nouvelle, un visiteur demande l’heure et le gardien ferme la porte.",
    prompt: "Quel mot indique que la directrice énonce cela comme certain ?", advancedChoices: ["affirme", "doute", "demande", "ferme"],
  },
  "affirmer:affirmer_state": {
    early: "Le témoin veut affirmer devant le juge qu’il était présent.", englishChoices: ["to state", "to doubt", "to conceal", "to forget"],
    intermediate: "Après vérification, le témoin peut _____ avec certitude que la porte était fermée.", frenchChoices: ["affirmer", "douter", "hésiter", "ignorer"],
    advanced: "Avant d’affirmer que le pont est sûr, Marie examine le rapport. Paul préfère douter, Luc veut attendre et Léa décide de vérifier la structure.",
    prompt: "Quel verbe signifie présenter quelque chose comme certain ?", advancedChoices: ["affirmer", "douter", "attendre", "vérifier"],
  },
  "affolé:affole_panicked": {
    early: "Affolé par la fumée, le voisin appelle les secours.", englishChoices: ["panicked", "calm", "amused", "relaxed"],
    intermediate: "À la vue des flammes, l’enfant _____ crie et cherche la sortie.", frenchChoices: ["affolé", "ravi", "calme", "endormi"],
    advanced: "Luc, affolé par les flammes, sort rapidement. Sa sœur reste calme, le voisin paraît heureux de la revoir et le chien dort dans le jardin.",
    prompt: "Quel mot décrit la peur désordonnée de Luc ?", advancedChoices: ["affolé", "calme", "heureux", "dort"],
  },
  "affreuse:affreux_horrible": {
    early: "La famille a passé une nuit affreuse pendant la tempête.", englishChoices: ["dreadful", "pleasant", "peaceful", "ordinary"],
    intermediate: "Leur souffrance fut _____ : ils ne l’oublieront jamais.", frenchChoices: ["affreuse", "légère", "drôle", "agréable"],
    advanced: "La nuit fut affreuse : le vent a détruit la maison. Au matin, l’air est doux, la rue est calme et le soleil est chaud.",
    prompt: "Quel mot exprime l’horreur vécue pendant la nuit ?", advancedChoices: ["affreuse", "doux", "calme", "chaud"],
  },
  "agent:agent_representative": {
    early: "Un agent du ministère inspecte le bâtiment.", englishChoices: ["representative", "tourist", "patient", "customer"],
    intermediate: "Le ministère envoie un _____ chargé de vérifier les comptes.", frenchChoices: ["agent", "touriste", "patient", "spectateur"],
    advanced: "L’agent du ministère inspecte les comptes. Le visiteur attend à l’entrée, le gardien ferme la porte et le directeur signe le registre.",
    prompt: "Quel mot désigne la personne envoyée par le ministère ?", advancedChoices: ["agent", "visiteur", "gardien", "directeur"],
  },
  "aggraver:aggraver_worsen": {
    early: "Une nouvelle panne risque d’aggraver le retard.", englishChoices: ["to worsen", "to resolve", "to prevent", "to shorten"],
    intermediate: "La panne est déjà grave ; cette erreur va encore l’_____.", frenchChoices: ["aggraver", "améliorer", "réparer", "empêcher"],
    advanced: "Cette erreur va aggraver la panne. Le mécanicien essaie de réparer le moteur, sa collègue contrôle la température et le directeur attend des nouvelles.",
    prompt: "Quel verbe signifie rendre la panne plus grave ?", advancedChoices: ["aggraver", "réparer", "contrôle", "attend"],
  },
  "agi:agir_act": {
    early: "Paul a agi rapidement pour aider son ami.", englishChoices: ["acted", "hesitated", "slept", "waited"],
    intermediate: "Devant le danger, il a _____ pour sauver l’enfant, au lieu de rester immobile.", frenchChoices: ["agi", "hésité", "dormi", "oublié"],
    advanced: "Face au danger, Paul a agi tout de suite. Marie a attendu les secours, Luc a hésité et Nina a appelé sa famille.",
    prompt: "Quel mot indique que Paul est passé à l’action ?", advancedChoices: ["agi", "attendu", "hésité", "appelé"],
  },
  "agir:s_agir_concern": {
    early: "Il doit s’agir d’une erreur : ce prix ne correspond pas au reçu.", englishChoices: ["be a matter of", "be going away", "be sleeping", "be changing"],
    intermediate: "À mon avis, il doit s’_____ d’une simple erreur de prix.", frenchChoices: ["agir", "agissant", "agi", "agit"],
    advanced: "Il doit s’agir d’une erreur : le prix ne correspond pas au reçu. Luc examine le ticket, Marie compare les chiffres et Paul appelle la boutique.",
    prompt: "Quel mot, après « s’ », exprime ici qu’il est question d’une erreur ?", advancedChoices: ["agir", "examine", "compare", "appelle"],
  },
};
