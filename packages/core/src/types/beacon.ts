import type { BeaconAnimations } from "./animations";
import type { Position } from "./position";

export interface BeaconOffset {
  x?: number;
  y?: number;
}

export interface Beacon<TNode = unknown> {
  id: string;
  target: string;
  position?: Position;
  offset?: BeaconOffset;
  zIndex?: number;

  // Framework-specific component nodes
  triggerComponent?: TNode;
  popoverComponent?: TNode;

  // Animation overrides for this beacon
  animations?: BeaconAnimations;
}

export interface CalculatedBeaconPosition {
  top: number;
  left: number;
  transform: string;
  position: "fixed";
  zIndex: number;
}
