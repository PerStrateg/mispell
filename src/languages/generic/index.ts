import { defaultTokenize } from "../../core/tokens";
import { defaultComplexity } from "../../core/textUtils";
import type {
  LanguageAdapter,
  LanguageResourceOptions
} from "../../core/types";
import { applyGenericCharacterRules } from "./rules";

export function generic(options: LanguageResourceOptions = {}): LanguageAdapter {
  const rules = options.characterRules === false ? [] : options.characterRules;

  return {
    id: "generic",
    tokenize: defaultTokenize,
    getCommonRank: () => null,
    getComplexity: (token) => defaultComplexity(token, null),
    getDictionaryReplacements: () => [],
    applyCharacterRules: (token, ctx) => applyGenericCharacterRules(token, ctx, rules)
  };
}
