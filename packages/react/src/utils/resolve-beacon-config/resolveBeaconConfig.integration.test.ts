import {
  AnchorPoint,
  Animation,
  type Beacon,
  MemoryStore,
  PositioningStrategy,
} from "@repere/core";
import { describe, expect, it } from "vitest";
import type { RepereReactConfig } from "../../types";
import { resolveBeaconConfig } from "./resolveBeaconConfig";

const TrigerComponent = () => null;
const GameInfoBeacon = () => null;
const OverlayBeacon = () => null;
const CurrentSessionPricingBeacon = () => null;
const CurrentSessionStartSessionBeacon = () => null;

const realWorldConfig: RepereReactConfig = {
  store: new MemoryStore(),
  trigger: {
    delay: 500,
    component: TrigerComponent,
    positioningStrategy: PositioningStrategy.Absolute,
    animations: {
      onRender: Animation.SlideDown,
      onDismiss: Animation.Fade,
    },
  },
  popover: {
    animations: {
      onOpen: Animation.SlideDown,
      onClose: Animation.Fade,
    },
  },
  pages: [
    {
      id: "all-pages",
      path: "*",
      beacons: [
        {
          id: "game-selector",
          selector: "[data-onboarding='game-selector']",
          trigger: {
            anchorPoint: AnchorPoint.BottomCenter,
            offset: { y: 5 },
          },
          popover: {
            component: GameInfoBeacon,
            offset: { y: 10 },
          },
        },
        {
          id: "overlay-icon",
          selector: "[data-onboarding='overlay-icon']",
          trigger: {
            anchorPoint: AnchorPoint.BottomCenter,
          },
          popover: {
            component: OverlayBeacon,
            anchorPoint: AnchorPoint.BottomRight,
            offset: { y: 10 },
          },
        },
      ],
    },
    {
      id: "current-session-page",
      path: "/current-session",
      beacons: [
        {
          id: "stash-prices",
          selector: "[data-onboarding='current-session-pricing']",
          trigger: {
            anchorPoint: AnchorPoint.BottomCenter,
            offset: { y: 15 },
          },
          popover: {
            component: CurrentSessionPricingBeacon,
            anchorPoint: AnchorPoint.BottomRight,
            offset: { y: 10 },
          },
        },
        {
          id: "start-session",
          selector: "[data-onboarding='start-session']",
          trigger: {
            anchorPoint: AnchorPoint.LeftCenter,
            offset: { y: 0 },
          },
          popover: {
            component: CurrentSessionStartSessionBeacon,
            anchorPoint: AnchorPoint.BottomLeft,
            offset: { y: 10 },
          },
        },
      ],
    },
  ],
};

describe("resolveBeaconConfig with real-world config", () => {
  const allPagesBeacons = realWorldConfig.pages[0].beacons;
  const currentSessionBeacons = realWorldConfig.pages[1].beacons;

  describe("game-selector beacon", () => {
    const beacon = allPagesBeacons[0];

    it("should resolve trigger config with beacon overrides", () => {
      const result = resolveBeaconConfig(beacon, realWorldConfig);

      expect(result.anchorPoint).toBe(AnchorPoint.BottomCenter);
      expect(result.offset).toEqual({ y: 5 });
      expect(result.delay).toBe(500);
      expect(result.positioningStrategy).toBe(PositioningStrategy.Absolute);
      expect(result.zIndex).toBe(9999);
    });

    it("should resolve popover config inheriting trigger anchorPoint", () => {
      const result = resolveBeaconConfig(beacon, realWorldConfig);

      expect(result.popoverAnchorPoint).toBe(AnchorPoint.BottomCenter);
      expect(result.popoverOffset).toEqual({ y: 10 });
    });
  });

  describe("overlay-icon beacon", () => {
    const beacon = allPagesBeacons[1];

    it("should resolve with explicit popover anchorPoint", () => {
      const result = resolveBeaconConfig(beacon, realWorldConfig);

      expect(result.anchorPoint).toBe(AnchorPoint.BottomCenter);
      expect(result.popoverAnchorPoint).toBe(AnchorPoint.BottomRight);
      expect(result.popoverOffset).toEqual({ y: 10 });
    });

    it("should inherit delay from config", () => {
      const result = resolveBeaconConfig(beacon, realWorldConfig);

      expect(result.delay).toBe(500);
    });
  });

  describe("stash-prices beacon", () => {
    const beacon = currentSessionBeacons[0];

    it("should resolve with custom offset", () => {
      const result = resolveBeaconConfig(beacon, realWorldConfig);

      expect(result.anchorPoint).toBe(AnchorPoint.BottomCenter);
      expect(result.offset).toEqual({ y: 15 });
    });
  });

  describe("start-session beacon", () => {
    const beacon = currentSessionBeacons[1];

    it("should resolve with LeftCenter trigger and BottomLeft popover", () => {
      const result = resolveBeaconConfig(beacon, realWorldConfig);

      expect(result.anchorPoint).toBe(AnchorPoint.LeftCenter);
      expect(result.popoverAnchorPoint).toBe(AnchorPoint.BottomLeft);
      expect(result.offset).toEqual({ y: 0 });
    });
  });
});

describe("resolveBeaconConfig with all options enabled", () => {
  const fullConfig: RepereReactConfig = {
    store: new MemoryStore(),
    trigger: {
      anchorPoint: AnchorPoint.TopRight,
      offset: { x: 5, y: 5 },
      zIndex: 10000,
      delay: 250,
      positioningStrategy: PositioningStrategy.Fixed,
      animations: {
        onRender: { variant: Animation.Scale, duration: 400, delay: 100 },
        onDismiss: { variant: Animation.Shrink, duration: 200 },
      },
    },
    popover: {
      anchorPoint: AnchorPoint.BottomCenter,
      offset: { x: 0, y: 10 },
      animations: {
        onOpen: { variant: Animation.Grow, duration: 300 },
        onClose: { variant: Animation.Fade, duration: 150 },
      },
    },
    pages: [
      {
        id: "test-page",
        path: "/test",
        beacons: [
          {
            id: "beacon-uses-all-defaults",
            selector: "#default-beacon",
            popover: {},
          },
          {
            id: "beacon-overrides-trigger",
            selector: "#trigger-override",
            trigger: {
              anchorPoint: AnchorPoint.LeftCenter,
              offset: { x: -10, y: 0 },
              zIndex: 5000,
              delay: 0,
              positioningStrategy: PositioningStrategy.Absolute,
            },
            popover: {},
          },
          {
            id: "beacon-overrides-all",
            selector: "#full-override",
            trigger: {
              anchorPoint: AnchorPoint.RightCenter,
              offset: { x: 20, y: 20 },
              zIndex: 15000,
              delay: 1000,
              positioningStrategy: PositioningStrategy.Fixed,
            },
            popover: {
              anchorPoint: AnchorPoint.TopLeft,
              offset: { x: -5, y: -15 },
            },
          },
        ],
      },
    ],
  };

  describe("beacon-uses-all-defaults", () => {
    const beacon = fullConfig.pages[0].beacons[0];

    it("should inherit all trigger config from root", () => {
      const result = resolveBeaconConfig(beacon, fullConfig);

      expect(result.anchorPoint).toBe(AnchorPoint.TopRight);
      expect(result.zIndex).toBe(10000);
      expect(result.delay).toBe(250);
      expect(result.positioningStrategy).toBe(PositioningStrategy.Fixed);
    });

    it("should inherit all popover config from root", () => {
      const result = resolveBeaconConfig(beacon, fullConfig);

      expect(result.popoverAnchorPoint).toBe(AnchorPoint.BottomCenter);
      expect(result.popoverOffset).toEqual({ x: 0, y: 10 });
    });

    it("should not have beacon-level offset (undefined)", () => {
      const result = resolveBeaconConfig(beacon, fullConfig);

      expect(result.offset).toBeUndefined();
    });
  });

  describe("beacon-overrides-trigger", () => {
    const beacon = fullConfig.pages[0].beacons[1];

    it("should override all trigger properties", () => {
      const result = resolveBeaconConfig(beacon, fullConfig);

      expect(result.anchorPoint).toBe(AnchorPoint.LeftCenter);
      expect(result.offset).toEqual({ x: -10, y: 0 });
      expect(result.zIndex).toBe(5000);
      expect(result.delay).toBe(0);
      expect(result.positioningStrategy).toBe(PositioningStrategy.Absolute);
    });

    it("should still inherit popover config from root", () => {
      const result = resolveBeaconConfig(beacon, fullConfig);

      expect(result.popoverAnchorPoint).toBe(AnchorPoint.BottomCenter);
      expect(result.popoverOffset).toEqual({ x: 0, y: 10 });
    });
  });

  describe("beacon-overrides-all", () => {
    const beacon = fullConfig.pages[0].beacons[2];

    it("should override all trigger properties", () => {
      const result = resolveBeaconConfig(beacon, fullConfig);

      expect(result.anchorPoint).toBe(AnchorPoint.RightCenter);
      expect(result.offset).toEqual({ x: 20, y: 20 });
      expect(result.zIndex).toBe(15000);
      expect(result.delay).toBe(1000);
      expect(result.positioningStrategy).toBe(PositioningStrategy.Fixed);
    });

    it("should override all popover properties", () => {
      const result = resolveBeaconConfig(beacon, fullConfig);

      expect(result.popoverAnchorPoint).toBe(AnchorPoint.TopLeft);
      expect(result.popoverOffset).toEqual({ x: -5, y: -15 });
    });
  });
});

describe("resolveBeaconConfig edge cases", () => {
  it("should handle minimal config with empty pages", () => {
    const minimalConfig: RepereReactConfig = {
      pages: [],
    };

    const beacon: Beacon = {
      id: "minimal-beacon",
      selector: "#minimal",
      popover: {},
    };

    const result = resolveBeaconConfig(beacon, minimalConfig);

    expect(result.anchorPoint).toBe(AnchorPoint.TopRight);
    expect(result.zIndex).toBe(9999);
    expect(result.delay).toBeUndefined();
    expect(result.positioningStrategy).toBeUndefined();
    expect(result.offset).toBeUndefined();
    expect(result.popoverAnchorPoint).toBe(AnchorPoint.TopRight);
    expect(result.popoverOffset).toEqual({ x: 0, y: 0 });
  });

  it("should handle beacon with only required fields", () => {
    const config: RepereReactConfig = {
      pages: [],
      trigger: {
        anchorPoint: AnchorPoint.BottomLeft,
      },
    };

    const beacon: Beacon = {
      id: "required-only",
      selector: "#required",
      popover: {},
    };

    const result = resolveBeaconConfig(beacon, config);

    expect(result.anchorPoint).toBe(AnchorPoint.BottomLeft);
    expect(result.popoverAnchorPoint).toBe(AnchorPoint.BottomLeft);
  });

  it("should handle partial offset in beacon", () => {
    const config: RepereReactConfig = {
      pages: [],
    };

    const beacon: Beacon = {
      id: "partial-offset",
      selector: "#partial",
      trigger: {
        offset: { x: 10 },
      },
      popover: {
        offset: { y: 20 },
      },
    };

    const result = resolveBeaconConfig(beacon, config);

    expect(result.offset).toEqual({ x: 10 });
    expect(result.popoverOffset).toEqual({ y: 20 });
  });
});
