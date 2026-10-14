import{describe,it,expect}from'vitest';
import{readFileSync}from'node:fs';
import{composeMicromegasResolution58}from'../scripts/micromegas-source-resolution-58.mjs';
import{checkMicromegasResolution58}from'../scripts/check-micromegas-source-resolution-58.mjs';
const folder=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
const pkg=()=>JSON.parse(readFileSync(`${folder}whole-work-mixed-de-resolution-58.json`));
describe('Micromégas mixed de resolution58',()=>{
 it('recomposes and validates the exact recorded package',()=>expect(()=>checkMicromegasResolution58(folder)).not.toThrow());
 it('keeps the quantity complement on the retained published preposition route',()=>{const p=pkg();expect(p.quantityPrepositionReassignment.toOwner).toEqual({kind:'published_identity',identity:'srf_de:sns_de_primary'});expect(p.quantityPrepositionReassignment.reason).toContain('un peu de confusion');});
 it('assigns all four complete partitive spans to one meaning and two expression surfaces',()=>{const p=pkg();expect(p.identity.gloss).toContain('unspecified amount');expect([...new Set(p.occurrences.map(o=>o.text))]).toEqual(expect.arrayContaining(['de l’','de la']));expect(p.occurrences).toHaveLength(4);expect(new Set(p.occurrences.map(o=>o.identityId))).toEqual(new Set([p.identity.id]));});
 it('owns precisely the eight tokens inside those four spans',()=>{const p=pkg();expect(p.components).toHaveLength(8);for(const o of p.occurrences)expect(p.components.filter(c=>c.expressionOccurrenceId===o.id)).toHaveLength(2);});
 it('stores one reviewed three-band set for each surface without applying or publishing it',()=>{const p=pkg();expect(p.banks).toHaveLength(2);expect(p.summary.storedPreparedQuestionBands).toBe(6);expect(p.status).toBe('offline_micromegas_mixed_de_resolution_unapplied');expect(p.summary.remainingDirectDraftSourceUses).toBe(676);});
});
