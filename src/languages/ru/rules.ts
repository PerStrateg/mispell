import {
  applyFallbackTypoRules,
  applyRegexRules
} from "../shared";
import { normalizeWord } from "../../core/textUtils";
import type { CharacterRule, DistortionContext, Token } from "../../core/types";

export function applyRussianCharacterRules(
  token: Token,
  ctx: DistortionContext,
  rules: readonly CharacterRule[]
): string | null {
  const lower = normalizeWord(token.value);

  if (lower.includes("ё") && ctx.rng() <= 0.8 * ctx.intensity) {
    return lower.replace(/ё/gu, "е");
  }

  if (lower.includes("нн") && ctx.rng() <= 0.45 * ctx.intensity) {
    return lower.replace(/нн/gu, "н");
  }

  if (lower.endsWith("тся") && ctx.rng() <= 0.55 * ctx.intensity) {
    return `${lower.slice(0, -3)}ться`;
  }

  if (lower.endsWith("ться") && ctx.rng() <= 0.55 * ctx.intensity) {
    return `${lower.slice(0, -4)}тся`;
  }

  return applyRegexRules(token, ctx, rules) ?? applyFallbackTypoRules(token, ctx);
}
