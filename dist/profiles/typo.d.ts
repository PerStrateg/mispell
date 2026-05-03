import type { DistortionProfile } from "../core/types";
export interface TypoProfileOptions {
    dictionaryProbability?: number;
    characterRuleProbability?: number;
    minWordLength?: number;
}
export declare function typo(options?: TypoProfileOptions): DistortionProfile;
