import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('content/sources/wrk_voltaire_micromegas');
const bytes = readFileSync(resolve(root, 'chapter-01-coverage.json'));
const coverage = JSON.parse(bytes);
// Explicit editorial exclusions: actual named people, places, planets and
// fictional character. The literary text and navigation retain every name.
const properNames = {
  'micromégas': 'The named fictional protagonist, including the title reference.',
  'sirius': 'The named star, a celestial proper name.',
  'saturne': 'The named planet, a celestial proper name.',
  'euclide': 'The historical mathematician named in the geometry comparison.',
  'blaise': 'First element of the historical person Blaise Pascal.',
  'pascal': 'Second element of the historical person Blaise Pascal.',
  'derham': 'The named scholar cited by the narrator.',
  'lulli': 'The named composer in the Italian musician comparison.',
  'allemagne': 'The named country in the political comparison.',
  'italie': 'The named country in the political comparison.',
  'turquie': 'The named country in the empire comparison.',
  'moscovie': 'The historical proper place name in the empire comparison.',
  'chine': 'The named country in the empire comparison.',
  'france': 'The named country in the musician comparison.'
};
const names = Object.entries(properNames).map(([form, rationale]) => {
  const occurrences = coverage.tokens.filter(token => token.form === form);
  if (!occurrences.length || occurrences.some(token => token.disposition !== 'proper_name_exclusion_to_verify')) throw Error(`Unreviewed or missing proper name: ${form}`);
  return { form, status: 'chapter_proper_name_excluded_from_vocabulary', rationale, occurrences: occurrences.map(({ unit, start, end, text, context }) => ({ chapter: 1, unit, start, end, text, context })) };
});
const honors = coverage.tokens.filter(token => token.disposition === 'honorific_monsieur_mapping_to_verify');
if (names.reduce((n,item)=>n+item.occurrences.length,0)!==24 || honors.length!==3 || honors.some(token=>token.text!=='M')) throw Error('Chapter I name/honorific spans changed');
const honorific = { text: 'M', printedContext: 'M.', publishedLemma: 'lem_monsieur', publishedSense: 'sns_fr_monsieur_title', publishedSurface: 'srf_fr_m_monsieur_noun', status: 'reuse_published_abbreviated_surface_and_three_questions', decision: 'The published M surface already links to monsieur and has three active question bands. Source occurrence spans select only M; the following period remains in the prose and is not part of the learner surface. Reuse its existing surface+sense mastery without resetting or duplicating it.', occurrences: honors.map(({ unit, start, end, context }) => ({ chapter: 1, unit, start, end, text: 'M', context })) };
const output = { version: 1, workId: coverage.workId, chapter: 1, status: 'proper_names_excluded_honorific_published_identity_reviewed', coverageSha256: createHash('sha256').update(bytes).digest('hex'), note: 'Twenty-four proper-name token uses are excluded from vocabulary while retained in the canonical prose. Three printed M. honorifics reuse the existing M abbreviated surface and its three question bands.', names, honorific };
writeFileSync(resolve(root, 'chapter-01-names-01.json'), JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({ properNames: names.length, excludedTokenUses: 24, honorificUses: honors.length }));
