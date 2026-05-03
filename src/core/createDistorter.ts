import { distort } from "./distort";
import type { DebugDistortionResult, DistortOptions } from "./types";

export interface Distorter {
  text(text: string): string;
  text(text: string, options: Partial<DistortOptions> & { debug: true }): DebugDistortionResult;
  text(text: string, options?: Partial<DistortOptions>): string | DebugDistortionResult;
  word(word: string): string;
  word(word: string, options: Partial<DistortOptions> & { debug: true }): DebugDistortionResult;
  word(word: string, options?: Partial<DistortOptions>): string | DebugDistortionResult;
}

export function createDistorter(options: DistortOptions): Distorter {
  const run = (
    text: string,
    overrides: Partial<DistortOptions> = {}
  ): string | DebugDistortionResult =>
    distort(text, {
      ...options,
      ...overrides
    } as DistortOptions);

  return {
    text: run as Distorter["text"],
    word: run as Distorter["word"]
  };
}
