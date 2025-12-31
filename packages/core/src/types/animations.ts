export enum Animation {
  Fade = "fade",
  Scale = "scale",
  Grow = "grow",
  Shrink = "shrink",
  SlideUp = "slide-up",
  SlideDown = "slide-down",
  SlideLeft = "slide-left",
  SlideRight = "slide-right",
  None = "none",
}

export interface AnimationConfig {
  variant: Animation;
  duration?: number;
  delay?: number;
  ease?: string | number[];
}

export interface AnimationVariants {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  exit: Record<string, number | string>;
}

export interface AnimationTransition {
  duration: number;
  delay: number;
  ease: string | number[];
}

export interface ResolvedAnimationConfig {
  variants: AnimationVariants;
  transition: AnimationTransition;
}

export interface TriggerAnimations {
  onRender?: Animation | AnimationConfig;
  onDismiss?: Animation | AnimationConfig;
}

export interface PopoverAnimations {
  onOpen?: Animation | AnimationConfig;
  onClose?: Animation | AnimationConfig;
}
