import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

// Authored offline. Exact form indexing supports review; it never grants
// identity or question approval or changes the current learner bundle.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const previous = [1, 2, 3, 4, 5, 6, 7].flatMap(n => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-0${n}.json`))).items);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'planetes_worlds', form: 'planètes', lemma: 'planète', partOfSpeech: 'noun feminine plural', meaning: 'planets; worlds orbiting a star', note: 'A planet around Sirius introduces the setting; the singular planète in later chapters needs a separate surface-form review.',
    q13: ['Ces planètes tournent autour d’une étoile.', 'planets', 'mountains', 'rivers', 'forests'],
    q45: ['Ces grandes sphères tournent autour d’une étoile : ce sont des ___.', 'planètes', 'montagnes', 'rivières', 'forêts'],
    q68: ['Les planètes tournent autour de leur étoile. Les montagnes dominent le paysage, les rivières traversent les plaines et les forêts couvrent les collines.', 'Quel mot désigne les mondes qui tournent autour d’une étoile ?', 'planètes', 'montagnes', 'rivières', 'forêts'] },
  { key: 'tournent_orbit', form: 'tournent', lemma: 'tourner', partOfSpeech: 'verb present third plural', meaning: 'revolve; orbit around', note: 'The planets move around Sirius, distinct from merely turning one’s body. Existing lem_parure_tourner_verb_b69185be96 / sns_parure_tourner_mouvoir_en_rond_par_un_mouvement_circulaire_ou_en_ligne_courbe_autour_d_un_axe_de_rotation_219c87f17f requires semantic comparison.',
    q13: ['Les planètes tournent autour de leur étoile.', 'orbit', 'stop', 'fall', 'shine'],
    q45: ['Sur leurs orbites, ces planètes ___ autour de l’étoile.', 'tournent', 's’arrêtent', 'disparaissent', 's’éteignent'],
    q68: ['Les planètes tournent autour de l’étoile. Les fusées s’arrêtent à la station, les lumières s’éteignent et les nuages disparaissent.', 'Quel verbe décrit le mouvement des planètes ?', 'tournent', 's’arrêtent', 's’éteignent', 'disparaissent'] },
  { key: 'nommee_called', form: 'nommée', lemma: 'nommer', partOfSpeech: 'past participle feminine singular', meaning: 'named; called', note: 'Sirius is the star’s name, not a person appointed to office. Existing lem_cendrillon_nommer_verb_bde5204dd3 / sns_cendrillon_nommer_attribuer_imposer_un_nom_a_une_personne_une_chose_ou_une_collectivite_6380ea9273 appears reusable after final identity review.',
    q13: ['L’étoile nommée Sirius brille dans le ciel.', 'called', 'hidden', 'dimmed', 'destroyed'],
    q45: ['Cette étoile ___ Sirius porte ce nom dans notre récit.', 'nommée', 'cachée', 'éteinte', 'brisée'],
    q68: ['L’étoile nommée Sirius porte ce nom. Une étoile cachée reste hors de vue, une étoile éteinte ne brille plus, et une lampe brisée ne fonctionne plus.', 'Quel adjectif indique le nom de l’étoile ?', 'nommée', 'cachée', 'éteinte', 'brisée'] },
  { key: 'connaitre_person', form: 'connaître', lemma: 'connaître', partOfSpeech: 'verb infinitive', meaning: 'to know; be acquainted with a person', note: 'The narrator says he came to know Micromégas on a trip; compare existing lem_zola_connaitre / sns_zola_connaitre_know and sns_cendrillon_connaitre_faire_ou_avoir_fait_l_experience_permettant_une_representation_mentale_de_quelque_chose_ou_quelqu_un_avoir_l_idee_la_notion_d_une_personne_ou_d_une_chose_832d4989ec.',
    q13: ['J’ai eu l’honneur de connaître cette voyageuse.', 'get to know', 'forget', 'avoid', 'hire'],
    q45: ['Après plusieurs rencontres, je commence à ___ cette personne.', 'connaître', 'éviter', 'oublier', 'licencier'],
    q68: ['Je veux connaître cette voyageuse et lui parler. Mon voisin veut l’éviter, son ancien ami risque de l’oublier et son employeur veut la licencier.', 'Quel verbe signifie devenir familier avec elle ?', 'connaître', 'éviter', 'oublier', 'licencier'] },
  { key: 'convient_suits', form: 'convient', lemma: 'convenir', partOfSpeech: 'verb present third singular', meaning: 'suits; is appropriate for', note: 'The narrator thinks the name suits a giant. Existing lem_convenir / sns_convenir_primary means agreeing on a decision, so this sense requires separation at signoff.',
    q13: ['Ce nom convient bien à ce personnage.', 'suits', 'forgets', 'hurts', 'erases'],
    q45: ['Ce nom décrit parfaitement ce géant : il lui ___ très bien.', 'convient', 'déplaît', 'échappe', 'manque'],
    q68: ['Ce nom convient au géant : il lui va bien. Un autre nom lui déplaît, une information lui échappe et un outil lui manque.', 'Quel verbe indique que le nom lui va bien ?', 'convient', 'déplaît', 'échappe', 'manque'] },
  { key: 'geometriques_measured_paces', form: 'géométriques', lemma: 'géométrique', partOfSpeech: 'adjective masculine plural', meaning: 'geometrical; of the fixed historical five-foot pace', note: 'In « pas géométriques de cinq pieds chacun », the adjective identifies a historical fixed measure rather than casual walking steps. Académie française, 1798: https://www.dictionnaire-academie.fr/article/A5P0383.',
    q13: ['Ces pas géométriques mesurent chacun cinq pieds dans l’ancien texte.', 'fixed measuring paces', 'random footsteps', 'hours', 'coins'],
    q45: ['Dans cet ancien système, les pas ___ servent de mesure fixe de cinq pieds.', 'géométriques', 'irréguliers', 'rapides', 'silencieux'],
    q68: ['Les pas géométriques sont une mesure fixe de cinq pieds. Les pas irréguliers varient ; les pas rapides décrivent une allure, et les pas silencieux ne font pas de bruit.', 'Quel adjectif désigne ici les pas de mesure ?', 'géométriques', 'irréguliers', 'rapides', 'silencieux'] },
  { key: 'chacun_each', form: 'chacun', lemma: 'chacun', partOfSpeech: 'indefinite pronoun masculine singular', meaning: 'each one', note: 'In « cinq pieds chacun », each individual measuring pace contains five feet; not all of them combined.',
    q13: ['Ils portent chacun un livre.', 'each one', 'nobody', 'together', 'never'],
    q45: ['Les trois élèves ont tous un livre différent : ___ reçoit le sien.', 'chacun', 'l’un d’eux', 'un élève', 'quelqu’un'],
    q68: ['Les trois voyageurs ont chacun un billet : un billet par personne. Personne ne partage le sien ; ils entrent ensemble et ne reviennent jamais.', 'Quel mot signifie un par personne ?', 'chacun', 'personne', 'ensemble', 'jamais'] },
  { key: 'trouveront_deduce', form: 'trouveront', lemma: 'trouver', partOfSpeech: 'verb future third plural', meaning: 'will determine; deduce by calculation', note: 'Both uses concern geometers reaching a numerical conclusion. Existing trouver senses for discovering, judging and finding oneself require explicit comparison; no automatic reuse.',
    q13: ['Avec ces nombres, les géomètres trouveront la mesure.', 'will calculate', 'will forget', 'will conceal', 'will erase'],
    q45: ['En faisant le calcul, ils ___ la circonférence du globe.', 'trouveront', 'oublieront', 'cacheront', 'effaceront'],
    q68: ['Avec la formule, ils trouveront la mesure. Sans notes, certains oublieront les données ; d’autres cacheront leur calcul ou effaceront le tableau.', 'Quel verbe indique le résultat obtenu par calcul ?', 'trouveront', 'oublieront', 'cacheront', 'effaceront'] },
  { key: 'produit_origin', form: 'produit', lemma: 'produire', partOfSpeech: 'past participle masculine singular', meaning: 'gave rise to; brought into being', note: 'The planet is the giant’s place of origin, figuratively described as having produced him. Existing lem_zola_produire / sns_zola_produire_present concerns presenting evidence, not this sense.',
    q13: ['Ce monde a produit le voyageur du récit.', 'gave rise to', 'welcomed', 'banished', 'ignored'],
    q45: ['Dans le récit, c’est sa planète natale qui l’a ___.', 'produit', 'accueilli', 'chassé', 'oublié'],
    q68: ['Sa planète l’a produit : il y est né. Une autre planète l’a accueilli, puis une cour l’a chassé ; un passant l’a oublié.', 'Quel mot indique ici son origine ?', 'produit', 'accueilli', 'chassé', 'oublié'] },
  { key: 'millions_number', form: 'millions', lemma: 'million', partOfSpeech: 'noun masculine plural', meaning: 'millions; groups of one million', note: 'All four uses quantify lengths, circumference or people; historical units remain as printed but the numerical magnitude is unchanged.',
    q13: ['Trois millions représentent trois fois un million.', 'millions', 'thousands', 'hundreds', 'dozens'],
    q45: ['Le nombre 3 000 000 se lit trois ___.', 'millions', 'milliers', 'centaines', 'dizaines'],
    q68: ['Trois millions font 3 000 000. Trois milliers font 3 000 ; trois centaines font 300 et trois dizaines font 30.', 'Quel mot désigne des groupes de 1 000 000 ?', 'millions', 'milliers', 'centaines', 'dizaines'] }
];
const used = new Set(previous.flatMap(item => item.sourceOccurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
const items = records.map(record => {
  const row = gap.forms.find(candidate => candidate.form === record.form);
  if (!row || row.candidateIdentities.length || record.q13.length !== 5 || record.q45.length !== 5 || record.q68.length !== 6) throw Error(`Unreviewed candidate or question shape: ${record.key}`);
  const occurrences = plan.units.flatMap(unit => tokenizeFrench(unit.text).filter(token => token.normalized === record.form)
    .map(token => ({ chapter: unit.chapter, unit: unit.ordinal, start: token.start, end: token.end, text: unit.text.slice(token.start, token.end) })));
  if (occurrences.length !== row.count || !occurrences.some(occ => occ.chapter === 1)) throw Error(`Incomplete chapter/workwide occurrence coverage: ${record.key}`);
  for (const occ of occurrences) {
    const key = `${occ.unit}:${occ.start}:${occ.end}`;
    if (used.has(key)) throw Error(`Occurrence overlap: ${record.key} ${key}`);
    used.add(key);
  }
  const [context13, ...choices13] = record.q13;
  const [context45, ...choices45] = record.q45;
  const [context68, question68, ...choices68] = record.q68;
  if (!context13.toLocaleLowerCase('fr').includes(occurrences[0].text.toLocaleLowerCase('fr')) || !context45.includes('___') || !choices45.map(choice => choice.toLocaleLowerCase('fr')).includes(occurrences[0].text.toLocaleLowerCase('fr'))) throw Error(`Target mismatch: ${record.key}`);
  if ([choices13, choices45, choices68].some(choices => new Set(choices).size !== 4) || choices68.some(choice => !context68.includes(choice))) throw Error(`Choice mismatch: ${record.key}`);
  return { key: record.key, form: record.form, lemma: record.lemma, partOfSpeech: record.partOfSpeech, meaning: record.meaning,
    editorialNote: record.note, sourceOccurrences: occurrences, status: 'workwide_context_reviewed_question_signoff_pending',
    questions: [
      { band: '1-3', context: context13, question: 'Meaning', answer: choices13[0], choices: choices13 },
      { band: '4-5', context: context45, question: 'Complétez la phrase.', answer: choices45[0], choices: choices45 },
      { band: '6-8', context: context68, question: question68, answer: choices68[0], choices: choices68 }
    ] };
});
const output = { version: 1, workId: 'wrk_voltaire_micromegas', chapter: 1, status: 'offline_editorial_draft_unpublished',
  sourceSha256: sha(draft), unitPlanSha256: sha(planBytes),
  note: 'Ten chapter I opening astronomy and calculation meanings with all exact-form uses across the work and three authored question bands each. Related published lemmas require explicit semantic comparison; no learner import or final signoff.', items };
writeFileSync(resolve(root, 'chapter-01-batch-08.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
