import { applyCasing, codepoints, normalizeWord, weightedChoice } from "../core/textUtils";
import type { DistortionContext, DistortionProfile, Operation, Token } from "../core/types";

export interface TypoProfileOptions {
  dictionaryProbability?: number;
  characterRuleProbability?: number;
  minWordLength?: number;
}

export function typo(options: TypoProfileOptions = {}): DistortionProfile {
  const dictionaryProbability = options.dictionaryProbability ?? 1;
  const characterRuleProbability = options.characterRuleProbability ?? 1;
  const minWordLength = options.minWordLength ?? 2;

  return {
    id: "typo",
    select(tokens, ctx) {
      const operations: Operation[] = [];

      for (const token of tokens) {
        if (token.type !== "word" || codepoints(token.value).length < minWordLength) {
          continue;
        }

        const dictionaryOperation = selectDictionaryOperation(
          token,
          ctx,
          dictionaryProbability
        );

        if (dictionaryOperation) {
          operations.push(dictionaryOperation);
          continue;
        }

        const characterOperation = selectCharacterOperation(
          token,
          ctx,
          characterRuleProbability
        );

        if (characterOperation) {
          operations.push(characterOperation);
        }
      }

      return operations;
    }
  };
}

function selectDictionaryOperation(
  token: Token,
  ctx: DistortionContext,
  probability: number
): Operation | null {
  const replacements = ctx.language.getDictionaryReplacements?.(token.value, ctx) ?? [];

  if (replacements.length === 0 || ctx.rng() > ctx.intensity * probability) {
    return null;
  }

  const replacement = weightedChoice(replacements, ctx.rng);

  if (!replacement) {
    return null;
  }

  const normalizedFrom = normalizeWord(token.value);
  const normalizedTo = normalizeWord(replacement.value);

  if (normalizedFrom === normalizedTo) {
    return null;
  }

  return {
    type: "replace-token",
    tokenIndex: token.index,
    from: token.raw,
    to: applyCasing(replacement.value, token.casing),
    reason: "dictionary",
    priority: 100
  };
}

function selectCharacterOperation(
  token: Token,
  ctx: DistortionContext,
  probability: number
): Operation | null {
  if (ctx.rng() > ctx.intensity * probability) {
    return null;
  }

  const replacement = ctx.language.applyCharacterRules?.(token, ctx);

  if (!replacement || normalizeWord(replacement) === normalizeWord(token.value)) {
    return null;
  }

  return {
    type: "replace-token",
    tokenIndex: token.index,
    from: token.raw,
    to: applyCasing(replacement, token.casing),
    reason: "character-rule",
    priority: 50
  };
}
