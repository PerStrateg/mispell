import type { DictionaryData, Replacement } from "./types";

export function mergeDictionaries(dictionaries: readonly DictionaryData[]): DictionaryData {
  const merged: DictionaryData = {};

  for (const dictionary of dictionaries) {
    for (const [word, replacements] of Object.entries(dictionary)) {
      if (!merged[word]) {
        merged[word] = [];
      }

      const seen = new Set(merged[word].map((replacement) => replacement.value));

      for (const replacement of replacements) {
        if (!seen.has(replacement.value)) {
          merged[word].push(replacement);
          seen.add(replacement.value);
        }
      }
    }
  }

  return merged;
}

export function getDictionaryReplacements(
  dictionary: DictionaryData,
  word: string
): Replacement[] {
  return dictionary[word] ?? [];
}
