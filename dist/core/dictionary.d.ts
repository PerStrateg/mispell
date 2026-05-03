import type { DictionaryData, Replacement } from "./types";
export declare function mergeDictionaries(dictionaries: readonly DictionaryData[]): DictionaryData;
export declare function getDictionaryReplacements(dictionary: DictionaryData, word: string): Replacement[];
