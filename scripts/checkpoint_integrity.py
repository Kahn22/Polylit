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
    "src/app/main.ts", "src/app/entry.ts", "src/app/routes.ts", "src/app/paths.ts", "src/app/quiz-view.ts",
    "public/landing-bootstrap.js", "tests/app-startup.test.ts", "tests/app-interactions.test.ts",
    "tests/landing-navigation.test.ts", "tests/navigation-build.test.ts", "tests/routes.test.ts",
    "docs/NAVIGATION_AUDIT_378.txt",
    "src/delivery/library-wire.ts", "src/delivery/types.ts", "src/delivery/compact-packages.ts",
    "src/app/content-loader.ts", "src/app/progress-index.ts",
    "scripts/create-route-pages.mjs", "scripts/check-performance.mjs",
    "tests/compact-delivery.test.ts", "tests/app-content.test.ts", "tests/content-packages.test.ts",
    "tests/expression-surfaces.test.ts", "tests/publication-registry.test.ts",
    "tests/editorial-review-batches.test.ts", "tests/editorial-model.test.ts",
    "scripts/micromegas-publication-baseline.mjs",
    "scripts/micromegas-final-review-77.mjs", "scripts/check-micromegas-final-review-77.mjs",
    "scripts/micromegas-release-78.mjs", "scripts/check-micromegas-release-78.mjs",
    "tests/micromegas-release-78.test.js",
    "src/domain/model.ts", "src/domain/validate.ts",
    "src/app/chapter-heading.ts", "src/app/book-view.ts", "src/app/learning-view.ts",
    'scripts/micromegas-import-review-74.mjs',
    'scripts/record-micromegas-import-review-74.mjs',
    'scripts/micromegas-noun-middle-decisions-75.mjs',
    'scripts/micromegas-noun-middle-review-75.mjs',
    'scripts/record-micromegas-noun-review-75.mjs',
    'scripts/micromegas-acceptance-76.mjs',
    'scripts/record-micromegas-acceptance-76.mjs',
    'scripts/check-micromegas-acceptance-76.mjs',
    'tests/micromegas-acceptance-76.test.js',

    'scripts/micromegas-cross-work-decisions-71.mjs',
    'scripts/micromegas-cross-work-expressions-71.mjs',
    'scripts/record-micromegas-cross-work-71.mjs',
    'scripts/micromegas-cross-work-word-banks-72.mjs',
    'scripts/micromegas-offline-transaction-72.mjs',
    'scripts/record-micromegas-offline-transaction-72.mjs',
    'scripts/micromegas-independent-contexts-73.mjs',
    'scripts/micromegas-context-repairs-73.mjs',
    'scripts/record-micromegas-context-repairs-73.mjs',
    'scripts/check-micromegas-cross-work-73.mjs',
    'tests/micromegas-cross-work-73.test.js',

    "scripts/micromegas-candidate-catalog-70.mjs", "scripts/check-micromegas-candidate-catalog-70.mjs",
    "scripts/record-micromegas-candidate-catalog-70.mjs", "tests/micromegas-candidate-catalog-70.test.js",
    "AGENTS.md", "docs/CHECKPOINT_RECOVERY.md", "docs/FR_EDITORIAL_REVIEW_PROGRESS.md",
    "docs/MICROMEGAS_PROGRESS.md", "docs/MICROMEGAS_READINESS.md",
    "docs/MICROMEGAS_METTRE_REFLEXIVE_IMPACT.json", "docs/MICROMEGAS_METTRE_BEGIN_IMPACT.json",
    "scripts/check-text-sources.mjs", "scripts/editorial-checkpoint.py", "scripts/checkpoint_integrity.py",
    "scripts/micromegas-reuse-packet.mjs",
    "scripts/editorial-recovery-increment.py", "scripts/editorial-change-impact.mjs",
    "tests/test_checkpoint_integrity.py",
    "scripts/prepare-micromegas-chapter-01-shared-snapshot.mjs",
    "scripts/micromegas-import-composition.mjs", "scripts/record-micromegas-import-composition.mjs",
    "scripts/check-micromegas-import-composition.mjs", "tests/micromegas-import-composition.test.js",
    "scripts/micromegas-identity-dependencies.mjs", "scripts/record-micromegas-identity-dependencies.mjs",
    "scripts/check-micromegas-identity-dependencies.mjs", "tests/micromegas-identity-dependencies.test.js",
    "scripts/micromegas-reviewed-word-bindings.mjs", "scripts/micromegas-reviewed-word-gap-banks.mjs",
    "scripts/micromegas-reviewed-word-banks.mjs", "scripts/record-micromegas-reviewed-word-bindings.mjs",
    "scripts/check-micromegas-reviewed-word-bindings.mjs", "tests/micromegas-reviewed-word-bindings.test.js",
    "scripts/micromegas-direct-word-package.mjs", "scripts/micromegas-direct-bank-refinements.mjs",
    "scripts/record-micromegas-direct-word-package.mjs", "scripts/check-micromegas-direct-word-package.mjs",
    "tests/micromegas-direct-word-package.test.js",
    "scripts/micromegas-resolved-word-package.mjs", "scripts/micromegas-resolved-bank-refinements.mjs",
    "scripts/micromegas-resolved-expressions.mjs", "scripts/record-micromegas-resolved-packages.mjs",
    "scripts/check-micromegas-resolved-packages.mjs", "tests/micromegas-resolved-packages.test.js",
    "scripts/micromegas-continuation-word-package.mjs", "scripts/micromegas-continuation-bank-refinements.mjs",
    "scripts/micromegas-construction-expressions.mjs", "scripts/micromegas-continuation-owners.mjs",
    "scripts/record-micromegas-continuation-packages.mjs", "scripts/check-micromegas-continuation-packages.mjs",
    "tests/micromegas-continuation-packages.test.js",
    "scripts/micromegas-reviewed-family-words.mjs", "scripts/micromegas-family-bank-refinements.mjs",
    "scripts/micromegas-family-owner-routes.mjs", "scripts/micromegas-family-constructions.mjs",
    "scripts/record-micromegas-family-packages.mjs", "scripts/check-micromegas-family-packages.mjs",
    "tests/micromegas-family-packages.test.js",
    "scripts/micromegas-next-constructions.mjs", "scripts/record-micromegas-next-constructions.mjs",
    "scripts/check-micromegas-next-constructions.mjs", "tests/micromegas-next-constructions.test.js",
    "scripts/micromegas-next-expression-supplement-54.mjs", "scripts/micromegas-source-bank-refinements-55.mjs",
    "scripts/micromegas-source-words-55.mjs", "scripts/record-micromegas-source-packages-54-55.mjs",
    "scripts/check-micromegas-source-packages-55.mjs", "tests/micromegas-source-packages-55.test.js",
    "scripts/micromegas-expression-package-56.mjs", "scripts/micromegas-source-bank-refinements-57.mjs",
    "scripts/micromegas-source-words-57.mjs", "scripts/record-micromegas-source-packages-56-57.mjs",
    "scripts/check-micromegas-source-packages-57.mjs", "tests/micromegas-source-packages-57.test.js",
    "scripts/micromegas-source-resolution-58.mjs", "scripts/record-micromegas-source-resolution-58.mjs",
    "scripts/check-micromegas-source-resolution-58.mjs", "tests/micromegas-source-resolution-58.test.js",
    "scripts/micromegas-source-words-59.mjs", "scripts/record-micromegas-source-words-59.mjs",
    "scripts/check-micromegas-source-words-59.mjs", "tests/micromegas-source-words-59.test.js",
    "scripts/micromegas-source-words-62.mjs", "scripts/record-micromegas-source-words-62.mjs",
    "scripts/check-micromegas-source-words-62.mjs", "tests/micromegas-source-words-62.test.js",
    "scripts/micromegas-source-words-63.mjs", "scripts/record-micromegas-source-words-63.mjs",
    "scripts/check-micromegas-source-words-63.mjs", "tests/micromegas-source-words-63.test.js",
    "scripts/micromegas-source-words-64.mjs", "scripts/record-micromegas-source-words-64.mjs",
    "scripts/check-micromegas-source-words-64.mjs", "tests/micromegas-source-words-64.test.js",
    "scripts/micromegas-held-components-65.mjs", "scripts/record-micromegas-held-components-65.mjs",
    "scripts/check-micromegas-held-components-65.mjs", "scripts/micromegas-original-phrases-66.mjs",
    "scripts/record-micromegas-original-phrases-66.mjs", "scripts/check-micromegas-original-phrases-66.mjs",
    "tests/micromegas-held-and-phrases-65-66.test.js",
    "scripts/micromegas-phrase-decisions-67.mjs",
    "scripts/micromegas-original-phrases-67.mjs",
    "scripts/record-micromegas-original-phrases-67.mjs",
    "scripts/check-micromegas-original-phrases-67.mjs",
    "scripts/micromegas-phrase-decisions-68.mjs",
    "scripts/micromegas-original-phrases-68.mjs",
    "scripts/record-micromegas-original-phrases-68.mjs",
    "scripts/check-micromegas-original-phrases-68.mjs",
    "tests/micromegas-original-phrases-67-68.test.js",
    "scripts/micromegas-phrase-decisions-69.mjs",
    "scripts/micromegas-original-phrases-69.mjs",
    "scripts/record-micromegas-original-phrases-69.mjs",
    "scripts/check-micromegas-original-phrases-69.mjs",
    "tests/micromegas-original-phrases-69.test.js",
    "scripts/micromegas-source-words-61.mjs", "scripts/record-micromegas-source-words-61.mjs",
    "scripts/check-micromegas-source-words-61.mjs", "tests/micromegas-source-words-61.test.js",
    "scripts/micromegas-source-words-60.mjs", "scripts/record-micromegas-source-words-60.mjs",
    "scripts/check-micromegas-source-words-60.mjs", "tests/micromegas-source-words-60.test.js",
)


def digest(data: bytes) -> str:
    return sha256(data).hexdigest()


def source_snapshot(root: Path) -> dict[str, str]:
    paths = [p for p in (root / CANDIDATE).rglob("*") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("prepare-micromegas-*.mjs") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("*micromegas-chapter-05*") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("*micromegas-chapter-06*") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("*micromegas-chapter-07*") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("*micromegas-*reconciliation*.mjs") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("*micromegas-owner-*") if p.is_file()]
    paths += [p for p in (root / "scripts").glob("*micromegas-scope-*") if p.is_file()]
    paths += [root / "scripts/check-micromegas-remaining.mjs"]
    paths += [root / name for name in TRACKED]
    return {str(p.relative_to(root)): digest(p.read_bytes()) for p in sorted(paths)}


def chapter_six_continuation_summary(read_bytes, sixth, first_review):
    """Reject cumulative claims unsupported by the disjoint exact-source ledgers."""
    read = lambda name: json.loads(read_bytes(f"{CANDIDATE}/{name}"))
    key = lambda o: (o["unit"], o["start"], o["end"])
    base = dict(first_review["summary"])
    overlay = sixth["expressionOverlay"]
    base.update(reviewedUses=base["reviewedUses"] + overlay["resolvedHeldUses"],
                reviewedExpressionComponentUses=overlay["resolvedHeldUses"],
                heldUses=overlay["remainingHeldUses"],
                reviewedExpressionForms=overlay["reviewedExpressionForms"],
                reviewedExpressionQuestionBands=overlay["reviewedQuestionBands"])
    if base != sixth["initialEffectiveSummary"]:
        raise ValueError("Chapter VI initial effective summary disagrees")
    total = {**base, "recheckedEarlierExpressionBands": 0}
    seen = {key(o) for row in [*first_review["items"], *first_review["holds"]] for o in row["sourceOccurrences"]}
    end = base["formsConsidered"]
    for package in sixth["continuationPackages"]:
        review, batch, expressions, packet = (read(package[k]) for k in ("reviewFile", "batchFile", "expressionFile", "packetFile"))
        summary = review["summary"]
        bounds = package["formRange"]
        if bounds != review["formRange"] or bounds["startInclusive"] != end or bounds["endExclusive"] != end + summary["formsConsidered"] or summary != package["summary"]:
            raise ValueError("Chapter VI continuation range/counts disagree")
        routes = [*review["items"], *review["holds"]]
        uses = [key(o) for row in routes for o in row["sourceOccurrences"]]
        expected = {key(o) for item in packet["items"][:summary["formsConsidered"]] for o in item["sourceOccurrences"]}
        if len(uses) != len(set(uses)) or seen.intersection(uses) or set(uses) != expected or len(uses) != summary["consideredUses"]:
            raise ValueError("Chapter VI continuation source partition disagrees")
        seen.update(uses)
        counts = {kind: sum(len(row["sourceOccurrences"]) for row in routes if row["decision"] == kind) for kind in ("published", "earlier", "draft", "hold")}
        if (summary["reviewedUses"] != sum(counts[k] for k in ("published", "earlier", "draft")) or
                summary["heldUses"] != counts["hold"] or summary["contextualProposals"] != len(batch["items"]) or summary["newQuestionBands"] != sum(len(i["questions"]) for i in batch["items"])):
            raise ValueError("Chapter VI continuation word counts disagree")
        for field, kind in [("reviewedPublishedUses", "published"), ("reviewedEarlierUses", "earlier"), ("reviewedDraftUses", "draft")]:
            if summary[field] != counts[kind]:
                raise ValueError("Chapter VI continuation route counts disagree")
        held = {key(o) for row in review["holds"] for o in row["sourceOccurrences"]}
        expression = package["expressionOverlay"]
        resolved = [key(row["sourceOccurrence"]) for row in expression["resolved"]]
        remaining = [key(row["sourceOccurrence"]) for row in expression["remaining"]]
        component = {key(t): i["key"] for i in expressions["items"] for t in i["componentTokens"]}
        if (len(resolved) != len(set(resolved)) or len(remaining) != len(set(remaining)) or set(resolved).intersection(remaining) or
                set(resolved + remaining) != held or len(resolved) != expression["resolvedHeldUses"] or len(remaining) != expression["remainingHeldUses"] or
                any(component.get(key(row["sourceOccurrence"])) != row["expressionKey"] for row in expression["resolved"])):
            raise ValueError("Chapter VI continuation phrase partition disagrees")
        new = sum(not i.get("earlierFile") for i in expressions["items"])
        rechecked = (len(expressions["items"]) - new) * 3
        if expression["newExpressionForms"] != new or expression["newQuestionBands"] != new * 3 or expression["recheckedEarlierBands"] != rechecked:
            raise ValueError("Chapter VI continuation phrase bands disagree")
        for field in ("formsConsidered", "consideredUses", "reviewedRouteGroups", "reviewedPublishedUses", "reviewedEarlierUses", "reviewedDraftUses", "contextualProposals", "newQuestionBands"):
            total[field] += summary[field]
        total["reviewedUses"] += summary["reviewedUses"] + len(resolved)
        total["heldUses"] += len(remaining)
        total["reviewedExpressionComponentUses"] += len(resolved)
        total["reviewedExpressionForms"] += new
        total["reviewedExpressionQuestionBands"] += new * 3
        total["recheckedEarlierExpressionBands"] += rechecked
        end = bounds["endExclusive"]
    total["untouchedQueuedUses"] = total["initialQueuedUses"] - total["consideredUses"]
    if sixth.get("heldContextOverlay"):
        if total != sixth["preHoldContextSummary"]:
            raise ValueError("Chapter VI pre-hold cumulative summary disagrees")
        overlay = sixth["heldContextOverlay"]
        record = read(overlay["file"])
        if digest(read_bytes(f"{CANDIDATE}/{overlay['file']}")) != overlay["sha256"] or record["summary"] != overlay["summary"]:
            raise ValueError("Chapter VI held context revision disagrees")
        available = {key(row["sourceOccurrence"]) for v in [sixth["expressionOverlay"], *[p["expressionOverlay"] for p in sixth["continuationPackages"]]] for row in v["remaining"]}
        original_held = {key(o) for row in read(record["originalReviewFile"])["holds"] for o in row["sourceOccurrences"]}
        for ref in record.get("additionalOriginalReviews", []):
            if not any(p["reviewFile"] == ref["file"] for p in sixth["continuationPackages"]) or digest(read_bytes(f"{CANDIDATE}/{ref['file']}")) != ref["sha256"]:
                raise ValueError("Chapter VI additional held source revision disagrees")
            original_held.update(key(o) for row in read(ref["file"])["holds"] for o in row["sourceOccurrences"])
        if record.get("supersedesFile"):
            if digest(read_bytes(f"{CANDIDATE}/{record['supersedesFile']}")) != record["supersedesSha256"]:
                raise ValueError("Chapter VI superseded held revision disagrees")
            by_key = {i["key"]: i for i in record["items"]}
            if any(by_key.get(i["key"]) != i for i in read(record["supersedesFile"])["items"]):
                raise ValueError("Chapter VI inherited held bank changed")
        uses = [key(o) for i in record["items"] for o in i["sourceOccurrences"]]
        if len(uses) != len(set(uses)) or not set(uses).issubset(available & original_held) or len(uses) != record["summary"]["resolvedHeldUses"]:
            raise ValueError("Chapter VI earlier held source partition disagrees")
        n = len(record["items"])
        if record["summary"]["contextualProposals"] != n or record["summary"]["newQuestionBands"] != n * 3 or record["summary"]["reviewedRouteGroups"] != n:
            raise ValueError("Chapter VI earlier held bands disagree")
        total["reviewedUses"] += len(uses)
        total["heldUses"] -= len(uses)
        total["reviewedDraftUses"] += len(uses)
        total["reviewedRouteGroups"] += n
        total["contextualProposals"] += n
        total["newQuestionBands"] += n * 3
    if total != sixth["effectiveSummary"] or total["reviewedUses"] + total["heldUses"] + total["untouchedQueuedUses"] != total["initialQueuedUses"]:
        raise ValueError("Chapter VI cumulative totals disagree")
    if end != sixth["nextUntouchedFormIndex"]:
        raise ValueError("Chapter VI continuation next form index disagrees")
    pending = {key(o) for name in ("chapter-04-07-published-candidates.json", "chapter-04-07-new-form-queue.json")
               for row in read(name)["items"] for o in row["occurrences"] if o["chapter"] == 6}
    groups = {}
    for token in read("chapter-06-inventory.json")["tokens"]:
        if key(token) in pending:
            groups.setdefault(token["form"], []).append(token)
    if end < len(groups):
        form, uses = list(groups.items())[end]
        expected_next = {"form": form, **{k: uses[0][k] for k in ("unit", "start", "end")}}
    elif end == len(groups) and total["untouchedQueuedUses"] == 0:
        expected_next = None
    else:
        raise ValueError("Chapter VI continuation exceeds source queue")
    if sixth.get("nextUntouchedAction") != expected_next:
        raise ValueError("Chapter VI next untouched source action disagrees")
    return total


def chapter_seven_package_summary(read_bytes, seventh):
    """Recompute VII progress from the exact disjoint source partition."""
    read = lambda name: json.loads(read_bytes(f"{CANDIDATE}/{name}"))
    key = lambda o: (o["unit"], o["start"], o["end"])
    fingerprint = lambda value: digest(json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode())
    for name, expected in seventh["evidenceSha256"].items():
        if digest(read_bytes(f"{CANDIDATE}/{name}")) != expected:
            raise ValueError(f"Chapter VII evidence changed: {name}")
    packet, review, batch, targets, expressions = [read(seventh[k]) for k in
        ("packetFile", "reviewFile", "batchFile", "identityTargetsFile", "expressionFile")]
    inventory, units = read("chapter-07-inventory.json"), read("unit-plan.json")["units"]
    revisions = {"sourceSha256": digest(read_bytes(f"{CANDIDATE}/canonical-draft.txt")),
                 "unitPlanSha256": digest(read_bytes(f"{CANDIDATE}/unit-plan.json")),
                 "inventorySha256": digest(read_bytes(f"{CANDIDATE}/chapter-07-inventory.json"))}
    if any(any(record[k] != v for k, v in revisions.items()) for record in (packet, review, batch, targets, expressions)):
        raise ValueError("Chapter VII source revision disagrees")
    pending = {key(o) for f in ("chapter-04-07-published-candidates.json", "chapter-04-07-new-form-queue.json")
               for row in read(f)["items"] for o in row["occurrences"] if o["chapter"] == 7}
    groups = {}
    for t in inventory["tokens"]:
        if key(t) in pending:
            groups.setdefault(t["form"], []).append(t)
    start, end = review["formRange"]["startInclusive"], review["formRange"]["endExclusive"]
    if end - start != review["summary"]["formsConsidered"] or len(packet["items"]) != min(80, len(groups) - start):
        raise ValueError("Chapter VII source range disagrees")
    for i, (form, ts) in zip(packet["items"], list(groups.items())[start:], strict=False):
        if i["form"] != form or len(i["sourceOccurrences"]) != len(ts) or {key(o) for o in i["sourceOccurrences"]} != {key(t) for t in ts}:
            raise ValueError("Chapter VII packet source partition disagrees")
    expected = {key(t) for ts in list(groups.values())[start:end] for t in ts}
    token_map = {key(t): t for t in inventory["tokens"]}
    seen, count = set(), {"published": 0, "earlier": 0, "draft": 0, "hold": 0}
    for row in [*review["items"], *review["holds"]]:
        for o in row["sourceOccurrences"]:
            k = key(o)
            if k not in expected or k in seen or o["chapter"] != 7 or token_map[k]["form"] != row["form"] or token_map[k]["text"] != o["text"] or units[o["unit"] - 1]["text"] != o["context"]:
                raise ValueError("Chapter VII source partition disagrees")
            seen.add(k)
            count[row["decision"]] += 1
    if seen != expected:
        raise ValueError("Chapter VII source partition is incomplete")
    for i in batch["items"]:
        target = next(t for t in targets["items"] if t["key"] == i["key"])
        if target["questionSha256"] != fingerprint(i["questions"]) or target["sourceOccurrencesSha256"] != fingerprint(i["sourceOccurrences"]):
            raise ValueError("Chapter VII proposal fingerprint disagrees")
    components = {}
    fresh = rechecked = 0
    for i in expressions["items"]:
        if i["questionSha256"] != fingerprint(i["questions"]):
            raise ValueError("Chapter VII expression fingerprint disagrees")
        ts = [t for t in inventory["tokens"] if any(t["unit"] == o["unit"] and t["start"] >= o["start"] and t["end"] <= o["end"] for o in i["sourceOccurrences"])]
        if len(ts) != len(i["componentTokens"]) or {key(t) for t in ts} != {key(t) for t in i["componentTokens"]}:
            raise ValueError("Chapter VII expression components disagree")
        for o in i["sourceOccurrences"]:
            if o["chapter"] != 7 or units[o["unit"] - 1]["text"][o["start"]:o["end"]] != o["text"]:
                raise ValueError("Chapter VII expression source disagrees")
        for t in i["componentTokens"]:
            if key(t) in components:
                raise ValueError("Chapter VII expressions overlap")
            components[key(t)] = i["key"]
        if i.get("earlierFile"):
            old = next(x for x in read(i["earlierFile"])["items"] if x["key"] == i["earlierKey"])
            if digest(read_bytes(f"{CANDIDATE}/{i['earlierFile']}")) != i["earlierFileSha256"] or old["questions"] != i["questions"]:
                raise ValueError("Chapter VII reused bank changed")
            rechecked += 3
        else:
            fresh += 1
    held = {key(o) for row in review["holds"] for o in row["sourceOccurrences"]}
    resolved, remaining = set(), set()
    for row in seventh["expressionOverlay"]["resolved"]:
        k = key(row["sourceOccurrence"])
        if k not in held or k in resolved or components.get(k) != row["expressionKey"]:
            raise ValueError("Chapter VII held resolution disagrees")
        resolved.add(k)
    for row in seventh["expressionOverlay"]["remaining"]:
        k = key(row["sourceOccurrence"])
        if k not in held or k in resolved or k in remaining or k in components:
            raise ValueError("Chapter VII remaining hold disagrees")
        remaining.add(k)
    if held != resolved | remaining:
        raise ValueError("Chapter VII held partition disagrees")
    raw = {"formsConsidered": end - start, "consideredUses": len(seen), "reviewedRouteGroups": len(review["items"]),
           "reviewedUses": count["published"] + count["earlier"] + count["draft"],
           "reviewedPublishedUses": count["published"], "reviewedEarlierUses": count["earlier"],
           "reviewedDraftUses": count["draft"], "contextualProposals": len(batch["items"]),
           "newQuestionBands": len(batch["items"]) * 3, "heldUses": count["hold"]}
    effective = {**raw, "initialQueuedUses": len(pending), "reviewedUses": raw["reviewedUses"] + len(resolved),
                 "heldUses": len(remaining), "untouchedQueuedUses": len(pending) - len(seen),
                 "reviewedExpressionComponentUses": len(resolved), "reviewedExpressionForms": fresh,
                 "reviewedExpressionQuestionBands": fresh * 3, "recheckedEarlierExpressionBands": rechecked}
    if raw != review["summary"] or effective != seventh["effectiveSummary"]:
        raise ValueError("Chapter VII cumulative totals disagree")
    next_action = None
    if end < len(groups):
        form, ts = list(groups.items())[end]
        next_action = {"form": form, **{k: ts[0][k] for k in ("unit", "start", "end")}}
    if seventh["nextUntouchedFormIndex"] != end or seventh["nextUntouchedAction"] != next_action or (next_action is not None and any(seventh["nextAction"][k] != v for k, v in next_action.items())):
        raise ValueError("Chapter VII next source action disagrees")
    if next_action is None and (any(seventh["nextAction"][k] != v for k, v in {"form": "et", "unit": 169, "start": 89, "end": 91}.items()) or "reconciliation" not in seventh["nextAction"]["reason"]):
        raise ValueError("Chapter VII exhausted queue lacks exact held reconciliation action")
    return effective


def chapter_seven_partial_summary(read_bytes, seventh):
    packages = seventh.get("packages", [seventh])
    total, end = None, 0
    sums = ("formsConsidered", "consideredUses", "reviewedRouteGroups", "reviewedUses", "reviewedPublishedUses", "reviewedEarlierUses", "reviewedDraftUses", "contextualProposals", "newQuestionBands", "heldUses", "reviewedExpressionComponentUses", "reviewedExpressionForms", "reviewedExpressionQuestionBands", "recheckedEarlierExpressionBands")
    for package in packages:
        summary = chapter_seven_package_summary(read_bytes, package)
        review = json.loads(read_bytes(f"{CANDIDATE}/{package['reviewFile']}"))
        if review["formRange"]["startInclusive"] != end:
            raise ValueError("Chapter VII noncontiguous cumulative source range")
        end = review["formRange"]["endExclusive"]
        if total is None:
            total = dict(summary)
        else:
            for k in sums:
                total[k] += summary[k]
    total["untouchedQueuedUses"] = total["initialQueuedUses"] - total["consideredUses"]
    if total != seventh["effectiveSummary"]:
        raise ValueError("Chapter VII cumulative totals disagree")
    if seventh["nextUntouchedFormIndex"] != end or seventh["nextUntouchedAction"] != packages[-1]["nextUntouchedAction"]:
        raise ValueError("Chapter VII cumulative next source action disagrees")
    return total


def continuation_package_summary(read_bytes, dossier, shared):
    """Independently verify source ownership, separated meanings and discontinuous phrases."""
    read = lambda f: json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    jhash = lambda x: digest(json.dumps(x, ensure_ascii=False, separators=(",", ":")).encode())
    key = lambda o: (o["unit"], o["start"], o["end"])
    w, e = read("whole-work-continuation-word-package-49.json"), read("whole-work-construction-expressions-50.json")
    graph, composed, units = read("whole-work-identity-dependencies-43.json"), read("whole-work-import-composition-42.json"), read("unit-plan.json")["units"]
    old_w, old_e, direct = read("whole-work-resolved-word-package-47.json"), read("whole-work-resolved-expressions-48.json"), read("whole-work-direct-word-package-46.json")
    source = {key(t): t for t in composed["tokens"]}
    moved = [o for o in e["componentBindings"] if o["baseOwner"]["kind"] == "draft_bank"]
    partitions = [direct["occurrenceBindings"], old_w["occurrenceBindings"], [o for o in old_e["componentBindings"] if o["baseOwner"]["kind"] == "draft_bank"], w["occurrenceBindings"], moved, e["remainingDirectDraftOccurrences"]]
    coordinates = [key(o) for xs in partitions for o in xs]
    if len(coordinates) != len(set(coordinates)) or set(coordinates) != {k for k,t in source.items() if t["owner"]["kind"] == "draft_bank"}:
        raise ValueError("Continuation exact source partition disagrees")
    for xs in partitions:
        for o in xs:
            if (o["text"], o["form"]) != (source[key(o)]["text"], source[key(o)]["form"]):
                raise ValueError("Continuation exact source text changed")
    for data in [w,e]:
        for file,h in data["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{file}")) != h:
                raise ValueError("Continuation source evidence changed")
    records = {k: {x["id"]: x for x in shared[k]} for k in ["lemmas","senses","surfaceForms"]}
    for data in [read("whole-work-reviewed-word-bindings-44.json"), direct, old_w, w]:
        for kind,target in [("newLemmas","lemmas"),("newSenses","senses"),("newSurfaceForms","surfaceForms")]:
            for x in data[kind]:
                r=x["record"]
                if r["id"] in records[target]:
                    raise ValueError("Continuation staged record collision")
                records[target][r["id"]]=r
    groups={g["identity"]:g for g in w["identityGroups"]}
    if len(groups)!=106 or len(w["identityGroups"])!=106 or set(groups)!={b["identity"] for b in w["banks"]}:
        raise ValueError("Continuation canonical bank coverage changed")
    for o in w["occurrenceBindings"]:
        s,n=records["surfaceForms"][o["surfaceFormId"]],records["senses"][o["senseId"]]
        if o["baseOwner"]!=source[key(o)]["owner"] or s["normalized"]!=o["form"] or s["lemmaId"]!=n["lemmaId"] or o["lemmaId"]!=n["lemmaId"] or o["identity"]!=f"{s['id']}:{n['id']}":
            raise ValueError("Continuation exact Surface+Sense owner changed")
        if o["masteryAction"]!="fresh_identity_on_exact_unit_view":
            raise ValueError("Continuation fresh mastery policy changed")
    own=lambda f,u=None:next(o for o in w["occurrenceBindings"] if o["form"]==f and (u is None or o["unit"]==u))
    if own("défendit")["senseId"]!="sns_zola_defendre_protect" or own("défendit")["lemmaId"]!="lem_zola_defendre" or own("défendre")["lemmaId"]!="lem_zola_defendre" or own("défendre")["senseId"]==own("défendit")["senseId"]:
        raise ValueError("Continuation proper legal/resist ownership changed")
    for f,pos,u in [("quelque","adverb",23),("quelque","determiner",154),("sages","noun",None),("vers","noun",None),("variée","adjective",None),("saturnien","noun",None),("saturniens","noun",None)]:
        if records["lemmas"][own(f,u)["lemmaId"]]["partOfSpeech"]!=pos:
            raise ValueError("Continuation explicit grammatical owner changed")
    if own("quelque",23)["senseId"]==own("quelque",154)["senseId"] or own("quelque",154)["lemmaId"]!="lem_zola_quelque" or own("saturnien")["senseId"]!=own("saturniens")["senseId"] or own("saturnien")["surfaceFormId"]==own("saturniens")["surfaceFormId"]:
        raise ValueError("Continuation sense split or number join changed")
    ids=set()
    for banks,kind in [(w["banks"],"vocabulary"),(e["banks"],"expression")]:
        for b in banks:
            qs=b["questions"]
            if len(qs)!=3 or jhash(qs)!=b["questionSha256"] or {q["band"] for q in qs}!={"levels_1_3","levels_4_5","levels_6_8"}:
                raise ValueError("Continuation exact question bank changed")
            for q in qs:
                sub=q["subject"]
                identity=f"{sub['surfaceFormId']}:{sub['senseId']}" if kind=="vocabulary" else f"{sub['surfaceId']}:{sub['expressionId']}"
                if sub["kind"]!=kind or identity!=b["identity"] or q["id"] in ids:
                    raise ValueError("Continuation question identity changed")
                ids.add(q["id"])
                if len(q["choices"])!=4 or len({c["text"] for c in q["choices"]})!=4 or sum(c["id"]==q["correctChoiceId"] for c in q["choices"])!=1:
                    raise ValueError("Continuation question choices changed")
                if q["band"]=="levels_1_3":
                    r=q["targetRange"]
                    if q["context"][r["start"]:r["end"]].lower()!=q["targetText"].lower():
                        raise ValueError("Continuation early target range changed")
                elif q["band"]=="levels_4_5" and len(re.findall(r"_{3,}",q["context"]))!=1:
                    raise ValueError("Continuation completion blank changed")
            if kind=="vocabulary" and b["chosen"]["kind"]=="contextual_draft_bank":
                c=b["chosen"];bank=c["evidence"]["selector"].split("/")[1:];raw=read(c["evidence"]["file"])
                for part in bank:raw=raw[int(part)] if isinstance(raw,list) else raw[part]
                if jhash(raw["questions"])!=c["questionSha256"]:
                    raise ValueError("Continuation selected predecessor bank changed")
                if c["reviewedOverlay"]:
                    overlay=c["reviewedOverlay"];raw=read(overlay["evidence"]["file"])["items"][int(overlay["evidence"]["selector"].split("/")[-1])]["after"]
                for q,rawq in zip(qs,raw["questions"]):
                    correct=next(c["text"] for c in q["choices"] if c["id"]==q["correctChoiceId"])
                    if q["context"]!=rawq["context"] or [c["text"] for c in q["choices"]]!=rawq["choices"] or correct!=rawq["answer"]:
                        raise ValueError("Continuation prepared bank differs from reviewed source")
    eo={o["id"]:o for o in e["occurrences"]};covered=set()
    for o in e["componentBindings"]:
        t=source[key(o)];span=eo[o["expressionOccurrenceId"]]
        if key(o) in covered or o["baseOwner"]!=t["owner"] or o["text"]!=t["text"] or not span["start"]<=o["start"]<o["end"]<=span["end"] or o["masteryAction"]!="fresh_identity_on_exact_unit_view":
            raise ValueError("Continuation expression component ownership changed")
        if span.get("lexicalSegments") and not any((l["start"],l["end"],l["text"])==(o["start"],o["end"],o["text"]) for l in span["lexicalSegments"]):
            raise ValueError("Continuation discontinuous component changed")
        covered.add(key(o))
    for o in e["occurrences"]:
        number=int(o["unitId"].split("_")[-1])
        if units[number-1]["text"][o["start"]:o["end"]]!=o["text"]:
            raise ValueError("Continuation full construction boundary changed")
    account=next(o for o in e["occurrences"] if o["text"]=="rendait un fort bon compte")
    if account.get("lexicalSegments")!=[{"start":146,"end":153,"text":"rendait"},{"start":166,"end":172,"text":"compte"}]:
        raise ValueError("Continuation discontinuous lexical segments changed")
    retained=e["retainedInterveningWordUses"]
    if [(o["unit"],o["start"],o["end"],o["text"]) for o in retained]!=[(28,154,156,"un"),(28,157,161,"fort"),(28,162,165,"bon")]:
        raise ValueError("Continuation retained intervening words changed")
    for o in retained:
        if key(o) in covered or o["owner"]!=source[key(o)]["owner"]:
            raise ValueError("Continuation intervening owner was consumed")
    early=next(q for b in e["banks"] if b["expressionId"]==account["identityId"] for q in b["questions"] if q["band"]=="levels_1_3")
    r=early["targetRange"]
    if early.get("targetSegments")!=[{"start":r["start"]+l["start"]-146,"end":r["start"]+l["end"]-146} for l in account["lexicalSegments"]]:
        raise ValueError("Continuation discontinuous question segments changed")
    refs=read("whole-work-continuation-bank-refinements-49.json")
    for r in refs["items"]:
        raw=next(i for i in read(r["file"])["items"] if i["key"]==r["key"])
        if jhash(raw["questions"])!=r["beforeQuestionSha256"] or jhash(r["after"]["questions"])!=r["afterQuestionSha256"]:
            raise ValueError("Continuation exact refinement predecessor changed")
        for c in r["changes"]:
            before,after=[next(q for q in x["questions"] if q["band"]==c["band"]) for x in [raw,r["after"]]]
            if jhash(before)!=c["beforeSha256"] or jhash(after)!=c["afterSha256"] or not c["reason"]:
                raise ValueError("Continuation exact refinement authority changed")
    def remaining_groups(xs):
        remaining_keys={key(r) for r in xs}
        return sum(any(key(o) in remaining_keys for o in g["occurrences"]) for g in graph["directDraftBankGroups"])
    wc={"boundDirectDraftSourceUses":len(w["occurrenceBindings"]),"boundDirectDraftIdentityGroups":len(groups),"storedPreparedQuestionBands":len(w["banks"])*3,"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in groups.values()),"freshIdentityGroups":sum(g["masteryAction"]=="fresh_identity_on_exact_unit_view" for g in groups.values()),"preservedPriorCanonicalBanks":sum(b["chosen"]["kind"]=="previously_bound_candidate_bank" for b in w["banks"]),"preservedExistingBankSelections":sum(b["chosen"]["kind"]=="existing_prepared_bank" for b in w["banks"]),"contextualBankSelections":sum(b["chosen"]["kind"]=="contextual_draft_bank" for b in w["banks"]),"refinedBanks":len(refs["items"]),"refinedQuestionBands":sum(len(r["changes"]) for r in refs["items"]),"explicitOwnershipAndBankHolds":len(w["heldGroups"]),"remainingDirectDraftSourceUses":len(w["remainingDirectDraftOccurrences"]),"remainingDirectDraftIdentityGroups":remaining_groups(w["remainingDirectDraftOccurrences"]),"pendingPhraseSpans":len(composed["phrases"])}
    ec={"boundExpressionSurfaceKeys":len(e["banks"]),"storedPreparedQuestionBands":len(e["banks"])*3,"newExpressionMeanings":len(e["newIdentities"]),"expressionSourceSpans":len(eo),"ownedLexicalComponents":len(covered),"reassignedDraftWordUses":len(moved),"suppressedExistingWordUses":len(covered)-len(moved),"retainedInterveningWordUses":len(retained),"remainingDirectDraftSourceUses":len(e["remainingDirectDraftOccurrences"]),"remainingDirectDraftIdentityGroups":remaining_groups(e["remainingDirectDraftOccurrences"]),"pendingOriginalPhraseSpans":len(composed["phrases"])}
    result={}
    for data,counts,file,review in [(w,wc,"whole-work-continuation-word-progress-49.json","wholeWorkContinuationWords"),(e,ec,"whole-work-construction-expression-progress-50.json","wholeWorkConstructionExpressions")]:
        small=read(file)
        if any(counts!=x for x in [data["summary"],small["summary"],dossier["review"][review]["summary"]]) or small["candidateReleaseReady"] is not False or small["appliedScopePlans"]!=0 or small["nextAction"]!=dossier["review"][review]["nextAction"]:
            raise ValueError("Continuation independent counts or progress changed")
        for f,h in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:
                raise ValueError("Continuation progress evidence changed")
        result[review]={"status":small["status"],**counts,"nextAction":small["nextAction"],"candidateReleaseReady":False}
    return result


def family_package_summary(read_bytes, dossier, shared):
    """Independently verify source ownership, separated meanings and discontinuous phrases."""
    read = lambda f: json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    jhash = lambda x: digest(json.dumps(x, ensure_ascii=False, separators=(",", ":")).encode())
    key = lambda o: (o["unit"], o["start"], o["end"])
    w, e = read("whole-work-reviewed-family-words-51.json"), read("whole-work-family-constructions-52.json")
    graph, composed, units = read("whole-work-identity-dependencies-43.json"), read("whole-work-import-composition-42.json"), read("unit-plan.json")["units"]
    old_w, old_e, direct = read("whole-work-resolved-word-package-47.json"), read("whole-work-resolved-expressions-48.json"), read("whole-work-direct-word-package-46.json")
    source = {key(t): t for t in composed["tokens"]}
    moved = [o for o in e["componentBindings"] if o["baseOwner"]["kind"] == "draft_bank"]
    prior_w,prior_e=read("whole-work-continuation-word-package-49.json"),read("whole-work-construction-expressions-50.json")
    partitions = [prior_w["occurrenceBindings"], [o for o in prior_e["componentBindings"] if o["baseOwner"]["kind"]=="draft_bank"], direct["occurrenceBindings"], old_w["occurrenceBindings"], [o for o in old_e["componentBindings"] if o["baseOwner"]["kind"] == "draft_bank"], w["occurrenceBindings"], moved, e["remainingDirectDraftOccurrences"]]
    coordinates = [key(o) for xs in partitions for o in xs]
    if len(coordinates) != len(set(coordinates)) or set(coordinates) != {k for k,t in source.items() if t["owner"]["kind"] == "draft_bank"}:
        raise ValueError("Family exact source partition disagrees")
    for xs in partitions:
        for o in xs:
            if (o["text"], o["form"]) != (source[key(o)]["text"], source[key(o)]["form"]):
                raise ValueError("Family exact source text changed")
    for data in [w,e]:
        for file,h in data["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{file}")) != h:
                raise ValueError("Family source evidence changed")
    records = {k: {x["id"]: x for x in shared[k]} for k in ["lemmas","senses","surfaceForms"]}
    for data in [read("whole-work-reviewed-word-bindings-44.json"), direct, old_w, prior_w, w]:
        for kind,target in [("newLemmas","lemmas"),("newSenses","senses"),("newSurfaceForms","surfaceForms")]:
            for x in data[kind]:
                r=x["record"]
                if r["id"] in records[target]:
                    raise ValueError("Family staged record collision")
                records[target][r["id"]]=r
    groups={g["identity"]:g for g in w["identityGroups"]}
    if len(groups)!=111 or len(w["identityGroups"])!=111 or set(groups)!={b["identity"] for b in w["banks"]}:
        raise ValueError("Family canonical bank coverage changed")
    for o in w["occurrenceBindings"]:
        s,n=records["surfaceForms"][o["surfaceFormId"]],records["senses"][o["senseId"]]
        if o["baseOwner"]!=source[key(o)]["owner"] or s["normalized"]!=o["form"] or s["lemmaId"]!=n["lemmaId"] or o["lemmaId"]!=n["lemmaId"] or o["identity"]!=f"{s['id']}:{n['id']}":
            raise ValueError("Family exact Surface+Sense owner changed")
        if o["masteryAction"]!=("retain_existing_identity_progress" if o["identity"]=="srf_fr_va_aller_verb:sns_fr_aller_extent" else "fresh_identity_on_exact_unit_view"):
            raise ValueError("Family fresh mastery policy changed")
    own=lambda f,u=None:next(o for o in w["occurrenceBindings"] if o["form"]==f and (u is None or o["unit"]==u))
    if own("va")["senseId"]!="sns_fr_aller_extent" or own("arrive")["senseId"]!="sns_fr_arriver_happen":
        raise ValueError("Family retained extent/event meanings changed")
    for form,unit,pos,head in [("espèce",48,"noun","espèce"),("espèce",135,"noun","espèce"),("blanc",55,"noun","blanc"),("blanc",215,"adjective","blanc"),("plat",67,"adjective","plat"),("étendue",50,"adjective","étendu"),("étendue",51,"noun","étendue"),("brune",62,"noun","brun")]:
        lemma=records["lemmas"][own(form,unit)["lemmaId"]]
        if (lemma["partOfSpeech"],lemma["headword"])!=(pos,head):
            raise ValueError("Family proper lexical head changed")
    if own("espèce",48)["senseId"]==own("espèce",135)["senseId"] or own("blanc",55)["senseId"]==own("blanc",215)["senseId"]:
        raise ValueError("Family explicit semantic split changed")
    for form,head in [("nouvelles","nouvelle"),("s’écria","écrier")]:
        o=own(form)
        if records["lemmas"][o["lemmaId"]]["headword"]!=head or any(x["id"]==o["senseId"] for x in shared["senses"]):
            raise ValueError("Family fresh conflicting legacy meaning changed")
    for left,right in [("couleurs","couleur"),("étendus","étendue"),("différentes","différent")]:
        unit=50 if right=="étendue" else None
        if own(left)["senseId"]!=own(right,unit)["senseId"]:
            raise ValueError("Family explicit variant meaning join changed")
    for form,root in [("brune","brunes_dark_haired_women"),("révolution","revolutions_orbital_cycles"),("différent","differents_distinct")]:
        prior=next(x["record"] for x in prior_w["newSenses"] if x["declaredSenseRoot"].endswith(":"+root))
        if own(form)["senseId"]!=prior["id"]:
            raise ValueError("Family retained prior meaning changed")
    snapshot=read("whole-work-family-owner-snapshot-51.json")
    expected_definitions={"sns_fr_aller_extent":"Atteindre ou dépasser un degré, une mesure ou une limite au figuré.","sns_zola_compter_count":"Déterminer un nombre ou une quantité par le calcul ; inclure un élément dans un total.","sns_parure_ton_determinant_possessif_dont_le_possesseur_est_la_deuxieme_personne_du_singulier_et_le_possede_est_masculin_singulier_fbec62280d":"Déterminant possessif indiquant que ce qui est désigné appartient à la personne à laquelle on s’adresse au singulier."}
    if len(w["senseChanges"])!=3:
        raise ValueError("Family exact staged shared metadata coverage changed")
    for c in w["senseChanges"]:
        before=c["before"];old=next(x for x in shared["senses"] if x["id"]==before["id"])
        if before!=old or jhash(before)!=c["beforeSha256"] or jhash(c["after"])!=c["afterSha256"] or c["after"]!={**before,"definition":expected_definitions[before["id"]]} or c["masteryAction"]!="retain_all_existing_progress_records":
            raise ValueError("Family exact staged shared metadata changed")
        ie=c["impactEvidence"];impact=read(ie["file"])
        if digest(read_bytes(f"{CANDIDATE}/{ie['file']}"))!=ie["sha256"] or impact["sense"]!=before:
            raise ValueError("Family pre-edit impact evidence changed")
        qs=[q for q in snapshot["quizzes"] if q["subject"]["senseId"]==before["id"]]
        occ=[{k:v for k,v in o.items() if k!="context"} for o in snapshot["occurrences"] if o["senseId"]==before["id"]]
        if c["reviewedQuestionIds"]!=[q["id"] for q in qs] or jhash(qs)!=c["preservedQuestionsSha256"] or set(impact["impact"]["affectedQuizIds"])!={q["id"] for q in qs} or c["reviewedOccurrenceIds"]!=[o["id"] for o in occ] or jhash(occ)!=c["preservedOccurrencesSha256"]:
            raise ValueError("Family all current and historical dependents changed")
    retained=next(b for b in w["banks"] if b["identity"]=="srf_fr_va_aller_verb:sns_fr_aller_extent")
    if retained["chosen"]["kind"]!="existing_prepared_bank" or retained["questions"]!=[q for q in snapshot["quizzes"] if q["subject"]["senseId"]=="sns_fr_aller_extent"]:
        raise ValueError("Family retained existing extent bank changed")
    ids=set()
    for banks,kind in [(w["banks"],"vocabulary"),(e["banks"],"expression")]:
        for b in banks:
            qs=b["questions"]
            if len(qs)!=3 or jhash(qs)!=b["questionSha256"] or {q["band"] for q in qs}!={"levels_1_3","levels_4_5","levels_6_8"}:
                raise ValueError("Family exact question bank changed")
            for q in qs:
                sub=q["subject"]
                identity=f"{sub['surfaceFormId']}:{sub['senseId']}" if kind=="vocabulary" else f"{sub['surfaceId']}:{sub['expressionId']}"
                if sub["kind"]!=kind or identity!=b["identity"] or q["id"] in ids:
                    raise ValueError("Family question identity changed")
                ids.add(q["id"])
                if len(q["choices"])!=4 or len({c["text"] for c in q["choices"]})!=4 or sum(c["id"]==q["correctChoiceId"] for c in q["choices"])!=1:
                    raise ValueError("Family question choices changed")
                if q["band"]=="levels_1_3":
                    r=q["targetRange"]
                    if q["context"][r["start"]:r["end"]].lower()!=q["targetText"].lower():
                        raise ValueError("Family early target range changed")
                elif q["band"]=="levels_4_5" and len(re.findall(r"_{3,}",q["context"]))!=1:
                    raise ValueError("Family completion blank changed")
            if kind=="vocabulary" and b["chosen"]["kind"]=="contextual_draft_bank":
                c=b["chosen"];bank=c["evidence"]["selector"].split("/")[1:];raw=read(c["evidence"]["file"])
                for part in bank:raw=raw[int(part)] if isinstance(raw,list) else raw[part]
                if jhash(raw["questions"])!=c["questionSha256"]:
                    raise ValueError("Family selected predecessor bank changed")
                if c["reviewedOverlay"]:
                    overlay=c["reviewedOverlay"];raw=read(overlay["evidence"]["file"])["items"][int(overlay["evidence"]["selector"].split("/")[-1])]["after"]
                for q,rawq in zip(qs,raw["questions"]):
                    correct=next(c["text"] for c in q["choices"] if c["id"]==q["correctChoiceId"])
                    if q["context"]!=rawq["context"] or [c["text"] for c in q["choices"]]!=rawq["choices"] or correct!=rawq["answer"]:
                        raise ValueError("Family prepared bank differs from reviewed source")
    eo={o["id"]:o for o in e["occurrences"]};covered=set()
    for o in e["componentBindings"]:
        t=source[key(o)];span=eo[o["expressionOccurrenceId"]]
        if key(o) in covered or o["baseOwner"]!=t["owner"] or o["text"]!=t["text"] or not span["start"]<=o["start"]<o["end"]<=span["end"] or o["masteryAction"]!="fresh_identity_on_exact_unit_view":
            raise ValueError("Family expression component ownership changed")
        if span.get("lexicalSegments") and not any((l["start"],l["end"],l["text"])==(o["start"],o["end"],o["text"]) for l in span["lexicalSegments"]):
            raise ValueError("Family discontinuous component changed")
        covered.add(key(o))
    for o in e["occurrences"]:
        number=int(o["unitId"].split("_")[-1])
        if units[number-1]["text"][o["start"]:o["end"]]!=o["text"]:
            raise ValueError("Family full construction boundary changed")
    expected_spans=[(36,66,81,"jusqu’à présent"),(43,0,8,"Pour moi"),(138,0,8,"Pour moi"),(49,0,11,"Par exemple"),(55,197,205,"tire sur")]
    if [(int(o["unitId"].split("_")[-1]),o["start"],o["end"],o["text"]) for o in e["occurrences"]]!=expected_spans or e["retainedInterveningWordUses"]:
        raise ValueError("Family full formula lexical boundary changed")
    for span in e["occurrences"]:
        number=int(span["unitId"].split("_")[-1]);wanted={k for k,t in source.items() if t["unit"]==number and span["start"]<=t["start"]<t["end"]<=span["end"]}
        actual={key(o) for o in e["componentBindings"] if o["expressionOccurrenceId"]==span["id"]}
        if actual!=wanted:
            raise ValueError("Family full formula lexical component changed")
    retained=e["retainedInterveningWordUses"]
    refs=read("whole-work-family-bank-refinements-51.json")
    for r in refs["items"]:
        raw=next(i for i in read(r["file"])["items"] if i["key"]==r["key"])
        if jhash(raw["questions"])!=r["beforeQuestionSha256"] or jhash(r["after"]["questions"])!=r["afterQuestionSha256"]:
            raise ValueError("Family exact refinement predecessor changed")
        for c in r["changes"]:
            before,after=[next(q for q in x["questions"] if q["band"]==c["band"]) for x in [raw,r["after"]]]
            if jhash(before)!=c["beforeSha256"] or jhash(after)!=c["afterSha256"] or not c["reason"]:
                raise ValueError("Family exact refinement authority changed")
    def remaining_groups(xs):
        remaining_keys={key(r) for r in xs}
        return sum(any(key(o) in remaining_keys for o in g["occurrences"]) for g in graph["directDraftBankGroups"])
    wc={"boundDirectDraftSourceUses":len(w["occurrenceBindings"]),"boundDirectDraftIdentityGroups":len(groups),"storedPreparedQuestionBands":len(w["banks"])*3,"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in groups.values()),"freshIdentityGroups":sum(g["masteryAction"]=="fresh_identity_on_exact_unit_view" for g in groups.values()),"preservedPriorCanonicalBanks":sum(b["chosen"]["kind"]=="previously_bound_candidate_bank" for b in w["banks"]),"preservedExistingBankSelections":sum(b["chosen"]["kind"]=="existing_prepared_bank" for b in w["banks"]),"contextualBankSelections":sum(b["chosen"]["kind"]=="contextual_draft_bank" for b in w["banks"]),"refinedBanks":len(refs["items"]),"refinedQuestionBands":sum(len(r["changes"]) for r in refs["items"]),"explicitOwnershipAndBankHolds":len(w["heldGroups"]),"remainingDirectDraftSourceUses":len(w["remainingDirectDraftOccurrences"]),"remainingDirectDraftIdentityGroups":remaining_groups(w["remainingDirectDraftOccurrences"]),"pendingPhraseSpans":len(composed["phrases"])}
    ec={"boundExpressionSurfaceKeys":len(e["banks"]),"storedPreparedQuestionBands":len(e["banks"])*3,"newExpressionMeanings":len(e["newIdentities"]),"expressionSourceSpans":len(eo),"ownedLexicalComponents":len(covered),"reassignedDraftWordUses":len(moved),"suppressedExistingWordUses":len(covered)-len(moved),"retainedInterveningWordUses":len(retained),"remainingDirectDraftSourceUses":len(e["remainingDirectDraftOccurrences"]),"remainingDirectDraftIdentityGroups":remaining_groups(e["remainingDirectDraftOccurrences"]),"pendingOriginalPhraseSpans":len(composed["phrases"])}
    result={}
    for data,counts,file,review in [(w,wc,"whole-work-reviewed-family-word-progress-51.json","wholeWorkReviewedFamilyWords"),(e,ec,"whole-work-family-construction-progress-52.json","wholeWorkFamilyConstructions")]:
        small=read(file)
        if any(counts!=x for x in [data["summary"],small["summary"],dossier["review"][review]["summary"]]) or small["candidateReleaseReady"] is not False or small["appliedScopePlans"]!=0 or small["nextAction"]!=dossier["review"][review]["nextAction"]:
            raise ValueError("Family independent counts or progress changed")
        for f,h in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:
                raise ValueError("Family progress evidence changed")
        result[review]={"status":small["status"],**counts,"nextAction":small["nextAction"],"candidateReleaseReady":False}
    return result


def next_construction_summary(read_bytes, dossier):
    """Verify the additional whole expressions independently of the JS composer."""
    read = lambda f: json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    jhash = lambda x: digest(json.dumps(x, ensure_ascii=False, separators=(",", ":")).encode())
    key = lambda o: (o["unit"], o["start"], o["end"])
    data, prior = read("whole-work-next-constructions-53.json"), read("whole-work-family-constructions-52.json")
    composed, graph, units = read("whole-work-import-composition-42.json"), read("whole-work-identity-dependencies-43.json"), read("unit-plan.json")["units"]
    tokens = {key(t): t for t in composed["tokens"]}
    if data["status"] != "offline_construction_expressions_unapplied" or data["publicationBaseline"] != graph["publicationBaseline"]:
        raise ValueError("Next construction publication baseline or status changed")
    for f,h in data["evidenceSha256"].items():
        if digest(read_bytes(f"{CANDIDATE}/{f}")) != h:
            raise ValueError("Next construction source evidence changed")
    identities={x["record"]["id"]: x for x in data["newIdentities"]}
    banks={b["identity"]:b for b in data["banks"]}
    if len(identities)!=4 or len(banks)!=4 or len(data["occurrences"])!=4 or {x["record"]["headword"] for x in identities.values()}!={"sous presse","de peur de","aurore boréale","nouveau style"}:
        raise ValueError("Next construction identity set changed")
    expected={(70,138,149,"sous presse"),(81,11,21,"de peur de"),(82,58,72,"aurore boréale"),(82,219,232,"nouveau style")}
    seen=set()
    for o in data["occurrences"]:
        unit=int(o["unitId"].split("_")[-1]);ident=identities.get(o["identityId"])
        if not ident or o["text"]!=ident["record"]["headword"] or units[unit-1]["text"][o["start"]:o["end"]]!=o["text"]:
            raise ValueError("Next construction source span changed")
        seen.add((unit,o["start"],o["end"],o["text"]))
        b=banks.get(f'{o["surfaceId"]}:{o["identityId"]}')
        if not b or len(b["questions"])!=3 or len(b["legacyPreparedQuizzes"])!=3 or b["masteryAction"]!="fresh_identity_on_exact_unit_view" or jhash(b["questions"])!=b["questionSha256"] or jhash(b["sourceQuestions"])!=b["sourceQuestionSha256"]:
            raise ValueError("Next construction complete question bank changed")
        if {q["band"] for q in b["sourceQuestions"]}!={"1-3","4-5","6-8"} or any(q["answer"]!=o["text"] for q in b["sourceQuestions"][1:]):
            raise ValueError("Next construction question band changed")
    if seen!=expected:
        raise ValueError("Next construction exact source span set changed")
    covered=set();moved=[]
    for c in data["componentBindings"]:
        k=key(c);t=tokens.get(k)
        if not t or (c["text"],c["form"],c["baseOwner"])!=(t["text"],t["form"],t["owner"]) or k in covered or c["componentAction"]!="suppress_only_this_source_use_in_candidate_preserve_all_legacy_mastery":
            raise ValueError("Next construction lexical component changed")
        o=next((x for x in data["occurrences"] if x["id"]==c["expressionOccurrenceId"]),None)
        if not o or not (int(o["unitId"].split("_")[-1])==c["unit"] and o["start"]<=c["start"]<c["end"]<=o["end"]):
            raise ValueError("Next construction component span changed")
        covered.add(k)
        if c["baseOwner"]["kind"]=="draft_bank": moved.append(c)
    for o in data["occurrences"]:
        n=int(o["unitId"].split("_")[-1]);constituents={key(t) for t in composed["tokens"] if t["unit"]==n and o["start"]<=t["start"]<t["end"]<=o["end"]}
        if not constituents or not constituents<=covered:
            raise ValueError("Next construction lacks lexical component coverage")
    remaining=data["remainingDirectDraftOccurrences"]
    coordinates=[key(o) for o in [*moved,*remaining]]
    if len(coordinates)!=len(set(coordinates)) or set(coordinates)!={key(o) for o in prior["remainingDirectDraftOccurrences"]}:
        raise ValueError("Next construction predecessor partition changed")
    remaining_keys={key(o) for o in remaining}
    counts={"boundExpressionSurfaceKeys":len(banks),"storedPreparedQuestionBands":sum(len(b["questions"]) for b in banks.values()),"newExpressionMeanings":len(identities),"expressionSourceSpans":len(data["occurrences"]),"ownedLexicalComponents":len(covered),"reassignedDraftWordUses":len(moved),"suppressedExistingWordUses":len(covered)-len(moved),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":sum(any(key(o) in remaining_keys for o in g["occurrences"]) for g in graph["directDraftBankGroups"]),"pendingOriginalPhraseSpans":len(composed["phrases"])}
    progress=read("whole-work-next-construction-progress-53.json")
    if any(counts!=x for x in [data["summary"],progress["summary"],dossier["review"]["wholeWorkNextConstructions"]["summary"]]) or progress["nextAction"]!=dossier["review"]["wholeWorkNextConstructions"]["nextAction"] or progress["candidateReleaseReady"] is not False or progress["appliedScopePlans"]!=0:
        raise ValueError("Next construction independent totals or progress changed")
    for f,h in progress["evidenceSha256"].items():
        if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:
            raise ValueError("Next construction progress fingerprint changed")
    return {"wholeWorkNextConstructions":{"status":progress["status"],**counts,"nextAction":progress["nextAction"],"candidateReleaseReady":False}}


def source_packages_55_summary(read_bytes, dossier, shared):
    """Independently verify repeated phrase ownership and source-ordered vocabulary."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    jhash=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    key=lambda o:(o["unit"],o["start"],o["end"])
    e,w,prior=[read(f) for f in ["whole-work-expression-supplement-54.json","whole-work-source-words-55.json","whole-work-next-constructions-53.json"]]
    graph,composed,units=read("whole-work-identity-dependencies-43.json"),read("whole-work-import-composition-42.json"),read("unit-plan.json")["units"]
    if e["status"]!="offline_expression_extension_unapplied" or w["status"]!="offline_source_word_package_unapplied":
        raise ValueError("Source packages54/55 offline state changed")
    for data in [e,w]:
        for f,h in data["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:
                raise ValueError("Source package evidence changed")
    fear=next(x for x in prior["newIdentities"] if x["record"]["headword"]=="de peur de")
    reused=e["reusedExpressionOccurrences"]
    if len(reused)!=1 or reused[0]["existingIdentityId"]!=fear["record"]["id"] or reused[0]["masteryAction"]!="retain_existing_expression_identity_progress":
        raise ValueError("Repeated fear expression identity changed")
    spans={(116,304,314,"de peur de"),(86,341,357,"chien de manchon")}
    seen=set();occ_by_id={o["id"]:o for o in e["occurrences"]}
    for o in e["occurrences"]:
        n=int(o["unitId"].split("_")[-1])
        if units[n-1]["text"][o["start"]:o["end"]]!=o["text"]:
            raise ValueError("Source supplement phrase boundary changed")
        seen.add((n,o["start"],o["end"],o["text"]))
    if seen!=spans or reused[0]["occurrence"] not in e["occurrences"]:
        raise ValueError("Source supplement exact phrase spans changed")
    token_map={key(t):t for t in composed["tokens"]};covered=set()
    for c in e["components"]:
        k=key(c);t=token_map.get(k);span=occ_by_id.get(c["expressionOccurrenceId"])
        if not t or not span or c["baseOwner"]!=t["owner"] or c["text"]!=t["text"] or not span["start"]<=c["start"]<c["end"]<=span["end"] or k in covered:
            raise ValueError("Source supplement component owner changed")
        covered.add(k)
    for o in e["occurrences"]:
        n=int(o["unitId"].split("_")[-1]);wanted={key(t) for t in composed["tokens"] if t["unit"]==n and o["start"]<=t["start"]<t["end"]<=o["end"]};actual={key(c) for c in e["components"] if c["expressionOccurrenceId"]==o["id"]}
        if not wanted or wanted!=actual:
            raise ValueError("Source supplement incomplete phrase component coverage")
    moved={key(c) for c in e["components"] if c["baseOwner"]["kind"]=="draft_bank"};bound={key(o) for o in w["occurrenceBindings"]};remaining={key(o) for o in w["remainingDirectDraftOccurrences"]};previous={key(o) for o in prior["remainingDirectDraftOccurrences"]}
    if len(moved)+len(bound)+len(remaining)!=len(previous) or len(moved|bound|remaining)!=len(previous) or moved|bound|remaining!=previous:
        raise ValueError("Source package direct word partition changed")
    if len(w["identityGroups"])!=80 or len(w["banks"])!=80 or len(w["occurrenceBindings"])!=123:
        raise ValueError("Source package exact vocabulary counts changed")
    ids=set()
    for b in w["banks"]:
        if len(b["questions"])!=3 or jhash(b["questions"])!=b["questionSha256"]:
            raise ValueError("Source package stored question bank changed")
        for q in b["questions"]:
            if q["id"] in ids or len(q["choices"])!=4 or len({x["text"] for x in q["choices"]})!=4 or sum(x["id"]==q["correctChoiceId"] for x in q["choices"])!=1:
                raise ValueError("Source package question choices changed")
            ids.add(q["id"])
    def lemma(form):
        o=next(x for x in w["occurrenceBindings"] if x["form"]==form)
        return o,next(x["record"] for x in w["newLemmas"] if x["record"]["id"]==o["lemmaId"])
    mil,ml=lemma("mil");voisine,vl=lemma("voisine");de,dl=lemma("de")
    if (ml["headword"],ml["partOfSpeech"])!=("mille","numeral") or not any(x["record"]["id"]==mil["surfaceFormId"] and x["record"]["form"]=="mil" for x in w["newSurfaceForms"]):
        raise ValueError("Historical mil lexical owner changed")
    if (vl["headword"],vl["partOfSpeech"])!=("voisin","adjective") or (dl["headword"],dl["partOfSpeech"])!=("de","determiner"):
        raise ValueError("Source form lexical category changed")
    refinements=read("whole-work-source-bank-refinements-55.json")
    if refinements["summary"]!={"refinedBanks":3,"refinedQuestionBands":4}:
        raise ValueError("Source bank refinement scope changed")
    for r in refinements["items"]:
        raw=read(r["file"]);item=next(x for x in raw["items"] if x["key"]==r["key"])
        if jhash(item["questions"])!=r["beforeQuestionSha256"] or jhash(r["after"]["questions"])!=r["afterQuestionSha256"]:
            raise ValueError("Source exact question refinement changed")
        for c in r["changes"]:
            old=next(q for q in item["questions"] if q["band"]==c["band"]);new=next(q for q in r["after"]["questions"] if q["band"]==c["band"])
            if jhash(old)!=c["beforeSha256"] or jhash(new)!=c["afterSha256"] or not c["reason"]:
                raise ValueError("Source refinement review rationale changed")
    def remaining_groups(xs):
        keys={key(x) for x in xs};return sum(any(key(o) in keys for o in g["occurrences"]) for g in graph["directDraftBankGroups"])
    ec={"boundExpressionSurfaceKeys":len(e["newIdentities"]),"storedPreparedQuestionBands":sum(len(b["questions"]) for b in e["banks"]),"newExpressionMeanings":len(e["newIdentities"]),"expressionSourceSpans":len(e["occurrences"]),"ownedLexicalComponents":len(e["components"]),"reassignedDraftWordUses":len(moved),"suppressedExistingWordUses":len(covered)-len(moved),"remainingDirectDraftSourceUses":len(e["remainingDirectDraftOccurrences"]),"remainingDirectDraftIdentityGroups":remaining_groups(e["remainingDirectDraftOccurrences"]),"pendingOriginalPhraseSpans":len(composed["phrases"])}
    wc={"boundDirectDraftSourceUses":len(w["occurrenceBindings"]),"boundDirectDraftIdentityGroups":len(w["identityGroups"]),"storedPreparedQuestionBands":len(w["banks"])*3,"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"freshIdentityGroups":sum(g["masteryAction"]=="fresh_identity_on_exact_unit_view" for g in w["identityGroups"]),"preservedPriorCanonicalBanks":sum(b["chosen"]["kind"]=="previously_bound_candidate_bank" for b in w["banks"]),"preservedExistingBankSelections":sum(b["chosen"]["kind"]=="existing_prepared_bank" for b in w["banks"]),"contextualBankSelections":sum(b["chosen"]["kind"]=="contextual_draft_bank" for b in w["banks"]),"refinedBanks":len(refinements["items"]),"refinedQuestionBands":sum(len(x["changes"]) for x in refinements["items"]),"explicitOwnershipAndBankHolds":0,"remainingDirectDraftSourceUses":len(w["remainingDirectDraftOccurrences"]),"remainingDirectDraftIdentityGroups":remaining_groups(w["remainingDirectDraftOccurrences"]),"pendingPhraseSpans":len(composed["phrases"])}
    for data,file,review,counts in [(e,"whole-work-expression-supplement-progress-54.json","wholeWorkExpressionSupplement54",ec),(w,"whole-work-source-word-progress-55.json","wholeWorkSourceWords55",wc)]:
        small=read(file)
        if any(counts!=x for x in [data["summary"],small["summary"],dossier["review"][review]["summary"]]) or small["nextAction"]!=dossier["review"][review]["nextAction"] or small["candidateReleaseReady"] is not False or small["appliedScopePlans"]!=0:
            raise ValueError("Source package independent progress changed")
        for f,h in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:raise ValueError("Source package progress evidence changed")
    return {"wholeWorkExpressionSupplement54":{"status":e["status"],**ec,"candidateReleaseReady":False},"wholeWorkSourceWords55":{"status":w["status"],**wc,"nextAction":wp_next_action(read("whole-work-source-word-progress-55.json")),"candidateReleaseReady":False}}


def wp_next_action(progress):
    return progress["nextAction"]


def source_packages_57_summary(read_bytes, dossier):
    """Check complete constructions, precise categories and preserved held uses."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    jhash=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    key=lambda o:(o["unit"],o["start"],o["end"])
    e,w,prior=[read(f) for f in ["whole-work-expression-package-56.json","whole-work-source-words-57.json","whole-work-source-words-55.json"]]
    graph,base,units=read("whole-work-identity-dependencies-43.json"),read("whole-work-import-composition-42.json"),read("unit-plan.json")["units"]
    for data in [e,w]:
        for f,h in data["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:raise ValueError("Source packages56/57 evidence changed")
    expected={(89,32,42,"à mi-jambe"),(94,15,25,"fit sentir"),(99,64,79,"tiré au cordeau")}
    seen=set();covered=set();token_map={key(t):t for t in base["tokens"]}
    for o in e["occurrences"]:
        n=int(o["unitId"].split("_")[-1]);seen.add((n,o["start"],o["end"],o["text"]))
        if units[n-1]["text"][o["start"]:o["end"]]!=o["text"]:raise ValueError("Source package56 phrase span changed")
        wanted={key(t) for t in base["tokens"] if t["unit"]==n and o["start"]<=t["start"]<t["end"]<=o["end"]}
        actual={key(c) for c in e["components"] if c["expressionOccurrenceId"]==o["id"]}
        if wanted!=actual or covered&actual:raise ValueError("Source package56 component coverage changed")
        covered|=actual
    if seen!=expected or len(covered)!=7:raise ValueError("Source package56 whole construction scope changed")
    for c in e["components"]:
        t=token_map[key(c)]
        if c["baseOwner"]!=t["owner"] or c["text"]!=t["text"]:raise ValueError("Source package56 component owner changed")
    moved={key(c) for c in e["components"] if c["baseOwner"]["kind"]=="draft_bank"};bound={key(o) for o in w["occurrenceBindings"]};remaining={key(o) for o in w["remainingDirectDraftOccurrences"]};old={key(o) for o in prior["remainingDirectDraftOccurrences"]}
    if len(moved)!=4 or len(bound)!=95 or len(remaining)!=681 or len(moved)+len(bound)+len(remaining)!=len(old) or moved|bound|remaining!=old:
        raise ValueError("Source packages56/57 exact direct partition changed")
    if {key(o) for o in e["remainingDirectDraftOccurrences"]}!=old-moved:raise ValueError("Source package56 remaining partition changed")
    if len(w["ownershipHolds"])!=1 or w["ownershipHolds"][0]["sourceGroupIndex"]!=606 or w["ownershipHolds"][0]["occurrences"]!=graph["directDraftBankGroups"][606]["occurrences"] or not {key(o) for o in w["ownershipHolds"][0]["occurrences"]}<=remaining:
        raise ValueError("Source package57 held de source uses changed")
    by_form=lambda f:next(o for o in w["occurrenceBindings"] if o["form"]==f)
    lemma=lambda f:next(x["record"] for x in w["newLemmas"] if x["record"]["id"]==by_form(f)["lemmaId"])
    for form,head,pos in [("étrangers-là","étranger","noun"),("certaines","certain","determiner"),("proportionnés","proportionné","adjective"),("construit","construire","verb"),("hérissé","hérisser","verb")]:
        l=lemma(form)
        if (l["headword"],l["partOfSpeech"])!=(head,pos):raise ValueError("Source package57 proper lexical category changed")
    if lemma("imperceptible")["id"]=="lem_es_imperceptible_adjective" or by_form("non")["senseId"]!="sns_non_primary" or by_form("non")["masteryAction"]!="retain_existing_identity_progress":raise ValueError("Source package57 language or mastery changed")
    for a,b in [("tâté","tâtèrent"),("étangs","étang"),("habitent","habité")]:
        aa,bb=by_form(a),by_form(b)
        if aa["senseId"]!=bb["senseId"] or aa["surfaceFormId"]==bb["surfaceFormId"]:raise ValueError("Source package57 explicit same-meaning join changed")
    for data in [e,w]:
        ids=set()
        for b in data["banks"]:
            if len(b["questions"])!=3 or jhash(b["questions"])!=b["questionSha256"]:raise ValueError("Source packages56/57 question bank changed")
            for q in b["questions"]:
                if q["id"] in ids or len(q["choices"])!=4 or len({x["text"] for x in q["choices"]})!=4 or sum(x["id"]==q["correctChoiceId"] for x in q["choices"])!=1:raise ValueError("Source packages56/57 question choice changed")
                ids.add(q["id"])
    ref=read("whole-work-source-bank-refinements-57.json")
    if ref["summary"]!={"refinedBanks":17,"refinedQuestionBands":24}:raise ValueError("Source package57 refinement scope changed")
    for r in ref["items"]:
        original=next(x for x in read(r["file"])["items"] if x["key"]==r["key"])
        if jhash(original["questions"])!=r["beforeQuestionSha256"] or jhash(r["after"]["questions"])!=r["afterQuestionSha256"]:raise ValueError("Source package57 exact refinement changed")
        for c in r["changes"]:
            before=next(q for q in original["questions"] if q["band"]==c["band"]);after=next(q for q in r["after"]["questions"] if q["band"]==c["band"])
            if jhash(before)!=c["beforeSha256"] or jhash(after)!=c["afterSha256"] or not c["reason"]:raise ValueError("Source package57 refinement rationale changed")
    count_groups=lambda xs:sum(any(key(o) in {key(x) for x in xs} for o in g["occurrences"]) for g in graph["directDraftBankGroups"])
    ec={"boundExpressionSurfaceKeys":len(e["banks"]),"storedPreparedQuestionBands":len(e["banks"])*3,"newExpressionMeanings":len(e["newIdentities"]),"expressionSourceSpans":len(e["occurrences"]),"ownedLexicalComponents":len(e["components"]),"reassignedDraftWordUses":len(moved),"suppressedExistingWordUses":len(covered)-len(moved),"remainingDirectDraftSourceUses":len(e["remainingDirectDraftOccurrences"]),"remainingDirectDraftIdentityGroups":count_groups(e["remainingDirectDraftOccurrences"]),"pendingOriginalPhraseSpans":len(base["phrases"])}
    wc={"boundDirectDraftSourceUses":len(w["occurrenceBindings"]),"boundDirectDraftIdentityGroups":len(w["identityGroups"]),"storedPreparedQuestionBands":len(w["banks"])*3,"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"freshIdentityGroups":sum(g["masteryAction"]=="fresh_identity_on_exact_unit_view" for g in w["identityGroups"]),"preservedPriorCanonicalBanks":sum(b["chosen"]["kind"]=="previously_bound_candidate_bank" for b in w["banks"]),"preservedExistingBankSelections":sum(b["chosen"]["kind"]=="existing_prepared_bank" for b in w["banks"]),"contextualBankSelections":sum(b["chosen"]["kind"]=="contextual_draft_bank" for b in w["banks"]),"refinedBanks":len(ref["items"]),"refinedQuestionBands":sum(len(r["changes"]) for r in ref["items"]),"explicitOwnershipAndBankHolds":len(w["ownershipHolds"]),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":count_groups(w["remainingDirectDraftOccurrences"]),"pendingPhraseSpans":len(base["phrases"])}
    if len(w["banks"])!=80 or len(w["identityGroups"])!=80:raise ValueError("Source package57 eighty identity scope changed")
    result={}
    for data,file,review,counts in [(e,"whole-work-expression-progress-56.json","wholeWorkExpressions56",ec),(w,"whole-work-source-word-progress-57.json","wholeWorkSourceWords57",wc)]:
        small=read(file)
        if any(counts!=x for x in [data["summary"],small["summary"],dossier["review"][review]["summary"]]) or small["nextAction"]!=dossier["review"][review]["nextAction"] or small["candidateReleaseReady"] is not False or small["appliedScopePlans"]!=0:raise ValueError("Source packages56/57 progress changed")
        for f,h in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:raise ValueError("Source packages56/57 progress evidence changed")
        result[review]={"status":small["status"],**counts,"nextAction":small["nextAction"],"candidateReleaseReady":False}
    return result


def source_packages_58_summary(read_bytes, dossier):
    """Verify the exact mixed de ownership resolution and remaining queue."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    p,small=read("whole-work-mixed-de-resolution-58.json"),read("whole-work-mixed-de-progress-58.json")
    words=read("whole-work-source-words-57.json")
    expected={(101,69,74,"de la"),(114,88,93,"de la"),(185,116,121,"de l’"),(199,431,436,"de la")}
    seen={(int(o["unitId"].split("_")[-1]),o["start"],o["end"],o["text"]) for o in p["occurrences"]}
    if seen!=expected or len(p["components"])!=8 or len(p["banks"])!=2:
        raise ValueError("Source package58 complete partitive spans changed")
    if p["quantityPrepositionReassignment"]["toOwner"]!={"kind":"published_identity","identity":"srf_de:sns_de_primary"}:
        raise ValueError("Source package58 quantity preposition route changed")
    old={key(o) for o in words["remainingDirectDraftOccurrences"]}
    moved={key({"unit":int(o["unitId"].split("_")[-1]),"start":o["start"],"end":o["start"]+2}) for o in p["occurrences"]}
    qty=key(p["quantityPrepositionReassignment"])
    remaining={key(o) for o in p["sourceUsePartition"]["remainingDirectDraftSourceUses"]}
    if moved|{qty}|remaining!=old or moved&remaining or qty in remaining or len(remaining)!=676:
        raise ValueError("Source package58 source-use partition changed")
    if p["summary"]!={"newExpressionMeanings":1,"newExpressionSurfaceKeys":2,"expressionSourceSpans":4,"ownedLexicalComponents":8,"reassignedDraftWordUses":5,"suppressedExistingWordUses":4,"storedPreparedQuestionBands":6,"remainingDirectDraftSourceUses":676,"remainingDirectDraftIdentityGroups":530,"pendingOriginalPhraseSpans":127}:
        raise ValueError("Source package58 scope counts changed")
    review=dossier["review"]["wholeWorkMixedDeResolution58"]
    if small["summary"]!=p["summary"] or small["nextAction"]!=p["nextAction"] or review["summary"]!=p["summary"] or review["nextAction"]!=p["nextAction"] or small["candidateReleaseReady"] is not False or small["appliedScopePlans"]!=0:
        raise ValueError("Source package58 progress or offline state changed")
    for f,h in small["evidenceSha256"].items():
        if digest(read_bytes(f"{CANDIDATE}/{f}"))!=h:raise ValueError("Source package58 evidence fingerprint changed")
    return {"wholeWorkMixedDeResolution58":{"status":small["status"],**p["summary"],"nextAction":small["nextAction"],"candidateReleaseReady":False}}


def source_packages_59_summary(read_bytes, dossier):
    """Independently verify the source-use partition, owner decisions and bank ledger."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    w=read("whole-work-source-words-59.json")
    p=read("whole-work-source-word-progress-59.json")
    r=read("whole-work-source-bank-refinements-59.json")
    previous=read("whole-work-mixed-de-resolution-58.json")
    graph=read("whole-work-identity-dependencies-43.json")
    bound=[key(o) for o in w["occurrenceBindings"]]
    remaining=[key(o) for o in w["remainingDirectDraftOccurrences"]]
    old={key(o) for o in previous["sourceUsePartition"]["remainingDirectDraftSourceUses"]}
    if len(set(bound+remaining))!=len(bound+remaining) or set(bound+remaining)!=old:
        raise ValueError("Source59 complete disjoint previous queue changed")
    indices={d["sourceGroupIndex"] for d in w["decisions"]}
    if indices!=set(range(610,690)) or w["sourceGroupRange"]!={"first":610,"last":689}:
        raise ValueError("Source59 explicit reviewed group range changed")
    expected={key(o) for i in indices for o in graph["directDraftBankGroups"][i]["occurrences"]}
    if set(bound)!=expected:raise ValueError("Source59 reviewed source uses changed")
    ids=[g["identity"] for g in w["identityGroups"]]
    if len(ids)!=len(set(ids)) or set(ids)!={b["identity"] for b in w["banks"]} or any(len(b["questions"])!=3 for b in w["banks"]):
        raise ValueError("Source59 canonical bank coverage changed")
    for g in w["identityGroups"]:
        if {key(o) for o in g["occurrences"]}!={key(o) for o in w["occurrenceBindings"] if o["identity"]==g["identity"]}:
            raise ValueError("Source59 identity occurrence membership changed")
    decisions={d["sourceGroupIndex"]:d for d in w["decisions"]}
    if decisions[633]["identity"]!=decisions[653]["identity"] or decisions[652]["identity"]==decisions[633]["identity"]:
        raise ValueError("Source59 adjective linker and negative article ownership changed")
    uses={key(o):o for o in w["occurrenceBindings"]}
    if not any(o["unit"]==149 and o["form"]=="d’" and o["senseId"]=="sns_de_primary" for o in uses.values()):
        raise ValueError("Source59 quantity preposition ownership changed")
    if not any(o["form"]=="étaient" and o["senseId"]=="sns_fr_etre_passive_auxiliary" for o in uses.values()):
        raise ValueError("Source59 passive reuse changed")
    counts={"reviewedSourceGroups":len(indices),"boundDirectDraftIdentityGroups":len(ids),"boundDirectDraftSourceUses":len(bound),"storedPreparedQuestionBands":3*len(ids),"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"refinedBanks":len(r["items"]),"refinedQuestionBands":sum(len(x["changes"]) for x in r["items"]),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":sum(any(key(o) in set(remaining) for o in g["occurrences"]) for g in graph["directDraftBankGroups"]),"refinedExpressionBanks":2,"refinedExpressionQuestionBands":3,"pendingPhraseSpans":127}
    review=dossier["review"]["wholeWorkSourceWords59"]
    if any(x!=counts for x in [w["summary"],p["summary"],review["summary"]]) or p["nextAction"]!=review["nextAction"] or p["candidateReleaseReady"] is not False or p["appliedScopePlans"]!=0:
        raise ValueError("Source59 summary or offline state changed")
    if len(w["expressionBankRefinements"])!=2:raise ValueError("Source59 expression refinements missing")
    for i,x in enumerate(w["expressionBankRefinements"]):
        before=previous["banks"][i]
        if x["identity"]!=before["identity"] or x["beforeBankSha256"]!=h(before) or x["afterBankSha256"]!=h(x["after"]) or x["after"]["questions"][0]!=before["questions"][0]:
            raise ValueError("Source59 exact expression bank revisions changed")
    for obj in [w,p]:
        for f,sha in obj["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=sha:raise ValueError("Source59 evidence fingerprint changed")
    return {"wholeWorkSourceWords59":{"status":p["status"],**counts,"nextAction":p["nextAction"],"candidateReleaseReady":False}}


def source_packages_60_summary(read_bytes, dossier):
    """Independently verify the source-use partition, owner decisions and bank ledger."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    w=read("whole-work-source-words-60.json")
    p=read("whole-work-source-word-progress-60.json")
    r=read("whole-work-source-bank-refinements-60.json")
    previous=read("whole-work-source-words-59.json")
    graph=read("whole-work-identity-dependencies-43.json")
    bound=[key(o) for o in w["occurrenceBindings"]]
    remaining=[key(o) for o in w["remainingDirectDraftOccurrences"]]
    old={key(o) for o in previous["remainingDirectDraftOccurrences"]}
    if len(set(bound+remaining))!=len(bound+remaining) or set(bound+remaining)!=old:
        raise ValueError("Source60 complete disjoint previous queue changed")
    indices={d["sourceGroupIndex"] for d in w["decisions"]}
    if indices!=set(range(690,790)) or w["sourceGroupRange"]!={"first":690,"last":789}:
        raise ValueError("Source60 explicit reviewed group range changed")
    expected={key(o) for i in indices for o in graph["directDraftBankGroups"][i]["occurrences"]}
    if set(bound)!=expected:raise ValueError("Source60 reviewed source uses changed")
    ids=[g["identity"] for g in w["identityGroups"]]
    if len(ids)!=len(set(ids)) or set(ids)!={b["identity"] for b in w["banks"]} or any(len(b["questions"])!=3 for b in w["banks"]):
        raise ValueError("Source60 canonical bank coverage changed")
    for g in w["identityGroups"]:
        if {key(o) for o in g["occurrences"]}!={key(o) for o in w["occurrenceBindings"] if o["identity"]==g["identity"]}:
            raise ValueError("Source60 identity occurrence membership changed")
    by_group={d["sourceGroupIndex"]:d for d in w["decisions"]}
    crew=next(g for g in w["identityGroups"] if g["identity"]==by_group[690]["identity"])
    if {o["unit"] for o in crew["occurrences"]}!={118,139,148,212}:raise ValueError("Source60 crew coverage changed")
    ferr=next(g for g in w["identityGroups"] if g["identity"]==by_group[707]["identity"])
    lemma=next(x["record"] for x in w["newLemmas"] if x["record"]["id"]==ferr["lemmaId"])
    if lemma["headword"]!="ferré" or lemma["partOfSpeech"]!="adjective":raise ValueError("Source60 participial adjective owner changed")
    substance=next(g for g in w["identityGroups"] if g["identity"]==by_group[725]["identity"])
    if substance["declaredRoot"]["declaration"]!="chapter-02-identity-plan.json:substances_basic_realities":raise ValueError("Source60 shared philosophical sense changed")
    counts={"reviewedSourceGroups":len(indices),"boundDirectDraftIdentityGroups":len(ids),"boundDirectDraftSourceUses":len(bound),"storedPreparedQuestionBands":3*len(ids),"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"refinedBanks":len(r["items"]),"refinedQuestionBands":sum(len(x["changes"]) for x in r["items"]),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":sum(any(key(o) in set(remaining) for o in g["occurrences"]) for g in graph["directDraftBankGroups"]),"pendingPhraseSpans":127}
    review=dossier["review"]["wholeWorkSourceWords60"]
    if any(x!=counts for x in [w["summary"],p["summary"],review["summary"]]) or p["nextAction"]!=review["nextAction"] or p["candidateReleaseReady"] is not False or p["appliedScopePlans"]!=0:
        raise ValueError("Source60 summary or offline state changed")
    for obj in [w,p]:
        for f,sha in obj["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=sha:raise ValueError("Source60 evidence fingerprint changed")
    return {"wholeWorkSourceWords60":{"status":p["status"],**counts,"nextAction":p["nextAction"],"candidateReleaseReady":False}}


def source_packages_61_summary(read_bytes, dossier):
    """Independently verify the source-use partition, owner decisions and bank ledger."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    w=read("whole-work-source-words-61.json")
    p=read("whole-work-source-word-progress-61.json")
    r=read("whole-work-source-bank-refinements-61.json")
    previous=read("whole-work-source-words-60.json")
    graph=read("whole-work-identity-dependencies-43.json")
    bound=[key(o) for o in w["occurrenceBindings"]]
    remaining=[key(o) for o in w["remainingDirectDraftOccurrences"]]
    old={key(o) for o in previous["remainingDirectDraftOccurrences"]}
    if len(set(bound+remaining))!=len(bound+remaining) or set(bound+remaining)!=old:
        raise ValueError("Source61 complete disjoint previous queue changed")
    indices={d["sourceGroupIndex"] for d in w["decisions"]}
    if indices!=set(range(790,890))-{793} or w["sourceGroupRange"]!={"first":790,"last":889}:
        raise ValueError("Source61 explicit reviewed group range changed")
    expected={key(o) for i in indices for o in graph["directDraftBankGroups"][i]["occurrences"]}
    if set(bound)!=expected:raise ValueError("Source61 reviewed source uses changed")
    ids=[g["identity"] for g in w["identityGroups"]]
    if len(ids)!=len(set(ids)) or set(ids)!={b["identity"] for b in w["banks"]} or any(len(b["questions"])!=3 for b in w["banks"]):
        raise ValueError("Source61 canonical bank coverage changed")
    for g in w["identityGroups"]:
        if {key(o) for o in g["occurrences"]}!={key(o) for o in w["occurrenceBindings"] if o["identity"]==g["identity"]}:
            raise ValueError("Source61 identity occurrence membership changed")
    holds=w["ownershipHolds"]
    if len(holds)!=1 or holds[0]["sourceGroupIndex"]!=793 or holds[0]["occurrences"]!=graph["directDraftBankGroups"][793]["occurrences"] or not {key(o) for o in holds[0]["occurrences"]}<=set(remaining):
        raise ValueError("Source61 fused interrogative/verb hold changed")
    by_form=lambda form:next(o for o in w["occurrenceBindings"] if o["form"]==form)
    for form,head,pos in [("effilé","effilé","adjective"),("inexplicable","inexplicable","adjective"),("français","français","noun")]:
        l=next(x["record"] for x in w["newLemmas"] if x["record"]["id"]==by_form(form)["lemmaId"])
        if (l["headword"],l["partOfSpeech"])!=(head,pos) or l["id"].startswith("lem_es_"):
            raise ValueError("Source61 lexical category or language changed")
    if by_form("entendre")["senseId"]==by_form("entendirent")["senseId"]:
        raise ValueError("Source61 hearing and understanding collapsed")
    counts={"reviewedSourceGroups":len(indices)+len(holds),"unresolvedOwnershipGroups":len(holds),"boundDirectDraftIdentityGroups":len(ids),"boundDirectDraftSourceUses":len(bound),"storedPreparedQuestionBands":3*len(ids),"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"refinedBanks":len(r["items"]),"refinedQuestionBands":sum(len(x["changes"]) for x in r["items"]),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":sum(any(key(o) in set(remaining) for o in g["occurrences"]) for g in graph["directDraftBankGroups"]),"pendingPhraseSpans":127}
    review=dossier["review"]["wholeWorkSourceWords61"]
    if any(x!=counts for x in [w["summary"],p["summary"],review["summary"]]) or p["nextAction"]!=review["nextAction"] or p["candidateReleaseReady"] is not False or p["appliedScopePlans"]!=0:
        raise ValueError("Source61 summary or offline state changed")
    for obj in [w,p]:
        for f,sha in obj["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=sha:raise ValueError("Source61 evidence fingerprint changed")
    return {"wholeWorkSourceWords61":{"status":p["status"],**counts,"nextAction":p["nextAction"],"candidateReleaseReady":False}}


def source_packages_62_summary(read_bytes, dossier):
    """Independently verify the source-use partition, owner decisions and bank ledger."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    w=read("whole-work-source-words-62.json")
    p=read("whole-work-source-word-progress-62.json")
    r=read("whole-work-source-bank-refinements-62.json")
    previous=read("whole-work-source-words-61.json")
    graph=read("whole-work-identity-dependencies-43.json")
    bound=[key(o) for o in w["occurrenceBindings"]]
    remaining=[key(o) for o in w["remainingDirectDraftOccurrences"]]
    old={key(o) for o in previous["remainingDirectDraftOccurrences"]}
    if len(set(bound+remaining))!=len(bound+remaining) or set(bound+remaining)!=old:
        raise ValueError("Source62 complete disjoint previous queue changed")
    indices={d["sourceGroupIndex"] for d in w["decisions"]}
    if indices!=set(range(890,970)) or w["sourceGroupRange"]!={"first":890,"last":969}:
        raise ValueError("Source62 explicit reviewed group range changed")
    expected={key(o) for i in indices for o in graph["directDraftBankGroups"][i]["occurrences"]}
    holds=w["ownershipHolds"]
    hold_expected=[o for o in graph["directDraftBankGroups"][958]["occurrences"] if o["unit"]==179]
    if len(holds)!=1 or holds[0]["sourceGroupIndex"]!=958 or holds[0]["occurrences"]!=hold_expected or not {key(o) for o in hold_expected}<=set(remaining):
        raise ValueError("Source62 reproachful-address hold changed")
    expected-={key(o) for o in hold_expected}
    if set(bound)!=expected:raise ValueError("Source62 reviewed source uses changed")
    ids=[g["identity"] for g in w["identityGroups"]]
    if len(ids)!=len(set(ids)) or set(ids)!={b["identity"] for b in w["banks"]} or any(len(b["questions"])!=3 for b in w["banks"]):
        raise ValueError("Source62 canonical bank coverage changed")
    for g in w["identityGroups"]:
        if {key(o) for o in g["occurrences"]}!={key(o) for o in w["occurrenceBindings"] if o["identity"]==g["identity"]}:
            raise ValueError("Source62 identity occurrence membership changed")
    by_form=lambda f:next(o for o in w["occurrenceBindings"] if o["form"]==f)
    if by_form("mesuré")["senseId"]!=by_form("mesurerai")["senseId"] or by_form("mesuré")["surfaceFormId"]==by_form("mesurerai")["surfaceFormId"]:
        raise ValueError("Source62 measured/future identity relationship changed")
    if by_form("être")["lemmaId"]=="lem_etre" or by_form("sienne")["lemmaId"]=="lem_es_sien_noun":
        raise ValueError("Source62 proper noun and pronoun owners changed")
    if by_form("encore")["senseId"] in ["sns_fr_encore_still","sns_encore_primary"]:
        raise ValueError("Source62 concessive possibility collapsed into temporal continuation")
    counts={"reviewedSourceGroups":len(indices),"unresolvedOwnershipGroups":len(holds),"boundDirectDraftIdentityGroups":len(ids),"boundDirectDraftSourceUses":len(bound),"storedPreparedQuestionBands":3*len(ids),"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"refinedBanks":len(r["items"]),"refinedQuestionBands":sum(len(x["changes"]) for x in r["items"]),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":sum(any(key(o) in set(remaining) for o in g["occurrences"]) for g in graph["directDraftBankGroups"]),"pendingPhraseSpans":127}
    review=dossier["review"]["wholeWorkSourceWords62"]
    if any(x!=counts for x in [w["summary"],p["summary"],review["summary"]]) or p["nextAction"]!=review["nextAction"] or p["candidateReleaseReady"] is not False or p["appliedScopePlans"]!=0:
        raise ValueError("Source62 summary or offline state changed")
    for obj in [w,p]:
        for f,sha in obj["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=sha:raise ValueError("Source62 evidence fingerprint changed")
    return {"wholeWorkSourceWords62":{"status":p["status"],**counts,"nextAction":p["nextAction"],"candidateReleaseReady":False}}


def source_packages_63_summary(read_bytes, dossier):
    """Independently verify the source-use partition, owner decisions and bank ledger."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    w=read("whole-work-source-words-63.json")
    p=read("whole-work-source-word-progress-63.json")
    r=read("whole-work-source-bank-refinements-63.json")
    previous=read("whole-work-source-words-62.json")
    graph=read("whole-work-identity-dependencies-43.json")
    bound=[key(o) for o in w["occurrenceBindings"]]
    remaining=[key(o) for o in w["remainingDirectDraftOccurrences"]]
    old={key(o) for o in previous["remainingDirectDraftOccurrences"]}
    if len(set(bound+remaining))!=len(bound+remaining) or set(bound+remaining)!=old:
        raise ValueError("Source63 complete disjoint previous queue changed")
    indices={d["sourceGroupIndex"] for d in w["decisions"]}
    if indices!=set(range(970,1050))-{1016} or w["sourceGroupRange"]!={"first":970,"last":1049}:
        raise ValueError("Source63 explicit reviewed group range changed")
    expected={key(o) for i in indices for o in graph["directDraftBankGroups"][i]["occurrences"]}
    if set(bound)!=expected:raise ValueError("Source63 reviewed source uses changed")
    ids=[g["identity"] for g in w["identityGroups"]]
    if len(ids)!=len(set(ids)) or set(ids)!={b["identity"] for b in w["banks"]} or any(len(b["questions"])!=3 for b in w["banks"]):
        raise ValueError("Source63 canonical bank coverage changed")
    for g in w["identityGroups"]:
        if {key(o) for o in g["occurrences"]}!={key(o) for o in w["occurrenceBindings"] if o["identity"]==g["identity"]}:
            raise ValueError("Source63 identity occurrence membership changed")
    holds=w["ownershipHolds"]
    if len(holds)!=1 or holds[0]["sourceGroupIndex"]!=1016 or holds[0]["occurrences"]!=graph["directDraftBankGroups"][1016]["occurrences"] or not {key(o) for o in holds[0]["occurrences"]}<=set(remaining):
        raise ValueError("Source63 fused imperative/pronoun hold changed")
    by_form=lambda form:next(o for o in w["occurrenceBindings"] if o["form"]==form)
    number=by_form("nombres")
    number_sense=next(x["record"] for x in w["newSenses"] if x["record"]["id"]==number["senseId"])
    if "mathématiques" not in number_sense["definition"]:
        raise ValueError("Source63 mathematical number meaning changed")
    measured=next(o for o in previous["occurrenceBindings"] if o["form"]=="mesuré")
    if by_form("mesurons")["senseId"]!=measured["senseId"] or by_form("mesurons")["surfaceFormId"]==measured["surfaceFormId"]:
        raise ValueError("Source63 measurement identity relationship changed")
    if by_form("auxquels")["senseId"]!="sns_zola_auquel_to_which":
        raise ValueError("Source63 relative pronoun owner changed")
    counts={"reviewedSourceGroups":len(indices)+len(holds),"unresolvedOwnershipGroups":len(holds),"boundDirectDraftIdentityGroups":len(ids),"boundDirectDraftSourceUses":len(bound),"storedPreparedQuestionBands":3*len(ids),"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"refinedBanks":len(r["items"]),"refinedQuestionBands":sum(len(x["changes"]) for x in r["items"]),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":sum(any(key(o) in set(remaining) for o in g["occurrences"]) for g in graph["directDraftBankGroups"]),"pendingPhraseSpans":127}
    review=dossier["review"]["wholeWorkSourceWords63"]
    if any(x!=counts for x in [w["summary"],p["summary"],review["summary"]]) or p["nextAction"]!=review["nextAction"] or p["candidateReleaseReady"] is not False or p["appliedScopePlans"]!=0:
        raise ValueError("Source63 summary or offline state changed")
    for obj in [w,p]:
        for f,sha in obj["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=sha:raise ValueError("Source63 evidence fingerprint changed")
    return {"wholeWorkSourceWords63":{"status":p["status"],**counts,"nextAction":p["nextAction"],"candidateReleaseReady":False}}


def source_packages_64_summary(read_bytes, dossier):
    """Independently verify the source-use partition, owner decisions and bank ledger."""
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    w=read("whole-work-source-words-64.json")
    p=read("whole-work-source-word-progress-64.json")
    r=read("whole-work-source-bank-refinements-64.json")
    previous=read("whole-work-source-words-63.json")
    graph=read("whole-work-identity-dependencies-43.json")
    bound=[key(o) for o in w["occurrenceBindings"]]
    remaining=[key(o) for o in w["remainingDirectDraftOccurrences"]]
    old={key(o) for o in previous["remainingDirectDraftOccurrences"]}
    if len(set(bound+remaining))!=len(bound+remaining) or set(bound+remaining)!=old:
        raise ValueError("Source64 complete disjoint previous queue changed")
    indices={d["sourceGroupIndex"] for d in w["decisions"]}
    if indices!=set(range(1050,1140))-{1077} or w["sourceGroupRange"]!={"first":1050,"last":1139}:
        raise ValueError("Source64 explicit reviewed group range changed")
    expected={key(o) for i in indices for o in graph["directDraftBankGroups"][i]["occurrences"]}
    if set(bound)!=expected:raise ValueError("Source64 reviewed source uses changed")
    ids=[g["identity"] for g in w["identityGroups"]]
    if len(ids)!=len(set(ids)) or set(ids)!={b["identity"] for b in w["banks"]} or any(len(b["questions"])!=3 for b in w["banks"]):
        raise ValueError("Source64 canonical bank coverage changed")
    for g in w["identityGroups"]:
        if {key(o) for o in g["occurrences"]}!={key(o) for o in w["occurrenceBindings"] if o["identity"]==g["identity"]}:
            raise ValueError("Source64 identity occurrence membership changed")
    holds=w["ownershipHolds"]
    if len(holds)!=1 or holds[0]["sourceGroupIndex"]!=1077 or holds[0]["occurrences"]!=graph["directDraftBankGroups"][1077]["occurrences"] or not {key(o) for o in holds[0]["occurrences"]}<=set(remaining):
        raise ValueError("Source64 fused interrogative/verb hold changed")
    by_form=lambda form:next(o for o in w["occurrenceBindings"] if o["form"]==form)
    if by_form("sage")["senseId"]!="sns_micromegas_2d3ad42b9d9db969" or by_form("sage")["lemmaId"]=="lem_sage":
        raise ValueError("Source64 staged noun sage owner changed")
    if by_form("ami")["senseId"]=="sns_fr_ami_friend" or by_form("ami")["masteryAction"]!="fresh_identity_on_exact_unit_view":
        raise ValueError("Source64 familiar address collapsed into friendship")
    if by_form("entends")["senseId"]!=by_form("entend")["senseId"] or by_form("entends")["surfaceFormId"]==by_form("entend")["surfaceFormId"]:
        raise ValueError("Source64 understanding Surface+Sense relationship changed")
    if {o["form"].lower() for o in w["remainingDirectDraftOccurrences"]}!={"qu’auraient","malheureux","dites-moi","qu’entends"} or len(remaining)!=5:
        raise ValueError("Source64 complete remaining ownership holds changed")
    counts={"reviewedSourceGroups":len(indices)+len(holds),"unresolvedOwnershipGroups":len(holds),"boundDirectDraftIdentityGroups":len(ids),"boundDirectDraftSourceUses":len(bound),"storedPreparedQuestionBands":3*len(ids),"newProperLemmas":len(w["newLemmas"]),"newSenses":len(w["newSenses"]),"newSurfaceForms":len(w["newSurfaceForms"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in w["identityGroups"]),"refinedBanks":len(r["items"]),"refinedQuestionBands":sum(len(x["changes"]) for x in r["items"]),"remainingDirectDraftSourceUses":len(remaining),"remainingDirectDraftIdentityGroups":sum(any(key(o) in set(remaining) for o in g["occurrences"]) for g in graph["directDraftBankGroups"]),"pendingPhraseSpans":127}
    review=dossier["review"]["wholeWorkSourceWords64"]
    if any(x!=counts for x in [w["summary"],p["summary"],review["summary"]]) or p["nextAction"]!=review["nextAction"] or p["candidateReleaseReady"] is not False or p["appliedScopePlans"]!=0:
        raise ValueError("Source64 summary or offline state changed")
    for obj in [w,p]:
        for f,sha in obj["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{f}"))!=sha:raise ValueError("Source64 evidence fingerprint changed")
    return {"wholeWorkSourceWords64":{"status":p["status"],**counts,"nextAction":p["nextAction"],"candidateReleaseReady":False}}


def held_and_original_phrases_summary(read_bytes, dossier):
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    held=read("whole-work-held-components-65.json")
    prev=read("whole-work-source-words-64.json")
    if held["resolvedParentUses"]!=prev["remainingDirectDraftOccurrences"] or held["remainingDirectDraftOccurrences"]:
        raise ValueError("Held65 exact complete parent queue changed")
    units={u["ordinal"]:u["text"] for u in read("unit-plan.json")["units"]}
    owners=held["occurrenceBindings"]
    if len(owners)!=9 or len({key(o) for o in owners})!=9:
        raise ValueError("Held65 distinct component ownership changed")
    for r in held["sourceTokenRefinements"]:
        p=r["parent"];covered=[]
        for c in r["components"]+r["nonLexicalSeparators"]:
            if units[p["unit"]][c["start"]:c["end"]]!=c["text"]:
                raise ValueError("Held65 component source slice changed")
            covered+=list(range(c["start"],c["end"]))
        if sorted(covered)!=list(range(p["start"],p["end"])):
            raise ValueError("Held65 character partition changed")
    ids={g["identity"] for g in held["identityGroups"]}
    if len(ids)!=6 or ids!={b["identity"] for b in held["banks"]}:
        raise ValueError("Held65 canonical component bank coverage changed")
    if len(held["newSenses"])!=1 or held["newSenses"][0]["record"]["lemmaId"]!="lem_micromegas_a1966bcd66482bac":
        raise ValueError("Held65 reproachful noun meaning changed")
    for x in held["publishedQuestionOverlays"]:
        if h(x["before"])!=x["beforeSha256"] or h(x["after"])!=x["afterSha256"] or x["before"]["id"]!=x["after"]["id"] or x["before"]["subject"]!=x["after"]["subject"]:
            raise ValueError("Held65 exact shared-question overlay changed")
    hc={"resolvedHeldSourceUses":len(held["resolvedParentUses"]),"refinedFusedSourceUses":len(held["sourceTokenRefinements"]),"boundComponentUses":len(owners),"boundSurfaceSenseKeys":len(ids),"newProperLemmas":len(held["newLemmas"]),"newSenses":len(held["newSenses"]),"newSurfaceForms":len(held["newSurfaceForms"]),"storedPreparedQuestionBands":sum(len(b["questions"]) for b in held["banks"]),"reusedIdentityGroups":sum(g["masteryAction"]=="retain_existing_identity_progress" for g in held["identityGroups"]),"stagedPublishedQuestionOverlays":len(held["publishedQuestionOverlays"]),"remainingDirectDraftSourceUses":0,"remainingDirectDraftIdentityGroups":0,"pendingOriginalPhraseSpans":127}
    phrase=read("whole-work-original-phrases-66.json");base=read("whole-work-import-composition-42.json")
    if phrase["remainingOriginalPhraseSpans"]!=base["phrases"][13:] or [key(d["sourceSpan"]) for d in phrase["decisions"]]!=[key(x) for x in base["phrases"][:13]]:
        raise ValueError("Phrases66 original source queue partition changed")
    expected={(p["unit"],c["start"],c["end"]) for p in base["phrases"][:13] for c in p["lexicalSegments"]}
    components=phrase["componentBindings"]
    if {key(c) for c in components}!=expected or len(components)!=len(expected) or expected & {key(o) for o in owners}:
        raise ValueError("Phrases66 exact component ownership changed")
    if len(phrase["banks"])!=12 or len(phrase["occurrences"])!=13 or len({b["identity"] for b in phrase["banks"]})!=12:
        raise ValueError("Phrases66 one canonical bank per Surface+Expression changed")
    for o in phrase["occurrences"]:
        n=int(o["unitId"].split("_")[-1])
        if units[n][o["start"]:o["end"]]!=o["text"]:
            raise ValueError("Phrases66 exact phrase source changed")
    if sum(o["identityId"]=="exi_micromegas_7a1e2a9f867cf5e1" for o in phrase["occurrences"])!=1:
        raise ValueError("Phrases66 prior à la vérité identity reuse changed")
    pc={"reviewedOriginalPhraseSpans":len(phrase["occurrences"]),"boundExpressionSurfaceKeys":len(phrase["banks"]),"newExpressionMeanings":len(phrase["newIdentities"]),"reusedEarlierExpressionMeanings":1,"ownedLexicalComponents":len(components),"storedPreparedQuestionBands":sum(len(b["questions"]) for b in phrase["banks"]),"refinedBanks":len(phrase["refinements"]),"refinedQuestionBands":sum(len(r["changedBands"]) for r in phrase["refinements"]),"remainingOriginalPhraseSpans":len(phrase["remainingOriginalPhraseSpans"]),"remainingDirectDraftSourceUses":0}
    result={}
    for obj,file,review_key,counts in [(held,"whole-work-held-component-progress-65.json","wholeWorkHeldComponents65",hc),(phrase,"whole-work-original-phrase-progress-66.json","wholeWorkOriginalPhrases66",pc)]:
        progress=read(file);review=dossier["review"][review_key]
        if any(x!=counts for x in [obj["summary"],progress["summary"],review["summary"]]) or progress["candidateReleaseReady"] is not False or progress["appliedScopePlans"]!=0 or progress["nextAction"]!=review["nextAction"]:
            raise ValueError("Held/phrase offline summary changed")
        for item in [obj,progress]:
            for f,sha in item["evidenceSha256"].items():
                if digest(read_bytes(f"{CANDIDATE}/{f}"))!=sha:raise ValueError("Held/phrase evidence fingerprint changed")
        result[review_key]={"status":progress["status"],**counts,"nextAction":progress["nextAction"],"candidateReleaseReady":False}
    return result


def original_phrase_continuation_summary(read_bytes, dossier):
    read=lambda f:json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    key=lambda o:(o["unit"],o["start"],o["end"])
    h=lambda x:digest(json.dumps(x,ensure_ascii=False,separators=(",",":")).encode())
    base=read("whole-work-import-composition-42.json")
    units={u["ordinal"]:u["text"] for u in read("unit-plan.json")["units"]}
    result={};seen=set();expected_start=13
    files={e['file'] for e in dossier['evidence']}
    for number,bounds in [(67,(13,54)),(68,(54,94)),(69,(94,127))]:
        wf=f"whole-work-original-phrases-{number}.json";pf=f"whole-work-original-phrase-progress-{number}.json"
        if pf not in files:continue
        w=read(wf);progress=read(pf);review_key=f"wholeWorkOriginalPhrases{number}";review=dossier['review'][review_key]
        a,b=bounds
        if a!=expected_start or w['sourcePhraseRange']!={'start':a,'endExclusive':b}:
            raise ValueError('Original phrase continuation range changed')
        expected_start=b
        if w['remainingOriginalPhraseSpans']!=base['phrases'][b:] or [d['sourcePhraseIndex'] for d in w['decisions']]!=list(range(a,b)):
            raise ValueError('Original phrase continuation queue partition changed')
        for d,s in zip(w['decisions'],base['phrases'][a:b]):
            if d['sourceSpan']!={k:s[k] for k in ['unit','start','end','text']} or d['sourceContext']!=units[s['unit']] or d['sourceContextSha256']!=digest(units[s['unit']].encode()):
                raise ValueError('Original phrase full passage decision changed')
        expected={(s['unit'],c['start'],c['end']) for s in base['phrases'][a:b] for c in s['lexicalSegments']}
        components=w['componentBindings']+w.get('wordComponentBindings',[])
        if {key(c) for c in components}!=expected or len(components)!=len(expected) or seen&expected:
            raise ValueError('Original phrase exact component coverage changed')
        seen|=expected
        banks=w['banks']+w.get('wordBanks',[])
        owners=w['occurrences']+w.get('wordOccurrences',[])
        if len(owners)!=b-a or len({o['id'] for o in owners})!=len(owners) or {d['identity'] for d in w['decisions']}!={bank['identity'] for bank in banks}:
            raise ValueError('Original phrase canonical bank/owner coverage changed')
        for o in owners:
            n=int(o['unitId'].split('_')[-1])
            if units[n][o['start']:o['end']]!=o['text']:raise ValueError('Original phrase source slice changed')
        for bank in banks:
            if len(bank['questions'])!=3 or {q['band'] for q in bank['questions']}!={'levels_1_3','levels_4_5','levels_6_8'} or h(bank['questions'])!=bank['questionSha256']:
                raise ValueError('Original phrase three-band bank changed')
        for overlay in w.get('identityOverlays',[]):
            if overlay['before']['id']!=overlay['after']['id'] or h(overlay['before'])!=overlay['beforeSha256'] or h(overlay['after'])!=overlay['afterSha256']:
                raise ValueError('Original phrase unchanged-meaning overlay changed')
        for r in w['refinements']+w.get('wordRefinements',[]):
            if h(r['before'])!=r['beforeQuestionSha256'] or h(r['after'])!=r['afterQuestionSha256']:
                raise ValueError('Original phrase exact question revision changed')
        new_ids={i['record']['id'] for i in w['newIdentities']}
        counts={'reviewedOriginalPhraseSpans':len(owners),'boundExpressionSurfaceKeys':len(w['banks']),'newExpressionMeanings':len(new_ids),'reusedEarlierExpressionMeanings':len({bank['expressionId'] for bank in w['banks'] if bank['expressionId'] not in new_ids}),'ownedLexicalComponents':len(w['componentBindings']),'storedPreparedQuestionBands':sum(len(bank['questions']) for bank in w['banks']),'refinedBanks':len(w['refinements']),'refinedQuestionBands':sum(len(r['changedBands']) for r in w['refinements']),'remainingOriginalPhraseSpans':len(w['remainingOriginalPhraseSpans']),'remainingDirectDraftSourceUses':0}
        if number==68:
            if len(w['newSurfaceForms'])!=1 or w['newSurfaceForms'][0]['record']['normalized']!='s’agit' or {o['senseId'] for o in w['wordOccurrences']}!={'sns_zola_s_agir_concern'} or any(i['record']['headword']=='s’agit' for i in w['newIdentities']):
                raise ValueError('Original phrase s’agir same-meaning ownership changed')
            counts.update(boundCompleteWordSurfaceKeys=len(w['wordBanks']),completePronominalWordSpans=len(w['wordOccurrences']),newWordSurfaceForms=len(w['newSurfaceForms']),reusedPublishedWordMeanings=1,ownedWordComponents=len(w['wordComponentBindings']),storedWordQuestionBands=sum(len(bank['questions']) for bank in w['wordBanks']))
        if number==69:
            previous=[read(f'whole-work-original-phrases-{n}.json') for n in [66,67,68]]
            all_decisions=[d for package in previous+[w] for d in package['decisions']]
            all_components=[c for package in previous+[w] for c in package['componentBindings']+package.get('wordComponentBindings',[])]
            all_owners=[o for package in previous+[w] for o in package['occurrences']+package.get('wordOccurrences',[])]
            all_keys={bank['identity'] for package in previous+[w] for bank in package['banks']+package.get('wordBanks',[])}
            complete=w['originalPhraseCompletion']
            if [d['sourcePhraseIndex'] for d in all_decisions]!=list(range(127)) or len(all_owners)!=127 or len(all_components)!=347 or len({key(c) for c in all_components})!=347:
                raise ValueError('Final original phrase partition incomplete')
            if complete!=progress['originalPhraseCompletion'] or complete!=review['originalPhraseCompletion'] or complete['originalPhraseSpans']!=127 or complete['expressionSpans']!=124 or complete['completePronominalWordSpans']!=3 or complete['ownedLexicalComponents']!=347 or complete['distinctOriginalPhraseKeys']!=len(all_keys) or complete['storedCanonicalQuestionBands']!=3*len(all_keys) or complete['remainingOriginalPhraseSpans']!=0 or complete['publicationApplied'] is not False or complete['learnerStateChanged'] is not False:
                raise ValueError('Final original phrase completion claims changed')
            if complete['sourcePhraseIndices']!=list(range(127)) or complete['canonicalBankKeys']!=sorted(all_keys) or complete['sourceOwnerIds']!=[o['id'] for o in all_owners] or complete['componentCoordinates']!=sorted(f"{c['unit']}:{c['start']}:{c['end']}" for c in all_components):
                raise ValueError('Final original phrase identity ledger changed')
            discontinuous=w['discontinuousOwnership']
            if len(discontinuous)!=2 or sum(len(x['lexicalComponents']) for x in discontinuous)!=4 or sum(len(x['retainedTokens']) for x in discontinuous)!=10:
                raise ValueError('Final discontinuous phrase ownership changed')
            for item in discontinuous:
                if {key(c) for c in item['retainedTokens']}&{key(c) for c in all_components}:
                    raise ValueError('Intervening word swallowed by expression')
        if any(x!=counts for x in [w['summary'],progress['summary'],review['summary']]) or progress['nextAction']!=review['nextAction'] or progress['candidateReleaseReady'] is not False or progress['appliedScopePlans']!=0:
            raise ValueError('Original phrase offline summary changed')
        for item in [w,progress]:
            for file,sha in item['evidenceSha256'].items():
                if digest(read_bytes(f'{CANDIDATE}/{file}'))!=sha:raise ValueError('Original phrase evidence fingerprint changed')
        result[review_key]={'status':w['status'],**counts,'nextAction':progress['nextAction'],'candidateReleaseReady':False}
    return result


def complete_catalog_summary(read_bytes, dossier):
    if not dossier.get('review', {}).get('wholeWorkCandidateCatalog70'):
        return {}
    read = lambda f: json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    h = lambda v: digest(json.dumps(v, ensure_ascii=False, separators=(',', ':')).encode())
    w = read('whole-work-candidate-catalog-70.json')
    p = read('whole-work-candidate-progress-70.json')
    review = dossier['review']['wholeWorkCandidateCatalog70']
    for file, expected in {**w['evidenceSha256'], **p['evidenceSha256']}.items():
        if digest(read_bytes(f"{CANDIDATE}/{file}")) != expected:
            raise ValueError('Complete candidate evidence changed')
    coord = lambda t: (t['unit'], t['start'], t['end'], t['text'])
    base = read('whole-work-import-composition-42.json')
    if [coord(t) for t in w['tokenOwnership']] != [coord(t) for t in base['tokens']]:
        raise ValueError('Complete candidate source partition changed')
    banks = w['effectiveBanks']
    if len({b['identity'] for b in banks}) != len(banks):
        raise ValueError('Complete candidate duplicate canonical bank')
    question_ids = set()
    for b in banks:
        if len(b['questions']) != 3 or h(b['questions']) != b['questionSha256'] or {q['band'] for q in b['questions']} != {'levels_1_3','levels_4_5','levels_6_8'}:
            raise ValueError('Complete candidate bank changed')
        for q in b['questions']:
            subject=q['subject']
            identity=f"{subject['surfaceFormId']}:{subject['senseId']}" if subject['kind']=='vocabulary' else (f"{subject['surfaceId']}:{subject['expressionId']}" if subject.get('surfaceId') else subject['expressionId'])
            if identity != b['identity'] or q['id'] in question_ids:
                raise ValueError('Complete candidate question subject changed')
            question_ids.add(q['id'])
    owners={o['id'] for k in ['wordOccurrences','expressionOccurrences','exclusions'] for o in w[k]}
    for t in w['tokenOwnership']:
        o=t['owner']
        ids=o.get('occurrences', [o['occurrenceId']] if 'occurrenceId' in o else [])
        if any(i not in owners for i in ids) or (not ids and o['kind']!='legacy_word_locution_component'):
            raise ValueError('Complete candidate missing source owner')
    if any(w[k] is not False for k in ['publicationApplied','learnerStateChanged','candidateReleaseReady']):
        raise ValueError('Complete candidate offline state changed')
    for d in w['publishedDependencies']:
        if d['publicationApplied'] is not False or h(d['before'])!=d['beforeSha256'] or h(d['after'])!=d['afterSha256']:
            raise ValueError('Complete candidate published dependency changed')
    counts=w['summary']
    actual={'sourceUnits':len(w['units']),'sourceTokens':len(w['tokenOwnership']),'wordOccurrences':len(w['wordOccurrences']),'expressionOccurrences':len(w['expressionOccurrences']),'properNameExclusions':len(w['exclusions']),'canonicalBanks':len(banks),'storedQuestionBands':len(question_ids),'publishedDependencyRecords':len(w['publishedDependencies']),'crossWorkExpressionPlans':len(w['crossWorkExpressionQueue']),'crossWorkExpressionSpans':sum(len(q['sourceOccurrences']) for q in w['crossWorkExpressionQueue'])}
    if any(counts[k]!=v for k,v in actual.items()) or counts!=p['summary'] or counts!=review['summary'] or p['nextAction']!=review['nextAction']:
        raise ValueError('Complete candidate progress disagrees with catalog')
    return {'wholeWorkCandidateCatalog70': {'status':w['status'], **counts, 'nextAction':p['nextAction'], 'candidateReleaseReady':False}}



def cross_work_transaction_summary(read_bytes, dossier):
    specs = [('wholeWorkCrossWork71', 'whole-work-cross-work-expressions-71.json'),
             ('wholeWorkTransaction72', 'whole-work-offline-transaction-72.json'),
             ('wholeWorkContextRepairs73', 'whole-work-context-repairs-73.json')]
    result = {}
    for key, file in specs:
        review = dossier.get('review', {}).get(key)
        if not review:
            continue
        w = json.loads(read_bytes(f"{CANDIDATE}/{file}"))
        if review['summary'] != w['summary'] or review['status'] != w['status']:
            raise ValueError('Cross-work progress disagrees with evidence')
        for name, expected in w['evidenceSha256'].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != expected:
                raise ValueError('Cross-work transaction evidence changed')
        if any(w[k] is not False for k in ['publicationApplied', 'learnerStateChanged', 'candidateReleaseReady']):
            raise ValueError('Cross-work offline state changed')
        h = lambda v: digest(json.dumps(v, ensure_ascii=False, separators=(',', ':')).encode())
        for r in w.get('repairs', []):
            if h(r['before']) != r['beforeSha256'] or h(r['after']) != r['afterSha256']:
                raise ValueError('Cross-work question revision changed')
            if r['before']['subject'] != r['after']['subject'] or r['before']['choices'] != r['after']['choices'] or r['before']['correctChoiceId'] != r['after']['correctChoiceId']:
                raise ValueError('Cross-work identity or answer changed')
        result[key] = {'status': w['status'], **w['summary'], 'candidateReleaseReady': False}
        if 'nextAction' in w:
            if review['nextAction'] != w['nextAction']:
                raise ValueError('Cross-work next action changed')
            result[key]['nextAction'] = w['nextAction']
    return result


def import_acceptance_summary(read_bytes, dossier):
    specs = [('wholeWorkImportReview74', 'whole-work-import-review-74.json'),
             ('wholeWorkNounReview75', 'whole-work-noun-review-75.json'),
             ('wholeWorkAcceptance76', 'whole-work-acceptance-76.json')]
    result = {}
    read = lambda f: json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    h = lambda v: digest(json.dumps(v, ensure_ascii=False, separators=(',', ':')).encode())
    for key, file in specs:
        review = dossier.get('review', {}).get(key)
        if not review:
            continue
        w = read(file)
        if review['summary'] != w['summary'] or review['status'] != w['status']:
            raise ValueError('Import acceptance summary changed')
        for name, expected in w['evidenceSha256'].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != expected:
                raise ValueError('Import acceptance evidence changed')
        if any(w[k] is not False for k in ['publicationApplied', 'learnerStateChanged', 'candidateReleaseReady']):
            raise ValueError('Import acceptance offline state changed')
        if key == 'wholeWorkImportReview74':
            canonical = w['canonical']
            if digest(read_bytes(f"{CANDIDATE}/canonical-draft.txt")) != canonical['sourceSha256'] or digest(read_bytes(f"{CANDIDATE}/reading-canonical-74.txt")) != canonical['readingSha256']:
                raise ValueError('Import canonical whitespace proof changed')
            if read_bytes(f"{CANDIDATE}/reading-canonical-74.txt").decode() != canonical['text'] or not w['registryGate']['blocked']:
                raise ValueError('Import canonical or registry boundary changed')
        if key == 'wholeWorkNounReview75':
            if len(w['reviews']) != 571 or len(w['repairs']) != 32:
                raise ValueError('Noun review scope changed')
            for r in w['reviews']:
                if h(r['reviewedQuestion']) != r['afterQuestionSha256']:
                    raise ValueError('Reviewed noun question changed')
            for r in w['repairs']:
                if h(r['before']) != r['beforeSha256'] or h(r['after']) != r['afterSha256'] or r['before']['subject'] != r['after']['subject']:
                    raise ValueError('Noun correction changed')
        if key == 'wholeWorkAcceptance76':
            base = read('whole-work-noun-review-75.json')
            queue = {f"{x['kind']}:{x['id']}": x for x in base['acceptanceQueue']}
            approved = set()
            for d in w['decisions']:
                rid = f"{d['kind']}:{d['id']}"
                if rid not in queue or rid in approved or d['after']['subjectRevision'] != queue[rid]['subjectRevision'] or d['after']['status'] != 'approved' or d['publicationApplied'] is not False:
                    raise ValueError('Exact offline approval changed')
                approved.add(rid)
            remaining = {f"{x['kind']}:{x['id']}" for x in w['acceptanceQueue']}
            if approved & remaining or approved | remaining != set(queue) or len(remaining) != w['summary']['acceptanceSubjectsRemaining']:
                raise ValueError('Final acceptance partition changed')
        result[key] = {'status': w['status'], **w['summary'], 'candidateReleaseReady': False}
        if 'nextAction' in w:
            if review['nextAction'] != w['nextAction']:
                raise ValueError('Import acceptance next action changed')
            result[key]['nextAction'] = w['nextAction']
    return result

def final_release_summary(read_bytes, dossier):
    result = {}
    read = lambda f: json.loads(read_bytes(f"{CANDIDATE}/{f}"))
    if dossier.get('review', {}).get('wholeWorkFinalReview77'):
        m = read('whole-work-final-acceptance-77.json')
        r = read('whole-work-final-review-77.json')
        if digest(read_bytes(f"{CANDIDATE}/whole-work-final-acceptance-77.json")) != r['manifestSha256'] or len(m['decisions']) != 5829:
            raise ValueError('Final acceptance manifest differs')
        for file, sha in m['evidenceSha256'].items():
            if digest(read_bytes(f"{CANDIDATE}/{file}")) != sha:
                raise ValueError('Final acceptance evidence differs')
        result['wholeWorkFinalReview77'] = {'status': r['status'], **r['summary']}
    if dossier.get('review', {}).get('wholeWorkRelease78'):
        r = read('whole-work-release-78.json')
        for file, sha in r['publicationFilesSha256'].items():
            if digest(read_bytes(f"content/published/{file}")) != sha:
                raise ValueError('Live release source bytes differ')
        if not r['publicationApplied'] or r['learnerStateChanged'] or r['summary']['editorialIssues'] != 0 or r['summary']['works'] != 12:
            raise ValueError('Invalid final Micromegas release status')
        result['wholeWorkRelease78'] = {'status': r['status'], **r['summary'], 'candidateReleaseReady': True}
    return result

def candidate_progress(read_bytes) -> dict:
    dossier_bytes = read_bytes(f"{CANDIDATE}/dossier.json")
    dossier = json.loads(dossier_bytes)
    evidence = {e["file"] for e in dossier["evidence"]}
    publication_base = "content/published"
    if "publication-baseline-376.json" in evidence:
        frozen = json.loads(read_bytes(f"{CANDIDATE}/publication-baseline-376.json"))
        publication_base = f"{CANDIDATE}/publication-baseline-376"
        for file, sha in frozen['files'].items():
            if digest(read_bytes(f"{publication_base}/{file}")) != sha:
                raise ValueError('Historical publication baseline changed')
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
    if "chapter-03-coverage.json" in evidence:
        coverage = json.loads(read_bytes(f"{CANDIDATE}/chapter-03-coverage.json"))
        summary = coverage["summary"]
        saved = dossier["review"]["chapterThree"]["progress"]
        keys = ("tokenUses", "distinctForms", "draftedTokenUses", "reusedTokenUses", "excludedProperNameUses", "coveredPhraseComponents", "unresolvedTokenUses", "unresolvedDistinctForms", "batchCount", "newMeaningDrafts", "publishedReusePackets", "carriedOverUses", "newQuestionBands", "expressionTriages", "newExpressionQuestionBands", "questionReviewedMeanings", "questionReviewedBands", "identityRoutes", "expressionReviewedBands", "earlierExpressionSharedBands")
        if coverage["chapter"] != 3 or summary["tokenUses"] != 609 or summary["unresolvedTokenUses"] != summary["tokenUses"] - summary["draftedTokenUses"] - summary["reusedTokenUses"] - summary["excludedProperNameUses"] - summary["coveredPhraseComponents"]:
            raise ValueError("Micromégas chapter III token coverage is invalid")
        if saved["newMeaningDrafts"] != saved["questionReviewedMeanings"] or saved["questionReviewedBands"] != saved["newQuestionBands"] or sum(saved["identityRoutes"].values()) != saved["newMeaningDrafts"] or saved["expressionReviewedBands"] != saved["newExpressionQuestionBands"] or saved["unresolvedTokenUses"] != 0:
            raise ValueError("Micromégas chapter III review counts are incomplete")
        if any((summary if key in summary else saved)[key] != saved[key] for key in keys):
            raise ValueError("Micromégas chapter III dossier progress differs from inventory")
        progress["chapterThreeCoverage"] = {key: saved[key] for key in keys}
    if "chapter-04-inventory.json" in evidence:
        saved = dossier["review"]["remainingChapters"]["progress"]
        keys = ("tokenUses", "thoughtUnits", "alreadyAuthoredEarlierUses", "reviewedEarlierMeaningSharedUses", "reviewedProperNameUses", "chapterFourPublishedReuseForms", "chapterFourPublishedReuseUses", "chapterFourPublishedReuseHolds", "editorialDecisionPendingUses", "candidatePublishedUses", "noExactIdentityUses", "publishedCandidateForms", "noExactCandidateForms", "separateMeaningUsesWithinPending", "expressionCandidatesTriaged", "expressionPhraseUses", "newQuestionBandsReviewed", "unresolvedTokenUses")
        inventories = [json.loads(read_bytes(f"{CANDIDATE}/chapter-0{chapter}-inventory.json")) for chapter in (4, 5, 6, 7)]
        if saved["tokenUses"] != sum(item["summary"]["tokenUses"] for item in inventories) or saved["tokenUses"] != 4434 or saved["alreadyAuthoredEarlierUses"] != sum(item["summary"]["priorAuthoredUses"] for item in inventories):
            raise ValueError("Micromégas remaining-chapter inventories differ from dossier")
        if saved["editorialDecisionPendingUses"] != saved["candidatePublishedUses"] + saved["noExactIdentityUses"] or saved["unresolvedTokenUses"] != saved["editorialDecisionPendingUses"] or saved["newQuestionBandsReviewed"] != 3 * saved.get("chapterFourNewMeaningsReviewed", 0):
            raise ValueError("Micromégas remaining-chapter editorial queue misstated")
        if sum(saved[key] for key in ("alreadyAuthoredEarlierUses", "reviewedEarlierMeaningSharedUses", "reviewedProperNameUses", "chapterFourPublishedReuseUses", "editorialDecisionPendingUses")) + saved.get("chapterFourNewUsesReviewed", 0) + saved.get("chapterFourFinalDispositionUses", 0) + saved.get("chapterFiveAdditionalResolvedUses", 0) != saved["tokenUses"]:
            raise ValueError("Micromégas remaining-chapter token partition invalid")
        if "chapter-04-published-reuse-review-01.json" in evidence:
            reviews = [json.loads(read_bytes(f"{CANDIDATE}/chapter-04-published-reuse-review-{number:02d}.json")) for number in (1, 2, 3, 4, 5) if f"chapter-04-published-reuse-review-{number:02d}.json" in evidence]
            if len({item["form"] for review in reviews for item in review["items"]}) != saved["chapterFourPublishedReuseForms"] or sum(len(item["sourceOccurrences"]) for review in reviews for item in review["items"]) != saved["chapterFourPublishedReuseUses"] or len({item["form"] for review in reviews for item in review["holds"]}) != saved["chapterFourPublishedReuseHolds"]:
                raise ValueError("Micromégas chapter IV published reuse count invalid")
        progress["remainingChaptersCoverage"] = {key: saved[key] for key in keys}
        if "chapter-04-qa-01.json" in evidence:
            qa_names = sorted(name for name in evidence if name.startswith("chapter-04-qa-") and name.endswith(".json"))
            batches = sorted(name for name in evidence if name.startswith("chapter-04-batch-") and name.endswith(".json"))
            reviewed_items = [item for name in qa_names for item in json.loads(read_bytes(f"{CANDIDATE}/{name}"))["items"]]
            reviewed = sum(len(item["sourceOccurrences"]) for name in batches for item in json.loads(read_bytes(f"{CANDIDATE}/{name}"))["items"])
            if len(reviewed_items) != len({item["key"] for item in reviewed_items}) or len(reviewed_items) != saved["chapterFourNewMeaningsReviewed"] or reviewed != saved["chapterFourNewUsesReviewed"]:
                raise ValueError("Micromégas chapter IV new review count invalid")
            progress["remainingChaptersCoverage"].update({"chapterFourNewMeaningsReviewed": len(reviewed_items), "chapterFourNewUsesReviewed": reviewed})
            if "chapter-04-identity-plan.json" in evidence:
                routes = json.loads(read_bytes(f"{CANDIDATE}/chapter-04-identity-plan.json"))
                if routes["summary"] != saved.get("chapterFourIdentityRoutes") or len(routes["items"]) != len(reviewed_items):
                    raise ValueError("Micromégas chapter IV identity routes differ from review")
                progress["remainingChaptersCoverage"]["chapterFourIdentityRoutes"] = routes["summary"]
        if "chapter-04-droit-fil-review.json" in evidence:
            phrase = json.loads(read_bytes(f"{CANDIDATE}/chapter-04-droit-fil-review.json"))
            items = phrase["items"]
            expected_keys = ["de_droit_fil"]
            if "chapter-04-entre-deux-eaux-review.json" in evidence:
                underwater = json.loads(read_bytes(f"{CANDIDATE}/chapter-04-entre-deux-eaux-review.json"))
                items += underwater["items"]
                expected_keys.append("entre_deux_eaux")
            if "chapter-04-final-expressions.json" in evidence:
                final_expressions = json.loads(read_bytes(f"{CANDIDATE}/chapter-04-final-expressions.json"))
                items += final_expressions["items"]
                expected_keys += [item["key"] for item in final_expressions["items"]]
            if len(items) != saved.get("chapterFourAdditionalExpressionReviews") or sum(len(item["questions"]) for item in items) != saved.get("chapterFourAdditionalExpressionQuestionBands") or [item["key"] for item in items] != expected_keys:
                raise ValueError("Micromégas Chapter IV expression reviews differ from dossier")
            progress["remainingChaptersCoverage"].update({"chapterFourAdditionalExpressionReviews": len(items), "chapterFourAdditionalExpressionQuestionBands": sum(len(item["questions"]) for item in items)})
        if "chapter-04-coverage.json" in evidence:
            coverage = json.loads(read_bytes(f"{CANDIDATE}/chapter-04-coverage.json"))
            summary = coverage["summary"]
            inventory = json.loads(read_bytes(f"{CANDIDATE}/chapter-04-inventory.json"))
            final = json.loads(read_bytes(f"{CANDIDATE}/chapter-04-final-dispositions.json"))
            if (coverage["inventorySha256"] != digest(read_bytes(f"{CANDIDATE}/chapter-04-inventory.json")) or
                    summary["tokenUses"] != 1041 or summary["resolvedTokenUses"] != 1041 or summary["unresolvedTokenUses"] != 0 or
                    len(coverage["tokens"]) != 1041 or
                    [(r["unit"], r["start"], r["end"], r["text"]) for r in coverage["tokens"]] !=
                    [(t["unit"], t["start"], t["end"], t["text"]) for t in inventory["tokens"]] or
                    summary["dispositions"] != {key: sum(r["disposition"] == key for r in coverage["tokens"]) for key in set(r["disposition"] for r in coverage["tokens"])} or
                    sum(final["summary"].values()) != saved.get("chapterFourFinalDispositionUses") or
                    saved.get("chapterFourUnresolvedUses") != 0 or
                    summary["newMeanings"] != saved["chapterFourNewMeaningsReviewed"] or
                    summary["newQuestionBands"] != saved["newQuestionBandsReviewed"] or
                    summary["additionalExpressionReviews"] != saved["chapterFourAdditionalExpressionReviews"] or
                    summary["additionalExpressionQuestionBands"] != saved["chapterFourAdditionalExpressionQuestionBands"]):
                raise ValueError("Micromégas Chapter IV complete coverage differs from dossier")
            progress["remainingChaptersCoverage"].update({"chapterFourFinalDispositionUses": len(final["items"]), "chapterFourUnresolvedUses": 0})
    if "chapter-05-progress.json" in evidence:
        path = f"{CANDIDATE}/chapter-05-progress.json"
        chapter_five = json.loads(read_bytes(path))
        summary = chapter_five["summary"]
        files = chapter_five["evidenceSha256"]
        if any(digest(read_bytes(f"{CANDIDATE}/{name}")) != claimed for name, claimed in files.items()):
            raise ValueError("Micromégas Chapter V recovery evidence changed")
        counts = {}
        for token in chapter_five["tokens"]:
            counts[token["disposition"]] = counts.get(token["disposition"], 0) + 1
        if (chapter_five["chapter"] != 5 or summary["tokenUses"] != 612 or
                len(chapter_five["tokens"]) != 612 or counts != summary["dispositions"] or
                summary["newQuestionDrafts"] != 3 * summary["newContextualMeaningDrafts"] or
                summary["lexicalFormsTriaged"] != len(json.loads(read_bytes(f"{CANDIDATE}/chapter-05-triage-02.json"))["items"])):
            raise ValueError("Micromégas Chapter V recovery counts differ from evidence")
        if "chapter-05-earlier-draft-carryover.json" in files:
            earlier = json.loads(read_bytes(f"{CANDIDATE}/chapter-05-earlier-draft-carryover.json"))
            if (len(earlier["items"]) != summary["earlierDraftFormsShared"] or
                    sum(len(i["sourceOccurrences"]) for i in earlier["items"]) != summary["earlierDraftUsesShared"] or
                    sum(len(i["questionBands"]) for i in earlier["items"]) != summary["earlierQuestionBandsShared"] or
                    counts.get("share_earlier_contextual_question_draft_pending_review") != summary["earlierDraftUsesShared"]):
                raise ValueError("Micromégas Chapter V earlier draft carryover differs from evidence")
            for item in earlier["items"]:
                original = read_bytes(f"{CANDIDATE}/{item['earlierFile']}")
                if digest(original) != item["earlierFileSha256"]:
                    raise ValueError("Micromégas Chapter V earlier draft fingerprint changed")
                source_item = next(i for i in json.loads(original)["items"] if i["key"] == item["earlierKey"])
                questions = json.dumps(source_item["questions"], ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
                if digest(questions) != item["questionSha256"]:
                    raise ValueError("Micromégas Chapter V earlier questions changed")
        if "chapter-05-held-resolution.json" in files:
            resolution = json.loads(read_bytes(f"{CANDIDATE}/chapter-05-held-resolution.json"))
            routes = {}
            for item in resolution["items"]:
                routes[item["route"]] = routes.get(item["route"], 0) + 1
            held_keys = {(item["unit"], item["start"], item["end"]) for item in resolution["items"]}
            published_holds = [h for number in range(1, 6)
                               for h in json.loads(read_bytes(f"{CANDIDATE}/chapter-05-published-reuse-review-{number:02}.json"))["holds"]]
            expected = {(h["unit"], h["start"], h["end"]) for h in published_holds}
            if (len(held_keys) != 73 or len(expected) != 73 or held_keys != expected or
                    routes != summary["publishedHeldRoutes"] or resolution["summary"]["routes"] != routes or
                    digest(read_bytes(f"{CANDIDATE}/chapter-05-expression-review.json")) != resolution["expressionReviewSha256"]):
                raise ValueError("Micromégas Chapter V held routing differs from source evidence")
            for name, claimed in resolution["publishedReviewSha256"].items():
                if digest(read_bytes(f"{CANDIDATE}/{name}")) != claimed:
                    raise ValueError("Micromégas Chapter V held published review changed")
            published_questions = [q for index in range(64)
                                   for q in json.loads(read_bytes(f"{publication_base}/shared/fr/quizzes/{index:02x}.json"))["records"]]
            for item in resolution["items"]:
                if "identity" not in item:
                    continue
                surface, sense = item["identity"].split(":", 1)
                questions = [q for q in published_questions
                             if q["subject"].get("surfaceFormId") == surface and q["subject"].get("senseId") == sense]
                serialized = json.dumps(questions, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
                if sorted(q["id"] for q in questions) != item["questionIds"] or digest(serialized) != item["questionSha256"]:
                    raise ValueError("Micromégas Chapter V held shared questions changed")
            if "chapter-05-held-batch-01.json" in files:
                held_batches = [json.loads(read_bytes(f"{CANDIDATE}/{name}")) for name in
                                ("chapter-05-held-batch-01.json", "chapter-05-held-batch-02.json", "chapter-05-held-batch-03.json") if name in files]
                units = {u["ordinal"]: u["text"] for u in json.loads(read_bytes(f"{CANDIDATE}/unit-plan.json"))["units"]}
                held_items = [item for batch in held_batches for item in batch["items"]]
                authored = [o for item in held_items for o in item["sourceOccurrences"]]
                route_by_key = {(i["unit"], i["start"], i["end"]): i["route"] for i in resolution["items"]}
                if (len(held_items) != summary["heldContextualMeaningDrafts"] or
                        sum(len(i["questions"]) for i in held_items) != summary["heldContextualQuestionDrafts"] or
                        len(authored) != summary["heldContextualUsesWithDrafts"] or
                        len(authored) + summary["heldContextualUsesAwaitingDrafts"] != routes["distinct_contextual_meaning_or_construction_pending_question_authoring"]):
                    raise ValueError("Micromégas Chapter V held draft counts invalid")
                for occurrence in authored:
                    key = occurrence["unit"], occurrence["start"], occurrence["end"]
                    if route_by_key.get(key) != "distinct_contextual_meaning_or_construction_pending_question_authoring" or units[key[0]][key[1]:key[2]] != occurrence["text"]:
                        raise ValueError("Micromégas Chapter V held draft occurrence invalid")
                for item in held_items:
                    if [q["band"] for q in item["questions"]] != ["1-3", "4-5", "6-8"]:
                        raise ValueError("Micromégas Chapter V held draft bands invalid")
                    for q in item["questions"]:
                        if len(q["choices"]) != 4 or len(set(q["choices"])) != 4 or q["answer"] not in q["choices"]:
                            raise ValueError("Micromégas Chapter V held question structure invalid")
        if "publishedCandidateHeldUses" in summary:
            reuse = summary["publishedReuseUsesReviewed"]
            held = summary["publishedCandidateHeldUses"]
            if (reuse + held != 454 or summary["untriagedPublishedCandidateUses"] != 0 or
                    counts.get("reuse_reviewed_published_identity_and_questions_pending_import") != reuse or
                    counts.get("published_candidate_held_for_editorial_repair") != held):
                raise ValueError("Micromégas Chapter V published candidate partition invalid")
        if "chapter-05-expression-review.json" in files:
            expressions = json.loads(read_bytes(f"{CANDIDATE}/chapter-05-expression-review.json"))
            es = expressions["summary"]
            units = {u["ordinal"]: u["text"] for u in json.loads(read_bytes(f"{CANDIDATE}/unit-plan.json"))["units"]}
            if (expressions["sourceSha256"] != chapter_five["sourceSha256"] or
                    expressions["unitPlanSha256"] != chapter_five["unitPlanSha256"] or
                    len(expressions["items"]) != es["phraseUses"] or
                    es["newContextualExpressionDrafts"] != sum("questions" in item for item in expressions["items"]) or
                    es["newQuestionBands"] != sum(len(item.get("questions", [])) for item in expressions["items"]) or
                    es["componentTokenUses"] != sum(len(item["componentTokens"]) for item in expressions["items"]) or
                    (summary["expressionPhraseUses"], summary["newContextualExpressionDrafts"],
                     summary["newExpressionQuestionDrafts"], summary["expressionComponentTokenUses"]) !=
                    (es["phraseUses"], es["newContextualExpressionDrafts"], es["newQuestionBands"], es["componentTokenUses"])):
                raise ValueError("Micromégas Chapter V expression counts differ from evidence")
            for item in expressions["items"]:
                occurrence = item["sourceOccurrence"]
                if units[occurrence["unit"]][occurrence["start"]:occurrence["end"]] != occurrence["text"]:
                    raise ValueError("Micromégas Chapter V expression span differs from source")
                for q in item.get("questions", []):
                    if len(q["choices"]) != 4 or len(set(q["choices"])) != 4 or q["answer"] not in q["choices"]:
                        raise ValueError("Micromégas Chapter V expression question structure invalid")
            if any(item["key"] == "quarts_de_cercle" for item in expressions["items"]):
                if counts.get("expression_component_pending_identity_import") != 1:
                    raise ValueError("Micromégas Chapter V instrument component not tracked")
            for batch_name in ("chapter-05-batch-03.json", "chapter-05-batch-04.json", "chapter-05-batch-05.json", "chapter-05-batch-06.json"):
                if batch_name not in files:
                    continue
                batch = json.loads(read_bytes(f"{CANDIDATE}/{batch_name}"))
                if batch["sourceSha256"] != chapter_five["sourceSha256"] or batch["unitPlanSha256"] != chapter_five["unitPlanSha256"]:
                    raise ValueError(f"Micromégas Chapter V {batch_name} source fingerprint changed")
                for item in batch["items"]:
                    if len(item["questions"]) != 3 or [q["band"] for q in item["questions"]] != ["1-3", "4-5", "6-8"]:
                        raise ValueError(f"Micromégas Chapter V {batch_name} lacks question bands")
                    for occurrence in item["sourceOccurrences"]:
                        if units[occurrence["unit"]][occurrence["start"]:occurrence["end"]] != occurrence["text"]:
                            raise ValueError(f"Micromégas Chapter V {batch_name} token differs from source")
                    for question in item["questions"]:
                        if len(question["choices"]) != 4 or len(set(question["choices"])) != 4 or question["answer"] not in question["choices"]:
                            raise ValueError(f"Micromégas Chapter V {batch_name} question structure invalid")
        progress["chapterFiveRecovery"] = {
            "status": chapter_five["status"], **summary,
            "progressFile": "chapter-05-progress.json",
        }
    if "chapter-05-coverage.json" in evidence:
        coverage = json.loads(read_bytes(f"{CANDIDATE}/chapter-05-coverage.json"))
        summary = coverage["summary"]
        if (len(coverage["tokens"]) != 612 or len({(t["unit"], t["start"], t["end"]) for t in coverage["tokens"]}) != 612 or
                summary["resolvedTokenUses"] != 612 or summary["unresolvedTokenUses"] != 0):
            raise ValueError("Micromégas Chapter V complete coverage invalid")
        for name, claimed in coverage["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != claimed:
                raise ValueError(f"Micromégas Chapter V final review changed: {name}")
        qa = json.loads(read_bytes(f"{CANDIDATE}/chapter-05-qa.json"))
        if (len(qa["items"]) != 137 or len({i["key"] for i in qa["items"]}) != 137 or
                qa["summary"]["reviewedQuestionBands"] != 411 or
                summary["reviewedVocabularyQuestionBands"] != 411 or summary["reviewedExpressionQuestionBands"] != 27):
            raise ValueError("Micromégas Chapter V final question review counts invalid")
        saved = dossier["review"]["remainingChapters"]["progress"]
        if (saved.get("chapterFiveAdditionalResolvedUses") != 573 or saved.get("chapterFiveUnresolvedUses") != 0 or
                saved.get("chapterFiveReviewedVocabularyQuestionBands") != 411 or saved.get("chapterFiveReviewedExpressionQuestionBands") != 27):
            raise ValueError("Micromégas Chapter V dossier progress inconsistent")
        progress["remainingChaptersCoverage"].update({key: saved[key] for key in (
            "chapterFiveAdditionalResolvedUses", "chapterFiveUnresolvedUses", "chapterFiveReviewedVocabularyQuestionBands", "chapterFiveReviewedExpressionQuestionBands")})
        progress["chapterFiveCoverage"] = {"status": coverage["status"], **summary, "coverageFile": "chapter-05-coverage.json"}
    if "chapter-06-progress.json" in evidence:
        sixth = json.loads(read_bytes(f"{CANDIDATE}/chapter-06-progress.json"))
        review = json.loads(read_bytes(f"{CANDIDATE}/chapter-06-context-review-01.json"))
        batch = json.loads(read_bytes(f"{CANDIDATE}/chapter-06-batch-01.json"))
        for name, expected in sixth["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != expected:
                raise ValueError(f"Chapter VI progress evidence changed: {name}")
        summary = sixth["summary"]
        reviewed = sum(len(i["sourceOccurrences"]) for i in review["items"])
        held = sum(len(i["sourceOccurrences"]) for i in review["holds"])
        if reviewed != summary["reviewedUses"] or held != summary["heldUses"] or reviewed + held != summary["consideredUses"] or len(batch["items"]) * 3 != summary["newQuestionBands"]:
            raise ValueError("Chapter VI partial counts disagree")
        if sixth.get("expressionOverlay"):
            overlay = sixth["expressionOverlay"]
            expressions = json.loads(read_bytes(f"{CANDIDATE}/{overlay['file']}"))
            if digest(read_bytes(f"{CANDIDATE}/{overlay['file']}")) != overlay["sha256"] or len(expressions["items"]) * 3 != overlay["reviewedQuestionBands"] or overlay["resolvedHeldUses"] + overlay["remainingHeldUses"] != held:
                raise ValueError("Chapter VI expression overlay disagrees")
        if sixth.get("continuationPackages"):
            chapter_six_continuation_summary(read_bytes, sixth, review)
        progress["chapterSixPartialReview"] = {"status": sixth["status"], **sixth.get("effectiveSummary", summary), "nextAction": sixth["nextAction"]}
        if sixth.get("nextUntouchedAction"):
            progress["chapterSixPartialReview"]["nextUntouchedAction"] = sixth["nextUntouchedAction"]
    if "chapter-07-progress.json" in evidence:
        seventh = json.loads(read_bytes(f"{CANDIDATE}/chapter-07-progress.json"))
        effective = chapter_seven_partial_summary(read_bytes, seventh)
        if dossier["review"]["chapterSeven"]["progress"] != {"file": "chapter-07-progress.json", **effective}:
            raise ValueError("Chapter VII dossier progress disagrees")
        progress["chapterSevenPartialReview"] = {"status": seventh["status"], **effective,
                                                "nextAction": seventh["nextAction"], "nextUntouchedAction": seventh["nextUntouchedAction"]}
    if "whole-work-progress-01.json" in evidence:
        recon = json.loads(read_bytes(f"{CANDIDATE}/whole-work-progress-01.json"))
        for name, fingerprint in recon["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Whole-work reconciliation evidence changed: {name}")
        ledger = json.loads(read_bytes(f"{CANDIDATE}/whole-work-review-ledger-01.json"))
        if ledger["summary"] != recon["summary"] or dossier["review"]["wholeWorkReconciliation"]["summary"] != recon["summary"]:
            raise ValueError("Whole-work reconciliation counts disagree")
        if (sum(len(i["indexedSourceReview"]) for i in ledger["items"]) != recon["summary"]["reviewedPublishedUses"] or
                sum(len(i["tokens"]) for i in ledger["candidateSourceReview"]) != recon["summary"]["candidateConnectiveUses"]):
            raise ValueError("Whole-work reconciliation exact-source review counts disagree")
        progress["wholeWorkReconciliation"] = {"status": recon["status"], **recon["summary"],
                                                "heldResolutionSummary": recon["heldResolutionSummary"], "nextAction": recon["nextAction"]}
    if "whole-work-owner-progress-02.json" in evidence:
        owner = json.loads(read_bytes(f"{CANDIDATE}/whole-work-owner-progress-02.json"))
        for name, fingerprint in owner["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Owner reconciliation evidence changed: {name}")
        ledger = json.loads(read_bytes(f"{CANDIDATE}/whole-work-owner-review-02.json"))
        if owner["summary"] != ledger["summary"] or dossier["review"]["wholeWorkOwnership"]["summary"] != owner["summary"]:
            raise ValueError("Owner reconciliation summary disagrees")
        if (sum(len(i["sourceReview"]) for i in ledger["published"]) != owner["summary"]["reviewedPublishedUses"] or
                sum(len(i["sourceOccurrences"]) for i in ledger["candidate"]) != owner["summary"]["reviewedCandidateUses"]):
            raise ValueError("Owner reconciliation source counts disagree")
        progress["wholeWorkOwnership"] = {"status": owner["status"], **owner["summary"], "nextAction": owner["nextAction"]}
    if "whole-work-scope-progress-03.json" in evidence:
        scope = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-03.json"))
        for name, fingerprint in scope["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-03.json"))
        counts = {
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedPublishedExpressions": len(plan["expressionSnapshot"]),
            "reviewedPublishedExpressionUses": sum(len(i["occurrences"]) for i in plan["expressionSnapshot"]),
            "reviewedPublishedExpressionBands": sum(len(i["quizzes"]) for i in plan["expressionSnapshot"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "preparedExpressionReplacementBands": len(plan["expressionChanges"]),
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "exactPublishedPosReassignments": sum(o["decision"]["route"].startswith("correct_") for i in plan["published"] for o in i["sourceReview"]),
        }
        if any(counts != i for i in [plan["summary"], scope["summary"], dossier["review"]["wholeWorkScopes"]["summary"]]):
            raise ValueError("Scope reconciliation exact-source counts disagree")
        if scope["nextAction"] != plan["nextAction"] or scope["nextAction"] != dossier["review"]["wholeWorkScopes"]["nextAction"]:
            raise ValueError("Scope reconciliation next action disagrees")
        progress["wholeWorkScopes"] = {"status": scope["status"], **counts, "nextAction": scope["nextAction"]}
    if "whole-work-scope-progress-04.json" in evidence:
        extent = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-04.json"))
        for name, fingerprint in extent["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Extent reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-04.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedPublishedExpressions": len(plan["expressionSnapshot"]),
            "reviewedPublishedExpressionUses": sum(len(i["occurrences"]) for i in plan["expressionSnapshot"]),
            "reviewedPublishedExpressionBands": sum(len(i["quizzes"]) for i in plan["expressionSnapshot"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "sharedExpressionMetadataChanges": len(plan["expressionMetadataChanges"]),
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
        }
        if any(counts != i for i in [plan["summary"], extent["summary"], dossier["review"]["wholeWorkExtent"]["summary"]]):
            raise ValueError("Extent reconciliation exact-source counts disagree")
        if extent["nextAction"] != plan["nextAction"] or extent["nextAction"] != dossier["review"]["wholeWorkExtent"]["nextAction"]:
            raise ValueError("Extent reconciliation next action disagrees")
        progress["wholeWorkExtent"] = {"status": extent["status"], **counts, "nextAction": extent["nextAction"]}
    if "whole-work-scope-progress-05.json" in evidence:
        extent = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-05.json"))
        for name, fingerprint in extent["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Agency reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-05.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedPublishedExpressions": len(plan["expressionSnapshot"]),
            "reviewedPublishedExpressionUses": sum(len(i["occurrences"]) for i in plan["expressionSnapshot"]),
            "reviewedPublishedExpressionBands": sum(len(i["quizzes"]) for i in plan["expressionSnapshot"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "sharedExpressionMetadataChanges": len(plan["expressionMetadataChanges"]),
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
        }
        if any(counts != i for i in [plan["summary"], extent["summary"], dossier["review"]["wholeWorkAgency"]["summary"]]):
            raise ValueError("Agency reconciliation exact-source counts disagree")
        if extent["nextAction"] != plan["nextAction"] or extent["nextAction"] != dossier["review"]["wholeWorkAgency"]["nextAction"]:
            raise ValueError("Agency reconciliation next action disagrees")
        progress["wholeWorkAgency"] = {"status": extent["status"], **counts, "nextAction": extent["nextAction"]}
    if "whole-work-scope-progress-06.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-06.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Smallness reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-06.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "plannedNounOwners": 1,
            "plannedNounMeanings": len(plan["nounOwner"]["senseGroups"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "exactPublishedReassignments": sum(o["decision"]["route"].startswith("correct_") for i in plan["published"] for o in i["sourceReview"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkSmallness"]["summary"]]):
            raise ValueError("Smallness reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkSmallness"]["nextAction"]:
            raise ValueError("Smallness reconciliation next action disagrees")
        progress["wholeWorkSmallness"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-07.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-07.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Indefinite/arrival reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-07.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedPublishedExpressions": len(plan["expressionSnapshot"]),
            "reviewedPublishedExpressionUses": sum(len(i["occurrences"]) for i in plan["expressionSnapshot"]),
            "reviewedPublishedExpressionBands": sum(len(i["quizzes"]) for i in plan["expressionSnapshot"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "plannedPronounOwners": 1,
            "plannedPronounMeanings": len(plan["pronounOwner"]["senseGroups"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkIndefiniteArrival"]["summary"]]):
            raise ValueError("Indefinite/arrival reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkIndefiniteArrival"]["nextAction"]:
            raise ValueError("Indefinite/arrival reconciliation next action disagrees")
        progress["wholeWorkIndefiniteArrival"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-08.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-08.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Modality reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-08.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "retainedHomographBanks": 1,
            "retainedHomographUses": len(plan["homographBank"]["sourceOccurrences"]),
            "retainedHomographBands": len(plan["homographBank"]["quizzes"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkModality"]["summary"]]):
            raise ValueError("Modality reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkModality"]["nextAction"]:
            raise ValueError("Modality reconciliation next action disagrees")
        progress["wholeWorkModality"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-09.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-09.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Human scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-09.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkHumanScope"]["summary"]]):
            raise ValueError("Human scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkHumanScope"]["nextAction"]:
            raise ValueError("Human scope reconciliation next action disagrees")
        progress["wholeWorkHumanScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-10.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-10.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Quoi scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-10.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedAdverbOwners": 1 if plan.get("adverbOwner") else 0,
            "plannedAdverbMeanings": len(plan["adverbOwner"]["senseGroups"]),
            "exactPublishedPosReassignments": len(plan["exactPublishedPosReassignments"]),
            "recheckedPriorExpressionBanks": len(plan["priorExpressionBindings"]),
            "recheckedPriorExpressionUses": sum(len(i["sourceOccurrences"]) for i in plan["priorExpressionBindings"]),
            "recheckedPriorExpressionBands": sum(len(i["before"]["questions"]) for i in plan["priorExpressionBindings"]),
            "preparedPriorExpressionReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["priorExpressionBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkQuoiScope"]["summary"]]):
            raise ValueError("Quoi scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkQuoiScope"]["nextAction"]:
            raise ValueError("Quoi scope reconciliation next action disagrees")
        progress["wholeWorkQuoiScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-11.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-11.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Prendre scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-11.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedVerbMeanings": len(plan["plannedSenseGroups"]),
            "retainedHomographBanks": len(plan["homographBankBindings"]),
            "retainedHomographBands": sum(len(i["before"]["questions"]) for i in plan["homographBankBindings"]),
            "retainedUpstreamExpressionBanks": len(plan["upstreamPlanBindings"]),
            "retainedUpstreamExpressionBands": sum(len(i["before"]["questions"]) for i in plan["upstreamPlanBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkPrendreScope"]["summary"]]):
            raise ValueError("Prendre scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkPrendreScope"]["nextAction"]:
            raise ValueError("Prendre scope reconciliation next action disagrees")
        progress["wholeWorkPrendreScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-12.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-12.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Resignation/capture reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-12.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedCompletePhraseMeanings": len({i["senseGroup"] for i in plan["newExpressions"]}),
            "recheckedPriorExpressionBanks": len(plan["priorExpressionBindings"]),
            "recheckedPriorExpressionUses": sum(len(i["sourceOccurrences"]) for i in plan["priorExpressionBindings"]),
            "recheckedPriorExpressionBands": sum(len(i["before"]["questions"]) for i in plan["priorExpressionBindings"]),
            "preparedPriorExpressionReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["priorExpressionBindings"]),
            "exactPriorExpressionTriages": len(plan["priorExpressionTriages"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkResignationCapture"]["summary"]]):
            raise ValueError("Resignation/capture reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkResignationCapture"]["nextAction"]:
            raise ValueError("Resignation/capture reconciliation next action disagrees")
        progress["wholeWorkResignationCapture"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-13.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-13.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Prise noun scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-13.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedNounMeanings": len(plan["plannedSenseGroups"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "exactPriorScopeOverrides": len(plan["priorScopeBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkPriseNounScope"]["summary"]]):
            raise ValueError("Prise noun scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkPriseNounScope"]["nextAction"]:
            raise ValueError("Prise noun scope reconciliation next action disagrees")
        progress["wholeWorkPriseNounScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-14.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-14.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Raison scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-14.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedCompletePhraseMeanings": len({i["senseGroup"] for i in plan["newExpressions"]}),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkRaisonScope"]["summary"]]):
            raise ValueError("Raison scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkRaisonScope"]["nextAction"]:
            raise ValueError("Raison scope reconciliation next action disagrees")
        progress["wholeWorkRaisonScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-15.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-15.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Air scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-15.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedNounMeanings": len(plan["plannedSenseGroups"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkAirScope"]["summary"]]):
            raise ValueError("Air scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkAirScope"]["nextAction"]:
            raise ValueError("Air scope reconciliation next action disagrees")
        progress["wholeWorkAirScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-16.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-16.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Volume scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-16.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedNounOwners": len({plan["plannedNounOwner"]["lemmaId"]}),
            "plannedNounMeanings": len(plan["plannedSenseGroups"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkVolumeScope"]["summary"]]):
            raise ValueError("Volume scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkVolumeScope"]["nextAction"]:
            raise ValueError("Volume scope reconciliation next action disagrees")
        progress["wholeWorkVolumeScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-17.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-17.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Ame scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-17.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedNounMeanings": len(plan["plannedSenseGroups"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "additionalSharedBankUses": len(plan["extendedBankCoverage"]),
            "exactPriorCoverageOverrides": len(plan["priorScopeBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkAmeScope"]["summary"]]):
            raise ValueError("Ame scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkAmeScope"]["nextAction"]:
            raise ValueError("Ame scope reconciliation next action disagrees")
        progress["wholeWorkAmeScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-18.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-18.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Citer scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-18.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "plannedVerbOwners": len({plan["plannedVerbOwner"]["lemmaId"]}),
            "plannedVerbMeanings": len(plan["plannedSenseGroups"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkCiterScope"]["summary"]]):
            raise ValueError("Citer scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkCiterScope"]["nextAction"]:
            raise ValueError("Citer scope reconciliation next action disagrees")
        progress["wholeWorkCiterScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-19.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-19.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Reprendre scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-19.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "resolvedCandidateUses": sum(not t["route"].startswith("held_") for u in plan["candidate"] for t in u["tokens"]),
            "heldCandidateUses": sum(t["route"].startswith("held_") for u in plan["candidate"] for t in u["tokens"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkReprendreScope"]["summary"]]):
            raise ValueError("Reprendre scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkReprendreScope"]["nextAction"]:
            raise ValueError("Reprendre scope reconciliation next action disagrees")
        progress["wholeWorkReprendreScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-20.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-20.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Apprendre scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-20.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedVerbMeanings": len(plan["plannedSenseGroups"]),
            "retainedLemmaAliases": len(plan["lemmaAliasBindings"]),
            "correctedCarryoverUses": len(plan["occurrenceReassignments"]),
            "newWordBankUses": sum(len(b["sourceOccurrences"]) for b in plan["newWordBanks"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkApprendreScope"]["summary"]]):
            raise ValueError("Apprendre scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkApprendreScope"]["nextAction"]:
            raise ValueError("Apprendre scope reconciliation next action disagrees")
        progress["wholeWorkApprendreScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-21.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-21.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Savoir scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-21.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkSavoirScope"]["summary"]]):
            raise ValueError("Savoir scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkSavoirScope"]["nextAction"]:
            raise ValueError("Savoir scope reconciliation next action disagrees")
        progress["wholeWorkSavoirScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-22.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-22.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Bien scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-22.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "correctedPublishedUses": len(plan["publishedOccurrenceReassignments"]),
            "retainedMisassignedBands": sum(len(b["quizzes"]) for b in plan["retainedMisassignedBanks"]),
            "reusedCompletePhraseBanks": len(plan["reusedExpressionBanks"]),
            "reusedCompletePhraseBands": sum(len(b["quizzes"]) for b in plan["reusedExpressionBanks"]),
            "additionalExistingPhraseUses": sum(len(b["sourceExtensions"]) for b in plan["reusedExpressionBanks"]),
            "recheckedPriorExpressionBanks": len(plan["priorExpressionBindings"]),
            "recheckedPriorExpressionBands": sum(len(b["before"]["questions"]) for b in plan["priorExpressionBindings"]),
            "plannedCompletePhraseMeanings": sum(bool(e["newMeaning"]) for e in plan["newExpressions"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkBienScope"]["summary"]]):
            raise ValueError("Bien scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkBienScope"]["nextAction"]:
            raise ValueError("Bien scope reconciliation next action disagrees")
        progress["wholeWorkBienScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-23.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-23.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Pierre scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-23.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkPierreScope"]["summary"]]):
            raise ValueError("Pierre scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkPierreScope"]["nextAction"]:
            raise ValueError("Pierre scope reconciliation next action disagrees")
        progress["wholeWorkPierreScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-24.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-24.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Monsieur scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-24.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "correctedPriorUses": len(plan["occurrenceReassignments"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkMonsieurScope"]["summary"]]):
            raise ValueError("Monsieur scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkMonsieurScope"]["nextAction"]:
            raise ValueError("Monsieur scope reconciliation next action disagrees")
        progress["wholeWorkMonsieurScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-25.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-25.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Faire scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-25.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedVerbMeanings": len(plan["plannedSenseGroups"]),
            "correctedPublishedUses": len(plan["occurrenceReassignments"]),
            "explicitCandidateRouteOverrides": len(plan["candidateRouteOverrides"]),
            "deferredExpressionTokens": len(plan["deferredExpressionDependencies"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkFaireScope"]["summary"]]):
            raise ValueError("Faire scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkFaireScope"]["nextAction"]:
            raise ValueError("Faire scope reconciliation next action disagrees")
        progress["wholeWorkFaireScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-26.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-26.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Faire phrases scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-26.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "retainedCandidateComponentBanks": len(plan["retainedCandidateComponentBanks"]),
            "retainedCandidateComponentBands": sum(len(b["before"]["questions"]) for b in plan["retainedCandidateComponentBanks"]),
            "reusedCompletePhraseBanks": len(plan["reusedExpressionBanks"]),
            "reusedCompletePhraseBands": sum(len(b["quizzes"]) for b in plan["reusedExpressionBanks"]),
            "recheckedPriorExpressionBanks": len(plan["priorExpressionBindings"]),
            "recheckedPriorExpressionBands": sum(len(b["before"]["questions"]) for b in plan["priorExpressionBindings"]),
            "plannedCompletePhraseMeanings": sum(bool(e["newMeaning"]) for e in plan["newExpressions"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkFairePhrasesScope"]["summary"]]):
            raise ValueError("Faire phrases scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkFairePhrasesScope"]["nextAction"]:
            raise ValueError("Faire phrases scope reconciliation next action disagrees")
        progress["wholeWorkFairePhrasesScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-27.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-27.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Figure scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-27.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "retainedInterveningTokens": sum(len(o["retainedInterveningTokens"]) for o in plan["phraseComponents"] + plan["candidatePhraseComponents"]),
            "plannedCompletePhraseMeanings": sum(bool(e["newMeaning"]) for e in plan["newExpressions"]),
            "ellipticalShowingUses": len(plan["ellipticalSources"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkFigureScope"]["summary"]]):
            raise ValueError("Figure scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkFigureScope"]["nextAction"]:
            raise ValueError("Figure scope reconciliation next action disagrees")
        progress["wholeWorkFigureScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-28.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-28.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Faire attestation sharing terms scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-28.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedCompletePhraseMeanings": sum(bool(e["newMeaning"]) for e in plan["newExpressions"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkFaireAttestationSharingTermsScope"]["summary"]]):
            raise ValueError("Faire attestation sharing terms scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkFaireAttestationSharingTermsScope"]["nextAction"]:
            raise ValueError("Faire attestation sharing terms scope reconciliation next action disagrees")
        progress["wholeWorkFaireAttestationSharingTermsScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-29.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-29.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Faire pity harm relevance informing scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-29.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedCompletePhraseMeanings": sum(bool(e["newMeaning"]) for e in plan["newExpressions"]),
            "retainedCandidateComponentBanks": len(plan["retainedCandidateComponentBanks"]),
            "retainedCandidateComponentBands": sum(len(i["before"]["questions"]) for i in plan["retainedCandidateComponentBanks"]),
            "recheckedPriorExpressionBanks": len(plan["priorExpressionBindings"]),
            "recheckedPriorExpressionBands": sum(len(i["before"]["questions"]) for i in plan["priorExpressionBindings"]),
            "retainedExpressionEvidenceAliases": len(plan["priorExpressionAliases"]),
            "explicitPriorRouteOverrides": len(plan["priorRouteOverrides"]),
            "retainedOutsidePhraseTokens": len(plan["retainedOutsidePhraseTokens"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkFairePityHarmRelevanceInformingScope"]["summary"]]):
            raise ValueError("Faire pity harm relevance informing scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkFairePityHarmRelevanceInformingScope"]["nextAction"]:
            raise ValueError("Faire pity harm relevance informing scope reconciliation next action disagrees")
        progress["wholeWorkFairePityHarmRelevanceInformingScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-30.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-30.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Miroir scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-30.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkMiroirScope"]["summary"]]):
            raise ValueError("Miroir scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkMiroirScope"]["nextAction"]:
            raise ValueError("Miroir scope reconciliation next action disagrees")
        progress["wholeWorkMiroirScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-31.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-31.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Penser scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-31.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkPenserScope"]["summary"]]):
            raise ValueError("Penser scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkPenserScope"]["nextAction"]:
            raise ValueError("Penser scope reconciliation next action disagrees")
        progress["wholeWorkPenserScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-32.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-32.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Communiquer scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-32.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedProperVerbLemmas": len(plan["plannedLemmas"]),
            "plannedTransmissionMeanings": len(plan["plannedSenseGroups"]),
            "explicitPriorRouteOverrides": len(plan["priorRouteOverrides"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkCommuniquerScope"]["summary"]]):
            raise ValueError("Communiquer scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkCommuniquerScope"]["nextAction"]:
            raise ValueError("Communiquer scope reconciliation next action disagrees")
        progress["wholeWorkCommuniquerScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-33.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-33.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Possible scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-33.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedCompletePhraseMeanings": sum(bool(i["newMeaning"]) for i in plan["newExpressions"]),
            "correctedPublishedNounUses": len(plan["nounComponentCorrections"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkPossibleScope"]["summary"]]):
            raise ValueError("Possible scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkPossibleScope"]["nextAction"]:
            raise ValueError("Possible scope reconciliation next action disagrees")
        progress["wholeWorkPossibleScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-34.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-34.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Secret scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-34.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedCompletePhraseMeanings": sum(bool(i["newMeaning"]) for i in plan["newExpressions"]),
            "reusedLexicalConfinementMeanings": sum(i.get("meaningSourceSenseId") == "sns_fr_secret_incommunicado" for i in plan["newExpressions"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkSecretScope"]["summary"]]):
            raise ValueError("Secret scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkSecretScope"]["nextAction"]:
            raise ValueError("Secret scope reconciliation next action disagrees")
        progress["wholeWorkSecretScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-35.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-35.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Personne scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-35.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkPersonneScope"]["summary"]]):
            raise ValueError("Personne scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkPersonneScope"]["nextAction"]:
            raise ValueError("Personne scope reconciliation next action disagrees")
        progress["wholeWorkPersonneScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-36.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-36.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Soleil scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-36.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkSoleilScope"]["summary"]]):
            raise ValueError("Soleil scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkSoleilScope"]["nextAction"]:
            raise ValueError("Soleil scope reconciliation next action disagrees")
        progress["wholeWorkSoleilScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-37.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-37.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Ventre scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-37.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedProperNounLemmas": len(plan["plannedLemmas"]),
            "plannedAbdominalMeanings": len(plan["plannedSenseGroups"]),
            "normalizedCandidateBankGlosses": sum(i["before"]["meaning"] != i["after"]["meaning"] for i in plan["candidateBindings"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkVentreScope"]["summary"]]):
            raise ValueError("Ventre scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkVentreScope"]["nextAction"]:
            raise ValueError("Ventre scope reconciliation next action disagrees")
        progress["wholeWorkVentreScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-38.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-38.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Quoique scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-38.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "plannedCompletePhraseMeanings": sum(bool(e["newMeaning"]) for e in plan["newExpressions"]),
            "reusedLexicalConcessionMeanings": sum(e.get("meaningSourceSenseId") == "sns_fr_quoy_que_although" for e in plan["newExpressions"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkQuoiqueScope"]["summary"]]):
            raise ValueError("Quoique scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkQuoiqueScope"]["nextAction"]:
            raise ValueError("Quoique scope reconciliation next action disagrees")
        progress["wholeWorkQuoiqueScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-39.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-39.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Voir scope reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-39.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "newWordBankUses": sum(len(b["sourceOccurrences"]) for b in plan["newWordBanks"]),
            "plannedSocialContactMeanings": len(plan["plannedSenseGroups"]),
            "correctedCarryoverUses": len(plan["correctedCarryoverUses"]),
            "publishedOccurrenceReassignments": len(plan["publishedOccurrenceReassignments"]),
            "retainedHomographUses": sum(len(u["tokens"]) for u in plan["retainedHomographs"]),
            "retainedHomographBanks": len(plan["retainedHomographBanks"]),
            "priorFullPhraseBanks": len(plan["priorFullPhraseBanks"]),
            "priorFullPhraseBands": sum(len(b["before"]["questions"]) for b in plan["priorFullPhraseBanks"]),
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkVoirScope"]["summary"]]):
            raise ValueError("Voir scope reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkVoirScope"]["nextAction"]:
            raise ValueError("Voir scope reconciliation next action disagrees")
        progress["wholeWorkVoirScope"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-40.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-40.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Final package assessment reconciliation evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-40.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "reconciliationGroupsBound": len(plan["reconciliationBindings"]),
            "heldEditorialUses": len(plan["heldSourceDecisions"]),
            "heldCandidateBands": sum(len(b["before"]["questions"]) for b in plan["heldCandidateBanks"]),
            "explicitImportPrerequisites": len(plan["importPrerequisites"]),
            "appliedScopePlans": 0,
            "candidateReleaseReady": False,
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkFinalPackageAssessment"]["summary"]]):
            raise ValueError("Final package assessment reconciliation exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkFinalPackageAssessment"]["nextAction"]:
            raise ValueError("Final package assessment reconciliation next action disagrees")
        progress["wholeWorkFinalPackageAssessment"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-scope-progress-41.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-progress-41.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Reprendre 213 resolution evidence changed: {name}")
        plan = json.loads(read_bytes(f"{CANDIDATE}/whole-work-scope-plan-41.json"))
        counts = {
            "reviewedPublishedIdentities": len(plan["published"]),
            "reviewedPublishedUses": sum(len(i["sourceReview"]) for i in plan["published"]),
            "reviewedPublishedWordBands": sum(i["reviewedBands"] for i in plan["published"]),
            "reviewedHistoricalBands": len(plan["historical"]),
            "reviewedCandidateUnits": len(plan["candidate"]),
            "reviewedCandidateTokens": sum(len(i["tokens"]) for i in plan["candidate"]),
            "reviewedCandidateBanks": len(plan["candidateBindings"]),
            "reviewedCandidateBankUses": sum(len(i["sourceOccurrences"]) for i in plan["candidateBindings"]),
            "reviewedCandidateBands": len(plan["candidateBindings"]) * 3,
            "preparedWordReplacementBands": len(plan["wordChanges"]),
            "sharedSenseMetadataChanges": len(plan["senseChanges"]),
            "newWordBanks": len(plan["newWordBanks"]),
            "newWordBands": len(plan["newWordBanks"]) * 3,
            "newCompletePhraseBanks": len(plan["newExpressions"]),
            "newCompletePhraseBands": len(plan["newExpressions"]) * 3,
            "publishedPhraseSpans": len(plan["phraseComponents"]),
            "publishedPhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["phraseComponents"]),
            "candidatePhraseSpans": len(plan["candidatePhraseComponents"]),
            "candidatePhraseComponentTokens": sum(len(i["componentTokens"]) for i in plan["candidatePhraseComponents"]),
            "retainedComponentBanks": len(plan["legacyComponentBanks"]),
            "retainedComponentBands": sum(len(i["quizzes"]) for i in plan["legacyComponentBanks"]),
            "preparedCandidateReplacementBands": sum(sum(q != i["before"]["questions"][k] for k, q in enumerate(i["after"]["questions"])) for i in plan["candidateBindings"]),
            "resolvedEditorialUses": 1,
            "previousReconciliationGroups": 39,
            "heldEditorialUses": 0,
            "appliedScopePlans": 0,
            "candidateReleaseReady": False,
        }
        if any(counts != i for i in [plan["summary"], small["summary"], dossier["review"]["wholeWorkReprendre213Resolution"]["summary"]]):
            raise ValueError("Reprendre 213 resolution exact-source counts disagree")
        if small["nextAction"] != plan["nextAction"] or small["nextAction"] != dossier["review"]["wholeWorkReprendre213Resolution"]["nextAction"]:
            raise ValueError("Reprendre 213 resolution next action disagrees")
        progress["wholeWorkReprendre213Resolution"] = {"status": small["status"], **counts, "nextAction": small["nextAction"]}
    if "whole-work-import-progress-42.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-import-progress-42.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Import composition evidence changed: {name}")
        composed = json.loads(read_bytes(f"{CANDIDATE}/whole-work-import-composition-42.json"))
        for name, fingerprint in composed["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Import composition input changed: {name}")
        owner_counts = {}
        token_coordinates = set()
        for token in composed["tokens"]:
            coordinate = (token["unit"], token["start"], token["end"])
            if coordinate in token_coordinates:
                raise ValueError("Import composition contains duplicate source coordinates")
            token_coordinates.add(coordinate)
            kind = token["owner"]["kind"]
            owner_counts[kind] = owner_counts.get(kind, 0) + 1
        phrase_coordinates = set()
        for phrase in composed["phrases"]:
            for segment in phrase["lexicalSegments"]:
                coordinate = (phrase["unit"], segment["start"], segment["end"])
                if coordinate in phrase_coordinates or coordinate not in token_coordinates:
                    raise ValueError("Import composition phrase ownership overlaps or leaves source")
                phrase_coordinates.add(coordinate)
        counts = {
            "sourceUnits": len(composed["units"]),
            "sourceTokens": len(composed["tokens"]),
            "baseDispositions": sum(bool(t["base"]) for t in composed["tokens"]),
            "overlaidTokens": sum(bool(t["overlays"]) for t in composed["tokens"]),
            "heldRoutes": sum(t["owner"]["kind"].startswith("held_") for t in composed["tokens"]),
            "phraseSpans": len(composed["phrases"]),
            "phraseComponentUses": len(phrase_coordinates),
            "phraseConflicts": len(composed["phraseConflicts"]),
            "wordLocutionAttachments": len(composed["wordLocutionAttachments"]),
            "danglingComponentUses": len(composed["danglingComponents"]),
            "refinedBankSelectors": len(composed["bankBindings"]),
            "bankRefinements": len(composed["bankRefinements"]),
            "routeRefinements": len(composed["routeRefinements"]),
            "ownerCounts": owner_counts,
        }
        if any(counts != s for s in [composed["summary"], small["summary"], dossier["review"]["wholeWorkImportComposition"]["summary"]]):
            raise ValueError("Import composition source counts disagree")
        if small["candidateReleaseReady"] is not False or small["appliedScopePlans"] != 0 or small["nextAction"] != dossier["review"]["wholeWorkImportComposition"]["nextAction"]:
            raise ValueError("Import composition status or next action disagrees")
        progress["wholeWorkImportComposition"] = {"status": small["status"], **counts, "nextAction": small["nextAction"], "candidateReleaseReady": False}
    if "whole-work-identity-progress-43.json" in evidence:
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-identity-progress-43.json"))
        for name, fingerprint in small["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Identity graph progress evidence changed: {name}")
        graph = json.loads(read_bytes(f"{CANDIDATE}/whole-work-identity-dependencies-43.json"))
        for name, fingerprint in graph["evidenceSha256"].items():
            if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                raise ValueError(f"Identity graph declaration evidence changed: {name}")
        declarations = {d["declaration"]: d for d in graph["declarations"]}
        banks = {(d["bank"]["file"], d["bank"]["key"]): d for d in graph["declarations"]}
        if len(declarations) != len(graph["declarations"]) or len(banks) != len(declarations):
            raise ValueError("Identity graph duplicate declaration or bank")
        for declaration, row in declarations.items():
            bank = row["bank"]
            data = json.loads(read_bytes(f"{CANDIDATE}/{bank['file']}"))
            item = next(i for i in data["items"] if i["key"] == bank["key"])
            if len(item["questions"]) != 3 or digest(json.dumps(item["questions"], ensure_ascii=False, separators=(",", ":")).encode()) != bank["questionSha256"]:
                raise ValueError(f"Identity graph exact questions changed: {declaration}")
            seen, current = set(), declaration
            while declarations[current]["dependency"] is not None:
                if current in seen:
                    raise ValueError("Identity graph dependency cycle")
                seen.add(current)
                current = declarations[current]["dependency"]
                if current not in declarations:
                    raise ValueError("Identity graph missing predecessor")
            if row["dependency"]:
                prior = declarations[row["dependency"]]
                if row["relation"] == "same_sense" and row["root"] != prior["root"]:
                    raise ValueError("Identity graph same-sense root changed")
                if row["relation"] == "same_lemma_separate_sense" and (row["root"]["lemma"] != prior["root"]["lemma"] or row["root"] == prior["root"]):
                    raise ValueError("Identity graph separate sense or shared lemma changed")
        composed = json.loads(read_bytes(f"{CANDIDATE}/whole-work-import-composition-42.json"))
        direct = {(t["unit"], t["start"], t["end"]): t for t in composed["tokens"] if t["owner"]["kind"] == "draft_bank"}
        grouped = set()
        for group in graph["directDraftBankGroups"]:
            question_hashes = {bank["questionSha256"] for bank in group["banks"]}
            if len(question_hashes) != group["distinctQuestionBanks"]:
                raise ValueError("Identity graph bank selection count changed")
            group_banks = {(b["file"], b["key"]) for b in group["banks"]}
            for coordinate in group["occurrences"]:
                key = (coordinate["unit"], coordinate["start"], coordinate["end"])
                if key in grouped or key not in direct:
                    raise ValueError("Identity graph duplicate or non-draft source binding")
                grouped.add(key)
                token = direct[key]
                bank_key = (token["owner"]["file"], token["owner"]["key"])
                if bank_key not in group_banks or banks[bank_key]["root"] != group["root"] or token["form"] != group["surface"] or token["text"] != coordinate["text"]:
                    raise ValueError("Identity graph source owner mismatch")
        if grouped != set(direct):
            raise ValueError("Identity graph incomplete direct draft source map")
        expected_overrides = [{"unit": t["unit"], "start": t["start"], "end": t["end"], "text": t["text"], "senseTarget": t["owner"]["senseTarget"], "evidence": t["overlays"][-1]["evidence"]} for t in composed["tokens"] if t["owner"]["kind"] == "reviewed_sense_route"]
        if graph["wholeWorkOverrides"] != expected_overrides:
            raise ValueError("Identity graph source refinements changed")
        roots = [d["root"] for d in declarations.values()]
        groups = graph["directDraftBankGroups"]
        counts = {
            "declarations": len(declarations), "storedBanks": len(banks),
            "declaredSameSenseLinks": sum(d["relation"] == "same_sense" for d in declarations.values()),
            "declaredLemmaOnlyLinks": sum(d["relation"] == "same_lemma_separate_sense" for d in declarations.values()),
            "publishedSenseRoots": len({r["senseId"] for r in roots if r["kind"] == "published_sense"}),
            "plannedSenseRoots": len({r["declaration"] for r in roots if r["kind"] == "planned_sense"}),
            "pendingExactLemmaBindings": len({r["lemma"]["headword"] for r in roots if r["lemma"]["kind"] == "published_lemma_pending_exact_binding"}),
            "directDraftSourceUses": len(direct), "directDraftIdentityGroups": len(groups),
            "repeatedBankGroups": sum(len(g["banks"]) > 1 for g in groups),
            "questionSelectionGroups": sum(g["distinctQuestionBanks"] > 1 for g in groups),
            "wholeWorkOverrideUses": len(expected_overrides),
        }
        if any(counts != s for s in [graph["summary"], small["summary"], dossier["review"]["wholeWorkIdentityDependencies"]["summary"]]):
            raise ValueError("Identity graph exact counts disagree")
        if small["candidateReleaseReady"] is not False or small["appliedScopePlans"] != 0 or graph["status"] != "offline_declared_dependency_graph_unapplied" or small["nextAction"] != dossier["review"]["wholeWorkIdentityDependencies"]["nextAction"]:
            raise ValueError("Identity graph status or next action changed")
        progress["wholeWorkIdentityDependencies"] = {"status": small["status"], **counts, "nextAction": small["nextAction"], "candidateReleaseReady": False}
    if "whole-work-reviewed-bank-progress-45.json" in evidence:
        word_small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-reviewed-word-progress-44.json"))
        bank_small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-reviewed-bank-progress-45.json"))
        words = json.loads(read_bytes(f"{CANDIDATE}/whole-work-reviewed-word-bindings-44.json"))
        banks = json.loads(read_bytes(f"{CANDIDATE}/whole-work-reviewed-word-banks-45.json"))
        for data in [word_small, bank_small, words, banks]:
            for name, fingerprint in data["evidenceSha256"].items():
                if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                    raise ValueError(f"Reviewed word binding evidence changed: {name}")
        json_hash = lambda value: digest(json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode())
        if json_hash(words) != banks["wordBindingsSha256"]:
            raise ValueError("Canonical reviewed banks disagree with word identity composition")
        manifest = json.loads(read_bytes(f"{publication_base}/shared/fr.json"))
        if manifest["version"] != 2:
            raise ValueError("Reviewed word integrity expects the current version2 French source")
        shared = {kind: [record for file in manifest["files"][kind] for record in json.loads(read_bytes(f"{publication_base}/{file}"))["records"]] for kind in ["lemmas", "senses", "surfaceForms"]}
        lemmas = {r["id"]: r for r in shared["lemmas"]}
        senses = {r["id"]: r for r in shared["senses"]}
        surfaces = {r["id"]: r for r in shared["surfaceForms"]}
        for kind, target in [("newLemmas", lemmas), ("newSenses", senses), ("newSurfaceForms", surfaces)]:
            for entry in words[kind]:
                record = entry["record"]
                if record["id"] in target:
                    raise ValueError("Reviewed word new record collides with existing owner")
                target[record["id"]] = record
        composed = json.loads(read_bytes(f"{CANDIDATE}/whole-work-import-composition-42.json"))
        key = lambda o: (o["unit"], o["start"], o["end"])
        source = {key(t): t for t in composed["tokens"]}
        occurrences = words["occurrenceBindings"]
        bound = {key(o): o for o in occurrences}
        correction_keys = {key(c) for c in words["surfaceCorrections"]}
        expected = {key(t) for t in composed["tokens"] if t["owner"]["kind"] == "reviewed_sense_route"} | correction_keys
        if len(bound) != len(occurrences) or set(bound) != expected or correction_keys != {(127, 13, 19)}:
            raise ValueError("Reviewed word source bindings are duplicated or incomplete")
        for o in occurrences:
            t = source[key(o)]
            if o["text"] != t["text"] or o["form"] != t["form"] or o["identity"] != f"{o['surfaceFormId']}:{o['senseId']}":
                raise ValueError("Reviewed word exact occurrence or identity changed")
            surface, sense = surfaces[o["surfaceFormId"]], senses[o["senseId"]]
            if surface["lemmaId"] != sense["lemmaId"] or o["lemmaId"] != sense["lemmaId"] or surface["normalized"] != t["form"]:
                raise ValueError("Reviewed word surface/sense crosses a lemma or written form")
            if o["masteryAction"] not in ["retain_existing_identity_progress", "fresh_identity_on_exact_unit_view"]:
                raise ValueError("Reviewed word invalid mastery action")
        correction = words["surfaceCorrections"][0]
        if correction["beforeIdentity"] != source[(127, 13, 19)]["owner"]["identity"] or correction["afterIdentity"] != bound[(127, 13, 19)]["identity"] or surfaces[bound[(127, 13, 19)]["surfaceFormId"]]["normalized"] != "sentit":
            raise ValueError("Reviewed word sentit exact-form correction changed")
        unchanged = {key(o): o for o in words["unchangedPublishedBindings"]}
        expected_unchanged = {key(t) for t in composed["tokens"] if t["owner"]["kind"] == "published_identity"} - correction_keys
        if len(unchanged) != len(words["unchangedPublishedBindings"]) or set(unchanged) != expected_unchanged or any(o["identity"] != source[k]["owner"]["identity"] for k, o in unchanged.items()):
            raise ValueError("Reviewed words changed an uncorrected retained identity")
        groups = {g["identity"]: g for g in words["identityGroups"]}
        grouped = {key(o): identity for identity, g in groups.items() for o in g["occurrences"]}
        if len(groups) != len(words["identityGroups"]) or len(grouped) != sum(len(g["occurrences"]) for g in groups.values()) or grouped != {key(o): o["identity"] for o in occurrences}:
            raise ValueError("Reviewed word groups do not partition exact source uses")
        dependency_ids = [d["identity"] for d in words["bankDependencies"]]
        if len(set(dependency_ids)) != len(dependency_ids) or set(dependency_ids) != set(groups) or any(not d["candidates"] for d in words["bankDependencies"]):
            raise ValueError("Reviewed word identity lacks stored bank dependency coverage")
        records = {b["identity"]: b for b in banks["banks"]}
        if len(records) != len(banks["banks"]) or set(records) != set(groups):
            raise ValueError("Canonical reviewed bank identities duplicated or incomplete")
        question_ids = set()
        for identity, b in records.items():
            if len(b["questions"]) != 3 or {q["band"] for q in b["questions"]} != {"levels_1_3", "levels_4_5", "levels_6_8"} or json_hash(b["questions"]) != b["questionSha256"]:
                raise ValueError("Canonical reviewed bank three-band hash changed")
            for q in b["questions"]:
                if q["id"] in question_ids or f"{q['subject']['surfaceFormId']}:{q['subject']['senseId']}" != identity:
                    raise ValueError("Canonical reviewed question has duplicate ID or wrong subject")
                question_ids.add(q["id"])
                if len(q["choices"]) != 4 or len({c["id"] for c in q["choices"]}) != 4 or len({c["text"] for c in q["choices"]}) != 4 or sum(c["id"] == q["correctChoiceId"] for c in q["choices"]) != 1:
                    raise ValueError("Canonical reviewed question choices changed")
                if q["band"] == "levels_1_3":
                    r = q["targetRange"]
                    if q["context"][r["start"]:r["end"]].lower().replace("'", "’") != q["targetText"].lower().replace("'", "’"):
                        raise ValueError("Canonical reviewed exact highlight changed")
                if q["band"] == "levels_4_5" and len(re.findall(r"_{3,}", q["context"])) != 1:
                    raise ValueError("Canonical reviewed middle question blank changed")
            for highlight in [o for o in b["overlays"] if o.get("kind") == "explicit_earliest_indexed_owned_source_target"]:
                if grouped.get(key(highlight)) != identity:
                    raise ValueError("Canonical reviewed highlighted occurrence has another owner")
        word_counts = {
            "reviewedSourceUses": len(bound), "reviewedIdentityGroups": len(groups),
            "reusedIdentityGroups": sum(g["masteryAction"] == "retain_existing_identity_progress" for g in groups.values()),
            "freshIdentityGroups": sum(g["masteryAction"] == "fresh_identity_on_exact_unit_view" for g in groups.values()),
            "unchangedPublishedSourceUses": len(unchanged), "exactSurfaceCorrections": len(words["surfaceCorrections"]),
            "newProperLemmas": len(words["newLemmas"]), "newSenses": len(words["newSenses"]), "newSurfaceForms": len(words["newSurfaceForms"]),
            "bankCoveredIdentityGroups": len(dependency_ids), "newMissingSurfaceBanks": len(words["newBanks"]), "newMissingSurfaceQuestionBands": len(words["newBanks"]) * 3,
            "pendingDirectDraftSourceUses": composed["summary"]["ownerCounts"]["draft_bank"], "pendingPhraseSpans": len(composed["phrases"]),
        }
        bank_counts = {
            "identityBanks": len(records), "storedPreparedQuestionBands": len(question_ids),
            "reusedIdentityBanks": sum(b["masteryAction"] == "retain_existing_identity_progress" for b in records.values()),
            "freshIdentityBanks": sum(b["masteryAction"] == "fresh_identity_on_exact_unit_view" for b in records.values()),
            "preservedExistingBankSelections": sum(b["chosen"]["kind"] == "existing_prepared_bank" for b in records.values()),
            "reviewedHistoricalBankReplacements": sum(b["chosen"]["kind"] == "reviewed_historical_bank_replacement" for b in records.values()),
            "newMissingSurfaceBanks": sum(b["chosen"]["kind"] == "new_missing_surface_bank" for b in records.values()),
            "reviewedScopeBankSelections": sum(b["chosen"]["kind"] == "reviewed_scope_bank" for b in records.values()),
            "contextualBankSelections": sum(b["chosen"]["kind"] == "contextual_draft_bank" for b in records.values()),
            "appliedStoredQuestionOverlays": sum(o.get("kind") != "explicit_earliest_indexed_owned_source_target" for b in records.values() for o in b["overlays"]),
            "explicitIndexedTargetSelections": sum(o.get("kind") == "explicit_earliest_indexed_owned_source_target" for b in records.values() for o in b["overlays"]),
            "preservedAlternateBanks": sum(len(b["alternateCandidates"]) for b in records.values()),
        }
        for small, data, counts, review_key in [(word_small, words, word_counts, "wholeWorkReviewedWordBindings"), (bank_small, banks, bank_counts, "wholeWorkReviewedWordBanks")]:
            if any(counts != value for value in [small["summary"], data["summary"], dossier["review"][review_key]["summary"]]):
                raise ValueError("Reviewed word identity/bank exact counts disagree")
            if small["candidateReleaseReady"] is not False or small["appliedScopePlans"] != 0 or small["nextAction"] != dossier["review"][review_key]["nextAction"]:
                raise ValueError("Reviewed word composition status or next action changed")
            progress[review_key] = {"status": small["status"], **counts, "nextAction": small["nextAction"], "candidateReleaseReady": False}
    if "whole-work-direct-word-progress-46.json" in evidence:
        direct = json.loads(read_bytes(f"{CANDIDATE}/whole-work-direct-word-package-46.json"))
        small = json.loads(read_bytes(f"{CANDIDATE}/whole-work-direct-word-progress-46.json"))
        refinements = json.loads(read_bytes(f"{CANDIDATE}/whole-work-direct-bank-refinements-46.json"))
        json_hash = lambda value: digest(json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode())
        for data in [direct, small]:
            for name, fingerprint in data["evidenceSha256"].items():
                if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                    raise ValueError(f"Direct word package evidence changed: {name}")
        key = lambda o: (o["unit"], o["start"], o["end"])
        composed = json.loads(read_bytes(f"{CANDIDATE}/whole-work-import-composition-42.json"))
        graph = json.loads(read_bytes(f"{CANDIDATE}/whole-work-identity-dependencies-43.json"))
        source = {key(t): t for t in composed["tokens"] if t["owner"]["kind"] == "draft_bank"}
        bound = {key(o): o for o in direct["occurrenceBindings"]}
        remaining = {key(o): o for o in direct["remainingDirectDraftOccurrences"]}
        if len(bound) != len(direct["occurrenceBindings"]) or len(remaining) != len(direct["remainingDirectDraftOccurrences"]) or set(bound) & set(remaining) or set(bound) | set(remaining) != set(source):
            raise ValueError("Direct word package exact source partition disagrees")
        records = {}
        for kind in ["lemmas", "senses", "surfaceForms"]:
            records[kind] = {r["id"]: r for r in shared[kind]}
        prior = json.loads(read_bytes(f"{CANDIDATE}/whole-work-reviewed-word-bindings-44.json"))
        for data in [prior, direct]:
            for kind, target in [("newLemmas", "lemmas"), ("newSenses", "senses"), ("newSurfaceForms", "surfaceForms")]:
                for entry in data[kind]:
                    r = entry["record"]
                    if r["id"] in records[target]:
                        raise ValueError("Direct word staged record collision")
                    records[target][r["id"]] = r
        for o in [*bound.values(), *remaining.values()]:
            t = source[key(o)]
            if o["text"] != t["text"] or o["form"] != t["form"]:
                raise ValueError("Direct word exact source text changed")
        for o in bound.values():
            t = source[key(o)]
            s, meaning = records["surfaceForms"][o["surfaceFormId"]], records["senses"][o["senseId"]]
            if o["baseOwner"] != t["owner"] or s["normalized"] != t["form"] or s["lemmaId"] != meaning["lemmaId"] or o["lemmaId"] != meaning["lemmaId"] or o["identity"] != f"{s['id']}:{meaning['id']}":
                raise ValueError("Direct word exact Surface+Sense owner changed")
            if o["masteryAction"] not in ["retain_existing_identity_progress", "fresh_identity_on_exact_unit_view"]:
                raise ValueError("Direct word invalid mastery action")
        groups = {g["identity"]: g for g in direct["identityGroups"]}
        banks = {b["identity"]: b for b in direct["banks"]}
        if len(groups) != 100 or len(banks) != 100 or set(groups) != set(banks):
            raise ValueError("Direct word package bank/group coverage changed")
        held_forms = {h["surface"] for h in direct["heldGroups"]}
        selected = [g for g in graph["directDraftBankGroups"][:113] if g["surface"] not in held_forms]
        if len(held_forms) != 13 or {key(o) for g in selected for o in g["occurrences"]} != set(bound):
            raise ValueError("Direct word named package/holds changed")
        refined = {}
        for r in refinements["items"]:
            raw = json.loads(read_bytes(f"{CANDIDATE}/{r['file']}"))
            before = next(i for i in raw["items"] if i["key"] == r["key"])
            if json_hash(before["questions"]) != r["beforeQuestionSha256"] or json_hash(r["after"]["questions"]) != r["afterQuestionSha256"]:
                raise ValueError("Direct question refinement revision changed")
            for change in r["changes"]:
                old = next(q for q in before["questions"] if q["band"] == change["band"])
                new = next(q for q in r["after"]["questions"] if q["band"] == change["band"])
                if json_hash(old) != change["beforeSha256"] or json_hash(new) != change["afterSha256"] or not change["reason"]:
                    raise ValueError("Direct question refinement band changed")
            refined[(r["file"], r["key"])] = r
        question_ids, grouped_coords = set(), set()
        bands = {"levels_1_3", "levels_4_5", "levels_6_8"}
        for identity, g in groups.items():
            own = {k for k, o in bound.items() if o["identity"] == identity}
            if own != {key(o) for o in g["occurrences"]} or own & grouped_coords:
                raise ValueError("Direct word group exact source coverage changed")
            grouped_coords.update(own)
            b = banks[identity]
            if json_hash(b["questions"]) != b["questionSha256"] or len(b["questions"]) != 3 or {q["band"] for q in b["questions"]} != bands:
                raise ValueError("Direct canonical bank revision/bands changed")
            chosen = b["chosen"]
            if chosen["kind"] == "contextual_draft_bank":
                raw = json.loads(read_bytes(f"{CANDIDATE}/{chosen['evidence']['file']}"))
                source_bank = raw
                for part in chosen["evidence"]["selector"].split("/")[1:]:
                    source_bank = source_bank[int(part)] if isinstance(source_bank, list) else source_bank[part]
                if json_hash(source_bank["questions"]) != chosen["questionSha256"]:
                    raise ValueError("Direct selected source bank changed")
                r = refined.get((chosen["evidence"]["file"], chosen["key"]))
                source_questions = (r["after"] if r else source_bank)["questions"]
                if json_hash(source_questions) != b["sourceQuestionSha256"]:
                    raise ValueError("Direct selected refined source bank changed")
            for q in b["questions"]:
                if q["id"] in question_ids or f"{q['subject']['surfaceFormId']}:{q['subject']['senseId']}" != identity:
                    raise ValueError("Direct prepared question duplicate or subject mismatch")
                question_ids.add(q["id"])
                choices = q["choices"]
                if len(choices) != 4 or len({c["text"] for c in choices}) != 4 or sum(c["id"] == q["correctChoiceId"] for c in choices) != 1:
                    raise ValueError("Direct prepared question invalid choices")
                if q["band"] == "levels_1_3":
                    r = q["targetRange"]
                    if q["context"][r["start"]:r["end"]].lower().replace("'", "’") != q["targetText"].lower().replace("'", "’"):
                        raise ValueError("Direct prepared question target range changed")
                elif q["band"] == "levels_4_5" and len(re.findall(r"_{3,}", q["context"])) != 1:
                    raise ValueError("Direct prepared question completion blank changed")
                if chosen["kind"] == "contextual_draft_bank":
                    raw_band = {"levels_1_3": "1-3", "levels_4_5": "4-5", "levels_6_8": "6-8"}[q["band"]]
                    original = next(v for v in source_questions if v["band"] == raw_band)
                    if q["context"] != original["context"] or [c["text"] for c in choices] != original["choices"] or next(c["text"] for c in choices if c["id"] == q["correctChoiceId"]) != original["answer"]:
                        raise ValueError("Direct prepared question differs from selected stored revision")
        if grouped_coords != set(bound):
            raise ValueError("Direct word grouped source coverage incomplete")
        counts = {
            "boundDirectDraftSourceUses": len(bound), "boundDirectDraftIdentityGroups": len(groups), "storedPreparedQuestionBands": len(question_ids),
            "newProperLemmas": len(direct["newLemmas"]), "newSenses": len(direct["newSenses"]), "newSurfaceForms": len(direct["newSurfaceForms"]),
            "reusedIdentityGroups": sum(g["masteryAction"] == "retain_existing_identity_progress" for g in groups.values()),
            "freshIdentityGroups": sum(g["masteryAction"] == "fresh_identity_on_exact_unit_view" for g in groups.values()),
            "preservedPriorCanonicalBanks": sum(b["chosen"]["kind"] == "previously_bound_candidate_bank" for b in banks.values()),
            "preservedExistingBankSelections": sum(b["chosen"]["kind"] == "existing_prepared_bank" for b in banks.values()),
            "contextualBankSelections": sum(b["chosen"]["kind"] == "contextual_draft_bank" for b in banks.values()),
            "refinedBanks": len(refined), "refinedQuestionBands": sum(len(r["changes"]) for r in refined.values()),
            "explicitOwnershipAndBankHolds": len(direct["heldGroups"]), "remainingDirectDraftSourceUses": len(remaining),
            "remainingDirectDraftIdentityGroups": len(graph["directDraftBankGroups"]) - len(groups), "pendingPhraseSpans": len(composed["phrases"]),
        }
        if any(counts != value for value in [direct["summary"], small["summary"], dossier["review"]["wholeWorkDirectWordPackage"]["summary"]]):
            raise ValueError("Direct word package exact counts disagree")
        if small["candidateReleaseReady"] is not False or small["appliedScopePlans"] != 0 or small["nextAction"] != dossier["review"]["wholeWorkDirectWordPackage"]["nextAction"]:
            raise ValueError("Direct word package status/next action changed")
        progress["wholeWorkDirectWordPackage"] = {"status": small["status"], **counts, "nextAction": small["nextAction"], "candidateReleaseReady": False}
    if "whole-work-resolved-expression-progress-48.json" in evidence:
        words = json.loads(read_bytes(f"{CANDIDATE}/whole-work-resolved-word-package-47.json"))
        expressions = json.loads(read_bytes(f"{CANDIDATE}/whole-work-resolved-expressions-48.json"))
        previous = json.loads(read_bytes(f"{CANDIDATE}/whole-work-direct-word-package-46.json"))
        refinements = json.loads(read_bytes(f"{CANDIDATE}/whole-work-resolved-bank-refinements-47.json"))
        composed = json.loads(read_bytes(f"{CANDIDATE}/whole-work-import-composition-42.json"))
        json_hash = lambda value: digest(json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode())
        key = lambda o: (o["unit"], o["start"], o["end"])
        source = {key(t): t for t in composed["tokens"]}
        direct_source = {k: t for k, t in source.items() if t["owner"]["kind"] == "draft_bank"}
        moved = [o for o in expressions["componentBindings"] if o["baseOwner"]["kind"] == "draft_bank"]
        partition = [previous["occurrenceBindings"], words["occurrenceBindings"], moved, expressions["remainingDirectDraftOccurrences"]]
        coordinates = [key(o) for group in partition for o in group]
        if len(coordinates) != len(set(coordinates)) or set(coordinates) != set(direct_source):
            raise ValueError("Resolved packages exact draft-source partition disagrees")
        for group in partition:
            for o in group:
                t = direct_source[key(o)]
                if o["text"] != t["text"] or o["form"] != t["form"]:
                    raise ValueError("Resolved package exact draft source changed")
        for data in [words, expressions]:
            for name, fingerprint in data["evidenceSha256"].items():
                if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                    raise ValueError(f"Resolved package evidence changed: {name}")
        records = {k: {r["id"]: r for r in shared[k]} for k in ["lemmas", "senses", "surfaceForms"]}
        prior_words = json.loads(read_bytes(f"{CANDIDATE}/whole-work-reviewed-word-bindings-44.json"))
        for data in [prior_words, previous, words]:
            for kind, target in [("newLemmas", "lemmas"), ("newSenses", "senses"), ("newSurfaceForms", "surfaceForms")]:
                for entry in data[kind]:
                    record = entry["record"]
                    if record["id"] in records[target]:
                        raise ValueError("Resolved package record collision")
                    records[target][record["id"]] = record
        groups = {g["identity"]: g for g in words["identityGroups"]}
        banks = {b["identity"]: b for b in words["banks"]}
        if len(groups) != 103 or set(groups) != set(banks):
            raise ValueError("Resolved word canonical-bank coverage changed")
        for o in words["occurrenceBindings"]:
            t = direct_source[key(o)]
            form, sense = records["surfaceForms"][o["surfaceFormId"]], records["senses"][o["senseId"]]
            if o["baseOwner"] != t["owner"] or form["normalized"] != t["form"] or form["lemmaId"] != sense["lemmaId"] or o["lemmaId"] != sense["lemmaId"] or o["identity"] != f"{form['id']}:{sense['id']}":
                raise ValueError("Resolved exact Surface+Sense owner changed")
        for form, expected in [("haut", "lem_fr_haut_noun"), ("pas", "lem_pas_noun"), ("affaires", "lem_affaire"), ("allait", "lem_aller")]:
            if any(o["lemmaId"] != expected for o in words["occurrenceBindings"] if o["form"] == form):
                raise ValueError("Resolved named proper owner changed")
        own = lambda f: next(o for o in words["occurrenceBindings"] if o["form"] == f)
        if own("être")["senseId"] != own("êtres")["senseId"] or own("être")["surfaceFormId"] == own("êtres")["surfaceFormId"]:
            raise ValueError("Resolved noun number-sense join changed")
        for f, pos in [("public", "noun"), ("être", "noun"), ("êtres", "noun"), ("depuis", "adverb"), ("sirien", "noun"), ("dérobent", "verb")]:
            if records["lemmas"][own(f)["lemmaId"]]["partOfSpeech"] != pos:
                raise ValueError("Resolved grammatical category changed")
        all_questions, question_ids = [], set()
        for data_banks, kind in [(words["banks"], "vocabulary"), (expressions["banks"], "expression")]:
            for bank in data_banks:
                questions = bank["questions"]
                if json_hash(questions) != bank["questionSha256"] or len(questions) != 3 or {q["band"] for q in questions} != {"levels_1_3", "levels_4_5", "levels_6_8"}:
                    raise ValueError("Resolved canonical bank revision changed")
                for q in questions:
                    subject = q["subject"]
                    identity = f"{subject['surfaceFormId']}:{subject['senseId']}" if kind == "vocabulary" else f"{subject['surfaceId']}:{subject['expressionId']}"
                    if subject["kind"] != kind or identity != bank["identity"] or q["id"] in question_ids:
                        raise ValueError("Resolved prepared question subject or ID changed")
                    question_ids.add(q["id"])
                    if len(q["choices"]) != 4 or len({c["text"] for c in q["choices"]}) != 4 or sum(c["id"] == q["correctChoiceId"] for c in q["choices"]) != 1:
                        raise ValueError("Resolved question choices changed")
                    if q["band"] == "levels_1_3":
                        target = q["targetRange"]
                        if q["context"][target["start"]:target["end"]].lower().replace("'", "’") != q["targetText"].lower().replace("'", "’"):
                            raise ValueError("Resolved early target range changed")
                    if q["band"] == "levels_4_5" and len(re.findall(r"_{3,}", q["context"])) != 1:
                        raise ValueError("Resolved completion blank changed")
                    all_questions.append(q)
        expression_occurrences = {o["id"]: o for o in expressions["occurrences"]}
        covered = set()
        for o in expressions["componentBindings"]:
            t = source[key(o)]
            span = expression_occurrences[o["expressionOccurrenceId"]]
            if key(o) in covered or o["baseOwner"] != t["owner"] or o["text"] != t["text"] or o["start"] < span["start"] or o["end"] > span["end"] or o["masteryAction"] != "fresh_identity_on_exact_unit_view":
                raise ValueError("Resolved phrase exact component owner changed")
            covered.add(key(o))
        source_units = json.loads(read_bytes(f"{CANDIDATE}/unit-plan.json"))["units"]
        for o in expressions["occurrences"]:
            number = int(o["unitId"].split("_")[-1])
            if source_units[number - 1]["text"][o["start"]:o["end"]] != o["text"]:
                raise ValueError("Resolved full expression source boundary changed")
        exit_span = next(o for o in expressions["occurrences"] if o["text"] == "au sortir de")
        if (exit_span["start"], exit_span["end"]) != (36, 48):
            raise ValueError("Resolved exit phrase consumed its complement")
        for impact in expressions["legacyImpact"]:
            if json_hash({"before": impact["before"], "occurrences": impact["occurrences"], "quizzes": impact["quizzes"]}) != impact["sha256"] or len(impact["quizzes"]) != 3:
                raise ValueError("Resolved expression predecessor impact changed")
        for r in refinements["items"]:
            original = next(i for i in json.loads(read_bytes(f"{CANDIDATE}/{r['file']}"))["items"] if i["key"] == r["key"])
            if json_hash(original["questions"]) != r["beforeQuestionSha256"] or json_hash(r["after"]["questions"]) != r["afterQuestionSha256"]:
                raise ValueError("Resolved question predecessor revision changed")
            for c in r["changes"]:
                old, new = [next(q for q in v["questions"] if q["band"] == c["band"]) for v in [original, r["after"]]]
                if json_hash(old) != c["beforeSha256"] or json_hash(new) != c["afterSha256"] or not c["reason"]:
                    raise ValueError("Resolved question band authority changed")
        word_counts = {
            "boundDirectDraftSourceUses": len(words["occurrenceBindings"]), "boundDirectDraftIdentityGroups": len(groups), "storedPreparedQuestionBands": len(words["banks"])*3,
            "newProperLemmas": len(words["newLemmas"]), "newSenses": len(words["newSenses"]), "newSurfaceForms": len(words["newSurfaceForms"]),
            "reusedIdentityGroups": sum(g["masteryAction"] == "retain_existing_identity_progress" for g in groups.values()), "freshIdentityGroups": sum(g["masteryAction"] == "fresh_identity_on_exact_unit_view" for g in groups.values()),
            "preservedPriorCanonicalBanks": sum(b["chosen"]["kind"] == "previously_bound_candidate_bank" for b in banks.values()), "preservedExistingBankSelections": sum(b["chosen"]["kind"] == "existing_prepared_bank" for b in banks.values()), "contextualBankSelections": sum(b["chosen"]["kind"] == "contextual_draft_bank" for b in banks.values()),
            "refinedBanks": len(refinements["items"]), "refinedQuestionBands": sum(len(r["changes"]) for r in refinements["items"]), "explicitOwnershipAndBankHolds": len(words["heldGroups"]), "remainingDirectDraftSourceUses": len(words["remainingDirectDraftOccurrences"]), "remainingDirectDraftIdentityGroups": 1140 - 100 - len(groups), "pendingPhraseSpans": len(composed["phrases"]),
        }
        expression_counts = {
            "boundExpressionSurfaceKeys": len(expressions["banks"]), "storedPreparedQuestionBands": len(expressions["banks"])*3, "newExpressionMeanings": len(expressions["newIdentities"]), "reusedExpressionMeanings": len(expressions["identityChanges"]), "expressionSourceSpans": len(expression_occurrences), "ownedLexicalComponents": len(covered), "reassignedDraftWordUses": len(moved), "suppressedExistingWordUses": len(covered)-len(moved), "remainingDirectDraftSourceUses": len(expressions["remainingDirectDraftOccurrences"]), "remainingDirectDraftIdentityGroups": word_counts["remainingDirectDraftIdentityGroups"]-len(expressions["banks"]), "pendingOriginalPhraseSpans": len(composed["phrases"]),
        }
        for data, counts, progress_file, review_key in [
            (words, word_counts, "whole-work-resolved-word-progress-47.json", "wholeWorkResolvedWords"),
            (expressions, expression_counts, "whole-work-resolved-expression-progress-48.json", "wholeWorkResolvedExpressions"),
        ]:
            small = json.loads(read_bytes(f"{CANDIDATE}/{progress_file}"))
            if any(counts != value for value in [data["summary"], small["summary"], dossier["review"][review_key]["summary"]]) or small["candidateReleaseReady"] is not False or small["appliedScopePlans"] != 0 or small["nextAction"] != dossier["review"][review_key]["nextAction"]:
                raise ValueError("Resolved package independent counts, progress or status changed")
            for name, fingerprint in small["evidenceSha256"].items():
                if digest(read_bytes(f"{CANDIDATE}/{name}")) != fingerprint:
                    raise ValueError("Resolved package progress evidence changed")
            progress[review_key] = {"status": small["status"], **counts, "nextAction": small["nextAction"], "candidateReleaseReady": False}
    if "whole-work-construction-expression-progress-50.json" in evidence:
        progress.update(continuation_package_summary(read_bytes, dossier, shared))
    if "whole-work-family-construction-progress-52.json" in evidence:
        progress.update(family_package_summary(read_bytes, dossier, shared))
    if "whole-work-next-construction-progress-53.json" in evidence:
        progress.update(next_construction_summary(read_bytes, dossier))
    if "whole-work-source-word-progress-55.json" in evidence:
        progress.update(source_packages_55_summary(read_bytes, dossier, shared))
    if "whole-work-source-word-progress-57.json" in evidence:
        progress.update(source_packages_57_summary(read_bytes, dossier))
    if "whole-work-mixed-de-progress-58.json" in evidence:
        progress.update(source_packages_58_summary(read_bytes, dossier))
    if "whole-work-source-word-progress-59.json" in evidence:
        progress.update(source_packages_59_summary(read_bytes, dossier))
    if "whole-work-source-word-progress-60.json" in evidence:
        progress.update(source_packages_60_summary(read_bytes, dossier))
    if "whole-work-source-word-progress-61.json" in evidence:
        progress.update(source_packages_61_summary(read_bytes, dossier))
    if "whole-work-source-word-progress-62.json" in evidence:
        progress.update(source_packages_62_summary(read_bytes, dossier))
    if "whole-work-source-word-progress-63.json" in evidence:
        progress.update(source_packages_63_summary(read_bytes, dossier))
    if "whole-work-source-word-progress-64.json" in evidence:
        progress.update(source_packages_64_summary(read_bytes, dossier))
    if "whole-work-original-phrase-progress-66.json" in evidence:
        progress.update(held_and_original_phrases_summary(read_bytes, dossier))
    if "whole-work-original-phrase-progress-67.json" in evidence:
        progress.update(original_phrase_continuation_summary(read_bytes, dossier))
    progress.update(complete_catalog_summary(read_bytes, dossier))
    progress.update(cross_work_transaction_summary(read_bytes, dossier))
    progress.update(import_acceptance_summary(read_bytes, dossier))
    progress.update(final_release_summary(read_bytes, dossier))
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
