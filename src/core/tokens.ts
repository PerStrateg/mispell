import { detectCasing } from "./textUtils";
import type { DistortionContext, Token, TokenType } from "./types";

const TOKEN_RE =
  /\r\n|\n|\r|[^\S\r\n]+|[\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*|[\p{N}]+(?:[.,][\p{N}]+)*|[\p{P}]|[\p{S}]|./gu;

export function defaultTokenize(text: string, _ctx: DistortionContext): Token[] {
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    const raw = match[0];
    tokens.push({
      type: classifyToken(raw),
      raw,
      value: raw,
      casing: detectCasing(raw),
      index: tokens.length
    });
  }

  return tokens;
}

function classifyToken(raw: string): TokenType {
  if (/^\r\n$|^\n$|^\r$/u.test(raw)) {
    return "newline";
  }

  if (/^[^\S\r\n]+$/u.test(raw)) {
    return "space";
  }

  if (/^[\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*$/u.test(raw)) {
    return "word";
  }

  if (/^[\p{N}]+(?:[.,][\p{N}]+)*$/u.test(raw)) {
    return "number";
  }

  if (/^\p{P}$/u.test(raw)) {
    return "punctuation";
  }

  if (/^\p{S}$/u.test(raw)) {
    return "symbol";
  }

  return "unknown";
}
