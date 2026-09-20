import type { ContentBundle } from "../../domain/model.js";
import { spanishSourceAcquisition } from "../fixtures/spanish.js";
import { spanishGlosses0 } from "./spanish-glosses-0.js";
import { spanishGlosses150 } from "./spanish-glosses-150.js";
import { spanishGlosses300 } from "./spanish-glosses-300.js";
import { spanishGlosses450 } from "./spanish-glosses-450.js";
import { spanishGlosses600 } from "./spanish-glosses-600.js";
import { spanishGlosses750 } from "./spanish-glosses-750.js";
import { spanishCanonicalGlosses } from "./spanish-glosses-canonical.js";

const proper = new Set(["alicia","alcázar","américa","antonio","bermejo","callao","cid","dios","españa","flandes","francisco","fruela","honorato","ildefonso","jordán","lima","luis","madrid","margarita","pareja","raimundo","rosa","san","santa","santiago"]);
const legacyGlosses: Readonly<Record<string,string>> = { ...spanishGlosses0, ...spanishGlosses150, ...spanishGlosses300, ...spanishGlosses450, ...spanishGlosses600, ...spanishGlosses750 };
const glosses: Readonly<Record<string,string>> = { ...legacyGlosses, ...spanishCanonicalGlosses };
const legacyOrder = Object.keys(legacyGlosses).filter(form => !proper.has(form)).sort((a,b)=>a.localeCompare(b,"es"));
const legacyOrdinal = new Map(legacyOrder.map((form,index)=>[form,index+1]));
const tokenRe = /[\p{L}\p{M}]+/gu;
const normalize = (value:string) => value.toLocaleLowerCase("es");
const slug = (value:string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");

/** Historical reproducibility fixture. Generic lexical/quiz templates are not
 * editorially approved. Current production authoring lives in the v2 source
 * chunks; the independent release gate rejects these templates. */
export function createSpanishLearningBundle(): ContentBundle {
  const forms=[...new Set(spanishSourceAcquisition.units.flatMap(unit => [...unit.french.matchAll(tokenRe)].map(match => normalize(match[0]))).filter(form => !proper.has(form)))].sort((a,b)=>a.localeCompare(b,"es"));
  const additions=forms.filter(form=>!legacyOrdinal.has(form)).sort((a,b)=>a.localeCompare(b,"es"));
  const addedOrdinal=new Map(additions.map((form,index)=>[form,legacyOrder.length+index+1]));
  const records=forms.map((form) => {
    const ordinal=legacyOrdinal.get(form) ?? addedOrdinal.get(form)!;
    const key=`${String(ordinal).padStart(4,"0")}_${slug(form)}`;
    const gloss=glosses[form];
    if(!gloss) throw new Error(`Missing reviewed Spanish gloss for ${form}`);
    return { form, gloss, lemmaId:`lem_es_${key}`, senseId:`sns_es_${key}`, surfaceFormId:`srf_es_${key}` };
  });
  const byForm=new Map(records.map(record=>[record.form,record]));
  const lemmas=records.map(record=>({id:record.lemmaId,headword:record.form,partOfSpeech:"Spanish vocabulary"}));
  const senses=records.map(record=>({id:record.senseId,lemmaId:record.lemmaId,gloss:record.gloss,definition:record.gloss}));
  const surfaceForms=records.map(record=>({id:record.surfaceFormId,lemmaId:record.lemmaId,form:record.form,normalized:record.form}));
  const occurrences:ContentBundle["occurrences"]=[], exclusions:ContentBundle["exclusions"]=[];
  for(const unit of spanishSourceAcquisition.units){
    let ordinal=0;
    for(const match of unit.french.matchAll(tokenRe)){
      const text=match[0], start=match.index, end=start+text.length, form=normalize(text); ordinal++;
      if(proper.has(form)){ exclusions.push({id:`exc_es_${unit.id.slice(4)}_${ordinal}`,workId:unit.workId,unitId:unit.id,start,end,text,reason:"proper_noun"}); continue; }
      const record=byForm.get(form)!;
      occurrences.push({id:`occ_es_${unit.id.slice(4)}_${ordinal}`,workId:unit.workId,unitId:unit.id,surfaceFormId:record.surfaceFormId,senseId:record.senseId,start,end});
    }
  }
  const quizzes=records.flatMap((record,index)=>{
    const alternatives=[1,2,3,4,5].map(offset=>records[(index+offset)%records.length]).filter((item): item is (typeof records)[number] => item !== undefined);
    const otherGlosses=[...new Set(alternatives.map(x=>x.gloss).filter(x=>x!==record.gloss))].slice(0,3);
    while(otherGlosses.length<3) otherGlosses.push(`Not “${record.gloss}” (${otherGlosses.length+1})`);
    const otherForms=[...new Set(alternatives.map(x=>x.form).filter(x=>x!==record.form))].slice(0,3);
    while(otherForms.length<3) otherForms.push(`opción${otherForms.length+1}`);
    const key=record.surfaceFormId.slice(4);
    return [
      {id:`qiz_${key}_early`,surfaceFormId:record.surfaceFormId,senseId:record.senseId,band:"levels_1_3",format:"meaning_choice",contextFrench:`La forma estudiada es «${record.form}».`,targetText:record.form,prompt:"Meaning",choicesEnglish:[record.gloss,...otherGlosses],correctAnswer:record.gloss},
      {id:`qiz_${key}_intermediate`,surfaceFormId:record.surfaceFormId,senseId:record.senseId,band:"levels_4_5",format:"surface_completion",contextFrench:"Completa con la forma exacta: ___.",choicesFrench:[record.form,...otherForms],correctAnswer:record.form},
      {id:`qiz_${key}_advanced`,surfaceFormId:record.surfaceFormId,senseId:record.senseId,band:"levels_6_8",format:"target_identification",contextFrench:`Compara estas formas: ${[record.form,...otherForms].join(", ")}.`,promptFrench:`¿Qué forma significa «${record.gloss}»?`,choicesFrench:[record.form,...otherForms],correctAnswer:record.form},
    ] as ContentBundle["quizItems"];
  });
  return {
    ...spanishSourceAcquisition,
    works:spanishSourceAcquisition.works.map(work=>({...work,publicationState:"published" as const})),
    lemmas,senses,surfaceForms,occurrences,exclusions,quizItems:quizzes,
    readiness:spanishSourceAcquisition.works.map(work=>({workId:work.id,thoughtUnitsComplete:true,occurrencesReviewed:true,unresolvedLearnerTokens:[]})),
  };
}
