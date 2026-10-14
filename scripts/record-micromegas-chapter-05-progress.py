#!/usr/bin/env python3
"""Audit every Chapter V token against source-bound draft evidence."""
import hashlib
import json
from collections import Counter
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((base/f).read_text())
digest=lambda f:hashlib.sha256((base/f).read_bytes()).hexdigest()
inv=read('chapter-05-inventory.json');batches=[read(f'chapter-05-batch-{number:02}.json') for number in (1,2,3,4,5,6)];triage=read('chapter-05-triage-02.json')
carry=read('chapter-04-07-carryover-review.json');names=read('chapter-04-07-names.json')
published=[read(f'chapter-05-published-reuse-review-{number:02}.json') for number in (1,2,3,4,5)]
expressions=read('chapter-05-expression-review.json')
earlier=read('chapter-05-earlier-draft-carryover.json')
held_routes=read('chapter-05-held-resolution.json')
held_batches=[read(f'chapter-05-held-batch-{number:02}.json') for number in (1,2,3)]
unit_text={u['ordinal']:u['text'] for u in read('unit-plan.json')['units']}
def indexed(rows,field='sourceOccurrences'):
    return {(o['unit'],o['start'],o['end']):i for i in rows for o in i[field] if o['chapter']==5}
b=indexed([item for batch in batches for item in batch['items']]);q=indexed(triage['items']);c=indexed(carry['items'],'occurrences');n=indexed(names['items'],'occurrences')
e=indexed(earlier['items'])
assert not (b.keys() & e.keys()) and e.keys() <= q.keys()
expression_only={(t['unit'],t['start'],t['end']) for item in expressions['items']
                 if item['key']=='quarts_de_cercle' for t in item['componentTokens'] if t['form']=='cercle'}
assert len(expression_only)==1 and expression_only <= q.keys()
p=indexed([item for review in published for item in review['items']])
h={(entry['unit'],entry['start'],entry['end']):entry for review in published for entry in review['holds']}
all_selected=[(o['unit'],o['start'],o['end']) for review in published for item in review['items'] for o in item['sourceOccurrences']]
all_held=[(entry['unit'],entry['start'],entry['end']) for review in published for entry in review['holds']]
candidate_keys={(t['unit'],t['start'],t['end']) for t in inv['tokens'] if t['candidates'] and not t.get('earlierDraft')}
assert len(all_selected)==len(set(all_selected)) and len(all_held)==len(set(all_held))
assert not (p.keys() & h.keys()) and set(all_selected)|set(all_held)==candidate_keys
assert {(i['unit'],i['start'],i['end']) for i in held_routes['items']}==set(all_held)
held_authored=indexed([item for batch in held_batches for item in batch['items']])
route_by_key={(r['unit'],r['start'],r['end']):r['route'] for r in held_routes['items']}
assert held_authored.keys() <= h.keys() and all(route_by_key[k]=='distinct_contextual_meaning_or_construction_pending_question_authoring' for k in held_authored)
first_forms={i['form'] for batch in batches for i in batch['items']}
out=[];counts=Counter()
for t in inv['tokens']:
    k=(t['unit'],t['start'],t['end'])
    assert unit_text[t['unit']][t['start']:t['end']]==t['text'],k
    if t.get('earlierDraft'): d='already_authored_earlier'
    elif k in n: d='reviewed_proper_name'
    elif k in b: d='new_contextual_question_draft_pending_review'
    elif t['form'] in first_forms and not t['candidates']: d='share_chapter_five_question_draft_pending_review'
    elif k in c: d='earlier_reviewed_meaning_carryover_pending_import'
    elif k in e: d='share_earlier_contextual_question_draft_pending_review'
    elif k in expression_only: d='expression_component_pending_identity_import'
    elif k in q: d='contextual_lexical_triage_pending_questions_and_identity'
    elif k in p: d='reuse_reviewed_published_identity_and_questions_pending_import'
    elif k in h: d='published_candidate_held_for_editorial_repair'
    else:
        assert t['candidates'],k
        d='published_candidate_context_and_question_review_pending'
    counts[d]+=1
    out.append({'unit':t['unit'],'start':t['start'],'end':t['end'],'text':t['text'],
                'form':t['form'],'disposition':d})
assert len(out)==len(inv['tokens'])==612
result={'version':1,'workId':inv['workId'],'chapter':5,
        'status':'source_bound_work_in_progress_no_publication_approval',
        'sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],
        'evidenceSha256':{f:digest(f) for f in ['chapter-05-inventory.json','chapter-05-batch-01.json','chapter-05-batch-02.json','chapter-05-batch-03.json','chapter-05-batch-04.json','chapter-05-batch-05.json','chapter-05-batch-06.json',
                                             'chapter-05-triage-02.json','chapter-05-published-reuse-review-01.json','chapter-05-published-reuse-review-02.json','chapter-05-published-reuse-review-03.json','chapter-05-published-reuse-review-04.json','chapter-05-published-reuse-review-05.json','chapter-04-07-carryover-review.json',
                                             'chapter-04-07-names.json','chapter-05-expression-review.json','chapter-05-earlier-draft-carryover.json','chapter-05-held-resolution.json','chapter-05-held-batch-01.json','chapter-05-held-batch-02.json','chapter-05-held-batch-03.json']},
        'summary':{'tokenUses':len(out),'dispositions':dict(counts),
                   'newQuestionDrafts':sum(len(item['questions']) for batch in batches for item in batch['items']),
                   'newContextualMeaningDrafts':sum(len(batch['items']) for batch in batches),
                   'earlierDraftFormsShared':earlier['summary']['forms'],
                   'earlierDraftUsesShared':earlier['summary']['uses'],
                   'earlierQuestionBandsShared':earlier['summary']['earlierQuestionBandsShared'],
                   'lexicalFormsTriaged':len(triage['items']),
                   'publishedReuseFormsReviewed':len({i['form'] for review in published for i in review['items']}),
                   'publishedReuseUsesReviewed':len(all_selected),
                   'publishedCandidateHeldUses':len(all_held),
                   'publishedHeldRoutes':held_routes['summary']['routes'],
                   'heldContextualMeaningDrafts':sum(len(batch['items']) for batch in held_batches),
                   'heldContextualQuestionDrafts':sum(len(item['questions']) for batch in held_batches for item in batch['items']),
                   'heldContextualUsesWithDrafts':len(held_authored),
                   'heldContextualUsesAwaitingDrafts':held_routes['summary']['routes']['distinct_contextual_meaning_or_construction_pending_question_authoring']-len(held_authored),
                   'untriagedPublishedCandidateUses':len(candidate_keys-set(all_selected)-set(all_held)),
                   'expressionPhraseUses':expressions['summary']['phraseUses'],
                   'newContextualExpressionDrafts':expressions['summary']['newContextualExpressionDrafts'],
                   'newExpressionQuestionDrafts':expressions['summary']['newQuestionBands'],
                   'expressionComponentTokenUses':expressions['summary']['componentTokenUses']},
        'tokens':out,
        'note':'A disposition here tracks work, not editorial approval. Expression spans are independently reviewed over component tokens; the token partition remains unchanged until identity and question reconciliation. New drafts and complete-work import still need review.'}
(base/'chapter-05-progress.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result['summary'],ensure_ascii=False))
