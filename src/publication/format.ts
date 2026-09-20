/** The published source and delivery formats are language-neutral. Legacy
 * authoring fixtures remain readable through this lossless boundary adapter. */
export type Language = "fr" | "es";
type NeutralKey<K> = K extends "french" ? "text" : K extends "contextFrench" ? "context" : K extends "choicesFrench" ? "choicesTarget" : K extends "choicesEnglish" ? "choicesGloss" : K extends "promptFrench" ? "promptTarget" : K;
export type Neutral<T> = T extends readonly (infer U)[] ? Neutral<U>[] : T extends object ? { [K in keyof T as NeutralKey<K>]: Neutral<T[K]> } : T;
const names: Record<string, string> = { french: "text", contextFrench: "context", choicesFrench: "choicesTarget", choicesEnglish: "choicesGloss", promptFrench: "promptTarget" };
const legacy = Object.fromEntries(Object.entries(names).map(([a, b]) => [b, a]));
function translate(value: unknown, keys: Record<string, string>): unknown {
  if (Array.isArray(value)) return value.map(item => translate(item, keys));
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const thoughtUnit = typeof record.id === "string" && record.id.startsWith("unt_") && typeof record.ordinal === "number";
    return Object.fromEntries(Object.entries(record).map(([key, item]) => [keys === legacy && key === "text" && !thoughtUnit ? key : keys[key] ?? key, translate(item, keys)]));
  }
  return value;
}
export function toNeutral<T>(value: T): Neutral<T> { return translate(value, names) as Neutral<T>; }
export function fromNeutral<T>(value: Neutral<T>): T { return translate(value, legacy) as T; }
