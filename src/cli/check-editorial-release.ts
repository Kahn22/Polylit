import { loadPublication, validatePublication } from "../publication/repository.js";
import { assertEditorialRelease } from "../publication/quality-audit.js";
const publication = loadPublication();
validatePublication(publication.bundle, publication.expressionCatalog, publication.registry);
assertEditorialRelease(publication);
console.log("Exact-version editorial approval and content-quality publication gates passed.");
