import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPublication} from './micromegas-publication-baseline.mjs';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-03-coverage.json'))),published=loadPublication();
const sha=b=>createHash('sha256').update(b).digest('hex');
// Every form here was compared to its actual chapter III use. A one-candidate
// spelling is not by itself sufficient: mismatches are separately drafted.
const groups=[
 {rationale:'The source uses the same grammatical person, possession, article or count value as the three existing published questions.',forms:`nos deux qui ses c’ avait six cent sa elle t’ cents ans je me j’ ai bras tu cinq toi notre et ils leurs cette on enfants son ces ceux gens cela seconde fois sept aux`},
 {rationale:'The source uses the same ordinary movement, temporal relation, manner, degree or state taught by the current three published questions.',forms:`dans avec jolie lorsque eut larmes petite ah enfin quand entre pour aller es jamais eu vrai où courir veux sont voilà embrassa dame alla se pays cependant trouvèrent comme a petit là allèrent auprès pendant laquelle secrets seraient sans quelques peu lu m’ laissé voir bonté saurait première surtout grande espérance race sait sais écrira contre savent combien loin soleil coucher mauvais jusqu’ bientôt longtemps rien prête dedans juillet`},
 {rationale:'These source uses preserve the published concrete noun or familiar function-word sense, with the listed special contexts checked against its question set.',forms:`messieurs père quoi`},
];
// Override the broad grouping with precise treatment of a few near matches.
const explanations={
  eut:'She received news: the past-historic avoir auxiliary/possessive sense applies, not the separately drafted received-an-order sense.',
  larmes:'En larmes literally involves tears, matching the published tear noun, with the idiom recorded separately.',
  es:'Tu es un curieux attributes a characteristic with the published linking verb.',
  jamais:'Never had love and never love anyone again both use never with a negative construction.',
  où:'Où vas-tu courir asks for a destination, exactly the published place question.',
  embrassa:'The Saturnian embraces or kisses his lover, matching the published embrace verb.',
  trouvèrent:'They found nothing in unit 79; the two earlier find-it-flat uses are drafted as judgment rather than reusing the physical discovery questions.',
  messieurs:'The inquisitors and the children are addressed with the polite plural title; the published questions teach the plural polite appellation.',
  père:'At unit 72 the children’s father is a parent, matching the published parent questions; père Castel at unit 75 is drafted as a clerical title.',
  fois:'The second occasion on which they might repent is an ordinary instance, not chapter I’s multiplication sense.',
  quoi:'De quoi coucher asks what means or place is available; the Quoi of Quoi qu’il en soit is reserved to its separate expression.',
  terre:'The planet in unit 80 is assigned chapter I’s Earth draft; the landing in unit 82 has its own dry-land draft, so no soil identity is reused here.',
};
// Forms already assigned to prior or new drafts and phrase components are
// absent from this final set. Listing an obsolete spelling is an error.
const selected=new Map();
for(const group of groups)for(const form of group.forms.split(/\s+/u)){
 if(selected.has(form))continue;
 selected.set(form,explanations[form]??group.rationale);
}
const groupsByForm=Map.groupBy(coverage.tokens.filter(t=>t.disposition==='one_published_candidate_context_pending'),t=>t.form);
const actual=new Set(groupsByForm.keys());
const listed=new Set(selected.keys());
const missing=[...actual].filter(f=>!listed.has(f)),obsolete=[...listed].filter(f=>!actual.has(f));
if(missing.length||obsolete.length)throw Error(`Unreviewed single candidates ${missing.join(', ')}; obsolete ${obsolete.join(', ')}`);
const items=[...selected].map(([form,decision])=>{
 const tokens=groupsByForm.get(form),candidate=tokens[0].candidates[0];
 if(tokens.some(t=>t.candidates.length!==1||t.candidates[0].identity!==candidate.identity)||candidate.preparedBands.join(',')!=='levels_1_3,levels_4_5,levels_6_8')throw Error(`Question set missing ${form}`);
 const [surface,sense]=candidate.identity.split(':');
 const questions=[...published.preparedQuizzes.values()].filter(q=>q.subject?.kind==='vocabulary'&&q.subject.surfaceFormId===surface&&q.subject.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));
 if(questions.length!==3)throw Error(`Published quiz set changed ${form}`);
 return {form,identity:candidate.identity,lemma:candidate.lemma,publishedGloss:candidate.gloss,publishedBands:candidate.preparedBands,publishedQuestionSha256:sha(JSON.stringify(questions)),decision,status:'source_context_and_published_bands_checked_offline',occurrences:tokens.map(({unit,start,end,text,context})=>({chapter:3,unit,start,end,text,context}))};
});
writeFileSync(resolve(root,'chapter-03-reuse-01.json'),JSON.stringify({version:1,workId:coverage.workId,chapter:3,status:'offline_contextual_published_reuse_review_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,items},null,2)+'\n');
console.log(JSON.stringify({forms:items.length,uses:items.reduce((n,i)=>n+i.occurrences.length,0)}));
