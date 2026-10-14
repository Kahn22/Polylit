import {afterEach,describe,expect,it} from 'vitest';
import {mkdtempSync,readdirSync,readFileSync,rmSync,symlinkSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {composeMicromegas} from '../scripts/micromegas-import-composition.mjs';

const source=resolve(import.meta.dirname,'../content/sources/wrk_voltaire_micromegas');
const temporary=[];
function altered(file,change){
 const folder=mkdtempSync(join(tmpdir(),'polylit-composition-'));temporary.push(folder);
 for(const name of readdirSync(source))if(name!==file)symlinkSync(join(source,name),join(folder,name));
 const value=JSON.parse(readFileSync(join(source,file)));change(value);writeFileSync(join(folder,file),JSON.stringify(value));return folder;
}
afterEach(()=>{for(const folder of temporary.splice(0))rmSync(folder,{recursive:true,force:true});});

describe('Micromégas source composition before import',()=>{
 it('keeps intervening figure words and elliptical ferait independent while preserving old word-locution mastery',()=>{
  const map=composeMicromegas(source),at=(unit,start)=>map.tokens.find(t=>t.unit===unit&&t.start===start);
  expect(at(44,44).owner.kind).toBe('complete_expression_component');
  expect(at(44,51).owner.kind).not.toBe('complete_expression_component');
  expect(at(44,60).owner.kind).not.toBe('complete_expression_component');
  expect(at(44,64).owner.kind).not.toBe('complete_expression_component');
  expect(at(122,263).owner.senseTarget).toBe('sns_cendrillon_faire_occupaient_une_place_sociale_remarquee_5ba87860bb');
  expect(at(122,263).owner.kind).toBe('reviewed_sense_route');
  expect(at(120,280).owner.identity).toBe('srf_fr_d_abord_d_elided:sns_fr_d_abord');
  expect(at(120,282).owner.kind).toBe('attached_word_locution_component');
  expect(at(213,10).owner.senseTarget).toBe('sns_parure_reprendre_prendre_de_nouveau_002348fae7');
 });
 it('rejects an unrecorded later route instead of using scope number as blanket permission to replace it',()=>{
  const folder=altered('whole-work-scope-plan-39.json',d=>{const original=JSON.parse(readFileSync(join(source,'whole-work-scope-plan-41.json'))).candidate.at(-1);original.tokens[0].route='sns_fr_reprendre_resume_speech';d.candidate.push(original);});
  expect(()=>composeMicromegas(folder)).toThrow(/unrecorded scope route collision 213:10:16/);
 });
 it('rejects range-wide suppression of an intervening adjective in the segmented figure phrase',()=>{
  const folder=altered('whole-work-scope-plan-27.json',d=>{const p=d.candidatePhraseComponents.find(p=>p.unit===44);p.componentTokens.push({start:51,end:59,text:'ridicule',normalized:'ridicule'});});
  expect(()=>composeMicromegas(folder)).toThrow(/segment-only ownership/);
 });
});
