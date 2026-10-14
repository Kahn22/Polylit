import{describe,it,expect}from'vitest';
import{readFileSync}from'node:fs';
import{composeMicromegasNextConstructions}from'../scripts/micromegas-next-constructions.mjs';
const folder='content/sources/wrk_voltaire_micromegas',read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),coord=o=>`${o.unit}:${o.start}:${o.end}`;
describe('Micromégas next whole constructions',()=>{
 it('owns four complete source spans with exact lexical component dispositions',()=>{
  const e=composeMicromegasNextConstructions(folder),expected=[['sous presse',70,138,149],['de peur de',81,11,21],['aurore boréale',82,58,72],['nouveau style',82,219,232]];
  for(const[text,unit,start,end]of expected){const o=e.occurrences.find(x=>x.text===text);expect(o).toMatchObject({start,end});expect(o.unitId).toBe(`unt_micromegas_${String(unit).padStart(3,'0')}`);expect(e.componentBindings.filter(c=>c.expressionOccurrenceId===o.id).map(x=>x.text).join(' ')).toBe(text);}
  expect(e.summary).toMatchObject({ownedLexicalComponents:9,reassignedDraftWordUses:6,suppressedExistingWordUses:3});
 });
 it('keeps other fear uses for word review and all predecessor uses partitioned',()=>{
  const e=composeMicromegasNextConstructions(folder),prior=read('whole-work-family-constructions-52.json'),keys=[...e.componentBindings.filter(x=>x.baseOwner.kind==='draft_bank'),...e.remainingDirectDraftOccurrences].map(coord);
  expect(keys.length).toBe(prior.remainingDirectDraftOccurrences.length);expect(new Set(keys).size).toBe(keys.length);expect(keys.toSorted()).toEqual(prior.remainingDirectDraftOccurrences.map(coord).toSorted());
  expect(e.remainingDirectDraftOccurrences.some(x=>x.unit===116&&x.form==='peur')).toBe(true);
  expect(e.remainingDirectDraftOccurrences.some(x=>x.unit===81&&x.form==='peur')).toBe(false);
 });
 it('prepares one validated three-band bank for each fresh expression',()=>{
  const e=composeMicromegasNextConstructions(folder);expect(e.banks).toHaveLength(4);for(const b of e.banks){expect(b.questions.map(q=>q.band)).toEqual(['levels_1_3','levels_4_5','levels_6_8']);expect(b.masteryAction).toBe('fresh_identity_on_exact_unit_view');expect(b.originalSourceBanks.length).toBeGreaterThan(0);}
 });
});
