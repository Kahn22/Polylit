export default {
  "version": 1,
  "id": "fr-triomphe-noun-verb-split-2026-09-25",
  "snapshot": "fr-triomphe-split-2026-09-25-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_zola_triomphe_triomphe:sns_zola_triomphe_primary",
      "occurrenceIds": [
        "occ_parure_fe2ac8c0315c730b94a9372f",
        "occ_zola_82dfc9bec4f359dce9a41526",
        "occ_zola_8c8c5c24c154e79e26a3cbbb"
      ],
      "reason": "Three occurrences are nouns: the solemn triumph of the Exposition, the hoped-for triumph of justice, and Mathilde’s triumph of beauty. The existing noun meaning and three questions remain valid.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_triomphe_triomphe:sns_zola_triomphe_primary",
      "occurrenceIds": [
        "occ_zola_2a42e5aea6d2d3026d27d082"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_triompher_verb",
          "headword": "triompher",
          "partOfSpeech": "verb"
        },
        "surface": {
          "id": "srf_fr_triomphe_triompher_verb",
          "lemmaId": "lem_fr_triompher_verb",
          "form": "triomphe",
          "normalized": "triomphe"
        },
        "sense": {
          "id": "sns_fr_triompher_prevail",
          "lemmaId": "lem_fr_triompher_verb",
          "gloss": "to triumph; prevail",
          "definition": "L’emporter, obtenir le dessus, notamment dans « la fripouille qui triomphe »."
        }
      },
      "reason": "« la fripouille qui triomphe insolemment » is a finite verb, not the noun triomphe. Give this occurrence its own verb identity, retain its occurrence ID, and start any new mastery only on viewing the unit.",
      "questions": [
        {
          "context": "Voilà la fripouille qui triomphe insolemment dans la défaite du droit.",
          "choices": "prevails; triumphs|withdraws|hesitates|forgets"
        },
        {
          "context": "Au milieu de la défaite du droit, voilà la fripouille qui _____ insolemment.",
          "choices": "triomphe|recule|hésite|tombe"
        },
        {
          "context": "Voilà la fripouille qui triomphe insolemment dans la défaite du droit et de la simple probité.",
          "prompt": "Quel verbe indique que la fripouille l’emporte ?",
          "choices": "triomphe|fripouille|défaite|droit"
        }
      ]
    }
  ]
};
