import type { DistortionContext, Operation, Token } from "../types";

export function select(tokens: Token[], ctx: DistortionContext): Operation[] {
  if (ctx.intensity <= 0) {
    return [];
  }

  return ctx.profile.select(tokens, ctx).map((operation, index) => ({
    ...operation,
    order: operation.order ?? index
  }));
}
