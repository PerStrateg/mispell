import type { Replacement, Token, TokenCasing } from "./types";
export declare function clampIntensity(intensity: number | undefined): number;
export declare function normalizeWord(value: string): string;
export declare function codepoints(value: string): string[];
export declare function detectCasing(value: string): TokenCasing;
export declare function applyCasing(value: string, casing: TokenCasing): string;
export declare function defaultComplexity(token: Token, commonRank?: number | null): number;
export declare function weightedChoice(replacements: readonly Replacement[], rng: () => number): Replacement | null;
export declare function hasInnerLetters(value: string): boolean;
