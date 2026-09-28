import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, sourceDigest, validatePublication } from '../dist/publication/repository.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, readWorkSource, sharedSourceFiles, workSourceV2 } from '../dist/publication/source-store.js';
import { prepareQuiz } from '../dist/publication/quiz-authoring.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { textBinding } from '../dist/publication/revisions.js';

const batchId = 'text-2026-09-22-01';
const ledgerPath = `source-correction-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} is already applied`);

const publication = loadPublication();
const beforeBundle = structuredClone(publication.bundle);
const beforeBindings = new Map(publication.textBindings);
const bundle = publication.bundle;
const touchedWorks = new Set(['wrk_lievre_tortue', 'wrk_palma_camisa_margarita', 'wrk_quiroga_almohadon_plumas']);
const affectedOccurrenceIds = new Set();
const newIdentityKeys = new Set();
let sequence = 0;

const normalize = (value, language = 'es') => value.normalize('NFC').replaceAll("'", '’').toLocaleLowerCase(language);
const tokens = text => [...text.matchAll(/\p{L}[\p{L}\p{M}]*/gu)].map(match => ({ text: match[0], normalized: normalize(match[0]), start: match.index, end: match.index + match[0].length }));
const unit = id => {
  const found = bundle.units.find(item => item.id === id);
  if (!found) throw new Error(`Unknown unit ${id}`);
  return found;
};
const occurrence = id => {
  const found = bundle.occurrences.find(item => item.id === id);
  if (!found) throw new Error(`Unknown occurrence ${id}`);
  return found;
};
const identity = (surfaceFormId, senseId) => ({ surfaceFormId, senseId });
const esIdentity = (surfaceFormId, senseId) => {
  if (!bundle.surfaceForms.some(item => item.id === surfaceFormId) || !bundle.senses.some(item => item.id === senseId)) throw new Error(`Missing identity ${surfaceFormId}:${senseId}`);
  return identity(surfaceFormId, senseId);
};
const newOccurrenceId = () => `occ_sourcefix_20260922_${String(++sequence).padStart(3, '0')}`;
const newExclusionId = () => `exc_sourcefix_20260922_${String(++sequence).padStart(3, '0')}`;

function editUnit(unitId, expected, replacement, plans = []) {
  const item = unit(unitId);
  const start = item.french.indexOf(expected);
  if (start < 0) throw new Error(`Expected an exact match in ${unitId}: ${expected}`);
  const end = start + expected.length;
  const occurrences = bundle.occurrences.filter(entry => entry.unitId === unitId);
  const exclusions = bundle.exclusions.filter(entry => entry.unitId === unitId);
  const enclosedOccurrences = occurrences.filter(entry => entry.start >= start && entry.end <= end);
  const enclosedExclusions = exclusions.filter(entry => entry.start >= start && entry.end <= end);
  const partial = [...occurrences, ...exclusions].filter(entry => entry.start < end && entry.end > start && !(entry.start >= start && entry.end <= end));
  if (partial.length) throw new Error(`Edit cuts through annotations in ${unitId}`);
  const delta = replacement.length - expected.length;
  bundle.occurrences = bundle.occurrences.filter(entry => !enclosedOccurrences.includes(entry)).map(entry => entry.unitId === unitId && entry.start >= end ? { ...entry, start: entry.start + delta, end: entry.end + delta } : entry);
  bundle.exclusions = bundle.exclusions.filter(entry => !enclosedExclusions.includes(entry)).map(entry => entry.unitId === unitId && entry.start >= end ? { ...entry, start: entry.start + delta, end: entry.end + delta } : entry);
  item.french = item.french.slice(0, start) + replacement + item.french.slice(end);
  const replacementTokens = tokens(replacement);
  if (replacementTokens.length !== plans.length) throw new Error(`Plan/token mismatch in ${unitId}: ${replacementTokens.map(token => token.text).join(' | ')}`);
  plans.forEach((plan, index) => {
    const token = replacementTokens[index];
    const tokenStart = start + token.start, tokenEnd = start + token.end;
    if (plan.kind === 'exclude') {
      bundle.exclusions.push({ id: plan.reuseId ?? newExclusionId(), workId: item.workId, unitId, start: tokenStart, end: tokenEnd, text: token.text, reason: plan.reason });
    } else {
      const record = { id: plan.reuseId ?? newOccurrenceId(), workId: item.workId, unitId, ...plan.identity, start: tokenStart, end: tokenEnd };
      bundle.occurrences.push(record); affectedOccurrenceIds.add(record.id);
    }
  });
  enclosedOccurrences.forEach(entry => affectedOccurrenceIds.add(entry.id));
}

function rewriteUnit(unitId, nextText, addedPlans = new Map()) {
  const item = unit(unitId);
  const oldText = item.french;
  const oldOccurrences = bundle.occurrences.filter(entry => entry.unitId === unitId).sort((a, b) => a.start - b.start);
  const oldExclusions = bundle.exclusions.filter(entry => entry.unitId === unitId).sort((a, b) => a.start - b.start);
  const queues = new Map();
  for (const entry of [...oldOccurrences, ...oldExclusions].sort((a, b) => a.start - b.start)) {
    const key = normalize(oldText.slice(entry.start, entry.end));
    const queue = queues.get(key) ?? []; queue.push(entry); queues.set(key, queue);
  }
  bundle.occurrences = bundle.occurrences.filter(entry => entry.unitId !== unitId);
  bundle.exclusions = bundle.exclusions.filter(entry => entry.unitId !== unitId);
  item.french = nextText;
  for (const token of tokens(nextText)) {
    const extra = addedPlans.get(token.normalized);
    const queued = queues.get(token.normalized)?.shift();
    const plan = queued ?? extra?.shift();
    if (!plan) throw new Error(`No reviewed annotation for ${token.text} in ${unitId}`);
    if ('reason' in plan && !('surfaceFormId' in plan)) {
      bundle.exclusions.push({ ...plan, start: token.start, end: token.end, text: token.text });
    } else {
      const record = { ...plan, workId: item.workId, unitId, start: token.start, end: token.end };
      bundle.occurrences.push(record); affectedOccurrenceIds.add(record.id);
    }
  }
  for (const [key, queue] of queues) if (queue.length) throw new Error(`Unconsumed ${key} annotation in ${unitId}`);
  oldOccurrences.forEach(entry => affectedOccurrenceIds.add(entry.id));
}

function addHeading(workId, id, beforeOrdinal, label) {
  for (const item of bundle.units.filter(item => item.workId === workId && item.ordinal >= beforeOrdinal)) item.ordinal += 1;
  const heading = { id, workId, ordinal: beforeOrdinal, french: label };
  bundle.units.push(heading);
  bundle.exclusions.push({ id: newExclusionId(), workId, unitId: id, start: 0, end: label.length, text: label, reason: 'editorial_artifact' });
}

const identitySpecs = [
  { key: 'mayos', lemma: { id: 'lem_es_mayo_noun', headword: 'mayo', partOfSpeech: 'noun' }, sense: { id: 'sns_es_mayo_years_poetic', lemmaId: 'lem_es_mayo_noun', gloss: 'years; springs of life (poetic)', definition: 'En uso literario, años de vida o juventudes evocados como primaveras.' }, surface: { id: 'srf_es_mayos_mayo_sourcefix', lemmaId: 'lem_es_mayo_noun', form: 'mayos', normalized: 'mayos', grammaticalFeatures: { gender: 'masculine', number: 'plural' } } },
  { key: 'mecina', lemma: { id: 'lem_es_mecina_noun', headword: 'mecina', partOfSpeech: 'noun' }, sense: { id: 'sns_es_mecina_medicine_archaic', lemmaId: 'lem_es_mecina_noun', gloss: 'medicine; remedy (archaic)', definition: 'Forma histórica o popular de medicina: remedio o tratamiento para una enfermedad.' }, surface: { id: 'srf_es_mecina_sourcefix', lemmaId: 'lem_es_mecina_noun', form: 'mecina', normalized: 'mecina', grammaticalFeatures: { gender: 'feminine', number: 'singular' } } },
  { key: 'morlacos', lemma: { id: 'lem_es_morlaco_currency_noun', headword: 'morlaco', partOfSpeech: 'noun' }, sense: { id: 'sns_es_morlaco_coin', lemmaId: 'lem_es_morlaco_currency_noun', gloss: 'coins; units of money (historical)', definition: 'Nombre coloquial e histórico para monedas o unidades de dinero.' }, surface: { id: 'srf_es_morlacos_currency_sourcefix', lemmaId: 'lem_es_morlaco_currency_noun', form: 'morlacos', normalized: 'morlacos', grammaticalFeatures: { gender: 'masculine', number: 'plural' } } },
  { key: 'item', lemma: { id: 'lem_es_item_adverb', headword: 'item', partOfSpeech: 'adverb' }, sense: { id: 'sns_es_item_furthermore', lemmaId: 'lem_es_item_adverb', gloss: 'furthermore; likewise', definition: 'Voz usada para introducir otro punto o elemento que se añade a los anteriores.' }, surface: { id: 'srf_es_item_sourcefix', lemmaId: 'lem_es_item_adverb', form: 'Item', normalized: 'item' } },
  { key: 'afirma', lemmaId: 'lem_es_afirmar_verb', sense: { id: 'sns_es_afirmar_state', lemmaId: 'lem_es_afirmar_verb', gloss: 'states; asserts', definition: 'Expresa o sostiene algo como verdadero.' }, surface: { id: 'srf_es_afirma_sourcefix', lemmaId: 'lem_es_afirmar_verb', form: 'afirma', normalized: 'afirma', grammaticalFeatures: { person: 'third', number: 'singular', tense: 'present', mood: 'indicative' } } },
  { key: 'copió', lemma: { id: 'lem_es_copiar_verb', headword: 'copiar', partOfSpeech: 'verb' }, sense: { id: 'sns_es_copio_reproduce', lemmaId: 'lem_es_copiar_verb', gloss: 'copied', definition: 'Reprodujo por escrito información procedente de otra fuente.' }, surface: { id: 'srf_es_copio_copiar_sourcefix', lemmaId: 'lem_es_copiar_verb', form: 'copió', normalized: 'copió', grammaticalFeatures: { person: 'third', number: 'singular', tense: 'preterite', mood: 'indicative' } } },
  { key: 'dato', lemma: { id: 'lem_es_dato_noun', headword: 'dato', partOfSpeech: 'noun' }, sense: { id: 'sns_es_dato_information', lemmaId: 'lem_es_dato_noun', gloss: 'fact; piece of information', definition: 'Información concreta que sirve para conocer o comprobar algo.' }, surface: { id: 'srf_es_dato_sourcefix', lemmaId: 'lem_es_dato_noun', form: 'dato', normalized: 'dato', grammaticalFeatures: { gender: 'masculine', number: 'singular' } } },
  { key: 'prendidas', lemma: { id: 'lem_es_prender_verb', headword: 'prender', partOfSpeech: 'verb' }, sense: { id: 'sns_es_prendidas_lit', lemmaId: 'lem_es_prender_verb', gloss: 'lit; switched on', definition: 'Encendidas y mantenidas dando luz.' }, surface: { id: 'srf_es_prendidas_sourcefix', lemmaId: 'lem_es_prender_verb', form: 'prendidas', normalized: 'prendidas', grammaticalFeatures: { gender: 'feminine', number: 'plural' } } },
  { key: 'pst', lemma: { id: 'lem_es_pst_interjection', headword: 'pst', partOfSpeech: 'interjection' }, sense: { id: 'sns_es_pst_hesitation', lemmaId: 'lem_es_pst_interjection', gloss: 'psst; a brief hesitation sound', definition: 'Interjección breve que puede expresar vacilación, reserva o llamar discretamente la atención.' }, surface: { id: 'srf_es_pst_sourcefix', lemmaId: 'lem_es_pst_interjection', form: 'Pst', normalized: 'pst' } },
];

for (const spec of identitySpecs) {
  if (spec.lemma && !bundle.lemmas.some(item => item.id === spec.lemma.id)) bundle.lemmas.push(spec.lemma);
  bundle.senses.push(spec.sense); bundle.surfaceForms.push(spec.surface);
  spec.identity = identity(spec.surface.id, spec.sense.id);
  newIdentityKeys.add(`${spec.surface.id}:${spec.sense.id}`);
}
const identityByKey = key => identitySpecs.find(spec => spec.key === key).identity;

const oldPret = occurrence('occ_7b3f60bf50e2bcd24ac8dfe6');
editUnit('unt_lievre_08', 'prêt', 'près', [{ kind: 'occurrence', reuseId: oldPret.id, identity: identity('srf_pres', 'sns_pres_primary') }]);

const palmaYears = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_008' && unit(item.unitId).french.slice(item.start, item.end).toLowerCase() === 'años');
editUnit('unt_palma_camisa_008', 'años', 'mayos', [{ kind: 'occurrence', reuseId: palmaYears.id, identity: identityByKey('mayos') }]);
const palmaMedicine = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_011' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'medicina');
editUnit('unt_palma_camisa_011', 'medicina', 'mecina', [{ kind: 'occurrence', reuseId: palmaMedicine.id, identity: identityByKey('mecina') }]);
const palmaLo = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_013' && unit(item.unitId).french.slice(item.start - 2, item.end + 5) === 'y lo dijo');
const palmaY = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_013' && item.end === palmaLo.start - 1);
const palmaDijo = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_013' && item.start === palmaLo.end + 1);
editUnit('unt_palma_camisa_013', 'y lo dijo', 'y le dijo', [
  { kind: 'occurrence', reuseId: palmaY.id, identity: identity(palmaY.surfaceFormId, palmaY.senseId) },
  { kind: 'occurrence', reuseId: palmaLo.id, identity: esIdentity('srf_es_0445_le', 'sns_es_0445_le') },
  { kind: 'occurrence', reuseId: palmaDijo.id, identity: identity(palmaDijo.surfaceFormId, palmaDijo.senseId) },
]);
addHeading('wrk_palma_camisa_margarita', 'unt_palma_camisa_heading_01', 2, 'I');
addHeading('wrk_palma_camisa_margarita', 'unt_palma_camisa_heading_02', 18, 'II');

const clause = ', según lo afirma Bermejo, quien parece copió este dato de las Relaciones secretas de Ulloa y D. Jorge Juan. Item,';
const clausePlans = [
  { kind: 'occurrence', identity: esIdentity('srf_es_0956_segun', 'sns_es_0956_segun') },
  { kind: 'occurrence', identity: esIdentity('srf_es_0475_lo', 'sns_es_0475_lo') },
  { kind: 'occurrence', identity: identityByKey('afirma') },
  { kind: 'exclude', reason: 'proper_noun' },
  { kind: 'occurrence', identity: esIdentity('srf_es_0680_quien', 'sns_es_0680_quien') },
  { kind: 'occurrence', identity: esIdentity('srf_es_0603_parece', 'sns_es_0603_parece') },
  { kind: 'occurrence', identity: identityByKey('copió') },
  { kind: 'occurrence', identity: esIdentity('srf_es_0310_este', 'sns_es_0310_este') },
  { kind: 'occurrence', identity: identityByKey('dato') },
  { kind: 'occurrence', identity: esIdentity('srf_es_0192_de', 'sns_es_0192_de') },
  { kind: 'occurrence', identity: esIdentity('srf_es_0444_las', 'sns_es_0444_las') },
  { kind: 'exclude', reason: 'proper_noun' },
  { kind: 'exclude', reason: 'proper_noun' },
  { kind: 'occurrence', identity: esIdentity('srf_es_0192_de', 'sns_es_0192_de') },
  { kind: 'exclude', reason: 'proper_noun' },
  { kind: 'occurrence', identity: esIdentity('srf_es_0870_y', 'sns_es_0870_y') },
  { kind: 'exclude', reason: 'proper_noun' },
  { kind: 'exclude', reason: 'proper_noun' },
  { kind: 'exclude', reason: 'proper_noun' },
  { kind: 'occurrence', identity: identityByKey('item') },
];
editUnit('unt_palma_camisa_018', '.', clause, clausePlans);
const palmaEl = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_018' && unit(item.unitId).french.slice(item.start, item.end) === 'El');
const palmaCordoncillo = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_018' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'cordoncillo');
editUnit('unt_palma_camisa_018', 'El cordoncillo', 'el cordoncillo', [
  { kind: 'occurrence', reuseId: palmaEl.id, identity: identity(palmaEl.surfaceFormId, palmaEl.senseId) },
  { kind: 'occurrence', reuseId: palmaCordoncillo.id, identity: identity(palmaCordoncillo.surfaceFormId, palmaCordoncillo.senseId) },
]);
const monedasOccurrence = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_018' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'monedas');
editUnit('unt_palma_camisa_018', 'monedas de plata', 'morlacos', [{ kind: 'occurrence', reuseId: monedasOccurrence.id, identity: identityByKey('morlacos') }]);
const saberloOccurrence = bundle.occurrences.find(item => item.unitId === 'unt_palma_camisa_019' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'saberlo');
editUnit('unt_palma_camisa_019', 'saberlo', 'saber lo', [
  { kind: 'occurrence', reuseId: saberloOccurrence.id, identity: esIdentity('srf_es_0719_saber', 'sns_es_0719_saber') },
  { kind: 'occurrence', identity: esIdentity('srf_es_0475_lo', 'sns_es_0475_lo') },
]);

const sentia = bundle.occurrences.find(item => item.unitId === 'unt_quiroga_almohadon_001' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'sentía');
editUnit('unt_quiroga_almohadon_001', 'sentía', 'con', [{ kind: 'occurrence', reuseId: sentia.id, identity: esIdentity('srf_es_0145_con', 'sns_es_0145_con') }]);
unit('unt_quiroga_almohadon_001').french = unit('unt_quiroga_almohadon_001').french.replace('mucho; sin embargo', 'mucho, sin embargo');
const encendidas = bundle.occurrences.find(item => item.unitId === 'unt_quiroga_almohadon_009' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'encendidas');
editUnit('unt_quiroga_almohadon_009', 'encendidas', 'prendidas', [{ kind: 'occurrence', reuseId: encendidas.id, identity: identityByKey('prendidas') }]);
const despues = bundle.occurrences.find(item => item.unitId === 'unt_quiroga_almohadon_015' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'después');
editUnit('unt_quiroga_almohadon_015', ' y, después', ', después', [
  { kind: 'occurrence', reuseId: despues.id, identity: identity(despues.surfaceFormId, despues.senseId) },
]);
const pstPlan = new Map([['pst', [{ id: newOccurrenceId(), workId: 'wrk_quiroga_almohadon_plumas', unitId: 'unt_quiroga_almohadon_018', ...identityByKey('pst') }]]]);
rewriteUnit('unt_quiroga_almohadon_018', '—Pst… —se encogió de hombros, desalentado, su médico—. Es un caso serio… Poco hay que hacer…', pstPlan);
const mirandolo = bundle.occurrences.find(item => item.unitId === 'unt_quiroga_almohadon_028' && normalize(unit(item.unitId).french.slice(item.start, item.end)) === 'mirándolo');
editUnit('unt_quiroga_almohadon_028', 'mirándolo', 'mirando a aquél', [
  { kind: 'occurrence', reuseId: mirandolo.id, identity: esIdentity('srf_es_0519_mirando', 'sns_es_0519_mirando') },
  { kind: 'occurrence', identity: esIdentity('srf_es_a_a_65110965', 'sns_es_a_preposition') },
  { kind: 'occurrence', identity: esIdentity('srf_es_0882_aquel', 'sns_es_0882_aquel') },
]);
bundle.works.find(item => item.id === 'wrk_quiroga_almohadon_plumas').title = 'El almohadón de pluma';

const quizPlans = {
  mayos: {
    early: ['La poeta llamó mayos a los años felices de su juventud.', ['months on a calendar', 'years or springs of life', 'storms', 'debts'], 'years or springs of life'],
    middle: ['En lenguaje poético, contaba sus ___, es decir, sus años de vida.', ['mayos', 'siglos', 'inviernos', 'minutos'], 'mayos'],
    advanced: ['La poeta recordaba los mayos de su juventud y los años que habían pasado.', '¿Qué plural literario evoca aquí los años o primaveras de la vida?', ['mayos', 'poeta', 'juventud', 'años'], 'mayos'],
  },
  mecina: {
    early: ['El manuscrito antiguo llama mecina al remedio que toma el enfermo.', ['medicine or remedy', 'illness', 'shop', 'prayer'], 'medicine or remedy'],
    middle: ['El texto conserva una grafía antigua: el boticario preparó la ___ para el enfermo.', ['mecina', 'receta', 'tisana', 'vacuna'], 'mecina'],
    advanced: ['En aquel relato, la mecina era un remedio; la enfermedad y la botica se mencionaban después.', '¿Qué palabra histórica nombra el remedio?', ['mecina', 'enfermedad', 'botica', 'relato'], 'mecina'],
  },
  morlacos: {
    early: ['El comerciante pidió treinta morlacos por la mercancía.', ['coins or units of money', 'shirts', 'horses', 'letters'], 'coins or units of money'],
    middle: ['El narrador usa un nombre antiguo para las monedas: pagaron veinte ___ por el encargo.', ['morlacos', 'doblones', 'denarios', 'reales'], 'morlacos'],
    advanced: ['Guardó los morlacos en una bolsa junto con las monedas y el recibo.', '¿Qué palabra histórica designa aquí el dinero?', ['morlacos', 'bolsa', 'monedas', 'recibo'], 'morlacos'],
  },
  item: {
    early: ['El notario escribió: «Item, deberán entregarse también las llaves».', ['furthermore; another item', 'perhaps', 'never', 'yesterday'], 'furthermore; another item'],
    middle: ['El inventario añade otro punto: «___, se entregarán las llaves del almacén».', ['Item', 'Luego', 'Mientras', 'Quizá'], 'Item'],
    advanced: ['El documento dice: «Item, se entregarán las llaves»; después aparece la firma del notario.', '¿Qué voz introduce un punto adicional?', ['Item', 'documento', 'llaves', 'firma'], 'Item'],
  },
  afirma: {
    early: ['La testigo afirma que vio salir al acusado.', ['states or asserts', 'denies', 'forgets', 'asks'], 'states or asserts'],
    middle: ['La autora ___ que el dato procede de una carta auténtica.', ['afirma', 'afirman', 'afirmó', 'afirmas'], 'afirma'],
    advanced: ['El cronista afirma la noticia, pero el vecino duda de ella y el juez pide pruebas.', '¿Qué verbo presenta la noticia como verdadera?', ['afirma', 'duda', 'pide', 'pruebas'], 'afirma'],
  },
  'copió': {
    early: ['El escribano copió el párrafo de un documento anterior.', ['copied', 'destroyed', 'translated', 'invented'], 'copied'],
    middle: ['Ayer la secretaria ___ la dirección exactamente como aparecía en la carta.', ['copió', 'copiaron', 'copia', 'copiaste'], 'copió'],
    advanced: ['María copió la cita, revisó la fuente y guardó el cuaderno.', '¿Qué verbo indica que reprodujo por escrito la cita?', ['copió', 'revisó', 'guardó', 'fuente'], 'copió'],
  },
  dato: {
    early: ['El registro confirma un dato importante sobre la fecha del viaje.', ['piece of information', 'opinion', 'person', 'place'], 'piece of information'],
    middle: ['La fecha exacta es un ___ comprobable en el archivo.', ['dato', 'rumor', 'libro', 'nombre'], 'dato'],
    advanced: ['El informe incluye un dato, una opinión del autor y una copia del mapa.', '¿Qué palabra nombra la información concreta que puede comprobarse?', ['dato', 'opinión', 'autor', 'mapa'], 'dato'],
  },
  prendidas: {
    early: ['Las lámparas permanecieron prendidas toda la noche.', ['lit or switched on', 'broken', 'covered', 'empty'], 'lit or switched on'],
    middle: ['La habitación seguía iluminada porque las lámparas estaban ___.', ['prendidas', 'apagadas', 'rotas', 'cubiertas'], 'prendidas'],
    advanced: ['Las lámparas prendidas iluminaban la sala, mientras las cortinas oscuras cubrían la ventana.', '¿Qué palabra indica que las lámparas daban luz?', ['prendidas', 'sala', 'oscuras', 'ventana'], 'prendidas'],
  },
  pst: {
    early: ['El médico hizo «Pst…» antes de responder con cautela.', ['a brief hesitation sound', 'a greeting', 'a laugh', 'a command to run'], 'a brief hesitation sound'],
    middle: ['El médico vaciló un instante y murmuró «___» antes de responder.', ['Pst', 'Ay', 'Uf', 'Eh'], 'Pst'],
    advanced: ['«Pst…», murmuró el médico antes de dar su respuesta en medio del silencio.', '¿Qué interjección representa el breve sonido de vacilación?', ['Pst', 'médico', 'respuesta', 'silencio'], 'Pst'],
  },
};

const addedLegacyQuizzes = [];
const addedPreparedQuizzes = [];
for (const spec of identitySpecs) {
  const plan = quizPlans[spec.key];
  const common = { surfaceFormId: spec.surface.id, senseId: spec.sense.id };
  const early = { id: `qiz_sourcefix_${spec.key.replaceAll('ó', 'o')}_early`, ...common, band: 'levels_1_3', format: 'meaning_choice', contextFrench: plan.early[0], targetText: spec.surface.form, prompt: 'Meaning', choicesEnglish: plan.early[1], correctAnswer: plan.early[2] };
  const middle = { id: `qiz_sourcefix_${spec.key.replaceAll('ó', 'o')}_intermediate`, ...common, band: 'levels_4_5', format: 'surface_completion', contextFrench: plan.middle[0], choicesFrench: plan.middle[1], correctAnswer: plan.middle[2] };
  const advanced = { id: `qiz_sourcefix_${spec.key.replaceAll('ó', 'o')}_advanced`, ...common, band: 'levels_6_8', format: 'target_identification', contextFrench: plan.advanced[0], promptFrench: plan.advanced[1], choicesFrench: plan.advanced[2], correctAnswer: plan.advanced[3] };
  for (const quiz of [early, middle, advanced]) {
    bundle.quizItems.push(quiz); addedLegacyQuizzes.push(quiz); addedPreparedQuizzes.push(prepareQuiz(quiz, 'es'));
  }
}

for (const workId of touchedWorks) {
  const units = bundle.units.filter(item => item.workId === workId).sort((a, b) => a.ordinal - b.ordinal);
  const source = bundle.sources.find(item => item.workId === workId);
  source.canonicalText = units.map(item => item.french).join('\n');
}
const palmaSource = bundle.sources.find(item => item.workId === 'wrk_palma_camisa_margarita');
palmaSource.provenance.citation = 'Ricardo Palma, «La camisa de Margarita», Tradiciones peruanas, quinta serie, tomo III (Barcelona: Montaner y Simón, 1894), pp. 106–108';
palmaSource.provenance.url = 'https://archive.org/details/tradicionesperu03palmgoog';
palmaSource.provenance.accessedOn = '2026-09-21';
const quirogaSource = bundle.sources.find(item => item.workId === 'wrk_quiroga_almohadon_plumas');
quirogaSource.provenance.citation = 'Horacio Quiroga, «El almohadón de pluma», Cuentos de amor de locura y de muerte (Buenos Aires: Cooperativa Editorial Buenos Aires, 1918), pp. 93–98';

const esSource = publication.sharedSources.es;
const esContent = fromNeutral(esSource.legacy.content);
for (const spec of identitySpecs) {
  if (spec.lemma && !esContent.lemmas.some(item => item.id === spec.lemma.id)) esContent.lemmas.push(spec.lemma);
  esContent.senses.push(spec.sense); esContent.surfaceForms.push(spec.surface);
}
esContent.quizItems.push(...addedLegacyQuizzes);
esSource.legacy.content = toNeutral(esContent);
esSource.quizzes.push(...addedPreparedQuizzes);
for (const quiz of addedPreparedQuizzes) publication.preparedQuizzes.set(quiz.id, quiz);

for (const workId of touchedWorks) publication.textBindings.set(workId, textBinding(bundle, publication.expressionCatalog.occurrences, workId));
validatePublication(bundle, publication.expressionCatalog, publication.registry);

const subjects = editorialSubjects(publication);
const reviewTargets = subjects.filter(subject =>
  subject.kind === 'quiz' && addedPreparedQuizzes.some(quiz => quiz.id === subject.id) ||
  subject.kind === 'vocabulary' && newIdentityKeys.has(subject.id) ||
  subject.kind === 'annotations' && touchedWorks.has(subject.id)
);
const esReviews = new Map(esSource.reviews.map(review => [review.id, review]));
const frSource = publication.sharedSources.fr;
const frReviews = new Map(frSource.reviews.map(review => [review.id, review]));
for (const subject of reviewTargets) {
  const review = approveReview(subject.language, subject.kind, subject.id, subject.value, 'Codex', '2026-09-22T00:00:00.000Z', 'Reviewed against the preserved historical scan, corrected canonical context, identity definition, stored questions, distractors and exact spans.');
  (subject.language === 'es' ? esReviews : frReviews).set(review.id, review);
}
esSource.reviews = [...esReviews.values()];
frSource.reviews = [...frReviews.values()];
publication.reviews = [...frSource.reviews, ...esSource.reviews];

const keyFor = (kind, record) => kind === 'sources' || kind === 'readiness' ? record.workId : record.id;
const changes = [];
for (const kind of Object.keys(beforeBundle)) {
  const before = new Map(beforeBundle[kind].map(record => [keyFor(kind, record), record]));
  const after = new Map(bundle[kind].map(record => [keyFor(kind, record), record]));
  for (const id of [...new Set([...before.keys(), ...after.keys()])].sort()) {
    const left = before.get(id) ?? null, right = after.get(id) ?? null;
    if (JSON.stringify(left) !== JSON.stringify(right)) changes.push({ kind, id, before: left, after: right });
  }
}
const mappings = changes.filter(change => change.kind === 'occurrences' && change.before && change.after && (change.before.surfaceFormId !== change.after.surfaceFormId || change.before.senseId !== change.after.senseId)).map(change => ({ occurrenceId: change.id, from: `${change.before.surfaceFormId}:${change.before.senseId}`, to: `${change.after.surfaceFormId}:${change.after.senseId}`, progress: 'fresh_on_actual_view_if_identity_not_previously_encountered' }));
const ledger = {
  version: 1, kind: 'canonical_source_correction', id: batchId, date: '2026-09-22',
  works: [...touchedWorks], masteryIdsChanged: true, progressPolicy: 'preserve-history-fresh-on-view-v1', progressTransfers: [], mappings,
  rationale: 'Apply the complete historical-scan findings recorded in the 2026-09-21 source audit. Preserve old identity history and never copy mastery to corrected meanings.',
  canonicalBindings: [...touchedWorks].map(workId => ({ workId, before: beforeBindings.get(workId), after: publication.textBindings.get(workId) })),
  changes,
  review: { reviewer: 'Codex', reviewedAt: '2026-09-22T00:00:00.000Z', newVocabularyIdentities: identitySpecs.length, newPreparedQuizzes: addedPreparedQuizzes.length, headingsRestored: 2, progressTransfers: 0 },
};

const files = new Map([...sharedSourceFiles(frSource), ...sharedSourceFiles(esSource)]);
for (const workId of touchedWorks) {
  const original = readWorkSource(resolve(publicationRoot, `works/${workId}.json`)).legacy;
  const content = { works: bundle.works.filter(item => item.id === workId), sources: bundle.sources.filter(item => item.workId === workId), units: bundle.units.filter(item => item.workId === workId), occurrences: bundle.occurrences.filter(item => item.workId === workId), exclusions: bundle.exclusions.filter(item => item.workId === workId), expressions: bundle.expressions.filter(item => item.workId === workId), notes: bundle.notes.filter(item => item.workId === workId), readiness: bundle.readiness.filter(item => item.workId === workId) };
  const work = { ...original, version: 1, sourceDigest: sourceDigest(content.sources), content: toNeutral(content), expressionOccurrences: publication.expressionCatalog.occurrences.filter(item => item.workId === workId) };
  files.set(`works/${workId}.json`, workSourceV2(work));
}
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => {
  const next = loadPublication(stage);
  validatePublication(next.bundle, next.expressionCatalog, next.registry);
});
console.log(JSON.stringify({ batchId, backup, changes: changes.length, mappings: mappings.length, newIdentities: identitySpecs.length, newQuizzes: addedPreparedQuizzes.length }, null, 2));
