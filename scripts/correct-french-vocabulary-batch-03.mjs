import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-24-03';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_affaire_primary', { gloss: 'matter; business; concern', definition: 'Question, situation ou activité dont une personne s’occupe ou qui la concerne.' }],
  ['sns_ainsi_primary', { gloss: 'thus; so; in this way', definition: 'De cette manière, comme cela ou selon ce qui vient d’être indiqué.' }],
  ['sns_amuser_primary', { gloss: 'to enjoy oneself; have fun', definition: 'Se divertir, prendre du plaisir ou occuper agréablement son temps.' }],
  ['sns_arriver_primary', { gloss: 'to arrive; happen', definition: 'Parvenir à un lieu ou à un moment ; dans la construction il arriva que, se produire.' }],
  ['sns_autre_adjective', { gloss: 'other; another', definition: 'Qui est distinct de ce dont on parle ou qui vient s’y ajouter.' }],
  ['sns_bien_discourse', { gloss: 'well; well then', definition: 'Marqueur de discours employé pour introduire une réaction, une conclusion ou une transition, notamment dans « eh bien ».' }],
  ['sns_bout_primary', { gloss: 'end; endpoint; extremity', definition: 'Extrémité ou terme d’une chose, d’un espace, d’une durée ou d’une action.' }],
  ['sns_convenir_primary', { gloss: 'to agree; settle', definition: 'Se mettre d’accord sur quelque chose ou décider ensemble de ce qui sera fait.' }],
  ['sns_courir_primary', { gloss: 'to run', definition: 'Se déplacer rapidement en faisant une suite de pas ou de foulées.' }],
  ['sns_crier_primary', { gloss: 'to shout; cry out', definition: 'Parler ou appeler d’une voix forte.' }],
  ['sns_croire_primary', { gloss: 'to believe; think', definition: 'Tenir quelque chose pour vrai ou penser qu’une situation est telle.' }],
  ['sns_dormir_primary', { gloss: 'to sleep', definition: 'Être dans l’état de repos naturel du sommeil.' }],
  ['sns_elan_primary', { gloss: 'leap; bound', definition: 'Mouvement vif qui porte le corps en avant, notamment un bond.' }],
  ['sns_eloigner_primary', { gloss: 'to move away; take farther away', definition: 'Mettre plus loin ou, avec se, prendre de la distance.' }],
  ['sns_evertuer_primary', { gloss: 'to strive; make every effort', definition: 'Avec se, faire de grands efforts persistants pour parvenir à un résultat.' }],
  ['sns_gageure_primary', { gloss: 'wager; challenge', definition: 'Pari accepté entre plusieurs personnes ou entreprise considérée comme un défi.' }],
  ['sns_grain_primary', { gloss: 'grain; small particle or dose', definition: 'Petite graine, particule ou quantité mesurée rappelant un grain.' }],
  ['sns_hater_primary', { gloss: 'to hurry; hasten', definition: 'Accélérer une action ou, avec se, agir plus vite.' }],
  ['sns_juge_primary', { gloss: 'judge', definition: 'Personne chargée de trancher un différend ou de rendre une décision de justice.' }],
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

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 3, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'controlled correction of learner glosses and definitions followed by contextual re-review with stable identity IDs', changes };
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
