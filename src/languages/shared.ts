import { mergeDictionaries } from "../core/dictionary";
import { codepoints, defaultComplexity, normalizeWord } from "../core/textUtils";
import type {
  CharacterRule,
  DictionaryData,
  DictionarySelection,
  DistortionContext,
  LanguageResourceOptions,
  Replacement,
  Token
} from "../core/types";
import type { BundledLanguageResources } from "../generated/resources";

export interface PreparedLanguageResources {
  dictionary: DictionaryData;
  commonRank: Map<string, number>;
  characterRules: CharacterRule[];
}

export function prepareLanguageResources(
  bundled: BundledLanguageResources,
  options: LanguageResourceOptions | undefined,
  defaultDictionaries: readonly string[]
): PreparedLanguageResources {
  const selectedDictionaries = selectDictionaries(
    bundled.dictionaries,
    options?.dictionaries ?? "default",
    defaultDictionaries
  );

  const dictionaries = [...selectedDictionaries];

  if (options?.dictionary) {
    dictionaries.push(options.dictionary);
  }

  const commonWords = options?.commonWords === false
    ? []
    : [...(options?.commonWords ?? bundled.commonWords)];

  const characterRules = options?.characterRules === false
    ? []
    : [...(options?.characterRules ?? bundled.characterRules)];

  return {
    dictionary: mergeDictionaries(dictionaries),
    commonRank: new Map(commonWords.map((word, index) => [normalizeWord(word), index + 1])),
    characterRules
  };
}

export function getRank(commonRank: Map<string, number>, word: string): number | null {
  return commonRank.get(normalizeWord(word)) ?? null;
}

export function getReplacements(dictionary: DictionaryData, word: string): Replacement[] {
  return dictionary[normalizeWord(word)] ?? [];
}

export function getComplexity(commonRank: Map<string, number>, token: Token): number {
  return defaultComplexity(token, getRank(commonRank, token.value));
}

export function applyRegexRules(
  token: Token,
  ctx: DistortionContext,
  rules: readonly CharacterRule[]
): string | null {
  const lower = normalizeWord(token.value);

  for (const rule of rules) {
    const flags = normalizeRegexFlags(rule.flags ?? "iu");
    const regex = new RegExp(rule.pattern, flags);

    if (!regex.test(lower)) {
      continue;
    }

    const probability = ctx.intensity >= 1
      ? 1
      : Math.min(1, (rule.probability ?? 1) * ctx.intensity);
    if (ctx.rng() > probability) {
      continue;
    }

    const next = lower.replace(regex, rule.replacement);
    if (next !== lower) {
      return next;
    }
  }

  return null;
}

export function applyFallbackTypoRules(token: Token, ctx: DistortionContext): string | null {
  const lower = normalizeWord(token.value);
  const chars = codepoints(lower);

  if (chars.length < 4) {
    return null;
  }

  const duplicate = removeDuplicateLetters(chars);
  if (duplicate !== lower && ctx.rng() <= 0.5 * ctx.intensity) {
    return duplicate;
  }

  if (chars.length >= 6 && ctx.rng() <= 0.45 * ctx.intensity) {
    return swapAdjacentInner(chars, ctx.rng);
  }

  if (chars.length >= 6 && ctx.rng() <= 0.35 * ctx.intensity) {
    return dropOneInner(chars, ctx.rng);
  }

  return null;
}

export function formatByPluralCategory(
  category: string,
  count: number,
  forms: Record<string, string>
): string {
  return forms[category] ?? forms.other ?? Object.values(forms)[0] ?? String(count);
}

function selectDictionaries(
  bundled: Record<string, DictionaryData>,
  selection: DictionarySelection,
  defaultDictionaries: readonly string[]
): DictionaryData[] {
  if (selection === "none") {
    return [];
  }

  const names = selection === "all"
    ? Object.keys(bundled)
    : selection === "default"
      ? [...defaultDictionaries]
      : [...selection];

  return names.map((name) => {
    const dictionary = bundled[name];

    if (!dictionary) {
      const known = Object.keys(bundled).sort().join(", ");
      throw new Error(`Unknown dictionary "${name}". Known dictionaries: ${known}`);
    }

    return dictionary;
  });
}

function normalizeRegexFlags(flags: string): string {
  const unique = new Set(flags.split(""));
  unique.add("u");
  return [...unique].join("");
}

function removeDuplicateLetters(chars: readonly string[]): string {
  const result: string[] = [];
  let last = "";

  for (const char of chars) {
    const isLetter = char.toLocaleLowerCase() !== char.toLocaleUpperCase();

    if (isLetter && char === last) {
      continue;
    }

    result.push(char);
    last = char;
  }

  return result.join("");
}

function swapAdjacentInner(chars: readonly string[], rng: () => number): string {
  const result = [...chars];
  const min = 1;
  const max = result.length - 3;

  if (max < min) {
    return result.join("");
  }

  const index = min + Math.floor(rng() * (max - min + 1));
  const current = result[index];
  result[index] = result[index + 1];
  result[index + 1] = current;

  return result.join("");
}

function dropOneInner(chars: readonly string[], rng: () => number): string {
  const result = [...chars];
  const min = 1;
  const max = result.length - 2;

  if (max < min) {
    return result.join("");
  }

  const index = min + Math.floor(rng() * (max - min + 1));
  result.splice(index, 1);

  return result.join("");
}
