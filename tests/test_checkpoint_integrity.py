"""A readable ZIP with stale editorial progress must not pass verification."""
from pathlib import Path
from tempfile import TemporaryDirectory
import json
import sys
import unittest
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from checkpoint_integrity import CANDIDATE, candidate_progress, digest, verify_archive


class CheckpointIntegrityTests(unittest.TestCase):
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


if __name__ == "__main__":
    unittest.main()
