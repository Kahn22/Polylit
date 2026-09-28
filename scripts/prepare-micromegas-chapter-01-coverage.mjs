import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';
import { loadPublication } from '../dist/publication/repository.js';

// Exhaustive inventory. Catalogue matches and presence of old questions never
// constitute a contextual identity or new-question approval.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const read = name => JSON.parse(readFileSync(resolve(root, name)));
const bytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(bytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const review = read('chapter-01-review.json');
const publication = loadPublication();
const sha = value => createHash('sha256').update(value).digest('hex');
const names = new Set(review.additionalTriage.properNamesNotVocabulary.flatMap(value => value.match(/\p{L}+/gu) ?? []).map(value => value.toLocaleLowerCase('fr')));
const forms = new Map(gap.forms.map(row => [row.form, row]));
const surfaces = new Map(publication.bundle.surfaceForms.map(surface => [surface.id, surface]));
const senses = new Map(publication.bundle.senses.map(sense => [sense.id, sense]));
const lemmas = new Map(publication.bundle.lemmas.map(lemma => [lemma.id, lemma]));
const questions = new Map();
for (const quiz of publication.preparedQuizzes.values()) {
  if (quiz.subject.kind !== 'vocabulary') continue;
  const key = `${quiz.subject.surfaceFormId}:${quiz.subject.senseId}`;
  const entry = questions.get(key) ?? new Set();
  entry.add(quiz.band);
  questions.set(key, entry);
}
const drafts = new Map();
for (let n = 1; n <= 24; n++) {
  const filename = `chapter-01-batch-${String(n).padStart(2, '0')}.json`;
  for (const item of read(filename).items) for (const occ of item.sourceOccurrences.filter(occ => occ.chapter === 1)) {
    const key = `${occ.unit}:${occ.start}:${occ.end}`;
    if (drafts.has(key)) throw Error(`Duplicate draft on ${key}`);
    drafts.set(key, { file: filename, key: item.key, meaning: item.meaning });
  }
}
const candidate = id => {
  const [surfaceId, senseId] = id.split(':');
  const surface = surfaces.get(surfaceId);
  const sense = senses.get(senseId);
  if (!surface || !sense || surface.lemmaId !== sense.lemmaId) throw Error(`Invalid published candidate ${id}`);
  return { identity: id, lemma: lemmas.get(surface.lemmaId)?.headword, gloss: sense.gloss, definition: sense.definition, preparedBands: [...(questions.get(id) ?? [])].sort() };
};
const rows = [];
for (const unit of plan.units.filter(unit => unit.chapter === 1)) {
  for (const token of tokenizeFrench(unit.text)) {
    const key = `${unit.ordinal}:${token.start}:${token.end}`;
    const form = token.text.toLocaleLowerCase('fr');
    const exact = forms.get(form);
    if (!exact) throw Error(`Tokenizer differs from source-reuse plan: ${form}`);
    const context = unit.text.slice(Math.max(0, token.start - 40), Math.min(unit.text.length, token.end + 50));
    const draft = drafts.get(key);
    const disposition = draft ? 'drafted_pending_signoff'
      : names.has(form) ? 'proper_name_exclusion_to_verify'
      : form === 'm' && unit.text.slice(token.end, token.end + 1) === '.' ? 'honorific_monsieur_mapping_to_verify'
      : exact.candidateIdentities.length === 1 ? 'one_published_candidate_context_pending'
      : exact.candidateIdentities.length > 1 ? 'multiple_published_candidates_context_pending'
      : 'no_exact_published_identity_context_pending';
    rows.push({ unit: unit.ordinal, paragraphIndex: unit.paragraphIndex, start: token.start, end: token.end, text: token.text, form, context, disposition, ...(draft ? { draft } : {}), candidates: exact.candidateIdentities.map(candidate) });
  }
}
for (const key of drafts.keys()) if (!rows.some(row => `${row.unit}:${row.start}:${row.end}` === key)) throw Error(`Missing chapter I draft token ${key}`);
const byForm = new Map();
for (const row of rows) {
  const record = byForm.get(row.form) ?? { form: row.form, sourceUses: 0, firstUnit: row.unit, dispositions: new Set() };
  record.sourceUses++;
  record.dispositions.add(row.disposition);
  byForm.set(row.form, record);
}
const summary = { tokenUses: rows.length, distinctForms: byForm.size, draftedTokenUses: rows.filter(row => row.draft).length, draftedDistinctForms: new Set(rows.filter(row => row.draft).map(row => row.form)).size };
summary.unresolvedTokenUses = summary.tokenUses - summary.draftedTokenUses;
summary.unresolvedDistinctForms = [...byForm.values()].filter(record => !record.dispositions.has('drafted_pending_signoff')).length;
const output = { version: 1, workId: 'wrk_voltaire_micromegas', chapter: 1, status: 'complete_token_inventory_contextual_review_pending', sourceSha256: sha(draft), unitPlanSha256: sha(bytes), note: 'Every tokenizer token in chapter I is inventoried with exact unit offsets and existing catalogue candidates. Proper-name, honorific and published-identity labels are triage only. No identity/question is approved by this inventory.', summary, forms: [...byForm.values()].map(row => ({ ...row, dispositions: [...row.dispositions] })), tokens: rows };
writeFileSync(resolve(root, 'chapter-01-coverage.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(summary));
