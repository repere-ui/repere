import type { PopoverAnimations, TriggerAnimations } from "./animations";
import type { Position } from "./position";

export interface Offset {
  x?: number;
  y?: number;
}

export interface TriggerConfig<TNode = unknown> {
  position?: Position;
  offset?: Offset;
  zIndex?: number;
  animations?: TriggerAnimations;
  component?: TNode;
  /**
   * Delay in milliseconds before calculating the beacon position.
   * Useful when the target element has entrance animations that affect its position.
   * @default 0
   */
  delay?: number;
}

export interface PopoverConfig<TNode = unknown> {
  position?: Position;
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

export interface CalculatedBeaconPosition {
  top: number;
  left: number;
  translate: {
    x: string;
    y: string;
  };
  position: "fixed";
  zIndex: number;
}
