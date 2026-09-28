import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const plan=JSON.parse(readFileSync(resolve(root,'unit-plan.json')));
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-02-coverage.json')));
const span=(unit,text)=>{
 const line=plan.units[unit-1].text,start=line.indexOf(text);
 if(start<0||line.indexOf(text,start+1)>=0)throw Error(`Nonunique phrase ${unit} ${text}`);
 return {chapter:2,unit,start,end:start+text.length,text};
};
const decisions=[
 ['laissez_la',30,'laissez là','compositional_idiomatic_words_no_extra_expression','The rejection of the garden image is taught through the new laissez and là contextual drafts. Do not create another expression mastery identity.'],
 ['qu_ai_a_faire_de',30,'qu’ai-je à faire de','compositional_rhetorical_question_no_extra_expression','The question rejects relevance. Qu’ai has an interrogative draft, faire retains its published do sense, and the two prepositions stay grammatical.'],
 ['d_abord',32,'d’abord','reuse_published_locution_identity_no_extra_expression','The published d’ vocabulary identity and its three bands already teach first/at first. Abord is a component with no additional first-use mastery.'],
 ['au_dela',33,'au delà','compositional_existing_workwide_draft','The printed two-word spelling is preserved. The chapter I delà workwide draft already indexes this occurrence and au retains its contraction identity.'],
 ['pres_de',34,'près de','compositional_new_quantity_sense','Near a thousand is quantity approximation, covered by the distinct près draft and ordinary de. Do not duplicate as expression mastery.'],
 ['sans_cesse',34,'sans cesse','reuse_published_compositional_identities','The two published vocabulary identities teach without and pause; the cesse questions themselves use sans cesse. No new expression mastery.'],
 ['peu_de_chose',34,'peu de chose','compositional_understatement_no_extra_expression','The speakers call themselves of little consequence; little + of + general thing retains the existing identities, while the phrase note explains the irony.'],
 ['pour_moi',43,'Pour moi','new_viewpoint_word_sense_no_extra_expression','Pour introduces personal standpoint and has its own new vocabulary draft; do not duplicate mastery for this phrase.'],
 ['a_peine',42,'À peine','new_expression_three_question_bands','At the moment learning begins, death arrives: the temporal à peine ... que construction means no sooner/hardly ... when. Treat à and peine as phrase components, not the unrelated at/to preposition or effort noun here.'],
 ['bon_sens',47,'bon sens','reuse_published_judgment_identity','The existing bon and sound-judgment sens identities cover good sense without extra phrase mastery.'],
 ['prendre_son_parti',47,'prendre leur parti','reuse_published_parti_identity','The published parti identity and all three questions already teach accepting one’s lot. Prendre is a component here, not the unrelated catch or take-charge sense.'],
 ['par_exemple',49,'Par exemple','new_illustrative_word_sense_no_extra_expression','The new exemple noun draft teaches an illustrative case; par retains its broad by/through preposition. No duplicate expression mastery.'],
 ['tirer_sur_le_rouge',55,'tire sur le rouge','new_color_tendency_word_senses_no_extra_expression','Tire and sur each have new color-tendency drafts; no separate phrase mastery is added.'],
 ['l_un_a_l_autre',60,'l’un à l’autre','compositional_reciprocal_pronouns','One traveler shares with the other; the existing un pronoun, autre pronoun and à preposition cover the components.']
];
const items=decisions.map(([key,unit,surface,disposition,decision])=>({key,surface,disposition,occurrences:[span(unit,surface)],decision}));
const aPeine=items.find(item=>item.key==='a_peine');
aPeine.meaning='no sooner; hardly had ... when';
aPeine.questions=[
 {band:'1-3',context:'À peine avait-elle ouvert le livre que la pluie commença.',question:'Meaning',answer:'no sooner had she opened it than',choices:['no sooner had she opened it than','long after she opened it','only if she opened it','never after she opened it']},
 {band:'4-5',context:'___ avait-elle commencé à lire que la lumière s’éteignit.',question:'Complétez la phrase.',answer:'À peine',choices:['À peine','Longtemps après','Plus tard','Jamais']},
 {band:'6-8',context:'À peine avait-il commencé à parler que la cloche sonna. Longtemps après, les autres partirent ; plus tard, la salle fut vide, et jamais il ne reprit son discours.',question:'Quelle expression indique que la cloche sonna presque au début de son discours ?',answer:'À peine',choices:['À peine','Longtemps après','plus tard','jamais']}
];
const output={version:1,workId:coverage.workId,chapter:2,status:'offline_expression_triage_and_one_question_draft_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Fourteen source-bound chapter II phrase decisions. One expression has three authored offline question bands; existing word identities and new contextual word drafts cover the others without duplicate expression mastery.',items};
writeFileSync(resolve(root,'chapter-02-expressions.json'),JSON.stringify(output,null,2)+'\n');
const components=[
 ['abord',32,184,'d_abord','The existing d’ first/at first locution identity covers the phrase; avoid a second standalone first identity.'],
 ['à',42,0,'a_peine','The à peine expression covers the temporal no-sooner meaning, rather than the generic to/at preposition.'],
 ['peine',42,2,'a_peine','The temporal à peine expression covers this occurrence; the noun effort or sorrow would teach the wrong sense.'],
 ['prendre',47,52,'prendre_son_parti','The published parti resolution identity explicitly teaches the whole idiom; this verb is not independently assessed as catch/take-charge.']
].map(([form,unit,start,expressionKey,reason])=>{
 const token=coverage.tokens.find(t=>t.unit===unit&&t.start===start&&t.form===form);
 if(!token||token.disposition==='drafted_pending_signoff'||token.disposition==='published_identity_reuse_context_reviewed')throw Error(`Invalid phrase component ${form} ${unit}:${start}`);
 return {form,expressionKey,reason,occurrence:{chapter:2,unit,start,end:token.end,text:token.text},status:'covered_by_expression_or_published_phrase_identity_no_independent_vocabulary_mastery_pending_bundle_signoff'};
});
writeFileSync(resolve(root,'chapter-02-phrase-components.json'),JSON.stringify({version:1,workId:coverage.workId,chapter:2,status:'offline_source_bound_expression_component_decisions_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Four remaining source tokens are phrase components with no duplicate word mastery. À peine remains an unpublished expression draft; d’abord and prendre son parti reuse existing published vocabulary identities.',items:components},null,2)+'\n');
console.log(JSON.stringify({phrases:items.length,newExpressionQuestionBands:3,coveredTokenComponents:components.length}));
