"""A readable ZIP with stale editorial progress must not pass verification."""
from pathlib import Path
from tempfile import TemporaryDirectory
import copy
import importlib.util
import json
import sys
import unittest
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from checkpoint_integrity import CANDIDATE, family_package_summary, next_construction_summary, continuation_package_summary, candidate_progress, chapter_six_continuation_summary, chapter_seven_partial_summary, digest, verify_archive


class CheckpointIntegrityTests(unittest.TestCase):
    def test_recovery_includes_new_package_scripts_and_tests_absent_from_base(self):
        script = Path(__file__).resolve().parents[1] / 'scripts/editorial-recovery-increment.py'
        spec = importlib.util.spec_from_file_location('polylit_recovery', script)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        with TemporaryDirectory() as directory:
            module.ROOT = Path(directory)
            for name in ['scripts/micromegas-source-words-99.mjs', 'scripts/record-micromegas-source-words-99.mjs', 'tests/micromegas-source-words-99.test.js']:
                path = module.ROOT / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('new source package')
            selected = {p.as_posix() for p in module.paths()}
            self.assertTrue({'scripts/micromegas-source-words-99.mjs', 'scripts/record-micromegas-source-words-99.mjs', 'tests/micromegas-source-words-99.test.js'} <= selected)

    def test_rejects_a_stale_but_readable_dossier(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            name = "Polylit-French-Editorial-test-integrity.zip"
            archive_path = root / name
            batch_name = "chapter-01-batch-01.json"
            batch_path = f"{CANDIDATE}/{batch_name}"
            dossier_path = f"{CANDIDATE}/dossier.json"
            review_path = f"{CANDIDATE}/chapter-01-review.json"
            handoff_path = "docs/EDITORIAL_HANDOFF.json"
            batch = {"items": [{"sourceOccurrences": [{"chapter": 1}], "questions": [{}, {}, {}]} for _ in range(10)]}
            dossier = {"workId": "wrk_voltaire_micromegas", "evidence": [{"file": batch_name}], "history": [{"version": 1}]}
            review = {"lexicalBatch01": {"file": batch_name, "identities": 10, "indexedWorkwideOccurrences": 10,
                                        "indexedChapterOccurrences": 10, "preparedOfflineQuestionDrafts": 30}}
            blobs = {batch_path: json.dumps(batch).encode(), dossier_path: json.dumps(dossier).encode(),
                     review_path: json.dumps(review).encode()}
            progress = candidate_progress(lambda path: blobs[path])
            blobs[handoff_path] = json.dumps({"checkpoint": name, "candidateProgress": progress}).encode()

            def write_zip():
                with zipfile.ZipFile(archive_path, "w") as archive:
                    for path, content in blobs.items():
                        archive.writestr(path, content)
                    archive.writestr("CHECKPOINT.json", json.dumps({"label": "test-integrity", "files": [
                        {"path": path, "bytes": len(content), "sha256": digest(content)} for path, content in blobs.items()
                    ]}))

            write_zip()
            self.assertEqual(verify_archive(archive_path)["candidateProgress"], progress)
            dossier["history"][0]["version"] = 2
            blobs[dossier_path] = json.dumps(dossier).encode()
            write_zip()  # Valid CRC and updated manifest, but handoff still describes the old dossier.
            with self.assertRaisesRegex(ValueError, "handoff disagrees"):
                verify_archive(archive_path)

    def sixth_fixture(self):
        root = Path(__file__).resolve().parents[1]
        read = lambda name: (root / name).read_bytes()
        sixth = json.loads(read(f"{CANDIDATE}/chapter-06-progress.json"))
        first = json.loads(read(f"{CANDIDATE}/chapter-06-context-review-01.json"))
        return read, sixth, first

    def test_rejects_inflated_chapter_six_cumulative_review(self):
        read, sixth, first = self.sixth_fixture()
        chapter_six_continuation_summary(read, sixth, first)
        altered = copy.deepcopy(sixth)
        altered["effectiveSummary"]["reviewedUses"] += 1
        altered["effectiveSummary"]["heldUses"] -= 1  # Overall sum still balances.
        with self.assertRaisesRegex(ValueError, "cumulative totals disagree"):
            chapter_six_continuation_summary(read, altered, first)

    def test_rejects_double_counted_chapter_six_source_occurrence(self):
        read, sixth, first = self.sixth_fixture()
        name = f"{CANDIDATE}/{sixth['continuationPackages'][0]['reviewFile']}"
        altered = json.loads(read(name))
        # Keep the same number of records, replacing a new use with an old one.
        altered["items"][0]["sourceOccurrences"][0] = first["items"][0]["sourceOccurrences"][0]
        reread = lambda path: json.dumps(altered).encode() if path == name else read(path)
        with self.assertRaisesRegex(ValueError, "source partition disagrees"):
            chapter_six_continuation_summary(reread, sixth, first)

    def test_rejects_stale_next_action_after_chapter_six_queue_is_exhausted(self):
        read, sixth, first = self.sixth_fixture()
        if sixth["effectiveSummary"]["untouchedQueuedUses"]:
            self.skipTest("This checkpoint still has an untouched source range")
        self.assertIsNone(sixth["nextUntouchedAction"])
        altered = copy.deepcopy(sixth)
        altered["nextUntouchedAction"] = {"form": "plaints", "unit": 156, "start": 102, "end": 109}
        with self.assertRaisesRegex(ValueError, "next untouched source action disagrees"):
            chapter_six_continuation_summary(read, altered, first)

    def seventh_fixture(self):
        root = Path(__file__).resolve().parents[1]
        read = lambda name: (root / name).read_bytes()
        seventh = json.loads(read(f"{CANDIDATE}/chapter-07-progress.json"))
        return read, seventh

    def test_rejects_mutated_inherited_chapter_six_held_bank(self):
        read, sixth, first = self.sixth_fixture()
        name = sixth["heldContextOverlay"]["file"]
        record = json.loads(read(f"{CANDIDATE}/{name}"))
        record["items"][0]["questions"][1]["context"] = "A replacement question disguised as retained evidence."
        replacement = json.dumps(record).encode()
        altered = copy.deepcopy(sixth)
        altered["heldContextOverlay"]["sha256"] = digest(replacement)
        reread = lambda path: replacement if path == f"{CANDIDATE}/{name}" else read(path)
        with self.assertRaisesRegex(ValueError, "inherited held bank changed"):
            chapter_six_continuation_summary(reread, altered, first)

    def test_rejects_balanced_but_inflated_chapter_seven_progress(self):
        read, seventh = self.seventh_fixture()
        chapter_seven_partial_summary(read, seventh)
        altered = copy.deepcopy(seventh)
        altered["effectiveSummary"]["reviewedUses"] += 1
        altered["effectiveSummary"]["heldUses"] -= 1
        with self.assertRaisesRegex(ValueError, "cumulative totals disagree"):
            chapter_seven_partial_summary(read, altered)

    def test_rejects_duplicate_chapter_seven_use_even_with_updated_evidence_hash(self):
        read, seventh = self.seventh_fixture()
        name = seventh["reviewFile"]
        review = json.loads(read(f"{CANDIDATE}/{name}"))
        review["items"][1]["sourceOccurrences"][0] = review["items"][0]["sourceOccurrences"][0]
        replacement = json.dumps(review).encode()
        altered = copy.deepcopy(seventh)
        altered["evidenceSha256"][name] = digest(replacement)
        if altered.get("packages"):
            altered["packages"][0]["evidenceSha256"][name] = digest(replacement)
        reread = lambda path: replacement if path == f"{CANDIDATE}/{name}" else read(path)
        with self.assertRaisesRegex(ValueError, "source partition disagrees"):
            chapter_seven_partial_summary(reread, altered)

    def test_rejects_changed_reconciliation_component_plan(self):
        root = Path(__file__).resolve().parents[1]
        name = f"{CANDIDATE}/whole-work-component-plan-01.json"
        altered = json.loads((root / name).read_bytes())
        altered["items"][0]["sourceOccurrence"]["start"] += 1
        reread = lambda path: json.dumps(altered).encode() if path == name else (root / path).read_bytes()
        with self.assertRaisesRegex(ValueError, "reconciliation evidence changed"):
            candidate_progress(reread)

    def test_rejects_rebound_but_inflated_reconciliation_counts(self):
        root = Path(__file__).resolve().parents[1]
        names = [f"{CANDIDATE}/{name}" for name in ("dossier.json", "whole-work-progress-01.json", "whole-work-review-ledger-01.json")]
        dossier, progress, ledger = [json.loads((root / name).read_bytes()) for name in names]
        for summary in (dossier["review"]["wholeWorkReconciliation"]["summary"], progress["summary"], ledger["summary"]):
            summary["reviewedPublishedUses"] += 1
        ledger_bytes = json.dumps(ledger).encode()
        progress["evidenceSha256"]["whole-work-review-ledger-01.json"] = digest(ledger_bytes)
        replacements = {names[0]: json.dumps(dossier).encode(), names[1]: json.dumps(progress).encode(), names[2]: ledger_bytes}
        reread = lambda path: replacements[path] if path in replacements else (root / path).read_bytes()
        with self.assertRaisesRegex(ValueError, "exact-source review counts disagree"):
            candidate_progress(reread)

    def direct_package_replacements(self, mutate):
        root = Path(__file__).resolve().parents[1]
        file = "whole-work-direct-word-package-46.json"
        names = [f"{CANDIDATE}/{name}" for name in ("dossier.json", "whole-work-direct-word-progress-46.json", file)]
        dossier, small, data = [json.loads((root / name).read_bytes()) for name in names]
        mutate(dossier, small, data)
        data_bytes = json.dumps(data, ensure_ascii=False).encode()
        small["evidenceSha256"][file] = digest(data_bytes)
        replacements = {names[0]: json.dumps(dossier).encode(), names[1]: json.dumps(small).encode(), names[2]: data_bytes}
        return lambda path: replacements[path] if path in replacements else (root / path).read_bytes()

    def test_rejects_inflated_direct_word_counts_with_updated_hashes(self):
        def mutate(dossier, small, data):
            for summary in [dossier["review"]["wholeWorkDirectWordPackage"]["summary"], small["summary"], data["summary"]]:
                summary["boundDirectDraftSourceUses"] += 1
                summary["remainingDirectDraftSourceUses"] -= 1
        with self.assertRaisesRegex(ValueError, "Direct word package exact counts disagree"):
            candidate_progress(self.direct_package_replacements(mutate))

    def test_rejects_duplicate_direct_word_use_with_updated_hashes(self):
        def mutate(dossier, small, data):
            data["occurrenceBindings"][1] = copy.deepcopy(data["occurrenceBindings"][0])
        with self.assertRaisesRegex(ValueError, "Direct word package exact source partition disagrees"):
            candidate_progress(self.direct_package_replacements(mutate))

    def construction_fixture(self, mutate):
        root = Path(__file__).resolve().parents[1]
        read = lambda name: (root / name).read_bytes()
        manifest = json.loads(read(f"{CANDIDATE}/publication-baseline-376/shared/fr.json"))
        shared = {kind: [record for file in manifest["files"][kind] for record in json.loads(read(f"{CANDIDATE}/publication-baseline-376/{file}"))["records"]] for kind in ["lemmas", "senses", "surfaceForms"]}
        file = "whole-work-construction-expressions-50.json"
        dossier, small, data = [json.loads(read(f"{CANDIDATE}/{name}")) for name in ["dossier.json", "whole-work-construction-expression-progress-50.json", file]]
        mutate(dossier, small, data)
        raw = json.dumps(data, ensure_ascii=False).encode()
        small["evidenceSha256"][file] = digest(raw)
        replacement = {f"{CANDIDATE}/{file}": raw, f"{CANDIDATE}/whole-work-construction-expression-progress-50.json": json.dumps(small).encode()}
        return (lambda name: replacement.get(name, read(name))), dossier, shared

    def test_rejects_inflated_construction_counts_with_rebound_progress(self):
        def mutate(dossier, small, data):
            for counts in [dossier["review"]["wholeWorkConstructionExpressions"]["summary"], small["summary"], data["summary"]]:
                counts["reassignedDraftWordUses"] += 1
        with self.assertRaisesRegex(ValueError, "Continuation independent counts"):
            continuation_package_summary(*self.construction_fixture(mutate))

    def test_rejects_swallowed_grammar_in_a_discontinuous_expression(self):
        def mutate(dossier, small, data):
            span = next(o for o in data["occurrences"] if o["text"] == "rendait un fort bon compte")
            span["lexicalSegments"][0]["end"] = 165
        with self.assertRaisesRegex(ValueError, "Continuation discontinuous"):
            continuation_package_summary(*self.construction_fixture(mutate))

    def test_rejects_changed_intervening_word_owner(self):
        def mutate(dossier, small, data):
            data["retainedInterveningWordUses"][0]["owner"] = copy.deepcopy(data["componentBindings"][0]["baseOwner"])
        with self.assertRaisesRegex(ValueError, "Continuation intervening owner"):
            continuation_package_summary(*self.construction_fixture(mutate))

    def family_fixture(self, mutate):
        root=Path(__file__).resolve().parents[1]
        read=lambda name:(root/name).read_bytes()
        manifest=json.loads(read(f"{CANDIDATE}/publication-baseline-376/shared/fr.json"))
        shared={kind:[record for file in manifest["files"][kind] for record in json.loads(read(f"{CANDIDATE}/publication-baseline-376/{file}"))["records"]] for kind in ["lemmas","senses","surfaceForms"]}
        name="whole-work-family-constructions-52.json"
        dossier,small,data=[json.loads(read(f"{CANDIDATE}/{file}")) for file in ["dossier.json","whole-work-family-construction-progress-52.json",name]]
        mutate(dossier,small,data)
        raw=json.dumps(data,ensure_ascii=False).encode()
        small["evidenceSha256"][name]=digest(raw)
        replacements={f"{CANDIDATE}/{name}":raw,f"{CANDIDATE}/whole-work-family-construction-progress-52.json":json.dumps(small).encode()}
        return (lambda path:replacements.get(path,read(path))),dossier,shared

    def test_rejects_inflated_family_counts_despite_updated_hashes(self):
        def mutate(dossier,small,data):
            for counts in [dossier["review"]["wholeWorkFamilyConstructions"]["summary"],small["summary"],data["summary"]]:counts["ownedLexicalComponents"]+=1
        with self.assertRaisesRegex(ValueError,"Family independent counts"):
            family_package_summary(*self.family_fixture(mutate))

    def test_rejects_shortened_until_now_formula(self):
        def mutate(dossier,small,data):
            span=next(o for o in data["occurrences"] if o["text"]=="jusqu’à présent")
            span["start"]=72
            span["text"]="à présent"
        with self.assertRaisesRegex(ValueError,"Family expression component|Family full formula"):
            family_package_summary(*self.family_fixture(mutate))

    def test_rejects_color_formula_swallowing_its_complement(self):
        def mutate(dossier,small,data):
            span=next(o for o in data["occurrences"] if o["text"]=="tire sur")
            span["end"]=214
            span["text"]="tire sur le rouge"
        with self.assertRaisesRegex(ValueError,"Family full formula"):
            family_package_summary(*self.family_fixture(mutate))

    def next_construction_fixture(self, mutate):
        root=Path(__file__).resolve().parents[1]
        read=lambda name:(root/name).read_bytes()
        file="whole-work-next-constructions-53.json"
        dossier,small,data=[json.loads(read(f"{CANDIDATE}/{f}")) for f in ["dossier.json","whole-work-next-construction-progress-53.json",file]]
        mutate(dossier,small,data)
        raw=json.dumps(data,ensure_ascii=False).encode()
        small["evidenceSha256"][file]=digest(raw)
        replacements={f"{CANDIDATE}/{file}":raw,f"{CANDIDATE}/whole-work-next-construction-progress-53.json":json.dumps(small).encode()}
        return (lambda path:replacements.get(path,read(path))),dossier

    def test_rejects_shortened_next_full_expression_with_rehashed_artifact(self):
        def mutate(dossier,small,data):
            span=next(o for o in data["occurrences"] if o["text"]=="sous presse")
            span["start"]=143
            span["text"]="presse"
        with self.assertRaisesRegex(ValueError,"source span changed|exact source span set"):
            next_construction_summary(*self.next_construction_fixture(mutate))

    def test_rejects_double_counted_next_component_with_rehashed_artifact(self):
        def mutate(dossier,small,data):
            data["componentBindings"][0]=copy.deepcopy(data["componentBindings"][1])
        with self.assertRaisesRegex(ValueError,"lexical component changed"):
            next_construction_summary(*self.next_construction_fixture(mutate))

    def test_rejects_rebound_but_inflated_scope_review(self):
        root = Path(__file__).resolve().parents[1]
        for number, review, error in [("03", "wholeWorkScopes", "Scope"), ("04", "wholeWorkExtent", "Extent"), ("05", "wholeWorkAgency", "Agency"), ("06", "wholeWorkSmallness", "Smallness"), ("07", "wholeWorkIndefiniteArrival", "Indefinite/arrival"), ("08", "wholeWorkModality", "Modality"), ("09", "wholeWorkHumanScope", "Human scope"), ("10", "wholeWorkQuoiScope", "Quoi scope"), ("11", "wholeWorkPrendreScope", "Prendre scope"), ("12", "wholeWorkResignationCapture", "Resignation/capture"), ("13", "wholeWorkPriseNounScope", "Prise noun scope"), ("14", "wholeWorkRaisonScope", "Raison scope"), ("16", "wholeWorkVolumeScope", "Volume scope"), ("17", "wholeWorkAmeScope", "Ame scope"), ("18", "wholeWorkCiterScope", "Citer scope"), ("15", "wholeWorkAirScope", "Air scope"), ("19", "wholeWorkReprendreScope", "Reprendre scope"), ("20", "wholeWorkApprendreScope", "Apprendre scope"), ("21", "wholeWorkSavoirScope", "Savoir scope"), ("22", "wholeWorkBienScope", "Bien scope"), ("23", "wholeWorkPierreScope", "Pierre scope"), ("24", "wholeWorkMonsieurScope", "Monsieur scope"), ("25", "wholeWorkFaireScope", "Faire scope"), ("26", "wholeWorkFairePhrasesScope", "Faire phrases scope"), ("27", "wholeWorkFigureScope", "Figure scope"), ("28", "wholeWorkFaireAttestationSharingTermsScope", "Faire attestation sharing terms scope"), ("29", "wholeWorkFairePityHarmRelevanceInformingScope", "Faire pity harm relevance informing scope"), ("30", "wholeWorkMiroirScope", "Miroir scope"), ("31", "wholeWorkPenserScope", "Penser scope"), ("32", "wholeWorkCommuniquerScope", "Communiquer scope"), ("33", "wholeWorkPossibleScope", "Possible scope"), ("34", "wholeWorkSecretScope", "Secret scope"), ("35", "wholeWorkPersonneScope", "Personne scope"), ("36", "wholeWorkSoleilScope", "Soleil scope"), ("37", "wholeWorkVentreScope", "Ventre scope"), ("38", "wholeWorkQuoiqueScope", "Quoique scope"), ("39", "wholeWorkVoirScope", "Voir scope"), ("40", "wholeWorkFinalPackageAssessment", "Final package assessment")]:          
            with self.subTest(package=number):
                names = [f"{CANDIDATE}/{name}" for name in ("dossier.json", f"whole-work-scope-progress-{number}.json", f"whole-work-scope-plan-{number}.json")]
                dossier, progress, plan = [json.loads((root / name).read_bytes()) for name in names]
                for summary in (dossier["review"][review]["summary"], progress["summary"], plan["summary"]):
                    summary["reviewedPublishedUses"] += 1
                plan_bytes = json.dumps(plan).encode()
                progress["evidenceSha256"][f"whole-work-scope-plan-{number}.json"] = digest(plan_bytes)
                replacements = {names[0]: json.dumps(dossier).encode(), names[1]: json.dumps(progress).encode(), names[2]: plan_bytes}
                reread = lambda path: replacements[path] if path in replacements else (root / path).read_bytes()
                with self.assertRaisesRegex(ValueError, f"{error} reconciliation exact-source counts disagree"):
                    candidate_progress(reread)


if __name__ == "__main__":
    unittest.main()
