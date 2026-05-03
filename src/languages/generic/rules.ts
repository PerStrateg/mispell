import {
  applyFallbackTypoRules,
  applyRegexRules
} from "../shared";
import type { CharacterRule, DistortionContext, Token } from "../../core/types";

const BASIC_RULES: CharacterRule[] = [
  {
    id: "generic-remove-duplicate-vowels",
    pattern: "([aeiouаеёиоуыэюя])\\1+",
    replacement: "$1",
    probability: 0.45
  }
];

export function applyGenericCharacterRules(
  token: Token,
  ctx: DistortionContext,
  rules: readonly CharacterRule[] = BASIC_RULES
): string | null {
  return applyRegexRules(token, ctx, rules) ?? applyFallbackTypoRules(token, ctx);
}
