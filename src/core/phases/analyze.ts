import { defaultComplexity } from "../textUtils";
import type { DistortionContext, Token } from "../types";

export function analyze(tokens: Token[], ctx: DistortionContext): Token[] {
  const analyzed = tokens.map((token) => {
    if (token.type !== "word") {
      return {
        ...token,
        analysis: {
          ...token.analysis,
          language: ctx.language.id,
          commonRank: null,
          complexity: 0
        }
      };
    }

    const commonRank = ctx.language.getCommonRank?.(token.value, ctx) ?? null;
    const analysisToken = {
      ...token,
      analysis: {
        ...token.analysis,
        language: ctx.language.id,
        commonRank,
        complexity: defaultComplexity(token, commonRank)
      }
    };

    return {
      ...analysisToken,
      analysis: {
        ...analysisToken.analysis,
        complexity: ctx.language.getComplexity?.(analysisToken, ctx) ?? analysisToken.analysis.complexity
      }
    };
  });

  return ctx.language.analyze?.(analyzed, ctx) ?? analyzed;
}
