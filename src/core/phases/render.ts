import type { Token } from "../types";

export function render(tokens: readonly Token[]): string {
  return tokens.map((token) => token.raw).join("");
}
