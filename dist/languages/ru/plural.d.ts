export interface RussianPluralAdapter {
    getPluralCategory?(count: number): string;
    formatCount?(count: number, forms: Record<string, string>): string;
}
export declare function createRussianPluralAdapter(plural?: RussianPluralAdapter): Required<RussianPluralAdapter>;
