import { ANIMATION_VARIANTS } from "../constants/animations";
import type { AnimationConfig, AnimationVariant } from "../types/animations";

/**
 * Normalize animation input to full config
 */
export function normalizeAnimationConfig(
  input?: AnimationVariant | AnimationConfig | null,
): AnimationConfig | null {
  if (!input) return null;

  if (typeof input === "string") {
    return { variant: input };
  }

  return input;
}

/**
 * Merge two animation configs, with override taking precedence
 */
export function mergeAnimationConfigs(
  base?: AnimationVariant | AnimationConfig,
  override?: AnimationVariant | AnimationConfig,
): AnimationConfig | null {
  const baseConfig = normalizeAnimationConfig(base);
  const overrideConfig = normalizeAnimationConfig(override);

  if (!baseConfig && !overrideConfig) return null;
  if (!baseConfig) return overrideConfig;
  if (!overrideConfig) return baseConfig;

  return {
    variant: overrideConfig.variant ?? baseConfig.variant,
    duration: overrideConfig.duration ?? baseConfig.duration,
    delay: overrideConfig.delay ?? baseConfig.delay,
    ease: overrideConfig.ease ?? baseConfig.ease,
  };
}

/**
 * Get animation config ready for motion library (Framer Motion, etc.)
 */
export function getAnimationConfig(
  input?: AnimationVariant | AnimationConfig | null,
): {
  variants: {
    initial: Record<string, number | string>;
    animate: Record<string, number | string>;
    exit: Record<string, number | string>;
  };
  transition: {
    duration: number;
    delay: number;
    ease: string | number[];
  };
} | null {
  const config = normalizeAnimationConfig(input);

  if (!config) return null;

  const variant = ANIMATION_VARIANTS[config.variant];

  if (!variant) {
    console.warn(`[Repere] Unknown animation variant: ${config.variant}`);
    return null;
  }

  return {
    variants: variant,
    transition: {
      duration: (config.duration || 300) / 1000, // Convert ms to seconds
      delay: (config.delay || 0) / 1000,
      ease: config.ease || [0.4, 0, 0.2, 1], // cubic-bezier
    },
  };
}

/**
 * Combine positioning translate with animation variants
 * This merges the static positioning offset (e.g., "-50%, 0") with
 * animation offsets (e.g., y: -20px for slide-down)
 */
export function combineTranslateWithAnimation(
  translate: { x: string; y: string },
  animationVariants: {
    initial: Record<string, number | string>;
    animate: Record<string, number | string>;
    exit: Record<string, number | string>;
  },
): {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  exit: Record<string, number | string>;
} {
  // Parse percentage from translate (e.g., "-50%" -> -50)
  const parsePercent = (val: string) => {
    const match = val.match(/(-?\d+)%/);
    return match ? parseFloat(match[1]) : 0;
  };

  const translateXPercent = parsePercent(translate.x);
  const translateYPercent = parsePercent(translate.y);

  // Helper to create transform string
  const createTransform = (yOffset: number = 0) => {
    if (translateYPercent === 0 && yOffset === 0) {
      // Simple case: only x offset
      return `translate(${translateXPercent}%, 0)`;
    } else if (yOffset === 0) {
      // Only percentage offset
      return `translate(${translateXPercent}%, ${translateYPercent}%)`;
    } else {
      // Need calc for combined percentage + pixel offset
      return `translate(${translateXPercent}%, calc(${translateYPercent}% + ${yOffset}px))`;
    }
  };

  return {
    initial: {
      ...animationVariants.initial,
      transform: createTransform((animationVariants.initial.y as number) || 0),
    },
    animate: {
      ...animationVariants.animate,
      transform: createTransform((animationVariants.animate.y as number) || 0),
    },
    exit: {
      ...animationVariants.exit,
      transform: createTransform((animationVariants.exit.y as number) || 0),
    },
  };
}
