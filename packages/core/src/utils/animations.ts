import type { AnimationVariant, AnimationConfig } from "../types/animations";
import { ANIMATION_VARIANTS } from "../constants/animations";

/**
 * Normalize animation input to full config
 */
export function normalizeAnimationConfig(
  input?: AnimationVariant | AnimationConfig,
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
