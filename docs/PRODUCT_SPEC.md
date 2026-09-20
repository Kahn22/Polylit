# French Reading Studio — Product Specification

Work on my GitHub repository `Kahn22/french-reading-studio`.

CURRENT OVERRIDE: Canonical sentence/thought units do not store or display English sentence translations. English vocabulary meanings, post-answer meaning feedback, and the English answer choices explicitly required by Levels 1–5 remain part of the product.

CURRENT OVERRIDE: `Corbeau` and `Renard` are learner vocabulary when they retain their ordinary animal meanings despite capitalization as character names. `Monsieur` is always learner vocabulary when present as a title.

CURRENT OVERRIDE — ALL LANGUAGES: In Levels 4–5 noun questions, all answer choices must be nouns that match the target's grammatical number and fit the unchanged sentence grammatically. They must also satisfy any gender, case, or other agreement required by that sentence, wherever those features apply in the language. Exactly one choice must fit the intended meaning; grammatical mismatches must not provide an elimination shortcut. This applies to French, Spanish, and all future Polylit languages with comparable grammar, including existing questions when reviewed and all newly authored questions. Do not invent grammatical distinctions absent from a language. The rule originated in the five-word Spanish review in `content/editorial/user-review-spanish-01.json` and the user subsequently extended it to all applicable languages.

We are building **French Reading Studio**, a personalized French reading and spaced-repetition vocabulary-learning application intended for complete beginners through advanced students.

Émile Zola’s *J’Accuse…!* (*L’Aurore*, 13 January 1898) is structured into 199 ordered sentence/thought units. Its full local publication gate has succeeded, including lexical coverage, prepared quiz bands, expressions, deterministic validation, and learner delivery; it is now learner-visible in the local production bundle.

IMPORTANT: The complete authoritative product specification is contained in this document. Before implementing application behavior, create `docs/PRODUCT_SPEC.md` in the repository and copy ALL requirements from this document into it. Treat it as authoritative for future development. Do not weaken, simplify, silently change, or omit requirements.

PRODUCT AND CONTENT
Users create individual accounts, read authentic French literature, automatically encounter indexed vocabulary, and learn it through spaced repetition. Support complete beginners through advanced learners. Vocabulary mastery belongs to the learner globally, not independently to each story. Same learnable identity encountered elsewhere reuses mastery.

APPLICATION STRUCTURE
The public homepage is the account entry point for sign in, learner registration, verification, and password recovery. After authentication, the learner home page acts as a reading library and organizes every learner-available published text into Available, Reading, and Completed lists. Learners may mark any number of texts as Reading. Only a Reading text can be opened in Learning View. Both Reading and Completed texts make their previously encountered vocabulary and expression quizzes actionable; Completed cards provide text-specific due review without reopening the learner. Learners may move a Reading text back to Available or mark it Completed manually, with no deadline, penalty, or monetary concept. Every shelf change preserves all global mastery and due timestamps. Available texts do not contribute unique items to active review; a shared identity remains actionable if it occurs in another Reading or Completed text. “Read again” moves a Completed text back to Reading. Shelf changes are not encounters. Learning View uses natural passages targeting about 120 French words (normally 80–150), preserves complete indexed thought units, and avoids single-sentence passages unless unavoidable. A vocabulary identity or expression becomes encountered only when the learner scrolls the specific thought unit containing it into view. Opening the work, changing shelf status, viewing the learner home page, or preloading a later passage does not encounter vocabulary from unseen units. Leaving a learning passage automatically begins review of due identities occurring in that passage. The learner may complete the review, skip to the next passage without changing mastery or due state, or return to reread the passage; due items prompt again on the next attempt. Book View is available from both the library and Learning View and presents large book-like blocks without underlining, word interaction, quizzes, encounters, mastery changes, or scheduling changes. It saves only a reading position and can return the learner near the corresponding Learning View passage. The home page shows a prominent button for reviewing all actionable due vocabulary and expressions across Reading and Completed texts. A Reading text view and each Completed card provide text-specific review containing only due identities occurring in that text. General review, text-specific review, and reading review all operate on the same global learner mastery state; they never create text-specific copies of mastery.

First canonical collection: Jean de La Fontaine → Fables → Livre I–XII → individually selected numbered fables. The catalog is curated; it does not require producing every fable. Preserve canonical book and fable order for the works selected. Use complete, unabridged authentic wording in conventional modern typography, preserving historical vocabulary. Do not simplify/rewrite French. Exclude front matter/editorial artifacts from learner text unless specifically part of a fable. Footnotes may become optional explanatory notes, not vocabulary. Proper names excluded. Process selected works deterministically and reuse identities. Current fixtures: Livre I, Fable I, *La Cigale et la Fourmi*; Livre I, Fable II, *Le Corbeau et le Renard*; Livre I, Fable X, *Le Loup et l’Agneau*; Livre II, Fable XI, *Le Lion et le Rat*; and Livre VI, Fable X, *Le Lièvre et la Tortue*. Every fixture must contain the complete authentic text, not a condensed version.

CONTENT WORKFLOW
States: source acquired/structured → processing → learning-ready → published. These are content states, not mastery. Never expose half-processed vocabulary. Pipeline: canonical source → linguistic processing → identities → three prepared quiz bands covering Levels 1–3, 4–5, and 6–8 → mechanical validation → learning-ready → publication. Required quiz bands publish automatically when created in normal processing. Processing should be deterministic/idempotent and avoid duplicates.

Learner delivery uses cacheable incremental payloads: one displayed thought unit and its referenced linguistic records at a time, with the next unit eligible for background prefetch. Review sessions request at most ten due vocabulary identities at a time and prefetch the next batch when three remain. Runtime may order prepared choices but must never generate or rewrite question content.

LINGUISTIC MODEL
Core hierarchy: Lemma → Sense → Surface form → Indexed occurrence.
Learner mastery identity: Surface form + Sense.
Statistical identity: Lemma + Sense.
Same surface+sense across texts shares mastery. Different senses separate. Distinct visible grammatical forms generally have separate surface mastery while inflections remain connected under lemma+sense. Derived lexical words independent. Stable internal IDs; visible numbering is not DB identity. Occurrences reference linguistic IDs, not English strings.

Same spelling/same lexical sense can share mastery despite different contextual grammar analyses. Same spelling with different lexical meaning/lemma is separate (`marche` noun vs verb). POS alone does not split an otherwise identical lexical identity. Capitalization alone does not create identity; sentence-initial caps collapse. Proper names excluded (`orange` lexical vs `Orange` company/place). Capitalized animal character names such as `Corbeau` and `Renard` retain their ordinary lexical meanings and remain learner vocabulary. `Monsieur` is always learner vocabulary when it appears as a title. Inflections such as mange/mangent/mangé remain related but can have separate surface mastery. Derivations such as heureux/heureusement are separate; no speculative word-family relationship.

French lexical sense, not English meaning variation, determines identity. Maintain one consistent primary English meaning per surface+sense where applicable; up to two useful alternatives post-answer. Vocabulary meanings should match grammatical form where appropriate (`chevaux` horses, `mangé` eaten).

REGISTER/HISTORY/REGION
Register alone does not split sense unless meaning changes. Labels may include Neutral, Formal, Informal, Slang, Literary, Dated, Archaic. Historical forms are legitimate learnable French; same meaning may share sense while retaining historical surface, genuinely obsolete different meaning is separate. Literary/historical tenses learnable. Current-usage labels may include General French, France, Québec, Belgium, Switzerland, Senegal, etc., using reliable useful specificity. Regional meaning differences can create senses. Answer-revealing metadata hidden before quiz, available after. Quiz context compatible with intended region/history. No decorative origin tracking.

GENDER/NUMBER
Masculine/feminine forms differing only referent gender share sense but may have separate surface mastery. If gender changes meaning, separate senses (`le livre`/`la livre`). Same visible singular/plural spelling may share surface mastery; changed visible forms separate surface mastery while sharing appropriate stats.

EXPRESSIONS
Genuine lexical expressions have independent mastery plus independently learnable components. Grammatical realizations/pronoun variation may share expression mastery when lexical identity remains. Expressions may be discontinuous; optional modifiers/replaceable slots do not automatically create new identity. Store overlapping expressions only when independently meaningful. Predictable grammar is not automatically an expression. Expressions may have multiple senses and quizzes may use different grammatical realization.

ORTHOGRAPHY/GRAMMAR
Split grammatical elisions into meaningful components while preserving display; lexical compounds excepted. Fused forms du/des/au/aux retain appropriate surface mastery and decomposition links. Hyphenated grammar decomposed; genuine lexical compounds such as peut-être/aujourd'hui may remain whole. Accents can distinguish identity (`a`/`à`). Reflexive lexical verbs may be lexical identities when appropriate. Clitic clusters/negation patterns generally grammar, components independently learnable. Preserve authentic omission patterns; invent no invisible occurrence.

NUMBERS
Preserve source notation; normalize numeric notation to spelled-out French learning identities where appropriate. Arabic/Roman/spelled representations of same cardinal may normalize together. Compound numbers can be one item; components independently learnable when encountered. Cardinals vs ordinals separate. Complete dates/times/specific money/measurements/fractions/percentages generally do not create complete vocabulary stats; lexical components may. `pour cent` may be expression. Notation itself no extra stat.

ABBREVIATIONS
Preserve display but normalize common abbreviations to full lexical identity (`M.` monsieur, `Mme` madame, `Dr` docteur), no separate mastery/stat. Lexicalized acronyms may be own identity; proper-name acronyms excluded. Ambiguous abbreviations require context resolution; uncertainty goes to editorial review.

UNCERTAINTY/OCCURRENCES
Misspellings, uncertain transcription/sense/grammar/proper-name status are flagged, not silently taught. Unresolved occurrence creates no mastery. Repeated occurrences are lightweight links and do not inflate mastery, encounters, stats, or analytics. First useful context can be default; clearer later occurrence may replace. Removing/moving occurrence does not automatically remove linguistic identity or create new vocabulary.

STATISTICS
Learning unit Surface form+Sense; stat unit Lemma+Sense. Inflections collapse statistically; senses separate. Highest current mastery among relevant surfaces determines lemma+sense stat and drops update it immediately. Expressions have independent stats. Words/Expressions/Total can be separate. Grammar constructions/proper nouns do not count; common grammar words do. Historical/variant surfaces sharing lemma+sense collapse appropriately. Derived words separate. No synonym/antonym/cognate/false-friend relationships without future need.

MORPHOLOGY FEEDBACK
Prepared/validated, never runtime invention. Verb post-answer feedback may show relevant tense/mood conjugation with encountered form highlighted; compound tense complete construction; être agreement explicit; reflexive complete forms; affirmative conjugation can accompany negative source; imperative applicable persons; compact non-finite; literary tense note. Context resolves ambiguous forms; uncertainty to review. Adjectives may show gender/number table. Nouns may show related gender forms only when meaning remains related.

GLOBAL QUIZ RULES
Exactly one semantically defensible correct answer; every distractor fails in complete context. Quiz tests exact identity whose mastery it updates. Single words exact surface+sense; expressions expression+sense with appropriate realizations. Levels 1–8 pre-prepared; runtime selects/randomizes but never generates/rewrites. Incidental vocabulary mastery-neutral; only target affects mastery/scheduling. Every quiz self-contained; no source plot/characters/unseen context required. Supporting vocab/grammar no harder than necessary and not primary test. Prefer familiar natural support; clarity/natural French wins. Context isolates sense without defining/giving away. Quiz context genuinely different from source, not superficial substitution. Answer-revealing metadata hidden before. Choice order randomized. Never use another legitimate target meaning as distractor. Distinct senses separately taught. Difficulty comes from intended task/strong distractors, never tricks/ambiguity. Semantic uniqueness is final guardrail.

QUIZ PREPARATION
All L1–8 content prepared before learner use, no runtime AI generation. As identities are established: identify/reuse identity → check existing prepared quiz bands for that exact surface+sense → author only missing complete sets offline → store → publish in normal automatic pipeline. Prepared material belongs to vocabulary identity, not source text. Later same sense reuses sufficient content. The offline authoring step must reject partial pre-existing sets, duplicate quiz IDs, duplicate bands for one identity, and missing bands for reviewed vocabulary. Initially at least one suitable item in each of the three bands (Levels 1–3, 4–5, and 6–8) per learnable surface+sense; levels within a band reuse that prepared item. Reuse accepted; no automatic variants required; admins can add variants. Source sentence never mastery quiz. Supporting vocabulary never counts as encounters and due support words unaffected. Each item belongs only to declared target.

MASTERY
1 New 10 minutes
2 Learning 1 day
3 Developing 3 days
4 Familiar 7 days
5 Strong 21 days
6 Long-term 60 days
7 Retained 6 months
8 Mastery 1 year
Correct scheduled/mastery review advances exactly one. Incorrect drops exactly one; L1 incorrect stays L1. No cumulative lapse penalties, no graduation, guesses count correct, no confidence ratings. Resulting due timestamp authoritative. Intervals are app/config logic and future config changes do not retroactively rewrite scheduled due timestamps unless explicitly designed.

LEVELS 1–3
One prepared simple French sentence shared by Levels 1–3, not source; target bold; ask meaning; four English choices. Simple support and natural/instructive target context. Context isolates sense. Optional additional variants may use closer valid-category distractors that remain clearly wrong. Never alternate legitimate target meaning as distractor. Consistent primary English meaning; form-matched; up to two alternatives post-answer. UI says Meaning, not Gloss. Randomize choices.

LEVELS 4–5
For noun targets in every applicable language, use four grammatically compatible noun choices under the all-languages override above. This requirement is part of offline contextual editorial review; documenting it does not certify existing questions as compliant or replace their review.

One prepared French sentence shared by Levels 4 and 5, target blank, four French choices, no typing, exact target surface. Transfer in unfamiliar context, one defensible completion. Verb distractors may use target exact, same root other conjugation, different-root forms, incompatible root, provided unique answer. Noun/adjective number/agreement patterns appropriate; no fake morphology for invariants. Prepositions/grammar words test function+meaning; determiners gender/number/definiteness/function; pronoun referent explicit; possessive context establishes possessor+noun. Elisions exact with post-answer expansion; fused forms exact with post-answer decomposition. Expressions blank complete realization. Historical exact form, modern equivalent after. Hide regional/historical clues before. Polysemy context isolates sense. Proper names inert only. Numbers/ordinals/abbreviations follow global rules.

LEVELS 6–8
One prepared sentence/short passage shared by Levels 6–8, target not highlighted, French question asks identify target word, four French choices, every choice appears in displayed text, exactly one defensible, no English quiz stage, exact surface+sense.

FEEDBACK
L1–3 every answer explicit meaning feedback: ✓ renard = fox or ✗ renard = fox. L4–8 correct no automatic English; L6–8 French-only by default. Incorrect L4–8 show correct answer + French context first, optional Show meaning with no mastery effect. Answer-revealing metadata only after. No Undo initially.

ACCELERATED REVIEW
Incorrect scheduled review immediately drops one level then creates accelerated review. Accelerated answers never change mastery. Accelerated interval based on one level below new current mastery, capped one week. After accelerated, normal schedule resumes; accelerated format uses new current level. Incorrect accelerated causes no new drop/accelerated chain. Completion becomes new scheduling anchor. Overdue accelerated has no extra penalty. Normal countdown waits while accelerated pending. At most one active obligation.
Miss L8→L7, accel based L6 60d capped 1w; L7→L6 based L5 21d capped 1w; L6→L5 based L4 7d; L5→L4 based L3 3d; L4→L3 based L2 1d; L3→L2 based L1 10m; L2→L1 10m; L1 stays L1 10m.

ENCOUNTERS
Every unique indexed learnable identity starts L1 on first display unless same surface+sense already mastered. No tap. Due 10m later. Reading is natural paragraphs/sections/continuous, indices underlying. Vocabulary is underlined only while mastery is below Level 4; at Levels 4–8 it remains tappable but is visually integrated with ordinary text. Multiple items can share due times. Passive exposure never scheduled review; seeing due word does not clear due; new word starts despite backlog. Approved expressions encounter on display, components independent. Quiz appearances never encounters. No exposure counter; repeats/rereads create no extra mastery/schedule/analytics.

LEARNER STATE
One authoritative row per learner+learnable identity, storing only concrete-needed state such as encountered, mastery level, authoritative due timestamp, active accelerated obligation. Do not store derived is_due/labels/overdue days or speculative first/last seen/exposure analytics. Content describes French; learner state describes learner relationship.

REVIEW MODES
Reading Review: current-text due vocab priority, natural checkpoints, no mid-paragraph interruption, subtle due counter, learner can continue, timestamps unchanged, no unrelated vocab.
Text Vocabulary Review: selected-text due, oldest first.
General Vocabulary Review: all actionable due globally, oldest first.
All share one mastery state; review anywhere satisfies same obligation.

REVIEW SESSION
Freeze membership at session start; newly due next session. Answers save immediately; end anytime; answered count, unanswered remain due. Large backlogs may use frozen batches, size via testing. Show actionable due + progress. Opening question changes nothing; only submitted answer transitions. Prevent double submit. Atomically apply mastery transition/resulting obligation. Stale questions cannot cause second transition. Revalidate frozen item when reached. Unavailable content skipped. One obligation max one transition across devices/retries. Withdrawn item not served; substitute eligible published variant if available, else skip while due preserved. Blocked unavailable excluded from learner actionable count, visible to admin.

MISSING CONTENT
No valid published quiz: mastery/due unchanged, no question, no penalty, actionable again when content returns. Alternate valid variant avoids block. Content failures never learner failures.

PREPARED CONTENT
Fixed during learner use; runtime does not rewrite based on supporting vocabulary. Admin editorial corrections are controlled/future-facing and do not casually rewrite mastery.

ACCOUNTS/AUTH
Self-create learner accounts. Unique email login identifier, random internal user ID; email not permanent DB identity. Verification required. Collect no unnecessary profile data. Auth and mastery separate. Multi-device allowed. Logout current session only. Security screen lists active sessions/devices and revokes individual/all others.
Passwords minimum 15 chars, allow long passphrases/spaces/Unicode, no arbitrary composition rules, reject common/compromised, no periodic forced change, no security questions. Forgot password uses single-use expiring email token; reset does not auto-login and invalidates sessions by default. Change password requires current password/equivalent fresh reauth. Modern salted hashing, preferably Argon2id where supported. Never plaintext/reversible/logged secrets. HTTPS. Server sessions via HttpOnly/Secure/appropriate SameSite cookies; no bearer auth tokens localStorage. Rotate sessions after login/password/role/privilege changes. Rate-limit login/recovery without easy permanent DoS. Enumeration-resistant responses. No hints. Backend creds least privilege.

ROLES/ADMIN SECURITY
Learner < Admin < Owner. Exactly one initial Owner, privately provisioned, never public signup. Only Owner grants/revokes Admin. Admin cannot create Admin/Owner or self-elevate. Privilege separate from learner progress; admin/owner may have learner profile. Server-side auth every privileged action; owner-only separately protected. Role changes rotate/revoke privileged sessions; admin removal immediate while learner state remains.
Admin/Owner MFA required, prefer passkeys/WebAuthn/hardware keys. Learner MFA optional initially. Admin mode fresh privilege elevation, shorter expiry. Promotion requires fresh Owner auth + phishing-resistant MFA. Owner should have ≥2 independent passkeys/security keys + single-use hashed recovery codes shown once. Admin/Owner recovery stronger than email-only. Minimal audit log for high-impact events. Content admins need no learner emails/mastery by default. Owner account management only minimum email/status/role/security state. Never expose secrets.
Account states small: Active, Unverified, Disabled; Deletion pending only if concrete workflow. Deletion eventually removes auth+learner state, preserves shared content.

ADMIN CONTENT
Published edits: Published → Draft replacement → Publish; old published stays learner-facing during draft. No permanent version history initially; current published + necessary current draft. Admin can unpublish without delete; dedicated Unpublished list; Draft distinct. Automatic initial questions publish immediately; manual extras start draft, preview/simulate/test, explicit publish.
Creating extra variant from e.g. hibou·L4 inherits target/sense/type/level, not wording/choices. Current unchanged. Multiple published variants allowed; publishing alternative does not unpublish old. One learner obligation regardless variants. Runtime random eligible variant; no seen/rotation history; repeats okay. One unpublish doesn't block if another eligible.
Publishing mechanically validates required fields, correct answer, target identity, level, structure. Mechanical failure blocks. Semantic correctness editorial under global rules. Admin filters/search: level, expression, unpublished, blocked, source, target, lemma, meaning. Avoid clutter.
Admin simulation uses production scheduling non-destructively, showing target, result, before→after mastery, previous/new due, scheduled/accelerated details, plain-language why. Can simulate levels/outcomes/overdue. Draft preview uses real learner renderer plus unmistakable diagnostics. Learner never sees raw diagnostics. Persistent Admin indicator; mode switch doesn't corrupt learner session.

CORRECTIONS/SOURCE INTEGRITY
Content errors never learner penalties. Prefer correct/reassign/unpublish/retire over delete. Identity with dependent learner state cannot hard-delete until safely resolved. No silent mastery transfer. If erroneous identity maps to correct existing identity, reassign content but do not auto-transfer mastery; legitimate correct mastery remains. If erroneous identity was learner's only encounter and corrected identity absent, transfer encounter where appropriate but not earned mastery; corrected starts L1 with appropriate due. Wrong-sense editorial errors retire erroneous state safely and establish corrected sense similarly. Removing source never erases legitimate shared mastery. Invalid references become unavailable, not learner failures. Smallest correction unit; show impact before destructive correction.
Canonical source one authoritative record. Once learner-facing, immutable except explicit correction. Display formatting separate; typography/paragraph changes don't create source/vocab identities. Sentence/thought stable internal IDs, visible numbering regenerable. Punctuation reading-only for mastery. Reprocess affected region where practical. Removing paragraph removes occurrence links, not shared identities/quizzes/mastery. Moving paragraph no new vocab.

DATA MODEL SIMPLICITY
Store only data with clear product job; avoid duplicated/derivable/speculative/analytics-only fields. One learner-state row per learner+identity. Shared linguistic/quiz content once. Occurrences lightweight links. Quiz references target identity. Mastery numeric 1–8; labels app logic. Review queues generated, not permanent. Session membership temporary/frozen. Store active obligation only as needed, not unnecessary due-history chain. Review mode not mastery state. Text membership derived occurrences. Counts/dashboards query-derived. IDs hidden learner UI, admin troubleshooting only. No speculative analytics.

IMPLEMENTATION AUTHORITY
Make low-risk reversible engineering decisions independently. Do not reopen settled requirements. Stop and ask before materially changing learning philosophy, mastery behavior, linguistic identity, significant learner UX, privacy, security, paid infrastructure, hosting/vendor commitment, or difficult-to-reverse architecture. Do not weaken requirements for implementation convenience.

FIRST IMPLEMENTATION TASK
After creating `docs/PRODUCT_SPEC.md`:
1. Inspect repository.
2. Establish production-quality project structure.
3. Create/update README.
4. Implement production content representation and validation foundation.
5. Keep content, learner state, auth/authorization, runtime UI separated.
6. Use two reference fables as pipeline fixtures.
7. Add automated tests for important model/validation invariants.
8. Run relevant tests/checks.
Do NOT implement every feature in one pass. First milestone is a trustworthy content-pipeline foundation without boxing in later mastery/auth/admin systems.
Do not choose paid backend, hosting provider, auth vendor, database service, or significant infrastructure commitment without asking me.
At completion report files/components changed, implementation decisions, tests/results, genuinely unresolved issues, and recommended next milestone.
The repository specification must remain authoritative for subsequent Work sessions.
