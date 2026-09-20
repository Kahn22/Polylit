import type { Quiz, Language } from "../delivery/types.js";
import type { ReviewClaim, VocabularyLearnerState } from "../learner/scheduler.js";
import { orderedChoices } from "./state.js";
import { escapeHtml } from "./html.js";
import { correctChoice } from "../domain/prepared-quiz.js";
export function highlightedContext(quiz: Quiz) {
  const { context, targetRange: range } = quiz;
  if (!range || range.start < 0 || range.end <= range.start || range.end > context.length) return escapeHtml(context);
  return `${escapeHtml(context.slice(0, range.start))}<mark>${escapeHtml(context.slice(range.start, range.end))}</mark>${escapeHtml(context.slice(range.end))}`;
}

function quizPresentation(quiz: Quiz) {
  if (quiz.format === "meaning_choice") return { context: highlightedContext(quiz), prompt: "Meaning", choices: quiz.choices };
  if (quiz.format === "surface_completion") return { context: escapeHtml(quiz.context), prompt: quiz.language === "es" ? "Completa la frase." : "Complétez la phrase.", choices: quiz.choices };
  return { context: escapeHtml(quiz.context), prompt: quiz.prompt!, choices: quiz.choices };
}

function answerExplanation(quiz: Quiz, answer: string) {
  if (quiz.format === "meaning_choice") return `In this context, ${quiz.targetText ? `“${escapeHtml(quiz.targetText)}”` : "the highlighted text"} means “${escapeHtml(answer)}.”`;
  if (quiz.format === "surface_completion") return `“${escapeHtml(answer)}” is the form that correctly completes the sentence.`;
  return `“${escapeHtml(answer)}” is the word or expression that matches the definition.`;
}


export function quizMarkup({ quiz, label, state, selectedAnswer, reviewSession, reviewSessionIndex, reviewScopeWorkId, sectionReviewAdvances, language }: { quiz: Quiz; label: string; state: VocabularyLearnerState; selectedAnswer: string | undefined; reviewSession: ReviewClaim[] | undefined; reviewSessionIndex: number; reviewScopeWorkId: string | undefined; sectionReviewAdvances: boolean; language: Language }): string {
  const presentation = quizPresentation(quiz), choices = orderedChoices([...presentation.choices], quiz.id);
  const answered = selectedAnswer !== undefined;
  const answer = correctChoice(quiz).text;
  const correct = selectedAnswer === quiz.correctChoiceId;
  const chosenAnswer = quiz.choices.find(choice => choice.id === selectedAnswer)?.text;
  const progress = reviewSession ? `${Math.min(reviewSessionIndex + 1, reviewSession.length)} sur ${reviewSession.length}` : "";
  const mode = sectionReviewAdvances ? "Révision de cette section" : reviewScopeWorkId ? "Révision de ce texte" : "Révision générale";
  const reviewNavigation = sectionReviewAdvances
    ? `<div class="checkpoint-actions"><button class="text-button" type="button" data-action="reread-section">← Reread this section</button><button class="text-button" type="button" data-action="skip-section-review">Skip review and read the next section →</button></div>`
    : `<button class="back" type="button" data-action="end-review">← Terminer la révision</button>`;
  const question = `<div class="quiz-choices">${choices.map((choice) => `<button type="button" class="choice" data-answer="${escapeHtml(choice.id)}">${escapeHtml(choice.text)}</button>`).join("")}</div>`;
  const result = `<div class="quiz-result" role="status"><div class="feedback ${correct ? "success" : "retry"}">${!correct && chosenAnswer !== undefined ? `<span class="result-label">Your answer · Incorrect</span><strong class="chosen-answer">${escapeHtml(chosenAnswer)}</strong>` : ""}<span class="result-label">Correct answer</span><strong class="correct-answer">${escapeHtml(answer)}</strong><span>${answerExplanation(quiz, answer)}</span></div></div>`;
  const heading = `<div class="quiz-prompt-row"><h2 id="quiz-prompt">${escapeHtml(presentation.prompt)}</h2>${answered ? '<button class="primary continue" type="button" data-action="continue-quiz">Continue</button>' : ""}</div>`;
  return `<section class="quiz"${answered ? ' data-answered="true"' : ""} aria-labelledby="quiz-prompt">${reviewNavigation}<p class="eyebrow">${mode} · ${progress}</p><p class="quiz-level">${escapeHtml(label)} · Niveau ${state.masteryLevel} sur 8</p><p class="quiz-context" lang="${language}">${presentation.context}</p>${heading}${answered ? result : question}</section>`;
}
