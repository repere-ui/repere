// packages/core/src/index.ts

// Types
export type { Position } from "./types/position";
export type {
  AnimationVariant,
  AnimationConfig,
  TriggerAnimations,
  PopoverAnimations,
  DefaultAnimations,
  BeaconAnimations,
} from "./types/animations";
export type { BeaconState, BeaconStore } from "./types/store";
export type {
  Beacon,
  BeaconOffset,
  CalculatedBeaconPosition,
} from "./types/beacon";
export type { Page, ErrorHandling, RepereConfig } from "./types/config";

// Positioning utilities
export {
  calculateBeaconPosition,
  isElementInViewport,
  type PositionCoordinates,
  type PositionOffset,
} from "./utils/positioning";

// Path matching utilities
export { matchPath, normalizePath } from "./utils/path-matching";

// Animation utilities
export { ANIMATION_VARIANTS, getPulseConfig } from "./constants/animations";
export {
  getAnimationConfig,
  mergeAnimationConfigs,
  normalizeAnimationConfig,
} from "./utils/animations";

// Constants
export { DEFAULT_POSITION, DEFAULT_Z_INDEX } from "./constants/beacon";

// Store
export { MemoryStore } from "./store/memory-store";
