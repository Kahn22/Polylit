import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {editorialView74} from './micromegas-import-review-74.mjs';
import {editorialSubjects,auditEditorialQuality} from '../dist/publication/quality-audit.js';
import {approveReview,approvalIssues,reviewRevision} from '../dist/publication/editorial.js';
import {legacyQuiz,targetCandidates} from '../dist/publication/quiz-authoring.js';
import {validateContentBundle} from '../dist/domain/validate.js';
import {validateExpressionCatalog} from '../dist/domain/expression-content.js';
export const hash77=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const ensure=(x,m)=>{if(!x)throw Error(`Final77: ${m}`)};
export const finalExampleDecisions77=[
 {earlyIndex:201,form:'article',context:'Sur cet article de notre discussion, nos avis diffèrent : nous ne donnons pas la même explication.',reason:'The price clue could suggest an item for sale, one of the distractors. Specify the point under discussion and remove the commercial clue.'},
 {earlyIndex:297,form:'occupez',context:'Vous vous occupez de réparer cette horloge depuis ce matin.',reason:'Use the natural pronominal construction s’occuper de with an infinitive. The former à quelle activité wording was awkward.'}
];
export function finalProjection77(projection,repairs73){
 const result=structuredClone(projection),map=new Map(result.preparedQuizzes.map(q=>[q.id,q])),early=repairs73.filter(r=>r.after.band==='levels_1_3'),repairs=[];
 for(const spec of finalExampleDecisions77){const before=map.get(early[spec.earlyIndex].id);ensure(before.targetText===spec.form,'exact reviewed early example');const ranges=targetCandidates(spec.context,spec.form,'fr');ensure(ranges.length===1,'unique target');const after={...before,context:spec.context,targetRange:ranges[0]};map.set(after.id,after);repairs.push({...spec,id:after.id,before,after,beforeSha256:hash77(before),afterSha256:hash77(after)});}
 result.preparedQuizzes=[...map.values()];result.bundle.quizItems=result.bundle.quizItems.map(q=>legacyQuiz(map.get(q.id)));return{projection:result,repairs};
}
export function applyFinalAcceptance77(p,baseProjection,offlineReviews,manifest,repairs73){
 const{projection,repairs}=finalProjection77(baseProjection,repairs73),view=editorialView74(p,projection);view.reviews=offlineReviews;
 const subjects=new Map(editorialSubjects(view).map(s=>[`${s.kind}:${s.id}`,s])),issues=auditEditorialQuality(view),blocked=new Set(issues.map(i=>`${i.kind}:${i.id}`)),reviews=new Map(offlineReviews.map(r=>[r.id,r]));
 ensure(manifest.decisions.length===blocked.size,'complete exact acceptance scope');
 const seen=new Set();for(const d of manifest.decisions){const key=`${d.kind}:${d.id}`,s=subjects.get(key);ensure(blocked.has(key)&&!seen.has(key),'unique outstanding subject');seen.add(key);ensure(d.subjectRevision===reviewRevision(s.value)&&d.subjectSha256===hash77(s.value),'exact reviewed revision');ensure(d.evidence.length&&d.rationale.trim(),'semantic evidence required');const record=approveReview(s.language,s.kind,s.id,s.value,manifest.reviewer,manifest.reviewedAt,d.rationale);ensure(!approvalIssues(record,s.value,s.kind,s.id,s.language).length,'valid approval');reviews.set(key,record);}
 view.reviews=[...reviews.values()];ensure(!auditEditorialQuality(view).length,'final editorial gate');const domain=validateContentBundle(projection.bundle);ensure(domain.ok,JSON.stringify(domain.diagnostics));ensure(!validateExpressionCatalog(projection.bundle,projection.expressionCatalog).length,'expression validation');
 return {projection,offlineReviews:view.reviews,repairs,summary:{acceptedQuiz:manifest.decisions.filter(d=>d.kind==='quiz').length,acceptedVocabulary:manifest.decisions.filter(d=>d.kind==='vocabulary').length,acceptedExpression:manifest.decisions.filter(d=>d.kind==='expression').length,independentExamplesRead:537,additionalMetadataAffectedQuestionsRead:73,finalExampleCorrections:repairs.length,remainingEditorialIssues:0}};
}
