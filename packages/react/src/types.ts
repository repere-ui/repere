import type {
  BasePopoverProps,
  BaseTriggerProps,
  Beacon,
  CalculatedBeaconAnchorPoint,
  Page,
  RepereConfig,
} from "@repere/core";
import type { ComponentType, ReactElement, ReactNode } from "react";

// Popover state
export interface ToggleEvent extends Event {
  newState: "open" | "closed";
  oldState: "open" | "closed";
}

// React-specific component types
export type ReactComponent = ComponentType<unknown> | ReactElement;

// React-specific beacon/config types
export type ReactBeacon = Beacon<ReactComponent>;
export type ReactPage = Page<ReactComponent>;

// Main config type for Beacons component
export interface RepereReactConfig extends RepereConfig<ReactComponent> {
  pages: ReactPage[];
}

// Props that trigger components receive (extends base with React-specific)
export interface TriggerComponentProps extends BaseTriggerProps {
  beacon: ReactBeacon;
  style: CalculatedBeaconAnchorPoint;
  onClick: () => void;
  popoverTarget?: string;
}

// Props that popover components receive (extends base with React-specific)
export interface PopoverComponentProps extends BasePopoverProps {
  beacon: ReactBeacon;
  onDismiss: () => void;
  onClose: () => void;
}

// Type for trigger component - can be a component or JSX
export type TriggerComponent =
  | ComponentType<TriggerComponentProps>
  | ReactElement
  | (() => ReactNode);

// Type for popover component - can be a component or JSX
export type PopoverComponent =
  | ComponentType<PopoverComponentProps>
  | ReactElement
  | (() => ReactNode);

// Extend React types to include Popover API attributes
import "react";

declare module "react" {
  // biome-ignore lint: T is required to match React's interface signature
  interface HTMLAttributes<T> {
    popover?: "auto" | "manual" | "hint" | "";
    popovertarget?: string;
    popovertargetaction?: "show" | "hide" | "toggle";
  }

  // biome-ignore lint: T is required to match React's interface signature
  interface ButtonHTMLAttributes<T> {
    popover?: "auto" | "manual" | "hint" | "";
    popovertarget?: string;
    popovertargetaction?: "show" | "hide" | "toggle";
  }
}
