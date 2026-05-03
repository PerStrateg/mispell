import type { CharacterRule, DictionaryData } from "../core/types";
export interface BundledLanguageResources {
    commonWords: string[];
    characterRules: CharacterRule[];
    dictionaries: Record<string, DictionaryData>;
}
export declare const bundledResources: Record<string, BundledLanguageResources>;
