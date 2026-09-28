export default {
  "version": 1,
  "id": "fr-tour-lieu-split-2026-09-25",
  "snapshot": "fr-tour-lieu-split-2026-09-25-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_zola_tour_tour:sns_zola_tour_turn",
      "occurrenceIds": [
        "occ_zola_53570a0cce8742e37347d297"
      ],
      "reason": "In « faire un tour aux Champs-Élysées », tour means a walk. The other occurrence, « à son tour », retains the established turn sense.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_tour_tour:sns_zola_tour_turn",
      "occurrenceIds": [
        "occ_parure_1026152b866014ca721da6d3"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_tour",
          "headword": "tour",
          "partOfSpeech": "noun"
        },
        "surface": {
          "id": "srf_zola_tour_tour",
          "lemmaId": "lem_zola_tour",
          "form": "tour",
          "normalized": "tour"
        },
        "sense": {
          "id": "sns_fr_tour_stroll",
          "lemmaId": "lem_zola_tour",
          "gloss": "walk; stroll",
          "definition": "Promenade, notamment dans l’expression « faire un tour »."
        }
      },
      "reason": "In « faire un tour aux Champs-Élysées », tour means a walk. The other occurrence, « à son tour », retains the established turn sense.",
      "questions": [
        {
          "context": "Elle était allée faire un tour aux Champs-Élysées pour se délasser.",
          "choices": "walk; stroll|argument|meal|purchase"
        },
        {
          "context": "Elle était allée faire un _____ aux Champs-Élysées pour se délasser.",
          "choices": "tour|discours|repas|cadeau"
        },
        {
          "context": "Un dimanche, elle était allée faire un tour aux Champs-Élysées pour se délasser des besognes de la semaine.",
          "prompt": "Quel mot désigne ici une promenade ?",
          "choices": "tour|dimanche|semaine|besognes"
        }
      ]
    },
    {
      "from": "srf_zola_lieu_avoir_lieu:sns_zola_avoir_lieu_happen",
      "occurrenceIds": [
        "occ_zola_2ace0428e660bd32ab698545",
        "occ_zola_8f6b48c11cc703f3077845df",
        "occ_zola_a75e87955d848f3ef9783639",
        "occ_zola_c2b7f2f2e338521702ddc790",
        "occ_zola_e6334037b8daa06976792a3e"
      ],
      "reason": "« Au lieu d’être ravie » expresses substitution, not an event taking place. The five occurrences of « avoir lieu » retain the established event sense.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_lieu_avoir_lieu:sns_zola_avoir_lieu_happen",
      "occurrenceIds": [
        "occ_parure_b73bb190783193f01e8fd68b"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_au_lieu_de",
          "headword": "au lieu de",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_lieu_au_lieu_de",
          "lemmaId": "lem_fr_au_lieu_de",
          "form": "lieu",
          "normalized": "lieu"
        },
        "sense": {
          "id": "sns_fr_au_lieu_de_instead",
          "lemmaId": "lem_fr_au_lieu_de",
          "gloss": "instead of",
          "definition": "À la place de, dans l’expression « au lieu de »."
        }
      },
      "reason": "« Au lieu d’être ravie » expresses substitution, not an event taking place. The five occurrences of « avoir lieu » retain the established event sense.",
      "questions": [
        {
          "context": "Au lieu d’être ravie, elle jeta avec dépit l’invitation sur la table.",
          "choices": "instead of|because of|in spite of|at the moment of"
        },
        {
          "context": "Au _____ d’être ravie, elle jeta avec dépit l’invitation sur la table.",
          "choices": "lieu|moment|temps|point"
        },
        {
          "context": "Au lieu d’être ravie, comme l’espérait son mari, elle jeta avec dépit l’invitation sur la table.",
          "prompt": "Quel mot appartient à l’expression signifiant « à la place de » ?",
          "choices": "lieu|mari|invitation|table"
        }
      ]
    }
  ]
};
