import type { CharacterRule, DictionaryData, DistortionContext, LanguageResourceOptions, Replacement, Token } from "../core/types";
import type { BundledLanguageResources } from "../generated/resources";
export interface PreparedLanguageResources {
    dictionary: DictionaryData;
    commonRank: Map<string, number>;
    characterRules: CharacterRule[];
}
export declare function prepareLanguageResources(bundled: BundledLanguageResources, options: LanguageResourceOptions | undefined, defaultDictionaries: readonly string[]): PreparedLanguageResources;
export declare function getRank(commonRank: Map<string, number>, word: string): number | null;
export declare function getReplacements(dictionary: DictionaryData, word: string): Replacement[];
export declare function getComplexity(commonRank: Map<string, number>, token: Token): number;
export declare function applyRegexRules(token: Token, ctx: DistortionContext, rules: readonly CharacterRule[]): string | null;
export declare function applyFallbackTypoRules(token: Token, ctx: DistortionContext): string | null;
export declare function formatByPluralCategory(category: string, count: number, forms: Record<string, string>): string;
