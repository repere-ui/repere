import type {
  AnchorPoint,
  Beacon,
  Offset,
  PositioningStrategy,
} from "@repere/core";
import { DEFAULT_ANCHOR_POINT } from "@repere/core";
import type { RepereReactConfig } from "../types";

export function resolveBeaconConfig(beacon: Beacon, config: RepereReactConfig) {
  const anchorPoint: AnchorPoint =
    beacon.trigger?.anchorPoint ||
    config.trigger?.anchorPoint ||
    DEFAULT_ANCHOR_POINT;

  const zIndex = beacon.trigger?.zIndex || config.trigger?.zIndex || 9999;

  const offset: Offset | undefined = beacon.trigger?.offset;

  const delay = beacon.trigger?.delay ?? config.trigger?.delay;

  const positioningStrategy: PositioningStrategy | undefined =
    beacon.trigger?.positioningStrategy ?? config.trigger?.positioningStrategy;

  const popoverAnchorPoint =
    beacon.popover?.anchorPoint || config.popover?.anchorPoint || anchorPoint;

  const popoverOffset = beacon.popover?.offset ||
    config.popover?.offset || { x: 0, y: 0 };

  return {
    anchorPoint,
    zIndex,
    offset,
    delay,
    positioningStrategy,
    popoverAnchorPoint,
    popoverOffset,
  };
}
