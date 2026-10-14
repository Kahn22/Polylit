import {beforeAll,describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {composeMicromegasResolvedWordPackage} from '../scripts/micromegas-resolved-word-package.mjs';
import {composeMicromegasResolvedExpressions} from '../scripts/micromegas-resolved-expressions.mjs';
import {loadPublication} from '../scripts/micromegas-publication-baseline.mjs';
import {quizEditorialIssues} from '../dist/publication/quiz-authoring.js';
const folder='content/sources/wrk_voltaire_micromegas',read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),coord=o=>`${o.unit}:${o.start}:${o.end}`;
let w,e;
beforeAll(()=>{w=composeMicromegasResolvedWordPackage(folder);e=composeMicromegasResolvedExpressions(folder);});
const owner=form=>w.occurrenceBindings.find(o=>o.form===form);
describe('Micromégas resolved grammatical owners',()=>{
 it('keeps legacy heads and assigns height, noun public and time-adverb depuis correctly',()=>{
  expect(owner('haut').lemmaId).toBe('lem_fr_haut_noun');expect(owner('public').lemmaId).not.toBe('lem_zola_public');expect(owner('depuis').lemmaId).not.toBe('lem_zola_depuis');
  for(const form of['public','depuis'])expect(w.newLemmas.some(x=>x.record.id===owner(form).lemmaId&&x.record.partOfSpeech===(form==='public'?'noun':'adverb'))).toBe(true);
 });
 it('joins noun number variants and preserves the verb être meaning and keys',()=>{
  expect(owner('être').senseId).toBe(owner('êtres').senseId);expect(owner('être').surfaceFormId).not.toBe(owner('êtres').surfaceFormId);expect(owner('être').lemmaId).not.toBe('lem_etre');expect(owner('être').masteryAction).toBe('fresh_identity_on_exact_unit_view');
 });
 it('retains existing jolie and movement senses while giving printed new surfaces fresh keys',()=>{
  expect(owner('très-jolie').senseId).toBe('sns_parure_joli_qui_a_de_la_grace_de_l_agrement_c9d52e1cf5');expect(owner('allait').senseId).toBe('sns_aller_primary');expect(owner('allait').lemmaId).toBe('lem_aller');expect(owner('allait').masteryAction).toBe('fresh_identity_on_exact_unit_view');expect(w.newSurfaceForms.find(x=>x.record.id===owner('sirien').surfaceFormId).record.form).toBe('Sirien');
 });
 it('matches noun-number distractors for the historical fixed pace and preserves both Earth banks',()=>{
  const middle=w.banks.find(b=>b.identity===owner('pas').identity).questions.find(q=>q.band==='levels_4_5');expect(middle.choices.map(c=>c.text)).toEqual(['pas','pieds','mètres','pouces']);expect(w.preservedCompetingBanks[0].surface).toBe('terre');expect(w.preservedCompetingBanks[0].alternates).toHaveLength(1);
 });
 it('partitions all1718 direct draft uses across previous, new word, expression and remaining owners',()=>{
  const before=read('whole-work-direct-word-package-46.json'),parts=[before.occurrenceBindings,w.occurrenceBindings,e.componentBindings.filter(o=>o.baseOwner.kind==='draft_bank'),e.remainingDirectDraftOccurrences],flat=parts.flatMap(x=>x.map(coord));expect(flat).toHaveLength(1718);expect(new Set(flat).size).toBe(1718);expect(w.identityGroups).toHaveLength(103);
  for(const b of w.banks)for(const q of b.questions){expect(quizEditorialIssues(q)).toEqual([]);expect(`${q.subject.surfaceFormId}:${q.subject.senseId}`).toBe(b.identity);}
 });
});
describe('Micromégas full expression bindings',()=>{
 it('owns complete phrases without consuming l’ or the already bound enfance complement',()=>{
  const o=e.occurrences.find(o=>o.text==='au sortir de');expect([o.start,o.end]).toEqual([36,48]);expect(e.componentBindings.filter(c=>c.unit===11).map(c=>c.text)).toEqual(['au','sortir','de']);expect(e.componentBindings).toHaveLength(8);expect(e.occurrences.filter(o=>o.text==='sur-le-champ')).toHaveLength(2);
 });
 it('keeps forest mastery and all legacy questions while the shorter expression surface starts fresh',()=>{
  const id='exi_lion_rat_au_sortir_des_forets_971cce2bcd',p=loadPublication(),bank=e.banks.find(b=>b.expressionId===id);expect(e.legacyImpact[0].quizzes).toEqual(p.expressionCatalog.preparedQuizzes.filter(q=>q.expressionId===id));expect(bank.identity).not.toBe(id);expect(bank.masteryAction).toBe('fresh_identity_on_exact_unit_view');expect(e.identityChanges[0].after.headword).toBe('au sortir de');expect(p.expressionCatalog.identities.find(x=>x.id===id).headword).toBe('au sortir des forêts');
 });
 it('prepares full expression answers under exact surface subjects, with unambiguous early ranges',()=>{
  expect(e.banks).toHaveLength(3);for(const b of e.banks){expect(b.questions).toHaveLength(3);for(const q of b.questions){expect(quizEditorialIssues(q)).toEqual([]);expect(q.subject).toEqual({kind:'expression',expressionId:b.expressionId,surfaceId:b.surfaceId});}const q=b.questions.find(q=>q.band==='levels_1_3');expect(q.context.slice(q.targetRange.start,q.targetRange.end).toLowerCase()).toBe(q.targetText);}
 });
});
