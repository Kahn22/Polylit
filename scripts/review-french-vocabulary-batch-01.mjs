import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-01';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_a:sns_a_primary', 'hold', 'The 143 reviewed contexts include several conventional prepositional relations and idioms; the current gloss “to; at” does not describe enough of them to approve one exact sense. Refine/split the sense and then re-review its dependent questions.'],
  ['srf_affaire:sns_affaire_primary', 'hold', 'The contexts span “ce n’est pas l’affaire” and the construction “avoir affaire aux usuriers”; a second active affaire lemma also exists in Zola. Resolve lemma/sense reuse and replace the tautological current definition before approval.'],
  ['srf_ainsi:sns_ainsi_primary', 'hold', 'Nine contexts include ainsi que and adverbial thus/in-that-way uses. The current self-referential definition does not distinguish these functions; refine or split the lexical analysis before approval.'],
  ['srf_alleche:sns_allecher_primary', 'approve', 'Reviewed the sole Corbeau occurrence: alléché is the masculine-singular past participle of allécher, used adjectivally with par l’odeur and meaning attracted/enticed. Lemma, form, sense, and indexed context align; no conflicting same-lemma candidate was found.'],
  ['srf_aller:sns_aller_primary', 'hold', 'The 14 contexts include ordinary movement, “aller son train,” and forms/uses represented by several other active aller lemmas and senses. Reconcile exact Surface + Sense reuse and retain only contexts supported by this sense.'],
  ['srf_amuse:sns_amuser_primary', 'hold', 'The sole source occurrence is reflexive s’amuse à; its contextual sense is “have fun/occupy oneself,” not simply the transitive “amuse.” Check the reflexive construction/identity and replace the self-referential definition before approval.'],
  ['srf_animal:sns_animal_primary', 'approve', 'Reviewed all three occurrences: the noun names an animal in the narrative, including the anthropomorphic formula foi d’animal. Masculine-singular form, animal sense, and contexts agree; no competing same-lemma record was found.'],
  ['srf_apprenez:sns_apprendre_primary', 'hold', 'The imperative in apprenez que means “know/take note that” in this address. Another active apprendre lemma exists in Zola. Resolve contextual gloss and global lemma/sense reuse before approval.'],
  ['srf_arbre:sns_arbre_primary', 'approve', 'Reviewed the sole occurrence in sur un arbre perché: masculine-singular arbre means tree. The indexed form, noun classification, gloss, and source context align; no competing same-lemma record was found.'],
  ['srf_arpenter:sns_arpenter_primary', 'approve', 'Reviewed the sole causative infinitive in fait arpenter les landes: arpenter means to traverse/cross an area. Infinitive form and verb lemma are correct; the learner gloss matches the source use and no competing same-lemma record was found.'],
  ['srf_arriva:sns_arriver_primary', 'hold', 'The six contexts include arrival at a place/time and the construction il arriva que (“it happened that”); the active arriver lemma has separate senses for these uses. Assign each occurrence to the correct sense and reconcile the duplicate lemma before approval.'],
  ['srf_atteindrez:sns_atteindre_primary', 'hold', 'The tortoise context supports “reach/catch up with,” but a separate active atteindre lemma is used in Zola for “affect.” Resolve global lemma reuse and ensure only matching occurrences remain under this sense before approval.'],
  ['srf_au:sns_au_primary', 'approve', 'Reviewed all 56 indexed contexts as the invariant contraction à + le (masculine-singular complement), including temporal, locative, and goal complements. The expansion is the stable teachable function; contextual translation varies but the contracted form and grammatical classification remain consistent.'],
  ['srf_autre:sns_autre_adjective', 'hold', 'The 13 contexts include adjective uses, substantivized forms, and a source heading; another active autre lemma/sense exists in Zola. Resolve annotation/exclusion and part-of-speech plus lemma/sense reuse before approval.'],
  ['srf_aux:sns_aux_primary', 'hold', 'All 29 occurrences are the contraction à + les, but the current gloss “at the” is too narrow across the indexed goal, recipient, and relational contexts; aux dépens is also fixed. Broaden the function/gloss and review the bank questions before approval.'],
  ['srf_avait:sns_avoir_primary', 'hold', 'The 25 occurrences mix lexical possession and compound-tense auxiliary avoir, while the active corpus has several avoir lemmas and distinct senses. Reconcile the global lemma and assign each occurrence to an appropriate teachable sense.'],
  ['srf_avec:sns_avec_primary', 'approve', 'Reviewed all 38 contexts: avec consistently functions as the preposition “with,” covering accompaniment, means, manner, and comparison; these are contextual relations of the same broad preposition rather than conflicting lexical identities. The lemma, form, sense, and uses align.'],
  ['srf_beau:sns_beau_primary', 'hold', 'The five contexts include the fixed construction avoir beau, whose meaning is not “beautiful”; beau also has multiple active lemma/sense candidates. Separate or annotate the construction, correct occurrence assignments, and re-review dependent questions.'],
  ['srf_bec:sns_bec_primary', 'approve', 'Reviewed both occurrences: bec means the bird’s beak, including ouvrir un large bec. Masculine-singular noun, form, sense, and both source contexts align; no competing same-lemma candidate was found.'],
  ['srf_belle:sns_beau_primary', 'hold', 'The 19 contexts support “beautiful” in most uses, but une belle ! in La Parure is an idiomatic exclamation meaning a notable/fine occasion; the corpus also contains multiple beau lemma/sense candidates. Resolve the exceptional occurrence and reuse before approval.'],
  ['srf_bien:sns_bien_discourse', 'hold', 'The sole Eh bien! occurrence is a discourse marker, but the current definition only describes it as not another sense and does not provide its discourse function; another active bien lemma has dedicated discourse senses. Reconcile the duplicate and rewrite the definition.'],
  ['srf_bois:sns_bois_primary', 'approve', 'Reviewed the sole phrase des hôtes de ces bois: bois is plural in the forest/woods sense, not the material wood. The noun sense and source context agree; no competing same-lemma candidate was found.'],
  ['srf_bon:sns_bon_primary', 'hold', 'The four contexts use bon for taste/quality, bon cœur, bon sens, and respectful address; the active corpus has several bon lemmas and distinct senses. Reconcile shared lemma/sense reuse and confirm occurrence-level meanings before approval.'],
  ['srf_bonjour:sns_bonjour_primary', 'approve', 'Reviewed both direct-address greetings, Hé ! bonjour and Bonjour, Jeanne. Bonjour is correctly classified as an interjection/greeting with the same sense in both works; no competing same-lemma candidate was found.'],
  ['srf_bout:sns_bout_primary', 'hold', 'The five contexts include physical end/limit and the idiom en venir à bout; another distinct fixed expression may own the latter meaning. Confirm expression annotation and occurrence-level sense before approval.'],
];

const publication = loadPublication();
const subjectMap = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary').map(subject => [subject.id, subject]));
const blockedIds = auditEditorialQuality(publication).filter(issue => issue.language === 'fr' && issue.kind === 'vocabulary').map(issue => issue.id).sort();
const expectedIds = blockedIds.slice(0, decisions.length);
if (expectedIds.length !== decisions.length || decisions.some(([id], index) => id !== expectedIds[index])) throw new Error('French vocabulary queue changed; prepare and review a fresh batch before applying.');

const duplicateGroups = duplicateCandidates(publication);
const sources = publication.sharedSources.fr;
const reviewMap = new Map(sources.reviews.map(review => [review.id, review]));
const changes = [];
for (const [subjectId, outcome, rationale] of decisions) {
  const subject = subjectMap.get(subjectId);
  if (!subject) throw new Error(`Missing current subject ${subjectId}`);
  const value = subject.value;
  const duplicate = duplicateGroups.find(group => group.lemmaIds.includes(value.lemma.id));
  if (outcome === 'approve' && duplicate) throw new Error(`Unexpected unresolved duplicate candidate for ${subjectId}: ${duplicate.id}`);
  const reviewId = `vocabulary:${subjectId}`;
  const before = reviewMap.get(reviewId);
  let after;
  if (outcome === 'approve') {
    after = approveReview('fr', 'vocabulary', subjectId, value, 'Codex', '2026-09-23T00:00:00.000Z', rationale);
  } else {
    after = pendingReview('fr', 'vocabulary', subjectId, value, rationale);
  }
  reviewMap.set(reviewId, after);
  changes.push({ subjectId, reviewId, outcome, rationale, before, after, reviewedOccurrences: value.occurrences.length });
}

const ledger = {
  version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-23', language: 'fr', subjectKind: 'vocabulary',
  sequence: 1, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
