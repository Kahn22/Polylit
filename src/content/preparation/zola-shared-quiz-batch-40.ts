import { authoredSet } from "../quizzes/authoring.js";

/** Existing global le/les surfaces; prepare only the uncovered object senses. */
export const zolaSharedQuizBatch40 = [
  ...authoredSet({
    key: "le_object",
    surfaceFormId: "srf_le",
    senseId: "sns_le_object",
    target: "le",
    meaning: "him (masculine direct object)",
    early: [
      ["Paul est en retard ; Marie le prévient.", ["her", "them", "me"]],
      ["Luc cherche son frère et le retrouve devant la gare.", ["her", "them", "us"]],
      ["Paul est inquiet ; sa sœur le rassure.", ["her", "them", "me"]],
    ],
    blank: ["Paul attend dehors ; Marie ___ prévient du changement.", ["le", "la", "les", "me"]],
    comprehension: ["Paul est inquiet ; sa sœur le rassure.", "Qui est rassuré ?", ["Paul", "sa sœur", "Luc", "Marie"], "Paul"],
    advanced: [
      ["Paul perd son billet ; Marie le rassure. Alice cherche son siège ; Luc la guide. Les voyageurs sont pressés ; une agente les informe. Paul me demande l’heure.", "Quel pronom reprend Paul comme objet de rassure ?", ["le", "la", "les", "me"]],
      ["Luc arrive ; Marie le salue. Alice attend ; Paul la salue. Les enfants courent ; Luc les rappelle. Marie me voit.", "Quel pronom reprend Luc comme objet de salue ?", ["le", "la", "les", "me"]],
      ["Paul hésite ; Luc le conseille. Anne hésite ; Léa la conseille. Les voisins hésitent ; Paul les conseille. Anne me répond.", "Quel pronom reprend Paul comme objet de conseille ?", ["le", "la", "les", "me"]],
    ],
  }),
  ...authoredSet({
    key: "les_object",
    surfaceFormId: "srf_les",
    senseId: "sns_le_object",
    target: "les",
    meaning: "them (plural direct object)",
    early: [
      ["Marie les accueille avant l’ouverture : ses invités attendent dehors.", ["him", "her", "me"]],
      ["Luc les appelle ; ses voisins arrivent bientôt.", ["him", "her", "us"]],
      ["Paul les range soigneusement : ses livres sont précieux.", ["him", "her", "me"]],
    ],
    blank: ["Les visiteurs patientent ; Marie ___ accueille à l’entrée.", ["les", "le", "la", "me"]],
    comprehension: ["Les visiteurs arrivent ; Marie les accueille.", "Qui Marie accueille-t-elle ?", ["les visiteurs", "Paul", "Alice", "une agente"], "les visiteurs"],
    advanced: [
      ["Les visiteurs arrivent ; Marie les accueille. Paul entre ; Luc le salue. Alice arrive ; Paul la salue. À la fin, Marie me parle.", "Quel pronom reprend les visiteurs ?", ["les", "le", "la", "me"]],
      ["Les livres tombent ; Paul les ramasse. Luc trébuche ; Marie le relève. Alice hésite ; Luc la guide. Puis Marie me sourit.", "Quel pronom reprend les livres ?", ["les", "le", "la", "me"]],
      ["Les voisins attendent ; Léa les appelle. Paul approche ; Anne le salue. Marie arrive ; Paul la salue. Enfin Luc me répond.", "Quel pronom reprend les voisins ?", ["les", "le", "la", "me"]],
    ],
  }),
];
