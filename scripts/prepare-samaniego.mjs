/** Offline intake for the user-selected canonical fable. Never imported by the app. */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { loadPublication, validatePublication, sourceDigest, publicationRoot } from '../dist/publication/repository.js';
import { workSourceV2, sharedSourceFiles, adoptSourceFiles } from '../dist/publication/source-store.js';
import { toNeutral, fromNeutral } from '../dist/publication/format.js';
import { prepareQuiz, quizEditorialIssues } from '../dist/publication/quiz-authoring.js';
import { editorialSubjects, auditEditorialQuality } from '../dist/publication/quality-audit.js';
import { approveReview, approvalIssues } from '../dist/publication/editorial.js';
import { textBinding } from '../dist/publication/revisions.js';
const dir = resolve('content/intake/samaniego-zorra-uvas');
const read = name => readFileSync(resolve(dir, name), 'utf8');
const slug = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const workId = 'wrk_samaniego_zorra_uvas';
const original = loadPublication();
if (original.bundle.works.some(w => w.id === workId)) throw Error('Work already adopted; use the normal reviewed update workflow.');
const p = structuredClone(original), b = p.bundle, es = p.sharedSources.es;
const canonicalText = read('canonical.txt').trimEnd();
const rows = read('authored.txt').trim().split(/\n\n+/).map(block => block.split('\n').map(line => line.split('|')));
const expressionRows = read('expressions.txt').trim().split(/\n\n+/).map(block => block.split('\n').map(line => line.split('|')));
const reuse = JSON.parse(read('reuse.json'));
const pairs = new Map(Object.entries(reuse));
const added = Object.fromEntries(Object.keys(b).map(k => [k, []]));
const append = (kind, item) => { b[kind].push(item); added[kind].push(item); return item; };
const newQuizzes = [];
function quizzes(key, subject, form, gloss, lines, expression = false) {
  const [early, mid, late] = lines;
  if (early.length !== 4 || mid.length !== 4 || late.length !== 5) throw Error(`Bad authored fields: ${key}`);
  const id = `${expression ? 'exq' : 'qiz'}_samaniego_${slug(key)}`;
  const common = { ...subject };
  const list = [
    { ...common, id: `${id}_early`, band: 'levels_1_3', format: 'meaning_choice', contextFrench: early[0], targetText: form, ...(!expression ? { prompt: 'Meaning' } : {}), choicesEnglish: [gloss, ...early.slice(1)], correctAnswer: gloss },
    { ...common, id: `${id}_middle`, band: 'levels_4_5', format: 'surface_completion', contextFrench: mid[0], choicesFrench: [form, ...mid.slice(1)], correctAnswer: form },
    { ...common, id: `${id}_late`, band: 'levels_6_8', format: 'target_identification', contextFrench: late[0], promptFrench: late[1], choicesFrench: [form, ...late.slice(2)], correctAnswer: form },
  ];
  for (const q of list) {
    const prepared = prepareQuiz(q, 'es');
    const issues = quizEditorialIssues(prepared);
    if (issues.length) throw Error(`${q.id}: ${issues.join(', ')}`);
    newQuizzes.push(prepared); p.preparedQuizzes.set(q.id, prepared); es.quizzes.push(prepared);
    if (expression) p.expressionCatalog.preparedQuizzes.push(q); else append('quizItems', q);
  }
}
for (const [header, ...lines] of rows) {
  const [key, headword, pos, gloss, definition, grammar] = header;
  const form = key === 'las_pronoun' ? 'las' : key;
  let lemma = b.lemmas.find(l => l.id.startsWith('lem_es_') && l.headword === headword && l.partOfSpeech === pos);
  if (!lemma) lemma = append('lemmas', { id: `lem_es_samaniego_${slug(headword)}_${slug(pos)}`, headword, partOfSpeech: pos });
  // Same surface may have a newly separated meaning; only the sense ID is new.
  let surface = b.surfaceForms.find(s => s.lemmaId === lemma.id && s.normalized === form);
  if (!surface) {
    const grammaticalFeatures = {};
    for (const value of grammar.split(',')) {
      if (['masculine', 'feminine', 'common'].includes(value)) grammaticalFeatures.gender = value;
      else if (['singular', 'plural', 'invariable'].includes(value)) grammaticalFeatures.number = value;
      else if (['first', 'second', 'third'].includes(value)) grammaticalFeatures.person = value;
      else if (['indicative', 'subjunctive', 'imperative', 'infinitive', 'gerund'].includes(value)) grammaticalFeatures.mood = value;
      else grammaticalFeatures.tense = value;
    }
    surface = append('surfaceForms', { id: `srf_es_samaniego_${slug(key)}`, lemmaId: lemma.id, form, normalized: form, grammaticalFeatures });
  }
  const sense = append('senses', { id: `sns_es_samaniego_${slug(key)}`, lemmaId: lemma.id, gloss, definition });
  pairs.set(key, [surface.id, sense.id]);
  quizzes(key, { surfaceFormId: surface.id, senseId: sense.id }, form, gloss, lines);
}
append('authors', { id: 'aut_felix_maria_samaniego', name: 'Félix María Samaniego', sortName: 'Samaniego, Félix María' });
append('collections', { id: 'col_samaniego_fabulas', authorId: 'aut_felix_maria_samaniego', title: 'Fábulas', language: 'es' });
append('books', { id: 'bok_samaniego_fabulas_04', collectionId: 'col_samaniego_fabulas', ordinal: 4, title: 'Libro IV' });
append('works', { id: workId, bookId: 'bok_samaniego_fabulas_04', ordinal: 6, title: 'La zorra y las uvas', publicationState: 'learning_ready', originCountryCode: 'ES', originCountryName: 'Spain', originCountryFlag: '🇪🇸' });
append('sources', { workId, canonicalText, provenance: { citation: 'Félix María Samaniego, Fábulas, ed. Miguel de Toro Gómez (Paris: Armand Colin, 1902), Libro IV, Fábula VI, pp. 83–84. Historical text cross-checked with the page scans and the Project Gutenberg transcription (ebook 55206); see the intake source report for typography and the cuando correction.', url: 'https://www.gutenberg.org/cache/epub/55206/pg55206-images.html', accessedOn: '2026-09-21' }, typographyPolicy: 'modern_conventional_typography_preserving_wording' });
const poemLines = canonicalText.split('\n');
if (poemLines.length !== 16) throw Error('Expected the complete sixteen-line fable.');
const units = [0, 4, 8, 12].map((start, i) => append('units', { id: `unt_samaniego_zorra_uvas_${i + 1}`, workId, ordinal: i + 1, french: poemLines.slice(start, start + 4).join('\n') }));
let serial = 0;
for (const unit of units) for (const match of unit.french.matchAll(/\p{L}[\p{L}\p{M}]*/gu)) {
  const form = match[0], normalized = form.toLowerCase();
  const span = { workId, unitId: unit.id, start: match.index, end: match.index + form.length };
  if (form === 'Fabio') { append('exclusions', { id: 'exc_samaniego_fabio', ...span, text: form, reason: 'proper_noun' }); continue; }
  const key = normalized === 'que' && unit.ordinal === 1 && unit.french.slice(0, match.index).endsWith('fruto ') ? 'que_relative'
    : normalized === 'las' && unit.ordinal === 3 ? 'las_pronoun' : normalized;
  const pair = pairs.get(key);
  if (!pair) throw Error(`Uncovered token ${form}`);
  append('occurrences', { id: `occ_samaniego_zorra_uvas_${String(++serial).padStart(3, '0')}`, ...span, surfaceFormId: pair[0], senseId: pair[1] });
}
const expressionAdditions = { identities: [], occurrences: [], preparedQuizzes: [] };
for (const [header, ...lines] of expressionRows) {
  const [headword, gloss, definition] = header;
  const id = `exi_es_samaniego_${slug(headword)}`;
  const identity = { id, headword, gloss, definition };
  p.expressionCatalog.identities.push(identity); expressionAdditions.identities.push(identity); es.legacy.expressionIdentities.push(identity);
  const before = p.expressionCatalog.preparedQuizzes.length;
  quizzes(headword, { expressionId: id }, headword, gloss, lines, true);
  expressionAdditions.preparedQuizzes.push(...p.expressionCatalog.preparedQuizzes.slice(before));
  for (const unit of units) {
    const start = unit.french.toLowerCase().indexOf(headword);
    if (start < 0) continue;
    const occurrence = { id: `exo_samaniego_${slug(headword)}`, identityId: id, workId, unitId: unit.id, start, end: start + headword.length, text: unit.french.slice(start, start + headword.length) };
    p.expressionCatalog.occurrences.push(occurrence); expressionAdditions.occurrences.push(occurrence);
  }
}
const noteTexts = [
  ['source', 'Complete 16-line fable from the 1902 Armand Colin edition, Book IV, Fable VI, pp. 83–84. Country of origin: Spain.'],
  ['editorial', 'Typography: obsolete á, vió, fué and dí are displayed as a, vio, fue and di. Verse line breaks and wording are retained. The printed cuanto in line 11 is corrected to cuando, agreeing with the 1882 edition and the checked digital transcription. Footnote numbers and page furniture are omitted.'],
  ['language', 'Es voz común means “it is commonly said”; a más del medio día places the action after midday. Quédase and causábale are literary forms of se queda and le causaba. Probaduras means attempts or trials. De fijo means certainly.'],
  ['language', 'The narrator addresses Fabio, a conventional personal name, in the moral. Mil is an exaggeration meaning very many. Verdes describes the color of the leaves; maduras describes ripeness. Frescamente conveys a cool, unembarrassed attitude.'],
];
noteTexts.forEach(([kind, text], i) => append('notes', { id: `not_samaniego_zorra_uvas_${i + 1}`, workId, kind, text }));
append('readiness', { workId, thoughtUnitsComplete: true, occurrencesReviewed: true, unresolvedLearnerTokens: [] });
p.registry.catalog = { authors: b.authors, collections: b.collections, books: b.books };
p.registry.works.push({ id: workId, language: 'es', status: 'approved' });
p.textBindings.set(workId, textBinding(b, p.expressionCatalog.occurrences, workId));
const shared = fromNeutral(es.legacy.content);
for (const kind of ['lemmas', 'senses', 'surfaceForms', 'quizItems']) shared[kind].push(...added[kind]);
es.legacy.content = toNeutral(shared);
es.legacy.preparedExpressionQuizzes.push(...toNeutral(expressionAdditions.preparedQuizzes));
validatePublication(b, p.expressionCatalog, p.registry);
const identities = new Set(added.occurrences.map(o => `${o.surfaceFormId}:${o.senseId}`));
const originalSubjects = new Map(editorialSubjects(original).map(s => [`${s.kind}:${s.id}`, s]));
const oldReviews = new Map(original.reviews.map(r => [r.id, r]));
const newQuizIds = new Set(newQuizzes.map(q => q.id));
const subjects = editorialSubjects(p).filter(s => s.language === 'es' && (s.kind === 'annotations' && s.id === workId || s.kind === 'vocabulary' && identities.has(s.id) || s.kind === 'quiz' && newQuizIds.has(s.id) || s.kind === 'expression' && expressionAdditions.identities.some(e => e.id === s.id)));
const digest = createHash('sha256').update(JSON.stringify(subjects)).digest('hex');
const report = { workId, vocabularyIdentities: identities.size, newVocabularyIdentities: rows.length, reusedVocabularyIdentities: identities.size - rows.length, wordOccurrences: added.occurrences.length, excludedProperNames: 1, newQuizzes: newQuizzes.length, expressions: expressionRows.length, subjectDigest: digest };
writeFileSync(resolve(dir, 'candidate-review.json'), JSON.stringify({ ...report, subjects }, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!process.argv.includes('--apply')) process.exit(0);
const evidence = JSON.parse(read('approval.json'));
if (evidence.subjectDigest !== digest || evidence.status !== 'approved') throw Error('Exact candidate needs an offline editorial approval.');
const reviews = new Map(es.reviews.map(r => [r.id, r]));
for (const s of subjects) {
  const old = originalSubjects.get(`${s.kind}:${s.id}`);
  // Existing approvals are extended only for explicitly reviewed matching uses.
  if (old && s.kind === 'vocabulary' && approvalIssues(oldReviews.get(`vocabulary:${s.id}`), old.value, old.kind, old.id, old.language).length) throw Error(`Existing identity needs separate review: ${s.id}`);
  const r = approveReview('es', s.kind, s.id, s.value, evidence.reviewer, evidence.reviewedAt, evidence.reason);
  reviews.set(r.id, r);
}
es.reviews = [...reviews.values()];
p.reviews = [...p.sharedSources.fr.reviews, ...es.reviews];
const oldIssues = new Set(auditEditorialQuality(original).map(i => `${i.kind}:${i.id}:${i.issues.join(',')}`));
const newIssues = auditEditorialQuality(p).filter(i => !oldIssues.has(`${i.kind}:${i.id}:${i.issues.join(',')}`));
if (newIssues.length) throw Error(`New editorial blockers: ${JSON.stringify(newIssues)}`);
const workRecords = Object.fromEntries(['works', 'sources', 'units', 'occurrences', 'exclusions', 'expressions', 'notes', 'readiness'].map(k => [k, added[k]]));
const work = workSourceV2({ version: 1, language: 'es', sourceDigest: sourceDigest(added.sources), content: toNeutral(workRecords), expressionOccurrences: expressionAdditions.occurrences, editorialReviewFiles: ['content/intake/samaniego-zorra-uvas/approval.json'] });
const files = sharedSourceFiles(es);
files.set('registry.json', p.registry); files.set(`works/${workId}.json`, work);
const ledger = { version: 1, kind: 'additive_work_intake', workId, progressTransfers: [], replacesExistingRecords: false, bundleAdditions: added, expressionAdditions, review: report };
files.set('intake-batches/samaniego-zorra-uvas.json', ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const next = loadPublication(stage); validatePublication(next.bundle, next.expressionCatalog, next.registry); });
console.log(`Adopted; previous publication retained at ${backup}`);
