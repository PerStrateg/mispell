import type { LanguageAdapter, LanguageResourceOptions } from "../../core/types";
import { type RussianPluralAdapter } from "./plural";
export interface RuLanguageOptions extends LanguageResourceOptions {
    nlp?: unknown;
    morphology?: unknown;
    plural?: RussianPluralAdapter;
    nouns?: unknown;
    names?: unknown;
}
export declare function ru(options?: RuLanguageOptions): LanguageAdapter;
