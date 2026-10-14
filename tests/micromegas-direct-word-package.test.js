import {beforeAll,describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {composeMicromegasDirectWordPackage} from '../scripts/micromegas-direct-word-package.mjs';
import {quizEditorialIssues} from '../dist/publication/quiz-authoring.js';
let data;
beforeAll(()=>{data=composeMicromegasDirectWordPackage('content/sources/wrk_voltaire_micromegas');});
describe('Micromégas direct word package',()=>{
 it('shares declared meanings across number while preserving separate surface mastery',()=>{
  for(const forms of [['planètes','planète'],['géomètres','géomètre']]){
   const o=forms.map(f=>data.occurrenceBindings.find(o=>o.form===f));
   expect(o[0].senseId).toBe(o[1].senseId);expect(o[0].lemmaId).toBe(o[1].lemmaId);expect(o[0].surfaceFormId).not.toBe(o[1].surfaceFormId);expect(o.every(o=>o.masteryAction==='fresh_identity_on_exact_unit_view')).toBe(true);
  }
 });
 it('keeps mathematical propositions separate from disputed assertions under the same noun head',()=>{
  const g=data.identityGroups.filter(g=>data.occurrenceBindings.some(o=>o.identity===g.identity&&o.form==='propositions'));
  expect(g).toHaveLength(2);expect(g[0].surfaceFormId).toBe(g[1].surfaceFormId);expect(g[0].senseId).not.toBe(g[1].senseId);
 });
 it('partitions every direct draft use and leaves known ownership conflicts untouched',()=>{
  const key=o=>`${o.unit}:${o.start}:${o.end}`,bound=new Set(data.occurrenceBindings.map(key)),remaining=new Set(data.remainingDirectDraftOccurrences.map(key));
  expect(bound.size).toBe(221);expect(remaining.size).toBe(1497);expect([...bound].some(k=>remaining.has(k))).toBe(false);
  for(const form of ['public','êtres','depuis','haut','pas','affaires']){expect(data.occurrenceBindings.some(o=>o.form===form)).toBe(false);expect(data.heldGroups.some(g=>g.surface===form)).toBe(true);}
 });
 it('preserves existing keys and keeps the 300 questions attached to exact final subjects',()=>{
  expect(data.occurrenceBindings.find(o=>o.form==='dis').identity).toBe('srf_dis:sns_dire_primary');expect(data.occurrenceBindings.find(o=>o.form==='dis').masteryAction).toBe('retain_existing_identity_progress');
  expect(data.banks).toHaveLength(100);for(const b of data.banks){expect(b.questions).toHaveLength(3);for(const q of b.questions){expect(`${q.subject.surfaceFormId}:${q.subject.senseId}`).toBe(b.identity);expect(quizEditorialIssues(q)).toEqual([]);}}
 });
 it('removes the elision cue and ambiguous generic diameter answer without changing source banks',()=>{
  const middle=form=>data.banks.find(b=>data.occurrenceBindings.some(o=>o.identity===b.identity&&o.form===form)).questions.find(q=>q.band==='levels_4_5');
  expect(middle('appelait').choices.map(c=>c.text)).toEqual(['appelait','éloignait','effaçait','étonnait']);expect(middle('diamètre').choices.map(c=>c.text)).toEqual(['diamètre','rayon','périmètre','arc']);expect(middle('enfance').choices.map(c=>c.text)).toEqual(['enfance','adolescence','expérience','existence']);
  const old=JSON.parse(readFileSync('content/sources/wrk_voltaire_micromegas/chapter-01-batch-02.json')).items.find(i=>i.key==='diamètre_width');expect(old.questions[1].choices).toContain('segment');
 });
});
