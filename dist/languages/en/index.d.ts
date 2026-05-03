import type { LanguageAdapter, LanguageResourceOptions } from "../../core/types";
import { type EnglishPluralAdapter } from "./plural";
export interface EnLanguageOptions extends LanguageResourceOptions {
    nlp?: unknown;
    morphology?: unknown;
    plural?: EnglishPluralAdapter;
}
export declare function en(options?: EnLanguageOptions): LanguageAdapter;
