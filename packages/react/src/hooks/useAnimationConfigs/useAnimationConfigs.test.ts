import { Animation, type Beacon } from "@repere/core";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RepereReactConfig } from "../../types";
import { useAnimationConfigs } from "./useAnimationConfigs";

const createBeacon = (overrides: Partial<Beacon> = {}): Beacon => ({
  id: "test-beacon",
  selector: "#test",
  popover: {},
  ...overrides,
});

const createConfig = (
  overrides: Partial<RepereReactConfig> = {},
): RepereReactConfig => ({
  pages: [],
  ...overrides,
});

describe("useAnimationConfigs", () => {
  describe("triggerAnimation", () => {
    it("should return null when no animations configured", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.triggerAnimation).toBeNull();
    });

    it("should use beacon trigger animation when provided", () => {
      const beacon = createBeacon({
        trigger: {
          animations: { onRender: Animation.Fade },
        },
      });
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.triggerAnimation).not.toBeNull();
      expect(result.current.triggerAnimation?.variants.initial).toHaveProperty(
        "opacity",
        0,
      );
    });

    it("should merge config and beacon animations", () => {
      const beacon = createBeacon({
        trigger: {
          animations: { onRender: { variant: Animation.Fade, duration: 500 } },
        },
      });
      const config = createConfig({
        trigger: {
          animations: {
            onRender: { variant: Animation.SlideUp, duration: 300 },
          },
        },
      });

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.triggerAnimation?.transition.duration).toBe(0.5);
    });
  });

  describe("triggerDismissAnimation", () => {
    it("should return null when no dismiss animation configured", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.triggerDismissAnimation).toBeNull();
    });

    it("should use beacon dismiss animation when provided", () => {
      const beacon = createBeacon({
        trigger: {
          animations: { onDismiss: Animation.Scale },
        },
      });
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.triggerDismissAnimation).not.toBeNull();
    });
  });

  describe("popoverOpenAnimation", () => {
    it("should return null when no open animation configured", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.popoverOpenAnimation).toBeNull();
    });

    it("should use beacon popover open animation when provided", () => {
      const beacon = createBeacon({
        popover: {
          animations: { onOpen: Animation.Grow },
        },
      });
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.popoverOpenAnimation).not.toBeNull();
    });
  });

  describe("popoverCloseAnimation", () => {
    it("should return null when no close animation configured", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.popoverCloseAnimation).toBeNull();
    });

    it("should use beacon popover close animation when provided", () => {
      const beacon = createBeacon({
        popover: {
          animations: { onClose: Animation.Shrink },
        },
      });
      const config = createConfig();

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.popoverCloseAnimation).not.toBeNull();
    });

    it("should fall back to config popover close animation", () => {
      const beacon = createBeacon();
      const config = createConfig({
        popover: {
          animations: { onClose: Animation.Fade },
        },
      });

      const { result } = renderHook(() => useAnimationConfigs(beacon, config));

      expect(result.current.popoverCloseAnimation).not.toBeNull();
      expect(
        result.current.popoverCloseAnimation?.variants.exit,
      ).toHaveProperty("opacity", 0);
    });
  });

  describe("memoization", () => {
    it("should return same references when inputs do not change", () => {
      const beacon = createBeacon({
        trigger: { animations: { onRender: Animation.Fade } },
      });
      const config = createConfig();

      const { result, rerender } = renderHook(() =>
        useAnimationConfigs(beacon, config),
      );

      const firstTriggerAnimation = result.current.triggerAnimation;

      rerender();

      expect(result.current.triggerAnimation).toBe(firstTriggerAnimation);
    });
  });
});
