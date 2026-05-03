export type TokenType = "word" | "number" | "space" | "newline" | "punctuation" | "symbol" | "unknown";
export type TokenCasing = "lower" | "upper" | "title" | "mixed" | "none";
export interface TokenAnalysis {
    commonRank?: number | null;
    complexity?: number;
    language?: string;
    lemma?: Lemma[];
    partOfSpeech?: string;
    gender?: string;
    case?: string;
    number?: string;
}
export interface Token {
    type: TokenType;
    raw: string;
    value: string;
    casing: TokenCasing;
    index: number;
    analysis?: TokenAnalysis;
}
export interface Replacement {
    value: string;
    weight: number;
}
export interface CharacterRule {
    id: string;
    pattern: string;
    replacement: string;
    probability?: number;
    flags?: string;
}
export interface Lemma {
    value: string;
    score?: number;
}
export interface InflectionTarget {
    [key: string]: string | number | boolean | undefined;
}
export interface DeclensionTarget {
    [key: string]: string | number | boolean | undefined;
}
export interface NounInput {
    value: string;
    gender?: string;
    animate?: boolean;
}
export interface PersonInput {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    gender?: string;
}
export interface LanguageAdapter {
    id: string;
    normalize?(text: string, ctx: DistortionContext): string;
    tokenize(text: string, ctx: DistortionContext): Token[];
    analyze?(tokens: Token[], ctx: DistortionContext): Token[];
    getCommonRank?(word: string, ctx: DistortionContext): number | null;
    getComplexity?(token: Token, ctx: DistortionContext): number;
    getDictionaryReplacements?(word: string, ctx: DistortionContext): Replacement[];
    applyCharacterRules?(token: Token, ctx: DistortionContext): string | null;
    getPluralCategory?(count: number): string;
    formatCount?(count: number, forms: Record<string, string>): string;
    lemmatize?(word: string, ctx: DistortionContext): Lemma[];
    inflect?(word: string, target: InflectionTarget, ctx: DistortionContext): string | null;
    declineNoun?(noun: NounInput, target: DeclensionTarget, ctx: DistortionContext): string | null;
    declineName?(person: PersonInput, targetCase: string, ctx: DistortionContext): PersonInput | null;
}
export interface Operation {
    type: "replace-token";
    tokenIndex: number;
    from: string;
    to: string;
    reason: string;
    priority: number;
    order?: number;
}
export interface DistortionProfile {
    id: string;
    select(tokens: Token[], ctx: DistortionContext): Operation[];
}
export interface DistortionContext {
    seed: string;
    intensity: number;
    language: LanguageAdapter;
    profile: DistortionProfile;
    rng(): number;
    createRng(salt: string): () => number;
}
export interface DistortOptions {
    language: LanguageAdapter;
    profile: DistortionProfile;
    intensity?: number;
    seed?: string;
    debug?: boolean;
}
export interface DebugDistortionResult {
    text: string;
    seed: string;
    language: string;
    profile: string;
    operations: Operation[];
}
export type DictionaryData = Record<string, Replacement[]>;
export type DictionarySelection = "default" | "all" | "none" | readonly string[];
export interface LanguageResourceOptions {
    dictionaries?: DictionarySelection;
    dictionary?: DictionaryData;
    commonWords?: readonly string[] | false;
    characterRules?: readonly CharacterRule[] | false;
}
