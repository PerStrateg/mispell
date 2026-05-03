import type { DistortionContext } from "../types";

export function normalize(text: string, ctx: DistortionContext): string {
  const normalized = text
    .normalize("NFC")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');

  return ctx.language.normalize?.(normalized, ctx) ?? normalized;
}
