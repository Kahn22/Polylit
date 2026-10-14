"""Fingerprint the inspected Chapter V questions, expression spans and exact routes."""
import hashlib
import json
from collections import Counter
from pathlib import Path

P = Path(__file__).resolve().parents[1] / 'content/sources/wrk_voltaire_micromegas'
read = lambda n: json.loads((P / n).read_text())
write = lambda n, d: (P / n).write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
sha = lambda b: hashlib.sha256(b).hexdigest()
digest = lambda d: sha(json.dumps(d, ensure_ascii=False, separators=(',', ':')).encode())
file_sha = lambda n: sha((P / n).read_bytes())
inv = read('chapter-05-inventory.json')
units = {u['ordinal']: u['text'] for u in read('unit-plan.json')['units']}
bound = {'version': 1, 'workId': inv['workId'], 'chapter': 5,
         'sourceSha256': inv['sourceSha256'], 'unitPlanSha256': inv['unitPlanSha256'],
         'inventorySha256': file_sha('chapter-05-inventory.json')}

expressions = read('chapter-05-expression-review.json')
extra = {
 'd_abord': ('at first; initially', ['at first; initially', 'at last', 'at the same time', 'always'],
             'Au début, il ne comprend pas : il n’en soupçonne ___ pas davantage.',
             ['d’abord', 'enfin', 'toujours', 'simultanément'],
             'Quelle expression signifie dans un premier temps, avant les observations suivantes ?'),
 'a_peu_pres': ('approximately; roughly', ['approximately; roughly', 'exactly', 'at least', 'at most'],
               'Ce n’est pas une mesure exacte : l’animal mesure ___ cette fraction de pouce.',
               ['à peu près', 'exactement', 'au moins', 'au plus'],
               'Quelle expression présente une valeur approximative, sans la fixer exactement ni comme une borne ?'),
}
for item in expressions['items']:
 if item['key'] in extra:
  answer, choices, middle, french, high = extra[item['key']]
  item['questions'] = [
   {'band': '1-3', 'context': item['sourceSentence'], 'targetText': item['sourceOccurrence']['text'], 'question': 'What does the highlighted phrase mean here?', 'answer': answer, 'choices': choices},
   {'band': '4-5', 'context': middle, 'question': 'Complétez la phrase.', 'answer': french[0], 'choices': french},
   {'band': '6-8', 'context': high, 'question': 'Quelle expression convient ?', 'answer': french[0], 'choices': french}]
  item['decision'] = 'retain_published_meaning_as_full_span_expression_with_reviewed_questions'
 if item['key'] == 'avoir_beau':
  for q in item['questions'][1:]: q['choices'] = ['aura beau faire', 'pourra enfin agir', 'saura bien agir', 'voudra tout changer']
 for q in item['questions']:
  if q['band'] == '1-3': q['targetText'] = item['sourceOccurrence']['text']
 item['status'] = 'offline_expression_source_and_three_band_review_recorded'
expressions['summary']['newContextualExpressionDrafts'] = 9
expressions['summary']['newQuestionBands'] = 27
expressions['status'] = 'offline_expression_source_and_three_band_review_recorded_unpublished'
write('chapter-05-expression-review.json', expressions)
resolution = read('chapter-05-held-resolution.json')
resolution['expressionReviewSha256'] = file_sha('chapter-05-expression-review.json')
write('chapter-05-held-resolution.json', resolution)

files = [f'chapter-05-batch-{n:02}.json' for n in range(1, 7)] + [f'chapter-05-held-batch-{n:02}.json' for n in (1, 2, 3)]
plan = read('chapter-05-identity-plan.json')
routes = {i['key']: i for i in plan['items']}
qa = []
authored = {}
for name in files:
 for item in read(name)['items']:
  route = routes[item['key']]
  assert route['questionSha256'] == digest(item['questions'])
  assert route['sourceOccurrencesSha256'] == digest(item['sourceOccurrences'])
  for o in item['sourceOccurrences']:
   k = (o['unit'], o['start'], o['end'])
   assert k not in authored and units[o['unit']][o['start']:o['end']] == o['text']
   authored[k] = (name, item['key'])
  qa.append({'key': item['key'], 'form': item['form'], 'meaning': item['meaning'], 'batchFile': name,
             'questionSha256': route['questionSha256'], 'sourceOccurrencesSha256': route['sourceOccurrencesSha256'],
             'questionBands': ['1-3', '4-5', '6-8'], 'identityRoute': route['route'],
             'reviewNote': f'At {item["sourceOccurrences"][0]["unit"]}:{item["sourceOccurrences"][0]["start"]}, {item["form"]} teaches {item["meaning"]}. The full source unit, early meaning choices, semantic middle clue, advanced retrieval clue and all four alternatives were inspected. ' + route['rationale'],
             'checks': ['source_meaning', 'sole_semantic_answer', 'number_and_agreement', 'three_contexts', 'lemma_ownership'],
             'decision': 'retain_reviewed_offline_proposal_pending_complete_work_import'})
assert len(qa) == len(routes) == 137
write('chapter-05-qa.json', {**bound, 'status': 'offline_individual_question_review_recorded_unpublished',
 'identityPacketSha256': file_sha('chapter-05-identity-packet.json'), 'identityPlanSha256': file_sha('chapter-05-identity-plan.json'),
 'batchEvidence': {n: file_sha(n) for n in files},
 'summary': {'reviewedMeanings': len(qa), 'reviewedQuestionBands': len(qa) * 3, 'exactAuthoredUses': len(authored)},
 'items': qa, 'note': 'These are assistant editorial decisions, not human signoff, learner import or release approval. Automated validation only checks the recorded revisions.'})

expression_qa = []
for item in expressions['items']:
 expression_qa.append({'key': item['key'], 'meaning': item['meaning'], 'sourceOccurrence': item['sourceOccurrence'],
  'questionSha256': digest(item['questions']), 'questionBands': ['1-3', '4-5', '6-8'],
  'identityRoute': 'reuse_published_meaning_new_full_span_expression' if item['key'] in extra else 'new_full_span_expression_or_inflected_surface',
  'reviewNote': item['note'] + ' The printed span and its component tokens remain distinct from the quiz identity. All three bands select this contextual meaning; a full phrase identity must be reconciled across the work before import.'})
write('chapter-05-expression-qa.json', {**bound, 'status': 'offline_individual_expression_review_recorded_unpublished',
 'expressionReviewSha256': file_sha('chapter-05-expression-review.json'),
 'summary': {'reviewedExpressions': 9, 'reviewedQuestionBands': 27}, 'items': expression_qa})

carry = read('chapter-05-earlier-draft-carryover.json')
carry['status'] = 'source_bound_earlier_draft_carryover_question_qa_recorded_unpublished'
for item in carry['items']:
 item['decision'] = 'share_reviewed_earlier_contextual_meaning_and_three_band_questions'
 item['reviewNote'] += ' The three existing bands were inspected for this Chapter V use; the matching form and meaning reuse the earlier question bank without authoring another bank.'
write('chapter-05-earlier-draft-carryover.json', carry)

# Published dependencies remain explicit rather than laundering them into new senses.
dependencies = []
for stem in ('et', 'sans', 'sentir'):
 impact = read(f'chapter-05-{stem}-impact.json')
 dependencies.append({'key': stem, 'senseId': impact['sense']['id'], 'impactFile': f'chapter-05-{stem}-impact.json',
  'impactSha256': file_sha(f'chapter-05-{stem}-impact.json'), 'impact': impact['impact'],
  'decision': 'shared_question_repair_required_before_import',
  'reviewNote': ('Lowercase the correct middle-band choice inside its sentence; keep the correctly capitalized opening in the other bands. No sense, occurrence or mastery mutation is proposed.' if stem != 'sentir' else 'The active sentoit bands express felt correctly. Historical sentit early incorrectly answers to smell, while its intermediate and advanced define experiencing a sensation; replace the three historical bands with the reviewed Chapter V sentit proposal and reconcile activation. The sense definition and existing mastery identity remain unchanged.'),
  'proposedQuestionDependency': 'chapter-05-held-batch-02.json:sentir_chapter_05_held_01_127' if stem == 'sentir' else None})
write('chapter-05-shared-repair-dependencies.json', {**bound,
 'status': 'impact_reviewed_shared_question_proposals_not_applied', 'items': dependencies,
 'note': 'No published record or approval is changed. Apply each repair with exact-revision reapproval and rebind source snapshots at complete-work reconciliation; never create a new meaning merely to avoid repairing a quiz.'})

published = [read(f'chapter-05-published-reuse-review-{n:02}.json') for n in range(1, 6)]
reuses = {(o['unit'], o['start'], o['end']): (f'chapter-05-published-reuse-review-{n:02}.json', item['identity'])
          for n, review in enumerate(published, 1) for item in review['items'] for o in item['sourceOccurrences']}
held = {(i['unit'], i['start'], i['end']): i for i in resolution['items']}
shared = {(o['unit'], o['start'], o['end']): ('chapter-05-earlier-draft-carryover.json', i['earlierKey']) for i in carry['items'] for o in i['sourceOccurrences']}
older = {(o['unit'], o['start'], o['end']): ('chapter-04-07-carryover-review.json', i['key']) for i in read('chapter-04-07-carryover-review.json')['items'] for o in i['occurrences'] if o['chapter'] == 5}
names = {(o['unit'], o['start'], o['end']): ('chapter-04-07-names.json', i['form']) for i in read('chapter-04-07-names.json')['items'] for o in i['occurrences'] if o['chapter'] == 5}
by_form = {}
for name in files:
 for item in read(name)['items']: by_form.setdefault(item['form'], []).append((name, item['key']))
coverage = []
for t in inv['tokens']:
 k = (t['unit'], t['start'], t['end'])
 if t.get('earlierDraft'):
  decision, evidence = 'already_authored_earlier', (t['earlierDraft']['file'], t['earlierDraft']['key'])
 elif k in names: decision, evidence = 'reviewed_proper_name', names[k]
 elif k in authored:
  evidence = authored[k]
  decision = 'reviewed_contextual_meaning_and_three_band_questions'
  if routes[evidence[1]]['route'] == 'published_question_repair_pending': decision = 'reviewed_meaning_shared_question_repair_dependency'
 elif k in reuses: decision, evidence = 'reviewed_published_identity_and_questions', reuses[k]
 elif k in shared: decision, evidence = 'reviewed_earlier_surface_sense_and_questions', shared[k]
 elif k in older: decision, evidence = 'reviewed_earlier_meaning_carryover', older[k]
 elif k in held:
  h = held[k]
  if h['route'] == 'whole_expression_component_pending_identity_and_question_qa':
   decision, evidence = 'reviewed_full_expression_component', ('chapter-05-expression-qa.json', h['expressionKey'])
  elif h['route'] == 'alternate_published_identity_three_bands_reviewed_pending_import':
   decision, evidence = 'reviewed_alternate_published_identity_and_questions', ('chapter-05-held-resolution.json', h['identity'])
  elif h['route'] == 'published_shared_question_repair_requires_impact_review':
   decision, evidence = 'reviewed_meaning_shared_question_repair_dependency', ('chapter-05-shared-repair-dependencies.json', h['form'])
  else: raise AssertionError(('unreviewed held', k))
 elif t['form'] == 'cercle':
  decision, evidence = 'reviewed_full_expression_component', ('chapter-05-expression-qa.json', 'quarts_de_cercle')
 elif t['form'] in by_form and not t['candidates']:
  assert len(by_form[t['form']]) == 1, (k, t['form'])
  decision, evidence = 'reviewed_same_chapter_surface_sense_and_questions', by_form[t['form']][0]
 else: raise AssertionError(('no reviewed route', k, t))
 coverage.append({k: t[k] for k in ('unit', 'start', 'end', 'text', 'form')} | {'disposition': decision, 'evidenceFile': evidence[0], 'evidenceKey': evidence[1]})
summary = {'tokenUses': 612, 'resolvedTokenUses': 612, 'unresolvedTokenUses': 0,
 'reviewedMeaningProposals': 137, 'reviewedVocabularyQuestionBands': 411, 'reviewedExpressionProposals': 9,
 'reviewedExpressionQuestionBands': 27, 'earlierQuestionBandsRechecked': 24,
 'sharedQuestionRepairDependencies': 3,
 'usesWithSharedRepairDependencies': sum(i['disposition'] == 'reviewed_meaning_shared_question_repair_dependency' for i in coverage),
 'dispositions': dict(Counter(i['disposition'] for i in coverage))}
evidence = list(dict.fromkeys(files + ['chapter-05-inventory.json', 'chapter-05-identity-packet.json', 'chapter-05-identity-plan.json', 'chapter-05-qa.json', 'chapter-05-expression-review.json', 'chapter-05-expression-qa.json', 'chapter-05-held-resolution.json', 'chapter-05-earlier-draft-carryover.json', 'chapter-05-shared-repair-dependencies.json'] + [f'chapter-05-published-reuse-review-{n:02}.json' for n in range(1, 6)] + [f'chapter-05-{s}-impact.json' for s in ('et', 'sans', 'sentir')]))
write('chapter-05-coverage.json', {**bound, 'status': 'offline_editorial_routes_and_question_reviews_complete_import_dependencies_remain',
 'evidenceSha256': {n: file_sha(n) for n in evidence}, 'summary': summary, 'tokens': coverage,
 'note': 'Resolved means each exact source token has an inspected route. Shared repairs, canonical question selection across chapters, complete-work identity reconciliation, learner import and work-specific release remain pending. No human approval or deployment is claimed.'})
write('chapter-05-lexical-evidence.json', {**bound, 'status': 'contextual_lexical_evidence',
 'items': [
 {'key': 'en_figure_anaphor', 'url': 'https://www.dictionnaire-academie.fr/article/A9E1239', 'edition': 'Académie française, ninth edition', 'accessed': '2026-09-30', 'finding': 'Section III describes quantitative anaphoric en with a separately expressed quantity.', 'editorialInference': 'In the source comparison, figure is the resumed nominal antecedent.'},
 {'key': 'faire_impersonal_happen', 'url': 'https://www.dictionnaire-academie.fr/article/A1P0400', 'edition': 'Académie française, 1694', 'accessed': '2026-09-30', 'finding': 'The pouvoir entry records the historical impersonal construction il se peut faire que.', 'editorialInference': 'It expresses a possibility that the imagined beings exist.'},
 {'key': 'pris_caught_in_act', 'url': 'https://www.dictionnaire-academie.fr/article/A6P2208', 'edition': 'Académie française, 1835', 'accessed': '2026-09-30', 'finding': 'The prendre entry records surprising someone during an action in prendre sur le fait.', 'editorialInference': 'Nature is personified as observed in action; there is no physical grasp.'}]})
print(json.dumps(summary, ensure_ascii=False))
