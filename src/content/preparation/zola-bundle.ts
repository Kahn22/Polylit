import type { ContentBundle } from "../../domain/model.js";
import type { IngestionManifest, ReviewDecision } from "../../ingestion/model.js";
import { createLievreLinguisticBundle } from "../linguistic/le-lievre-et-la-tortue.js";
import { zolaSourceAcquisition } from "../fixtures/zola.js";

/** Draft assembly for independent validation; callers must not publish on lexical coverage alone. */
export function assembleZolaDraft(
  manifest: IngestionManifest,
  review: { decisions: ReviewDecision[]; authoredContent: Pick<ContentBundle, "lemmas" | "senses" | "surfaceForms" | "quizItems"> },
): ContentBundle {
  const base = createLievreLinguisticBundle();
  const candidates = new Map(manifest.candidates.map((candidate) => [candidate.id, candidate]));
  if (review.decisions.length !== manifest.candidates.length || new Set(review.decisions.map((decision) => decision.candidateId)).size !== manifest.candidates.length) throw new Error("J’Accuse candidate review is incomplete or duplicated");
  const occurrenceId = (candidateId: string) => `occ_zola_${candidateId.slice(4)}`;
  return {
    ...base,
    authors: [...base.authors, ...zolaSourceAcquisition.authors],
    collections: [...base.collections, ...zolaSourceAcquisition.collections],
    books: [...base.books, ...zolaSourceAcquisition.books],
    works: [...base.works, ...zolaSourceAcquisition.works.map((work) => ({ ...work, publicationState: "processing" as const }))],
    sources: [...base.sources, ...zolaSourceAcquisition.sources],
    units: [...base.units, ...zolaSourceAcquisition.units],
    lemmas: [...base.lemmas, ...review.authoredContent.lemmas],
    senses: [...base.senses, ...review.authoredContent.senses],
    surfaceForms: [...base.surfaceForms, ...review.authoredContent.surfaceForms],
    quizItems: [...base.quizItems, ...review.authoredContent.quizItems],
    occurrences: [...base.occurrences, ...review.decisions.flatMap((decision) => {
      if (decision.disposition !== "vocabulary") return [];
      const candidate = candidates.get(decision.candidateId);
      if (!candidate || !decision.surfaceFormId || !decision.senseId) throw new Error(`Incomplete vocabulary review: ${decision.candidateId}`);
      return [{ id: occurrenceId(candidate.id), workId: candidate.workId, unitId: candidate.unitId, start: candidate.start, end: candidate.end, surfaceFormId: decision.surfaceFormId, senseId: decision.senseId }];
    })],
    exclusions: [...base.exclusions, ...review.decisions.flatMap((decision) => {
      if (decision.disposition !== "proper_noun" && decision.disposition !== "editorial_artifact") return [];
      const candidate = candidates.get(decision.candidateId);
      if (!candidate) throw new Error(`Unknown excluded candidate: ${decision.candidateId}`);
      return [{ id: `exc_zola_${candidate.id.slice(4)}`, workId: candidate.workId, unitId: candidate.unitId, start: candidate.start, end: candidate.end, text: candidate.text, reason: decision.disposition }];
    })],
    readiness: [...base.readiness, { workId: "wrk_zola_jaccuse", thoughtUnitsComplete: true, occurrencesReviewed: true, unresolvedLearnerTokens: [] }],
  };
}
