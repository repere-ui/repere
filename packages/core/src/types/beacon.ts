import type { AnchorPoint } from "./anchors";
import type { PopoverAnimations, TriggerAnimations } from "./animations";

export interface Offset {
  x?: number;
  y?: number;
}

/**
 * Positioning strategy for the beacon.
 * - 'fixed': Position fixed to viewport with tracking (for dynamic content - scrolling, resizing, avoiding overflow boundaries)
 * - 'absolute': Attach directly to element (better performance, for static content)
 * @default 'absolute'
 */
export enum PositioningStrategy {
  Fixed = "fixed",
  Absolute = "absolute",
}

export interface TriggerConfig<TNode = unknown> {
  anchorPoint?: AnchorPoint;
  offset?: Offset;
  zIndex?: number;
  animations?: TriggerAnimations;
  component?: TNode;
  /**
   * Delay in milliseconds before calculating the beacon anchor point.
   * Useful when the target element has entrance animations that affect its position.
   * @default 0
   */
  delay?: number;
  positioningStrategy?: PositioningStrategy;
}

export interface PopoverConfig<TNode = unknown> {
  anchorPoint?: AnchorPoint;
  offset?: Offset;
  animations?: PopoverAnimations;
  component?: TNode;
}

export interface Beacon<TNode = unknown> {
  id: string;
  selector: string;

  trigger?: TriggerConfig<TNode>;
  popover: PopoverConfig<TNode>;
}

export interface CalculatedBeaconAnchorPoint {
  top: number;
  left: number;
  translate: {
    x: string;
    y: string;
  };
  position: "fixed" | "absolute";
  zIndex: number;
}
