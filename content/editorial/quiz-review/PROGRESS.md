# Quiz review: review complete

French: 2990 active vocabulary identities; 0 lexical holds; 9087/9087 active questions have exact-version approvals, including 117 expression questions. Spanish: 0 pending vocabulary identities, 0 lexical holds; 2949/2949 questions currently approved. Queue processing and exact-version approvals are separate counts.

Read every question against its meaning and context. Mechanical validation is not language review. Preserve correct questions and the five exact user-approved Spanish sets in content/editorial/user-review-spanish-01.json. Record corrections in atomic editorial ledgers. New meanings preserve old history and start fresh only when encountered in Learning View. Do not change canonical text or spans.

Save and persist a recoverable ZIP at most every 100 reviewed vocabulary identities; smaller checkpoints are allowed. Await every publication mutation to completion before running another command that writes files. Do not publish, deploy, commit or push.

After all quiz review, run npm run check and report any remaining non-quiz editorial gates honestly. Quiz completion does not imply vocabulary or annotation approval.
