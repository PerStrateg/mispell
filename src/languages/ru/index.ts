import { defaultTokenize } from "../../core/tokens";
import type {
  LanguageAdapter,
  LanguageResourceOptions
} from "../../core/types";
import { bundledResources } from "../../generated/resources";
import {
  formatByPluralCategory,
  getComplexity,
  getRank,
  getReplacements,
  prepareLanguageResources
} from "../shared";
import { createRussianPluralAdapter, type RussianPluralAdapter } from "./plural";
import { applyRussianCharacterRules } from "./rules";

export interface RuLanguageOptions extends LanguageResourceOptions {
  nlp?: unknown;
  morphology?: unknown;
  plural?: RussianPluralAdapter;
  nouns?: unknown;
  names?: unknown;
}

const DEFAULT_DICTIONARIES = [
  "dictionary-names",
  "dictionary-simple"
];

export function ru(options: RuLanguageOptions = {}): LanguageAdapter {
  const prepared = prepareLanguageResources(
    bundledResources.ru,
    options,
    DEFAULT_DICTIONARIES
  );
  const plural = createRussianPluralAdapter(options.plural);

  return {
    id: "ru",
    tokenize: defaultTokenize,
    getCommonRank: (word) => getRank(prepared.commonRank, word),
    getComplexity: (token) => getComplexity(prepared.commonRank, token),
    getDictionaryReplacements: (word) => getReplacements(prepared.dictionary, word),
    applyCharacterRules: (token, ctx) =>
      applyRussianCharacterRules(token, ctx, prepared.characterRules),
    getPluralCategory: plural.getPluralCategory,
    formatCount: (count, forms) =>
      plural.formatCount(count, forms) ??
      formatByPluralCategory(plural.getPluralCategory(count), count, forms)
  };
}
