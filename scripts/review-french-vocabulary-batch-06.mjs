import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-06';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_fusse_lem_etre_e6ef561499:sns_parure_etre_definir_un_etat_une_caracteristique_du_sujet_151b22dfa3', 'approve', 'Reviewed the sole subjunctive occurrence: Javotte says she would have to be very mad to lend the dress. Fusse is a valid older subjunctive form of être; the “to be” lemma and predicate-state use align.'],
  ['srf_cendrillon_gardes_lem_zola_garde_248d168207:sns_cendrillon_garde_soldat_effectuant_une_garde_charge_de_la_protection_d_une_personne_de_la_surveillance_d_un_lieu_18347451c7', 'approve', 'Reviewed the sole plural occurrence: guards at the palace gate are asked whether a princess left. The occupational guard sense and plural surface form are supported by context.'],
  ['srf_cendrillon_garniture_lem_cendrillon_garniture_noun_b70691284a_8ac04b8fc4:sns_cendrillon_garniture_ce_qui_est_mis_a_une_chose_pour_la_garnir_la_completer_l_orner_l_embellir_53005b6937', 'hold', 'The sisters discuss their garniture d’Angleterre on a dress, meaning decorative trim/embellishment, but the gloss is the opaque cognate “garniture.” Provide a clear learner gloss for clothing trim and re-review.'],
  ['srf_cendrillon_gentil_homme_lem_cendrillon_gentilhomme_noun_f23561f65a_9e8199f974:sns_cendrillon_gentilhomme_homme_de_naissance_noble_3dd1f5950a', 'approve', 'Reviewed the sole occurrence: the story begins with a gentil-homme who marries a second wife, meaning a gentleman/nobleman. The historical hyphenated form maps correctly to gentilhomme.'],
  ['srf_cendrillon_gentilhomme_lem_cendrillon_gentilhomme_noun_f23561f65a_da63cadd1c:sns_cendrillon_gentilhomme_homme_de_naissance_noble_3dd1f5950a', 'approve', 'Reviewed the sole capitalized occurrence: the Gentilhomme tries the slipper on the women and identifies Cinderella’s fit. The capitalization is sentence-internal title-style usage; the noun still means gentleman/nobleman.'],
  ['srf_cendrillon_gouvernoit_lem_cendrillon_gouverner_verb_7b8134291d_3ed324ad22:sns_cendrillon_gouverner_exercait_une_influence_dominante_sur_quelqu_un_c9c2876db6', 'approve', 'Reviewed the sole historical imperfect: the stepmother governed/controlled Cinderella’s father completely. The sense of exercising dominant influence fits the source use.'],
  ['srf_cendrillon_grace_lem_parure_grace_noun_dacf4d55db_51c8e9001c:sns_cendrillon_grace_aisance_elegante_dans_l_allure_ou_les_manieres_ba21afad6a', 'approve', 'Reviewed all three verse occurrences: Cinderella dances with grace, and the moral identifies bonne grâce as a true gift of fairies. The shared sense of elegant ease/charm in movement or manners fits each occurrence.'],
  ['srf_cendrillon_habiles_lem_cendrillon_habile_adjective_78f9d03a0a_8581938474:sns_cendrillon_habile_adroit_qui_fait_ce_qu_il_entreprend_avec_souplesse_c94f869cd3', 'approve', 'Reviewed the plural adjective describing the skilled artisans needed to make Cinderella’s clothes. Habile means skilled/skillful at what one undertakes; the form and definition fit.'],
  ['srf_cendrillon_habilleroit_lem_cendrillon_habiller_verb_5cb8e09c3a_58120fc4dd:sns_cendrillon_habiller_mettre_des_habits_a_quelqu_un_le_vetir_23cc97bb05', 'hold', 'The source uses s’habilleroit (“would get dressed”), a pronominal/intransitive construction, but the current definition only covers dressing someone else. Add/reassign the reflexive “get dressed” sense before approval.'],
  ['srf_cendrillon_habit_lem_cendrillon_habit_noun_f8db4bca8f_7379bb502c:sns_cendrillon_habit_tout_ce_qui_est_fait_pour_couvrir_le_corps_excepte_le_linge_la_coiffure_et_la_chaussure_35c5cc2f5e', 'hold', 'All eight contexts refer broadly to clothing/garments, but the gloss expands into unrelated specialized English senses (dress-coat, evening dress, tails, full dress). Simplify it to the shared garment sense and re-review dependent questions.'],
  ['srf_cendrillon_habits_lem_cendrillon_habit_noun_f8db4bca8f_72dd32bc4a:sns_cendrillon_habit_tout_ce_qui_est_fait_pour_couvrir_le_corps_excepte_le_linge_la_coiffure_et_la_chaussure_35c5cc2f5e', 'hold', 'The indexed forms cover ordinary clothes, ceremonial clothing, servants’ livery, and Cinderella’s old clothes, while the gloss lists several specialized English garment types. Replace the noisy gloss with the shared clothing/garment meaning and re-review.'],
  ['srf_cendrillon_haissables_lem_cendrillon_haissable_adjective_2fc0b014aa_c51ab50dd3:sns_cendrillon_haissable_qui_merite_d_etre_hai_qu_on_doit_hair_qui_doit_inspirer_la_haine_a3210b714c', 'approve', 'Reviewed the sole occurrence: the stepmother’s daughters are made even more hateful by their mother’s inability to tolerate Cinderella’s good qualities. Haïssables means deserving hatred; the adjective and context agree.'],
  ['srf_cendrillon_hautaine_lem_cendrillon_hautain_adjective_801d9fb55f_6514a2611b:sns_cendrillon_hautain_qui_affecte_la_fierte_et_le_dedain_pour_mieux_marquer_la_distance_entre_soi_et_les_autres_3eecd4e40c', 'approve', 'Reviewed the sole feminine adjective: the wife is described as haughty and proud. Hautaine correctly inflects hautain, and the sense definition matches the context.'],
  ['srf_cendrillon_helas_lem_cendrillon_helas_interjection_ee088218b6_a07f1ab2f3:sns_cendrillon_helas_marque_l_affliction_le_regret_ou_la_deception_exprime_une_plainte_be548ab058', 'hold', 'The occurrences are exclamatory Helas expressing distress/regret, but the learner gloss calls it a conjunction as well as an exclamation and is unusually lengthy. Keep the accurate interjection classification and rewrite the gloss concisely.'],
  ['srf_cendrillon_heureuses_lem_zola_heureux_30de7ed5ac:sns_cendrillon_heureux_qui_jouit_du_bonheur_qui_possede_ce_qui_peut_le_rendre_content_90fac6a4b9', 'hold', 'The sisters are called heureuses after meeting a beautiful princess: the contextual sense is fortunate/lucky, not necessarily emotionally happy. Add or select the fortune sense before approving this occurrence.'],
  ['srf_cendrillon_honnestetez_lem_cendrillon_honnetete_noun_565daf3942_0dc9e63220:sns_cendrillon_honnetete_marque_de_politesse_et_d_attention_envers_quelqu_un_4bc06a0076', 'approve', 'Reviewed the sole plural occurrence: Cinderella shows her sisters mille honnestetez, courteous gestures/attentions. The historical spelling maps to honnêteté, and the politeness sense fits.'],
  ['srf_cendrillon_honorable_lem_cendrillon_honorable_adjective_293e945710_67ceee2e64:sns_cendrillon_honorable_qui_fait_honneur_qui_attire_de_l_honneur_et_du_respect_bbcf5a95b6', 'approve', 'Reviewed the sole occurrence: the prince seats Cinderella in the most honorable place. The adjective denotes something deserving honor/respect and fits the context.'],
  ['srf_cendrillon_instruisant_lem_zola_instruire_4d00791401:sns_cendrillon_instruire_enseigner_quelque_chose_a_quelqu_un_lui_apprendre_quelque_chose_lui_donner_des_lecons_des_preceptes_pour_les_m_urs_pour_quelque_science_etc_0939ca8e90', 'approve', 'Reviewed the sole present-participle occurrence En la dressant, en l’instruisant: instructing/teaching the young woman. The verb and educational sense align with the moral context.'],
  ['srf_cendrillon_inutilement_lem_cendrillon_inutilement_adverb_b488bfd310_40460a1801:sns_cendrillon_inutilement_sans_utilite_d_une_maniere_inutile_en_vain_b5246580a6', 'approve', 'Reviewed the sole occurrence: after many princesses and duchesses try the slipper, it fits no one, but unsuccessfully. Inutilement means in vain/without success here; its adverbial sense fits.'],
  ['srf_cendrillon_irai_lem_aller_1fb74f0653:sns_parure_aller_se_deplacer_jusqu_a_un_endroit_3680154133', 'hold', 'The future irai occurs in est-ce que j’irai comme cela, a movement/going use, but the active aller lemma has an unresolved duplicate candidate. Reconcile global lemma/sense reuse before approval.'],
  ['srf_cendrillon_jardin_lem_cendrillon_jardin_noun_46efdb3259_d646e2ed67:sns_cendrillon_jardin_lieu_ordinairement_clos_de_murailles_de_haies_de_fosses_dans_lequel_on_cultive_des_legumes_des_fleurs_des_arbres_etc_0d27d97b52', 'approve', 'Reviewed both occurrences: the fairy directs Cinderella to the garden to pick a pumpkin and later to find lizards behind a watering can. Jardin means garden; the noun identity and contexts align.'],
  ['srf_cendrillon_jaune_lem_cendrillon_jaune_adjective_193d985bbb_7d64b35390:sns_cendrillon_jaune_designe_une_couleur_du_spectre_situee_entre_le_vert_et_l_orange_ffff00_b8077e4dbc', 'approve', 'Reviewed the sole occurrence: Javotte’s ordinary dress is described as yellow. The adjective jaune and color sense are exact.'],
  ['srf_cendrillon_juppe_lem_parure_jupe_noun_5c3481dfa4_e6a939b777:sns_parure_jupe_partie_de_l_habillement_feminin_qui_descend_depuis_la_ceinture_plus_ou_moins_bas_suivant_la_mode_a00e907c3b', 'approve', 'Reviewed the sole historical spelling juppe: the younger sister says she will wear her ordinary skirt. It maps to modern jupe and the clothing sense is supported.'],
  ['srf_cendrillon_laquais_lem_cendrillon_laquais_noun_16b2fdc7ff_4930d90b90:sns_cendrillon_laquais_valet_de_livree_destine_principalement_a_suivre_son_maitre_ou_sa_maitresse_ee8e44fd01', 'approve', 'Reviewed all three plural occurrences: the lizards are transformed into liveried servants who ride behind the carriage, later reverting to lizards, and guards report seeing them leave. The laquais servant sense fits.'],
  ['srf_cendrillon_legerement_lem_cendrillon_legerement_adverb_8f3699fe47_f382975aa4:sns_cendrillon_legerement_d_une_maniere_legere_non_pesante_98a68504b3', 'hold', 'The context compares Cinderella’s flight to a doe, so légèrement means lightly/nimbly in movement, not merely “in a way that is not heavy.” Refine the learner definition to capture manner of movement before approval.'],
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
  sequence: 6, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
