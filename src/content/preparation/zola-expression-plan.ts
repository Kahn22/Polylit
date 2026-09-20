import type { ContentBundle } from "../../domain/model.js";
import type { TokenCandidate } from "../../ingestion/model.js";

/** Editorial phrase spans only. These do not publish vocabulary or substitute for prepared quizzes. */
export const zolaExpressionSpans = [
  { identityId: "exi_a_priori", unitId: "unt_zola_jaccuse_023", phrase: "a priori", candidateId: "tok_448dc46860f9dc4b9b7f4f28" },
  { identityId: "exi_se_faire_fort_de", unitId: "unt_zola_jaccuse_026", phrase: "se fait fort de", candidateId: "tok_d4e88a783f925ed04d8c26fb" },
  { identityId: "exi_tout_au_plus", unitId: "unt_zola_jaccuse_038", phrase: "Tout au plus", candidateId: "tok_33c7470ecba92c7e64bfbb44" },
  { identityId: "exi_au_point_de", unitId: "unt_zola_jaccuse_093", phrase: "au point de", candidateId: "tok_70c8cec098a867798a0d9a76" },
  { identityId: "exi_tout_d_un_coup", unitId: "unt_zola_jaccuse_102", phrase: "tout d’un coup", candidateId: "tok_7b7a08ce9198664f5acb605c" },
  { identityId: "exi_tout_au_long", unitId: "unt_zola_jaccuse_128", phrase: "tout au long", candidateId: "tok_3452d846338771f45000d3b4" },
  { identityId: "exi_de_sorte_que", unitId: "unt_zola_jaccuse_142", phrase: "de sorte que", candidateId: "tok_bf4fc348bfce1835b70083b5" },
  { identityId: "exi_ainsi_que", unitId: "unt_zola_jaccuse_151", phrase: "ainsi que", candidateId: "tok_2835f572e75beb77c29724ba" },
  { identityId: "exi_de_sorte_que", unitId: "unt_zola_jaccuse_156", phrase: "de sorte que", candidateId: "tok_7697949da2f6c4ff2b31ecf0" },
  { identityId: "exi_tout_au_moins", unitId: "unt_zola_jaccuse_182", phrase: "tout au moins", candidateId: "tok_9a18a6805818fdbfbdab2696" },
  { identityId: "exi_quant_a", unitId: "unt_zola_jaccuse_191", phrase: "Quant aux", candidateId: "tok_cec2d718a80800329a7a91c9" },
] as const;

export interface PlannedExpressionOccurrence {
  identityId: string;
  candidateId: string;
  unitId: string;
  start: number;
  end: number;
  text: string;
}

/** Fail if canonical wording, occurrence IDs, or phrase boundaries drift. */
export function validateZolaExpressionSpans(
  units: readonly ContentBundle["units"][number][],
  candidates: readonly TokenCandidate[],
): PlannedExpressionOccurrence[] {
  const byUnit = new Map(units.map((unit) => [unit.id, unit]));
  const byCandidate = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const seen = new Set<string>();
  return zolaExpressionSpans.map((spec) => {
    if (seen.has(spec.candidateId)) throw new Error(`Duplicate expression anchor: ${spec.candidateId}`);
    seen.add(spec.candidateId);
    const unit = byUnit.get(spec.unitId);
    const candidate = byCandidate.get(spec.candidateId);
    if (!unit || !candidate || candidate.unitId !== unit.id || unit.workId !== candidate.workId) throw new Error(`Expression anchor missing or moved: ${spec.candidateId}`);
    const start = unit.french.indexOf(spec.phrase);
    if (start < 0 || unit.french.indexOf(spec.phrase, start + 1) >= 0) throw new Error(`Expression wording absent or ambiguous: ${spec.identityId}`);
    const end = start + spec.phrase.length;
    if (candidate.start < start || candidate.end > end || unit.french.slice(candidate.start, candidate.end) !== candidate.text) throw new Error(`Expression anchor outside phrase or changed: ${spec.candidateId}`);
    return { identityId: spec.identityId, candidateId: spec.candidateId, unitId: spec.unitId, start, end, text: unit.french.slice(start, end) };
  });
}
