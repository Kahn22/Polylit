import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-17';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_loup_agneau_chatie_lem_loup_agneau_chatier_verb_dbae6921dc_a4c75cc51d:sns_loup_agneau_chatier_soumis_a_une_punition_8ef44f5cdf', 'approve', 'Reviewed the sole occurrence: the wolf tells the lamb it will be punished for its temerity. Châtié is the past participle of châtier, “punished,” fitting the context.'],
  ['srf_loup_agneau_colere_lem_loup_agneau_colere_noun_ea099e9bad_72276c7f73:sns_loup_agneau_colere_reaction_vive_et_parfois_violente_contre_ce_qui_blesse_un_sentiment_054659ae5f', 'approve', 'Reviewed the sole phrase se mettre en colère: the lamb asks the wolf not to become angry. Colère means anger/rage in this construction.'],
  ['srf_loup_agneau_considere_lem_cendrillon_considerer_verb_7b6c9f7c8e_d9fbae8855:sns_loup_agneau_considerer_examine_par_la_pensee_ou_tient_compte_de_a3eae21860', 'approve', 'Reviewed the sole occurrence: the lamb asks the wolf to consider that he is drinking downstream. Considère is the present form of considérer in the sense “consider/take into account.”'],
  ['srf_loup_agneau_courant_lem_loup_agneau_courant_noun_6f317c471e_332d4393a5:sns_loup_agneau_courant_mouvement_continu_de_l_eau_dans_un_cours_d_eau_a5ae5f01be', 'approve', 'Reviewed both occurrences: the lamb and wolf are drinking in the current/stream of a watercourse. Courant is the water-current noun in each.'],
  ['srf_loup_agneau_cruelle_lem_loup_agneau_cruel_adjective_86840450a7_60ec9d3c04:sns_loup_agneau_cruel_qui_prend_plaisir_a_faire_souffrir_ou_reste_insensible_a_la_souffrance_cd18f22d7c', 'approve', 'Reviewed the sole phrase cette bête cruelle: the wolf is portrayed as cruel, insensitive to the lamb’s suffering. The feminine adjective form and sense match.'],
  ['srf_loup_agneau_desalterait_lem_loup_agneau_desalterer_verb_39018893b4_9c09e5589c:sns_loup_agneau_desalterer_apaiser_la_soif_bb9ab1f3cb', 'approve', 'Reviewed the sole occurrence: the lamb was quenching its thirst in the stream. Désaltérait is the imperfect form of désaltérer; the sense is accurate.'],
  ['srf_loup_agneau_desalterant_lem_loup_agneau_desalterer_verb_39018893b4_f21fc633df:sns_loup_agneau_desalterer_apaisant_sa_soif_en_buvant_5cd6b66ca7', 'approve', 'Reviewed the sole occurrence: the lamb says it is quenching its thirst in the stream. Désaltérant is the present participle and the sense fits.'],
  ['srf_loup_agneau_emporte_lem_emporter_b19da9f7dd:sns_loup_agneau_emporter_porter_hors_d_un_lieu_f86152d994', 'approve', 'Reviewed the sole occurrence: the wolf carries the lamb off into the forest and eats it. Emporte is the present form of emporter, “takes/carries away.”'],
  ['srf_loup_agneau_epargnez_lem_loup_agneau_epargner_verb_ddaf7807be_25ea56c4bf:sns_loup_agneau_epargner_evite_de_faire_du_mal_a_quelqu_un_ou_le_menage_22b2943f71', 'approve', 'Reviewed the sole address to the wolf: the lamb says the wolf, shepherds, and dogs do not spare him. Épargnez means spare/avoid harming, matching the claim.'],
  ['srf_loup_agneau_faim_lem_loup_agneau_faim_noun_8b2f14fb41_3839522fd5:sns_loup_agneau_faim_sensation_qui_revele_l_envie_ou_le_besoin_de_manger_cc18a0d985', 'approve', 'Reviewed the sole occurrence: hunger draws the fasting wolf to the location. Faim means hunger/the need to eat, and the context is direct.'],
  ['srf_loup_agneau_forets_lem_parure_foret_noun_4ff1539d56_777c10a581:sns_loup_agneau_foret_vaste_terrain_couvert_de_bois_de_nombreux_arbres_proches_5e0e10a5c3', 'approve', 'Reviewed both occurrences: the lion and wolf are carried/caught in forests. Forêts is the plural form of forêt, woodland/forest.'],
  ['srf_loup_agneau_frere_lem_loup_agneau_frere_noun_ab855198ab_d499335e27:sns_loup_agneau_frere_homme_ou_garcon_enfant_du_meme_pere_et_de_la_meme_mere_qu_un_ou_plusieurs_autre_s_individu_s_membre_masculin_d_une_adelphie_a638571c3c', 'approve', 'Reviewed the sole accusation: the wolf claims the lamb’s brother muddied the water. Frère means brother, matching the literal kinship claim.'],
  ['srf_loup_agneau_guere_lem_loup_agneau_guere_adverb_a99e91a4d5_157d866947:sns_loup_agneau_guere_presque_pas_presque_rien_85f1f079f8', 'approve', 'Reviewed the sole negative construction ne m’épargnez guère: guère means hardly/not much, matching the lamb’s complaint that they scarcely spare him.'],
  ['srf_loup_agneau_hardi_lem_loup_agneau_hardi_adjective_bbceb86897_b4026c4d27:sns_loup_agneau_hardi_qui_ose_beaucoup_05cc9985ba', 'approve', 'Reviewed the sole question: the wolf asks what makes the lamb so bold as to disturb his drink. Hardi means bold/daring in this context.'],
  ['srf_loup_agneau_jeun_lem_loup_agneau_jeun_adjective_29cb739d48_0a75e522a3:sns_loup_agneau_jeun_qui_n_a_pas_mange_depuis_un_certain_temps_f1ac5cfc55', 'hold', 'The sole occurrence is the fixed phrase à jeun (“fasting/on an empty stomach”), not a standalone adjective use. Review it with the expression-level assignment and clarify the word-level gloss before approval.'],
  ['srf_loup_agneau_lieux_lem_loup_agneau_lieu_noun_587a87476d_d842313028:sns_loup_agneau_lieu_endroits_consideres_dans_leur_situation_a0cec651f2', 'approve', 'Reviewed the sole phrase en ces lieux: lieux means places/locations where the wolf arrives. The plural noun sense fits.'],
  ['srf_loup_agneau_loup_lem_loup_agneau_loup_noun_777e31a7a3_bc2ec0dae9:sns_loup_agneau_loup_mammifere_carnivore_de_la_famille_des_canides_a_l_allure_d_un_grand_chien_au_pelage_gris_jaunatre_aux_yeux_obliques_et_aux_oreilles_dressees_de_nom_scientifique_canis_lupus_lupus_et_de_meme_espece_canis_lupus_que_le_chien_domestique_dont_il_est_le_pendant_sauvage_df6c007a4a', 'approve', 'Reviewed both occurrences: Loup is the animal that arrives hungry and carries the lamb away. The noun means wolf in each.'],
  ['srf_loup_agneau_majeste_lem_loup_agneau_majeste_noun_724c199a7c_304cb59610:sns_loup_agneau_majeste_titre_honorifique_donne_a_un_souverain_591dcde47e', 'approve', 'Reviewed the sole respectful address Votre Majesté to the wolf, styled as a sovereign. The honorific noun meaning Majesty is exact.'],
  ['srf_loup_agneau_mange_lem_parure_manger_verb_8ebe8c88db_b0c2043c65:sns_cendrillon_manger_macher_et_avaler_un_aliment_dans_le_but_de_se_nourrir_4e81ee0753', 'approve', 'Reviewed the sole occurrence: the wolf eats the lamb after carrying it into the forest. Mange is the present form of manger and the literal eating sense fits.'],
  ['srf_loup_agneau_medis_lem_loup_agneau_medire_verb_70ea9bc689_cba77f27c0:sns_loup_agneau_medire_dire_du_mal_de_quelqu_un_soit_par_mechancete_soit_par_legerete_1c9fd90f17', 'approve', 'Reviewed the sole accusation: the wolf says the lamb spoke ill of him the previous year. Médis is the second-person form of médire, “speak badly of,” matching the charge.'],
  ['srf_loup_agneau_meilleure_lem_parure_meilleur_adjective_e2c47b7123_2bb1ddcc28:sns_loup_agneau_meilleur_qui_l_emporte_sur_les_autres_0feda8dfba', 'approve', 'Reviewed the sole maxim: la raison du plus fort est toujours la meilleure means the strongest party’s argument always prevails. Meilleure is the feminine form of meilleur, “best,” agreeing with raison.'],
  ['srf_loup_agneau_mere_lem_cendrillon_mere_noun_756760135e_fc4478f01e:sns_cendrillon_mere_femme_qui_a_donne_naissance_a_au_moins_un_enfant_03e4c88001', 'approve', 'Reviewed the sole occurrence: the lamb says it is still nursing from its mother. Mère means mother, matching the family relation.'],
  ['srf_loup_agneau_ne_lem_zola_naitre_10ea2eaa01:sns_loup_agneau_naitre_venu_au_monde_e08912fe4a', 'approve', 'Reviewed the sole occurrence: the lamb says it was not yet born at the time alleged by the wolf. Né is the past participle of naître, “born.”'],
  ['srf_loup_agneau_onde_lem_loup_agneau_onde_noun_aabb955d81_acd41e6acc:sns_loup_agneau_onde_eau_en_mouvement_dans_un_emploi_poetique_7a8fb19ad9', 'approve', 'Reviewed the sole poetic phrase une onde pure: onde means flowing water/a stream, in which the lamb drinks. The poetic noun sense is appropriate.'],
  ['srf_loup_agneau_plutot_lem_cendrillon_plutot_adverb_32645291e2_85915a7f07:sns_loup_agneau_plutot_de_preference_ou_plus_exactement_19da335266', 'approve', 'Reviewed the sole argumentative transition Mais plutôt qu’elle considère…: plutôt means rather/instead, introducing the lamb’s correction of the wolf’s claim. The adverb sense fits.'],
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
  sequence: 17, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
