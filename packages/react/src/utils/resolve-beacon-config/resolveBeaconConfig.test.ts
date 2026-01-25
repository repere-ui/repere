import { AnchorPoint, type Beacon, PositioningStrategy } from "@repere/core";
import { describe, expect, it } from "vitest";
import type { RepereReactConfig } from "../../types";
import { resolveBeaconConfig } from "./resolveBeaconConfig";

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

describe("resolveBeaconConfig", () => {
  describe("anchorPoint resolution", () => {
    it("should use beacon trigger anchorPoint when provided", () => {
      const beacon = createBeacon({
        trigger: { anchorPoint: AnchorPoint.BottomLeft },
      });
      const config = createConfig({
        trigger: { anchorPoint: AnchorPoint.TopRight },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.anchorPoint).toBe(AnchorPoint.BottomLeft);
    });

    it("should fall back to config trigger anchorPoint", () => {
      const beacon = createBeacon();
      const config = createConfig({
        trigger: { anchorPoint: AnchorPoint.TopRight },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.anchorPoint).toBe(AnchorPoint.TopRight);
    });

    it("should use DEFAULT_ANCHOR_POINT when neither is provided", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const result = resolveBeaconConfig(beacon, config);

      expect(result.anchorPoint).toBe(AnchorPoint.TopRight);
    });
  });

  describe("zIndex resolution", () => {
    it("should use beacon trigger zIndex when provided", () => {
      const beacon = createBeacon({
        trigger: { zIndex: 5000 },
      });
      const config = createConfig({
        trigger: { zIndex: 1000 },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.zIndex).toBe(5000);
    });

    it("should fall back to config trigger zIndex", () => {
      const beacon = createBeacon();
      const config = createConfig({
        trigger: { zIndex: 1000 },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.zIndex).toBe(1000);
    });

    it("should default to 9999 when neither is provided", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const result = resolveBeaconConfig(beacon, config);

      expect(result.zIndex).toBe(9999);
    });
  });

  describe("offset resolution", () => {
    it("should use beacon trigger offset when provided", () => {
      const beacon = createBeacon({
        trigger: { offset: { x: 10, y: 20 } },
      });
      const config = createConfig();

      const result = resolveBeaconConfig(beacon, config);

      expect(result.offset).toEqual({ x: 10, y: 20 });
    });

    it("should be undefined when not provided", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const result = resolveBeaconConfig(beacon, config);

      expect(result.offset).toBeUndefined();
    });
  });

  describe("delay resolution", () => {
    it("should use beacon trigger delay when provided", () => {
      const beacon = createBeacon({
        trigger: { delay: 500 },
      });
      const config = createConfig({
        trigger: { delay: 100 },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.delay).toBe(500);
    });

    it("should fall back to config trigger delay", () => {
      const beacon = createBeacon();
      const config = createConfig({
        trigger: { delay: 100 },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.delay).toBe(100);
    });

    it("should use beacon delay of 0 over config delay", () => {
      const beacon = createBeacon({
        trigger: { delay: 0 },
      });
      const config = createConfig({
        trigger: { delay: 100 },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.delay).toBe(0);
    });
  });

  describe("positioningStrategy resolution", () => {
    it("should use beacon trigger positioningStrategy when provided", () => {
      const beacon = createBeacon({
        trigger: { positioningStrategy: PositioningStrategy.Fixed },
      });
      const config = createConfig({
        trigger: { positioningStrategy: PositioningStrategy.Absolute },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.positioningStrategy).toBe(PositioningStrategy.Fixed);
    });

    it("should fall back to config trigger positioningStrategy", () => {
      const beacon = createBeacon();
      const config = createConfig({
        trigger: { positioningStrategy: PositioningStrategy.Fixed },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.positioningStrategy).toBe(PositioningStrategy.Fixed);
    });
  });

  describe("popover config resolution", () => {
    it("should use beacon popover anchorPoint when provided", () => {
      const beacon = createBeacon({
        popover: { anchorPoint: AnchorPoint.BottomCenter },
      });
      const config = createConfig({
        popover: { anchorPoint: AnchorPoint.TopCenter },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.popoverAnchorPoint).toBe(AnchorPoint.BottomCenter);
    });

    it("should fall back to config popover anchorPoint", () => {
      const beacon = createBeacon();
      const config = createConfig({
        popover: { anchorPoint: AnchorPoint.TopCenter },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.popoverAnchorPoint).toBe(AnchorPoint.TopCenter);
    });

    it("should fall back to trigger anchorPoint when popover anchorPoint not set", () => {
      const beacon = createBeacon({
        trigger: { anchorPoint: AnchorPoint.LeftCenter },
      });
      const config = createConfig();

      const result = resolveBeaconConfig(beacon, config);

      expect(result.popoverAnchorPoint).toBe(AnchorPoint.LeftCenter);
    });

    it("should use beacon popover offset when provided", () => {
      const beacon = createBeacon({
        popover: { offset: { x: 5, y: 10 } },
      });
      const config = createConfig();

      const result = resolveBeaconConfig(beacon, config);

      expect(result.popoverOffset).toEqual({ x: 5, y: 10 });
    });

    it("should fall back to config popover offset", () => {
      const beacon = createBeacon();
      const config = createConfig({
        popover: { offset: { x: 15, y: 25 } },
      });

      const result = resolveBeaconConfig(beacon, config);

      expect(result.popoverOffset).toEqual({ x: 15, y: 25 });
    });

    it("should default popover offset to { x: 0, y: 0 }", () => {
      const beacon = createBeacon();
      const config = createConfig();

      const result = resolveBeaconConfig(beacon, config);

      expect(result.popoverOffset).toEqual({ x: 0, y: 0 });
    });
  });
});
