"""Check that an editorial checkpoint reflects its source tree and progress."""
from __future__ import annotations

from hashlib import sha256
from pathlib import Path
import argparse
import json
import re
import zipfile

CANDIDATE = "content/sources/wrk_voltaire_micromegas"
TRACKED = (
    "AGENTS.md", "docs/CHECKPOINT_RECOVERY.md",
    "docs/MICROMEGAS_PROGRESS.md", "docs/MICROMEGAS_READINESS.md",
    "docs/MICROMEGAS_METTRE_REFLEXIVE_IMPACT.json", "docs/MICROMEGAS_METTRE_BEGIN_IMPACT.json",
    "scripts/check-text-sources.mjs", "scripts/editorial-checkpoint.py", "scripts/checkpoint_integrity.py",
    "scripts/micromegas-reuse-packet.mjs",
    "scripts/editorial-recovery-increment.py",
    "scripts/prepare-micromegas-chapter-01-shared-snapshot.mjs",
)


def digest(data: bytes) -> str:
    return sha256(data).hexdigest()


def source_snapshot(root: Path) -> dict[str, str]:
    paths = [p for p in (root / CANDIDATE).rglob("*") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("prepare-micromegas-*.mjs") if p.is_file()]
    paths += [root / name for name in TRACKED]
    return {str(p.relative_to(root)): digest(p.read_bytes()) for p in sorted(paths)}


def candidate_progress(read_bytes) -> dict:
    dossier_bytes = read_bytes(f"{CANDIDATE}/dossier.json")
    dossier = json.loads(dossier_bytes)
    evidence = {e["file"] for e in dossier["evidence"]}
    batch_names = sorted(e for e in evidence if re.fullmatch(r"chapter-01-batch-\d\d\.json", e))
    if batch_names != [f"chapter-01-batch-{n:02d}.json" for n in range(1, len(batch_names) + 1)]:
        raise ValueError("Micromégas batch sequence has a gap")
    if dossier["history"][-1]["version"] < len(batch_names):
        raise ValueError("Micromégas dossier history is older than its drafts")
    senses = occurrences = questions = chapter_one = 0
    review = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-review.json"))
    for name in batch_names:
        batch = json.loads(read_bytes(f"{CANDIDATE}/{name}"))
        if len(batch["items"]) != batch.get("expectedIdentityCount", 10) or not 7 <= len(batch["items"]) <= 10:
            raise ValueError(f"Incomplete Micromégas batch: {name}")
        recorded = review.get(f"lexicalBatch{name[-7:-5]}")
        if not recorded or recorded["file"] != name or recorded["identities"] != len(batch["items"]):
            raise ValueError(f"Review does not record {name}")
        batch_occurrences = sum(len(item["sourceOccurrences"]) for item in batch["items"])
        batch_chapter_one = sum(sum(o["chapter"] == 1 for o in item["sourceOccurrences"]) for item in batch["items"])
        batch_questions = sum(len(item["questions"]) for item in batch["items"])
        if (recorded["indexedWorkwideOccurrences"], recorded["indexedChapterOccurrences"], recorded["preparedOfflineQuestionDrafts"]) != (batch_occurrences, batch_chapter_one, batch_questions):
            raise ValueError(f"Review counts disagree with {name}")
        senses += len(batch["items"])
        occurrences += batch_occurrences
        chapter_one += batch_chapter_one
        questions += batch_questions
    progress = {"workId": dossier["workId"], "dossierSha256": digest(dossier_bytes),
            "historyVersion": dossier["history"][-1]["version"], "evidenceCount": len(evidence),
            "batchCount": len(batch_names), "senseDrafts": senses,
            "workwideOccurrences": occurrences, "chapterOneOccurrences": chapter_one,
            "vocabularyQuestionDrafts": questions, "latestBatch": batch_names[-1] if batch_names else None}
    if "chapter-01-qa-01.json" in evidence:
        qa = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-01.json"))
        reviewed = len(qa["items"])
        if reviewed != 50 or reviewed != review["qaReview"]["reviewedMeanings"]:
            raise ValueError("Micromégas first large QA increment differs from review")
        progress["questionReview"] = {"meaningDraftsChecked": reviewed, "questionBandsChecked": reviewed * 3, "recordedCorrections": len(qa["corrections"])}
    if "chapter-01-qa-02.json" in evidence:
        qa = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-02.json"))
        reviewed = len(qa["items"])
        if reviewed != 100 or reviewed != review["qaReview"]["additionalMeanings"] or len(qa["corrections"]) != 5:
            raise ValueError("Micromégas hundred-meaning QA increment differs from review")
        first = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-01.json"))
        if set(i["key"] for i in qa["items"]) & set(i["key"] for i in first["items"]):
            raise ValueError("Micromégas QA increments overlap")
        progress["questionReview"] = {"meaningDraftsChecked": reviewed + len(first["items"]), "questionBandsChecked": (reviewed + len(first["items"])) * 3, "recordedCorrections": len(qa["corrections"]) + len(first["corrections"])}
    if "chapter-01-qa-03.json" in evidence:
        qa = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-03.json"))
        second = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-02.json"))
        first = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-01.json"))
        keys = [i["key"] for ledger in (first, second, qa) for i in ledger["items"]]
        if len(qa["items"]) != 78 or len(keys) != 228 or len(set(keys)) != 228 or len(qa["corrections"]) != 2:
            raise ValueError("Micromégas complete chapter I QA differs from review")
        progress["questionReview"] = {"meaningDraftsChecked": len(keys), "questionBandsChecked": len(keys) * 3, "recordedCorrections": sum(len(ledger["corrections"]) for ledger in (first, second, qa))}
    if "chapter-01-qa-04.json" in evidence:
        qa4 = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-04.json"))
        qa3 = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-03.json"))
        qa2 = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-02.json"))
        qa1 = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-qa-01.json"))
        keys = [i["key"] for ledger in (qa1, qa2, qa3, qa4) for i in ledger["items"]]
        if len(qa4["items"]) != 8 or len(keys) != senses or len(set(keys)) != senses or review["qaReview"]["totalReviewedMeanings"] != senses:
            raise ValueError("Micromégas fourth QA increment differs from review")
        progress["questionReview"] = {"meaningDraftsChecked": senses, "questionBandsChecked": senses * 3, "recordedCorrections": sum(len(ledger.get("corrections", [])) for ledger in (qa1, qa2, qa3, qa4))}
    if "chapter-01-shared-identity-01.json" in evidence:
        ledger = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-shared-identity-01.json"))
        counts = {}
        for item in ledger["items"]:
            counts[item["decision"]] = counts.get(item["decision"], 0) + 1
        if len(ledger["items"]) != 44 or counts != ledger["summary"] or len({item["key"] for item in ledger["items"]}) != 44 or counts.get("reuse_ready") != 5 or counts.get("reuse_pending_activation") != 1:
            raise ValueError("Micromégas chapter I shared identity review differs from ledger")
        progress["sharedIdentityReview"] = {"draftMeaningsWithPublishedForm": 44, "decisions": counts}
    if "chapter-01-shared-lemma-01.json" in evidence:
        ledger = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-shared-lemma-01.json"))
        counts = {}
        for item in ledger["items"]:
            counts[item["decision"]] = counts.get(item["decision"], 0) + 1
        if len(ledger["items"]) != 100 or len({item["key"] for item in ledger["items"]}) != 100 or counts != ledger["summary"] or (counts.get("link_published_sense"), counts.get("new_sense_existing_lemma"), counts.get("new_lemma_sense")) != (12, 9, 79):
            raise ValueError("Micromégas chapter I first hundred lemma reviews differ from ledger")
        progress["sharedLemmaReview"] = {"reviewedNoExactFormMeanings": 100, "remainingNoExactFormMeanings": senses - progress["sharedIdentityReview"]["draftMeaningsWithPublishedForm"] - 100, "decisions": counts}
    if "chapter-01-shared-lemma-02.json" in evidence:
        ledger = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-shared-lemma-02.json"))
        first = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-shared-lemma-01.json"))
        counts = {}
        for item in ledger["items"]:
            counts[item["decision"]] = counts.get(item["decision"], 0) + 1
        keys = [item["key"] for part in (first, ledger) for item in part["items"]]
        if (len(ledger["items"]) != 92 or len(keys) != senses - progress["sharedIdentityReview"]["draftMeaningsWithPublishedForm"] or
                len(set(keys)) != len(keys) or counts != ledger["summary"] or
                (counts.get("new_lemma_sense"), counts.get("link_published_sense"), counts.get("new_sense_existing_lemma")) != (66, 16, 10) or
                review["sharedLemmaReview02"]["reviewedNoExactFormMeanings"] != 92):
            raise ValueError("Micromégas final 92 lemma reviews differ from ledger")
        progress["sharedLemmaReview"] = {"reviewedNoExactFormMeanings": len(keys), "remainingNoExactFormMeanings": 0, "firstDecisions": first["summary"], "finalDecisions": counts}
    if "chapter-01-identity-plan.json" in evidence:
        plan = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-identity-plan.json"))
        counts = {}
        for item in plan["items"]:
            counts[item["route"]] = counts.get(item["route"], 0) + 1
        if (len(plan["items"]) != senses or len({item["key"] for item in plan["items"]}) != senses or
                counts != plan["summary"] or (counts.get("new_lemma_and_sense"), counts.get("new_sense"), counts.get("add_surface_to_published_sense"), counts.get("reuse_exact_published_identity"), counts.get("published_identity_pending_first_use_approval")) != (145, 56, 29, 5, 1) or
                review["identityPlan"]["mappedMeanings"] != senses):
            raise ValueError("Micromégas identity plan does not cover all draft meanings")
        progress["identityPlan"] = {"mappedMeanings": senses, "routes": counts}
    if "chapter-01-published-repair-plan.json" in evidence:
        repairs = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-published-repair-plan.json"))
        if len(repairs["items"]) != 3 or {item["key"] for item in repairs["items"]} != {"soeur_sibling", "ciel_visible_sky", "oiseau_bird"} or review["publishedRepairPlan"]["heldRepairs"] != 1 or review["publishedRepairPlan"]["completedRepairs"] != 2 or repairs["status"] != "published_gloss_repairs_applied_sky_questions_prepared_pending_first_use":
            raise ValueError("Micromégas published repair plan differs from review")
        progress["publishedRepairPlan"] = {"completedRepairs": 2, "heldFirstUseApproval": 1, "publishedMutationBatch": repairs["publicationBatchId"]}
    if "chapter-01-coverage.json" in evidence:
        coverage_bytes = read_bytes(f"{CANDIDATE}/chapter-01-coverage.json")
        coverage = json.loads(coverage_bytes)
        packet_names = sorted(name for name in evidence if re.fullmatch(r"chapter-01-(?:reuse|ambiguous)-\d\d\.json", name))
        indexed = set()
        for name in packet_names:
            packet = json.loads(read_bytes(f"{CANDIDATE}/{name}"))
            if packet["coverageSha256"] != digest(coverage_bytes):
                raise ValueError(f"Stale Micromégas contextual reuse: {name}")
            for item in packet["items"]:
                for occ in item["occurrences"]:
                    key = (occ["unit"], occ["start"], occ["end"])
                    if key in indexed:
                        raise ValueError(f"Duplicate Micromégas contextual reuse: {name}")
                    indexed.add(key)
        summary = coverage["summary"]
        if summary["draftedTokenUses"] != chapter_one or len(indexed) != dossier["review"]["chapterOne"]["reuseReview"]["indexedOccurrences"]:
            raise ValueError("Micromégas chapter I coverage disagrees with dossier")
        excluded = set()
        if "chapter-01-names-01.json" in evidence:
            names = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-names-01.json"))
            if names["coverageSha256"] != digest(coverage_bytes):
                raise ValueError("Stale Micromégas proper-name review")
            for item in names["names"]:
                for occ in item["occurrences"]:
                    key = (occ["unit"], occ["start"], occ["end"])
                    if key in indexed or key in excluded:
                        raise ValueError("Overlapping Micromégas proper-name exclusion")
                    excluded.add(key)
            if len(excluded) != dossier["review"]["chapterOne"]["nameReview"]["excludedTokenUses"]:
                raise ValueError("Micromégas proper-name count disagrees with dossier")
        components = set()
        if "chapter-01-phrase-components.json" in evidence:
            packet = json.loads(read_bytes(f"{CANDIDATE}/chapter-01-phrase-components.json"))
            if packet["coverageSha256"] != digest(coverage_bytes):
                raise ValueError("Stale Micromégas phrase components")
            for item in packet["items"]:
                occ = item["occurrence"]
                key = (occ["unit"], occ["start"], occ["end"])
                if key in components or key in excluded or key in indexed or not any(t["unit"] == occ["unit"] and t["start"] == occ["start"] and t["end"] == occ["end"] and not t.get("draft") for t in coverage["tokens"]):
                    raise ValueError("Invalid Micromégas phrase component")
                components.add(key)
            if len(components) != dossier["review"]["chapterOne"]["phraseComponentReview"]["coveredTokenUses"]:
                raise ValueError("Micromégas phrase component count disagrees with dossier")
        progress["chapterOneCoverage"] = {
            "tokenUses": summary["tokenUses"], "distinctForms": summary["distinctForms"],
            "draftedTokenUses": chapter_one, "reusedTokenUses": len(indexed),
            "excludedProperNameUses": len(excluded), "coveredPhraseComponents": len(components),
            "unresolvedTokenUses": summary["tokenUses"] - chapter_one - len(indexed) - len(excluded) - len(components),
            "reusePackets": len(packet_names),
        }
    if "chapter-02-coverage.json" in evidence:
        coverage = json.loads(read_bytes(f"{CANDIDATE}/chapter-02-coverage.json"))
        summary = coverage["summary"]
        saved = dossier["review"]["chapterTwo"]["progress"]
        keys = ("tokenUses", "distinctForms", "draftedTokenUses", "reusedTokenUses", "excludedProperNameUses", "unresolvedTokenUses", "unresolvedDistinctForms", "batchCount", "newMeaningDrafts", "publishedReusePackets", "newQuestionBands")
        if coverage["chapter"] != 2 or summary["tokenUses"] != 1035 or summary["unresolvedTokenUses"] != summary["tokenUses"] - summary["draftedTokenUses"] - summary["reusedTokenUses"] - summary["excludedProperNameUses"] - summary.get("coveredPhraseComponents", 0):
            raise ValueError("Micromégas chapter II token coverage is invalid")
        keys = keys + ("coveredPhraseComponents", "expressionTriages", "newExpressionQuestionBands")
        if "chapter-02-identity-plan.json" in evidence:
            keys = keys + ("questionReviewedMeanings", "questionReviewedBands", "identityRoutes", "expressionReviewedBands")
            if saved["questionReviewedMeanings"] != saved["newMeaningDrafts"] or saved["questionReviewedBands"] != saved["newQuestionBands"] or sum(saved["identityRoutes"].values()) != saved["newMeaningDrafts"] or saved["expressionReviewedBands"] != saved["newExpressionQuestionBands"]:
                raise ValueError("Micromégas chapter II review counts are incomplete")
        if any((summary if key in summary else saved)[key] != saved[key] for key in keys):
            raise ValueError("Micromégas chapter II dossier progress differs from inventory")
        progress["chapterTwoCoverage"] = {key: saved[key] for key in keys}
    return progress


def verify_archive(path: Path, root: Path | None = None, expected_name: str | None = None) -> dict:
    with zipfile.ZipFile(path) as archive:
        if archive.testzip() is not None:
            raise ValueError("ZIP CRC verification failed")
        names = archive.namelist()
        if len(names) != len(set(names)):
            raise ValueError("Duplicate ZIP entries")
        manifest = json.loads(archive.read("CHECKPOINT.json"))
        expected_names = {entry["path"] for entry in manifest["files"]} | {"CHECKPOINT.json"}
        if set(names) != expected_names:
            raise ValueError("ZIP entries disagree with CHECKPOINT.json")
        checkpoint_name = expected_name or path.name
        if checkpoint_name != f"Polylit-French-Editorial-{manifest['label']}.zip":
            raise ValueError("ZIP filename disagrees with checkpoint label")
        for entry in manifest["files"]:
            relative = Path(entry["path"])
            if relative.is_absolute() or ".." in relative.parts:
                raise ValueError(f"Unsafe checkpoint path: {entry['path']}")
            content = archive.read(entry["path"])
            if len(content) != entry["bytes"] or digest(content) != entry["sha256"]:
                raise ValueError(f"ZIP manifest mismatch: {entry['path']}")
            if root is not None and content != (root / entry["path"]).read_bytes():
                raise ValueError(f"ZIP differs from working copy: {entry['path']}")
        progress = candidate_progress(archive.read)
        handoff = json.loads(archive.read("docs/EDITORIAL_HANDOFF.json"))
        if handoff["checkpoint"] != checkpoint_name or handoff.get("candidateProgress") != progress:
            raise ValueError("Archived handoff disagrees with archived Micromégas progress")
        if root is not None and progress != candidate_progress(lambda name: (root / name).read_bytes()):
            raise ValueError("ZIP Micromégas progress differs from working copy")
        return {"checkpoint": checkpoint_name, "files": len(manifest["files"]), "candidateProgress": progress}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("zip", type=Path)
    parser.add_argument("--against", type=Path, help="also compare every archived file to this working copy")
    args = parser.parse_args()
    print(json.dumps(verify_archive(args.zip, args.against), ensure_ascii=False))
