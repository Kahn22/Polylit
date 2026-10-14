import {describe,it,expect,beforeAll} from 'vitest';
import {composeMicromegasReviewedWords} from '../scripts/micromegas-reviewed-word-bindings.mjs';
import {composeMicromegasReviewedWordBanks} from '../scripts/micromegas-reviewed-word-banks.mjs';
import {quizEditorialIssues} from '../dist/publication/quiz-authoring.js';

let words,banks;
beforeAll(()=>{const f='content/sources/wrk_voltaire_micromegas';words=composeMicromegasReviewedWords(f);banks=composeMicromegasReviewedWordBanks(f,words);});
describe('Micromégas final reviewed word bindings',()=>{
 it('keeps existing identity progress and separates newly corrected meanings',()=>{
  expect(words.occurrenceBindings.find(o=>o.unit===1&&o.start===92).masteryAction).toBe('retain_existing_identity_progress');
  for(const route of['proper_small_noun','proper_pronoun_none','planned_quoi_adverb_exclamation']){
   const o=words.occurrenceBindings.find(o=>o.route===route);expect(o.masteryAction).toBe('fresh_identity_on_exact_unit_view');expect(o.identity).not.toBe(o.legacyIdentity);
  }
  const volumes=words.newSenses.filter(s=>s.target.startsWith('planned_volume_'));expect(volumes).toHaveLength(2);expect(volumes[0].record.lemmaId).toBe(volumes[1].record.lemmaId);expect(volumes[0].record.id).not.toBe(volumes[1].record.id);
 });
 it('corrects sentit to its own surface without copying sentoit mastery',()=>{
  const correction=words.surfaceCorrections[0],o=words.occurrenceBindings.find(o=>o.unit===127&&o.start===13);
  expect(correction.beforeIdentity).toContain('sentoit');expect(o.identity).toContain('srf_parure_sentit_');expect(o.identity).toBe(correction.afterIdentity);expect(o.masteryAction).toBe('retain_existing_identity_progress');
  expect(banks.banks.find(b=>b.identity===o.identity).chosen.kind).toBe('reviewed_historical_bank_replacement');
 });
 it('preserves indexed existing banks and avoids inactive template reactivation',()=>{
  expect(banks.banks.find(b=>b.identity.startsWith('srf_zola_hommes_homme:')).chosen.kind).toBe('existing_prepared_bank');
  const creation=banks.banks.find(b=>b.identity.startsWith('srf_parure_firent_')&&b.identity.includes('creer_produire'));
  expect(creation.chosen.kind).toBe('contextual_draft_bank');expect(creation.alternateCandidates.some(c=>c.kind==='existing_prepared_bank')).toBe(true);
 });
 it('stores three correctly bound questions per identity and exact owned highlights',()=>{
  expect(banks.banks).toHaveLength(words.identityGroups.length);
  for(const b of banks.banks){expect(new Set(b.questions.map(q=>q.band)).size).toBe(3);for(const q of b.questions){expect(`${q.subject.surfaceFormId}:${q.subject.senseId}`).toBe(b.identity);expect(quizEditorialIssues(q)).toEqual([]);}for(const highlight of b.overlays.filter(o=>o.kind==='explicit_earliest_indexed_owned_source_target'))expect(words.occurrenceBindings.some(o=>o.identity===b.identity&&o.unit===highlight.unit&&o.start===highlight.start&&o.end===highlight.end)).toBe(true);}
 });
 it('keeps every noun distractor in the new mains middle bank feminine plural',()=>{
  const b=words.newBanks.find(b=>b.form==='mains');expect(b.questions[1].choices).toEqual(['mains','oreilles','jambes','épaules']);expect(b.sourceOccurrences.map(o=>o.unit)).toEqual([91,127,129]);
 });
});
