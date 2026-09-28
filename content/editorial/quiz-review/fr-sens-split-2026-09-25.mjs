export default {
  "version": 1,
  "id": "fr-sens-judgment-direction-split-2026-09-25",
  "snapshot": "fr-sens-split-2026-09-25-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_zola_sens_sens:sns_zola_sens_direction",
      "occurrenceIds": [
        "occ_zola_62381dd3879fdb86c714883f"
      ],
      "reason": "« dans le sens désiré » describes the desired direction of the conclusion and retains the direction sense.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_sens_sens:sns_zola_sens_direction",
      "occurrenceIds": [
        "occ_cendrillon_987c1a0c6b227d97f009c90d"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_sens",
          "headword": "sens",
          "partOfSpeech": "noun"
        },
        "surface": {
          "id": "srf_zola_sens_sens",
          "lemmaId": "lem_zola_sens",
          "form": "sens",
          "normalized": "sens"
        },
        "sense": {
          "id": "sns_fr_sens_judgment",
          "lemmaId": "lem_zola_sens",
          "gloss": "good sense; sound judgment",
          "definition": "Faculté de juger raisonnablement, notamment dans « du bon sens »."
        }
      },
      "reason": "« du bon sens » in Cendrillon’s second moral means good judgment, not a physical or procedural direction.",
      "questions": [
        {
          "context": "De la naissance, du bon sens, et d’autres semblables talens.",
          "choices": "good sense; sound judgment|physical direction|hearing|meaning of a word"
        },
        {
          "context": "De la naissance, du bon _____, et d’autres semblables talens.",
          "choices": "sens|courage|esprit|talent"
        },
        {
          "context": "D’avoir de l’esprit, du courage, de la naissance, du bon sens, et d’autres semblables talens.",
          "prompt": "Quel nom désigne ici le jugement raisonnable ?",
          "choices": "sens|esprit|courage|talens"
        }
      ]
    }
  ]
};
