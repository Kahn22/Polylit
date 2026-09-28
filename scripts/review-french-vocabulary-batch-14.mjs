import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-14';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cria:sns_crier_primary', 'hold', 'The indexed use is the construction crier famine (“cry/complain of hunger”), and an unresolved global crier lemma candidate exists. Clarify the idiomatic use, occurrence assignment, and duplicate reuse before approval.'],
  ['srf_croit:sns_croire_primary', 'hold', 'The indexed use means “believes/thinks,” but the gloss and definition only restate the inflected form and the global croire lemma candidate is unresolved. Rewrite the learner-facing sense and reconcile reuse before approval.'],
  ['srf_d_elided:sns_de_primary', 'hold', 'This elided form has 141 occurrences spanning multiple syntactic relations and constructions; “of; from” does not account for every indexed use. Review/split the sense assignments before approval.'],
  ['srf_de:sns_de_primary', 'hold', 'This preposition has 442 occurrences across varied complements and constructions; the generic “of; from” gloss is insufficient to verify every indexed use. Review or split the senses before approval.'],
  ['srf_depens:sns_depens_primary', 'hold', 'The sole occurrence is the fixed expression aux dépens de (“at the expense of”), not the noun dépens in an ordinary standalone “expense” use. Clarify the expression-level assignment and learner gloss.'],
  ['srf_dormir:sns_dormir_primary', 'hold', 'Both infinitive occurrences mean “to sleep,” but an unresolved global dormir lemma candidate exists. Reconcile exact lemma/sense reuse before approval.'],
  ['srf_doute:sns_doute_primary', 'hold', 'Both occurrences are in sans doute, meaning “undoubtedly/probably,” rather than the standalone noun “doubt.” Reassign or document the adverbial phrase sense before approving this noun record.'],
  ['srf_ecoute:sns_ecouter_primary', 'approve', 'Reviewed the sole occurrence: the flatterer lives at the expense of the person who listens to him. Écoute is the present-tense form of écouter, “to listen,” with the listener as its object.'],
  ['srf_eh:sns_eh_primary', 'approve', 'Reviewed all four occurrences: Eh introduces interjections such as Eh bien ! and Oui. Eh bien ?. The interjection marker and conversational gloss “eh/hey” fit these uses.'],
  ['srf_elans:sns_elan_primary', 'hold', 'The plural form élans means leaps/bounds here, but the lemma is stored as “elan” without the required French accent and the gloss/definition merely paraphrase the form. Correct lemma spelling and rewrite the direct meaning before approval.'],
  ['srf_elle:sns_elle_primary', 'hold', 'This identity covers 190 occurrences; the current record labels every Elle as a feminine subject pronoun, but the set needs a role-by-role check for tonic and other constructions before that narrower sense can be approved.'],
  ['srf_eloigne:sns_eloigner_primary', 'hold', 'The sole context is the reflexive construction s’éloigner des chiens (“move away from the dogs”), whereas this record is assigned to non-reflexive éloigner. Clarify reflexive lemma/sense binding before approval.'],
  ['srf_en:sns_en_it', 'hold', 'This 11-occurrence identity combines a preposition and pronoun in its part of speech while the sense only defines the pronoun replacing a de-complement. Confirm every use is pronominal and split/reclassify any prepositional occurrences before approval.'],
  ['srf_encore:sns_encore_primary', 'hold', 'The 18 occurrences span temporal “still/again” and additive/emphatic uses such as encore en d’autres occasions. The generic “still/again” gloss needs occurrence-level sense review.'],
  ['srf_enjeux:sns_enjeu_primary', 'approve', 'Reviewed the sole occurrence: two competitors place the stakes near the finish before racing. Enjeux is the plural of enjeu, the stakes in a wager/contest, and its contextual gloss fits.'],
  ['srf_entends:sns_entendre_mean', 'approve', 'Reviewed all three occurrences: each entends introduces a clarification (j’entends de ceux…, j’entends le dossier…, j’entends par là…). The first-person present sense “I mean” is consistent.'],
  ['srf_et:sns_et_primary', 'approve', 'Reviewed the indexed uses across the works: Et coordinates words, phrases, or clauses (“and”), including sentence-initial continuations. The conjunction sense is stable throughout.'],
  ['srf_evertue:sns_evertuer_primary', 'hold', 'The sole occurrence is s’évertue, a reflexive verb form, but the lemma is stored as non-reflexive évertuer. Clarify the reflexive lemma and exact form before approval.'],
  ['srf_fait:sns_faire_done', 'hold', 'The 22 occurrences include several constructions and potentially participial, finite, and nominal uses; this record assigns all of them to the past participle sense. Verify each surface occurrence before approval.'],
  ['srf_faut:sns_falloir_primary', 'approve', 'Reviewed all ten occurrences: faut appears in impersonal necessity constructions including il faut and il vous faut. The impersonal present form of falloir and “must/be necessary” sense fit.'],
  ['srf_fin:sns_fin_primary', 'approve', 'Reviewed all four contexts: fin denotes the end of a race, a month, and an existence, including the figurative endpoint of a life. The general noun sense “end” is consistent.'],
  ['srf_fit:sns_lion_rat_faire_agit_avec_effort_pour_produire_un_resultat_1ee975da5b', 'approve', 'Reviewed the sole occurrence: the rat worked with his teeth until a gnawed thread undid the work. Fit is the past historic of faire, and “did/worked” matches the action.'],
  ['srf_flatteur:sns_flatteur_primary', 'approve', 'Reviewed the sole occurrence: the fox’s maxim refers to a flatterer who lives at the listener’s expense. Flatteur names a person who flatters, matching the noun sense.'],
  ['srf_fromage:sns_fromage_primary', 'approve', 'Reviewed both occurrences: one is the crow’s cheese and the other is the lesson’s figurative reward (“worth a cheese”). Both retain the literal noun fromage, cheese.'],
  ['srf_gageons:sns_gager_primary', 'approve', 'Reviewed the sole occurrence: the tortoise proposes a wager with the hare. Gageons is the first-person plural form used as “let us wager,” and the contextual sense is correct.'],
];

const publication = loadPublication();
const subjectMap = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary').map(subject => [subject.id, subject]));
const alreadyReviewed = new Set(readdirSync(resolve(publicationRoot, batchDirectory))
  .filter(file => file.endsWith('.json'))
  .flatMap(file => JSON.parse(readFileSync(resolve(publicationRoot, batchDirectory, file), 'utf8')).changes.map(change => change.subjectId)));
const blockedIds = auditEditorialQuality(publication)
  .filter(issue => issue.language === 'fr' && issue.kind === 'vocabulary' && !alreadyReviewed.has(issue.id))
  .map(issue => issue.id).sort();
if (decisions.some(([id], index) => id !== blockedIds[index]) || blockedIds.length < decisions.length) throw new Error('French vocabulary queue changed; prepare and review a fresh batch before applying.');

const duplicateGroups = duplicateCandidates(publication);
const sources = publication.sharedSources.fr;
const reviewMap = new Map(sources.reviews.map(review => [review.id, review]));
const changes = decisions.map(([subjectId, outcome, rationale]) => {
  const subject = subjectMap.get(subjectId);
  if (!subject) throw new Error(`Missing current subject ${subjectId}`);
  const value = subject.value;
  const duplicate = duplicateGroups.find(group => group.lemmaIds.includes(value.lemma.id));
  if (outcome === 'approve' && duplicate) throw new Error(`Unexpected unresolved duplicate candidate for ${subjectId}: ${duplicate.id}`);
  const reviewId = `vocabulary:${subjectId}`;
  const before = reviewMap.get(reviewId);
  const after = outcome === 'approve'
    ? approveReview('fr', 'vocabulary', subjectId, value, 'Codex', '2026-09-23T00:00:00.000Z', rationale)
    : pendingReview('fr', 'vocabulary', subjectId, value, rationale);
  reviewMap.set(reviewId, after);
  return { subjectId, reviewId, outcome, rationale, before, after, reviewedOccurrences: value.occurrences.length };
});

const ledger = {
  version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-23', language: 'fr', subjectKind: 'vocabulary',
  sequence: 14, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
  holds: changes.filter(change => change.outcome === 'hold').length, progressTransfers: [],
  reviewMethod: 'individual contextual review of current lemma, part of speech, surface form, every indexed occurrence, sense, and same-lemma reuse candidates; only supported records approved',
  changes,
};

const nextSources = { ...sources, reviews: [...reviewMap.values()] };
const files = new Map(sharedSourceFiles(nextSources));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => {
  const candidate = loadPublication(stage);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
});
console.log(JSON.stringify({ batchId, backup, reviewed: changes.length, approvals: ledger.approvals, holds: ledger.holds, ledger: resolve(publicationRoot, ledgerPath) }, null, 2));
