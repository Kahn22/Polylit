import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-04';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_coeffeuse_lem_cendrillon_coiffeuse_noun_bdcc6acc63_a4011468c2:sns_cendrillon_coiffeuse_artisane_salariee_ou_meme_jadis_employee_de_maison_dont_le_metier_est_de_couper_et_coiffer_les_cheveux_c6556929b6', 'hold', 'In context, coëffeuse is a person asked to style the sisters’ hair (a hairdresser), while the learner gloss says “dressing table,” a piece of furniture. Correct the gloss and re-review this identity.'],
  ['srf_cendrillon_coeffure_lem_cendrillon_coiffure_noun_caff90a480_72128f0e5f:sns_cendrillon_coiffure_maniere_dont_on_arrange_les_cheveux_selon_le_pays_et_la_mode_8b6f84f977', 'hold', 'The indexed coëffure is the hairstyle/arrangement of hair, not headwear or a garment worn on the head. Correct the learner gloss to agree with the sense definition, then re-review both forms sharing this lemma and sense.'],
  ['srf_cendrillon_coeffures_lem_cendrillon_coiffure_noun_caff90a480_cd4c23b8f6:sns_cendrillon_coiffure_maniere_dont_on_arrange_les_cheveux_selon_le_pays_et_la_mode_8b6f84f977', 'hold', 'The indexed plural coëffures are hairstyles the sisters select to wear, not headwear or garments. Correct the learner gloss to agree with the sense definition, then re-review both forms sharing this lemma and sense.'],
  ['srf_cendrillon_collation_lem_cendrillon_collation_noun_84865d90cc_1e5a97744f:sns_cendrillon_collation_repas_leger_que_les_catholiques_font_les_jours_de_jeune_pour_remplacer_le_souper_et_par_extension_un_repas_leger_pris_au_cours_de_la_journee_ccf386d9fe', 'hold', 'The context is a light meal served at the ball, but the gloss says “the process of granting an academic degree,” a different sense. Correct the learner gloss and re-review the exact sense.'],
  ['srf_cendrillon_commenca_lem_zola_commencer_58ce2d889a:sns_cendrillon_commencer_engager_une_action_entreprendre_une_tache_donner_a_une_chose_un_commencement_d_existence_7eea7f8957', 'approve', 'Reviewed the sole occurrence: essayer la pantoufle aux Princesses begins with the princesses and continues through the court. The past-historic form commença, lemma commencer, and initiate/begin sense align.'],
  ['srf_cendrillon_communement_lem_cendrillon_communement_adverb_e70fa7de1d_9adbcdda3b:sns_cendrillon_communement_le_plus_ordinairement_25ad2734b1', 'approve', 'Reviewed the sole occurrence: Cinderella was commonly/usually called Cucendron in the household. The adverb communément and “most usually” definition fit; no collective or communal sense is indexed here.'],
  ['srf_cendrillon_compagnie_lem_parure_compagnie_noun_68f6feef99_cecc4ef147:sns_parure_compagnie_reunion_de_plusieurs_personnes_assemblees_pour_le_plaisir_d_etre_en_societe_98b96af92b', 'approve', 'Reviewed both contexts: the assembled company is in the hall, and Cinderella bows to the company before leaving. Compagnie means a gathering/group of people; the noun identity and definition fit both.'],
  ['srf_cendrillon_connoissoient_lem_zola_connaitre_0fdb6cf247:sns_cendrillon_connaitre_faire_ou_avoir_fait_l_experience_permettant_une_representation_mentale_de_quelque_chose_ou_quelqu_un_avoir_l_idee_la_notion_d_une_personne_ou_d_une_chose_832d4989ec', 'approve', 'Reviewed the sole historical imperfect connoissoient: the sisters did not know Cinderella. Connaître and the personal-familiarity/knowledge sense fit the context; the old spelling is preserved.'],
  ['srf_cendrillon_connoissoit_lem_zola_connaitre_17feeb34fd:sns_cendrillon_connaitre_faire_ou_avoir_fait_l_experience_permettant_une_representation_mentale_de_quelque_chose_ou_quelqu_un_avoir_l_idee_la_notion_d_une_personne_ou_d_une_chose_832d4989ec', 'approve', 'Reviewed both historical imperfect connoissoit occurrences: the prince had never encountered the stranger, and the sisters did not know her identity. The same personal-knowledge sense of connaître fits each use.'],
  ['srf_cendrillon_considerer_lem_cendrillon_considerer_verb_7b6c9f7c8e_977d844155:sns_cendrillon_considerer_regarder_attentivement_1355ee8f74', 'approve', 'Reviewed both occurrences: the women attentively consider the stranger’s hair and clothes, and the prince is absorbed in looking at her. Considerer here means to observe/look at attentively; both contexts align.'],
  ['srf_cendrillon_conte_lem_cendrillon_conte_noun_4360dce51b_4a316ed930:sns_cendrillon_conte_recit_d_aventures_imaginaires_soit_qu_elles_aient_de_la_vraisemblance_ou_que_s_y_mele_du_merveilleux_du_feerique_739b33a287', 'approve', 'Reviewed the sole verse Car ainsi sur ce conte on va moralisant: conte is the story/tale being moralized. The noun gloss, imaginative-narrative definition, and metatextual context agree.'],
  ['srf_cendrillon_contempler_lem_parure_contempler_verb_5796339ee0_2457f6c3b6:sns_parure_contempler_considerer_avec_toute_la_force_de_son_attention_soit_avec_les_yeux_soit_par_la_pensee_74f759fac8', 'approve', 'Reviewed the sole occurrence: everyone is attentive to contemplating the stranger’s beauty. The verb means to gaze at/observe intently, matching the indexed context and sense definition.'],
  ['srf_cendrillon_courage_lem_cendrillon_courage_noun_5f5f99cbee_7a5707774c:sns_cendrillon_courage_capacite_d_un_humain_ou_un_autre_animal_de_vaincre_sa_peur_pour_braver_le_danger_supporter_la_souffrance_entreprendre_des_choses_effrayantes_douloureuses_ou_difficiles_d673328332', 'approve', 'Reviewed the sole verse D’avoir de l’esprit, du courage: courage is the quality of bravery/fortitude, paired with wit. The noun, plain-English gloss, and definition align.'],
  ['srf_cendrillon_courut_lem_courir_1e7ebfc558:sns_cendrillon_courir_se_deplacer_rapidement_avec_impetuosite_par_un_mouvement_alternatif_des_jambes_ou_des_pattes_prenant_appui_sur_le_sol_avec_une_phase_de_suspension_en_l_air_sans_appui_f406f5e4a6', 'hold', 'The prince ran to receive the arriving stranger, which fits courir, but another active courir lemma is flagged as a duplicate candidate. Resolve global lemma/sense reuse before approving either identity.'],
  ['srf_cendrillon_creusa_lem_cendrillon_creuser_verb_fab5fa1961_d372d32195:sns_cendrillon_creuser_faire_un_trou_un_orifice_un_canal_etc_3a85804e56', 'approve', 'Reviewed the sole occurrence: the fairy hollowed out the pumpkin, leaving only its shell. Creuser means to dig/hollow out; the past-historic form and definition support this context.'],
  ['srf_cendrillon_croyoit_lem_croire_1381a7c783:sns_cendrillon_croire_tenir_pour_veritable_36281025b7', 'hold', 'The context is “she did not think it was eleven yet,” a belief about a proposition, not believing a person as the gloss “to believe (someone)” implies. Correct the gloss and re-review.'],
  ['srf_cendrillon_cueillir_lem_cendrillon_cueillir_verb_a2431d33cb_24a9c85f3d:sns_cendrillon_cueillir_detacher_des_fruits_des_fleurs_des_legumes_de_leurs_branches_ou_de_leurs_tiges_2b713658b4', 'approve', 'Reviewed the sole infinitive: Cinderella picks a pumpkin from the garden and brings it to the fairy. Cueillir means to pick/gather something from its plant; the verb and definition fit.'],
  ['srf_cendrillon_danca_lem_parure_danser_verb_3256054ca3_84d4318842:sns_parure_danser_executer_une_danse_22af2015ff', 'approve', 'Reviewed the sole past-historic occurrence: Cinderella danced with such grace that she was admired even more. Dança is a valid historical spelling/form of danser, and the dance sense fits.'],
  ['srf_cendrillon_danser_lem_parure_danser_verb_3256054ca3_c2aa9794e2:sns_parure_danser_executer_une_danse_22af2015ff', 'approve', 'Reviewed every indexed occurrence of danser: dancing stops when the violins cease, and the prince takes Cinderella to dance, where she dances gracefully. All are the same verb sense.'],
  ['srf_cendrillon_davantage_lem_cendrillon_davantage_adverb_b76c81d1f9_4ff1c79295:sns_cendrillon_davantage_plus_82ff461bc0', 'approve', 'Reviewed both occurrences: Cinderella is told not to stay a moment longer, and the prince admires her even more. Davantage means more/further in both contexts.'],
  ['srf_cendrillon_descente_lem_cendrillon_descente_noun_1e645f17ab_ac473b6942:sns_cendrillon_descente_action_de_descendre_d_aller_vers_le_bas_4c9f61341c', 'approve', 'Reviewed the sole occurrence à la descente du carosse: the prince gives her his hand as she steps down from the carriage. Descente is the act of descending/getting down; the noun sense fits.'],
  ['srf_cendrillon_dirent_lem_dire_ac3efda09e:sns_parure_dire_exprimer_par_la_parole_960c81d4dd', 'approve', 'Reviewed both contexts: the guards report what they saw, and the sisters tell Cinderella what happened at the ball. Dirent is the past-historic plural of dire (“say/tell”); both speech uses align.'],
  ['srf_cendrillon_disoient_lem_dire_7e17401ebb:sns_parure_dire_exprimer_par_la_parole_960c81d4dd', 'approve', 'Reviewed the sole historical imperfect: the sisters said to Cinderella that she might like to go to the ball. Disoient is an older spelling/form of dire; the speaking sense and direct-speech context fit.'],
  ['srf_cendrillon_diverties_lem_cendrillon_divertir_verb_cf2e459d15_d1c37b0e52:sns_cendrillon_divertir_detourner_de_ce_qui_preoccupe_fatigue_ennuie_en_amusant_en_recreant_e479f3cdae', 'hold', 'The context asks whether the sisters enjoyed themselves (se divertir), a pronominal/intransitive use; the current sense definition only describes diverting/entertaining someone else. Add the reflexive sense or reassign this occurrence, then review questions.'],
  ['srf_cendrillon_dore_lem_cendrillon_dore_adjective_d18241e07c_f41813a1ae:sns_cendrillon_dore_recouvert_d_or_plaque_or_a28e403f97', 'approve', 'Reviewed the sole occurrence carosse tout doré: the pumpkin coach is covered in/golden with gold. The adjective doré, surface form, and gilded/golden sense align.'],
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
  sequence: 4, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
