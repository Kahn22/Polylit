# La zorra y las uvas — canonical intake

Author: Félix María Samaniego (1745–1801). Origin: 🇪🇸 Spain.
Work: Fábulas, Book IV, Fable VI. Complete poem: 16 lines, 103 word tokens.

## Source and rights

Base edition: *Fábulas*, edited by Miguel de Toro Gómez, Paris: Armand Colin, 1902, pp. 83–84. The historical poem is public domain. This intake does not reproduce a modern adaptation, illustrations, introductory essays, or editorial footnotes in the learner text.

Sources checked on 21 September 2026:

- [Project Gutenberg transcription, ebook 55206](https://www.gutenberg.org/cache/epub/55206/pg55206-images.html), Book IV, Fable VI.
- [1902 historical volume](https://archive.org/details/fbulas00sama). Saved page images were visually inspected. Image endpoints: `https://archive.org/download/fbulas00sama/page/n84.jpg` (printed p. 83) and `https://archive.org/download/fbulas00sama/page/n85.jpg` (printed p. 84).
- [1882 text, second page](https://es.wikisource.org/wiki/P%C3%A1gina:F%C3%A1bulas_de_Samaniego_(1882).djvu/128), checked against its scan. This supports **cuando** in line 11. That edition was not selected as the base because its moral prints “te muestra” and “te se”.

`diplomatic.txt` records the words and punctuation of the 1902 poem, omitting indentation, footnote superscripts, page headings, and spacing before punctuation. `canonical.txt` applies only these explicit changes:

- Three prepositions `á` → `a`.
- `vió` → `vio`, `fué` → `fue`, and imperative `dí` → `di`.
- Line 11: printed `cuanto` → **cuando**, supported by the 1882 edition and the Gutenberg transcription. This is a documented correction of a printing error, not a rewrite.

The editorial choice **se te**, present in the selected 1902 edition, is retained. Enclitic forms **quédase** and **causábale**, the word **probaduras**, capitalized Zorra, the verse layout, and the full moral are retained.

## Linguistic and quiz review

Four thought units preserve the four stanzas and make one natural 103-word learning section. All 102 non-name tokens have exact surface-and-sense spans; Fabio is explicitly excluded as a proper name. There are 80 vocabulary identities: 34 reused, 46 new. Two independently learnable expressions, **en ayunas** and **de fijo**, have their own mastery keys.

There are 246 applicable questions: 102 existing approved questions reused unchanged, 138 newly authored vocabulary questions, and 6 newly authored expression questions. All three bands use different, original contexts. Authoring is offline only. Level 4–5 noun choices match number and required gender; word meaning distinguishes the answer. The original scenes are not reused as quiz contexts.

Particular semantic decisions:

- **voz** is a report, not the sound of a voice.
- **parra** is an actual grapevine, separate from its use in *subirse a la parra*.
- **iba** accompanies a gerund, not the future construction *iba a*.
- **mil** is hyperbolic; **verdes** describes leaf color; **maduras** describes fruit ripeness.
- **las** before *uvas* is an article; **las** before *quiero* is a direct-object pronoun.
- First **que** introduces a clause; second **que** is a relative pronoun referring to *fruto*.
- **anduvo en probaduras** means being occupied in attempts; **vio** means recognizing the impossibility.
- **te muestres** and **se frustra** preserve their pronominal interpretation.

Existing identities and quizzes are not replaced, and no mastery is transferred. The additive intake ledger lets the baseline regression test account for the new work while retaining exact checks of every prior record. Changed lexical approvals cover the reviewed new occurrences and retain the previously approved records unchanged.

`candidate-review.json` records the exact subjects reviewed; `approval.json` binds approval to their SHA-256 digest. Running `node scripts/prepare-samaniego.mjs` prepares a candidate; `--apply` requires that exact approval and makes an atomic source replacement with a recoverable previous-source backup. It refuses to re-add an already adopted work. Future edits use the normal reviewed update workflow.

Scans and editorial files remain source-only; they are not copied into learner delivery packages.
