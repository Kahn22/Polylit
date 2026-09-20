import { createHash } from "node:crypto";
import type { ContentBundle } from "../../domain/model.js";
import { vocabularyIdentityKey } from "../../domain/model.js";
import { zolaEditorialQuizzes } from "./zola-editorial-quizzes.js";
import type { ReviewDecision, TokenCandidate } from "../../ingestion/model.js";

export interface ZolaVocabularySpec {
  normalized: string;
  /** Required when one spelling has more than one contextual identity. */
  candidateIds?: readonly string[];
  lemmaKey: string;
  existingLemmaId?: string;
  existingSenseId?: string;
  headword: string;
  partOfSpeech: string;
  senseKey: string;
  gloss: string;
  quizMeaning?: string;
  definition: string;
  englishDistractors: [string, string, string];
  frenchDistractors: [string, string, string];
}

export interface AuthoredZolaVocabulary {
  lemmas: ContentBundle["lemmas"];
  senses: ContentBundle["senses"];
  surfaceForms: ContentBundle["surfaceForms"];
  decisions: ReviewDecision[];
  quizItems: ContentBundle["quizItems"];
}

const quizBands = ["levels_1_3", "levels_4_5", "levels_6_8"] as const;

/** Fail closed on missing or duplicate prepared questions for any reviewed identity. */
export function assertReviewedQuizCoverage(
  decisions: readonly ReviewDecision[],
  existing: readonly ContentBundle["quizItems"][number][],
  authored: readonly ContentBundle["quizItems"][number][],
): void {
  const byIdentity = new Map<string, Set<string>>();
  const ids = new Set<string>();
  for (const quiz of [...existing, ...authored]) {
    if (ids.has(quiz.id)) throw new Error(`Duplicate prepared quiz ID: ${quiz.id}`);
    ids.add(quiz.id);
    const key = vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId);
    const bands = byIdentity.get(key) ?? new Set<string>();
    if (bands.has(quiz.band)) throw new Error(`Duplicate prepared quiz band: ${key}:${quiz.band}`);
    bands.add(quiz.band);
    byIdentity.set(key, bands);
  }
  for (const decision of decisions) {
    if (decision.disposition !== "vocabulary") continue;
    if (!decision.surfaceFormId || !decision.senseId) throw new Error(`Incomplete vocabulary decision: ${decision.candidateId}`);
    const key = vocabularyIdentityKey(decision.surfaceFormId, decision.senseId);
    const bands = byIdentity.get(key);
    if (!quizBands.every((band) => bands?.has(band))) throw new Error(`Missing prepared quiz bands: ${key}`);
  }
}

/** Expands reviewed specifications; reuses prepared questions by surface + sense. */
export function authorZolaVocabulary(
  specs: readonly ZolaVocabularySpec[],
  candidates: readonly TokenCandidate[],
  units: readonly ContentBundle["units"][number][],
  existing?: Pick<ContentBundle, "surfaceForms" | "quizItems">,
): AuthoredZolaVocabulary {
  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const lemmas = new Map<string, ContentBundle["lemmas"][number]>();
  const senses = new Map<string, ContentBundle["senses"][number]>();
  const surfaceForms: ContentBundle["surfaceForms"] = [];
  const decisions: ReviewDecision[] = [];
  const quizItems: ContentBundle["quizItems"] = [];
  const seen = new Set<string>();
  const resolvedCandidateIds = new Set<string>();
  const existingSurfaces = new Map<string, string>();
  for (const surface of existing?.surfaceForms ?? []) {
    const key = `${surface.lemmaId}:${surface.normalized}`;
    if (existingSurfaces.has(key)) throw new Error(`Ambiguous existing surface form: ${key}`);
    existingSurfaces.set(key, surface.id);
  }
  const authoredSurfaces = new Map<string, string>();
  const preparedBands = new Map<string, Set<string>>();
  for (const quiz of existing?.quizItems ?? []) {
    const key = vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId);
    const bands = preparedBands.get(key) ?? new Set<string>();
    if (bands.has(quiz.band)) throw new Error(`Duplicate existing quiz band: ${key}:${quiz.band}`);
    bands.add(quiz.band);
    preparedBands.set(key, bands);
  }

  for (const spec of specs) {
    const specKey = `${spec.normalized}:${spec.lemmaKey}:${spec.senseKey}`;
    if (seen.has(specKey)) throw new Error(`Duplicate authored identity: ${specKey}`);
    seen.add(specKey);
    const requestedIds = spec.candidateIds ? new Set(spec.candidateIds) : undefined;
    const matches = candidates.filter((candidate) => candidate.normalized === spec.normalized && (!requestedIds || requestedIds.has(candidate.id)));
    if (matches.length === 0) throw new Error(`Authored form has no occurrence: ${spec.normalized}`);
    if (requestedIds && matches.length !== requestedIds.size) throw new Error(`Authored identity references an unknown or mismatched occurrence: ${specKey}`);
    for (const match of matches) {
      if (resolvedCandidateIds.has(match.id)) throw new Error(`Occurrence assigned to multiple identities: ${match.id}`);
      resolvedCandidateIds.add(match.id);
    }
    if (spec.existingSenseId !== undefined && spec.existingLemmaId === undefined) throw new Error(`Existing identity is incomplete: ${specKey}`);
    const lemmaId = spec.existingLemmaId ?? `lem_zola_${stableKey(spec.lemmaKey)}`;
    const senseId = spec.existingSenseId ?? `sns_zola_${stableKey(spec.senseKey)}`;
    const surfaceKey = `${lemmaId}:${spec.normalized}`;
    const surfaceFormId = existingSurfaces.get(surfaceKey) ?? authoredSurfaces.get(surfaceKey)
      ?? `srf_zola_${stableKey(spec.normalized)}_${stableKey(spec.lemmaKey)}`;
    if (!spec.existingLemmaId) {
      const existingLemma = lemmas.get(lemmaId);
      if (existingLemma && (existingLemma.headword !== spec.headword || existingLemma.partOfSpeech !== spec.partOfSpeech)) throw new Error(`Conflicting lemma: ${lemmaId}`);
      lemmas.set(lemmaId, { id: lemmaId, headword: spec.headword, partOfSpeech: spec.partOfSpeech });
    }
    if (!spec.existingSenseId) {
      const existingSense = senses.get(senseId);
      if (existingSense && (existingSense.lemmaId !== lemmaId || existingSense.gloss !== spec.gloss || existingSense.definition !== spec.definition)) throw new Error(`Conflicting sense: ${senseId}`);
      senses.set(senseId, { id: senseId, lemmaId, gloss: spec.gloss, definition: spec.definition });
    }
    if (!existingSurfaces.has(surfaceKey) && !authoredSurfaces.has(surfaceKey)) {
      surfaceForms.push({ id: surfaceFormId, lemmaId, form: matches[0]!.text, normalized: spec.normalized });
      authoredSurfaces.set(surfaceKey, surfaceFormId);
    }
    decisions.push(...matches.map((candidate) => ({ candidateId: candidate.id, disposition: "vocabulary" as const, lemmaId, senseId, surfaceFormId })));

    const identity = vocabularyIdentityKey(surfaceFormId, senseId);
    const bands = preparedBands.get(identity);
    if (bands?.size === 3) continue;
    if (bands?.size) throw new Error(`Incomplete existing quiz set: ${identity}`);

    const example = matches[0]!;
    const context = unitById.get(example.unitId)?.french;
    if (!context) throw new Error(`Missing context for ${example.id}`);
    const blank = `${context.slice(0, example.start)}_____${context.slice(example.end)}`;
    const choicesFrench = [example.text, ...spec.frenchDistractors];
    const advancedContext = `${context} Les formes proposées sont « ${choicesFrench.join(" », « ")} ».`;
    const quizKey = `${stableKey(spec.normalized)}_${stableKey(spec.senseKey)}`;
    const editorial = zolaEditorialQuizzes[`${spec.normalized}:${spec.senseKey}`];
    if (editorial && (editorial.frenchChoices[0] !== example.text || editorial.advancedChoices[0].toLocaleLowerCase("fr-FR") !== example.text.toLocaleLowerCase("fr-FR"))) {
      throw new Error(`Editorial quiz target does not match ${quizKey}`);
    }
    quizItems.push(
      { id: `qiz_zola_${quizKey}_early`, surfaceFormId, senseId, band: "levels_1_3", format: "meaning_choice", contextFrench: editorial?.early ?? context, targetText: example.text, prompt: "Meaning", choicesEnglish: editorial?.englishChoices ?? [spec.quizMeaning ?? spec.gloss, ...spec.englishDistractors], correctAnswer: editorial?.englishChoices[0] ?? spec.quizMeaning ?? spec.gloss },
      { id: `qiz_zola_${quizKey}_intermediate`, surfaceFormId, senseId, band: "levels_4_5", format: "surface_completion", contextFrench: editorial?.intermediate ?? blank, choicesFrench: editorial?.frenchChoices ?? choicesFrench, correctAnswer: example.text },
      { id: `qiz_zola_${quizKey}_advanced`, surfaceFormId, senseId, band: "levels_6_8", format: "target_identification", contextFrench: editorial?.advanced ?? advancedContext, promptFrench: editorial?.prompt ?? `Quel mot du texte signifie « ${spec.definition} » ?`, choicesFrench: editorial?.advancedChoices ?? choicesFrench, correctAnswer: example.text },
    );
    preparedBands.set(identity, new Set(["levels_1_3", "levels_4_5", "levels_6_8"]));
  }
  return { lemmas: [...lemmas.values()], senses: [...senses.values()], surfaceForms, decisions, quizItems };
}

function stableKey(value: string): string {
  const readable = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").toLowerCase();
  const digest = createHash("sha256").update(value).digest("hex").slice(0, 12);
  // Preserve distinctions lost by transliteration (démontre / démontré).
  return readable ? `${readable}${/[^\x00-\x7F]/.test(value) ? `_${digest}` : ""}` : digest;
}
