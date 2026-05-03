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
import { createEnglishPluralAdapter, type EnglishPluralAdapter } from "./plural";
import { applyEnglishCharacterRules } from "./rules";

export interface EnLanguageOptions extends LanguageResourceOptions {
  nlp?: unknown;
  morphology?: unknown;
  plural?: EnglishPluralAdapter;
}

const DEFAULT_DICTIONARIES = [
  "dictionary-aspell",
  "dictionary-birkbeck",
  "dictionary-names",
  "dictionary-wikipedia"
];

export function en(options: EnLanguageOptions = {}): LanguageAdapter {
  const prepared = prepareLanguageResources(
    bundledResources.en,
    options,
    DEFAULT_DICTIONARIES
  );
  const plural = createEnglishPluralAdapter(options.plural);

  return {
    id: "en",
    tokenize: defaultTokenize,
    getCommonRank: (word) => getRank(prepared.commonRank, word),
    getComplexity: (token) => getComplexity(prepared.commonRank, token),
    getDictionaryReplacements: (word) => getReplacements(prepared.dictionary, word),
    applyCharacterRules: (token, ctx) =>
      applyEnglishCharacterRules(token, ctx, prepared.characterRules),
    getPluralCategory: plural.getPluralCategory,
    formatCount: (count, forms) =>
      plural.formatCount(count, forms) ??
      formatByPluralCategory(plural.getPluralCategory(count), count, forms)
  };
}
