// Apply an explicitly authored, exact-revision quiz review. This does not perform language review.
import{readFileSync,existsSync}from'node:fs';import{resolve,dirname}from'node:path';
import{loadPublication,publicationRoot,validatePublication}from'../dist/publication/repository.js';
import{editorialSubjects}from'../dist/publication/quality-audit.js';
import{reviewRevision,approveReview,approvalIssues}from'../dist/publication/editorial.js';
import{legacyQuiz,quizEditorialIssues,targetCandidates,normalizeText}from'../dist/publication/quiz-authoring.js';
import{fromNeutral,toNeutral}from'../dist/publication/format.js';
import{sharedSourceFiles,reconcileQuizzes,adoptSourceFiles}from'../dist/publication/source-store.js';
const plan=JSON.parse(readFileSync(process.argv[2],'utf8')),file=`editorial-batches/${plan.id}.json`;
if(!['fr','es'].includes(plan.language)||existsSync(resolve(publicationRoot,file)))throw Error('Invalid language or already applied');
const snapshot=JSON.parse(readFileSync(resolve(dirname(process.argv[2]),plan.snapshot),'utf8'));
const p=loadPublication(),subjects=new Map(editorialSubjects(p).filter(s=>s.kind==='quiz'&&s.language===plan.language).map(s=>[s.id,s]));
const source=p.sharedSources[plan.language],content=fromNeutral(source.legacy.content),expressions=fromNeutral(source.legacy.preparedExpressionQuizzes),replacements=new Map(),reviewed=[],changes=[],identities=new Set();
for(const row of plan.entries){const input=snapshot.find(s=>s.id===row.id),s=subjects.get(row.id);if(!input||!s||!row.reason?.trim()||input.baseRevision!==reviewRevision(s.value))throw Error(`Missing evidence or stale input ${row.id}`);if(replacements.has(row.id))throw Error('Duplicate quiz');
const subject=s.value.quiz.subject;identities.add(subject.kind==='vocabulary'?subject.surfaceFormId+':'+subject.senseId:subject.expressionId);
const before=legacyQuiz(s.value.quiz),after={...before,...row.patch};if(after.id!==before.id||after.band!==before.band||after.surfaceFormId!==before.surfaceFormId||after.senseId!==before.senseId||after.expressionId!==before.expressionId)throw Error('Quiz identity changes forbidden');
replacements.set(row.id,after);reviewed.push({id:row.id,reason:row.reason,beforeRevision:input.baseRevision});if(reviewRevision(before)!==reviewRevision(after))changes.push({kind:subject.kind==='vocabulary'?'quizItems':'expressionQuizzes',id:row.id,before,after,reason:row.reason});}
if(!identities.size||identities.size>100)throw Error('Checkpoint required after at most 100 identities');
const legacy={...source.legacy,content:toNeutral({...content,quizItems:content.quizItems.map(q=>replacements.get(q.id)??q)}),preparedExpressionQuizzes:toNeutral(expressions.map(q=>replacements.get(q.id)??q))};
const quizzes=reconcileQuizzes(source,legacy),reviews=new Map(source.reviews.map(r=>[r.id,r])),date=new Date().toISOString();
for(const row of reviewed){const quiz=quizzes.find(q=>q.id===row.id);if(!quiz||quizEditorialIssues(quiz).length)throw Error(`Invalid quiz ${row.id}`);if(quiz.band==='levels_6_8'&&quiz.choices.some(c=>!targetCandidates(quiz.context,c.text,plan.language).length))throw Error(`Choice missing from passage ${row.id}`);const target=subjects.get(row.id).value.target;reviews.set('quiz:'+row.id,approveReview(plan.language,'quiz',row.id,{quiz,target},'Codex offline contextual review',date,row.reason));}
for(const key of identities){const qs=quizzes.filter(q=>(q.subject.kind==='vocabulary'?q.subject.surfaceFormId+':'+q.subject.senseId:q.subject.expressionId)===key);if(qs.length!==3||new Set(qs.map(q=>normalizeText(q.context,plan.language))).size!==3)throw Error(`Three distinct bands required ${key}`);}
const files=sharedSourceFiles({legacy,quizzes,reviews:[...reviews.values()]});files.set(file,{version:1,id:plan.id,masteryIdsChanged:false,reviewed,changes});
const recovery=adoptSourceFiles(publicationRoot,files,root=>{const saved=loadPublication(root);validatePublication(saved.bundle,saved.expressionCatalog,saved.registry);const now=new Map(editorialSubjects(saved).filter(s=>s.kind==='quiz').map(s=>[s.id,s]));for(const r of reviewed){const s=now.get(r.id);if(approvalIssues(saved.reviews.find(x=>x.id==='quiz:'+r.id),s.value,'quiz',r.id,plan.language).length)throw Error('Approval mismatch');}for(const kind of Object.keys(p.bundle).filter(k=>k!=='quizItems'))if(reviewRevision(p.bundle[kind])!==reviewRevision(saved.bundle[kind]))throw Error(`Unexpected content edit ${kind}`);if(reviewRevision(p.expressionCatalog.identities)!==reviewRevision(saved.expressionCatalog.identities)||reviewRevision(p.expressionCatalog.occurrences)!==reviewRevision(saved.expressionCatalog.occurrences))throw Error('Expression identity edit');});
console.log(JSON.stringify({batch:plan.id,identities:identities.size,reviewedQuestions:reviewed.length,changedQuestions:changes.length,recovery}));
