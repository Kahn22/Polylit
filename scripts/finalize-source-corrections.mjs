import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';

const root = resolve(import.meta.dirname, '..');
const publication = loadPublication();
const workIds = ['wrk_lievre_tortue', 'wrk_palma_camisa_margarita', 'wrk_quiroga_almohadon_plumas'];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const scopeNotes = {
  wrk_lievre_tortue: 'Complete fable body aligned to the selected 1874 witness, with documented presentation-only typography normalization. Title, author attribution, page headers, page numbers, illustrations, catchwords and publisher matter remain catalog or excluded material.',
  wrk_palma_camisa_margarita: 'Complete story body from the selected 1894 witness, including the printed I/II section labels and the Bermejo/Ulloa/Jorge Juan attribution. Page furniture and nonsemantic layout are excluded; documented routine typography normalization remains.',
  wrk_quiroga_almohadon_plumas: 'Complete story body aligned to the selected 1918 witness. The catalog uses the witness’s singular title. Page furniture and nonsemantic layout are excluded; documented routine typography normalization remains.',
};

const impacts = {
  wrk_lievre_tortue: 'Corrected prêt to près and reassigned that occurrence to the existing près identity. Historical prêt mastery remains in learner history and is not transferred.',
  wrk_palma_camisa_margarita: 'Restored historical wording, two section labels and the omitted attribution. Nine restored lexical identities across the corrected Spanish works have reviewed three-level quizzes; prior identities remain in history and no progress was copied.',
  wrk_quiroga_almohadon_plumas: 'Restored the 1918 wording and singular catalog title. Corrected occurrences use reviewed identities; prior identities remain in history and no progress was copied.',
};

for (const workId of workIds) {
  const folder = resolve(root, 'content/sources', workId);
  const dossierPath = resolve(folder, 'dossier.json');
  const canonicalPath = resolve(folder, 'canonical.txt');
  const transformsPath = resolve(folder, 'reviewed-transformations.json');
  const dossier = readJson(dossierPath);
  const source = publication.bundle.sources.find(item => item.workId === workId);
  const units = publication.bundle.units.filter(item => item.workId === workId);
  if (!source) throw new Error(`Missing source ${workId}`);

  const oldCanonical = resolve(folder, 'canonical-v1.txt');
  const priorDossier = resolve(folder, 'history-v2.json');
  if (!existsSync(oldCanonical)) copyFileSync(canonicalPath, oldCanonical);
  if (!existsSync(priorDossier)) copyFileSync(dossierPath, priorDossier);
  writeFileSync(canonicalPath, source.canonicalText);

  const transformations = readJson(transformsPath);
  transformations.reviewedOn = '2026-09-22';
  transformations.textChanged = true;
  transformations.changes = transformations.changes.map(change => change.status === 'requires_correction'
    ? { ...change, status: 'implemented_2026-09-22', implementedAs: change.from, publicationBatch: 'text-2026-09-22-01' }
    : change);
  transformations.note = 'The historical-witness corrections identified on 2026-09-21 were implemented atomically in publication batch text-2026-09-22-01. Remaining entries document approved presentation-only transformations or resolved transcription artifacts.';
  writeJson(transformsPath, transformations);

  const canonical = readFileSync(canonicalPath);
  dossier.canonical = {
    ...dossier.canonical,
    sha256: sha256(canonical),
    characters: source.canonicalText.length,
    scope: 'selected_historical_witness_with_documented_typography_normalization',
    scopeVerification: 'verified',
    unitCount: units.length,
    version: 2,
    scopeNote: scopeNotes[workId],
  };
  dossier.transformations = { ...dossier.transformations, status: 'verified', canonicalChangedInThisMigration: true };
  dossier.review = {
    ...dossier.review,
    status: 'verified',
    reviewedOn: '2026-09-22',
    checks: [
      ...dossier.review.checks,
      'Applied every recorded historical-witness correction in atomic publication batch text-2026-09-22-01.',
      'Revalidated occurrence spans, exclusions, semantic identities, three-level quizzes and canonical text binding after correction.',
      'Preserved prior learner history without transferring mastery to changed meanings.',
    ],
    openIssues: [],
  };
  dossier.history.push({
    version: 3,
    date: '2026-09-22',
    reason: 'Apply all visually verified historical-witness corrections and close the source-review queue.',
    previousRecord: 'history-v2.json',
    publicationBatch: 'content/published/source-correction-batches/text-2026-09-22-01.json',
    textChanged: true,
    learnerImpact: impacts[workId],
  });
  if (workId === 'wrk_quiroga_almohadon_plumas') {
    dossier.identity.title = 'El almohadón de pluma';
    dossier.edition.titleVariants.currentCatalog = 'El almohadón de pluma';
  }

  dossier.evidence = readdirSync(folder)
    .filter(file => file !== 'dossier.json' && statSync(resolve(folder, file)).isFile())
    .sort()
    .map(file => {
      const bytes = readFileSync(resolve(folder, file));
      return { file, sha256: sha256(bytes), bytes: bytes.length };
    });
  writeJson(dossierPath, dossier);
}

console.log(`Finalized ${workIds.length} source dossiers for text-2026-09-22-01.`);
