import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { sharedSourceFiles, adoptSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-review-2026-09-25-23';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw Error('Review batch exists');
const entries = [
  { id: 'srf_zola_ouvrir_ouvrir:sns_zola_ouvrir_begin', count: 2, rationale: '« ouvrir une enquête » initiates an inquiry and Cendrillon « leur alla ouvrir » opens the door for the sisters. The inclusive open/begin meaning covers both indexed spans; the three questions test a door, a window, and an inquiry without confusing the senses.' },
  { id: 'srf_zola_ouvert_ouvrir:sns_zola_ouvrir_begin', count: 1, rationale: '« aurait ouvert la frontière à l’ennemi » means would have opened the frontier to the enemy. The past participle and its three question contexts each test opening an access point or beginning an inquiry.' },
  { id: 'srf_zola_en_en:sns_zola_en_outre', count: 1, rationale: 'Zola adds « en outre, que tous appartenaient aux bureaux de la guerre » to an earlier observation. The three questions distinguish en outre, meaning in addition, from contrast and from other uses of en.' },
  { id: 'srf_zola_en_en:sns_zola_en_situation', count: 1, rationale: '« Quand une société en est là » places society at a particular state in its progression. The three questions test en in this progress/state construction rather than a place or an object pronoun.' },
  { id: 'srf_zola_m_1710d8e628ea_me_pronoun:sns_zola_me_first_person', count: 6, rationale: 'The six indexed elided m’ spans in four works are first-person object or reflexive pronouns: « m’épargnez », « m’empêcher », « m’expose », « m’avez », « m’ennuie », and « m’as prêtée ». The three questions all select the matching first-person singular pronoun.' },
  { id: 'srf_cendrillon_belles_lem_beau_0b0c6d52e0:sns_cendrillon_beau_d_aspect_agreable_a_l_il_ou_a_l_oreille_3b802582d6', count: 3, rationale: 'Cendrillon’s « belles moustaches », « étoffes assez belles », and vocative « Belles » all describe attractive appearance or address attractive women. The three feminine plural questions test the same adjective form and appearance sense.' },
  { id: 'srf_zola_choses_chose:sns_zola_chose_thing', count: 8, rationale: 'The eight indexed plural choses spans cover concrete or abstract things, including the dangerous matters in J’Accuse, household features in La Parure, and « en toutes choses » or « sur toutes choses » in Cendrillon. The broad thing/matter sense and three plural-noun questions fit these contexts.' },
  { id: 'srf_zola_mettant_mettre:sns_zola_mettre_place', count: 1, rationale: '« quelques galonnés mettant leurs bottes sur la nation » uses putting their boots on the nation as an image of domination. The physical action of putting is retained in the metaphor; the three questions test that participial verb with distinct contexts.' },
  { id: 'srf_zola_met_mettre:sns_zola_mettre_place', count: 1, rationale: '« le met au secret » means puts Dreyfus in isolation. The put/place meaning applies to this causative placement; the three questions test the present third-person form and the same core verb.' },
  { id: 'srf_zola_avaient_avoir:sns_zola_avoir_possess_auxiliary', count: 4, rationale: 'The four avaient spans include the auxiliary in « ne l’avaient pas chargé », « avaient perdu » and « avaient tout restitué », plus the construction « avaient lieu ». The shared sense explicitly covers avoir as an auxiliary or have, and the three existing questions correctly test the past plural form.' },
];
if (entries.length !== 10) throw Error('Batch must contain exactly ten identities');
const publication = loadPublication();
const subjects = new Map(editorialSubjects(publication).filter(s => s.kind === 'vocabulary' && s.language === 'fr').map(s => [s.id, s]));
const pending = new Set(auditEditorialQuality(publication).filter(i => i.kind === 'vocabulary' && i.language === 'fr').map(i => i.id));
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const changes = [];
for (const entry of entries) {
  const subject = subjects.get(entry.id);
  if (!subject || !pending.has(entry.id) || subject.value.occurrences.length !== entry.count) throw Error(`Source changed: ${entry.id}`);
  const questions = source.quizzes.filter(q => q.subject.kind === 'vocabulary' && `${q.subject.surfaceFormId}:${q.subject.senseId}` === entry.id);
  if (questions.length !== 3 || new Set(questions.map(q => q.band)).size !== 3) throw Error(`Question family changed: ${entry.id}`);
  const reviewId = `vocabulary:${entry.id}`, before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', entry.id, subject.value, 'Codex offline contextual review', new Date().toISOString(), entry.rationale);
  reviews.set(reviewId, after);
  changes.push({ subjectId: entry.id, reviewId, outcome: 'approve', rationale: entry.rationale, before, after, reviewedOccurrences: entry.count });
}
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'all indexed occurrences and three question bands reviewed for each identity', changes });
adoptSourceFiles(publicationRoot, files, root => {
  const candidate = loadPublication(root);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
  if (auditEditorialQuality(candidate).some(issue => issue.kind === 'vocabulary' && entries.some(entry => entry.id === issue.id))) throw Error('Reviewed record still pending');
});
console.log(JSON.stringify({ batchId, approved: changes.length, inspectedOccurrences: changes.reduce((n, c) => n + c.reviewedOccurrences, 0) }));
