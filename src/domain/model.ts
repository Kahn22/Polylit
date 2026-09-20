import { z } from "zod";

const stableId = (prefix: string) => z.string().regex(new RegExp(`^${prefix}_[a-z0-9][a-z0-9_-]*$`));
const nonBlank = z.string().trim().min(1);

export const PublicationStateSchema = z.enum([
  "source_acquired",
  "source_structured",
  "processing",
  "learning_ready",
  "published",
]);

export const AuthorSchema = z.object({ id: stableId("aut"), name: nonBlank, sortName: nonBlank });
export const CollectionSchema = z.object({
  id: stableId("col"), authorId: stableId("aut"), title: nonBlank, language: z.enum(["fr", "es"]),
});
export const BookSchema = z.object({
  id: stableId("bok"), collectionId: stableId("col"), ordinal: z.number().int().positive(), title: nonBlank,
});
export const WorkSchema = z.object({
  id: stableId("wrk"), bookId: stableId("bok"), ordinal: z.number().int().positive(), title: nonBlank,
  publicationState: PublicationStateSchema,
  originCountryCode: z.string().regex(/^[A-Z]{2}$/).optional(),
  originCountryName: nonBlank.optional(),
  originCountryFlag: nonBlank.optional(),
  contentAdvisory: nonBlank.optional(),
});
export const SourceSchema = z.object({
  workId: stableId("wrk"), canonicalText: nonBlank,
  provenance: z.object({ citation: nonBlank, url: z.string().url().optional(), accessedOn: z.string().date().optional() }),
  typographyPolicy: z.literal("modern_conventional_typography_preserving_wording"),
});
export const ThoughtUnitSchema = z.object({
  id: stableId("unt"), workId: stableId("wrk"), ordinal: z.number().int().positive(), french: nonBlank,
});
export const LemmaSchema = z.object({
  id: stableId("lem"), headword: nonBlank, partOfSpeech: nonBlank,
});
export const SenseSchema = z.object({
  id: stableId("sns"), lemmaId: stableId("lem"), gloss: nonBlank, definition: nonBlank,
});
export const SurfaceFormSchema = z.object({
  id: stableId("srf"), lemmaId: stableId("lem"), form: nonBlank, normalized: nonBlank,
  grammaticalFeatures: z.object({
    gender: z.enum(["masculine", "feminine", "common"]).optional(),
    number: z.enum(["singular", "plural", "invariable"]).optional(),
    person: z.enum(["first", "second", "third"]).optional(),
    tense: nonBlank.optional(), mood: nonBlank.optional(),
  }).optional(),
});
export const OccurrenceSchema = z.object({
  id: stableId("occ"), workId: stableId("wrk"), unitId: stableId("unt"), surfaceFormId: stableId("srf"),
  senseId: stableId("sns"), start: z.number().int().nonnegative(), end: z.number().int().positive(),
});
export const ExcludedOccurrenceSchema = z.object({
  id: stableId("exc"), workId: stableId("wrk"), unitId: stableId("unt"),
  start: z.number().int().nonnegative(), end: z.number().int().positive(), text: nonBlank,
  reason: z.enum(["proper_noun", "editorial_artifact"]),
});
export const ExpressionSchema = z.object({
  id: stableId("exp"), workId: stableId("wrk"), unitId: stableId("unt"), text: nonBlank, gloss: nonBlank,
});
export const NoteSchema = z.object({
  id: stableId("not"), workId: stableId("wrk"), unitId: stableId("unt").optional(), text: nonBlank,
  kind: z.enum(["source", "editorial", "historical", "language"]),
});
const QuizIdentitySchema = z.object({
  id: stableId("qiz"), surfaceFormId: stableId("srf"), senseId: stableId("sns"),
});
const fourChoices = z.array(nonBlank).length(4);
export const QuizBandSchema = z.enum(["levels_1_3", "levels_4_5", "levels_6_8"]);
export const QuizItemSchema = z.discriminatedUnion("band", [
  QuizIdentitySchema.extend({ band: z.literal("levels_1_3"), format: z.literal("meaning_choice"), contextFrench: nonBlank, targetText: nonBlank, prompt: z.literal("Meaning"), choicesEnglish: fourChoices, correctAnswer: nonBlank }),
  QuizIdentitySchema.extend({ band: z.literal("levels_4_5"), format: z.literal("surface_completion"), contextFrench: nonBlank, choicesFrench: fourChoices, correctAnswer: nonBlank }),
  QuizIdentitySchema.extend({ band: z.literal("levels_6_8"), format: z.literal("target_identification"), contextFrench: nonBlank, promptFrench: nonBlank, choicesFrench: fourChoices, correctAnswer: nonBlank }),
]);
export const WorkReadinessSchema = z.object({
  workId: stableId("wrk"), thoughtUnitsComplete: z.boolean(), occurrencesReviewed: z.boolean(),
  unresolvedLearnerTokens: z.array(nonBlank),
});
export const ContentBundleSchema = z.object({
  authors: z.array(AuthorSchema), collections: z.array(CollectionSchema), books: z.array(BookSchema),
  works: z.array(WorkSchema), sources: z.array(SourceSchema), units: z.array(ThoughtUnitSchema),
  lemmas: z.array(LemmaSchema), senses: z.array(SenseSchema), surfaceForms: z.array(SurfaceFormSchema),
  occurrences: z.array(OccurrenceSchema), exclusions: z.array(ExcludedOccurrenceSchema),
  expressions: z.array(ExpressionSchema), notes: z.array(NoteSchema),
  quizItems: z.array(QuizItemSchema), readiness: z.array(WorkReadinessSchema),
});

export type ContentBundle = z.infer<typeof ContentBundleSchema>;
export type PublicationState = z.infer<typeof PublicationStateSchema>;
export { MASTERY_LEVELS, quizBandForMasteryLevel, vocabularyIdentityKey } from "./runtime.js";
export type { MasteryLevel } from "./runtime.js";
export type QuizBand = z.infer<typeof QuizBandSchema>;
