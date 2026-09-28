import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-26';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_parure_eperdu_lem_parure_eperdu_adjective_2d53954975_4bb6ee703a:sns_parure_eperdu_qui_a_l_esprit_trouble_par_la_crainte_ou_par_quelque_autre_passion_02872f6969', 'hold', 'This identity groups two contexts: a man is stunned/distraught, while dreams are described as éperdus (“wild/intense”). One sense gloss does not clearly cover both; split or clarify the senses before approval.'],
  ['srf_parure_eperdus_eperdu_adjective_67fe245354:sns_parure_eperdu_overwhelming_6fc1f36ffa', 'approve', 'Reviewed the phrase des rêves éperdus: the dreams are intense, extravagant, or wild. The sense “wild/overwhelming” fits this figurative use.'],
  ['srf_parure_epicier_lem_parure_epicier_noun_fd87c5a2a3_ab46c55a60:sns_parure_epicier_commercant_qui_tient_une_epicerie_08eed6ac81', 'approve', 'Reviewed the sole occurrence: she shops at the grocer along with the fruit seller and butcher. Épicier means grocer.'],
  ['srf_parure_epousee_epouser_verb_30818917ff:sns_parure_epouser_marry_fa50d68aa2', 'approve', 'Reviewed the phrase aimée, épousée par un homme riche: the imagined outcome is to be loved and married by a wealthy man. The participle and sense “married” match.'],
  ['srf_parure_epouvante_lem_parure_epouvanter_verb_bb62d9c848_788abac704:sns_parure_epouvanter_susciter_l_epouvante_35f1f41a47', 'hold', 'The occurrence épouvanté means “terrified,” describing Loisel’s state; the current infinitive gloss “to terrify” describes the cause. Clarify the participial/passive form and align the English gloss before approval.'],
  ['srf_parure_escalier_lem_parure_escalier_noun_07984b4668_87111b6753:sns_parure_escalier_ensemble_de_marches_qui_dans_un_batiment_servent_pour_monter_ou_descendre_f44b6115ab', 'hold', 'The occurrence refers to the staircase that Mathilde descends. The current gloss “step, stair” can imply one step; use “stairs/staircase” to match the collective definition.'],
  ['srf_parure_espoir_lem_parure_espoir_noun_26f83d8aa8_b8842f02d6:sns_parure_espoir_fait_d_esperer_quelque_chose_note_d_usage_pour_ce_sens_ce_mot_est_rare_au_pluriel_on_le_dit_pourtant_quelquefois_dans_la_poesie_et_dans_le_style_soutenu_fa895ef416', 'approve', 'Reviewed the phrase un soupçon d’espoir: a faint hope leads Loisel to search another place. The noun means hope.'],
  ['srf_parure_essuyant_lem_parure_essuyer_verb_2116e38b61_e86fc7b73e:sns_parure_essuyer_secher_en_frottant_par_exemple_avec_un_objet_absorbant_24502be5d6', 'approve', 'Reviewed the phrase en essuyant ses joues humides: Mathilde wipes her wet cheeks. Essuyer means wipe/dry by rubbing.'],
  ['srf_parure_etage_lem_parure_etage_noun_84c8410603_b05e0283ba:sns_parure_etage_espace_entre_deux_planchers_au_dessus_du_rez_de_chaussee_dans_un_batiment_33a9a5d81d', 'approve', 'Reviewed the phrase à chaque étage: she stops on each floor/landing while carrying water upstairs. The sense “floor/storey” is accurate.'],
  ['srf_parure_etat_lem_parure_etat_noun_179bb4f4ba_1841b3bbff:sns_parure_etat_disposition_dans_laquelle_se_trouve_une_personne_une_chose_une_affaire_0fe9f2116c', 'approve', 'Reviewed the phrase dans le même état d’effarement: état means a condition/state someone is in. The general noun sense fits.'],
  ['srf_parure_etoffes_etoffe_noun_34859502f6:sns_parure_etoffe_fabric_515aa9fd9a', 'approve', 'Reviewed both occurrences: étoffes refers to textiles used for clothing and upholstery. “Fabrics/cloth” is accurate.'],
  ['srf_parure_etranges_etrange_adjective_9641469ea2:sns_parure_etrange_strange_570cf08ae0', 'approve', 'Reviewed the phrase oiseaux étranges in the imagined fairy-tale forest. The adjective means strange/unusual, as glossed.'],
  ['srf_parure_eveillait_eveiller_verb_c9d123bc38:sns_parure_eveiller_arouse_fbfdc1926d', 'approve', 'Reviewed the occurrence: seeing the little Breton maid awakens regrets and extravagant dreams in Mathilde. Éveiller means arouse/bring about a feeling or thought.'],
  ['srf_parure_exclamation_lem_parure_exclamation_noun_0d19b8a1db_63b8489dbd:sns_parure_exclamation_cri_de_joie_d_admiration_de_surprise_d_indignation_etc_3bea77bd40', 'hold', 'The occurrence is an alarmed exclamation by the economical clerk, not a cry of joy. The French definition covers several emotions, but the English gloss is narrowed to joy; broaden it to “exclamation/cry” before approval.'],
  ['srf_parure_exquis_exquis_adjective_f8d347c07c:sns_parure_exquis_delicious_479b886462', 'approve', 'Reviewed the phrase plats exquis: it describes exceptionally fine dishes in Mathilde’s imagined luxurious life. “Exquisite/delicious” is accurate.'],
  ['srf_parure_extase_lem_parure_extase_noun_1f6c3e1ae0_f9abaafb7b:sns_parure_extase_ravissement_d_esprit_qui_par_une_contemplation_intense_transporte_un_etre_hors_de_la_vie_des_sens_4f5089d9e6', 'approve', 'Reviewed the phrase demeura en extase devant elle-même: Mathilde gazes at herself in rapture. “Ecstasy/rapture” is accurate.'],
  ['srf_parure_face_face_noun_fc5f2b457f:sns_parure_face_front_56437fa65f', 'approve', 'Reviewed the phrase en face de son mari: it means opposite or facing her husband. The sense includes a position directly opposite and is appropriate here.'],
  ['srf_parure_faits_faire_verb_c2332cb000:sns_parure_faire_designed_08ea27d8ce', 'approve', 'Reviewed the phrase faits pour la causerie: the salons are made/suited for conversation with close friends. The participle sense “made/designed for” fits.'],
  ['srf_parure_fallait_lem_falloir_b06df69136:sns_parure_falloir_etre_de_necessite_de_devoir_d_obligation_de_bienseance_78717c969b', 'approve', 'Reviewed both occurrences: it was necessary to pay the debt, and bills had to be paid each month. Falloir expresses necessity/obligation in both.'],
  ['srf_parure_familierement_lem_parure_familierement_adverb_0ae3ed6beb_09a3cf7122:sns_parure_familierement_d_une_maniere_familiere_20833ab8b1', 'approve', 'Reviewed the sole occurrence: the bourgeois woman addresses Mathilde familièrement, in an overly familiar/informal way. The adverb gloss is accurate.'],
  ['srf_parure_faudrait_lem_falloir_fff586a850:sns_parure_falloir_etre_de_necessite_de_devoir_d_obligation_de_bienseance_78717c969b', 'approve', 'Reviewed the conditional phrase il lui faudrait être au Ministère: he would have to be at the Ministry by ten. The conditional conveys necessity/obligation.'],
  ['srf_parure_fauteuils_fauteuil_noun_86179e947b:sns_parure_fauteuil_armchair_c7ef259978', 'approve', 'Reviewed the phrase larges fauteuils: the armchairs are wide seats where the servants sleep. The plural gloss “armchairs” is accurate.'],
  ['srf_parure_feerie_feerie_noun_af723ee3f8:sns_parure_feerie_fairyland_6c183a78a0', 'approve', 'Reviewed the phrase une forêt de féerie: it evokes a magical/fairy-tale forest. “Fairyland/enchantment” fits this figurative use.'],
  ['srf_parure_fenetre_lem_parure_fenetre_noun_5c07578f47_c4a28e7a4b:sns_parure_fenetre_ouverture_faite_dans_certaines_parties_d_un_batiment_pour_donner_du_jour_et_de_l_air_a_l_interieur_fefa297a4f', 'approve', 'Reviewed the sole occurrence: Mathilde sits beside the window and thinks about the ball. The noun “window” is accurate.'],
  ['srf_parure_fermeture_lem_parure_fermeture_noun_fb8a518406_278c60873f:sns_parure_fermeture_dispositif_qui_sert_a_fermer_4e50482436', 'hold', 'In this occurrence, fermeture refers to the broken clasp/fastener of the necklace. The current gloss “closing” is too general for the concrete object; give the jewelry-fastener sense before approval.'],
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
  sequence: 26, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
