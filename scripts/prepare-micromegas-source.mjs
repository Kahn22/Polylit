import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve('content/sources/wrk_voltaire_micromegas');
const witness = readFileSync(resolve(dir, 'witness-page.txt'), 'utf8');
const first = witness.indexOf('CHAPITRE I.\n');
const last = witness.indexOf('\nFIN DE L’HISTOIRE DE MICROMÉGAS.');
if (first < 0 || last < first || (witness.match(/^CHAPITRE [IVX]+\.$/gm) ?? []).length !== 7) throw Error('Incomplete seven-chapter witness');
const sourceBody = witness.slice(first, last);
const footnoteMarkers = [...sourceBody.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1]));
if (footnoteMarkers.length !== 34 || footnoteMarkers.some((n, i) => n !== i + 1)) throw Error('Unexpected editorial footnote markers');
const paragraphs = sourceBody.split(/\n\s*\n/u).map(s => s.trim()).filter(Boolean);
const chapters = [];
const text = [];
for (const paragraph of paragraphs) {
  if (/^CHAPITRE [IVX]+\.\n/u.test(paragraph)) {
    const [label, ...rest] = paragraph.split('\n');
    chapters.push({ number: chapters.length + 1, label, heading: rest.join(' ').trim(), paragraphIndex: text.length });
    // Chapter labels and summaries are navigation metadata. Literary prose begins after each heading.
    continue;
  }
  const cleaned = paragraph.replace(/\[\d+\]/gu, '').replace(/\u00a0/gu, ' ').replace(/\u200c/gu, '').replace(/[ \t]+/gu, ' ').replace(/\n+/gu, ' ').trim();
  if (cleaned) text.push(cleaned);
}
if (chapters.length !== 7 || text.length < 15) throw Error('Missing chapters or prose');
let draft = text.join('\n\n') + '\n';
// The online transcription modernizes this locution twice; both 1877 scans
// print it as two words. Keep the selected edition's typography.
const modernized = [...draft.matchAll(/au-delà/gu)];
if (modernized.length !== 2) throw Error('Unexpected au-delà readings; inspect pages 107–108');
draft = draft.replaceAll('au-delà', 'au delà');
for (const [online, printed, page] of [
  ['quelques apparence que ceci', 'quelque apparence que ceci', 113],
  ['une âme fut logée là', 'une âme fût logée là', 114],
  ['Ô Dieu ! qui avez donné', 'O Dieu ! qui avez donné', 118],
  ['« Ô atomes intelligents', '« O atomes intelligents', 118],
  ['Très-bien, répondit l’homme', 'Très-bien, lui répondit l’homme', 121],
  ['Alors monsieur Micromégas,', 'Alors M. Micromégas,', 121]
]) {
  if (draft.split(online).length !== 2) throw Error(`Unexpected page ${page} reading; inspect scan`);
  draft = draft.replace(online, printed);
}
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
writeFileSync(resolve(dir, 'canonical-draft.txt'), draft);
writeFileSync(resolve(dir, 'candidate-preparation.json'), JSON.stringify({
  version: 1, status: 'draft_unverified', workId: 'wrk_voltaire_micromegas', witnessUrl: 'https://fr.wikisource.org/wiki/Microm%C3%A9gas/Texte_entier',
  witness: { file: 'witness-page.txt', sha256: sha(witness), bytes: Buffer.byteLength(witness, 'utf8'), retrievalMethod: 'visible Wikisource transcluded page text', containsSiteFurniture: true },
  canonicalDraft: { file: 'canonical-draft.txt', sha256: sha(draft), bytes: Buffer.byteLength(draft, 'utf8'), chapters: 7, paragraphs: text.length, words: (draft.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length },
  chapters, transformations: [
    { rule: 'Omit page navigation, bibliographic display, title, the parenthesized editorial date and concluding editorial label; preserve complete chapter prose and store seven chapter headings as navigation metadata.' },
    { rule: `Remove ${footnoteMarkers.length} bracketed editorial note calls [1]–[34]; no notes are part of the literary body.` },
    { rule: 'Convert nonbreaking spaces to ordinary spaces and fold line wraps inside source paragraphs; retain source spelling, punctuation function and paragraph boundaries. The online transcription represents printed three-dot ellipses with U+2026 (e.g. p. 111 « de... » → « de… »).' },
    { rule: 'Restore printed « au delà » from the online transcription’s « au-delà » twice (Garnier 1877 pp. 107 and 108); same two-word source spelling, no new content.' },
    { rule: 'On p. 109 the scan prints « tous- les êtres », an apparent stray compositor hyphen after the determiner. Accept the online transcription’s « tous les êtres » as a documented correction; no other wording changes.' },
    { rule: 'Restore « quelque apparence » (p. 113) and « une âme fût logée » (p. 114) from the selected scans; the online transcription has respectively « quelques apparence » and « une âme fut logée ».' },
    { rule: 'Restore printed « O Dieu ! » and « O atomes intelligents » on p. 118 (online « Ô »); printed « Très-bien, lui répondit l’homme » and « Alors M. Micromégas » on p. 121 (online omits lui and expands the honorific).' }
  ],
  remaining: ['Compare every chapter with the selected edition scan and record page mapping and variants.', 'Assess US and French rights and save documentary evidence.', 'Create canonical version 1 and reviewed passage units only after full source comparison.']
}, null, 2) + '\n');
console.log(JSON.stringify({ chapters: chapters.length, paragraphs: text.length, bytes: Buffer.byteLength(draft, 'utf8'), words: (draft.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length }));
