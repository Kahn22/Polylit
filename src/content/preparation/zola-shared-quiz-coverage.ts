import { authoredSet } from "../quizzes/authoring.js";

/** Existing global faire + causative sense lacked prepared questions. */
export const zolaSharedQuizCoverage = authoredSet({
  key: "faire_causative",
  surfaceFormId: "srf_faire",
  senseId: "sns_faire_causative",
  target: "faire",
  meaning: "to have someone do something",
  early: [
    ["Léa va faire réparer son vélo par le mécanicien.", ["to read aloud", "to stroll downhill", "to sleep deeply"]],
    ["Marc doit faire examiner la montre par un horloger.", ["to whistle loudly", "to knit a scarf", "to swim slowly"]],
    ["Paul veut faire traduire la lettre par une interprète.", ["to sweep a room", "to row a boat", "to nap outside"]],
  ],
  blank: ["Luc veut ___ examiner la montre par un horloger.", ["faire", "voir", "laisser", "savoir"]],
  comprehension: ["Léa va faire réparer son vélo par le mécanicien.", "Qui réparera le vélo ?", ["le mécanicien", "Léa", "un voisin", "une interprète"], "le mécanicien"],
  advanced: [
    ["Léa veut faire réparer son vélo par un mécanicien ; Marc préfère voir réparer le sien ; Luc refuse de laisser réparer sa roue et Paul veut savoir réparer sa montre.", "Quel verbe indique que Léa confie la réparation au mécanicien ?", ["faire", "voir", "laisser", "savoir"]],
    ["Marie va faire peindre la porte par un artisan ; Luc préfère voir peindre la sienne ; Paul va laisser peindre le mur et Anne veut savoir peindre un tableau.", "Quel verbe indique que Marie charge un artisan de peindre ?", ["faire", "voir", "laisser", "savoir"]],
    ["Le maire veut faire réparer l’horloge par une spécialiste ; Paul pourra voir réparer le mécanisme ; Marie va laisser réparer ses outils et Luc veut savoir réparer sa montre.", "Quel verbe indique que le maire commande la réparation ?", ["faire", "voir", "laisser", "savoir"]],
  ],
});
