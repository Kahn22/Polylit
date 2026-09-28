import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-07';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_lever_lem_cendrillon_lever_verb_cd3ae248ec_85d120d3b3:sns_cendrillon_lever_faire_qu_une_chose_soit_plus_haut_qu_elle_n_etait_afa9cae8c6', 'approve', 'Reviewed the sole infinitive: Cinderella is asked to lift the trapdoor slightly so the mice can leave. Lever means to raise/lift; lemma, form, and context align.'],
  ['srf_cendrillon_lezards_lem_cendrillon_lezard_noun_ad1a2d859b_b90c381c66:sns_cendrillon_lezard_petit_reptile_a_quatre_pattes_et_a_longue_queue_3f7598a6a2', 'approve', 'Reviewed both occurrences: six lizards are found behind the watering can, transformed into footmen, then threatened with returning to lizards at midnight. The plural noun and reptile sense fit.'],
  ['srf_cendrillon_lits_lem_cendrillon_lit_noun_aff294ab78_df17294b93:sns_cendrillon_lit_meuble_sur_lequel_on_se_couche_pour_dormir_generalement_compose_d_un_cadre_de_bois_ou_de_metal_qu_on_garnit_d_un_sommier_ou_d_une_paillasse_d_un_ou_plusieurs_matelas_d_un_traversin_d_un_ou_plusieurs_oreillers_de_draps_et_de_couvertures_d48f30cee6', 'approve', 'Reviewed the sole plural occurrence: the stepsisters had fashionable beds, contrasted with Cinderella’s attic pallet. The noun lit and sleeping-furniture sense are accurate.'],
  ['srf_cendrillon_loger_lem_cendrillon_loger_verb_5d9ba761df_fb0532af3e:sns_cendrillon_loger_sejourner_avoir_sa_demeure_habituelle_ou_temporaire_dans_un_logis_4e5fea2575', 'hold', 'The source says Cinderella had her sisters lodged at the palace (faire loger ses sœurs), a causative/transitive “house/accommodate” use. The current definition only covers staying/residing oneself; refine the transitive sense before approval.'],
  ['srf_cendrillon_logis_lem_cendrillon_logis_noun_d4b77d124c_6a67443b60:sns_cendrillon_logis_endroit_ou_l_on_demeure_346739dac9', 'approve', 'Reviewed the sole occurrence: Cucendron is the name used in the household/logis where Cinderella lives. The noun means dwelling/home/house, matching the context.'],
  ['srf_cendrillon_longtemps_lem_cendrillon_longtemps_adverb_38765dedaa_44bb3ce923:sns_cendrillon_longtemps_pendant_un_long_temps_0126f3c118', 'approve', 'Reviewed both occurrences: Cinderella watches her sisters as long as she can, and the sisters take a long time to return from the ball. Longtemps expresses extended duration in each.'],
  ['srf_cendrillon_luy_lem_lui_9aa29a354e:sns_cendrillon_lui_pronom_clitique_de_la_troisieme_personne_du_singulier_epicene_du_complement_d_objet_indirect_94f310957a', 'hold', 'The many indexed luy forms function as third-person indirect-object clitics, often referring to women; the learner gloss incorrectly lists subject/prepositional forms and only masculine “him.” Replace it with a concise “to him/to her” gloss and re-review.'],
  ['srf_cendrillon_magnificence_lem_cendrillon_magnificence_noun_57cddf0e8e_a956b769a2:sns_cendrillon_magnificence_caractere_magnifique_de_quelque_chose_ou_de_quelqu_un_9ad099cd6a', 'hold', 'The source means Cinderella’s splendor/magnificent appearance at the ball, but the English gloss is the opaque cognate “magnificence.” Replace it with a learner-friendly equivalent and re-review.'],
  ['srf_cendrillon_manchettes_lem_cendrillon_manchette_noun_b893c7588a_6c211bec72:sns_cendrillon_manchette_extremite_empesee_ou_non_des_manches_de_chemise_formant_une_sorte_de_poignet_fixe_ou_mobile_2f48d239d0', 'approve', 'Reviewed the sole plural occurrence: Cinderella irons her stepsisters’ linen and embroiders/godrons their cuffs. Manchettes are sleeve cuffs; the plural form and definition align.'],
  ['srf_cendrillon_mangea_lem_parure_manger_verb_8ebe8c88db_b490262852:sns_cendrillon_manger_macher_et_avaler_un_aliment_dans_le_but_de_se_nourrir_4e81ee0753', 'approve', 'Reviewed the sole past-historic occurrence: the prince did not eat the light meal because he was absorbed in observing Cinderella. Manger means to eat food, as defined.'],
  ['srf_cendrillon_manger_lem_parure_manger_verb_8ebe8c88db_1d09694047:sns_cendrillon_manger_macher_et_avaler_un_aliment_dans_le_but_de_se_nourrir_4e81ee0753', 'approve', 'Reviewed the sole infinitive: the sisters go almost two days without eating because they are excited. The verb manger and eating/food sense fit the negative construction.'],
  ['srf_cendrillon_maniere_lem_cendrillon_maniere_noun_2bccec340f_6a1c130cb5:sns_cendrillon_maniere_facon_dont_une_chose_se_produit_cbbad29ad5', 'approve', 'Reviewed the sole occurrence: the sisters discuss the manner/style in which they will dress. Manière means way/manner; the noun sense is precise for this context.'],
  ['srf_cendrillon_manqueroit_lem_cendrillon_manquer_verb_5bb1a65fb3_ee0fdf57b0:sns_cendrillon_manquer_faillir_tomber_en_faute_c7512f1e5a', 'hold', 'The context promises that Cinderella would not fail to leave before midnight (ne manquerait pas de sortir), but the learner gloss says “lack/be short of,” a different construction. Correct the gloss for manquer de + infinitive and re-review.'],
  ['srf_cendrillon_maraine_lem_cendrillon_marraine_noun_f860f84050_8882d87194:sns_cendrillon_marraine_celle_qui_avec_le_parrain_presente_un_enfant_le_filleul_aux_fonts_baptismaux_mere_spirituelle_d_un_enfant_ou_assiste_l_enfant_de_maniere_analogue_dans_une_ceremonie_civile_ou_d_une_autre_religion_ou_conviction_cff058e91d', 'hold', 'All contexts mean Cinderella’s fairy godmother/protective sponsor, while the gloss only labels an historical form and the definition is a highly specific baptismal role. Clarify the contextual godmother sense without changing the historical spelling.'],
  ['srf_cendrillon_mauvais_lem_cendrillon_mauvais_adjective_0dfaa93894_ee2ce09a84:sns_cendrillon_mauvais_defavorable_qui_cause_une_impression_defavorable_378968b987', 'approve', 'Reviewed the sole plural phrase mauvais traitements: the sisters caused Cinderella bad/mistreatment. The adjective mauvais and unfavorable/poor-quality sense fit the collocation.'],
  ['srf_cendrillon_mauvaise_lem_cendrillon_mauvais_adjective_0dfaa93894_0b5298c4bb:sns_cendrillon_mauvais_defavorable_qui_cause_une_impression_defavorable_378968b987', 'approve', 'Reviewed the sole feminine occurrence mauvaise humeur: the stepmother displays a bad/ill temper. The adjective inflection and negative-quality sense align.'],
  ['srf_cendrillon_mechans_lem_cendrillon_mechant_adjective_d6c99f0d95_52525c0545:sns_cendrillon_mechant_mauvais_contraire_de_bon_95fba00ab4', 'hold', 'The two indexed méchans habits are shabby/old clothes, not morally bad clothing; “bad” alone is ambiguous and the definition only says opposite of good. Add the poor-quality/worn sense or contextual gloss before approval.'],
  ['srf_cendrillon_mena_lem_zola_mener_cef3425837:sns_cendrillon_mener_conduire_quelqu_un_vers_un_etre_ou_une_chose_bae34c2fe3', 'approve', 'Reviewed all three occurrences: the fairy takes Cinderella to her room, the prince leads her into the hall, and the sisters take her to the prince. Mener means to lead/take someone somewhere in each.'],
  ['srf_cendrillon_mener_lem_zola_mener_e37b7ea3d1:sns_cendrillon_mener_conduire_quelqu_un_vers_un_etre_ou_une_chose_bae34c2fe3', 'approve', 'Reviewed the sole infinitive in la prit pour la mener danser: the prince takes/leads Cinderella to dance. The lemma, form, and lead/take-someone-to sense match.'],
  ['srf_cendrillon_menue_lem_cendrillon_menu_adjective_96369decd9_e99aacf65c:sns_cendrillon_menu_qui_est_delie_qui_a_peu_de_volume_peu_de_grosseur_4b2e043faa', 'approve', 'Reviewed the sole feminine form: the sisters tighten their laces to make their waists slimmer. Menuë means slender/small in build here; the adjective and context align.'],
  ['srf_cendrillon_mere_lem_cendrillon_mere_noun_756760135e_8a02a83b02:sns_cendrillon_mere_femme_qui_a_donne_naissance_a_au_moins_un_enfant_03e4c88001', 'approve', 'Reviewed the sole capitalized occurrence: Cinderella inherited her gentleness from her mother, who is described as the best person. The kinship noun mère and sense align.'],
  ['srf_cendrillon_mesdamoiselles_lem_cendrillon_mesdemoiselles_noun_a51572646e_35bf091ef2:sns_cendrillon_mesdemoiselles_pluriel_de_mademoiselle_employe_pour_s_adresser_a_plusieurs_jeunes_femmes_ab4ebf8921', 'approve', 'Reviewed the direct-address occurrence Helas ! Mesdamoiselles: Cinderella addresses the two young women politely. This is the historical plural address form of mademoiselle; lemma, use, and definition align.'],
  ['srf_cendrillon_mesdemoiselles_lem_cendrillon_mademoiselle_noun_53bc6555dd_572e952957:sns_cendrillon_mademoiselle_pluriel_de_mademoiselle_employe_pour_s_adresser_a_plusieurs_jeunes_femmes_14808b395d', 'approve', 'Reviewed the sole occurrence Mesdemoiselles ses filles: the stepmother’s daughters are referred to with the plural honorific. The plural form and young-lady title sense fit.'],
  ['srf_cendrillon_miroir_lem_cendrillon_miroir_noun_d89a5e7a64_3255c6af29:sns_cendrillon_miroir_glace_de_verre_ou_de_cristal_etamee_de_petite_taille_ou_metal_poli_ou_l_on_peut_regarder_son_image_reflechie_c26c9ebcc1', 'approve', 'Reviewed the sole occurrence: the sisters spend time in front of their mirror. Miroir denotes a reflective glass used to see one’s image, exactly as defined.'],
  ['srf_cendrillon_miroirs_lem_cendrillon_miroir_noun_d89a5e7a64_17d55cc0d9:sns_cendrillon_miroir_glace_de_verre_ou_de_cristal_etamee_de_petite_taille_ou_metal_poli_ou_l_on_peut_regarder_son_image_reflechie_c26c9ebcc1', 'approve', 'Reviewed the sole plural occurrence: the stepsisters have mirrors in their fashionable bedrooms. Miroirs is the plural of miroir and the reflective-object sense is consistent.'],
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
  sequence: 7, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
