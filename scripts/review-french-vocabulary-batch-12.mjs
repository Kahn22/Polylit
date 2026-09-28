import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-12';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_vestue_lem_parure_vetir_verb_758129096f_a9fd998824:sns_cendrillon_vetir_habiller_couvrir_d_un_vetement_1fe1fb4983', 'approve', 'Reviewed the sole feminine participle vestuë: the guards describe a poorly dressed young woman. The form maps to vêtir and means dressed/clothed; context and sense fit.'],
  ['srf_cendrillon_vestues_lem_parure_vetir_verb_758129096f_9bddbd634a:sns_cendrillon_vetir_habiller_couvrir_d_un_vetement_1fe1fb4983', 'approve', 'Reviewed the sole feminine plural: Cinderella’s sisters were dressed magnificently. Vestuës is a valid participial form of vêtir and the to-dress/clothe sense fits.'],
  ['srf_cendrillon_veu_lem_voir_6f63d92dfa:sns_parure_voir_percevoir_l_image_des_objets_par_l_organe_de_la_vue_42c820dd60', 'approve', 'Reviewed both historical form veu occurrences: the guards had not seen anyone leave except a poorly dressed girl, and the sisters had not seen a princess leave. Voir means to perceive visually; the contexts agree.'],
  ['srf_cendrillon_veue_lem_voir_ae53c433f5:sns_parure_voir_percevoir_l_image_des_objets_par_l_organe_de_la_vue_42c820dd60', 'approve', 'Reviewed both feminine participles veuë: the father had seen his late wife, and the sisters recognize the woman they saw at the ball. The historical form of voir and visual-perception sense fit both.'],
  ['srf_cendrillon_veues_lem_voir_1d3d0440e8:sns_parure_voir_percevoir_l_image_des_objets_par_l_organe_de_la_vue_42c820dd60', 'approve', 'Reviewed the sole feminine plural participle: the coachman’s moustaches are described as never seen before. Veuës is a historical form of voir and means visually perceived.'],
  ['srf_cendrillon_vilain_lem_cendrillon_vilain_adjective_f25ff0b00f_4a2bb065cd:sns_cendrillon_vilain_qui_deplait_a_la_vue_d6de159039', 'approve', 'Reviewed the sole occurrence: Javotte insults Cinderella as a vilain Cucendron, meaning ugly/unsightly. The masculine adjective and appearance sense fit.'],
  ['srf_cendrillon_vilains_lem_cendrillon_vilain_adjective_f25ff0b00f_7ec67ebd85:sns_cendrillon_vilain_qui_deplait_a_la_vue_d6de159039', 'approve', 'Reviewed the sole plural phrase vilains habits: Cinderella calls her old clothes ugly. The adjective’s visual-unpleasantness sense and plural form fit the context.'],
  ['srf_cendrillon_viles_lem_cendrillon_vil_adjective_a99e50e8ee_7c4cfb1ff7:sns_cendrillon_vil_qui_est_bas_abject_meprisable_307e184cbe', 'hold', 'The context describes low/menial household occupations, but the gloss “cheap, worthless” suggests price or utility rather than contemptible social status. Refine the gloss to lowly/menial and re-review.'],
  ['srf_cendrillon_violons_lem_cendrillon_violon_noun_d2d627f907_0c4dba5a40:sns_cendrillon_violon_luth_a_manche_court_dont_la_touche_lisse_est_depourvue_de_frettes_muni_de_quatre_cordes_que_l_on_frotte_avec_un_archet_048b4db980', 'approve', 'Reviewed the sole plural occurrence: the violins stop playing when the dancing ends. Violons is the plural instrument noun and the violin definition fits.'],
  ['srf_cendrillon_viste_lem_cendrillon_vite_adverb_98850adcf2_458e4a8c5e:sns_cendrillon_vite_rapidement_avec_vitesse_5bc32d98b1', 'approve', 'Reviewed the sole historical spelling viste: Cinderella leaves as fast as she can when she hears the clock. Vite means quickly/with speed; the adverb and context align.'],
  ['srf_cendrillon_voudrois_lem_zola_vouloir_ecbd048978:sns_parure_vouloir_avoir_l_intention_la_volonte_de_faire_quelque_chose_s_y_determiner_42a5bbec3d', 'approve', 'Reviewed both voudrois occurrences: Cinderella says she would like to go to the ball and repeats the wish while crying. The conditional form of vouloir and wanting/wishing sense fit both.'],
  ['srf_cendrillon_voulurent_lem_zola_vouloir_f89f7ea221:sns_parure_vouloir_avoir_l_intention_la_volonte_de_faire_quelque_chose_s_y_determiner_42a5bbec3d', 'approve', 'Reviewed the sole past-historic plural: the sisters agreed/were willing to let Cinderella do their hair. Voulurent is vouloir and the intention/willingness sense applies.'],
  ['srf_cendrillon_voyoient_lem_voir_7b005d4d70:sns_parure_voir_percevoir_l_image_des_objets_par_l_organe_de_la_vue_42c820dd60', 'approve', 'Reviewed the sole historical imperfect: the sisters could see themselves in their mirrors from feet to head. Voyoient is voir and denotes visual perception.'],
  ['srf_cendrillon_voyoit_lem_voir_ab815f456f:sns_parure_voir_percevoir_l_image_des_objets_par_l_organe_de_la_vue_42c820dd60', 'approve', 'Reviewed the sole occurrence in on voyoit un Cucendron aller au bal: voyoit means “saw,” in a hypothetical visual scene. The older voir form and sense match.'],
  ['srf_cendrillon_vu_lem_voir_a11de58c60:sns_parure_voir_percevoir_l_image_des_objets_par_l_organe_de_la_vue_42c820dd60', 'approve', 'Reviewed the sole historical past participle vû: the king had not seen such a beautiful person in a long time. Voir and visual-perception sense fit.'],
  ['srf_cependant:sns_cependant_primary', 'hold', 'The indexed contexts include contrastive “however” and temporal “meanwhile/nevertheless” uses across several works; the current self-referential gloss is not a clear learner definition. Refine the shared adverb sense(s) and review all linked occurrences before approval.'],
  ['srf_cette:sns_ce_primary', 'approve', 'Reviewed all indexed occurrences: cette consistently introduces an identifiable feminine-singular noun (woman, truth, affair, evening, etc.). The demonstrative-determiner identity and its gender/number variants are represented in the definition.'],
  ['srf_chiens:sns_chien_primary', 'approve', 'Reviewed both occurrences: the hare is pursued by dogs, and the fable addresses shepherds and their dogs. Chiens is the plural noun for dogs, matching both contexts.'],
  ['srf_chose:sns_chose_primary', 'hold', 'The thing sense is supported across the indexed contexts, but a same-lemma duplicate candidate remains unresolved. Reconcile the shared chose identity before approval; do not automatically merge or transfer mastery.'],
  ['srf_cigale_fourmi_aise_lem_cigale_fourmi_aise_adjective_ae7b5ae617_51d57d9616:sns_cigale_fourmi_aise_content_ou_satisfait_dans_l_expression_etre_aise_8fe14d39a9', 'approve', 'Reviewed the sole phrase j’en suis fort aise: the ant says she is pleased to hear that the cicada sang. Aise here means glad/pleased in the expression être aise; the adjective sense fits.'],
  ['srf_cigale_fourmi_bise_lem_cigale_fourmi_bise_noun_02452aeb32_ae5fd59650:sns_cigale_fourmi_bise_vent_sec_et_froid_qui_souffle_du_nord_ou_du_nord_est_b1ab712452', 'approve', 'Reviewed the sole occurrence: the cicada is destitute when the cold northerly wind arrives. Bise means the dry, cold north/northeast wind; noun and context align.'],
  ['srf_cigale_fourmi_chantais_lem_cigale_fourmi_chanter_verb_e0c8f16fc3_1b089db970:sns_cigale_fourmi_chanter_moduler_sa_voix_sur_plusieurs_tons_suivre_un_morceau_de_musique_vocale_cb5a838956', 'approve', 'Reviewed the sole imperfect: the cicada says she sang night and day whenever she could. Chanter means to sing; the first-person form and vocal context fit.'],
  ['srf_cigale_fourmi_chante_lem_cigale_fourmi_chanter_verb_e0c8f16fc3_c22650bb5b:sns_cigale_fourmi_chanter_moduler_sa_voix_sur_plusieurs_tons_suivre_un_morceau_de_musique_vocale_cb5a838956', 'approve', 'Reviewed the sole past participle: the cicada has sung all summer. Chanté maps to chanter and the singing sense is direct.'],
  ['srf_cigale_fourmi_chantiez_lem_cigale_fourmi_chanter_verb_e0c8f16fc3_295ba89e12:sns_cigale_fourmi_chanter_moduler_sa_voix_sur_plusieurs_tons_suivre_un_morceau_de_musique_vocale_cb5a838956', 'approve', 'Reviewed the sole imperfect question Vous chantiez?: the ant asks whether the cicada was singing. The form of chanter and vocal sense fit.'],
  ['srf_cigale_fourmi_chaud_lem_cigale_fourmi_chaud_adjective_1ee6e86431_48792c8be8:sns_cigale_fourmi_chaud_ou_la_temperature_est_elevee_7ec63b9454', 'approve', 'Reviewed the sole phrase au temps chaud: it refers to hot/warm weather during summer. The adjective chaud and elevated-temperature sense align.'],
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
  sequence: 12, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
