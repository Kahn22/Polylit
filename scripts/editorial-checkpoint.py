"""Validate an editorial milestone and save an immutable, resumable source ZIP."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import sys
import zipfile
from checkpoint_integrity import candidate_progress, source_snapshot, verify_archive

root = Path(__file__).resolve().parents[1]
label = sys.argv[1] if len(sys.argv) == 2 else ''
if not re.fullmatch(r'[a-z0-9][a-z0-9_-]*', label):
    raise SystemExit('Usage: npm run editorial:checkpoint -- <lowercase-label>')
destination = root.parent / f'Polylit-French-Editorial-{label}.zip'
if destination.exists():
    raise SystemExit(f'Checkpoint already exists: {destination.name}; choose a new label')
temporary = destination.with_name(destination.name + '.partial')
if temporary.exists():
    raise SystemExit(f'Unfinished checkpoint exists: {temporary.name}; inspect it before retrying')
source_before = source_snapshot(root)
progress_before = candidate_progress(lambda name: (root / name).read_bytes())

def run(*command):
    subprocess.run(command, cwd=root, check=True)

run('npm', 'run', 'check')
run('npm', 'run', 'test:navigation')
run('npm', 'run', 'build:local-review')
audit = json.loads(subprocess.check_output(['node', 'dist/cli/audit-editorial.js'], cwd=root, text=True))
if audit['blockedRecords'] == 0:
    run('npm', 'run', 'publication:release-check')
    run('npm', 'run', 'build')
run('node', 'scripts/editorial-review-packet.mjs', '--limit', '10')
packet = json.loads((root / 'docs/EDITORIAL_NEXT_PACKET.json').read_text())
micromegas_intake = root / 'content/sources/wrk_voltaire_micromegas/dossier.json'
micromegas_acquired = micromegas_intake.exists() and json.loads(micromegas_intake.read_text())['acquisition']['status'] == 'acquired'
micromegas_chapter_one_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-01.json').exists()
micromegas_chapter_two_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-02-review.json').exists()
micromegas_chapter_four_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-04-review.json').exists()
micromegas_chapter_seven_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-07-review.json').exists()
micromegas_second_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-02.json').exists()
micromegas_third_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-03.json').exists()
micromegas_fourth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-04.json').exists()
micromegas_fifth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-05.json').exists()
micromegas_sixth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-06.json').exists()
micromegas_eighth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-08.json').exists()
micromegas_expressions = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-expressions-01.json').exists()
pending = audit['languages']['fr']['blockedByKind']['vocabulary']
if pending != packet['pendingFrenchVocabulary']:
    raise SystemExit('Audit and review packet disagree; no checkpoint saved')
if source_snapshot(root) != source_before:
    raise SystemExit('Micromégas source/progress files changed during validation; no checkpoint saved')

handoff = {
    'version': 1,
    'checkpoint': destination.name,
    'publicationReady': audit['releaseReady'],
    'blockedRecords': audit['blockedRecords'],
    'blockedByKind': {language: data['blockedByKind'] for language, data in audit['languages'].items()},
    'nextFrenchVocabularyIds': [identity for family in packet['families'] for identity in family['pendingIdentityIds']],
    'nextSharedSenseIds': [family['senseId'] for family in packet['families']],
    'nextContentWorkId': 'wrk_voltaire_micromegas' if micromegas_intake.exists() else None,
    'candidateProgress': progress_before,
    'nextAction': ('Continue Micromégas contextual vocabulary and expression review after eight ten-sense batches (226 workwide occurrences, 240 vocabulary questions) and ten phrase candidates (three expression question sets, two progress-reuse holds). Resolve shared senses and remaining forms before identity import; candidate remains unpublished.' if audit['releaseReady'] and micromegas_eighth_batch else 'Continue Micromégas contextual vocabulary and expression review after six ten-sense batches (201 workwide occurrences, 180 vocabulary questions) and ten phrase candidates (three expression question sets, two progress-reuse holds). Review remaining forms and reconcile à peu près and se mettre à before identity import; this candidate remains unpublished.' if audit['releaseReady'] and micromegas_sixth_batch else 'Continue Micromégas contextual vocabulary and expression review after five ten-sense batches (191 workwide occurrences, 150 vocabulary questions) and ten phrase candidates (three expression question sets, two progress-reuse holds). Resolve remaining forms and reconcile à peu près and se mettre à before identity import; this candidate remains unpublished.' if audit['releaseReady'] and micromegas_fifth_batch else 'Continue Micromégas vocabulary and expression review after four ten-sense batches (177 workwide occurrences, 120 question drafts) and ten phrase candidates (three expression question sets, two existing-progress holds); reconcile à peu près and se mettre à before any identity duplication. Candidate remains outside the 11-work release gate.' if audit['releaseReady'] and micromegas_expressions else 'Continue Micromégas contextual vocabulary/expression review after four ten-sense batches (177 workwide exact-form occurrences, 120 offline questions); resolve remaining forms, related lemma reuse and question signoff. All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_fourth_batch else 'Continue Micromégas contextual vocabulary/expression review after three ten-sense batches (157 workwide exact-form occurrences, 90 offline questions); resolve related lemma reuse and sign off questions. All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_third_batch else 'Continue Micromégas contextual vocabulary/expression review after two ten-sense batches (107 workwide exact-form occurrences, 60 offline questions); resolve related lemma reuse and sign off questions. All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_second_batch else 'Finish Micromégas canonical approval and continue contextual vocabulary/expression review after batch 01 (ten senses, 79 occurrences, 30 offline questions). All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_seven_reviewed else 'Proofread Micromégas chapters V–VII and review their proposed units. Continue contextual vocabulary/expressions after batch 01 (ten senses, 79 occurrences, 30 offline questions). The existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_four_reviewed else 'Proofread Micromégas chapters III–VII and review their proposed units. Continue contextual identities/expressions after batch 01 (ten senses, 79 occurrences, 30 offline questions) through chapters I–II. The existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_two_reviewed else 'Continue Micromégas chapter I after the first ten contextual sense and 30 question drafts: review remaining occurrence and expression candidates, cross-check those ten senses throughout chapters II–VII, and proofread remaining scans and unit boundaries. The 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_one_reviewed else 'Proofread Micromégas against its scans, review proposed units and passages, then resolve lexical identities and author three question bands before import and a work-specific release audit. Current release readiness covers previously published works only.' if audit['releaseReady'] and micromegas_acquired else 'Acquire and verify the complete Micromégas witness and scans under the source standard, then prepare its seven chapters, identities and questions.' if audit['releaseReady'] and micromegas_intake.exists() else 'Extract this release-ready source checkpoint into the existing Git checkout, review and commit the changes in GitHub Desktop, and deploy after the repository update.' if audit['releaseReady'] else 'Review each indexed use and every dependent question. Resolve any shared-sense or identity conflict before approving; then run the audit and continue to the next packet.'),
    'validation': {'check': 'passed', 'sourceDossiers': 'included in check', 'navigationTests': 'passed', 'generatedNavigation': 'passed for local review and every attempted production build', 'liveBrowserNavigation': 'not checked by this offline command', 'localReviewBuild': 'passed', 'editorialAudit': 'passed', 'productionBuild': 'passed' if audit['releaseReady'] else 'gated by pending editorial records'},
    'source': 'This is an unpublished source checkpoint; no GitHub push or deployment has occurred.',
}
if audit['releaseReady'] and micromegas_acquired:
    chapter_coverage = progress_before.get('chapterOneCoverage', {})
    handoff['nextAction'] = (f"Continue Micromégas review after {progress_before['batchCount']} ten-sense batches "
        f"({progress_before['workwideOccurrences']} workwide occurrences, "
        f"{progress_before['vocabularyQuestionDrafts']} offline vocabulary questions). "
        f"Chapter I has {chapter_coverage.get('unresolvedTokenUses', 'unverified')} unresolved token uses, "
        f"after {chapter_coverage.get('reusedTokenUses', 'unverified')} contextual published-identity reuses "
        f"and {chapter_coverage.get('excludedProperNameUses', 'unverified')} proper-name exclusions. "
        "Reuse the existing à peu près and past se mit à identities; map present se met à to a new surface under the existing reflexive-begin sense; review the four expression drafts, the 721 contextual reuses and remaining chapters before learner import. "
        "The candidate remains unpublished; the existing 11-work release gate does not include it.")
    chapter_two = progress_before.get('chapterTwoCoverage')
    if chapter_two:
        handoff['nextAction'] = (f"Continue the same chapter II package from its source-bound inventory: "
            f"{chapter_two['draftedTokenUses']} drafted uses, {chapter_two['reusedTokenUses']} reviewed published reuses, "
            f"{chapter_two['excludedProperNameUses']} excluded names, and {chapter_two['unresolvedTokenUses']} unresolved "
            f"of {chapter_two['tokenUses']} tokens. The next undecided forms begin with besoins, anneau, lunes, "
            "sommes and bornés; review all remaining meanings, published candidates, expressions, three-band questions, "
            "identity routes and chapter QA before considering chapter II complete. Micromégas remains unpublished.")
        if chapter_two['unresolvedTokenUses'] == 0:
            if chapter_two.get('questionReviewedMeanings') == chapter_two['newMeaningDrafts'] and chapter_two.get('expressionReviewedBands') == chapter_two['newExpressionQuestionBands']:
                handoff['nextAction'] = (f"Chapter II offline review is recorded: all {chapter_two['tokenUses']} tokenizer uses have dispositions, "
                    f"{chapter_two['newMeaningDrafts']} new meanings have {chapter_two['questionReviewedBands']} reviewed question bands and identity routes, "
                    f"and the à peine expression has {chapter_two['expressionReviewedBands']} reviewed bands. "
                    "Continue with chapter III coverage and complete-work sense reconciliation before importing Micromégas. "
                    "The candidate remains unpublished; the existing release gate covers the previous 11 works only.")
            else:
                handoff['nextAction'] = (f"Chapter II has zero unresolved tokenizer uses: {chapter_two['draftedTokenUses']} draft uses, "
                    f"{chapter_two['reusedTokenUses']} contextual published reuses, {chapter_two['excludedProperNameUses']} names "
                    f"and {chapter_two['coveredPhraseComponents']} phrase components. Review the "
                    f"{chapter_two['newMeaningDrafts']} new meanings and {chapter_two['newQuestionBands']} question bands individually, "
                    "adjudicate shared identity routes and the à peine expression, then run final chapter QA. "
                    "Keep Micromégas offline while chapters III–VII remain pending.")
chapter_three = progress_before.get('chapterThreeCoverage')
if audit['releaseReady'] and chapter_three and chapter_three['unresolvedTokenUses'] == 0 and chapter_three['questionReviewedMeanings'] == chapter_three['newMeaningDrafts']:
    handoff['nextAction'] = (f"Chapter III offline review is recorded: all {chapter_three['tokenUses']} tokenizer uses have dispositions, "
        f"{chapter_three['newMeaningDrafts']} new meanings have {chapter_three['questionReviewedBands']} reviewed question bands and identity routes, "
        f"and one new expression has three reviewed bands. Continue with chapter IV, then chapters V–VII and complete-work reconciliation. "
        "The tes plural sense requires a published sense repair decision before import. Micromégas remains unpublished; the existing release gate covers the previous 11 works only.")
remaining = progress_before.get('remainingChaptersCoverage')
if audit['releaseReady'] and remaining:
    handoff['nextAction'] = (f"Chapters IV–VII have exact source inventories for {remaining['tokenUses']} tokenizer uses. "
        f"{remaining['alreadyAuthoredEarlierUses']} already have authored earlier-draft occurrences, "
        f"{remaining['reviewedEarlierMeaningSharedUses']} additional uses have reviewed prior-sense links, "
        f"and {remaining['reviewedProperNameUses']} are reviewed names. "
        f"Chapter IV also has {remaining.get('chapterFourNewMeaningsReviewed', 0)} new reviewed meanings "
        f"with {remaining['newQuestionBandsReviewed']} offline question bands, and "
        f"{remaining.get('chapterFourPublishedReuseUses', 0)} contextually reviewed published reuses "
        f"across {remaining.get('chapterFourPublishedReuseForms', 0)} forms. "
        f"Continue contextual review of {remaining['editorialDecisionPendingUses']} uses, including "
        f"{remaining['noExactIdentityUses']} with no exact published identity. Author and individually review three question bands for each new meaning, "
        "then reconcile all seven chapters and resolve the plural tes published-sense repair hold before learner import. "
        "Micromégas remains unpublished; the existing 11-work release gate is clear.")
    if remaining.get('chapterFourUnresolvedUses') == 0:
        handoff['nextAction'] = (f"Chapter IV offline editorial coverage is complete: 1,041 exact source tokens have one disposition, "
            f"{remaining['chapterFourNewMeaningsReviewed']} new contextual meanings have {remaining['newQuestionBandsReviewed']} reviewed vocabulary question bands, "
            f"and {remaining['chapterFourAdditionalExpressionReviews']} expressions have {remaining['chapterFourAdditionalExpressionQuestionBands']} reviewed question bands. "
            f"Continue Chapters V–VII from their source-bound candidate queue of {remaining['editorialDecisionPendingUses']} uses, "
            "then reconcile identities and questions across all seven chapters. Resolve published-sense repair dependencies before import. "
            "Micromégas remains unpublished; the existing 11-work release gate is clear.")
if progress_before.get('chapterFiveRecovery'):
    chapter_five = progress_before['chapterFiveRecovery']
    if chapter_five.get('untriagedPublishedCandidateUses') == 0:
        handoff['nextAction'] = (
            f"Chapter V tracks all {chapter_five['tokenUses']} exact source uses. "
            f"The 454 published candidates partition into {chapter_five['publishedReuseUsesReviewed']} "
            f"reviewed reuses and {chapter_five['publishedCandidateHeldUses']} contextual holds. "
            f"Review the {chapter_five['newContextualMeaningDrafts']} new meaning drafts and "
            f"{chapter_five['newQuestionDrafts']} question bands, plus "
            f"{chapter_five.get('newContextualExpressionDrafts', 0)} expression drafts and "
            f"{chapter_five.get('newExpressionQuestionDrafts', 0)} expression bands. "
            f"The earlier Chapter IV drafts share {chapter_five.get('earlierDraftUsesShared', 0)} uses pending final QA. "
            f"Held routes: {chapter_five.get('publishedHeldRoutes', {}).get('whole_expression_component_pending_identity_and_question_qa', 0)} expression components, "
            f"{chapter_five.get('publishedHeldRoutes', {}).get('alternate_published_identity_three_bands_reviewed_pending_import', 0)} alternate published identities, "
            f"{chapter_five.get('publishedHeldRoutes', {}).get('published_shared_question_repair_requires_impact_review', 0)} shared question repairs, "
            f"and {chapter_five.get('publishedHeldRoutes', {}).get('distinct_contextual_meaning_or_construction_pending_question_authoring', 0)} contextual meanings/constructions. "
            f"Of those held contextual uses, {chapter_five.get('heldContextualUsesWithDrafts', 0)} have draft questions and "
            f"{chapter_five.get('heldContextualUsesAwaitingDrafts', 0)} still need construction-level decisions, starting with en in qu’en ferait. "
            f"Author questions and identity routes for the {chapter_five['dispositions'].get('contextual_lexical_triage_pending_questions_and_identity', 0)} "
            "remaining lexical triage uses and the held contexts, then reconcile "
            "the whole work. Use chapter-05-progress.json; no Chapter V content is published.")
    else:
        handoff['nextAction'] = (
            f"Chapter V recovery is in progress: {chapter_five['tokenUses']} exact source uses are tracked, "
            f"{chapter_five['newContextualMeaningDrafts']} contextual meanings have "
            f"{chapter_five['newQuestionDrafts']} draft question bands, and "
            f"{chapter_five['lexicalFormsTriaged']} additional forms have lexical triage. "
            "Review and correct the new question bands and identity routes, then inspect the "
            "remaining published candidate contexts and questions and expressions. "
            "Use chapter-05-progress.json to resume; no Chapter V content is published.")
if progress_before.get('chapterFiveCoverage'):
    chapter_five = progress_before['chapterFiveCoverage']
    handoff['nextAction'] = (
        f"Chapter V offline preparation is recorded: {chapter_five['resolvedTokenUses']} exact source tokens have reviewed routes, "
        f"{chapter_five['reviewedMeaningProposals']} vocabulary proposals have {chapter_five['reviewedVocabularyQuestionBands']} reviewed bands, "
        f"and {chapter_five['reviewedExpressionProposals']} full-span expressions have {chapter_five['reviewedExpressionQuestionBands']} reviewed bands. "
        "Continue Chapter VI at bien, unit 133 offsets 12–16, then Chapter VII from the remaining candidate queue of 2,610 uses. "
        "Before importing the complete work, apply the three impact-reviewed et/sans/sentit question repairs, resolve earlier shared-sense dependencies, "
        "and reconcile canonical identities and question banks across all chapters. "
        "Micromégas remains unpublished; the existing 11-work release gate does not approve this candidate.")
if progress_before.get('chapterSixPartialReview'):
    sixth = progress_before['chapterSixPartialReview']
    handoff['nextAction'] = (
        f"Chapter VI partial offline review: {sixth['formsConsidered']} forms / {sixth['consideredUses']} considered uses, "
        f"{sixth['reviewedUses']} reviewed routes, {sixth['contextualProposals']} vocabulary proposals / {sixth['newQuestionBands']} reviewed bands, "
        f"{sixth.get('reviewedExpressionForms', 0)} expression forms / {sixth.get('reviewedExpressionQuestionBands', 0)} reviewed bands. "
        f"{sixth['heldUses']} held uses and {sixth['untouchedQueuedUses']} untouched Chapter VI queued uses remain. " +
        (f"Continue at {sixth['nextUntouchedAction']['form']}, unit {sixth['nextUntouchedAction']['unit']} offsets {sixth['nextUntouchedAction']['start']}–{sixth['nextUntouchedAction']['end']}; " if sixth.get('nextUntouchedAction') else ("All queued VI forms have been considered; resolve held dependencies before import and continue Chapter VII contextual review; " if sixth['untouchedQueuedUses']==0 else "Continue at examiner, unit 138 offsets 151–159; ")) +
        ("Resolve remaining held-context overlays before import. " if sixth['heldUses'] > 30 else "Agent en, lexical qu’auraient, relational pour and lowercase comment have contextual banks; retain their exact recorded ownership dependencies. ") +
        "The shared et/sans/sentit repairs remain unapplied until complete-work reconciliation. "
        "Candidate queues retain the full 2,610 VI–VII uses until complete chapter coverage; partial evidence does not count as chapter completion. "
        "Micromégas remains unpublished; no learner import or deployment.")
if progress_before.get('chapterSevenPartialReview'):
    seventh = progress_before['chapterSevenPartialReview']
    next_item = seventh['nextUntouchedAction']
    handoff['nextAction'] = (
        f"Chapter VII offline contextual review: {seventh['formsConsidered']} forms / {seventh['consideredUses']} considered uses; "
        f"{seventh['reviewedUses']} reviewed, {seventh['heldUses']} held, {seventh['untouchedQueuedUses']} untouched. "
        f"{seventh['contextualProposals']} word banks / {seventh['newQuestionBands']} bands; "
        f"{seventh['reviewedExpressionForms']} new expression forms / {seventh['reviewedExpressionQuestionBands']} bands; "
        f"{seventh['recheckedEarlierExpressionBands']} earlier expression bands rechecked. " +
        (f"Continue at {next_item['form']}, unit {next_item['unit']} offsets {next_item['start']}–{next_item['end']}. " if next_item else "All VII queued forms are considered. Begin whole-work reconciliation at et, unit 169 offsets 89–91. " ) +
        "VI has 1,030 reviewed and 30 shared et/sans holds, with no untouched queued uses. "
        "Reconcile sans doute certainty/probability, noun/pronoun ownership and shared definition scope, then apply the "
        "impact-reviewed et/sans/sentit repairs before complete-work import. All Micromégas preparation remains unpublished; "
        "the release gate for the existing 11 works does not approve this candidate or authorize deployment.")
if progress_before.get('wholeWorkReconciliation'):
    reconciliation = progress_before['wholeWorkReconciliation']
    next_item = reconciliation['nextAction']
    handoff['nextAction'] = (
        f"Whole-work connective reconciliation: {reconciliation['reviewedPublishedIdentities']} existing identities / "
        f"{reconciliation['reviewedPublishedUses']} uses / {reconciliation['reviewedCurrentQuestionBands']} current and "
        f"{reconciliation['reviewedHistoricalQuestionBands']} historical bands; {reconciliation['candidateConnectiveUses']} candidate tokens. "
        "Seven replacement word bands, 25 exact phrase routes / 59 component tokens and 74 held-use routes are staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}), exact source {next_item['form']} at unit {next_item['unit']} "
        f"offsets {next_item['start']}–{next_item['end']}: {next_item['reason']} "
        "Existing 11-work release checks do not approve Micromégas or authorize deployment.")
if progress_before.get('wholeWorkOwnership'):
    owner = progress_before['wholeWorkOwnership']
    next_item = owner['nextAction']
    handoff['nextAction'] = (
        f"Whole-work owner reconciliation: {owner['reviewedOwnerFamilies']} families, "
        f"{owner['reviewedPublishedIdentities']} current identities / {owner['reviewedPublishedUses']} uses / {owner['reviewedPublishedBands']} bands "
        f"and {owner['reviewedCandidateBanks']} candidate banks / {owner['reviewedCandidateUses']} uses / {owner['reviewedCandidateBands']} bands. "
        f"Continue {next_item['form']} ({next_item['senseId']}) at unit {next_item['unit']} offsets {next_item['start']}–{next_item['end']}: "
        f"{next_item['reason']} All connective and owner corrections are offline and unapplied. No deployment.")
if progress_before.get('wholeWorkScopes'):
    scope = progress_before['wholeWorkScopes']
    next_item = scope['nextAction']
    handoff['nextAction'] = (
        f"Whole-work tout scope reconciliation: {scope['reviewedPublishedUses']} published word uses / "
        f"{scope['reviewedPublishedWordBands']} current + {scope['reviewedHistoricalBands']} historical bands; "
        f"{scope['reviewedPublishedExpressionUses']} complete phrases / {scope['reviewedPublishedExpressionBands']} bands; "
        f"all {scope['reviewedCandidateTokens']} candidate tout-family tokens have exact offline routes. "
        f"Continue {next_item['family']} ({next_item['identity']}) in {next_item['unitId']} "
        f"offsets {next_item['start']}–{next_item['end']}: {next_item['reason']} "
        "All reconciliation corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkExtent'):
    extent = progress_before['wholeWorkExtent']
    next_item = extent['nextAction']
    handoff['nextAction'] = (
        f"Whole-work extent reconciliation: {extent['reviewedPublishedUses']} word uses / "
        f"{extent['reviewedPublishedWordBands']} current + {extent['reviewedHistoricalBands']} historical bands; "
        f"two limit expression banks and all {extent['reviewedCandidateTokens']} candidate foot/covering tokens. "
        f"Continue {next_item['family']} ({next_item['senseId']}), {next_item['form']} at unit {next_item['unit']} "
        f"offsets {next_item['start']}–{next_item['end']}: {next_item['reason']} "
        "All current corrections remain offline and unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkAgency'):
    agency = progress_before['wholeWorkAgency']
    next_item = agency['nextAction']
    handoff['nextAction'] = (
        f"Whole-work agency reconciliation: {agency['reviewedPublishedIdentities']} word identities / "
        f"{agency['reviewedPublishedUses']} full uses / {agency['reviewedPublishedWordBands']} current bands; "
        f"{agency['reviewedCandidateBanks']} candidate banks / {agency['reviewedCandidateBankUses']} uses / "
        f"{agency['reviewedCandidateBands']} bands. Five question and five metadata changes plus complete prendre en main are staged. "
        f"Continue {next_item['family']} ({next_item['senseId']}), {next_item['form']} at unit {next_item['unit']} "
        f"offsets {next_item['start']}–{next_item['end']}: {next_item['reason']} "
        "All current corrections remain offline and unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkSmallness'):
    small = progress_before['wholeWorkSmallness']
    next_item = small['nextAction']
    handoff['nextAction'] = (
        f"Whole-work petit reconciliation: {small['reviewedPublishedIdentities']} existing identities / "
        f"{small['reviewedPublishedUses']} full uses / {small['reviewedPublishedWordBands']} bands; "
        f"all {small['reviewedCandidateTokens']} candidate tokens. Proper noun ownership/two meanings, "
        f"{small['newWordBands']} new word bands and complete petit doigt are staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}), {next_item['form']} at unit {next_item['unit']} "
        f"offsets {next_item['start']}–{next_item['end']}: {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkIndefiniteArrival'):
    group = progress_before['wholeWorkIndefiniteArrival']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work aucun/venir reconciliation: {group['reviewedPublishedIdentities']} identities / "
        f"{group['reviewedPublishedUses']} full uses / {group['reviewedPublishedWordBands']} current and "
        f"{group['reviewedHistoricalBands']} historical bands; all {group['reviewedCandidateTokens']} candidate tokens. "
        f"Eight middle repairs, proper pronoun ownership/two meanings and complete price/repeated-motion phrases staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}): {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkModality'):
    group = progress_before['wholeWorkModality']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work pouvoir reconciliation: {group['reviewedPublishedIdentities']} identities / "
        f"{group['reviewedPublishedUses']} full uses / {group['reviewedPublishedWordBands']} bands; "
        f"all {group['reviewedCandidateTokens']} candidate family/homograph tokens. "
        f"Nineteen middle repairs, seven generic metadata repairs, impersonal possibility coverage and cannot-help phrase staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}): {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkHumanScope'):
    group = progress_before['wholeWorkHumanScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work human-scope reconciliation: {group['reviewedPublishedIdentities']} identities / "
        f"{group['reviewedPublishedUses']} full uses / {group['reviewedPublishedWordBands']} current and "
        f"{group['reviewedHistoricalBands']} inactive historical bands; all {group['reviewedCandidateTokens']} candidate tokens. "
        f"Two ambiguity repairs, generic humanity/person wording and complete race humaine/human-rights phrases staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}): {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkQuoiScope'):
    group = progress_before['wholeWorkQuoiScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work quoi reconciliation: {group['reviewedPublishedIdentities']} identities / "
        f"{group['reviewedPublishedUses']} full uses / {group['reviewedPublishedWordBands']} stored bands; "
        f"all {group['reviewedCandidateTokens']} candidate tokens. Proper exclamative adverb ownership, French thing-reference metadata, "
        f"historical-surface question repairs, complete À quoi bon and overlays on the prior concession bank are staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}): {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkPrendreScope'):
    group = progress_before['wholeWorkPrendreScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work prendre reconciliation: {group['reviewedPublishedIdentities']} identities / "
        f"{group['reviewedPublishedUses']} full sources / {group['reviewedPublishedWordBands']} stored bands; "
        f"all {group['reviewedCandidateTokens']} candidate family/homograph tokens. Ten meaning-based middle repairs, "
        f"four generic metadata overlays, one shared onset meaning and adoption-as-datum correction staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}), unit{next_item['unit']} offsets{next_item['start']}–{next_item['end']}: {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkResignationCapture'):
    group = progress_before['wholeWorkResignationCapture']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work resignation/capture reconciliation: {group['reviewedPublishedIdentities']} identities / "
        f"{group['reviewedPublishedUses']} sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive historical bands. "
        f"Two full resignation surface banks/six bands, generic capture reuse and retained sur le fait bank staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}), unit{next_item['unit']} offsets{next_item['start']}–{next_item['end']}: {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkPriseNounScope'):
    group = progress_before['wholeWorkPriseNounScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work prise noun reconciliation: {group['reviewedPublishedUses']} active sources / "
        f"{group['reviewedHistoricalBands']} inactive historical bands retained; one generic noun meaning and three candidate replacement bands staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}): {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkRaisonScope'):
    group = progress_before['wholeWorkRaisonScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work raison reconciliation: {group['reviewedPublishedUses']} full active sources / "
        f"{group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; all four candidate tokens. "
        f"Generic rationale reuse and three full phrase banks/nine bands with eleven exact components staged offline. "
        f"Continue {next_item['family']} ({next_item['senseId']}): {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkAirScope'):
    group = progress_before['wholeWorkAirScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work air reconciliation: {group['reviewedPublishedUses']} full active sources / "
        f"{group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"{group['plannedNounMeanings']} proper noun meaning(s) and {group['reviewedCandidateBands']} retained candidate bands staged offline. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkVolumeScope'):
    group = progress_before['wholeWorkVolumeScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work volume reconciliation: {group['reviewedPublishedUses']} full active sources / "
        f"{group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"{group['plannedNounMeanings']} proper noun meaning(s) and {group['reviewedCandidateBands']} retained candidate bands staged offline. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkAmeScope'):
    group = progress_before['wholeWorkAmeScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work âme reconciliation: {group['reviewedPublishedUses']} full active sources / "
        f"{group['reviewedPublishedWordBands']} current bands, all {group['reviewedCandidateTokens']} candidate tokens. "
        f"One generic animating/thinking meaning and five earlier-source extensions of the shared bank staged offline; moral/affective records retained. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkCiterScope'):
    group = progress_before['wholeWorkCiterScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work citer reconciliation: {group['reviewedPublishedUses']} full active sources / "
        f"{group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"{group['plannedVerbMeanings']} proper verb meaning and {group['reviewedCandidateBands']} retained candidate bands staged offline. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All corrections remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkReprendreScope'):
    group = progress_before['wholeWorkReprendreScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work reprendre reconciliation: {group['reviewedPublishedUses']} full published sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held for editorial interpretation. All plans remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkApprendreScope'):
    group = progress_before['wholeWorkApprendreScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work apprendre reconciliation: {group['reviewedPublishedUses']} full published sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held for editorial interpretation. All plans remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkSavoirScope'):
    group = progress_before['wholeWorkSavoirScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work savoir reconciliation: {group['reviewedPublishedUses']} full published sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held for editorial interpretation. All plans remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkBienScope'):
    group = progress_before['wholeWorkBienScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work bien reconciliation: {group['reviewedPublishedUses']} full published sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held for editorial interpretation. All plans remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkPierreScope'):
    group = progress_before['wholeWorkPierreScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work pierre reconciliation: {group['reviewedPublishedUses']} full published sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held for editorial interpretation. All plans remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkMonsieurScope'):
    group = progress_before['wholeWorkMonsieurScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work monsieur reconciliation: {group['reviewedPublishedUses']} full published sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held for editorial interpretation. All plans remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkFaireScope'):
    group = progress_before['wholeWorkFaireScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work faire reconciliation: {group['reviewedPublishedUses']} full published sources / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held for editorial interpretation. All plans remain unapplied. Existing release readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkFairePhrasesScope'):
    group = progress_before['wholeWorkFairePhrasesScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work faire phrase reconciliation: {group['candidatePhraseSpans']} candidate full spans / {group['candidatePhraseComponentTokens']} components; {group['recheckedPriorExpressionBands']} prior full bands; {group['newCompletePhraseBands']} new surface bands. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre remains held. All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkFigureScope'):
    group = progress_before['wholeWorkFigureScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work figure reconciliation: {group['reviewedPublishedUses']} full published uses / {group['reviewedPublishedWordBands']} current and {group['reviewedHistoricalBands']} inactive bands; {group['newCompletePhraseBands']} full phrase bands; {group['retainedInterveningTokens']} intervening tokens retained. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Segment-aware faire figure import remains required. Unit213 reprendre remains held. All plans are unapplied; existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkFaireAttestationSharingTermsScope'):
    group = progress_before['wholeWorkFaireAttestationSharingTermsScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work sharing/attestation/terms reconciliation: {group['publishedPhraseSpans']} exact published phrases / {group['publishedPhraseComponentTokens']} components, {group['newCompletePhraseBands']} full phrase bands. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Unit213 reprendre and segment-aware faire figure import remain held. All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkFairePityHarmRelevanceInformingScope'):
    group = progress_before['wholeWorkFairePityHarmRelevanceInformingScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work pity/harm/relevance/informing reconciliation: {group['candidatePhraseSpans']} candidate phrases / {group['candidatePhraseComponentTokens']} exact components, {group['newCompletePhraseBands']} new phrase bands and {group['recheckedPriorExpressionBands']} reused informing bands with one evidence alias. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkMiroirScope'):
    group = progress_before['wholeWorkMiroirScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Miroir scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkPenserScope'):
    group = progress_before['wholeWorkPenserScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Penser scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkCommuniquerScope'):
    group = progress_before['wholeWorkCommuniquerScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Communiquer scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkPossibleScope'):
    group = progress_before['wholeWorkPossibleScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Possible scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkSecretScope'):
    group = progress_before['wholeWorkSecretScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Secret scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkPersonneScope'):
    group = progress_before['wholeWorkPersonneScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Personne scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkSoleilScope'):
    group = progress_before['wholeWorkSoleilScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Soleil scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkVentreScope'):
    group = progress_before['wholeWorkVentreScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Ventre scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkQuoiqueScope'):
    group = progress_before['wholeWorkQuoiqueScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Quoique scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkVoirScope'):
    group = progress_before['wholeWorkVoirScope']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Whole-work Voir scope: {group['reviewedPublishedUses']} complete published uses / {group['reviewedPublishedWordBands']} bands and {group['reviewedCandidateTokens']} candidate tokens. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkFinalPackageAssessment'):
    group = progress_before['wholeWorkFinalPackageAssessment']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Final package assessment: {group['reconciliationGroupsBound']} source-bound reconciliation groups; {group['heldEditorialUses']} held editorial use and {group['explicitImportPrerequisites']} explicit import prerequisites. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkReprendre213Resolution'):
    group = progress_before['wholeWorkReprendre213Resolution']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Reprendre unit 213: one previously held use resolved as an offline editorial inference; {group['reviewedPublishedUses']} published use and {group['reviewedHistoricalBands']} historical bands reviewed. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All plans remain unapplied. Existing readiness covers the previous 11 works, not Micromégas. No deployment.")
if progress_before.get('wholeWorkImportComposition'):
    group = progress_before['wholeWorkImportComposition']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Import composition42: {group['sourceTokens']} exact source tokens in {group['sourceUnits']} units, {group['phraseSpans']} expression spans and {group['phraseComponentUses']} lexical components. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "Source routing is composed offline; final identities and question banks still require materialization and work-specific approval. No publication or deployment.")
if progress_before.get('wholeWorkIdentityDependencies'):
    group = progress_before['wholeWorkIdentityDependencies']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Identity dependencies43: {group['declarations']} declarations and exact stored banks; {group['declaredSameSenseLinks']} same-sense links and {group['declaredLemmaOnlyLinks']} lemma-only links. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "The source map and historical dependency graph remain offline. Final identities, bank selection and work-specific approval remain. No publication or deployment.")
if progress_before.get('wholeWorkReviewedWordBanks'):
    group = progress_before['wholeWorkReviewedWordBanks']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Reviewed word composition44/45: {group['identityBanks']} final reviewed word keys and {group['storedPreparedQuestionBands']} stored prepared questions. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All bindings and canonical banks remain an isolated offline candidate; work-specific approval and full import validation remain. No publication or deployment.")
if progress_before.get('wholeWorkDirectWordPackage'):
    group = progress_before['wholeWorkDirectWordPackage']
    next_item = group['nextAction']
    handoff['nextAction'] = (
        f"Direct word package46: {group['boundDirectDraftIdentityGroups']} draft word keys, {group['boundDirectDraftSourceUses']} exact uses and {group['storedPreparedQuestionBands']} stored prepared questions. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All staged candidates remain offline and unapplied. Work-specific approval and full import validation remain. No publication or deployment.")
if progress_before.get('wholeWorkResolvedExpressions'):
    words = progress_before['wholeWorkResolvedWords']
    expressions = progress_before['wholeWorkResolvedExpressions']
    next_item = expressions['nextAction']
    handoff['nextAction'] = (
        f"Resolved packages47/48: {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions, plus {expressions['boundExpressionSurfaceKeys']} full expression surface keys/{expressions['expressionSourceSpans']} spans/{expressions['storedPreparedQuestionBands']} questions. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All candidates remain offline and unapplied; work-specific approval and complete import validation remain. No publication or deployment.")
if progress_before.get('wholeWorkConstructionExpressions'):
    words = progress_before['wholeWorkContinuationWords']
    expressions = progress_before['wholeWorkConstructionExpressions']
    next_item = expressions['nextAction']
    handoff['nextAction'] = (
        f"Continuation packages49/50: {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions, plus {expressions['boundExpressionSurfaceKeys']} expression surface keys/{expressions['expressionSourceSpans']} spans/{expressions['storedPreparedQuestionBands']} questions. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All candidates remain offline and unapplied; work-specific approval and complete import validation remain. No publication or deployment.")
if progress_before.get('wholeWorkFamilyConstructions'):
    words = progress_before['wholeWorkReviewedFamilyWords']
    expressions = progress_before['wholeWorkFamilyConstructions']
    next_item = expressions['nextAction']
    handoff['nextAction'] = (
        f"Reviewed family packages51/52: {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions, plus {expressions['boundExpressionSurfaceKeys']} expression surface keys/{expressions['expressionSourceSpans']} spans/{expressions['storedPreparedQuestionBands']} questions. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All candidates remain offline and unapplied; work-specific approval and complete import validation remain. No publication or deployment.")
if progress_before.get('wholeWorkNextConstructions'):
    expressions = progress_before['wholeWorkNextConstructions']
    next_item = expressions['nextAction']
    handoff['nextAction'] = (
        f"Next construction package53: {expressions['boundExpressionSurfaceKeys']} full expressions/{expressions['expressionSourceSpans']} spans/{expressions['storedPreparedQuestionBands']} questions. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All candidates remain offline and unapplied; work-specific approval and complete import validation remain. No publication or deployment.")
for review_key, package_label in [('wholeWorkSourceWords55', '54/55'), ('wholeWorkSourceWords57', '56/57')]:
    if progress_before.get(review_key):
        words = progress_before[review_key]
        next_item = words['nextAction']
        handoff['nextAction'] = (
            f"Source packages{package_label}: {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions. "
            f"Continue {next_item['family']}: {next_item['reason']} "
            "All candidates remain offline and unapplied; work-specific approval and complete import validation remain. No publication or deployment.")
if progress_before.get('wholeWorkMixedDeResolution58'):
    package = progress_before['wholeWorkMixedDeResolution58']
    next_item = package['nextAction']
    handoff['nextAction'] = (
        f"Source package58 resolves five de uses into one preposition route and four complete partitive expressions, with {package['expressionSourceSpans']} spans/{package['storedPreparedQuestionBands']} questions. "
        f"Continue {next_item['family']}: {next_item['reason']} "
        "All candidates remain offline and unapplied; work-specific approval and complete import validation remain. No publication or deployment.")
if progress_before.get('wholeWorkSourceWords59'):
    words = progress_before['wholeWorkSourceWords59']
    item = words['nextAction']
    handoff['nextAction'] = (
        f"Source package59: {words['reviewedSourceGroups']} reviewed source groups; {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions. "
        f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
        "All candidates remain offline and unapplied; no publication or deployment.")
if progress_before.get('wholeWorkSourceWords60'):
    words = progress_before['wholeWorkSourceWords60']
    item = words['nextAction']
    handoff['nextAction'] = (
        f"Source package60: {words['reviewedSourceGroups']} reviewed source groups; {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions. "
        f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
        "All candidates remain offline and unapplied; no publication or deployment.")
if progress_before.get('wholeWorkSourceWords61'):
    words = progress_before['wholeWorkSourceWords61']
    item = words['nextAction']
    handoff['nextAction'] = (
        f"Source package61: {words['reviewedSourceGroups']} reviewed source groups; {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions. "
        f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
        "All candidates remain offline and unapplied; no publication or deployment.")
if progress_before.get('wholeWorkSourceWords62'):
    words = progress_before['wholeWorkSourceWords62']
    item = words['nextAction']
    handoff['nextAction'] = (
        f"Source package62: {words['reviewedSourceGroups']} reviewed source groups; {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions. "
        f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
        "All candidates remain offline and unapplied; no publication or deployment.")
if progress_before.get('wholeWorkSourceWords63'):
    words = progress_before['wholeWorkSourceWords63']
    item = words['nextAction']
    handoff['nextAction'] = (
        f"Source package63: {words['reviewedSourceGroups']} reviewed source groups; {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions. "
        f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
        "All candidates remain offline and unapplied; no publication or deployment.")
if progress_before.get('wholeWorkSourceWords64'):
    words = progress_before['wholeWorkSourceWords64']
    item = words['nextAction']
    handoff['nextAction'] = (
        f"Source package64: {words['reviewedSourceGroups']} reviewed source groups; {words['boundDirectDraftIdentityGroups']} word keys/{words['boundDirectDraftSourceUses']} uses/{words['storedPreparedQuestionBands']} questions. "
        f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
        "All candidates remain offline and unapplied; no publication or deployment.")
if progress_before.get('wholeWorkOriginalPhrases66'):
    package = progress_before['wholeWorkOriginalPhrases66']
    item = package['nextAction']
    handoff['nextAction'] = (
        f"Held package65 resolves all five direct source uses through nine lexical owners/six keys/eighteen bands. "
        f"Original phrase package66: {package['reviewedOriginalPhraseSpans']} reviewed spans/{package['boundExpressionSurfaceKeys']} Surface+Expression keys/{package['storedPreparedQuestionBands']} questions. "
        f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
        "All candidates remain offline and unapplied; no publication or deployment.")
for number in [67, 68, 69]:
    if progress_before.get(f'wholeWorkOriginalPhrases{number}'):
        package = progress_before[f'wholeWorkOriginalPhrases{number}']
        item = package['nextAction']
        handoff['nextAction'] = (
            f"Original phrase package{number}: {package['reviewedOriginalPhraseSpans']} reviewed spans; "
            f"{package['boundExpressionSurfaceKeys']} expression keys/{package['storedPreparedQuestionBands']} expression bands. "
            f"{package.get('completePronominalWordSpans', 0)} complete word spans/{package.get('storedWordQuestionBands', 0)} word bands. "
            f"Continue {item['form']} at unit {item['unit']}:{item['start']}–{item['end']}. {item['reason']} "
            "All candidates remain offline and unapplied; no publication or deployment.")
if progress_before.get('wholeWorkOriginalPhrases69'):
    package = progress_before['wholeWorkOriginalPhrases69']
    handoff['nextAction'] = (
        "All127 original phrase spans are prepared:124 expression spans and3 complete s’agit word spans;347 exact lexical components. "
        "All direct draft word uses are resolved. " + package['nextAction']['reason'] +
        " The candidate remains offline and unapplied; completion of source preparation is not publication approval.")
if progress_before.get('wholeWorkCandidateCatalog70'):
    package = progress_before['wholeWorkCandidateCatalog70']
    handoff['nextAction'] = package['nextAction']['reason']
if progress_before.get('wholeWorkContextRepairs73'):
    handoff['nextAction'] = progress_before['wholeWorkContextRepairs73']['nextAction']['reason']
if progress_before.get('wholeWorkAcceptance76'):
    item = progress_before['wholeWorkAcceptance76']['nextAction']
    handoff['nextAction'] = item['reason'] + f" Next: {item['form']} / {item['band']} / {item['subject']['id']}."
if progress_before.get('wholeWorkFinalReview77'):
    handoff['nextAction'] = 'Final editorial acceptance complete; integrate the verified local Micromégas transaction and run the real twelve-work release gate.'
if progress_before.get('wholeWorkRelease78'):
    handoff['nextContentWorkId'] = None
    handoff['micromegasReadyForUpload'] = audit['releaseReady']
    handoff['nextAction'] = 'Micromégas is included in the validated twelve-work local publication. Extract this ZIP into the existing Git checkout, review and commit the changes in GitHub Desktop, then upload. No GitHub push or deployment has occurred.'
(root / 'docs/EDITORIAL_HANDOFF.json').write_text(json.dumps(handoff, indent=2) + '\n')

excluded = {'.git', 'node_modules', 'dist', 'build', 'review-build', 'site-dist', 'coverage', '.sites-runtime', '__pycache__'}
manifest = []
try:
    with zipfile.ZipFile(temporary, 'x', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(root.rglob('*')):
            relative = path.relative_to(root)
            if not path.is_file() or path.is_symlink() or str(relative) == 'CHECKPOINT.json' or any(part in excluded or part.startswith('.publication-') for part in relative.parts):
                continue
            if path.name.startswith('.env') or path.suffix in {'.pem', '.key', '.log'}:
                continue
            if relative.parts[0].startswith('.') and relative.parts[0] not in {'.github', '.gitignore', '.gitattributes', '.openai'}:
                continue
            if relative.parts[0] == '.openai' and str(relative) != '.openai/hosting.json':
                continue
            if str(relative).startswith('public/content/'):
                continue
            data = path.read_bytes()
            archive.writestr(str(relative), data)
            manifest.append({'path': str(relative), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        archive.writestr('CHECKPOINT.json', json.dumps({'label': label, 'handoff': 'docs/EDITORIAL_HANDOFF.json', 'files': manifest}, indent=2))
    if source_snapshot(root) != source_before:
        raise RuntimeError('Micromégas source/progress files changed while writing the ZIP')
    verify_archive(temporary, root, expected_name=destination.name)
    temporary.rename(destination)
finally:
    temporary.unlink(missing_ok=True)
print(json.dumps({'checkpoint': str(destination), 'files': len(manifest), 'bytes': destination.stat().st_size, 'blockedRecords': audit['blockedRecords'], 'nextFrenchVocabularyIds': handoff['nextFrenchVocabularyIds']}))
