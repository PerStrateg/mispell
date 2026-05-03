import type { Replacement, Token, TokenCasing } from "./types";

export function clampIntensity(intensity: number | undefined): number {
  if (typeof intensity !== "number" || Number.isNaN(intensity)) {
    return 0.5;
  }

  return Math.min(1, Math.max(0, intensity));
}

export function normalizeWord(value: string): string {
  return value.toLocaleLowerCase();
}

export function codepoints(value: string): string[] {
  return Array.from(value);
}

export function detectCasing(value: string): TokenCasing {
  const letters = codepoints(value).filter((char) => char.toLocaleLowerCase() !== char.toLocaleUpperCase());

  if (letters.length === 0) {
    return "none";
  }

  const lower = value.toLocaleLowerCase();
  const upper = value.toLocaleUpperCase();

  if (value === lower) {
    return "lower";
  }

  if (value === upper) {
    return "upper";
  }

  const chars = codepoints(value);
  const firstLetterIndex = chars.findIndex(
    (char) => char.toLocaleLowerCase() !== char.toLocaleUpperCase()
  );

  if (firstLetterIndex >= 0) {
    const first = chars[firstLetterIndex];
    const rest = chars
      .slice(firstLetterIndex + 1)
      .join("")
      .toLocaleLowerCase();
    const candidate =
      chars.slice(0, firstLetterIndex).join("") +
      first.toLocaleUpperCase() +
      rest;

    if (value === candidate) {
      return "title";
    }
  }

  return "mixed";
}

export function applyCasing(value: string, casing: TokenCasing): string {
  if (casing === "upper") {
    return value.toLocaleUpperCase();
  }

  if (casing === "title") {
    const chars = codepoints(value.toLocaleLowerCase());
    const firstLetterIndex = chars.findIndex(
      (char) => char.toLocaleLowerCase() !== char.toLocaleUpperCase()
    );

    if (firstLetterIndex < 0) {
      return value;
    }

    chars[firstLetterIndex] = chars[firstLetterIndex].toLocaleUpperCase();
    return chars.join("");
  }

  if (casing === "lower") {
    return value.toLocaleLowerCase();
  }

  return value;
}

export function defaultComplexity(token: Token, commonRank?: number | null): number {
  if (token.type !== "word") {
    return 0;
  }

  const length = codepoints(token.value).length;
  const lengthScore = Math.max(0, length - 3) / 4;
  const rankScore = commonRank == null ? 2 : Math.min(2, commonRank / 5000);

  return lengthScore + rankScore;
}

export function weightedChoice(
  replacements: readonly Replacement[],
  rng: () => number
): Replacement | null {
  let total = 0;

  for (const replacement of replacements) {
    if (replacement.weight > 0) {
      total += replacement.weight;
    }
  }

  if (total <= 0) {
    return null;
  }

  let cursor = rng() * total;

  for (const replacement of replacements) {
    if (replacement.weight <= 0) {
      continue;
    }

    cursor -= replacement.weight;
    if (cursor <= 0) {
      return replacement;
    }
  }

  return replacements[replacements.length - 1] ?? null;
}

export function hasInnerLetters(value: string): boolean {
  return codepoints(value).length >= 4;
}
