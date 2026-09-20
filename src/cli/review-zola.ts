import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { zolaSourceAcquisition } from "../content/fixtures/zola.js";
import { createLievreLinguisticBundle } from "../content/linguistic/le-lievre-et-la-tortue.js";
import { reviewedZolaExclusions, reviewedZolaReuseDecisions } from "../content/preparation/zola-review.js";
import { assertReviewedQuizCoverage, authorZolaVocabulary } from "../content/preparation/zola-authoring.js";
import { zolaVocabularyBatch01 } from "../content/preparation/zola-vocabulary-batch-01.js";
import { zolaVocabularyBatch02 } from "../content/preparation/zola-vocabulary-batch-02.js";
import { zolaVocabularyBatch03 } from "../content/preparation/zola-vocabulary-batch-03.js";
import { zolaVocabularyBatch04 } from "../content/preparation/zola-vocabulary-batch-04.js";
import { zolaVocabularyBatch05 } from "../content/preparation/zola-vocabulary-batch-05.js";
import { zolaVocabularyBatch06 } from "../content/preparation/zola-vocabulary-batch-06.js";
import { zolaVocabularyBatch07 } from "../content/preparation/zola-vocabulary-batch-07.js";
import { zolaVocabularyBatch08 } from "../content/preparation/zola-vocabulary-batch-08.js";
import { zolaVocabularyBatch09 } from "../content/preparation/zola-vocabulary-batch-09.js";
import { zolaVocabularyBatch10 } from "../content/preparation/zola-vocabulary-batch-10.js";
import { zolaVocabularyBatch11 } from "../content/preparation/zola-vocabulary-batch-11.js";
import { zolaVocabularyBatch12 } from "../content/preparation/zola-vocabulary-batch-12.js";
import { zolaVocabularyBatch13 } from "../content/preparation/zola-vocabulary-batch-13.js";
import { zolaVocabularyBatch14 } from "../content/preparation/zola-vocabulary-batch-14.js";
import { zolaVocabularyBatch15 } from "../content/preparation/zola-vocabulary-batch-15.js";
import { zolaVocabularyBatch16 } from "../content/preparation/zola-vocabulary-batch-16.js";
import { zolaVocabularyBatch17 } from "../content/preparation/zola-vocabulary-batch-17.js";
import { zolaVocabularyBatch18 } from "../content/preparation/zola-vocabulary-batch-18.js";
import { zolaVocabularyBatch19 } from "../content/preparation/zola-vocabulary-batch-19.js";
import { zolaVocabularyBatch20 } from "../content/preparation/zola-vocabulary-batch-20.js";
import { zolaVocabularyBatch21 } from "../content/preparation/zola-vocabulary-batch-21.js";
import { zolaVocabularyBatch22 } from "../content/preparation/zola-vocabulary-batch-22.js";
import { zolaVocabularyBatch23 } from "../content/preparation/zola-vocabulary-batch-23.js";
import { zolaVocabularyBatch24 } from "../content/preparation/zola-vocabulary-batch-24.js";
import { zolaVocabularyBatch25 } from "../content/preparation/zola-vocabulary-batch-25.js";
import { zolaVocabularyBatch26 } from "../content/preparation/zola-vocabulary-batch-26.js";
import { zolaVocabularyBatch27 } from "../content/preparation/zola-vocabulary-batch-27.js";
import { zolaVocabularyBatch28 } from "../content/preparation/zola-vocabulary-batch-28.js";
import { zolaVocabularyBatch29 } from "../content/preparation/zola-vocabulary-batch-29.js";
import { zolaVocabularyBatch30 } from "../content/preparation/zola-vocabulary-batch-30.js";
import { zolaVocabularyBatch31 } from "../content/preparation/zola-vocabulary-batch-31.js";
import { zolaVocabularyBatch32 } from "../content/preparation/zola-vocabulary-batch-32.js";
import { zolaVocabularyBatch33 } from "../content/preparation/zola-vocabulary-batch-33.js";
import { zolaVocabularyBatch34 } from "../content/preparation/zola-vocabulary-batch-34.js";
import { zolaVocabularyBatch35 } from "../content/preparation/zola-vocabulary-batch-35.js";
import { zolaVocabularyBatch36 } from "../content/preparation/zola-vocabulary-batch-36.js";
import { zolaVocabularyBatch37 } from "../content/preparation/zola-vocabulary-batch-37.js";
import { zolaVocabularyBatch38 } from "../content/preparation/zola-vocabulary-batch-38.js";
import { zolaVocabularyBatch39 } from "../content/preparation/zola-vocabulary-batch-39.js";
import { zolaVocabularyBatch40 as zolaVocabularyBatch40Authoring } from "../content/preparation/zola-vocabulary-batch-40.js";
import { zolaVocabularyBatch41 } from "../content/preparation/zola-vocabulary-batch-41.js";
import { zolaVocabularyBatch42 } from "../content/preparation/zola-vocabulary-batch-42.js";
import { zolaVocabularyBatch43 } from "../content/preparation/zola-vocabulary-batch-43.js";
import { zolaVocabularyBatch44 } from "../content/preparation/zola-vocabulary-batch-44.js";
import { zolaVocabularyBatch45 } from "../content/preparation/zola-vocabulary-batch-45.js";
import { zolaVocabularyBatch46 } from "../content/preparation/zola-vocabulary-batch-46.js";
import { zolaVocabularyBatch47 } from "../content/preparation/zola-vocabulary-batch-47.js";
import { zolaVocabularyBatch48 } from "../content/preparation/zola-vocabulary-batch-48.js";
import { zolaVocabularyBatch49 } from "../content/preparation/zola-vocabulary-batch-49.js";
import { zolaVocabularyBatch50 } from "../content/preparation/zola-vocabulary-batch-50.js";
import { zolaFinalVocabulary, zolaFinalVocabularyQuizzes } from "../content/preparation/zola-final-vocabulary.js";
import { auditZolaQuizEditorialReadiness } from "../content/preparation/zola-quality.js";
import { createZolaPreparedExpressionCatalog } from "../content/preparation/zola-prepared-expressions.js";
import { assertReviewedExpressionCoverage } from "../domain/expression-content.js";
import { validateZolaExpressionSpans } from "../content/preparation/zola-expression-plan.js";
import { zolaSharedQuizBatch38 } from "../content/preparation/zola-shared-quiz-batch-38.js";
import { zolaSharedQuizCoverage } from "../content/preparation/zola-shared-quiz-coverage.js";
import { zolaSharedQuizBatch40 } from "../content/preparation/zola-shared-quiz-batch-40.js";
import { zolaSharedQuizBatch42 } from "../content/preparation/zola-shared-quiz-batch-42.js";
import { onePronounCandidateIds, reviewedOnePronounDecisions, zolaOnePronounQuizzes, zolaOnePronounSense } from "../content/preparation/zola-one-pronoun.js";
import { prepareIngestionManifest } from "../ingestion/prepare.js";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "content/review/wrk_zola_jaccuse.exclusions.json");
const manifest = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse");
const existing = createLievreLinguisticBundle();
const expressionCatalog = createZolaPreparedExpressionCatalog();
const plannedExpressions = validateZolaExpressionSpans(zolaSourceAcquisition.units, manifest.candidates);
const authored = authorZolaVocabulary([...zolaVocabularyBatch01, ...zolaVocabularyBatch02, ...zolaVocabularyBatch03, ...zolaVocabularyBatch04, ...zolaVocabularyBatch05, ...zolaVocabularyBatch06, ...zolaVocabularyBatch07, ...zolaVocabularyBatch08, ...zolaVocabularyBatch09, ...zolaVocabularyBatch10, ...zolaVocabularyBatch11, ...zolaVocabularyBatch12, ...zolaVocabularyBatch13, ...zolaVocabularyBatch14, ...zolaVocabularyBatch15, ...zolaVocabularyBatch16, ...zolaVocabularyBatch17, ...zolaVocabularyBatch18, ...zolaVocabularyBatch19, ...zolaVocabularyBatch20, ...zolaVocabularyBatch21, ...zolaVocabularyBatch22, ...zolaVocabularyBatch23, ...zolaVocabularyBatch24, ...zolaVocabularyBatch25, ...zolaVocabularyBatch26, ...zolaVocabularyBatch27, ...zolaVocabularyBatch28, ...zolaVocabularyBatch29, ...zolaVocabularyBatch30, ...zolaVocabularyBatch31, ...zolaVocabularyBatch32, ...zolaVocabularyBatch33, ...zolaVocabularyBatch34, ...zolaVocabularyBatch35, ...zolaVocabularyBatch36, ...zolaVocabularyBatch37, ...zolaVocabularyBatch38, ...zolaVocabularyBatch39, ...zolaVocabularyBatch40Authoring, ...zolaVocabularyBatch41, ...zolaVocabularyBatch42, ...zolaVocabularyBatch43, ...zolaVocabularyBatch44, ...zolaVocabularyBatch45, ...zolaVocabularyBatch46, ...zolaVocabularyBatch47, ...zolaVocabularyBatch48, ...zolaVocabularyBatch49, ...zolaVocabularyBatch50, ...zolaFinalVocabulary], manifest.candidates, zolaSourceAcquisition.units, { ...existing, quizItems: [...existing.quizItems, ...zolaFinalVocabularyQuizzes] });
const decisions = [
  ...reviewedZolaExclusions(manifest.candidates),
  ...reviewedZolaReuseDecisions(manifest.candidates, existing),
  ...authored.decisions,
  ...reviewedOnePronounDecisions(manifest.candidates),
  ...plannedExpressions.filter((span) => ["exi_a_priori", "exi_tout_d_un_coup", "exi_de_sorte_que", "exi_tout_au_plus", "exi_tout_au_moins", "exi_au_point_de"].includes(span.identityId)).map((span) => ({ candidateId: span.candidateId, disposition: "expression" as const, expressionIdentityId: span.identityId })),
].sort((a, b) => a.candidateId.localeCompare(b.candidateId));
if (new Set(decisions.map((decision) => decision.candidateId)).size !== decisions.length) throw new Error("Overlapping J’Accuse review decisions");
const newQuizItems = [...authored.quizItems, ...zolaFinalVocabularyQuizzes, ...zolaSharedQuizBatch38, ...zolaSharedQuizCoverage, ...zolaSharedQuizBatch40, ...zolaSharedQuizBatch42, ...zolaOnePronounQuizzes];
assertReviewedQuizCoverage(decisions, existing.quizItems, newQuizItems);
assertReviewedExpressionCoverage(manifest.candidates, decisions, expressionCatalog);
const properNouns = decisions.filter((decision) => decision.disposition === "proper_noun").length;
const editorialArtifacts = decisions.filter((decision) => decision.disposition === "editorial_artifact").length;
const reusedVocabulary = decisions.filter((decision) => decision.disposition === "vocabulary").length;

mkdirSync(resolve(root, "content/review"), { recursive: true });
writeFileSync(output, `${JSON.stringify({
  schemaVersion: 1,
  workId: "wrk_zola_jaccuse",
  sourceDigest: manifest.sourceDigest,
  decisions,
  authoredContent: {
    lemmas: authored.lemmas,
    senses: [...authored.senses, zolaOnePronounSense],
    surfaceForms: authored.surfaceForms,
    quizItems: newQuizItems,
  },
  expressionCatalog,
  quizEditorialAudit: auditZolaQuizEditorialReadiness(zolaSourceAcquisition.units, newQuizItems),
  counts: {
    reviewed: decisions.length,
    properNouns,
    editorialArtifacts,
    reusedVocabulary,
    reviewedExpressionOccurrences: decisions.filter((decision) => decision.disposition === "expression").length,
    authoredVocabularyOccurrences: authored.decisions.length + onePronounCandidateIds.size,
    authoredVocabularyIdentities: authored.senses.length + 1,
    authoredQuizItems: newQuizItems.length,
    remainingCandidates: manifest.candidates.length - decisions.length,
    plannedExpressionOccurrences: plannedExpressions.length,
    preparedExpressionIdentities: expressionCatalog.identities.length,
  },
}, null, 2)}\n`, "utf8");
console.log(`written ${decisions.length} reviewed decisions; ${manifest.candidates.length - decisions.length} candidates remain`);
