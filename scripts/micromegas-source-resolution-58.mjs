import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {prepareQuiz,quizEditorialIssues} from '../dist/publication/quiz-authoring.js';
import {validateExpressionCatalog} from '../dist/domain/expression-content.js';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`;
const coord=o=>`${o.unit}:${o.start}:${o.end}`;
const partitiveSpans=[
 {unit:101,start:69,end:74,text:'de la',surface:'de_la',source:'https://www.dictionnaire-academie.fr/article/A9P0791',early:'Ne vous ai-je pas dit que dans mes voyages j’avais toujours remarqué de la variété ?',meaning:'some variety; an unspecified amount of variety',middle:'Dans mes voyages, j’ai toujours remarqué ___ variété.',choices:['de la','une','cette','chaque'],upper:'Dans mes voyages, il a remarqué de la variété. Une introduit une variété comptée comme une, cette désigne une variété déterminée et chaque distribue le nom.'},
 {unit:114,start:88,end:93,text:'de la',surface:'de_la',source:'https://www.dictionnaire-academie.fr/article/A9P0791',early:'Ils eurent bien de la peine à se sauver.',meaning:'some trouble; an unspecified amount of trouble',middle:'Ils ont éprouvé ___ peine à se sauver.',choices:['de la','une','cette','chaque'],upper:'Ils ont éprouvé de la peine à se sauver. Une présente la peine comme une occurrence comptée, cette la désigne précisément et chaque exprime une distribution.'},
 {unit:185,start:116,end:121,text:'de l’',surface:'de_l_elide',source:'https://www.dictionnaire-academie.fr/article/A9P0791',early:'Vous ne tuez personne pour de l’argent.',meaning:'some money; an unspecified amount of money',middle:'Il ne ferait rien pour ___ argent.',choices:['de l’','cet','aucun','un peu d’'],upper:'Il ne ferait rien pour de l’argent. Cet désigne une quantité déterminée, aucun nie toute quantité et un peu d’ en annonce une petite quantité.'},
 {unit:199,start:431,end:436,text:'de la',surface:'de_la',source:'https://www.dictionnaire-academie.fr/article/A9P0791',early:'Elle aurait de la barbe au menton.',meaning:'some beard; an unspecified amount of beard',middle:'Elle aurait ___ barbe au menton.',choices:['de la','une','cette','aucune'],upper:'Elle aurait de la barbe au menton. Une présente la barbe comme une occurrence comptée, cette la désigne précisément et aucune nie sa présence.'}
];

export function composeMicromegasResolution58(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`));
 const graph=read('whole-work-identity-dependencies-43.json');
 const base=read('whole-work-import-composition-42.json');
 const priorWords=read('whole-work-source-words-57.json');
 const priorExpressionPackage=read('whole-work-expression-package-56.json');
 const units=read('unit-plan.json').units;
 const pub=loadPublication();
 const priorExpressions=['whole-work-resolved-expressions-48.json','whole-work-construction-expressions-50.json','whole-work-family-constructions-52.json','whole-work-next-constructions-53.json','whole-work-expression-supplement-54.json'].map(read);
 const identityId=id('exi','article-partitif-quantite-indeterminee');
 const identity={id:identityId,headword:'article partitif de la / de l’',gloss:'some; an unspecified amount of',definition:'Déterminant qui introduit un nom désignant une matière ou une notion non dénombrable, en présentant une quantité indéterminée.'};
 const knownIds=[...pub.expressionCatalog.identities,...priorExpressions.flatMap(p=>p.newIdentities.map(x=>x.record))].map(x=>x.id);
 if(knownIds.includes(identityId))throw Error('Partitive identity already exists; inspect before reuse.');
 const surfaceIds={de_la:id('exs','article-partitif:de-la'),de_l_elide:id('exs','article-partitif:de-l-elide')};
 const occurrences=[],components=[],banks=[],questions=[];
 for(const s of partitiveSpans){
  if(units[s.unit-1].text.slice(s.start,s.end)!==s.text)throw Error(`Source span changed: ${s.unit}:${s.start}`);
  const surfaceId=surfaceIds[s.surface];
  const occurrence={id:id('exo',`${s.unit}:${s.start}:${s.end}:${identityId}`),identityId,surfaceId,workId:graph.workId,unitId:`unt_micromegas_${String(s.unit).padStart(3,'0')}`,start:s.start,end:s.end,text:s.text};
  occurrences.push(occurrence);
  const tokens=base.tokens.filter(t=>t.unit===s.unit&&t.start>=s.start&&t.end<=s.end);
  if(tokens.length!==2||tokens.map(t=>t.text).join(' ')!==s.text)throw Error(`Complete token ownership failed at ${s.unit}`);
  for(const t of tokens)components.push({unit:t.unit,start:t.start,end:t.end,text:t.text,form:t.form,baseOwner:t.owner,expressionOccurrenceId:occurrence.id,expressionId:identityId,surfaceId,identity:`${surfaceId}:${identityId}`,masteryAction:'fresh_expression_identity_on_exact_unit_view',componentAction:'suppress_only_this_candidate_source_route_and_preserve_all_legacy_progress'});
  if(banks.some(b=>b.surfaceId===surfaceId))continue;
  const qs=[
   {band:'1-3',context:s.early,answer:'some; an unspecified amount of',choices:['some; an unspecified amount of','none','all','one']},
   {band:'4-5',context:s.middle,answer:s.text,choices:s.choices},
   {band:'6-8',context:s.upper,answer:s.text,choices:s.choices,question:'Quel déterminant exprime ici une quantité indéterminée ?'}
  ];
  const prepared=qs.map(q=>{const common={id:id('exq',`${surfaceId}:${q.band}`),expressionId:identityId,surfaceId,contextFrench:q.context,correctAnswer:q.answer,band:{'1-3':'levels_1_3','4-5':'levels_4_5','6-8':'levels_6_8'}[q.band]};return q.band==='1-3'?{...common,format:'meaning_choice',targetText:s.text,choicesEnglish:q.choices}:{...common,format:q.band==='4-5'?'surface_completion':'target_identification',...(q.band==='6-8'?{promptFrench:q.question}:{}),choicesFrench:q.choices};});
  const checked=prepared.map(q=>prepareQuiz(q,'fr'));
  if(checked.some(q=>quizEditorialIssues(q).length))throw Error(`Quiz validation failed at ${s.unit}`);
  questions.push(...prepared);
  banks.push({identity:`${surfaceId}:${identityId}`,expressionId:identityId,surfaceId,sourceSpan:{unit:s.unit,start:s.start,end:s.end,text:s.text},source:s.source,sourceQuestions:qs,legacyPreparedQuizzes:prepared,questions:checked,masteryAction:'fresh_expression_identity_on_exact_unit_view',status:'offline_stored_expression_bank_unapplied'});
 }
 const catalog={identities:[...pub.expressionCatalog.identities,...priorExpressions.flatMap(p=>p.newIdentities.map(x=>x.record)),...priorExpressionPackage.newIdentities.map(x=>x.record),identity],occurrences:[...pub.expressionCatalog.occurrences,...priorExpressions.flatMap(p=>p.occurrences),...priorExpressionPackage.occurrences,...occurrences],preparedQuizzes:[...pub.expressionCatalog.preparedQuizzes,...priorExpressions.flatMap(p=>p.banks.flatMap(b=>b.legacyPreparedQuizzes)),...priorExpressionPackage.banks.flatMap(b=>b.legacyPreparedQuizzes),...questions]};
 const extra=new Map(catalog.occurrences.map(o=>[o.unitId,{id:o.unitId,workId:graph.workId,french:units[Number(o.unitId.split('_').at(-1))-1].text}]));
 const diagnostics=validateExpressionCatalog({...pub.bundle,units:[...pub.bundle.units,...extra.values()]},catalog);
 if(diagnostics.length)throw Error(`Combined expression catalog invalid: ${JSON.stringify(diagnostics.slice(0,5))}`);
 const partitiveCoords=new Set(partitiveSpans.map(coord));
 const quantity={unit:100,start:68,end:70,text:'de',fromOwner:{kind:'draft_bank',file:'chapter-04-batch-16.json',key:'de_partitive'},toOwner:{kind:'published_identity',identity:'srf_de:sns_de_primary'},reason:'In un peu de confusion, de is the preposition required after the quantity expression peu; it does not itself mean some. Preserve the existing published preposition identity and its mastery.'};
 const prior=new Set(priorWords.remainingDirectDraftOccurrences.map(coord));
 if(!prior.has(coord(quantity))||partitiveSpans.some(s=>!prior.has(coord({unit:s.unit,start:s.start,end:s.start+2}))))throw Error('Held source uses changed.');
 const removed=new Set([...partitiveSpans.map(s=>`${s.unit}:${s.start}:${s.start+2}`),coord(quantity)]);
 const remaining=priorWords.remainingDirectDraftOccurrences.filter(o=>!removed.has(coord(o)));
 if(remaining.length!==676)throw Error(`Expected 676 remaining direct source uses; got ${remaining.length}`);
 return{version:1,status:'offline_micromegas_mixed_de_resolution_unapplied',publicationBaseline:graph.publicationBaseline,evidenceFiles:['whole-work-expression-package-56.json','whole-work-source-words-57.json','whole-work-source-bank-refinements-57.json','whole-work-import-composition-42.json','unit-plan.json'],identity,occurrences,components,banks,quantityPrepositionReassignment:quantity,sourceUsePartition:{reassignedToCompletePartitiveExpression:partitiveSpans.map(s=>({unit:s.unit,start:s.start,end:s.start+2,text:'de'})),reassignedToExistingPrepositionIdentity:quantity,remainingDirectDraftSourceUses:remaining},summary:{newExpressionMeanings:1,newExpressionSurfaceKeys:2,expressionSourceSpans:4,ownedLexicalComponents:components.length,reassignedDraftWordUses:5,suppressedExistingWordUses:4,storedPreparedQuestionBands:questions.length,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:530,pendingOriginalPhraseSpans:127},nextAction:{family:'Chapter IV word identities',form:'dispute',unit:103,start:3,end:10,reason:'The five-use de group is resolved: four complete partitive determiners are owned as article expressions; un peu de remains on the published preposition identity. Resume source-ordered review at dispute, unit103 offsets3–10. Keep all candidates offline and unapplied.'}};
}

if(import.meta.url===`file://${process.argv[1]}`){
 const folder=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
 const result=composeMicromegasResolution58(folder);
 for(const f of result.evidenceFiles)result.evidenceFiles[result.evidenceFiles.indexOf(f)]={file:f,sha256:sha(readFileSync(`${folder}/${f}`))};
 writeFileSync(`${folder}/whole-work-mixed-de-resolution-58.json`,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({status:result.status,summary:result.summary,nextAction:result.nextAction},null,2));
}
