import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-10';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_quittees_lem_parure_quitter_verb_9e91e3f716_54294ce757:sns_parure_quitter_laisser_quelqu_un_quelque_part_se_separer_de_lui_27032d5ee3', 'hold', 'The source has s’étaient quittées (“had parted/left each other”), a reciprocal pronominal use, but the learner gloss says “to discharge somebody from an obligation.” Correct the gloss and include the reciprocal construction before approval.'],
  ['srf_cendrillon_raconter_lem_zola_raconter_ccfc2aed0e:sns_cendrillon_raconter_faire_le_recit_d_une_histoire_vraie_ou_imaginaire_e8aeba79ba', 'approve', 'Reviewed the sole occurrence: Cinderella is recounting everything that happened at the ball to her godmother. Raconter means to tell/narrate events; the verb and definition fit.'],
  ['srf_cendrillon_rangs_lem_cendrillon_rang_noun_289c3caef2_48b9916c9f:sns_cendrillon_rang_ordre_disposition_de_plusieurs_personnes_ou_de_plusieurs_choses_sur_une_meme_ligne_file_alignement_80e7917af6', 'approve', 'Reviewed the sole occurrence: the hairdresser arranges two rows of curls/locks (cornettes à deux rangs). Rangs means rows/lines of things arranged alongside one another; the noun sense fits.'],
  ['srf_cendrillon_rare_lem_cendrillon_rare_adjective_ec9d18af7b_1883f8f140:sns_cendrillon_rare_qui_est_en_petit_nombre_qui_se_trouve_difficilement_90837d387d', 'approve', 'Reviewed the sole verse: beauty is described as a rare treasure. Rare means uncommon/not often found, exactly as defined.'],
  ['srf_cendrillon_rat_lem_cendrillon_rat_noun_fb18c8c0e7_8b7775104f:sns_cendrillon_rat_rongeur_a_museau_pointu_a_pattes_courtes_et_a_queue_longue_qui_ronge_et_mange_les_grains_la_paille_etc_4df6b50798', 'approve', 'Reviewed all four occurrences: the rat appears as an animal in the fables, as Sire Rat, and as the animal transformed into a coachman. The noun rat and rodent sense fit throughout.'],
  ['srf_cendrillon_ratiere_lem_cendrillon_ratiere_noun_58ade38fa9_5629264905:sns_cendrillon_ratiere_piege_destine_a_prendre_les_rats_b36a56d2db', 'approve', 'Reviewed both occurrences: Cinderella finds three rats in the ratière and uses the trap to bring one to the fairy. The noun means a rat trap, as defined.'],
  ['srf_cendrillon_rats_lem_cendrillon_rat_noun_fb18c8c0e7_fe3d4b8614:sns_cendrillon_rat_rongeur_a_museau_pointu_a_pattes_courtes_et_a_queue_longue_qui_ronge_et_mange_les_grains_la_paille_etc_4df6b50798', 'approve', 'Reviewed the sole plural occurrence: three rats are in the trap, and one is transformed. Rats is correctly the plural of rat and denotes the rodent.'],
  ['srf_cendrillon_recoit_lem_zola_recevoir_dbbb465bce:sns_cendrillon_recevoir_accepter_prendre_ce_qui_est_donne_ce_qui_est_presente_ce_qui_est_offert_sans_qu_il_soit_du_542b5c7af1', 'approve', 'Reviewed the sole verse: grace is something received from Heaven as a share/gift. Reçoit is the present form of recevoir, and the receiving/accepting sense fits the metaphor.'],
  ['srf_cendrillon_recommanda_lem_cendrillon_recommander_verb_8700cfa1eb_efd98e46a9:sns_cendrillon_recommander_ordonner_a_quelqu_un_prier_avec_instance_quelqu_un_de_faire_quelque_chose_lui_donner_a_ce_sujet_des_instructions_precises_dc26b2ceac', 'hold', 'The godmother instructed/urged Cinderella above all not to stay past midnight, but the learner gloss “to recommend, endorse” is misleading and “endorse” does not fit. Rewrite it as advise/instruct/urge and re-review.'],
  ['srf_cendrillon_redeviendroit_lem_cendrillon_redevenir_verb_822d7c2c18_da504e5cb5:sns_cendrillon_redevenir_devenir_de_nouveau_recommencer_a_etre_ce_qu_on_etait_auparavant_4dc249ece9', 'approve', 'Reviewed the sole conditional: the carriage would become a pumpkin again if Cinderella stayed beyond midnight. Redeviendroit is redevenir and the return-to-previous-state sense is exact.'],
  ['srf_cendrillon_regarder_lem_parure_regarder_verb_993a66acc5_d7ff171e7b:sns_parure_regarder_porter_ses_regards_sur_quelque_chose_ou_quelqu_un_cf77619608', 'approve', 'Reviewed all three occurrences: the fairy looks into the mousetrap, the king looks at Cinderella, and the prince keeps looking at her. Regarder means to direct one’s gaze at someone or something in each.'],
  ['srf_cendrillon_regardoit_lem_parure_regarder_verb_993a66acc5_a37ea0f8c9:sns_parure_regarder_porter_ses_regards_sur_quelque_chose_ou_quelqu_un_cf77619608', 'approve', 'Reviewed the sole historical imperfect: Cinderella was watching her sisters try on the slipper. Regardoit maps to regarder, “to look at/watch,” and fits the indexed context.'],
  ['srf_cendrillon_releva_lem_cendrillon_relever_verb_ac66898880_f0157c6667:sns_cendrillon_relever_lever_a_nouveau_584b98abed', 'approve', 'Reviewed the sole occurrence: after her sisters fall at her feet, Cinderella raises them back up and forgives them. Relever means to lift/raise again, matching the transitive use.'],
  ['srf_cendrillon_remerciee_lem_cendrillon_remercier_verb_83edcce1ec_2bddb47882:sns_cendrillon_remercier_rendre_grace_exprimer_la_gratitude_c35ff021e6', 'hold', 'The source has après l’avoir remerciée (“after thanking her”), a past participle agreeing with the godmother; the gloss says only “historical or contextual form of remercier.” Provide the learner meaning/form analysis and re-review.'],
  ['srf_cendrillon_rendoient_lem_zola_rendre_5d783bbaf6:sns_cendrillon_rendre_faisaient_devenir_d_une_certaine_maniere_38a5b0af39', 'approve', 'Reviewed the sole historical imperfect: Cinderella’s good qualities made the stepdaughters more hateful. Rendre means to make/cause someone to become a certain way; the causative construction fits.'],
  ['srf_cendrillon_repassoit_lem_cendrillon_repasser_verb_66cab4ad75_1baeff8e49:sns_cendrillon_repasser_rendait_le_linge_lisse_au_moyen_d_un_fer_chaud_8c02eeee18', 'approve', 'Reviewed the sole imperfect: Cinderella ironed her sisters’ laundry. Repasser means to smooth linen with a hot iron; the action and definition align.'],
  ['srf_cendrillon_repondirent_lem_parure_repondre_verb_243ee2e73d_877ae8f704:sns_parure_repondre_donner_une_reponse_a_ce_qui_a_ete_dit_ou_demande_6396497c79', 'approve', 'Reviewed the sole past-historic plural: the sisters answer Cinderella’s question about the princess’s identity. Répondirent is répondre and means to give an answer, as defined.'],
  ['srf_cendrillon_ressembloient_lem_cendrillon_ressembler_verb_3d0c869419_b6708ab669:sns_cendrillon_ressembler_avoir_du_rapport_de_la_conformite_avec_quelqu_un_avec_quelque_chose_9b53aca48d', 'approve', 'Reviewed the sole historical imperfect: the stepdaughters were like their mother in every respect. Ressembler means to resemble/share similarity; the pronominal form and context fit.'],
  ['srf_cendrillon_reveiller_lem_cendrillon_reveiller_verb_fa0c666325_c28e392d5d:sns_cendrillon_reveiller_tirer_du_sommeil_148b7b959d', 'hold', 'The indexed construction is reflexive se réveiller (“to wake up”), in an imagined comparison, while the current sense only describes waking someone else. Add or reassign the reflexive sense before approval.'],
  ['srf_cendrillon_revinrent_lem_zola_revenir_e922a76f05:sns_parure_revenir_venir_une_autre_fois_venir_de_nouveau_54b685da55', 'approve', 'Reviewed the sole past-historic plural: the sisters returned from the ball. Revinrent is revenir and means to come back/return, exactly as glossed.'],
  ['srf_cendrillon_rire_lem_cendrillon_rire_verb_b8ffecde49_e2125c5110:sns_cendrillon_rire_marquer_un_sentiment_de_gaiete_par_un_mouvement_de_la_bouche_accompagne_souvent_de_bruit_et_par_une_expression_correspondante_des_regards_et_des_traits_du_visage_42d3040d9c', 'approve', 'Reviewed all three occurrences: Cinderella laughs while suggesting she try the slipper, and the sisters laugh at her. The verb rire denotes laughter in each context, including the playful/mocking use.'],
  ['srf_cendrillon_riroit_lem_cendrillon_rire_verb_b8ffecde49_bc5998e2c9:sns_cendrillon_rire_marquer_un_sentiment_de_gaiete_par_un_mouvement_de_la_bouche_accompagne_souvent_de_bruit_et_par_une_expression_correspondante_des_regards_et_des_traits_du_visage_42d3040d9c', 'approve', 'Reviewed the sole conditional: Javotte says they would laugh if they saw Cinderella going to the ball. Riroit is an older form of rire; the laughter sense fits.'],
  ['srf_cendrillon_roi_lem_cendrillon_roi_noun_edddf2e562_aa31040522:sns_cendrillon_roi_titre_porte_par_celui_qui_regne_sur_un_peuple_un_etat_en_particulier_un_etat_monarchique_et_qui_tient_sa_fonction_de_l_heredite_ou_de_l_election_celui_qui_est_a_la_tete_d_un_royaume_93d71f9fb3', 'hold', 'The corpus includes the literal monarch (King of a people) and the metaphorical Lion, king of animals. The current definition is restricted to a human monarch; broaden/split the ruler/leader sense to cover the fable use.'],
  ['srf_cendrillon_rompit_lem_cendrillon_rompre_verb_9305404b10_60d7388160:sns_cendrillon_rompre_separer_un_solide_en_deux_parties_sans_se_servir_d_instrument_tranchant_briser_mettre_en_pieces_bd8d12c3bd', 'approve', 'Reviewed the sole past-historic plural: the sisters broke more than twelve laces while tightening their clothes. Rompre means to break/snap; the object and context fit.'],
  ['srf_cendrillon_rouge_lem_parure_rouge_adjective_47e260fc6a_83aaa0b20e:sns_parure_rouge_qui_est_d_une_couleur_semblable_a_celle_du_sang_du_coquelicot_de_la_fraise_etc_dont_la_longueur_d_onde_dominante_est_comprise_entre_environ_625_et_740_nm_e01010_ff0000_ff0040_ff2000_850606_da7e7173fd', 'approve', 'Reviewed the sole occurrence: the eldest sister chooses a red velvet dress. Rouge is the color adjective red; form, sense, and context agree.'],
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
  sequence: 10, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
