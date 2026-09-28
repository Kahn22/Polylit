# Text source audit — 22 September 2026, revision 3

All 11 works have updated source dossiers. Historical witnesses have been identified for every work, their complete declared literary scope has been visually reviewed, and **all 11 source dossiers are verified**. Verification concerns the selected witness and declared transformations, not an assertion that a later edition is the first publication.

The dossiers preserve 79 scan images, source transcriptions, author-date evidence, territorial economic-rights assessments, precise variant logs, and prior dossier/canonical versions. The three confirmed correction sets were applied atomically in publication batch `text-2026-09-22-01`, with exact before/after records and no progress transfers.

| Work | Selected historical witness | Result |
| --- | --- | --- |
| La Cigale et la Fourmi | Bernardin-Béchet, Paris, 1874, pp. 29–30 | Verified. Explicit oût → août modernization and existing verse reflow recorded. |
| Le Corbeau et le Renard | Same edition, pp. 30–31 | Verified against the newly adopted witness. Original legacy acquisition remains unknown; no retrospective acquisition claim made. |
| Le Lièvre et la Tortue | Same edition, pp. 188–190 | Verified. Printed **près** restored and linked to the existing *près* identity. |
| Le Lion et le Rat | Same edition, pp. 74–75 | Verified. Complete fable body; the following La Colombe et la Fourmi is outside scope. |
| Le Loup et l’Agneau | Same edition, pp. 41–43 | Verified. The printed page says **survient**, matching Polylit. The online transcription’s **survint** is the error; canonical text should stay unchanged. |
| La Parure | C. Marpon et E. Flammarion, Paris, 1885, pp. 73–93 | Verified. Full narrative including final revelation. Superscript Mme formatting documented. |
| Cendrillon | Claude Barbin, Paris, 1697, pp. 117–148 | Verified, including both moralités. Long-s normalization, ampersand expansion and catalog title spelling documented. |
| J’Accuse…! | L’Aurore, no. 87, 13 January 1898, pp. 1–2; BnF Gallica bpt6k701453s | Verified complete letter body. Six columns on p. 1 and first two columns on p. 2 reviewed. Gutenberg’s 2025 release date is correctly separated from historical publication. Addressee heading, signature and layout exclusions disclosed. |
| La camisa de Margarita | Montaner y Simón, Barcelona, **1894**, Tomo III, pp. 106–108; Internet Archive tradicionesperu03palmgoog | Verified. Historical wording, section labels and omitted attribution restored; legacy 1893 edition claim corrected. |
| El almohadón de pluma | Cooperativa Editorial Buenos Aires, Buenos Aires, 1918, pp. 93–98 | Verified. Historical wording restored and catalog title aligned to the singular printed title. |
| La zorra y las uvas | Armand Colin, Paris, 1902, ed. Miguel de Toro Gómez, pp. 83–84 | Verified. Full 16-line poem and moral. Existing intake’s accent changes and cross-witness cuanto → cuando correction preserved. |

## Completed correction batch

The per-work `reviewed-transformations.json` records historical wording, the prior reading, page, reason and implementation disposition. All prior `requires_correction` entries are now marked `implemented_2026-09-22` and point to publication batch `text-2026-09-22-01`.

1. **Le Lièvre et la Tortue:** restored *près d’être atteint* and reassigned the occurrence to the already reviewed *près* meaning.
2. **La camisa de Margarita:** restored *mayos*, *mecina*, *le dijo*, the Bermejo/Ulloa/Jorge Juan attribution clause, *Item*, *morlacos*, *a saber lo cierto*, and the I/II section labels. The scan-absent online “Fin” remains excluded.
3. **El almohadón de pluma:** restored *con*, *prendidas*, the scan punctuation and doctor’s dialogue including *Pst*, *mirando a aquél*, and the singular catalog title.

Nine restored Spanish lexical identities received reviewed early, middle and advanced questions. All linked spans, exclusions, canonical checksums and text bindings validate. Old semantic records remain available for learner history; no mastery was copied, reset or deleted. A corrected meaning becomes ready for review only after its first actual encounter in the Learning View.

## Bibliographical precision and rights

Edition year and first-publication year are separate fields. Author bibliographies support the 1668 La Fontaine collection and 1697 Perrault collection; Zola’s original newspaper is directly preserved. The [Cervantes Samaniego biography](https://www.cervantesvirtual.com/portales/felix_maria_de_samaniego/autor_biografia/) documents the 1781 initial collection; its [Palma chronology](https://www.cervantesvirtual.com/portales/ricardo_palma/autor_cronologia/) supports the 1883 collection history (the fifth/sixth-series identification is recorded as an inference). A saved secondary bibliography supports La Parure’s 17 February 1884 Le Gaulois appearance, while Quiroga’s author bibliography supports the 1917 collection. First periodical appearances not established by this review remain explicitly unverified. Later-edition evidence alone does not establish a first appearance.

Each dossier contains an author-date snapshot and `rights-assessment.json`. The historical original-language texts are assessed as economically public domain in the US and France as of review. References are the [US Copyright Office’s term guidance](https://www.copyright.gov/circs/circ15a.pdf), [French Article L123-1](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006278937), and [French moral-rights provisions](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069414/). This assessment does not license modern adaptations, translations, site editorial material or illustrations, and is not a worldwide-rights claim. Scan-host reuse terms are distinct from rights in the underlying text.

`npm run sources:check` validates all 11 dossiers, evidence hashes, exact canonical snapshots and learning-unit reconstruction. Scans and source evidence stay out of learner delivery bundles.
