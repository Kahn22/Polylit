import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-13';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cigale_fourmi_cigale_lem_cigale_fourmi_cigale_noun_d284331eeb_c2adca7322:sns_cigale_fourmi_cigale_insecte_aile_de_la_famille_des_cicadides_commun_dans_les_regions_mediterraneennes_1d61d9e23a', 'approve', 'Reviewed the sole occurrence: the Cigale has sung all summer. The noun names the cicada insect and the story’s singing insect context fits the definition.'],
  ['srf_cigale_fourmi_crier_lem_crier_fbb171c5bb:sns_cigale_fourmi_crier_jeter_un_ou_plusieurs_cris_324ab66571', 'hold', 'The indexed use is the construction crier famine (“cry/complain of hunger”), and an unresolved global crier lemma candidate exists. Clarify the idiomatic use, occurrence assignment, and duplicate reuse before approval.'],
  ['srf_cigale_fourmi_dansez_lem_parure_danser_verb_3256054ca3_2aa4660992:sns_parure_danser_executer_une_danse_22af2015ff', 'approve', 'Reviewed the sole imperative: the ant tells the cicada to dance now, sarcastically answering her claim that she sang all summer. Danser retains its literal dance sense.'],
  ['srf_cigale_fourmi_defaut_lem_cigale_fourmi_defaut_noun_709cb5e348_9bf518d579:sns_cigale_fourmi_defaut_imperfection_morale_ou_faiblesse_que_l_on_reproche_a_quelqu_un_6d35f1c7cc', 'approve', 'Reviewed the sole occurrence: the ant’s refusal to lend is called her least défaut, a flaw/shortcoming. The moral-weakness sense and context align.'],
  ['srf_cigale_fourmi_depourvue_lem_cigale_fourmi_depourvu_adjective_afe164e96b_a13d4ab21f:sns_cigale_fourmi_depourvu_prive_de_sans_qui_manque_de_quelque_chose_b7fc68ff24', 'approve', 'Reviewed the sole feminine participle: the cicada finds herself without food when winter arrives. Dépourvue means deprived of/lacking; lemma, form, and context fit.'],
  ['srf_cigale_fourmi_emprunteuse_lem_cigale_fourmi_emprunteur_noun_1a64b85265_4bf22d3629:sns_cigale_fourmi_emprunteur_personne_qui_recoit_quelque_chose_a_charge_de_le_rendre_b417d78992', 'approve', 'Reviewed the sole direct-address occurrence: the ant calls the cicada a borrower while asking what she did in summer. The feminine form emprunteuse and person-who-borrows sense are correct.'],
  ['srf_cigale_fourmi_famine_lem_cigale_fourmi_famine_noun_288718f36e_1ef0924461:sns_cigale_fourmi_famine_indisponibilite_generale_des_aliments_les_plus_essentiels_c0053b76ad', 'hold', 'In crier famine, the cicada is complaining of personal hunger, while the definition describes general unavailability of essential food (a famine). Verify whether this is a figurative/idiomatic use and refine the sense or occurrence assignment.'],
  ['srf_cigale_fourmi_fort_lem_cigale_fourmi_fort_adverb_9eb1afa20e_9c17580472:sns_cigale_fourmi_fort_a_un_degre_eleve_beaucoup_35963c7759', 'approve', 'Reviewed both occurrences: fort dépourvue means very deprived, and fort aise means very pleased. Fort is the same intensifying adverb meaning very/to a high degree in both.'],
  ['srf_cigale_fourmi_fourmi_lem_cigale_fourmi_fourmi_noun_8b5a0c0c7e_1963495678:sns_cigale_fourmi_fourmi_petit_insecte_social_sans_ailes_sauf_individus_sexues_vivant_en_colonies_dans_des_fourmilieres_c_est_un_hymenoptere_qui_possede_en_particulier_des_antennes_coudees_et_un_petiole_d828cc34a8', 'approve', 'Reviewed both occurrences: the cicada begs its ant neighbor, and the fable states the ant is not a lender. Fourmi means ant; noun, gloss, and contexts align.'],
  ['srf_cigale_fourmi_grain_lem_grain_668228eb1a:sns_cigale_fourmi_grain_fruit_et_semence_des_cereales_contenu_dans_l_epi_fed2d4987c', 'approve', 'Reviewed the sole request for a grain to survive until the next season. Grain means cereal grain/seed, fitting the food item requested.'],
  ['srf_cigale_fourmi_moindre_lem_cigale_fourmi_moindre_adjective_466b395837_c705be04fd:sns_cigale_fourmi_moindre_qui_est_plus_petit_ou_moins_important_que_les_autres_6a60df24e1', 'approve', 'Reviewed the sole phrase son moindre défaut: moindre means the least/smallest fault by degree or importance. The adjective, definition, and comparative construction fit.'],
  ['srf_cigale_fourmi_morceau_lem_cigale_fourmi_morceau_noun_50531da289_85b597369e:sns_cigale_fourmi_morceau_portion_separee_d_une_chose_solide_qui_peut_etre_mangee_1a7820d198', 'approve', 'Reviewed the sole context: the cicada has not a single little piece of fly or worm to eat. Morceau means an edible piece/bit; the noun and context match.'],
  ['srf_cigale_fourmi_mouche_lem_cendrillon_mouche_noun_0f91cc8302_5648394a1a:sns_cigale_fourmi_mouche_insecte_adulte_volant_de_l_ordre_des_dipteres_muni_d_une_trompe_et_de_couleur_generalement_sombre_metallisee_mais_pouvant_etre_vive_sa_larve_se_nourrit_de_matiere_organique_en_decomposition_telle_que_les_excrements_et_les_cadavres_elle_peut_aussi_etre_parasite_de_vegetaux_de_champignons_ou_d_animaux_vivants_comme_des_mammiferes_et_de_tres_nombreux_insectes_les_mouches_sont_morphologiquement_definies_par_la_presence_d_une_seule_paire_d_ailes_l_autre_paire_etant_reduite_sous_la_forme_d_halteres_servant_de_balanciers_durant_le_vol_be2aee85ee', 'approve', 'Reviewed the sole occurrence: a fly is listed as food the hungry cicada lacks. This is the insect noun mouche, distinct from the previously reviewed beauty-patch sense of the same lemma.'],
  ['srf_cigale_fourmi_paierai_lem_zola_payer_e7a87c8608:sns_parure_payer_donner_de_l_argent_pour_un_bien_ou_un_service_fbfd927008', 'approve', 'Reviewed the sole future promise: the cicada will pay before August, including interest and principal. Paierai is payer and the money-payment sense fits.'],
  ['srf_cigale_fourmi_preteuse_lem_parure_preteur_noun_76a7ec8797_e7b87c9b7e:sns_cigale_fourmi_preteur_personne_qui_prete_quelque_chose_fbf0910fde', 'approve', 'Reviewed the sole feminine predicate: the ant is described as not inclined to lend. Prêteuse is the feminine noun/adjective for a lender and the context is direct.'],
  ['srf_cigale_fourmi_priant_lem_parure_prier_verb_0b3fbb5c15_a2bef23a55:sns_cigale_fourmi_prier_demandant_avec_insistance_ou_deference_f7c08d8706', 'approve', 'Reviewed the sole present participle: the cicada begs/asks the ant to lend grain. Priant means asking earnestly or deferentially, as the contextual gloss states.'],
  ['srf_cigale_fourmi_principal_lem_cigale_fourmi_principal_noun_9a90142e00_f300c18e09:sns_cigale_fourmi_principal_somme_pretee_distincte_des_interets_qui_s_y_ajoutent_518ae6360b', 'approve', 'Reviewed the sole promise to pay “intérêt et principal”: principal is the original amount borrowed apart from interest. The financial noun sense is exact.'],
  ['srf_cigale_fourmi_saison_lem_parure_saison_noun_6b927584c9_1919d8e99e:sns_parure_saison_periode_de_l_annee_qui_observe_une_relative_constance_du_climat_et_de_la_temperature_f6eab21574', 'approve', 'Reviewed the sole phrase jusqu’à la saison nouvelle: the cicada asks for grain until the next season. Saison means a period of the year characterized by climate; the noun sense fits.'],
  ['srf_cigale_fourmi_venant_lem_venir_73afc44cd1:sns_cigale_fourmi_venir_qui_se_presente_ou_arrive_dans_l_expression_a_tout_venant_d4b1012eaa', 'approve', 'Reviewed the sole phrase à tout venant: it means whoever comes/anyone who happens by, in the cicada’s explanation that she sang day and night. The contextual venir sense is accurate.'],
  ['srf_cigale_fourmi_vermisseau_lem_cigale_fourmi_vermisseau_noun_e785dc1052_587c50581b:sns_cigale_fourmi_vermisseau_petit_ver_de_terre_3a98b07c16', 'approve', 'Reviewed the sole occurrence: the cicada lacks any morsel of fly or vermisseau to eat. Vermisseau means a small worm/larva; the food context supports the sense.'],
  ['srf_cigale_fourmi_voisine_lem_cigale_fourmi_voisin_noun_fb6e05fc05_730e1d9d02:sns_cigale_fourmi_voisin_personne_qui_habite_ou_se_trouve_a_proximite_693a3144db', 'approve', 'Reviewed the sole feminine occurrence: the cicada goes to the ant who lives nearby. Voisine is the feminine form of voisin and the nearby-neighbor sense fits.'],
  ['srf_comme:sns_comme_primary', 'hold', 'The five works use comme for comparison, manner, exemplification, and causal/temporal constructions. The current definition is self-referential and the single generic gloss does not explain the indexed variety; refine/split senses and review each use.'],
  ['srf_convint:sns_convenir_primary', 'hold', 'The one occurrence means the two parties agreed on a judge, but the gloss/definition simply repeat “Convint is the past historic of convenir, agreed.” Rewrite it with a direct learner meaning and grammar note, then re-review.'],
  ['srf_corbeau:sns_corbeau_primary', 'approve', 'Reviewed all four occurrences: the fox addresses Master Crow, and the crow is the animal that loses the cheese and later feels shame. Corbeau means crow, matching each context.'],
  ['srf_courir:sns_courir_primary', 'hold', 'The running sense is clear in Rien ne sert de courir, but the record uses a circular definition and an unresolved duplicate courir lemma candidate exists. Reconcile exact lemma/sense reuse and rewrite the gloss before approval.'],
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
  sequence: 13, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
