import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-03';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_avantage_lem_cendrillon_avantage_noun_6e6cae4d38_7cf4ad604e:sns_cendrillon_avantage_utilite_profit_faveur_benefice_consequence_positive_que_l_on_peut_subir_d_un_acte_ou_d_une_situation_73086dfd6f', 'approve', 'Reviewed the sole occurrence C’est sans doute un grand avantage: the noun avantage means a benefit or favorable circumstance. The gloss and definition express this sense; no competing lemma candidate exists.'],
  ['srf_cendrillon_avertir_lem_zola_avertir_8751a59a84:sns_cendrillon_avertir_informer_quelqu_un_de_quelque_chose_prevenir_une_personne_6a9f53cc89', 'hold', 'The king is averti qu’une princess has arrived: the contextual meaning is “inform/tell,” while the gloss “to warn” suggests caution and is too narrow. Revise the gloss and re-review this exact sense.'],
  ['srf_cendrillon_avis_lem_cendrillon_avis_noun_4edfb4e55f_ff4d9828aa:sns_cendrillon_avis_ce_que_l_on_pense_et_aussi_ce_que_l_on_en_dit_opinion_734dea5675', 'approve', 'Reviewed both contexts: Cendrillon asks for her avis, and Javotte says she is de cet avis. Both use avis as an opinion/view; the noun, gloss, definition, and occurrences align.'],
  ['srf_cendrillon_baguette_lem_cendrillon_baguette_noun_da284b99c4_26db2c8d1a:sns_cendrillon_baguette_petit_baton_mince_plus_ou_moins_long_et_flexible_5d188d4ca9', 'hold', 'All four indexed occurrences are the fairy’s magical baguette (wand), while the gloss/definition describe a generic stick or rod. Clarify the story-specific lexical sense as a wand and re-review the dependent questions.'],
  ['srf_cendrillon_barbe_lem_cendrillon_barbe_noun_e47ca61a16_cd7c5cd33f:sns_cendrillon_barbe_ensemble_des_poils_qui_poussent_sur_le_menton_et_les_joues_4b328a7f4b', 'approve', 'Reviewed the sole occurrence: a rat’s beard prompts its transformation into a coachman with a moustache. The noun barbe means beard/facial hair here; its definition and context agree.'],
  ['srf_cendrillon_beautez_lem_parure_beaute_noun_32bbc7d04c_3acae3e5e8:sns_cendrillon_beaute_qualite_de_ce_qui_est_beau_de_ce_qui_est_esthetique_a_la_perception_ca9a504bff', 'approve', 'Reviewed the sole occurrence grandes beautez: it refers to the woman’s striking beauty/beautiful appearance. The plural form maps to beauté and the aesthetic sense fits the complete context.'],
  ['srf_cendrillon_belles_lem_beau_0b0c6d52e0:sns_cendrillon_beau_d_aspect_agreable_a_l_il_ou_a_l_oreille_3b802582d6', 'hold', 'The indexed forms include adjective uses describing moustaches and a collation, plus Belles as a substantivized/vocative address. A same-lemma duplicate candidate also remains unresolved. Separate/assign the uses and resolve reuse before approval.'],
  ['srf_cendrillon_biche_lem_cendrillon_biche_noun_1db0a16fd5_8cd5ac989d:sns_cendrillon_biche_femelle_du_cerf_5223981c6d', 'approve', 'Reviewed the sole comparison: Cinderella flees as lightly as a biche. The feminine noun means a doe/hind, and that animal comparison, lemma, and sense align.'],
  ['srf_cendrillon_biensoigneusement_lem_cendrillon_bien_soigneusement_adverb_0d3b3cad78_4f009a1d07:sns_cendrillon_bien_soigneusement_avec_beaucoup_de_soin_27016bfae4', 'approve', 'Reviewed the sole historical/closed spelling biensoigneusement: it means very carefully, describing how the prince picked up the glass slipper. The adverbial sense and context agree.'],
  ['srf_cendrillon_bonnes_lem_bon_a6893c85fc:sns_cendrillon_bon_qui_a_des_qualites_conformes_a_ce_que_l_on_attendait_a8ac37b640', 'hold', 'The sole indexed occurrence is bonnes qualités, where bon means good/positive. A same-lemma duplicate candidate remains unresolved, so reconcile lemma/sense reuse before approval.'],
  ['srf_cendrillon_bonte_lem_cendrillon_bonte_noun_45ce9ee53a_4d31c0f800:sns_cendrillon_bonte_qualite_de_ce_qui_est_bon_362dc648d0', 'approve', 'Reviewed the sole occurrence describing Cinderella’s exceptional bonté: the abstract noun means goodness/kindness. The lexical identity, gloss, definition, and contrast with the stepmother’s mauvais humeur are coherent.'],
  ['srf_cendrillon_cadette_lem_cendrillon_cadette_noun_af66ae36c8_446e820b2e:sns_cendrillon_cadette_chacune_des_s_urs_qui_viennent_apres_l_aine_par_ordre_de_naissance_801d996122', 'approve', 'Reviewed both occurrences: cadette identifies the younger of the two sisters, contrasted with aînée. The noun’s feminine form and birth-order sense fit both contexts.'],
  ['srf_cendrillon_causoient_lem_cendrillon_causer_verb_fac91f804a_8c3ec05443:sns_cendrillon_causer_s_entretenaient_familierement_ensemble_37aa567070', 'approve', 'Reviewed the sole imperfect plural causoient: the sisters were chatting when Cinderella heard the clock. The historical spelling maps to causer and the conversational sense matches.'],
  ['srf_cendrillon_cendres_lem_cendrillon_cendre_noun_be627563cf_09750a7118:sns_cendrillon_cendre_residu_pulverulent_de_la_combustion_du_bois_et_d_autres_matieres_organiques_fae37d3f4e', 'approve', 'Reviewed the sole plural occurrence dans les cendres: Cinderella sits in the ashes by the fireplace. The cendre noun sense and indexed form match the literal context.'],
  ['srf_cendrillon_cessa_lem_cendrillon_cesser_verb_904b439ecf_97e9e874c9:sns_cendrillon_cesser_discontinuer_arreter_finir_interrompre_terminer_44b48e1968', 'approve', 'Reviewed both contexts: dancing ceased, and the prince never stopped telling Cinderella sweet things (ne cessa de). Both are the same cease/stop sense, with the negated phrase yielding continuation.'],
  ['srf_cendrillon_chamarez_lem_cendrillon_chamarre_adjective_33a004edc8_040b4abeab:sns_cendrillon_chamarre_tres_colore_charge_surcharge_d_ornements_couvert_de_decorations_5cf75302fb', 'approve', 'Reviewed the occurrence describing the transformed coachmen’s richly decorated clothes. Historical chamarez is the plural form of chamarré; the ornate/embellished sense aligns.'],
  ['srf_cendrillon_chamarrez_lem_cendrillon_chamarre_adjective_33a004edc8_82f797a548:sns_cendrillon_chamarre_tres_colore_charge_surcharge_d_ornements_couvert_de_decorations_5cf75302fb', 'approve', 'Reviewed the occurrence habits chamarrez de pierreries: the clothes are covered/embellished with jewels. The source’s historical spelling and plural adjective form map to chamarré, with the sense intact.'],
  ['srf_cendrillon_chambres_lem_zola_chambre_dfc29c51e4:sns_cendrillon_chambre_toute_piece_habitable_d_une_maison_et_principalement_une_chambre_a_coucher_5bbd509477', 'approve', 'Reviewed the sole occurrence: the stepsisters sleep in fashionable, furnished chambres. This is the plural noun room/bedroom sense; the definition and context align.'],
  ['srf_cendrillon_cheminee_lem_cendrillon_cheminee_noun_256a664ec9_296cd6b5c2:sns_cendrillon_cheminee_construction_abritant_un_atre_ou_l_on_fait_du_feu_et_comportant_un_conduit_pour_donner_issue_a_la_fumee_5f304a43c2', 'hold', 'The source says au coin de la cheminée, referring to the fireplace/hearth area; the gloss “a chimney” points to the smoke flue and is misleading in this context. Correct the learner gloss and re-review.'],
  ['srf_cendrillon_cheval_lem_cendrillon_cheval_noun_6b47cdac40_d2dbaede8c:sns_cendrillon_cheval_grand_mammifere_perissodactyle_de_la_famille_des_equides_habituellement_domestique_et_employe_comme_monture_ou_comme_bete_de_trait_de_somme_066abb9c5b', 'approve', 'Reviewed the sole occurrence: a mouse is transformed into a horse to draw the golden carriage. The noun cheval, gloss horse, and definition match.'],
  ['srf_cendrillon_chevaux_lem_cendrillon_cheval_noun_6b47cdac40_9124c224ea:sns_cendrillon_cheval_grand_mammifere_perissodactyle_de_la_famille_des_equides_habituellement_domestique_et_employe_comme_monture_ou_comme_bete_de_trait_de_somme_066abb9c5b', 'approve', 'Reviewed both occurrences: six horses draw the carriage and are later threatened with transformation back into mice. The plural chevaux correctly shares the cheval lemma and horse sense.'],
  ['srf_cendrillon_choisir_lem_cendrillon_choisir_verb_9faa126657_5a01bdd5a4:sns_cendrillon_choisir_faire_un_choix_prendre_une_personne_ou_une_chose_de_preference_a_une_autre_ou_a_plusieurs_autres_79763e8597', 'approve', 'Reviewed the sole infinitive: the sisters choose the clothes and hairstyles that suit them best. The verb’s selection/preference sense and definition align with the context.'],
  ['srf_cendrillon_citrons_lem_cendrillon_citron_noun_b2cecefbbc_7ef46fce82:sns_cendrillon_citron_fruit_du_citronnier_citrus_limon_de_couleur_jaune_a_la_peau_rugueuse_et_de_forme_ovoide_d_un_gout_acide_il_est_utilise_presse_dans_de_nombreuses_boissons_3452f0068b', 'approve', 'Reviewed both occurrences: Cinderella shares oranges and lemons with her sisters, who later mention the gift. The plural noun citrons means lemons; the botanical definition is consistent.'],
  ['srf_cendrillon_citrouille_lem_cendrillon_citrouille_noun_b7944f4092_ee6d3e35da:sns_cendrillon_citrouille_espece_de_courge_de_la_famille_des_cucurbitacees_dont_les_tiges_rampent_a_terre_de_nom_scientifique_cucurbita_pepo_c713e96f40', 'approve', 'Reviewed all three occurrences: the fairy empties a citrouille, turns it into a coach, and it would turn back at midnight. Historical citroüille is the source spelling; pumpkin/gourd fits the object and transformation.'],
  ['srf_cendrillon_civilitez_lem_cendrillon_civilite_noun_33afd4c973_79369d49da:sns_cendrillon_civilite_ensemble_de_comportements_lies_a_la_politesse_et_au_savoir_vivre_b49c1f0de1', 'approve', 'Reviewed the sole plural occurrence: the sisters report that the princess showed them many civilitez, i.e. courteous acts/politeness. The noun, gloss, and definition fit the source use.'],
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
  sequence: 3, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
