import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-25-07';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_parure_chere_personne_consideree_comme_chere_qui_est_tenu_avec_une_affectueuse_haute_estime_ou_par_ironie_a_qui_est_adressee_une_forme_de_dedain_58e0779114', { gloss: 'darling; dear', definition: 'Personne à laquelle on s’adresse avec affection ou familiarité ; le terme peut aussi être employé ironiquement.' }],
  ['sns_zola_camarade_colleague', { gloss: 'classmate; companion', definition: 'Personne qui fréquente ou a fréquenté le même établissement, ou qui partage un groupe ou une activité avec une autre.' }],
  ['sns_parure_compte_action_de_compter_denombrement_calcul_opere_sur_tel_ou_tel_ensemble_de_choses_resultat_de_cette_action_1acd6f6623', { gloss: 'accounts; calculations', definition: 'Ensemble de sommes notées ou calculées, ou résultat de leur dénombrement.' }],
  ['sns_parure_fleur_organe_reproducteur_des_angiospermes_ou_plantes_a_fleurs_constitue_des_organes_de_la_reproduction_sexuee_etamines_carpelles_et_de_leurs_enveloppes_protectrices_sepales_petales_b987f3d207', { gloss: 'flower', definition: 'Partie d’une plante, souvent colorée, qui porte ses organes reproducteurs et dont les pétales attirent souvent le regard.' }],
  ['sns_parure_amuser_divertir_par_des_choses_agreables_77b0925222', { gloss: 'to amuse; enjoy oneself', definition: 'Divertir quelqu’un ; à la forme pronominale, prendre plaisir à une activité.' }],
  ['sns_parure_laisser_allow_9b583fe23f', { gloss: 'to let; allow; let fall', definition: 'Ne pas empêcher une action de se produire ou laisser tomber quelque chose ; le sens dépend de la construction.' }],
  ['sns_parure_tourner_mouvoir_en_rond_par_un_mouvement_circulaire_ou_en_ligne_courbe_autour_d_un_axe_de_rotation_219c87f17f', { gloss: 'to turn; turn toward', definition: 'Changer d’orientation ou de direction ; avec se, orienter son corps vers quelqu’un ou quelque chose.' }],
  ['sns_parure_dresser_faire_tenir_droit_verticalement_6d37f7f7ff', { gloss: 'to stand up; rise', definition: 'Avec se, se redresser ou se mettre debout ; dresser quelque chose signifie le placer en position verticale.' }],
  ['sns_parure_coucher_etendre_de_son_long_sur_la_terre_sur_un_lit_etc_mettre_quelque_chose_en_position_horizontale_4a02e0bbf1', { gloss: 'to lie down; go to bed', definition: 'Étendre son corps sur un lit ou ailleurs, souvent dans la construction pronominale se coucher.' }],
  ['sns_parure_creuse_en_parlant_du_visage_ou_de_parties_du_visage_empreint_de_creux_emacie_b45f32a206', { gloss: 'drawn; hollow-cheeked', definition: 'En parlant du visage ou de ses parties, marqué par des creux et amaigri.' }],
  ['sns_parure_reprendre_prendre_de_nouveau_002348fae7', { gloss: 'to take back; buy back', definition: 'Accepter le retour d’un objet ou l’acquérir de nouveau, notamment selon une condition de rachat.' }],
]);
const reviewOnlyIds = new Set([
  'srf_cendrillon_bonnes_lem_bon_a6893c85fc:sns_cendrillon_bon_qui_a_des_qualites_conformes_a_ce_que_l_on_attendait_a8ac37b640',
  'srf_parure_jolies_joli_adjective_3148819c3c:sns_parure_joli_pretty_a9fdf55348',
  'srf_parure_jolie_lem_joli_efaa15ed3f:sns_parure_joli_qui_a_de_la_grace_de_l_agrement_c9d52e1cf5',
  'srf_parure_coupes_lem_parure_coupe_noun_faf92e4311_5e0e155f0d:sns_parure_coupe_voiture_hippomobile_fermee_raccourcie_au_nombre_de_places_limite_b052c9dbca',
  'srf_parure_reservait_lem_parure_reserver_verb_bd2ed54cd6_cc7789a07b:sns_parure_reserver_garder_retenir_quelque_chose_d_un_tout_une_chose_entre_plusieurs_autres_d6e0cec960',
]);

const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const beforeSenses = new Map(content.senses.filter(sense => senseUpdates.has(sense.id)).map(sense => [sense.id, sense]));
if (beforeSenses.size !== senseUpdates.size) throw new Error('Correction targets changed');
content.senses = content.senses.map(sense => senseUpdates.has(sense.id) ? { ...sense, ...senseUpdates.get(sense.id) } : sense);
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const updatedSenses = new Map(content.senses.map(sense => [sense.id, sense]));
const updatedLemmas = new Map(content.lemmas.map(lemma => [lemma.id, lemma]));
const surfaces = new Map(content.surfaceForms.map(surface => [surface.id, surface]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'vocabulary' && (senseUpdates.has(subject.value.sense.id) || reviewOnlyIds.has(subject.id)));
const requiredReviewIds = new Set([...reviewOnlyIds]);
for (const subject of subjects) requiredReviewIds.add(subject.id);
if (!subjects.length || [...requiredReviewIds].some(id => !subjects.some(subject => subject.id === id))) throw new Error('Vocabulary review targets changed');
const rationale = 'Reviewed every indexed source context and the learner-facing meaning; corrected senses also received a fresh review of their unchanged dependent questions. Permanent vocabulary identity and occurrence IDs remain stable.';
const changes = subjects.map(subject => {
  const value = subject.value;
  const revised = { ...value, lemma: updatedLemmas.get(value.lemma.id), sense: updatedSenses.get(value.sense.id) };
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, revised, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: value.occurrences.length };
});

let reboundQuizzes = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary' || !senseUpdates.has(quiz.subject.senseId)) continue;
  const surface = surfaces.get(quiz.subject.surfaceFormId);
  const sense = updatedSenses.get(quiz.subject.senseId);
  const lemma = updatedLemmas.get(surface.lemmaId);
  const reason = 'Re-reviewed the authored question after its target meaning was clarified; context, target, answer, grammatical fit, distractors, and band remain valid.';
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense, lemma } }, 'Codex', '2026-09-25T00:00:00.000Z', reason));
  reboundQuizzes++;
}

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', sequence: 7, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'contextual sense correction and exact-version question re-review; separate unmodified approvals for fully accurate identities', changes };
const correctionLedger = { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals: reboundQuizzes, changes: [...[...beforeSenses].map(([id, before]) => ({ kind: 'senses', id, before, after: updatedSenses.get(id), reason: 'Replaced a wrong, too narrow, or overly technical learner meaning with a contextual learner-ready meaning.' }))] };
const next = { ...source, legacy, quizzes, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(reviewLedgerPath, reviewLedger);
files.set(correctionLedgerPath, correctionLedger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, correctedSenses: senseUpdates.size, reviewedIdentities: changes.length, reboundQuizApprovals: reboundQuizzes, backup }, null, 2));
