import type { ContentBundle } from "../../domain/model.js";
import type { SpanishEditorialEntry } from "./spanish-01.js";

/** User-approved on 2026-09-19: semantic changes never inherit old mastery.
 * These are manually reviewed contexts, not a corpus-wide generation template. */
export const semanticProgressPolicy = "preserve-history-fresh-on-view-v1" as const;
export interface SpanishMeaningReview extends Pick<SpanishEditorialEntry, "form" | "baseRevision" | "headword" | "gloss" | "definition" | "meaning" | "completion" | "identification" | "rationale"> {
  oldSuffix: string;
  senseId: string;
  newLexeme?: string;
  partOfSpeech: string;
  features: NonNullable<ContentBundle["surfaceForms"][number]["grammaticalFeatures"]>;
  occurrenceIds: string[];
  reference: string;
}
export const spanishEditorial02: SpanishMeaningReview[] = [
  {
    form: "plumas", oldSuffix: "0643_plumas", senseId: "sns_es_pluma_feather",
    baseRevision: "rev_65b28794d08fab82afb4a1a6a3c4f63a7ebb35e27a9c63e4d2241352de270e6e",
    headword: "pluma", partOfSpeech: "noun", features: { gender: "feminine", number: "plural" },
    gloss: "feathers", definition: "Piezas ligeras que cubren el cuerpo de las aves y pueden servir de relleno blando.",
    occurrenceIds: ["occ_es_quiroga_almohadon_031_24", "occ_es_quiroga_almohadon_031_52"],
    meaning: { context: "Al romperse el cojín, salieron las plumas con las que estaba relleno.", choices: ["feathers", "pens", "buttons", "threads"] },
    completion: { context: "El ave sacudió las alas y dejó caer dos ___ de su plumaje.", choices: ["plumas", "hojas", "escamas", "semillas"] },
    identification: { context: "La costurera abrió la funda del cojín, retiró las plumas y arregló la costura con hilo nuevo.", prompt: "¿Qué palabra nombra el relleno procedente del plumaje de aves?", choices: ["plumas", "funda", "costura", "hilo"] },
    rationale: "Both tokens in Quiroga unit 031 name pillow filling exposed when Jordán cuts the cover. Neither denotes a pen. Retain the old pens sense and its history; assign a new feather sense to exactly these two spans. Keep the existing plural surface; normalize its lemma without merging the separately unreviewed singular pluma entry. All three questions disambiguate bird plumage from writing instruments.",
    reference: "https://dle.rae.es/pluma",
  },
  {
    form: "médico", oldSuffix: "0501_medico", senseId: "sns_es_medico_medical", newLexeme: "es_medico_adjective",
    baseRevision: "rev_74c99d057c3da094c853b58891eec662b253a6318910858f9438393d59ad5fd5",
    headword: "médico", partOfSpeech: "adjective", features: { gender: "masculine", number: "singular" },
    gloss: "medical", definition: "Relacionado con la medicina, sus profesionales o la atención de la salud.",
    occurrenceIds: ["occ_es_palma_camisa_012_22"],
    meaning: { context: "El informe médico describe el tratamiento que recibió la paciente en el hospital.", choices: ["medical", "legal", "financial", "literary"] },
    completion: { context: "Para comprobar el estado de mis pulmones, me hicieron un examen ___ en la clínica.", choices: ["médico", "musical", "jurídico", "astronómico"] },
    identification: { context: "El equipo médico examinó a la paciente en la clínica.", prompt: "¿Qué palabra es un adjetivo que relaciona al equipo con la medicina?", choices: ["médico", "equipo", "paciente", "clínica"] },
    rationale: "In Palma unit 012 médico modifies ultimátum; it does not name a person. Separate adjective lemma/surface/sense from the retained doctor noun. The questions all use the adjective, not a nominalized adjective or doctor noun; the three contexts and alternatives were checked separately.",
    reference: "https://dle.rae.es/m%C3%A9dico",
  },
  {
    form: "mujer", oldSuffix: "0541_mujer", senseId: "sns_es_mujer_spouse",
    baseRevision: "rev_c8b857465e5ba693f4c442e341f093c917177885257bbe4f05709bccad9d232b",
    headword: "mujer", partOfSpeech: "noun", features: { gender: "feminine", number: "singular" },
    gloss: "wife", definition: "Esposa, considerada en relación con la persona con quien está casada.",
    occurrenceIds: ["occ_es_quiroga_almohadon_010_21"],
    meaning: { context: "Pedro y su mujer celebraron veinte años de matrimonio.", choices: ["wife", "sister", "daughter", "neighbour"] },
    completion: { context: "Me casé con Ana hace diez años; desde entonces ella es mi ___.", choices: ["mujer", "hermana", "prima", "hija"] },
    identification: { context: "Luis viajó con su mujer para celebrar su aniversario de boda; su hermana se quedó en casa.", prompt: "¿Qué palabra designa aquí a la persona casada con Luis?", choices: ["mujer", "aniversario", "boda", "hermana"] },
    rationale: "Quiroga unit 010 refers to Jordán's wife Alicia, established as the married couple in the opening. A general woman gloss loses the relationship meant by su mujer. Keep the same noun surface but add an independently learned spouse sense. Every question explicitly establishes marriage, avoiding the broader woman reading and unrelated family meanings.",
    reference: "https://dle.rae.es/mujer",
  },
  {
    form: "paso", oldSuffix: "0943_paso", senseId: "sns_es_pasar_accept", newLexeme: "es_pasar",
    baseRevision: "rev_36663a2a37d5218e7014bd4c8b3145841c959f0cdf4535e7aeb04d217b9eff4f",
    headword: "pasar", partOfSpeech: "verb", features: { person: "first", number: "singular", tense: "present", mood: "indicative" },
    gloss: "I accept", definition: "En pasar por algo, admitir o tolerar una condición, aunque no agrade.",
    occurrenceIds: ["occ_es_palma_camisa_015_81"],
    meaning: { context: "No me gusta esa condición, pero paso por ella para que podamos llegar a un acuerdo.", choices: ["I accept", "I refuse", "I forget", "I demand"] },
    completion: { context: "No me agrada esa condición, pero la acepto: ___ por ella para cerrar el trato.", choices: ["paso", "pasas", "pasa", "pasan"] },
    identification: { context: "Entiendo la propuesta y paso por esa condición, aunque preferiría otro acuerdo.", prompt: "¿Qué forma verbal expresa aquí que acepto la condición?", choices: ["paso", "entiendo", "preferiría", "acuerdo"] },
    rationale: "In Palma unit 015 Honorato concedes permission for the bridal shirt, immediately restated as Consiento. Context supports the accepting/tolerating construction, not a footstep or movement. The DLE supplies the tolerance senses and yo paso conjugation; the acceptance reading is a contextual interpretation. No existing pasar lemma was found. Preserve the old step identity and keep the separately reviewed plural pasos noun independent. Completion distinguishes present indicative person, not interchangeable synonyms.",
    reference: "https://dle.rae.es/pasar",
  },
  {
    form: "médico", oldSuffix: "0501_medico", senseId: "sns_es_0501_medico",
    baseRevision: "rev_74c99d057c3da094c853b58891eec662b253a6318910858f9438393d59ad5fd5",
    headword: "médico", partOfSpeech: "noun", features: { gender: "masculine", number: "singular" },
    gloss: "doctor", definition: "Profesional que examina a pacientes y trata sus enfermedades.",
    occurrenceIds: ["occ_es_quiroga_almohadon_007_16", "occ_es_quiroga_almohadon_018_11"],
    meaning: { context: "El médico examinó al enfermo y le recetó un tratamiento.", choices: ["doctor", "patient", "teacher", "lawyer"] },
    completion: { context: "Como tenía fiebre, pedí una consulta con el ___ para que me examinara.", choices: ["médico", "carpintero", "panadero", "jardinero"] },
    identification: { context: "El médico escuchó al paciente mientras el conductor esperaba junto al coche.", prompt: "¿Qué palabra nombra al profesional que diagnostica y trata enfermedades?", choices: ["médico", "paciente", "conductor", "coche"] },
    rationale: "Both Quiroga uses (units 007 and 018) denote the attending doctor. The doctor meaning and mastery key remain unchanged after excluding the Palma adjective. No progress is reset or copied. Noun classification and the descriptive definition preserve the original doctor gloss. All question contexts refer unambiguously to the professional person.",
    reference: "https://dle.rae.es/m%C3%A9dico",
  },
];
