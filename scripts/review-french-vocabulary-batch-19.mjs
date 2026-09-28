import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-19';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_n_elided:sns_ne_primary', 'hold', 'The 77 elided ne occurrences include standard negation, ne…que (“only”), and other constructions. Verify the negative-particle sense and construction coverage across the set before approval.'],
  ['srf_ne:sns_ne_primary', 'hold', 'The 105 occurrences include ne…pas, ne…que, and other negative constructions; the broad “not” gloss does not distinguish their meanings. Review/split the indexed uses before approval.'],
  ['srf_ni:sns_ni_primary', 'approve', 'Reviewed all five occurrences: ni coordinates alternatives in negative constructions (“nor/neither”), including ni de quel juge and ni de race. The conjunction and sense fit.'],
  ['srf_notre:sns_notre_primary', 'hold', 'Five plural possessive forms appear across fables and J’accuse, but an unresolved same-lemma candidate exists. Reconcile exact notre identity and reuse before approval.'],
  ['srf_odeur:sns_odeur_primary', 'approve', 'Reviewed the sole occurrence: the fox is attracted by the smell, l’odeur, of the cheese. Odeur means smell/scent, matching the context.'],
  ['srf_on:sns_on_primary', 'hold', 'The 88 uses include generic people/one, impersonal constructions, and literary l’on. Verify the functional range against the single gloss and refine the grouping before approval.'],
  ['srf_ou:sns_ou_primary', 'approve', 'Reviewed all eight occurrences: ou presents alternatives (“or”), including a choice between foods and contrasting possibilities. The conjunction sense is consistent.'],
  ['srf_ou_accent:sns_ou_interrogative', 'approve', 'Reviewed the 19 occurrences: où marks locations or destination in direct/indirect questions and relative clauses, including d’où (“from where”). The accented locative adverb identity is correct.'],
  ['srf_ouvre:sns_ouvrir_primary', 'hold', 'The sole occurrence means the fox opens its beak, but an unresolved same-lemma ouvrir candidate exists. Reconcile exact lemma/sense reuse before approval.'],
  ['srf_par:sns_par_primary', 'hold', 'The 42 occurrences use par for agent, means, cause, route, and other relations; “by; through” does not yet verify the full range. Review/split the preposition senses before approval.'],
  ['srf_parie:sns_parier_primary', 'approve', 'Reviewed the sole first-person statement je parie encore: parie means “I bet/wager” in the present tense. The form and sense fit the hare’s repeated wager.'],
  ['srf_partit:sns_partir_primary', 'approve', 'Reviewed the sole occurrence: the hare set off as the tortoise neared the finish. Partit is the past historic of partir, “set off/left.”'],
  ['srf_parure_accumulation_lem_parure_accumulation_noun_f9d38b0e37_c36e73efa0:sns_parure_accumulation_action_d_accumuler_en_parlant_des_choses_physiques_et_les_choses_morales_f762a5aa1e', 'hold', 'The sole context refers to accumulated, compounding interest, but the gloss “accumulation (action of accumulating)” repeats the headword. Rewrite the direct learner meaning to describe the buildup/total before approval.'],
  ['srf_parure_acheter_lem_parure_acheter_verb_aee9a3f6e3_3580846889:sns_parure_acheter_acquerir_quelque_chose_en_l_echangeant_contre_sa_valeur_reelle_ou_supposee_en_devise_4f14798b40', 'approve', 'Reviewed the sole plan to buy a rifle: acheter means to buy/purchase in exchange for money. The infinitive and definition fit.'],
  ['srf_parure_admirable_lem_parure_admirable_adjective_8b1a5b0e69_8937d26654:sns_parure_admirable_qui_merite_ou_qui_attire_l_admiration_f93f1a1009', 'hold', 'The sole use praises the workmanship of a jewel, but the gloss only repeats admirable. Provide a clear learner translation such as “remarkable/excellent” before approval.'],
  ['srf_parure_admirations_lem_parure_admiration_noun_378b7cb106_3395a36a6f:sns_parure_admiration_sentiment_fort_eprouve_a_l_egard_d_une_personne_ou_d_une_manifestation_humaine_ou_animale_que_l_on_considere_comme_dotee_de_qualites_exceptionnelles_5e914da123', 'approve', 'Reviewed the sole occurrence: the plural admirations are the admiration Mathilde receives among the tributes and desires at the ball. The noun sense is accurate.'],
  ['srf_parure_affreux_lem_zola_affreux_aa90cafa69:sns_parure_affreux_qui_cause_ou_qui_est_propre_a_causer_de_la_frayeur_de_l_effroi_6403590d2d', 'approve', 'Reviewed the sole occurrence: the loss of the necklace is called an affreux désastre, a terrible/frightful disaster. The adjective sense fits.'],
  ['srf_parure_afin_lem_parure_afin_conjunction_b701e9f39e_4421096d3c:sns_parure_afin_mot_invariable_ne_s_employant_que_dans_les_locutions_prepositive_afin_de_infinitif_ou_conjonctive_afin_que_verbe_au_subjonctif_permettant_d_indiquer_dans_les_constructions_le_s_but_s_poursuivi_s_f10f67aa8b', 'hold', 'The sole use is the fixed construction afin de + infinitive (“in order to see herself”). Clarify the function-word versus expression-level assignment; the isolated gloss “to” is too underspecified for approval.'],
  ['srf_parure_ailes_aile_noun_97ac7bdf7a:sns_parure_aile_wing_0ec83b20df', 'approve', 'Reviewed the sole menu context: the diners imagine eating the wings of a grouse. Ailes is the plural of aile, “wings,” and the food context is literal.'],
  ['srf_parure_aimait_aimer_verb_f4bb8d7786:sns_zola_aimer_love', 'approve', 'Reviewed the sole occurrence: Mathilde loved jewels and fine clothes and felt made for them. Aimait is the imperfect form of aimer, “love/like,” in a fitting sense.'],
  ['srf_parure_aimee_aimer_verb_d75c137589:sns_zola_aimer_love', 'approve', 'Reviewed the sole occurrence: the young woman had no means of being loved or married by a wealthy man. Aimée is the feminine past participle of aimer, “loved.”'],
  ['srf_parure_air_air_noun_d3a4bb71e4:sns_parure_air_appearance_86239d386f', 'approve', 'Reviewed all six uses: air appears in expressions describing a person’s look, manner, or apparent state (enchanté, glorieux, gêné, misère). The appearance/manner sense is consistent.'],
  ['srf_parure_aise_lem_parure_aise_adjective_871f17edb9_0cd246449f:sns_parure_aise_facile_a_faire_simple_sans_probleme_68214e7e55', 'approve', 'Reviewed the sole occurrence: repaying the debt was not easy for the couple, who had nothing. Aisé means easy/simple here, matching the definition.'],
  ['srf_parure_alla_lem_aller_d743ea83f3:sns_parure_aller_se_deplacer_jusqu_a_un_endroit_3680154133', 'hold', 'The eleven occurrences cover several senses/constructions of aller, and an unresolved global same-lemma candidate exists. Reconcile reuse and review all occurrences before approval.'],
  ['srf_parure_allerent_lem_aller_d88a2ee3ae:sns_parure_aller_se_deplacer_jusqu_a_un_endroit_3680154133', 'hold', 'The plural past-historic form means the couple went from jeweler to jeweler, but an unresolved global same-lemma candidate exists. Reconcile exact lemma reuse before approval.'],
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
  sequence: 19, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
