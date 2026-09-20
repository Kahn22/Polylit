import { loadPublication, validatePublication } from "../publication/repository.js";
const publication = loadPublication();
validatePublication(publication.bundle, publication.expressionCatalog, publication.registry);
console.log(`Publication check passed: ${publication.bundle.works.length} approved works; all referenced vocabulary and three-band quizzes validated.`);
