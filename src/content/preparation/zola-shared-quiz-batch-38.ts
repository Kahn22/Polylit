import { authoredSet } from "../quizzes/authoring.js";

/** Prepared globally for the existing la + direct-object sense, not for a text. */
export const zolaSharedQuizBatch38 = authoredSet({
  key: "la_object",
  surfaceFormId: "srf_la",
  senseId: "sns_le_object",
  target: "la",
  meaning: "it (feminine direct object)",
  early: [
    ["Marie la range avec soin : cette lampe est fragile.", ["him", "them", "me"]],
    ["Cette lettre, Luc la lit avant le dîner.", ["him", "them", "us"]],
    ["La porte est ouverte ; Paul la ferme.", ["him", "them", "me"]],
  ],
  blank: ["Cette lettre, je ___ rangerai dans le tiroir.", ["la", "le", "les", "me"]],
  comprehension: ["Cette lettre, Luc la lit devant Marie.", "Que lit Luc ?", ["la lettre", "le livre", "les cartes", "son journal"], "la lettre"],
  advanced: [
    ["Cette lettre, Marie la range ; ce livre, Paul le range ; ces cartes, ils les rangent ; Luc me regarde.", "Quel pronom reprend « cette lettre » ?", ["la", "le", "les", "me"]],
    ["Cette lampe, elle la nettoie ; ce vase, il le regarde ; ces livres, ils les portent ; Paul me salue.", "Quel pronom reprend « cette lampe » ?", ["la", "le", "les", "me"]],
    ["Cette porte, Paul la ferme ; ce coffre, Luc le ferme ; ces fenêtres, on les ferme ; Marie me sourit.", "Quel pronom reprend « cette porte » ?", ["la", "le", "les", "me"]],
  ],
});
