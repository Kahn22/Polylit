import { describe, expect, it } from "vitest";
import { corbeauLearningBundle, createCorbeauLearningBundle } from "../src/content/linguistic/le-corbeau-et-le-renard.js";
import { learnerVocabularyForWork } from "../src/domain/publication.js";
import { validateContentBundle } from "../src/domain/validate.js";
import { quizCoverageForWork } from "../src/content/quizzes/authoring.js";

describe("Le Corbeau et le Renard learning package", () => {
  it("is deterministic and becomes learning-ready after every quiz is authored", () => {
    expect(createCorbeauLearningBundle()).toEqual(corbeauLearningBundle);
    expect(validateContentBundle(corbeauLearningBundle)).toEqual({ ok: true, diagnostics: [] });
    expect(corbeauLearningBundle.works.find((work) => work.id === "wrk_corbeau_renard")?.publicationState).toBe("learning_ready");
    expect(corbeauLearningBundle.readiness.find((item) => item.workId === "wrk_corbeau_renard")?.unresolvedLearnerTokens).toEqual([]);
  });
  it("contains all eleven French units without sentence translations", () => {
    const units = corbeauLearningBundle.units.filter((unit) => unit.workId === "wrk_corbeau_renard");
    expect(units).toHaveLength(11);
    expect(units.every((unit) => !("english" in unit))).toBe(true);
  });
  it("classifies every canonical token exactly once", () => {
    expect(corbeauLearningBundle.occurrences.length + corbeauLearningBundle.exclusions.length).toBe(131);
    expect(corbeauLearningBundle.occurrences).toHaveLength(131); expect(corbeauLearningBundle.exclusions).toHaveLength(0);
  });
  it("stores every authored quiz set and exposes all complete identities", () => {
    expect(corbeauLearningBundle.surfaceForms).toHaveLength(95);
    expect(corbeauLearningBundle.quizItems).toHaveLength(294);
    const completed = [
      ["srf_maitre", "sns_maitre_primary"],
      ["srf_sur", "sns_sur_primary"],
      ["srf_un", "sns_un_primary"],
      ["srf_arbre", "sns_arbre_primary"],
      ["srf_perche", "sns_percher_primary"],
      ["srf_tenait", "sns_tenir_hold"],
      ["srf_en", "sns_en_in"],
      ["srf_en", "sns_en_it"],
      ["srf_son", "sns_son_primary"],
      ["srf_bec", "sns_bec_primary"],
      ["srf_fromage", "sns_fromage_primary"],
      ["srf_par", "sns_par_primary"],
      ["srf_corbeau", "sns_corbeau_primary"],
      ["srf_renard", "sns_renard_primary"],
      ["srf_monsieur", "sns_monsieur_primary"],
      ["srf_l_elided", "sns_le_primary"],
      ["srf_odeur", "sns_odeur_primary"],
      ["srf_alleche", "sns_allecher_primary"],
      ["srf_lui", "sns_lui_primary"],
      ["srf_tint", "sns_tenir_speak"],
      ["srf_a", "sns_a_primary"],
      ["srf_peu", "sns_peu_primary"],
      ["srf_pres", "sns_pres_primary"],
      ["srf_ce", "sns_ce_primary"],
      ["srf_langage", "sns_langage_primary"],
      ["srf_he", "sns_he_primary"],
      ["srf_bonjour", "sns_bonjour_primary"],
      ["srf_du", "sns_du_primary"],
      ["srf_que", "sns_que_exclamative"],
      ["srf_vous", "sns_vous_primary"],
      ["srf_etes", "sns_etre_primary"],
      ["srf_joli", "sns_joli_primary"],
      ["srf_me", "sns_me_primary"],
      ["srf_semblez", "sns_sembler_primary"],
      ["srf_beau", "sns_beau_primary"],
      ["srf_sans", "sns_sans_primary"],
      ["srf_mentir", "sns_mentir_primary"],
      ["srf_si", "sns_si_primary"],
      ["srf_votre", "sns_votre_primary"],
      ["srf_ramage", "sns_ramage_primary"],
      ["srf_se", "sns_se_primary"],
      ["srf_rapporte", "sns_rapporter_primary"],
      ["srf_plumage", "sns_plumage_primary"],
      ["srf_le", "sns_le_primary"],
      ["srf_phenix", "sns_phenix_primary"],
      ["srf_des", "sns_des_primary"],
      ["srf_hotes", "sns_hote_primary"],
      ["srf_de", "sns_de_primary"],
      ["srf_ces", "sns_ce_primary"],
      ["srf_bois", "sns_bois_primary"],
      ["srf_mots", "sns_mot_primary"],
      ["srf_ne", "sns_ne_primary"],
      ["srf_sent", "sns_sentir_primary"],
      ["srf_pas", "sns_pas_primary"],
      ["srf_joie", "sns_joie_primary"],
      ["srf_et", "sns_et_primary"],
      ["srf_pour", "sns_pour_primary"],
      ["srf_montrer", "sns_montrer_primary"],
      ["srf_sa", "sns_son_primary"],
      ["srf_belle", "sns_beau_primary"],
      ["srf_voix", "sns_voix_primary"],
      ["srf_il", "sns_il_primary"],
      ["srf_ouvre", "sns_ouvrir_primary"],
      ["srf_large", "sns_large_primary"],
      ["srf_laisse", "sns_laisser_primary"],
      ["srf_tomber", "sns_tomber_primary"],
      ["srf_proie", "sns_proie_primary"],
      ["srf_s_elided", "sns_se_primary"],
      ["srf_saisit", "sns_saisir_primary"],
      ["srf_dit", "sns_dire_primary"],
      ["srf_mon", "sns_mon_primary"],
      ["srf_bon", "sns_bon_primary"],
      ["srf_apprenez", "sns_apprendre_primary"],
      ["srf_que", "sns_que_conjunction"],
      ["srf_tout", "sns_tout_primary"],
      ["srf_flatteur", "sns_flatteur_primary"],
      ["srf_vit", "sns_vivre_primary"],
      ["srf_aux", "sns_aux_primary"],
      ["srf_depens", "sns_depens_primary"],
      ["srf_celui", "sns_celui_primary"],
      ["srf_qui", "sns_qui_primary"],
      ["srf_l_elided", "sns_le_object"],
      ["srf_ecoute", "sns_ecouter_primary"],
      ["srf_cette", "sns_ce_primary"],
      ["srf_lecon", "sns_lecon_primary"],
      ["srf_vaut", "sns_valoir_primary"],
      ["srf_bien", "sns_bien_primary"],
      ["srf_doute", "sns_doute_primary"],
      ["srf_honteux", "sns_honteux_primary"],
      ["srf_confus", "sns_confus_primary"],
      ["srf_jura", "sns_jurer_primary"],
      ["srf_mais", "sns_mais_primary"],
      ["srf_tard", "sns_tard_primary"],
      ["srf_qu_elided", "sns_que_conjunction"],
      ["srf_on", "sns_on_primary"],
      ["srf_y", "sns_y_primary"],
      ["srf_prendrait", "sns_prendre_primary"],
      ["srf_plus", "sns_plus_primary"],
    ];
    for (const [surfaceFormId, senseId] of completed) {
      const items = corbeauLearningBundle.quizItems.filter((quiz) => quiz.surfaceFormId === surfaceFormId && quiz.senseId === senseId);
      expect(items.map((quiz) => quiz.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
      expect(new Set(items.map((quiz) => quiz.contextFrench)).size).toBe(3);
    }
    const learnerVocabulary = learnerVocabularyForWork(corbeauLearningBundle, "wrk_corbeau_renard");
    expect(learnerVocabulary).toHaveLength(98);
    for (const [surfaceFormId, senseId] of completed) {
      expect(learnerVocabulary).toContainEqual({ surfaceFormId, senseId });
    }
  });
  it("does not mistake literary capitalization for a proper-noun exclusion", () => {
    expect(corbeauLearningBundle.exclusions).toEqual([]);
    for (const word of ["corbeau", "renard", "monsieur", "phénix"]) {
      expect(corbeauLearningBundle.surfaceForms.some((item) => item.normalized === word)).toBe(true);
    }
  });

  it("keeps distinct contextual meanings as distinct mastery identities", () => {
    const identities = (surfaceFormId: string) => new Set(corbeauLearningBundle.occurrences
      .filter((item) => item.surfaceFormId === surfaceFormId)
      .map((item) => item.senseId));
    expect(identities("srf_en")).toEqual(new Set(["sns_en_in", "sns_en_it"]));
    expect(identities("srf_que")).toEqual(new Set(["sns_que_exclamative", "sns_que_conjunction"]));
    expect(identities("srf_l_elided")).toEqual(new Set(["sns_le_primary", "sns_le_object"]));
    expect(identities("srf_tenait")).toEqual(new Set(["sns_tenir_hold"]));
    expect(identities("srf_tint")).toEqual(new Set(["sns_tenir_speak"]));
    expect(new Set(corbeauLearningBundle.occurrences.map((item) => `${item.surfaceFormId}:${item.senseId}`)).size).toBe(98);
  });

  it("models French contractions without inventing them as lexical headwords", () => {
    const headword = (id: string) => corbeauLearningBundle.lemmas.find((item) => item.id === id)?.headword;
    expect(headword("lem_du")).toBe("de + le");
    expect(headword("lem_des")).toBe("de + les");
    expect(headword("lem_aux")).toBe("à + les");
  });

  it("reports deterministic editorial quiz coverage", () => {
    const coverage = quizCoverageForWork(corbeauLearningBundle, "wrk_corbeau_renard");
    expect(coverage.requiredIdentities).toBe(98);
    expect(coverage.completedIdentities).toBe(98);
    expect(coverage.preparedItems).toBe(294);
    expect(coverage.missing).toHaveLength(0);
  });
});
