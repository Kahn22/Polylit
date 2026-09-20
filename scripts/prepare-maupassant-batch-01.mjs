import { loadPublication } from "../dist/publication/repository.js";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { laParureCanonicalText, laParureThoughtUnits } from "../dist/content/fixtures/maupassant.js";

const manifest = JSON.parse(readFileSync(new URL("../content/review/wrk_maupassant_la_parure.manifest.json", import.meta.url)));
const rawExisting = loadPublication().bundle;
const existing = {
  ...rawExisting,
  lemmas: rawExisting.lemmas.filter((item) => !/^(?:lem)_(?:parure|cendrillon)_/.test(item.id)),
  senses: rawExisting.senses.filter((item) => !/^(?:sns)_(?:parure|cendrillon)_/.test(item.id)),
  surfaceForms: rawExisting.surfaceForms.filter((item) => !/^(?:srf)_(?:parure|cendrillon)_/.test(item.id)),
  quizItems: rawExisting.quizItems.filter((item) => !/^(?:qiz)_(?:parure|cendrillon)_/.test(item.id)),
};
const batch = manifest.candidates.slice(0, 500);

const rows = `
jolies|joli|adjective|joli_pretty|pretty|agréable à regarder
charmantes|charmant|adjective|charmant_delightful|charming; delightful|qui plaît par son agrément
filles|fille|noun|fille_girl|girls; daughters|jeunes personnes de sexe féminin ou enfants féminins d’une famille
nées|naître|verb|naitre_born|born|venues au monde
destin|destin|noun|destin_fate|fate; destiny|suite d’événements considérée comme fixant le cours d’une vie
employés|employé|noun|employe_worker|employees; clerks|personnes salariées qui travaillent pour une administration ou une entreprise
dot|dot|noun|dot_dowry|dowry|biens apportés lors d’un mariage
espérances|espérance|noun|esperance_prospect|hopes; prospects|attentes confiantes concernant l’avenir
comprise|comprendre|verb|comprendre_understand|understood|saisie dans ses pensées ou ses sentiments
aimée|aimer|verb|aimer_love|loved|objet d’affection ou d’amour
épousée|épouser|verb|epouser_marry|married|unie à quelqu’un par le mariage
riche|riche|adjective|riche_wealthy|rich; wealthy|qui possède beaucoup de biens ou d’argent
distingué|distingué|adjective|distingue_refined|distinguished; refined|qui se remarque par son élégance ou sa position sociale
laissa|laisser|verb|laisser_allow|let; allowed|permit qu’une action se fasse
marier|marier|verb|marier_marry|to marry|unir par le mariage
petit|petit|adjective|petit_small|small; minor|de dimensions ou d’importance réduites
commis|commis|noun|commis_clerk|clerk; junior employee|employé subalterne d’une administration ou d’un commerce
instruction|instruction|noun|instruction_education|education|enseignement et formation intellectuelle
pouvant|pouvoir|verb|pouvoir_ability|being able to|ayant la capacité ou la possibilité de faire quelque chose
parée|parer|verb|parer_adorn|adorned; dressed up|ornée de vêtements ou d’accessoires élégants
malheureuse|malheureux|adjective|malheureux_unhappy|unhappy|qui éprouve de la tristesse ou souffre d’une situation pénible
déclassée|déclassé|adjective|declasse_lowered_status|fallen in social status|placée au-dessous de la condition sociale à laquelle elle se croit destinée
caste|caste|noun|caste_social_class|caste; social class|groupe social fermé ou rang considéré comme héréditaire
race|race|noun|race_lineage|race; lineage|groupe humain ou lignée envisagé selon une origine commune
beauté|beauté|noun|beaute_beauty|beauty|qualité de ce qui plaît par son apparence
grâce|grâce|noun|grace_elegance|grace; elegance|élégance naturelle des mouvements ou de l’attitude
charme|charme|noun|charme_appeal|charm; appeal|qualité attirante qui séduit
servant|servir|verb|servir_function|serving; acting as|remplissant une fonction déterminée
naissance|naissance|noun|naissance_birth|birth; social origin|origine familiale ou venue au monde
finesse|finesse|noun|finesse_subtlety|subtlety; refinement|délicatesse de jugement ou de comportement
native|natif|adjective|natif_inborn|inborn; innate|présent naturellement dès la naissance
instinct|instinct|noun|instinct_intuition|instinct|tendance naturelle qui guide sans raisonnement conscient
élégance|élégance|noun|elegance_refinement|elegance|qualité de ce qui est harmonieux et raffiné
souplesse|souplesse|noun|souplesse_flexibility|flexibility; adaptability|aptitude à s’adapter avec aisance
hiérarchie|hiérarchie|noun|hierarchie_ranking|hierarchy; ranking|classement de personnes ou de groupes selon leur rang
égales|égal|adjective|egal_equal|equal|qui ont la même valeur ou le même rang
dames|dame|noun|dame_lady|ladies|femmes considérées avec respect ou selon leur rang social
souffrait|souffrir|verb|souffrir_suffer|was suffering|éprouvait une douleur physique ou morale
cesse|cesse|noun|cesse_stopping|cessation; stop|arrêt d’une action, notamment dans l’expression sans cesse
sentant|sentir|verb|sentir_feel|feeling|éprouvant intérieurement une impression ou un état
délicatesses|délicatesse|noun|delicatesse_refinement|refinements; delicate pleasures|choses raffinées et agréables au goût ou aux sens
luxes|luxe|noun|luxe_luxury|luxuries|biens ou habitudes coûteux dépassant les besoins ordinaires
pauvreté|pauvreté|noun|pauvrete_poverty|poverty|état d’une personne qui manque de ressources
logement|logement|noun|logement_dwelling|home; dwelling|lieu où une personne habite
misère|misère|noun|misere_wretchedness|misery; squalor|état de grande pauvreté ou de dénuement pénible
murs|mur|noun|mur_wall|walls|parois verticales qui entourent ou divisent un bâtiment
usure|usure|noun|usure_wear|wear; deterioration|dégradation progressive causée par l’usage
sièges|siège|noun|siege_seat|seats; chairs|meubles faits pour s’asseoir
laideur|laideur|noun|laideur_ugliness|ugliness|caractère de ce qui est désagréable à regarder
étoffes|étoffe|noun|etoffe_fabric|fabrics; cloth|matières textiles servant à fabriquer des vêtements ou des tentures
aperçue|apercevoir|verb|apercevoir_notice|noticed|remarquée ou perçue brièvement
torturaient|torturer|verb|torturer_torment|tormented|faisaient souffrir intensément
indignaient|indigner|verb|indigner_outrage|outraged|provoquaient une vive révolte morale
petite|petit|adjective|petit_small|small; young|de petite taille ou jeune selon le contexte
bretonne|Bretonne|noun|bretonne_woman|Breton woman|femme originaire de Bretagne
humble|humble|adjective|humble_modest|humble; modest|de condition modeste et sans prétention
ménage|ménage|noun|menage_housework|housework; household work|ensemble des travaux nécessaires à l’entretien d’un logement
éveillait|éveiller|verb|eveiller_arouse|awakened; aroused|faisait naître un sentiment ou une pensée
regrets|regret|noun|regret_sorrow|regrets; longings|tristesses causées par une perte ou un désir non réalisé
désolés|désolé|adjective|desole_desolate|desolate; sorrowful|profondément tristes
rêves|rêve|noun|reve_dream|dreams|images ou projets imaginés avec désir
éperdus|éperdu|adjective|eperdu_overwhelming|wild; overwhelming|si intenses qu’ils font perdre la mesure
songeait|songer|verb|songer_think|was dreaming of; thinking about|se représentait quelque chose avec insistance ou rêverie
antichambres|antichambre|noun|antichambre_anteroom|anterooms|pièces situées avant une salle principale
muettes|muet|adjective|muet_silent|silent|où aucun bruit ne se fait entendre
capitonnées|capitonner|verb|capitonner_pad|padded; upholstered|garnies d’un rembourrage recouvert de tissu
tentures|tenture|noun|tenture_wall_hanging|wall hangings; drapes|grandes pièces de tissu décorant un mur
orientales|oriental|adjective|oriental_eastern|Oriental; Eastern|qui vient de l’Orient ou en évoque le style
éclairées|éclairer|verb|eclairer_light|lit; illuminated|rendues visibles par une source de lumière
hautes|haut|adjective|haut_tall|tall; high|qui ont une grande dimension verticale
torchères|torchère|noun|torchere_lamp|torch lamps; tall lamps|grands supports décoratifs portant une lumière
bronze|bronze|noun|bronze_metal|bronze|alliage métallique de cuivre et d’étain
grands|grand|adjective|grand_large|large; grand|de grande dimension ou importance
valets|valet|noun|valet_servant|valets; servants|domestiques attachés au service d’une maison
culotte|culotte|noun|culotte_breeches|breeches|pantalon court porté autrefois par les hommes
courte|court|adjective|court_short|short|qui a une longueur réduite
larges|large|adjective|large_wide|wide; broad|qui ont une grande largeur
fauteuils|fauteuil|noun|fauteuil_armchair|armchairs|sièges rembourrés munis d’un dossier et de bras
assoupis|assoupi|adjective|assoupi_drowsy|drowsy; dozing|à demi endormis
chaleur|chaleur|noun|chaleur_heat|heat; warmth|température élevée ou sensation produite par elle
lourde|lourd|adjective|lourd_oppressive|heavy; oppressive|difficile à supporter par son intensité
calorifère|calorifère|noun|calorifere_heater|heater; furnace|ancien appareil servant à chauffer un bâtiment
salons|salon|noun|salon_drawing_room|drawing rooms; salons|pièces d’une maison destinées à recevoir
vêtus|vêtir|verb|vetir_clothe|clothed; covered|couverts comme par un vêtement
soie|soie|noun|soie_silk|silk|fibre textile fine produite par le ver à soie
ancienne|ancien|adjective|ancien_old|old; antique|qui existe depuis longtemps ou appartient au passé
meubles|meuble|noun|meuble_furniture|pieces of furniture|objets mobiles qui équipent une pièce
fins|fin|adjective|fin_refined|fine; refined|délicats, élégants ou de grande qualité
bibelots|bibelot|noun|bibelot_ornament|ornaments; knickknacks|petits objets décoratifs
inestimables|inestimable|adjective|inestimable_priceless|priceless|d’une valeur si grande qu’elle ne peut être estimée
coquets|coquet|adjective|coquet_attractive|smart; charming|arrangés avec élégance et goût
parfumés|parfumer|verb|parfumer_scent|perfumed; scented|imprégnés d’une odeur agréable
faits|faire|verb|faire_designed|made; designed|conçus ou adaptés pour un usage
causerie|causerie|noun|causerie_conversation|conversation; chat|conversation familière et agréable
cinq|cinq|numeral|cinq_five|five|nombre entier qui suit quatre
heures|heure|noun|heure_hour|hours; o’clock|unités de temps ou indications d’un moment de la journée
amis|ami|noun|ami_friend|friends|personnes liées par une affection réciproque
intimes|intime|adjective|intime_close|close; intimate|unis par une grande proximité affective
connus|connu|adjective|connu_well_known|well-known|que beaucoup de personnes connaissent
recherchés|recherché|adjective|recherche_sought_after|sought-after|très appréciés et dont la compagnie est désirée
envient|envier|verb|envier_envy|envy|désirent posséder ce qu’une autre personne possède
désirent|désirer|verb|desirer_want|desire; want|souhaitent vivement obtenir quelque chose
attention|attention|noun|attention_notice|attention; notice|intérêt particulier accordé à quelqu’un
asseyait|asseoir|verb|asseoir_sit|was sitting down|prenait place sur un siège
dîner|dîner|verb|diner_eat|to dine; eat dinner|prendre le repas du soir
table|table|noun|table_furniture|table|meuble à plateau sur lequel on pose des objets ou prend un repas
ronde|rond|adjective|rond_round|round|qui a la forme d’un cercle
couverte|couvrir|verb|couvrir_cover|covered|recouverte par quelque chose
nappe|nappe|noun|nappe_tablecloth|tablecloth|pièce de tissu étendue sur une table
jours|jour|noun|jour_day|days|périodes de vingt-quatre heures
face|face|noun|face_front|front; face|côté antérieur ou position directement opposée
découvrait|découvrir|verb|decouvrir_uncover|uncovered; lifted the lid from|retirait ce qui couvrait un objet
soupière|soupière|noun|soupiere_tureen|soup tureen|grand récipient de table servant à présenter la soupe
air|air|noun|air_appearance|air; manner|apparence ou manière d’être
enchanté|enchanté|adjective|enchante_delighted|delighted|rempli de plaisir ou de satisfaction
pot-au-feu|pot-au-feu|noun|pot_au_feu_stew|pot-au-feu; beef stew|plat français de viande et de légumes cuits dans un bouillon
sais|savoir|verb|savoir_know|know|possède une connaissance ou une certitude
meilleur|meilleur|adjective|meilleur_better|better; best|d’une qualité supérieure
dîners|dîner|noun|diner_meal|dinners|repas pris généralement le soir
argenteries|argenterie|noun|argenterie_silverware|silverware|ensemble des objets de table en argent
reluisantes|reluisant|adjective|reluisant_shiny|gleaming; shiny|qui brillent en réfléchissant la lumière
tapisseries|tapisserie|noun|tapisserie_wall_hanging|tapestries|ouvrages textiles décoratifs accrochés aux murs
peuplant|peupler|verb|peupler_fill|filling; populating|occupant un lieu en grand nombre
murailles|muraille|noun|muraille_wall|walls|murs épais ou imposants
personnages|personnage|noun|personnage_figure|figures; characters|personnes représentées dans une œuvre
anciens|ancien|adjective|ancien_old|ancient; old|qui appartiennent à une époque passée
oiseaux|oiseau|noun|oiseau_bird|birds|animaux vertébrés couverts de plumes
étranges|étrange|adjective|etrange_strange|strange; unusual|qui surprennent par leur caractère inhabituel
forêt|forêt|noun|foret_woods|forest|vaste étendue couverte d’arbres
féerie|féerie|noun|feerie_fairyland|fairyland; enchantment|univers merveilleux peuplé d’éléments magiques
plats|plat|noun|plat_dish|dishes; courses|préparations culinaires servies pendant un repas
exquis|exquis|adjective|exquis_delicious|exquisite; delicious|d’une qualité ou d’un goût exceptionnel
servis|servir|verb|servir_present_food|served|présentés aux convives pour être consommés
vaisselles|vaisselle|noun|vaisselle_dishes|dishes; tableware|ensemble des assiettes et récipients utilisés à table
merveilleuses|merveilleux|adjective|merveilleux_wonderful|marvelous; wonderful|qui provoquent une grande admiration
galanteries|galanterie|noun|galanterie_flattery|gallant compliments|paroles aimables et flatteuses adressées avec courtoisie
chuchotées|chuchoter|verb|chuchoter_whisper|whispered|dites à voix très basse
écoutées|écouter|verb|ecouter_listen|listened to|entendues avec une attention volontaire
sourire|sourire|noun|sourire_smile|smile|expression du visage qui marque souvent le plaisir
sphinx|sphinx|noun|sphinx_enigmatic|sphinx|figure au visage énigmatique, symbole d’impassibilité
tout|tout|adverb|tout_en_while|all the while; while|renforce la simultanéité dans la construction tout en suivie d’un gérondif
mangeant|manger|verb|manger_eat|eating|absorbant de la nourriture
rose|rose|adjective|rose_pink|pink|d’une couleur rouge très pâle
truite|truite|noun|truite_fish|trout|poisson d’eau douce apprécié comme aliment
ailes|aile|noun|aile_wing|wings|membres qui permettent aux oiseaux de voler
gélinotte|gélinotte|noun|gelinotte_bird|hazel grouse|oiseau sauvage autrefois servi comme gibier
toilettes|toilette|noun|toilette_attire|outfits; dresses|vêtements et accessoires composant une tenue élégante
bijoux|bijou|noun|bijou_jewelry|jewelry|objets précieux portés comme ornements
aimait|aimer|verb|aimer_love|liked; loved|éprouvait de l’affection ou un goût marqué
sentait|sentir|verb|sentir_feel|felt|éprouvait intérieurement une impression
faite|faire|verb|faire_suited|made; suited|destinée ou particulièrement adaptée à une situation
eût|avoir|verb|avoir_subjunctive|had|forme littéraire du subjonctif imparfait du verbe avoir
plaire|plaire|verb|plaire_please|to please; appeal|produire une impression agréable ou séduisante
enviée|envier|verb|envier_be_envied|envied|objet du désir jaloux d’autres personnes
séduisante|séduisant|adjective|seduisant_attractive|attractive; alluring|qui attire et exerce un charme
recherchée|recherché|adjective|recherche_sought_after|sought-after|très appréciée et désirée
amie|ami|noun|ami_friend|female friend|femme liée à une autre personne par l’amitié
camarade|camarade|noun|camarade_companion|schoolmate; companion|personne qui partage une école ou une activité
couvent|couvent|noun|couvent_convent|convent|communauté religieuse et bâtiment où elle vit
revenant|revenir|verb|revenir_return|returning|venant de nouveau au point de départ
pleurait|pleurer|verb|pleurer_cry|was crying|versait des larmes sous l’effet d’une émotion
entiers|entier|adjective|entier_whole|whole; entire|complets du début à la fin
chagrin|chagrin|noun|chagrin_sorrow|sorrow; grief|tristesse profonde causée par une peine
regret|regret|noun|regret_sorrow|regret; longing|tristesse causée par une perte ou un désir non réalisé
désespoir|désespoir|noun|desespoir_despair|despair|perte complète de tout espoir
soir|soir|noun|soir_evening|evening|partie de la journée comprise entre la fin de l’après-midi et la nuit
rentra|rentrer|verb|rentrer_return_home|came home; returned|revint dans son logement ou son lieu habituel
glorieux|glorieux|adjective|glorieux_triumphant|triumphant; proud|qui manifeste une grande fierté liée à un succès
tenant|tenir|verb|tenir_hold|holding|gardant un objet dans sa main
main|main|noun|main_body_part|hand|partie du corps située à l’extrémité du bras
enveloppe|enveloppe|noun|enveloppe_letter|envelope|pochette de papier destinée à contenir une lettre
tiens|tenir|verb|tenir_present|here; take this|forme de tenir employée pour présenter ou donner quelque chose
toi|toi|pronoun|toi_you|you|pronom tonique désignant la personne à qui l’on parle
déchira|déchirer|verb|dechirer_tear|tore open|ouvrit ou sépara brutalement en tirant
vivement|vivement|adverb|vivement_quickly|quickly; eagerly|d’une manière rapide et énergique
tira|tirer|verb|tirer_take_out|took out; pulled|fit sortir quelque chose en le prenant
carte|carte|noun|carte_card|card; invitation card|petit document rigide portant un message ou une invitation
`.trim().split("\n").map((line) => {
  const [normalized, headword, partOfSpeech, senseKey, gloss, definition] = line.split("|");
  return { normalized, headword, partOfSpeech, senseKey, gloss, definition };
});

const specialLemmaIds = {
  instruction: "lem_zola_instruction_noun",
  faite: "lem_faire",
  tout: "lem_tout",
  main: "lem_zola_main",
};

const explicitByNormalized = {
  une: ["srf_une", "sns_un_primary"], un: ["srf_un", "sns_un_primary"], pas: ["srf_pas", "sns_pas_primary"],
  "l’": ["srf_l_elided", "sns_le_primary"], les: ["srf_les", "sns_le_primary"], la: ["srf_la", "sns_le_primary"], le: ["srf_le", "sns_le_primary"],
  mais: ["srf_zola_mais_mais", "sns_zola_mais_but"], point: ["srf_point_adverb", "sns_point_negation"],
  esprit: ["srf_zola_esprit_esprit", "sns_zola_esprit_mind"], autre: ["srf_autre", "sns_autre_adjective"],
  même: ["srf_zola_meme_25c826df8191_meme_adverb", "sns_zola_meme_even"], milieu: ["srf_zola_milieu_milieu", "sns_zola_milieu_middle"],
  bon: ["srf_zola_bon_bon", "sns_zola_bon_good"], "qu’": ["srf_qu_elided", "sns_que_relative"],
};

const explicitByCandidate = Object.fromEntries([
  ...["tok_b798e6af4caac7e8ade9b33d", "tok_19aeea3e8c7ee5d5d56d3866", "tok_574caa7b0d5c6c150a5289b9", "tok_006d8a15addb81c27d5bf828", "tok_080915a65d81675ecf103939"].map((id) => [id, ["srf_des", "sns_des_primary"]]),
  ...["tok_4595ecaee6941320c552277b", "tok_ac4da5857f8a0edb516290dd", "tok_8c9a698d6a1e1227bacf998f", "tok_55e91b5ef3edc7e3d33cbc4b", "tok_4cb90612381adb088e686cf8", "tok_235f66812cf4c156489ac21e", "tok_77514fed4ce152b17dc14ffd"].map((id) => [id, ["srf_zola_des_des_indefinite", "sns_zola_des_indefinite_some"]]),
  ...["tok_6aa840f143519b6650d85c3a", "tok_07c5c4f205a22ce94ce823d8", "tok_eb87ddd78cb99d6d8631e1ea", "tok_8fd51fc9bbdc5732849a4a98"].map((id) => [id, ["srf_en", "sns_en_in"]]),
  ...["tok_b2d4eb840239b31fc69367b0", "tok_babc29842bbd6c5664bf9794", "tok_d8bfc10a486120e82ea4d5b7"].map((id) => [id, ["srf_zola_en_en", "sns_zola_en_gerund"]]),
  ["tok_e8ab285af7e5880218a7b75d", ["srf_en", "sns_en_it"]],
  ...["tok_0ad46fad04032c305dfd9a8c", "tok_dbd9bcd6ba980562b36eef13"].map((id) => [id, ["srf_plus", "sns_zola_plus_degree"]]),
  ["tok_7cbe51b4cf39183a962ccd36", ["srf_plus", "sns_zola_plus_no_longer"]],
  ["tok_eeda0346d933f66a83471c22", ["srf_que", "sns_que_comparative"]],
  ["tok_7ba1bd81714dc62314ed2ba0", ["srf_que", "sns_que_restrictive"]],
]);

const slug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").toLowerCase();
const digest = (value) => createHash("sha256").update(value).digest("hex").slice(0, 10);
const stable = (value) => `${slug(value)}_${digest(value)}`;
const senses = new Map(existing.senses.map((item) => [item.id, item]));
const lemmas = new Map(existing.lemmas.map((item) => [item.id, item]));
const quizIdentitiesByNormalized = new Map();
for (const surface of existing.surfaceForms) {
  const identities = [...new Set(existing.quizItems.filter((quiz) => quiz.surfaceFormId === surface.id).map((quiz) => quiz.senseId))];
  for (const senseId of identities) {
    const values = quizIdentitiesByNormalized.get(surface.normalized) ?? [];
    values.push([surface.id, senseId]);
    quizIdentitiesByNormalized.set(surface.normalized, values);
  }
}

const byNormalized = new Map();
for (const candidate of batch) {
  const values = byNormalized.get(candidate.normalized) ?? [];
  values.push(candidate);
  byNormalized.set(candidate.normalized, values);
}
const rowByNormalized = new Map(rows.map((row) => [row.normalized, row]));
if (rowByNormalized.size !== rows.length) throw new Error("Duplicate normalized form in batch vocabulary rows");

const pools = {
  noun: { english: ["a window", "a notebook", "a garden"], french: ["fenêtre", "cahier", "jardin"] },
  adjective: { english: ["quiet", "narrow", "rapid"], french: ["calme", "étroit", "rapide"] },
  verb: { english: ["to walk", "to close", "to wait"], french: ["marcher", "fermer", "attendre"] },
  adverb: { english: ["outside", "tomorrow", "rarely"], french: ["dehors", "demain", "rarement"] },
  pronoun: { english: ["him", "us", "them"], french: ["lui", "nous", "eux"] },
  numeral: { english: ["two", "seven", "ten"], french: ["deux", "sept", "dix"] },
};

const newLemmas = new Map();
const newSenses = new Map();
const newSurfaces = new Map();
const preparedQuizItems = [];
const decisions = [];

function identityForNew(row) {
  const matchingLemmas = existing.lemmas.filter((lemma) => lemma.headword.toLocaleLowerCase("fr-FR") === row.headword.toLocaleLowerCase("fr-FR") && lemma.partOfSpeech === row.partOfSpeech);
  let lemmaId = specialLemmaIds[row.normalized];
  if (!lemmaId && matchingLemmas.length === 1) lemmaId = matchingLemmas[0].id;
  lemmaId ??= `lem_parure_${stable(`${row.headword}_${row.partOfSpeech}`)}`;
  if (!lemmas.has(lemmaId)) newLemmas.set(lemmaId, { id: lemmaId, headword: row.headword, partOfSpeech: row.partOfSpeech });

  const forceNewSense = Object.hasOwn(specialLemmaIds, row.normalized);
  const existingLemmaSenses = existing.senses.filter((sense) => sense.lemmaId === lemmaId);
  const senseId = !forceNewSense && existingLemmaSenses.length === 1
    ? existingLemmaSenses[0].id
    : `sns_parure_${stable(row.senseKey)}`;
  if (!senses.has(senseId)) newSenses.set(senseId, { id: senseId, lemmaId, gloss: row.gloss, definition: row.definition });

  const matchingSurface = existing.surfaceForms.find((surface) => surface.lemmaId === lemmaId && surface.normalized === row.normalized);
  const surfaceFormId = matchingSurface?.id ?? `srf_parure_${stable(`${row.normalized}_${row.headword}_${row.partOfSpeech}`)}`;
  if (!matchingSurface) newSurfaces.set(surfaceFormId, { id: surfaceFormId, lemmaId, form: byNormalized.get(row.normalized)[0].text, normalized: row.normalized });
  return { lemmaId, senseId, surfaceFormId };
}

for (const [normalized, candidates] of byNormalized) {
  const row = rowByNormalized.get(normalized);
  if (row) {
    const identity = identityForNew(row);
    decisions.push(...candidates.map((candidate) => ({ candidateId: candidate.id, disposition: "vocabulary", ...identity })));
    const pool = pools[row.partOfSpeech] ?? pools.noun;
    const target = candidates[0].text;
    const key = stable(`${normalized}_${row.senseKey}`);
    const frenchChoices = [target, ...pool.french.filter((choice) => choice.toLocaleLowerCase("fr-FR") !== target.toLocaleLowerCase("fr-FR")).slice(0, 3)];
    const englishChoices = [row.gloss, ...pool.english.filter((choice) => choice !== row.gloss).slice(0, 3)];
    preparedQuizItems.push(
      { id: `qiz_parure_${key}_early`, surfaceFormId: identity.surfaceFormId, senseId: identity.senseId, band: "levels_1_3", format: "meaning_choice", contextFrench: `Le professeur emploie « ${target} » pour exprimer cette idée : ${row.definition}.`, targetText: target, prompt: "Meaning", choicesEnglish: englishChoices, correctAnswer: row.gloss },
      { id: `qiz_parure_${key}_intermediate`, surfaceFormId: identity.surfaceFormId, senseId: identity.senseId, band: "levels_4_5", format: "surface_completion", contextFrench: `Le terme précis pour exprimer « ${row.definition} » est _____.`, choicesFrench: frenchChoices, correctAnswer: target },
      { id: `qiz_parure_${key}_advanced`, surfaceFormId: identity.surfaceFormId, senseId: identity.senseId, band: "levels_6_8", format: "target_identification", contextFrench: `Dans cette situation, le mot « ${target} » exprime précisément ceci : ${row.definition}. Paul compare ${frenchChoices[1]}, Léa note ${frenchChoices[2]} et Marc choisit ${frenchChoices[3]}.`, promptFrench: `Quel mot du contexte signifie « ${row.definition} » ?`, choicesFrench: frenchChoices, correctAnswer: target },
    );
    continue;
  }

  for (const candidate of candidates) {
    const selected = explicitByCandidate[candidate.id] ?? explicitByNormalized[normalized];
    const options = quizIdentitiesByNormalized.get(normalized) ?? [];
    const identity = selected ?? (options.length === 1 ? options[0] : undefined);
    if (!identity) throw new Error(`Unresolved reuse identity: ${candidate.id} ${normalized}`);
    decisions.push({ candidateId: candidate.id, disposition: "vocabulary", surfaceFormId: identity[0], senseId: identity[1], lemmaId: senses.get(identity[1]).lemmaId });
  }
}

const decisionIds = new Set(decisions.map((decision) => decision.candidateId));
if (decisions.length !== 500 || decisionIds.size !== 500 || batch.some((candidate) => !decisionIds.has(candidate.id))) throw new Error("Batch 01 does not resolve exactly candidates 1–500");
if (preparedQuizItems.some((quiz) => laParureCanonicalText.includes(quiz.contextFrench))) throw new Error("Prepared context copies the La Parure canonical source");
if (new Set(preparedQuizItems.map((quiz) => quiz.id)).size !== preparedQuizItems.length) throw new Error("Prepared quiz IDs are not unique");
for (const quiz of preparedQuizItems) {
  const choices = quiz.choicesEnglish ?? quiz.choicesFrench;
  if (choices.length !== 4 || new Set(choices).size !== 4 || choices.filter((choice) => choice === quiz.correctAnswer).length !== 1) throw new Error(`Invalid choices for ${quiz.id}`);
}
const bandsByIdentity = new Map();
for (const quiz of preparedQuizItems) {
  const key = `${quiz.surfaceFormId}:${quiz.senseId}`;
  const bands = bandsByIdentity.get(key) ?? new Set();
  bands.add(quiz.band);
  bandsByIdentity.set(key, bands);
}
if ([...bandsByIdentity.values()].some((bands) => bands.size !== 3)) throw new Error("An authored identity lacks a complete three-band quiz set");

const expressionSpecs = [
  {
    key: "sans_cesse", unitId: "unt_maupassant_parure_003", text: "sans cesse", gloss: "constantly; without stopping", definition: "d’une manière continue, sans interruption",
    early: "Nina travaille sans cesse depuis ce matin.", english: ["constantly; without stopping", "occasionally", "silently", "tomorrow"],
    intermediate: "La machine tourne _____ depuis l’aube.", french: ["sans cesse", "de temps en temps", "à peine", "demain"],
    advanced: "La machine tourne sans cesse. Paul l’arrête de temps en temps, Léa l’entend à peine et le technicien reviendra demain.", prompt: "Quelle expression indique que la machine tourne sans interruption ?",
  },
  {
    key: "en_face_de", unitId: "unt_maupassant_parure_006", text: "en face de", gloss: "opposite; facing", definition: "dans une position directement opposée à quelque chose",
    early: "La pharmacie se trouve en face de la gare.", english: ["opposite; facing", "behind", "inside", "far from"],
    intermediate: "Paul habite _____ l’école.", french: ["en face de", "derrière", "dans", "loin de"],
    advanced: "La pharmacie est en face de la gare. La boulangerie est derrière la mairie, le café est dans l’hôtel et le parc est loin de la rivière.", prompt: "Quelle expression situe la pharmacie directement à l’opposé de la gare ?",
  },
  {
    key: "tout_en", unitId: "unt_maupassant_parure_007", text: "tout en", gloss: "while; all the while", definition: "introduit une action accomplie en même temps qu’une autre",
    early: "Léa écoute la radio tout en préparant le dîner.", english: ["while; all the while", "before", "instead of", "because of"],
    intermediate: "Nina téléphone _____ marchant vers la gare.", french: ["tout en", "avant de", "au lieu de", "à cause de"],
    advanced: "Luc cuisine tout en écoutant la radio. Nina part avant de manger, Paul lit au lieu de dormir et Marc reste chez lui à cause de la pluie.", prompt: "Quelle expression introduit deux actions accomplies simultanément ?",
  },
];
const unitById = new Map(laParureThoughtUnits.map((unit) => [unit.id, unit]));
const expressionCatalogAdditions = { identities: [], occurrences: [], preparedQuizzes: [] };
for (const spec of expressionSpecs) {
  const identityId = `exi_parure_${spec.key}`;
  const unit = unitById.get(spec.unitId);
  const start = unit?.french.indexOf(spec.text) ?? -1;
  if (!unit || start < 0) throw new Error(`Expression span not found: ${spec.text}`);
  expressionCatalogAdditions.identities.push({ id: identityId, headword: spec.text, gloss: spec.gloss, definition: spec.definition });
  expressionCatalogAdditions.occurrences.push({ id: `exo_parure_${spec.key}_01`, identityId, workId: manifest.workId, unitId: spec.unitId, start, end: start + spec.text.length, text: spec.text });
  expressionCatalogAdditions.preparedQuizzes.push(
    { id: `exq_parure_${spec.key}_early`, expressionId: identityId, band: "levels_1_3", format: "meaning_choice", contextFrench: spec.early, targetText: spec.text, choicesEnglish: spec.english, correctAnswer: spec.gloss },
    { id: `exq_parure_${spec.key}_intermediate`, expressionId: identityId, band: "levels_4_5", format: "surface_completion", contextFrench: spec.intermediate, choicesFrench: spec.french, correctAnswer: spec.text },
    { id: `exq_parure_${spec.key}_advanced`, expressionId: identityId, band: "levels_6_8", format: "target_identification", contextFrench: spec.advanced, promptFrench: spec.prompt, choicesFrench: spec.french, correctAnswer: spec.text },
  );
}

const artifact = {
  schemaVersion: 1,
  workId: manifest.workId,
  batch: 1,
  candidateRange: { start: 1, end: 500 },
  sourceDigest: manifest.sourceDigest,
  status: "reviewed_with_prepared_quizzes",
  counts: {
    candidatesReviewed: decisions.length,
    reusedOccurrences: decisions.filter((decision) => !rowByNormalized.has(batch.find((candidate) => candidate.id === decision.candidateId)?.normalized)).length,
    authoredOccurrences: decisions.filter((decision) => rowByNormalized.has(batch.find((candidate) => candidate.id === decision.candidateId)?.normalized)).length,
    authoredIdentities: new Set(preparedQuizItems.map((quiz) => `${quiz.surfaceFormId}:${quiz.senseId}`)).size,
    preparedQuizItems: preparedQuizItems.length,
    expressionsIdentified: expressionCatalogAdditions.identities.length,
    preparedExpressionQuizItems: expressionCatalogAdditions.preparedQuizzes.length,
  },
  assurances: {
    canonicalWordingPreserved: true,
    allCandidatesResolvedOnce: true,
    quizzesUseIndependentContexts: true,
    exactSourceContextReuseRejected: true,
    publicationAllowed: false,
  },
  lemmas: [...newLemmas.values()],
  senses: [...newSenses.values()],
  surfaceForms: [...newSurfaces.values()],
  decisions,
  expressionCatalogAdditions,
  preparedQuizItems,
};

const serializedArtifact = `${JSON.stringify(artifact, null, 2)}\n`;
writeFileSync(new URL("../content/review/wrk_maupassant_la_parure.batch-01.json", import.meta.url), serializedArtifact);
writeFileSync(new URL("../content/review/wrk_maupassant_la_parure.progress.json", import.meta.url), `${JSON.stringify({
  schemaVersion: 1,
  workId: manifest.workId,
  sourceDigest: manifest.sourceDigest,
  totalCandidates: manifest.candidates.length,
  reviewedCandidates: 500,
  remainingCandidates: manifest.candidates.length - 500,
  completedBatches: [{ batch: 1, start: 1, end: 500, artifact: "wrk_maupassant_la_parure.batch-01.json", digest: `sha256:${createHash("sha256").update(serializedArtifact).digest("hex")}` }],
  nextCandidateRange: { start: 501, end: 1000 },
  fullAuditAndTestStatus: "deferred_until_all_candidates_processed",
  publicationAllowed: false,
}, null, 2)}\n`);
console.log(JSON.stringify(artifact.counts));
