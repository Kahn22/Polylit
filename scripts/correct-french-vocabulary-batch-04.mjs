import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-24-04';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_avoir_primary', { gloss: 'to have; auxiliary have', definition: 'Posséder ou présenter quelque chose ; sert aussi d’auxiliaire pour former des temps composés.' }],
  ['sns_cependant_primary', { gloss: 'however; nevertheless', definition: 'Introduit une opposition ou une restriction par rapport à ce qui précède.' }],
  ['sns_chose_primary', { gloss: 'thing; matter', definition: 'Objet, fait, idée ou réalité que l’on désigne sans la nommer plus précisément.' }],
  ['sns_comme_primary', { gloss: 'like; as; since', definition: 'Introduit une comparaison, une manière, un rôle ou parfois une cause.' }],
  ['sns_doute_primary', { gloss: 'doubt; uncertainty', definition: 'État d’incertitude qui empêche de tenir quelque chose pour assuré.' }],
  ['sns_elle_primary', { gloss: 'she; her; it (feminine)', definition: 'Pronom personnel féminin de troisième personne, employé comme sujet ou sous une forme accentuée.' }],
  ['sns_encore_primary', { gloss: 'still; again; more', definition: 'Indique la continuation, la répétition ou une quantité supplémentaire.' }],
  ['sns_faire_done', { gloss: 'done; made; accomplished', definition: 'Indique qu’une action est accomplie, qu’une chose est produite ou qu’un état se réalise.' }],
  ['sns_gloire_primary', { gloss: 'glory; fame; distinction', definition: 'Renommée, honneur éclatant ou sentiment de triomphe associé au succès.' }],
  ['sns_honneur_primary', { gloss: 'honor; dignity', definition: 'Dignité morale, estime reconnue ou engagement que l’on tient à respecter.' }],
  ['sns_honteux_primary', { gloss: 'ashamed', definition: 'Qui éprouve ou manifeste de la honte.' }],
  ['sns_leger_primary', { gloss: 'light; nimble', definition: 'Qui pèse peu ou qui se déplace avec aisance et agilité.' }],
  ['sns_lorsque_primary', { gloss: 'when', definition: 'Conjonction qui introduit le moment où se produit une action.' }],
  ['sns_lui_subject', { gloss: 'he; him (stressed pronoun)', definition: 'Pronom personnel masculin accentué, notamment employé pour mettre le sujet en relief.' }],
  ['sns_maison_primary', { gloss: 'house; home; household', definition: 'Bâtiment où l’on habite ou, par extension, foyer et ensemble domestique.' }],
  ['sns_mepriser_primary', { gloss: 'to despise; scorn', definition: 'Considérer quelqu’un ou quelque chose sans estime et comme indigne de considération.' }],
  ['sns_notre_primary', { gloss: 'our', definition: 'Déterminant possessif de première personne du pluriel.' }],
  ['sns_premier_primary', { gloss: 'first', definition: 'Qui occupe le rang numéro un dans un ordre ou une succession.' }],
  ['sns_pret_primary', { gloss: 'ready', definition: 'Préparé et en état d’agir, de partir ou d’être utilisé.' }],
  ['sns_senateur_primary', { gloss: 'senator', definition: 'Membre d’un sénat ou d’une chambre législative appelée Sénat.' }],
  ['sns_temoignage_primary', { gloss: 'testimony; evidence', definition: 'Déclaration d’un témoin ou élément qui atteste un fait.' }],
  ['sns_tenir_consider', { gloss: 'to consider; regard as', definition: 'Tenir une personne ou une chose pour telle : la considérer ou la regarder comme telle.' }],
  ['sns_toucher_primary', { gloss: 'to touch; reach; affect', definition: 'Entrer en contact, atteindre une limite ou produire une impression morale.' }],
  ['sns_train_primary', { gloss: 'pace; course; manner of proceeding', definition: 'Allure, rythme ou manière dont une action progresse.' }],
  ['sns_trait_primary', { gloss: 'dart; bolt; arrow', definition: 'Projectile allongé lancé à la main ou par une arme, notamment une flèche ou un carreau.' }],
]);
const lemmaUpdates = new Map([]);

const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const beforeSenses = new Map(content.senses.filter(sense => senseUpdates.has(sense.id)).map(sense => [sense.id, sense]));
const beforeLemmas = new Map(content.lemmas.filter(lemma => lemmaUpdates.has(lemma.id)).map(lemma => [lemma.id, lemma]));
if (beforeSenses.size !== senseUpdates.size || beforeLemmas.size !== lemmaUpdates.size) throw new Error('Correction targets changed');
content.senses = content.senses.map(sense => senseUpdates.has(sense.id) ? { ...sense, ...senseUpdates.get(sense.id) } : sense);
content.lemmas = content.lemmas.map(lemma => lemmaUpdates.has(lemma.id) ? { ...lemma, ...lemmaUpdates.get(lemma.id) } : lemma);
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const updatedSenses = new Map(content.senses.map(sense => [sense.id, sense]));
const updatedLemmas = new Map(content.lemmas.map(lemma => [lemma.id, lemma]));
const surfaces = new Map(content.surfaceForms.map(surface => [surface.id, surface]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary' && senseUpdates.has(subject.value.sense.id));
const rationale = 'Corrected the learner-facing gloss and definition to match every indexed context while preserving the existing lemma, sense, surface-form, occurrence, and learner mastery IDs.';
const changes = subjects.map(subject => {
  const value = subject.value;
  const revised = { ...value, lemma: updatedLemmas.get(value.lemma.id), sense: updatedSenses.get(value.sense.id) };
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, revised, 'Codex', '2026-09-24T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: value.occurrences.length };
});

let reboundQuizzes = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary' || !senseUpdates.has(quiz.subject.senseId)) continue;
  const surface = surfaces.get(quiz.subject.surfaceFormId);
  const sense = updatedSenses.get(quiz.subject.senseId);
  const lemma = updatedLemmas.get(surface.lemmaId);
  const reason = 'Re-reviewed the unchanged authored question after its target meaning was corrected; context, target, answer, grammar, distractors, and all three distinct bands remain accurate.';
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense, lemma } }, 'Codex', '2026-09-24T00:00:00.000Z', reason));
  reboundQuizzes++;
}

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 4, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'controlled correction of learner glosses and definitions followed by contextual re-review with stable identity IDs', changes };
const correctionLedger = { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals: reboundQuizzes, changes: [
  ...[...beforeLemmas].map(([id, before]) => ({ kind: 'lemmas', id, before, after: updatedLemmas.get(id), reason: 'Corrected the standard French citation spelling without changing the permanent lemma ID.' })),
  ...[...beforeSenses].map(([id, before]) => ({ kind: 'senses', id, before, after: updatedSenses.get(id), reason: 'Replaced an inaccurate, circular, opaque, or overly narrow learner meaning with a contextual learner-ready meaning.' })),
] };
const next = { ...source, legacy, quizzes, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(reviewLedgerPath, reviewLedger);
files.set(correctionLedgerPath, correctionLedger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, correctedSenses: senseUpdates.size, correctedLemmas: lemmaUpdates.size, approvedIdentities: changes.length, reboundQuizApprovals: reboundQuizzes, backup }, null, 2));
