import type { AnimationVariant } from "../types";

export type AnimationProps = {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  exit: Record<string, number | string>;
};

export const ANIMATION_VARIANTS: Record<AnimationVariant, AnimationProps> = {
  "slide-down": {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  "slide-up": {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  "slide-left": {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },
  "slide-right": {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  "fade-in": {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "fade-out": {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 1 },
  },
  shrink: {
    initial: { scale: 1.1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  grow: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0 },
  },
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

/**
 * Get animation config with defaults
 */
export function getAnimationConfig(
  animation: AnimationVariant = "fade-in",
  customConfig?: {
    duration?: number;
    delay?: number;
    ease?: string;
  },
): {
  variants: AnimationProps;
  transition: any;
} {
  const variant = ANIMATION_VARIANTS[animation];

  return {
    variants: variant,
    transition: {
      duration: (customConfig?.duration || 300) / 1000, // Convert to seconds
      delay: (customConfig?.delay || 0) / 1000,
      ease: customConfig?.ease || [0.4, 0, 0.2, 1], // Use array for cubic-bezier
    },
  };
}

/**
 * Pulse animation keyframes (for CSS or motion libraries)
 */
export const PULSE_ANIMATION = {
  scale: [1, 1.2, 1],
  opacity: [0.6, 0.8, 0.6],
};

/**
 * Get pulse animation config
 */
export function getPulseConfig(
  duration: number = 2000,
  delay: number = 0,
): {
  scale: number[];
  opacity: number[];
  transition: any;
} {
  return {
    ...PULSE_ANIMATION,
    transition: {
      duration: duration / 1000,
      delay: delay / 1000,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1],
    },
  };
}
