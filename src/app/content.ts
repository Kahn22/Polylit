import { loadPublication } from "../publication/repository.js";

/** The latest validated learning bundle contains every learner-ready work. */
const publication = loadPublication();
export const appBundle = publication.bundle;
export const appExpressionCatalog = publication.expressionCatalog;
export const appPreparedQuizzes = publication.preparedQuizzes;

export const appVisibleWorks = appBundle.works.filter((work) =>
  ["learning_ready", "published"].includes(work.publicationState),
);
