import type { DistortionProfile } from "../core/types";
export interface ScrambleProfileOptions {
    minWordLength?: number;
}
export declare function scramble(options?: ScrambleProfileOptions): DistortionProfile;
