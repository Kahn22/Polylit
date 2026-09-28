import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-08';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_mocquez_lem_cendrillon_moquer_verb_c555d9fe89_d738f89599:sns_cendrillon_moquer_se_railler_de_quelqu_un_ou_de_quelque_chose_en_rire_en_faire_un_sujet_de_plaisanterie_ou_de_derision_ed5e0baacf', 'approve', 'Reviewed the sole plural occurrence: the stepsisters say Cinderella is mocking them (vous vous moquez de moi). The verb’s reflexive construction and derisive/ridicule sense match.'],
  ['srf_cendrillon_monterent_lem_parure_monter_verb_4231076ad1_77ca1eef78:sns_parure_monter_se_deplacer_vers_le_haut_se_transporter_dans_un_lieu_plus_eleve_s_elever_gravir_grimper_6b007a4305', 'approve', 'Reviewed the sole past-historic occurrence: the transformed footmen climbed onto the back of the carriage. Monter means to move/go up to a higher position; the context supports it.'],
  ['srf_cendrillon_moquer_lem_cendrillon_moquer_verb_c555d9fe89_1d56a99bf4:sns_cendrillon_moquer_se_railler_de_quelqu_un_ou_de_quelque_chose_en_rire_en_faire_un_sujet_de_plaisanterie_ou_de_derision_ed5e0baacf', 'approve', 'Reviewed the sole infinitive in se mirent à rire et à se moquer d’elle: the sisters laugh at and mock Cinderella. The reflexive derision sense, lemma, and context align.'],
  ['srf_cendrillon_mouches_lem_cendrillon_mouche_noun_0f91cc8302_943fd72ff6:sns_cendrillon_mouche_petites_pieces_de_tissu_noir_portees_autrefois_sur_le_visage_comme_ornements_c43eb894b1', 'approve', 'Reviewed the sole historical plural: mouches are decorative black beauty patches ordered from a maker and worn on the face. The source use, noun sense, and gloss align.'],
  ['srf_cendrillon_moustaches_lem_cendrillon_moustache_noun_d046583943_5b0de9b8ff:sns_cendrillon_moustache_poils_qui_poussent_au_dessus_de_la_levre_superieure_00ec7b9df6', 'approve', 'Reviewed the sole plural occurrence: the transformed coachman has a magnificent moustache. The noun and facial-hair definition fit.'],
  ['srf_cendrillon_moy_lem_moi_198cc2d387:sns_cendrillon_moi_pronom_tonique_de_la_premiere_personne_du_singulier_10c9a4a04d', 'hold', 'The five indexed moy forms mix emphatic moi (Moy, dit...), prepositional moi (de moy), and postverbal imperative clitic (apporte moy). The current sense only covers the tonic pronoun; split/reassign grammatical functions and re-review dependent questions.'],
  ['srf_cendrillon_nettoyoit_lem_cendrillon_nettoyer_verb_3741832e2d_ac4b4cb40b:sns_cendrillon_nettoyer_rendre_net_et_propre_f78ea16a94', 'approve', 'Reviewed the sole historical imperfect: Cinderella’s stepmother made her clean the dishes and stairs. Nettoyer means to make clean; the lemma, inflection, and context fit.'],
  ['srf_cendrillon_nopces_lem_cendrillon_noces_noun_f3f51c579f_0ac6e68c44:sns_cendrillon_noces_variante_de_noces_0a8fb7d87f', 'approve', 'Reviewed the sole source occurrence: the wedding celebrations were barely over when the stepmother’s bad temper appeared. Nopces is a historical variant spelling of noces (“wedding”), as recorded.'],
  ['srf_cendrillon_occupe_lem_cendrillon_occupe_adjective_737b40cccb_62f8bab181:sns_cendrillon_occupe_ou_l_on_a_de_l_occupation_747396cd66', 'approve', 'Reviewed the sole masculine occurrence: the prince is occupied/absorbed in looking at Cinderella instead of eating. The adjective occupé means busy/engaged, fitting this context.'],
  ['srf_cendrillon_occupee_lem_cendrillon_occupe_adjective_737b40cccb_b7dc528fa9:sns_cendrillon_occupe_ou_l_on_a_de_l_occupation_747396cd66', 'approve', 'Reviewed the sole feminine occurrence: Cinderella is occupied telling her godmother what happened at the ball. The adjective is correctly inflected and means busy/engaged in an activity.'],
  ['srf_cendrillon_occupees_lem_cendrillon_occupe_adjective_737b40cccb_f11c204b1a:sns_cendrillon_occupe_ou_l_on_a_de_l_occupation_747396cd66', 'approve', 'Reviewed the sole feminine plural: the sisters are busy choosing clothes and hairstyles for the ball. The adjective, number/gender, and sense are correct.'],
  ['srf_cendrillon_oranges_lem_cendrillon_orange_noun_eaf11a3e29_403625b646:sns_cendrillon_orange_fruit_de_l_oranger_agrume_de_couleur_orangee_et_de_forme_spherique_compose_d_une_ecorce_orange_avec_une_chair_juteuse_et_divise_en_loges_par_des_cloisons_9d8dab3766', 'approve', 'Reviewed both contexts: the prince gives oranges to Cinderella, and her sisters recount receiving oranges and lemons. The plural fruit noun and botanical sense fit.'],
  ['srf_cendrillon_osoit_lem_zola_oser_1fd72b7cc8:sns_cendrillon_oser_avoir_la_hardiesse_l_audace_de_dire_de_faire_quelque_chose_6a79cb4f15', 'approve', 'Reviewed the sole imperfect: Cinderella did not dare complain to her father because she feared he would scold her. Oser means to have the courage/audacity to do something, matching the negative use.'],
  ['srf_cendrillon_oublia_lem_cendrillon_oublier_verb_566f91d867_4e0f72d005:sns_cendrillon_oublier_perdre_le_souvenir_de_quelqu_un_ou_quelque_chose_28670e59b4', 'approve', 'Reviewed the sole past-historic occurrence: Cinderella forgot her godmother’s instruction not to stay past midnight. The verb and lose-the-memory-of sense fit.'],
  ['srf_cendrillon_ouvrage_lem_cendrillon_ouvrage_noun_11f17a3db1_bf2fb53bcc:sns_cendrillon_ouvrage_travail_action_de_travailler_380311d5fd', 'hold', 'The indexed contexts mix Cinderella’s chores/work and the damaged ouvrage destroyed by a rat’s tooth (a piece of needlework/work-product). Clarify whether the shared identity covers labor and a made work/product, then split/reassign if needed.'],
  ['srf_cendrillon_ouy_lem_cendrillon_oui_adverb_5c80f0af88_5f6a70da8c:sns_cendrillon_oui_mot_utilise_pour_apporter_une_reponse_affirmative_ou_marquer_l_accord_sur_une_proposition_il_s_emploie_aussi_au_debut_d_une_phrase_qui_ne_repond_pas_a_une_question_exprimee_ou_au_cours_d_une_phrase_pour_marquer_ou_accentuer_le_caractere_affirmatif_de_cette_phrase_il_s_emploie_dans_le_discours_direct_en_reponse_a_une_interrogation_il_est_alors_seul_ou_joint_a_des_adverbes_qui_renforcent_l_affirmation_comme_certes_vraiment_etc_d38774fc75', 'approve', 'Reviewed the sole historical form oüy as an affirmative response to the sisters’ question. It means yes; the form, adverb/interjection use, and sense align.'],
  ['srf_cendrillon_ouy_lem_cendrillon_oui_adverb_5c80f0af88_dd516b6ada:sns_cendrillon_oui_mot_utilise_pour_apporter_une_reponse_affirmative_ou_marquer_l_accord_sur_une_proposition_il_s_emploie_aussi_au_debut_d_une_phrase_qui_ne_repond_pas_a_une_question_exprimee_ou_au_cours_d_une_phrase_pour_marquer_ou_accentuer_le_caractere_affirmatif_de_cette_phrase_il_s_emploie_dans_le_discours_direct_en_reponse_a_une_interrogation_il_est_alors_seul_ou_joint_a_des_adverbes_qui_renforcent_l_affirmation_comme_certes_vraiment_etc_d38774fc75', 'approve', 'Reviewed both oüy occurrences: Cinderella answers yes to her godmother, then says yes, but asks whether she must go to the ball in those clothes. Both use the affirmative response/yes sense.'],
  ['srf_cendrillon_paillasse_lem_cendrillon_paillasse_noun_b77619b756_53abde7dab:sns_cendrillon_paillasse_grande_enveloppe_de_toile_ordinairement_remplie_de_paille_dont_on_garnissait_un_lit_3dff9f94d4', 'approve', 'Reviewed the sole occurrence: Cinderella sleeps in the attic on a poor straw-filled mattress, unlike her sisters’ fashionable beds. Paillasse means a straw mattress/pallet; the definition fits.'],
  ['srf_cendrillon_paire_lem_cendrillon_paire_noun_e02e8b1b25_88b0c5f71a:sns_cendrillon_paire_deux_choses_de_meme_espece_qui_vont_necessairement_ou_ordinairement_ensemble_b2b1de161d', 'approve', 'Reviewed the sole occurrence: the fairy gives Cinderella a matching pair of glass footwear. Paire means two corresponding things that go together, exactly as defined.'],
  ['srf_cendrillon_pantoufles_lem_cendrillon_pantoufle_noun_4a911c8ad5_bfb46b74b7:sns_cendrillon_pantoufle_chaussure_d_interieur_que_l_on_met_chez_soi_pour_etre_plus_a_l_aise_f4799862bc', 'hold', 'Perrault’s pantoufles de verre are Cinderella’s formal ball shoes, not indoor comfort footwear. The current definition is too narrow and misleading for every indexed occurrence; add the historical shoe sense and re-review.'],
  ['srf_cendrillon_pardon_lem_cendrillon_pardon_noun_6dcad3dadf_5f3a6114d3:sns_cendrillon_pardon_action_de_pardonner_une_faute_une_offense_9476c0b0c1', 'approve', 'Reviewed the sole occurrence: the sisters ask forgiveness for the harm they caused. Pardon means the act of forgiving an offense; the noun and context agree.'],
  ['srf_cendrillon_pardonnoit_lem_cendrillon_pardonner_verb_b2bdbb0f74_b877c761ad:sns_cendrillon_pardonner_accorder_le_pardon_d_une_faute_commise_ne_garder_aucun_ressentiment_d_une_injure_recue_note_d_usage_en_ce_sens_il_a_toujours_le_nom_de_la_chose_pour_complement_direct_et_le_nom_de_la_personne_pour_complement_indirect_avec_la_preposition_513cac2862', 'approve', 'Reviewed the sole historical imperfect: Cinderella forgave her sisters wholeheartedly. Pardonner means to forgive an offense and hold no resentment; its direct/indirect object usage note is consistent with the construction.'],
  ['srf_cendrillon_parfaitement_lem_cendrillon_parfaitement_adverb_b5c0307a44_7851976be5:sns_cendrillon_parfaitement_d_une_maniere_parfaite_2948ce3eb4', 'approve', 'Reviewed the sole occurrence: Cinderella did the sisters’ hair perfectly well. The adverb parfaitement expresses doing something perfectly, exactly as used.'],
  ['srf_cendrillon_parloit_lem_zola_parler_9f33fecb95:sns_cendrillon_parler_user_de_la_faculte_du_langage_proferer_prononcer_articuler_des_mots_ad9694cc7b', 'approve', 'Reviewed the sole historical imperfect: the household talked only about how they would dress. Parler means to use speech/say words here; the form and conversational context align.'],
  ['srf_cendrillon_parquetees_lem_cendrillon_parqueter_verb_5442691af1_466315463a:sns_cendrillon_parqueter_garnir_d_un_parquet_17b470d791', 'hold', 'The source says the sisters slept in parquet-floored rooms; the gloss “historical or contextual form of parqueter” is not a learner meaning and the participial adjective should be explained as floored with parquet. Rewrite the gloss before approval.'],
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
  sequence: 8, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
