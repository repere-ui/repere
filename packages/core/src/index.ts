// Animation utilities
export { ANIMATION_VARIANTS } from "./constants/animations";
// Constants
export { DEFAULT_POSITION, DEFAULT_Z_INDEX } from "./constants/beacon";
// Store
export { MemoryStore } from "./store/memory-store";
export {
  Animation,
  type AnimationConfig,
  type PopoverAnimations,
  type ResolvedAnimationConfig,
  type TriggerAnimations,
} from "./types/animations";
export type {
  BasePopoverProps,
  BaseTriggerProps,
  BeaconActions,
} from "./types/base";
export type {
  Beacon,
  CalculatedBeaconPosition,
  Offset,
  PopoverConfig,
  TriggerConfig,
} from "./types/beacon";
export type { ErrorHandling, Page, RepereConfig } from "./types/config";
// Types
export { Position } from "./types/position";
export type { BeaconState, BeaconStore } from "./types/store";
export {
  calculateDismissDuration,
  combineTranslateWithAnimation,
  getAnimationConfig,
  getPopoverAnimationStyles,
  mergeAnimationConfigs,
  normalizeAnimationConfig,
  waitForAnimations,
} from "./utils/animations";
export { BeaconManager } from "./utils/BeaconManager";
export { PositionTracker } from "./utils/PositionTracker";
// Path matching utilities
export { matchPath, normalizePath } from "./utils/path-matching";
// Positioning utilities
export {
  calculateBeaconPosition,
  type PositionCoordinates,
} from "./utils/positioning";
import "./styles.css";
