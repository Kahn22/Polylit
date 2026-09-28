export default {
  "version": 1,
  "id": "fr-haut-noun-adverb-split-2026-09-25",
  "snapshot": "fr-haut-split-2026-09-25-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_zola_haut_haut_adverb:sns_zola_haut_aloud",
      "occurrenceIds": [
        "occ_parure_88e77d5a8eb23e9aab33cd6a",
        "occ_zola_1bf7aed9dd5325293170715b"
      ],
      "reason": "« parlait haut » and « affirmer bien haut » use the adverb describing loud or public speech.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_haut_haut_adverb:sns_zola_haut_aloud",
      "occurrenceIds": [
        "occ_cendrillon_59d84ad801dcf2315455ba0e"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_haut_noun",
          "headword": "haut",
          "partOfSpeech": "noun"
        },
        "surface": {
          "id": "srf_fr_haut_noun",
          "lemmaId": "lem_fr_haut_noun",
          "form": "haut",
          "normalized": "haut"
        },
        "sense": {
          "id": "sns_fr_haut_top",
          "lemmaId": "lem_fr_haut_noun",
          "gloss": "top; upper part",
          "definition": "Partie supérieure d’un lieu ou d’un objet, notamment « au haut de la maison »."
        }
      },
      "reason": "« au haut de la maison » names the top of the house, so this occurrence is a noun and cannot share the adverb study meaning.",
      "questions": [
        {
          "context": "Elle couchoit tout au haut de la maison, dans un grenier.",
          "choices": "top; upper part|basement|entrance|courtyard"
        },
        {
          "context": "Elle couchoit tout au _____ de la maison, dans un grenier.",
          "choices": "haut|centre|seuil|pied"
        },
        {
          "context": "Elle couchoit tout au haut de la maison, dans un grenier, sur une méchante paillasse.",
          "prompt": "Quel nom désigne la partie supérieure de la maison ?",
          "choices": "haut|maison|grenier|paillasse"
        }
      ]
    }
  ]
};
