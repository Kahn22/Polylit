import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-05';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_douceur_lem_cendrillon_douceur_noun_4ff58826e9_98a8444977:sns_cendrillon_douceur_qualite_de_ce_qui_est_doux_la_chose_meme_qui_a_cette_qualite_3308fa7943', 'approve', 'Reviewed the sole occurrence: Cinderella is described as having exceptional gentleness and kindness, contrasted with her stepmother’s pride and harshness. Douceur is an abstract quality of gentleness/tenderness; the noun sense fits.'],
  ['srf_cendrillon_douceurs_lem_cendrillon_douceur_noun_4ff58826e9_d7ec310f07:sns_cendrillon_douceur_paroles_aimables_ou_galantes_adressees_a_quelqu_un_a2b1f0eba9', 'approve', 'Reviewed the sole expression: the prince tells Cinderella des douceurs, meaning flattering/affectionate sweet words. This is distinct from the temperament sense and correctly has its own sense identity.'],
  ['srf_cendrillon_embarrassee_lem_cendrillon_embarrasse_adjective_bd87a3851c_defb03c116:sns_cendrillon_embarrasse_arrete_ou_gene_par_un_obstacle_8c86e4461e', 'approve', 'Reviewed the sole occurrence: Cinderella would have been greatly embarrassed/troubled if Javotte had agreed to lend the dress. The feminine adjective form, lemma, and hindered/perplexed sense fit.'],
  ['srf_cendrillon_ennuyoit_lem_parure_ennuyer_verb_7338e3692f_8bed1d0677:sns_parure_ennuyer_causer_de_l_ennui_fatiguer_l_esprit_par_quelque_chose_d_insignifiant_de_monotone_de_deplaisant_ou_de_trop_long_3943cceb9a', 'hold', 'The source says la jeune Demoiselle ne s’ennuyoit point (“the young woman was not bored”), a pronominal state; the current transitive sense “to bore someone” does not represent that use. Add/reassign the reflexive sense and re-review questions.'],
  ['srf_cendrillon_entendit_lem_entendre_9fa14e85cf:sns_cendrillon_entendre_percevoir_un_son_1d1dcaee8e', 'approve', 'Reviewed both contexts: Cinderella hears the clock strike, and hears the first stroke of midnight. The auditory verb entendre, past-historic form, and “to hear/perceive a sound” sense match.'],
  ['srf_cendrillon_entendoit_lem_entendre_e49968512f:sns_cendrillon_entendre_percevoir_un_son_1d1dcaee8e', 'approve', 'Reviewed the sole historical imperfect: the room could hear only a confused murmur after the violins stopped. Entendre means to hear/perceive sound, as defined.'],
  ['srf_cendrillon_entierement_lem_zola_entierement_43cb24ed5f:sns_cendrillon_entierement_d_une_maniere_entiere_bcf54769c7', 'approve', 'Reviewed the sole occurrence: the wife governed the husband entirely/completely. The adverb entièrement and degree/completeness sense fit this context.'],
  ['srf_cendrillon_entrer_lem_cendrillon_entrer_verb_77ba1e167f_4ce381bcdb:sns_cendrillon_entrer_aller_de_dehors_vers_dedans_5b80460f05', 'approve', 'Reviewed the sole infinitive: the sisters try to make their feet enter the glass slipper. Entrer means to go/get inside; the spatial sense applies figuratively to a foot fitting into footwear.'],
  ['srf_cendrillon_entroit_lem_cendrillon_entrer_verb_77ba1e167f_b65e57eada:sns_cendrillon_entrer_aller_de_dehors_vers_dedans_5b80460f05', 'approve', 'Reviewed the sole imperfect: Cinderella’s foot went into the slipper easily and fit exactly. The form entroit maps to entrer, and the enter/go-inside sense is accurate.'],
  ['srf_cendrillon_envoya_lem_zola_envoyer_d1c32b3666:sns_cendrillon_envoyer_faire_partir_quelqu_un_ou_faire_porter_quelque_chose_quelque_part_5e13bcc72c', 'approve', 'Reviewed the sole occurrence: the household sent for a hairdresser to prepare the sisters’ hairstyles. Envoyer describes dispatching someone to go/come; the verb sense is supported.'],
  ['srf_cendrillon_epousa_lem_parure_epouser_verb_58adefcaba_15ac067fa6:sns_cendrillon_epouser_prendre_en_mariage_55197be9c3', 'approve', 'Reviewed both occurrences: the gentleman marries a second wife, and Cinderella later marries the prince. Épousa is the past-historic form of épouser; both contexts mean to marry.'],
  ['srf_cendrillon_epouseroit_lem_parure_epouser_verb_58adefcaba_5671014e7a:sns_cendrillon_epouser_prendre_en_mariage_55197be9c3', 'approve', 'Reviewed the sole conditional occurrence: the prince would marry the woman whose foot fit the slipper. The inflected form and “take in marriage” sense align.'],
  ['srf_cendrillon_esoufflee_lem_cendrillon_essouffle_adjective_002bb8fd8b_65fec0efcd:sns_cendrillon_essouffle_qui_montre_de_l_essoufflement_0312da940e', 'approve', 'Reviewed the sole source form: Cinderella arrives home bien ésoufflée after fleeing the ball, meaning out of breath. Preserve the historical spelling while mapping it to essoufflé; form and sense fit.'],
  ['srf_cendrillon_etendant_lem_cendrillon_etendre_verb_e7f262dfde_1afcd86e77:sns_cendrillon_etendre_faire_qu_une_chose_acquiere_plus_de_surface_ou_plus_de_volume_soit_en_la_rendant_plus_mince_soit_en_la_tirant_ou_en_la_dilatant_182883cd76', 'hold', 'The indexed form is reflexive s’étendant: Cinderella stretches herself while yawning, not a transitive act of spreading an object out. Add/reassign the reflexive bodily movement sense before approval.'],
  ['srf_cendrillon_etonnement_lem_cendrillon_etonnement_noun_6a05bbb0c0_0d13f093b8:sns_cendrillon_etonnement_vive_surprise_f1730c1c75', 'approve', 'Reviewed the sole context: the sisters’ astonishment grows when Cinderella produces the matching slipper. Étonnement means strong surprise/amazement; the noun sense fits.'],
  ['srf_cendrillon_faiseuse_lem_cendrillon_faiseuse_noun_fe8bcbace7_bdd0984029:sns_cendrillon_faiseuse_celle_qui_fait_certains_ouvrages_qui_fabrique_certains_objets_en_parlant_des_choses_de_mode_70a97926f3', 'hold', 'The context refers to a “bonne Faiseuse” who made the beauty patches, but the learner gloss is only “historical or contextual form of faiseuse,” not a usable meaning, and the broad definition does not identify the role. Clarify the historical occupation/object-maker sense before approval.'],
  ['srf_cendrillon_faudroit_lem_falloir_bbda2d0ceb:sns_parure_falloir_etre_de_necessite_de_devoir_d_obligation_de_bienseance_78717c969b', 'approve', 'Reviewed the sole conditional: Javotte says she would have to be mad to lend her dress to Cinderella. Falloir expresses necessity/obligation; the impersonal construction and sense align.'],
  ['srf_cendrillon_fee_lem_cendrillon_fee_noun_53baf4cb04_39815bd573:sns_cendrillon_fee_etre_imaginaire_a_qui_la_tradition_populaire_ou_l_imagination_des_conteurs_attribue_une_puissance_surnaturelle_f5a11b27b2', 'approve', 'Reviewed all three occurrences: Cinderella’s fairy godmother transforms a pumpkin, mice, lizards, and clothes, and the moral mentions fairies. The noun fée and supernatural-being sense fit every use.'],
  ['srf_cendrillon_fees_lem_cendrillon_fee_noun_53baf4cb04_c869d39a8a:sns_cendrillon_fee_etre_imaginaire_a_qui_la_tradition_populaire_ou_l_imagination_des_conteurs_attribue_une_puissance_surnaturelle_f5a11b27b2', 'approve', 'Reviewed the sole verse: the moral calls grace the true gift of the fairies. Fées is the correct plural of fée and refers to supernatural beings.'],
  ['srf_cendrillon_fille_lem_parure_fille_noun_9fe9fd7b82_e62002c750:sns_cendrillon_fille_enfant_de_genre_feminin_par_opposition_a_garcon_aussi_appelee_fillette_ou_petite_fille_2a46aac25d', 'approve', 'Reviewed all eight occurrences: fille refers to Cinderella as a young female person/daughter, the sisters, and the disguised princess; none requires a different lexical sense. The feminine-person sense and contexts align.'],
  ['srf_cendrillon_fils_lem_cendrillon_fils_noun_109f357df2_c02a030ee0:sns_cendrillon_fils_tout_etre_humain_de_genre_masculin_considere_par_rapport_a_son_pere_et_a_sa_mere_ou_a_un_des_deux_seulement_858661ebbc', 'approve', 'Reviewed all eleven occurrences: fils du Roi consistently means the king’s son, including subject, object, and oblique references. The masculine noun fils and kinship definition align throughout.'],
  ['srf_cendrillon_forme_lem_cendrillon_forme_noun_6b4aecede8_d787e4c83b:sns_cendrillon_forme_aspect_exterieur_configuration_caracteristique_ou_particuliere_d_une_chose_b1bed43ef5', 'hold', 'The source says the old clothes would resume their first form, meaning shape/appearance, but the gloss restricts forme to a geometric representation. Replace the gloss with a contextual shape/appearance meaning before approval.'],
  ['srf_cendrillon_forme_lem_cendrillon_forme_noun_6b4aecede8_d787e4c83b:sns_loup_agneau_forme_maniere_reglementee_de_proceder_specialement_dans_une_affaire_de_justice_7a93cbea9b', 'approve', 'Reviewed the sole fixed phrase Sans autre forme de procès: forme denotes legal formality/procedure, captured by the sense definition. This is distinct from the Cinderella shape sense and should remain separately identified.'],
  ['srf_cendrillon_frappa_lem_zola_frapper_ae54d720fd:sns_cendrillon_frapper_donner_un_ou_plusieurs_coups_a_quelqu_un_a_quelque_chose_efa1d205e3', 'approve', 'Reviewed the sole occurrence: the fairy struck the pumpkin with her wand, transforming it. Frapper means to strike/hit here; the verb form, object, and sense align.'],
  ['srf_cendrillon_frottoit_lem_cendrillon_frotter_verb_2d10c56321_5e19f4d73b:sns_cendrillon_frotter_passer_une_chose_sur_une_autre_a_quelques_ou_plusieurs_reprises_en_appuyant_en_pressant_58df248bc7', 'approve', 'Reviewed the sole occurrence: Cinderella’s stepmother had her scrub Madame’s and the daughters’ rooms. Frotter means to rub/scrub a surface repeatedly; the gloss and definition cover this cleaning use.'],
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
  sequence: 5, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
