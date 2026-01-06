import type { AnchorPoint } from "./anchors";
import type { CalculatedBeaconAnchorPoint } from "./beacon";

/**
 * Base props that trigger components receive (framework-agnostic)
 */
export interface BaseTriggerProps {
  beaconId: string;
  anchorPoint: AnchorPoint;
  calculatedAnchor: CalculatedBeaconAnchorPoint;
  isOpen: boolean;
  isDismissing: boolean;
  popoverId?: string;
}

/**
 * Base props that popover components receive (framework-agnostic)
 */
export interface BasePopoverProps {
  beaconId: string;
  anchorPoint: AnchorPoint;
  isOpen: boolean;
  isDismissing?: boolean;
  popoverId?: string;
}

/**
 * Actions available to components
 */
export interface BeaconActions {
  toggle: () => void;
  open: () => void;
  close: () => void;
  dismiss: () => void;
}
