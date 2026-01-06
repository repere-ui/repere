export { DEFAULT_ANCHOR_POINT } from "./constants/beacon";

export { MemoryStore } from "./store/memory-store";
export { AnchorPoint } from "./types/anchors";
export { Animation, type ResolvedAnimationConfig } from "./types/animations";
export type { BasePopoverProps, BaseTriggerProps } from "./types/base";
export {
  type Beacon,
  type CalculatedBeaconAnchorPoint,
  type Offset,
  type PopoverConfig,
  PositioningStrategy,
  type TriggerConfig,
} from "./types/beacon";
export type { Page, RepereConfig } from "./types/config";
export type { BeaconState, BeaconStore } from "./types/store";
export { AnchorPointTracker } from "./utils/AnchorPointTracker";
export {
  calculateDismissDuration,
  combineTranslateWithAnimation,
  getAnimationConfig,
  getPopoverAnimationStyles,
  mergeAnimationConfigs,
  waitForAnimations,
} from "./utils/animations";
export { BeaconManager } from "./utils/BeaconManager";

import "./styles.css";
