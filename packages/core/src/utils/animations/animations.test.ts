import { describe, expect, it, vi } from "vitest";
import { Animation } from "../../types/animations";
import {
  calculateDismissDuration,
  combineTranslateWithAnimation,
  getAnimationConfig,
  getPopoverAnimationStyles,
  mergeAnimationConfigs,
  normalizeAnimationConfig,
  waitForAnimations,
} from "./animations";

describe("normalizeAnimationConfig", () => {
  it("should return null for null input", () => {
    expect(normalizeAnimationConfig(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(normalizeAnimationConfig(undefined)).toBeNull();
  });

  it("should convert string animation to config object", () => {
    expect(normalizeAnimationConfig(Animation.Fade)).toEqual({
      variant: Animation.Fade,
    });
  });

  it("should return config object as-is", () => {
    const config = {
      variant: Animation.SlideUp,
      duration: 500,
      delay: 100,
    };
    expect(normalizeAnimationConfig(config)).toEqual(config);
  });
});

describe("mergeAnimationConfigs", () => {
  it("should return null when both inputs are undefined", () => {
    expect(mergeAnimationConfigs(undefined, undefined)).toBeNull();
  });

  it("should return base config when override is undefined", () => {
    expect(mergeAnimationConfigs(Animation.Fade, undefined)).toEqual({
      variant: Animation.Fade,
    });
  });

  it("should return override config when base is undefined", () => {
    expect(mergeAnimationConfigs(undefined, Animation.SlideUp)).toEqual({
      variant: Animation.SlideUp,
    });
  });

  it("should merge configs with override taking precedence", () => {
    const base = {
      variant: Animation.Fade,
      duration: 300,
      delay: 100,
    };
    const override = {
      variant: Animation.SlideUp,
      duration: 500,
    };
    expect(mergeAnimationConfigs(base, override)).toEqual({
      variant: Animation.SlideUp,
      duration: 500,
      delay: 100,
    });
  });

  it("should preserve base values when override has undefined properties", () => {
    const base = {
      variant: Animation.Fade,
      duration: 300,
      ease: [0.4, 0, 0.2, 1],
    };
    const override = {
      variant: Animation.SlideDown,
    };
    expect(mergeAnimationConfigs(base, override)).toEqual({
      variant: Animation.SlideDown,
      duration: 300,
      ease: [0.4, 0, 0.2, 1],
    });
  });
});

describe("getAnimationConfig", () => {
  it("should return null for null input", () => {
    expect(getAnimationConfig(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(getAnimationConfig(undefined)).toBeNull();
  });

  it("should return config with variants and transition for valid animation", () => {
    const result = getAnimationConfig(Animation.Fade);
    expect(result).toHaveProperty("variants");
    expect(result).toHaveProperty("transition");
    expect(result?.variants).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    });
  });

  it("should convert duration from ms to seconds", () => {
    const result = getAnimationConfig({
      variant: Animation.Fade,
      duration: 500,
    });
    expect(result?.transition.duration).toBe(0.5);
  });

  it("should convert delay from ms to seconds", () => {
    const result = getAnimationConfig({
      variant: Animation.Fade,
      delay: 200,
    });
    expect(result?.transition.delay).toBe(0.2);
  });

  it("should use default duration of 300ms (0.3s)", () => {
    const result = getAnimationConfig(Animation.Fade);
    expect(result?.transition.duration).toBe(0.3);
  });

  it("should use default delay of 0", () => {
    const result = getAnimationConfig(Animation.Fade);
    expect(result?.transition.delay).toBe(0);
  });

  it("should use default ease curve", () => {
    const result = getAnimationConfig(Animation.Fade);
    expect(result?.transition.ease).toEqual([0.4, 0, 0.2, 1]);
  });

  it("should use custom ease curve when provided", () => {
    const customEase = [0.25, 0.1, 0.25, 1];
    const result = getAnimationConfig({
      variant: Animation.Fade,
      ease: customEase,
    });
    expect(result?.transition.ease).toEqual(customEase);
  });

  it("should warn and return null for unknown variant", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = getAnimationConfig({
      variant: "unknown" as Animation,
    });
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      "[Repere] Unknown animation variant: unknown",
    );
    warnSpy.mockRestore();
  });
});

describe("combineTranslateWithAnimation", () => {
  it("should combine translate with animation variants", () => {
    const translate = { x: "-50%", y: "0%" };
    const variants = {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -20, opacity: 0 },
    };

    const result = combineTranslateWithAnimation(translate, variants);

    expect(result.initial.transform).toBe("translate(-50%, calc(0% + -20px))");
    expect(result.animate.transform).toBe("translate(-50%, 0)");
    expect(result.exit.transform).toBe("translate(-50%, calc(0% + -20px))");
  });

  it("should handle zero translate percentages", () => {
    const translate = { x: "0%", y: "0%" };
    const variants = {
      initial: { y: 0, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 0, opacity: 0 },
    };

    const result = combineTranslateWithAnimation(translate, variants);

    expect(result.initial.transform).toBe("translate(0%, 0)");
    expect(result.animate.transform).toBe("translate(0%, 0)");
  });

  it("should handle negative translate percentages", () => {
    const translate = { x: "-100%", y: "-50%" };
    const variants = {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 20, opacity: 0 },
    };

    const result = combineTranslateWithAnimation(translate, variants);

    expect(result.initial.transform).toBe(
      "translate(-100%, calc(-50% + 20px))",
    );
    expect(result.animate.transform).toBe("translate(-100%, -50%)");
  });

  it("should preserve other animation properties", () => {
    const translate = { x: "0%", y: "0%" };
    const variants = {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    };

    const result = combineTranslateWithAnimation(translate, variants);

    expect(result.initial.opacity).toBe(0);
    expect(result.initial.scale).toBe(0.9);
    expect(result.animate.opacity).toBe(1);
    expect(result.animate.scale).toBe(1);
  });
});

describe("getPopoverAnimationStyles", () => {
  it("should return empty object when both configs are null", () => {
    expect(getPopoverAnimationStyles(null, null)).toEqual({});
  });

  it("should return CSS custom properties from open animation", () => {
    const openAnimation = {
      variants: {
        initial: { opacity: 0, x: 0, y: -20, scale: 0.9 },
        animate: { opacity: 1, x: 0, y: 0, scale: 1 },
        exit: { opacity: 0, x: 0, y: 20, scale: 0.9 },
      },
      transition: {
        duration: 0.3,
        delay: 0,
        ease: [0.4, 0, 0.2, 1] as number[],
      },
    };

    const result = getPopoverAnimationStyles(openAnimation, null);

    expect(result["--repere-initial-opacity"]).toBe(0);
    expect(result["--repere-initial-y"]).toBe("-20px");
    expect(result["--repere-animate-opacity"]).toBe(1);
    expect(result["--repere-animate-y"]).toBe("0px");
  });

  it("should use close animation for exit and transition values", () => {
    const closeAnimation = {
      variants: {
        initial: { opacity: 0, x: 0, y: 0, scale: 1 },
        animate: { opacity: 1, x: 0, y: 0, scale: 1 },
        exit: { opacity: 0, x: 0, y: 30, scale: 0.8 },
      },
      transition: {
        duration: 0.5,
        delay: 0.1,
        ease: [0.25, 0.1, 0.25, 1] as number[],
      },
    };

    const result = getPopoverAnimationStyles(null, closeAnimation);

    expect(result["--repere-exit-opacity"]).toBe(0);
    expect(result["--repere-exit-y"]).toBe("30px");
    expect(result["--repere-exit-scale"]).toBe(0.8);
    expect(result["--repere-transition-duration"]).toBe("0.5s");
    expect(result["--repere-transition-timing"]).toBe(
      "cubic-bezier(0.25, 0.1, 0.25, 1)",
    );
  });

  it("should handle string ease values", () => {
    const openAnimation = {
      variants: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      transition: {
        duration: 0.3,
        delay: 0,
        ease: "ease-in-out",
      },
    };

    const result = getPopoverAnimationStyles(openAnimation, null);

    expect(result["--repere-transition-timing"]).toBe("ease-in-out");
  });
});

describe("calculateDismissDuration", () => {
  it("should return 0 when both configs are null", () => {
    expect(calculateDismissDuration(null, null)).toBe(0);
  });

  it("should return trigger duration when popover is null", () => {
    const triggerConfig = {
      variants: {
        initial: {},
        animate: {},
        exit: {},
      },
      transition: { duration: 0.5, delay: 0, ease: [0.4, 0, 0.2, 1] },
    };
    expect(calculateDismissDuration(triggerConfig, null)).toBe(500);
  });

  it("should return popover duration when trigger is null", () => {
    const popoverConfig = {
      variants: {
        initial: {},
        animate: {},
        exit: {},
      },
      transition: { duration: 0.3, delay: 0, ease: [0.4, 0, 0.2, 1] },
    };
    expect(calculateDismissDuration(null, popoverConfig)).toBe(300);
  });

  it("should return maximum of both durations", () => {
    const triggerConfig = {
      variants: { initial: {}, animate: {}, exit: {} },
      transition: { duration: 0.5, delay: 0, ease: [0.4, 0, 0.2, 1] },
    };
    const popoverConfig = {
      variants: { initial: {}, animate: {}, exit: {} },
      transition: { duration: 0.3, delay: 0, ease: [0.4, 0, 0.2, 1] },
    };
    expect(calculateDismissDuration(triggerConfig, popoverConfig)).toBe(500);
  });
});

describe("waitForAnimations", () => {
  it("should resolve after specified duration", async () => {
    vi.useFakeTimers();
    const promise = waitForAnimations(100);
    vi.advanceTimersByTime(100);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("should not resolve before duration", async () => {
    vi.useFakeTimers();
    let resolved = false;
    waitForAnimations(100).then(() => {
      resolved = true;
    });
    vi.advanceTimersByTime(50);
    expect(resolved).toBe(false);
    vi.advanceTimersByTime(50);
    await Promise.resolve();
    expect(resolved).toBe(true);
    vi.useRealTimers();
  });
});
