export interface TokenSpan { start: number; end: number; text: string; normalized: string }

const wordPattern = /\p{L}+(?:[’']\p{L}+)*(?:-\p{L}+(?:[’']\p{L}+)*)*/gu;
const elidedPrefixes = new Set(["c", "d", "j", "l", "m", "n", "s", "t", "qu", "jusqu", "lorsqu", "puisqu"]);
const inversionPattern = /^(\p{L}+(?:[’']\p{L}+)*)-(?:t-)?(je|tu|il|elle|on|nous|vous|ils|elles|ce)$/iu;
const nominalRendezVousPrefix = /(?:^|[^\p{L}])(?:les|des|un|le|du|au|aux)\s+$/iu;

export function normalizeFrenchToken(value: string): string {
  return value.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase("fr-FR");
}

export function tokenizeFrench(text: string): TokenSpan[] {
  const spans: TokenSpan[] = [];
  for (const match of text.matchAll(wordPattern)) {
    const start = match.index;
    const token = match[0];
    // « les rendez-vous » is a noun, while « rendez-vous demain » is an imperative.
    if (normalizeFrenchToken(token) === "rendez-vous" && nominalRendezVousPrefix.test(text.slice(0, start))) {
      push(spans, text, start, start + token.length);
      continue;
    }
    const inversion = token.match(inversionPattern);
    if (inversion) {
      const verb = inversion[1]!;
      const subject = inversion[2]!;
      push(spans, text, start, start + verb.length);
      push(spans, text, start + token.length - subject.length, start + token.length);
      continue;
    }
    const apostrophe = Math.max(token.indexOf("’"), token.indexOf("'"));
    if (apostrophe > 0 && elidedPrefixes.has(normalizeFrenchToken(token.slice(0, apostrophe)))) {
      push(spans, text, start, start + apostrophe + 1);
      push(spans, text, start + apostrophe + 1, start + token.length);
    } else {
      push(spans, text, start, start + token.length);
    }
  }
  return spans;
}

function push(spans: TokenSpan[], source: string, start: number, end: number): void {
  const text = source.slice(start, end);
  spans.push({ start, end, text, normalized: normalizeFrenchToken(text) });
}
