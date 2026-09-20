import { createReviewSession, type ReviewClaim, type VocabularyLearnerStateRecord } from "../learner/scheduler.js";
import type { LibraryIndex } from "../delivery/types.js";
import { identityToken } from "../delivery/identity-token.js";

/** Per-state-revision indexes; time invalidation occurs at the next due item. */
export class ProgressIndex {
  readonly #members = new Map<string, Set<string>>();
  #all: ReviewClaim[] = [];
  #claims = new Map<string, ReviewClaim[]>();
  #unencountered = new Map<string, number>();
  #revision = -1;
  #validUntil = 0;
  constructor(readonly library: LibraryIndex) {
    for (const [id, work] of Object.entries(library.works)) this.#members.set(id, new Set([...work.vocabularyTokens, ...work.expressionIdentityKeys.map(id => identityToken(`expression:${id}`))]));
  }
  refresh(state: VocabularyLearnerStateRecord, eligible: ReadonlySet<string>, revision: number, at: Date): void {
    if (this.#revision === revision && at.getTime() < this.#validUntil) return;
    this.#revision = revision;
    this.#validUntil = Infinity;
    const encountered = new Set(Object.keys(state).map(identityToken));
    for (const value of Object.values(state)) { const due = Date.parse(value.nextDueAt); if (due > at.getTime()) this.#validUntil = Math.min(this.#validUntil, due); }
    for (const [id, work] of Object.entries(this.library.works)) this.#unencountered.set(id, work.vocabularyTokens.reduce((count, token) => count + Number(!encountered.has(token)), 0));
    this.#claims = new Map([...eligible].map(id => [id, []]));
    this.#all = [];
    for (const claim of createReviewSession(state, at)) {
      const token = identityToken(claim.vocabularyIdentity);
      let included = false;
      for (const id of eligible) if (this.#members.get(id)?.has(token)) { this.#claims.get(id)!.push(claim); included = true; }
      if (included) this.#all.push(claim);
    }
  }
  claims(workId?: string): ReviewClaim[] { return workId ? this.#claims.get(workId) ?? [] : this.#all; }
  unencountered(workId: string): number { return this.#unencountered.get(workId) ?? 0; }
}
