import type { CalculatedBeaconPosition } from "./beacon";
import type { Position } from "./position";

/**
 * Base props that trigger components receive (framework-agnostic)
 */
export interface BaseTriggerProps {
  beaconId: string;
  position: Position;
  calculatedPosition: CalculatedBeaconPosition;
  isOpen: boolean;
  isDismissing: boolean;
  popoverId?: string;
}

/**
 * Base props that popover components receive (framework-agnostic)
 */
export interface BasePopoverProps {
  beaconId: string;
  position: Position;
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
