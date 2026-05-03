import type { DebugDistortionResult, DistortOptions } from "./types";
export interface Distorter {
    text(text: string): string;
    text(text: string, options: Partial<DistortOptions> & {
        debug: true;
    }): DebugDistortionResult;
    text(text: string, options?: Partial<DistortOptions>): string | DebugDistortionResult;
    word(word: string): string;
    word(word: string, options: Partial<DistortOptions> & {
        debug: true;
    }): DebugDistortionResult;
    word(word: string, options?: Partial<DistortOptions>): string | DebugDistortionResult;
}
export declare function createDistorter(options: DistortOptions): Distorter;
