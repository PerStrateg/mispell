import { createContext } from "./context";
import { analyze } from "./phases/analyze";
import { apply } from "./phases/apply";
import { normalize } from "./phases/normalize";
import { render } from "./phases/render";
import { select } from "./phases/select";
import { tokenize } from "./phases/tokenize";
import type { DebugDistortionResult, DistortOptions } from "./types";

export function distort(
  text: string,
  options: DistortOptions & { debug: true }
): DebugDistortionResult;
export function distort(text: string, options: DistortOptions): string;
export function distort(
  text: string,
  options: DistortOptions
): string | DebugDistortionResult {
  const ctx = createContext(options);
  const normalized = normalize(text, ctx);
  const tokenized = tokenize(normalized, ctx);
  const analyzed = analyze(tokenized, ctx);
  const operations = select(analyzed, ctx);
  const applied = apply(analyzed, operations);
  const output = render(applied);

  if (options.debug) {
    return {
      text: output,
      seed: ctx.seed,
      language: ctx.language.id,
      profile: ctx.profile.id,
      operations
    };
  }

  return output;
}
