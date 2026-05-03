import { applyCasing, codepoints, normalizeWord } from "../core/textUtils";
import type { DistortionProfile, Operation, Token } from "../core/types";

export interface ScrambleProfileOptions {
  minWordLength?: number;
}

export function scramble(options: ScrambleProfileOptions = {}): DistortionProfile {
  const minWordLength = options.minWordLength ?? 5;

  return {
    id: "scramble",
    select(tokens, ctx) {
      const operations: Operation[] = [];

      for (const token of tokens) {
        if (token.type !== "word") {
          continue;
        }

        const length = codepoints(token.value).length;
        if (length < minWordLength) {
          continue;
        }

        const probability = scrambleProbability(token, length, ctx.intensity);
        if (ctx.rng() > probability) {
          continue;
        }

        const replacement = scrambleWord(
          normalizeWord(token.value),
          ctx.createRng(`scramble:${token.index}:${normalizeWord(token.value)}`)
        );

        if (normalizeWord(replacement) === normalizeWord(token.value)) {
          continue;
        }

        operations.push({
          type: "replace-token",
          tokenIndex: token.index,
          from: token.raw,
          to: applyCasing(replacement, token.casing),
          reason: "scramble",
          priority: 70
        });
      }

      return operations;
    }
  };
}

function scrambleProbability(token: Token, length: number, intensity: number): number {
  if (intensity <= 0) {
    return 0;
  }

  const rank = token.analysis?.commonRank;
  const rarity = rank == null ? 1 : Math.min(1, rank / 7000);
  const lengthFactor = Math.min(1, Math.max(0, (length - 4) / 10));
  const complexity = Math.min(1, Math.max(0, (token.analysis?.complexity ?? 0) / 4));
  const base = 0.1 + rarity * 0.4 + lengthFactor * 0.3 + complexity * 0.2;

  if (intensity >= 1 && length >= 8) {
    return Math.max(0.9, base);
  }

  return Math.min(1, intensity * base);
}

function scrambleWord(word: string, rng: () => number): string {
  const chars = codepoints(word);

  if (chars.length < 4) {
    return word;
  }

  const first = chars[0];
  const middle = chars.slice(1, -1);
  const last = chars[chars.length - 1];
  let shuffled = middle;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    shuffled = fisherYates([...middle], rng);
    const candidate = [first, ...shuffled, last].join("");

    if (candidate !== word) {
      return candidate;
    }
  }

  if (middle.length >= 2) {
    const fallback = [...middle];
    const second = fallback[1];
    fallback[1] = fallback[0];
    fallback[0] = second;
    return [first, ...fallback, last].join("");
  }

  return word;
}

function fisherYates(chars: string[], rng: () => number): string[] {
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const current = chars[i];
    chars[i] = chars[j];
    chars[j] = current;
  }

  return chars;
}
