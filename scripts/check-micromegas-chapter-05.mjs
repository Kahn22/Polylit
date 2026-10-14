import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {loadPublication} from './micromegas-publication-baseline.mjs';

export async function checkChapterFive(folder, unitPlan) {
 const bytes = name => readFile(resolve(folder, name));
 const read = async name => JSON.parse(await bytes(name));
 const sha = value => createHash('sha256').update(value).digest('hex');
 const hash = value => sha(JSON.stringify(value));
 const ensure = (condition, message) => { if (!condition) throw Error(`Chapter V: ${message}`); };
 const key = o => `${o.unit}:${o.start}:${o.end}`;
 const [coverage, inventory, plan, packet, qa, expressions, expressionQa, carry] = await Promise.all([
  'chapter-05-coverage.json','chapter-05-inventory.json','chapter-05-identity-plan.json','chapter-05-identity-packet.json',
  'chapter-05-qa.json','chapter-05-expression-review.json','chapter-05-expression-qa.json','chapter-05-earlier-draft-carryover.json'
 ].map(read));
 ensure(coverage.tokens.length === 612 && inventory.tokens.length === 612, 'source count');
 for (const [name, claimed] of Object.entries(coverage.evidenceSha256)) ensure(sha(await bytes(name)) === claimed, `evidence changed: ${name}`);
 ensure(coverage.inventorySha256 === sha(await bytes('chapter-05-inventory.json')) && coverage.unitPlanSha256 === sha(await bytes('unit-plan.json')) && coverage.sourceSha256 === sha(await bytes('canonical-draft.txt')), 'source fingerprints');
 for (const record of [plan, packet, qa, expressions, expressionQa, carry]) ensure(record.sourceSha256 === coverage.sourceSha256 && record.unitPlanSha256 === coverage.unitPlanSha256, 'review source changed');
 ensure(plan.identityPacketSha256 === sha(await bytes('chapter-05-identity-packet.json')) && qa.identityPacketSha256 === plan.identityPacketSha256 && qa.identityPlanSha256 === sha(await bytes('chapter-05-identity-plan.json')), 'identity dependencies');
 const qaMap = new Map(qa.items.map(i => [i.key, i]));
 const routeMap = new Map(plan.items.map(i => [i.key, i]));
 const proposalMap = new Map(packet.items.map(i => [i.key, i]));
 ensure(qaMap.size === 137 && qa.items.length === 137 && routeMap.size === 137 && proposalMap.size === 137, 'duplicate or missing proposal key');
 const uses = new Map();
 const vocabulary = new Map();
 function questions(item) {
  ensure(item.questions.map(q=>q.band).join(',') === '1-3,4-5,6-8', `bands ${item.key}`);
  for (const q of item.questions) ensure(q.choices.length === 4 && new Set(q.choices).size === 4 && q.choices.filter(c=>c===q.answer).length === 1 && q.context && q.question, `question structure ${item.key}`);
 }
 for (const [name, claimed] of Object.entries(qa.batchEvidence)) {
  ensure(sha(await bytes(name)) === claimed && packet.batchEvidence[name] === claimed, `batch changed ${name}`);
  for (const item of (await read(name)).items) {
   questions(item);
   const reviewed=qaMap.get(item.key), route=routeMap.get(item.key), candidate=proposalMap.get(item.key);
   ensure(reviewed && route && candidate && reviewed.batchFile===name && route.batchFile===name && candidate.batchFile===name, 'review ownership');
   ensure(hash(item.questions) === reviewed.questionSha256 && reviewed.questionSha256 === route.questionSha256 && route.questionSha256 === candidate.questionSha256 && hash(item.sourceOccurrences) === reviewed.sourceOccurrencesSha256 && reviewed.sourceOccurrencesSha256 === route.sourceOccurrencesSha256 && route.sourceOccurrencesSha256 === candidate.sourceOccurrencesSha256, `exact revision ${item.key}`);
   ensure(reviewed.identityRoute===route.route && reviewed.reviewNote.length>100 && route.rationale.length>65 && reviewed.checks.includes('sole_semantic_answer'), 'editorial decision');
   if (route.targetSenseId) ensure(candidate.publishedLemmaCandidates.some(l=>l.lemmaId===route.targetLemmaId && l.senses.some(s=>s.senseId===route.targetSenseId)), 'cross-lemma sense');
   if (route.route==='new_sense_existing_lemma') ensure(candidate.publishedLemmaCandidates.some(l=>l.lemmaId===route.targetLemmaId), 'new sense lemma ownership');
   if (route.dependsOn) {
    const [file, id]=route.dependsOn.split(':');
    const dependency=(await read(file)).items.find(i=>i.key===id);
    ensure(dependency?.lemma.toLocaleLowerCase('fr')===item.lemma.toLocaleLowerCase('fr'), `planned lemma conflict ${item.key}`);
   }
   for (const occurrence of item.sourceOccurrences) {
    ensure(occurrence.chapter===5 && unitPlan.units[occurrence.unit-1].text.slice(occurrence.start,occurrence.end)===occurrence.text && occurrence.text.toLocaleLowerCase('fr')===item.form && !uses.has(key(occurrence)), 'duplicated or stale authored occurrence');
    uses.set(key(occurrence), item.key);
   }
   vocabulary.set(item.key, item);
  }
 }
 ensure(vocabulary.size===137 && qa.summary.reviewedQuestionBands===411 && qa.summary.exactAuthoredUses===uses.size, 'vocabulary review totals');
 const expressionsByKey=new Map(expressions.items.map(i=>[i.key,i]));
 ensure(expressionsByKey.size===9 && expressionQa.items.length===9 && expressionQa.summary.reviewedQuestionBands===27 && expressionQa.expressionReviewSha256===sha(await bytes('chapter-05-expression-review.json')), 'expression review counts');
 for(const review of expressionQa.items) {
  const item=expressionsByKey.get(review.key);questions(item);
  const o=item.sourceOccurrence;
  ensure(unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text && review.questionSha256===hash(item.questions) && review.reviewNote.length>100, 'expression span or question changed');
  for(const token of item.componentTokens) ensure(unitPlan.units[token.unit-1].text.slice(token.start,token.end)===token.text, 'phrase component changed');
 }
 for(const item of carry.items) {
  ensure(sha(await bytes(item.earlierFile))===item.earlierFileSha256, 'earlier source evidence');
  const earlier=(await read(item.earlierFile)).items.find(i=>i.key===item.earlierKey);questions(earlier);
  ensure(item.decision==='share_reviewed_earlier_contextual_meaning_and_three_band_questions' && item.reviewNote.includes('three existing bands'), 'carryover editorial review');
 }
 const publication=loadPublication(), quizzes=[...publication.preparedQuizzes.values()];
 const publishedReuses=[];
 for(let n=1;n<=5;n++) publishedReuses.push(...(await read(`chapter-05-published-reuse-review-${String(n).padStart(2,'0')}.json`)).items);
 const publishedMap=new Map();
 for(const item of publishedReuses) {
  const [surface,sense]=item.identity.split(':');
  const current=quizzes.filter(q=>q.subject?.surfaceFormId===surface&&q.subject?.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));
  ensure(current.length===3 && hash(current)===item.questionSha256, `published bank changed ${item.form}`);
  for(const occurrence of item.sourceOccurrences) {ensure(!publishedMap.has(key(occurrence)), 'published use duplicated');publishedMap.set(key(occurrence),item.identity);}
 }
 const resolution=await read('chapter-05-held-resolution.json');
 const dependency=await read('chapter-05-shared-repair-dependencies.json');
 ensure(dependency.items.length===3 && dependency.status==='impact_reviewed_shared_question_proposals_not_applied', 'repair dependencies');
 for(const item of dependency.items) ensure(sha(await bytes(item.impactFile))===item.impactSha256, 'impact revision changed');
 const seen=new Set(),counts={};
 for(const [index,row] of coverage.tokens.entries()) {
  const token=inventory.tokens[index], k=key(row);
  ensure(key(token)===k && row.text===token.text && row.form===token.form && !seen.has(k) && unitPlan.units[row.unit-1].chapter===5 && unitPlan.units[row.unit-1].text.slice(row.start,row.end)===row.text, 'token partition');
  seen.add(k); counts[row.disposition]=(counts[row.disposition]??0)+1;
  if(row.disposition==='reviewed_published_identity_and_questions') ensure(publishedMap.get(k)===row.evidenceKey, 'published reuse route');
  else if(['reviewed_contextual_meaning_and_three_band_questions','reviewed_same_chapter_surface_sense_and_questions'].includes(row.disposition)) ensure(vocabulary.get(row.evidenceKey)?.form===row.form, 'question assignment');
  else if(row.disposition==='reviewed_full_expression_component') ensure(expressionsByKey.get(row.evidenceKey)?.componentTokens.some(t=>key(t)===k), 'isolated expression component');
  else if(row.disposition==='reviewed_alternate_published_identity_and_questions') ensure(resolution.items.some(i=>key(i)===k&&i.identity===row.evidenceKey), 'alternate route');
  else if(row.disposition==='already_authored_earlier') ensure(token.earlierDraft?.key===row.evidenceKey, 'earlier authored route');
  else if(row.disposition==='reviewed_meaning_shared_question_repair_dependency') ensure(uses.get(k)===row.evidenceKey || resolution.items.some(i=>key(i)===k&&i.route==='published_shared_question_repair_requires_impact_review'), 'repair route');
  else if(row.disposition==='reviewed_earlier_surface_sense_and_questions') ensure(carry.items.some(i=>i.earlierKey===row.evidenceKey&&i.sourceOccurrences.some(o=>key(o)===k)), 'carryover route');
  else if(row.disposition==='reviewed_earlier_meaning_carryover') ensure((await read(row.evidenceFile)).items.some(i=>i.key===row.evidenceKey&&i.occurrences.some(o=>key(o)===k)), 'earlier meaning route');
  else if(row.disposition==='reviewed_proper_name') ensure((await read(row.evidenceFile)).items.some(i=>i.form===row.evidenceKey&&i.occurrences.some(o=>key(o)===k)), 'name route');
  else ensure(false, `unknown disposition ${row.disposition}`);
 }
 ensure(JSON.stringify(counts)===JSON.stringify(coverage.summary.dispositions) && coverage.summary.unresolvedTokenUses===0 && coverage.summary.usesWithSharedRepairDependencies===16, 'coverage totals');
 console.log('Micromégas V: 612 exact source routes, 137 vocabulary proposals / 411 reviewed bands, 9 expressions / 27 reviewed bands; 3 shared repair dependencies remain before import.');
 return coverage;
}
