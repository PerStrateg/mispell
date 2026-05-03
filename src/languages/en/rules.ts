import {
  applyFallbackTypoRules,
  applyRegexRules
} from "../shared";
import type { CharacterRule, DistortionContext, Token } from "../../core/types";

export function applyEnglishCharacterRules(
  token: Token,
  ctx: DistortionContext,
  rules: readonly CharacterRule[]
): string | null {
  return applyRegexRules(token, ctx, rules) ?? applyFallbackTypoRules(token, ctx);
}
