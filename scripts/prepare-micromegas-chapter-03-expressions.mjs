import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const dir=resolve('content/sources/wrk_voltaire_micromegas'),coverage=JSON.parse(readFileSync(resolve(dir,'chapter-03-coverage.json'))),plan=JSON.parse(readFileSync(resolve(dir,'unit-plan.json')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const phrases=[
 ['en_larmes','en larmes','61:203:212','compositional_state_words','Her crying is taught by the tear noun and the ordinary in/state preposition; no duplicate expression mastery.'],
 ['se_rendre','me rendre','63:101:110','reflexive_yield_word_draft','Her surrender to the lover requires a new reflexive verb meaning, with me as ordinary reflexive marker.'],
 ['a_peine','à peine','63:123:130','link_existing_chapter_two_expression','The barely/no sooner temporal meaning matches the three reviewed chapter II à peine questions. The entire expression shares one future identity across chapters.'],
 ['d_abord','d’abord','67:53:60','reuse_published_locution_identity','The d’ token already has a published first/at first identity; abord is a phrase component and needs no duplicate mastery.'],
 ['de_lune_en_lune','de lune en lune','67:195:209','compositional_repeated_travel','The travelers go from moon to moon; the repeated en corresponds to the existing progressive comparison preposition and lune receives the satellite sense.'],
 ['sous_presse','sous presse','70:138:149','compositional_printing_sense','The manuscript would be printed if inquisitors permitted it. A new contextual presse sense separates printing from the published news-media questions.'],
 ['par_analogie','par analogie','75:150:162','compositional_method','Reasoning by analogy uses the usual method preposition and an authored analogy noun.'],
 ['quoi_qu_il_en_soit','Quoi qu’il en soit','77:0:19','new_expression_three_question_bands','The concession means whatever the case, and all five source tokens are phrase components. This prevents teaching the old interrogative what or emphatic assent as the expression meaning.'],
 ['de_quoi_coucher','de quoi coucher','77:92:107','compositional_available_means','They fear a lack of any place or means to lie down; de and quoi frame an available possibility, while coucher retains the lying-down sense.'],
 ['passer_son_chemin','passèrent leur chemin','77:116:142','compositional_onward_journey','They continue their journey past an inadequate inn; passer and chemin have contextual drafts and leur is possessive.'],
 ['de_peur_de','de peur de','81:11:21','compositional_motive','Fear motivates their landing; the ordinary prepositions and the fear noun supply the meaning.'],
 ['a_terre','à terre','82:122:129','compositional_landing','Landing on dry land takes a new terre meaning, separate from the published soil questions and the planet meaning in chapter I.'],
 ['aurore_boreale','aurore boréale','82:58:72','compositional_celestial_terms','The northern aurora is understood through authored aurora and northern adjective meanings.'],
 ['nouveau_style','nouveau style','82:219:232','compositional_calendar_senses','The dating phrase denotes the Gregorian calendar; the separately drafted adjective and calendar-style noun carry this historical meaning.'],
];
const items=phrases.map(([key,surface,loc,disposition,decision])=>{
 const [unit,start]=loc.split(':').map(Number),end=start+surface.length,text=plan.units[unit-1].text.slice(start,end);
 if(text.toLocaleLowerCase('fr')!==surface.toLocaleLowerCase('fr'))throw Error(`Expression span ${key}: ${text}`);
 const item={key,surface,disposition,decision,occurrences:[{chapter:3,unit,start,end,text}]};
 if(key==='a_peine'){
  const old=JSON.parse(readFileSync(resolve(dir,'chapter-02-expressions.json'))).items.find(i=>i.key==='a_peine');
  item.earlierExpressionSha256=hash(readFileSync(resolve(dir,'chapter-02-expressions.json')));
  item.earlierQuestionSha256=hash(JSON.stringify(old.questions));
  item.earlierMeaning=old.meaning;
 }
 if(key==='quoi_qu_il_en_soit'){
  item.meaning='be that as it may; whatever happens';
  item.questions=[
   {band:'1-3',context:'Quoi qu’il en soit, ils poursuivront leur voyage.',question:'Meaning',answer:'be that as it may',choices:['be that as it may','what is it called','only if that happens','as soon as it happens']},
   {band:'4-5',context:'Nous ignorons la réponse; ___, il faut décider.',question:'Complétez la phrase.',answer:'Quoi qu’il en soit',choices:['Quoi qu’il en soit','À peine','D’abord','Sans cesse']},
   {band:'6-8',context:'Quoi qu’il en soit introduit une concession: la décision reste la même. À peine place deux événements presque ensemble, d’abord nomme le début et sans cesse marque la continuité.',question:'Quelle expression veut dire que la conclusion tient quelle que soit la situation ?',answer:'Quoi qu’il en soit',choices:['Quoi qu’il en soit','À peine','d’abord','sans cesse']}
  ];
 }
 return item;
});
const components=[
 ['63:123','a_peine','À peine shares its existing temporal expression identity.'],['63:125','a_peine','Peine is not the effort or sorrow noun in this temporal expression.'],
 ['67:55','d_abord','Abord is part of the published d’abord locution carried on d’.'],
 ['77:0','quoi_qu_il_en_soit','Quoi here belongs to the concessive expression, not a direct question.'],
 ['77:5','quoi_qu_il_en_soit','Qu’ joins the concessive expression.'],
 ['77:8','quoi_qu_il_en_soit','Il is contained in the fixed concessive expression.'],
 ['77:11','quoi_qu_il_en_soit','En is contained in the fixed concessive expression.'],
 ['77:14','quoi_qu_il_en_soit','Soit is contained in the fixed concessive expression.']
].map(([loc,expressionKey,reason])=>{
 const [unit,start]=loc.split(':').map(Number),t=coverage.tokens.find(t=>t.unit===unit&&t.start===start);
 if(!t||t.draft||t.exclusion)throw Error(`Phrase component missing ${loc}`);
 return {expressionKey,reason,occurrence:{chapter:3,unit,start,end:t.end,text:t.text}};
});
const base={version:1,workId:coverage.workId,chapter:3,sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256};
writeFileSync(resolve(dir,'chapter-03-expressions.json'),JSON.stringify({...base,status:'offline_source_bound_expression_triage_unpublished',items},null,2)+'\n');
writeFileSync(resolve(dir,'chapter-03-phrase-components.json'),JSON.stringify({...base,status:'offline_phrase_component_review_unpublished',items:components},null,2)+'\n');
console.log(JSON.stringify({expressions:items.length,phraseComponents:components.length,newQuestions:3,linkedEarlierQuestions:3}));
