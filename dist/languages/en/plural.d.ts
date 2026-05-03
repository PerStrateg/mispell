export interface EnglishPluralAdapter {
    getPluralCategory?(count: number): string;
    formatCount?(count: number, forms: Record<string, string>): string;
}
export declare function createEnglishPluralAdapter(plural?: EnglishPluralAdapter): Required<EnglishPluralAdapter>;
