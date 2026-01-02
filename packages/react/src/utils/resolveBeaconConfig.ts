import type { Beacon, Offset, Position } from "@repere/core";
import { DEFAULT_POSITION } from "@repere/core";
import type { RepereReactConfig } from "../types";

export function resolveBeaconConfig(beacon: Beacon, config: RepereReactConfig) {
  const position: Position =
    beacon.trigger?.position || config.trigger?.position || DEFAULT_POSITION;

  const zIndex = beacon.trigger?.zIndex || config.trigger?.zIndex || 9999;

  const offset: Offset | undefined = beacon.trigger?.offset;

  const popoverPosition =
    beacon.popover?.position || config.popover?.position || position;

  const popoverOffset = beacon.popover?.offset ||
    config.popover?.offset || { x: 0, y: 0 };

  return {
    position,
    zIndex,
    offset,
    popoverPosition,
    popoverOffset,
  };
}
