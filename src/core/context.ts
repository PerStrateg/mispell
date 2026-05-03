import { DEFAULT_SEED, createSeededRng } from "./rng";
import { clampIntensity } from "./textUtils";
import type { DistortOptions, DistortionContext } from "./types";

export function createContext(options: DistortOptions): DistortionContext {
  const seed = options.seed ?? DEFAULT_SEED;
  const language = options.language;
  const profile = options.profile;
  const baseSeed = `${seed}:${language.id}:${profile.id}`;

  return {
    seed,
    intensity: clampIntensity(options.intensity),
    language,
    profile,
    rng: createSeededRng(baseSeed),
    createRng: (salt: string) => createSeededRng(`${baseSeed}:${salt}`)
  };
}
