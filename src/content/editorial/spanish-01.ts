/** Authored offline after reading every current occurrence of these eight forms.
 * These are complete, distinct questions, not runtime or corpus-wide templates. */
export interface SpanishEditorialEntry {
  form: string;
  baseRevision: string;
  headword: string;
  gender: "masculine" | "feminine";
  number: "singular" | "plural";
  gloss: string;
  definition: string;
  meaning: { context: string; choices: [string, string, string, string] };
  completion: { context: string; choices: [string, string, string, string] };
  identification: { context: string; prompt: string; choices: [string, string, string, string] };
  rationale: string;
}
export const spanishEditorial01: SpanishEditorialEntry[] = [
  {
    form: "casa", baseRevision: "rev_02e472e6dd5f869ec4eed8b7b05a5e94343a8ae7956ace6b1ae44aa36abf2d71",
    headword: "casa", gender: "feminine", number: "singular", gloss: "house",
    definition: "Edificio o vivienda donde habitan personas.",
    meaning: { context: "La casa tiene dos dormitorios y un pequeño jardín.", choices: ["house", "room", "street", "roof"] },
    completion: { context: "Compraron una ___ para vivir en ella con sus hijos.", choices: ["casa", "maleta", "mesa", "camisa"] },
    identification: { context: "La casa está al final de la calle, junto a un jardín rodeado por un muro.", prompt: "¿Qué palabra nombra el edificio donde vive una familia?", choices: ["casa", "calle", "jardín", "muro"] },
    rationale: "Checked all six occurrences in both works: each denotes a dwelling, including a casa de and the personified casa hostil. No sense split or identity change. Each distractor names a distinct object or place, and each context is independently authored.",
  },
  {
    form: "cama", baseRevision: "rev_d15086e09732fe762ce14c77cf7d8abd2359cd6edbabebb6bce29f2f93476801",
    headword: "cama", gender: "feminine", number: "singular", gloss: "bed",
    definition: "Mueble preparado para acostarse, dormir o descansar.",
    meaning: { context: "Antes de acostarse, puso una manta sobre la cama.", choices: ["bed", "blanket", "cupboard", "pillow"] },
    completion: { context: "Después de ponerse el pijama, se metió en la ___ para dormir.", choices: ["cama", "mesa", "silla", "alfombra"] },
    identification: { context: "En el dormitorio había una cama, una silla y una mesa junto a la ventana.", prompt: "¿Qué mueble está destinado a dormir acostado?", choices: ["cama", "silla", "mesa", "ventana"] },
    rationale: "Checked all eight occurrences, including caído en cama: the bed sense is preserved within that construction. Alternatives do not satisfy the intended furniture definition or the natural meterse en la cama construction.",
  },
  {
    form: "almohadón", baseRevision: "rev_7fe4bef36b999bcdf241650156aca94b737f52d25c16f9820995b61fb3fa4582",
    headword: "almohadón", gender: "masculine", number: "singular", gloss: "pillow",
    definition: "Pieza de tela rellena de material blando que sirve de apoyo para la cabeza o el cuerpo.",
    meaning: { context: "Se acomodó un almohadón bajo la cabeza para leer en el sofá.", choices: ["pillow", "blanket", "mattress", "towel"] },
    completion: { context: "La funda de tela estaba rellena de plumas y formaba un ___ mullido para apoyar la cabeza.", choices: ["almohadón", "armario", "espejo", "cajón"] },
    identification: { context: "Puso un almohadón sobre el sofá y dejó una manta doblada junto al sillón.", prompt: "¿Qué objeto pequeño, relleno y cubierto de tela colocó sobre el asiento?", choices: ["almohadón", "sofá", "manta", "sillón"] },
    rationale: "Checked all four occurrences: a stuffed pillow in the bed. The advanced clue distinguishes the removable cushion from the upholstered seats and blanket. The correct surface retains its accent.",
  },
  {
    form: "dormitorio", baseRevision: "rev_d2b4ea9c1cda0d2c80deebb64d444393c8117ec3e977a5117a1260a3ee6baddb",
    headword: "dormitorio", gender: "masculine", number: "singular", gloss: "bedroom",
    definition: "Habitación de una vivienda destinada principalmente a dormir.",
    meaning: { context: "Los niños guardaron sus juguetes y se acostaron en el dormitorio.", choices: ["bedroom", "dining room", "courtyard", "kitchen"] },
    completion: { context: "La habitación donde duermo, con mi cama y mi armario, es mi ___.", choices: ["dormitorio", "comedor", "pasillo", "baño"] },
    identification: { context: "El dormitorio está arriba; la cocina, el comedor y el baño están abajo.", prompt: "¿Qué habitación se utiliza principalmente para dormir?", choices: ["dormitorio", "cocina", "comedor", "baño"] },
    rationale: "Checked all four source occurrences: the sleeping room, contrasted explicitly with la sala. All alternatives are places with different primary functions.",
  },
  {
    form: "noche", baseRevision: "rev_9457887c10c43ba41b101b5ca15d7a72489c35cd1a16d596d65ad998037826e5",
    headword: "noche", gender: "feminine", number: "singular", gloss: "night",
    definition: "Período comprendido entre la puesta y la salida del sol.",
    meaning: { context: "Durante la noche, las estrellas brillaban sobre el pueblo.", choices: ["night", "noon", "morning", "dawn"] },
    completion: { context: "El período de oscuridad entre la puesta y la salida del sol se llama ___.", choices: ["noche", "tarde", "mañana", "madrugada"] },
    identification: { context: "La noche fue fría, pero al amanecer salió el sol y la mañana resultó agradable.", prompt: "¿Qué palabra designa el período entre la puesta y la salida del sol?", choices: ["noche", "amanecer", "sol", "mañana"] },
    rationale: "Checked all five occurrences, including both tokens in Noche a noche and de noche. The completion defines the entire interval; madrugada is only a portion, not an equally correct answer. The separate plural noches is not merged or awarded mastery.",
  },
  {
    form: "paredes", baseRevision: "rev_7f645b61a6ddd91c6988e2e0082e853b923d2687ad00e25dffe4002c3647863f",
    headword: "pared", gender: "feminine", number: "plural", gloss: "walls",
    definition: "Superficies verticales de una construcción que delimitan o separan espacios.",
    meaning: { context: "Pintaron las paredes de la habitación de color azul.", choices: ["walls", "roofs", "floors", "windows"] },
    completion: { context: "El techo está arriba y el suelo abajo; las superficies verticales que rodean la habitación son las ___.", choices: ["paredes", "ventanas", "escaleras", "puertas"] },
    identification: { context: "Las paredes sostenían el techo; en el suelo había una alfombra cerca de las ventanas.", prompt: "¿Qué palabra nombra las superficies verticales que delimitan la habitación?", choices: ["paredes", "techo", "suelo", "ventanas"] },
    rationale: "Checked the sole source occurrence altas paredes. Corrected the dictionary headword to singular pared while preserving the existing surface and sense IDs. Windows and doors are openings/elements in walls, not the enclosing surfaces as a whole.",
  },
  {
    form: "puerta", baseRevision: "rev_d7f1c03c477a1fe20ec028da9a5153bd2daa6e2310fe435ba7e460fdb6bf69b3",
    headword: "puerta", gender: "feminine", number: "singular", gloss: "door",
    definition: "Elemento que se abre y se cierra para permitir o impedir el paso por la entrada de un recinto.",
    meaning: { context: "Cerró la puerta con llave antes de salir.", choices: ["door", "roof", "key", "staircase"] },
    completion: { context: "Giró el picaporte, abrió la ___ y pasó del pasillo a la habitación.", choices: ["puerta", "llave", "pared", "escalera"] },
    identification: { context: "Junto a la puerta había una ventana; una escalera conducía al piso de arriba y una lámpara iluminaba la entrada.", prompt: "¿Qué elemento de la entrada se abre para pasar normalmente de fuera a dentro?", choices: ["puerta", "ventana", "escalera", "lámpara"] },
    rationale: "Checked the source puerta de calle: the entrance door. The completion's picaporte and passage between rooms disambiguate the answer; the advanced clue specifies the normal entrance, not climbing through a window.",
  },
  {
    form: "pasos", baseRevision: "rev_816fe9664aa62a16b0a5f6b0fa5b2157c44c0731bdf235129d4a9ad627905650",
    headword: "paso", gender: "masculine", number: "plural", gloss: "steps",
    definition: "Movimientos sucesivos de los pies al caminar y el sonido que producen.",
    meaning: { context: "Oí sus pasos en el pasillo antes de que llamara a la puerta.", choices: ["footsteps", "whispers", "knocks", "breaths"] },
    completion: { context: "Al caminar por la grava, sus ___ hacían crujir las piedras.", choices: ["pasos", "manos", "ojos", "sueños"] },
    identification: { context: "Sus pasos resonaban en la escalera, mientras sus llaves tintineaban y su voz llegaba hasta el patio.", prompt: "¿Qué palabra se refiere a los movimientos de los pies al caminar, cuyo sonido se oye aquí?", choices: ["pasos", "llaves", "voz", "patio"] },
    rationale: "Checked all three occurrences: audible footsteps, including the sound muffled by a carpet. Normalized the lemma to paso without changing mastery IDs. Did not combine it with the separately stored paso in paso por esa funda, which requires a verb/sense correction review.",
  },
];
