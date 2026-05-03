import type { Operation, Token } from "../types";

export function apply(tokens: Token[], operations: readonly Operation[]): Token[] {
  if (operations.length === 0) {
    return tokens;
  }

  const winners = new Map<number, Operation>();

  for (const operation of operations) {
    const current = winners.get(operation.tokenIndex);

    if (!current || compareOperation(operation, current) < 0) {
      winners.set(operation.tokenIndex, operation);
    }
  }

  return tokens.map((token) => {
    const operation = winners.get(token.index);

    if (!operation) {
      return token;
    }

    return {
      ...token,
      raw: operation.to,
      value: operation.to
    };
  });
}

function compareOperation(a: Operation, b: Operation): number {
  if (a.priority !== b.priority) {
    return b.priority - a.priority;
  }

  return (a.order ?? 0) - (b.order ?? 0);
}
