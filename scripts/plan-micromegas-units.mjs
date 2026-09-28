import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Candidate planning. Chapter-specific thought and dialogue boundaries were
// reviewed against the selected scans; lexical review precedes publication.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const preparation = JSON.parse(readFileSync(resolve(root, 'candidate-preparation.json')));
const source = readFileSync(resolve(root, 'canonical-draft.txt'), 'utf8');
const paragraphs = source.trimEnd().split(/\n\n/u);
const countWords = text => (text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length;
const segmenter = new Intl.Segmenter('fr', { granularity: 'sentence' });
const units = [];
for (const [paragraphIndex, paragraph] of paragraphs.entries()) {
  let pieces = [...segmenter.segment(paragraph)].map(x => x.segment);
  // French honorific M. precedes names and must stay in its sentence.
  for (let index = 0; index + 1 < pieces.length; index++) {
    if (/\bM\.\s*$/u.test(pieces[index])) {
      pieces.splice(index, 2, pieces[index] + pieces[index + 1]);
      index--;
    }
  }
  if (paragraphIndex === 1) {
    const index = pieces.findIndex(p => p.includes('ils trouveront, dis-je'));
    if (index < 0) throw Error('Chapter I geometry sentence changed');
    const pivot = pieces[index].indexOf(' ; ils trouveront, dis-je');
    if (pivot < 0) throw Error('Chapter I geometry clause changed');
    const original = pieces[index];
    pieces.splice(index, 1, original.slice(0, pivot + 2), original.slice(pivot + 2));
  }
  if (paragraphIndex === 4) {
    const index = pieces.findIndex(p => p.includes('à Dieu ne plaise !'));
    if (index < 0 || !pieces[index + 1]?.trimStart().startsWith('mais Micromégas')) throw Error('Chapter I Derham aside changed');
    pieces.splice(index, 2, pieces[index] + pieces[index + 1]);
  }
  if (paragraphIndex === 5 || paragraphIndex === 6) {
    const combine = (startNeedle, endNeedle) => {
      const start = pieces.findIndex(piece => piece.includes(startNeedle));
      const end = pieces.findIndex((piece, index) => index >= start && piece.includes(endNeedle));
      if (start < 0 || end < start) throw Error(`Chapter II dialogue changed: ${startNeedle}`);
      pieces.splice(start, end - start + 1, pieces.slice(start, end + 1).join(''));
    };
    if (paragraphIndex === 5) {
      combine('Après que Son Excellence', 'qu’ai-je à faire de vos brunes');
      combine('dit l’autre. — Elle est donc', 'encore une fois, la nature');
      const attribution = pieces.findIndex(piece => piece.startsWith('dit l’autre. — Elle est donc'));
      if (attribution < 1 || !pieces[attribution - 1].trimEnd().endsWith('vos brunes ?')) throw Error('Chapter II attribution changed');
      const attributionEnd = 'dit l’autre.'.length;
      pieces[attribution - 1] += pieces[attribution].slice(0, attributionEnd);
      pieces[attribution] = pieces[attribution].slice(attributionEnd);
      const imagining = pieces.findIndex(piece => piece.startsWith('Notre imagination va au delà'));
      const pivot = pieces[imagining]?.indexOf('ennuyer. — Je le crois bien');
      if (pivot < 0) throw Error('Chapter II comparison of desires changed');
      const splitAt = pivot + 'ennuyer.'.length;
      const original = pieces[imagining];
      pieces.splice(imagining, 1, original.slice(0, splitAt), original.slice(splitAt));
      combine('« Combien de temps vivez-vous', 'bien peu, répliqua');
      combine('Il faut que ce soit une loi', 'nous ne vivons, dit le Saturnien');
      const closing = pieces.findIndex(piece => piece.startsWith('» Le Saturnien'));
      if (closing < 1 || !pieces[closing - 1].trimEnd().endsWith('pays-là.')) throw Error('Chapter II quote closure changed');
      pieces[closing - 1] += '»';
      pieces[closing] = pieces[closing].slice(1);
    } else {
      const exchange = pieces.findIndex(piece => piece.startsWith('Combien comptez-vous de ces propriétés'));
      const pivot = pieces[exchange]?.indexOf('— Apparemment, répliqua le voyageur');
      if (pivot < 0) throw Error('Chapter II properties exchange changed');
      const original = pieces[exchange];
      pieces.splice(exchange, 1, original.slice(0, pivot), original.slice(pivot));
    }
    for (let index = 1; index < pieces.length; index++) {
      if (pieces[index].trim() === '»') {
        pieces.splice(index - 1, 2, pieces[index - 1] + pieces[index]);
        index--;
      }
    }
  }
  if (paragraphIndex === 8) {
    const start = pieces.findIndex(piece => piece.includes('« Ah !'));
    const end = pieces.findIndex((piece, index) => index >= start && piece.includes('Que veux-tu ?'));
    if (start < 0 || end < start) throw Error('Chapter III complaint changed');
    pieces.splice(start, end - start + 1, pieces.slice(start, end + 1).join(''));
    const closing = pieces.findIndex(piece => piece.startsWith('» Le philosophe'));
    if (closing < 1 || !pieces[closing - 1].trimEnd().endsWith('personne.')) throw Error('Chapter III quote closure changed');
    pieces[closing - 1] += '»';
    pieces[closing] = pieces[closing].slice(1);
  }
  if (paragraphIndex === 13) {
    const dispute = pieces.findIndex(piece => piece.startsWith('Micromégas lui fit sentir poliment'));
    const pivot = pieces[dispute]?.indexOf('— Mais, dit le nain, ce globe-ci');
    if (pivot < 0) throw Error('Chapter IV Saturnian dispute changed');
    const original = pieces[dispute];
    pieces.splice(dispute, 1, original.slice(0, pivot), original.slice(pivot));
    const continuing = pieces.findIndex(piece => piece.startsWith('tout semble être ici dans le chaos'));
    if (continuing < 1 || !pieces[continuing - 1].includes('si ridicule !')) throw Error('Chapter IV continued speech changed');
    pieces.splice(continuing - 1, 2, pieces[continuing - 1] + pieces[continuing]);
    const aside = pieces.findIndex(piece => piece.startsWith('(Il voulait parler des montagnes.)'));
    if (aside < 1) throw Error('Chapter IV narrator aside changed');
    pieces.splice(aside - 1, 2, pieces[aside - 1] + pieces[aside]);
    const exclamation = pieces.findIndex(piece => piece.trim() === 'Eh !');
    if (exclamation < 0 || !pieces[exclamation + 1]?.trimStart().startsWith('c’est peut-être')) throw Error('Chapter IV exclamation changed');
    pieces.splice(exclamation, 2, pieces[exclamation] + pieces[exclamation + 1]);
    const closing = pieces.findIndex(piece => piece.startsWith('» Le Saturnien'));
    if (closing < 1 || !pieces[closing - 1].trimEnd().endsWith('variété ?')) throw Error('Chapter IV quote closure changed');
    pieces[closing - 1] += '»';
    pieces[closing] = pieces[closing].slice(1);
  }
  if (paragraphIndex === 16) {
    const surprise = pieces.findIndex(piece => piece.startsWith('Quel plaisir sentit Micromégas'));
    if (surprise < 0 || !pieces[surprise + 2]?.startsWith('comme il mit avec joie')) throw Error('Chapter V narrator exclamations changed');
    pieces.splice(surprise, 3, pieces.slice(surprise, surprise + 3).join(''));
    const firstClose = pieces.findIndex(piece => piece.startsWith('» En parlant ainsi'));
    if (firstClose < 1 || !pieces[firstClose - 1].trimEnd().endsWith('qui se relèvent.')) throw Error('Chapter V first quote closure changed');
    pieces[firstClose - 1] += '»';
    pieces[firstClose] = pieces[firstClose].slice(1);
    const secondOpen = pieces.findIndex(piece => piece.startsWith('« Ah !'));
    if (secondOpen < 0 || !pieces[secondOpen + 1]?.startsWith('disait-il, j’ai pris')) throw Error('Chapter V second quote changed');
    pieces.splice(secondOpen, 2, pieces[secondOpen] + pieces[secondOpen + 1]);
    const secondClose = pieces.findIndex(piece => piece.startsWith('» Mais il se trompait'));
    if (secondClose < 1 || !pieces[secondClose - 1].trimEnd().endsWith('sur le fait.')) throw Error('Chapter V second quote closure changed');
    pieces[secondClose - 1] += '»';
    pieces[secondClose] = pieces[secondClose].slice(1);
  }
  if (paragraphIndex === 18 || paragraphIndex === 20 || paragraphIndex === 21 || paragraphIndex === 23 || paragraphIndex === 25 || paragraphIndex === 26 || paragraphIndex === 27 || paragraphIndex === 28 || paragraphIndex === 29 || paragraphIndex === 30 || paragraphIndex === 31 || paragraphIndex === 32) {
    // Dialogue closers belong to the speaker, even when the next sentence
    // starts narration. This also avoids zero-word navigation units.
    for (let index = 1; index < pieces.length; index++) {
      if (pieces[index].startsWith('»') && pieces[index - 1].trimEnd().match(/[.!?…]$/u)) {
        pieces[index - 1] += '»';
        pieces[index] = pieces[index].slice(1);
      }
    }
  }
  if (paragraphIndex === 20) {
    const nain = pieces.findIndex(piece => piece.includes('— Mille toises !'));
    const pivot = pieces[nain]?.indexOf('— Mille toises !');
    if (pivot < 0) throw Error('Chapter VI measured giant exchange changed');
    const original = pieces[nain];
    pieces.splice(nain, 1, original.slice(0, pivot), original.slice(pivot));
    const closing = pieces.findIndex(piece => piece.includes('je ne connais pas encore la sienne !'));
    if (closing < nain + 1) throw Error('Chapter VI exclamations changed');
    pieces.splice(nain + 1, closing - nain, pieces.slice(nain + 1, closing + 1).join(''));
    const reply = pieces[nain + 1].indexOf('— Oui, je vous ai mesuré');
    if (reply < 0) throw Error('Chapter VI physicist reply changed');
    const spoken = pieces[nain + 1];
    pieces.splice(nain + 1, 1, spoken.slice(0, reply), spoken.slice(reply));
  }
  if (paragraphIndex === 21) {
    const invocation = pieces.findIndex(piece => piece.trim() === 'O Dieu !');
    if (invocation < 0 || !pieces[invocation + 1]?.trimStart().startsWith('qui avez donné')) throw Error('Chapter VI invocation changed');
    pieces.splice(invocation, 2, pieces[invocation] + pieces[invocation + 1]);
  }
  if (paragraphIndex === 24) {
    if (!pieces[0]?.startsWith('— Ah !') || !pieces[2]?.includes('s’écria le Sirien')) throw Error('Chapter VII indignation changed');
    pieces.splice(0, 3, pieces.slice(0, 3).join(''));
  }
  if (paragraphIndex === 29) {
    const fragment = pieces.findIndex(piece => piece.startsWith('dit le raisonneur'));
    if (fragment < 1 || !pieces[fragment - 1].includes('Que me demandez-vous là ?')) throw Error('Chapter VII Cartesian response changed');
    pieces.splice(fragment - 1, 2, pieces[fragment - 1] + pieces[fragment]);
    const attribution = pieces.findIndex(piece => piece.startsWith('dit le Sirien, cette chose'));
    if (attribution < 1 || !pieces[attribution - 1].trimEnd().endsWith('Eh bien !')) throw Error('Chapter VII matter exchange changed');
    pieces.splice(attribution - 1, 2, pieces[attribution - 1] + pieces[attribution]);
  }
  if (paragraphIndex === 32) {
    const attribution = pieces.findIndex(piece => piece.startsWith('dit-il, je m’en étais bien douté.'));
    if (attribution < 1 || !pieces[attribution - 1].trimEnd().endsWith('« Ah !')) throw Error('Chapter VII final line changed');
    pieces.splice(attribution - 1, 2, pieces[attribution - 1] + pieces[attribution]);
  }
  if (pieces.join('') !== paragraph) throw Error(`Sentence segmentation changed paragraph ${paragraphIndex}`);
  const chapter = preparation.chapters.findLast(c => c.paragraphIndex <= paragraphIndex)?.number;
  for (const piece of pieces) {
    const text = piece.trim();
    if (text) units.push({ ordinal: units.length + 1, chapter, paragraphIndex, text, words: countWords(text) });
  }
}
if (units.reduce((n,u) => n + u.words, 0) !== preparation.canonicalDraft.words) throw Error('Planning units changed word count');
if (units.map(u => u.text).join(' ').replace(/\s+/gu, ' ') !== source.replace(/\s+/gu, ' ').trim()) throw Error('Planning units do not reconstruct the draft');
const passages = [];
for (const chapter of preparation.chapters) {
  const group = units.filter(u => u.chapter === chapter.number);
  const best = Array(group.length + 1).fill(null);
  best[0] = { cost: 0, previous: -1 };
  for (let end = 1; end <= group.length; end++) {
    let words = 0;
    for (let start = end - 1; start >= 0; start--) {
      words += group[start].words;
      if (words > 160) break;
      if (!best[start]) continue;
      const cost = best[start].cost + (words - 115) ** 2 + (words < 80 || words > 150 ? 10000 : 0);
      if (!best[end] || cost < best[end].cost) best[end] = { cost, previous: start, words };
    }
  }
  if (!best[group.length]) throw Error(`Cannot group chapter ${chapter.number}`);
  const selected = [];
  for (let end = group.length; end > 0;) {
    const { previous, words } = best[end];
    selected.unshift({ chapter: chapter.number, firstUnit: group[previous].ordinal, lastUnit: group[end - 1].ordinal, words });
    end = previous;
  }
  for (const passage of selected) passages.push({ ordinal: passages.length + 1, ...passage });
}
const plan = { version: 1, status: 'source_reviewed_unit_and_passage_candidate', sourceSha256: createHash('sha256').update(source).digest('hex'),
  note: 'French sentence segmentation with M. abbreviation repair and chapter-local balanced passage grouping. All seven chapters have manually reviewed dialogue, quote and thought boundaries.',
  chapters: preparation.chapters, units, passages,
  summary: { units: units.length, passages: passages.length, passagesBelow80Words: passages.filter(p=>p.words<80).map(p=>p.ordinal), passagesOver150Words: passages.filter(p=>p.words>150).map(p=>p.ordinal), maximumUnitWords: Math.max(...units.map(u=>u.words)) } };
writeFileSync(resolve(root,'unit-plan.json'), JSON.stringify(plan, null, 2) + '\n');
console.log(JSON.stringify(plan.summary));
