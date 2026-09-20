import { describe, expect, it } from "vitest";
import { assertReviewedQuizCoverage, authorZolaVocabulary } from "../src/content/preparation/zola-authoring.js";
import { createLievreLinguisticBundle } from "../src/content/linguistic/le-lievre-et-la-tortue.js";
import { zolaVocabularyBatch01 } from "../src/content/preparation/zola-vocabulary-batch-01.js";
import { zolaVocabularyBatch02 } from "../src/content/preparation/zola-vocabulary-batch-02.js";
import { zolaVocabularyBatch03 } from "../src/content/preparation/zola-vocabulary-batch-03.js";
import { zolaVocabularyBatch04 } from "../src/content/preparation/zola-vocabulary-batch-04.js";
import { zolaVocabularyBatch05 } from "../src/content/preparation/zola-vocabulary-batch-05.js";
import { zolaVocabularyBatch06 } from "../src/content/preparation/zola-vocabulary-batch-06.js";
import { zolaVocabularyBatch07 } from "../src/content/preparation/zola-vocabulary-batch-07.js";
import { zolaVocabularyBatch08 } from "../src/content/preparation/zola-vocabulary-batch-08.js";
import { zolaVocabularyBatch09 } from "../src/content/preparation/zola-vocabulary-batch-09.js";
import { zolaVocabularyBatch10 } from "../src/content/preparation/zola-vocabulary-batch-10.js";
import { zolaVocabularyBatch11 } from "../src/content/preparation/zola-vocabulary-batch-11.js";
import { zolaVocabularyBatch12 } from "../src/content/preparation/zola-vocabulary-batch-12.js";
import { zolaVocabularyBatch13 } from "../src/content/preparation/zola-vocabulary-batch-13.js";
import { zolaVocabularyBatch14 } from "../src/content/preparation/zola-vocabulary-batch-14.js";
import { zolaVocabularyBatch15 } from "../src/content/preparation/zola-vocabulary-batch-15.js";
import { zolaVocabularyBatch16 } from "../src/content/preparation/zola-vocabulary-batch-16.js";
import { zolaVocabularyBatch17 } from "../src/content/preparation/zola-vocabulary-batch-17.js";
import { zolaVocabularyBatch18 } from "../src/content/preparation/zola-vocabulary-batch-18.js";
import { zolaVocabularyBatch19 } from "../src/content/preparation/zola-vocabulary-batch-19.js";
import { zolaVocabularyBatch20 } from "../src/content/preparation/zola-vocabulary-batch-20.js";
import { zolaVocabularyBatch21 } from "../src/content/preparation/zola-vocabulary-batch-21.js";
import { zolaVocabularyBatch22 } from "../src/content/preparation/zola-vocabulary-batch-22.js";
import { zolaVocabularyBatch23 } from "../src/content/preparation/zola-vocabulary-batch-23.js";
import { zolaVocabularyBatch24 } from "../src/content/preparation/zola-vocabulary-batch-24.js";
import { zolaVocabularyBatch25 } from "../src/content/preparation/zola-vocabulary-batch-25.js";
import { zolaVocabularyBatch26 } from "../src/content/preparation/zola-vocabulary-batch-26.js";
import { zolaVocabularyBatch27 } from "../src/content/preparation/zola-vocabulary-batch-27.js";
import { zolaVocabularyBatch28 } from "../src/content/preparation/zola-vocabulary-batch-28.js";
import { zolaVocabularyBatch29 } from "../src/content/preparation/zola-vocabulary-batch-29.js";
import { zolaVocabularyBatch30 } from "../src/content/preparation/zola-vocabulary-batch-30.js";
import { zolaVocabularyBatch31 } from "../src/content/preparation/zola-vocabulary-batch-31.js";
import { zolaVocabularyBatch32 } from "../src/content/preparation/zola-vocabulary-batch-32.js";
import { zolaVocabularyBatch33 } from "../src/content/preparation/zola-vocabulary-batch-33.js";
import { zolaVocabularyBatch34 } from "../src/content/preparation/zola-vocabulary-batch-34.js";
import { zolaVocabularyBatch35 } from "../src/content/preparation/zola-vocabulary-batch-35.js";
import { zolaVocabularyBatch36 } from "../src/content/preparation/zola-vocabulary-batch-36.js";
import { zolaVocabularyBatch37 } from "../src/content/preparation/zola-vocabulary-batch-37.js";
import { zolaVocabularyBatch48 } from "../src/content/preparation/zola-vocabulary-batch-48.js";
import { zolaVocabularyBatch49 } from "../src/content/preparation/zola-vocabulary-batch-49.js";
import { zolaVocabularyBatch50 } from "../src/content/preparation/zola-vocabulary-batch-50.js";
import { zolaSharedQuizBatch38 } from "../src/content/preparation/zola-shared-quiz-batch-38.js";
import { zolaSourceAcquisition } from "../src/content/fixtures/zola.js";
import { ContentBundleSchema } from "../src/domain/model.js";
import { prepareIngestionManifest } from "../src/ingestion/prepare.js";

describe("J’Accuse offline vocabulary authoring", () => {
  const manifest = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse");
  const authored = authorZolaVocabulary(zolaVocabularyBatch01, manifest.candidates, zolaSourceAcquisition.units);

  it("creates stable identities and exactly three prepared quiz bands", () => {
    expect(authored.surfaceForms).toHaveLength(14);
    expect(authored.decisions).toHaveLength(79);
    expect(authored.quizItems).toHaveLength(42);
    for (const surface of authored.surfaceForms) {
      expect(authored.quizItems.filter((quiz) => quiz.surfaceFormId === surface.id).map((quiz) => quiz.band).sort()).toEqual([
        "levels_1_3", "levels_4_5", "levels_6_8",
      ]);
    }
  });

  it("keeps homographic occurrences in their reviewed senses", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch02, manifest.candidates, zolaSourceAcquisition.units);
    const accused = batch.decisions.filter((decision) => ["tok_fced63529f84cf739d2de371", "tok_420e33f7b4544eb502b8699a", "tok_e7590d4aa719107228b59cdb"].includes(decision.candidateId));
    expect(new Set(accused.map((decision) => decision.senseId)).size).toBe(2);
    expect(batch.quizItems).toHaveLength(75);
  });

  it("separates agir from the impersonal s’agir construction", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch03, manifest.candidates, zolaSourceAcquisition.units);
    const agissait = batch.decisions.filter((decision) => ["tok_7855c4254b3877ba392191f0", "tok_fb4c02b87b6d1875bfeedcfe"].includes(decision.candidateId));
    expect(new Set(agissait.map((decision) => decision.senseId)).size).toBe(2);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("keeps arrêter-to-stop distinct from arrêter-to-arrest", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch04, manifest.candidates, zolaSourceAcquisition.units);
    const forms = batch.surfaceForms.filter((surface) => surface.normalized === "arrête" || surface.normalized === "arrêtera");
    const formIds = new Set(forms.map((surface) => surface.id));
    expect(new Set(batch.quizItems.filter((quiz) => formIds.has(quiz.surfaceFormId)).map((quiz) => quiz.senseId)).size).toBe(2);
    expect(batch.quizItems).toHaveLength(75);
  });

  it("separates additive aussi from consequential aussi", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch05, manifest.candidates, zolaSourceAcquisition.units);
    const aussi = batch.surfaceForms.filter((surface) => surface.normalized === "aussi");
    expect(aussi).toHaveLength(1);
    expect(new Set(batch.quizItems.filter((quiz) => aussi.some((surface) => surface.id === quiz.surfaceFormId)).map((quiz) => quiz.senseId)).size).toBe(2);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("shares the authored avoir sense across its distinct surface forms", () => {
    const batch = authorZolaVocabulary([...zolaVocabularyBatch01, ...zolaVocabularyBatch03, ...zolaVocabularyBatch05, ...zolaVocabularyBatch06], manifest.candidates, zolaSourceAcquisition.units);
    const avoir = batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_avoir");
    expect(avoir.map((surface) => surface.normalized).sort()).toEqual(["a","ai","ait","aura","aurait","avaient","avez","avoir","avons"]);
    expect(new Set(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_avoir").map((sense) => sense.id))).toEqual(new Set(["sns_zola_avoir_possess_auxiliary"]));
  });

  it("shares inflected forms without duplicating their lexical sense", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch07, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_bureau")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_bureau")).toHaveLength(2);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("shares one certain sense across gender and number", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch08, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_certain")).toHaveLength(3);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_certain")).toHaveLength(1);
    expect(batch.quizItems).toHaveLength(42);
  });

  it("supports new surfaces belonging to existing global identities", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch09, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.lemmas.some((lemma) => lemma.id === "lem_celui")).toBe(false);
    expect(batch.surfaceForms.find((surface) => surface.normalized === "celle")).toMatchObject({ lemmaId: "lem_celui" });
    expect(batch.quizItems).toHaveLength(69);
  });

  it("shares adjective and plural noun inflections", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch10, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_clerical")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_coeur")).toHaveLength(1);
    expect(batch.quizItems).toHaveLength(45);
  });

  it("shares reviewed senses across the eleventh and twelfth inflection batches", () => {
    const batch = authorZolaVocabulary([...zolaVocabularyBatch11, ...zolaVocabularyBatch12], manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.decisions).toHaveLength(118);
    expect(batch.quizItems).toHaveLength(150);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_condamner")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_connaitre")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_connaitre")).toHaveLength(4);
  });

  it("keeps literal covering distinct from concealing wrongdoing", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch13, manifest.candidates, zolaSourceAcquisition.units);
    const couvrir = batch.surfaceForms.filter((surface) => surface.normalized === "couvrir");
    expect(couvrir).toHaveLength(1);
    expect(new Set(batch.quizItems.filter((quiz) => couvrir.some((surface) => surface.id === quiz.surfaceFormId)).map((quiz) => quiz.senseId)).size).toBe(2);
    expect(batch.decisions).toHaveLength(58);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("separates coup expressions and adjectival from nominal coupable", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch14, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "coup")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "coupable")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "coupables")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(38);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("shares reviewed inflections in the fifteenth batch", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch15, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.decisions).toHaveLength(71);
    expect(batch.quizItems).toHaveLength(78);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_demontrer")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_denoncer")).toHaveLength(1);
  });

  it("separates nominal devoir from the modal verb while sharing inflections", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch16, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "devoir")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_devoir_verb")).toHaveLength(4);
    expect(batch.decisions).toHaveLength(41);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("reuses dire and shares later inflection families", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch17, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.lemmas.some((lemma) => lemma.id === "lem_dire")).toBe(false);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_dire")).toHaveLength(3);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_donner")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(59);
    expect(batch.quizItems).toHaveLength(75);
  });

  it("separates nominal doubt from se douter and distinct droit senses", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch18, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "doute")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "droit")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_eclater")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(38);
    expect(batch.quizItems).toHaveLength(81);
  });

  it("shares singular, plural, and gender variants in the nineteenth batch", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch19, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.decisions).toHaveLength(39);
    expect(batch.quizItems).toHaveLength(72);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_ennemi")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_entier")).toHaveLength(1);
  });

  it("reuses the global être sense and shares new inflection families", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch20, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.lemmas.some((lemma) => lemma.id === "lem_etre")).toBe(false);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_etre")).toHaveLength(3);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_etudier")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(84);
    expect(batch.quizItems).toHaveLength(75);
  });

  it("shares avoir, explaining, and emphatic pronoun identities in batch twenty-one", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch21, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_expliquer")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_eux")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(33);
    expect(batch.quizItems).toHaveLength(75);
  });

  it("shares noun number and finir inflections in batch twenty-two", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch22, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_faute")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_femme")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_finir")).toHaveLength(3);
    expect(batch.decisions).toHaveLength(35);
    expect(batch.quizItems).toHaveLength(75);
  });

  it("reuses faire senses while preparing its new surface forms", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch23, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.lemmas.some((lemma) => lemma.id === "lem_faire")).toBe(false);
    expect(batch.senses.some((sense) => sense.lemmaId === "lem_faire")).toBe(false);
    expect(batch.surfaceForms.every((surface) => surface.lemmaId === "lem_faire")).toBe(true);
    expect(batch.decisions).toHaveLength(8);
    expect(batch.quizItems).toHaveLength(21);
  });

  it("separates homographs and grammatical roles in batch twenty-four", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch24, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "fort")).toHaveLength(1);
    expect(batch.senses.filter((sense) => sense.lemmaId === "lem_zola_fuite")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_general_noun")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_etre")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(62);
    expect(batch.quizItems).toHaveLength(84);
  });

  it("shares inflections while separating histoire and haut senses in batch twenty-five", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch25, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "histoire")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_grand")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_hanter")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_haut_adverb")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_haut_adjective")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(78);
    expect(batch.quizItems).toHaveLength(87);
  });

  it("shares human, honor, and imagination families in batch twenty-six", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch26, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.lemmas.some((lemma) => lemma.id === "lem_zola_homme")).toBe(false);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_honnete")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_ignorer")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_imagination")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(59);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("shares gender and number inflections in batch twenty-seven", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch27, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_impudent")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_incliner")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_iniquite")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(33);
    expect(batch.quizItems).toHaveLength(93);
  });

  it("shares legal-action inflections and separates jour senses in batch twenty-eight", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch28, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_insister")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_instruire")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_introduire")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "jour")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(52);
    expect(batch.quizItems).toHaveLength(90);
  });

  it("shares judgment, justice, and laisser families in batch twenty-nine", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch29, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_juger")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_juif")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_juste")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_laisser")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(63);
    expect(batch.quizItems).toHaveLength(72);
  });

  it("separates légitime and lumière senses while sharing pronouns in batch thirty", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch30, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "légitime")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "lumière")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_lequel")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_lire")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(57);
    expect(batch.quizItems).toHaveLength(96);
  });

  it("separates hand and movement senses in batch thirty-one", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch31, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "main")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_main")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_marcher")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_marche_noun")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(46);
    expect(batch.quizItems).toHaveLength(78);
  });

  it("separates même, mettre, and milieu senses in batch thirty-two", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch32, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "même")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_mettre")).toHaveLength(5);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "milieu")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_militaire_adjective")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(50);
    expect(batch.quizItems).toHaveLength(99);
  });

  it("separates moins, monde, and mort senses in batch thirty-three", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch33, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "moins")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "monde")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "mort")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_nation")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_avoir")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(50);
    expect(batch.quizItems).toHaveLength(111);
  });

  it("separates nom and ordre senses while reusing avoir in batch thirty-four", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch34, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "nom")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "ordre")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_avoir")).toHaveLength(1);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_nuit")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_oeuvre")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(75);
    expect(batch.quizItems).toHaveLength(84);
  });

  it("shares oser, parler, and passer families while splitting part in batch thirty-five", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch35, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_oser")).toHaveLength(6);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_parler")).toHaveLength(4);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_passer")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "part")).toHaveLength(1);
    expect(batch.decisions).toHaveLength(44);
    expect(batch.quizItems).toHaveLength(102);
  });

  it("separates payer, perdre, and petit senses while sharing pouvoir in batch thirty-six", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch36, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_payer")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_permettre")).toHaveLength(3);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_pouvoir")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_petit")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(40);
    expect(batch.quizItems).toHaveLength(84);
  });

  it("separates demonstratives, articles, prepositional en, and esprit senses in batch thirty-seven", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch37, manifest.candidates, zolaSourceAcquisition.units);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_ce")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "des")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.normalized === "en")).toHaveLength(2);
    expect(batch.surfaceForms.filter((surface) => surface.lemmaId === "lem_zola_esprit")).toHaveLength(2);
    expect(batch.decisions).toHaveLength(166);
    expect(batch.quizItems).toHaveLength(54);
  });

  it("checks existing questions first and reuses the same global surface and prepared bands", () => {
    const existing = createLievreLinguisticBundle();
    const batch = authorZolaVocabulary(zolaVocabularyBatch37, manifest.candidates, zolaSourceAcquisition.units, existing);
    expect(batch.decisions.filter((decision) => decision.surfaceFormId === "srf_ce")).not.toHaveLength(0);
    expect(batch.decisions.filter((decision) => decision.surfaceFormId === "srf_des")).not.toHaveLength(0);
    expect(batch.decisions.filter((decision) => decision.surfaceFormId === "srf_en")).not.toHaveLength(0);
    expect(batch.surfaceForms.some((surface) => ["srf_ce", "srf_des", "srf_en"].includes(surface.id))).toBe(false);
    expect(batch.quizItems.some((quiz) => ["srf_ce", "srf_des", "srf_en"].includes(quiz.surfaceFormId))).toBe(false);
  });

  it("keeps accented inflections and different senses distinct without duplicate IDs", () => {
    const batch = authorZolaVocabulary(zolaVocabularyBatch35, manifest.candidates, zolaSourceAcquisition.units);
    expect(new Set(batch.surfaceForms.map((surface) => surface.id)).size).toBe(batch.surfaceForms.length);
    expect(new Set(batch.quizItems.map((quiz) => quiz.id)).size).toBe(batch.quizItems.length);
    const ose = batch.surfaceForms.find((surface) => surface.normalized === "ose");
    const osePast = batch.surfaceForms.find((surface) => surface.normalized === "osé");
    expect(ose?.id).not.toBe(osePast?.id);
    const aussi = authorZolaVocabulary(zolaVocabularyBatch05, manifest.candidates, zolaSourceAcquisition.units);
    expect(aussi.surfaceForms.filter((surface) => surface.normalized === "aussi")).toHaveLength(1);
    expect(new Set(aussi.quizItems.filter((quiz) => quiz.surfaceFormId === aussi.surfaceForms.find((surface) => surface.normalized === "aussi")?.id).map((quiz) => quiz.senseId)).size).toBe(2);
  });

  it("fails closed on missing or duplicated quiz bands for a reviewed identity", () => {
    const existing = createLievreLinguisticBundle();
    const decision = { candidateId: "tok_reviewed", disposition: "vocabulary" as const, lemmaId: "lem_le", surfaceFormId: "srf_la", senseId: "sns_le_object" };
    const quizzes = zolaSharedQuizBatch38;
    expect(() => assertReviewedQuizCoverage([decision], existing.quizItems, [])).toThrow(/Missing prepared quiz bands/);
    expect(() => assertReviewedQuizCoverage([decision], existing.quizItems, quizzes)).not.toThrow();
    expect(() => assertReviewedQuizCoverage([decision], existing.quizItems, [...quizzes, quizzes[0]!])).toThrow(/Duplicate prepared quiz ID/);
    expect(() => authorZolaVocabulary(zolaVocabularyBatch37, manifest.candidates, zolaSourceAcquisition.units, {
      surfaceForms: existing.surfaceForms,
      quizItems: existing.quizItems.filter((quiz) => !(quiz.surfaceFormId === "srf_ce" && quiz.band === "levels_6_8")),
    })).toThrow(/Incomplete existing quiz set/);
  });

  it("produces schema-valid content with grammatical but semantically unrelated distractors", () => {
    expect(ContentBundleSchema.safeParse({
      ...zolaSourceAcquisition,
      lemmas: authored.lemmas,
      senses: authored.senses,
      surfaceForms: authored.surfaceForms,
      quizItems: authored.quizItems,
    }).success).toBe(true);
    for (const quiz of authored.quizItems) {
      const choices = "choicesEnglish" in quiz ? quiz.choicesEnglish : quiz.choicesFrench;
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(quiz.correctAnswer);
    }
  });

  it("supports explicit occurrence-level senses but rejects overlapping assignments", () => {
    const occurrences = manifest.candidates.filter((candidate) => candidate.normalized === "accusé");
    const base = {
      normalized: "accusé", headword: "accuser", partOfSpeech: "verb", gloss: "accused",
      definition: "mis en cause", englishDistractors: ["painted", "folded", "floated"] as [string, string, string],
      frenchDistractors: ["peint", "plié", "flotté"] as [string, string, string],
    };
    expect(() => authorZolaVocabulary([
      { ...base, lemmaKey: "accuser", senseKey: "accuser_charge", candidateIds: [occurrences[0]!.id] },
      { ...base, lemmaKey: "accuser", senseKey: "accuser_charge", candidateIds: [occurrences[0]!.id] },
    ], manifest.candidates, zolaSourceAcquisition.units)).toThrow(/Duplicate authored identity|multiple identities/);
  });

  it("shares reviewed inflections while keeping finding and being located distinct", () => {
    const batch = authorZolaVocabulary(
      [...zolaVocabularyBatch48, ...zolaVocabularyBatch49], manifest.candidates,
      zolaSourceAcquisition.units, createLievreLinguisticBundle(),
    );
    const forToken = (candidateId: string) => batch.decisions.find((decision) => decision.candidateId === candidateId);
    expect(forToken("tok_8a53d87a18799880ef99ffd8")?.senseId).toBe(forToken("tok_508a3b2a767a5312ffa60c61")?.senseId);
    expect(forToken("tok_1a13da5726537c13e44b9a2b")?.senseId).toBe(forToken("tok_5de2531b43df4c63af3d2f74")?.senseId);
    expect(forToken("tok_8a53d87a18799880ef99ffd8")?.senseId).not.toBe(forToken("tok_1a13da5726537c13e44b9a2b")?.senseId);
    expect(forToken("tok_d060b3505345da2a9433e96d")?.senseId).toBe("sns_zola_trouver_judge");
    expect(forToken("tok_a6855457fa4d9d35529d4c35")?.senseId).toBe(forToken("tok_443761429e05ba6c9e874992")?.senseId);
    expect(batch.lemmas.find((lemma) => lemma.id === "lem_zola_souvenir_verb")?.partOfSpeech).toBe("verb");
    expect(batch.quizItems.filter((quiz) => quiz.surfaceFormId === forToken("tok_20bd2e873dff3c288d9c85f3")?.surfaceFormId)).toHaveLength(3);
    expect(new Set(batch.quizItems.map((quiz) => quiz.id)).size).toBe(batch.quizItems.length);
  });

  it("shares court and verb inflections but leaves unreviewed constructions pending", () => {
    const batch = authorZolaVocabulary(
      [...zolaVocabularyBatch48, ...zolaVocabularyBatch49, ...zolaVocabularyBatch50],
      manifest.candidates, zolaSourceAcquisition.units, createLievreLinguisticBundle(),
    );
    const decision = (id: string) => batch.decisions.find((item) => item.candidateId === id);
    expect(decision("tok_2ac584de8ef785a420b25c9c")?.senseId).toBe(decision("tok_1660b6f161b0e6d9ee8a175a")?.senseId);
    expect(decision("tok_b417f79c490a0ea8a624d4f6")?.senseId).toBe(decision("tok_317d6115076eeebae71d5808")?.senseId);
    expect(decision("tok_1a52db071525ddcf30392df1")?.senseId).toBe(decision("tok_d0d2ad3ad4cfcfbc5d15835a")?.senseId);
    expect(decision("tok_f2773327ffc62a7a90d20513")?.senseId).toBe("sns_zola_rendre_become");
    expect(decision("tok_0f18184dac6d092910472f15")).toBeUndefined();
    expect(decision("tok_4b858968188d448eadcf1a2a")).toBeUndefined();
    for (const item of batch.decisions) {
      const bands = batch.quizItems.filter((quiz) => quiz.surfaceFormId === item.surfaceFormId && quiz.senseId === item.senseId).map((quiz) => quiz.band);
      if (bands.length) expect(bands.sort()).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    }
  });
});
