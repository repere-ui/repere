export type AnimationVariant =
  | "fade-in"
  | "fade-out"
  | "scale"
  | "grow"
  | "shrink"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "bounce"
  | "pulse"
  | "shake"
  | "none";

export interface AnimationConfig {
  variant: AnimationVariant;
  duration?: number;
  delay?: number;
  ease?: string | number[];
}

export interface TriggerAnimations {
  onRender?: AnimationVariant | AnimationConfig;
  onDismiss?: AnimationVariant | AnimationConfig;
}

export interface PopoverAnimations {
  onOpen?: AnimationVariant | AnimationConfig;
  onClose?: AnimationVariant | AnimationConfig;
}

export interface DefaultAnimations {
  trigger?: TriggerAnimations;
  popover?: PopoverAnimations;
}

export interface BeaconAnimations extends DefaultAnimations {}
