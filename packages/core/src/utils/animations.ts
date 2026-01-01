import { ANIMATION_VARIANTS } from "../constants/animations";
import type {
  Animation,
  AnimationConfig,
  AnimationVariants,
  ResolvedAnimationConfig,
} from "../types/animations";

/**
 * Normalize animation input to full config
 */
export function normalizeAnimationConfig(
  input?: Animation | AnimationConfig | null,
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
  base?: Animation | AnimationConfig,
  override?: Animation | AnimationConfig,
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
  input?: Animation | AnimationConfig | null,
): ResolvedAnimationConfig | null {
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
  animationVariants: AnimationVariants,
): AnimationVariants {
  // Parse percentage from translate (e.g., "-50%" -> -50)
  const parsePercent = (val: string) => {
    const match = val.match(/(-?\d+)%/);
    return match ? parseFloat(match[1]) : 0;
  };

  const translateXPercent = parsePercent(translate.x);
  const translateYPercent = parsePercent(translate.y);

  const createTransform = (yOffset: number = 0) => {
    if (translateYPercent === 0 && yOffset === 0) {
      return `translate(${translateXPercent}%, 0)`;
    }

    if (yOffset === 0) {
      return `translate(${translateXPercent}%, ${translateYPercent}%)`;
    }

    // Need calc for combined percentage + pixel offset
    return `translate(${translateXPercent}%, calc(${translateYPercent}% + ${yOffset}px))`;
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

/**
 * Generate CSS custom properties for popover animations
 * These are used with transition-behavior: allow-discrete in CSS
 */
export function getPopoverAnimationStyles(
  openAnimation?: ResolvedAnimationConfig | null,
  closeAnimation?: ResolvedAnimationConfig | null,
): Record<string, string | number> {
  if (!openAnimation && !closeAnimation) return {};

  const openVariants = openAnimation?.variants;
  const openTransition = openAnimation?.transition;
  const closeVariants = closeAnimation?.variants;
  const closeTransition = closeAnimation?.transition;

  const ease = closeTransition?.ease ??
    openTransition?.ease ?? [0.4, 0, 0.2, 1];
  const timingFunction = Array.isArray(ease)
    ? `cubic-bezier(${ease.join(", ")})`
    : ease;

  return {
    // Initial state (when opening starts) - from onOpen animation
    "--repere-initial-opacity": openVariants?.initial.opacity ?? 0,
    "--repere-initial-x": `${openVariants?.initial.x ?? 0}px`,
    "--repere-initial-y": `${openVariants?.initial.y ?? 0}px`,
    "--repere-initial-scale": openVariants?.initial.scale ?? 1,
    // Animate state (fully open) - from onOpen animation
    "--repere-animate-opacity": openVariants?.animate.opacity ?? 1,
    "--repere-animate-x": `${openVariants?.animate.x ?? 0}px`,
    "--repere-animate-y": `${openVariants?.animate.y ?? 0}px`,
    "--repere-animate-scale": openVariants?.animate.scale ?? 1,
    // Exit state (when closing) - from onClose animation
    "--repere-exit-opacity": closeVariants?.exit.opacity ?? 0,
    "--repere-exit-x": `${closeVariants?.exit.x ?? 0}px`,
    "--repere-exit-y": `${closeVariants?.exit.y ?? 0}px`,
    "--repere-exit-scale": closeVariants?.exit.scale ?? 1,
    // Transition timing
    "--repere-transition-duration": `${closeTransition?.duration ?? openTransition?.duration ?? 0.3}s`,
    "--repere-transition-timing": timingFunction,
  };
}

/**
 * Calculate the total duration needed for dismiss animations
 * Returns the maximum of trigger and popover animation durations
 */
export function calculateDismissDuration(
  triggerDismissAnimation?: ResolvedAnimationConfig | null,
  popoverCloseAnimation?: ResolvedAnimationConfig | null,
): number {
  const triggerDuration = triggerDismissAnimation?.transition.duration ?? 0;
  const popoverDuration = popoverCloseAnimation?.transition.duration ?? 0;

  // Convert to milliseconds and return the maximum
  return Math.max(triggerDuration, popoverDuration) * 1000;
}

/**
 * Create a promise that resolves after the given animation duration
 */
export function waitForAnimations(durationMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
