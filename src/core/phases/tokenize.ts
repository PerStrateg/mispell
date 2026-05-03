import type { DistortionContext, Token } from "../types";

export function tokenize(text: string, ctx: DistortionContext): Token[] {
  return ctx.language.tokenize(text, ctx);
}
