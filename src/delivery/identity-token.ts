/** Compact delivery reference, NOT a replacement for the permanent mastery key.
 * Both 32-bit halves are checked for collisions across the release at build time. */
export function identityToken(key: string): string {
  let left = 0x811c9dc5, right = 0x9e3779b9;
  for (let i = 0; i < key.length; i += 1) {
    left = Math.imul(left ^ key.charCodeAt(i), 0x01000193);
    right = Math.imul(right ^ key.charCodeAt(i), 0x85ebca6b);
  }
  return (left >>> 0).toString(36).padStart(7, "0") + (right >>> 0).toString(36).padStart(7, "0");
}
/** 512 stable language-specific buckets; adding an identity never renumbers others. */
export function quizShard(key: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i += 1) hash = Math.imul(hash ^ key.charCodeAt(i), 0x01000193);
  return ((hash >>> 0) % 512).toString(16).padStart(3, "0");
}
