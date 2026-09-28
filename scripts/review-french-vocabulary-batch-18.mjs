import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-18';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_loup_agneau_pure_lem_loup_agneau_pur_adjective_b7992d5032_d9cb7a8d54:sns_loup_agneau_pur_qui_n_est_ni_souille_ni_melange_ici_en_parlant_de_l_eau_58fdd88fd2', 'approve', 'Reviewed the sole occurrence: the lamb drinks from a pure/clear stream. Pure is the feminine form of pur and the adjective sense fits the water.'],
  ['srf_loup_agneau_quelqu_un_lem_loup_agneau_quelqu_un_pronoun_2ac406ed75_fb64efb7e1:sns_loup_agneau_quelqu_un_une_personne_non_precisement_identifiee_91430b404b', 'approve', 'Reviewed both occurrences: quelqu’un asks whether anyone imagined a lion would have dealings with a rat, and means someone among the wolf’s people. The indefinite pronoun sense fits both.'],
  ['srf_loup_agneau_rage_lem_loup_agneau_rage_noun_7b81c5df4b_e2c9442e4c:sns_loup_agneau_rage_colere_violente_et_incontrolee_a2738d7be6', 'hold', 'The contexts include an animal full of rage and the fixed phrase force ni rage, where rage suggests vigorous effort/intensity. Confirm one sense covers both or separate the construction before approval.'],
  ['srf_loup_agneau_rend_lem_zola_rendre_9f6d5684ac:sns_loup_agneau_rendre_fait_devenir_ou_met_dans_un_certain_etat_dcec08f1b7', 'approve', 'Reviewed the sole question Qui te rend si hardi ?: rend means makes/causes you to become so bold. The present form of rendre and causative sense fit.'],
  ['srf_loup_agneau_repond_lem_parure_repondre_verb_243ee2e73d_a8d61ea2e4:sns_parure_repondre_donner_une_reponse_a_ce_qui_a_ete_dit_ou_demande_6396497c79', 'approve', 'Reviewed the sole narration: the lamb replies to the wolf. Répond is the present form of répondre, “answers/replies,” and fits.'],
  ['srf_loup_agneau_sire_lem_loup_agneau_sire_noun_cb94d29866_6e0c1609c3:sns_loup_agneau_sire_titre_respectueux_adresse_a_un_souverain_ou_a_un_personnage_puissant_f90b9e2081', 'hold', 'Both uses are respectful direct address to powerful fable characters, but the gloss “Sire” is not a useful translation and the broader title needs a clear learner gloss (for example, “my lord/sire”). Rewrite before approval.'],
  ['srf_loup_agneau_survient_lem_loup_agneau_survenir_verb_17e20fa791_5d8f4c366e:sns_loup_agneau_survenir_arriver_inopinement_venir_tout_a_coup_0c3280642a', 'approve', 'Reviewed the sole occurrence: a hungry wolf suddenly arrives. Survient is the present form of survenir, “arrives unexpectedly,” which matches.'],
  ['srf_loup_agneau_temerite_lem_loup_agneau_temerite_noun_511092fca5_860c999b07:sns_loup_agneau_temerite_hardiesse_imprudente_et_presomptueuse_courage_inconsidere_5c0eeb632a', 'approve', 'Reviewed the sole accusation: the lamb’s temerity is its imprudent boldness in challenging the wolf. The noun and gloss “recklessness/temerity” fit.'],
  ['srf_loup_agneau_tette_lem_loup_agneau_teter_verb_75d0cb10e9_8b149f4707:sns_loup_agneau_teter_boit_le_lait_au_sein_de_sa_mere_57d56e2881', 'hold', 'The context means “I still nurse from my mother,” but the lemma is stored as teter rather than correctly accented téter. Correct the French lemma spelling before approval.'],
  ['srf_loup_agneau_troubles_lem_zola_troubler_6ad64babc5:sns_loup_agneau_troubler_rend_moins_clair_ou_agite_ici_en_parlant_de_l_eau_f529eaf138', 'approve', 'Reviewed the sole accusation Tu la troubles: the wolf claims the lamb is disturbing/muddying the water. Troubles is the present form of troubler and the water-specific sense fits.'],
  ['srf_loup_agneau_venge_lem_loup_agneau_venger_verb_53c4716905_0fe055935b:sns_loup_agneau_venger_obtenir_vengeance_de_quelque_injure_de_quelque_outrage_de_quelque_acte_coupable_se_dit_en_parlant_des_choses_dont_on_veut_tirer_satisfaction_393da359f0', 'approve', 'Reviewed the sole statement je me venge: the wolf says he must avenge an alleged wrong. Venge is the first-person present of reflexive se venger, and the revenge sense fits.'],
  ['srf_loup_agneau_vingt_lem_loup_agneau_vingt_adjective_8fe3b000e1_dc3e938651:sns_loup_agneau_vingt_dix_neuf_plus_un_soit_deux_fois_dix_adjectif_numeral_cardinal_correspondant_au_nombre_20_51ab352aeb', 'approve', 'Reviewed the sole measurement: the lamb is more than twenty paces below the wolf. Vingt is the cardinal numeral twenty and modifies pas.'],
  ['srf_loup_agneau_vos_lem_votre_7700d8aa14:sns_loup_agneau_votre_determinant_possessif_qui_renvoie_a_plusieurs_choses_possedees_8dcb969a8f', 'approve', 'Reviewed both occurrences: vos modifies the plural possessed nouns bergers and chiens. It is the second-person plural possessive determiner “your.”'],
  ['srf_lui:sns_lui_subject', 'hold', 'Six occurrences are assigned to an initial stressed subject-pronoun sense, but the uses include emphatic clefts and other syntactic positions. Verify each role and replace the self-referential gloss before approval.'],
  ['srf_ma:sns_mon_primary', 'hold', 'The 13 feminine possessive forms belong to a lemma with unresolved same-lemma candidates. Reconcile feminine-form linkage and duplicate reuse before approval.'],
  ['srf_mais:sns_mais_primary', 'hold', 'The 31 occurrences function in contrastive, corrective, and continuative constructions; a same-lemma duplicate candidate is unresolved. Reconcile reuse and check all conjunction functions before approval.'],
  ['srf_maison:sns_maison_primary', 'hold', 'The three occurrences include a carried house, a household’s occupations, and the house/attic; the definition repeats the headword and a same-lemma candidate remains unresolved. Clarify the sense and reuse before approval.'],
  ['srf_maitre:sns_maitre_primary', 'approve', 'Reviewed all four occurrences: Maître is a respectful title before Corbeau and Renard, and maître denotes the person with authority to render justice. “Master/title of address” covers the indexed roles.'],
  ['srf_mentir:sns_mentir_primary', 'hold', 'The sole occurrence is the fixed phrase sans mentir, “truthfully/honestly,” rather than a plain infinitive use; a same-lemma candidate is unresolved. Clarify the expression/sense binding and reuse.'],
  ['srf_meprise:sns_mepriser_primary', 'hold', 'The occurrence means the hare scorns/considers the victory of little glory, but the gloss and definition only restate the conjugated form. Rewrite the direct learner meaning before approval.'],
  ['srf_moi:sns_moi_primary', 'approve', 'Reviewed all ten occurrences: moi is the stressed first-person pronoun used in comparison, exclamation, and after prepositions. These are standard tonic-pronoun functions covered by the current sense.'],
  ['srf_mon:sns_mon_primary', 'hold', 'The eight masculine possessive forms appear in several texts, and an unresolved same-lemma candidate exists. Reconcile this exact lemma/form identity with other mon entries before approval.'],
  ['srf_monsieur:sns_monsieur_primary', 'approve', 'Reviewed all nine occurrences: Monsieur is a formal title of address for the crow, fox, and public officials. The gloss “mister/sir” fits these uses.'],
  ['srf_montrer:sns_montrer_primary', 'hold', 'The four occurrences use montrer in literal and figurative senses, while a same-lemma duplicate candidate remains unresolved. Reconcile the sense assignments and identity reuse before approval.'],
  ['srf_mots:sns_mot_primary', 'approve', 'Reviewed both occurrences: mots refers to the fox’s spoken words and the words printed on an invitation. The plural noun sense “words” is consistent.'],
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
  sequence: 18, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
