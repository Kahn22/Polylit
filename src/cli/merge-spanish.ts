import { createSpanishLearningBundle } from "../content/linguistic/spanish.js";
import { importApprovedWork } from "../publication/update-work.js";
const incoming = createSpanishLearningBundle();
for (const work of incoming.works) {
  importApprovedWork(incoming, { identities: [], occurrences: [], preparedQuizzes: [] }, work.id);
  console.log("Updated approved Spanish work: " + work.title);
}
