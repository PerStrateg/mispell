import type { DebugDistortionResult, DistortOptions } from "./types";
export declare function distort(text: string, options: DistortOptions & {
    debug: true;
}): DebugDistortionResult;
export declare function distort(text: string, options: DistortOptions): string;
