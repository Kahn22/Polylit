import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-15';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_gageure:sns_gageure_primary', 'hold', 'The two occurrences refer to the hare–tortoise wager, but the gloss and definition merely say “Gageure is the noun wager/challenge.” Rewrite as a direct learner-facing meaning before approval.'],
  ['srf_gloire:sns_gloire_primary', 'hold', 'The four occurrences include glory, pride, and social prestige; the definition only repeats “Gloire is the noun glory.” Clarify the shared sense or split distinct uses and rewrite the circular definition.'],
  ['srf_grains:sns_grain_primary', 'hold', 'The sole occurrence means medicinal grains/doses of hellebore, but the gloss “Grains is the plural noun grains” is circular and does not explain the measure/item. Rewrite the learner-facing gloss before approval.'],
  ['srf_hate:sns_hater_primary', 'hold', 'The sole occurrence is reflexive se hâter, and an unresolved same-lemma candidate exists. Reconcile the reflexive identity and reuse before approval.'],
  ['srf_he:sns_he_primary', 'approve', 'Reviewed all three uses: Hé addresses the crow, then introduces Cinderella’s “Hé bien !” questions. The interjection “hey/eh” appropriately signals attention or reaction in these contexts.'],
  ['srf_honneur:sns_honneur_primary', 'hold', 'The six uses include honor/pride, faire l’honneur de (“do the honor of”), and faire honneur à a signature (honor/meet an obligation). Verify the phrase-level meanings and whether one broad noun sense covers all occurrences.'],
  ['srf_honteux:sns_honteux_primary', 'hold', 'The two occurrences mean ashamed/embarrassed, but the same-lemma candidate is unresolved. Reconcile the exact adjective sense and reuse before approval.'],
  ['srf_hotes:sns_hote_primary', 'approve', 'Reviewed the sole occurrence: the crow is called the Phoenix among the inhabitants/hosts of these woods. Hôtes is the plural form of hôte, and “inhabitant” fits this context.'],
  ['srf_j_elided:sns_je_primary', 'approve', 'Reviewed all 29 occurrences: j’ is the elided first-person singular subject pronoun before a vowel, with the speaker as grammatical subject throughout. The pronoun identity and elision are correct.'],
  ['srf_je:sns_je_primary', 'approve', 'Reviewed the 80 indexed uses: je consistently marks the first-person singular speaker as subject, including dialogue and narration. The stored pronoun sense is consistent.'],
  ['srf_joie:sns_joie_primary', 'approve', 'Reviewed all four occurrences: joie names the fox’s joy, a cry of joy, and Mathilde’s happiness at the ball. The noun “joy” fits each context.'],
  ['srf_joli:sns_joli_primary', 'hold', 'The sole context is direct praise of the crow’s appearance, but an unresolved same-lemma candidate exists. Reconcile the exact adjective sense and reuse before approval.'],
  ['srf_juge:sns_juge_primary', 'hold', 'The sole use is in the phrase “de quel juge l’on convint” (which judge they agreed on), while a same-lemma duplicate candidate remains unresolved. Reconcile reuse before approval.'],
  ['srf_jura:sns_jurer_primary', 'approve', 'Reviewed the sole occurrence: the crow swore too late that he would not be caught again. Jura is the past historic of jurer, “to swear,” and the meaning matches.'],
  ['srf_laisse:sns_laisser_primary', 'hold', 'The two occurrences use laisser in different constructions (“let the prey fall” and “let the tortoise go”), and an unresolved same-lemma candidate exists. Reconcile the lemma/sense reuse and these construction meanings before approval.'],
  ['srf_landes:sns_lande_primary', 'approve', 'Reviewed the sole occurrence: the hare sends the dogs to traverse the landes, open heath/moorland terrain. The plural noun and gloss “heaths/moorlands” fit.'],
  ['srf_langage:sns_langage_primary', 'approve', 'Reviewed both occurrences: langage is what the fox said and the discourse Scheurer-Kestner used with General Billot. “Speech/discourse” covers both.'],
  ['srf_large:sns_large_primary', 'approve', 'Reviewed all three occurrences: large describes a beak, an envelope, and a box as large/broad in physical dimensions. The adjective sense is stable.'],
  ['srf_lecon:sns_lecon_primary', 'approve', 'Reviewed the sole occurrence: the fox calls its moral a lesson worth a cheese. Leçon means lesson, matching the fable’s explicit moral.'],
  ['srf_leger:sns_leger_primary', 'hold', 'The sole expression animal léger characterizes the hare, likely as fleet/light-footed rather than simply low in weight. Clarify the intended figurative sense and learner gloss before approval.'],
  ['srf_lenteur:sns_lenteur_primary', 'approve', 'Reviewed the sole occurrence: “elle se hâte avec lenteur” contrasts hurrying with slowness. Lenteur means slowness, matching the deliberate paradox.'],
  ['srf_lievre:sns_lievre_primary', 'approve', 'Reviewed both occurrences: one names the hare in the fable title and the other refers to the racing hare in the story. Lièvre means hare.'],
  ['srf_lion_rat_abonde_lem_lion_rat_abonder_verb_ffc4b44fd2_4d99e8dda4:sns_lion_rat_abonder_existe_ou_se_trouve_en_grande_quantite_85fd727f3f', 'approve', 'Reviewed the sole occurrence: the truth is said to abound in evidence. Abonde is the present form of abonder, “abounds,” in a direct literal use.'],
  ['srf_lion_rat_accourut_lem_lion_rat_accourir_verb_b10550943a_1ed4abb851:sns_lion_rat_accourir_courir_venir_promptement_en_un_lieu_ou_quelque_chose_ou_quelqu_un_nous_attire_a3b8a168ad', 'approve', 'Reviewed the sole occurrence: the rat rushed up to the trapped lion. Accourut is the past historic of accourir, meaning to rush/come quickly, matching the action.'],
  ['srf_lion_rat_advint_lem_lion_rat_advenir_verb_f00687d9e9_ffcc6b79c5:sns_lion_rat_advenir_arriver_survenir_se_produire_se_passer_182fa51dab', 'approve', 'Reviewed the sole occurrence: it happened that the lion was caught in nets. Advint is the past historic of advenir, “happened/occurred,” and is correctly assigned.'],
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
  sequence: 15, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
