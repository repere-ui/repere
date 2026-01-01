// Constants
export { DEFAULT_POSITION } from "./constants/beacon";

// Store
export { MemoryStore } from "./store/memory-store";
export { Animation, type ResolvedAnimationConfig } from "./types/animations";
// Types - Public API
export type { BasePopoverProps, BaseTriggerProps } from "./types/base";
export type {
  Beacon,
  CalculatedBeaconPosition,
  Offset,
  PopoverConfig,
  TriggerConfig,
} from "./types/beacon";
export type { Page, RepereConfig } from "./types/config";
export { Position } from "./types/position";
export type { BeaconStore } from "./types/store";

// Animation utilities - Public API
export {
  calculateDismissDuration,
  combineTranslateWithAnimation,
  getAnimationConfig,
  getPopoverAnimationStyles,
  mergeAnimationConfigs,
  waitForAnimations,
} from "./utils/animations";

// Lifecycle utilities
export { BeaconManager } from "./utils/BeaconManager";
export { PositionTracker } from "./utils/PositionTracker";

import "./styles.css";
