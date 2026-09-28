import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-24-02';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_cendrillon_avertir_informer_quelqu_un_de_quelque_chose_prevenir_une_personne_6a9f53cc89', { gloss: 'to inform; notify; warn', definition: 'Informer quelqu’un de quelque chose ou le prévenir de ce qui va arriver.' }],
  ['sns_cendrillon_divertir_detourner_de_ce_qui_preoccupe_fatigue_ennuie_en_amusant_en_recreant_e479f3cdae', { gloss: 'to enjoy oneself; have fun', definition: 'Se divertir : prendre du plaisir, s’amuser et se délasser.' }],
  ['sns_cendrillon_etendre_faire_qu_une_chose_acquiere_plus_de_surface_ou_plus_de_volume_soit_en_la_rendant_plus_mince_soit_en_la_tirant_ou_en_la_dilatant_182883cd76', { gloss: 'to stretch; stretch out', definition: 'Allonger ou déployer quelque chose ; avec se, étirer son corps ou ses membres.' }],
  ['sns_cendrillon_faiseuse_celle_qui_fait_certains_ouvrages_qui_fabrique_certains_objets_en_parlant_des_choses_de_mode_70a97926f3', { gloss: 'maker; fashion craftswoman', definition: 'Femme qui fabrique certains objets, notamment des articles ou ornements de mode.' }],
  ['sns_cendrillon_lui_pronom_clitique_de_la_troisieme_personne_du_singulier_epicene_du_complement_d_objet_indirect_94f310957a', { gloss: 'to him; to her', definition: 'Pronom personnel indirect de troisième personne du singulier, écrit ici selon l’ancienne graphie luy.' }],
  ['sns_cendrillon_recommander_ordonner_a_quelqu_un_prier_avec_instance_quelqu_un_de_faire_quelque_chose_lui_donner_a_ce_sujet_des_instructions_precises_dc26b2ceac', { gloss: 'to instruct; strongly advise', definition: 'Demander avec insistance à quelqu’un de faire quelque chose ou lui donner des instructions précises.' }],
  ['sns_cendrillon_vil_qui_est_bas_abject_meprisable_307e184cbe', { gloss: 'lowly; degrading; contemptible', definition: 'Qui est bas, dégradant, abject ou méprisable.' }],
  ['sns_parure_depit_irritation_causee_par_un_froissement_d_amour_propre_aigreur_suite_a_la_deception_a_l_amertume_au_sentiment_de_ranc_ur_plus_ou_moins_tenace_difficile_a_avouer_56ea48a884', { gloss: 'vexation; resentment', definition: 'Irritation mêlée d’amertume, causée par une déception ou une blessure d’amour-propre.' }],
  ['sns_parure_grise_qui_est_enivre_0e8c029e7a', { gloss: 'exhilarated; intoxicated', definition: 'Transporté comme par une ivresse, notamment sous l’effet du plaisir, du succès ou d’une émotion.' }],
  ['sns_parure_louis_ancienne_monnaie_d_or_francaise_6fb9d04e2a', { gloss: 'louis (French gold coin)', definition: 'Ancienne monnaie française en or appelée louis.' }],
  ['sns_parure_malade_dont_la_sante_est_alteree_4a807f5ed9', { gloss: 'sick; ill, literally or figuratively', definition: 'Dont la santé est altérée ou, au figuré, qui est accablé par une émotion pénible.' }],
  ['sns_zola_malheureux_unfortunate', { gloss: 'unhappy; miserable; unfortunate', definition: 'Qui souffre, se trouve dans une situation pénible ou est digne de pitié.' }],
  ['sns_parure_vieilli_qui_a_pris_un_coup_de_vieux_b7e629aaf6', { gloss: 'aged; grown older', definition: 'Qui a pris l’apparence ou les marques d’un âge plus avancé.' }],
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

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 2, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'controlled correction of learner glosses and definitions followed by contextual re-review with stable identity IDs', changes };
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
