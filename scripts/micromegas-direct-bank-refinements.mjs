import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

// Named, source-bound edits. All predecessors remain intact.
const specs=[
 ['08','nommee_called','4-5',{context:'Cette étoile porte le nom de Sirius ; elle est donc ___ ainsi.'},'All four participles accept ainsi; the naming meaning alone selects nommée.'],
 ['08','connaitre_person','4-5',{context:'Je veux me familiariser avec cette personne et comprendre son caractère : je cherche à la ___.'},'State the acquaintance meaning rather than an unspecified activity after several meetings.'],
 ['09','appelait_was_named','4-5',{choices:['appelait','éloignait','effaçait','étonnait']},'All four imperfect forms accept the unchanged s’ elision; cachait did not.'],
 ['08','chacun_each','4-5',{context:'Les trois élèves reçoivent tous un livre, sans exception et individuellement : ___ reçoit le sien.'},'Explicit individual distribution distinguishes each one from a subset.'],
 ['08','trouveront_deduce','4-5',{context:'Les résultats seront obtenus par déduction numérique : avec la formule, ils ___ la circonférence exacte du globe.'},'Make calculation and obtaining the result explicit.'],
 ['08','produit_origin','4-5',{context:'Dans ce récit, il est né sur cette planète : elle l’a ___, c’est-à-dire fait naître.'},'Test origin by birth rather than an unspecified event on the natal planet.'],
 ['11','etant_being','4-5',{context:'Cette taille est donnée comme un fait établi, sans changement ni apparence : sa taille ___ de huit lieues, nous calculons sa ceinture.'},'Distinguish an established state from change or appearance through meaning.'],
 ['12','conviendront_agree','4-5',{choices:['conviendront','douteront','parleront','discuteront']},'All four future plural verbs accept en; rejecting and lying had incompatible complements.'],
 ['15','devine_inferred','4-5',{context:'Avant toute preuve, il avait trouvé le résultat par intuition : il l’avait déjà ___.'},'The prior vague sentence also allowed forgetting, painting or hiding the answer. The masculine résultat keeps all four participles in agreement.'],
 ['15','devint_became','4-5',{context:'La conversation, d’abord ennuyeuse, changea réellement d’état et ___ intéressante.',choices:['devint','resta','parut','sembla']},'All four past verbs accept the adjective; an actual change selects became.'],
 ['12','enfance_childhood','4-5',{context:'Le nom de la période de sa vie où elle est encore une enfant est son ___.',choices:['enfance','adolescence','expérience','existence']},'Four feminine singular vowel-initial nouns accept son; only enfance names the stated period.'],
 ['02','diamètre_width','4-5',{context:'Le nom géométrique précis du segment passant par le centre du cercle d’un bord à l’autre est le ___.',choices:['diamètre','rayon','périmètre','arc']},'Remove the equally true generic segment answer; all four choices remain masculine singular nouns.'],
 ['24','vers_approximately_age','1-3',{context:'Il avait vers quatre cent cinquante ans.'},'Remove the malformed juxtaposition from the early question.'],
 ['24','vers_approximately_age','6-8',{context:'Il commença ses études vers quatre cent cinquante ans, c’est-à-dire à peu près à cet âge. Après indique un âge ultérieur, avant un âge antérieur et pendant une durée.'},'Retain the approximation meaning in a complete natural sentence.'],
];

export function composeMicromegasDirectBankRefinements(folder){
 const items=new Map();
 for(const[batch,key,band,patch,reason]of specs){
  const file=`chapter-01-batch-${batch}.json`,bank=JSON.parse(readFileSync(`${folder}/${file}`)).items.find(i=>i.key===key);
  if(!bank)throw Error(`Missing named direct refinement: ${file}:${key}`);
  const name=`${file}:${key}`;
  if(!items.has(name))items.set(name,{file,key,beforeQuestionSha256:hash(bank.questions),after:structuredClone(bank),changes:[]});
  const entry=items.get(name),index=entry.after.questions.findIndex(q=>q.band===band);
  if(index<0)throw Error(`Missing named band: ${name}/${band}`);
  const before=structuredClone(entry.after.questions[index]);Object.assign(entry.after.questions[index],patch);
  entry.changes.push({band,beforeSha256:hash(before),afterSha256:hash(entry.after.questions[index]),reason});
 }
 for(const entry of items.values())entry.afterQuestionSha256=hash(entry.after.questions);
 return {version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:specs.length},policy:'Exact draft revisions only; retain every original question and identity. This is editorial evidence, not work release approval.'};
}
