import {describe,it,expect} from 'vitest';
import {mkdtempSync,readdirSync,symlinkSync,readFileSync,writeFileSync,unlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {composeMicromegasIdentityDependencies} from '../scripts/micromegas-identity-dependencies.mjs';

const folder=resolve('content/sources/wrk_voltaire_micromegas');
function changed(file,change,run){
 const temp=mkdtempSync(resolve(tmpdir(),'micromegas-dependencies-'));
 try{for(const f of readdirSync(folder))symlinkSync(resolve(folder,f),resolve(temp,f));const data=JSON.parse(readFileSync(resolve(folder,file)));change(data);unlinkSync(resolve(temp,file));writeFileSync(resolve(temp,file),JSON.stringify(data));run(temp);}finally{rmSync(temp,{recursive:true,force:true});}
}
describe('Micromégas declared identity dependencies',()=>{
 it('shares explicitly linked senses but keeps lemma-only meanings separate',()=>{
  const g=composeMicromegasIdentityDependencies(folder),get=key=>g.declarations.find(d=>d.declaration.endsWith(':'+key));
  expect(get('planetes_worlds').root).toEqual(get('planete_world').root);
  expect(get('planetes_worlds').form).not.toBe(get('planete_world').form);
  const faint=get('faible_chapter_06_02_140_16'),weak=get('faible_weak');
  expect(faint.root.declaration).not.toBe(weak.root.declaration);expect(faint.root.lemma).toEqual(weak.root.lemma);
  expect(g.directDraftBankGroups.find(g=>g.surface==='satisfaction').distinctQuestionBanks).toBe(2);
 });
 it('rejects cycles in named sense dependencies',()=>changed('chapter-03-identity-plan.json',d=>{d.items.find(i=>i.key==='philosophes_philosophers').dependsOn='chapter-03-identity-plan.json:philosophes_philosophers';},temp=>expect(()=>composeMicromegasIdentityDependencies(temp)).toThrow(/dependency cycle/)));
 it('rejects a missing named bank rather than matching its gloss',()=>changed('chapter-06-identity-targets-02.json',d=>{d.items.find(i=>i.key==='paroles_chapter_06_02_141_44').target='prior-bank:chapter-06-batch-01.json:missing';},temp=>expect(()=>composeMicromegasIdentityDependencies(temp)).toThrow(/named prior bank/)));
});
