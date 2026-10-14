import type { LibraryIndex } from './types.js';
import { identityToken } from './identity-token.js';

type WireWork = { sectionCount: number; manifest: string; vocabularyMembers: string; expressionMembers: string };
export interface LibraryWire extends Omit<LibraryIndex, 'version' | 'works'> {
  version: 4; tokenCount: number; remainderBits: number; tokenPool: string; works: Record<string, WireWork>;
}
const base64 = (bytes: number[]) => btoa(String.fromCharCode(...bytes));
const bytes = (text: string) => Uint8Array.from(atob(text), c => c.charCodeAt(0));
const numberFor = (token: string) => (BigInt(parseInt(token.slice(0, 7), 36)) << 32n) | BigInt(parseInt(token.slice(7), 36));
const tokenFor = (n: bigint) => Number(n >> 32n).toString(36).padStart(7, '0') + Number(n & 0xffffffffn).toString(36).padStart(7, '0');

/** Lossless transport only: the original 64-bit references and permanent keys are unchanged. */
export function encodeLibrary(index: LibraryIndex): LibraryWire {
  const expressionTokens = (w: LibraryIndex['works'][string]) => w.expressionTokens ?? w.expressionIdentityKeys.map(id => identityToken(`expression:${id}`));
  const pool = [...new Set(Object.values(index.works).flatMap(w => [...w.vocabularyTokens, ...expressionTokens(w)]))].sort();
  const lookup = new Map(pool.map((token, i) => [token, i]));
  const k = Math.max(1, Math.min(63, 64 - Math.ceil(Math.log2(Math.max(2, pool.length)))));
  const output: number[] = []; let current = 0, used = 0;
  const bit = (v: number) => { current = (current << 1) | v; if (++used === 8) { output.push(current); current = 0; used = 0; } };
  let previous = 0n;
  for (const token of pool) {
    const n = numberFor(token), delta = n - previous; previous = n;
    const quotient = Number(delta >> BigInt(k)); for (let i = 0; i < quotient; i++) bit(1); bit(0);
    for (let i = k - 1; i >= 0; i--) bit(Number((delta >> BigInt(i)) & 1n));
  }
  if (used) output.push(current << (8 - used));
  const members = (tokens: string[]) => { const result = Array<number>(Math.ceil(pool.length / 8)).fill(0); for (const token of tokens) { const i = lookup.get(token)!; result[i >> 3]! |= 1 << (i & 7); } return base64(result); };
  const works = Object.fromEntries(Object.entries(index.works).map(([id, w]) => [id, { sectionCount: w.sectionCount, manifest: w.manifest, vocabularyMembers: members(w.vocabularyTokens), expressionMembers: members(expressionTokens(w)) }]));
  return { ...index, version: 4, works, tokenCount: pool.length, remainderBits: k, tokenPool: base64(output) };
}

export function decodeLibrary(input: LibraryIndex | LibraryWire): LibraryIndex {
  if (input.version === 3) return input;
  if (input.version !== 4 || !Number.isInteger(input.tokenCount) || input.tokenCount < 0 || input.tokenCount > 100_000 || !Number.isInteger(input.remainderBits) || input.remainderBits < 1 || input.remainderBits > 63) throw new Error('Invalid compact library');
  const data = bytes(input.tokenPool); let cursor = 0;
  const bit = () => { if (cursor >= data.length * 8) throw new Error('Truncated compact library'); const value = (data[cursor >> 3]! >> (7 - (cursor & 7))) & 1; cursor++; return value; };
  const pool: string[] = []; let previous = 0n;
  for (let n = 0; n < input.tokenCount; n++) { let quotient = 0n; while (bit()) quotient++; let remainder = 0n; for (let i = 0; i < input.remainderBits; i++) remainder = (remainder << 1n) | BigInt(bit()); const next = previous + (quotient << BigInt(input.remainderBits)) + remainder; if (next > 0xffffffffffffffffn || (n > 0 && next <= previous)) throw new Error('Invalid token ordering'); pool.push(tokenFor(next)); previous = next; }
  const members = (encoded: string) => { const bits = bytes(encoded); if (bits.length !== Math.ceil(pool.length / 8)) throw new Error('Invalid library membership'); return pool.filter((_, i) => (bits[i >> 3]! & (1 << (i & 7))) !== 0); };
  const works = Object.fromEntries(Object.entries(input.works).map(([id, w]) => [id, { sectionCount: w.sectionCount, manifest: w.manifest, vocabularyTokens: members(w.vocabularyMembers), expressionIdentityKeys: [], expressionTokens: members(w.expressionMembers) }]));
  return { version: 3, language: input.language, release: input.release, catalog: input.catalog, quizzes: input.quizzes, works };
}
