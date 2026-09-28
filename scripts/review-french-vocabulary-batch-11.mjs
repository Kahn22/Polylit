import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-11';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_roy_lem_cendrillon_roy_noun_247c75b9c4_dec3f80c58:sns_cendrillon_roy_de_1694_a_1740_orthographe_de_l_academie_francaise_de_roi_93a11f2e22', 'approve', 'Reviewed the sole occurrence: the prince, son of the Roy, is proclaimed as the future husband. Roy is the historical spelling of roi, meaning king; preserve the canonical source spelling and modern lemma.'],
  ['srf_cendrillon_salle_lem_cendrillon_salle_noun_98f96330db_1739ffc4bd:sns_cendrillon_salle_piece_d_une_habitation_ouverte_aux_visiteurs_57513c3f60', 'approve', 'Reviewed the sole occurrence: the prince leads the arriving princess into the hall where the company is gathered. Salle means a hall/large room receiving visitors; the noun and context align.'],
  ['srf_cendrillon_sanspeine_lem_cendrillon_sans_peine_adverb_21f935ac2e_0ce7c87f9c:sns_cendrillon_sans_peine_facilement_sans_difficulte_a296f798cb', 'approve', 'Reviewed the sole closed-spelling occurrence: Cinderella’s foot enters the slipper sanspeine, easily/without difficulty. The adverbial phrase and sense are precise.'],
  ['srf_cendrillon_seieroient_lem_cendrillon_seoir_verb_660f2d3843_fadb59fca9:sns_cendrillon_seoir_convenir_a_quelqu_un_notamment_pour_un_vetement_fe737a2fde', 'approve', 'Reviewed the sole conditional: the sisters choose clothes and hairstyles that would suit them best. Seïeroient is a historical form of seoir in the sense “to suit/become”; the lemma and gloss fit.'],
  ['srf_cendrillon_sentoit_lem_sentir_b5d0d71517:sns_parure_sentir_recevoir_quelque_impression_par_le_moyen_des_sens_eprouver_en_soi_quelque_chose_d_agreable_ou_de_penible_46c27b8810', 'hold', 'The fixed phrase ne se sentoit pas de joye means Cinderella was beside herself/overcome with joy, not “to smell.” The gloss is wrong and the broad definition does not explain this idiom; refine the sense and re-review.'],
  ['srf_cendrillon_serois_lem_etre_e4322725b9:sns_parure_etre_definir_un_etat_une_caracteristique_du_sujet_151b22dfa3', 'approve', 'Reviewed the sole conditional question: Cinderella asks if she would be pleased to go to the ball. Serois is an older conditional form of être, and “to be” with a state/adjective is correct.'],
  ['srf_cendrillon_seroit_lem_etre_eda840c368:sns_parure_etre_definir_un_etat_une_caracteristique_du_sujet_151b22dfa3', 'approve', 'Reviewed the sole conditional: the prince would marry the one whose foot would fit exactly into the slipper. Seroit is an older form of être; the state/predicate sense fits.'],
  ['srf_cendrillon_sonner_lem_cendrillon_sonner_verb_67ed218754_d0652c1317:sns_cendrillon_sonner_rendre_un_son_7418463315', 'approve', 'Reviewed both clock occurrences: Cinderella hears eleven fifteen and the first stroke of midnight. Sonner means to sound/ring; the form and auditory context align.'],
  ['srf_cendrillon_sortoit_lem_zola_sortir_0e7ea8926d:sns_parure_sortir_passer_du_dedans_vers_le_dehors_d0f3037574', 'approve', 'Reviewed the sole historical imperfect: each mouse came out through the raised trapdoor before the fairy transformed it. Sortir means to move from inside to outside; this sense fits.'],
  ['srf_cendrillon_souhaiteroit_lem_cendrillon_souhaiter_verb_477fe5d82b_1d7cbc1e30:sns_cendrillon_souhaiter_former_un_souhait_4e7035628b', 'approve', 'Reviewed the sole conditional: Cinderella tells her godmother that she would like/wish to go to the ball again. Souhaiter expresses forming or making a wish, as defined.'],
  ['srf_cendrillon_soupirant_lem_cendrillon_soupirer_verb_c568eff571_d3f88298d2:sns_cendrillon_soupirer_pousser_des_soupirs_c5994511a4', 'approve', 'Reviewed the sole present participle: Cinderella answers yes while sighing. Soupirer means to sigh; the inflected form and emotional context align.'],
  ['srf_cendrillon_sourils_lem_cendrillon_souris_noun_38d05d47c9_17067d569e:sns_cendrillon_souris_petit_rongeur_de_la_famille_des_murides_c9314325ab', 'approve', 'Reviewed the sole historical spelling sourils: at midnight, the coach’s horses would turn back into mice. Sourils is the older source form of souris, and the rodent sense fits.'],
  ['srf_cendrillon_souris_lem_cendrillon_souris_noun_38d05d47c9_9105a7774f:sns_cendrillon_souris_petit_rongeur_de_la_famille_des_murides_c9314325ab', 'approve', 'Reviewed both occurrences: six mice emerge from the trap and become horses. Souris is the correct plural/unchanged-form noun for the rodents; the sense fits.'],
  ['srf_cendrillon_sourissiere_lem_cendrillon_souriciere_noun_9a24d78ac8_9fef24bc63:sns_cendrillon_souriciere_piege_destine_a_prendre_les_souris_34fab9d2fd', 'approve', 'Reviewed the sole historical spelling sourissiere: the fairy finds six mice in the mousetrap. The lemma souricière, surface form, and trap-for-mice definition match.'],
  ['srf_cendrillon_sourit_lem_parure_sourire_verb_3a9c8bdb81_d4f513d986:sns_parure_sourire_rire_sans_eclat_par_un_leger_mouvement_de_la_bouche_et_du_visage_0a672bedb9', 'approve', 'Reviewed the sole past-historic occurrence: Cinderella smiles before asking whether the princess was beautiful. Sourire means to smile, not laugh aloud; the sense definition is apt.'],
  ['srf_cendrillon_tems_lem_temps_f5fb7c08d7:sns_cendrillon_temps_duree_des_choses_marquee_par_certaines_periodes_et_principalement_par_la_revolution_apparente_du_soleil_ecart_entre_le_deroulement_de_deux_evenements_f5e0835412', 'approve', 'Reviewed the sole historical spelling en même tems: it means at the same time as the fairy changes Cinderella’s clothes. Tems maps to temps and the time/duration noun sense applies.'],
  ['srf_cendrillon_tenoit_lem_tenir_b3a57adf99:sns_cendrillon_tenir_avait_recu_cette_qualite_de_sa_mere_caba8d98b6', 'approve', 'Reviewed the sole occurrence: Cinderella had inherited her gentleness and goodness from her mother. Tenoit cela de means to derive/have that quality from; the contextual sense is accurately recorded.'],
  ['srf_cendrillon_traittemens_lem_cendrillon_traitement_noun_6f05f90352_83d1b0b80d:sns_cendrillon_traitement_accueil_reception_maniere_d_agir_avec_quelqu_un_87d2674574', 'approve', 'Reviewed the sole plural: the sisters ask pardon for the bad treatment they inflicted on Cinderella. Traittemens denotes treatment/manner of acting toward someone; mauvais supplies the negative quality.'],
  ['srf_cendrillon_tres_magnifiquement_lem_cendrillon_tres_magnifiquement_adverb_738cee2fa3_f5f1945bb9:sns_cendrillon_tres_magnifiquement_d_une_maniere_extremement_somptueuse_e6b8322ed9', 'approve', 'Reviewed the sole occurrence: the sisters were dressed very magnificently, in contrast to Cinderella’s shabby clothes. The adverb means in an extremely sumptuous manner, as glossed.'],
  ['srf_cendrillon_trompe_lem_cendrillon_trompe_noun_72d5745618_a2cb6726ba:sns_cendrillon_trompe_trompette_fac927ac0e', 'approve', 'Reviewed the sole idiomatic occurrence à son de trompe: the prince has his marriage announcement made with a trumpet fanfare. Trompe here means a trumpet; the noun sense matches.'],
  ['srf_cendrillon_trouveras_lem_zola_trouver_eaf1a0310d:sns_parure_trouver_rencontrer_la_personne_ou_la_chose_que_l_on_cherche_26ab9fa323', 'approve', 'Reviewed the sole future: the godmother tells Cinderella she will find six lizards behind the watering can. Trouver means to find/encounter the sought object, matching the instruction.'],
  ['srf_cendrillon_vaines_lem_vain_062448121c:sns_cendrillon_vain_qui_ne_produit_aucun_resultat_utile_sans_effet_8730942f5a', 'approve', 'Reviewed the sole moralité occurrence: for social advancement, some things will prove vain/useless. Vaines means producing no useful result or having no effect; the noun-adjective use fits.'],
  ['srf_cendrillon_velours_lem_cendrillon_velours_noun_252b9bfd90_4101cf9f0a:sns_cendrillon_velours_etoffe_a_poil_court_et_serre_405a071cde', 'approve', 'Reviewed the sole occurrence: the elder sister plans to wear a red velvet dress. Velours is the fabric velvet; the noun, gloss, and context agree.'],
  ['srf_cendrillon_venue_lem_venir_20a4a3ab31:sns_parure_venir_se_rendre_sur_le_lieu_ou_se_trouve_celui_qui_parle_ou_dont_on_parle_317226d173', 'approve', 'Reviewed the sole feminine participle venuë in si tu estois venue au Bal: if the sister had come to the ball. The form agrees with the feminine subject and the movement-to-place sense fits.'],
  ['srf_cendrillon_verre_lem_cendrillon_verre_noun_ff9337ea78_618fa3a855:sns_cendrillon_verre_matiere_solide_amorphe_transparente_dure_et_fragile_elaboree_a_l_aide_de_sable_siliceux_melee_de_calcaire_de_soude_ou_de_potasse_avec_laquelle_on_fabrique_des_produits_plats_comme_les_vitrages_des_produits_creux_comme_la_gobeleterie_les_bouteilles_etc_et_des_fibres_a_l_usage_de_la_construction_72e8f3ed6e', 'approve', 'Reviewed all three occurrences: the glass slippers are made of verre, and one is described as a glass slipper by the guards and sisters. Verre denotes the material glass in each; footwear is a separate word.'],
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
  sequence: 11, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
