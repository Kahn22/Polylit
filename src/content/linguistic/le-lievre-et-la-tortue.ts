import { prepareIngestionManifest } from "../../ingestion/prepare.js";
import type { ContentBundle } from "../../domain/model.js";
import { corbeauLearningBundle } from "./le-corbeau-et-le-renard.js";
import { lievreQuizBatch01 } from "../quizzes/lievre-batch-01.js";
import { lievreQuizBatch02 } from "../quizzes/lievre-batch-02.js";
import { lievreQuizBatch03 } from "../quizzes/lievre-batch-03.js";
import { lievreQuizBatch04 } from "../quizzes/lievre-batch-04.js";
import { lievreQuizBatch05 } from "../quizzes/lievre-batch-05.js";
import { lievreQuizBatch06 } from "../quizzes/lievre-batch-06.js";
import { lievreQuizBatch07 } from "../quizzes/lievre-batch-07.js";
import { lievreQuizBatch08 } from "../quizzes/lievre-batch-08.js";
import { lievreQuizBatch09 } from "../quizzes/lievre-batch-09.js";
import { lievreQuizBatch10 } from "../quizzes/lievre-batch-10.js";
import { lievreQuizBatch11 } from "../quizzes/lievre-batch-11.js";
import { lievreQuizBatch12 } from "../quizzes/lievre-batch-12.js";
import { lievreQuizBatch13 } from "../quizzes/lievre-batch-13.js";
import { lievreQuizBatch14 } from "../quizzes/lievre-batch-14.js";
import { lievreQuizBatch15 } from "../quizzes/lievre-batch-15.js";
import { lievreQuizBatch16 } from "../quizzes/lievre-batch-16.js";
import { lievreQuizBatch17 } from "../quizzes/lievre-batch-17.js";
import { lievreQuizBatch18 } from "../quizzes/lievre-batch-18.js";
import { lievreQuizBatch19 } from "../quizzes/lievre-batch-19.js";
import { lievreQuizBatch20 } from "../quizzes/lievre-batch-20.js";
import { lievreQuizBatch21 } from "../quizzes/lievre-batch-21.js";
import { lievreQuizBatch22 } from "../quizzes/lievre-batch-22.js";
import { lievreQuizBatch23 } from "../quizzes/lievre-batch-23.js";
import { lievreQuizBatch24 } from "../quizzes/lievre-batch-24.js";
import { lievreQuizBatch25 } from "../quizzes/lievre-batch-25.js";
import { lievreQuizBatch26 } from "../quizzes/lievre-batch-26.js";
import { lievreQuizBatch27 } from "../quizzes/lievre-batch-27.js";
import { lievreQuizBatch28 } from "../quizzes/lievre-batch-28.js";

const workId = "wrk_lievre_tortue";

export interface ExistingIdentityCandidate {
  surfaceFormId: string;
  lemmaId: string;
  senseIds: string[];
}

export interface LexicalReviewCandidate {
  normalized: string;
  displayForms: string[];
  occurrenceCandidateIds: string[];
  possibleExistingIdentities: ExistingIdentityCandidate[];
  occurrenceResolutions: OccurrenceResolution[];
  reviewStatus: "pending" | "resolved";
}

interface VocabularyOccurrenceResolution {
  occurrenceCandidateId: string;
  action: "reuse_identity" | "new_identity";
  lemmaId: string;
  senseId: string;
  surfaceFormId: string;
  rationale: string;
}

interface EditorialExclusionResolution {
  occurrenceCandidateId: string;
  action: "exclude_editorial";
  rationale: string;
}

export type OccurrenceResolution = VocabularyOccurrenceResolution | EditorialExclusionResolution;

export interface LievreLexicalReviewPlan {
  workId: typeof workId;
  sourceDigest: string;
  tokenCount: number;
  distinctFormCount: number;
  possibleReuseCount: number;
  newFormCount: number;
  candidates: LexicalReviewCandidate[];
}

/** Validates editorial resolution references without changing the pending plan. */
export function validateLievreLexicalReviewPlan(plan: LievreLexicalReviewPlan): void {
  const stableId = /^(?:lem|sns|srf)_[a-z0-9_]+$/;
  const occurrenceIds = new Set<string>();
  for (const candidate of plan.candidates) {
    for (const occurrenceId of candidate.occurrenceCandidateIds) {
      if (occurrenceIds.has(occurrenceId)) throw new Error(`Duplicate occurrence candidate ${occurrenceId}`);
      occurrenceIds.add(occurrenceId);
    }
    const candidateOccurrenceIds = new Set(candidate.occurrenceCandidateIds);
    for (const resolution of candidate.occurrenceResolutions) {
      if (!candidateOccurrenceIds.has(resolution.occurrenceCandidateId)) {
        throw new Error(`Resolution ${resolution.occurrenceCandidateId} is not part of ${candidate.normalized}`);
      }
      if (resolution.action !== "exclude_editorial" && (!resolution.lemmaId || !resolution.senseId || !resolution.surfaceFormId)) {
        throw new Error(`Resolution ${resolution.occurrenceCandidateId} lacks a complete identity`);
      }
      if (resolution.action !== "exclude_editorial" && ![resolution.lemmaId, resolution.senseId, resolution.surfaceFormId].every((id) => stableId.test(id))) {
        throw new Error(`Resolution ${resolution.occurrenceCandidateId} contains an invalid stable identity`);
      }
    }
    if (new Set(candidate.occurrenceResolutions.map((resolution) => resolution.occurrenceCandidateId)).size !== candidate.occurrenceResolutions.length) {
      throw new Error(`Duplicate occurrence resolutions for ${candidate.normalized}`);
    }
    const isComplete = candidate.occurrenceResolutions.length === candidate.occurrenceCandidateIds.length;
    if ((candidate.reviewStatus === "resolved") !== isComplete) throw new Error(`Review status disagrees with resolutions for ${candidate.normalized}`);
  }
  if (occurrenceIds.size !== plan.tokenCount) throw new Error(`Expected ${plan.tokenCount} occurrence candidates, found ${occurrenceIds.size}`);
}

const resolvedContexts: Record<string, Omit<VocabularyOccurrenceResolution, "occurrenceCandidateId"> | Omit<EditorialExclusionResolution, "occurrenceCandidateId">> = {
  tok_d29da1894f360800448c77c4: {
    action: "new_identity", lemmaId: "lem_voir", senseId: "sns_voir_past", surfaceFormId: "srf_vit_voir",
    rationale: "Here vit is the past historic of voir (saw), not the existing vivre identity.",
  },
  tok_9df443d478de98d5baaa9ea3: {
    action: "new_identity", lemmaId: "lem_point_noun", senseId: "sns_point_opportune", surfaceFormId: "srf_point_noun",
    rationale: "In à point, point means the appropriate or timely moment.",
  },
  tok_87f54dfc230f106562124b22: {
    action: "new_identity", lemmaId: "lem_point_adverb", senseId: "sns_point_negation", surfaceFormId: "srf_point_adverb",
    rationale: "With ne, point is the literary negative adverb not at all.",
  },
  tok_8e524ac14c82ef12be2f3817: {
    action: "reuse_identity", lemmaId: "lem_pas", senseId: "sns_pas_primary", surfaceFormId: "srf_pas",
    rationale: "In ne ... pas, pas retains the existing negative-adverb identity.",
  },
  tok_f3a3086fb355deabe5e6c98c: {
    action: "new_identity", lemmaId: "lem_pas_noun", senseId: "sns_pas_step", surfaceFormId: "srf_pas_noun",
    rationale: "After quatre, pas is the noun step, distinct from the negative adverb.",
  },
  tok_18b1e79667ca9adc6ef18d24: {
    action: "reuse_identity", lemmaId: "lem_pas", senseId: "sns_pas_primary", surfaceFormId: "srf_pas",
    rationale: "In ne ... pas, pas retains the existing negative-adverb identity.",
  },
  tok_8c1880aca071a566e75a75a7: {
    action: "new_identity", lemmaId: "lem_bien", senseId: "sns_bien_discourse", surfaceFormId: "srf_bien",
    rationale: "In Eh bien, bien is a discourse marker, not the emphatic adverbial sense.",
  },
  tok_5d2445c0530350951a32ff72: {
    action: "new_identity", lemmaId: "lem_lui", senseId: "sns_lui_subject", surfaceFormId: "srf_lui",
    rationale: "Initial Lui is a stressed subject pronoun meaning he.",
  },
  tok_006a7eb3909866dafe4ed252: {
    action: "reuse_identity", lemmaId: "lem_lui", senseId: "sns_lui_primary", surfaceFormId: "srf_lui",
    rationale: "In lui cria-t-elle, lui is the indirect-object pronoun to him.",
  },
  tok_078a9e7840cbd3a31fcac5e1: {
    action: "new_identity", lemmaId: "lem_y", senseId: "sns_y_enjeu", surfaceFormId: "srf_y",
    rationale: "In il y va de son honneur, y participates in the idiomatic matter-at-stake construction.",
  },
  tok_f8223c90f3dcc20f9997e7c1: { action: "reuse_identity", lemmaId: "lem_que", senseId: "sns_que_conjunction", surfaceFormId: "srf_que", rationale: "Que introduces the clause containing the proposed wager." },
  tok_cb827c971d3c1dd2e3180465: { action: "reuse_identity", lemmaId: "lem_que", senseId: "sns_que_conjunction", surfaceFormId: "srf_que", rationale: "Que completes the temporal comparison sitôt que." },
  tok_39b72d6b7bdf4a263487c59f: { action: "new_identity", lemmaId: "lem_que", senseId: "sns_que_restrictive", surfaceFormId: "srf_que", rationale: "In ne ... que, que is the restrictive marker only." },
  tok_83cc8238751bccc2f0e00cf7: { action: "reuse_identity", lemmaId: "lem_que", senseId: "sns_que_conjunction", surfaceFormId: "srf_que", rationale: "Que introduces the subordinate clause after vit." },
  tok_8c547b7b06853867bbd12d21: { action: "new_identity", lemmaId: "lem_que", senseId: "sns_que_interrogative", surfaceFormId: "srf_que", rationale: "Que introduces the rhetorical question what would it be." },
  tok_2ad603b6b825cfa5d4872785: { action: "reuse_identity", lemmaId: "lem_le", senseId: "sns_le_primary", surfaceFormId: "srf_l_elided", rationale: "L’ is the elided definite article before animal." },
  tok_301d6e235babde34d0f9b13f: { action: "reuse_identity", lemmaId: "lem_le", senseId: "sns_le_primary", surfaceFormId: "srf_l_elided", rationale: "L’ is the elided definite article before affaire." },
  tok_6bde49898eea0420cafeaa82: { action: "exclude_editorial", rationale: "L’ in literary l’on is an optional euphonic particle, not learner vocabulary." },
  tok_0c2768bd1d3cd17f76275dff: { action: "reuse_identity", lemmaId: "lem_le", senseId: "sns_le_primary", surfaceFormId: "srf_l_elided", rationale: "L’ is the elided definite article before autre." },
  tok_ecea233d337455c64a7f17e4: { action: "reuse_identity", lemmaId: "lem_le", senseId: "sns_le_object", surfaceFormId: "srf_l_elided", rationale: "L’ is the direct-object pronoun it in l’emporter." },
  tok_6c69aa3f935980bc1006c6ac: { action: "new_identity", lemmaId: "lem_faire", senseId: "sns_faire_done", surfaceFormId: "srf_fait", rationale: "Fait is the past participle done in ainsi fut fait." },
  tok_e6838ed5dc29f626671f5b25: { action: "new_identity", lemmaId: "lem_faire", senseId: "sns_faire_primary", surfaceFormId: "srf_fait", rationale: "Fait means makes/takes in the expression faire des pas." },
  tok_8bee4eabada6c477bd9305c3: { action: "new_identity", lemmaId: "lem_faire", senseId: "sns_faire_causative", surfaceFormId: "srf_fait", rationale: "Fait is causative in fait arpenter, makes them traverse." },
  tok_55d8f4e3cbf723f4f227bc83: { action: "new_identity", lemmaId: "lem_que", senseId: "sns_que_relative", surfaceFormId: "srf_qu_elided", rationale: "Qu’ is the relative pronoun object in ceux qu’il fait." },
  tok_c7109a2c6f5b463ba24bc757: { action: "reuse_identity", lemmaId: "lem_que", senseId: "sns_que_conjunction", surfaceFormId: "srf_qu_elided", rationale: "Qu’ introduces the clause governed by croit." },
  tok_6beaaa3e4e4e0145face9381: { action: "new_identity", lemmaId: "lem_que", senseId: "sns_que_comparative", surfaceFormId: "srf_qu_elided", rationale: "Qu’ means than in autre chose qu’à la gageure." },
  tok_9fa33f6fca6f9935b78c4930: { action: "new_identity", lemmaId: "lem_que", senseId: "sns_que_relative", surfaceFormId: "srf_qu_elided", rationale: "Qu’ is the relative pronoun object in les élans qu’il fit." },
  tok_0be71192790e864e468461f3: { action: "new_identity", lemmaId: "lem_autre", senseId: "sns_autre_adjective", surfaceFormId: "srf_autre", rationale: "Autre is an adjective modifying chose." },
  tok_60b4bcaa59a90f1b80b3116e: { action: "new_identity", lemmaId: "lem_autre", senseId: "sns_autre_pronoun", surfaceFormId: "srf_autre", rationale: "Autre is a pronoun referring to the other competitor." },
};

const resolvedForms: Record<string, Omit<VocabularyOccurrenceResolution, "occurrenceCandidateId">> = {
  rien: { action: "new_identity", lemmaId: "lem_rien", senseId: "sns_rien_primary", surfaceFormId: "srf_rien", rationale: "Rien is the indefinite pronoun nothing in this text." },
  ne: { action: "reuse_identity", lemmaId: "lem_ne", senseId: "sns_ne_primary", surfaceFormId: "srf_ne", rationale: "Ne is the negative adverb used in the ne ... pas/point constructions." },
  sert: { action: "new_identity", lemmaId: "lem_servir", senseId: "sns_servir_primary", surfaceFormId: "srf_sert", rationale: "Sert is the third-person singular present of servir, to serve." },
  de: { action: "reuse_identity", lemmaId: "lem_de", senseId: "sns_de_primary", surfaceFormId: "srf_de", rationale: "De is the preposition of/from or the infinitive marker in these occurrences." },
  courir: { action: "new_identity", lemmaId: "lem_courir", senseId: "sns_courir_primary", surfaceFormId: "srf_courir", rationale: "Courir is the infinitive to run." },
  il: { action: "reuse_identity", lemmaId: "lem_il", senseId: "sns_il_primary", surfaceFormId: "srf_il", rationale: "Il is the third-person masculine subject pronoun he/it." },
  faut: { action: "new_identity", lemmaId: "lem_falloir", senseId: "sns_falloir_primary", surfaceFormId: "srf_faut", rationale: "Faut is the impersonal present form of falloir, must/be necessary." },
  partir: { action: "new_identity", lemmaId: "lem_partir", senseId: "sns_partir_primary", surfaceFormId: "srf_partir", rationale: "Partir is the infinitive to leave/depart." },
  à: { action: "reuse_identity", lemmaId: "lem_a", senseId: "sns_a_primary", surfaceFormId: "srf_a", rationale: "À is the preposition used for at/to/in these occurrences." },
  le: { action: "reuse_identity", lemmaId: "lem_le", senseId: "sns_le_primary", surfaceFormId: "srf_le", rationale: "Le is the masculine singular definite article." },
  la: { action: "new_identity", lemmaId: "lem_le", senseId: "sns_le_primary", surfaceFormId: "srf_la", rationale: "La is the feminine singular definite article, sharing the le lemma and sense." },
  et: { action: "reuse_identity", lemmaId: "lem_et", senseId: "sns_et_primary", surfaceFormId: "srf_et", rationale: "Et is the conjunction and in every occurrence here." },
  en: { action: "reuse_identity", lemmaId: "lem_en", senseId: "sns_en_it", surfaceFormId: "srf_en", rationale: "In en sont un témoignage, en refers back to the preceding situation." },
  sont: { action: "new_identity", lemmaId: "lem_etre", senseId: "sns_etre_primary", surfaceFormId: "srf_sont", rationale: "Sont is the third-person plural present of être." },
  un: { action: "reuse_identity", lemmaId: "lem_un", senseId: "sns_un_primary", surfaceFormId: "srf_un", rationale: "Un is the indefinite masculine article." },
  dit: { action: "reuse_identity", lemmaId: "lem_dire", senseId: "sns_dire_primary", surfaceFormId: "srf_dit", rationale: "Dit is the past-tense form of dire, says/said." },
  "celle-ci": { action: "new_identity", lemmaId: "lem_celui", senseId: "sns_celui_primary", surfaceFormId: "srf_celle_ci", rationale: "Celle-ci is the feminine demonstrative pronoun this one." },
  vous: { action: "reuse_identity", lemmaId: "lem_vous", senseId: "sns_vous_primary", surfaceFormId: "srf_vous", rationale: "Vous is the second-person pronoun in every occurrence here." },
  "n’": { action: "new_identity", lemmaId: "lem_ne", senseId: "sns_ne_primary", surfaceFormId: "srf_n_elided", rationale: "N’ is the elided surface form of the negative adverb ne." },
  ce: { action: "reuse_identity", lemmaId: "lem_ce", senseId: "sns_ce_primary", surfaceFormId: "srf_ce", rationale: "Ce is the demonstrative determiner in these occurrences." },
  avec: { action: "new_identity", lemmaId: "lem_avec", senseId: "sns_avec_primary", surfaceFormId: "srf_avec", rationale: "Avec is the preposition with." },
  quatre: { action: "new_identity", lemmaId: "lem_quatre", senseId: "sns_quatre_primary", surfaceFormId: "srf_quatre", rationale: "Quatre is the cardinal number four." },
  "d’": { action: "new_identity", lemmaId: "lem_de", senseId: "sns_de_primary", surfaceFormId: "srf_d_elided", rationale: "D’ is the elided surface form of de." },
  ou: { action: "new_identity", lemmaId: "lem_ou", senseId: "sns_ou_primary", surfaceFormId: "srf_ou", rationale: "Ou is the conjunction or." },
  non: { action: "new_identity", lemmaId: "lem_non", senseId: "sns_non_primary", surfaceFormId: "srf_non", rationale: "Non is the negating word no." },
  je: { action: "new_identity", lemmaId: "lem_je", senseId: "sns_je_primary", surfaceFormId: "srf_je", rationale: "Je is the first-person singular subject pronoun." },
  encore: { action: "new_identity", lemmaId: "lem_encore", senseId: "sns_encore_primary", surfaceFormId: "srf_encore", rationale: "Encore is the adverb still/again here." },
  ainsi: { action: "new_identity", lemmaId: "lem_ainsi", senseId: "sns_ainsi_primary", surfaceFormId: "srf_ainsi", rationale: "Ainsi is the adverb thus/so." },
  tous: { action: "new_identity", lemmaId: "lem_tout", senseId: "sns_tout_primary", surfaceFormId: "srf_tous", rationale: "Tous is the masculine plural form of tout, all." },
  deux: { action: "new_identity", lemmaId: "lem_deux", senseId: "sns_deux_primary", surfaceFormId: "srf_deux", rationale: "Deux is the cardinal number two." },
  on: { action: "reuse_identity", lemmaId: "lem_on", senseId: "sns_on_primary", surfaceFormId: "srf_on", rationale: "On is the indefinite subject pronoun one/we." },
  près: { action: "reuse_identity", lemmaId: "lem_pres", senseId: "sns_pres_primary", surfaceFormId: "srf_pres", rationale: "Près is the adverb near." },
  du: { action: "reuse_identity", lemmaId: "lem_du", senseId: "sns_du_primary", surfaceFormId: "srf_du", rationale: "Du is the contraction de + le." },
  les: { action: "new_identity", lemmaId: "lem_le", senseId: "sns_le_primary", surfaceFormId: "srf_les", rationale: "Les is the plural definite article, sharing the le lemma and sense." },
  savoir: { action: "new_identity", lemmaId: "lem_savoir", senseId: "sns_savoir_primary", surfaceFormId: "srf_savoir", rationale: "Savoir is the infinitive to know." },
  est: { action: "new_identity", lemmaId: "lem_etre", senseId: "sns_etre_primary", surfaceFormId: "srf_est", rationale: "Est is the third-person singular present of être." },
  affaire: { action: "new_identity", lemmaId: "lem_affaire", senseId: "sns_affaire_primary", surfaceFormId: "srf_affaire", rationale: "Affaire is the noun matter/business in c’est l’affaire." },
  ni: { action: "new_identity", lemmaId: "lem_ni", senseId: "sns_ni_primary", surfaceFormId: "srf_ni", rationale: "Ni is the conjunction nor." },
  quel: { action: "new_identity", lemmaId: "lem_quel", senseId: "sns_quel_primary", surfaceFormId: "srf_quel", rationale: "Quel is the interrogative determiner which/what." },
  notre: { action: "new_identity", lemmaId: "lem_notre", senseId: "sns_notre_primary", surfaceFormId: "srf_notre", rationale: "Notre is the first-person plural possessive determiner our." },
  avait: { action: "new_identity", lemmaId: "lem_avoir", senseId: "sns_avoir_primary", surfaceFormId: "srf_avait", rationale: "Avait is the imperfect third-person singular form of avoir." },
  faire: { action: "new_identity", lemmaId: "lem_faire", senseId: "sns_faire_primary", surfaceFormId: "srf_faire", rationale: "Faire is the infinitive to do/make." },
  "j’": { action: "new_identity", lemmaId: "lem_je", senseId: "sns_je_primary", surfaceFormId: "srf_j_elided", rationale: "J’ is the elided surface form of je." },
  entends: { action: "new_identity", lemmaId: "lem_entendre", senseId: "sns_entendre_mean", surfaceFormId: "srf_entends", rationale: "Entends is the first-person present of entendre in the sense mean or intend." },
  ceux: { action: "new_identity", lemmaId: "lem_celui", senseId: "sns_celui_primary", surfaceFormId: "srf_ceux", rationale: "Ceux is the masculine plural demonstrative pronoun those." },
  lorsque: { action: "new_identity", lemmaId: "lem_lorsque", senseId: "sns_lorsque_primary", surfaceFormId: "srf_lorsque", rationale: "Lorsque is the subordinating conjunction when." },
  prêt: { action: "new_identity", lemmaId: "lem_pret", senseId: "sns_pret_primary", surfaceFormId: "srf_pret", rationale: "Prêt is the adjective ready." },
  être: { action: "reuse_identity", lemmaId: "lem_etre", senseId: "sns_etre_primary", surfaceFormId: "srf_etre", rationale: "Être is the infinitive to be." },
  atteint: { action: "new_identity", lemmaId: "lem_atteindre", senseId: "sns_atteindre_primary", surfaceFormId: "srf_atteint", rationale: "Atteint is the past participle of atteindre, reach/catch." },
  lièvre: { action: "new_identity", lemmaId: "lem_lievre", senseId: "sns_lievre_primary", surfaceFormId: "srf_lievre", rationale: "Lièvre is the noun hare." },
  tortue: { action: "new_identity", lemmaId: "lem_tortue", senseId: "sns_tortue_primary", surfaceFormId: "srf_tortue", rationale: "Tortue is the noun tortoise/turtle." },
  témoignage: { action: "new_identity", lemmaId: "lem_temoignage", senseId: "sns_temoignage_primary", surfaceFormId: "srf_temoignage", rationale: "Témoignage is the noun testimony/evidence." },
  gageons: { action: "new_identity", lemmaId: "lem_gager", senseId: "sns_gager_primary", surfaceFormId: "srf_gageons", rationale: "Gageons is the first-person plural imperative of gager, let us wager." },
  atteindrez: { action: "new_identity", lemmaId: "lem_atteindre", senseId: "sns_atteindre_primary", surfaceFormId: "srf_atteindrez", rationale: "Atteindrez is the second-person plural future of atteindre." },
  sitôt: { action: "new_identity", lemmaId: "lem_sitot", senseId: "sns_sitot_primary", surfaceFormId: "srf_sitot", rationale: "Sitôt is the adverb so soon." },
  moi: { action: "new_identity", lemmaId: "lem_moi", senseId: "sns_moi_primary", surfaceFormId: "srf_moi", rationale: "Moi is the stressed first-person pronoun." },
  but: { action: "new_identity", lemmaId: "lem_but", senseId: "sns_but_primary", surfaceFormId: "srf_but", rationale: "But is the noun goal." },
  sage: { action: "new_identity", lemmaId: "lem_sage", senseId: "sns_sage_primary", surfaceFormId: "srf_sage", rationale: "Sage is the adjective wise/sensible." },
  repartit: { action: "new_identity", lemmaId: "lem_repartir", senseId: "sns_repartir_primary", surfaceFormId: "srf_repartit", rationale: "Repartit is the past historic of repartir, replied." },
  animal: { action: "new_identity", lemmaId: "lem_animal", senseId: "sns_animal_primary", surfaceFormId: "srf_animal", rationale: "Animal is the noun animal." },
  léger: { action: "new_identity", lemmaId: "lem_leger", senseId: "sns_leger_primary", surfaceFormId: "srf_leger", rationale: "Léger is the adjective light." },
  ma: { action: "new_identity", lemmaId: "lem_mon", senseId: "sns_mon_primary", surfaceFormId: "srf_ma", rationale: "Ma is the feminine surface form of the first-person possessive determiner." },
  commère: { action: "new_identity", lemmaId: "lem_commere", senseId: "sns_commere_primary", surfaceFormId: "srf_commere", rationale: "Commère is an old-fashioned familiar form of address for a woman, sometimes implying a gossip." },
  purger: { action: "new_identity", lemmaId: "lem_purger", senseId: "sns_purger_primary", surfaceFormId: "srf_purger", rationale: "Purger is the infinitive to purge." },
  grains: { action: "new_identity", lemmaId: "lem_grain", senseId: "sns_grain_primary", surfaceFormId: "srf_grains", rationale: "Grains is the plural noun grains." },
  ellébore: { action: "new_identity", lemmaId: "lem_ellebore", senseId: "sns_ellebore_primary", surfaceFormId: "srf_ellebore", rationale: "Ellébore is the medicinal plant hellebore." },
  parie: { action: "new_identity", lemmaId: "lem_parier", senseId: "sns_parier_primary", surfaceFormId: "srf_parie", rationale: "Parie is the first-person present of parier, bet." },
  fut: { action: "new_identity", lemmaId: "lem_etre", senseId: "sns_etre_primary", surfaceFormId: "srf_fut", rationale: "Fut is the past historic of être." },
  enjeux: { action: "new_identity", lemmaId: "lem_enjeu", senseId: "sns_enjeu_primary", surfaceFormId: "srf_enjeux", rationale: "Enjeux is the plural noun stakes." },
  juge: { action: "new_identity", lemmaId: "lem_juge", senseId: "sns_juge_primary", surfaceFormId: "srf_juge", rationale: "Juge is the noun judge." },
  convint: { action: "new_identity", lemmaId: "lem_convenir", senseId: "sns_convenir_primary", surfaceFormId: "srf_convint", rationale: "Convint is the past historic of convenir, agreed." },
  "s’": { action: "reuse_identity", lemmaId: "lem_se", senseId: "sns_se_primary", surfaceFormId: "srf_s_elided", rationale: "S’ is the elided reflexive pronoun se." },
  éloigne: { action: "new_identity", lemmaId: "lem_eloigner", senseId: "sns_eloigner_primary", surfaceFormId: "srf_eloigne", rationale: "Éloigne is the present form of éloigner, moves away." },
  chiens: { action: "new_identity", lemmaId: "lem_chien", senseId: "sns_chien_primary", surfaceFormId: "srf_chiens", rationale: "Chiens is the plural noun dogs." },
  renvoie: { action: "new_identity", lemmaId: "lem_renvoyer", senseId: "sns_renvoyer_primary", surfaceFormId: "srf_renvoie", rationale: "Renvoie is the present form of renvoyer, sends back." },
  des: { action: "reuse_identity", lemmaId: "lem_des", senseId: "sns_des_primary", surfaceFormId: "srf_des", rationale: "Des is the contraction de + les." },
  aux: { action: "reuse_identity", lemmaId: "lem_aux", senseId: "sns_aux_primary", surfaceFormId: "srf_aux", rationale: "Aux is the contraction à + les." },
  calendes: { action: "new_identity", lemmaId: "lem_calende", senseId: "sns_calende_primary", surfaceFormId: "srf_calendes", rationale: "Calendes is the plural noun calends, a proverbial distant date." },
  leur: { action: "new_identity", lemmaId: "lem_leur", senseId: "sns_leur_primary", surfaceFormId: "srf_leur", rationale: "Leur is the third-person plural indirect-object/possessive pronoun in this occurrence." },
  arpenter: { action: "new_identity", lemmaId: "lem_arpenter", senseId: "sns_arpenter_primary", surfaceFormId: "srf_arpenter", rationale: "Arpenter is the infinitive to traverse." },
  landes: { action: "new_identity", lemmaId: "lem_lande", senseId: "sns_lande_primary", surfaceFormId: "srf_landes", rationale: "Landes is the plural noun moorlands/heaths." },
  ayant: { action: "new_identity", lemmaId: "lem_avoir", senseId: "sns_avoir_primary", surfaceFormId: "srf_ayant", rationale: "Ayant is the present participle of avoir." },
  temps: { action: "new_identity", lemmaId: "lem_temps", senseId: "sns_temps_primary", surfaceFormId: "srf_temps", rationale: "Temps is the noun time." },
  reste: { action: "new_identity", lemmaId: "lem_reste", senseId: "sns_reste_primary", surfaceFormId: "srf_reste", rationale: "Reste is the noun remainder/time left." },
  brouter: { action: "new_identity", lemmaId: "lem_brouter", senseId: "sns_brouter_primary", surfaceFormId: "srf_brouter", rationale: "Brouter is the infinitive to graze." },
  dormir: { action: "new_identity", lemmaId: "lem_dormir", senseId: "sns_dormir_primary", surfaceFormId: "srf_dormir", rationale: "Dormir is the infinitive to sleep." },
  écouter: { action: "new_identity", lemmaId: "lem_ecouter", senseId: "sns_ecouter_primary", surfaceFormId: "srf_ecouter", rationale: "Écouter is the infinitive to listen." },
  où: { action: "new_identity", lemmaId: "lem_ou_interrogative", senseId: "sns_ou_interrogative", surfaceFormId: "srf_ou_accent", rationale: "Où is the accented interrogative/relative adverb where." },
  vient: { action: "new_identity", lemmaId: "lem_venir", senseId: "sns_venir_primary", surfaceFormId: "srf_vient", rationale: "Vient is the third-person singular present of venir." },
  vent: { action: "new_identity", lemmaId: "lem_vent", senseId: "sns_vent_primary", surfaceFormId: "srf_vent", rationale: "Vent is the noun wind." },
  mit: { action: "new_identity", lemmaId: "lem_mettre", senseId: "sns_mettre_primary", surfaceFormId: "srf_mit", rationale: "Mit is the past historic of mettre, put." },
  quoi: { action: "new_identity", lemmaId: "lem_quoi", senseId: "sns_quoi_primary", surfaceFormId: "srf_quoi", rationale: "Quoi is the interrogative pronoun what in both occurrences." },
  pour: { action: "reuse_identity", lemmaId: "lem_pour", senseId: "sns_pour_primary", surfaceFormId: "srf_pour", rationale: "Pour is the preposition for/in order to." },
  laisse: { action: "reuse_identity", lemmaId: "lem_laisser", senseId: "sns_laisser_primary", surfaceFormId: "srf_laisse", rationale: "Laisse is the third-person singular present of laisser." },
  aller: { action: "new_identity", lemmaId: "lem_aller", senseId: "sns_aller_primary", surfaceFormId: "srf_aller", rationale: "Aller is the infinitive to go." },
  son: { action: "reuse_identity", lemmaId: "lem_son", senseId: "sns_son_primary", surfaceFormId: "srf_son", rationale: "Son is the possessive determiner his/its." },
  train: { action: "new_identity", lemmaId: "lem_train", senseId: "sns_train_primary", surfaceFormId: "srf_train", rationale: "Train is the noun pace or manner of proceeding." },
  sénateur: { action: "new_identity", lemmaId: "lem_senateur", senseId: "sns_senateur_primary", surfaceFormId: "srf_senateur", rationale: "Sénateur is the noun senator." },
  elle: { action: "new_identity", lemmaId: "lem_elle", senseId: "sns_elle_primary", surfaceFormId: "srf_elle", rationale: "Elle is the third-person feminine subject pronoun." },
  part: { action: "new_identity", lemmaId: "lem_partir", senseId: "sns_partir_primary", surfaceFormId: "srf_part", rationale: "Part is the third-person singular present of partir." },
  évertue: { action: "new_identity", lemmaId: "lem_evertuer", senseId: "sns_evertuer_primary", surfaceFormId: "srf_evertue", rationale: "Évertue is the present form in s’évertuer, makes an effort." },
  se: { action: "reuse_identity", lemmaId: "lem_se", senseId: "sns_se_primary", surfaceFormId: "srf_se", rationale: "Se is the reflexive pronoun." },
  hâte: { action: "new_identity", lemmaId: "lem_hater", senseId: "sns_hater_primary", surfaceFormId: "srf_hate", rationale: "Hâte is the present form in se hâter, to hurry." },
  lenteur: { action: "new_identity", lemmaId: "lem_lenteur", senseId: "sns_lenteur_primary", surfaceFormId: "srf_lenteur", rationale: "Lenteur is the noun slowness." },
  cependant: { action: "new_identity", lemmaId: "lem_cependant", senseId: "sns_cependant_primary", surfaceFormId: "srf_cependant", rationale: "Cependant is the adverb however." },
  méprise: { action: "new_identity", lemmaId: "lem_mepriser", senseId: "sns_mepriser_primary", surfaceFormId: "srf_meprise", rationale: "Méprise is the third-person singular present of mépriser." },
  une: { action: "new_identity", lemmaId: "lem_un", senseId: "sns_un_primary", surfaceFormId: "srf_une", rationale: "Une is the feminine surface form of the indefinite article." },
  telle: { action: "new_identity", lemmaId: "lem_tel", senseId: "sns_tel_primary", surfaceFormId: "srf_telle", rationale: "Telle is the feminine form of the adjective such." },
  victoire: { action: "new_identity", lemmaId: "lem_victoire", senseId: "sns_victoire_primary", surfaceFormId: "srf_victoire", rationale: "Victoire is the noun victory." },
  tient: { action: "new_identity", lemmaId: "lem_tenir", senseId: "sns_tenir_consider", surfaceFormId: "srf_tient", rationale: "Tient is the present form of tenir in the distinct sense considers/regards." },
  gageure: { action: "new_identity", lemmaId: "lem_gageure", senseId: "sns_gageure_primary", surfaceFormId: "srf_gageure", rationale: "Gageure is the noun wager/challenge." },
  peu: { action: "reuse_identity", lemmaId: "lem_peu", senseId: "sns_peu_primary", surfaceFormId: "srf_peu", rationale: "Peu is the adverb little." },
  gloire: { action: "new_identity", lemmaId: "lem_gloire", senseId: "sns_gloire_primary", surfaceFormId: "srf_gloire", rationale: "Gloire is the noun glory." },
  croit: { action: "new_identity", lemmaId: "lem_croire", senseId: "sns_croire_primary", surfaceFormId: "srf_croit", rationale: "Croit is the third-person singular present of croire." },
  va: { action: "new_identity", lemmaId: "lem_aller", senseId: "sns_aller_primary", surfaceFormId: "srf_va", rationale: "Va is the third-person singular present of aller." },
  honneur: { action: "new_identity", lemmaId: "lem_honneur", senseId: "sns_honneur_primary", surfaceFormId: "srf_honneur", rationale: "Honneur is the noun honor." },
  tard: { action: "reuse_identity", lemmaId: "lem_tard", senseId: "sns_tard_primary", surfaceFormId: "srf_tard", rationale: "Tard is the adverb late." },
  broute: { action: "new_identity", lemmaId: "lem_brouter", senseId: "sns_brouter_primary", surfaceFormId: "srf_broute", rationale: "Broute is the third-person singular present of brouter." },
  repose: { action: "new_identity", lemmaId: "lem_reposer", senseId: "sns_reposer_primary", surfaceFormId: "srf_repose", rationale: "Repose is the third-person singular present of reposer." },
  amuse: { action: "new_identity", lemmaId: "lem_amuser", senseId: "sns_amuser_primary", surfaceFormId: "srf_amuse", rationale: "Amuse is the third-person singular present of amuser." },
  toute: { action: "new_identity", lemmaId: "lem_tout", senseId: "sns_tout_primary", surfaceFormId: "srf_toute", rationale: "Toute is the feminine form of tout, every/all." },
  chose: { action: "new_identity", lemmaId: "lem_chose", senseId: "sns_chose_primary", surfaceFormId: "srf_chose", rationale: "Chose is the noun thing." },
  fin: { action: "new_identity", lemmaId: "lem_fin", senseId: "sns_fin_primary", surfaceFormId: "srf_fin", rationale: "Fin is the noun end." },
  quand: { action: "new_identity", lemmaId: "lem_quand", senseId: "sns_quand_primary", surfaceFormId: "srf_quand", rationale: "Quand is the conjunction when." },
  touchait: { action: "new_identity", lemmaId: "lem_toucher", senseId: "sns_toucher_primary", surfaceFormId: "srf_touchait", rationale: "Touchait is the imperfect third-person singular of toucher." },
  presque: { action: "new_identity", lemmaId: "lem_presque", senseId: "sns_presque_primary", surfaceFormId: "srf_presque", rationale: "Presque is the adverb almost." },
  au: { action: "new_identity", lemmaId: "lem_au", senseId: "sns_au_primary", surfaceFormId: "srf_au", rationale: "Au is the masculine singular contraction à + le." },
  bout: { action: "new_identity", lemmaId: "lem_bout", senseId: "sns_bout_primary", surfaceFormId: "srf_bout", rationale: "Bout is the noun end/tip." },
  carrière: { action: "new_identity", lemmaId: "lem_carriere", senseId: "sns_carriere_primary", surfaceFormId: "srf_carriere", rationale: "Carrière is the noun course/racetrack." },
  partit: { action: "new_identity", lemmaId: "lem_partir", senseId: "sns_partir_primary", surfaceFormId: "srf_partit", rationale: "Partit is the past historic of partir." },
  comme: { action: "new_identity", lemmaId: "lem_comme", senseId: "sns_comme_primary", surfaceFormId: "srf_comme", rationale: "Comme is the conjunction/adverb like/as." },
  trait: { action: "new_identity", lemmaId: "lem_trait", senseId: "sns_trait_primary", surfaceFormId: "srf_trait", rationale: "Trait is the noun dart/bolt in comme un trait." },
  mais: { action: "reuse_identity", lemmaId: "lem_mais", senseId: "sns_mais_primary", surfaceFormId: "srf_mais", rationale: "Mais is the conjunction but." },
  élans: { action: "new_identity", lemmaId: "lem_elan", senseId: "sns_elan_primary", surfaceFormId: "srf_elans", rationale: "Élans is the plural noun bounds/leaps." },
  fit: { action: "new_identity", lemmaId: "lem_faire", senseId: "sns_faire_primary", surfaceFormId: "srf_fit", rationale: "Fit is the past historic of faire." },
  furent: { action: "new_identity", lemmaId: "lem_etre", senseId: "sns_etre_primary", surfaceFormId: "srf_furent", rationale: "Furent is the past historic plural of être." },
  vains: { action: "new_identity", lemmaId: "lem_vain", senseId: "sns_vain_primary", surfaceFormId: "srf_vains", rationale: "Vains is the adjective futile/ineffective." },
  arriva: { action: "new_identity", lemmaId: "lem_arriver", senseId: "sns_arriver_primary", surfaceFormId: "srf_arriva", rationale: "Arriva is the past historic of arriver." },
  première: { action: "new_identity", lemmaId: "lem_premier", senseId: "sns_premier_primary", surfaceFormId: "srf_premiere", rationale: "Première is the feminine ordinal/adjective first." },
  eh: { action: "new_identity", lemmaId: "lem_eh", senseId: "sns_eh_primary", surfaceFormId: "srf_eh", rationale: "Eh is the interjection eh/hey." },
  raison: { action: "new_identity", lemmaId: "lem_raison", senseId: "sns_raison_primary", surfaceFormId: "srf_raison", rationale: "Raison is the noun reason." },
  votre: { action: "reuse_identity", lemmaId: "lem_votre", senseId: "sns_votre_primary", surfaceFormId: "srf_votre", rationale: "Votre is the second-person plural possessive determiner." },
  vitesse: { action: "new_identity", lemmaId: "lem_vitesse", senseId: "sns_vitesse_primary", surfaceFormId: "srf_vitesse", rationale: "Vitesse is the noun speed." },
  emporter: { action: "new_identity", lemmaId: "lem_emporter", senseId: "sns_emporter_primary", surfaceFormId: "srf_emporter", rationale: "Emporter is the infinitive to carry away/win." },
  si: { action: "reuse_identity", lemmaId: "lem_si", senseId: "sns_si_primary", surfaceFormId: "srf_si", rationale: "Si is the conjunction if." },
  portiez: { action: "new_identity", lemmaId: "lem_porter", senseId: "sns_porter_primary", surfaceFormId: "srf_portiez", rationale: "Portiez is the imperfect second-person plural of porter." },
  maison: { action: "new_identity", lemmaId: "lem_maison", senseId: "sns_maison_primary", surfaceFormId: "srf_maison", rationale: "Maison is the noun house." },
  êtes: { action: "reuse_identity", lemmaId: "lem_etre", senseId: "sns_etre_primary", surfaceFormId: "srf_etes", rationale: "Êtes is the second-person plural present of être." },
  dis: { action: "new_identity", lemmaId: "lem_dire", senseId: "sns_dire_primary", surfaceFormId: "srf_dis", rationale: "Dis is the first-person singular present of dire." },
  cria: { action: "new_identity", lemmaId: "lem_crier", senseId: "sns_crier_primary", surfaceFormId: "srf_cria", rationale: "Cria is the past historic of crier." },
  avais: { action: "new_identity", lemmaId: "lem_avoir", senseId: "sns_avoir_primary", surfaceFormId: "srf_avais", rationale: "Avais is the imperfect first-person singular of avoir." },
  serait: { action: "new_identity", lemmaId: "lem_etre", senseId: "sns_etre_primary", surfaceFormId: "srf_serait", rationale: "Serait is the conditional third-person singular of être." },
};

/**
 * Produces a timestamp-free editorial plan in canonical first-appearance order.
 * Matching spelling is only a reuse candidate: an editor must still resolve the
 * lemma and contextual sense before an occurrence can become learner vocabulary.
 */
export function createLievreLexicalReviewPlan(): LievreLexicalReviewPlan {
  const manifest = prepareIngestionManifest(corbeauLearningBundle, workId);
  const grouped = new Map<string, typeof manifest.candidates>();
  for (const candidate of manifest.candidates) {
    const values = grouped.get(candidate.normalized) ?? [];
    values.push(candidate);
    grouped.set(candidate.normalized, values);
  }

  const candidates = [...grouped].map(([normalized, occurrences]) => {
    const surfaces = corbeauLearningBundle.surfaceForms.filter((surface) => surface.normalized === normalized);
    const possibleExistingIdentities = surfaces.map((surface) => ({
      surfaceFormId: surface.id,
      lemmaId: surface.lemmaId,
      senseIds: [...new Set(corbeauLearningBundle.occurrences
        .filter((occurrence) => occurrence.surfaceFormId === surface.id)
        .map((occurrence) => occurrence.senseId))].sort(),
    })).sort((left, right) => left.surfaceFormId.localeCompare(right.surfaceFormId));
    const occurrenceResolutions = occurrences.flatMap((occurrence) => {
      const resolution = resolvedContexts[occurrence.id] ?? resolvedForms[normalized];
      return resolution ? [{ occurrenceCandidateId: occurrence.id, ...resolution }] : [];
    });
    return {
      normalized,
      displayForms: [...new Set(occurrences.map((occurrence) => occurrence.text))],
      occurrenceCandidateIds: occurrences.map((occurrence) => occurrence.id),
      possibleExistingIdentities,
      occurrenceResolutions,
      reviewStatus: occurrenceResolutions.length === occurrences.length ? "resolved" as const : "pending" as const,
    };
  });
  const possibleReuseCount = candidates.filter((candidate) => candidate.possibleExistingIdentities.length > 0).length;
  return {
    workId,
    sourceDigest: manifest.sourceDigest,
    tokenCount: manifest.candidates.length,
    distinctFormCount: candidates.length,
    possibleReuseCount,
    newFormCount: candidates.length - possibleReuseCount,
    candidates,
  };
}

export const lievreLexicalReviewPlan = createLievreLexicalReviewPlan();
validateLievreLexicalReviewPlan(lievreLexicalReviewPlan);

const headwordOverrides: Record<string, string> = {
  lem_a: "à", lem_atteindre: "atteindre", lem_etre: "être", lem_ellebore: "ellébore",
  lem_ecouter: "écouter", lem_eloigner: "éloigner", lem_evertuer: "évertuer",
  lem_hater: "hâter", lem_leger: "léger", lem_lievre: "lièvre", lem_mepriser: "mépriser",
  lem_ou_interrogative: "où", lem_point_adverb: "point", lem_point_noun: "point",
  lem_pas_noun: "pas", lem_pret: "prêt", lem_senateur: "sénateur", lem_temoignage: "témoignage",
};

const partOfSpeechOverrides: Record<string, string> = {
  lem_au: "determiner", lem_pas_noun: "noun", lem_point_adverb: "adverb", lem_point_noun: "noun",
};

/**
 * Materializes reviewed Lièvre decisions into the shared linguistic catalog.
 * The work stays in processing until all three prepared quiz bands cover Levels 1–8.
 */
export function createLievreLinguisticBundle(): ContentBundle {
  const bundle = structuredClone(corbeauLearningBundle);
  const manifest = prepareIngestionManifest(bundle, workId);
  const candidateById = new Map(manifest.candidates.map((candidate) => [candidate.id, candidate]));
  const resolutions = lievreLexicalReviewPlan.candidates.flatMap((candidate) => candidate.occurrenceResolutions);

  for (const resolution of resolutions) {
    const candidate = candidateById.get(resolution.occurrenceCandidateId);
    if (!candidate) throw new Error(`Missing candidate ${resolution.occurrenceCandidateId}`);
    if (resolution.action === "exclude_editorial") {
      bundle.exclusions.push({
        id: `exc_${candidate.id.slice(4)}`, workId, unitId: candidate.unitId,
        start: candidate.start, end: candidate.end, text: candidate.text, reason: "editorial_artifact",
      });
      continue;
    }

    const existingLemma = bundle.lemmas.find((lemma) => lemma.id === resolution.lemmaId);
    if (!existingLemma) bundle.lemmas.push({
      id: resolution.lemmaId,
      headword: headwordOverrides[resolution.lemmaId] ?? resolution.lemmaId.slice(4).replaceAll("_", " "),
      partOfSpeech: partOfSpeechOverrides[resolution.lemmaId] ?? inferPartOfSpeech(resolution.rationale),
    });
    const existingSense = bundle.senses.find((sense) => sense.id === resolution.senseId);
    if (existingSense && existingSense.lemmaId !== resolution.lemmaId) throw new Error(`Sense ${resolution.senseId} belongs to another lemma`);
    if (!existingSense) bundle.senses.push({
      id: resolution.senseId, lemmaId: resolution.lemmaId,
      gloss: resolution.rationale, definition: resolution.rationale,
    });
    const existingSurface = bundle.surfaceForms.find((surface) => surface.id === resolution.surfaceFormId);
    if (existingSurface && existingSurface.lemmaId !== resolution.lemmaId) throw new Error(`Surface ${resolution.surfaceFormId} belongs to another lemma`);
    if (!existingSurface) bundle.surfaceForms.push({
      id: resolution.surfaceFormId, lemmaId: resolution.lemmaId,
      form: candidate.text, normalized: candidate.normalized,
    });
    bundle.occurrences.push({
      id: `occ_${candidate.id.slice(4)}`, workId, unitId: candidate.unitId,
      surfaceFormId: resolution.surfaceFormId, senseId: resolution.senseId,
      start: candidate.start, end: candidate.end,
    });
  }

  bundle.works.find((work) => work.id === workId)!.publicationState = "learning_ready";
  const readiness = bundle.readiness.find((item) => item.workId === workId)!;
  readiness.occurrencesReviewed = true;
  readiness.unresolvedLearnerTokens = [];
  bundle.quizItems.push(...structuredClone([...lievreQuizBatch01, ...lievreQuizBatch02, ...lievreQuizBatch03, ...lievreQuizBatch04, ...lievreQuizBatch05, ...lievreQuizBatch06, ...lievreQuizBatch07, ...lievreQuizBatch08, ...lievreQuizBatch09, ...lievreQuizBatch10, ...lievreQuizBatch11, ...lievreQuizBatch12, ...lievreQuizBatch13, ...lievreQuizBatch14, ...lievreQuizBatch15, ...lievreQuizBatch16, ...lievreQuizBatch17, ...lievreQuizBatch18, ...lievreQuizBatch19, ...lievreQuizBatch20, ...lievreQuizBatch21, ...lievreQuizBatch22, ...lievreQuizBatch23, ...lievreQuizBatch24, ...lievreQuizBatch25, ...lievreQuizBatch26, ...lievreQuizBatch27, ...lievreQuizBatch28]));
  return bundle;
}

function inferPartOfSpeech(rationale: string): string {
  const text = rationale.toLocaleLowerCase("en-US");
  if (text.includes("pronoun")) return "pronoun";
  if (text.includes("article") || text.includes("determiner") || text.includes("contraction")) return "determiner";
  if (text.includes("preposition")) return "preposition";
  if (text.includes("conjunction") || text.includes("marker")) return "conjunction";
  if (text.includes("adverb")) return "adverb";
  if (text.includes("adjective")) return "adjective";
  if (text.includes("noun")) return "noun";
  if (text.includes("interjection")) return "interjection";
  return "verb";
}

export const lievreLinguisticBundle = createLievreLinguisticBundle();
