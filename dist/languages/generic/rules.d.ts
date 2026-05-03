import type { CharacterRule, DistortionContext, Token } from "../../core/types";
export declare function applyGenericCharacterRules(token: Token, ctx: DistortionContext, rules?: readonly CharacterRule[]): string | null;
