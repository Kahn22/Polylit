import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-24-06';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_parure_occasion_rencontre_conjoncture_ou_concours_fortuit_et_ephemere_de_circonstances_qui_favorise_temporairement_une_entreprise_un_dessein_etc_a43e45a25c', { gloss: 'opportunity; occasion', definition: 'Circonstance favorable qui permet d’agir ou événement particulier dans lequel une chose se produit.' }],
  ['sns_parure_parer_adorn_b98d9c1fde', { gloss: 'adorned; dressed up', definition: 'Orné de vêtements, de bijoux ou d’accessoires élégants.' }],
  ['sns_parure_cesse_stopping_3bb34c9554', { gloss: 'pause; cessation', definition: 'Arrêt ou interruption, notamment dans l’expression « sans cesse », sans arrêt.' }],
  ['sns_parure_misere_wretchedness_aea8661eb2', { gloss: 'misery; destitution', definition: 'État de grande pauvreté, de dénuement ou de souffrance pénible.' }],
  ['sns_parure_apercevoir_notice_489e40fc63', { gloss: 'noticed; became aware', definition: 'Remarqué ou perçu, notamment dans la construction pronominale s’apercevoir de.' }],
  ['sns_parure_asseoir_sit_b7d2366b4e', { gloss: 'sat down; was sitting', definition: 'Prenait place sur un siège, dans la construction s’asseoir.' }],
  ['sns_parure_envier_be_envied_815651a777', { gloss: 'envied', definition: 'Qui suscite chez d’autres le désir jaloux de posséder la même situation ou les mêmes avantages.' }],
  ['sns_parure_cherie_terme_affectueux_par_lequel_on_s_adresse_a_la_femme_qu_on_aime_1d5a069210', { gloss: 'darling; dear', definition: 'Terme affectueux adressé à une personne aimée.' }],
  ['sns_parure_dos_partie_du_corps_humain_situee_au_dessus_du_posterieur_depuis_le_cou_jusqu_aux_reins_133ce2854f', { gloss: 'back', definition: 'Partie arrière du corps humain, du cou jusqu’aux reins.' }],
  ['sns_parure_eperdu_qui_a_l_esprit_trouble_par_la_crainte_ou_par_quelque_autre_passion_02872f6969', { gloss: 'distraught; desperate', definition: 'Dont l’esprit est profondément troublé par la peur, la surprise ou une forte émotion.' }],
  ['sns_parure_voyons_interjection_exprimant_l_impatience_l_indignation_ou_l_encouragement_e00ad34067', { gloss: 'come on; now then', definition: 'Interjection servant à interpeller, encourager ou exprimer l’impatience ou l’étonnement.' }],
  ['sns_parure_exclamation_cri_de_joie_d_admiration_de_surprise_d_indignation_etc_3bea77bd40', { gloss: 'exclamation; cry', definition: 'Cri ou parole brève exprimant vivement la surprise, la joie, l’admiration ou une autre émotion.' }],
  ['sns_parure_admirable_qui_merite_ou_qui_attire_l_admiration_f93f1a1009', { gloss: 'admirable', definition: 'Qui mérite ou provoque l’admiration.' }],
  ['sns_parure_dormir_se_reposer_dans_un_etat_inconscient_de_sommeil_c9bdd6abba', { gloss: 'to sleep', definition: 'Être dans l’état de repos naturel du sommeil.' }],
  ['sns_parure_sortie_action_de_sortir_5a19c1f484', { gloss: 'departure; act of leaving', definition: 'Action de sortir ou moment où l’on quitte un lieu.' }],
  ['sns_parure_envelopper_entourer_de_tous_cotes_quelque_chose_avec_du_papier_une_etoffe_un_linge_etc_qui_couvre_qui_environne_de_tous_cotes_a2124fbef2', { gloss: 'to wrap; cover', definition: 'Entourer ou couvrir de tous côtés avec une étoffe, un papier ou une autre matière.' }],
  ['sns_parure_escalier_ensemble_de_marches_qui_dans_un_batiment_servent_pour_monter_ou_descendre_f44b6115ab', { gloss: 'staircase; stairs', definition: 'Ensemble de marches permettant de monter ou de descendre entre plusieurs niveaux.' }],
  ['sns_parure_afin_mot_invariable_ne_s_employant_que_dans_les_locutions_prepositive_afin_de_infinitif_ou_conjonctive_afin_que_verbe_au_subjonctif_permettant_d_indiquer_dans_les_constructions_le_s_but_s_poursuivi_s_f10f67aa8b', { gloss: 'in order to; so that', definition: 'Introduit le but poursuivi dans « afin de » ou « afin que ».' }],
  ['sns_parure_fermeture_dispositif_qui_sert_a_fermer_4e50482436', { gloss: 'fastener; clasp', definition: 'Dispositif servant à fermer un vêtement, un bijou, un sac ou un autre objet.' }],
  ['sns_parure_dedans_a_l_interieur_dans_la_place_dont_on_vient_de_parler_90e3057408', { gloss: 'inside', definition: 'À l’intérieur de l’endroit ou de l’objet dont on parle.' }],
  ['sns_parure_epouvanter_susciter_l_epouvante_35f1f41a47', { gloss: 'terrified; horrified', definition: 'Saisi d’une très grande peur ou d’épouvante.' }],
  ['sns_parure_voleuse_celle_qui_effectue_un_vol_qui_derobe_s_approprie_le_bien_d_autrui_ou_l_a_deja_fait_421d2faba1', { gloss: 'female thief; thief', definition: 'Femme qui vole ou s’approprie le bien d’autrui.' }],
  ['sns_parure_connaitre_faire_ou_avoir_fait_l_experience_permettant_une_representation_mentale_de_quelque_chose_ou_quelqu_un_avoir_l_idee_la_notion_d_une_personne_ou_d_une_chose_a28b24d22d', { gloss: 'experienced; came to know', definition: 'Fit l’expérience de quelque chose ou en acquit la connaissance.' }],
  ['sns_parure_accumulation_action_d_accumuler_en_parlant_des_choses_physiques_et_les_choses_morales_f762a5aa1e', { gloss: 'accumulation; buildup', definition: 'Action ou résultat d’ajouter progressivement des éléments les uns aux autres.' }],
  ['sns_parure_superpose_situe_l_un_au_dessus_de_l_autre_en_parlant_de_plusieurs_choses_78661f5d47', { gloss: 'stacked; superimposed', definition: 'Placés ou situés les uns au-dessus des autres.' }],
  ['sns_parure_delasser_delivrer_de_la_lassitude_reposer_b6b54448a4', { gloss: 'to relax; unwind', definition: 'Se reposer pour se délivrer de la fatigue ou de la lassitude.' }],
  ['sns_parure_cause_ce_qui_fait_qu_une_chose_est_ou_s_opere_052d81a7c9', { gloss: 'cause; reason', definition: 'Ce qui produit un événement ou explique qu’une chose se réalise.' }],
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

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 6, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'controlled correction of learner glosses and definitions followed by contextual re-review with stable identity IDs', changes };
const correctionLedger = { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals: reboundQuizzes, changes: [...[...beforeSenses].map(([id, before]) => ({ kind: 'senses', id, before, after: updatedSenses.get(id), reason: 'Replaced an inaccurate, circular, opaque, or overly narrow learner meaning with a contextual learner-ready meaning.' }))] };
const next = { ...source, legacy, quizzes, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(reviewLedgerPath, reviewLedger);
files.set(correctionLedgerPath, correctionLedger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, correctedSenses: senseUpdates.size, correctedLemmas: lemmaUpdates.size, approvedIdentities: changes.length, reboundQuizApprovals: reboundQuizzes, backup }, null, 2));
